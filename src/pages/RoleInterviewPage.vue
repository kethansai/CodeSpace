<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getRoleBySlug } from '@/data/interviews'
import MarkdownRenderer from '@/components/content/MarkdownRenderer.vue'
import DifficultyBadge from '@/components/content/DifficultyBadge.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import { ArrowLeft, Building2, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-vue-next'

const route = useRoute()

const context = computed(() =>
  getRoleBySlug(
    route.params.company as string,
    route.params.role as string,
  ),
)

const company = computed(() => context.value?.company)
const role = computed(() => context.value?.role)

const expandedQuestion = ref<string | null>(null)
function toggleQuestion(id: string) {
  expandedQuestion.value = expandedQuestion.value === id ? null : id
}
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-8 md:py-12">
    <template v-if="company && role">
      <RouterLink
        :to="`/interviews/${company.slug}`"
        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        {{ company.name }} roles
      </RouterLink>

      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
          <span class="text-2xl">{{ company.logo }}</span>
          <span>{{ company.name }}</span>
          <span>·</span>
          <span v-if="role.level">{{ role.level }}</span>
        </div>
        <h1 class="text-3xl font-bold mb-2">{{ role.title }}</h1>
        <p class="text-muted-foreground text-lg">{{ role.description }}</p>

        <div class="flex flex-wrap gap-2 mt-4">
          <Badge v-for="f in role.focus" :key="f" variant="secondary">{{ f }}</Badge>
        </div>

        <Card v-if="role.interviewLoop" class="mt-5 bg-muted/50">
          <CardContent class="p-4">
            <h3 class="font-semibold text-sm mb-1.5">Interview Loop</h3>
            <p class="text-sm text-muted-foreground">{{ role.interviewLoop }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Rounds -->
      <div class="space-y-8">
        <section
          v-for="(round, idx) in role.rounds"
          :key="round.id"
          :id="round.slug"
          class="scroll-mt-24"
        >
          <div class="mb-3">
            <div class="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>Round {{ idx + 1 }} of {{ role.rounds.length }}</span>
            </div>
            <h2 class="text-2xl font-bold">{{ round.name }}</h2>
            <div class="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span v-if="round.duration" class="inline-flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" />
                {{ round.duration }}
              </span>
              <span v-if="round.format" class="inline-flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5" />
                {{ round.format }}
              </span>
            </div>
          </div>

          <Card class="bg-muted/30 mb-4">
            <CardContent class="p-4">
              <p class="text-sm text-muted-foreground">{{ round.description }}</p>
              <div v-if="round.topics?.length" class="flex flex-wrap gap-1.5 mt-3">
                <Badge
                  v-for="t in round.topics"
                  :key="t"
                  variant="outline"
                  class="text-xs font-normal"
                >
                  {{ t }}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div class="space-y-3">
            <Card
              v-for="q in round.questions"
              :key="`${round.id}-${q.id}`"
              class="overflow-hidden"
            >
              <div
                class="p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-start justify-between gap-4"
                @click="toggleQuestion(`${round.id}-${q.id}`)"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" class="text-xs">{{ q.category }}</Badge>
                    <DifficultyBadge :difficulty="q.difficulty" />
                  </div>
                  <h3 class="font-semibold">{{ q.question }}</h3>
                </div>
                <component
                  :is="expandedQuestion === `${round.id}-${q.id}` ? ChevronUp : ChevronDown"
                  class="w-5 h-5 text-muted-foreground shrink-0 mt-0.5"
                />
              </div>

              <Transition
                enter-active-class="transition-all duration-200"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[3000px]"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100 max-h-[3000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div
                  v-if="expandedQuestion === `${round.id}-${q.id}`"
                  class="px-4 pb-4 border-t border-border"
                >
                  <div class="prose-content mt-4">
                    <MarkdownRenderer :content="q.answer" />
                  </div>
                </div>
              </Transition>
            </Card>
          </div>
        </section>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <Building2 class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-2xl font-bold mb-2">Role Not Found</h2>
      <p class="text-muted-foreground mb-4">This role doesn't exist for the selected company.</p>
      <RouterLink to="/interviews" class="text-primary hover:underline">View All Companies</RouterLink>
    </div>
  </div>
</template>
