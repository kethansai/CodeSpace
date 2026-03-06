<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue?: number
  max?: number
}>()

const percentage = computed(() => {
  const val = props.modelValue ?? 0
  const maxVal = props.max ?? 100
  return Math.min(100, Math.max(0, (val / maxVal) * 100))
})
</script>

<template>
  <div :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', props.class)">
    <div
      class="h-full rounded-full bg-primary transition-all duration-500 ease-out"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>
