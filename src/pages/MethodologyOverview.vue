<script setup lang="ts">
import { methodologies } from '@/data/methodology'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import { BookOpen, ArrowRight } from 'lucide-vue-next'

const methodologyIcons: Record<string, string> = {
  agile: '🔄',
  scrum: '🏃',
  kanban: '📋',
  devops: '⚙️'
}
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 md:py-12">
    <div class="text-center mb-10">
      <Badge variant="info" class="mb-3">Methodology</Badge>
      <h1 class="text-3xl md:text-4xl font-bold mb-3">Software Development Methodologies</h1>
      <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
        Learn about the processes and frameworks that power modern software development teams.
      </p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <RouterLink
        v-for="m in methodologies"
        :key="m.slug"
        :to="`/methodology/${m.slug}`"
        class="group"
      >
        <Card class="h-full hover:border-primary/40 transition-all duration-200 hover:shadow-lg">
          <CardContent class="p-6">
            <div class="flex items-start justify-between mb-4">
              <span class="text-4xl">{{ methodologyIcons[m.slug] || '📖' }}</span>
              <ArrowRight class="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h2 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{{ m.title }}</h2>
            <p class="text-muted-foreground text-sm leading-relaxed">{{ m.description }}</p>
            <div class="flex flex-wrap gap-2 mt-4">
              <Badge v-for="principle in (m.principles || m.keyPrinciples || []).slice(0, 3)" :key="principle" variant="secondary" class="text-xs">
                {{ principle }}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
