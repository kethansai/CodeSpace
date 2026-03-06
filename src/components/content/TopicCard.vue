<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import Progress from '@/components/ui/Progress.vue'
import { CheckCircle2 } from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
  icon?: string
  to: string
  tags?: string[]
  progress?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  color?: string
}>()
</script>

<template>
  <RouterLink :to="to" class="block group">
    <Card class="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20">
      <CardHeader>
        <div class="flex items-start justify-between">
          <div v-if="color" class="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 text-lg" :class="color">
            <slot name="icon">
              {{ icon }}
            </slot>
          </div>
          <CheckCircle2 v-if="progress === 100" class="w-5 h-5 text-emerald-500" />
        </div>
        <CardTitle class="group-hover:text-primary transition-colors">
          {{ title }}
        </CardTitle>
        <CardDescription>{{ description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="tags?.length" class="flex flex-wrap gap-1.5 mb-3">
          <Badge v-for="tag in tags.slice(0, 3)" :key="tag" variant="secondary" class="text-xs">
            {{ tag }}
          </Badge>
          <Badge v-if="tags.length > 3" variant="secondary" class="text-xs">
            +{{ tags.length - 3 }}
          </Badge>
        </div>
        <Progress v-if="progress !== undefined" :model-value="progress" class="h-1.5" />
        <slot name="footer" />
      </CardContent>
    </Card>
  </RouterLink>
</template>
