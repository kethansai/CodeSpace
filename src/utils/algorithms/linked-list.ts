import type { AnimationStep } from "@/data/types";

/**
 * Step generators for linked-list visualizations.
 *
 * Each generator emits `AnimationStep`s whose `array` carries the node values
 * in left-to-right order. `pointers` names the live pointers (`prev`, `curr`,
 * `next`, `slow`, `fast`, …). `auxiliaryData.edges` explicitly describes the
 * arrows — use `to: -1` to terminate with `null`.
 */

type EdgeState =
  | "normal"
  | "reversed"
  | "ghost"
  | "broken"
  | "new"
  | "cycle"
  | "active";

interface Edge {
  from: number;
  to: number;
  state?: EdgeState;
}

// `-1` is used as the index-sentinel for `null` pointers. The visualizer
// ignores pointer entries whose index is outside `[0, n)` for label
// positioning, but we still include them in `variables` so the watch panel
// shows them as "null".

function nullIdx(n: number) {
  return n; // past the last node; visualizer treats it as out-of-range
}

function chainEdges(n: number): Edge[] {
  const e: Edge[] = [];
  for (let i = 0; i < n - 1; i++) e.push({ from: i, to: i + 1 });
  if (n > 0) e.push({ from: n - 1, to: -1 });
  return e;
}

// ─────────────────────────────────────────────────────────────────
// 1. Singly linked list operations (traverse + insert head/tail + delete)
// ─────────────────────────────────────────────────────────────────
export function generateSinglyLinkedListSteps(
  input: number[],
): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    title: "Singly linked list",
    description: `Each node has a value and a \`next\` pointer. The last node points to \`null\`.`,
    array: [...arr],
    pointers: { head: 0, tail: arr.length - 1 },
    auxiliaryData: { edges: chainEdges(arr.length) },
  });

  // Traversal
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      title: "Traverse",
      description: `Walk with \`curr\` → reach node ${arr[i]} (position ${i}).`,
      array: [...arr],
      actions: [{ type: "visit", indices: [i] }],
      pointers: { head: 0, curr: i },
      auxiliaryData: { edges: chainEdges(arr.length) },
    });
  }

  // Insert at head (value 99)
  const afterHead = [99, ...arr];
  steps.push({
    title: "Insert at head",
    description: `Create node 99 and point it at the current head. Update \`head\` to the new node. **O(1)**.`,
    array: afterHead,
    actions: [{ type: "insert", indices: [0] }],
    pointers: { head: 0, tail: afterHead.length - 1 },
    auxiliaryData: { edges: chainEdges(afterHead.length) },
  });

  // Delete at head
  steps.push({
    title: "Delete head",
    description: `Move \`head\` to \`head.next\`; the old head is unlinked. **O(1)**.`,
    array: afterHead,
    actions: [{ type: "remove", indices: [0] }],
    pointers: { head: 1, tail: afterHead.length - 1 },
    auxiliaryData: {
      edges: [
        { from: 0, to: 1, state: "broken" },
        ...chainEdges(afterHead.length)
          .filter((e) => e.from !== 0)
          .map((e) => ({ ...e })),
      ],
    },
  });

  steps.push({
    title: "After delete",
    description: `Head is now node ${arr[0]}; list is restored to its original state.`,
    array: [...arr],
    pointers: { head: 0, tail: arr.length - 1 },
    auxiliaryData: { edges: chainEdges(arr.length) },
  });

  return steps;
}

// ─────────────────────────────────────────────────────────────────
// 2. Doubly linked list — shows bidirectional traversal
// ─────────────────────────────────────────────────────────────────
export function generateDoublyLinkedListSteps(
  input: number[],
): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    title: "Doubly linked list",
    description: `Every node has both a \`next\` and a \`prev\` pointer. Traversal works in either direction.`,
    array: [...arr],
    pointers: { head: 0, tail: arr.length - 1 },
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      title: "Walk forward",
      description: `\`curr = curr.next\` → node ${arr[i]}.`,
      array: [...arr],
      actions: [{ type: "visit", indices: [i] }],
      pointers: { curr: i },
    });
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    steps.push({
      title: "Walk backward",
      description: `\`curr = curr.prev\` → node ${arr[i]}.`,
      array: [...arr],
      actions: [{ type: "visit", indices: [i] }],
      pointers: { curr: i },
    });
  }

  // Insert after node 1 (index 1)
  if (arr.length >= 2) {
    const inserted = [...arr];
    inserted.splice(2, 0, 77);
    steps.push({
      title: "Insert after index 1",
      description: `Splice 77 in between — update four pointers (two \`next\`, two \`prev\`). **O(1)** given the node.`,
      array: inserted,
      actions: [{ type: "insert", indices: [2] }],
      pointers: { head: 0, tail: inserted.length - 1 },
    });
  }

  return steps;
}

// ─────────────────────────────────────────────────────────────────
// 3. Reverse a singly linked list (iterative, pointer-accurate)
// ─────────────────────────────────────────────────────────────────
export function generateLinkedListReversalSteps(
  input: number[],
): AnimationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: AnimationStep[] = [];

  // reversedUpTo = number of edges already flipped (from the left).
  // After k flips, edges 0→1 … (k-1)→k are reversed to (i+1)→i; node k
  // is the current `curr`, node k-1 is `prev`, node 0..k-1 all point
  // leftward, and node 0 points to null.
  function makeEdges(
    reversedUpTo: number,
    curr: number,
    highlight: "flip" | null,
  ): Edge[] {
    const e: Edge[] = [];
    // reversed edges: (i+1) → i for i in [0, reversedUpTo)
    for (let i = 0; i < reversedUpTo; i++) {
      e.push({
        from: i + 1,
        to: i,
        state: i === reversedUpTo - 1 && highlight === "flip" ? "active" : "reversed",
      });
    }
    // node 0 → null (once anything has been reversed)
    if (reversedUpTo > 0) {
      e.push({ from: 0, to: -1, state: "new" });
    }
    // untouched forward edges: curr → curr+1, … → null
    for (let i = curr; i < n - 1; i++) e.push({ from: i, to: i + 1 });
    if (curr < n && curr >= 0) e.push({ from: n - 1, to: -1 });
    return e;
  }

  steps.push({
    title: "Setup",
    description: `Initialise \`prev = null\`, \`curr = head\`. We'll walk and flip each \`next\` pointer in place.`,
    array: [...arr],
    pointers: { curr: 0 },
    variables: { prev: "null", curr: `node(${arr[0] ?? "null"})` },
    auxiliaryData: { edges: makeEdges(0, 0, null) },
  });

  let prev = -1; // -1 means null
  let curr = 0;
  while (curr < n) {
    const nxt = curr + 1;
    // Step: save next
    steps.push({
      title: "Save next",
      description: `Cache \`next = curr.next\` before we overwrite \`curr.next\` — otherwise we'd lose the tail of the list.`,
      array: [...arr],
      pointers: {
        ...(prev >= 0 ? { prev } : {}),
        curr,
        ...(nxt < n ? { next: nxt } : {}),
      },
      variables: {
        prev: prev < 0 ? "null" : `node(${arr[prev]})`,
        curr: `node(${arr[curr]})`,
        next: nxt < n ? `node(${arr[nxt]})` : "null",
      },
      actions: [{ type: "highlight", indices: [curr] }],
      auxiliaryData: { edges: makeEdges(curr, curr, null) },
    });

    // Step: flip pointer
    steps.push({
      title: "Flip pointer",
      description: `Set \`curr.next = prev\`. The edge from node ${arr[curr]} now points ${prev < 0 ? "at **null**" : `back to ${arr[prev]}`}.`,
      array: [...arr],
      pointers: {
        ...(prev >= 0 ? { prev } : {}),
        curr,
        ...(nxt < n ? { next: nxt } : {}),
      },
      variables: {
        prev: prev < 0 ? "null" : `node(${arr[prev]})`,
        curr: `node(${arr[curr]})`,
        next: nxt < n ? `node(${arr[nxt]})` : "null",
      },
      actions: [{ type: "swap", indices: [curr] }],
      auxiliaryData: { edges: makeEdges(curr + 1, curr, "flip") },
    });

    // Step: advance
    prev = curr;
    curr = nxt;
    steps.push({
      title: "Advance",
      description: `Slide the window: \`prev = curr\`; \`curr = next\`.`,
      array: [...arr],
      pointers: {
        prev,
        ...(curr < n ? { curr } : {}),
      },
      variables: {
        prev: `node(${arr[prev]})`,
        curr: curr < n ? `node(${arr[curr]})` : "null",
      },
      auxiliaryData: { edges: makeEdges(prev + 1, curr, null) },
    });
  }

  steps.push({
    title: "Done",
    description: `\`curr\` fell off the end. The new head is \`prev\` (node ${arr[n - 1]}). Every \`next\` pointer has been flipped.`,
    array: [...arr],
    pointers: { newHead: n - 1 },
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
    auxiliaryData: {
      edges: makeEdges(n, n, null),
      labels: { [n - 1]: "new head" },
    },
  });

  return steps;
}

// ─────────────────────────────────────────────────────────────────
// 4. Fast & slow pointers — find middle node
// ─────────────────────────────────────────────────────────────────
export function generateFastSlowMiddleSteps(
  input: number[],
): AnimationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: AnimationStep[] = [];

  steps.push({
    title: "Setup",
    description: `Start \`slow\` and \`fast\` both at \`head\`. Each loop: slow moves 1, fast moves 2. When fast reaches the end, slow sits at the middle.`,
    array: [...arr],
    pointers: { slow: 0, fast: 0 },
    auxiliaryData: { edges: chainEdges(n) },
  });

  let slow = 0;
  let fast = 0;
  while (fast < n - 1 && fast + 2 <= n) {
    const nextSlow = slow + 1;
    const nextFast = fast + 2;
    if (nextFast >= n) break;
    slow = nextSlow;
    fast = nextFast;
    steps.push({
      title: "Step",
      description: `slow → ${arr[slow]}, fast → ${arr[fast]}.`,
      array: [...arr],
      pointers: { slow, fast },
      actions: [{ type: "visit", indices: [slow, fast] }],
      auxiliaryData: { edges: chainEdges(n) },
    });
  }

  // Attempt one more fast jump that may fall off
  if (fast + 2 === n - 1 || fast + 2 === n) {
    slow = slow + 1;
    steps.push({
      title: "Final slow step",
      description: `Fast is at (or past) the last node, so slow takes one more step to sit at the middle.`,
      array: [...arr],
      pointers: { slow, fast: n - 1 },
      actions: [{ type: "visit", indices: [slow] }],
      auxiliaryData: { edges: chainEdges(n) },
    });
  }

  steps.push({
    title: "Middle found",
    description: `Middle node is \`${arr[slow]}\` at index ${slow}.`,
    array: [...arr],
    pointers: { slow },
    actions: [{ type: "complete", indices: [slow] }],
    auxiliaryData: { edges: chainEdges(n), labels: { [slow]: "middle" } },
  });

  return steps;
}

// ─────────────────────────────────────────────────────────────────
// 5. Floyd's cycle detection
// ─────────────────────────────────────────────────────────────────
export function generateCycleDetectionSteps(
  values: number[],
  cycleStart: number,
): AnimationStep[] {
  const arr = [...values];
  const n = arr.length;
  const steps: AnimationStep[] = [];

  // Edges: chain with back-edge from last → cycleStart
  function edgesWith(active?: number): Edge[] {
    const e: Edge[] = [];
    for (let i = 0; i < n - 1; i++) {
      e.push({ from: i, to: i + 1, state: active === i ? "active" : "normal" });
    }
    e.push({ from: n - 1, to: cycleStart, state: "cycle" });
    return e;
  }

  steps.push({
    title: "Cycle present",
    description: `The tail points back to node \`${arr[cycleStart]}\` — the list has a cycle. We'll detect it with Floyd's tortoise & hare.`,
    array: [...arr],
    pointers: { slow: 0, fast: 0 },
    auxiliaryData: { edges: edgesWith() },
  });

  function advance(p: number, steps2: number) {
    for (let s = 0; s < steps2; s++) {
      p = p === n - 1 ? cycleStart : p + 1;
    }
    return p;
  }

  let slow = 0;
  let fast = 0;
  let guard = 0;
  while (guard++ < 2 * n + 4) {
    slow = advance(slow, 1);
    fast = advance(fast, 2);
    steps.push({
      title: "Step",
      description: `slow = node(${arr[slow]}), fast = node(${arr[fast]}).`,
      array: [...arr],
      pointers: { slow, fast },
      actions:
        slow === fast
          ? [{ type: "complete", indices: [slow] }]
          : [{ type: "visit", indices: [slow, fast] }],
      auxiliaryData: { edges: edgesWith() },
    });
    if (slow === fast) break;
  }

  steps.push({
    title: "Cycle detected",
    description: `slow and fast meet — a cycle exists. To find the entry, reset one pointer to head and advance both by one until they meet again.`,
    array: [...arr],
    pointers: { slow, fast },
    actions: [{ type: "complete", indices: [slow] }],
    auxiliaryData: { edges: edgesWith() },
  });

  // Find cycle entry
  let a = 0;
  let b = slow;
  guard = 0;
  while (a !== b && guard++ < n + 2) {
    steps.push({
      title: "Seek entry",
      description: `p = node(${arr[a]}), q = node(${arr[b]}).`,
      array: [...arr],
      pointers: { p: a, q: b },
      actions: [{ type: "visit", indices: [a, b] }],
      auxiliaryData: { edges: edgesWith() },
    });
    a = advance(a, 1);
    b = advance(b, 1);
  }
  steps.push({
    title: "Cycle entry",
    description: `p = q at node(${arr[a]}) — that's the entry of the cycle.`,
    array: [...arr],
    pointers: { entry: a },
    actions: [{ type: "complete", indices: [a] }],
    auxiliaryData: {
      edges: edgesWith(),
      labels: { [a]: "cycle start" },
    },
  });

  return steps;
}

// ─────────────────────────────────────────────────────────────────
// 6. Palindrome linked list (reverse second half + compare)
// ─────────────────────────────────────────────────────────────────
export function generatePalindromeLinkedListSteps(
  values: number[],
): AnimationStep[] {
  const arr = [...values];
  const n = arr.length;
  const steps: AnimationStep[] = [];
  const mid = Math.floor(n / 2);

  steps.push({
    title: "Plan",
    description: `1) Find middle with fast/slow. 2) Reverse second half. 3) Compare both halves with two pointers.`,
    array: [...arr],
    pointers: { slow: 0, fast: 0 },
    auxiliaryData: { edges: chainEdges(n) },
  });

  let slow = 0;
  let fast = 0;
  while (fast < n - 1 && fast + 2 < n) {
    slow++;
    fast += 2;
    steps.push({
      title: "Find middle",
      description: `slow = ${arr[slow]}, fast = ${arr[fast]}.`,
      array: [...arr],
      pointers: { slow, fast },
      actions: [{ type: "visit", indices: [slow, fast] }],
      auxiliaryData: { edges: chainEdges(n) },
    });
  }

  // Reverse second half (from index `mid` to end)
  function edgesAfterReverse(): Edge[] {
    const e: Edge[] = [];
    for (let i = 0; i < mid - 1; i++) e.push({ from: i, to: i + 1 });
    if (mid - 1 >= 0) e.push({ from: mid - 1, to: -1, state: "new" });
    for (let i = n - 1; i > mid; i--) {
      e.push({ from: i, to: i - 1, state: "reversed" });
    }
    e.push({ from: mid, to: -1, state: "new" });
    return e;
  }

  steps.push({
    title: "Reverse second half",
    description: `Reverse the tail starting at index ${mid}. Now the two halves can be compared head-to-head.`,
    array: [...arr],
    pointers: { l1: 0, l2: n - 1 },
    actions: Array.from({ length: n - mid }, (_, k) => ({
      type: "swap" as const,
      indices: [mid + k],
    })),
    auxiliaryData: { edges: edgesAfterReverse() },
  });

  let l = 0;
  let r = n - 1;
  let ok = true;
  while (l < mid) {
    const equal = arr[l] === arr[r];
    steps.push({
      title: "Compare",
      description: `${arr[l]} ${equal ? "==" : "≠"} ${arr[r]}`,
      array: [...arr],
      pointers: { l1: l, l2: r },
      actions: [
        {
          type: equal ? "compare" : "swap",
          indices: [l, r],
        },
      ],
      auxiliaryData: { edges: edgesAfterReverse() },
    });
    if (!equal) {
      ok = false;
      break;
    }
    l++;
    r--;
  }

  steps.push({
    title: ok ? "Palindrome ✓" : "Not a palindrome ✗",
    description: ok
      ? `All matching pairs compared equal — the list is a palindrome.`
      : `A pair differed — the list is **not** a palindrome.`,
    array: [...arr],
    actions: arr.map((_, i) => ({
      type: (ok ? "complete" : "remove") as "complete" | "remove",
      indices: [i],
    })),
    auxiliaryData: { edges: edgesAfterReverse() },
  });

  return steps;
}

// ─────────────────────────────────────────────────────────────────
// 7. Merge two sorted lists (two-row)
// ─────────────────────────────────────────────────────────────────
export function generateMergeSortedListsSteps(
  a: number[],
  b: number[],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const row0 = [...a];
  const row1 = [...b];
  const na = row0.length;
  const nb = row1.length;

  function edgesWith(takenFrom0: number, takenFrom1: number): Edge[] {
    const e: Edge[] = [];
    for (let i = 0; i < na - 1; i++) {
      e.push({
        from: i,
        to: i + 1,
        state: i < takenFrom0 - 1 ? "ghost" : "normal",
      });
    }
    if (na > 0) {
      e.push({ from: na - 1, to: -1, state: takenFrom0 >= na ? "ghost" : "normal" });
    }
    for (let i = 0; i < nb - 1; i++) {
      e.push({
        from: na + i,
        to: na + i + 1,
        state: i < takenFrom1 - 1 ? "ghost" : "normal",
      });
    }
    if (nb > 0) {
      e.push({ from: na + nb - 1, to: -1, state: takenFrom1 >= nb ? "ghost" : "normal" });
    }
    return e;
  }

  steps.push({
    title: "Setup",
    description: `Use a dummy head; at each step append the smaller of the two front nodes.`,
    array: row0,
    pointers: { a: 0, b: na },
    auxiliaryData: {
      row2: row1,
      edges: edgesWith(0, 0),
      labels: { 0: "list A head", [na]: "list B head" },
    },
  });

  let i = 0;
  let j = 0;
  const order: Array<{ from: "a" | "b"; idx: number; value: number }> = [];
  while (i < na && j < nb) {
    const va = row0[i]!;
    const vb = row1[j]!;
    const pick: "a" | "b" = va <= vb ? "a" : "b";
    if (pick === "a") {
      order.push({ from: "a", idx: i, value: va });
      i++;
    } else {
      order.push({ from: "b", idx: na + j, value: vb });
      j++;
    }
    steps.push({
      title: `Take ${pick === "a" ? "A" : "B"}`,
      description: `Compare ${va} vs ${vb} → append ${pick === "a" ? va : vb}.`,
      array: row0,
      pointers: { a: i < na ? i : na - 1, b: j < nb ? na + j : na + nb - 1 },
      actions: [
        { type: "compare", indices: [order[order.length - 1]!.idx] },
      ],
      auxiliaryData: {
        row2: row1,
        edges: edgesWith(i, j),
      },
    });
  }
  while (i < na) {
    order.push({ from: "a", idx: i, value: row0[i]! });
    i++;
  }
  while (j < nb) {
    order.push({ from: "b", idx: na + j, value: row1[j]! });
    j++;
  }

  steps.push({
    title: "Merged",
    description: `Merged list: ${order.map((o) => o.value).join(" → ")} → null.`,
    array: order.map((o) => o.value),
    actions: order.map((_, k) => ({ type: "complete" as const, indices: [k] })),
    auxiliaryData: { edges: chainEdges(order.length) },
  });

  return steps;
}

// ─────────────────────────────────────────────────────────────────
// 8. Remove N-th node from end (two-pointer with gap n+1)
// ─────────────────────────────────────────────────────────────────
export function generateRemoveNthFromEndSteps(
  values: number[],
  n: number,
): AnimationStep[] {
  const arr = [...values];
  const len = arr.length;
  const steps: AnimationStep[] = [];
  const target = len - n; // index to remove

  function edges(): Edge[] {
    return chainEdges(len);
  }
  function edgesAfterRemove(): Edge[] {
    const e: Edge[] = [];
    for (let k = 0; k < len - 1; k++) {
      if (k === target - 1) {
        e.push({ from: k, to: target + 1 < len ? target + 1 : -1, state: "new" });
      } else if (k === target) {
        continue;
      } else {
        e.push({ from: k, to: k + 1 });
      }
    }
    if (target !== len - 1 && len > 0) e.push({ from: len - 1, to: -1 });
    if (target === len - 1 && len > 1) e.push({ from: len - 2, to: -1, state: "new" });
    return e;
  }

  steps.push({
    title: "Two pointers",
    description: `Advance \`fast\` by n+1 = ${n + 1} so the gap between \`fast\` and \`slow\` equals n+1. Then walk both in tandem until \`fast\` falls off.`,
    array: [...arr],
    pointers: { slow: 0, fast: 0 },
    auxiliaryData: { edges: edges() },
  });

  let fast = 0;
  for (let k = 0; k < n + 1; k++) {
    if (fast >= len) break;
    steps.push({
      title: `Advance fast (${k + 1}/${n + 1})`,
      description: `fast → ${fast < len ? arr[fast] : "null"}.`,
      array: [...arr],
      pointers: { slow: 0, fast },
      auxiliaryData: { edges: edges() },
    });
    fast++;
  }

  let slow = 0;
  while (fast < len) {
    slow++;
    fast++;
    steps.push({
      title: "Walk in lockstep",
      description: `slow → ${arr[slow]}, fast → ${fast < len ? arr[fast] : "null"}.`,
      array: [...arr],
      pointers: { slow, fast: Math.min(fast, len) },
      actions: [{ type: "visit", indices: [slow] }],
      auxiliaryData: { edges: edges() },
    });
  }

  steps.push({
    title: "Remove target",
    description: `slow now sits just before the node to remove. Set \`slow.next = slow.next.next\` to unlink node ${arr[target]}.`,
    array: [...arr],
    pointers: { slow, target },
    actions: [{ type: "remove", indices: [target] }],
    auxiliaryData: {
      edges: [
        { from: slow, to: target, state: "broken" as EdgeState },
        ...edges().filter((e) => !(e.from === slow && e.to === target)),
      ],
    },
  });

  steps.push({
    title: "Done",
    description: `Node removed. New list skips index ${target}.`,
    array: [...arr],
    actions: [{ type: "remove", indices: [target] }],
    auxiliaryData: { edges: edgesAfterRemove() },
  });

  return steps;
}

// Re-export helpers for potential reuse
export { chainEdges, nullIdx };
