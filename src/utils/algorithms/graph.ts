import type { AnimationStep } from "@/data/types";

// ─────────── Types mirroring GraphVisualizer ───────────

export type NodeState =
  | "normal"
  | "start"
  | "target"
  | "active"
  | "visited"
  | "done"
  | "discarded";
export type EdgeState =
  | "normal"
  | "active"
  | "traversed"
  | "in-tree"
  | "discarded"
  | "cycle";

export interface VizGraphNode {
  id: number;
  label?: string | number;
  x?: number;
  y?: number;
  state?: NodeState;
}
export interface VizGraphEdge {
  from: number;
  to: number;
  weight?: number;
  directed?: boolean;
  state?: EdgeState;
}
export interface VizGraph {
  nodes: VizGraphNode[];
  edges: VizGraphEdge[];
  directed?: boolean;
}

// ─────────── Canonical layouts ───────────

/** 7-node weighted undirected sample graph used by most algorithms. */
function weightedGraph(): VizGraph {
  return {
    directed: false,
    nodes: [
      { id: 0, label: "A", x: 80, y: 80 },
      { id: 1, label: "B", x: 260, y: 60 },
      { id: 2, label: "C", x: 440, y: 100 },
      { id: 3, label: "D", x: 140, y: 210 },
      { id: 4, label: "E", x: 320, y: 210 },
      { id: 5, label: "F", x: 200, y: 320 },
      { id: 6, label: "G", x: 400, y: 320 },
    ],
    edges: [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 3, weight: 1 },
      { from: 1, to: 2, weight: 5 },
      { from: 1, to: 4, weight: 3 },
      { from: 2, to: 4, weight: 2 },
      { from: 3, to: 4, weight: 2 },
      { from: 3, to: 5, weight: 6 },
      { from: 4, to: 5, weight: 4 },
      { from: 4, to: 6, weight: 3 },
      { from: 5, to: 6, weight: 2 },
    ],
  };
}

/** 6-node DAG used for topological sort. */
function dagGraph(): VizGraph {
  return {
    directed: true,
    nodes: [
      { id: 0, label: "A", x: 80, y: 80 },
      { id: 1, label: "B", x: 80, y: 250 },
      { id: 2, label: "C", x: 250, y: 80 },
      { id: 3, label: "D", x: 250, y: 250 },
      { id: 4, label: "E", x: 420, y: 80 },
      { id: 5, label: "F", x: 420, y: 250 },
    ],
    edges: [
      { from: 0, to: 2, directed: true },
      { from: 0, to: 3, directed: true },
      { from: 1, to: 3, directed: true },
      { from: 2, to: 4, directed: true },
      { from: 2, to: 5, directed: true },
      { from: 3, to: 5, directed: true },
      { from: 4, to: 5, directed: true },
    ],
  };
}

/** Two-component graph for connected-components / union-find demos. */
function twoComponentGraph(): VizGraph {
  return {
    directed: false,
    nodes: [
      { id: 0, label: "0", x: 90, y: 90 },
      { id: 1, label: "1", x: 220, y: 60 },
      { id: 2, label: "2", x: 180, y: 200 },
      { id: 3, label: "3", x: 330, y: 160 },
      { id: 4, label: "4", x: 400, y: 60 },
      { id: 5, label: "5", x: 430, y: 290 },
      { id: 6, label: "6", x: 290, y: 310 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 3, to: 4 },
      { from: 5, to: 6 },
    ],
  };
}

/** Bipartite-friendly layout: two columns. */
function bipartiteGraph(isBipartite: boolean): VizGraph {
  const g: VizGraph = {
    directed: false,
    nodes: [
      { id: 0, label: "0", x: 120, y: 80 },
      { id: 1, label: "1", x: 120, y: 180 },
      { id: 2, label: "2", x: 120, y: 280 },
      { id: 3, label: "3", x: 380, y: 80 },
      { id: 4, label: "4", x: 380, y: 180 },
      { id: 5, label: "5", x: 380, y: 280 },
    ],
    edges: [
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 1, to: 3 },
      { from: 1, to: 5 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ],
  };
  if (!isBipartite) {
    // Add a "bad" edge to break bipartiteness (1-2 both on the left side).
    g.edges.push({ from: 1, to: 2 });
  }
  return g;
}

/** Small weighted directed graph (negative edges allowed) for Bellman-Ford. */
function negativeGraph(): VizGraph {
  return {
    directed: true,
    nodes: [
      { id: 0, label: "A", x: 90, y: 200 },
      { id: 1, label: "B", x: 240, y: 80 },
      { id: 2, label: "C", x: 240, y: 320 },
      { id: 3, label: "D", x: 400, y: 200 },
      { id: 4, label: "E", x: 540, y: 200 },
    ],
    edges: [
      { from: 0, to: 1, weight: 4, directed: true },
      { from: 0, to: 2, weight: 5, directed: true },
      { from: 1, to: 2, weight: -3, directed: true },
      { from: 1, to: 3, weight: 6, directed: true },
      { from: 2, to: 3, weight: 1, directed: true },
      { from: 3, to: 4, weight: 2, directed: true },
    ],
  };
}

// ─────────── Helpers ───────────

function adjacency(
  g: VizGraph,
): Map<number, Array<{ to: number; weight: number; edgeIdx: number }>> {
  const adj = new Map<number, Array<{ to: number; weight: number; edgeIdx: number }>>();
  for (const n of g.nodes) adj.set(n.id, []);
  g.edges.forEach((e, idx) => {
    const w = e.weight ?? 1;
    adj.get(e.from)!.push({ to: e.to, weight: w, edgeIdx: idx });
    if (!g.directed && !e.directed) {
      adj.get(e.to)!.push({ to: e.from, weight: w, edgeIdx: idx });
    }
  });
  return adj;
}

function snapshot(
  g: VizGraph,
  nodeStates: Map<number, NodeState>,
  edgeStates: Map<number, EdgeState>,
): VizGraph {
  return {
    directed: g.directed,
    nodes: g.nodes.map((n) => ({
      ...n,
      state: nodeStates.get(n.id) ?? n.state,
    })),
    edges: g.edges.map((e, idx) => ({
      ...e,
      state: edgeStates.get(idx) ?? e.state,
    })),
  };
}

// ─────────── BFS ───────────

export function generateGraphBFSSteps(): AnimationStep[] {
  const g = weightedGraph();
  const adj = adjacency(g);
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const order: (string | number)[] = [];
  const src = 0;

  ns.set(src, "start");
  steps.push({
    description: `BFS from ${g.nodes[src].label}. Enqueue it and mark as visited.`,
    array: [],
    pointers: { src },
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      resultList: [],
    },
  });

  const queue: number[] = [src];
  const visited = new Set<number>([src]);
  while (queue.length) {
    const u = queue.shift()!;
    order.push(g.nodes[u].label ?? u);
    ns.set(u, "active");
    steps.push({
      description: `Dequeue ${g.nodes[u].label} → mark done. Visit order: [${order.join(", ")}].`,
      array: [],
      pointers: { curr: u },
      actions: [{ type: "visit", indices: [u] }],
      auxiliaryData: {
        graph: snapshot(g, ns, es),
        resultList: [...order],
      },
    });
    ns.set(u, "done");
    for (const { to, edgeIdx } of adj.get(u)!) {
      if (visited.has(to)) {
        if (es.get(edgeIdx) == null) es.set(edgeIdx, "discarded");
        continue;
      }
      visited.add(to);
      queue.push(to);
      ns.set(to, "visited");
      es.set(edgeIdx, "traversed");
      steps.push({
        description: `Discover ${g.nodes[to].label} via edge ${g.nodes[u].label}–${g.nodes[to].label}. Enqueue.`,
        array: [],
        pointers: { curr: u, next: to },
        actions: [{ type: "highlight", indices: [to] }],
        auxiliaryData: {
          graph: snapshot(g, ns, es),
          resultList: [...order],
        },
      });
    }
  }

  steps.push({
    description: `BFS complete. Order: [${order.join(", ")}].`,
    array: [],
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      resultList: [...order],
    },
  });
  return steps;
}

// ─────────── DFS ───────────

export function generateGraphDFSSteps(): AnimationStep[] {
  const g = weightedGraph();
  const adj = adjacency(g);
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const order: (string | number)[] = [];
  const src = 0;

  ns.set(src, "start");
  steps.push({
    description: `DFS from ${g.nodes[src].label}.`,
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), resultList: [] },
  });

  const visited = new Set<number>();
  function dfs(u: number) {
    visited.add(u);
    ns.set(u, "active");
    order.push(g.nodes[u].label ?? u);
    steps.push({
      description: `Enter ${g.nodes[u].label}. Order: [${order.join(", ")}].`,
      array: [],
      pointers: { curr: u },
      actions: [{ type: "visit", indices: [u] }],
      auxiliaryData: { graph: snapshot(g, ns, es), resultList: [...order] },
    });
    for (const { to, edgeIdx } of adj.get(u)!) {
      if (visited.has(to)) {
        if (es.get(edgeIdx) == null) es.set(edgeIdx, "discarded");
        continue;
      }
      es.set(edgeIdx, "traversed");
      steps.push({
        description: `Recurse into ${g.nodes[to].label} from ${g.nodes[u].label}.`,
        array: [],
        pointers: { curr: u, next: to },
        auxiliaryData: { graph: snapshot(g, ns, es), resultList: [...order] },
      });
      dfs(to);
    }
    ns.set(u, "done");
    steps.push({
      description: `Backtrack out of ${g.nodes[u].label}.`,
      array: [],
      pointers: { curr: u },
      auxiliaryData: { graph: snapshot(g, ns, es), resultList: [...order] },
    });
  }
  dfs(src);

  steps.push({
    description: `DFS complete. Order: [${order.join(", ")}].`,
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), resultList: [...order] },
  });
  return steps;
}

// ─────────── Dijkstra ───────────

export function generateDijkstraGraphSteps(): AnimationStep[] {
  const g = weightedGraph();
  const adj = adjacency(g);
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const src = 0;
  const n = g.nodes.length;

  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const visited = new Set<number>();

  const makeLabels = (): Record<number, string> => {
    const out: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      out[i] = `d=${dist[i] === Infinity ? "∞" : dist[i]}`;
    }
    return out;
  };

  ns.set(src, "start");
  steps.push({
    description: `Dijkstra from ${g.nodes[src].label}. All distances start at ∞, source = 0.`,
    array: [],
    pointers: { src },
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      labels: makeLabels(),
    },
  });

  while (visited.size < n) {
    // Pick unvisited with smallest dist.
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u === -1) break;

    ns.set(u, "active");
    steps.push({
      description: `Pick nearest unvisited vertex: ${g.nodes[u].label} (distance ${dist[u]}).`,
      array: [],
      pointers: { curr: u },
      actions: [{ type: "visit", indices: [u] }],
      auxiliaryData: { graph: snapshot(g, ns, es), labels: makeLabels() },
    });

    for (const { to, weight, edgeIdx } of adj.get(u)!) {
      if (visited.has(to)) continue;
      const candidate = dist[u] + weight;
      if (candidate < dist[to]) {
        dist[to] = candidate;
        es.set(edgeIdx, "traversed");
        ns.set(to, "visited");
        steps.push({
          description: `Relax ${g.nodes[u].label}→${g.nodes[to].label}: ${dist[u]} + ${weight} = ${candidate} < ∞ or old. Update.`,
          array: [],
          pointers: { curr: u, next: to },
          actions: [{ type: "set", indices: [to] }],
          auxiliaryData: { graph: snapshot(g, ns, es), labels: makeLabels() },
        });
      } else {
        steps.push({
          description: `Check ${g.nodes[u].label}→${g.nodes[to].label}: ${dist[u]} + ${weight} = ${candidate} ≥ ${dist[to]}. Skip.`,
          array: [],
          pointers: { curr: u, next: to },
          actions: [{ type: "compare", indices: [to] }],
          auxiliaryData: { graph: snapshot(g, ns, es), labels: makeLabels() },
        });
      }
    }

    visited.add(u);
    ns.set(u, "done");
  }

  steps.push({
    description: "All shortest distances finalized.",
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), labels: makeLabels() },
  });
  return steps;
}

// ─────────── Topological Sort (Kahn's) ───────────

export function generateTopoSortGraphSteps(): AnimationStep[] {
  const g = dagGraph();
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const n = g.nodes.length;

  const inDeg = new Array(n).fill(0);
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edgeOfPair = new Map<string, number>();
  g.edges.forEach((e, idx) => {
    adj[e.from].push(e.to);
    inDeg[e.to]++;
    edgeOfPair.set(`${e.from}-${e.to}`, idx);
  });

  const makeLabels = (): Record<number, string> => {
    const out: Record<number, string> = {};
    for (let i = 0; i < n; i++) out[i] = `in=${inDeg[i]}`;
    return out;
  };

  steps.push({
    description: "Compute in-degrees of every vertex.",
    array: [],
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      labels: makeLabels(),
      resultList: [],
    },
  });

  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (inDeg[i] === 0) {
      queue.push(i);
      ns.set(i, "start");
    }
  }
  steps.push({
    description: `Enqueue all zero in-degree nodes: [${queue
      .map((x) => g.nodes[x].label)
      .join(", ")}].`,
    array: [],
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      labels: makeLabels(),
      resultList: [],
    },
  });

  const order: (string | number)[] = [];
  while (queue.length) {
    const u = queue.shift()!;
    ns.set(u, "active");
    order.push(g.nodes[u].label ?? u);
    steps.push({
      description: `Dequeue ${g.nodes[u].label}. Order: [${order.join(", ")}].`,
      array: [],
      pointers: { curr: u },
      actions: [{ type: "visit", indices: [u] }],
      auxiliaryData: {
        graph: snapshot(g, ns, es),
        labels: makeLabels(),
        resultList: [...order],
      },
    });

    for (const v of adj[u]) {
      inDeg[v]--;
      const ei = edgeOfPair.get(`${u}-${v}`)!;
      es.set(ei, "traversed");
      if (inDeg[v] === 0) {
        queue.push(v);
        ns.set(v, "visited");
      }
      steps.push({
        description: `Remove edge ${g.nodes[u].label}→${g.nodes[v].label}. in(${g.nodes[v].label}) = ${inDeg[v]}${
          inDeg[v] === 0 ? " → enqueue." : "."
        }`,
        array: [],
        pointers: { curr: u, next: v },
        auxiliaryData: {
          graph: snapshot(g, ns, es),
          labels: makeLabels(),
          resultList: [...order],
        },
      });
    }
    ns.set(u, "done");
  }

  steps.push({
    description: `Topological order: [${order.join(", ")}].`,
    array: [],
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      labels: makeLabels(),
      resultList: [...order],
    },
  });
  return steps;
}

// ─────────── Union-Find ───────────

export function generateUnionFindGraphSteps(): AnimationStep[] {
  const g = twoComponentGraph();
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const n = g.nodes.length;
  const parent = new Array(n).fill(0).map((_, i) => i);
  const rank = new Array(n).fill(0);

  const labels = (): Record<number, string> => {
    const out: Record<number, string> = {};
    for (let i = 0; i < n; i++) out[i] = `root=${find(i)}`;
    return out;
  };

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  steps.push({
    description: "Each node starts in its own set (self-parent).",
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });

  // Process edges in order, uniting.
  g.edges.forEach((e, idx) => {
    ns.clear();
    ns.set(e.from, "active");
    ns.set(e.to, "active");
    steps.push({
      description: `Process edge ${g.nodes[e.from].label}–${g.nodes[e.to].label}.`,
      array: [],
      pointers: { u: e.from, v: e.to },
      auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
    });

    const a = find(e.from);
    const b = find(e.to);
    if (a === b) {
      es.set(idx, "cycle");
      steps.push({
        description: `${g.nodes[e.from].label} and ${g.nodes[e.to].label} already share root ${a} → would create a cycle; skip.`,
        array: [],
        auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
      });
    } else {
      if (rank[a] < rank[b]) parent[a] = b;
      else if (rank[a] > rank[b]) parent[b] = a;
      else {
        parent[b] = a;
        rank[a]++;
      }
      es.set(idx, "in-tree");
      steps.push({
        description: `Union(${g.nodes[e.from].label}, ${g.nodes[e.to].label}) → merge sets.`,
        array: [],
        auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
      });
    }
  });

  // Mark final components.
  const rootColors = new Map<number, NodeState>();
  const palette: NodeState[] = ["done", "visited", "target"];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (!rootColors.has(r)) rootColors.set(r, palette[k++ % palette.length]);
    ns.set(i, rootColors.get(r)!);
  }
  steps.push({
    description: `Final components — one color per root.`,
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });
  return steps;
}

// ─────────── MST (Kruskal) ───────────

export function generateKruskalGraphSteps(): AnimationStep[] {
  const g = weightedGraph();
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const n = g.nodes.length;
  const parent = new Array(n).fill(0).map((_, i) => i);
  const rank = new Array(n).fill(0);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  // Sort edge indices by weight.
  const order = g.edges
    .map((_, i) => i)
    .sort((a, b) => (g.edges[a].weight ?? 0) - (g.edges[b].weight ?? 0));

  let cost = 0;
  let taken = 0;
  steps.push({
    description: `Kruskal: consider edges in ascending weight order.`,
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es) },
    variables: { cost, "edges taken": taken },
  });

  for (const idx of order) {
    const e = g.edges[idx];
    ns.clear();
    ns.set(e.from, "active");
    ns.set(e.to, "active");
    steps.push({
      description: `Consider ${g.nodes[e.from].label}–${g.nodes[e.to].label} (w=${e.weight}).`,
      array: [],
      pointers: { u: e.from, v: e.to },
      auxiliaryData: { graph: snapshot(g, ns, es) },
      variables: { cost, "edges taken": taken },
    });

    const a = find(e.from);
    const b = find(e.to);
    if (a === b) {
      es.set(idx, "discarded");
      steps.push({
        description: `Would create a cycle → skip.`,
        array: [],
        auxiliaryData: { graph: snapshot(g, ns, es) },
        variables: { cost, "edges taken": taken },
      });
      continue;
    }
    if (rank[a] < rank[b]) parent[a] = b;
    else if (rank[a] > rank[b]) parent[b] = a;
    else {
      parent[b] = a;
      rank[a]++;
    }
    es.set(idx, "in-tree");
    cost += e.weight ?? 0;
    taken++;
    steps.push({
      description: `Add edge → MST cost = ${cost}.`,
      array: [],
      auxiliaryData: { graph: snapshot(g, ns, es) },
      variables: { cost, "edges taken": taken },
    });
    if (taken === n - 1) break;
  }

  ns.clear();
  for (const node of g.nodes) ns.set(node.id, "done");
  steps.push({
    description: `MST complete. Total cost = ${cost}.`,
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es) },
    variables: { cost, "edges taken": taken },
  });
  return steps;
}

// ─────────── Shortest path (unweighted BFS) ───────────

export function generateShortestPathBFSSteps(): AnimationStep[] {
  const g = weightedGraph(); // weights ignored here
  const adj = adjacency(g);
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const src = 0;
  const target = 6;
  const n = g.nodes.length;

  const dist = new Array(n).fill(-1);
  const parent = new Array(n).fill(-1);
  dist[src] = 0;

  const labels = (): Record<number, string> => {
    const out: Record<number, string> = {};
    for (let i = 0; i < n; i++) out[i] = dist[i] < 0 ? "?" : `d=${dist[i]}`;
    return out;
  };

  ns.set(src, "start");
  ns.set(target, "target");
  steps.push({
    description: `Shortest path from ${g.nodes[src].label} to ${g.nodes[target].label} (BFS, unweighted).`,
    array: [],
    pointers: { src, target },
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });

  const queue: number[] = [src];
  while (queue.length) {
    const u = queue.shift()!;
    if (u === target) break;
    ns.set(u, "active");
    steps.push({
      description: `Expand ${g.nodes[u].label} (d=${dist[u]}).`,
      array: [],
      pointers: { curr: u },
      auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
    });
    for (const { to, edgeIdx } of adj.get(u)!) {
      if (dist[to] === -1) {
        dist[to] = dist[u] + 1;
        parent[to] = u;
        queue.push(to);
        es.set(edgeIdx, "traversed");
        if (to !== target) ns.set(to, "visited");
        steps.push({
          description: `Discover ${g.nodes[to].label} at distance ${dist[to]}.`,
          array: [],
          pointers: { curr: u, next: to },
          auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
        });
      } else if (es.get(edgeIdx) == null) {
        es.set(edgeIdx, "discarded");
      }
    }
    ns.set(u, "done");
  }

  // Reconstruct path.
  const path: number[] = [];
  if (dist[target] !== -1) {
    let x = target;
    while (x !== -1) {
      path.push(x);
      x = parent[x];
    }
    path.reverse();
    // Mark path edges.
    for (let i = 0; i + 1 < path.length; i++) {
      const a = path[i];
      const b = path[i + 1];
      const ei = g.edges.findIndex(
        (e) =>
          (e.from === a && e.to === b) || (e.from === b && e.to === a),
      );
      if (ei >= 0) es.set(ei, "in-tree");
    }
    for (const id of path) ns.set(id, "done");
    ns.set(src, "start");
    ns.set(target, "target");
  }
  steps.push({
    description:
      dist[target] === -1
        ? `No path from ${g.nodes[src].label} to ${g.nodes[target].label}.`
        : `Shortest path length = ${dist[target]}: ${path.map((x) => g.nodes[x].label).join(" → ")}.`,
    array: [],
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      labels: labels(),
      resultList: path.map((x) => g.nodes[x].label),
    },
  });
  return steps;
}

// ─────────── Connected components (BFS) ───────────

export function generateConnectedComponentsSteps(): AnimationStep[] {
  const g = twoComponentGraph();
  const adj = adjacency(g);
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const n = g.nodes.length;
  const comp = new Array(n).fill(-1);
  const palette: NodeState[] = ["visited", "done", "target", "start"];

  const labels = (): Record<number, string> => {
    const out: Record<number, string> = {};
    for (let i = 0; i < n; i++) if (comp[i] >= 0) out[i] = `c=${comp[i]}`;
    return out;
  };

  steps.push({
    description: "Scan every node; if unassigned, launch a BFS to label its component.",
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });

  let c = 0;
  for (let i = 0; i < n; i++) {
    if (comp[i] !== -1) continue;
    // New component
    const q: number[] = [i];
    comp[i] = c;
    const color = palette[c % palette.length];
    ns.set(i, color);
    steps.push({
      description: `Start component ${c} at ${g.nodes[i].label}.`,
      array: [],
      pointers: { curr: i },
      auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
    });
    while (q.length) {
      const u = q.shift()!;
      for (const { to, edgeIdx } of adj.get(u)!) {
        if (comp[to] === -1) {
          comp[to] = c;
          ns.set(to, color);
          es.set(edgeIdx, "traversed");
          q.push(to);
          steps.push({
            description: `Add ${g.nodes[to].label} to component ${c}.`,
            array: [],
            pointers: { curr: u, next: to },
            auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
          });
        }
      }
    }
    c++;
  }

  steps.push({
    description: `Graph has ${c} connected components.`,
    array: [],
    auxiliaryData: {
      graph: snapshot(g, ns, es),
      labels: labels(),
      resultList: `components = ${c}`,
    },
  });
  return steps;
}

// ─────────── Cycle detection (undirected DFS) ───────────

export function generateCycleDetectionSteps(): AnimationStep[] {
  const g = weightedGraph(); // contains a cycle
  const adj = adjacency(g);
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const visited = new Set<number>();

  steps.push({
    description:
      "Undirected cycle detection: DFS; if we meet a visited neighbor that isn't our parent, we found a back-edge.",
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es) },
  });

  let cycleEdge = -1;
  function dfs(u: number, parent: number): boolean {
    visited.add(u);
    ns.set(u, "active");
    steps.push({
      description: `Enter ${g.nodes[u].label}.`,
      array: [],
      pointers: { curr: u },
      auxiliaryData: { graph: snapshot(g, ns, es) },
    });
    for (const { to, edgeIdx } of adj.get(u)!) {
      if (!visited.has(to)) {
        es.set(edgeIdx, "traversed");
        if (dfs(to, u)) return true;
      } else if (to !== parent) {
        es.set(edgeIdx, "cycle");
        cycleEdge = edgeIdx;
        steps.push({
          description: `Back-edge ${g.nodes[u].label}–${g.nodes[to].label} (${g.nodes[to].label} already visited, ≠ parent) → cycle!`,
          array: [],
          pointers: { u, v: to },
          actions: [{ type: "highlight", indices: [u, to] }],
          auxiliaryData: { graph: snapshot(g, ns, es) },
        });
        return true;
      }
    }
    ns.set(u, "done");
    return false;
  }

  const found = dfs(0, -1);
  steps.push({
    description: found
      ? `Cycle detected (edge ${cycleEdge + 1}).`
      : `No cycle — graph is a forest.`,
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es) },
  });
  return steps;
}

// ─────────── Bipartite check (BFS coloring) ───────────

export function generateBipartiteSteps(): AnimationStep[] {
  const g = bipartiteGraph(true);
  const adj = adjacency(g);
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const n = g.nodes.length;
  const color = new Array(n).fill(-1);

  const labels = (): Record<number, string> => {
    const out: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (color[i] === 0) out[i] = "A";
      else if (color[i] === 1) out[i] = "B";
    }
    return out;
  };

  steps.push({
    description:
      "Try to 2-color the graph with BFS. Adjacent nodes must get different colors.",
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });

  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    ns.set(start, "visited");
    const q: number[] = [start];
    while (q.length) {
      const u = q.shift()!;
      steps.push({
        description: `Color ${g.nodes[u].label} → ${color[u] === 0 ? "A" : "B"}.`,
        array: [],
        pointers: { curr: u },
        auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
      });
      for (const { to, edgeIdx } of adj.get(u)!) {
        if (color[to] === -1) {
          color[to] = 1 - color[u];
          ns.set(to, color[to] === 0 ? "visited" : "target");
          es.set(edgeIdx, "traversed");
          q.push(to);
        } else if (color[to] === color[u]) {
          es.set(edgeIdx, "cycle");
          steps.push({
            description: `Conflict: ${g.nodes[u].label} and ${g.nodes[to].label} both want the same color → NOT bipartite.`,
            array: [],
            auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
          });
          return steps;
        }
      }
    }
  }
  steps.push({
    description: "2-coloring succeeded → graph is bipartite.",
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });
  return steps;
}

// ─────────── Bellman-Ford ───────────

export function generateBellmanFordSteps(): AnimationStep[] {
  const g = negativeGraph();
  const steps: AnimationStep[] = [];
  const ns = new Map<number, NodeState>();
  const es = new Map<number, EdgeState>();
  const n = g.nodes.length;
  const src = 0;
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  const labels = (): Record<number, string> => {
    const out: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      out[i] = `d=${dist[i] === Infinity ? "∞" : dist[i]}`;
    }
    return out;
  };

  ns.set(src, "start");
  steps.push({
    description: `Bellman-Ford from ${g.nodes[src].label}. Relax every edge V−1 = ${n - 1} times.`,
    array: [],
    pointers: { src },
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });

  for (let pass = 1; pass < n; pass++) {
    let changed = false;
    steps.push({
      description: `Pass ${pass} / ${n - 1}.`,
      array: [],
      auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
    });
    for (let idx = 0; idx < g.edges.length; idx++) {
      const e = g.edges[idx];
      const w = e.weight ?? 0;
      if (dist[e.from] === Infinity) continue;
      const cand = dist[e.from] + w;
      if (cand < dist[e.to]) {
        dist[e.to] = cand;
        changed = true;
        es.set(idx, "traversed");
        steps.push({
          description: `Relax ${g.nodes[e.from].label}→${g.nodes[e.to].label}: ${dist[e.from]} + ${w} = ${cand}.`,
          array: [],
          pointers: { u: e.from, v: e.to },
          actions: [{ type: "set", indices: [e.to] }],
          auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
        });
      }
    }
    if (!changed) {
      steps.push({
        description: `Pass ${pass} changed nothing → distances have stabilized early.`,
        array: [],
        auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
      });
      break;
    }
  }

  // Negative-cycle check
  let negCycle = false;
  for (let idx = 0; idx < g.edges.length; idx++) {
    const e = g.edges[idx];
    const w = e.weight ?? 0;
    if (dist[e.from] === Infinity) continue;
    if (dist[e.from] + w < dist[e.to]) {
      negCycle = true;
      es.set(idx, "cycle");
    }
  }
  steps.push({
    description: negCycle
      ? "A V-th pass still improved distances → negative cycle detected."
      : "No further improvement possible. Shortest distances are final.",
    array: [],
    auxiliaryData: { graph: snapshot(g, ns, es), labels: labels() },
  });
  return steps;
}
