<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from "vue";
import loader from "@monaco-editor/loader";

const props = defineProps<{
  modelValue: string;
  language: string;
  theme?: string;
  readOnly?: boolean;
  height?: string;
  minimap?: boolean;
  fontSize?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const containerRef = ref<HTMLDivElement>();
const editorInstance = shallowRef<any>(null);
const monacoRef = shallowRef<any>(null);
const isLoading = ref(true);
const isDark = ref<boolean>(
  typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark"),
);
let themeObserver: MutationObserver | null = null;

function resolveTheme(): string {
  if (props.theme) return props.theme;
  return isDark.value ? "codespace-dark" : "codespace-light";
}

onMounted(async () => {
  const monaco = await loader.init();
  monacoRef.value = monaco;

  if (!containerRef.value) return;

  // Define custom dark theme
  monaco.editor.defineTheme("codespace-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#1a1b2e",
      "editor.foreground": "#e4e4e7",
      "editorLineNumber.foreground": "#52525b",
      "editorLineNumber.activeForeground": "#a1a1aa",
      "editor.lineHighlightBackground": "#27273a",
      "editor.selectionBackground": "#6366f140",
    },
  });

  monaco.editor.defineTheme("codespace-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#fafafa",
      "editor.foreground": "#18181b",
      "editor.lineHighlightBackground": "#f4f4f5",
      "editor.selectionBackground": "#6366f130",
    },
  });

  const editor = monaco.editor.create(containerRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: resolveTheme(),
    readOnly: props.readOnly || false,
    minimap: { enabled: props.minimap ?? false },
    fontSize: props.fontSize || 14,
    fontFamily: "'JetBrains Mono', monospace",
    fontLigatures: true,
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    padding: { top: 16, bottom: 16 },
    smoothScrolling: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    renderLineHighlight: "line",
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  });

  editor.onDidChangeModelContent(() => {
    const value = editor.getValue();
    emit("update:modelValue", value);
  });

  editorInstance.value = editor;
  isLoading.value = false;

  // React to theme toggle (useColorMode adds/removes `dark` on <html>).
  themeObserver = new MutationObserver(() => {
    const nowDark = document.documentElement.classList.contains("dark");
    if (nowDark !== isDark.value) isDark.value = nowDark;
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
  editorInstance.value?.dispose();
});

watch([isDark, () => props.theme], () => {
  monacoRef.value?.editor.setTheme(resolveTheme());
});

watch(
  () => props.language,
  (newLang) => {
    if (editorInstance.value && monacoRef.value) {
      const model = editorInstance.value.getModel();
      if (model) {
        monacoRef.value.editor.setModelLanguage(model, newLang);
      }
    }
  },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance.value) {
      const current = editorInstance.value.getValue();
      if (current !== newValue) {
        editorInstance.value.setValue(newValue);
      }
    }
  },
);
</script>

<template>
  <div class="relative overflow-hidden h-full w-full">
    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-muted"
      :style="height ? { height } : undefined"
    >
      <div class="flex items-center gap-2 text-muted-foreground">
        <div
          class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
        />
        <span class="text-sm">Loading editor...</span>
      </div>
    </div>
    <div
      ref="containerRef"
      class="h-full w-full"
      :style="height ? { height } : undefined"
    />
  </div>
</template>
