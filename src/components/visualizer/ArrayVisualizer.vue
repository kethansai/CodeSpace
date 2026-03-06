<script setup lang="ts">
import { ref, computed } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
  width?: number;
  height?: number;
}>();

const containerRef = ref<HTMLDivElement>();
const svgWidth = computed(() => props.width || 600);
const svgHeight = computed(() => props.height || 300);

const barWidth = computed(() => {
  const count = props.data.length;
  if (count === 0) return 0;
  const totalGap = (count - 1) * 4;
  return Math.min((svgWidth.value - 40 - totalGap) / count, 60);
});

const maxValue = computed(() => Math.max(...props.data, 1));

function getBarHeight(value: number) {
  return Math.max(4, (value / maxValue.value) * (svgHeight.value - 60));
}

function getBarX(index: number) {
  return 20 + index * (barWidth.value + 4);
}

function getBarY(value: number) {
  return svgHeight.value - 30 - getBarHeight(value);
}

// Build a map of index → action type from the current step's actions array
function getActionForIndex(index: number): AnimationAction | null {
  if (!props.currentStep) return null;

  // Support both new `actions` array format and legacy `action`/`indices` format
  const step = props.currentStep;
  if (step.actions && step.actions.length > 0) {
    for (const act of step.actions) {
      if (act.indices && act.indices.includes(index)) {
        return act.type;
      }
    }
    return null;
  }

  // Legacy format fallback
  if (step.indices && step.indices.includes(index) && step.action) {
    return step.action;
  }
  return null;
}

const actionColorMap: Record<AnimationAction, string> = {
  compare: "#f59e0b", // amber
  swap: "#ef4444", // red
  highlight: "#6366f1", // indigo
  complete: "#22c55e", // green
  pivot: "#a855f7", // purple
  visit: "#06b6d4", // cyan
  insert: "#10b981", // emerald
  remove: "#f43f5e", // rose
  set: "#8b5cf6", // violet
};

function getBarColor(index: number): string {
  const action = getActionForIndex(index);
  if (!action) return "var(--primary)";
  return actionColorMap[action] || "var(--primary)";
}

function getBarOpacity(index: number): number {
  if (!props.currentStep) return 0.8;
  const action = getActionForIndex(index);
  return action ? 1 : 0.4;
}

function isActiveIndex(index: number): boolean {
  return getActionForIndex(index) !== null;
}
</script>

<template>
  <div ref="containerRef" class="w-full">
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="w-full h-auto"
    >
      <!-- Bars -->
      <g v-for="(value, index) in data" :key="index">
        <!-- Glow effect for active bars -->
        <rect
          v-if="isActiveIndex(index)"
          :x="getBarX(index) - 2"
          :y="getBarY(value) - 2"
          :width="barWidth + 4"
          :height="getBarHeight(value) + 4"
          :fill="getBarColor(index)"
          opacity="0.2"
          rx="6"
          class="transition-all duration-300 ease-in-out"
        />
        <rect
          :x="getBarX(index)"
          :y="getBarY(value)"
          :width="barWidth"
          :height="getBarHeight(value)"
          :fill="getBarColor(index)"
          :opacity="getBarOpacity(index)"
          rx="4"
          class="transition-all duration-300 ease-in-out"
        />
        <!-- Value label -->
        <text
          :x="getBarX(index) + barWidth / 2"
          :y="getBarY(value) - 8"
          text-anchor="middle"
          class="text-xs fill-muted-foreground font-mono"
          :font-weight="isActiveIndex(index) ? 'bold' : 'normal'"
        >
          {{ value }}
        </text>
        <!-- Index label -->
        <text
          :x="getBarX(index) + barWidth / 2"
          :y="svgHeight - 10"
          text-anchor="middle"
          class="text-[10px] fill-muted-foreground/60 font-mono"
        >
          {{ index }}
        </text>
      </g>

      <!-- Legend -->
      <g :transform="`translate(${svgWidth - 200}, 10)`">
        <g
          v-for="(item, i) in [
            { color: '#f59e0b', label: 'Comparing' },
            { color: '#ef4444', label: 'Swapping' },
            { color: '#22c55e', label: 'Complete' },
            { color: '#a855f7', label: 'Pivot' },
          ]"
          :key="item.label"
          :transform="`translate(${(i % 2) * 90}, ${Math.floor(i / 2) * 16})`"
        >
          <rect :width="8" :height="8" :fill="item.color" rx="2" />
          <text x="12" y="8" class="text-[9px] fill-muted-foreground">
            {{ item.label }}
          </text>
        </g>
      </g>
    </svg>

    <!-- Step description -->
    <div v-if="currentStep" class="mt-3 px-2">
      <p class="text-sm text-muted-foreground">
        {{ currentStep.description }}
      </p>
    </div>
  </div>
</template>
