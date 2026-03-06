<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { systemDesigns, getSystemDesignBySlug } from "@/data/system-design";
import MarkdownRenderer from "@/components/content/MarkdownRenderer.vue";
import MermaidDiagram from "@/components/diagram/MermaidDiagram.vue";
import Badge from "@/components/ui/Badge.vue";
import Card from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import { DIFFICULTY_COLORS } from "@/config/app";
import { ArrowLeft, Server, Lightbulb } from "lucide-vue-next";

const route = useRoute();
const design = computed(() =>
  getSystemDesignBySlug(route.params.slug as string),
);

const adjacentDesigns = computed(() => {
  if (!design.value) return { prev: null, next: null };
  const idx = systemDesigns.findIndex((d) => d.slug === design.value!.slug);
  return {
    prev: idx > 0 ? systemDesigns[idx - 1] : null,
    next: idx < systemDesigns.length - 1 ? systemDesigns[idx + 1] : null,
  };
});
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink
      to="/system-design"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      All System Designs
    </RouterLink>

    <template v-if="design">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-3">
          <Badge
            :class="[
              DIFFICULTY_COLORS[design.difficulty].bg,
              DIFFICULTY_COLORS[design.difficulty].text,
              DIFFICULTY_COLORS[design.difficulty].border,
              'border',
            ]"
          >
            {{ design.difficulty }}
          </Badge>
          <Badge variant="secondary">{{ design.category }}</Badge>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <span class="text-4xl">{{ design.icon }}</span>
          <h1 class="text-3xl md:text-4xl font-bold">{{ design.title }}</h1>
        </div>
        <p class="text-muted-foreground text-lg">{{ design.description }}</p>
      </div>

      <!-- Architecture Diagram -->
      <Card v-if="design.diagram" class="mb-8">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Server class="w-5 h-5 text-primary" />
            Architecture Diagram
          </h2>
          <MermaidDiagram :diagram="design.diagram" />
        </CardContent>
      </Card>

      <!-- Key Takeaways -->
      <Card v-if="design.keyTakeaways.length" class="mb-8">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lightbulb class="w-5 h-5 text-amber-500" />
            Key Takeaways
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(takeaway, i) in design.keyTakeaways"
              :key="i"
              class="flex items-start gap-2 text-sm"
            >
              <span class="text-primary font-bold mt-0.5">{{ i + 1 }}.</span>
              <span>{{ takeaway }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Main Content -->
      <div class="prose-content mb-10">
        <MarkdownRenderer :content="design.content" />
      </div>

      <!-- Prev / Next Navigation -->
      <div
        class="flex justify-between items-center pt-6 border-t border-border"
      >
        <RouterLink
          v-if="adjacentDesigns.prev"
          :to="`/system-design/${adjacentDesigns.prev.slug}`"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; {{ adjacentDesigns.prev.title }}
        </RouterLink>
        <span v-else />
        <RouterLink
          v-if="adjacentDesigns.next"
          :to="`/system-design/${adjacentDesigns.next.slug}`"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {{ adjacentDesigns.next.title }} &rarr;
        </RouterLink>
        <span v-else />
      </div>
    </template>

    <!-- Not Found -->
    <template v-else>
      <div class="text-center py-20">
        <h2 class="text-2xl font-semibold mb-2">Design Not Found</h2>
        <p class="text-muted-foreground mb-4">
          The system design topic you're looking for doesn't exist.
        </p>
        <RouterLink to="/system-design" class="text-primary hover:underline">
          Browse all system designs
        </RouterLink>
      </div>
    </template>
  </div>
</template>
