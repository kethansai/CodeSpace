<script setup lang="ts">
import type { AnimationStep } from "@/data/types";
import SortingVisualizer from "./SortingVisualizer.vue";
import LinkedListVisualizer from "./LinkedListVisualizer.vue";
import TreeVisualizer from "./TreeVisualizer.vue";
import GraphVisualizer from "./GraphVisualizer.vue";
import StackQueueVisualizer from "./StackQueueVisualizer.vue";

defineProps<{
  mode: string;
  variant?: string;
  data: number[];
  currentStep: AnimationStep | null;
}>();
</script>

<template>
  <SortingVisualizer
    v-if="mode === 'sorting'"
    :data="data"
    :currentStep="currentStep"
  />
  <LinkedListVisualizer
    v-else-if="mode === 'linked-list'"
    :data="data"
    :currentStep="currentStep"
    :doubly="variant === 'doubly'"
  />
  <TreeVisualizer
    v-else-if="mode === 'tree'"
    :data="data"
    :currentStep="currentStep"
  />
  <GraphVisualizer
    v-else-if="mode === 'graph'"
    :data="data"
    :currentStep="currentStep"
  />
  <StackQueueVisualizer
    v-else-if="mode === 'stack-queue'"
    :data="data"
    :currentStep="currentStep"
    :variant="variant === 'queue' ? 'queue' : 'stack'"
  />
  <SortingVisualizer v-else :data="data" :currentStep="currentStep" />
</template>
