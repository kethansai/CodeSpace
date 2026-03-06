<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getDSACategoryBySlug } from '@/data/dsa'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import DifficultyBadge from '@/components/content/DifficultyBadge.vue'
import { ArrowLeft, ArrowRight, Brain, Clock, HardDrive } from 'lucide-vue-next'

const route = useRoute()
const category = computed(() => getDSACategoryBySlug(route.params.category as string))
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink to="/dsa" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
      <ArrowLeft class="w-4 h-4" />
      All DSA Categories
    </RouterLink>

    <template v-if="category">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-4xl">{{ category.icon }}</span>
          <div>
            <h1 class="text-3xl font-bold">{{ category.name }}</h1>
            <Badge variant="secondary" class="mt-1">{{ category.topics.length }} topics</Badge>
          </div>
        </div>
        <p class="text-muted-foreground text-lg mt-2">{{ category.description }}</p>
      </div>

      <div class="space-y-3">
        <RouterLink
          v-for="topic in category.topics"
          :key="topic.id"
          :to="`/dsa/${category.slug}/${topic.slug}`"
          class="group block"
        >
          <Card class="transition-all duration-200 hover:shadow-md hover:border-primary/20">
            <CardContent class="p-5">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold group-hover:text-primary transition-colors">{{ topic.title }}</h3>
                    <DifficultyBadge :difficulty="topic.difficulty" />
                  </div>
                  <p class="text-sm text-muted-foreground line-clamp-1 mb-2">{{ topic.description }}</p>
                  <div class="flex items-center gap-4 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Clock class="w-3 h-3" />
                      {{ topic.timeComplexity }}
                    </span>
                    <span class="flex items-center gap-1">
                      <HardDrive class="w-3 h-3" />
                      {{ topic.spaceComplexity }}
                    </span>
                  </div>
                </div>
                <ArrowRight class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        </RouterLink>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <Brain class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-2xl font-bold mb-2">Category Not Found</h2>
      <p class="text-muted-foreground mb-4">This DSA category doesn't exist.</p>
      <RouterLink to="/dsa" class="text-primary hover:underline">View All Categories</RouterLink>
    </div>
  </div>
</template>
