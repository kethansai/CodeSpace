<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { TabsRoot, type TabsRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <TabsRoot v-bind="props" :class="cn(props.class)" @update:model-value="(v: any) => emits('update:modelValue', v)">
    <slot />
  </TabsRoot>
</template>
