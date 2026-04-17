import type { AnimationStep } from "@/data/types";
import type { ProblemAnimation } from "./animations";

const s = (step: AnimationStep): AnimationStep => step;

// 1 Valid Anagram
function validAnagram(): AnimationStep[] {
  const s1 = "anagram";
  const s2 = "nagaram";
  const steps: AnimationStep[] = [];
  const counts = new Array(26).fill(0) as number[];
  // visualize only the chars present
  const live = [..."acegimnr"].map((c) => c.charCodeAt(0) - 97);
  const asArray = () => live.map((i) => counts[i]!);
  steps.push(
    s({
      title: "Init",
      description: `Compare s1="${s1}" with s2="${s2}" via character counts.`,
      array: asArray(),
      variables: { s1, s2, len: s1.length },
    }),
  );
  for (let i = 0; i < s1.length; i++) {
    counts[s1.charCodeAt(i) - 97]!++;
    counts[s2.charCodeAt(i) - 97]!--;
    steps.push(
      s({
        title: `i=${i}`,
        description: `+1 for '${s1[i]}', -1 for '${s2[i]}'.`,
        array: asArray(),
        actions: [{ type: "set", indices: live.map((_, k) => k) }],
        pointers: { i },
        variables: { s1i: s1[i]!, s2i: s2[i]! },
      }),
    );
  }
  const ok = counts.every((c) => c === 0);
  steps.push(
    s({
      title: ok ? "Anagram" : "Not anagram",
      description: ok
        ? `All counts are 0 → strings are anagrams.`
        : `Non-zero counts remain → not an anagram.`,
      array: asArray(),
      actions: [
        { type: ok ? "complete" : "swap", indices: live.map((_, k) => k) },
      ],
      variables: { result: String(ok) },
    }),
  );
  return steps;
}

// 2 Reverse Linked List
function reverseLinkedList(): AnimationStep[] {
  const vals = [1, 2, 3, 4, 5];
  const arr = [...vals];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `prev=null, curr=head. Flip each curr.next to prev.`,
      array: [...arr],
      pointers: { curr: 0 },
      variables: { prev: "null", curr: arr[0]! },
    }),
  );
  let prev = -1;
  for (let i = 0; i < arr.length; i++) {
    steps.push(
      s({
        title: `Flip node ${arr[i]}`,
        description: `curr.next ← prev. Advance prev & curr.`,
        array: [...arr],
        actions: [{ type: "swap", indices: [i] }],
        pointers: prev >= 0 ? { curr: i, prev } : { curr: i },
        variables: {
          prev: prev < 0 ? "null" : arr[prev]!,
          curr: arr[i]!,
          next: i + 1 < arr.length ? arr[i + 1]! : "null",
        },
      }),
    );
    prev = i;
  }
  arr.reverse();
  steps.push(
    s({
      title: "Done",
      description: `Reversed list: [${arr.join(" → ")}].`,
      array: [...arr],
      actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
      variables: { head: arr[0]! },
    }),
  );
  return steps;
}

// 3 Merge Two Sorted Lists
function mergeTwoSortedLists(): AnimationStep[] {
  const l1 = [1, 2, 4];
  const l2 = [1, 3, 4];
  const merged: number[] = [];
  const steps: AnimationStep[] = [];
  let i = 0,
    j = 0;
  steps.push(
    s({
      title: "Init",
      description: `Two pointers i, j walk both lists. Smaller value goes next.`,
      array: [...merged],
      variables: { l1: `[${l1.join(",")}]`, l2: `[${l2.join(",")}]` },
    }),
  );
  while (i < l1.length && j < l2.length) {
    if (l1[i]! <= l2[j]!) {
      merged.push(l1[i]!);
      steps.push(
        s({
          title: `Pick l1[${i}]=${l1[i]}`,
          description: `l1[${i}]=${l1[i]} ≤ l2[${j}]=${l2[j]} → append.`,
          array: [...merged],
          actions: [{ type: "insert", indices: [merged.length - 1] }],
          variables: { i, j, last: l1[i]! },
        }),
      );
      i++;
    } else {
      merged.push(l2[j]!);
      steps.push(
        s({
          title: `Pick l2[${j}]=${l2[j]}`,
          description: `l2[${j}]=${l2[j]} < l1[${i}]=${l1[i]} → append.`,
          array: [...merged],
          actions: [{ type: "insert", indices: [merged.length - 1] }],
          variables: { i, j, last: l2[j]! },
        }),
      );
      j++;
    }
  }
  while (i < l1.length) {
    merged.push(l1[i++]!);
  }
  while (j < l2.length) {
    merged.push(l2[j++]!);
  }
  steps.push(
    s({
      title: "Drain",
      description: `Append any remaining nodes from the non-empty list.`,
      array: [...merged],
      actions: merged.map((_, k) => ({ type: "visit" as const, indices: [k] })),
    }),
  );
  steps.push(
    s({
      title: "Done",
      description: `Merged: [${merged.join(" → ")}]`,
      array: [...merged],
      actions: merged.map((_, k) => ({
        type: "complete" as const,
        indices: [k],
      })),
    }),
  );
  return steps;
}

// 4 Remove Nth From End
function removeNthFromEnd(): AnimationStep[] {
  const vals = [1, 2, 3, 4, 5];
  const n = 2;
  const steps: AnimationStep[] = [];
  let fast = -1; // using a dummy preceding head
  let slow = -1;
  steps.push(
    s({
      title: "Init",
      description: `Dummy → 1 → 2 → 3 → 4 → 5. Gap n+1 between fast & slow.`,
      array: [...vals],
      pointers: { slow: 0, fast: 0 },
      variables: { n, target: `node ${vals.length - n}` },
    }),
  );
  // Advance fast n+1 times from dummy; in vals indices that lands at position n
  fast = n;
  slow = 0;
  steps.push(
    s({
      title: "Advance fast",
      description: `Move fast by n+1=${n + 1}. Now fast=${fast}, slow=${slow}.`,
      array: [...vals],
      pointers: { slow, fast },
      actions: [{ type: "highlight", indices: [fast] }],
    }),
  );
  while (fast < vals.length) {
    fast++;
    slow++;
    steps.push(
      s({
        title: `Walk`,
        description: `Move both until fast is off the end.`,
        array: [...vals],
        pointers: { slow: Math.min(slow, vals.length - 1), fast: Math.min(fast, vals.length - 1) },
        actions: [{ type: "visit", indices: [slow] }],
      }),
    );
  }
  // slow now points at node before target; remove slow.next
  const targetIdx = slow;
  vals.splice(targetIdx, 1);
  steps.push(
    s({
      title: "Remove",
      description: `slow.next ← slow.next.next (remove node ${targetIdx}).`,
      array: [...vals],
      actions: vals.map((_, k) => ({ type: "complete" as const, indices: [k] })),
      variables: { removed: `index ${targetIdx}` },
    }),
  );
  return steps;
}

// 5 Container With Most Water
function containerMostWater(): AnimationStep[] {
  const h = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const steps: AnimationStep[] = [];
  let l = 0,
    r = h.length - 1,
    best = 0;
  steps.push(
    s({
      title: "Init",
      description: `Two pointers at the extremes. Width = r - l.`,
      array: [...h],
      pointers: { l, r },
      variables: { l, r, best },
    }),
  );
  while (l < r) {
    const area = (r - l) * Math.min(h[l]!, h[r]!);
    if (area > best) best = area;
    steps.push(
      s({
        title: `Area=${area}`,
        description: `area = (${r}-${l}) × min(${h[l]},${h[r]}) = ${area}. best=${best}`,
        array: [...h],
        actions: [{ type: "compare", indices: [l, r] }],
        pointers: { l, r },
        variables: { area, best },
      }),
    );
    if (h[l]! < h[r]!) {
      l++;
    } else {
      r--;
    }
  }
  steps.push(
    s({
      title: "Done",
      description: `Max water area = ${best}.`,
      array: [...h],
      actions: h.map((_, i) => ({ type: "complete" as const, indices: [i] })),
      variables: { best },
    }),
  );
  return steps;
}

// 6 Search in Rotated Sorted Array
function searchRotated(): AnimationStep[] {
  const nums = [4, 5, 6, 7, 0, 1, 2];
  const target = 0;
  const steps: AnimationStep[] = [];
  let l = 0,
    r = nums.length - 1;
  steps.push(
    s({
      title: "Init",
      description: `Binary search; one side of every range is sorted.`,
      array: [...nums],
      pointers: { l, r },
      variables: { target, l, r },
    }),
  );
  while (l <= r) {
    const m = (l + r) >> 1;
    steps.push(
      s({
        title: `mid=${m}`,
        description: `nums[mid]=${nums[m]}`,
        array: [...nums],
        pointers: { l, r, mid: m },
        actions: [{ type: "pivot", indices: [m] }],
      }),
    );
    if (nums[m] === target) {
      steps.push(
        s({
          title: "Found",
          description: `Target ${target} at index ${m}.`,
          array: [...nums],
          actions: [{ type: "complete", indices: [m] }],
          pointers: { ans: m },
        }),
      );
      return steps;
    }
    if (nums[l]! <= nums[m]!) {
      if (nums[l]! <= target && target < nums[m]!) r = m - 1;
      else l = m + 1;
      steps.push(
        s({
          title: "Left sorted",
          description: `[l..m] is sorted. ${target} ${target < nums[m]! ? "in" : "not in"} range → move ${target < nums[m]! ? "r" : "l"}.`,
          array: [...nums],
          pointers: { l, r },
        }),
      );
    } else {
      if (nums[m]! < target && target <= nums[r]!) l = m + 1;
      else r = m - 1;
      steps.push(
        s({
          title: "Right sorted",
          description: `[m..r] is sorted. Adjust bounds.`,
          array: [...nums],
          pointers: { l, r },
        }),
      );
    }
  }
  return steps;
}

// 7 Find Min Rotated Sorted Array
function findMinRotated(): AnimationStep[] {
  const nums = [3, 4, 5, 1, 2];
  const steps: AnimationStep[] = [];
  let l = 0,
    r = nums.length - 1;
  steps.push(
    s({
      title: "Init",
      description: `Shrink toward the rotation pivot.`,
      array: [...nums],
      pointers: { l, r },
    }),
  );
  while (l < r) {
    const m = (l + r) >> 1;
    if (nums[m]! > nums[r]!) {
      steps.push(
        s({
          title: `mid=${m}`,
          description: `nums[${m}]=${nums[m]} > nums[${r}]=${nums[r]} → min is right of mid.`,
          array: [...nums],
          pointers: { l, r, mid: m },
          actions: [{ type: "visit", indices: [m] }],
        }),
      );
      l = m + 1;
    } else {
      steps.push(
        s({
          title: `mid=${m}`,
          description: `nums[${m}]=${nums[m]} ≤ nums[${r}]=${nums[r]} → min at or left of mid.`,
          array: [...nums],
          pointers: { l, r, mid: m },
          actions: [{ type: "visit", indices: [m] }],
        }),
      );
      r = m;
    }
  }
  steps.push(
    s({
      title: "Done",
      description: `Minimum = ${nums[l]} at index ${l}.`,
      array: [...nums],
      actions: [{ type: "complete", indices: [l] }],
      pointers: { ans: l },
      variables: { min: nums[l]! },
    }),
  );
  return steps;
}

// 8 Jump Game
function jumpGame(): AnimationStep[] {
  const nums = [2, 3, 1, 1, 4];
  const steps: AnimationStep[] = [];
  let reach = 0;
  steps.push(
    s({
      title: "Init",
      description: `Track furthest reachable index.`,
      array: [...nums],
      pointers: { i: 0, reach: 0 },
      variables: { reach },
    }),
  );
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) {
      steps.push(
        s({
          title: "Stuck",
          description: `i=${i} > reach=${reach} — cannot reach here.`,
          array: [...nums],
          actions: [{ type: "swap", indices: [i] }],
          variables: { reach, result: "false" },
        }),
      );
      return steps;
    }
    reach = Math.max(reach, i + nums[i]!);
    steps.push(
      s({
        title: `i=${i}`,
        description: `reach = max(${reach}, ${i}+${nums[i]}) = ${reach}`,
        array: [...nums],
        pointers: { i, reach },
        actions: [{ type: "visit", indices: [i] }],
        variables: { reach },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `reach ≥ last index → true.`,
      array: [...nums],
      actions: nums.map((_, k) => ({ type: "complete" as const, indices: [k] })),
      variables: { result: "true" },
    }),
  );
  return steps;
}

// 9 Unique Paths
function uniquePaths(): AnimationStep[] {
  const m = 3,
    n = 4;
  const dp = new Array(n).fill(1) as number[];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `dp[j]=1 for the top row (only one way: all right).`,
      array: [...dp],
      actions: [{ type: "set", indices: dp.map((_, k) => k) }],
      variables: { m, n },
    }),
  );
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j]! + dp[j - 1]!;
      steps.push(
        s({
          title: `i=${i}, j=${j}`,
          description: `dp[${j}] += dp[${j - 1}] → ${dp[j]}`,
          array: [...dp],
          actions: [
            { type: "compare", indices: [j - 1] },
            { type: "set", indices: [j] },
          ],
          pointers: { j },
          variables: { row: i, dp_j: dp[j]! },
        }),
      );
    }
  }
  steps.push(
    s({
      title: "Done",
      description: `Unique paths = dp[n-1] = ${dp[n - 1]}`,
      array: [...dp],
      actions: [{ type: "complete", indices: [n - 1] }],
      variables: { answer: dp[n - 1]! },
    }),
  );
  return steps;
}

// 10 Edit Distance (show last row fill)
function editDistance(): AnimationStep[] {
  const a = "horse";
  const b = "ros";
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `Base: dp[i][0]=i, dp[0][j]=j.`,
      array: [...dp[0]!],
      variables: { a, b },
    }),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i]![j] = dp[i - 1]![j - 1]!;
      else
        dp[i]![j] =
          1 +
          Math.min(dp[i - 1]![j - 1]!, dp[i - 1]![j]!, dp[i]![j - 1]!);
    }
    steps.push(
      s({
        title: `Row i=${i} ('${a[i - 1]}')`,
        description: `Row: [${dp[i]!.join(", ")}]`,
        array: [...dp[i]!],
        actions: [
          { type: "set", indices: dp[i]!.map((_, k) => k).filter((k) => k > 0) },
        ],
        variables: { ai: a[i - 1]!, rowMin: Math.min(...dp[i]!) },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Edit distance = dp[${m}][${n}] = ${dp[m]![n]}`,
      array: [...dp[m]!],
      actions: [{ type: "complete", indices: [n] }],
      variables: { answer: dp[m]![n]! },
    }),
  );
  return steps;
}

// 11 House Robber
function houseRobber(): AnimationStep[] {
  const nums = [2, 7, 9, 3, 1];
  const dp = new Array<number>(nums.length).fill(0);
  const steps: AnimationStep[] = [];
  dp[0] = nums[0]!;
  dp[1] = Math.max(nums[0]!, nums[1]!);
  steps.push(
    s({
      title: "Base",
      description: `dp[0]=${dp[0]}, dp[1]=max(${nums[0]},${nums[1]})=${dp[1]}.`,
      array: [...dp],
      actions: [{ type: "set", indices: [0, 1] }],
      variables: { nums: `[${nums.join(",")}]` },
    }),
  );
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1]!, dp[i - 2]! + nums[i]!);
    steps.push(
      s({
        title: `i=${i}`,
        description: `dp[${i}] = max(dp[${i - 1}]=${dp[i - 1]}, dp[${i - 2}]+${nums[i]}=${dp[i - 2]! + nums[i]!}) = ${dp[i]}`,
        array: [...dp],
        actions: [
          { type: "compare", indices: [i - 1, i - 2] },
          { type: "set", indices: [i] },
        ],
        pointers: { i },
        variables: { dp_i: dp[i]! },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Max loot = ${dp[nums.length - 1]}`,
      array: [...dp],
      actions: [{ type: "complete", indices: [nums.length - 1] }],
      variables: { answer: dp[nums.length - 1]! },
    }),
  );
  return steps;
}

// 12 Word Break
function wordBreak(): AnimationStep[] {
  const str = "leetcode";
  const dict = new Set(["leet", "code"]);
  const dp = new Array<number>(str.length + 1).fill(0);
  dp[0] = 1;
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `dp[0]=true (empty prefix). Others false.`,
      array: [...dp],
      actions: [{ type: "set", indices: [0] }],
      variables: { s: str, dict: "[leet,code]" },
    }),
  );
  for (let i = 1; i <= str.length; i++) {
    for (let j = 0; j < i; j++) {
      const piece = str.slice(j, i);
      if (dp[j] && dict.has(piece)) {
        dp[i] = 1;
        steps.push(
          s({
            title: `i=${i}`,
            description: `dp[${j}]=true and "${piece}" ∈ dict → dp[${i}]=true.`,
            array: [...dp],
            actions: [{ type: "set", indices: [i] }],
            pointers: { i, j },
            variables: { piece },
          }),
        );
        break;
      }
    }
  }
  steps.push(
    s({
      title: "Done",
      description: `dp[${str.length}] = ${dp[str.length] ? "true" : "false"}`,
      array: [...dp],
      actions: [{ type: "complete", indices: [str.length] }],
      variables: { answer: String(!!dp[str.length]) },
    }),
  );
  return steps;
}

// 13 Subarray Sum Equals K
function subarraySumK(): AnimationStep[] {
  const nums = [1, 1, 1, 2, 3];
  const k = 3;
  const counts = new Map<number, number>([[0, 1]]);
  let sum = 0,
    ans = 0;
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `Prefix-sum trick: count how many previous prefixes equal sum-k.`,
      array: [...nums],
      variables: { k, sum, count: ans, map: "{0:1}" },
    }),
  );
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]!;
    const need = sum - k;
    const hit = counts.get(need) ?? 0;
    ans += hit;
    counts.set(sum, (counts.get(sum) ?? 0) + 1);
    steps.push(
      s({
        title: `i=${i}`,
        description: `sum=${sum}. Look up ${sum}−${k}=${need} → ${hit} hit${hit === 1 ? "" : "s"}. ans=${ans}.`,
        array: [...nums],
        actions: [{ type: hit ? "complete" : "visit", indices: [i] }],
        pointers: { i },
        variables: { sum, need, count: ans },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Subarrays with sum=${k}: ${ans}.`,
      array: [...nums],
      actions: nums.map((_, k) => ({ type: "complete" as const, indices: [k] })),
      variables: { answer: ans },
    }),
  );
  return steps;
}

// 14 Top K Frequent
function topKFrequent(): AnimationStep[] {
  const nums = [1, 1, 1, 2, 2, 3];
  const k = 2;
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, c] of freq) buckets[c]!.push(n);
  const steps: AnimationStep[] = [];
  const display = () => nums.map((n) => freq.get(n) ?? 0);
  steps.push(
    s({
      title: "Count",
      description: `Count frequencies: ${[...freq].map(([n, c]) => `${n}→${c}`).join(", ")}.`,
      array: display(),
      actions: [{ type: "set", indices: nums.map((_, i) => i) }],
      variables: { k },
    }),
  );
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (!buckets[i]!.length) continue;
    result.push(...buckets[i]!);
    steps.push(
      s({
        title: `Bucket freq=${i}`,
        description: `Values with frequency ${i}: [${buckets[i]!.join(",")}].`,
        array: display(),
        actions: [
          {
            type: "highlight",
            indices: nums
              .map((n, idx) => (buckets[i]!.includes(n) ? idx : -1))
              .filter((x) => x >= 0),
          },
        ],
        variables: { picked: `[${result.join(",")}]` },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Top ${k}: [${result.slice(0, k).join(",")}].`,
      array: display(),
      actions: [
        {
          type: "complete",
          indices: nums
            .map((n, idx) =>
              result.slice(0, k).includes(n) ? idx : -1,
            )
            .filter((x) => x >= 0),
        },
      ],
      variables: { answer: `[${result.slice(0, k).join(",")}]` },
    }),
  );
  return steps;
}

// 15 Daily Temperatures
function dailyTemperatures(): AnimationStep[] {
  const t = [73, 74, 75, 71, 69, 72, 76, 73];
  const res = new Array<number>(t.length).fill(0);
  const stack: number[] = [];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `Monotonic decreasing stack of indices.`,
      array: [...t],
      variables: { stack: "[]" },
    }),
  );
  for (let i = 0; i < t.length; i++) {
    while (stack.length && t[stack[stack.length - 1]!]! < t[i]!) {
      const j = stack.pop()!;
      res[j] = i - j;
      steps.push(
        s({
          title: `pop ${j}`,
          description: `t[${i}]=${t[i]} > t[${j}]=${t[j]} → answer[${j}]=${i - j}.`,
          array: [...t],
          actions: [
            { type: "complete", indices: [j] },
            { type: "compare", indices: [i] },
          ],
          pointers: { i, j },
          variables: { stack: `[${stack.join(",")}]` },
        }),
      );
    }
    stack.push(i);
    steps.push(
      s({
        title: `push ${i}`,
        description: `Push i=${i} (t=${t[i]}).`,
        array: [...t],
        actions: [{ type: "insert", indices: [i] }],
        pointers: { i, top: stack[stack.length - 1]! },
        variables: { stack: `[${stack.join(",")}]` },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Result: [${res.join(",")}]`,
      array: res,
      actions: res.map((_, i) => ({ type: "complete" as const, indices: [i] })),
      variables: { answer: `[${res.join(",")}]` },
    }),
  );
  return steps;
}

// 16 Sliding Window Maximum
function slidingWindowMax(): AnimationStep[] {
  const nums = [1, 3, -1, -3, 5, 3, 6, 7];
  const k = 3;
  const dq: number[] = [];
  const out: number[] = [];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `Deque of indices, values strictly decreasing front→back.`,
      array: [...nums],
      variables: { k, deque: "[]" },
    }),
  );
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]!]! < nums[i]!) dq.pop();
    dq.push(i);
    if (dq[0]! <= i - k) dq.shift();
    steps.push(
      s({
        title: `i=${i}`,
        description: `push ${i}; pop smaller from back; front = window max.`,
        array: [...nums],
        actions: [{ type: "visit", indices: [i] }],
        pointers: { i, front: dq[0]! },
        variables: { deque: `[${dq.map((x) => `${x}(${nums[x]})`).join(",")}]` },
      }),
    );
    if (i >= k - 1) {
      out.push(nums[dq[0]!]!);
      steps.push(
        s({
          title: `emit`,
          description: `Window max = ${nums[dq[0]!]}.`,
          array: [...nums],
          actions: [
            {
              type: "highlight",
              indices: Array.from({ length: k }, (_, o) => i - k + 1 + o),
            },
            { type: "complete", indices: [dq[0]!] },
          ],
          pointers: { i, max: dq[0]! },
          variables: { out: `[${out.join(",")}]` },
        }),
      );
    }
  }
  return steps;
}

// 17 Clone Graph (simple cycle 1-2-3-4-1)
function cloneGraph(): AnimationStep[] {
  const nodes = [1, 2, 3, 4];
  const visited = new Set<number>();
  const steps: AnimationStep[] = [];
  const order = [0, 1, 2, 3];
  steps.push(
    s({
      title: "Init",
      description: `DFS from node 1. Map old→new to avoid re-cloning cycles.`,
      array: [...nodes],
      variables: { map: "{}" },
    }),
  );
  for (const i of order) {
    visited.add(i);
    steps.push(
      s({
        title: `Clone ${nodes[i]}`,
        description: `Create copy of node ${nodes[i]} and store in map.`,
        array: [...nodes],
        actions: [{ type: "visit", indices: [i] }],
        pointers: { i },
        variables: { map: `{${[...visited].map((x) => nodes[x]!).join(",")}}` },
      }),
    );
  }
  steps.push(
    s({
      title: "Link",
      description: `Wire each copy's neighbors via the map (no re-cloning).`,
      array: [...nodes],
      actions: nodes.map((_, i) => ({ type: "complete" as const, indices: [i] })),
      variables: { done: "✓" },
    }),
  );
  return steps;
}

// 18 Pacific Atlantic (row of heights, show reachable marks)
function pacificAtlantic(): AnimationStep[] {
  const row = [1, 2, 2, 3, 5];
  const steps: AnimationStep[] = [];
  steps.push(
    s({
      title: "Init",
      description: `Reverse-flow from each border. Water climbs to ≥ current height.`,
      array: [...row],
    }),
  );
  // Pacific (left border → right, non-decreasing)
  steps.push(
    s({
      title: "Pacific ←",
      description: `From left edge, reach right while heights are non-decreasing.`,
      array: [...row],
      actions: [{ type: "visit", indices: [0, 1, 2, 3, 4] }],
      variables: { pacific: "all" },
    }),
  );
  // Atlantic from right
  steps.push(
    s({
      title: "Atlantic →",
      description: `From right edge, reach left while heights are non-decreasing.`,
      array: [...row],
      actions: [{ type: "highlight", indices: [3, 4] }],
      variables: { atlantic: "[3,4]" },
    }),
  );
  steps.push(
    s({
      title: "Intersect",
      description: `Cells reaching both: indices where pacific ∩ atlantic.`,
      array: [...row],
      actions: [{ type: "complete", indices: [3, 4] }],
      variables: { answer: "[3,4]" },
    }),
  );
  return steps;
}

// 19 Max Product Subarray
function maxProductSubarray(): AnimationStep[] {
  const nums = [2, 3, -2, 4, -1];
  const steps: AnimationStep[] = [];
  let mx = nums[0]!,
    mn = nums[0]!,
    best = nums[0]!;
  steps.push(
    s({
      title: "Init",
      description: `Track running max and min — negatives flip them.`,
      array: [...nums],
      pointers: { i: 0 },
      variables: { max: mx, min: mn, best },
    }),
  );
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i]!;
    if (n < 0) [mx, mn] = [mn, mx];
    mx = Math.max(n, mx * n);
    mn = Math.min(n, mn * n);
    best = Math.max(best, mx);
    steps.push(
      s({
        title: `i=${i}`,
        description: `${n < 0 ? "n<0 → swap max/min. " : ""}max=${mx}, min=${mn}, best=${best}.`,
        array: [...nums],
        actions: [{ type: "visit", indices: [i] }],
        pointers: { i },
        variables: { max: mx, min: mn, best },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Max product = ${best}.`,
      array: [...nums],
      actions: nums.map((_, i) => ({ type: "complete" as const, indices: [i] })),
      variables: { answer: best },
    }),
  );
  return steps;
}

// 20 Longest Consecutive Sequence
function longestConsecutive(): AnimationStep[] {
  const nums = [100, 4, 200, 1, 3, 2];
  const set = new Set(nums);
  const steps: AnimationStep[] = [];
  let best = 0,
    bestStart = 0,
    bestLen = 0;
  steps.push(
    s({
      title: "Init",
      description: `Put all into a Set. Start counting only at numbers with no predecessor.`,
      array: [...nums],
      variables: { set: `{${[...set].join(",")}}` },
    }),
  );
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i]!;
    if (set.has(n - 1)) {
      steps.push(
        s({
          title: `i=${i}`,
          description: `${n} has predecessor ${n - 1} → skip.`,
          array: [...nums],
          actions: [{ type: "visit", indices: [i] }],
          pointers: { i },
          variables: { value: n },
        }),
      );
      continue;
    }
    let cur = n,
      len = 1;
    while (set.has(cur + 1)) {
      cur++;
      len++;
    }
    if (len > best) {
      best = len;
      bestStart = n;
      bestLen = len;
    }
    steps.push(
      s({
        title: `Run from ${n}`,
        description: `Count up: [${n}..${cur}] (length ${len}).`,
        array: [...nums],
        actions: [{ type: "highlight", indices: [i] }],
        pointers: { i },
        variables: { run: `${n}→${cur}`, len, best },
      }),
    );
  }
  steps.push(
    s({
      title: "Done",
      description: `Longest run = ${bestLen} starting at ${bestStart}.`,
      array: [...nums],
      actions: nums.map((_, i) => ({ type: "complete" as const, indices: [i] })),
      variables: { answer: bestLen, start: bestStart },
    }),
  );
  return steps;
}

// ─── Registry ───
export const moreProblemAnimations: Record<string, () => ProblemAnimation> = {
  "valid-anagram": () => ({
    mode: "sorting",
    title: "Counter Cancellation",
    description: "Increment for s1, decrement for s2; anagram ⟺ all counts 0.",
    steps: validAnagram(),
  }),
  "reverse-linked-list": () => ({
    mode: "linked-list",
    title: "Three-Pointer Flip",
    description: "prev/curr/next — flip curr.next to prev and march forward.",
    steps: reverseLinkedList(),
  }),
  "merge-two-sorted-lists": () => ({
    mode: "linked-list",
    title: "Dummy-Head Two Pointers",
    description: "Pick the smaller head of the two lists each step.",
    steps: mergeTwoSortedLists(),
  }),
  "remove-nth-from-end": () => ({
    mode: "linked-list",
    title: "Fast/Slow With a Gap",
    description: "Advance fast by n+1, then move both; slow lands before the target.",
    steps: removeNthFromEnd(),
  }),
  "container-with-most-water": () => ({
    mode: "sorting",
    title: "Two Pointers on Heights",
    description: "Shrink from the shorter side — the only direction that can increase area.",
    steps: containerMostWater(),
  }),
  "search-rotated-sorted-array": () => ({
    mode: "sorting",
    title: "Binary Search with Pivot Awareness",
    description: "Check which half is sorted; decide which half to keep.",
    steps: searchRotated(),
  }),
  "find-min-rotated-sorted-array": () => ({
    mode: "sorting",
    title: "Binary Search Toward the Pivot",
    description: "Compare mid to the right-most element to shrink the range.",
    steps: findMinRotated(),
  }),
  "jump-game": () => ({
    mode: "sorting",
    title: "Greedy Furthest-Reach",
    description: "Keep the maximum index reachable so far; unreachable ⟺ i > reach.",
    steps: jumpGame(),
  }),
  "unique-paths": () => ({
    mode: "sorting",
    title: "Rolling-Row DP",
    description: "dp[j] += dp[j-1] across rows collapses to a single 1-D array.",
    steps: uniquePaths(),
  }),
  "edit-distance": () => ({
    mode: "sorting",
    title: "Levenshtein DP (Row View)",
    description: "dp[i][j] = match copy, else 1 + min of three neighbours.",
    steps: editDistance(),
  }),
  "house-robber": () => ({
    mode: "sorting",
    title: "Take-or-Skip DP",
    description: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
    steps: houseRobber(),
  }),
  "word-break": () => ({
    mode: "sorting",
    title: "Prefix DP With Dictionary",
    description: "dp[i] = some split j where dp[j] and s[j..i] ∈ dict.",
    steps: wordBreak(),
  }),
  "subarray-sum-equals-k": () => ({
    mode: "sorting",
    title: "Prefix Sums + Hash Map",
    description: "For each prefix sum, count how many previous equal sum − k.",
    steps: subarraySumK(),
  }),
  "top-k-frequent": () => ({
    mode: "sorting",
    title: "Bucket by Frequency",
    description: "One bucket per count; sweep from the highest bucket.",
    steps: topKFrequent(),
  }),
  "daily-temperatures": () => ({
    mode: "sorting",
    title: "Monotonic Stack",
    description: "Pop indices whose temperature is beaten by the current day.",
    steps: dailyTemperatures(),
  }),
  "sliding-window-maximum": () => ({
    mode: "sorting",
    title: "Monotonic Deque",
    description: "Deque front is always the max of the current window.",
    steps: slidingWindowMax(),
  }),
  "clone-graph": () => ({
    mode: "graph",
    title: "DFS With old→new Map",
    description: "Copy each node once; wire neighbors via the map.",
    steps: cloneGraph(),
  }),
  "pacific-atlantic": () => ({
    mode: "sorting",
    title: "Reverse-Flow BFS From Each Ocean",
    description: "Start from the borders and climb upward; intersect the two sets.",
    steps: pacificAtlantic(),
  }),
  "maximum-product-subarray": () => ({
    mode: "sorting",
    title: "Track Running Max & Min",
    description: "A negative flips them — so keep both.",
    steps: maxProductSubarray(),
  }),
  "longest-consecutive-sequence": () => ({
    mode: "sorting",
    title: "Hash Set — Start-of-Run Only",
    description: "Only count runs that have no predecessor in the set.",
    steps: longestConsecutive(),
  }),
};
