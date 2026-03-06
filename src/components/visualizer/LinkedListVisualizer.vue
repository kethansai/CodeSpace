<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
  doubly?: boolean;
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

const nodeW = 56;
const nodeH = 36;
const arrowGap = 40;
const unit = nodeW + arrowGap;
const pad = 28;

const svgW = computed(
  () =>
    props.data.length * nodeW +
    (props.data.length - 1) * arrowGap +
    pad * 2 +
    40,
);
const svgH = computed(() => (props.doubly ? 110 : 96));

function nx(i: number) {
  return pad + i * unit;
}
const ny = 22;

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
  <div class="w-full flex justify-center select-none overflow-x-auto py-2">
    <svg
      :width="svgW"
      :height="svgH"
      :viewBox="`0 0 ${svgW} ${svgH}`"
      class="w-full h-auto"
      style="max-height: 130px"
    >
      <defs>
        <marker
          id="ll-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" class="fill-muted-foreground" />
        </marker>
        <marker
          id="ll-arrow-rev"
          markerWidth="8"
          markerHeight="6"
          refX="0"
          refY="3"
          orient="auto"
        >
          <path d="M8,0 L0,3 L8,6 Z" class="fill-muted-foreground/40" />
        </marker>
        <filter id="ll-glow">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g v-for="(val, i) in data" :key="i">
        <!-- Forward arrow -->
        <g v-if="i < data.length - 1">
          <line
            :x1="nx(i) + nodeW"
            :y1="ny + nodeH / 2"
            :x2="nx(i + 1) - 2"
            :y2="ny + nodeH / 2"
            stroke="currentColor"
            stroke-width="2"
            class="text-muted-foreground/50"
            marker-end="url(#ll-arrow)"
            style="transition: stroke 0.3s"
          />
          <!-- Reverse arrow (doubly linked) -->
          <line
            v-if="doubly"
            :x1="nx(i + 1)"
            :y1="ny + nodeH / 2 + 10"
            :x2="nx(i) + nodeW + 2"
            :y2="ny + nodeH / 2 + 10"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-muted-foreground/30"
            stroke-dasharray="4 2"
            marker-end="url(#ll-arrow-rev)"
          />
        </g>

        <!-- Null pointer after last -->
        <g v-if="i === data.length - 1">
          <line
            :x1="nx(i) + nodeW"
            :y1="ny + nodeH / 2"
            :x2="nx(i) + nodeW + 18"
            :y2="ny + nodeH / 2"
            stroke="currentColor"
            stroke-width="2"
            class="text-muted-foreground/30"
          />
          <text
            :x="nx(i) + nodeW + 22"
            :y="ny + nodeH / 2 + 4"
            class="fill-muted-foreground/40 italic"
            style="font-size: 11px"
          >
            null
          </text>
        </g>

        <!-- Glow ring -->
        <rect
          v-if="getAction(i)"
          :x="nx(i) - 4"
          :y="ny - 4"
          :width="nodeW + 8"
          :height="nodeH + 8"
          rx="12"
          fill="none"
          :stroke="fills[getAction(i)!] ?? '#60a5fa'"
          stroke-width="2"
          opacity="0.7"
          filter="url(#ll-glow)"
        >
          <animate
            attributeName="opacity"
            values="0.35;0.85;0.35"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </rect>

        <!-- Node rectangle -->
        <rect
          :x="nx(i)"
          :y="ny"
          :width="nodeW"
          :height="nodeH"
          rx="8"
          :fill="
            getAction(i)
              ? (fills[getAction(i)!] ?? '#60a5fa')
              : 'var(--card, #1e293b)'
          "
          :stroke="getAction(i) ? 'none' : 'currentColor'"
          stroke-width="1"
          class="text-border"
          style="transition: fill 0.35s ease"
        />
        <!-- Glass shine -->
        <rect
          :x="nx(i)"
          :y="ny"
          :width="nodeW"
          :height="nodeH / 2"
          rx="8"
          fill="rgba(255,255,255,0.12)"
          style="pointer-events: none"
        />
        <!-- Value -->
        <text
          :x="nx(i) + nodeW / 2"
          :y="ny + nodeH / 2 + 5"
          text-anchor="middle"
          :class="getAction(i) ? 'fill-white font-bold' : 'fill-foreground'"
          style="font-size: 14px"
        >
          {{ val }}
        </text>

        <!-- Head label -->
        <text
          v-if="i === 0"
          :x="nx(0) + nodeW / 2"
          :y="ny + nodeH + 16"
          text-anchor="middle"
          class="fill-primary font-semibold"
          style="font-size: 10px"
        >
          head
        </text>
      </g>
    </svg>
  </div>
</template>
