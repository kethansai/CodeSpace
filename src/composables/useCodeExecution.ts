import { ref } from "vue";
import { SUPPORTED_LANGUAGES, PISTON_URL, PISTON_ENABLED } from "@/config/app";

interface ExecutionResult {
  output: string;
  stderr: string;
  exitCode: number;
  signal: string | null;
  executionTime?: number;
}

// Browser JS sandbox
function executeBrowserJS(code: string, timeout = 10000): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox.add("allow-scripts");
    document.body.appendChild(iframe);
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        iframe.remove();
        resolve({ output: "", stderr: "Execution timed out (10s limit)", exitCode: 1, signal: "SIGTERM" });
      }
    }, timeout);
    function finish(data: { output: string; stderr: string; exitCode: number }) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { iframe.remove(); } catch { /* noop */ }
      resolve({ ...data, signal: null });
    }
    const handler = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.data?.__codespace) {
        globalThis.removeEventListener("message", handler);
        finish(event.data);
      }
    };
    globalThis.addEventListener("message", handler);
    const wrappedCode = `
      <script>
        (function() {
          const __output = [];
          const __errors = [];
          const fmt = (...a) => a.map(v => {
            if (v === null) return 'null';
            if (v === undefined) return 'undefined';
            if (typeof v === 'object') {
              try { return JSON.stringify(v, null, 2); } catch { return String(v); }
            }
            return String(v);
          }).join(' ');
          console.log = (...a) => __output.push(fmt(...a));
          console.warn = (...a) => __output.push('[warn] ' + fmt(...a));
          console.error = (...a) => __errors.push(fmt(...a));
          console.info = console.log;
          try {
            ${code}
            parent.postMessage({ __codespace: true, output: __output.join('\\n'), stderr: __errors.join('\\n'), exitCode: 0 }, '*');
          } catch(e) {
            parent.postMessage({ __codespace: true, output: __output.join('\\n'), stderr: (e.stack || e.message || String(e)), exitCode: 1 }, '*');
          }
        })();
      </` + `script>
    `;
    iframe.srcdoc = wrappedCode;
  });
}

function stripTypeAnnotations(code: string): string {
  let r = code;
  r = r.replaceAll(/import\s+type\s+[^\n]*\n?/g, "");
  r = r.replaceAll(/^\s*(?:export\s+)?(?:interface|type)\s+\w+[^\n]*\{[^}]*\}/gm, "");
  r = r.replaceAll(/:\s*(?:string|number|boolean|any|void)(?:\[\])?/g, "");
  r = r.replaceAll(/\s+as\s+\w+/g, "");
  return r;
}

// Pyodide (Python in WASM, no API key)
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
interface PyodideInterface {
  setStdout: (o: { batched: (s: string) => void }) => void;
  setStderr: (o: { batched: (s: string) => void }) => void;
  setStdin: (o: { stdin: () => string | null }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
}
let pyodideLoader: Promise<PyodideInterface> | null = null;
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}
function getPyodide(): Promise<PyodideInterface> {
  if (pyodideLoader) return pyodideLoader;
  pyodideLoader = (async () => {
    await loadScript(`${PYODIDE_URL}pyodide.js`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lp = (globalThis as any).loadPyodide as (o: { indexURL: string }) => Promise<PyodideInterface>;
    return await lp({ indexURL: PYODIDE_URL });
  })();
  return pyodideLoader;
}
async function executePython(code: string, stdin: string): Promise<ExecutionResult> {
  const start = performance.now();
  try {
    const py = await getPyodide();
    const out: string[] = [];
    const err: string[] = [];
    py.setStdout({ batched: (s: string) => out.push(s) });
    py.setStderr({ batched: (s: string) => err.push(s) });
    const lines = stdin ? stdin.split("\n") : [];
    let i = 0;
    py.setStdin({ stdin: () => (i >= lines.length ? null : lines[i++] ?? null) });
    await py.runPythonAsync(code);
    return { output: out.join("\n"), stderr: err.join("\n"), exitCode: 0, signal: null, executionTime: performance.now() - start };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { output: "", stderr: msg, exitCode: 1, signal: null, executionTime: performance.now() - start };
  }
}

// Piston (self-hosted remote runner). See src/config/app.ts for the env wiring.
const PISTON_DISABLED_HINT =
  "Remote code execution is disabled in this deployment.\n" +
  "This language needs a Piston instance. The public emkc.org endpoint became " +
  "whitelist-only on 2026-02-15, and Cloudflare Pages cannot reach localhost.\n" +
  "Deploy Piston somewhere publicly reachable (Fly.io, Railway, a small VPS):\n" +
  "  docker run -d -p 2000:2000 ghcr.io/engineer-man/piston\n" +
  "Then set VITE_PISTON_URL to its public HTTPS URL and redeploy.";
type PistonRuntime = { language: string; version: string; aliases: string[] };
let runtimesCache: PistonRuntime[] | null = null;
async function loadPistonRuntimes(): Promise<PistonRuntime[]> {
  if (runtimesCache) return runtimesCache;
  const res = await fetch(`${PISTON_URL}/runtimes`);
  if (!res.ok) throw new Error(`Piston runtimes fetch failed: ${res.status}`);
  runtimesCache = (await res.json()) as PistonRuntime[];
  return runtimesCache;
}
function resolvePistonVersion(rt: PistonRuntime[], lang: string): string | null {
  const m = rt.filter((r) => r.language === lang || r.aliases?.includes(lang));
  return m[0]?.version ?? null;
}
function filenameForPistonLang(lang: string, code: string): string {
  switch (lang) {
    case "java": {
      const m = code.match(/public\s+class\s+([A-Za-z_$][\w$]*)/);
      return `${m?.[1] ?? "Main"}.java`;
    }
    case "c++": return "main.cpp";
    case "c": return "main.c";
    case "csharp": return "Program.cs";
    case "go": return "main.go";
    case "rust": return "main.rs";
    case "kotlin": return "main.kt";
    case "swift": return "main.swift";
    case "php": return "main.php";
    case "ruby": return "main.rb";
    case "bash": return "main.sh";
    default: return "main.txt";
  }
}
async function executePiston(code: string, pistonLang: string, stdin: string): Promise<ExecutionResult> {
  const start = performance.now();
  try {
    const rt = await loadPistonRuntimes();
    const version = resolvePistonVersion(rt, pistonLang);
    if (!version) {
      return { output: "", stderr: `No Piston runtime for "${pistonLang}"`, exitCode: 1, signal: null };
    }
    const res = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: pistonLang,
        version,
        files: [{ name: filenameForPistonLang(pistonLang, code), content: code }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 10000,
      }),
    });
    if (!res.ok) {
      return { output: "", stderr: `Piston error (${res.status}): ${await res.text()}`, exitCode: 1, signal: null };
    }
    const data = (await res.json()) as {
      run?: { stdout: string; stderr: string; code: number; signal: string | null };
      compile?: { stdout: string; stderr: string; code: number };
      message?: string;
    };
    if (data.message) return { output: "", stderr: data.message, exitCode: 1, signal: null };
    const ce = data.compile?.stderr ?? "";
    const ro = data.run?.stdout ?? "";
    const re = data.run?.stderr ?? "";
    return {
      output: ro,
      stderr: [ce, re].filter(Boolean).join("\n"),
      exitCode: data.run?.code ?? (ce ? 1 : 0),
      signal: data.run?.signal ?? null,
      executionTime: performance.now() - start,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { output: "", stderr: `Piston request failed: ${msg}`, exitCode: 1, signal: null, executionTime: performance.now() - start };
  }
}

export function useCodeExecution() {
  const isExecuting = ref(false);
  const result = ref<ExecutionResult | null>(null);
  const error = ref<string | null>(null);
  const status = ref<string>("");

  async function execute(code: string, languageId: string, stdin = ""): Promise<ExecutionResult> {
    isExecuting.value = true;
    result.value = null;
    error.value = null;
    status.value = "";
    const cfg = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
    if (!cfg) {
      error.value = `Unsupported language: ${languageId}`;
      isExecuting.value = false;
      return { output: "", stderr: error.value, exitCode: 1, signal: null };
    }
    try {
      let r: ExecutionResult;
      const runtime = (cfg as { runtime?: string }).runtime ?? "browser";
      if (runtime === "browser") {
        const src = languageId === "typescript" ? stripTypeAnnotations(code) : code;
        status.value = "Running in browser sandbox...";
        r = await executeBrowserJS(src);
      } else if (runtime === "pyodide") {
        status.value = "Loading Python runtime (first run ~5s)...";
        r = await executePython(code, stdin);
      } else if (runtime === "piston") {
        if (!PISTON_ENABLED) {
          r = { output: "", stderr: PISTON_DISABLED_HINT, exitCode: 1, signal: null };
        } else {
          const pl = (cfg as { pistonLang?: string }).pistonLang;
          if (!pl) {
            r = { output: "", stderr: "Language not configured for remote execution", exitCode: 1, signal: null };
          } else {
            status.value = `Executing on Piston (${PISTON_URL})...`;
            r = await executePiston(code, pl, stdin);
          }
        }
      } else {
        r = { output: "", stderr: `Unknown runtime: ${runtime}`, exitCode: 1, signal: null };
      }
      result.value = r;
      return r;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      error.value = msg;
      const r: ExecutionResult = { output: "", stderr: msg, exitCode: 1, signal: null };
      result.value = r;
      return r;
    } finally {
      isExecuting.value = false;
      status.value = "";
    }
  }

  function reset() {
    result.value = null;
    error.value = null;
  }

  return { isExecuting, result, error, status, execute, reset };
}
