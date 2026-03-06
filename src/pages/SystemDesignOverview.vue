<script setup lang="ts">
import { computed } from "vue";
import { systemDesigns } from "@/data/system-design";
import Card from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import Badge from "@/components/ui/Badge.vue";
import { DIFFICULTY_COLORS } from "@/config/app";
import { ArrowRight, Server } from "lucide-vue-next";

const categories = computed(() => {
  const map = new Map<string, typeof systemDesigns>();
  for (const sd of systemDesigns) {
    const list = map.get(sd.category) || [];
    list.push(sd);
    map.set(sd.category, list);
  }
  return Array.from(map.entries());
});
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 md:py-12">
    <div class="mb-10">
      <div class="flex items-center gap-3 mb-2">
        <Server class="w-8 h-8 text-primary" />
        <h1 class="text-3xl font-bold">System Design</h1>
      </div>
      <p class="text-muted-foreground text-lg max-w-2xl">
        Learn how to design large-scale distributed systems. Each topic includes
        architecture diagrams, capacity estimation, and key design decisions.
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
      <Card>
        <CardContent class="p-4 text-center">
          <div class="text-2xl font-bold text-primary">
            {{ systemDesigns.length }}
          </div>
          <div class="text-sm text-muted-foreground">Design Topics</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4 text-center">
          <div class="text-2xl font-bold text-green-500">
            {{ systemDesigns.filter((d) => d.difficulty === "medium").length }}
          </div>
          <div class="text-sm text-muted-foreground">Medium</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4 text-center">
          <div class="text-2xl font-bold text-red-500">
            {{ systemDesigns.filter((d) => d.difficulty === "hard").length }}
          </div>
          <div class="text-sm text-muted-foreground">Hard</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4 text-center">
          <div class="text-2xl font-bold text-amber-500">
            {{ categories.length }}
          </div>
          <div class="text-sm text-muted-foreground">Categories</div>
        </CardContent>
      </Card>
    </div>

    <!-- Designs by Category -->
    <div
      v-for="[category, designs] in categories"
      :key="category"
      class="mb-10"
    >
      <h2 class="text-xl font-semibold mb-4 text-foreground/90">
        {{ category }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="design in designs"
          :key="design.id"
          :to="`/system-design/${design.slug}`"
          class="group"
        >
          <Card
            class="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
          >
            <CardContent class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">{{ design.icon }}</span>
                <h3
                  class="text-lg font-semibold group-hover:text-primary transition-colors leading-tight"
                >
                  {{ design.title }}
                </h3>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-2 mb-4">
                {{ design.description }}
              </p>
              <div class="flex items-center justify-between">
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
                <span
                  class="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Explore <ArrowRight class="w-3.5 h-3.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
