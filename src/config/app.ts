export const APP_CONFIG = {
  name: "CodeSpace",
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
  {
    id: "javascript",
    name: "JavaScript",
    icon: "file-json",
    monacoId: "javascript",
    extension: ".js",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "file-type",
    monacoId: "typescript",
    extension: ".ts",
  },
] as const;

export type SupportedLanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

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
  { label: "Learning Paths", to: "/paths", icon: "route" },
  { label: "Languages", to: "/languages", icon: "code" },
  { label: "DSA", to: "/dsa", icon: "brain" },
  { label: "Problems", to: "/problems", icon: "puzzle" },
  { label: "Interviews", to: "/interviews", icon: "building-2" },
  { label: "System Design", to: "/system-design", icon: "server" },
  { label: "Methodology", to: "/methodology", icon: "kanban" },
  { label: "Playground", to: "/playground", icon: "play" },
] as const;
