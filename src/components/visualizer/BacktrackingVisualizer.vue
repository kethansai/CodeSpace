<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep } from "@/data/types";

type BTNodeState = "exploring" | "chosen" | "rejected" | "solution";

interface BTNode {
  id: number;
  parentId: number | null;
  depth: number;
  label: string;
  state: BTNodeState;
}

interface BacktrackingData {
  title?: string;
  nodes: BTNode[];
  currentId: number | null;
  path: string[];
  results: string[];
  rejectReason?: string;
  board?: string[][];
  highlight?: [number, number];
}

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

const aux = computed<any>(() => props.currentStep?.auxiliaryData ?? {});
const bt = computed<BacktrackingData | null>(() => aux.value.backtracking ?? null);

// ── Tree layout ──
// Assign x/y per node: y = depth * LEVEL_H; x = bucket index at that depth.
// Bucket index is DFS-order among siblings grouped by depth — we lay them out in the
// order they appear in `nodes[]`, which is exactly recursion / insertion order.
interface LaidNode extends BTNode {
  x: number;
  y: number;
}

const LEVEL_H = 64;
const NODE_W = 56;
const GAP_X = 12;
const PAD_X = 24;

const laid = computed<LaidNode[]>(() => {
  const nodes = bt.value?.nodes ?? [];
  if (!nodes.length) return [];
  // Count nodes per depth, and assign a running x-index per depth.
  const slotByDepth: Map<number, number> = new Map();
  const result: LaidNode[] = [];
  for (const n of nodes) {
    const slot = slotByDepth.get(n.depth) ?? 0;
    slotByDepth.set(n.depth, slot + 1);
    result.push({
      ...n,
      x: PAD_X + slot * (NODE_W + GAP_X),
      y: 24 + n.depth * LEVEL_H,
    });
  }
  return result;
});

const svgWidth = computed(() => {
  const slots: Map<number, number> = new Map();
  for (const n of bt.value?.nodes ?? []) {
    slots.set(n.depth, (slots.get(n.depth) ?? 0) + 1);
  }
  const maxSlots = Math.max(1, ...slots.values());
  return PAD_X * 2 + maxSlots * (NODE_W + GAP_X);
});

const svgHeight = computed(() => {
  const maxDepth = Math.max(0, ...(bt.value?.nodes ?? []).map((n) => n.depth));
  return 48 + (maxDepth + 1) * LEVEL_H;
});

function nodeFor(id: number | null | undefined): LaidNode | undefined {
  if (id == null) return undefined;
  return laid.value.find((n) => n.id === id);
}

const edges = computed(() =>
  laid.value
    .filter((n) => n.parentId != null)
    .map((n) => ({
      id: n.id,
      from: nodeFor(n.parentId),
      to: n,
    }))
    .filter((e): e is { id: number; from: LaidNode; to: LaidNode } => !!e.from),
);

function stateClass(state: BTNodeState, isCurrent: boolean) {
  if (isCurrent) return "fill-amber-300 stroke-amber-600";
  switch (state) {
    case "solution":
      return "fill-emerald-300 stroke-emerald-600";
    case "rejected":
      return "fill-rose-200 stroke-rose-400 opacity-70";
    case "chosen":
      return "fill-slate-200 stroke-slate-400";
    default:
      return "fill-white stroke-slate-400";
  }
}

// ── Optional board / grid ──
const board = computed(() => bt.value?.board ?? null);
const highlight = computed(() => bt.value?.highlight ?? null);

function cellClass(r: number, c: number, ch: string) {
  const isHL = highlight.value && highlight.value[0] === r && highlight.value[1] === c;
  if (isHL) return "bg-amber-200 border-amber-500 text-amber-900";
  if (ch === "Q") return "bg-emerald-200 border-emerald-500 text-emerald-900";
  if (ch === "#") return "bg-slate-300 border-slate-400 text-slate-500";
  return "bg-white border-slate-300 text-slate-700";
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="bt?.title" class="text-sm font-medium text-slate-700">
      {{ bt.title }}
    </div>

    <!-- Current path / reject reason -->
    <div class="flex flex-wrap gap-2 text-xs">
      <span
        class="rounded border bg-slate-50 px-2 py-1 font-mono"
        :class="bt?.rejectReason ? 'border-rose-300 bg-rose-50 text-rose-800' : 'text-slate-700'"
      >
        path = [{{ bt?.path.join(", ") ?? "" }}]
      </span>
      <span
        v-if="bt?.rejectReason"
        class="rounded border border-rose-300 bg-rose-50 px-2 py-1 text-rose-800"
      >
        prune: {{ bt.rejectReason }}
      </span>
    </div>

    <!-- Optional grid / board -->
    <div v-if="board" class="inline-block rounded border border-slate-200 p-2 bg-white">
      <div
        v-for="(row, r) in board"
        :key="r"
        class="flex"
      >
        <div
          v-for="(ch, c) in row"
          :key="c"
          class="flex h-8 w-8 items-center justify-center border font-mono text-sm transition-colors"
          :class="cellClass(r, c, ch)"
        >
          {{ ch === "." ? "" : ch }}
        </div>
      </div>
    </div>

    <!-- Decision tree -->
    <div v-if="laid.length" class="overflow-x-auto rounded border border-slate-200 bg-white">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="block"
      >
        <!-- Edges first so nodes sit on top -->
        <g stroke="currentColor" class="text-slate-300">
          <line
            v-for="e in edges"
            :key="e.id"
            :x1="e.from.x + NODE_W / 2"
            :y1="e.from.y + 16"
            :x2="e.to.x + NODE_W / 2"
            :y2="e.to.y"
            stroke-width="1.5"
          />
        </g>

        <!-- Nodes -->
        <g
          v-for="n in laid"
          :key="n.id"
          :transform="`translate(${n.x}, ${n.y})`"
        >
          <rect
            :width="NODE_W"
            :height="32"
            rx="6"
            ry="6"
            :class="stateClass(n.state, n.id === bt?.currentId)"
            stroke-width="1.5"
          />
          <text
            :x="NODE_W / 2"
            y="20"
            text-anchor="middle"
            class="fill-slate-800 text-[11px] font-mono"
          >
            {{ n.label }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Collected solutions -->
    <div v-if="bt?.results.length" class="text-xs">
      <div class="mb-1 font-semibold text-slate-600">Results ({{ bt.results.length }}):</div>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="(r, i) in bt.results"
          :key="i"
          class="rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-emerald-800"
        >
          {{ r }}
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-3 text-[10px] text-slate-600">
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-amber-600 bg-amber-300" />
        current
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-slate-400 bg-slate-200" />
        chosen
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-emerald-600 bg-emerald-300" />
        solution
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-rose-400 bg-rose-200" />
        rejected / pruned
      </span>
    </div>
  </div>
</template>
