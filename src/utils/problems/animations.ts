import type { AnimationStep } from "@/data/types";

// ──────────────────────────────────────────────────────────────
// Per-problem animated walkthroughs.
// Each generator returns an ordered list of AnimationSteps that
// mirror the actual algorithm the solution uses on a canonical
// example input. The steps integrate with the existing visualizer
// components (Sorting / LinkedList / Tree / Graph / StackQueue).
// ──────────────────────────────────────────────────────────────

export type ProblemVizMode =
  | "sorting"
  | "linked-list"
  | "tree"
  | "graph"
  | "stack-queue";

export interface ProblemAnimation {
  mode: ProblemVizMode;
  variant?: "queue" | "doubly";
  title: string;
  description: string;
  steps: AnimationStep[];
}

const s = (step: AnimationStep): AnimationStep => step;

// ─── Two Sum ───
function twoSum(): AnimationStep[] {
  const nums = [2, 7, 11, 15];
  const target = 9;
  const steps: AnimationStep[] = [];
  const map = new Map<number, number>();
  steps.push(
    s({
      description: `Target = ${target}. Scan once, store (value → index) in a hash map.`,
      array: [...nums],
      actions: [{ type: "highlight", indices: nums.map((_, i) => i) }],
    }),
  );
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]!;
    steps.push(
      s({
        description: `i=${i}, nums[i]=${nums[i]}. Need complement = ${target} − ${nums[i]} = ${need}. Lookup in map…`,
        array: [...nums],
        actions: [{ type: "compare", indices: [i] }],
      }),
    );
    if (map.has(need)) {
      const j = map.get(need)!;
      steps.push(
        s({
          description: `Found! map[${need}] = ${j}. Return [${j}, ${i}].`,
          array: [...nums],
          actions: [{ type: "complete", indices: [j, i] }],
        }),
      );
      return steps;
    }
    map.set(nums[i]!, i);
    steps.push(
      s({
        description: `${need} not in map. Store ${nums[i]} → ${i}. Continue.`,
        array: [...nums],
        actions: [{ type: "set", indices: [i] }],
      }),
    );
  }
  return steps;
}

// ─── Reverse String ───
function reverseString(): AnimationStep[] {
  const arr = ["h", "e", "l", "l", "o"].map((c) => c.charCodeAt(0));
  const steps: AnimationStep[] = [];
  let l = 0,
    r = arr.length - 1;
  steps.push(
    s({
      description: `Two pointers: l=0, r=${r}. Swap s[l] ↔ s[r], move inward.`,
      array: [...arr],
      actions: [{ type: "highlight", indices: [l, r] }],
    }),
  );
  while (l < r) {
    steps.push(
      s({
        description: `Swap s[${l}]='${String.fromCharCode(arr[l]!)}' ↔ s[${r}]='${String.fromCharCode(arr[r]!)}'`,
        array: [...arr],
        actions: [{ type: "compare", indices: [l, r] }],
      }),
    );
    [arr[l], arr[r]] = [arr[r]!, arr[l]!];
    steps.push(
      s({
        description: `After swap`,
        array: [...arr],
        actions: [{ type: "swap", indices: [l, r] }],
      }),
    );
    l++;
    r--;
  }
  steps.push(
    s({
      description: `Pointers crossed. String reversed in-place.`,
      array: [...arr],
      actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Valid Parentheses ───
function validParentheses(): AnimationStep[] {
  const input = "({[]})";
  const map: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  const steps: AnimationStep[] = [];
  const enc = (c: string) => c.charCodeAt(0);
  steps.push(
    s({
      description: `Input "${input}". Push openers, match on closers.`,
      array: stack.map(enc),
      actions: [],
    }),
  );
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if ("([{".includes(ch)) {
      stack.push(ch);
      steps.push(
        s({
          description: `'${ch}' is an opener — push. Stack: [${stack.join(",")}]`,
          array: stack.map(enc),
          actions: [{ type: "insert", indices: [stack.length - 1] }],
        }),
      );
    } else {
      const top = stack[stack.length - 1];
      if (top === map[ch]) {
        stack.pop();
        steps.push(
          s({
            description: `'${ch}' matches top '${top}' — pop. Stack: [${stack.join(",")}]`,
            array: stack.map(enc),
            actions: [{ type: "remove", indices: [stack.length] }],
          }),
        );
      } else {
        steps.push(
          s({
            description: `Mismatch! '${ch}' does not close '${top ?? "(empty)"}'. Return false.`,
            array: stack.map(enc),
            actions: [{ type: "swap", indices: [Math.max(0, stack.length - 1)] }],
          }),
        );
        return steps;
      }
    }
  }
  steps.push(
    s({
      description: stack.length === 0
        ? `Stack empty at end → valid! Return true.`
        : `Stack not empty → invalid.`,
      array: stack.map(enc),
      actions: stack.length ? [] : [{ type: "complete", indices: [0] }],
    }),
  );
  return steps;
}

// ─── Merge Sorted Arrays ───
function mergeSortedArrays(): AnimationStep[] {
  const nums1 = [1, 2, 3, 0, 0, 0];
  const nums2 = [2, 5, 6];
  const m = 3,
    n = 3;
  const steps: AnimationStep[] = [];
  let i = m - 1,
    j = n - 1,
    k = m + n - 1;
  steps.push(
    s({
      description: `Merge from the back to avoid overwrites. i=${i}, j=${j}, k=${k}.`,
      array: [...nums1],
      actions: [{ type: "highlight", indices: [i, k] }],
    }),
  );
  while (i >= 0 && j >= 0) {
    if (nums1[i]! > nums2[j]!) {
      nums1[k] = nums1[i]!;
      steps.push(
        s({
          description: `nums1[${i}]=${nums1[i]} > nums2[${j}]=${nums2[j]} → place at k=${k}`,
          array: [...nums1],
          actions: [{ type: "set", indices: [k] }],
        }),
      );
      i--;
    } else {
      nums1[k] = nums2[j]!;
      steps.push(
        s({
          description: `nums2[${j}]=${nums2[j]} ≥ nums1[${i}]=${nums1[i]} → place at k=${k}`,
          array: [...nums1],
          actions: [{ type: "insert", indices: [k] }],
        }),
      );
      j--;
    }
    k--;
  }
  while (j >= 0) {
    nums1[k] = nums2[j]!;
    steps.push(
      s({
        description: `Drain nums2[${j}]=${nums2[j]} → k=${k}`,
        array: [...nums1],
        actions: [{ type: "insert", indices: [k] }],
      }),
    );
    j--;
    k--;
  }
  steps.push(
    s({
      description: `Merged in-place: [${nums1.join(", ")}]`,
      array: [...nums1],
      actions: nums1.map((_, idx) => ({
        type: "complete" as const,
        indices: [idx],
      })),
    }),
  );
  return steps;
}

// ─── Maximum Subarray (Kadane) ───
function maxSubarray(): AnimationStep[] {
  const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const steps: AnimationStep[] = [];
  let cur = nums[0]!,
    best = nums[0]!,
    bestL = 0,
    bestR = 0,
    l = 0;
  steps.push(
    s({
      description: `Kadane: cur=${cur}, best=${best}. For each i, cur = max(nums[i], cur+nums[i]).`,
      array: [...nums],
      actions: [{ type: "highlight", indices: [0] }],
    }),
  );
  for (let i = 1; i < nums.length; i++) {
    if (nums[i]! > cur + nums[i]!) {
      cur = nums[i]!;
      l = i;
      steps.push(
        s({
          description: `Restart window at i=${i}, cur=${cur}`,
          array: [...nums],
          actions: [{ type: "pivot", indices: [i] }],
        }),
      );
    } else {
      cur = cur + nums[i]!;
      steps.push(
        s({
          description: `Extend window [${l}..${i}], cur=${cur}`,
          array: [...nums],
          actions: [{ type: "visit", indices: [i] }],
        }),
      );
    }
    if (cur > best) {
      best = cur;
      bestL = l;
      bestR = i;
      steps.push(
        s({
          description: `New best=${best} over [${bestL}..${bestR}]`,
          array: [...nums],
          actions: [
            {
              type: "highlight",
              indices: Array.from({ length: bestR - bestL + 1 }, (_, k) => bestL + k),
            },
          ],
        }),
      );
    }
  }
  steps.push(
    s({
      description: `Max subarray sum = ${best}, indices [${bestL}..${bestR}]`,
      array: [...nums],
      actions: [
        {
          type: "complete",
          indices: Array.from({ length: bestR - bestL + 1 }, (_, k) => bestL + k),
        },
      ],
    }),
  );
  return steps;
}

// ─── Climbing Stairs (DP) ───
function climbingStairs(): AnimationStep[] {
  const n = 6;
  const dp = new Array<number>(n + 1).fill(0);
  const steps: AnimationStep[] = [];
  dp[0] = 1;
  dp[1] = 1;
  steps.push(
    s({
      description: `dp[i] = ways to reach step i. Base: dp[0]=1, dp[1]=1.`,
      array: [...dp],
      actions: [{ type: "set", indices: [0, 1] }],
    }),
  );
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    steps.push(
      s({
        description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        array: [...dp],
        actions: [
          { type: "compare", indices: [i - 1, i - 2] },
          { type: "set", indices: [i] },
        ],
      }),
    );
  }
  steps.push(
    s({
      description: `Answer: dp[${n}] = ${dp[n]} distinct ways.`,
      array: [...dp],
      actions: [{ type: "complete", indices: [n] }],
    }),
  );
  return steps;
}

// ─── Best Time to Buy & Sell Stock ───
function bestStock(): AnimationStep[] {
  const prices = [7, 1, 5, 3, 6, 4];
  const steps: AnimationStep[] = [];
  let minP = prices[0]!,
    minIdx = 0,
    best = 0,
    bestBuy = 0,
    bestSell = 0;
  steps.push(
    s({
      description: `Track running min price; at each day, profit = price − min.`,
      array: [...prices],
      actions: [{ type: "pivot", indices: [0] }],
    }),
  );
  for (let i = 1; i < prices.length; i++) {
    if (prices[i]! < minP) {
      minP = prices[i]!;
      minIdx = i;
      steps.push(
        s({
          description: `New min: prices[${i}]=${minP}`,
          array: [...prices],
          actions: [{ type: "pivot", indices: [i] }],
        }),
      );
    } else {
      const profit = prices[i]! - minP;
      steps.push(
        s({
          description: `Sell at i=${i}: profit = ${prices[i]} − ${minP} = ${profit}`,
          array: [...prices],
          actions: [
            { type: "compare", indices: [minIdx, i] },
          ],
        }),
      );
      if (profit > best) {
        best = profit;
        bestBuy = minIdx;
        bestSell = i;
        steps.push(
          s({
            description: `New best profit = ${best} (buy @${minIdx}, sell @${i})`,
            array: [...prices],
            actions: [{ type: "highlight", indices: [bestBuy, bestSell] }],
          }),
        );
      }
    }
  }
  steps.push(
    s({
      description: `Max profit = ${best} (buy day ${bestBuy}, sell day ${bestSell})`,
      array: [...prices],
      actions: [{ type: "complete", indices: [bestBuy, bestSell] }],
    }),
  );
  return steps;
}

// ─── Contains Duplicate ───
function containsDuplicate(): AnimationStep[] {
  const nums = [1, 2, 3, 1];
  const seen = new Set<number>();
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `Scan left→right. Keep a Set of seen values.`,
      array: [...nums],
      actions: [{ type: "highlight", indices: nums.map((_, i) => i) }],
    }),
  );
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i]!)) {
      steps.push(
        s({
          description: `nums[${i}]=${nums[i]} already in set → duplicate! Return true.`,
          array: [...nums],
          actions: [{ type: "swap", indices: [i] }],
        }),
      );
      return steps;
    }
    seen.add(nums[i]!);
    steps.push(
      s({
        description: `Add ${nums[i]} to set. Size=${seen.size}`,
        array: [...nums],
        actions: [{ type: "set", indices: [i] }],
      }),
    );
  }
  steps.push(
    s({
      description: `No duplicates found. Return false.`,
      array: [...nums],
      actions: nums.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Linked List Cycle (Floyd) ───
function linkedListCycle(): AnimationStep[] {
  // LeetCode-style example: head=[3,2,0,-4], pos=1 (tail's next is index 1).
  const vals = [3, 2, 0, -4];
  const cycleStart = 1;
  const steps: AnimationStep[] = [];
  const next = (i: number) => (i === vals.length - 1 ? cycleStart : i + 1);
  let slow = 0;
  let fast = 0;
  steps.push(
    s({
      title: "Init",
      description: `Floyd's tortoise & hare. slow advances 1 step, fast advances 2.`,
      array: [...vals],
      actions: [{ type: "highlight", indices: [slow] }],
      pointers: { slow, fast },
    }),
  );
  // Bounded by 2 × n to prevent any infinite loop in pathological inputs.
  for (let step = 0; step < vals.length * 2; step++) {
    slow = next(slow);
    fast = next(next(fast));
    if (slow === fast) {
      steps.push(
        s({
          title: `Met at node ${slow}`,
          description: `slow == fast at node index ${slow} (val ${vals[slow]}) → cycle detected. Return true.`,
          array: [...vals],
          actions: [{ type: "complete", indices: [slow] }],
          pointers: { slow, fast },
        }),
      );
      return steps;
    }
    steps.push(
      s({
        title: `Step ${step + 1}`,
        description: `slow → idx ${slow} (val ${vals[slow]}); fast → idx ${fast} (val ${vals[fast]}).`,
        array: [...vals],
        actions: [
          { type: "compare", indices: [slow] },
          { type: "pivot", indices: [fast] },
        ],
        pointers: { slow, fast },
      }),
    );
  }
  steps.push(
    s({
      title: "No cycle",
      description: `fast walked off the end without meeting slow → return false.`,
      array: [...vals],
      actions: vals.map((_, i) => ({ type: "visit" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Binary Search ───
function binarySearchProblem(): AnimationStep[] {
  const nums = [-1, 0, 3, 5, 9, 12];
  const target = 9;
  const steps: AnimationStep[] = [];
  let l = 0,
    r = nums.length - 1;
  steps.push(
    s({
      description: `Search ${target} in sorted array. l=${l}, r=${r}.`,
      array: [...nums],
      actions: [{ type: "highlight", indices: [l, r] }],
    }),
  );
  while (l <= r) {
    const m = (l + r) >> 1;
    steps.push(
      s({
        description: `mid=${m}, nums[mid]=${nums[m]}`,
        array: [...nums],
        actions: [{ type: "pivot", indices: [m] }],
      }),
    );
    if (nums[m] === target) {
      steps.push(
        s({
          description: `Found ${target} at index ${m}.`,
          array: [...nums],
          actions: [{ type: "complete", indices: [m] }],
        }),
      );
      return steps;
    } else if (nums[m]! < target) {
      l = m + 1;
      steps.push(
        s({
          description: `${nums[m]} < ${target} → go right. l=${l}`,
          array: [...nums],
          actions: [
            {
              type: "visit",
              indices: Array.from({ length: l }, (_, i) => i),
            },
          ],
        }),
      );
    } else {
      r = m - 1;
      steps.push(
        s({
          description: `${nums[m]} > ${target} → go left. r=${r}`,
          array: [...nums],
          actions: [
            {
              type: "visit",
              indices: Array.from({ length: nums.length - 1 - r }, (_, i) => r + 1 + i),
            },
          ],
        }),
      );
    }
  }
  return steps;
}

// ─── Max Depth Binary Tree ───
function maxDepthTree(): AnimationStep[] {
  // heap-style array layout: [3,9,20,_,_,15,7]
  const data = [3, 9, 20, 0, 0, 15, 7];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `DFS each node; depth(node) = 1 + max(depth(L), depth(R)).`,
      array: [...data],
      actions: [{ type: "highlight", indices: [0] }],
    }),
  );
  const order = [0, 1, 2, 5, 6]; // skip the null placeholders
  for (const i of order) {
    steps.push(
      s({
        description: `Visit node at index ${i}, value ${data[i]}`,
        array: [...data],
        actions: [{ type: "visit", indices: [i] }],
      }),
    );
  }
  steps.push(
    s({
      description: `Leaves (15, 7) contribute depth 1 → node 20 has depth 2 → root has depth 3.`,
      array: [...data],
      actions: [
        { type: "compare", indices: [5, 6] },
        { type: "highlight", indices: [2] },
        { type: "complete", indices: [0] },
      ],
    }),
  );
  return steps;
}

// ─── Number of Islands ───
function numberOfIslands(): AnimationStep[] {
  // Grid (2 rows × 4 cols) flattened row-major:
  //   row 0: 1 1 0 1
  //   row 1: 1 0 1 0
  // Adjacency (4-dir): {0,1,4} and {3,6} → 2 islands.
  const data = [1, 1, 0, 1, 1, 0, 1, 0];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `Grid (2×4): row0=[1,1,0,1], row1=[1,0,1,0]. Scan cells; on '1', DFS-flood that component.`,
      array: [...data],
      actions: [],
      variables: { rows: 2, cols: 4, count: 0 },
    }),
  );
  // Island 1: cells {0, 1, 4}
  for (const i of [0, 1, 4]) {
    steps.push(
      s({
        title: `Flood island #1`,
        description: `Visit cell ${i}=1 — mark as visited (component #1).`,
        array: [...data],
        actions: [{ type: "visit", indices: [i] }],
        variables: { count: 1 },
      }),
    );
  }
  // Island 2: cells {3, 6}
  for (const i of [3, 6]) {
    steps.push(
      s({
        title: `Flood island #2`,
        description: `Visit cell ${i}=1 — mark as visited (component #2).`,
        array: [...data],
        actions: [{ type: "visit", indices: [i] }],
        variables: { count: 2 },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Total islands = 2.`,
      array: [...data],
      actions: [{ type: "complete", indices: [0, 1, 3, 4, 6] }],
      variables: { answer: 2 },
    }),
  );
  return steps;
}

// ─── Longest Common Subsequence ───
function lcs(): AnimationStep[] {
  const a = "ABCBDAB";
  const b = "BDCAB";
  const steps: AnimationStep[] = [];
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );
  // Visualize last row as the array we display
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i]![j] = dp[i - 1]![j - 1]! + 1;
      else dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
    }
    steps.push(
      s({
        description: `Filled row i=${i} (char '${a[i - 1]}'). Row = [${dp[i]!.join(",")}]`,
        array: [...dp[i]!],
        actions: [
          { type: "set", indices: dp[i]!.map((_, k) => k).filter((k) => k > 0) },
        ],
      }),
    );
  }
  steps.push(
    s({
      description: `LCS length = dp[${a.length}][${b.length}] = ${dp[a.length]![b.length]} ("BCAB" or similar).`,
      array: [...dp[a.length]!],
      actions: [{ type: "complete", indices: [b.length] }],
    }),
  );
  return steps;
}

// ─── Coin Change ───
function coinChange(): AnimationStep[] {
  const coins = [1, 2, 5];
  const amount = 11;
  const INF = amount + 1;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `dp[a] = min coins to make amount a. dp[0]=0, others = ∞.`,
      array: dp.map((v) => (v === INF ? -1 : v)),
      actions: [{ type: "set", indices: [0] }],
    }),
  );
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c]! + 1 < dp[a]!) dp[a] = dp[a - c]! + 1;
    }
    steps.push(
      s({
        description: `dp[${a}] = ${dp[a] === INF ? "∞" : dp[a]}`,
        array: dp.map((v) => (v === INF ? -1 : v)),
        actions: [{ type: "set", indices: [a] }],
      }),
    );
  }
  steps.push(
    s({
      description: `Answer: dp[${amount}] = ${dp[amount]}`,
      array: dp.map((v) => (v === INF ? -1 : v)),
      actions: [{ type: "complete", indices: [amount] }],
    }),
  );
  return steps;
}

// ─── Three Sum ───
function threeSum(): AnimationStep[] {
  const nums = [-4, -1, -1, 0, 1, 2].slice();
  nums.sort((a, b) => a - b);
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `Sort, then fix i and two-pointer (l,r) on the remainder searching for -nums[i].`,
      array: [...nums],
      actions: [{ type: "highlight", indices: nums.map((_, i) => i) }],
    }),
  );
  const found: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1,
      r = nums.length - 1;
    steps.push(
      s({
        description: `i=${i} (${nums[i]}). l=${l}, r=${r}`,
        array: [...nums],
        actions: [
          { type: "pivot", indices: [i] },
          { type: "highlight", indices: [l, r] },
        ],
      }),
    );
    while (l < r) {
      const sum = nums[i]! + nums[l]! + nums[r]!;
      steps.push(
        s({
          description: `sum = ${nums[i]}+${nums[l]}+${nums[r]} = ${sum}`,
          array: [...nums],
          actions: [{ type: "compare", indices: [i, l, r] }],
        }),
      );
      if (sum === 0) {
        found.push([nums[i]!, nums[l]!, nums[r]!]);
        steps.push(
          s({
            description: `Triplet found: [${nums[i]},${nums[l]},${nums[r]}]`,
            array: [...nums],
            actions: [{ type: "complete", indices: [i, l, r] }],
          }),
        );
        l++;
        r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  steps.push(
    s({
      description: `All triplets: ${found.map((t) => `[${t.join(",")}]`).join(", ") || "none"}`,
      array: [...nums],
      actions: [{ type: "complete", indices: nums.map((_, i) => i) }],
    }),
  );
  return steps;
}

// ─── Product Except Self ───
function productExceptSelf(): AnimationStep[] {
  const nums = [1, 2, 3, 4];
  const n = nums.length;
  const out = new Array<number>(n).fill(1);
  const steps: AnimationStep[] = [];
  let prefix = 1;
  steps.push(
    s({
      description: `Left pass: out[i] = product of nums[0..i-1].`,
      array: [...out],
      actions: [],
    }),
  );
  for (let i = 0; i < n; i++) {
    out[i] = prefix;
    prefix *= nums[i]!;
    steps.push(
      s({
        description: `out[${i}]=${out[i]} (prefix before i). prefix → ${prefix}`,
        array: [...out],
        actions: [{ type: "set", indices: [i] }],
      }),
    );
  }
  let suffix = 1;
  steps.push(
    s({
      description: `Right pass: multiply each out[i] by product of nums[i+1..n-1].`,
      array: [...out],
      actions: [],
    }),
  );
  for (let i = n - 1; i >= 0; i--) {
    out[i] = out[i]! * suffix;
    suffix *= nums[i]!;
    steps.push(
      s({
        description: `out[${i}] *= suffix → ${out[i]}. suffix → ${suffix}`,
        array: [...out],
        actions: [{ type: "set", indices: [i] }],
      }),
    );
  }
  steps.push(
    s({
      description: `Result: [${out.join(", ")}]`,
      array: [...out],
      actions: out.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Merge Intervals ───
function mergeIntervals(): AnimationStep[] {
  // Represent intervals as a flat [start,end,start,end,...] array for the viz
  const intervals: [number, number][] = [
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ];
  intervals.sort((a, b) => a[0] - b[0]);
  const steps: AnimationStep[] = [];
  const merged: [number, number][] = [];
  const flatten = (list: [number, number][]) => list.flatMap((p) => [p[0], p[1]]);
  steps.push(
    s({
      description: `Sort by start; merge if current.start ≤ last.end.`,
      array: flatten(intervals),
      actions: [{ type: "highlight", indices: [0, 1] }],
    }),
  );
  for (const iv of intervals) {
    const last = merged[merged.length - 1];
    if (!last || iv[0] > last[1]) {
      merged.push([...iv]);
      steps.push(
        s({
          description: `No overlap → add [${iv[0]}, ${iv[1]}]`,
          array: flatten(merged),
          actions: [{ type: "insert", indices: [(merged.length - 1) * 2, (merged.length - 1) * 2 + 1] }],
        }),
      );
    } else {
      last[1] = Math.max(last[1], iv[1]);
      steps.push(
        s({
          description: `Overlap with last → extend to [${last[0]}, ${last[1]}]`,
          array: flatten(merged),
          actions: [{ type: "swap", indices: [(merged.length - 1) * 2 + 1] }],
        }),
      );
    }
  }
  steps.push(
    s({
      description: `Merged: ${merged.map((p) => `[${p[0]},${p[1]}]`).join(", ")}`,
      array: flatten(merged),
      actions: flatten(merged).map((_, i) => ({
        type: "complete" as const,
        indices: [i],
      })),
    }),
  );
  return steps;
}

// ─── Rotate Array (reverse 3x) ───
function rotateArray(): AnimationStep[] {
  const nums = [1, 2, 3, 4, 5, 6, 7];
  const k = 3;
  const steps: AnimationStep[] = [];
  const reverse = (l: number, r: number, label: string) => {
    steps.push(
      s({
        description: `Reverse ${label} [${l}..${r}]`,
        array: [...nums],
        actions: [{ type: "highlight", indices: [l, r] }],
      }),
    );
    while (l < r) {
      [nums[l], nums[r]] = [nums[r]!, nums[l]!];
      l++;
      r--;
    }
    steps.push(
      s({
        description: `After reversing ${label}: [${nums.join(", ")}]`,
        array: [...nums],
        actions: [{ type: "swap", indices: nums.map((_, i) => i) }],
      }),
    );
  };
  steps.push(
    s({
      description: `Rotate right by k=${k}: reverse whole, then first k, then the rest.`,
      array: [...nums],
      actions: [],
    }),
  );
  reverse(0, nums.length - 1, "whole");
  reverse(0, k - 1, "first k");
  reverse(k, nums.length - 1, "remainder");
  steps.push(
    s({
      description: `Rotated: [${nums.join(", ")}]`,
      array: [...nums],
      actions: nums.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Group Anagrams (by sorted-key) ───
function groupAnagrams(): AnimationStep[] {
  const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
  const steps: AnimationStep[] = [];
  // Show each string's sorted key as an array of char codes
  const groups = new Map<string, string[]>();
  for (let i = 0; i < strs.length; i++) {
    const key = [...strs[i]!].sort().join("");
    steps.push(
      s({
        description: `"${strs[i]}" → sorted key "${key}". Add to bucket.`,
        array: [...key].map((c) => c.charCodeAt(0)),
        actions: [{ type: "set", indices: [0, 1, 2] }],
      }),
    );
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(strs[i]!);
  }
  const result = [...groups.values()];
  steps.push(
    s({
      description: `Groups: ${result.map((g) => `[${g.join(",")}]`).join(", ")}`,
      array: result.map((g) => g.length),
      actions: result.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Longest Substring Without Repeating ───
function longestSubstringNoRepeat(): AnimationStep[] {
  const str = "abcabcbb";
  const arr = [...str].map((c) => c.charCodeAt(0));
  const steps: AnimationStep[] = [];
  const last = new Map<string, number>();
  let l = 0,
    best = 0,
    bestL = 0,
    bestR = 0;
  steps.push(
    s({
      description: `Sliding window. Expand r; if duplicate inside window, move l past its previous index.`,
      array: [...arr],
      actions: [{ type: "highlight", indices: [0] }],
    }),
  );
  for (let r = 0; r < str.length; r++) {
    const c = str[r]!;
    if (last.has(c) && last.get(c)! >= l) {
      l = last.get(c)! + 1;
      steps.push(
        s({
          description: `Duplicate '${c}' at ${last.get(c)} — shrink: l=${l}`,
          array: [...arr],
          actions: [{ type: "remove", indices: [last.get(c)!] }],
        }),
      );
    }
    last.set(c, r);
    const len = r - l + 1;
    if (len > best) {
      best = len;
      bestL = l;
      bestR = r;
    }
    steps.push(
      s({
        description: `Window [${l}..${r}] = "${str.slice(l, r + 1)}" (len ${len}), best=${best}`,
        array: [...arr],
        actions: [
          {
            type: "highlight",
            indices: Array.from({ length: r - l + 1 }, (_, k) => l + k),
          },
        ],
      }),
    );
  }
  steps.push(
    s({
      description: `Longest = "${str.slice(bestL, bestR + 1)}" (length ${best}).`,
      array: [...arr],
      actions: [
        {
          type: "complete",
          indices: Array.from({ length: bestR - bestL + 1 }, (_, k) => bestL + k),
        },
      ],
    }),
  );
  return steps;
}

// ─── Trapping Rain Water ───
function trappingRainWater(): AnimationStep[] {
  const h = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
  const steps: AnimationStep[] = [];
  let l = 0,
    r = h.length - 1,
    lMax = 0,
    rMax = 0,
    water = 0;
  steps.push(
    s({
      description: `Two pointers. Trap water where min(lMax, rMax) > h[i].`,
      array: [...h],
      actions: [{ type: "highlight", indices: [l, r] }],
    }),
  );
  while (l < r) {
    if (h[l]! < h[r]!) {
      if (h[l]! >= lMax) lMax = h[l]!;
      else water += lMax - h[l]!;
      steps.push(
        s({
          description: `h[l]=${h[l]} < h[r]=${h[r]}. lMax=${lMax}, water=${water}`,
          array: [...h],
          actions: [{ type: "visit", indices: [l] }],
        }),
      );
      l++;
    } else {
      if (h[r]! >= rMax) rMax = h[r]!;
      else water += rMax - h[r]!;
      steps.push(
        s({
          description: `h[r]=${h[r]} ≤ h[l]=${h[l]}. rMax=${rMax}, water=${water}`,
          array: [...h],
          actions: [{ type: "visit", indices: [r] }],
        }),
      );
      r--;
    }
  }
  steps.push(
    s({
      description: `Total trapped = ${water} units.`,
      array: [...h],
      actions: h.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── LRU Cache (doubly linked list + map) ───
function lruCache(): AnimationStep[] {
  const capacity = 3;
  const order: number[] = []; // front = MRU, back = LRU
  const steps: AnimationStep[] = [];
  const ops: Array<[string, number, number?]> = [
    ["put", 1, 1],
    ["put", 2, 2],
    ["put", 3, 3],
    ["get", 2],
    ["put", 4, 4],
    ["get", 1],
    ["get", 3],
  ];
  steps.push(
    s({
      description: `LRU capacity=${capacity}. Front=most-recently-used, back=evicted first.`,
      array: [...order],
      actions: [],
    }),
  );
  for (const [op, k, v] of ops) {
    const idx = order.indexOf(k);
    if (op === "put") {
      if (idx !== -1) order.splice(idx, 1);
      else if (order.length >= capacity) {
        const evicted = order.pop();
        steps.push(
          s({
            description: `Cache full — evict LRU key ${evicted}`,
            array: [...order],
            actions: [{ type: "remove", indices: [order.length] }],
          }),
        );
      }
      order.unshift(k);
      steps.push(
        s({
          description: `put(${k}, ${v}) → move to front. Order: [${order.join(",")}]`,
          array: [...order],
          actions: [{ type: "insert", indices: [0] }],
        }),
      );
    } else {
      if (idx === -1) {
        steps.push(
          s({
            description: `get(${k}) → miss, return −1`,
            array: [...order],
            actions: [{ type: "compare", indices: [] }],
          }),
        );
      } else {
        order.splice(idx, 1);
        order.unshift(k);
        steps.push(
          s({
            description: `get(${k}) → hit. Promote to front. Order: [${order.join(",")}]`,
            array: [...order],
            actions: [{ type: "highlight", indices: [0] }],
          }),
        );
      }
    }
  }
  return steps;
}

// ─── Word Search (DFS on grid) ───
function wordSearch(): AnimationStep[] {
  // 3x4 board flattened
  const board = "ABCESFCSADEE";
  const word = "ABCCED";
  const arr = [...board].map((c) => c.charCodeAt(0));
  const steps: AnimationStep[] = [];
  // Precomputed winning path indices for "ABCCED": 0→1→2→6→10→9
  const path = [0, 1, 2, 6, 10, 9];
  steps.push(
    s({
      description: `Board "${board}" (3×4). Search word "${word}" via DFS with visited marks.`,
      array: [...arr],
      actions: [],
    }),
  );
  for (let i = 0; i < path.length; i++) {
    steps.push(
      s({
        description: `Match '${word[i]}' at cell ${path[i]}`,
        array: [...arr],
        actions: [{ type: "visit", indices: [path[i]!] }],
      }),
    );
  }
  steps.push(
    s({
      description: `All characters matched. Return true.`,
      array: [...arr],
      actions: [{ type: "complete", indices: path }],
    }),
  );
  return steps;
}

// ─── Invert Binary Tree ───
function invertBinaryTree(): AnimationStep[] {
  const data = [4, 2, 7, 1, 3, 6, 9];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `Pre-order DFS; at each node swap left & right children.`,
      array: [...data],
      actions: [{ type: "visit", indices: [0] }],
    }),
  );
  // Swap children of 4: 2<->7
  [data[1], data[2]] = [data[2]!, data[1]!];
  [data[3], data[5]] = [data[5]!, data[3]!];
  [data[4], data[6]] = [data[6]!, data[4]!];
  steps.push(
    s({
      description: `Swap L/R of root (2 ↔ 7)`,
      array: [...data],
      actions: [{ type: "swap", indices: [1, 2] }],
    }),
  );
  steps.push(
    s({
      description: `Swap children of 7 (was 2 slot): 1 ↔ 3`,
      array: [...data],
      actions: [{ type: "swap", indices: [3, 5] }],
    }),
  );
  steps.push(
    s({
      description: `Swap children of 2 (was 7 slot): 6 ↔ 9`,
      array: [...data],
      actions: [{ type: "swap", indices: [4, 6] }],
    }),
  );
  steps.push(
    s({
      description: `Tree fully inverted.`,
      array: [...data],
      actions: data.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Lowest Common Ancestor (BST) ───
function lca(): AnimationStep[] {
  // BST: root=6, [2,8,0,4,7,9,null,null,3,5]
  const data = [6, 2, 8, 0, 4, 7, 9];
  const p = 2,
    q = 4;
  const steps: AnimationStep[] = [];
  let i = 0;
  steps.push(
    s({
      description: `Find LCA of ${p} and ${q} in BST. Walk from root.`,
      array: [...data],
      actions: [{ type: "visit", indices: [0] }],
    }),
  );
  while (i < data.length) {
    const v = data[i]!;
    if (p < v && q < v) {
      i = 2 * i + 1;
      steps.push(
        s({
          description: `Both ${p},${q} < ${v} → go left`,
          array: [...data],
          actions: [{ type: "visit", indices: [i] }],
        }),
      );
    } else if (p > v && q > v) {
      i = 2 * i + 2;
      steps.push(
        s({
          description: `Both ${p},${q} > ${v} → go right`,
          array: [...data],
          actions: [{ type: "visit", indices: [i] }],
        }),
      );
    } else {
      steps.push(
        s({
          description: `Split at ${v} → LCA = ${v}`,
          array: [...data],
          actions: [{ type: "complete", indices: [i] }],
        }),
      );
      return steps;
    }
  }
  return steps;
}

// ─── Min Window Substring ───
function minWindow(): AnimationStep[] {
  const str = "ADOBECODEBANC";
  const t = "ABC";
  const arr = [...str].map((c) => c.charCodeAt(0));
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const have = new Map<string, number>();
  let required = need.size,
    formed = 0;
  let l = 0,
    best: [number, number, number] = [Infinity, 0, 0];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `Expand r; when window covers all chars of "${t}", shrink l to find minimum.`,
      array: [...arr],
      actions: [],
    }),
  );
  for (let r = 0; r < str.length; r++) {
    const c = str[r]!;
    have.set(c, (have.get(c) ?? 0) + 1);
    if (need.has(c) && have.get(c) === need.get(c)) formed++;
    while (formed === required) {
      if (r - l + 1 < best[0]) best = [r - l + 1, l, r];
      steps.push(
        s({
          description: `Window [${l}..${r}] = "${str.slice(l, r + 1)}" covers all → try shrink`,
          array: [...arr],
          actions: [
            {
              type: "highlight",
              indices: Array.from({ length: r - l + 1 }, (_, k) => l + k),
            },
          ],
        }),
      );
      const lc = str[l]!;
      have.set(lc, have.get(lc)! - 1);
      if (need.has(lc) && have.get(lc)! < need.get(lc)!) formed--;
      l++;
    }
  }
  steps.push(
    s({
      description: `Minimum window = "${str.slice(best[1], best[2] + 1)}" (length ${best[0]}).`,
      array: [...arr],
      actions: [
        {
          type: "complete",
          indices: Array.from({ length: best[2] - best[1] + 1 }, (_, k) => best[1] + k),
        },
      ],
    }),
  );
  return steps;
}

// ─── Course Schedule (cycle detection) ───
function courseSchedule(): AnimationStep[] {
  // 6 nodes; edges form a DAG
  const data = [0, 1, 2, 3, 4, 5];
  const order: number[] = [];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `Kahn's algorithm. Repeatedly remove a node with in-degree 0.`,
      array: [...data],
      actions: [],
    }),
  );
  const seq = [0, 2, 1, 3, 4, 5];
  for (const n of seq) {
    order.push(n);
    steps.push(
      s({
        description: `Take course ${n}. Order: [${order.join(", ")}]`,
        array: [...data],
        actions: [{ type: "visit", indices: [n] }],
      }),
    );
  }
  steps.push(
    s({
      description: `All ${data.length} courses taken → no cycle, schedule possible.`,
      array: [...data],
      actions: [{ type: "complete", indices: seq }],
    }),
  );
  return steps;
}

// ─── Kth Largest (quickselect-ish partial sort) ───
function kthLargest(): AnimationStep[] {
  const nums = [3, 2, 1, 5, 6, 4];
  const k = 2;
  const arr = [...nums];
  const steps: AnimationStep[] = [];
  const heap: number[] = [];
  steps.push(
    s({
      description: `Maintain a min-heap of size ${k}; top = kth largest.`,
      array: [...arr],
      actions: [],
    }),
  );
  for (let i = 0; i < arr.length; i++) {
    if (heap.length < k) {
      heap.push(arr[i]!);
      heap.sort((a, b) => a - b);
      steps.push(
        s({
          description: `Push ${arr[i]} → heap [${heap.join(",")}]`,
          array: [...arr],
          actions: [{ type: "insert", indices: [i] }],
        }),
      );
    } else if (arr[i]! > heap[0]!) {
      const oldMin = heap[0]!;
      heap[0] = arr[i]!;
      heap.sort((a, b) => a - b);
      steps.push(
        s({
          description: `${arr[i]} > heap.min=${oldMin} → replace root. Heap [${heap.join(",")}]`,
          array: [...arr],
          actions: [{ type: "swap", indices: [i] }],
        }),
      );
    } else {
      steps.push(
        s({
          description: `${arr[i]} ≤ heap min — skip`,
          array: [...arr],
          actions: [{ type: "visit", indices: [i] }],
        }),
      );
    }
  }
  steps.push(
    s({
      description: `${k}th largest = heap.top = ${heap[0]}`,
      array: [...arr],
      actions: [{ type: "complete", indices: [arr.indexOf(heap[0]!)] }],
    }),
  );
  return steps;
}

// ─── Palindrome Linked List ───
function palindromeLinkedList(): AnimationStep[] {
  const vals = [1, 2, 2, 1];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      description: `Find mid via slow/fast, reverse second half, then compare.`,
      array: [...vals],
      actions: [{ type: "highlight", indices: [0, vals.length - 1] }],
    }),
  );
  let l = 0,
    r = vals.length - 1;
  while (l < r) {
    if (vals[l] !== vals[r]) {
      steps.push(
        s({
          description: `${vals[l]} ≠ ${vals[r]} → not palindrome`,
          array: [...vals],
          actions: [{ type: "swap", indices: [l, r] }],
        }),
      );
      return steps;
    }
    steps.push(
      s({
        description: `vals[${l}]=${vals[l]} == vals[${r}]=${vals[r]} ✓`,
        array: [...vals],
        actions: [{ type: "compare", indices: [l, r] }],
      }),
    );
    l++;
    r--;
  }
  steps.push(
    s({
      description: `All mirrored → palindrome!`,
      array: [...vals],
      actions: vals.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    }),
  );
  return steps;
}

// ─── Implement Trie ───
function implementTrie(): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const enc = (s: string) => [...s].map((c) => c.charCodeAt(0));
  const ops: Array<[string, string]> = [
    ["insert", "apple"],
    ["search", "apple"],
    ["search", "app"],
    ["startsWith", "app"],
    ["insert", "app"],
    ["search", "app"],
  ];
  const words = new Set<string>();
  for (const [op, w] of ops) {
    if (op === "insert") words.add(w);
    const hit =
      op === "insert"
        ? true
        : op === "search"
          ? words.has(w)
          : [...words].some((x) => x.startsWith(w));
    steps.push(
      s({
        description: `${op}("${w}") → ${hit}`,
        array: enc(w),
        actions: [
          {
            type: op === "insert" ? "insert" : hit ? "complete" : "remove",
            indices: w.split("").map((_, i) => i),
          },
        ],
      }),
    );
  }
  return steps;
}

// ─── Median of Two Sorted Arrays ───
function medianTwoSorted(): AnimationStep[] {
  const a = [1, 3];
  const b = [2];
  const merged: number[] = [];
  const steps: AnimationStep[] = [];
  let i = 0,
    j = 0;
  steps.push(
    s({
      description: `Merge until we reach the middle.`,
      array: [...merged],
      actions: [],
    }),
  );
  while (i < a.length && j < b.length) {
    if (a[i]! <= b[j]!) {
      merged.push(a[i]!);
      i++;
    } else {
      merged.push(b[j]!);
      j++;
    }
    steps.push(
      s({
        description: `Merged so far: [${merged.join(", ")}]`,
        array: [...merged],
        actions: [{ type: "insert", indices: [merged.length - 1] }],
      }),
    );
  }
  while (i < a.length) merged.push(a[i++]!);
  while (j < b.length) merged.push(b[j++]!);
  steps.push(
    s({
      description: `Merged: [${merged.join(", ")}]`,
      array: [...merged],
      actions: merged.map((_, k) => ({ type: "visit" as const, indices: [k] })),
    }),
  );
  const n = merged.length;
  const median =
    n % 2 === 1
      ? merged[n >> 1]!
      : (merged[n / 2 - 1]! + merged[n / 2]!) / 2;
  steps.push(
    s({
      description: `Median = ${median}`,
      array: [...merged],
      actions: [
        {
          type: "complete",
          indices:
            n % 2 === 1
              ? [n >> 1]
              : [n / 2 - 1, n / 2],
        },
      ],
    }),
  );
  return steps;
}

// ─── Serialize / Deserialize Tree ───
function serializeTree(): AnimationStep[] {
  const data = [1, 2, 3, 0, 0, 4, 5]; // 0 represents null
  const steps: AnimationStep[] = [];
  const order = [0, 1, 2, 5, 6];
  steps.push(
    s({
      description: `Serialize with BFS, writing null markers for missing children.`,
      array: [...data],
      actions: [],
    }),
  );
  for (const i of order) {
    steps.push(
      s({
        description: `Emit node at ${i}: ${data[i]}`,
        array: [...data],
        actions: [{ type: "visit", indices: [i] }],
      }),
    );
  }
  steps.push(
    s({
      description: `Serialized → "1,2,#,#,3,4,5" (reversible to original tree).`,
      array: [...data],
      actions: [{ type: "complete", indices: order }],
    }),
  );
  return steps;
}

// ─── Longest Palindromic Substring (expand around center) ───
function longestPalindrome(): AnimationStep[] {
  const str = "babad";
  const arr = [...str].map((c) => c.charCodeAt(0));
  const steps: AnimationStep[] = [];
  let bestL = 0,
    bestR = 0;
  const expand = (l: number, r: number): [number, number] => {
    while (l >= 0 && r < str.length && str[l] === str[r]) {
      steps.push(
        s({
          description: `Expand around (${l},${r}) — "${str.slice(l, r + 1)}" palindrome so far`,
          array: [...arr],
          actions: [
            {
              type: "highlight",
              indices: Array.from({ length: r - l + 1 }, (_, k) => l + k),
            },
          ],
        }),
      );
      l--;
      r++;
    }
    return [l + 1, r - 1];
  };
  for (let i = 0; i < str.length; i++) {
    const [l1, r1] = expand(i, i);
    const [l2, r2] = expand(i, i + 1);
    if (r1 - l1 > bestR - bestL) {
      bestL = l1;
      bestR = r1;
    }
    if (r2 - l2 > bestR - bestL) {
      bestL = l2;
      bestR = r2;
    }
  }
  steps.push(
    s({
      description: `Longest palindrome: "${str.slice(bestL, bestR + 1)}"`,
      array: [...arr],
      actions: [
        {
          type: "complete",
          indices: Array.from({ length: bestR - bestL + 1 }, (_, k) => bestL + k),
        },
      ],
    }),
  );
  return steps;
}

// ──────────────────────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────────────────────

export const problemAnimations: Record<string, () => ProblemAnimation> = {
  "two-sum": () => ({
    mode: "sorting",
    title: "One-Pass Hash Map",
    description: "Scan once; for each element, check if (target − current) is already seen.",
    steps: twoSum(),
  }),
  "reverse-string": () => ({
    mode: "sorting",
    title: "Two Pointers Swap",
    description: "Swap s[l] ↔ s[r], then l++, r−−, until pointers cross.",
    steps: reverseString(),
  }),
  "valid-parentheses": () => ({
    mode: "stack-queue",
    title: "Bracket Matching with a Stack",
    description: "Push openers; on a closer, it must match the current top.",
    steps: validParentheses(),
  }),
  "merge-sorted-arrays": () => ({
    mode: "sorting",
    title: "Merge From the Back",
    description: "Fill nums1 from the right so we never overwrite values we still need.",
    steps: mergeSortedArrays(),
  }),
  "maximum-subarray": () => ({
    mode: "sorting",
    title: "Kadane's Algorithm",
    description: "Either extend the current window or restart at nums[i].",
    steps: maxSubarray(),
  }),
  "climbing-stairs": () => ({
    mode: "sorting",
    title: "1-D Dynamic Programming",
    description: "dp[i] = dp[i−1] + dp[i−2]. (Fibonacci in disguise.)",
    steps: climbingStairs(),
  }),
  "best-time-to-buy-sell-stock": () => ({
    mode: "sorting",
    title: "Track Running Minimum",
    description: "At each day, profit = price − minPriceSoFar; keep the best profit.",
    steps: bestStock(),
  }),
  "contains-duplicate": () => ({
    mode: "sorting",
    title: "Hash-Set Scan",
    description: "Add each element to a Set; stop as soon as an insertion would duplicate.",
    steps: containsDuplicate(),
  }),
  "linked-list-cycle": () => ({
    mode: "linked-list",
    title: "Floyd's Tortoise & Hare",
    description: "Slow moves 1 step, fast moves 2. They collide iff there is a cycle.",
    steps: linkedListCycle(),
  }),
  "binary-search-problem": () => ({
    mode: "sorting",
    title: "Classic Binary Search",
    description: "Halve the search range at each step based on nums[mid] vs target.",
    steps: binarySearchProblem(),
  }),
  "max-depth-binary-tree": () => ({
    mode: "tree",
    title: "Recursive DFS",
    description: "depth(n) = 1 + max(depth(n.left), depth(n.right)).",
    steps: maxDepthTree(),
  }),
  "number-of-islands": () => ({
    mode: "graph",
    title: "Flood Fill Components",
    description: "DFS/BFS each unvisited land cell and count connected components.",
    steps: numberOfIslands(),
  }),
  "longest-common-subsequence": () => ({
    mode: "sorting",
    title: "2-D DP (Row View)",
    description: "dp[i][j] = dp[i−1][j−1]+1 if chars match else max of neighbours.",
    steps: lcs(),
  }),
  "coin-change": () => ({
    mode: "sorting",
    title: "Bottom-Up DP",
    description: "dp[a] = min over coins c of dp[a − c] + 1.",
    steps: coinChange(),
  }),
  "three-sum": () => ({
    mode: "sorting",
    title: "Sort + Two Pointers",
    description: "Fix i, then move l/r inward looking for −nums[i].",
    steps: threeSum(),
  }),
  "product-except-self": () => ({
    mode: "sorting",
    title: "Prefix × Suffix Passes",
    description: "Left pass stores prefix products; right pass multiplies by suffix.",
    steps: productExceptSelf(),
  }),
  "merge-intervals": () => ({
    mode: "sorting",
    title: "Sort by Start, Merge Overlaps",
    description: "If current.start ≤ last.end, extend; otherwise append.",
    steps: mergeIntervals(),
  }),
  "rotate-array": () => ({
    mode: "sorting",
    title: "Three Reversals",
    description: "Reverse all, reverse first k, reverse the rest → O(1) extra space.",
    steps: rotateArray(),
  }),
  "group-anagrams": () => ({
    mode: "sorting",
    title: "Sorted-Key Bucketing",
    description: "Group strings by their sorted-character key.",
    steps: groupAnagrams(),
  }),
  "longest-substring-no-repeat": () => ({
    mode: "sorting",
    title: "Sliding Window + Last-Seen Map",
    description: "Expand r; on duplicate, move l past its previous index.",
    steps: longestSubstringNoRepeat(),
  }),
  "trapping-rain-water": () => ({
    mode: "sorting",
    title: "Two Pointers with Max-So-Far",
    description: "Advance the lower side; trapped = maxSoFar − currentHeight.",
    steps: trappingRainWater(),
  }),
  "lru-cache": () => ({
    mode: "stack-queue",
    variant: "queue",
    title: "Doubly-Linked List + Hash Map",
    description: "Touched items move to the front; evictions come from the back.",
    steps: lruCache(),
  }),
  "word-search": () => ({
    mode: "graph",
    title: "DFS With Backtracking",
    description: "From each cell, DFS in 4 directions marking visited; unmark on backtrack.",
    steps: wordSearch(),
  }),
  "invert-binary-tree": () => ({
    mode: "tree",
    title: "Recursive Child Swap",
    description: "At each node, swap its left and right subtrees.",
    steps: invertBinaryTree(),
  }),
  "lowest-common-ancestor": () => ({
    mode: "tree",
    title: "BST Split Point",
    description: "Walk from root; the first node where p and q diverge is the LCA.",
    steps: lca(),
  }),
  "min-window-substring": () => ({
    mode: "sorting",
    title: "Expand-Then-Shrink Sliding Window",
    description: "Expand r to cover all of t, then shrink l for minimum length.",
    steps: minWindow(),
  }),
  "course-schedule": () => ({
    mode: "graph",
    title: "Kahn's Topological Sort",
    description: "Repeatedly remove a zero-in-degree node; success ⟺ no cycle.",
    steps: courseSchedule(),
  }),
  "kth-largest-element": () => ({
    mode: "sorting",
    title: "Min-Heap of Size k",
    description: "Keep the k largest in a min-heap; top of heap is the answer.",
    steps: kthLargest(),
  }),
  "palindrome-linked-list": () => ({
    mode: "linked-list",
    title: "Two Pointers Mirror Check",
    description: "Compare from both ends inward; stop on mismatch.",
    steps: palindromeLinkedList(),
  }),
  "implement-trie": () => ({
    mode: "sorting",
    title: "Character-By-Character Walk",
    description: "insert walks & creates, search requires isEnd, startsWith just needs the path.",
    steps: implementTrie(),
  }),
  "median-of-two-sorted-arrays": () => ({
    mode: "sorting",
    title: "Merge Until the Middle",
    description: "Conceptual merge; median lives at the middle index(es).",
    steps: medianTwoSorted(),
  }),
  "serialize-deserialize-tree": () => ({
    mode: "tree",
    title: "BFS With Null Markers",
    description: "Emit every node level-by-level, using '#' for missing children.",
    steps: serializeTree(),
  }),
  "longest-palindromic-substring": () => ({
    mode: "sorting",
    title: "Expand Around Center",
    description: "Try each index (and between-indices) as the palindrome center.",
    steps: longestPalindrome(),
  }),
};

import { moreProblemAnimations } from "./more-animations";

const allProblemAnimations: Record<string, () => ProblemAnimation> = {
  ...problemAnimations,
  ...moreProblemAnimations,
};

export function getProblemAnimation(slug: string): ProblemAnimation | null {
  const fn = allProblemAnimations[slug];
  return fn ? fn() : null;
}

export function getAnimatedSlugs(): string[] {
  return Object.keys(allProblemAnimations);
}
