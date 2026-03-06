<script setup lang="ts">
import { ref } from "vue";
import { SUPPORTED_LANGUAGES } from "@/config/app";
import CodeEditor from "@/components/editor/CodeEditor.vue";
import CodeRunner from "@/components/editor/CodeRunner.vue";
import LanguageSelector from "@/components/editor/LanguageSelector.vue";
import Button from "@/components/ui/Button.vue";
import { Play, RotateCcw, Terminal } from "lucide-vue-next";

const selectedLanguage = ref("javascript");

const defaultCode: Record<string, string> = {
  javascript: `// Welcome to codespace Playground!\n// Write your JavaScript code here\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to codespace.\`;\n}\n\nconsole.log(greet("Developer"));\nconsole.log("Happy coding! 🚀");\n`,
  python: `# Welcome to codespace Playground!\n# Write your Python code here\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to codespace."\n\nprint(greet("Developer"))\nprint("Happy coding! 🚀")\n`,
  typescript: `// Welcome to codespace Playground!\n// Write your TypeScript code here\n\nfunction greet(name: string): string {\n  return \`Hello, \${name}! Welcome to codespace.\`;\n}\n\nconsole.log(greet("Developer"));\nconsole.log("Happy coding! 🚀");\n`,
  java: `// Welcome to codespace Playground!\n// Write your Java code here\n\npublic class Main {\n    public static String greet(String name) {\n        return "Hello, " + name + "! Welcome to codespace.";\n    }\n\n    public static void main(String[] args) {\n        System.out.println(greet("Developer"));\n        System.out.println("Happy coding! 🚀");\n    }\n}\n`,
  csharp: `// Welcome to codespace Playground!\n// Write your C# code here\n\nusing System;\n\nclass Program {\n    static string Greet(string name) {\n        return $"Hello, {name}! Welcome to codespace.";\n    }\n\n    static void Main() {\n        Console.WriteLine(Greet("Developer"));\n        Console.WriteLine("Happy coding! 🚀");\n    }\n}\n`,
  cpp: `// Welcome to codespace Playground!\n// Write your C++ code here\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(string name) {\n    return "Hello, " + name + "! Welcome to codespace.";\n}\n\nint main() {\n    cout << greet("Developer") << endl;\n    cout << "Happy coding! 🚀" << endl;\n    return 0;\n}\n`,
  go: `// Welcome to codespace Playground!\n// Write your Go code here\n\npackage main\n\nimport "fmt"\n\nfunc greet(name string) string {\n    return "Hello, " + name + "! Welcome to codespace."\n}\n\nfunc main() {\n    fmt.Println(greet("Developer"))\n    fmt.Println("Happy coding! 🚀")\n}\n`,
};

const code = ref<string>(defaultCode["javascript"] ?? "");
const stdin = ref("");

function onLanguageChange(lang: string) {
  selectedLanguage.value = lang;
  code.value = defaultCode[lang] || `// Write your ${lang} code here\n`;
}

function resetCode() {
  code.value = defaultCode[selectedLanguage.value] || "";
}
</script>

<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col">
    <!-- Toolbar -->
    <div
      class="border-b border-border bg-background px-4 py-2 flex items-center justify-between gap-4 shrink-0"
    >
      <div class="flex items-center gap-3">
        <Terminal class="w-5 h-5 text-primary" />
        <span class="font-semibold text-sm hidden sm:inline">Playground</span>
        <LanguageSelector
          :modelValue="selectedLanguage"
          @update:modelValue="onLanguageChange"
        />
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" @click="resetCode">
          <RotateCcw class="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>

    <!-- Editor + Output -->
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <!-- Editor Column -->
      <div class="flex-1 flex flex-col min-h-0">
        <CodeEditor
          v-model="code"
          :language="selectedLanguage"
          class="flex-1"
        />
      </div>

      <!-- Output Column -->
      <div
        class="md:w-[40%] border-t md:border-t-0 md:border-l border-border flex flex-col min-h-0"
      >
        <!-- Stdin -->
        <div class="border-b border-border p-3 shrink-0">
          <label class="text-xs font-medium text-muted-foreground block mb-1"
            >Standard Input (stdin)</label
          >
          <textarea
            v-model="stdin"
            placeholder="Enter input for your program..."
            class="w-full min-h-[60px] max-h-[100px] resize-y bg-muted rounded-md p-2 text-sm font-mono border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Runner -->
        <div class="flex-1 min-h-0 overflow-auto">
          <CodeRunner
            :code="code"
            :language="selectedLanguage"
            :stdin="stdin"
          />
        </div>
      </div>
    </div>
  </div>
</template>
