<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

/**
 * Graph visualizer.
 *
 * Primary input mode — `auxiliaryData.graph`:
 * ```
 * {
 *   nodes: [{ id, label?, x?, y?, state? }, ...],
 *   edges: [{ from, to, weight?, directed?, state? }, ...],
 *   directed?: boolean,
 * }
 * ```
 * If any node lacks `x/y`, nodes are auto-laid-out on a ring so explicit and
 * implicit layouts can mix. `state` drives coloring:
 *   node: normal | start | target | active | visited | done | discarded
 *   edge: normal | active | traversed | in-tree | discarded | cycle
 *
 * Extras:
 *  - `auxiliaryData.labels`: `{ [id]: string }` — small tag under a node
 *    (distances for Dijkstra, component ids for union-find, etc.).
 *  - `auxiliaryData.resultList`: string printed below the graph (visit order,
 *    topological order, mst edge list, …).
 *  - `currentStep.pointers`: `{ [name]: nodeId }` — floating label above node.
 *
 * Fallback — when no `graph` is present, laies out `data: number[]` on a ring
 * with a simple ring/cross-edge sketch (legacy).
 */

type NodeState =
  | "normal"
  | "start"
  | "target"
  | "active"
  | "visited"
  | "done"
  | "discarded";
type EdgeState =
  | "normal"
  | "active"
  | "traversed"
  | "in-tree"
  | "discarded"
  | "cycle";

interface VizGraphNode {
  id: number;
  label?: string | number;
  x?: number;
  y?: number;
  state?: NodeState;
}
interface VizGraphEdge {
  from: number;
  to: number;
  weight?: number;
  directed?: boolean;
  state?: EdgeState;
}
interface VizGraph {
  nodes: VizGraphNode[];
  edges: VizGraphEdge[];
  directed?: boolean;
}

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

const aux = computed<any>(() => props.currentStep?.auxiliaryData ?? {});
const explicitGraph = computed<VizGraph | null>(() => aux.value.graph ?? null);

// ─── Layout ───
const svgW = 520;
const svgH = 360;
const nodeR = 22;

interface PositionedNode {
  id: number;
  label: string | number;
  x: number;
  y: number;
  state?: NodeState;
}

const positioned = computed<{ nodes: PositionedNode[]; byId: Map<number, PositionedNode> }>(() => {
  const g = explicitGraph.value;
  const nodes: PositionedNode[] = [];
  if (g) {
    const missing = g.nodes.filter((n) => n.x == null || n.y == null);
    let ringIdx = 0;
    const ringTotal = missing.length;
    const cx = svgW / 2;
    const cy = svgH / 2;
    const ringR = Math.min(svgW, svgH) / 2 - 60;
    for (const n of g.nodes) {
      let x = n.x;
      let y = n.y;
      if (x == null || y == null) {
        const angle = (ringIdx / Math.max(1, ringTotal)) * Math.PI * 2 - Math.PI / 2;
        x = cx + ringR * Math.cos(angle);
        y = cy + ringR * Math.sin(angle);
        ringIdx++;
      }
      nodes.push({ id: n.id, label: n.label ?? n.id, x, y, state: n.state });
    }
  } else {
    // Fallback — use data array indices around a ring.
    const n = props.data.length || 1;
    const cx = svgW / 2;
    const cy = svgH / 2;
    const ringR = Math.min(svgW, svgH) / 2 - 60;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        id: i,
        label: props.data[i] ?? i,
        x: cx + ringR * Math.cos(angle),
        y: cy + ringR * Math.sin(angle),
      });
    }
  }
  const byId = new Map<number, PositionedNode>();
  for (const n of nodes) byId.set(n.id, n);
  return { nodes, byId };
});

const edges = computed<VizGraphEdge[]>(() => {
  const g = explicitGraph.value;
  if (g) return g.edges;
  // Fallback edges (legacy ring + cross).
  const n = props.data.length;
  const e: VizGraphEdge[] = [];
  for (let i = 0; i < n - 1; i++) e.push({ from: i, to: i + 1 });
  if (n > 2) e.push({ from: n - 1, to: 0 });
  if (n >= 5) e.push({ from: 0, to: Math.floor(n / 2) });
  return e;
});

const directed = computed(() => !!explicitGraph.value?.directed);

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
    if (!positioned.value.byId.has(n)) continue;
    if (!m.has(n)) m.set(n, []);
    m.get(n)!.push(name);
  }
  return [...m.entries()].map(([id, names]) => ({ id, names }));
});

const labels = computed<Record<number, string>>(
  () => aux.value.labels ?? {},
);

const resultList = computed<string | null>(() => {
  const r = aux.value.resultList;
  if (r == null) return null;
  if (Array.isArray(r)) return r.join(" → ");
  return String(r);
});

// ─── Styles ───
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
const nodeStateFills: Record<NodeState, string> = {
  normal: "var(--card, #1e293b)",
  start: "#60a5fa",
  target: "#fbbf24",
  active: "#22d3ee",
  visited: "#818cf8",
  done: "#4ade80",
  discarded: "rgba(148,163,184,0.3)",
};
const edgeStateStroke: Record<EdgeState, string> = {
  normal: "currentColor",
  active: "#fbbf24",
  traversed: "#818cf8",
  "in-tree": "#4ade80",
  discarded: "rgba(148,163,184,0.35)",
  cycle: "#fb7185",
};
const pointerPalette: Record<string, string> = {
  curr: "#60a5fa",
  src: "#60a5fa",
  u: "#60a5fa",
  v: "#f472b6",
  start: "#60a5fa",
  target: "#fbbf24",
  mst: "#4ade80",
  next: "#22d3ee",
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

function nodeFill(n: PositionedNode): string {
  const action = getAction(n.id);
  if (action) return actionFills[action] ?? "#60a5fa";
  if (n.state) return nodeStateFills[n.state];
  return nodeStateFills.normal;
}
function nodeIsFilled(n: PositionedNode): boolean {
  return !!getAction(n.id) || (n.state != null && n.state !== "normal");
}

function edgeStroke(e: VizGraphEdge): string {
  if (e.state && e.state !== "normal") return edgeStateStroke[e.state];
  return "currentColor";
}
function edgeWidth(e: VizGraphEdge): number {
  if (!e.state || e.state === "normal") return 1.4;
  if (e.state === "discarded") return 1.2;
  return 2.6;
}
function edgeDash(e: VizGraphEdge): string | undefined {
  if (e.state === "discarded") return "5 3";
  return undefined;
}
function edgeOpacity(e: VizGraphEdge): number {
  if (e.state === "discarded") return 0.5;
  return 1;
}
function edgeLabelPos(e: VizGraphEdge) {
  const a = positioned.value.byId.get(e.from);
  const b = positioned.value.byId.get(e.to);
  if (!a || !b) return { x: 0, y: 0 };
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 6 };
}

// Shorten line endpoints so they stop at circle boundary (and directed arrows
// look right).
function endpointOffset(a: PositionedNode, b: PositionedNode, r = nodeR) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.max(1, Math.hypot(dx, dy));
  return { ux: dx / d, uy: dy / d, r };
}
function lineCoords(e: VizGraphEdge) {
  const a = positioned.value.byId.get(e.from);
  const b = positioned.value.byId.get(e.to);
  if (!a || !b) return { x1: 0, y1: 0, x2: 0, y2: 0 };
  const { ux, uy } = endpointOffset(a, b);
  return {
    x1: a.x + ux * nodeR,
    y1: a.y + uy * nodeR,
    x2: b.x - ux * nodeR,
    y2: b.y - uy * nodeR,
  };
}
</script>

<template>
  <div class="w-full flex flex-col items-center select-none py-2">
    <svg
      :width="svgW"
      :height="svgH"
      :viewBox="`0 0 ${svgW} ${svgH}`"
      class="w-full h-auto"
      style="max-height: 380px"
    >
      <defs>
        <filter id="graph-glow">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="g-shine">
          <stop offset="0%" stop-color="rgba(255,255,255,0.15)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
        <marker
          id="g-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" class="fill-muted-foreground/60" />
        </marker>
        <marker
          id="g-arrow-active"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" fill="#fbbf24" />
        </marker>
        <marker
          id="g-arrow-tree"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" fill="#4ade80" />
        </marker>
      </defs>

      <!-- Edges -->
      <template v-for="(e, i) in edges" :key="`e-${i}`">
        <line
          :x1="lineCoords(e).x1"
          :y1="lineCoords(e).y1"
          :x2="lineCoords(e).x2"
          :y2="lineCoords(e).y2"
          :stroke="edgeStroke(e)"
          :stroke-width="edgeWidth(e)"
          :stroke-dasharray="edgeDash(e)"
          :opacity="edgeOpacity(e)"
          :class="e.state && e.state !== 'normal' ? '' : 'text-border'"
          stroke-linecap="round"
          :marker-end="
            (directed || e.directed)
              ? (e.state === 'active'
                  ? 'url(#g-arrow-active)'
                  : e.state === 'in-tree'
                    ? 'url(#g-arrow-tree)'
                    : 'url(#g-arrow)')
              : undefined
          "
          style="transition: all 0.35s ease"
        />
        <text
          v-if="e.weight != null"
          :x="edgeLabelPos(e).x"
          :y="edgeLabelPos(e).y"
          text-anchor="middle"
          class="fill-muted-foreground"
          style="font-size: 10px; font-weight: 600; paint-order: stroke"
          stroke="var(--background, #0f172a)"
          stroke-width="3"
        >
          {{ e.weight }}
        </text>
      </template>

      <!-- Nodes -->
      <g v-for="n in positioned.nodes" :key="`n-${n.id}`">
        <!-- Pointer labels -->
        <template
          v-for="pg in pointerGroups.filter((g) => g.id === n.id)"
          :key="`pg-${n.id}`"
        >
          <template v-for="(name, ni) in pg.names" :key="`pt-${n.id}-${ni}`">
            <text
              :x="n.x"
              :y="n.y - nodeR - 10 - ni * 13"
              text-anchor="middle"
              :fill="pointerColor(name)"
              style="font-size: 11px; font-weight: 700"
            >
              {{ name }}
            </text>
            <path
              :d="`M ${n.x} ${n.y - nodeR - 6 - ni * 13} L ${n.x} ${
                n.y - nodeR - 2
              }`"
              :stroke="pointerColor(name)"
              stroke-width="1.5"
              fill="none"
            />
          </template>
        </template>

        <!-- Glow -->
        <circle
          v-if="getAction(n.id) || n.state === 'active'"
          :cx="n.x"
          :cy="n.y"
          :r="nodeR + 7"
          :fill="
            getAction(n.id)
              ? (actionFills[getAction(n.id)!] ?? '#60a5fa')
              : '#22d3ee'
          "
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

        <circle
          :cx="n.x"
          :cy="n.y"
          :r="nodeR"
          :fill="nodeFill(n)"
          :stroke="nodeIsFilled(n) ? 'none' : 'currentColor'"
          stroke-width="1.5"
          class="text-border"
          style="transition: fill 0.35s ease"
        />
        <circle
          :cx="n.x"
          :cy="n.y"
          :r="nodeR"
          fill="url(#g-shine)"
          style="pointer-events: none"
        />

        <text
          :x="n.x"
          :y="n.y + 5"
          text-anchor="middle"
          :class="nodeIsFilled(n) ? 'fill-white font-bold' : 'fill-foreground'"
          style="font-size: 13px"
        >
          {{ n.label }}
        </text>

        <!-- Bottom label (distance / in-degree / component) -->
        <text
          v-if="labels[n.id]"
          :x="n.x"
          :y="n.y + nodeR + 14"
          text-anchor="middle"
          class="fill-muted-foreground"
          style="font-size: 10px; font-weight: 600"
        >
          {{ labels[n.id] }}
        </text>
      </g>
    </svg>

    <div
      v-if="resultList"
      class="mt-1 font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-1"
    >
      {{ resultList }}
    </div>
  </div>
</template>
