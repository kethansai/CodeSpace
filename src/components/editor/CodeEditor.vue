<script setup lang="ts">
import { ref, onMounted, watch, shallowRef } from 'vue'
import loader from '@monaco-editor/loader'

const props = defineProps<{
  modelValue: string
  language: string
  theme?: string
  readOnly?: boolean
  height?: string
  minimap?: boolean
  fontSize?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLDivElement>()
const editorInstance = shallowRef<any>(null)
const isLoading = ref(true)

onMounted(async () => {
  const monaco = await loader.init()

  if (!containerRef.value) return

  // Define custom dark theme
  monaco.editor.defineTheme('codespace-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1a1b2e',
      'editor.foreground': '#e4e4e7',
      'editorLineNumber.foreground': '#52525b',
      'editorLineNumber.activeForeground': '#a1a1aa',
      'editor.lineHighlightBackground': '#27273a',
      'editor.selectionBackground': '#6366f140',
    },
  })

  monaco.editor.defineTheme('codespace-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#fafafa',
      'editor.foreground': '#18181b',
      'editor.lineHighlightBackground': '#f4f4f5',
      'editor.selectionBackground': '#6366f130',
    },
  })

  const editor = monaco.editor.create(containerRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme || 'codespace-dark',
    readOnly: props.readOnly || false,
    minimap: { enabled: props.minimap ?? false },
    fontSize: props.fontSize || 14,
    fontFamily: "'JetBrains Mono', monospace",
    fontLigatures: true,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    renderLineHighlight: 'line',
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  })

  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    emit('update:modelValue', value)
  })

  editorInstance.value = editor
  isLoading.value = false
})

watch(() => props.language, (newLang) => {
  if (editorInstance.value) {
    const monaco = (window as any).monaco
    if (monaco) {
      const model = editorInstance.value.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, newLang)
      }
    }
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editorInstance.value) {
    const current = editorInstance.value.getValue()
    if (current !== newValue) {
      editorInstance.value.setValue(newValue)
    }
  }
})
</script>

<template>
  <div class="relative rounded-lg overflow-hidden border">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center bg-muted" :style="{ height: height || '400px' }">
      <div class="flex items-center gap-2 text-muted-foreground">
        <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span class="text-sm">Loading editor...</span>
      </div>
    </div>
    <div ref="containerRef" :style="{ height: height || '400px' }" />
  </div>
</template>
