<script setup lang="ts">
import { AVAILABLE_LANGUAGES } from '@/config/app'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="appearance-none bg-muted border border-input rounded-md px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
    >
      <option v-for="lang in AVAILABLE_LANGUAGES" :key="lang.id" :value="lang.id">
        {{ lang.name }}
      </option>
    </select>
    <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
  </div>
</template>
