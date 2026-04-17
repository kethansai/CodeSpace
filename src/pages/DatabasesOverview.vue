<script setup lang="ts">
import { computed } from "vue";
import { databases } from "@/data/databases";
import Card from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import Badge from "@/components/ui/Badge.vue";
import { DIFFICULTY_COLORS } from "@/config/app";
import { ArrowRight, Database, Sparkles } from "lucide-vue-next";

const categories = computed(() => {
  const map = new Map<string, typeof databases>();
  for (const db of databases) {
    const list = map.get(db.category) || [];
    list.push(db);
    map.set(db.category, list);
  }
  return Array.from(map.entries());
});
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 md:py-12">
    <div class="mb-10">
      <div class="flex items-center gap-3 mb-2">
        <Database class="w-8 h-8 text-primary" />
        <h1 class="text-3xl font-bold">Databases</h1>
      </div>
      <p class="text-muted-foreground text-lg max-w-2xl">
        From relational giants to key-value caches — learn how modern databases
        work with animated architecture walkthroughs and deep dives.
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
      <Card>
        <CardContent class="p-4 text-center">
          <div class="text-2xl font-bold text-primary">
            {{ databases.length }}
          </div>
          <div class="text-sm text-muted-foreground">Databases</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4 text-center">
          <div
            class="text-2xl font-bold text-primary flex items-center justify-center gap-1"
          >
            <Sparkles class="w-4 h-4" />
            {{ databases.filter((d) => d.animations?.length).length }}
          </div>
          <div class="text-sm text-muted-foreground">Animated</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4 text-center">
          <div class="text-2xl font-bold text-red-500">
            {{ databases.filter((d) => d.difficulty === "hard").length }}
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

    <!-- By Category -->
    <div
      v-for="[category, list] in categories"
      :key="category"
      class="mb-10"
    >
      <h2 class="text-xl font-semibold mb-4 text-foreground/90">
        {{ category }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="db in list"
          :key="db.id"
          :to="`/databases/${db.slug}`"
          class="group"
        >
          <Card
            class="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
          >
            <CardContent class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">{{ db.icon }}</span>
                <h3
                  class="text-lg font-semibold group-hover:text-primary transition-colors leading-tight"
                >
                  {{ db.title }}
                </h3>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-2 mb-4">
                {{ db.description }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 flex-wrap">
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
                  <Badge
                    v-if="db.animations?.length"
                    class="bg-primary/10 text-primary border-primary/20 border gap-1"
                  >
                    <Sparkles class="w-3 h-3" />
                    Animated
                  </Badge>
                </div>
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
