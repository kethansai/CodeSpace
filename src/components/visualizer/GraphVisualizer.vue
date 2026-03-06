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

const nodeR = 24;
const svgSize = 400;
const cx = svgSize / 2;
const cy = svgSize / 2;
const ringR = svgSize / 2 - 55;

function nodePos(i: number): { x: number; y: number } {
  const n = props.data.length || 1;
  const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
  return {
    x: cx + ringR * Math.cos(angle),
    y: cy + ringR * Math.sin(angle),
  };
}

// Edges: ring of connections + a few cross-edges for visual richness
const edges = computed(() => {
  const n = props.data.length;
  const e: Array<{ from: number; to: number }> = [];
  for (let i = 0; i < n - 1; i++) e.push({ from: i, to: i + 1 });
  if (n > 2) e.push({ from: n - 1, to: 0 }); // close the ring
  if (n >= 5) e.push({ from: 0, to: Math.floor(n / 2) });
  if (n >= 7) e.push({ from: 1, to: n - 2 });
  return e;
});

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
      :width="svgSize"
      :height="svgSize"
      :viewBox="`0 0 ${svgSize} ${svgSize}`"
      class="w-full h-auto"
      style="max-height: 340px"
    >
      <defs>
        <filter id="graph-glow">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="g-arrow"
          markerWidth="8"
          markerHeight="6"
          :refX="nodeR + 8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" class="fill-muted-foreground/50" />
        </marker>
        <radialGradient id="g-shine">
          <stop offset="0%" stop-color="rgba(255,255,255,0.15)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <!-- Edges -->
      <line
        v-for="(edge, i) in edges"
        :key="'e-' + i"
        :x1="nodePos(edge.from).x"
        :y1="nodePos(edge.from).y"
        :x2="nodePos(edge.to).x"
        :y2="nodePos(edge.to).y"
        stroke="currentColor"
        :stroke-width="getAction(edge.from) && getAction(edge.to) ? 2.5 : 1.5"
        :class="
          getAction(edge.from) && getAction(edge.to)
            ? 'text-primary/50'
            : 'text-border'
        "
        stroke-linecap="round"
        marker-end="url(#g-arrow)"
        style="transition: all 0.35s ease"
      />

      <!-- Nodes -->
      <g v-for="(val, i) in data" :key="'n-' + i">
        <!-- Glow -->
        <circle
          v-if="getAction(i)"
          :cx="nodePos(i).x"
          :cy="nodePos(i).y"
          :r="nodeR + 7"
          :fill="fills[getAction(i)!] ?? '#60a5fa'"
          opacity="0.3"
          filter="url(#graph-glow)"
        >
          <animate
            attributeName="r"
            :values="`${nodeR + 4};${nodeR + 12};${nodeR + 4}`"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>

        <!-- Circle -->
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
          fill="url(#g-shine)"
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

        <!-- Index label outside the ring -->
        <text
          :x="nodePos(i).x + (nodePos(i).x - cx) * 0.22"
          :y="nodePos(i).y + (nodePos(i).y - cy) * 0.22 + 3"
          text-anchor="middle"
          class="fill-muted-foreground/40"
          style="font-size: 9px; font-family: monospace"
        >
          {{ i }}
        </text>
      </g>
    </svg>
  </div>
</template>
