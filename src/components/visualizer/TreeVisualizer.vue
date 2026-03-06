<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

function getAction(idx: number): AnimationAction | null {
  if (!props.currentStep) return null;
  const s = props.currentStep;
  if (s.actions?.length) {
    for (const a of s.actions) {
      if (a.indices?.includes(idx)) return a.type;
    }
  }
  if (s.indices?.includes(idx) && s.action) return s.action;
  return null;
}

const nodeR = 22;
const levelH = 72;
const svgW = 520;
const pad = 30;

const maxDepth = computed(() => {
  if (!props.data.length) return 0;
  return Math.floor(Math.log2(props.data.length));
});

const svgH = computed(() => (maxDepth.value + 1) * levelH + pad * 2);

function nodePos(i: number): { x: number; y: number } {
  const level = Math.floor(Math.log2(i + 1));
  const posInLevel = i - (Math.pow(2, level) - 1);
  const totalInLevel = Math.pow(2, level);
  const slotW = (svgW - pad * 2) / totalInLevel;
  return {
    x: pad + slotW * posInLevel + slotW / 2,
    y: pad + level * levelH + nodeR,
  };
}

function parentIdx(i: number) {
  return Math.floor((i - 1) / 2);
}

const fills: Record<string, string> = {
  compare: "#fbbf24",
  swap: "#f87171",
  highlight: "#818cf8",
  complete: "#4ade80",
  pivot: "#c084fc",
  visit: "#22d3ee",
  insert: "#34d399",
  remove: "#fb7185",
  set: "#a78bfa",
};
</script>

<template>
  <div class="w-full flex justify-center select-none py-2">
    <svg
      :width="svgW"
      :height="svgH"
      :viewBox="`0 0 ${svgW} ${svgH}`"
      class="w-full h-auto"
      style="max-height: 320px"
    >
      <defs>
        <filter id="tree-glow">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="tree-shine">
          <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <!-- Edges (behind nodes) -->
      <line
        v-for="(_, i) in data"
        v-show="i > 0"
        :key="'e-' + i"
        :x1="nodePos(parentIdx(i)).x"
        :y1="nodePos(parentIdx(i)).y"
        :x2="nodePos(i).x"
        :y2="nodePos(i).y"
        stroke="currentColor"
        :stroke-width="getAction(i) || getAction(parentIdx(i)) ? 2.5 : 1.5"
        :class="
          getAction(i) || getAction(parentIdx(i))
            ? 'text-primary/50'
            : 'text-border'
        "
        stroke-linecap="round"
        style="transition: all 0.35s ease"
      />

      <!-- Nodes -->
      <g v-for="(val, i) in data" :key="'n-' + i">
        <!-- Animated glow -->
        <circle
          v-if="getAction(i)"
          :cx="nodePos(i).x"
          :cy="nodePos(i).y"
          :r="nodeR + 6"
          :fill="fills[getAction(i)!] ?? '#60a5fa'"
          opacity="0.3"
          filter="url(#tree-glow)"
        >
          <animate
            attributeName="r"
            :values="`${nodeR + 4};${nodeR + 12};${nodeR + 4}`"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>

        <!-- Node circle -->
        <circle
          :cx="nodePos(i).x"
          :cy="nodePos(i).y"
          :r="nodeR"
          :fill="
            getAction(i)
              ? (fills[getAction(i)!] ?? '#60a5fa')
              : 'var(--card, #1e293b)'
          "
          :stroke="getAction(i) ? 'none' : 'currentColor'"
          stroke-width="1.5"
          class="text-border"
          style="transition: fill 0.35s ease"
        />

        <!-- Shine -->
        <circle
          :cx="nodePos(i).x"
          :cy="nodePos(i).y"
          :r="nodeR"
          fill="url(#tree-shine)"
          style="pointer-events: none"
        />

        <!-- Value -->
        <text
          :x="nodePos(i).x"
          :y="nodePos(i).y + 5"
          text-anchor="middle"
          :class="getAction(i) ? 'fill-white font-bold' : 'fill-foreground'"
          style="font-size: 13px"
        >
          {{ val }}
        </text>
      </g>
    </svg>
  </div>
</template>
