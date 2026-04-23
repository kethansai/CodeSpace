<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

/**
 * Binary-tree aware visualizer.
 *
 * Supports two input modes:
 *
 * 1. Explicit tree (preferred) — `auxiliaryData.tree`:
 *    ```
 *    {
 *      nodes: [{ id, value, left?: id|null, right?: id|null, state? }, ...],
 *      rootId: number,
 *    }
 *    ```
 *    `actions.indices` and `pointers` refer to node ids. `state` is an
 *    optional per-node tag: `"path" | "found" | "active" | "discarded"`.
 *
 * 2. Legacy heap mode — no `auxiliaryData.tree`. `data` / `currentStep.array`
 *    is treated as a complete binary tree where index `i` has children at
 *    `2i+1` and `2i+2`. `undefined`/`null` entries are skipped.
 *
 * Extras:
 *  - `auxiliaryData.resultList`: string printed below the tree (traversal
 *    output, BFS order, found path, …).
 *  - `auxiliaryData.labels`: `{ [id]: string }` — small subtitle under a node
 *    (e.g. "min/max", "height=3").
 *  - `auxiliaryData.edgeStates`: `{ [childId]: "path"|"active"|"discarded" }`
 *    — styles the edge from parent to this child.
 */

type NodeState = "path" | "found" | "active" | "discarded" | "inserted" | "removed";

interface TreeNode {
  id: number;
  value: number | string;
  left?: number | null;
  right?: number | null;
  state?: NodeState;
}

interface TreeData {
  nodes: TreeNode[];
  rootId: number;
}

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

const aux = computed<any>(() => props.currentStep?.auxiliaryData ?? {});

const explicitTree = computed<TreeData | null>(() => aux.value.tree ?? null);

// ─── Legacy heap layout ───
const heapArray = computed<(number | null | undefined)[]>(() => {
  const src = (props.currentStep?.array as (number | null | undefined)[])
    ?? (props.data as (number | null | undefined)[]);
  return src ?? [];
});

// Unified node list with (x, y) positions computed by in-order counter.
interface LaidOutNode {
  id: number;
  value: number | string;
  depth: number;
  x: number; // in-order counter (normalized later)
  parent: number | null;
  state?: NodeState;
}

interface Layout {
  nodes: LaidOutNode[];
  byId: Map<number, LaidOutNode>;
  maxDepth: number;
  xCount: number;
}

const layout = computed<Layout>(() => {
  const tree = explicitTree.value;
  if (tree) return layoutExplicit(tree);
  return layoutHeap(heapArray.value);
});

function layoutExplicit(t: TreeData): Layout {
  const byId = new Map<number, TreeNode>();
  for (const n of t.nodes) byId.set(n.id, n);

  const out: LaidOutNode[] = [];
  const outById = new Map<number, LaidOutNode>();
  let counter = 0;
  let maxDepth = 0;

  function walk(id: number, depth: number, parent: number | null) {
    const n = byId.get(id);
    if (!n) return;
    if (depth > maxDepth) maxDepth = depth;
    if (n.left != null) walk(n.left as number, depth + 1, id);
    const rec: LaidOutNode = {
      id: n.id,
      value: n.value,
      depth,
      x: counter++,
      parent,
      state: n.state,
    };
    out.push(rec);
    outById.set(n.id, rec);
    if (n.right != null) walk(n.right as number, depth + 1, id);
  }

  if (t.rootId != null && byId.has(t.rootId)) {
    walk(t.rootId, 0, null);
  }
  return { nodes: out, byId: outById, maxDepth, xCount: Math.max(1, counter) };
}

function layoutHeap(arr: (number | null | undefined)[]): Layout {
  const out: LaidOutNode[] = [];
  const byId = new Map<number, LaidOutNode>();
  let counter = 0;
  let maxDepth = 0;

  function walk(i: number, depth: number, parent: number | null) {
    if (i >= arr.length) return;
    const v = arr[i];
    if (v === null || v === undefined) return;
    if (depth > maxDepth) maxDepth = depth;
    walk(2 * i + 1, depth + 1, i);
    const rec: LaidOutNode = {
      id: i,
      value: v as number,
      depth,
      x: counter++,
      parent,
    };
    out.push(rec);
    byId.set(i, rec);
    walk(2 * i + 2, depth + 1, i);
  }
  walk(0, 0, null);
  return { nodes: out, byId, maxDepth, xCount: Math.max(1, counter) };
}

// ─── Pixel layout ───
const nodeR = 22;
const levelH = 72;
const pad = 36;

const svgW = computed(() => {
  const cols = layout.value.xCount;
  // ~60px per column, clamped to a reasonable range
  return Math.max(420, Math.min(980, pad * 2 + cols * 64));
});
const svgH = computed(
  () => (layout.value.maxDepth + 1) * levelH + pad * 2 - 20,
);

function px(n: LaidOutNode) {
  const cols = layout.value.xCount;
  const slotW = (svgW.value - pad * 2) / cols;
  const x = pad + slotW * n.x + slotW / 2;
  const y = pad + n.depth * levelH + nodeR;
  return { x, y };
}

// Parent-child edges
interface Edge {
  key: string;
  from: LaidOutNode;
  to: LaidOutNode;
  state?: NodeState;
}
const edges = computed<Edge[]>(() => {
  const es: Edge[] = [];
  const map = layout.value.byId;
  const states: Record<number, NodeState> = aux.value.edgeStates ?? {};
  for (const n of layout.value.nodes) {
    if (n.parent == null) continue;
    const p = map.get(n.parent);
    if (!p) continue;
    es.push({
      key: `e-${p.id}-${n.id}`,
      from: p,
      to: n,
      state: states[n.id] ?? n.state,
    });
  }
  return es;
});

const pointers = computed<Record<string, number>>(
  () => props.currentStep?.pointers ?? {},
);
interface PointerGroup {
  id: number;
  names: string[];
}
const pointerGroups = computed<PointerGroup[]>(() => {
  const m = new Map<number, string[]>();
  for (const [name, id] of Object.entries(pointers.value)) {
    const n = typeof id === "number" ? id : Number(id);
    if (!Number.isFinite(n)) continue;
    if (!layout.value.byId.has(n)) continue;
    if (!m.has(n)) m.set(n, []);
    m.get(n)!.push(name);
  }
  return [...m.entries()].map(([id, names]) => ({ id, names }));
});

const labels = computed<Record<number, string>>(
  () => aux.value.labels ?? {},
);

// ─── Styling ───
const actionFills: Record<string, string> = {
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
const stateFills: Record<NodeState, string> = {
  path: "#818cf8",
  found: "#4ade80",
  active: "#fbbf24",
  discarded: "#64748b",
  inserted: "#34d399",
  removed: "#fb7185",
};

const pointerPalette: Record<string, string> = {
  curr: "#60a5fa",
  cur: "#60a5fa",
  node: "#60a5fa",
  root: "#a78bfa",
  p: "#60a5fa",
  q: "#f472b6",
  lca: "#4ade80",
  target: "#fbbf24",
  min: "#94a3b8",
  max: "#94a3b8",
};
function pointerColor(name: string) {
  return pointerPalette[name] ?? "#60a5fa";
}

function getAction(id: number): AnimationAction | null {
  const s = props.currentStep;
  if (!s) return null;
  if (s.actions?.length) {
    for (const a of s.actions) if (a.indices?.includes(id)) return a.type;
  }
  if (s.indices?.includes(id) && s.action) return s.action;
  return null;
}

function nodeFill(n: LaidOutNode): string {
  const action = getAction(n.id);
  if (action) return actionFills[action] ?? "#60a5fa";
  if (n.state) return stateFills[n.state];
  return "var(--card, #1e293b)";
}

function nodeIsFilled(n: LaidOutNode) {
  return !!getAction(n.id) || !!n.state;
}

function edgeStroke(state?: NodeState) {
  if (!state) return "currentColor";
  switch (state) {
    case "path":
    case "active":
      return "#fbbf24";
    case "found":
    case "inserted":
      return "#4ade80";
    case "discarded":
      return "rgba(148,163,184,0.35)";
    case "removed":
      return "#fb7185";
    default:
      return "currentColor";
  }
}
function edgeWidth(state?: NodeState) {
  if (!state) return 1.5;
  if (state === "discarded") return 1.2;
  return 2.4;
}
function edgeDash(state?: NodeState) {
  if (state === "discarded") return "5 3";
  return undefined;
}

const resultList = computed<string | null>(() => {
  const r = aux.value.resultList;
  if (r == null) return null;
  if (Array.isArray(r)) return r.join(" → ");
  return String(r);
});
</script>

<template>
  <div class="w-full flex flex-col items-center select-none py-2">
    <svg
      :width="svgW"
      :height="svgH"
      :viewBox="`0 0 ${svgW} ${svgH}`"
      class="w-full h-auto"
      style="max-height: 340px"
    >
      <defs>
        <filter id="tree-glow">
          <feGaussianBlur stdDeviation="4" result="b" />
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

      <!-- Edges -->
      <line
        v-for="e in edges"
        :key="e.key"
        :x1="px(e.from).x"
        :y1="px(e.from).y"
        :x2="px(e.to).x"
        :y2="px(e.to).y"
        :stroke="edgeStroke(e.state)"
        :stroke-width="edgeWidth(e.state)"
        :stroke-dasharray="edgeDash(e.state)"
        :class="e.state ? '' : 'text-border'"
        stroke-linecap="round"
        style="transition: all 0.35s ease"
      />

      <!-- Nodes -->
      <g v-for="n in layout.nodes" :key="`n-${n.id}`">
        <!-- Pointer labels -->
        <template
          v-for="pg in pointerGroups.filter((g) => g.id === n.id)"
          :key="`pg-${n.id}`"
        >
          <template v-for="(name, ni) in pg.names" :key="`pt-${n.id}-${ni}`">
            <text
              :x="px(n).x"
              :y="px(n).y - nodeR - 10 - ni * 13"
              text-anchor="middle"
              :fill="pointerColor(name)"
              style="font-size: 11px; font-weight: 700"
            >
              {{ name }}
            </text>
            <path
              :d="`M ${px(n).x} ${px(n).y - nodeR - 6 - ni * 13} L ${px(n).x} ${
                px(n).y - nodeR - 2
              }`"
              :stroke="pointerColor(name)"
              stroke-width="1.5"
              fill="none"
            />
          </template>
        </template>

        <!-- Glow -->
        <circle
          v-if="getAction(n.id)"
          :cx="px(n).x"
          :cy="px(n).y"
          :r="nodeR + 6"
          :fill="actionFills[getAction(n.id)!] ?? '#60a5fa'"
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

        <!-- Node -->
        <circle
          :cx="px(n).x"
          :cy="px(n).y"
          :r="nodeR"
          :fill="nodeFill(n)"
          :stroke="nodeIsFilled(n) ? 'none' : 'currentColor'"
          stroke-width="1.5"
          class="text-border"
          style="transition: fill 0.35s ease"
        />
        <circle
          :cx="px(n).x"
          :cy="px(n).y"
          :r="nodeR"
          fill="url(#tree-shine)"
          style="pointer-events: none"
        />

        <text
          :x="px(n).x"
          :y="px(n).y + 5"
          text-anchor="middle"
          :class="nodeIsFilled(n) ? 'fill-white font-bold' : 'fill-foreground'"
          style="font-size: 13px"
        >
          {{ n.value }}
        </text>

        <!-- Bottom label -->
        <text
          v-if="labels[n.id]"
          :x="px(n).x"
          :y="px(n).y + nodeR + 14"
          text-anchor="middle"
          class="fill-muted-foreground"
          style="font-size: 10px; font-weight: 600"
        >
          {{ labels[n.id] }}
        </text>
      </g>
    </svg>

    <!-- Result readout (e.g. traversal order) -->
    <div
      v-if="resultList"
      class="mt-1 font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-1"
    >
      {{ resultList }}
    </div>
  </div>
</template>
