<script setup lang="ts">
import { ref } from 'vue'
import { useCodeExecution } from '@/composables/useCodeExecution'
import Button from '@/components/ui/Button.vue'
import { Play, Loader2, RotateCcw, Terminal } from 'lucide-vue-next'

const props = defineProps<{
  code: string
  language: string
  stdin?: string
}>()

const { isExecuting, result, error, execute, reset } = useCodeExecution()

async function runCode() {
  await execute(props.code, props.language, props.stdin)
}
</script>

<template>
  <div class="rounded-lg border overflow-hidden">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Terminal class="w-4 h-4" />
        <span>Output</span>
      </div>
      <div class="flex items-center gap-2">
        <Button v-if="result" variant="ghost" size="sm" @click="reset">
          <RotateCcw class="w-3.5 h-3.5 mr-1" />
          Clear
        </Button>
        <Button size="sm" @click="runCode" :disabled="isExecuting" class="gap-1.5">
          <Loader2 v-if="isExecuting" class="w-3.5 h-3.5 animate-spin" />
          <Play v-else class="w-3.5 h-3.5" />
          {{ isExecuting ? 'Running...' : 'Run Code' }}
        </Button>
      </div>
    </div>

    <!-- Output -->
    <div class="p-4 min-h-[120px] max-h-[300px] overflow-auto bg-background font-mono text-sm">
      <template v-if="isExecuting">
        <div class="flex items-center gap-2 text-muted-foreground">
          <div class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Executing...
        </div>
      </template>
      <template v-else-if="result">
        <pre v-if="result.output" class="text-foreground whitespace-pre-wrap">{{ result.output }}</pre>
        <pre v-if="result.stderr" class="text-red-500 whitespace-pre-wrap mt-2">{{ result.stderr }}</pre>
        <div v-if="!result.output && !result.stderr" class="text-muted-foreground italic">
          No output
        </div>
        <div v-if="result.exitCode !== 0" class="mt-2 text-xs text-muted-foreground">
          Exit code: {{ result.exitCode }}
        </div>
      </template>
      <template v-else-if="error">
        <pre class="text-red-500 whitespace-pre-wrap">{{ error }}</pre>
      </template>
      <template v-else>
        <p class="text-muted-foreground italic">Click "Run Code" to execute</p>
      </template>
    </div>
  </div>
</template>
