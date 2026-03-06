<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'
import { DIFFICULTY_COLORS } from '@/config/app'

const props = defineProps<{
  difficulty: 'easy' | 'medium' | 'hard'
}>()

const colors = DIFFICULTY_COLORS[props.difficulty]
</script>

<template>
  <Badge
    variant="outline"
    :class="[colors.bg, colors.text, colors.border, 'border capitalize']"
  >
    {{ difficulty }}
  </Badge>
</template>
