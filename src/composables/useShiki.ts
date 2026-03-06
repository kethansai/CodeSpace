import { ref, shallowRef } from "vue";
import { createHighlighter, type Highlighter } from "shiki";

const highlighter = shallowRef<Highlighter | null>(null);
const isLoading = ref(false);
const isReady = ref(false);

const SUPPORTED_LANGS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "sql",
  "bash",
  "shell",
  "powershell",
  "dockerfile",
  "xml",
] as const;

async function ensureHighlighter() {
  if (highlighter.value) return highlighter.value;
  if (isLoading.value) {
    // Wait for ongoing initialization
    return new Promise<Highlighter>((resolve) => {
      const check = setInterval(() => {
        if (highlighter.value) {
          clearInterval(check);
          resolve(highlighter.value);
        }
      }, 50);
    });
  }

  isLoading.value = true;
  try {
    highlighter.value = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [...SUPPORTED_LANGS],
    });
    isReady.value = true;
    return highlighter.value;
  } finally {
    isLoading.value = false;
  }
}

function resolveLanguage(lang: string | undefined): string {
  if (!lang) return "text";
  const normalized = lang.toLowerCase().trim();
  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    rb: "ruby",
    sh: "bash",
    zsh: "bash",
    yml: "yaml",
    cs: "csharp",
    "c++": "cpp",
    "c#": "csharp",
    kt: "kotlin",
    rs: "rust",
    md: "markdown",
    ps1: "powershell",
    text: "text",
    plaintext: "text",
    txt: "text",
  };
  const resolved = aliases[normalized] || normalized;
  if (resolved === "text") return "text";
  const loaded = highlighter.value?.getLoadedLanguages() || [];
  return loaded.includes(resolved) ? resolved : "text";
}

export async function highlightCode(
  code: string,
  lang?: string,
): Promise<string> {
  const hl = await ensureHighlighter();
  const language = resolveLanguage(lang);
  if (language === "text") {
    // Return escaped HTML for unsupported languages
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class="shiki" style="background-color:transparent"><code>${escaped}</code></pre>`;
  }
  return hl.codeToHtml(code, {
    lang: language,
    themes: { dark: "github-dark", light: "github-light" },
    defaultColor: false,
  });
}

export function useShiki() {
  return {
    highlightCode,
    ensureHighlighter,
    isReady,
    isLoading,
  };
}
