import { ref } from "vue";
import { SUPPORTED_LANGUAGES } from "@/config/app";

interface ExecutionResult {
  output: string;
  stderr: string;
  exitCode: number;
  signal: string | null;
  executionTime?: number;
}

/**
 * Execute JavaScript code safely in the browser using an iframe sandbox.
 * Captures console.log/warn/error output, handles errors, and enforces a timeout.
 */
function executeBrowserJS(
  code: string,
  timeout = 10000,
): Promise<ExecutionResult> {
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
        resolve({
          output: "",
          stderr: "Execution timed out (10s limit)",
          exitCode: 1,
          signal: "SIGTERM",
        });
      }
    }, timeout);

    function finish(data: {
      output: string;
      stderr: string;
      exitCode: number;
    }) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        iframe.remove();
      } catch {
        /* already removed */
      }
      resolve({ ...data, signal: null });
    }

    const handler = (event: MessageEvent) => {
      // Only accept messages from our iframe
      if (event.source !== iframe.contentWindow) return;
      if (event.data?.__codespace) {
        globalThis.removeEventListener("message", handler);
        finish(event.data);
      }
    };
    globalThis.addEventListener("message", handler);

    // Build a self-contained script that captures all console output
    const wrappedCode =
      `
      <script>
        (function() {
          const __output = [];
          const __errors = [];
          const origLog = console.log;
          const origWarn = console.warn;
          const origError = console.error;
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
      </` +
      `script>
    `;
    iframe.srcdoc = wrappedCode;
  });
}

/**
 * Execute TypeScript code in the browser by stripping type annotations.
 * This is a best-effort approach for simple TS code.
 */
function stripTypeAnnotations(code: string): string {
  // Simple best-effort TS -> JS: remove common type annotations
  let result = code;
  // Remove type imports
  result = result.replaceAll(/import\s+type\s+[^\n]*\n?/g, "");
  // Remove interface/type blocks (line-by-line approach)
  result = result.replaceAll(
    /^\s*(?:export\s+)?(?:interface|type)\s+\w+[^\n]*\{[^}]*\}/gm,
    "",
  );
  // Remove simple type annotations after colons: x: string -> x
  result = result.replaceAll(
    /:\s*(?:string|number|boolean|any|void)(?:\[\])?/g,
    "",
  );
  // Remove 'as Type' assertions
  result = result.replaceAll(/\s+as\s+\w+/g, "");
  return result;
}

export function useCodeExecution() {
  const isExecuting = ref(false);
  const result = ref<ExecutionResult | null>(null);
  const error = ref<string | null>(null);

  async function execute(
    code: string,
    languageId: string,
    stdin = "",
  ): Promise<ExecutionResult> {
    isExecuting.value = true;
    result.value = null;
    error.value = null;

    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
    if (!langConfig) {
      error.value = `Unsupported language: ${languageId}`;
      isExecuting.value = false;
      return { output: "", stderr: error.value, exitCode: 1, signal: null };
    }

    try {
      let execResult: ExecutionResult;

      // Execute in browser — JS directly, TS after stripping type annotations
      if (languageId === "typescript") {
        const jsCode = stripTypeAnnotations(code);
        execResult = await executeBrowserJS(jsCode);
      } else {
        execResult = await executeBrowserJS(code);
      }

      result.value = execResult;
      return execResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      error.value = message;
      const execResult: ExecutionResult = {
        output: "",
        stderr: message,
        exitCode: 1,
        signal: null,
      };
      result.value = execResult;
      return execResult;
    } finally {
      isExecuting.value = false;
    }
  }

  function reset() {
    result.value = null;
    error.value = null;
  }

  return { isExecuting, result, error, execute, reset };
}
