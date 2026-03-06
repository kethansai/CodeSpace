<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProblemBySlug } from '@/data/problems'
import { SUPPORTED_LANGUAGES } from '@/config/app'
import { usePreferencesStore } from '@/stores/preferences'
import MarkdownRenderer from '@/components/content/MarkdownRenderer.vue'
import DifficultyBadge from '@/components/content/DifficultyBadge.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import CodeRunner from '@/components/editor/CodeRunner.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import { ArrowLeft, Eye, EyeOff, Lightbulb, RotateCcw } from 'lucide-vue-next'

const route = useRoute()
const preferences = usePreferencesStore()

const problem = computed(() => getProblemBySlug(route.params.slug as string))

const selectedLang = ref(preferences.preferredLanguage)
const showSolution = ref(false)
const showHint = ref(-1)

const langConfig = computed(() =>
  SUPPORTED_LANGUAGES.find(l => l.id === selectedLang.value) ?? SUPPORTED_LANGUAGES[0]
)

const code = ref('')

// Initialize code with starter code
watch([problem, selectedLang], () => {
  if (problem.value) {
    const starter = problem.value.starterCode[selectedLang.value as keyof typeof problem.value.starterCode]
    code.value = starter || `// Start coding in ${selectedLang.value}...\n`
  }
}, { immediate: true })

function resetCode() {
  if (problem.value) {
    const starter = problem.value.starterCode[selectedLang.value as keyof typeof problem.value.starterCode]
    code.value = starter || ''
  }
}

function loadSolution() {
  if (problem.value) {
    const sol = problem.value.solution[selectedLang.value as keyof typeof problem.value.solution]
    if (sol) {
      code.value = sol
      showSolution.value = true
    }
  }
}
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 md:py-12">
    <RouterLink to="/problems" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
      <ArrowLeft class="w-4 h-4" />
      All Problems
    </RouterLink>

    <template v-if="problem">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Problem Description -->
        <div class="space-y-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold">{{ problem.title }}</h1>
              <DifficultyBadge :difficulty="problem.difficulty" />
            </div>
            <div class="flex gap-1.5 flex-wrap">
              <Badge v-for="tag in problem.tags" :key="tag" variant="secondary" class="text-xs">
                {{ tag }}
              </Badge>
            </div>
          </div>

          <div class="prose-content">
            <MarkdownRenderer :content="problem.description" />
          </div>

          <!-- Test Cases -->
          <Card>
            <CardContent class="p-4">
              <h3 class="font-semibold mb-3">Test Cases</h3>
              <div class="space-y-2">
                <div
                  v-for="(tc, idx) in problem.testCases"
                  :key="idx"
                  class="text-sm bg-muted rounded-lg p-3"
                >
                  <div class="text-muted-foreground mb-1">Case {{ idx + 1 }}:</div>
                  <div><strong>Input:</strong> <code class="text-xs">{{ tc.input }}</code></div>
                  <div><strong>Expected:</strong> <code class="text-xs">{{ tc.expectedOutput }}</code></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Hints -->
          <Card v-if="problem.hints?.length">
            <CardContent class="p-4">
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb class="w-4 h-4 text-amber-500" />
                Hints
              </h3>
              <div class="space-y-2">
                <div v-for="(hint, idx) in problem.hints" :key="idx">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-sm w-full justify-start"
                    @click="showHint = showHint === idx ? -1 : idx"
                  >
                    <Eye v-if="showHint !== idx" class="w-3.5 h-3.5 mr-2" />
                    <EyeOff v-else class="w-3.5 h-3.5 mr-2" />
                    Hint {{ idx + 1 }}
                  </Button>
                  <p v-if="showHint === idx" class="text-sm text-muted-foreground mt-1 ml-8">
                    {{ hint }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right: Code Editor -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <select
              v-model="selectedLang"
              class="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
            >
              <option v-for="lang in SUPPORTED_LANGUAGES" :key="lang.id" :value="lang.id">
                {{ lang.name }}
              </option>
            </select>
            <div class="flex gap-2">
              <Button variant="ghost" size="sm" @click="resetCode" class="gap-1.5">
                <RotateCcw class="w-3.5 h-3.5" /> Reset
              </Button>
              <Button
                :variant="showSolution ? 'default' : 'outline'"
                size="sm"
                @click="loadSolution"
                class="gap-1.5"
              >
                <Eye class="w-3.5 h-3.5" /> Solution
              </Button>
            </div>
          </div>

          <div class="border border-border rounded-lg overflow-hidden" style="height: 400px">
            <CodeEditor
              v-model="code"
              :language="langConfig.monacoId"
            />
          </div>

          <CodeRunner :code="code" :language="selectedLang" />
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold mb-2">Problem Not Found</h2>
      <p class="text-muted-foreground mb-4">This problem doesn't exist.</p>
      <RouterLink to="/problems" class="text-primary hover:underline">View All Problems</RouterLink>
    </div>
  </div>
</template>
