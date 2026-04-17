<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { databases, getDatabaseBySlug } from "@/data/databases";
import MarkdownRenderer from "@/components/content/MarkdownRenderer.vue";
import MermaidDiagram from "@/components/diagram/MermaidDiagram.vue";
import SystemDesignAnimator from "@/components/diagram/SystemDesignAnimator.vue";
import Badge from "@/components/ui/Badge.vue";
import Card from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import { DIFFICULTY_COLORS } from "@/config/app";
import {
  ArrowLeft,
  Database,
  Lightbulb,
  Sparkles,
  Gauge,
  GitCompare,
  Building2,
  Check,
  X,
} from "lucide-vue-next";

const route = useRoute();
const db = computed(() => getDatabaseBySlug(route.params.slug as string));

const adjacent = computed(() => {
  if (!db.value) return { prev: null, next: null };
  const idx = databases.findIndex((d) => d.slug === db.value!.slug);
  return {
    prev: idx > 0 ? databases[idx - 1] : null,
    next: idx < databases.length - 1 ? databases[idx + 1] : null,
  };
});
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink
      to="/databases"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      All Databases
    </RouterLink>

    <template v-if="db">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-3 flex-wrap">
          <Badge
            :class="[
              DIFFICULTY_COLORS[db.difficulty].bg,
              DIFFICULTY_COLORS[db.difficulty].text,
              DIFFICULTY_COLORS[db.difficulty].border,
              'border',
            ]"
          >
            {{ db.difficulty }}
          </Badge>
          <Badge variant="secondary">{{ db.category }}</Badge>
          <Badge
            v-if="db.animations?.length"
            class="bg-primary/10 text-primary border-primary/20 border gap-1"
          >
            <Sparkles class="w-3 h-3" />
            Animated
          </Badge>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <span class="text-4xl">{{ db.icon }}</span>
          <h1 class="text-3xl md:text-4xl font-bold">{{ db.title }}</h1>
        </div>
        <p class="text-muted-foreground text-lg">{{ db.description }}</p>

        <div
          v-if="db.realWorld?.length"
          class="flex items-center gap-2 mt-4 flex-wrap text-xs"
        >
          <Building2 class="w-3.5 h-3.5 text-muted-foreground" />
          <span class="text-muted-foreground">Used by:</span>
          <Badge
            v-for="co in db.realWorld"
            :key="co"
            variant="outline"
            class="text-xs"
          >
            {{ co }}
          </Badge>
        </div>
      </div>

      <!-- Metrics -->
      <div
        v-if="db.scaleMetrics?.length"
        class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        <Card
          v-for="m in db.scaleMetrics"
          :key="m.label"
          class="bg-gradient-to-br from-primary/5 to-background"
        >
          <CardContent class="p-4">
            <div
              class="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"
            >
              <Gauge class="w-3.5 h-3.5" />
              {{ m.label }}
            </div>
            <div class="text-xl font-bold text-primary">{{ m.value }}</div>
            <div v-if="m.hint" class="text-[11px] text-muted-foreground mt-0.5">
              {{ m.hint }}
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Animated Walkthroughs -->
      <div v-if="db.animations?.length" class="mb-8 space-y-6">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-primary" />
          Animated Walkthrough
        </h2>
        <SystemDesignAnimator
          v-for="anim in db.animations"
          :key="anim.id"
          :animation="anim"
        />
      </div>

      <!-- Architecture Diagram -->
      <Card v-if="db.diagram" class="mb-8">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database class="w-5 h-5 text-primary" />
            Architecture Diagram
          </h2>
          <MermaidDiagram :diagram="db.diagram" />
        </CardContent>
      </Card>

      <!-- Tradeoffs -->
      <Card v-if="db.tradeoffs?.length" class="mb-8">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <GitCompare class="w-5 h-5 text-primary" />
            Tradeoffs
          </h2>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="t in db.tradeoffs"
              :key="t.option"
              class="rounded-lg border p-4 bg-muted/20"
            >
              <div class="font-semibold text-sm mb-3">{{ t.option }}</div>
              <ul class="space-y-1.5 mb-2">
                <li
                  v-for="(p, i) in t.pros"
                  :key="'p' + i"
                  class="flex items-start gap-1.5 text-xs"
                >
                  <Check class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{{ p }}</span>
                </li>
              </ul>
              <ul class="space-y-1.5">
                <li
                  v-for="(c, i) in t.cons"
                  :key="'c' + i"
                  class="flex items-start gap-1.5 text-xs"
                >
                  <X class="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{{ c }}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Key Takeaways -->
      <Card v-if="db.keyTakeaways.length" class="mb-8">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lightbulb class="w-5 h-5 text-amber-500" />
            Key Takeaways
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(t, i) in db.keyTakeaways"
              :key="i"
              class="flex items-start gap-2 text-sm"
            >
              <span class="text-primary font-bold mt-0.5">{{ i + 1 }}.</span>
              <span>{{ t }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Content -->
      <div class="prose-content mb-10">
        <MarkdownRenderer :content="db.content" />
      </div>

      <!-- Prev / Next -->
      <div class="flex justify-between items-center pt-6 border-t border-border">
        <RouterLink
          v-if="adjacent.prev"
          :to="`/databases/${adjacent.prev.slug}`"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; {{ adjacent.prev.title }}
        </RouterLink>
        <span v-else />
        <RouterLink
          v-if="adjacent.next"
          :to="`/databases/${adjacent.next.slug}`"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {{ adjacent.next.title }} &rarr;
        </RouterLink>
        <span v-else />
      </div>
    </template>

    <template v-else>
      <div class="text-center py-20">
        <h2 class="text-2xl font-semibold mb-2">Database Not Found</h2>
        <p class="text-muted-foreground mb-4">
          The database topic you're looking for doesn't exist.
        </p>
        <RouterLink to="/databases" class="text-primary hover:underline">
          Browse all databases
        </RouterLink>
      </div>
    </template>
  </div>
</template>
