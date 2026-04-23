import type { AnimationStep } from "@/data/types";

// ────────────────────────────────────────────────────────────────────────
// Backtracking visualizer data model
// ────────────────────────────────────────────────────────────────────────
// auxiliaryData.backtracking = {
//   title: string,
//   nodes: BTNode[],               // cumulative, appended as we explore
//   currentId: number | null,      // highlight the node just acted on
//   path: string[],                // current partial solution
//   results: string[],             // solutions collected so far
//   rejectReason?: string,         // label shown when rejecting a branch
//   board?: string[][],            // optional grid for n-queens / word-search
//   highlight?: [number, number]   // optional grid cell highlight [r,c]
// }
//
// BTNode = {
//   id: number,
//   parentId: number | null,
//   depth: number,
//   label: string,                 // what was chosen to reach this node
//   state: 'exploring' | 'chosen' | 'rejected' | 'solution',
// }

export interface BTNode {
  id: number;
  parentId: number | null;
  depth: number;
  label: string;
  state: "exploring" | "chosen" | "rejected" | "solution";
}

interface BuilderCtx {
  steps: AnimationStep[];
  nodes: BTNode[];
  nextId: number;
  path: string[];
  results: string[];
  title: string;
  board?: string[][];
  highlight?: [number, number];
}

function snap(ctx: BuilderCtx, description: string, currentId: number | null, extras: Partial<{ rejectReason: string }> = {}) {
  ctx.steps.push({
    description,
    array: [],
    auxiliaryData: {
      backtracking: {
        title: ctx.title,
        nodes: ctx.nodes.map((n) => ({ ...n })),
        currentId,
        path: [...ctx.path],
        results: [...ctx.results],
        rejectReason: extras.rejectReason,
        board: ctx.board ? ctx.board.map((r) => [...r]) : undefined,
        highlight: ctx.highlight ? [...ctx.highlight] as [number, number] : undefined,
      },
    },
  });
}

function mark(ctx: BuilderCtx, id: number, state: BTNode["state"]) {
  const n = ctx.nodes.find((x) => x.id === id);
  if (n) n.state = state;
}

// ═════════════════════════════════════════════════════════════
// 1. Permutations of small array
// ═════════════════════════════════════════════════════════════
export function generatePermutationsSteps(
  input: number[] = [1, 2, 3],
): AnimationStep[] {
  const nums = input.slice(0, 4);
  const ctx: BuilderCtx = {
    steps: [],
    nodes: [{ id: 0, parentId: null, depth: 0, label: "∅", state: "exploring" }],
    nextId: 1,
    path: [],
    results: [],
    title: `Permutations of [${nums.join(", ")}]`,
  };

  snap(ctx, `Start with empty path. Build permutations of [${nums.join(", ")}].`, 0);

  const used = new Array(nums.length).fill(false);

  function bt(parentId: number) {
    if (ctx.path.length === nums.length) {
      const perm = `[${ctx.path.join(", ")}]`;
      ctx.results.push(perm);
      mark(ctx, parentId, "solution");
      snap(ctx, `Leaf reached → record ${perm}`, parentId);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        const rejId = ctx.nextId++;
        ctx.nodes.push({ id: rejId, parentId, depth: ctx.path.length + 1, label: String(nums[i]), state: "rejected" });
        snap(ctx, `Skip ${nums[i]} — already used`, rejId, { rejectReason: "used" });
        continue;
      }
      const id = ctx.nextId++;
      ctx.nodes.push({ id, parentId, depth: ctx.path.length + 1, label: String(nums[i]), state: "exploring" });
      used[i] = true;
      ctx.path.push(String(nums[i]));
      snap(ctx, `Choose ${nums[i]} → path = [${ctx.path.join(", ")}]`, id);
      bt(id);
      mark(ctx, id, "chosen");
      used[i] = false;
      ctx.path.pop();
      snap(ctx, `Backtrack from ${nums[i]} — path = [${ctx.path.join(", ")}]`, id);
    }
  }

  bt(0);
  mark(ctx, 0, "chosen");
  snap(ctx, `Done. ${ctx.results.length} permutations found.`, 0);
  return ctx.steps;
}

// ═════════════════════════════════════════════════════════════
// 2. Subsets (include / exclude)
// ═════════════════════════════════════════════════════════════
export function generateSubsetsBtSteps(
  input: number[] = [1, 2, 3],
): AnimationStep[] {
  const nums = input.slice(0, 4);
  const ctx: BuilderCtx = {
    steps: [],
    nodes: [{ id: 0, parentId: null, depth: 0, label: "∅", state: "exploring" }],
    nextId: 1,
    path: [],
    results: [],
    title: `Subsets of [${nums.join(", ")}]`,
  };

  snap(ctx, `Generate the power set of [${nums.join(", ")}].`, 0);

  function bt(start: number, parentId: number) {
    const snapshot = `{${ctx.path.join(", ")}}`;
    ctx.results.push(snapshot);
    mark(ctx, parentId, "solution");
    snap(ctx, `Record subset ${snapshot}`, parentId);
    for (let i = start; i < nums.length; i++) {
      const id = ctx.nextId++;
      ctx.nodes.push({ id, parentId, depth: ctx.path.length + 1, label: String(nums[i]), state: "exploring" });
      ctx.path.push(String(nums[i]));
      snap(ctx, `Include ${nums[i]} → path = {${ctx.path.join(", ")}}`, id);
      bt(i + 1, id);
      mark(ctx, id, "chosen");
      ctx.path.pop();
      snap(ctx, `Backtrack — remove ${nums[i]}`, id);
    }
  }

  bt(0, 0);
  mark(ctx, 0, "chosen");
  snap(ctx, `Done. ${ctx.results.length} subsets (2^${nums.length}).`, 0);
  return ctx.steps;
}

// ═════════════════════════════════════════════════════════════
// 3. Combination Sum
// ═════════════════════════════════════════════════════════════
export function generateCombinationSumSteps(
  input: number[] = [2, 3, 6, 7],
  target = 7,
): AnimationStep[] {
  const cand = [...input].sort((a, b) => a - b);
  const ctx: BuilderCtx = {
    steps: [],
    nodes: [{ id: 0, parentId: null, depth: 0, label: `rem=${target}`, state: "exploring" }],
    nextId: 1,
    path: [],
    results: [],
    title: `Combination Sum — candidates [${cand.join(", ")}], target ${target}`,
  };

  snap(ctx, `Find every combination of [${cand.join(", ")}] (reuse allowed) that sums to ${target}.`, 0);

  function bt(start: number, remaining: number, parentId: number) {
    if (remaining === 0) {
      const combo = `[${ctx.path.join(", ")}]`;
      ctx.results.push(combo);
      mark(ctx, parentId, "solution");
      snap(ctx, `Remaining = 0 → record ${combo}`, parentId);
      return;
    }
    for (let i = start; i < cand.length; i++) {
      const c = cand[i]!;
      if (c > remaining) {
        const rejId = ctx.nextId++;
        ctx.nodes.push({ id: rejId, parentId, depth: ctx.path.length + 1, label: `${c}`, state: "rejected" });
        snap(ctx, `Prune: ${c} > remaining ${remaining}`, rejId, { rejectReason: "overshoot" });
        break;
      }
      const id = ctx.nextId++;
      ctx.nodes.push({ id, parentId, depth: ctx.path.length + 1, label: `+${c}`, state: "exploring" });
      ctx.path.push(String(c));
      snap(ctx, `Choose ${c} → path = [${ctx.path.join(", ")}], remaining = ${remaining - c}`, id);
      bt(i, remaining - c, id);
      mark(ctx, id, "chosen");
      ctx.path.pop();
      snap(ctx, `Backtrack — remove ${c}`, id);
    }
  }

  bt(0, target, 0);
  mark(ctx, 0, "chosen");
  snap(ctx, `Done. ${ctx.results.length} combinations sum to ${target}.`, 0);
  return ctx.steps;
}

// ═════════════════════════════════════════════════════════════
// 4. Generate Parentheses
// ═════════════════════════════════════════════════════════════
export function generateParenthesesSteps(n = 3): AnimationStep[] {
  const ctx: BuilderCtx = {
    steps: [],
    nodes: [{ id: 0, parentId: null, depth: 0, label: "ε", state: "exploring" }],
    nextId: 1,
    path: [],
    results: [],
    title: `Generate Parentheses (n = ${n})`,
  };

  snap(ctx, `Build every well-formed string with ${n} pairs of ().`, 0);

  function bt(cur: string, open: number, close: number, parentId: number) {
    if (cur.length === 2 * n) {
      ctx.results.push(cur);
      mark(ctx, parentId, "solution");
      snap(ctx, `Leaf: ${cur}`, parentId);
      return;
    }
    if (open < n) {
      const id = ctx.nextId++;
      ctx.nodes.push({ id, parentId, depth: cur.length + 1, label: "(", state: "exploring" });
      ctx.path.push("(");
      snap(ctx, `Place '(' → ${cur + "("}`, id);
      bt(cur + "(", open + 1, close, id);
      mark(ctx, id, "chosen");
      ctx.path.pop();
    } else {
      const rejId = ctx.nextId++;
      ctx.nodes.push({ id: rejId, parentId, depth: cur.length + 1, label: "(", state: "rejected" });
      snap(ctx, `Can't place '(' — already used ${open}/${n}`, rejId, { rejectReason: "open cap" });
    }
    if (close < open) {
      const id = ctx.nextId++;
      ctx.nodes.push({ id, parentId, depth: cur.length + 1, label: ")", state: "exploring" });
      ctx.path.push(")");
      snap(ctx, `Place ')' → ${cur + ")"}`, id);
      bt(cur + ")", open, close + 1, id);
      mark(ctx, id, "chosen");
      ctx.path.pop();
    } else {
      const rejId = ctx.nextId++;
      ctx.nodes.push({ id: rejId, parentId, depth: cur.length + 1, label: ")", state: "rejected" });
      snap(ctx, `Can't place ')' — would unbalance`, rejId, { rejectReason: "unbalanced" });
    }
  }

  bt("", 0, 0, 0);
  mark(ctx, 0, "chosen");
  snap(ctx, `Done. ${ctx.results.length} well-formed strings (Catalan C_${n}).`, 0);
  return ctx.steps;
}

// ═════════════════════════════════════════════════════════════
// 5. N-Queens — animated with board
// ═════════════════════════════════════════════════════════════
export function generateNQueensSteps(n = 4): AnimationStep[] {
  const board: string[][] = Array.from({ length: n }, () => Array(n).fill("."));
  const ctx: BuilderCtx = {
    steps: [],
    nodes: [{ id: 0, parentId: null, depth: 0, label: "row 0", state: "exploring" }],
    nextId: 1,
    path: [],
    results: [],
    title: `N-Queens (n = ${n})`,
    board,
  };

  snap(ctx, `Place ${n} queens so no two attack each other.`, 0);

  const cols = new Set<number>();
  const d1 = new Set<number>();
  const d2 = new Set<number>();

  function bt(row: number, parentId: number) {
    if (row === n) {
      const sol = board.map((r) => r.join("")).join(" / ");
      ctx.results.push(sol);
      mark(ctx, parentId, "solution");
      snap(ctx, `All ${n} queens placed → solution ${ctx.results.length}`, parentId);
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(row - c) || d2.has(row + c)) {
        const rejId = ctx.nextId++;
        ctx.nodes.push({ id: rejId, parentId, depth: row + 1, label: `(${row},${c})`, state: "rejected" });
        ctx.highlight = [row, c];
        snap(ctx, `(${row},${c}) under attack — prune`, rejId, { rejectReason: "attacked" });
        continue;
      }
      const id = ctx.nextId++;
      ctx.nodes.push({ id, parentId, depth: row + 1, label: `(${row},${c})`, state: "exploring" });
      board[row]![c] = "Q";
      cols.add(c); d1.add(row - c); d2.add(row + c);
      ctx.path.push(`(${row},${c})`);
      ctx.highlight = [row, c];
      snap(ctx, `Place queen at (${row}, ${c})`, id);
      bt(row + 1, id);
      mark(ctx, id, "chosen");
      board[row]![c] = ".";
      cols.delete(c); d1.delete(row - c); d2.delete(row + c);
      ctx.path.pop();
      ctx.highlight = [row, c];
      snap(ctx, `Backtrack — remove queen at (${row}, ${c})`, id);
    }
  }

  bt(0, 0);
  ctx.highlight = undefined;
  mark(ctx, 0, "chosen");
  snap(ctx, `Done. ${ctx.results.length} distinct board${ctx.results.length === 1 ? "" : "s"} found.`, 0);
  return ctx.steps;
}

// ═════════════════════════════════════════════════════════════
// 6. Word Search on a small grid
// ═════════════════════════════════════════════════════════════
export function generateWordSearchSteps(): AnimationStep[] {
  const board: string[][] = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"],
  ];
  const word = "ABCCED";
  const m = board.length;
  const n = board[0]!.length;

  const ctx: BuilderCtx = {
    steps: [],
    nodes: [{ id: 0, parentId: null, depth: 0, label: "start", state: "exploring" }],
    nextId: 1,
    path: [],
    results: [],
    title: `Word Search — "${word}"`,
    board: board.map((r) => [...r]),
  };

  snap(ctx, `Search for "${word}" in the grid.`, 0);

  const working = board.map((r) => [...r]);
  let found = false;

  function dfs(r: number, c: number, k: number, parentId: number): boolean {
    if (k === word.length) {
      ctx.results.push(word);
      mark(ctx, parentId, "solution");
      snap(ctx, `Matched full word "${word}"`, parentId);
      return true;
    }
    if (r < 0 || r >= m || c < 0 || c >= n) {
      const rejId = ctx.nextId++;
      ctx.nodes.push({ id: rejId, parentId, depth: k + 1, label: `(${r},${c})`, state: "rejected" });
      snap(ctx, `Out of bounds at (${r}, ${c})`, rejId, { rejectReason: "oob" });
      return false;
    }
    if (working[r]![c] !== word[k]) {
      const rejId = ctx.nextId++;
      ctx.nodes.push({ id: rejId, parentId, depth: k + 1, label: `(${r},${c})=${working[r]![c]}`, state: "rejected" });
      ctx.highlight = [r, c];
      ctx.board = working.map((row) => [...row]);
      snap(ctx, `'${working[r]![c]}' ≠ '${word[k]}' — skip`, rejId, { rejectReason: "mismatch" });
      return false;
    }
    const id = ctx.nextId++;
    ctx.nodes.push({ id, parentId, depth: k + 1, label: `${working[r]![c]}@(${r},${c})`, state: "exploring" });
    const saved = working[r]![c]!;
    working[r]![c] = "#";
    ctx.path.push(saved);
    ctx.highlight = [r, c];
    ctx.board = working.map((row) => [...row]);
    snap(ctx, `Match '${saved}' at (${r}, ${c}) — advance`, id);

    const ok =
      dfs(r + 1, c, k + 1, id) ||
      dfs(r - 1, c, k + 1, id) ||
      dfs(r, c + 1, k + 1, id) ||
      dfs(r, c - 1, k + 1, id);

    working[r]![c] = saved;
    if (ok) {
      mark(ctx, id, "chosen");
    } else {
      ctx.path.pop();
      mark(ctx, id, "chosen");
      ctx.highlight = [r, c];
      ctx.board = working.map((row) => [...row]);
      snap(ctx, `Backtrack from (${r}, ${c})`, id);
    }
    return ok;
  }

  outer: for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0, 0)) { found = true; break outer; }
    }
  }

  ctx.highlight = undefined;
  ctx.board = working.map((row) => [...row]);
  mark(ctx, 0, "chosen");
  snap(ctx, found ? `Word "${word}" found in grid.` : `Word "${word}" not present.`, 0);
  return ctx.steps;
}
