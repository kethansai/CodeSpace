<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getCompanyBySlug } from '@/data/interviews'
import MarkdownRenderer from '@/components/content/MarkdownRenderer.vue'
import DifficultyBadge from '@/components/content/DifficultyBadge.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { ArrowLeft, ChevronDown, ChevronUp, Building2 } from 'lucide-vue-next'

const route = useRoute()
const company = computed(() => getCompanyBySlug(route.params.company as string))

const expandedQuestion = ref<string | null>(null)

function toggleQuestion(id: string) {
  expandedQuestion.value = expandedQuestion.value === id ? null : id
}
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink to="/interviews" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
      <ArrowLeft class="w-4 h-4" />
      All Companies
    </RouterLink>

    <template v-if="company">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-4xl">{{ company.logo }}</span>
          <div>
            <h1 class="text-3xl font-bold">{{ company.name }}</h1>
            <Badge variant="secondary" class="mt-1">{{ company.questions.length }} questions</Badge>
          </div>
        </div>
        <p class="text-muted-foreground text-lg mt-2">{{ company.description }}</p>

        <Card class="mt-4 bg-muted/50">
          <CardContent class="p-4">
            <h3 class="font-semibold text-sm mb-1.5">Interview Process</h3>
            <p class="text-sm text-muted-foreground">{{ company.interviewProcess }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-3">
        <Card
          v-for="question in company.questions"
          :key="question.id"
          class="overflow-hidden"
        >
          <div
            class="p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-start justify-between gap-4"
            @click="toggleQuestion(question.id)"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant="outline" class="text-xs">{{ question.category }}</Badge>
                <DifficultyBadge :difficulty="question.difficulty" />
              </div>
              <h3 class="font-semibold">{{ question.question }}</h3>
            </div>
            <component
              :is="expandedQuestion === question.id ? ChevronUp : ChevronDown"
              class="w-5 h-5 text-muted-foreground shrink-0 mt-0.5"
            />
          </div>

          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[2000px]"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 max-h-[2000px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="expandedQuestion === question.id" class="px-4 pb-4 border-t border-border">
              <div class="prose-content mt-4">
                <MarkdownRenderer :content="question.answer" />
              </div>
            </div>
          </Transition>
        </Card>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <Building2 class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-2xl font-bold mb-2">Company Not Found</h2>
      <p class="text-muted-foreground mb-4">This company page doesn't exist.</p>
      <RouterLink to="/interviews" class="text-primary hover:underline">View All Companies</RouterLink>
    </div>
  </div>
</template>
