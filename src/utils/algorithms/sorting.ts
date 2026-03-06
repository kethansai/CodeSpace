import type { AnimationStep } from "@/data/types";

export function generateBubbleSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];
  const n = arr.length;

  steps.push({
    description: `Starting Bubble Sort on array [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare
      steps.push({
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        array: [...arr],
        actions: [{ type: "compare", indices: [j, j + 1] }],
      });

      if (arr[j]! > arr[j + 1]!) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!];
        steps.push({
          description: `Swapping ${arr[j + 1]} and ${arr[j]} (${arr[j + 1]} > ${arr[j]})`,
          array: [...arr],
          actions: [{ type: "swap", indices: [j, j + 1] }],
        });
      }
    }

    // Mark the last sorted element
    steps.push({
      description: `Element ${arr[n - i - 1]} is now in its final position`,
      array: [...arr],
      actions: [{ type: "complete", indices: [n - i - 1] }],
    });
  }

  // Mark all complete
  steps.push({
    description: `Bubble Sort complete! Final array: [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, idx) => ({
      type: "complete" as const,
      indices: [idx],
    })),
  });

  return steps;
}

export function generateMergeSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Starting Merge Sort on array [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  function mergeSort(start: number, end: number) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    steps.push({
      description: `Dividing: [${arr.slice(start, end + 1).join(", ")}] → left [${arr.slice(start, mid + 1).join(", ")}], right [${arr.slice(mid + 1, end + 1).join(", ")}]`,
      array: [...arr],
      actions: [
        {
          type: "highlight",
          indices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
        },
      ],
    });

    mergeSort(start, mid);
    mergeSort(mid + 1, end);

    // Merge
    const temp: number[] = [];
    let i = start,
      j = mid + 1;

    while (i <= mid && j <= end) {
      steps.push({
        description: `Comparing ${arr[i]} and ${arr[j]}`,
        array: [...arr],
        actions: [{ type: "compare", indices: [i, j] }],
      });

      if (arr[i]! <= arr[j]!) {
        temp.push(arr[i++]!);
      } else {
        temp.push(arr[j++]!);
      }
    }

    while (i <= mid) temp.push(arr[i++]!);
    while (j <= end) temp.push(arr[j++]!);

    for (let k = 0; k < temp.length; k++) {
      arr[start + k] = temp[k]!;
    }

    steps.push({
      description: `Merged: [${temp.join(", ")}]`,
      array: [...arr],
      actions: [
        {
          type: "swap",
          indices: Array.from({ length: temp.length }, (_, k) => start + k),
        },
      ],
    });
  }

  mergeSort(0, arr.length - 1);

  steps.push({
    description: `Merge Sort complete! Final array: [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, idx) => ({
      type: "complete" as const,
      indices: [idx],
    })),
  });

  return steps;
}

export function generateQuickSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Starting Quick Sort on array [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  function quickSort(low: number, high: number) {
    if (low >= high) {
      if (low === high) {
        steps.push({
          description: `Element ${arr[low]} is in its final position`,
          array: [...arr],
          actions: [{ type: "complete", indices: [low] }],
        });
      }
      return;
    }

    const pivot = arr[high]!;
    steps.push({
      description: `Choosing pivot: ${pivot} (index ${high})`,
      array: [...arr],
      actions: [{ type: "pivot", indices: [high] }],
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        array: [...arr],
        actions: [{ type: "compare", indices: [j, high] }],
      });

      if (arr[j]! < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j]!, arr[i]!];
          steps.push({
            description: `Swapping ${arr[j]} and ${arr[i]}`,
            array: [...arr],
            actions: [{ type: "swap", indices: [i, j] }],
          });
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high]!, arr[i + 1]!];
    const pivotIdx = i + 1;

    steps.push({
      description: `Pivot ${pivot} placed at index ${pivotIdx}`,
      array: [...arr],
      actions: [{ type: "complete", indices: [pivotIdx] }],
    });

    quickSort(low, pivotIdx - 1);
    quickSort(pivotIdx + 1, high);
  }

  quickSort(0, arr.length - 1);

  steps.push({
    description: `Quick Sort complete! Final array: [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, idx) => ({
      type: "complete" as const,
      indices: [idx],
    })),
  });

  return steps;
}

export function generateBinarySearchSteps(
  input: number[],
  target: number,
): AnimationStep[] {
  const arr = [...input].sort((a, b) => a - b);
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Searching for ${target} in sorted array [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const range = Array.from({ length: right - left + 1 }, (_, i) => left + i);

    steps.push({
      description: `Search range: indices ${left} to ${right}. Mid = ${mid}, value = ${arr[mid]!}`,
      array: [...arr],
      actions: [
        { type: "highlight", indices: range },
        { type: "pivot", indices: [mid] },
      ],
    });

    if (arr[mid]! === target) {
      steps.push({
        description: `Found ${target} at index ${mid}!`,
        array: [...arr],
        actions: [{ type: "complete", indices: [mid] }],
      });
      return steps;
    } else if (arr[mid]! < target) {
      steps.push({
        description: `${arr[mid]} < ${target}, searching right half`,
        array: [...arr],
        actions: [{ type: "compare", indices: [mid] }],
      });
      left = mid + 1;
    } else {
      steps.push({
        description: `${arr[mid]} > ${target}, searching left half`,
        array: [...arr],
        actions: [{ type: "compare", indices: [mid] }],
      });
      right = mid - 1;
    }
  }

  steps.push({
    description: `${target} not found in the array.`,
    array: [...arr],
    actions: [],
  });

  return steps;
}

// ---------- Selection Sort ----------
export function generateSelectionSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];
  const n = arr.length;

  steps.push({
    description: `Starting Selection Sort on [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      description: `Pass ${i + 1}: assume min is ${arr[i]} at index ${i}`,
      array: [...arr],
      actions: [{ type: "pivot", indices: [i] }],
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        description: `Comparing ${arr[j]} with current min ${arr[minIdx]}`,
        array: [...arr],
        actions: [{ type: "compare", indices: [j, minIdx] }],
      });
      if (arr[j]! < arr[minIdx]!) {
        minIdx = j;
        steps.push({
          description: `New min found: ${arr[minIdx]} at index ${minIdx}`,
          array: [...arr],
          actions: [{ type: "highlight", indices: [minIdx] }],
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx]!, arr[i]!];
      steps.push({
        description: `Swapping ${arr[minIdx]} and ${arr[i]}`,
        array: [...arr],
        actions: [{ type: "swap", indices: [i, minIdx] }],
      });
    }
    steps.push({
      description: `${arr[i]} is now in its final position`,
      array: [...arr],
      actions: [{ type: "complete", indices: [i] }],
    });
  }

  steps.push({
    description: `Selection Sort complete! [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, idx) => ({
      type: "complete" as const,
      indices: [idx],
    })),
  });
  return steps;
}

// ---------- Insertion Sort ----------
export function generateInsertionSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Starting Insertion Sort on [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });
  steps.push({
    description: `Element ${arr[0]} is trivially sorted`,
    array: [...arr],
    actions: [{ type: "complete", indices: [0] }],
  });

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]!;
    steps.push({
      description: `Pick key = ${key} at index ${i}`,
      array: [...arr],
      actions: [{ type: "pivot", indices: [i] }],
    });
    let j = i - 1;

    while (j >= 0 && arr[j]! > key) {
      steps.push({
        description: `${arr[j]} > ${key}: shift ${arr[j]} right`,
        array: [...arr],
        actions: [{ type: "compare", indices: [j, j + 1] }],
      });
      arr[j + 1] = arr[j]!;
      j--;
    }
    arr[j + 1] = key;
    steps.push({
      description: `Insert ${key} at index ${j + 1}`,
      array: [...arr],
      actions: [{ type: "swap", indices: [j + 1] }],
    });
  }

  steps.push({
    description: `Insertion Sort complete! [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, idx) => ({
      type: "complete" as const,
      indices: [idx],
    })),
  });
  return steps;
}

// ---------- Heap Sort ----------
export function generateHeapSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];
  const n = arr.length;

  steps.push({
    description: `Starting Heap Sort on [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      steps.push({
        description: `Comparing ${arr[left]} with ${arr[largest]}`,
        array: [...arr],
        actions: [{ type: "compare", indices: [left, largest] }],
      });
      if (arr[left]! > arr[largest]!) largest = left;
    }
    if (right < size) {
      steps.push({
        description: `Comparing ${arr[right]} with ${arr[largest]}`,
        array: [...arr],
        actions: [{ type: "compare", indices: [right, largest] }],
      });
      if (arr[right]! > arr[largest]!) largest = right;
    }
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest]!, arr[root]!];
      steps.push({
        description: `Swap ${arr[largest]} and ${arr[root]}`,
        array: [...arr],
        actions: [{ type: "swap", indices: [root, largest] }],
      });
      heapify(size, largest);
    }
  }

  // Build max heap
  steps.push({
    description: "Building max heap...",
    array: [...arr],
    actions: [],
  });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  steps.push({
    description: `Max heap built: [${arr.join(", ")}]`,
    array: [...arr],
    actions: [{ type: "highlight", indices: arr.map((_, i) => i) }],
  });

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i]!, arr[0]!];
    steps.push({
      description: `Move max ${arr[i]} to position ${i}`,
      array: [...arr],
      actions: [
        { type: "swap", indices: [0, i] },
        { type: "complete", indices: [i] },
      ],
    });
    heapify(i, 0);
  }
  steps.push({
    description: `Heap Sort complete! [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, idx) => ({
      type: "complete" as const,
      indices: [idx],
    })),
  });
  return steps;
}

// ---------- Counting Sort ----------
export function generateCountingSortSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Starting Counting Sort on [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i]!]++;
    steps.push({
      description: `Count occurrence of ${arr[i]}`,
      array: [...arr],
      actions: [{ type: "highlight", indices: [i] }],
    });
  }

  let idx = 0;
  for (let val = 0; val <= max; val++) {
    for (let c = 0; c < count[val]!; c++) {
      arr[idx] = val;
      steps.push({
        description: `Place ${val} at index ${idx}`,
        array: [...arr],
        actions: [{ type: "set", indices: [idx] }],
      });
      idx++;
    }
  }

  steps.push({
    description: `Counting Sort complete! [${arr.join(", ")}]`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ---------- Linear Search ----------
export function generateLinearSearchSteps(
  input: number[],
  target: number,
): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Searching for ${target} in [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      description: `Checking index ${i}: ${arr[i]} ${arr[i] === target ? "==" : "!="} ${target}`,
      array: [...arr],
      actions: [{ type: "compare", indices: [i] }],
    });
    if (arr[i] === target) {
      steps.push({
        description: `Found ${target} at index ${i}!`,
        array: [...arr],
        actions: [{ type: "complete", indices: [i] }],
      });
      return steps;
    }
  }

  steps.push({
    description: `${target} not found in array.`,
    array: [...arr],
    actions: [],
  });
  return steps;
}

// ---------- Two Pointers Visualization ----------
export function generateTwoPointersSteps(
  input: number[],
  target: number,
): AnimationStep[] {
  const arr = [...input].sort((a, b) => a - b);
  const steps: AnimationStep[] = [];
  let left = 0,
    right = arr.length - 1;

  steps.push({
    description: `Two Pointers on sorted [${arr.join(", ")}], target = ${target}`,
    array: [...arr],
    actions: [],
  });

  while (left < right) {
    const sum = arr[left]! + arr[right]!;
    steps.push({
      description: `L=${left}(${arr[left]}), R=${right}(${arr[right]}): sum = ${sum}`,
      array: [...arr],
      actions: [{ type: "compare", indices: [left, right] }],
    });

    if (sum === target) {
      steps.push({
        description: `Found pair! ${arr[left]} + ${arr[right]} = ${target}`,
        array: [...arr],
        actions: [{ type: "complete", indices: [left, right] }],
      });
      return steps;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  steps.push({
    description: `No pair found for target ${target}.`,
    array: [...arr],
    actions: [],
  });
  return steps;
}

// ---------- Sliding Window Visualization ----------
export function generateSlidingWindowSteps(
  input: number[],
  k: number,
): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Sliding Window of size ${k} on [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  let windowSum = 0;
  let maxSum = -Infinity;
  let maxStart = 0;

  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i]!;
    const windowIndices = Array.from(
      { length: Math.min(i + 1, k) },
      (_, j) => i - j,
    ).reverse();

    if (i >= k) {
      windowSum -= arr[i - k]!;
      windowIndices.shift();
    }

    if (i >= k - 1) {
      steps.push({
        description: `Window [${windowIndices.map((j) => arr[j]).join(", ")}] sum = ${windowSum}${windowSum > maxSum ? " (new max!)" : ""}`,
        array: [...arr],
        actions: [{ type: "highlight", indices: windowIndices }],
      });
      if (windowSum > maxSum) {
        maxSum = windowSum;
        maxStart = i - k + 1;
      }
    } else {
      steps.push({
        description: `Building window... added ${arr[i]}`,
        array: [...arr],
        actions: [{ type: "highlight", indices: windowIndices }],
      });
    }
  }

  const finalIndices = Array.from({ length: k }, (_, i) => maxStart + i);
  steps.push({
    description: `Max sum = ${maxSum} at window starting index ${maxStart}`,
    array: [...arr],
    actions: [{ type: "complete", indices: finalIndices }],
  });
  return steps;
}

// ---------- DFS Visualization (array-based tree) ----------
export function generateDFSSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `DFS traversal on tree [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  function dfs(idx: number) {
    if (idx >= arr.length || arr[idx] === undefined) return;
    steps.push({
      description: `Visit node ${arr[idx]} (index ${idx})`,
      array: [...arr],
      actions: [{ type: "visit", indices: [idx] }],
    });
    dfs(2 * idx + 1); // left child
    dfs(2 * idx + 2); // right child
    steps.push({
      description: `Finished subtree at ${arr[idx]}`,
      array: [...arr],
      actions: [{ type: "complete", indices: [idx] }],
    });
  }

  dfs(0);
  steps.push({
    description: `DFS complete!`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ---------- BFS Visualization (array-based tree) ----------
export function generateBFSSteps(input: number[]): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `BFS traversal on tree [${arr.join(", ")}]`,
    array: [...arr],
    actions: [],
  });

  const queue = [0];
  while (queue.length > 0) {
    const idx = queue.shift()!;
    if (idx >= arr.length || arr[idx] === undefined) continue;
    steps.push({
      description: `Visit node ${arr[idx]} (index ${idx})`,
      array: [...arr],
      actions: [{ type: "visit", indices: [idx] }],
    });
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    if (left < arr.length) queue.push(left);
    if (right < arr.length) queue.push(right);
  }

  steps.push({
    description: `BFS complete!`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ---------- Stack Operations ----------
export function generateStackSteps(input: number[]): AnimationStep[] {
  const arr: number[] = [];
  const steps: AnimationStep[] = [];

  steps.push({
    description: "Starting with empty stack",
    array: [],
    actions: [],
  });

  for (const val of input) {
    arr.push(val);
    steps.push({
      description: `Push ${val} → Stack: [${arr.join(", ")}]`,
      array: [...arr],
      actions: [{ type: "insert", indices: [arr.length - 1] }],
    });
  }

  while (arr.length > 0) {
    const val = arr.pop();
    steps.push({
      description: `Pop ${val} → Stack: [${arr.join(", ")}]`,
      array: [...arr],
      actions:
        arr.length > 0 ? [{ type: "remove", indices: [arr.length] }] : [],
    });
  }

  steps.push({
    description: "Stack is empty. Operations complete!",
    array: [],
    actions: [],
  });
  return steps;
}

// ---------- Linked List Reversal ----------
export function generateLinkedListReversalSteps(
  input: number[],
): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Reverse linked list: ${arr.join(" → ")}`,
    array: [...arr],
    actions: [],
  });

  for (let i = 0; i < Math.floor(arr.length / 2); i++) {
    const j = arr.length - 1 - i;
    steps.push({
      description: `Swap positions ${i} and ${j}: ${arr[i]} ↔ ${arr[j]}`,
      array: [...arr],
      actions: [{ type: "compare", indices: [i, j] }],
    });
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    steps.push({
      description: `After swap: ${arr.join(" → ")}`,
      array: [...arr],
      actions: [{ type: "swap", indices: [i, j] }],
    });
  }

  steps.push({
    description: `Reversed: ${arr.join(" → ")}`,
    array: [...arr],
    actions: arr.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}

// ---------- Hash Map Visualization ----------
export function generateHashMapSteps(
  input: number[],
  target: number,
): AnimationStep[] {
  const arr = [...input];
  const steps: AnimationStep[] = [];

  steps.push({
    description: `Two Sum via Hash Map: [${arr.join(", ")}], target = ${target}`,
    array: [...arr],
    actions: [],
  });

  const map = new Map<number, number>();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i]!;
    steps.push({
      description: `Index ${i}: need ${complement} (${target} - ${arr[i]})`,
      array: [...arr],
      actions: [{ type: "highlight", indices: [i] }],
    });

    if (map.has(complement)) {
      const j = map.get(complement)!;
      steps.push({
        description: `Found! ${arr[j]} + ${arr[i]} = ${target} (indices ${j}, ${i})`,
        array: [...arr],
        actions: [{ type: "complete", indices: [j, i] }],
      });
      return steps;
    }
    map.set(arr[i]!, i);
    steps.push({
      description: `Store ${arr[i]} → index ${i} in map`,
      array: [...arr],
      actions: [{ type: "visit", indices: [i] }],
    });
  }

  steps.push({ description: "No pair found.", array: [...arr], actions: [] });
  return steps;
}

// ---------- DP Fibonacci Visualization ----------
export function generateFibonacciSteps(n: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const dp = [0, 1];

  steps.push({
    description: "DP Fibonacci: dp[0]=0, dp[1]=1",
    array: [...dp],
    actions: [{ type: "highlight", indices: [0, 1] }],
  });

  for (let i = 2; i <= n; i++) {
    dp.push(dp[i - 1]! + dp[i - 2]!);
    steps.push({
      description: `dp[${i}] = dp[${i - 1}](${dp[i - 1]}) + dp[${i - 2}](${dp[i - 2]}) = ${dp[i]}`,
      array: [...dp],
      actions: [
        { type: "set", indices: [i] },
        { type: "compare", indices: [i - 1, i - 2] },
      ],
    });
  }

  steps.push({
    description: `Fibonacci sequence complete: [${dp.join(", ")}]`,
    array: [...dp],
    actions: dp.map((_, i) => ({ type: "complete" as const, indices: [i] })),
  });
  return steps;
}
