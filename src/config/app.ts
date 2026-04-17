export const APP_CONFIG = {
  name: "codespace",
  tagline: "Learn. Code. Crack Interviews.",
  description:
    "Master programming concepts, DSA with animated visualizations, solve coding problems with a built-in compiler, and prepare for tech interviews at top companies.",
  url: import.meta.env.VITE_APP_URL || "https://codespace.dev",
  github: "https://github.com/codespace-dev",
  social: {
    twitter: "https://twitter.com/codespace_dev",
    discord: "https://discord.gg/codespace",
  },
} as const;

export const SUPPORTED_LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "file-json", monacoId: "javascript", extension: ".js", runtime: "browser" },
  { id: "typescript", name: "TypeScript", icon: "file-type", monacoId: "typescript", extension: ".ts", runtime: "browser" },
  { id: "python", name: "Python", icon: "file-code", monacoId: "python", extension: ".py", runtime: "pyodide" },
  { id: "java", name: "Java", icon: "file-code", monacoId: "java", extension: ".java", runtime: "piston", pistonLang: "java" },
  { id: "cpp", name: "C++", icon: "file-code", monacoId: "cpp", extension: ".cpp", runtime: "piston", pistonLang: "c++" },
  { id: "c", name: "C", icon: "file-code", monacoId: "c", extension: ".c", runtime: "piston", pistonLang: "c" },
  { id: "csharp", name: "C#", icon: "file-code", monacoId: "csharp", extension: ".cs", runtime: "piston", pistonLang: "csharp" },
  { id: "go", name: "Go", icon: "file-code", monacoId: "go", extension: ".go", runtime: "piston", pistonLang: "go" },
  { id: "rust", name: "Rust", icon: "file-code", monacoId: "rust", extension: ".rs", runtime: "piston", pistonLang: "rust" },
  { id: "ruby", name: "Ruby", icon: "file-code", monacoId: "ruby", extension: ".rb", runtime: "piston", pistonLang: "ruby" },
  { id: "php", name: "PHP", icon: "file-code", monacoId: "php", extension: ".php", runtime: "piston", pistonLang: "php" },
  { id: "kotlin", name: "Kotlin", icon: "file-code", monacoId: "kotlin", extension: ".kt", runtime: "piston", pistonLang: "kotlin" },
  { id: "swift", name: "Swift", icon: "file-code", monacoId: "swift", extension: ".swift", runtime: "piston", pistonLang: "swift" },
  { id: "bash", name: "Bash", icon: "terminal", monacoId: "shell", extension: ".sh", runtime: "piston", pistonLang: "bash" },
] as const;

export type SupportedLanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

/**
 * Piston (remote runner) is opt-in: the public emkc.org endpoint became
 * whitelist-only on 2026-02-15, so anonymous requests are rejected. Languages
 * that need a server (Java, C/C++, Go, Rust, etc.) are only surfaced when
 * the deployer points `VITE_PISTON_URL` at their own Piston instance.
 *
 * Cloudflare Pages is static-only, so `localhost` is not reachable from a
 * deployed build — host Piston somewhere publicly reachable (Fly.io, Railway,
 * a small VPS) and set the URL at build time.
 */
export const PISTON_URL = (import.meta.env.VITE_PISTON_URL as string | undefined)?.replace(/\/$/, "") ?? "";
export const PISTON_ENABLED = PISTON_URL.length > 0;

export const AVAILABLE_LANGUAGES = SUPPORTED_LANGUAGES.filter(
  (l) => l.runtime !== "piston" || PISTON_ENABLED,
);

export const DIFFICULTY_COLORS = {
  easy: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
  },
  hard: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/20",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Home", to: "/", icon: "home" },
  { label: "Learning Paths", to: "/paths", icon: "route" },
  { label: "Languages", to: "/languages", icon: "code" },
  { label: "DSA", to: "/dsa", icon: "brain" },
  { label: "Problems", to: "/problems", icon: "puzzle" },
  { label: "Databases", to: "/databases", icon: "database" },
  { label: "System Design", to: "/system-design", icon: "server" },
  { label: "Interviews", to: "/interviews", icon: "building-2" },
  { label: "Methodology", to: "/methodology", icon: "kanban" },
  { label: "Playground", to: "/playground", icon: "play" },
] as const;
