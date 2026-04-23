import type { AnimationStep } from "@/data/types";

// ─────────── Types ───────────

export type TreeNodeState =
  | "path"
  | "found"
  | "active"
  | "discarded"
  | "inserted"
  | "removed";

export interface VizTreeNode {
  id: number;
  value: number | string;
  left?: number | null;
  right?: number | null;
  state?: TreeNodeState;
}

export interface VizTree {
  nodes: VizTreeNode[];
  rootId: number;
}

// ─────────── Tree builders ───────────

/**
 * Build a visual tree from a LeetCode-style level-order array (nulls allowed
 * for missing nodes). Returns both the render tree and an internal node-lookup
 * map for traversal algorithms.
 */
export function buildTreeFromArray(arr: (number | null | undefined)[]): {
  tree: VizTree;
  byId: Map<number, VizTreeNode>;
} {
  const nodes: VizTreeNode[] = [];
  const byId = new Map<number, VizTreeNode>();
  if (!arr.length || arr[0] == null) {
    return { tree: { nodes: [], rootId: -1 }, byId };
  }

  let nextId = 0;
  const root: VizTreeNode = {
    id: nextId++,
    value: arr[0] as number,
    left: null,
    right: null,
  };
  nodes.push(root);
  byId.set(root.id, root);

  const queue: VizTreeNode[] = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const parent = queue.shift()!;
    // left
    if (i < arr.length) {
      const v = arr[i++];
      if (v !== null && v !== undefined) {
        const child: VizTreeNode = {
          id: nextId++,
          value: v as number,
          left: null,
          right: null,
        };
        parent.left = child.id;
        nodes.push(child);
        byId.set(child.id, child);
        queue.push(child);
      }
    }
    // right
    if (i < arr.length) {
      const v = arr[i++];
      if (v !== null && v !== undefined) {
        const child: VizTreeNode = {
          id: nextId++,
          value: v as number,
          left: null,
          right: null,
        };
        parent.right = child.id;
        nodes.push(child);
        byId.set(child.id, child);
        queue.push(child);
      }
    }
  }
  return { tree: { nodes, rootId: root.id }, byId };
}

function cloneTree(tree: VizTree): VizTree {
  return { rootId: tree.rootId, nodes: tree.nodes.map((n) => ({ ...n })) };
}

function setStates(tree: VizTree, states: Map<number, TreeNodeState>): VizTree {
  return {
    rootId: tree.rootId,
    nodes: tree.nodes.map((n) => ({ ...n, state: states.get(n.id) ?? n.state })),
  };
}

function defaultTree(): (number | null)[] {
  // A small balanced-ish test tree used as the default visualization input
  // when a topic passes a flat array.
  return [1, 2, 3, 4, 5, 6, 7];
}

// ─────────── Traversals ───────────

interface TraversalOpts {
  order: "inorder" | "preorder" | "postorder";
}

function traversalSteps(
  input: (number | null)[],
  opts: TraversalOpts,
): AnimationStep[] {
  const arr = input.length ? input : defaultTree();
  const { tree, byId } = buildTreeFromArray(arr);
  const steps: AnimationStep[] = [];
  const state = new Map<number, TreeNodeState>();
  const visited: (number | string)[] = [];

  const label =
    opts.order === "inorder"
      ? "In-order (Left → Root → Right)"
      : opts.order === "preorder"
        ? "Pre-order (Root → Left → Right)"
        : "Post-order (Left → Right → Root)";

  steps.push({
    description: `${label} on the tree.`,
    array: [],
    auxiliaryData: { tree: setStates(tree, state), resultList: [] },
  });

  function dfs(id: number | null | undefined) {
    if (id == null) return;
    const n = byId.get(id);
    if (!n) return;

    state.set(id, "active");
    steps.push({
      description: `Enter node ${n.value}.`,
      array: [],
      pointers: { curr: id },
      auxiliaryData: {
        tree: setStates(tree, state),
        resultList: [...visited],
      },
    });

    if (opts.order === "preorder") {
      visited.push(n.value);
      state.set(id, "found");
      steps.push({
        description: `Visit ${n.value}. Result so far: [${visited.join(", ")}].`,
        array: [],
        pointers: { curr: id },
        actions: [{ type: "visit", indices: [id] }],
        auxiliaryData: {
          tree: setStates(tree, state),
          resultList: [...visited],
        },
      });
    }

    dfs(n.left);

    if (opts.order === "inorder") {
      visited.push(n.value);
      state.set(id, "found");
      steps.push({
        description: `Visit ${n.value}. Result so far: [${visited.join(", ")}].`,
        array: [],
        pointers: { curr: id },
        actions: [{ type: "visit", indices: [id] }],
        auxiliaryData: {
          tree: setStates(tree, state),
          resultList: [...visited],
        },
      });
    }

    dfs(n.right);

    if (opts.order === "postorder") {
      visited.push(n.value);
      state.set(id, "found");
      steps.push({
        description: `Visit ${n.value}. Result so far: [${visited.join(", ")}].`,
        array: [],
        pointers: { curr: id },
        actions: [{ type: "visit", indices: [id] }],
        auxiliaryData: {
          tree: setStates(tree, state),
          resultList: [...visited],
        },
      });
    } else {
      // Leaving a node that's already been visited
      if (state.get(id) !== "found") state.set(id, "found");
    }
  }

  dfs(tree.rootId);

  steps.push({
    description: `${label} complete → [${visited.join(", ")}].`,
    array: [],
    auxiliaryData: {
      tree: setStates(tree, state),
      resultList: [...visited],
    },
  });
  return steps;
}

export function generateInorderSteps(input: (number | null)[]) {
  return traversalSteps(input, { order: "inorder" });
}
export function generatePreorderSteps(input: (number | null)[]) {
  return traversalSteps(input, { order: "preorder" });
}
export function generatePostorderSteps(input: (number | null)[]) {
  return traversalSteps(input, { order: "postorder" });
}

export function generateLevelOrderSteps(
  input: (number | null)[],
): AnimationStep[] {
  const arr = input.length ? input : defaultTree();
  const { tree, byId } = buildTreeFromArray(arr);
  const steps: AnimationStep[] = [];
  const state = new Map<number, TreeNodeState>();
  const visited: (number | string)[] = [];

  steps.push({
    description: "Level-order (BFS) traversal with a queue.",
    array: [],
    auxiliaryData: { tree: setStates(tree, state), resultList: [] },
  });

  const queue: number[] = tree.rootId >= 0 ? [tree.rootId] : [];
  while (queue.length) {
    const id = queue.shift()!;
    const n = byId.get(id)!;
    visited.push(n.value);
    state.set(id, "found");
    steps.push({
      description: `Visit ${n.value}. Queue: [${queue
        .map((q) => byId.get(q)?.value)
        .join(", ")}].`,
      array: [],
      pointers: { curr: id },
      actions: [{ type: "visit", indices: [id] }],
      auxiliaryData: {
        tree: setStates(tree, state),
        resultList: [...visited],
      },
    });
    if (n.left != null) queue.push(n.left as number);
    if (n.right != null) queue.push(n.right as number);
  }

  steps.push({
    description: `Level-order complete → [${visited.join(", ")}].`,
    array: [],
    auxiliaryData: {
      tree: setStates(tree, state),
      resultList: [...visited],
    },
  });
  return steps;
}

// ─────────── BST ───────────

/** Insert values into a BST one at a time, emitting a step for each compare. */
export function generateBSTInsertSteps(values: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const nodes: VizTreeNode[] = [];
  const byId = new Map<number, VizTreeNode>();
  let nextId = 0;
  let rootId = -1;

  const snap = (
    extra: Partial<AnimationStep> & { highlightPath?: number[] } = {},
  ): AnimationStep => {
    const { highlightPath, ...rest } = extra;
    const state = new Map<number, TreeNodeState>();
    if (highlightPath)
      for (const p of highlightPath) state.set(p, "path");
    const clone: VizTree = {
      rootId,
      nodes: nodes.map((n) => ({ ...n, state: state.get(n.id) ?? n.state })),
    };
    return {
      description: "",
      array: [],
      auxiliaryData: { tree: clone },
      ...rest,
    };
  };

  steps.push({
    description: `Insert values [${values.join(", ")}] into an empty BST.`,
    array: [],
    auxiliaryData: { tree: { nodes: [], rootId: -1 } },
  });

  for (const v of values) {
    if (rootId === -1) {
      const n: VizTreeNode = { id: nextId++, value: v, left: null, right: null, state: "inserted" };
      nodes.push(n);
      byId.set(n.id, n);
      rootId = n.id;
      steps.push(
        snap({
          description: `Tree empty → ${v} becomes the root.`,
          auxiliaryData: {
            tree: { rootId, nodes: nodes.map((x) => ({ ...x })) },
          },
        }),
      );
      // clear state
      n.state = undefined;
      continue;
    }

    const path: number[] = [];
    let cur = rootId;
    while (true) {
      path.push(cur);
      const node = byId.get(cur)!;
      steps.push(
        snap({
          description: `Compare ${v} with ${node.value}.`,
          pointers: { curr: cur },
          highlightPath: [...path],
          actions: [{ type: "compare", indices: [cur] }],
        }),
      );

      if (v < (node.value as number)) {
        if (node.left == null) {
          const child: VizTreeNode = {
            id: nextId++,
            value: v,
            left: null,
            right: null,
            state: "inserted",
          };
          nodes.push(child);
          byId.set(child.id, child);
          node.left = child.id;
          steps.push(
            snap({
              description: `${v} < ${node.value} and left is empty → insert as left child.`,
              auxiliaryData: {
                tree: {
                  rootId,
                  nodes: nodes.map((x) => ({
                    ...x,
                    state: x.id === child.id ? "inserted" : undefined,
                  })),
                },
              },
            }),
          );
          child.state = undefined;
          break;
        }
        steps.push(
          snap({
            description: `${v} < ${node.value} → go left.`,
            pointers: { curr: cur },
            highlightPath: [...path],
          }),
        );
        cur = node.left as number;
      } else if (v > (node.value as number)) {
        if (node.right == null) {
          const child: VizTreeNode = {
            id: nextId++,
            value: v,
            left: null,
            right: null,
            state: "inserted",
          };
          nodes.push(child);
          byId.set(child.id, child);
          node.right = child.id;
          steps.push(
            snap({
              description: `${v} > ${node.value} and right is empty → insert as right child.`,
              auxiliaryData: {
                tree: {
                  rootId,
                  nodes: nodes.map((x) => ({
                    ...x,
                    state: x.id === child.id ? "inserted" : undefined,
                  })),
                },
              },
            }),
          );
          child.state = undefined;
          break;
        }
        steps.push(
          snap({
            description: `${v} > ${node.value} → go right.`,
            pointers: { curr: cur },
            highlightPath: [...path],
          }),
        );
        cur = node.right as number;
      } else {
        steps.push(
          snap({
            description: `${v} already exists → skip (BST has no duplicates).`,
            pointers: { curr: cur },
          }),
        );
        break;
      }
    }
  }

  steps.push(
    snap({
      description: "All values inserted. BST is complete.",
    }),
  );
  return steps;
}

/** After inserting values, search for `target`. */
export function generateBSTSearchSteps(
  values: number[],
  target: number,
): AnimationStep[] {
  // Build the BST first (silently), then emit search steps.
  const nodes: VizTreeNode[] = [];
  const byId = new Map<number, VizTreeNode>();
  let nextId = 0;
  let rootId = -1;
  for (const v of values) {
    if (rootId === -1) {
      const n: VizTreeNode = { id: nextId++, value: v, left: null, right: null };
      nodes.push(n);
      byId.set(n.id, n);
      rootId = n.id;
      continue;
    }
    let cur = rootId;
    while (true) {
      const node = byId.get(cur)!;
      if (v < (node.value as number)) {
        if (node.left == null) {
          const c: VizTreeNode = {
            id: nextId++, value: v, left: null, right: null,
          };
          nodes.push(c); byId.set(c.id, c); node.left = c.id; break;
        }
        cur = node.left as number;
      } else if (v > (node.value as number)) {
        if (node.right == null) {
          const c: VizTreeNode = {
            id: nextId++, value: v, left: null, right: null,
          };
          nodes.push(c); byId.set(c.id, c); node.right = c.id; break;
        }
        cur = node.right as number;
      } else break;
    }
  }

  const baseTree: VizTree = {
    rootId,
    nodes: nodes.map((n) => ({ ...n })),
  };

  const steps: AnimationStep[] = [];
  const path: number[] = [];
  const discarded = new Set<number>();

  function snap(desc: string, extra: Partial<AnimationStep> = {}) {
    const mapped = baseTree.nodes.map((n) => {
      let state: TreeNodeState | undefined;
      if (path.includes(n.id)) state = "path";
      if (discarded.has(n.id)) state = "discarded";
      return { ...n, state };
    });
    steps.push({
      description: desc,
      array: [],
      auxiliaryData: { tree: { rootId, nodes: mapped } },
      ...extra,
    });
  }

  snap(`Search for ${target} in the BST.`);

  let cur = rootId;
  while (cur !== -1) {
    path.push(cur);
    const node = byId.get(cur)!;
    snap(`Compare ${target} with ${node.value}.`, {
      pointers: { curr: cur, target: cur },
      actions: [{ type: "compare", indices: [cur] }],
    });
    if (target === node.value) {
      // Mark as found (override path with found color)
      const mapped = baseTree.nodes.map((n) => ({
        ...n,
        state:
          n.id === cur
            ? ("found" as TreeNodeState)
            : path.includes(n.id)
              ? ("path" as TreeNodeState)
              : discarded.has(n.id)
                ? ("discarded" as TreeNodeState)
                : undefined,
      }));
      steps.push({
        description: `Found ${target}!`,
        array: [],
        pointers: { curr: cur },
        actions: [{ type: "complete", indices: [cur] }],
        auxiliaryData: { tree: { rootId, nodes: mapped } },
      });
      return steps;
    }
    // discard the opposite subtree
    const goLeft = target < (node.value as number);
    const discardedChild = goLeft ? node.right : node.left;
    if (discardedChild != null) {
      collectSubtree(discardedChild as number, byId, discarded);
    }
    snap(
      goLeft
        ? `${target} < ${node.value} → go left.`
        : `${target} > ${node.value} → go right.`,
      { pointers: { curr: cur } },
    );
    cur = (goLeft ? node.left : node.right) as number ?? -1;
    if (cur == null) cur = -1;
  }

  snap(`${target} not found in the BST.`);
  return steps;
}

function collectSubtree(
  id: number,
  byId: Map<number, VizTreeNode>,
  out: Set<number>,
) {
  const stack = [id];
  while (stack.length) {
    const x = stack.pop()!;
    if (out.has(x)) continue;
    out.add(x);
    const n = byId.get(x);
    if (!n) continue;
    if (n.left != null) stack.push(n.left as number);
    if (n.right != null) stack.push(n.right as number);
  }
}

// ─────────── Validate BST ───────────

export function generateValidateBSTSteps(
  input: (number | null)[],
): AnimationStep[] {
  const arr = input.length ? input : [5, 3, 7, 1, 4, 6, 8];
  const { tree, byId } = buildTreeFromArray(arr);
  const steps: AnimationStep[] = [];
  const state = new Map<number, TreeNodeState>();
  const labels: Record<number, string> = {};

  steps.push({
    description: "Validate BST: each node must be within (min, max) bounds.",
    array: [],
    auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
  });

  let ok = true;
  function check(
    id: number | null | undefined,
    min: number,
    max: number,
  ): boolean {
    if (id == null) return true;
    const n = byId.get(id);
    if (!n) return true;
    const v = n.value as number;
    const minStr = min === -Infinity ? "-∞" : String(min);
    const maxStr = max === Infinity ? "∞" : String(max);
    labels[id] = `(${minStr}, ${maxStr})`;
    state.set(id, "active");
    steps.push({
      description: `Check ${v} is within (${minStr}, ${maxStr}).`,
      array: [],
      pointers: { curr: id },
      actions: [{ type: "compare", indices: [id] }],
      auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
    });
    if (v <= min || v >= max) {
      state.set(id, "removed");
      steps.push({
        description: `✗ ${v} violates bounds (${minStr}, ${maxStr}) → NOT a BST.`,
        array: [],
        auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
      });
      ok = false;
      return false;
    }
    state.set(id, "found");
    if (!check(n.left, min, v)) return false;
    if (!check(n.right, v, max)) return false;
    return true;
  }

  check(tree.rootId, -Infinity, Infinity);
  if (ok) {
    steps.push({
      description: "All nodes satisfy BST bounds → valid BST.",
      array: [],
      auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
    });
  }
  return steps;
}

// ─────────── Invert Tree ───────────

export function generateInvertTreeSteps(
  input: (number | null)[],
): AnimationStep[] {
  const arr = input.length ? input : [4, 2, 7, 1, 3, 6, 9];
  const { tree, byId } = buildTreeFromArray(arr);
  const steps: AnimationStep[] = [];
  const state = new Map<number, TreeNodeState>();

  steps.push({
    description:
      "Invert the binary tree: swap the left and right children of every node (post-order).",
    array: [],
    auxiliaryData: { tree: setStates(tree, state) },
  });

  function invert(id: number | null | undefined) {
    if (id == null) return;
    const n = byId.get(id);
    if (!n) return;
    invert(n.left);
    invert(n.right);
    const l = n.left;
    n.left = n.right;
    n.right = l;
    state.set(id, "active");
    steps.push({
      description: `Swap children of node ${n.value}.`,
      array: [],
      pointers: { curr: id },
      actions: [{ type: "swap", indices: [id] }],
      auxiliaryData: {
        tree: setStates(tree, state),
      },
    });
    state.set(id, "found");
  }
  invert(tree.rootId);

  steps.push({
    description: "Tree inverted.",
    array: [],
    auxiliaryData: { tree: setStates(tree, state) },
  });
  return steps;
}

// ─────────── Height / Max Depth ───────────

export function generateTreeHeightSteps(
  input: (number | null)[],
): AnimationStep[] {
  const arr = input.length ? input : [3, 9, 20, null, null, 15, 7];
  const { tree, byId } = buildTreeFromArray(arr);
  const steps: AnimationStep[] = [];
  const labels: Record<number, string> = {};
  const state = new Map<number, TreeNodeState>();

  steps.push({
    description: "Compute tree height = 1 + max(height(left), height(right)).",
    array: [],
    auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
  });

  function height(id: number | null | undefined): number {
    if (id == null) return 0;
    const n = byId.get(id);
    if (!n) return 0;
    state.set(id, "active");
    steps.push({
      description: `Enter ${n.value}.`,
      array: [],
      pointers: { curr: id },
      auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
    });
    const l = height(n.left);
    const r = height(n.right);
    const h = 1 + Math.max(l, r);
    labels[id] = `h=${h}`;
    state.set(id, "found");
    steps.push({
      description: `height(${n.value}) = 1 + max(${l}, ${r}) = ${h}.`,
      array: [],
      pointers: { curr: id },
      actions: [{ type: "set", indices: [id] }],
      auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
    });
    return h;
  }
  const h = height(tree.rootId);

  steps.push({
    description: `Tree height = ${h}.`,
    array: [],
    auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
  });
  return steps;
}

// ─────────── Lowest Common Ancestor (binary tree) ───────────

export function generateLCASteps(
  input: (number | null)[],
  p: number,
  q: number,
): AnimationStep[] {
  const arr = input.length ? input : [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4];
  const { tree, byId } = buildTreeFromArray(arr);
  const steps: AnimationStep[] = [];
  const state = new Map<number, TreeNodeState>();

  steps.push({
    description: `Find LCA of ${p} and ${q}.`,
    array: [],
    auxiliaryData: { tree: setStates(tree, state) },
  });

  function lca(id: number | null | undefined): number | null {
    if (id == null) return null;
    const n = byId.get(id);
    if (!n) return null;
    state.set(id, "active");
    steps.push({
      description: `Enter ${n.value}.`,
      array: [],
      pointers: { curr: id },
      auxiliaryData: { tree: setStates(tree, state) },
    });
    if (n.value === p || n.value === q) {
      state.set(id, "found");
      steps.push({
        description: `Matched ${n.value} → return it.`,
        array: [],
        pointers: { curr: id },
        actions: [{ type: "highlight", indices: [id] }],
        auxiliaryData: { tree: setStates(tree, state) },
      });
      return id;
    }
    const L = lca(n.left);
    const R = lca(n.right);
    if (L != null && R != null) {
      state.set(id, "found");
      steps.push({
        description: `${n.value} has matches in both subtrees → LCA = ${n.value}.`,
        array: [],
        pointers: { lca: id },
        actions: [{ type: "complete", indices: [id] }],
        auxiliaryData: { tree: setStates(tree, state) },
      });
      return id;
    }
    state.set(id, "discarded");
    return L ?? R;
  }
  lca(tree.rootId);
  return steps;
}

// ─────────── Path Sum ───────────

export function generatePathSumSteps(
  input: (number | null)[],
  target: number,
): AnimationStep[] {
  const arr = input.length
    ? input
    : [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1];
  const { tree, byId } = buildTreeFromArray(arr);
  const steps: AnimationStep[] = [];
  const state = new Map<number, TreeNodeState>();
  const labels: Record<number, string> = {};

  steps.push({
    description: `Does any root-to-leaf path sum to ${target}?`,
    array: [],
    auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
  });

  let found = false;
  function dfs(id: number | null | undefined, remaining: number) {
    if (id == null || found) return;
    const n = byId.get(id);
    if (!n) return;
    const after = remaining - (n.value as number);
    labels[id] = `need ${after}`;
    state.set(id, "path");
    steps.push({
      description: `At ${n.value}: ${remaining} - ${n.value} = ${after}.`,
      array: [],
      pointers: { curr: id },
      actions: [{ type: "compare", indices: [id] }],
      auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
    });
    const isLeaf = n.left == null && n.right == null;
    if (isLeaf && after === 0) {
      state.set(id, "found");
      steps.push({
        description: `Leaf reached with sum = ${target} ✓`,
        array: [],
        pointers: { curr: id },
        actions: [{ type: "complete", indices: [id] }],
        auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
      });
      found = true;
      return;
    }
    dfs(n.left, after);
    if (found) return;
    dfs(n.right, after);
    if (found) return;
    state.set(id, "discarded");
  }
  dfs(tree.rootId, target);

  if (!found) {
    steps.push({
      description: `No root-to-leaf path sums to ${target}.`,
      array: [],
      auxiliaryData: { tree: setStates(tree, state), labels: { ...labels } },
    });
  }
  return steps;
}

// ─────────── Trie ───────────

/** Insert a set of words into a trie, character by character. */
export function generateTrieSteps(words: string[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const nodes: VizTreeNode[] = [];
  const byId = new Map<number, VizTreeNode>();
  let nextId = 0;
  const childrenMap = new Map<number, Map<string, number>>();

  const root: VizTreeNode = { id: nextId++, value: "·", left: null, right: null };
  nodes.push(root);
  byId.set(root.id, root);
  childrenMap.set(root.id, new Map());

  const wordsToAdd = words.length ? words : ["cat", "car", "cap", "dog"];

  const linkTree = (highlight: Set<number>, finals: Set<number>): VizTree => {
    // Turn a multi-way trie into a binary-visualizer-friendly shape:
    // promote the first child to `left`, chain the rest through `right`.
    const outNodes: VizTreeNode[] = [];
    for (const n of nodes) {
      const kids = childrenMap.get(n.id) ?? new Map();
      const ids = [...kids.values()];
      outNodes.push({
        id: n.id,
        value: n.value,
        left: ids[0] ?? null,
        right: null,
        state: finals.has(n.id)
          ? "found"
          : highlight.has(n.id)
            ? "path"
            : undefined,
      });
    }
    // Chain siblings via right pointers
    for (const n of nodes) {
      const kids = [...(childrenMap.get(n.id) ?? new Map()).values()];
      for (let i = 0; i + 1 < kids.length; i++) {
        const a = outNodes.find((x) => x.id === kids[i])!;
        a.right = kids[i + 1];
      }
    }
    return { nodes: outNodes, rootId: root.id };
  };

  const finals = new Set<number>();

  steps.push({
    description: `Build a trie by inserting: ${wordsToAdd.join(", ")}.`,
    array: [],
    auxiliaryData: { tree: linkTree(new Set(), finals) },
  });

  for (const word of wordsToAdd) {
    let cur = root.id;
    const path: number[] = [cur];
    for (const ch of word) {
      const kids = childrenMap.get(cur)!;
      let next = kids.get(ch);
      if (next == null) {
        const child: VizTreeNode = {
          id: nextId++, value: ch, left: null, right: null,
        };
        nodes.push(child);
        byId.set(child.id, child);
        childrenMap.set(child.id, new Map());
        kids.set(ch, child.id);
        next = child.id;
        path.push(next);
        steps.push({
          description: `Insert '${ch}' under "${path
            .slice(1, -1)
            .map((p) => byId.get(p)!.value)
            .join("")}" (new node).`,
          array: [],
          pointers: { curr: next },
          auxiliaryData: { tree: linkTree(new Set(path), finals) },
        });
      } else {
        path.push(next);
        steps.push({
          description: `'${ch}' already exists → descend.`,
          array: [],
          pointers: { curr: next },
          auxiliaryData: { tree: linkTree(new Set(path), finals) },
        });
      }
      cur = next;
    }
    finals.add(cur);
    steps.push({
      description: `Mark end of word "${word}".`,
      array: [],
      auxiliaryData: { tree: linkTree(new Set(path), finals) },
    });
  }
  return steps;
}

// ─────────── Segment tree ───────────

export function generateSegmentTreeSteps(input: number[]): AnimationStep[] {
  const arr = input.length ? input : [1, 3, 5, 7, 9, 11];
  const n = arr.length;
  const tree: number[] = new Array(4 * n).fill(0);

  // Build step list
  const steps: AnimationStep[] = [];

  // Helper to snapshot current segment tree as VizTree
  const snapshot = (): VizTree => {
    const nodes: VizTreeNode[] = [];
    const idOfPos = new Map<number, number>();
    let next = 0;
    // Walk BFS from position 1 to collect valid nodes
    const q = [{ pos: 1, lo: 0, hi: n - 1 }];
    while (q.length) {
      const { pos, lo, hi } = q.shift()!;
      if (pos >= tree.length) continue;
      const id = next++;
      idOfPos.set(pos, id);
      nodes.push({
        id,
        value: `${tree[pos]}\n[${lo},${hi}]`,
        left: null,
        right: null,
      });
      if (lo === hi) continue;
      const mid = (lo + hi) >> 1;
      q.push({ pos: 2 * pos, lo, hi: mid });
      q.push({ pos: 2 * pos + 1, lo: mid + 1, hi });
    }
    // Wire up children using the position map
    for (const [pos, id] of idOfPos) {
      const node = nodes.find((n2) => n2.id === id)!;
      const l = idOfPos.get(2 * pos);
      const r = idOfPos.get(2 * pos + 1);
      node.left = l ?? null;
      node.right = r ?? null;
    }
    return { nodes, rootId: idOfPos.get(1) ?? -1 };
  };

  steps.push({
    description: `Build a segment tree for [${arr.join(", ")}].`,
    array: [...arr],
    auxiliaryData: { tree: snapshot() },
  });

  function build(pos: number, lo: number, hi: number) {
    if (lo === hi) {
      tree[pos] = arr[lo];
      steps.push({
        description: `Leaf at index ${lo}: value ${arr[lo]}.`,
        array: [...arr],
        auxiliaryData: { tree: snapshot() },
      });
      return;
    }
    const mid = (lo + hi) >> 1;
    build(2 * pos, lo, mid);
    build(2 * pos + 1, mid + 1, hi);
    tree[pos] = tree[2 * pos] + tree[2 * pos + 1];
    steps.push({
      description: `Merge [${lo},${mid}] + [${mid + 1},${hi}] → sum ${tree[pos]}.`,
      array: [...arr],
      auxiliaryData: { tree: snapshot() },
    });
  }
  build(1, 0, n - 1);

  // Also do a sample query
  const ql = 1;
  const qr = Math.min(n - 1, 3);
  steps.push({
    description: `Range sum query [${ql}, ${qr}].`,
    array: [...arr],
    auxiliaryData: { tree: snapshot() },
  });
  function query(pos: number, lo: number, hi: number): number {
    if (qr < lo || hi < ql) return 0;
    if (ql <= lo && hi <= qr) return tree[pos];
    const mid = (lo + hi) >> 1;
    return query(2 * pos, lo, mid) + query(2 * pos + 1, mid + 1, hi);
  }
  const sum = query(1, 0, n - 1);
  steps.push({
    description: `Range sum [${ql}, ${qr}] = ${sum}.`,
    array: [...arr],
    auxiliaryData: { tree: snapshot() },
    variables: { sum },
  });
  return steps;
}

// Re-export so other modules can use the tree helper.
export { cloneTree };
