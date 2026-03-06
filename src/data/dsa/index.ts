import type { DSACategory } from "@/data/types";

export const dsaCategories: DSACategory[] = [
  // ─────────── 1. Arrays & Strings ───────────
  {
    id: "arrays",
    slug: "arrays",
    name: "Arrays & Strings",
    icon: "📊",
    description:
      "Fundamental data structures — contiguous memory, indexing, and string manipulation.",
    color: "bg-blue-500",
    topics: [
      {
        id: "two-pointers",
        slug: "two-pointers",
        title: "Two Pointers Technique",
        difficulty: "easy",
        description: "Using two pointers to solve array problems efficiently.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Two Pointers\n\nThe **two pointers** technique uses two indices that move through the array, typically from both ends toward the center or at different speeds.\n\n### When to Use\n- Sorted arrays\n- Finding pairs that satisfy a condition\n- Removing duplicates\n- Palindrome checking\n\n### Patterns\n1. **Opposite Direction**: Start from both ends, move inward\n2. **Same Direction (Fast/Slow)**: Different speeds to detect cycles\n\n### Complexity\n- **Time**: O(n) — each element visited at most once\n- **Space**: O(1) — only pointer variables`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function twoSum(numbers, target) {\n  let left = 0, right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left, right];\n    else if (sum < target) left++;\n    else right--;\n  }\n  return [-1, -1];\n}\nconsole.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
          },
          {
            language: "python",
            label: "Python",
            code: `def two_sum(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        s = numbers[left] + numbers[right]\n        if s == target: return [left, right]\n        elif s < target: left += 1\n        else: right -= 1\n    return [-1, -1]\n\nprint(two_sum([2, 7, 11, 15], 9))`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n  int l = 0, r = nums.size()-1;\n  while (l < r) {\n    int s = nums[l]+nums[r];\n    if (s == target) return {l, r};\n    else if (s < target) l++;\n    else r--;\n  }\n  return {-1,-1};\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [2, 7, 11, 15] },
      },
      {
        id: "sliding-window",
        slug: "sliding-window",
        title: "Sliding Window",
        difficulty: "medium",
        description:
          "Maintaining a window of elements to solve subarray/substring problems.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(k)",
        content: `## Sliding Window\n\nThe **sliding window** technique maintains a contiguous sub-range that slides across the data.\n\n### Types\n1. **Fixed-size**: Window size k is predetermined\n2. **Variable-size**: Window grows/shrinks based on conditions\n\n### When to Use\n- Maximum/minimum sum subarray of size k\n- Longest substring with at most k distinct characters\n- Minimum window substring`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function maxSumSubarray(arr, k) {\n  let windowSum = 0, maxSum = -Infinity;\n  for (let i = 0; i < arr.length; i++) {\n    windowSum += arr[i];\n    if (i >= k) windowSum -= arr[i - k];\n    if (i >= k - 1) maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\nconsole.log(maxSumSubarray([2,1,5,1,3,2], 3)); // 9`,
          },
          {
            language: "python",
            label: "Python",
            code: `def max_sum_subarray(arr, k):\n    window_sum = max_sum = 0\n    for i, val in enumerate(arr):\n        window_sum += val\n        if i >= k: window_sum -= arr[i - k]\n        if i >= k - 1: max_sum = max(max_sum, window_sum)\n    return max_sum\n\nprint(max_sum_subarray([2,1,5,1,3,2], 3))`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxSumSubarray(vector<int>& arr, int k) {\n  int wSum = 0, mx = INT_MIN;\n  for (int i = 0; i < (int)arr.size(); i++) {\n    wSum += arr[i];\n    if (i >= k) wSum -= arr[i-k];\n    if (i >= k-1) mx = max(mx, wSum);\n  }\n  return mx;\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [2, 1, 5, 1, 3, 2],
        },
      },
      {
        id: "prefix-sum",
        slug: "prefix-sum",
        title: "Prefix Sum",
        difficulty: "easy",
        description: "Pre-compute cumulative sums for fast range-sum queries.",
        timeComplexity: "O(n) build, O(1) query",
        spaceComplexity: "O(n)",
        content: `## Prefix Sum\n\nBuild an array where each element is the cumulative sum up to that index. This allows answering any range-sum query in O(1).\n\n### Formula\n\`prefix[i] = prefix[i-1] + arr[i]\`\n\nRange sum from index l to r = \`prefix[r] - prefix[l-1]\`.\n\n### Applications\n- Subarray sum equals k\n- Equilibrium index\n- Product of array except self (via prefix products)`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function subarraySum(nums, k) {\n  const map = new Map([[0, 1]]);\n  let sum = 0, count = 0;\n  for (const n of nums) {\n    sum += n;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def subarray_sum(nums, k):\n    prefix = {0: 1}\n    total = count = 0\n    for n in nums:\n        total += n\n        count += prefix.get(total - k, 0)\n        prefix[total] = prefix.get(total, 0) + 1\n    return count`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\n#include <unordered_map>\nusing namespace std;\nint subarraySum(vector<int>& nums, int k) {\n  unordered_map<int,int> mp{{0,1}};\n  int sum=0, cnt=0;\n  for (int n : nums) {\n    sum += n;\n    if (mp.count(sum-k)) cnt += mp[sum-k];\n    mp[sum]++;\n  }\n  return cnt;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "kadanes-algorithm",
        slug: "kadanes-algorithm",
        title: "Kadane's Algorithm",
        difficulty: "medium",
        description: "Find the maximum subarray sum in O(n) time.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Kadane's Algorithm\n\nFinds the contiguous subarray with the largest sum.\n\n### Idea\nMaintain \`currentMax\` — extend the previous subarray or start fresh at each element.\n\n\`currentMax = max(arr[i], currentMax + arr[i])\`\n\n### Variants\n- Maximum circular subarray (Kadane + total minus min subarray)\n- Maximum product subarray (track min and max products)`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function maxSubArray(nums) {\n  let cur = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6`,
          },
          {
            language: "python",
            label: "Python",
            code: `def max_sub_array(nums):\n    cur = best = nums[0]\n    for n in nums[1:]:\n        cur = max(n, cur + n)\n        best = max(best, cur)\n    return best\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxSubArray(vector<int>& nums) {\n  int cur = nums[0], best = nums[0];\n  for (int i = 1; i < (int)nums.size(); i++) {\n    cur = max(nums[i], cur + nums[i]);\n    best = max(best, cur);\n  }\n  return best;\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
        },
      },
    ],
  },

  // ─────────── 2. Sorting ───────────
  {
    id: "sorting",
    slug: "sorting",
    name: "Sorting Algorithms",
    icon: "🔄",
    description: "Classic sorting algorithms with step-by-step visualizations.",
    color: "bg-emerald-500",
    topics: [
      {
        id: "bubble-sort",
        slug: "bubble-sort",
        title: "Bubble Sort",
        difficulty: "easy",
        description:
          "Repeatedly swap adjacent elements if they are in the wrong order.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        content: `## Bubble Sort\n\nBubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.\n\n### How It Works\n1. Start from the first element\n2. Compare each pair of adjacent elements\n3. Swap if the left element is greater than the right\n4. After each pass, the largest unsorted element "bubbles" to its correct position\n\n### Optimization\nIf no swaps occur during a pass, the array is already sorted — we can stop early.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let swapped = false;\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j+1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n  return arr;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - i - 1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nvoid bubbleSort(vector<int>& arr) {\n  int n = arr.size();\n  for (int i = 0; i < n-1; i++) {\n    bool swapped = false;\n    for (int j = 0; j < n-i-1; j++) {\n      if (arr[j] > arr[j+1]) {\n        swap(arr[j], arr[j+1]);\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [64, 34, 25, 12, 22, 11, 90],
        },
      },
      {
        id: "selection-sort",
        slug: "selection-sort",
        title: "Selection Sort",
        difficulty: "easy",
        description:
          "Select the minimum element and place it at the beginning.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        content: `## Selection Sort\n\nFinds the minimum element from the unsorted part and puts it at the beginning.\n\n### Steps\n1. Find the minimum in the unsorted region\n2. Swap it with the first unsorted element\n3. Move the boundary one element to the right\n\n### Properties\n- Makes O(n) swaps — optimal when writes are expensive\n- Not stable by default`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function selectionSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }\n  return arr;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def selection_sort(arr):\n    for i in range(len(arr) - 1):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nvoid selectionSort(vector<int>& arr) {\n  for (int i = 0; i < (int)arr.size()-1; i++) {\n    int mn = i;\n    for (int j = i+1; j < (int)arr.size(); j++)\n      if (arr[j] < arr[mn]) mn = j;\n    swap(arr[i], arr[mn]);\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [64, 25, 12, 22, 11],
        },
      },
      {
        id: "insertion-sort",
        slug: "insertion-sort",
        title: "Insertion Sort",
        difficulty: "easy",
        description:
          "Build the sorted array one item at a time by inserting each element in its proper place.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        content: `## Insertion Sort\n\nBuilds the sorted array one element at a time. Pick an element and insert it into its correct position among already sorted elements.\n\n### Best Case\nO(n) when the array is nearly sorted — makes it great for small or nearly-sorted data.\n\n### Used In\n- Tim Sort (Python/Java) uses insertion sort for small partitions\n- Adaptive sorting scenarios`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    const key = arr[i];\n    let j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j+1] = arr[j];\n      j--;\n    }\n    arr[j+1] = key;\n  }\n  return arr;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j+1] = arr[j]\n            j -= 1\n        arr[j+1] = key\n    return arr`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nvoid insertionSort(vector<int>& arr) {\n  for (int i=1; i<(int)arr.size(); i++) {\n    int key=arr[i], j=i-1;\n    while (j>=0 && arr[j]>key) {\n      arr[j+1]=arr[j]; j--;\n    }\n    arr[j+1]=key;\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [12, 11, 13, 5, 6],
        },
      },
      {
        id: "merge-sort",
        slug: "merge-sort",
        title: "Merge Sort",
        difficulty: "medium",
        description:
          "Divide-and-conquer: split, sort, then merge two sorted halves.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        content: `## Merge Sort\n\nA divide-and-conquer algorithm that splits the array in half, recursively sorts each half, and merges the two sorted halves.\n\n### Guarantees\n- Always O(n log n) regardless of input\n- Stable sort\n- Predictable performance\n\n### Trade-off\nUses O(n) extra space for the temporary merge buffer.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(l, r) {\n  const res = [];\n  let i = 0, j = 0;\n  while (i < l.length && j < r.length)\n    res.push(l[i] <= r[j] ? l[i++] : r[j++]);\n  return res.concat(l.slice(i), r.slice(j));\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(l, r):\n    res, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]: res.append(l[i]); i += 1\n        else: res.append(r[j]); j += 1\n    return res + l[i:] + r[j:]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nvoid merge(vector<int>& a, int l, int m, int r) {\n  vector<int> L(a.begin()+l, a.begin()+m+1);\n  vector<int> R(a.begin()+m+1, a.begin()+r+1);\n  int i=0,j=0,k=l;\n  while(i<(int)L.size()&&j<(int)R.size())\n    a[k++]=(L[i]<=R[j])?L[i++]:R[j++];\n  while(i<(int)L.size()) a[k++]=L[i++];\n  while(j<(int)R.size()) a[k++]=R[j++];\n}\nvoid mergeSort(vector<int>& a, int l, int r) {\n  if(l>=r) return;\n  int m=(l+r)/2;\n  mergeSort(a,l,m); mergeSort(a,m+1,r);\n  merge(a,l,m,r);\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [38, 27, 43, 3, 9, 82, 10],
        },
      },
      {
        id: "quick-sort",
        slug: "quick-sort",
        title: "Quick Sort",
        difficulty: "medium",
        description:
          "Partition around a pivot, then recursively sort each side.",
        timeComplexity: "O(n log n) avg, O(n²) worst",
        spaceComplexity: "O(log n)",
        content: `## Quick Sort\n\nPick a **pivot**, partition the array so smaller elements are left and larger elements are right, then recurse.\n\n### Pivot Strategies\n- Last element (simple)\n- Median-of-three (avoids worst case)\n- Random pivot\n\n### Properties\n- In-place (O(log n) stack space)\n- Not stable\n- Fastest in practice for random data`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function quickSort(arr, lo = 0, hi = arr.length - 1) {\n  if (lo >= hi) return arr;\n  const pivot = arr[hi];\n  let i = lo - 1;\n  for (let j = lo; j < hi; j++) {\n    if (arr[j] < pivot) {\n      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];\n    }\n  }\n  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];\n  quickSort(arr, lo, i);\n  quickSort(arr, i + 2, hi);\n  return arr;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def quick_sort(arr, lo=0, hi=None):\n    if hi is None: hi = len(arr) - 1\n    if lo >= hi: return\n    pivot = arr[hi]\n    i = lo - 1\n    for j in range(lo, hi):\n        if arr[j] < pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i+1], arr[hi] = arr[hi], arr[i+1]\n    quick_sort(arr, lo, i)\n    quick_sort(arr, i+2, hi)`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nint partition(vector<int>& a, int lo, int hi) {\n  int p=a[hi], i=lo-1;\n  for(int j=lo;j<hi;j++)\n    if(a[j]<p) swap(a[++i],a[j]);\n  swap(a[i+1],a[hi]);\n  return i+1;\n}\nvoid quickSort(vector<int>& a, int lo, int hi) {\n  if(lo>=hi) return;\n  int pi=partition(a,lo,hi);\n  quickSort(a,lo,pi-1);\n  quickSort(a,pi+1,hi);\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [10, 7, 8, 9, 1, 5],
        },
      },
      {
        id: "heap-sort",
        slug: "heap-sort",
        title: "Heap Sort",
        difficulty: "medium",
        description: "Build a max-heap, then repeatedly extract the maximum.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        content: `## Heap Sort\n\n1. Build a **max-heap** from the array\n2. Repeatedly extract the root (maximum), place it at the end\n3. Re-heapify the reduced heap\n\n### Properties\n- In-place, O(1) extra space\n- Not stable\n- Guaranteed O(n log n)\n- Slower constant factor than Quick Sort in practice`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function heapSort(arr) {\n  const n = arr.length;\n  function heapify(size, root) {\n    let largest = root, l = 2*root+1, r = 2*root+2;\n    if (l < size && arr[l] > arr[largest]) largest = l;\n    if (r < size && arr[r] > arr[largest]) largest = r;\n    if (largest !== root) {\n      [arr[root], arr[largest]] = [arr[largest], arr[root]];\n      heapify(size, largest);\n    }\n  }\n  for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(n, i);\n  for (let i = n-1; i > 0; i--) {\n    [arr[0], arr[i]] = [arr[i], arr[0]];\n    heapify(i, 0);\n  }\n  return arr;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def heap_sort(arr):\n    def heapify(n, i):\n        largest, l, r = i, 2*i+1, 2*i+2\n        if l < n and arr[l] > arr[largest]: largest = l\n        if r < n and arr[r] > arr[largest]: largest = r\n        if largest != i:\n            arr[i], arr[largest] = arr[largest], arr[i]\n            heapify(n, largest)\n    n = len(arr)\n    for i in range(n//2-1, -1, -1): heapify(n, i)\n    for i in range(n-1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(i, 0)\n    return arr`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvoid heapify(vector<int>& a, int n, int i) {\n  int lg=i, l=2*i+1, r=2*i+2;\n  if(l<n&&a[l]>a[lg]) lg=l;\n  if(r<n&&a[r]>a[lg]) lg=r;\n  if(lg!=i){swap(a[i],a[lg]); heapify(a,n,lg);}\n}\nvoid heapSort(vector<int>& a) {\n  int n=a.size();\n  for(int i=n/2-1;i>=0;i--) heapify(a,n,i);\n  for(int i=n-1;i>0;i--){swap(a[0],a[i]); heapify(a,i,0);}\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [12, 11, 13, 5, 6, 7],
        },
      },
      {
        id: "counting-sort",
        slug: "counting-sort",
        title: "Counting Sort",
        difficulty: "easy",
        description:
          "Non-comparison sort that counts occurrences of each element.",
        timeComplexity: "O(n + k)",
        spaceComplexity: "O(k)",
        content: `## Counting Sort\n\nA non-comparison integer sorting algorithm. Counts occurrences of each value and uses those counts to place elements.\n\n### When to Use\n- Small range of integer values (k ≈ n)\n- Known range of input data\n- As a subroutine in Radix Sort\n\n### Limitations\n- Only works for integers\n- Space grows with value range k`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function countingSort(arr) {\n  const max = Math.max(...arr);\n  const count = new Array(max + 1).fill(0);\n  for (const v of arr) count[v]++;\n  const result = [];\n  for (let i = 0; i <= max; i++)\n    for (let c = 0; c < count[i]; c++) result.push(i);\n  return result;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def counting_sort(arr):\n    mx = max(arr)\n    count = [0] * (mx + 1)\n    for v in arr: count[v] += 1\n    result = []\n    for i in range(mx + 1):\n        result.extend([i] * count[i])\n    return result`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nvector<int> countingSort(vector<int>& arr) {\n  int mx = *max_element(arr.begin(), arr.end());\n  vector<int> cnt(mx+1, 0);\n  for(int v : arr) cnt[v]++;\n  vector<int> res;\n  for(int i=0;i<=mx;i++)\n    for(int c=0;c<cnt[i];c++) res.push_back(i);\n  return res;\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [4, 2, 2, 8, 3, 3, 1],
        },
      },
      {
        id: "radix-sort",
        slug: "radix-sort",
        title: "Radix Sort",
        difficulty: "medium",
        description: "Sort numbers digit by digit using a stable sub-sort.",
        timeComplexity: "O(d × (n + k))",
        spaceComplexity: "O(n + k)",
        content: `## Radix Sort\n\nSorts numbers by processing individual digits, from least significant to most significant, using a stable sub-sort (like Counting Sort).\n\n### Properties\n- Non-comparison based\n- Linear time when digits d and base k are constants\n- Stable\n\n### LSD vs MSD\n- **LSD** (Least Significant Digit first): most common\n- **MSD**: useful for strings`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function radixSort(arr) {\n  const max = Math.max(...arr);\n  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {\n    const buckets = Array.from({length: 10}, () => []);\n    for (const n of arr) buckets[Math.floor(n / exp) % 10].push(n);\n    arr = buckets.flat();\n  }\n  return arr;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def radix_sort(arr):\n    mx = max(arr)\n    exp = 1\n    while mx // exp > 0:\n        buckets = [[] for _ in range(10)]\n        for n in arr:\n            buckets[(n // exp) % 10].append(n)\n        arr = [x for b in buckets for x in b]\n        exp *= 10\n    return arr`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvoid radixSort(vector<int>& arr) {\n  int mx = *max_element(arr.begin(), arr.end());\n  for (int exp=1; mx/exp>0; exp*=10) {\n    vector<vector<int>> bkt(10);\n    for (int n:arr) bkt[(n/exp)%10].push_back(n);\n    arr.clear();\n    for (auto& b:bkt) for (int v:b) arr.push_back(v);\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [170, 45, 75, 90, 802, 24, 2, 66],
        },
      },
    ],
  },

  // ─────────── 3. Searching ───────────
  {
    id: "searching",
    slug: "searching",
    name: "Searching Algorithms",
    icon: "🔍",
    description: "Efficiently find elements in sorted and unsorted data.",
    color: "bg-yellow-500",
    topics: [
      {
        id: "linear-search",
        slug: "linear-search",
        title: "Linear Search",
        difficulty: "easy",
        description: "Scan each element one by one until the target is found.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Linear Search\n\nThe simplest search algorithm — check every element until you find the target or exhaust the list.\n\n### When to Use\n- Unsorted data\n- Small datasets\n- Linked lists (no random access)`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def linear_search(arr, target):\n    for i, v in enumerate(arr):\n        if v == target: return i\n    return -1`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\nusing namespace std;\nint linearSearch(vector<int>& arr, int target) {\n  for (int i = 0; i < (int)arr.size(); i++)\n    if (arr[i] == target) return i;\n  return -1;\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [10, 23, 45, 70, 11, 15],
        },
      },
      {
        id: "binary-search",
        slug: "binary-search",
        title: "Binary Search",
        difficulty: "easy",
        description:
          "Efficiently search in a sorted array by halving the search space.",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        content: `## Binary Search\n\nRepeatedly divide the search interval in half. Only works on **sorted** arrays.\n\n### Variants\n- Lower bound / upper bound\n- Search on answer (monotonic predicate)\n- Rotated sorted array search`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int binarySearch(vector<int>& arr, int target) {\n  int lo=0, hi=arr.size()-1;\n  while (lo<=hi) {\n    int mid=(lo+hi)/2;\n    if (arr[mid]==target) return mid;\n    else if (arr[mid]<target) lo=mid+1;\n    else hi=mid-1;\n  }\n  return -1;\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [1, 3, 5, 7, 9, 11, 13, 15],
        },
      },
      {
        id: "binary-search-on-answer",
        slug: "binary-search-on-answer",
        title: "Binary Search on Answer",
        difficulty: "hard",
        description:
          "Apply binary search over a monotonic predicate to find the optimal value.",
        timeComplexity: "O(n log(range))",
        spaceComplexity: "O(1)",
        content: `## Binary Search on Answer\n\nInstead of searching in an array, binary search over the **answer space**. Define a predicate \`canAchieve(x)\` that is monotonic, then binary search for the boundary.\n\n### Classic Problems\n- Minimum capacity to ship packages within D days\n- Koko eating bananas\n- Split array largest sum`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function shipWithinDays(weights, days) {\n  let lo = Math.max(...weights);\n  let hi = weights.reduce((a,b) => a+b, 0);\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    let d = 1, cur = 0;\n    for (const w of weights) {\n      if (cur + w > mid) { d++; cur = 0; }\n      cur += w;\n    }\n    if (d <= days) hi = mid;\n    else lo = mid + 1;\n  }\n  return lo;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def ship_within_days(weights, days):\n    lo, hi = max(weights), sum(weights)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        d, cur = 1, 0\n        for w in weights:\n            if cur + w > mid:\n                d += 1; cur = 0\n            cur += w\n        if d <= days: hi = mid\n        else: lo = mid + 1\n    return lo`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\nint shipWithinDays(vector<int>& w, int days) {\n  int lo=*max_element(w.begin(),w.end());\n  int hi=accumulate(w.begin(),w.end(),0);\n  while(lo<hi){\n    int mid=(lo+hi)/2, d=1,cur=0;\n    for(int x:w){if(cur+x>mid){d++;cur=0;} cur+=x;}\n    if(d<=days) hi=mid; else lo=mid+1;\n  }\n  return lo;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      },
    ],
  },

  // ─────────── 4. Linked Lists ───────────
  {
    id: "linked-lists",
    slug: "linked-lists",
    name: "Linked Lists",
    icon: "🔗",
    description: "Dynamic data structures with nodes connected by pointers.",
    color: "bg-purple-500",
    topics: [
      {
        id: "singly-linked-list",
        slug: "singly-linked-list",
        title: "Singly Linked List",
        difficulty: "easy",
        description:
          "A linear collection of nodes, each pointing to the next node.",
        timeComplexity: "O(n) traversal, O(1) insert at head",
        spaceComplexity: "O(n)",
        content: `## Singly Linked List\n\nEach node holds a value and a pointer to the next node.\n\n### Operations\n- **Insert at head**: O(1)\n- **Insert at tail**: O(n) or O(1) with tail pointer\n- **Delete**: O(n) search + O(1) removal\n- **Search**: O(n)`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class ListNode {\n  constructor(val, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        curr.next, prev, curr = prev, curr, curr.next\n    return prev`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `struct ListNode {\n  int val;\n  ListNode* next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n  ListNode *prev=nullptr, *curr=head;\n  while(curr) {\n    auto nxt=curr->next;\n    curr->next=prev;\n    prev=curr;\n    curr=nxt;\n  }\n  return prev;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "doubly-linked-list",
        slug: "doubly-linked-list",
        title: "Doubly Linked List",
        difficulty: "medium",
        description: "Nodes with pointers to both next and previous elements.",
        timeComplexity: "O(1) insert/delete at known node",
        spaceComplexity: "O(n)",
        content: `## Doubly Linked List\n\nEach node has both **next** and **prev** pointers, enabling bidirectional traversal.\n\n### Advantages\n- O(1) deletion with pointer to node\n- Can traverse backwards\n- Used in LRU cache`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class DLLNode {\n  constructor(val) {\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass DoublyLinkedList {\n  constructor() {\n    this.head = new DLLNode(0);\n    this.tail = new DLLNode(0);\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n  addToFront(val) {\n    const node = new DLLNode(val);\n    node.next = this.head.next;\n    node.prev = this.head;\n    this.head.next.prev = node;\n    this.head.next = node;\n    return node;\n  }\n  remove(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n  }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `class DLLNode:\n    def __init__(self, val=0):\n        self.val = val\n        self.prev = self.next = None\n\nclass DoublyLinkedList:\n    def __init__(self):\n        self.head = DLLNode(0)\n        self.tail = DLLNode(0)\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def add_front(self, val):\n        node = DLLNode(val)\n        node.next = self.head.next\n        node.prev = self.head\n        self.head.next.prev = node\n        self.head.next = node\n        return node\n\n    def remove(self, node):\n        node.prev.next = node.next\n        node.next.prev = node.prev`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `struct DLLNode {\n  int val;\n  DLLNode *prev, *next;\n  DLLNode(int v):val(v),prev(nullptr),next(nullptr){}\n};\nclass DoublyLinkedList {\n  DLLNode *head, *tail;\npublic:\n  DoublyLinkedList() {\n    head=new DLLNode(0); tail=new DLLNode(0);\n    head->next=tail; tail->prev=head;\n  }\n  DLLNode* addFront(int val) {\n    auto* n=new DLLNode(val);\n    n->next=head->next; n->prev=head;\n    head->next->prev=n; head->next=n;\n    return n;\n  }\n  void remove(DLLNode* n) {\n    n->prev->next=n->next;\n    n->next->prev=n->prev;\n    delete n;\n  }\n};`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "fast-slow-pointers",
        slug: "fast-slow-pointers",
        title: "Fast & Slow Pointers",
        difficulty: "medium",
        description:
          "Floyd's Tortoise and Hare for cycle detection and midpoints.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Fast & Slow Pointers (Floyd's Algorithm)\n\nUse two pointers at different speeds:\n- **Slow** moves 1 step\n- **Fast** moves 2 steps\n\n### Applications\n- **Cycle detection**: Fast meets slow → cycle exists\n- **Find middle**: Fast at end → slow at middle\n- **Find cycle start**: Reset one pointer to head, move both at speed 1`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}\n\nfunction findMiddle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast: return True\n    return False\n\ndef find_middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `bool hasCycle(ListNode* head) {\n  auto *s=head, *f=head;\n  while(f && f->next) {\n    s=s->next; f=f->next->next;\n    if(s==f) return true;\n  }\n  return false;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5, 6, 7, 8] },
      },
    ],
  },

  // ─────────── 5. Stacks & Queues ───────────
  {
    id: "stacks-queues",
    slug: "stacks-queues",
    name: "Stacks & Queues",
    icon: "📚",
    description: "LIFO and FIFO data structures for managing ordered data.",
    color: "bg-orange-500",
    topics: [
      {
        id: "stack-implementation",
        slug: "stack-implementation",
        title: "Stack Implementation",
        difficulty: "easy",
        description: "LIFO data structure — push, pop, peek in O(1).",
        timeComplexity: "O(1) push/pop/peek",
        spaceComplexity: "O(n)",
        content: `## Stack\n\nA **LIFO** (Last In, First Out) data structure.\n\n### Operations\n- **push(x)**: Add to top — O(1)\n- **pop()**: Remove from top — O(1)\n- **peek()**: View top element — O(1)\n\n### Applications\n- Function call stack\n- Expression evaluation\n- Undo operations\n- Backtracking`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class Stack {\n  constructor() { this.items = []; }\n  push(val) { this.items.push(val); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n  size() { return this.items.length; }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, val): self.items.append(val)\n    def pop(self): return self.items.pop()\n    def peek(self): return self.items[-1]\n    def is_empty(self): return len(self.items) == 0`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <stack>\nusing namespace std;\nstack<int> s;\ns.push(1); s.push(2); s.push(3);\ns.top();  // 3\ns.pop();  // removes 3`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "monotonic-stack",
        slug: "monotonic-stack",
        title: "Monotonic Stack",
        difficulty: "medium",
        description:
          "A stack maintaining monotonic order for next-greater-element problems.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        content: `## Monotonic Stack\n\nA stack where elements are always in sorted order. When pushing, pop all elements violating the property.\n\n### Classic Problems\n- Next Greater Element\n- Largest Rectangle in Histogram\n- Trapping Rain Water\n- Daily Temperatures`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function nextGreaterElement(nums) {\n  const result = new Array(nums.length).fill(-1);\n  const stack = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length && nums[stack[stack.length-1]] < nums[i]) {\n      result[stack.pop()] = nums[i];\n    }\n    stack.push(i);\n  }\n  return result;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def next_greater_element(nums):\n    result = [-1] * len(nums)\n    stack = []\n    for i, val in enumerate(nums):\n        while stack and nums[stack[-1]] < val:\n            result[stack.pop()] = val\n        stack.append(i)\n    return result`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `vector<int> nextGreater(vector<int>& nums) {\n  int n=nums.size();\n  vector<int> res(n,-1);\n  stack<int> st;\n  for(int i=0;i<n;i++){\n    while(!st.empty()&&nums[st.top()]<nums[i]){\n      res[st.top()]=nums[i]; st.pop();\n    }\n    st.push(i);\n  }\n  return res;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [4, 2, 7, 5, 3, 8, 1] },
      },
      {
        id: "queue-implementation",
        slug: "queue-implementation",
        title: "Queue & Deque",
        difficulty: "easy",
        description: "FIFO data structure and double-ended queue.",
        timeComplexity: "O(1) enqueue/dequeue",
        spaceComplexity: "O(n)",
        content: `## Queue\n\nA **FIFO** (First In, First Out) data structure.\n\n### Operations\n- **enqueue(x)**: Add to back\n- **dequeue()**: Remove from front\n\n### Deque (Double-Ended Queue)\nSupports insert/remove from both ends in O(1). Used in sliding window maximum.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class Queue {\n  constructor() { this.items = []; this.front = 0; }\n  enqueue(val) { this.items.push(val); }\n  dequeue() { return this.items[this.front++]; }\n  peek() { return this.items[this.front]; }\n  isEmpty() { return this.front >= this.items.length; }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque\n\nq = deque()\nq.append(1)     # enqueue\nq.append(2)\nq.popleft()     # dequeue -> 1\n\n# Deque supports both ends\nq.appendleft(0)\nq.pop()         # remove from right`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <queue>\n#include <deque>\nusing namespace std;\nqueue<int> q;\nq.push(1); q.push(2);\nq.front(); // 1\nq.pop();\n\ndeque<int> dq;\ndq.push_back(1); dq.push_front(0);`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "priority-queue",
        slug: "priority-queue",
        title: "Priority Queue / Heap",
        difficulty: "medium",
        description: "Elements dequeued by priority via a binary heap.",
        timeComplexity: "O(log n) insert/extract",
        spaceComplexity: "O(n)",
        content: `## Priority Queue\n\nElements are served based on priority rather than order of arrival. Typically a **binary heap**.\n\n### Operations\n- **insert(x)**: O(log n)\n- **extractMin/Max()**: O(log n)\n- **peek()**: O(1)\n\n### Applications\n- Dijkstra's algorithm\n- K-th largest element\n- Merge K sorted lists`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class MinHeap {\n  constructor() { this.heap = []; }\n  push(val) {\n    this.heap.push(val);\n    this._bubbleUp(this.heap.length - 1);\n  }\n  pop() {\n    const min = this.heap[0];\n    const last = this.heap.pop();\n    if (this.heap.length) {\n      this.heap[0] = last;\n      this._sinkDown(0);\n    }\n    return min;\n  }\n  _bubbleUp(i) {\n    while (i > 0) {\n      const p = Math.floor((i-1)/2);\n      if (this.heap[p] <= this.heap[i]) break;\n      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];\n      i = p;\n    }\n  }\n  _sinkDown(i) {\n    const n = this.heap.length;\n    while (true) {\n      let sm = i, l = 2*i+1, r = 2*i+2;\n      if (l<n && this.heap[l]<this.heap[sm]) sm=l;\n      if (r<n && this.heap[r]<this.heap[sm]) sm=r;\n      if (sm===i) break;\n      [this.heap[i],this.heap[sm]]=[this.heap[sm],this.heap[i]];\n      i = sm;\n    }\n  }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `import heapq\n\nheap = []\nheapq.heappush(heap, 3)\nheapq.heappush(heap, 1)\nheapq.heappush(heap, 2)\nprint(heapq.heappop(heap))  # 1\n\ndef kth_largest(nums, k):\n    return heapq.nlargest(k, nums)[-1]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <queue>\nusing namespace std;\n// Min-heap\npriority_queue<int, vector<int>, greater<int>> minH;\nminH.push(3); minH.push(1); minH.push(2);\nminH.top(); // 1\nminH.pop();\n\n// Max-heap (default)\npriority_queue<int> maxH;\nmaxH.push(3); maxH.push(1);\nmaxH.top(); // 3`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [3, 1, 4, 1, 5, 9, 2, 6] },
      },
    ],
  },

  // ─────────── 6. Trees ───────────
  {
    id: "trees",
    slug: "trees",
    name: "Trees",
    icon: "🌳",
    description:
      "Hierarchical data structures — traversals, BSTs, balanced trees, and tries.",
    color: "bg-green-500",
    topics: [
      {
        id: "binary-tree-traversal",
        slug: "binary-tree-traversal",
        title: "Binary Tree Traversals",
        difficulty: "easy",
        description:
          "Inorder, Preorder, Postorder, and Level-order traversals.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        content: `## Binary Tree Traversals\n\n### Depth-First (DFS)\n- **In-order** (Left, Root, Right): Gives sorted order for BST\n- **Pre-order** (Root, Left, Right): Tree serialization\n- **Post-order** (Left, Right, Root): Deletion, expression trees\n\n### Breadth-First (BFS)\n- **Level-order**: Visit all nodes at each depth level`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function inorder(root, res = []) {\n  if (!root) return res;\n  inorder(root.left, res);\n  res.push(root.val);\n  inorder(root.right, res);\n  return res;\n}\n\nfunction levelOrder(root) {\n  if (!root) return [];\n  const result = [], queue = [root];\n  while (queue.length) {\n    const level = [], size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def inorder(root):\n    return inorder(root.left) + [root.val] + inorder(root.right) if root else []\n\ndef level_order(root):\n    if not root: return []\n    result, queue = [], [root]\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.pop(0)\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `void inorder(TreeNode* root, vector<int>& res) {\n  if(!root) return;\n  inorder(root->left, res);\n  res.push_back(root->val);\n  inorder(root->right, res);\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [1, 2, 3, 4, 5, 6, 7],
        },
      },
      {
        id: "binary-search-tree",
        slug: "binary-search-tree",
        title: "Binary Search Tree",
        difficulty: "medium",
        description: "A tree where left < parent < right for every node.",
        timeComplexity: "O(h) search/insert/delete",
        spaceComplexity: "O(n)",
        content: `## Binary Search Tree (BST)\n\nA binary tree satisfying: **left < root < right** for every node.\n\n### Operations\n- **Search**: O(h)\n- **Insert**: O(h)\n- **Delete**: O(h) — three cases (leaf, one child, two children)\n- **In-order traversal**: Gives sorted order`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class BSTNode {\n  constructor(val) {\n    this.val = val;\n    this.left = this.right = null;\n  }\n}\nfunction insert(root, val) {\n  if (!root) return new BSTNode(val);\n  if (val < root.val) root.left = insert(root.left, val);\n  else root.right = insert(root.right, val);\n  return root;\n}\nfunction search(root, val) {\n  if (!root || root.val === val) return root;\n  return val < root.val ? search(root.left, val) : search(root.right, val);\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `class BSTNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = self.right = None\n\ndef insert(root, val):\n    if not root: return BSTNode(val)\n    if val < root.val: root.left = insert(root.left, val)\n    else: root.right = insert(root.right, val)\n    return root`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `struct BSTNode {\n  int val;\n  BSTNode *left, *right;\n  BSTNode(int v):val(v),left(nullptr),right(nullptr){}\n};\nBSTNode* insert(BSTNode* root, int val) {\n  if(!root) return new BSTNode(val);\n  if(val<root->val) root->left=insert(root->left,val);\n  else root->right=insert(root->right,val);\n  return root;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [5, 3, 7, 1, 4, 6, 8] },
      },
      {
        id: "trie",
        slug: "trie",
        title: "Trie (Prefix Tree)",
        difficulty: "medium",
        description: "A tree for efficient prefix-based string lookups.",
        timeComplexity: "O(L) per operation",
        spaceComplexity: "O(N × L)",
        content: `## Trie (Prefix Tree)\n\nEach edge represents a character. All descendants share a common prefix.\n\n### Operations\n- **Insert**: O(L)\n- **Search**: O(L)\n- **StartsWith**: O(L)\n\n### Applications\n- Autocomplete\n- Spell checker\n- IP routing`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def search(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children: return False\n            node = node.children[ch]\n        return node.is_end`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `struct TrieNode {\n  TrieNode* ch[26] = {};\n  bool isEnd = false;\n};\nclass Trie {\n  TrieNode* root = new TrieNode();\npublic:\n  void insert(string w) {\n    auto* n = root;\n    for (char c : w) {\n      if (!n->ch[c-'a']) n->ch[c-'a'] = new TrieNode();\n      n = n->ch[c-'a'];\n    }\n    n->isEnd = true;\n  }\n  bool search(string w) {\n    auto* n = root;\n    for (char c : w) {\n      if (!n->ch[c-'a']) return false;\n      n = n->ch[c-'a'];\n    }\n    return n->isEnd;\n  }\n};`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "segment-tree",
        slug: "segment-tree",
        title: "Segment Tree",
        difficulty: "hard",
        description: "Answer range queries and updates in O(log n).",
        timeComplexity: "O(log n) query/update",
        spaceComplexity: "O(n)",
        content: `## Segment Tree\n\nA tree-based data structure for answering range queries (sum, min, max) efficiently while supporting point or range updates.\n\n### Operations\n- **Build**: O(n)\n- **Query [l, r]**: O(log n)\n- **Update index**: O(log n)\n\n### Variants\n- Lazy propagation for range updates\n- Persistent segment tree`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class SegTree {\n  constructor(arr) {\n    this.n = arr.length;\n    this.tree = new Array(4 * this.n).fill(0);\n    this.build(arr, 1, 0, this.n - 1);\n  }\n  build(arr, node, lo, hi) {\n    if (lo === hi) { this.tree[node] = arr[lo]; return; }\n    const mid = Math.floor((lo + hi) / 2);\n    this.build(arr, 2*node, lo, mid);\n    this.build(arr, 2*node+1, mid+1, hi);\n    this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n  }\n  query(node, lo, hi, l, r) {\n    if (r < lo || hi < l) return 0;\n    if (l <= lo && hi <= r) return this.tree[node];\n    const mid = Math.floor((lo + hi) / 2);\n    return this.query(2*node, lo, mid, l, r)\n         + this.query(2*node+1, mid+1, hi, l, r);\n  }\n  rangeSum(l, r) { return this.query(1, 0, this.n-1, l, r); }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `class SegTree:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.tree = [0] * (4 * self.n)\n        self._build(arr, 1, 0, self.n - 1)\n\n    def _build(self, arr, node, lo, hi):\n        if lo == hi:\n            self.tree[node] = arr[lo]; return\n        mid = (lo + hi) // 2\n        self._build(arr, 2*node, lo, mid)\n        self._build(arr, 2*node+1, mid+1, hi)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n    def query(self, node, lo, hi, l, r):\n        if r < lo or hi < l: return 0\n        if l <= lo and hi <= r: return self.tree[node]\n        mid = (lo + hi) // 2\n        return self.query(2*node, lo, mid, l, r) + \\\n               self.query(2*node+1, mid+1, hi, l, r)`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class SegTree {\n  vector<int> tree;\n  int n;\n  void build(vector<int>& a, int nd, int lo, int hi) {\n    if(lo==hi){tree[nd]=a[lo];return;}\n    int mid=(lo+hi)/2;\n    build(a,2*nd,lo,mid); build(a,2*nd+1,mid+1,hi);\n    tree[nd]=tree[2*nd]+tree[2*nd+1];\n  }\npublic:\n  SegTree(vector<int>& a):n(a.size()),tree(4*a.size()){\n    build(a,1,0,n-1);\n  }\n  int query(int nd,int lo,int hi,int l,int r){\n    if(r<lo||hi<l)return 0;\n    if(l<=lo&&hi<=r)return tree[nd];\n    int mid=(lo+hi)/2;\n    return query(2*nd,lo,mid,l,r)+query(2*nd+1,mid+1,hi,l,r);\n  }\n};`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 3, 5, 7, 9, 11] },
      },
    ],
  },

  // ─────────── 7. Graphs ───────────
  {
    id: "graphs",
    slug: "graphs",
    name: "Graphs",
    icon: "🌐",
    description:
      "Graph traversals, shortest paths, and connectivity algorithms.",
    color: "bg-indigo-500",
    topics: [
      {
        id: "bfs-dfs",
        slug: "bfs-dfs",
        title: "BFS & DFS Traversal",
        difficulty: "medium",
        description: "Breadth-first and depth-first search on graphs.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Graph Traversals\n\n### BFS\nExplore all neighbors at current depth before going deeper. Uses a **queue**.\n\n### DFS\nExplore as far as possible along each branch. Uses a **stack** or recursion.\n\n### Applications\n- Shortest path (unweighted) — BFS\n- Cycle detection — DFS\n- Connected components\n- Topological sort`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const nb of graph[node] || []) {\n      if (!visited.has(nb)) {\n        visited.add(nb);\n        queue.push(nb);\n      }\n    }\n  }\n  return order;\n}\n\nfunction dfs(graph, start, visited = new Set()) {\n  visited.add(start);\n  const order = [start];\n  for (const nb of graph[start] || [])\n    if (!visited.has(nb)) order.push(...dfs(graph, nb, visited));\n  return order;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque\n\ndef bfs(graph, start):\n    visited = {start}\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for nb in graph.get(node, []):\n            if nb not in visited:\n                visited.add(nb)\n                queue.append(nb)\n    return order`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `vector<int> bfs(unordered_map<int,vector<int>>& g, int s) {\n  unordered_set<int> vis{s};\n  queue<int> q; q.push(s);\n  vector<int> order;\n  while(!q.empty()) {\n    int n=q.front(); q.pop(); order.push_back(n);\n    for(int nb:g[n]) if(!vis.count(nb)){vis.insert(nb);q.push(nb);}\n  }\n  return order;\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [1, 2, 3, 4, 5, 6, 7],
        },
      },
      {
        id: "dijkstra",
        slug: "dijkstra",
        title: "Dijkstra's Algorithm",
        difficulty: "medium",
        description:
          "Shortest path from source to all vertices (non-negative weights).",
        timeComplexity: "O((V + E) log V)",
        spaceComplexity: "O(V)",
        content: `## Dijkstra's Algorithm\n\nFinds shortest paths from source to all vertices with **non-negative** edge weights.\n\n### Steps\n1. Initialize: source = 0, all others = ∞\n2. Use a **min-heap**\n3. Greedily pick closest unvisited vertex\n4. Relax neighbors`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function dijkstra(graph, src) {\n  const dist = {};\n  for (const n of Object.keys(graph)) dist[n] = Infinity;\n  dist[src] = 0;\n  const pq = [[0, src]];\n  const visited = new Set();\n  while (pq.length) {\n    pq.sort((a,b) => a[0]-b[0]);\n    const [d, u] = pq.shift();\n    if (visited.has(u)) continue;\n    visited.add(u);\n    for (const [v, w] of graph[u] || []) {\n      if (d + w < dist[v]) {\n        dist[v] = d + w;\n        pq.push([dist[v], v]);\n      }\n    }\n  }\n  return dist;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `import heapq\ndef dijkstra(graph, src):\n    dist = {n: float('inf') for n in graph}\n    dist[src] = 0\n    pq = [(0, src)]\n    visited = set()\n    while pq:\n        d, u = heapq.heappop(pq)\n        if u in visited: continue\n        visited.add(u)\n        for v, w in graph[u]:\n            if d + w < dist[v]:\n                dist[v] = d + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `vector<int> dijkstra(vector<vector<pair<int,int>>>& g, int src) {\n  int n=g.size();\n  vector<int> dist(n, INT_MAX); dist[src]=0;\n  priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;\n  pq.push({0,src});\n  while(!pq.empty()) {\n    auto [d,u]=pq.top(); pq.pop();\n    if(d>dist[u]) continue;\n    for(auto [v,w]:g[u])\n      if(d+w<dist[v]){dist[v]=d+w;pq.push({dist[v],v});}\n  }\n  return dist;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [0, 4, 8, 5, 3, 7, 6] },
      },
      {
        id: "topological-sort",
        slug: "topological-sort",
        title: "Topological Sort",
        difficulty: "medium",
        description:
          "Linear ordering of vertices in a DAG respecting edge directions.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Topological Sort\n\nLinear ordering so for every edge u → v, u comes before v. Only for **DAGs**.\n\n### Approaches\n1. **Kahn's (BFS)**: Process nodes with in-degree 0\n2. **DFS-based**: Reverse post-order\n\n### Applications\n- Build systems\n- Course scheduling\n- Task ordering`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function topologicalSort(n, edges) {\n  const inDeg = new Array(n).fill(0);\n  const adj = Array.from({length: n}, () => []);\n  for (const [u, v] of edges) { adj[u].push(v); inDeg[v]++; }\n  const queue = [];\n  for (let i = 0; i < n; i++) if (inDeg[i] === 0) queue.push(i);\n  const order = [];\n  while (queue.length) {\n    const u = queue.shift();\n    order.push(u);\n    for (const v of adj[u]) if (--inDeg[v] === 0) queue.push(v);\n  }\n  return order.length === n ? order : [];\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque\ndef topo_sort(n, edges):\n    in_deg = [0]*n\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v); in_deg[v] += 1\n    q = deque(i for i in range(n) if in_deg[i]==0)\n    order = []\n    while q:\n        u = q.popleft(); order.append(u)\n        for v in adj[u]:\n            in_deg[v] -= 1\n            if in_deg[v]==0: q.append(v)\n    return order if len(order)==n else []`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `vector<int> topoSort(int n, vector<vector<int>>& adj) {\n  vector<int> inDeg(n,0);\n  for(int u=0;u<n;u++) for(int v:adj[u]) inDeg[v]++;\n  queue<int> q;\n  for(int i=0;i<n;i++) if(!inDeg[i]) q.push(i);\n  vector<int> order;\n  while(!q.empty()){\n    int u=q.front();q.pop();order.push_back(u);\n    for(int v:adj[u]) if(--inDeg[v]==0) q.push(v);\n  }\n  return order.size()==(size_t)n?order:vector<int>();\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [0, 1, 2, 3, 4, 5] },
      },
      {
        id: "union-find",
        slug: "union-find",
        title: "Union-Find (Disjoint Set)",
        difficulty: "medium",
        description: "Efficiently group elements and check connectivity.",
        timeComplexity: "O(α(n)) ≈ O(1)",
        spaceComplexity: "O(n)",
        content: `## Union-Find\n\nTracks partition of elements into disjoint sets.\n\n### Operations\n- **find(x)**: Which set? (path compression)\n- **union(x,y)**: Merge sets (union by rank)\n\n### Applications\n- Kruskal's MST\n- Cycle detection\n- Connected components`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class UnionFind {\n  constructor(n) {\n    this.parent = Array.from({length:n},(_,i)=>i);\n    this.rank = new Array(n).fill(0);\n  }\n  find(x) {\n    if (this.parent[x]!==x) this.parent[x]=this.find(this.parent[x]);\n    return this.parent[x];\n  }\n  union(x, y) {\n    const px=this.find(x), py=this.find(y);\n    if (px===py) return false;\n    if (this.rank[px]<this.rank[py]) this.parent[px]=py;\n    else if (this.rank[px]>this.rank[py]) this.parent[py]=px;\n    else { this.parent[py]=px; this.rank[px]++; }\n    return true;\n  }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0]*n\n    def find(self, x):\n        if self.parent[x]!=x:\n            self.parent[x]=self.find(self.parent[x])\n        return self.parent[x]\n    def union(self, x, y):\n        px,py=self.find(x),self.find(y)\n        if px==py: return False\n        if self.rank[px]<self.rank[py]: px,py=py,px\n        self.parent[py]=px\n        if self.rank[px]==self.rank[py]: self.rank[px]+=1\n        return True`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class UnionFind {\n  vector<int> par, rnk;\npublic:\n  UnionFind(int n):par(n),rnk(n,0){\n    iota(par.begin(),par.end(),0);\n  }\n  int find(int x){return par[x]==x?x:par[x]=find(par[x]);}\n  bool unite(int x,int y){\n    int a=find(x),b=find(y);\n    if(a==b)return false;\n    if(rnk[a]<rnk[b])swap(a,b);\n    par[b]=a;\n    if(rnk[a]==rnk[b])rnk[a]++;\n    return true;\n  }\n};`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [0, 1, 2, 3, 4, 5, 6] },
      },
      {
        id: "minimum-spanning-tree",
        slug: "minimum-spanning-tree",
        title: "Minimum Spanning Tree",
        difficulty: "medium",
        description: "Kruskal's and Prim's algorithms for finding MST.",
        timeComplexity: "O(E log E)",
        spaceComplexity: "O(V + E)",
        content: `## Minimum Spanning Tree\n\nA subset of edges connecting all vertices with minimum total weight.\n\n### Kruskal's Algorithm\n1. Sort edges by weight\n2. Add edge if it doesn't create a cycle (Union-Find)\n\n### Prim's Algorithm\n1. Start from any vertex\n2. Greedily add the cheapest edge to a new vertex (min-heap)`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Kruskal's\nfunction kruskal(n, edges) {\n  edges.sort((a,b) => a[2] - b[2]);\n  const uf = new UnionFind(n);\n  let cost = 0, edgeCount = 0;\n  for (const [u, v, w] of edges) {\n    if (uf.union(u, v)) {\n      cost += w;\n      edgeCount++;\n      if (edgeCount === n - 1) break;\n    }\n  }\n  return cost;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def kruskal(n, edges):\n    edges.sort(key=lambda x: x[2])\n    uf = UnionFind(n)\n    cost = count = 0\n    for u, v, w in edges:\n        if uf.union(u, v):\n            cost += w\n            count += 1\n            if count == n - 1: break\n    return cost`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int kruskal(int n, vector<tuple<int,int,int>>& edges) {\n  sort(edges.begin(),edges.end(),[](auto&a,auto&b){\n    return get<2>(a)<get<2>(b);\n  });\n  UnionFind uf(n);\n  int cost=0,cnt=0;\n  for(auto&[u,v,w]:edges)\n    if(uf.unite(u,v)){cost+=w;if(++cnt==n-1)break;}\n  return cost;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [2, 3, 1, 4, 5, 6] },
      },
    ],
  },

  // ─────────── 8. Dynamic Programming ───────────
  {
    id: "dynamic-programming",
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    icon: "🧩",
    description:
      "Break problems into overlapping subproblems with optimal substructure.",
    color: "bg-red-500",
    topics: [
      {
        id: "introduction",
        slug: "introduction",
        title: "DP Introduction (Fibonacci)",
        difficulty: "easy",
        description: "Understanding memoization and tabulation with Fibonacci.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Dynamic Programming Basics\n\nDP solves problems by breaking them into **overlapping subproblems** and storing results.\n\n### Two Approaches\n1. **Top-down (Memoization)**: Recursion + cache\n2. **Bottom-up (Tabulation)**: Iterative table filling`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function fibMemo(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  return memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);\n}\n\nfunction fibTab(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib_memo(n):\n    if n <= 1: return n\n    return fib_memo(n-1) + fib_memo(n-2)\n\ndef fib_tab(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n+1): a, b = b, a + b\n    return b`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int fibTab(int n) {\n  if (n<=1) return n;\n  int a=0,b=1;\n  for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}\n  return b;\n}`,
          },
        ],
        visualizationConfig: {
          type: "array",
          defaultInput: [0, 1, 1, 2, 3, 5, 8, 13],
        },
      },
      {
        id: "knapsack",
        slug: "knapsack",
        title: "0/1 Knapsack",
        difficulty: "medium",
        description: "Maximize value without exceeding weight capacity.",
        timeComplexity: "O(n × W)",
        spaceComplexity: "O(W)",
        content: `## 0/1 Knapsack\n\nGiven items with weights and values, maximize value within capacity W.\n\n### Recurrence\n\`dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])\`\n\n### Variants\n- Unbounded knapsack\n- Subset sum\n- Equal partition`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function knapsack(weights, values, capacity) {\n  const dp = new Array(capacity + 1).fill(0);\n  for (let i = 0; i < weights.length; i++)\n    for (let w = capacity; w >= weights[i]; w--)\n      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n  return dp[capacity];\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def knapsack(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    for w, v in zip(weights, values):\n        for c in range(capacity, w - 1, -1):\n            dp[c] = max(dp[c], dp[c - w] + v)\n    return dp[capacity]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int knapsack(vector<int>& wt, vector<int>& val, int W) {\n  vector<int> dp(W+1,0);\n  for(int i=0;i<(int)wt.size();i++)\n    for(int w=W;w>=wt[i];w--)\n      dp[w]=max(dp[w],dp[w-wt[i]]+val[i]);\n  return dp[W];\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [2, 3, 4, 5] },
      },
      {
        id: "longest-common-subsequence",
        slug: "longest-common-subsequence",
        title: "Longest Common Subsequence",
        difficulty: "medium",
        description: "Find the longest subsequence common to two strings.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n)",
        content: `## Longest Common Subsequence (LCS)\n\n### Recurrence\n- If \`s1[i] == s2[j]\`: \`dp[i][j] = 1 + dp[i-1][j-1]\`\n- Else: \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\``,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function lcs(s1, s2) {\n  const m = s1.length, n = s2.length;\n  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(0));\n  for (let i=1;i<=m;i++)\n    for (let j=1;j<=n;j++)\n      dp[i][j] = s1[i-1]===s2[j-1] ? 1+dp[i-1][j-1] : Math.max(dp[i-1][j],dp[i][j-1]);\n  return dp[m][n];\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1,m+1):\n        for j in range(1,n+1):\n            if s1[i-1]==s2[j-1]: dp[i][j]=1+dp[i-1][j-1]\n            else: dp[i][j]=max(dp[i-1][j],dp[i][j-1])\n    return dp[m][n]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int lcs(string& a, string& b) {\n  int m=a.size(),n=b.size();\n  vector<vector<int>> dp(m+1,vector<int>(n+1,0));\n  for(int i=1;i<=m;i++)\n    for(int j=1;j<=n;j++)\n      dp[i][j]=a[i-1]==b[j-1]?1+dp[i-1][j-1]:max(dp[i-1][j],dp[i][j-1]);\n  return dp[m][n];\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 3, 5, 2, 4] },
      },
      {
        id: "coin-change",
        slug: "coin-change",
        title: "Coin Change",
        difficulty: "medium",
        description: "Find minimum coins needed to make a given amount.",
        timeComplexity: "O(n × amount)",
        spaceComplexity: "O(amount)",
        content: `## Coin Change\n\n\`dp[i] = min(dp[i], dp[i - coin] + 1)\` for each coin.\n\n### Variants\n- Number of ways to make change\n- Combination sum`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function coinChange(coins, amount) {\n  const dp = new Array(amount+1).fill(Infinity);\n  dp[0] = 0;\n  for (const c of coins)\n    for (let i=c;i<=amount;i++)\n      dp[i] = Math.min(dp[i], dp[i-c]+1);\n  return dp[amount]===Infinity ? -1 : dp[amount];\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def coin_change(coins, amount):\n    dp = [float('inf')]*(amount+1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount+1):\n            dp[i] = min(dp[i], dp[i-c]+1)\n    return dp[amount] if dp[amount]!=float('inf') else -1`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int coinChange(vector<int>& coins, int amount) {\n  vector<int> dp(amount+1,INT_MAX);\n  dp[0]=0;\n  for(int c:coins)\n    for(int i=c;i<=amount;i++)\n      if(dp[i-c]!=INT_MAX) dp[i]=min(dp[i],dp[i-c]+1);\n  return dp[amount]==INT_MAX?-1:dp[amount];\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 5, 10, 25] },
      },
      {
        id: "longest-increasing-subsequence",
        slug: "longest-increasing-subsequence",
        title: "Longest Increasing Subsequence",
        difficulty: "medium",
        description:
          "Find the longest strictly increasing subsequence in O(n log n).",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        content: `## LIS\n\nMaintain an array of smallest tail elements for subsequences of each length. Binary search for insertion point.\n\n### O(n log n) via Patience Sorting`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function lengthOfLIS(nums) {\n  const tails = [];\n  for (const num of nums) {\n    let lo=0,hi=tails.length;\n    while (lo<hi) {\n      const mid=Math.floor((lo+hi)/2);\n      if (tails[mid]<num) lo=mid+1; else hi=mid;\n    }\n    tails[lo] = num;\n  }\n  return tails.length;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `from bisect import bisect_left\ndef length_of_lis(nums):\n    tails = []\n    for n in nums:\n        pos = bisect_left(tails, n)\n        if pos==len(tails): tails.append(n)\n        else: tails[pos] = n\n    return len(tails)`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int lengthOfLIS(vector<int>& nums) {\n  vector<int> tails;\n  for(int n:nums){\n    auto it=lower_bound(tails.begin(),tails.end(),n);\n    if(it==tails.end()) tails.push_back(n);\n    else *it=n;\n  }\n  return tails.size();\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [10, 9, 2, 5, 3, 7, 101, 18] },
      },
    ],
  },

  // ─────────── 9. Hashing ───────────
  {
    id: "hashing",
    slug: "hashing",
    name: "Hashing",
    icon: "#️⃣",
    description:
      "O(1) lookups via hash tables, frequency counting, and set operations.",
    color: "bg-teal-500",
    topics: [
      {
        id: "hash-map",
        slug: "hash-map",
        title: "Hash Map Fundamentals",
        difficulty: "easy",
        description: "O(1) average-case lookups using hash functions.",
        timeComplexity: "O(1) avg",
        spaceComplexity: "O(n)",
        content: `## Hash Map\n\nKey-value store with O(1) average access.\n\n### Collision Resolution\n1. **Chaining**: Linked list per bucket\n2. **Open Addressing**: Linear/quadratic probing\n\n### Patterns\n- Two Sum\n- Frequency counting\n- Group anagrams`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [-1, -1];\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        comp = target - n\n        if comp in seen: return [seen[comp], i]\n        seen[n] = i\n    return [-1, -1]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `vector<int> twoSum(vector<int>& nums, int target) {\n  unordered_map<int,int> mp;\n  for(int i=0;i<(int)nums.size();i++){\n    int c=target-nums[i];\n    if(mp.count(c)) return {mp[c],i};\n    mp[nums[i]]=i;\n  }\n  return {-1,-1};\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [2, 7, 11, 15] },
      },
      {
        id: "hash-set",
        slug: "hash-set",
        title: "Hash Set Applications",
        difficulty: "easy",
        description: "O(1) membership testing and duplicate detection.",
        timeComplexity: "O(1) avg",
        spaceComplexity: "O(n)",
        content: `## Hash Set\n\nStore unique elements with O(1) add/remove/contains.\n\n### Problems\n- Contains Duplicate\n- Longest Consecutive Sequence\n- Intersection of Two Arrays`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let longest = 0;\n  for (const n of set) {\n    if (!set.has(n-1)) {\n      let len = 1;\n      while (set.has(n+len)) len++;\n      longest = Math.max(longest, len);\n    }\n  }\n  return longest;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def longest_consecutive(nums):\n    s = set(nums)\n    best = 0\n    for n in s:\n        if n-1 not in s:\n            l = 1\n            while n+l in s: l += 1\n            best = max(best, l)\n    return best`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int longestConsecutive(vector<int>& nums) {\n  unordered_set<int> s(nums.begin(),nums.end());\n  int best=0;\n  for(int n:s){\n    if(!s.count(n-1)){\n      int l=1;\n      while(s.count(n+l)) l++;\n      best=max(best,l);\n    }\n  }\n  return best;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [100, 4, 200, 1, 3, 2] },
      },
    ],
  },

  // ─────────── 10. Greedy Algorithms ───────────
  {
    id: "greedy",
    slug: "greedy",
    name: "Greedy Algorithms",
    icon: "💰",
    description:
      "Make the locally optimal choice at each step for a global optimum.",
    color: "bg-amber-500",
    topics: [
      {
        id: "activity-selection",
        slug: "activity-selection",
        title: "Activity Selection / Intervals",
        difficulty: "medium",
        description: "Select maximum non-overlapping intervals.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        content: `## Activity Selection\n\nSort by end time. Pick the earliest-ending non-conflicting interval.\n\n### Related\n- Merge Intervals\n- Meeting Rooms\n- Non-overlapping Intervals`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function maxActivities(intervals) {\n  intervals.sort((a,b) => a[1] - b[1]);\n  let count = 1, end = intervals[0][1];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] >= end) {\n      count++;\n      end = intervals[i][1];\n    }\n  }\n  return count;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def max_activities(intervals):\n    intervals.sort(key=lambda x: x[1])\n    count, end = 1, intervals[0][1]\n    for s, f in intervals[1:]:\n        if s >= end:\n            count += 1; end = f\n    return count`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int maxActivities(vector<vector<int>>& iv) {\n  sort(iv.begin(),iv.end(),[](auto&a,auto&b){return a[1]<b[1];});\n  int cnt=1,end=iv[0][1];\n  for(int i=1;i<(int)iv.size();i++)\n    if(iv[i][0]>=end){cnt++;end=iv[i][1];}\n  return cnt;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 3, 2, 5, 4, 7] },
      },
      {
        id: "huffman-coding",
        slug: "huffman-coding",
        title: "Huffman Coding",
        difficulty: "hard",
        description:
          "Build an optimal prefix-free binary code for data compression.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        content: `## Huffman Coding\n\nGreedy algorithm for lossless compression. Higher-frequency characters get shorter codes.\n\n### Steps\n1. Create leaf nodes with frequencies\n2. min-heap: extract two smallest, combine\n3. Repeat until one root node\n4. Traverse tree: left=0, right=1`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function huffmanCodes(chars, freqs) {\n  const nodes = chars.map((ch,i) => ({ch, freq:freqs[i], left:null, right:null}));\n  while (nodes.length > 1) {\n    nodes.sort((a,b) => a.freq-b.freq);\n    const l=nodes.shift(), r=nodes.shift();\n    nodes.push({ch:null,freq:l.freq+r.freq,left:l,right:r});\n  }\n  const codes = {};\n  function walk(node, code) {\n    if (!node) return;\n    if (node.ch) { codes[node.ch]=code||'0'; return; }\n    walk(node.left, code+'0');\n    walk(node.right, code+'1');\n  }\n  walk(nodes[0], '');\n  return codes;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `import heapq\ndef huffman_codes(chars, freqs):\n    heap = [[f,[c,'']] for c,f in zip(chars,freqs)]\n    heapq.heapify(heap)\n    while len(heap)>1:\n        lo=heapq.heappop(heap)\n        hi=heapq.heappop(heap)\n        for p in lo[1:]: p[1]='0'+p[1]\n        for p in hi[1:]: p[1]='1'+p[1]\n        heapq.heappush(heap,[lo[0]+hi[0]]+lo[1:]+hi[1:])\n    return {c:code for c,code in heap[0][1:]}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `// Simplified Huffman\nstruct HNode {\n  char ch; int freq;\n  HNode *left,*right;\n};\nstruct Cmp { bool operator()(HNode*a,HNode*b){return a->freq>b->freq;} };\nHNode* buildHuffman(string chars,vector<int>& f){\n  priority_queue<HNode*,vector<HNode*>,Cmp> pq;\n  for(int i=0;i<(int)chars.size();i++)\n    pq.push(new HNode{chars[i],f[i],nullptr,nullptr});\n  while(pq.size()>1){\n    auto*l=pq.top();pq.pop();\n    auto*r=pq.top();pq.pop();\n    pq.push(new HNode{'\\0',l->freq+r->freq,l,r});\n  }\n  return pq.top();\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [5, 9, 12, 13, 16, 45] },
      },
    ],
  },

  // ─────────── 11. Backtracking ───────────
  {
    id: "backtracking",
    slug: "backtracking",
    name: "Backtracking",
    icon: "🔙",
    description:
      "Explore all potential solutions by building candidates incrementally.",
    color: "bg-pink-500",
    topics: [
      {
        id: "permutations-combinations",
        slug: "permutations-combinations",
        title: "Permutations & Combinations",
        difficulty: "medium",
        description: "Generate all permutations and combinations of a set.",
        timeComplexity: "O(n!) / O(2^n)",
        spaceComplexity: "O(n)",
        content: `## Permutations & Combinations\n\n### Template\n\`\`\`\nbacktrack(candidate):\n    if is_solution: add to results\n    for each choice:\n        make choice\n        backtrack(candidate + choice)\n        undo choice\n\`\`\``,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function permute(nums) {\n  const result = [];\n  function bt(path, remaining) {\n    if (!remaining.length) { result.push([...path]); return; }\n    for (let i = 0; i < remaining.length; i++) {\n      path.push(remaining[i]);\n      bt(path, [...remaining.slice(0,i),...remaining.slice(i+1)]);\n      path.pop();\n    }\n  }\n  bt([], nums);\n  return result;\n}\n\nfunction combine(n, k) {\n  const res = [];\n  function bt(start, combo) {\n    if (combo.length===k) { res.push([...combo]); return; }\n    for (let i=start;i<=n;i++) {\n      combo.push(i); bt(i+1, combo); combo.pop();\n    }\n  }\n  bt(1, []);\n  return res;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def permute(nums):\n    result = []\n    def bt(path, remaining):\n        if not remaining:\n            result.append(path[:]); return\n        for i in range(len(remaining)):\n            path.append(remaining[i])\n            bt(path, remaining[:i]+remaining[i+1:])\n            path.pop()\n    bt([], nums)\n    return result`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `void bt(vector<int>& nums,vector<int>& path,\n  vector<bool>& used,vector<vector<int>>& res){\n  if(path.size()==nums.size()){res.push_back(path);return;}\n  for(int i=0;i<(int)nums.size();i++){\n    if(used[i]) continue;\n    used[i]=true; path.push_back(nums[i]);\n    bt(nums,path,used,res);\n    path.pop_back(); used[i]=false;\n  }\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3] },
      },
      {
        id: "n-queens",
        slug: "n-queens",
        title: "N-Queens Problem",
        difficulty: "hard",
        description:
          "Place N queens on an N×N board so none attack each other.",
        timeComplexity: "O(n!)",
        spaceComplexity: "O(n²)",
        content: `## N-Queens\n\nPlace N queens on an N×N chessboard such that no two queens share a row, column, or diagonal.\n\n### Approach\n- Place queens row by row\n- Track occupied columns and diagonals\n- Backtrack on conflicts`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function solveNQueens(n) {\n  const res = [];\n  const board = Array.from({length:n},()=>'.'.repeat(n).split(''));\n  const cols=new Set(), d1=new Set(), d2=new Set();\n  function bt(row) {\n    if (row===n) { res.push(board.map(r=>r.join(''))); return; }\n    for (let c=0;c<n;c++) {\n      if (cols.has(c)||d1.has(row-c)||d2.has(row+c)) continue;\n      board[row][c]='Q';\n      cols.add(c); d1.add(row-c); d2.add(row+c);\n      bt(row+1);\n      board[row][c]='.';\n      cols.delete(c); d1.delete(row-c); d2.delete(row+c);\n    }\n  }\n  bt(0);\n  return res;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def solve_n_queens(n):\n    res = []\n    cols, d1, d2 = set(), set(), set()\n    board = [['.']*n for _ in range(n)]\n    def bt(row):\n        if row==n:\n            res.append([''.join(r) for r in board]); return\n        for c in range(n):\n            if c in cols or row-c in d1 or row+c in d2: continue\n            board[row][c]='Q'\n            cols.add(c); d1.add(row-c); d2.add(row+c)\n            bt(row+1)\n            board[row][c]='.'\n            cols.remove(c); d1.remove(row-c); d2.remove(row+c)\n    bt(0)\n    return res`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class NQueens {\n  vector<vector<string>> res;\n  void bt(int n,int row,vector<string>& b,\n    unordered_set<int>&c,unordered_set<int>&d1,unordered_set<int>&d2){\n    if(row==n){res.push_back(b);return;}\n    for(int col=0;col<n;col++){\n      if(c.count(col)||d1.count(row-col)||d2.count(row+col)) continue;\n      b[row][col]='Q';\n      c.insert(col);d1.insert(row-col);d2.insert(row+col);\n      bt(n,row+1,b,c,d1,d2);\n      b[row][col]='.';\n      c.erase(col);d1.erase(row-col);d2.erase(row+col);\n    }\n  }\npublic:\n  vector<vector<string>> solve(int n){\n    vector<string> b(n,string(n,'.'));\n    unordered_set<int>c,d1,d2;\n    bt(n,0,b,c,d1,d2);\n    return res;\n  }\n};`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 3, 0, 2] },
      },
      {
        id: "sudoku-solver",
        slug: "sudoku-solver",
        title: "Sudoku Solver",
        difficulty: "hard",
        description:
          "Fill a 9×9 grid satisfying row, column, and box constraints.",
        timeComplexity: "O(9^m) where m = empty cells",
        spaceComplexity: "O(m)",
        content: `## Sudoku Solver\n\nFill each empty cell with digits 1-9 such that every row, column, and 3×3 box contains all digits 1-9.\n\n### Approach\n- Find first empty cell\n- Try digits 1-9\n- Check row, column, and box constraints\n- Backtrack on failure`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function solveSudoku(board) {\n  function isValid(r, c, num) {\n    for (let i = 0; i < 9; i++) {\n      if (board[r][i] === num) return false;\n      if (board[i][c] === num) return false;\n      const br = 3*Math.floor(r/3)+Math.floor(i/3);\n      const bc = 3*Math.floor(c/3)+(i%3);\n      if (board[br][bc] === num) return false;\n    }\n    return true;\n  }\n  function solve() {\n    for (let r = 0; r < 9; r++) {\n      for (let c = 0; c < 9; c++) {\n        if (board[r][c] === '.') {\n          for (let n = 1; n <= 9; n++) {\n            const ch = String(n);\n            if (isValid(r, c, ch)) {\n              board[r][c] = ch;\n              if (solve()) return true;\n              board[r][c] = '.';\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  solve();\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def solve_sudoku(board):\n    def is_valid(r, c, num):\n        for i in range(9):\n            if board[r][i]==num: return False\n            if board[i][c]==num: return False\n            br, bc = 3*(r//3)+i//3, 3*(c//3)+i%3\n            if board[br][bc]==num: return False\n        return True\n    def solve():\n        for r in range(9):\n            for c in range(9):\n                if board[r][c]=='.':\n                    for n in '123456789':\n                        if is_valid(r,c,n):\n                            board[r][c]=n\n                            if solve(): return True\n                            board[r][c]='.'\n                    return False\n        return True\n    solve()`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class SudokuSolver {\n  bool isValid(vector<vector<char>>& b,int r,int c,char n){\n    for(int i=0;i<9;i++){\n      if(b[r][i]==n) return false;\n      if(b[i][c]==n) return false;\n      if(b[3*(r/3)+i/3][3*(c/3)+i%3]==n) return false;\n    }\n    return true;\n  }\npublic:\n  bool solve(vector<vector<char>>& b){\n    for(int r=0;r<9;r++) for(int c=0;c<9;c++){\n      if(b[r][c]=='.') {\n        for(char n='1';n<='9';n++){\n          if(isValid(b,r,c,n)){\n            b[r][c]=n;\n            if(solve(b)) return true;\n            b[r][c]='.';\n          }\n        }\n        return false;\n      }\n    }\n    return true;\n  }\n};`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [5, 3, 4, 6, 7, 8, 9, 1, 2] },
      },
    ],
  },

  // ─────────── 12. Bit Manipulation ───────────
  {
    id: "bit-manipulation",
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    icon: "🔢",
    description: "Leverage binary representation for efficient operations.",
    color: "bg-gray-500",
    topics: [
      {
        id: "bit-basics",
        slug: "bit-basics",
        title: "Bit Operations & Tricks",
        difficulty: "easy",
        description: "AND, OR, XOR, shifts, and common bit tricks.",
        timeComplexity: "O(1) per operation",
        spaceComplexity: "O(1)",
        content: `## Bit Manipulation\n\n### Operations\n- \`n & 1\` — check odd\n- \`n >> 1\` — divide by 2\n- \`n << 1\` — multiply by 2\n- \`n & (n-1)\` — clear lowest set bit\n- \`n ^ n = 0\`, \`n ^ 0 = n\`\n\n### Classic Problems\n- Single Number (XOR all)\n- Count set bits (Brian Kernighan)\n- Power of Two`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function singleNumber(nums) {\n  return nums.reduce((a,b) => a^b, 0);\n}\n\nfunction countBits(n) {\n  let count = 0;\n  while (n) { n &= (n-1); count++; }\n  return count;\n}\n\nfunction isPowerOfTwo(n) {\n  return n > 0 && (n & (n-1)) === 0;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def single_number(nums):\n    result = 0\n    for n in nums: result ^= n\n    return result\n\ndef count_bits(n):\n    count = 0\n    while n:\n        n &= n-1; count += 1\n    return count\n\ndef is_power_of_two(n):\n    return n > 0 and (n & (n-1)) == 0`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int singleNumber(vector<int>& nums) {\n  int res=0;\n  for(int n:nums) res^=n;\n  return res;\n}\nint countBits(int n){\n  int cnt=0;\n  while(n){n&=n-1;cnt++;}\n  return cnt;\n}\nbool isPowerOfTwo(int n){\n  return n>0&&(n&(n-1))==0;\n}`,
          },
        ],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
    ],
  },
];

export function getDSACategoryBySlug(slug: string): DSACategory | undefined {
  return dsaCategories.find((c) => c.slug === slug);
}

export function getDSATopic(categorySlug: string, topicSlug: string) {
  const category = getDSACategoryBySlug(categorySlug);
  if (!category) return undefined;
  return category.topics.find((t) => t.slug === topicSlug);
}
