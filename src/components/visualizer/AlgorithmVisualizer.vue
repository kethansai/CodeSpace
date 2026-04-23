<script setup lang="ts">
import type { AnimationStep } from "@/data/types";
import SortingVisualizer from "./SortingVisualizer.vue";
import LinkedListVisualizer from "./LinkedListVisualizer.vue";
import TreeVisualizer from "./TreeVisualizer.vue";
import GraphVisualizer from "./GraphVisualizer.vue";
import StackQueueVisualizer from "./StackQueueVisualizer.vue";
import DPVisualizer from "./DPVisualizer.vue";
import GreedyVisualizer from "./GreedyVisualizer.vue";
import BacktrackingVisualizer from "./BacktrackingVisualizer.vue";
import BitManipulationVisualizer from "./BitManipulationVisualizer.vue";

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
  <DPVisualizer
    v-else-if="mode === 'dp'"
    :data="data"
    :currentStep="currentStep"
  />
  <GreedyVisualizer
    v-else-if="mode === 'greedy'"
    :data="data"
    :currentStep="currentStep"
  />
  <BacktrackingVisualizer
    v-else-if="mode === 'backtracking'"
    :data="data"
    :currentStep="currentStep"
  />
  <BitManipulationVisualizer
    v-else-if="mode === 'bit'"
    :data="data"
    :currentStep="currentStep"
  />
  <SortingVisualizer v-else :data="data" :currentStep="currentStep" />
</template>
