<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getLanguageBySlug, getLanguageTopic } from '@/data/languages'
import MarkdownRenderer from '@/components/content/MarkdownRenderer.vue'
import LanguageTabs from '@/components/content/LanguageTabs.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { ArrowLeft, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-vue-next'

const route = useRoute()

const lang = computed(() => getLanguageBySlug(route.params.lang as string))
const topic = computed(() => getLanguageTopic(route.params.lang as string, route.params.topic as string))

const currentIndex = computed(() =>
  lang.value?.topics.findIndex(t => t.slug === route.params.topic) ?? -1
)

const prevTopic = computed(() =>
  currentIndex.value > 0 ? lang.value?.topics[currentIndex.value - 1] : null
)

const nextTopic = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < (lang.value?.topics.length ?? 0) - 1
    ? lang.value?.topics[currentIndex.value + 1]
    : null
)
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink
      v-if="lang"
      :to="`/languages/${lang.slug}`"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      {{ lang.name }}
    </RouterLink>

    <template v-if="topic && lang">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{{ lang.icon }} {{ lang.name }}</span>
          <span>/</span>
          <span>Topic {{ currentIndex + 1 }} of {{ lang.topics.length }}</span>
        </div>
        <h1 class="text-3xl font-bold mb-2">{{ topic.title }}</h1>
        <p class="text-muted-foreground text-lg">{{ topic.description }}</p>
      </div>

      <!-- Content -->
      <div class="prose-content mb-8">
        <MarkdownRenderer :content="topic.content" />
      </div>

      <!-- Code Examples -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Code Examples</h2>
        <LanguageTabs :examples="topic.codeExamples" />
      </div>

      <!-- Key Takeaways -->
      <Card v-if="topic.keyTakeaways?.length" class="mb-8 border-green-500/20 bg-green-500/5">
        <CardContent class="p-6">
          <h3 class="font-semibold flex items-center gap-2 mb-3">
            <Lightbulb class="w-5 h-5 text-green-500" />
            Key Takeaways
          </h3>
          <ul class="space-y-2">
            <li v-for="takeaway in topic.keyTakeaways" :key="takeaway" class="flex items-start gap-2 text-sm">
              <CheckCircle2 class="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>{{ takeaway }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Navigation -->
      <div class="flex items-center justify-between border-t border-border pt-6">
        <RouterLink
          v-if="prevTopic"
          :to="`/languages/${lang.slug}/${prevTopic.slug}`"
          class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <div class="text-left">
            <div class="text-xs text-muted-foreground">Previous</div>
            <div class="font-medium">{{ prevTopic.title }}</div>
          </div>
        </RouterLink>
        <div v-else></div>

        <RouterLink
          v-if="nextTopic"
          :to="`/languages/${lang.slug}/${nextTopic.slug}`"
          class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <div class="text-right">
            <div class="text-xs text-muted-foreground">Next</div>
            <div class="font-medium">{{ nextTopic.title }}</div>
          </div>
          <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold mb-2">Topic Not Found</h2>
      <p class="text-muted-foreground mb-4">This topic doesn't exist.</p>
      <RouterLink to="/languages" class="text-primary hover:underline">View All Languages</RouterLink>
    </div>
  </div>
</template>
