<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: 'default' | 'pulse' | 'shimmer'
}>()
</script>

<template>
  <div
    :class="cn(
      'rounded-md bg-primary/10',
      variant === 'shimmer' ? 'animate-shimmer bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 bg-[length:200%_100%]' : 'animate-pulse',
      props.class,
    )"
  />
</template>
