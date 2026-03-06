<script setup lang="ts">
import { ref, computed } from 'vue'
import { problems } from '@/data/problems'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import DifficultyBadge from '@/components/content/DifficultyBadge.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { ArrowRight, Search, Sparkles, Filter } from 'lucide-vue-next'

const searchQuery = ref('')
const filterDifficulty = ref<string>('all')

const filteredProblems = computed(() => {
  let result = problems

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  if (filterDifficulty.value !== 'all') {
    result = result.filter(p => p.difficulty === filterDifficulty.value)
  }

  return result
})

const counts = {
  all: problems.length,
  easy: problems.filter(p => p.difficulty === 'easy').length,
  medium: problems.filter(p => p.difficulty === 'medium').length,
  hard: problems.filter(p => p.difficulty === 'hard').length,
}
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <Sparkles class="w-8 h-8 text-primary" />
        <h1 class="text-3xl font-bold">Coding Problems</h1>
      </div>
      <p class="text-muted-foreground text-lg">
        Practice coding problems with an integrated editor and compiler.
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search problems..."
          class="pl-9"
        />
      </div>
      <div class="flex gap-2">
        <Button
          v-for="(count, diff) in counts"
          :key="diff"
          :variant="filterDifficulty === diff ? 'default' : 'outline'"
          size="sm"
          @click="filterDifficulty = diff"
          class="capitalize"
        >
          {{ diff }} ({{ count }})
        </Button>
      </div>
    </div>

    <!-- Problems List -->
    <div class="space-y-2">
      <RouterLink
        v-for="(problem, idx) in filteredProblems"
        :key="problem.id"
        :to="`/problems/${problem.slug}`"
        class="group block"
      >
        <Card class="transition-all duration-200 hover:shadow-md hover:border-primary/20">
          <CardContent class="p-4 flex items-center gap-4">
            <span class="text-sm font-mono text-muted-foreground w-6 text-right shrink-0">
              {{ idx + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-semibold group-hover:text-primary transition-colors">
                  {{ problem.title }}
                </h3>
                <DifficultyBadge :difficulty="problem.difficulty" />
              </div>
              <div class="flex gap-1.5 mt-1.5 flex-wrap">
                <Badge v-for="tag in problem.tags" :key="tag" variant="secondary" class="text-xs">
                  {{ tag }}
                </Badge>
              </div>
            </div>
            <ArrowRight class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </CardContent>
        </Card>
      </RouterLink>
    </div>

    <div v-if="filteredProblems.length === 0" class="text-center py-16">
      <Search class="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-1">No problems found</h3>
      <p class="text-muted-foreground">Try adjusting your search or filters.</p>
    </div>
  </div>
</template>
