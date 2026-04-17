<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import CodeEditor from "@/components/editor/CodeEditor.vue";
import CodeRunner from "@/components/editor/CodeRunner.vue";
import LanguageSelector from "@/components/editor/LanguageSelector.vue";
import Button from "@/components/ui/Button.vue";
import {
  RotateCcw,
  Terminal,
  Play,
  Loader2,
  Eraser,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-vue-next";

const selectedLanguage = ref("javascript");

const defaultCode: Record<string, string> = {
  javascript: `// Welcome to CodeSpace Playground!\n// Runs in a sandboxed iframe (no install needed).\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to CodeSpace.\`;\n}\n\nconsole.log(greet("Developer"));\nconsole.log("Happy coding! \u{1F680}");\n`,
  typescript: `// TypeScript runs in-browser (types stripped, then JS).\n\nfunction greet(name: string): string {\n  return \`Hello, \${name}! Welcome to CodeSpace.\`;\n}\n\nconsole.log(greet("Developer"));\n`,
  python: `# Python runs in-browser via Pyodide (CPython -> WASM).\n# First run downloads the runtime (~5s), then it's fast.\n\ndef greet(name: str) -> str:\n    return f"Hello, {name}! Welcome to CodeSpace."\n\nprint(greet("Developer"))\nprint("Happy coding! \u{1F680}")\n`,
  java: `// Java runs via Piston (free public API).\n\npublic class Main {\n    public static String greet(String name) {\n        return "Hello, " + name + "! Welcome to CodeSpace.";\n    }\n    public static void main(String[] args) {\n        System.out.println(greet("Developer"));\n    }\n}\n`,
  cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(string name) { return "Hello, " + name + "!"; }\n\nint main() {\n    cout << greet("Developer") << endl;\n    return 0;\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, Developer!\\n");\n    return 0;\n}\n`,
  csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, Developer!");\n    }\n}\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Developer!")\n}\n`,
  rust: `fn main() {\n    println!("Hello, Developer!");\n}\n`,
  ruby: `def greet(name)\n  "Hello, #{name}!"\nend\n\nputs greet("Developer")\n`,
  php: `<?php\nfunction greet($name) { return "Hello, $name!"; }\necho greet("Developer") . "\\n";\n`,
  kotlin: `fun greet(name: String) = "Hello, $name!"\n\nfun main() {\n    println(greet("Developer"))\n}\n`,
  swift: `func greet(_ name: String) -> String {\n    return "Hello, \\(name)!"\n}\n\nprint(greet("Developer"))\n`,
  bash: `#!/bin/bash\ngreet() { echo "Hello, $1!"; }\ngreet "Developer"\n`,
};

const code = ref<string>(defaultCode["javascript"] ?? "");
const stdin = ref("");
const showStdin = ref(false);
const runnerRef = ref<InstanceType<typeof CodeRunner> | null>(null);

function onLanguageChange(lang: string) {
  selectedLanguage.value = lang;
  code.value = defaultCode[lang] || `// Write your ${lang} code here\n`;
  runnerRef.value?.reset();
}

function resetCode() {
  code.value = defaultCode[selectedLanguage.value] || "";
  runnerRef.value?.reset();
}

function runCode() {
  runnerRef.value?.run();
}

function onKey(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    runCode();
  }
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

const runtimeHint: Record<string, string> = {
  javascript: "Browser sandbox",
  typescript: "Browser sandbox · types stripped",
  python: "Pyodide · CPython on WASM",
};
const pistonUrl = (import.meta.env.VITE_PISTON_URL as string | undefined) ?? "";
const pistonLabel = pistonUrl ? `Piston · ${pistonUrl}` : "Piston · remote runner not configured";
function hintFor(lang: string) {
  return runtimeHint[lang] ?? pistonLabel;
}

const byteCount = computed(() => new TextEncoder().encode(code.value).length);
const lineCount = computed(() => code.value.split("\n").length);
const isExecuting = computed<boolean>(() => runnerRef.value?.isExecuting ?? false);
const lastResult = computed<{ exitCode: number; executionTime?: number } | null>(
  () => runnerRef.value?.result ?? null,
);
</script>

<template>
  <div class="h-[calc(100vh-3.5rem)] lg:h-screen flex flex-col bg-background">
    <!-- Toolbar -->
    <div
      class="border-b border-border bg-background/95 backdrop-blur px-3 sm:px-4 h-12 flex items-center justify-between gap-3 shrink-0"
    >
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <Terminal class="w-5 h-5 text-primary shrink-0" />
        <span class="font-semibold text-sm hidden sm:inline">Playground</span>
        <div class="h-6 w-px bg-border hidden sm:block" />
        <LanguageSelector
          :modelValue="selectedLanguage"
          @update:modelValue="onLanguageChange"
        />
        <span
          class="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/60 border border-border/50"
        >
          <Cpu class="w-3 h-3" />
          {{ hintFor(selectedLanguage) }}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          @click="resetCode"
          title="Reset code to template"
        >
          <RotateCcw class="w-4 h-4 sm:mr-1" />
          <span class="hidden sm:inline">Reset</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="runnerRef?.reset()"
          :disabled="!lastResult"
          title="Clear output"
        >
          <Eraser class="w-4 h-4 sm:mr-1" />
          <span class="hidden sm:inline">Clear</span>
        </Button>
        <div class="h-6 w-px bg-border mx-1" />
        <Button
          size="sm"
          @click="runCode"
          :disabled="isExecuting"
          class="gap-1.5"
          title="Run (Ctrl+Enter)"
        >
          <Loader2 v-if="isExecuting" class="w-4 h-4 animate-spin" />
          <Play v-else class="w-4 h-4" />
          <span>{{ isExecuting ? "Running" : "Run" }}</span>
          <kbd
            class="hidden md:inline-flex ml-1 items-center rounded border border-primary-foreground/30 bg-primary-foreground/10 px-1.5 py-0.5 text-[10px] font-mono"
          >Ctrl+↵</kbd>
        </Button>
      </div>
    </div>

    <!-- Editor + Output split -->
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
      <!-- Left: editor -->
      <div class="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-border">
        <CodeEditor v-model="code" :language="selectedLanguage" class="flex-1" />
      </div>

      <!-- Right: output + collapsible stdin -->
      <div class="md:w-[42%] lg:w-[38%] flex flex-col min-h-0 bg-muted/20">
        <!-- Output section header -->
        <div
          class="flex items-center justify-between px-3 h-9 border-b border-border shrink-0 bg-background/50"
        >
          <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Terminal class="w-3.5 h-3.5" />
            Output
          </div>
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <span v-if="lastResult?.executionTime">
              {{ Math.round(lastResult.executionTime) }} ms
            </span>
            <span
              v-if="lastResult"
              :class="lastResult.exitCode === 0 ? 'text-emerald-500' : 'text-red-500'"
              class="font-mono"
            >
              exit {{ lastResult.exitCode }}
            </span>
          </div>
        </div>

        <!-- Output body -->
        <div class="flex-1 min-h-0 overflow-hidden">
          <CodeRunner
            ref="runnerRef"
            :code="code"
            :language="selectedLanguage"
            :stdin="stdin"
            :embedded="true"
            class="h-full"
          />
        </div>

        <!-- stdin collapsible pane -->
        <div class="border-t border-border shrink-0 bg-background/50">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 h-9 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
            @click="showStdin = !showStdin"
          >
            <span class="flex items-center gap-2">
              <span>Standard Input</span>
              <span
                v-if="stdin.length > 0"
                class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono normal-case"
              >
                {{ stdin.split("\n").length }} line{{ stdin.split("\n").length === 1 ? "" : "s" }}
              </span>
            </span>
            <ChevronUp v-if="showStdin" class="w-4 h-4" />
            <ChevronDown v-else class="w-4 h-4" />
          </button>
          <div v-if="showStdin" class="px-3 pb-3">
            <textarea
              v-model="stdin"
              placeholder="Enter input for your program..."
              class="w-full h-24 resize-y bg-background rounded-md p-2 text-sm font-mono border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Status bar -->
    <div
      class="h-7 border-t border-border bg-muted/40 px-3 flex items-center justify-between text-[11px] text-muted-foreground font-mono shrink-0"
    >
      <div class="flex items-center gap-3 min-w-0">
        <span class="truncate">{{ selectedLanguage }}</span>
        <span class="opacity-50">·</span>
        <span>{{ lineCount }} L</span>
        <span class="opacity-50">·</span>
        <span>{{ byteCount }} B</span>
      </div>
      <div class="hidden sm:flex items-center gap-3">
        <span>UTF-8</span>
        <span class="opacity-50">·</span>
        <span>LF</span>
      </div>
    </div>
  </div>
</template>

