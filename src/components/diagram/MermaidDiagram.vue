<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{
  diagram: string
  id?: string
}>()

const containerRef = ref<HTMLDivElement>()
const svgOutput = ref('')
const diagramId = props.id || `mermaid-${Math.random().toString(36).substring(7)}`

async function renderDiagram() {
  if (!props.diagram || !containerRef.value) return

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
    })

    const { svg } = await mermaid.render(diagramId, props.diagram)
    svgOutput.value = svg
  } catch (e) {
    console.error('Mermaid rendering error:', e)
    svgOutput.value = `<p class="text-red-500 text-sm">Failed to render diagram</p>`
  }
}

onMounted(renderDiagram)
watch(() => props.diagram, async () => {
  await nextTick()
  renderDiagram()
})
</script>

<template>
  <div ref="containerRef" class="w-full overflow-x-auto rounded-lg border bg-card p-4">
    <div v-html="svgOutput" class="flex justify-center [&_svg]:max-w-full" />
  </div>
</template>
