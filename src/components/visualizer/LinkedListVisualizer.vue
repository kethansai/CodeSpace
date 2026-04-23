<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

/**
 * Linked-list aware visualizer.
 *
 * Honours the following optional fields on `currentStep`:
 *  - `pointers`: `Record<name, nodeIndex>` — pointer labels drawn above nodes.
 *  - `auxiliaryData.edges`: explicit edge list, `{ from, to, state? }`.
 *    `to = -1` renders a null terminator. Edge `state` ∈
 *    `"normal" | "reversed" | "ghost" | "broken" | "new" | "cycle" | "active"`.
 *  - `auxiliaryData.row2`: optional second row of node values.
 *    Those nodes get global indices starting at `row0.length`.
 *  - `auxiliaryData.row2Edges`: edges among row-2 nodes (global indices).
 *  - `auxiliaryData.labels`: `Record<nodeIndex, string>` — small label under
 *    a node (e.g. list name, "new head").
 */

interface Edge {
  from: number;
  to: number;
  state?:
    | "normal"
    | "reversed"
    | "ghost"
    | "broken"
    | "new"
    | "cycle"
    | "active";
}

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
  doubly?: boolean;
}>();

// ─── Derived data ───

const aux = computed<any>(() => props.currentStep?.auxiliaryData ?? {});

const row0 = computed<(number | string)[]>(
  () => (props.currentStep?.array as (number | string)[]) ?? props.data,
);
const row1 = computed<(number | string)[]>(() => aux.value.row2 ?? []);

interface NodeInfo {
  value: number | string;
  row: number;
  col: number;
}

const nodes = computed<NodeInfo[]>(() => {
  const out: NodeInfo[] = [];
  row0.value.forEach((v, c) => out.push({ value: v, row: 0, col: c }));
  row1.value.forEach((v, c) => out.push({ value: v, row: 1, col: c }));
  return out;
});

const row0Len = computed(() => row0.value.length);
const row1Len = computed(() => row1.value.length);
const hasRow1 = computed(() => row1Len.value > 0);

const edges = computed<Edge[]>(() => {
  const hasExplicit =
    Array.isArray(aux.value.edges) || Array.isArray(aux.value.row2Edges);
  if (hasExplicit) {
    return [
      ...((aux.value.edges as Edge[]) ?? []),
      ...((aux.value.row2Edges as Edge[]) ?? []),
    ];
  }
  const out: Edge[] = [];
  for (let i = 0; i < row0Len.value - 1; i++) out.push({ from: i, to: i + 1 });
  if (row0Len.value > 0) out.push({ from: row0Len.value - 1, to: -1 });
  if (hasRow1.value) {
    const base = row0Len.value;
    for (let i = 0; i < row1Len.value - 1; i++) {
      out.push({ from: base + i, to: base + i + 1 });
    }
    out.push({ from: base + row1Len.value - 1, to: -1 });
  }
  return out;
});

const pointers = computed<Record<string, number>>(
  () => props.currentStep?.pointers ?? {},
);

const labels = computed<Record<number, string>>(
  () => aux.value.labels ?? {},
);

interface PointerGroup {
  idx: number;
  names: string[];
}
const pointerGroups = computed<PointerGroup[]>(() => {
  const m = new Map<number, string[]>();
  for (const [name, idx] of Object.entries(pointers.value)) {
    const n = typeof idx === "number" ? idx : Number(idx);
    if (!Number.isFinite(n)) continue;
    if (!m.has(n)) m.set(n, []);
    m.get(n)!.push(name);
  }
  return [...m.entries()].map(([idx, names]) => ({ idx, names }));
});

// ─── Layout ───

const nodeW = 58;
const nodeH = 40;
const gap = 44;
const pad = 36;
const rowH = 118;
const topPad = 42;

function colX(col: number) {
  return pad + col * (nodeW + gap);
}
function rowY(row: number) {
  return topPad + row * rowH;
}
function nodeX(i: number) {
  const n = nodes.value[i];
  return n ? colX(n.col) : 0;
}
function nodeY(i: number) {
  const n = nodes.value[i];
  return n ? rowY(n.row) : 0;
}
function nodeCX(i: number) {
  return nodeX(i) + nodeW / 2;
}
function nodeCY(i: number) {
  return nodeY(i) + nodeH / 2;
}
function nullX(fromIdx: number) {
  return nodeX(fromIdx) + nodeW + 28;
}
function nullY(fromIdx: number) {
  return nodeCY(fromIdx);
}

const svgW = computed(() => {
  const maxCols = Math.max(row0Len.value, row1Len.value);
  return pad * 2 + Math.max(1, maxCols) * (nodeW + gap) + 28;
});
const svgH = computed(() => {
  const rows = hasRow1.value ? 2 : 1;
  return topPad + rows * rowH - 30;
});

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

const pointerPalette: Record<string, string> = {
  prev: "#fbbf24",
  curr: "#60a5fa",
  cur: "#60a5fa",
  next: "#34d399",
  slow: "#60a5fa",
  fast: "#f472b6",
  a: "#60a5fa",
  b: "#f472b6",
  l1: "#60a5fa",
  l2: "#f472b6",
  head: "#a78bfa",
  tail: "#fb923c",
  dummy: "#94a3b8",
  newHead: "#4ade80",
  entry: "#4ade80",
  target: "#fb7185",
  p: "#60a5fa",
  q: "#f472b6",
  pa: "#60a5fa",
  pb: "#f472b6",
};
function pointerColor(name: string) {
  return pointerPalette[name] ?? "#60a5fa";
}

function getAction(i: number): AnimationAction | null {
  const s = props.currentStep;
  if (!s) return null;
  if (s.actions?.length) {
    for (const a of s.actions) if (a.indices?.includes(i)) return a.type;
  }
  if (s.indices?.includes(i) && s.action) return s.action;
  return null;
}

// ─── Edge geometry ───

interface EdgeGeom {
  key: string;
  state: NonNullable<Edge["state"]>;
  d: string;
  arrowX: number;
  arrowY: number;
  toNull: boolean;
  isCycle: boolean;
  labelX?: number;
  labelY?: number;
}

function edgeGeometry(e: Edge, k: number): EdgeGeom | null {
  const from = nodes.value[e.from];
  if (!from) return null;
  const state = e.state ?? "normal";

  if (e.to === -1) {
    const x1 = nodeX(e.from) + nodeW;
    const y1 = nodeCY(e.from);
    const x2 = nullX(e.from);
    const y2 = nullY(e.from);
    return {
      key: `e${k}`,
      state,
      d: `M ${x1} ${y1} L ${x2 - 14} ${y2}`,
      arrowX: x2 - 14,
      arrowY: y2,
      toNull: true,
      isCycle: false,
      labelX: x2,
      labelY: y2 + 4,
    };
  }

  const to = nodes.value[e.to];
  if (!to) return null;

  if (from.row === to.row && to.col === from.col + 1) {
    const x1 = nodeX(e.from) + nodeW;
    const y1 = nodeCY(e.from);
    const x2 = nodeX(e.to);
    const y2 = nodeCY(e.to);
    return {
      key: `e${k}`,
      state,
      d: `M ${x1} ${y1} L ${x2 - 4} ${y2}`,
      arrowX: x2 - 4,
      arrowY: y2,
      toNull: false,
      isCycle: false,
    };
  }

  if (from.row === to.row && to.col === from.col - 1) {
    const x1 = nodeX(e.from);
    const y1 = nodeCY(e.from);
    const x2 = nodeX(e.to) + nodeW;
    const y2 = nodeCY(e.to);
    return {
      key: `e${k}`,
      state,
      d: `M ${x1} ${y1} L ${x2 + 4} ${y2}`,
      arrowX: x2 + 4,
      arrowY: y2,
      toNull: false,
      isCycle: false,
    };
  }

  if (from.row === to.row) {
    const x1 = nodeCX(e.from);
    const y1 = nodeY(e.from) + nodeH;
    const x2 = nodeCX(e.to);
    const y2 = nodeY(e.to) + nodeH;
    const midX = (x1 + x2) / 2;
    const dip = Math.min(70, Math.abs(x2 - x1) / 2 + 24);
    const midY = y1 + dip;
    return {
      key: `e${k}`,
      state: "cycle",
      d: `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2 + 2}`,
      arrowX: x2,
      arrowY: y2 + 2,
      toNull: false,
      isCycle: true,
    };
  }

  const x1 = nodeCX(e.from);
  const y1 = nodeY(e.from) + nodeH;
  const x2 = nodeCX(e.to);
  const y2 = nodeY(e.to);
  return {
    key: `e${k}`,
    state,
    d: `M ${x1} ${y1} L ${x2} ${y2 - 4}`,
    arrowX: x2,
    arrowY: y2 - 4,
    toNull: false,
    isCycle: false,
  };
}

const renderedEdges = computed<EdgeGeom[]>(() =>
  edges.value
    .map((e, k) => edgeGeometry(e, k))
    .filter((e): e is EdgeGeom => !!e),
);

function edgeStroke(state: EdgeGeom["state"]) {
  switch (state) {
    case "reversed":
      return "#4ade80";
    case "new":
      return "#34d399";
    case "broken":
      return "#fb7185";
    case "ghost":
      return "rgba(148, 163, 184, 0.35)";
    case "cycle":
      return "#f472b6";
    case "active":
      return "#fbbf24";
    default:
      return "currentColor";
  }
}
function edgeDash(state: EdgeGeom["state"]) {
  if (state === "ghost" || state === "broken") return "5 4";
  return undefined;
}
function edgeClass(state: EdgeGeom["state"]) {
  if (state === "normal") return "text-muted-foreground/70";
  return "";
}
function edgeWidth(state: EdgeGeom["state"]) {
  if (state === "new" || state === "reversed" || state === "active") return 2.5;
  if (state === "broken") return 2;
  return 1.8;
}
function markerFor(state: EdgeGeom["state"]) {
  switch (state) {
    case "reversed":
      return "url(#ll-head-rev)";
    case "new":
      return "url(#ll-head-new)";
    case "cycle":
      return "url(#ll-head-cycle)";
    case "active":
      return "url(#ll-head-active)";
    case "broken":
      return "url(#ll-head-broken)";
    case "ghost":
      return undefined;
    default:
      return "url(#ll-head)";
  }
}
</script>

<template>
  <div class="w-full flex justify-center select-none overflow-x-auto py-2">
    <svg
      :width="svgW"
      :height="svgH"
      :viewBox="`0 0 ${svgW} ${svgH}`"
      class="w-full h-auto"
      :style="{ maxHeight: hasRow1 ? '280px' : '180px' }"
    >
      <defs>
        <marker
          id="ll-head"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" fill="currentColor" />
        </marker>
        <marker
          id="ll-head-active"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" fill="#fbbf24" />
        </marker>
        <marker
          id="ll-head-rev"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" fill="#4ade80" />
        </marker>
        <marker
          id="ll-head-new"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" fill="#34d399" />
        </marker>
        <marker
          id="ll-head-cycle"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" fill="#f472b6" />
        </marker>
        <marker
          id="ll-head-broken"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" fill="#fb7185" />
        </marker>
        <filter id="ll-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <template v-if="doubly">
        <g v-for="i in row0Len - 1" :key="`dd-${i}`">
          <path
            :d="`M ${colX(i)} ${rowY(0) + nodeH / 2 + 10} L ${
              colX(i - 1) + nodeW + 4
            } ${rowY(0) + nodeH / 2 + 10}`"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-dasharray="4 3"
            class="text-muted-foreground/40"
            marker-end="url(#ll-head)"
          />
        </g>
      </template>

      <g
        v-for="edge in renderedEdges"
        :key="edge.key"
        :class="edgeClass(edge.state)"
      >
        <path
          :d="edge.d"
          fill="none"
          :stroke="edgeStroke(edge.state)"
          :stroke-width="edgeWidth(edge.state)"
          :stroke-dasharray="edgeDash(edge.state)"
          :marker-end="markerFor(edge.state)"
          :opacity="edge.state === 'ghost' ? 0.55 : 1"
        />
        <text
          v-if="edge.toNull"
          :x="edge.labelX"
          :y="edge.labelY"
          class="fill-muted-foreground/70 italic"
          style="font-size: 11px"
        >
          null
        </text>
        <g v-if="edge.state === 'broken'">
          <circle
            :cx="edge.arrowX - 14"
            :cy="edge.arrowY"
            r="6"
            fill="#fb7185"
            opacity="0.85"
          />
          <text
            :x="edge.arrowX - 14"
            :y="edge.arrowY + 3"
            text-anchor="middle"
            fill="white"
            style="font-size: 9px; font-weight: 700"
          >
            ✕
          </text>
        </g>
      </g>

      <g v-for="(node, i) in nodes" :key="`n${i}`">
        <template
          v-for="pg in pointerGroups.filter((g) => g.idx === i)"
          :key="`pg${i}`"
        >
          <template v-for="(name, ni) in pg.names" :key="`pt${i}${ni}`">
            <text
              :x="nodeCX(i)"
              :y="nodeY(i) - 12 - ni * 13"
              text-anchor="middle"
              :fill="pointerColor(name)"
              style="font-size: 11px; font-weight: 700"
            >
              {{ name }}
            </text>
            <path
              :d="`M ${nodeCX(i)} ${nodeY(i) - 8 - ni * 13} L ${nodeCX(i)} ${
                nodeY(i) - 2
              }`"
              :stroke="pointerColor(name)"
              stroke-width="1.5"
              marker-end="url(#ll-head)"
              fill="none"
            />
          </template>
        </template>

        <rect
          v-if="getAction(i)"
          :x="nodeX(i) - 4"
          :y="nodeY(i) - 4"
          :width="nodeW + 8"
          :height="nodeH + 8"
          rx="10"
          fill="none"
          :stroke="actionFills[getAction(i)!] ?? '#60a5fa'"
          stroke-width="2"
          opacity="0.75"
          filter="url(#ll-glow)"
        >
          <animate
            attributeName="opacity"
            values="0.35;0.9;0.35"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </rect>

        <rect
          :x="nodeX(i)"
          :y="nodeY(i)"
          :width="nodeW"
          :height="nodeH"
          rx="8"
          :fill="
            getAction(i)
              ? (actionFills[getAction(i)!] ?? '#60a5fa')
              : 'var(--card, #1e293b)'
          "
          :stroke="getAction(i) ? 'none' : 'currentColor'"
          stroke-width="1"
          class="text-border"
          style="transition: fill 0.35s ease"
        />
        <rect
          :x="nodeX(i)"
          :y="nodeY(i)"
          :width="nodeW"
          :height="nodeH / 2"
          rx="8"
          fill="rgba(255,255,255,0.1)"
          style="pointer-events: none"
        />
        <text
          :x="nodeCX(i)"
          :y="nodeCY(i) + 5"
          text-anchor="middle"
          :class="getAction(i) ? 'fill-white font-bold' : 'fill-foreground'"
          style="font-size: 14px"
        >
          {{ node.value }}
        </text>

        <text
          v-if="labels[i]"
          :x="nodeCX(i)"
          :y="nodeY(i) + nodeH + 16"
          text-anchor="middle"
          class="fill-muted-foreground"
          style="font-size: 10px; font-weight: 600"
        >
          {{ labels[i] }}
        </text>
      </g>
    </svg>
  </div>
</template>
