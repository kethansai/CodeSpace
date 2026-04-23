import type { AnimationStep } from "@/data/types";

// ── Shared helpers ──

type IntervalKind = "candidate" | "current" | "picked" | "skipped" | "conflict";
type ItemKind = "idle" | "current" | "picked" | "skipped" | "done";

interface IntervalEntry {
  label?: string;
  start: number;
  end: number;
  kind: IntervalKind;
}
interface ItemEntry {
  label: string;
  value?: number | string;
  kind: ItemKind;
}

function snapIntervals(
  title: string,
  intervals: IntervalEntry[],
  timeline?: { start: number; end: number },
) {
  return {
    greedy: {
      mode: "intervals" as const,
      title,
      intervals: intervals.map((i) => ({ ...i })),
      timelineStart: timeline?.start,
      timelineEnd: timeline?.end,
    },
  };
}

function snapItems(title: string, items: ItemEntry[]) {
  return {
    greedy: {
      mode: "items" as const,
      title,
      items: items.map((i) => ({ ...i })),
    },
  };
}

// ═════════════════════════════════════════════════════════════
// 1. Activity Selection — pick max non-overlapping intervals
// ═════════════════════════════════════════════════════════════
export function generateActivitySelectionSteps(
  input: [number, number][] = [
    [1, 4],
    [3, 5],
    [0, 6],
    [5, 7],
    [3, 9],
    [5, 9],
    [6, 10],
    [8, 11],
    [8, 12],
    [2, 14],
    [12, 16],
  ],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const sorted = [...input]
    .map(([s, e], i) => ({ label: `A${i + 1}`, start: s, end: e }))
    .sort((a, b) => a.end - b.end);
  const timelineEnd = Math.max(...sorted.map((i) => i.end));

  const render = (picked: Set<number>, curIdx: number, skipped: Set<number>) =>
    sorted.map((iv, i) => ({
      label: iv.label,
      start: iv.start,
      end: iv.end,
      kind: (picked.has(i)
        ? "picked"
        : i === curIdx
          ? "current"
          : skipped.has(i)
            ? "skipped"
            : "candidate") as IntervalKind,
    }));

  steps.push({
    description: "Sort activities by **finish time**. Pick the earliest one.",
    variables: { strategy: "sort by end time", sorted: sorted.length },
    auxiliaryData: snapIntervals(
      "Activity Selection",
      render(new Set(), -1, new Set()),
      { start: 0, end: timelineEnd },
    ),
  });

  const picked = new Set<number>();
  const skipped = new Set<number>();
  picked.add(0);
  let lastEnd = sorted[0].end;

  steps.push({
    description: `Pick **${sorted[0].label}** — finishes earliest at ${sorted[0].end}.`,
    variables: { picked: 1, lastEnd },
    auxiliaryData: {
      ...snapIntervals("Activity Selection", render(picked, 0, skipped), {
        start: 0,
        end: timelineEnd,
      }),
      resultList: [sorted[0].label],
    },
  });

  for (let i = 1; i < sorted.length; i++) {
    const iv = sorted[i];
    if (iv.start >= lastEnd) {
      picked.add(i);
      lastEnd = iv.end;
      steps.push({
        description: `**${iv.label}** starts at ${iv.start} ≥ last end ${lastEnd === iv.end ? iv.end : lastEnd}. Pick it.`,
        variables: { picked: picked.size, lastEnd },
        auxiliaryData: {
          ...snapIntervals("Activity Selection", render(picked, i, skipped), {
            start: 0,
            end: timelineEnd,
          }),
          resultList: sorted.filter((_, k) => picked.has(k)).map((s) => s.label),
        },
      });
    } else {
      skipped.add(i);
      steps.push({
        description: `**${iv.label}** conflicts (starts ${iv.start} < ${lastEnd}). Skip.`,
        variables: { picked: picked.size, lastEnd },
        auxiliaryData: {
          ...snapIntervals("Activity Selection", render(picked, i, skipped), {
            start: 0,
            end: timelineEnd,
          }),
          resultList: sorted.filter((_, k) => picked.has(k)).map((s) => s.label),
        },
      });
    }
  }

  steps.push({
    description: `Done. Maximum non-overlapping activities = **${picked.size}**.`,
    variables: { result: picked.size },
    auxiliaryData: {
      ...snapIntervals("Activity Selection", render(picked, -1, skipped), {
        start: 0,
        end: timelineEnd,
      }),
      resultList: sorted.filter((_, k) => picked.has(k)).map((s) => s.label),
    },
  });

  return steps;
}

// ═════════════════════════════════════════════════════════════
// 2. Jump Game — can you reach the last index?
// ═════════════════════════════════════════════════════════════
export function generateJumpGameSteps(
  nums: number[] = [2, 3, 1, 1, 4],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = nums.length;

  const render = (i: number, maxReach: number) =>
    nums.map((v, k) => ({
      label: String(k),
      value: v,
      kind: (k === i
        ? "current"
        : k <= maxReach
          ? k < i
            ? "done"
            : "picked"
          : "skipped") as ItemKind,
    }));

  let maxReach = 0;
  steps.push({
    description:
      "Track the furthest index reachable so far. Walk left→right and update.",
    variables: { i: 0, maxReach, n },
    auxiliaryData: snapItems("Jump Game", render(-1, maxReach)),
  });

  for (let i = 0; i < n; i++) {
    if (i > maxReach) {
      steps.push({
        description: `At i=${i}, but maxReach=${maxReach} < i. **Stuck — cannot reach end.**`,
        variables: { i, maxReach, result: "false" },
        auxiliaryData: snapItems("Jump Game", render(i, maxReach)),
      });
      return steps;
    }
    const prev = maxReach;
    maxReach = Math.max(maxReach, i + nums[i]);
    steps.push({
      description:
        maxReach > prev
          ? `From i=${i} (value ${nums[i]}) extend reach to ${maxReach}.`
          : `From i=${i} no improvement (reach stays ${maxReach}).`,
      variables: { i, maxReach, nums_i: nums[i] },
      auxiliaryData: snapItems("Jump Game", render(i, maxReach)),
    });
    if (maxReach >= n - 1) {
      steps.push({
        description: `maxReach ${maxReach} ≥ last index ${n - 1}. **Reachable — true.**`,
        variables: { result: "true" },
        auxiliaryData: snapItems("Jump Game", render(i, maxReach)),
      });
      return steps;
    }
  }

  return steps;
}

// ═════════════════════════════════════════════════════════════
// 3. Jump Game II — min jumps to reach last index
// ═════════════════════════════════════════════════════════════
export function generateJumpGameIISteps(
  nums: number[] = [2, 3, 1, 1, 4],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = nums.length;
  const render = (i: number, end: number, farthest: number) =>
    nums.map((v, k) => ({
      label: String(k),
      value: v,
      kind: (k === i
        ? "current"
        : k === end
          ? "picked"
          : k <= farthest
            ? "idle"
            : "skipped") as ItemKind,
    }));

  let jumps = 0,
    end = 0,
    farthest = 0;

  steps.push({
    description:
      "BFS-style: each 'layer' is reached in `jumps` steps. When i hits `end`, bump jumps.",
    variables: { jumps, end, farthest },
    auxiliaryData: snapItems("Jump Game II", render(-1, end, farthest)),
  });

  for (let i = 0; i < n - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    steps.push({
      description: `At i=${i}: farthest reachable from this layer = ${farthest}.`,
      variables: { i, jumps, end, farthest },
      auxiliaryData: snapItems("Jump Game II", render(i, end, farthest)),
    });
    if (i === end) {
      jumps++;
      end = farthest;
      steps.push({
        description: `Exhausted layer; take a jump. jumps=${jumps}, new end=${end}.`,
        variables: { i, jumps, end, farthest },
        auxiliaryData: snapItems("Jump Game II", render(i, end, farthest)),
      });
    }
  }

  steps.push({
    description: `Reached last index in **${jumps}** jumps.`,
    variables: { result: jumps },
    auxiliaryData: snapItems("Jump Game II", render(n - 1, end, farthest)),
  });
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 4. Gas Station — circular tour start index
// ═════════════════════════════════════════════════════════════
export function generateGasStationSteps(
  gas: number[] = [1, 2, 3, 4, 5],
  cost: number[] = [3, 4, 5, 1, 2],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = gas.length;
  const diffs = gas.map((g, i) => g - cost[i]);

  const render = (start: number, i: number, tank: number) =>
    diffs.map((d, k) => ({
      label: `#${k}`,
      value: d >= 0 ? `+${d}` : String(d),
      kind: (k === i
        ? "current"
        : k === start
          ? "picked"
          : k < start
            ? "skipped"
            : "idle") as ItemKind,
    }));

  let total = 0,
    tank = 0,
    start = 0;

  steps.push({
    description:
      "Each station contributes `gas[i] - cost[i]`. If total < 0, impossible.",
    variables: { tank, start },
    auxiliaryData: snapItems("Gas Station (diffs)", render(0, -1, tank)),
  });

  for (let i = 0; i < n; i++) {
    total += diffs[i];
    tank += diffs[i];
    if (tank < 0) {
      steps.push({
        description: `Tank dips below 0 at station ${i}. Reset start to ${i + 1}.`,
        variables: { i, tank, start: i + 1, total },
        auxiliaryData: snapItems("Gas Station (diffs)", render(i + 1, i, tank)),
      });
      start = i + 1;
      tank = 0;
    } else {
      steps.push({
        description: `Visit station ${i}: tank += ${diffs[i]} → ${tank}.`,
        variables: { i, tank, start, total },
        auxiliaryData: snapItems("Gas Station (diffs)", render(start, i, tank)),
      });
    }
  }

  if (total < 0) {
    steps.push({
      description: `Total supply ${total} < 0. **No valid start — return -1.**`,
      variables: { result: -1, total },
      auxiliaryData: snapItems("Gas Station (diffs)", render(-1, -1, tank)),
    });
  } else {
    steps.push({
      description: `Tour possible starting at station **${start}**.`,
      variables: { result: start, total },
      auxiliaryData: snapItems("Gas Station (diffs)", render(start, -1, tank)),
    });
  }
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 5. Fractional Knapsack — sort by value/weight
// ═════════════════════════════════════════════════════════════
export function generateFractionalKnapsackSteps(
  weights: number[] = [10, 20, 30],
  values: number[] = [60, 100, 120],
  capacity: number = 50,
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const items = weights.map((w, i) => ({
    label: `I${i + 1}`,
    w,
    v: values[i],
    ratio: values[i] / w,
  }));
  items.sort((a, b) => b.ratio - a.ratio);

  const render = (
    picked: Map<number, number>,
    curIdx: number,
  ): ItemEntry[] =>
    items.map((it, k) => {
      const frac = picked.get(k);
      let kind: ItemKind = "idle";
      if (k === curIdx) kind = "current";
      else if (frac !== undefined && frac > 0) kind = "picked";
      return {
        label: it.label,
        value: `w=${it.w} v=${it.v} r=${it.ratio.toFixed(2)}${frac !== undefined && frac > 0 ? ` ×${frac.toFixed(2)}` : ""}`,
        kind,
      };
    });

  steps.push({
    description: `Sort by value/weight ratio. Capacity = ${capacity}.`,
    variables: { capacity },
    auxiliaryData: snapItems("Fractional Knapsack", render(new Map(), -1)),
  });

  const picked = new Map<number, number>();
  let cap = capacity;
  let value = 0;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (cap <= 0) break;
    if (it.w <= cap) {
      picked.set(i, 1);
      cap -= it.w;
      value += it.v;
      steps.push({
        description: `Take **all** of ${it.label}. Remaining capacity = ${cap}, value = ${value}.`,
        variables: { cap, value },
        auxiliaryData: snapItems("Fractional Knapsack", render(picked, i)),
      });
    } else {
      const frac = cap / it.w;
      picked.set(i, frac);
      value += it.v * frac;
      cap = 0;
      steps.push({
        description: `Take **${(frac * 100).toFixed(0)}%** of ${it.label}. Capacity full. Value = ${value.toFixed(2)}.`,
        variables: { cap, value: value.toFixed(2) },
        auxiliaryData: snapItems("Fractional Knapsack", render(picked, i)),
      });
    }
  }

  steps.push({
    description: `Max value = **${value.toFixed(2)}**.`,
    variables: { result: value.toFixed(2) },
    auxiliaryData: snapItems("Fractional Knapsack", render(picked, -1)),
  });
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 6. Merge Intervals
// ═════════════════════════════════════════════════════════════
export function generateMergeIntervalsSteps(
  input: [number, number][] = [
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const sorted = [...input]
    .map(([s, e], i) => ({ label: `I${i + 1}`, start: s, end: e }))
    .sort((a, b) => a.start - b.start);
  const timelineEnd = Math.max(...sorted.map((i) => i.end));

  type Merged = { label: string; start: number; end: number };
  const merged: Merged[] = [];

  const render = (curIdx: number): IntervalEntry[] => [
    ...merged.map(
      (m, i): IntervalEntry => ({
        label: `M${i + 1} [${m.start},${m.end}]`,
        start: m.start,
        end: m.end,
        kind: "picked",
      }),
    ),
    ...sorted.map(
      (iv, i): IntervalEntry => ({
        label: iv.label,
        start: iv.start,
        end: iv.end,
        kind: i === curIdx ? "current" : i < curIdx ? "skipped" : "candidate",
      }),
    ),
  ];

  steps.push({
    description: "Sort intervals by **start time**, then sweep left→right.",
    variables: {},
    auxiliaryData: snapIntervals("Merge Intervals", render(-1), {
      start: 0,
      end: timelineEnd,
    }),
  });

  for (let i = 0; i < sorted.length; i++) {
    const iv = sorted[i];
    const last = merged[merged.length - 1];
    if (last && iv.start <= last.end) {
      last.end = Math.max(last.end, iv.end);
      last.label = `M${merged.length} [${last.start},${last.end}]`;
      steps.push({
        description: `${iv.label} overlaps last merged block — extend end to ${last.end}.`,
        variables: { mergedCount: merged.length },
        auxiliaryData: {
          ...snapIntervals("Merge Intervals", render(i), {
            start: 0,
            end: timelineEnd,
          }),
          resultList: merged.map((m) => `[${m.start},${m.end}]`),
        },
      });
    } else {
      merged.push({
        label: `M${merged.length + 1}`,
        start: iv.start,
        end: iv.end,
      });
      steps.push({
        description: `${iv.label} starts a new merged block.`,
        variables: { mergedCount: merged.length },
        auxiliaryData: {
          ...snapIntervals("Merge Intervals", render(i), {
            start: 0,
            end: timelineEnd,
          }),
          resultList: merged.map((m) => `[${m.start},${m.end}]`),
        },
      });
    }
  }

  steps.push({
    description: `Done. Merged into **${merged.length}** intervals.`,
    variables: { result: merged.length },
    auxiliaryData: {
      ...snapIntervals("Merge Intervals", render(-1), {
        start: 0,
        end: timelineEnd,
      }),
      resultList: merged.map((m) => `[${m.start},${m.end}]`),
    },
  });
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 7. Non-overlapping Intervals — min intervals to remove
// ═════════════════════════════════════════════════════════════
export function generateNonOverlappingSteps(
  input: [number, number][] = [
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 3],
  ],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const sorted = [...input]
    .map(([s, e], i) => ({ label: `I${i + 1}`, start: s, end: e }))
    .sort((a, b) => a.end - b.end);
  const timelineEnd = Math.max(...sorted.map((i) => i.end));

  const kept = new Set<number>();
  const removed = new Set<number>();
  let removeCount = 0;
  let lastEnd = -Infinity;

  const render = (curIdx: number): IntervalEntry[] =>
    sorted.map((iv, i) => ({
      label: iv.label,
      start: iv.start,
      end: iv.end,
      kind: (i === curIdx
        ? "current"
        : kept.has(i)
          ? "picked"
          : removed.has(i)
            ? "conflict"
            : "candidate") as IntervalKind,
    }));

  steps.push({
    description:
      "Sort by **end time**. Keep as many non-overlapping intervals as possible; the rest get removed.",
    variables: { removed: removeCount },
    auxiliaryData: snapIntervals("Non-overlapping Intervals", render(-1), {
      start: 0,
      end: timelineEnd,
    }),
  });

  for (let i = 0; i < sorted.length; i++) {
    const iv = sorted[i];
    if (iv.start >= lastEnd) {
      kept.add(i);
      lastEnd = iv.end;
      steps.push({
        description: `Keep ${iv.label}. lastEnd = ${lastEnd}.`,
        variables: { removed: removeCount, lastEnd },
        auxiliaryData: snapIntervals(
          "Non-overlapping Intervals",
          render(i),
          { start: 0, end: timelineEnd },
        ),
      });
    } else {
      removed.add(i);
      removeCount++;
      steps.push({
        description: `${iv.label} overlaps — remove it.`,
        variables: { removed: removeCount, lastEnd },
        auxiliaryData: snapIntervals(
          "Non-overlapping Intervals",
          render(i),
          { start: 0, end: timelineEnd },
        ),
      });
    }
  }

  steps.push({
    description: `Minimum removals = **${removeCount}**.`,
    variables: { result: removeCount },
    auxiliaryData: snapIntervals("Non-overlapping Intervals", render(-1), {
      start: 0,
      end: timelineEnd,
    }),
  });
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 8. Task Scheduler — with cooldown
// ═════════════════════════════════════════════════════════════
export function generateTaskSchedulerSteps(
  tasks: string[] = ["A", "A", "A", "B", "B", "B"],
  n: number = 2,
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const freq: Record<string, number> = {};
  for (const t of tasks) freq[t] = (freq[t] ?? 0) + 1;
  const counts = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const maxF = counts[0][1];
  const tied = counts.filter(([, c]) => c === maxF).length;
  const est = Math.max(tasks.length, (maxF - 1) * (n + 1) + tied);

  const schedule: string[] = [];

  const render = (highlightTask?: string): ItemEntry[] =>
    counts.map(([t, c]) => ({
      label: t,
      value: `freq=${c}`,
      kind: t === highlightTask ? "current" : "idle",
    }));

  steps.push({
    description: `Count frequencies. Most frequent = **${counts[0][0]}** (${maxF}×). Cooldown n = ${n}.`,
    variables: { maxF, tied, n },
    auxiliaryData: snapItems("Task Scheduler", render(counts[0][0])),
  });

  // Simulation using the classic formula
  steps.push({
    description: `Formula: max(len(tasks), (maxF - 1) × (n + 1) + tied).\nSlots = max(${tasks.length}, (${maxF} - 1) × ${n + 1} + ${tied}) = **${est}**.`,
    variables: { result: est },
    auxiliaryData: {
      ...snapItems("Task Scheduler", render()),
      resultList: [`total slots = ${est}`],
    },
  });

  // Build a sample schedule to visualize
  const remaining = counts.map(([t, c]) => ({ t, c }));
  let slot = 0;
  while (remaining.some((r) => r.c > 0)) {
    const block: string[] = [];
    const used = new Set<string>();
    for (let k = 0; k < n + 1 && remaining.some((r) => r.c > 0); k++) {
      remaining.sort((a, b) => b.c - a.c);
      const pick = remaining.find((r) => r.c > 0 && !used.has(r.t));
      if (pick) {
        block.push(pick.t);
        used.add(pick.t);
        pick.c--;
      } else {
        block.push("idle");
      }
      slot++;
      if (!remaining.some((r) => r.c > 0)) break;
    }
    schedule.push(...block);
  }
  while (schedule.length < est) schedule.push("idle");

  steps.push({
    description: "Example schedule respecting cooldown:",
    variables: { slots: schedule.length },
    auxiliaryData: {
      ...snapItems(
        "Task Scheduler — schedule",
        schedule.slice(0, est).map((t, i) => ({
          label: `t${i}`,
          value: t,
          kind: t === "idle" ? "skipped" : ("picked" as ItemKind),
        })),
      ),
      resultList: [schedule.slice(0, est).join(" → ")],
    },
  });

  return steps;
}

// ═════════════════════════════════════════════════════════════
// 9. Huffman Coding — build optimal prefix tree
// ═════════════════════════════════════════════════════════════
export function generateHuffmanSteps(
  chars: string[] = ["a", "b", "c", "d", "e", "f"],
  freqs: number[] = [5, 9, 12, 13, 16, 45],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  interface Node {
    label: string;
    freq: number;
    code?: string;
  }

  let heap: Node[] = chars.map((c, i) => ({ label: c, freq: freqs[i] }));

  const render = (highlight: Set<string> = new Set()): ItemEntry[] =>
    [...heap]
      .sort((a, b) => a.freq - b.freq)
      .map((n) => ({
        label: n.label,
        value: n.freq,
        kind: highlight.has(n.label) ? "current" : ("idle" as ItemKind),
      }));

  steps.push({
    description: "Start with each character as a leaf node.",
    variables: { heapSize: heap.length },
    auxiliaryData: snapItems("Huffman — initial nodes", render()),
  });

  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const lo = heap.shift()!;
    const hi = heap.shift()!;
    const parent: Node = {
      label: `(${lo.label}+${hi.label})`,
      freq: lo.freq + hi.freq,
    };
    steps.push({
      description: `Pop two smallest: **${lo.label}**(${lo.freq}) + **${hi.label}**(${hi.freq}) → ${parent.label}(${parent.freq}).`,
      variables: { merged: parent.freq, heapSize: heap.length + 1 },
      auxiliaryData: snapItems(
        "Huffman — merging",
        render(new Set([lo.label, hi.label])),
      ),
    });
    heap.push(parent);
  }

  steps.push({
    description: `Root frequency = total characters = **${heap[0].freq}**. Huffman tree complete.`,
    variables: { total: heap[0].freq },
    auxiliaryData: {
      ...snapItems("Huffman — done", render()),
      resultList: [`root freq = ${heap[0].freq}`],
    },
  });

  return steps;
}
