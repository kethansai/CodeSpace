<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getMethodologyBySlug, methodologies } from '@/data/methodology'
import MarkdownRenderer from '@/components/content/MarkdownRenderer.vue'
import MermaidDiagram from '@/components/diagram/MermaidDiagram.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { ArrowLeft, BookOpen } from 'lucide-vue-next'

const route = useRoute()
const methodology = computed(() => getMethodologyBySlug(route.params.topic as string))

const adjacentMethodologies = computed(() => {
  if (!methodology.value) return { prev: null, next: null }
  const idx = methodologies.findIndex(m => m.slug === methodology.value!.slug)
  return {
    prev: idx > 0 ? methodologies[idx - 1] : null,
    next: idx < methodologies.length - 1 ? methodologies[idx + 1] : null
  }
})
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink to="/methodology" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
      <ArrowLeft class="w-4 h-4" />
      All Methodologies
    </RouterLink>

    <template v-if="methodology">
      <div class="mb-8">
        <Badge variant="info" class="mb-2">Methodology</Badge>
        <h1 class="text-3xl md:text-4xl font-bold mb-3">{{ methodology.title }}</h1>
        <p class="text-muted-foreground text-lg">{{ methodology.description }}</p>
      </div>

      <!-- Principles -->
      <Card v-if="(methodology.principles || methodology.keyPrinciples || []).length" class="mb-8">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-3">Key Principles</h2>
          <ul class="grid gap-2 sm:grid-cols-2">
            <li v-for="p in (methodology.principles || methodology.keyPrinciples || [])" :key="p" class="flex items-start gap-2 text-sm">
              <span class="text-primary mt-0.5">✦</span>
              <span>{{ p }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Mermaid Diagram -->
      <Card v-if="methodology.diagram" class="mb-8">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-4">Process Flow</h2>
          <MermaidDiagram :diagram="methodology.diagram" />
        </CardContent>
      </Card>

      <!-- Main Content -->
      <div class="prose-content mb-10">
        <MarkdownRenderer :content="methodology.content" />
      </div>

      <!-- Prev / Next Navigation -->
      <div class="flex justify-between items-center pt-6 border-t border-border">
        <RouterLink
          v-if="adjacentMethodologies.prev"
          :to="`/methodology/${adjacentMethodologies.prev.slug}`"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {{ adjacentMethodologies.prev.title }}
        </RouterLink>
        <span v-else />
        <RouterLink
          v-if="adjacentMethodologies.next"
          :to="`/methodology/${adjacentMethodologies.next.slug}`"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {{ adjacentMethodologies.next.title }} →
        </RouterLink>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <BookOpen class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-2xl font-bold mb-2">Methodology Not Found</h2>
      <p class="text-muted-foreground mb-4">This methodology page doesn't exist.</p>
      <RouterLink to="/methodology" class="text-primary hover:underline">Browse Methodologies</RouterLink>
    </div>
  </div>
</template>
