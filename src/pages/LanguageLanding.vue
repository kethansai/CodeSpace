<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getLanguageBySlug } from '@/data/languages'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import { ArrowLeft, ArrowRight, Code2 } from 'lucide-vue-next'

const route = useRoute()
const lang = computed(() => getLanguageBySlug(route.params.lang as string))
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink to="/languages" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
      <ArrowLeft class="w-4 h-4" />
      All Languages
    </RouterLink>

    <template v-if="lang">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-4xl">{{ lang.icon }}</span>
          <div>
            <h1 class="text-3xl font-bold">{{ lang.name }}</h1>
            <Badge variant="secondary" class="mt-1">{{ lang.topics.length }} topics</Badge>
          </div>
        </div>
        <p class="text-muted-foreground text-lg mt-2">{{ lang.description }}</p>
      </div>

      <div class="space-y-3">
        <RouterLink
          v-for="(topic, idx) in lang.topics"
          :key="topic.id"
          :to="`/languages/${lang.slug}/${topic.slug}`"
          class="group block"
        >
          <Card class="transition-all duration-200 hover:shadow-md hover:border-primary/20">
            <CardContent class="p-5 flex items-center gap-4">
              <span class="text-sm font-mono text-muted-foreground w-6 text-right shrink-0">{{ String(idx + 1).padStart(2, '0') }}</span>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold group-hover:text-primary transition-colors">
                  {{ topic.title }}
                </h3>
                <p class="text-sm text-muted-foreground mt-0.5 line-clamp-1">{{ topic.description }}</p>
              </div>
              <ArrowRight class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </CardContent>
          </Card>
        </RouterLink>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <Code2 class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-2xl font-bold mb-2">Language Not Found</h2>
      <p class="text-muted-foreground mb-4">This language page doesn't exist.</p>
      <RouterLink to="/languages" class="text-primary hover:underline">View All Languages</RouterLink>
    </div>
  </div>
</template>
