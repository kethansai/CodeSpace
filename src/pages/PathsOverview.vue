<script setup lang="ts">
import { learningPaths } from '@/data/paths'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import { ArrowRight, BookOpen } from 'lucide-vue-next'

function getPathLevel(role: string): string {
  const levels: Record<string, string> = {
    'intern': 'beginner',
    'qa-engineer': 'beginner',
    'junior-developer': 'intermediate',
    'frontend-developer': 'intermediate',
    'backend-developer': 'intermediate',
    'senior-developer': 'advanced',
    'fullstack-developer': 'advanced',
    'devops-engineer': 'advanced',
    'architect': 'advanced',
    'product-owner': 'advanced',
  }
  return levels[role] || 'intermediate'
}

const pathsByLevel = {
  beginner: learningPaths.filter(p => getPathLevel(p.role) === 'beginner'),
  intermediate: learningPaths.filter(p => getPathLevel(p.role) === 'intermediate'),
  advanced: learningPaths.filter(p => getPathLevel(p.role) === 'advanced'),
}
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 md:py-12">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <BookOpen class="w-8 h-8 text-primary" />
        <h1 class="text-3xl font-bold">Learning Paths</h1>
      </div>
      <p class="text-muted-foreground text-lg">
        Structured learning paths designed for different roles and experience levels.
      </p>
    </div>

    <div v-for="(paths, level) in pathsByLevel" :key="level" class="mb-12">
      <h2 class="text-xl font-semibold capitalize mb-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" :class="{
          'bg-green-500': level === 'beginner',
          'bg-amber-500': level === 'intermediate',
          'bg-red-500': level === 'advanced',
        }"></span>
        {{ level }} Level
        <Badge variant="secondary" class="text-xs ml-1">{{ paths.length }}</Badge>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-for="path in paths"
          :key="path.id"
          :to="`/paths/${path.role}`"
          class="group"
        >
          <Card class="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
            <CardContent class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">{{ path.icon }}</span>
                <div>
                  <h3 class="font-semibold group-hover:text-primary transition-colors">
                    {{ path.title }}
                  </h3>
                  <Badge variant="outline" class="text-xs mt-1">{{ getPathLevel(path.role) }}</Badge>
                </div>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-2 mb-4">{{ path.description }}</p>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{{ path.sections.length }} sections</span>
                <span class="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Start <ArrowRight class="w-3.5 h-3.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
