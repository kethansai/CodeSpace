import type { AnimationStep } from "@/data/types";

// ─── Radix Sort Visualization ───
export function generateRadixSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];
  const max = Math.max(...arr);

  steps.push({
    description: `Starting Radix Sort on [${arr.join(", ")}] — max value = ${max}`,
    array: [...arr],
    actions: [],
  });

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    steps.push({
      description: `Processing digit position: ${exp === 1 ? "ones" : exp === 10 ? "tens" : exp === 100 ? "hundreds" : `${exp}s`}`,
      array: [...arr],
      actions: [{ type: "highlight", indices: arr.map((_, i) => i) }],
    });

    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i]! / exp) % 10;
      buckets[digit]!.push(arr[i]!);
      steps.push({
        description: `${arr[i]} → bucket ${digit} (digit at ${exp}s place)`,
        array: [...arr],
        actions: [{ type: "visit", indices: [i] }],
      });
    }

    let idx = 0;
    for (let d = 0; d < 10; d++) {
      for (const val of buckets[d]!) {
        arr[idx] = val;
        steps.push({
          description: `Collect from bucket ${d}: ${val} → index ${idx}`,
          array: [...arr],
          actions: [{ type: "set", indices: [idx] }],
        });
        idx++;
      }
    }
  }

  steps.push({
    description: `Radix Sort complete! [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ─── Shell Sort Visualization ───
export function generateShellSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];
  const n = arr.length;

  steps.push({
    description: `Starting Shell Sort on [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      description: `Gap = ${gap}: performing gapped insertion sort`,
      array: [...arr],
      actions: [{ type: "highlight", indices: arr.map((_, i) => i) }],
    });

    for (let i = gap; i < n; i++) {
      const temp = arr[i]!;
      let j = i;
      steps.push({
        description: `Key = ${temp} at index ${i}`,
        array: [...arr],
        actions: [{ type: "pivot", indices: [i] }],
      });

      while (j >= gap && arr[j - gap]! > temp) {
        steps.push({
          description: `${arr[j - gap]} > ${temp}: shift ${arr[j - gap]} from ${j - gap} to ${j}`,
          array: [...arr],
          actions: [{ type: "compare", indices: [j, j - gap] }],
        });
        arr[j] = arr[j - gap]!;
        j -= gap;
      }
      arr[j] = temp;
      steps.push({
        description: `Place ${temp} at index ${j}`,
        array: [...arr],
        actions: [{ type: "swap", indices: [j] }],
      });
    }
  }

  steps.push({
    description: `Shell Sort complete! [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ─── Queue Operations Visualization ───
export function generateQueueSteps(input: number[]): AnimationStep[] {
  const arr: number[] = [];
  const steps: AnimationStep[] = [];

  steps.push({
    description: "Starting with empty queue",
    array: [],
    actions: [],
  });

  for (const val of input) {
    arr.push(val);
    steps.push({
      description: `Enqueue ${val} → Queue: [${arr.join(" → ")}]`,
      array: [...arr],
      actions: [{ type: "insert", indices: [arr.length - 1] }],
    });
  }

  while (arr.length > 0) {
    const val = arr.shift();
    steps.push({
      description: `Dequeue ${val} → Queue: [${arr.join(" → ")}]`,
      array: [...arr],
      actions: arr.length > 0 ? [{ type: "highlight", indices: [0] }] : [],
    });
  }

  steps.push({
    description: "Queue empty. FIFO operations complete!",
    array: [],
    actions: [],
  });
  return steps;
}

// ─── Knapsack DP Visualization ───
export function generateKnapsackSteps(
  weights: number[],
  values: number[],
  capacity: number,
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const dp = new Array(capacity + 1).fill(0);

  steps.push({
    description: `0/1 Knapsack — Capacity: ${capacity}, Items: ${weights.length}`,
    array: [...dp],
    actions: [],
  });

  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]!; w--) {
      const prev = dp[w];
      dp[w] = Math.max(dp[w], dp[w - weights[i]!]! + values[i]!);
      if (dp[w] !== prev) {
        steps.push({
          description: `Item ${i + 1} (w=${weights[i]}, v=${values[i]}): dp[${w}] = max(${prev}, ${dp[w - weights[i]!]} + ${values[i]}) = ${dp[w]}`,
          array: [...dp],
          actions: [
            { type: "set", indices: [w] },
            { type: "compare", indices: [w - weights[i]!] },
          ],
        });
      }
    }
  }

  steps.push({
    description: `Knapsack complete! Max value = ${dp[capacity]}`,
    array: [...dp],
    actions: dp.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ─── LCS Visualization (1D trace) ───
export function generateLCSSteps(): AnimationStep[] {
  const s1 = "ABCDE";
  const s2 = "ACE";
  const m = s1.length,
    n = s2.length;
  const steps: AnimationStep[] = [];
  const prev = new Array(n + 1).fill(0);
  const curr = new Array(n + 1).fill(0);

  steps.push({
    description: `LCS of "${s1}" and "${s2}"`,
    array: [...prev],
    actions: [],
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        curr[j] = prev[j - 1]! + 1;
        steps.push({
          description: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}': dp[${j}] = ${curr[j]}`,
          array: [...curr],
          actions: [{ type: "complete", indices: [j] }],
        });
      } else {
        curr[j] = Math.max(prev[j]!, curr[j - 1]!);
        steps.push({
          description: `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}': dp[${j}] = max(${prev[j]}, ${curr[j - 1]}) = ${curr[j]}`,
          array: [...curr],
          actions: [{ type: "compare", indices: [j] }],
        });
      }
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j]!;
  }

  steps.push({
    description: `LCS length = ${prev[n]}`,
    array: [...prev],
    actions: prev.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ─── Coin Change DP Visualization ───
export function generateCoinChangeSteps(
  coins: number[],
  amount: number,
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  steps.push({
    description: `Coin Change: coins = [${coins.join(", ")}], amount = ${amount}`,
    array: dp.map((v: number) => (v === Infinity ? -1 : v)),
    actions: [{ type: "set", indices: [0] }],
  });

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      if (dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        steps.push({
          description: `Using coin ${coin}: dp[${i}] = dp[${i - coin}] + 1 = ${dp[i]}`,
          array: dp.map((v: number) => (v === Infinity ? -1 : v)),
          actions: [
            { type: "set", indices: [i] },
            { type: "compare", indices: [i - coin] },
          ],
        });
      }
    }
  }

  steps.push({
    description: `Min coins for ${amount} = ${dp[amount] === Infinity ? "impossible" : dp[amount]}`,
    array: dp.map((v: number) => (v === Infinity ? -1 : v)),
    actions: dp.map((_: number, i: number) => ({
      type: "complete" as const,
      indices: [i],
    })),
  });
  return steps;
}

// ─── LIS Visualization ───
export function generateLISSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];
  const tails: number[] = [];

  steps.push({
    description: `LIS on [${arr.join(", ")}] using Patience Sorting`,
    array: [...arr],
    actions: [],
  });

  for (let i = 0; i < arr.length; i++) {
    let lo = 0,
      hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid]! < arr[i]!) lo = mid + 1;
      else hi = mid;
    }

    steps.push({
      description: `Process ${arr[i]}: binary search position = ${lo}`,
      array: [...arr],
      actions: [{ type: "pivot", indices: [i] }],
    });

    if (lo === tails.length) {
      tails.push(arr[i]!);
      steps.push({
        description: `Extend: tails = [${tails.join(", ")}], LIS length = ${tails.length}`,
        array: [...arr],
        actions: [{ type: "complete", indices: [i] }],
      });
    } else {
      tails[lo] = arr[i]!;
      steps.push({
        description: `Replace tails[${lo}] = ${arr[i]}: tails = [${tails.join(", ")}]`,
        array: [...arr],
        actions: [{ type: "swap", indices: [i] }],
      });
    }
  }

  steps.push({
    description: `LIS length = ${tails.length}`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ─── Backtracking Visualization (Generate Subsets) ───
export function generateSubsetSteps(input: number[]): AnimationStep[] {
  const arr = [...input].slice(0, 4); // keep small
  const steps: AnimationStep[] = [];
  const subsets: number[][] = [];

  steps.push({
    description: `Generate all subsets of [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  function bt(start: number, current: number[]) {
    subsets.push([...current]);
    steps.push({
      description: `Subset found: [${current.length > 0 ? current.join(", ") : "∅"}] (${subsets.length} total)`,
      array: [...arr],
      actions: current.map((v) => ({
        type: "complete" as const,
        indices: [arr.indexOf(v)],
      })),
    });

    for (let i = start; i < arr.length; i++) {
      steps.push({
        description: `Choose ${arr[i]} at index ${i}`,
        array: [...arr],
        actions: [{ type: "pivot", indices: [i] }],
      });
      current.push(arr[i]!);
      bt(i + 1, current);
      current.pop();
      steps.push({
        description: `Backtrack: remove ${arr[i]}`,
        array: [...arr],
        actions: [{ type: "remove", indices: [i] }],
      });
    }
  }

  bt(0, []);
  steps.push({
    description: `All ${subsets.length} subsets generated!`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ─── Union-Find Visualization ───
export function generateUnionFindSteps(
  n: number,
  edges: [number, number][],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const parent = Array.from({ length: n }, (_, i) => i);

  steps.push({
    description: `Union-Find: ${n} nodes, ${edges.length} edges`,
    array: [...parent],
    actions: parent.map((_, i) => ({
      type: "highlight" as const,
      indices: [i],
    })),
  });

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]!);
    return parent[x]!;
  }

  for (const [u, v] of edges) {
    const pu = find(u);
    const pv = find(v);
    steps.push({
      description: `Union(${u}, ${v}): root(${u})=${pu}, root(${v})=${pv}`,
      array: [...parent],
      actions: [{ type: "compare", indices: [u, v] }],
    });

    if (pu !== pv) {
      parent[pv] = pu;
      steps.push({
        description: `Merged! parent[${pv}] = ${pu}`,
        array: [...parent],
        actions: [
          { type: "swap", indices: [pv] },
          { type: "complete", indices: [pu] },
        ],
      });
    } else {
      steps.push({
        description: `Already connected — cycle detected!`,
        array: [...parent],
        actions: [{ type: "pivot", indices: [u, v] }],
      });
    }
  }

  steps.push({
    description: `Union-Find complete! Components: ${new Set(parent.map((_, i) => find(i))).size}`,
    array: [...parent],
    actions: parent.map((_, i) => ({
      type: "complete" as const,
      indices: [i],
    })),
  });
  return steps;
}

// ─── Dijkstra Visualization (adjacency as array) ───
export function generateDijkstraSteps(): AnimationStep[] {
  // Graph: 6 nodes, weighted edges
  const n = 6;
  const adj: [number, number][][] = [
    [
      [1, 4],
      [2, 2],
    ], // node 0
    [[3, 5]], // node 1
    [
      [1, 1],
      [3, 8],
      [4, 10],
    ], // node 2
    [
      [4, 2],
      [5, 6],
    ], // node 3
    [[5, 3]], // node 4
    [], // node 5
  ];
  const dist = new Array(n).fill(999);
  dist[0] = 0;
  const visited = new Set<number>();
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Dijkstra from node 0. dist = [${dist.join(", ")}]`,
    array: [...dist],
    actions: [{ type: "set", indices: [0] }],
  });

  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1 || dist[u] === 999) break;
    visited.add(u);

    steps.push({
      description: `Visit node ${u} (dist = ${dist[u]})`,
      array: [...dist],
      actions: [{ type: "complete", indices: [u] }],
    });

    for (const [v, w] of adj[u]!) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        steps.push({
          description: `Relax edge ${u}→${v}: dist[${v}] = ${dist[u]} + ${w} = ${dist[v]}`,
          array: [...dist],
          actions: [
            { type: "swap", indices: [v] },
            { type: "compare", indices: [u] },
          ],
        });
      }
    }
  }

  steps.push({
    description: `Dijkstra complete! Shortest distances: [${dist.join(", ")}]`,
    array: [...dist],
    actions: dist.map((_: number, i: number) => ({
      type: "complete" as const,
      indices: [i],
    })),
  });
  return steps;
}

// ─── Topological Sort Visualization (Kahn's BFS) ───
export function generateTopologicalSortSteps(): AnimationStep[] {
  const n = 6;
  const edges: [number, number][] = [
    [5, 2],
    [5, 0],
    [4, 0],
    [4, 1],
    [2, 3],
    [3, 1],
  ];
  const adj: number[][] = Array.from({ length: n }, () => []);
  const inDeg = new Array(n).fill(0);
  const steps: AnimationStep[] = [];

  for (const [u, v] of edges) {
    adj[u]!.push(v);
    inDeg[v]++;
  }

  steps.push({
    description: `Topological Sort (Kahn's): ${n} nodes, ${edges.length} edges`,
    array: [...inDeg],
    actions: inDeg.map((_: number, i: number) => ({
      type: "highlight" as const,
      indices: [i],
    })),
  });

  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (inDeg[i] === 0) queue.push(i);
  }

  steps.push({
    description: `Initial zero in-degree nodes: [${queue.join(", ")}]`,
    array: [...inDeg],
    actions: queue.map((q) => ({ type: "pivot" as const, indices: [q] })),
  });

  const order: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    steps.push({
      description: `Process node ${u} → order: [${order.join(", ")}]`,
      array: [...inDeg],
      actions: [{ type: "complete", indices: [u] }],
    });

    for (const v of adj[u]!) {
      inDeg[v]--;
      if (inDeg[v] === 0) {
        queue.push(v);
        steps.push({
          description: `Node ${v} in-degree became 0, add to queue`,
          array: [...inDeg],
          actions: [{ type: "set", indices: [v] }],
        });
      }
    }
  }

  steps.push({
    description: `Topological order: [${order.join(" → ")}]`,
    array: order,
    actions: order.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ─── Bit Manipulation Visualization ───
export function generateBitManipSteps(n: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  let num = n;
  const bits: number[] = [];

  // Show binary representation
  for (let i = 7; i >= 0; i--) {
    bits.push((num >> i) & 1);
  }

  steps.push({
    description: `Number: ${num} = binary [${bits.join("")}]`,
    array: [...bits],
    actions: bits.map((_, i) => ({ type: "highlight" as const, indices: [i] })),
  });

  // Count set bits using Brian Kernighan's
  let count = 0;
  let x = num;
  while (x > 0) {
    const prevX = x;
    x = x & (x - 1);
    count++;
    const newBits: number[] = [];
    for (let i = 7; i >= 0; i--) newBits.push((x >> i) & 1);
    steps.push({
      description: `${prevX} & ${prevX - 1} = ${x}: cleared lowest set bit (count = ${count})`,
      array: [...newBits],
      actions: newBits.map((b, i) =>
        b === 1
          ? { type: "complete" as const, indices: [i] }
          : { type: "highlight" as const, indices: [i] },
      ),
    });
  }

  steps.push({
    description: `${num} has ${count} set bits. Is power of 2: ${count === 1 ? "Yes" : "No"}`,
    array: [...bits],
    actions: bits.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}
