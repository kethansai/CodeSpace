<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { learningPaths } from '@/data/paths'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import Separator from '@/components/ui/Separator.vue'
import { CheckCircle2, Circle, ArrowLeft, BookOpen } from 'lucide-vue-next'
import { useProgressStore } from '@/stores/progress'

const route = useRoute()
const progressStore = useProgressStore()

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

const path = computed(() =>
  learningPaths.find(p => p.role === route.params.role)
)

function isTopicCompleted(topicId: string) {
  return progressStore.completedTopics.has(topicId)
}

function toggleTopic(topicId: string) {
  if (isTopicCompleted(topicId)) {
    progressStore.completedTopics.delete(topicId)
  } else {
    progressStore.completedTopics.add(topicId)
  }
}

const totalTopics = computed(() =>
  path.value?.sections.reduce((sum, s) => sum + s.topics.length, 0) ?? 0
)

const completedCount = computed(() =>
  path.value?.sections.reduce((sum, s) =>
    sum + s.topics.filter(t => isTopicCompleted(t.id)).length, 0
  ) ?? 0
)
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink to="/paths" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
      <ArrowLeft class="w-4 h-4" />
      All Paths
    </RouterLink>

    <template v-if="path">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-4xl">{{ path.icon }}</span>
          <div>
            <h1 class="text-3xl font-bold">{{ path.title }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <Badge variant="outline">{{ getPathLevel(path.role) }}</Badge>
              <span class="text-sm text-muted-foreground">{{ totalTopics }} topics</span>
            </div>
          </div>
        </div>
        <p class="text-muted-foreground text-lg mt-2">{{ path.description }}</p>

        <!-- Progress bar -->
        <div class="mt-6 bg-muted rounded-full h-2.5">
          <div
            class="bg-primary rounded-full h-2.5 transition-all duration-500"
            :style="{ width: `${totalTopics ? (completedCount / totalTopics * 100) : 0}%` }"
          ></div>
        </div>
        <p class="text-sm text-muted-foreground mt-2">
          {{ completedCount }} / {{ totalTopics }} topics completed
        </p>
      </div>

      <div v-for="(section, sIdx) in path.sections" :key="section.title" class="mb-8">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <span class="text-sm text-muted-foreground font-mono">{{ String(sIdx + 1).padStart(2, '0') }}</span>
          {{ section.title }}
        </h2>

        <Card>
          <CardContent class="p-0">
            <div
              v-for="(topic, tIdx) in section.topics"
              :key="topic.id"
              class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              :class="{ 'border-t border-border': tIdx > 0 }"
              @click="toggleTopic(topic.id)"
            >
              <component
                :is="isTopicCompleted(topic.id) ? CheckCircle2 : Circle"
                :class="[
                  'w-5 h-5 shrink-0 transition-colors',
                  isTopicCompleted(topic.id) ? 'text-green-500' : 'text-muted-foreground'
                ]"
              />
              <span :class="['flex-1', isTopicCompleted(topic.id) && 'line-through text-muted-foreground']">
                {{ topic.title }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <BookOpen class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-2xl font-bold mb-2">Path Not Found</h2>
      <p class="text-muted-foreground mb-4">This learning path doesn't exist.</p>
      <RouterLink to="/paths">
        <Button variant="outline">View All Paths</Button>
      </RouterLink>
    </div>
  </div>
</template>
