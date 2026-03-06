<script setup lang="ts">
import { computed, watch, ref } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

// ── Identity tracking for animated swaps ──
// Each element gets a stable ID. When two elements swap positions,
// the DOM nodes keep their keys and CSS transitions animate the movement.
const idMap = ref<number[]>([]);
const prevData = ref<number[]>([]);
let idCounter = 0;

watch(
  () => props.data,
  (newArr) => {
    if (!newArr?.length) {
      idMap.value = [];
      prevData.value = [];
      return;
    }
    const prev = prevData.value;
    if (!prev.length || prev.length !== newArr.length) {
      idMap.value = newArr.map(() => idCounter++);
      prevData.value = [...newArr];
      return;
    }
    const newIds = [...idMap.value];
    const changed: number[] = [];
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i] !== prev[i]) changed.push(i);
    }
    if (changed.length === 2) {
      const a = changed[0]!;
      const b = changed[1]!;
      if (newArr[a] === prev[b] && newArr[b] === prev[a]) {
        [newIds[a], newIds[b]] = [newIds[b]!, newIds[a]!];
      }
    } else if (changed.length > 2) {
      for (const i of changed) newIds[i] = idCounter++;
    }
    idMap.value = newIds;
    prevData.value = [...newArr];
  },
  { immediate: true },
);

// ── Sizing ──
const elemW = computed(() => {
  const n = props.data.length;
  if (n <= 6) return 58;
  if (n <= 10) return 46;
  if (n <= 16) return 36;
  return 28;
});
const gapSize = computed(() => {
  const n = props.data.length;
  if (n <= 6) return 14;
  if (n <= 10) return 10;
  return 6;
});
const containerW = computed(
  () =>
    props.data.length * elemW.value +
    Math.max(0, props.data.length - 1) * gapSize.value,
);
const maxVal = computed(() => Math.max(...props.data, 1));

function getHeight(v: number) {
  return 36 + (v / maxVal.value) * 156;
}
function getX(pos: number) {
  return pos * (elemW.value + gapSize.value);
}

// ── Action detection ──
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

// ── Color system ──
const colorMap: Record<string, { gradient: string; glow: string }> = {
  compare: {
    gradient: "linear-gradient(135deg,#fbbf24,#d97706)",
    glow: "rgba(251,191,36,0.45)",
  },
  swap: {
    gradient: "linear-gradient(135deg,#f87171,#dc2626)",
    glow: "rgba(248,113,113,0.45)",
  },
  highlight: {
    gradient: "linear-gradient(135deg,#818cf8,#4f46e5)",
    glow: "rgba(129,140,248,0.45)",
  },
  complete: {
    gradient: "linear-gradient(135deg,#4ade80,#16a34a)",
    glow: "rgba(74,222,128,0.45)",
  },
  pivot: {
    gradient: "linear-gradient(135deg,#c084fc,#9333ea)",
    glow: "rgba(192,132,252,0.45)",
  },
  visit: {
    gradient: "linear-gradient(135deg,#22d3ee,#0891b2)",
    glow: "rgba(34,211,238,0.45)",
  },
  insert: {
    gradient: "linear-gradient(135deg,#34d399,#059669)",
    glow: "rgba(52,211,153,0.45)",
  },
  remove: {
    gradient: "linear-gradient(135deg,#fb7185,#e11d48)",
    glow: "rgba(251,113,133,0.45)",
  },
  set: {
    gradient: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    glow: "rgba(167,139,250,0.45)",
  },
};
const defaultGrad = "linear-gradient(135deg,#60a5fa,#2563eb)";

function pillStyle(action: AnimationAction | null) {
  const c = action ? colorMap[action] : null;
  return {
    background: c?.gradient ?? defaultGrad,
    boxShadow: action
      ? `0 0 24px ${c?.glow ?? "transparent"}, 0 4px 16px rgba(0,0,0,0.25)`
      : "0 2px 10px rgba(0,0,0,0.18)",
  };
}

// ── SVG arcs between compared/swapped pairs ──
const arcs = computed(() => {
  if (!props.currentStep?.actions) return [];
  return props.currentStep.actions
    .filter(
      (a) =>
        (a.type === "compare" || a.type === "swap") && a.indices.length >= 2,
    )
    .map((a) => {
      const i = a.indices[0]!;
      const j = a.indices[1]!;
      const x1 = getX(i) + elemW.value / 2;
      const x2 = getX(j) + elemW.value / 2;
      const midX = (x1 + x2) / 2;
      const h = Math.min(Math.abs(x2 - x1) * 0.45, 55);
      return {
        d: `M${x1},10 Q${midX},${10 - h} ${x2},10`,
        color: a.type === "swap" ? "#f87171" : "#fbbf24",
      };
    });
});

// ── Elements sorted by stable ID for DOM consistency ──
const elements = computed(() =>
  props.data
    .map((value, position) => ({
      id: idMap.value[position] ?? position,
      value,
      position,
      action: getAction(position),
    }))
    .sort((a, b) => a.id - b.id),
);
</script>

<template>
  <div class="w-full flex justify-center select-none">
    <div
      class="relative"
      :style="{ width: `${containerW}px`, height: '260px' }"
    >
      <!-- Animated arcs connecting compared/swapped pairs -->
      <svg
        v-if="arcs.length"
        class="absolute inset-0 pointer-events-none z-10"
        :viewBox="`0 0 ${containerW} 260`"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          v-for="(arc, i) in arcs"
          :key="i"
          :d="arc.d"
          fill="none"
          :stroke="arc.color"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-dasharray="6 4"
          opacity="0.85"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="20"
            to="0"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <!-- Elements (keyed by stable ID — animates position changes) -->
      <div
        v-for="elem in elements"
        :key="elem.id"
        class="absolute bottom-6 flex flex-col items-center elem-shell"
        :style="{
          transform: `translateX(${getX(elem.position)}px)`,
          width: `${elemW}px`,
        }"
      >
        <!-- Glow ring -->
        <div
          v-if="elem.action"
          class="absolute rounded-2xl glow-ring"
          :style="{
            width: `${elemW + 12}px`,
            height: `${getHeight(elem.value) + 12}px`,
            bottom: '-6px',
            left: '-6px',
            background: colorMap[elem.action]?.glow ?? 'transparent',
          }"
        />

        <!-- Pill / Bar -->
        <div
          class="relative rounded-2xl flex items-center justify-center overflow-hidden pill"
          :style="{
            width: `${elemW}px`,
            height: `${getHeight(elem.value)}px`,
            ...pillStyle(elem.action),
            transform: elem.action ? 'scale(1.08)' : 'scale(1)',
          }"
        >
          <!-- Glass shine -->
          <div
            class="absolute inset-0 rounded-2xl pointer-events-none"
            style="
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.28) 0%,
                transparent 50%
              );
            "
          />
          <!-- Value -->
          <span
            class="relative z-10 font-bold text-white drop-shadow-md"
            :class="elemW >= 44 ? 'text-base' : 'text-xs'"
          >
            {{ elem.value }}
          </span>
          <!-- Complete badge -->
          <span
            v-if="elem.action === 'complete'"
            class="absolute top-0.5 right-1 text-[10px] text-white/90 drop-shadow complete-pop"
            >✓</span
          >
          <!-- Pivot indicator -->
          <span
            v-if="elem.action === 'pivot'"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 text-sm drop-shadow"
            >⭐</span
          >
        </div>

        <!-- Index label -->
        <span class="mt-1.5 text-[10px] font-mono text-muted-foreground/60">
          {{ elem.position }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.elem-shell {
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
.pill {
  transition:
    all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    height 0.35s ease;
  will-change: transform, box-shadow, background;
}
.glow-ring {
  filter: blur(12px);
  animation: pulse-glow 1.2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.65;
    transform: scale(1.04);
  }
}
.complete-pop {
  animation: pop 0.35s ease-out;
}
@keyframes pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
