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
        content: `## Singly Linked List\n\nA **singly linked list** is a chain of nodes. Each node stores a \`value\` and a \`next\` pointer; the last node's \`next\` is \`null\`. Unlike an array, nodes are scattered in memory and linked together by pointers — so there's no random access, but inserts and deletes at the head are \`O(1)\`.\n\n### When to reach for it\n- You need **fast insert/delete at the front** (dynamic stacks, LRU fronts).\n- The size changes a lot and you don't need indexed access.\n- You want to build other structures — queues, adjacency lists, hash-table buckets.\n\n### Core operations\n| Operation | Complexity | Why |\n|-----------|------------|-----|\n| Insert at head | **O(1)** | just splice a new node in front and move \`head\` |\n| Insert at tail | O(n) or O(1) with a tail pointer | walk to the end |\n| Delete head | **O(1)** | \`head = head.next\` |\n| Search by value | O(n) | must traverse |\n| Access by index | O(n) | no random access |\n\n### Visual walkthrough\nThe animation builds the list, traverses it with a \`curr\` pointer, inserts a new head, then deletes it — showing how pointers (not values) change on every operation.\n\n### Common pitfalls\n- Updating \`head\` **after** you splice in the new node, not before.\n- Forgetting to null out the removed node's \`next\` (memory leak in languages without GC).\n- Off-by-one while searching — always check \`curr\` before dereferencing \`curr.next\`.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Node definition\nclass ListNode {\n  constructor(val, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nclass SinglyLinkedList {\n  constructor() { this.head = null; this.size = 0; }\n\n  // O(1) — splice at the front\n  prepend(val) {\n    this.head = new ListNode(val, this.head);\n    this.size++;\n    return this;\n  }\n\n  // O(n) — walk to the tail\n  append(val) {\n    if (!this.head) return this.prepend(val);\n    let curr = this.head;\n    while (curr.next) curr = curr.next;\n    curr.next = new ListNode(val);\n    this.size++;\n    return this;\n  }\n\n  // O(n) — first matching value\n  find(val) {\n    for (let curr = this.head; curr; curr = curr.next) {\n      if (curr.val === val) return curr;\n    }\n    return null;\n  }\n\n  // O(n) — remove first node with the given value\n  remove(val) {\n    if (!this.head) return false;\n    if (this.head.val === val) {\n      this.head = this.head.next;\n      this.size--;\n      return true;\n    }\n    let prev = this.head;\n    while (prev.next && prev.next.val !== val) prev = prev.next;\n    if (!prev.next) return false;\n    prev.next = prev.next.next;\n    this.size--;\n    return true;\n  }\n\n  // O(n) — produce a readable "1 -> 2 -> 3 -> null" string\n  toString() {\n    const parts = [];\n    for (let c = this.head; c; c = c.next) parts.push(c.val);\n    parts.push("null");\n    return parts.join(" -> ");\n  }\n}\n\n// Demo\nconst list = new SinglyLinkedList();\nlist.append(1).append(2).append(3);\nconsole.log(list.toString());   // 1 -> 2 -> 3 -> null\nlist.prepend(0);\nconsole.log(list.toString());   // 0 -> 1 -> 2 -> 3 -> null\nlist.remove(2);\nconsole.log(list.toString());   // 0 -> 1 -> 3 -> null\nconsole.log(list.find(3)?.val); // 3`,
          },
          {
            language: "python",
            label: "Python",
            code: `class ListNode:\n    def __init__(self, val=0, nxt=None):\n        self.val = val\n        self.next = nxt\n\nclass SinglyLinkedList:\n    def __init__(self):\n        self.head = None\n        self.size = 0\n\n    def prepend(self, val):                       # O(1)\n        self.head = ListNode(val, self.head)\n        self.size += 1\n        return self\n\n    def append(self, val):                        # O(n)\n        if self.head is None:\n            return self.prepend(val)\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = ListNode(val)\n        self.size += 1\n        return self\n\n    def find(self, val):                          # O(n)\n        curr = self.head\n        while curr:\n            if curr.val == val:\n                return curr\n            curr = curr.next\n        return None\n\n    def remove(self, val):                        # O(n)\n        if not self.head:\n            return False\n        if self.head.val == val:\n            self.head = self.head.next\n            self.size -= 1\n            return True\n        prev = self.head\n        while prev.next and prev.next.val != val:\n            prev = prev.next\n        if prev.next is None:\n            return False\n        prev.next = prev.next.next\n        self.size -= 1\n        return True\n\n    def __str__(self):\n        parts, c = [], self.head\n        while c:\n            parts.append(str(c.val))\n            c = c.next\n        parts.append("null")\n        return " -> ".join(parts)\n\n# Demo\nlst = SinglyLinkedList()\nlst.append(1).append(2).append(3)\nprint(lst)                    # 1 -> 2 -> 3 -> null\nlst.prepend(0)\nprint(lst)                    # 0 -> 1 -> 2 -> 3 -> null\nlst.remove(2)\nprint(lst)                    # 0 -> 1 -> 3 -> null\nprint(lst.find(3).val)        # 3`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}\n};\n\nclass SinglyLinkedList {\n    ListNode* head = nullptr;\n    int size = 0;\npublic:\n    ~SinglyLinkedList() {\n        while (head) { auto* n = head->next; delete head; head = n; }\n    }\n    void prepend(int v) { head = new ListNode(v, head); ++size; }\n    void append(int v) {\n        if (!head) { prepend(v); return; }\n        auto* c = head;\n        while (c->next) c = c->next;\n        c->next = new ListNode(v);\n        ++size;\n    }\n    bool remove(int v) {\n        if (!head) return false;\n        if (head->val == v) {\n            auto* old = head; head = head->next; delete old; --size; return true;\n        }\n        auto* p = head;\n        while (p->next && p->next->val != v) p = p->next;\n        if (!p->next) return false;\n        auto* old = p->next; p->next = old->next; delete old; --size;\n        return true;\n    }\n    string to_string() const {\n        string s;\n        for (auto* c = head; c; c = c->next) s += std::to_string(c->val) + " -> ";\n        return s + "null";\n    }\n};\n\nint main() {\n    SinglyLinkedList l;\n    l.append(1); l.append(2); l.append(3);\n    cout << l.to_string() << "\\n";   // 1 -> 2 -> 3 -> null\n    l.prepend(0);\n    cout << l.to_string() << "\\n";   // 0 -> 1 -> 2 -> 3 -> null\n    l.remove(2);\n    cout << l.to_string() << "\\n";   // 0 -> 1 -> 3 -> null\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class SinglyLinkedList {\n    static class ListNode {\n        int val; ListNode next;\n        ListNode(int v, ListNode n) { this.val = v; this.next = n; }\n    }\n\n    private ListNode head;\n    private int size;\n\n    public void prepend(int v) {        // O(1)\n        head = new ListNode(v, head);\n        size++;\n    }\n\n    public void append(int v) {         // O(n)\n        if (head == null) { prepend(v); return; }\n        ListNode c = head;\n        while (c.next != null) c = c.next;\n        c.next = new ListNode(v, null);\n        size++;\n    }\n\n    public boolean remove(int v) {      // O(n)\n        if (head == null) return false;\n        if (head.val == v) { head = head.next; size--; return true; }\n        ListNode p = head;\n        while (p.next != null && p.next.val != v) p = p.next;\n        if (p.next == null) return false;\n        p.next = p.next.next; size--;\n        return true;\n    }\n\n    @Override public String toString() {\n        StringBuilder sb = new StringBuilder();\n        for (ListNode c = head; c != null; c = c.next) sb.append(c.val).append(" -> ");\n        return sb.append("null").toString();\n    }\n\n    public static void main(String[] args) {\n        SinglyLinkedList l = new SinglyLinkedList();\n        l.append(1); l.append(2); l.append(3);\n        System.out.println(l);    // 1 -> 2 -> 3 -> null\n        l.prepend(0);\n        System.out.println(l);    // 0 -> 1 -> 2 -> 3 -> null\n        l.remove(2);\n        System.out.println(l);    // 0 -> 1 -> 3 -> null\n    }\n}`,
          },
        ],
        visualizationConfig: { type: "linked-list", defaultInput: [1, 2, 3, 4] },
      },
      {
        id: "doubly-linked-list",
        slug: "doubly-linked-list",
        title: "Doubly Linked List",
        difficulty: "medium",
        description: "Nodes with pointers to both next and previous elements.",
        timeComplexity: "O(1) insert/delete at known node",
        spaceComplexity: "O(n)",
        content: `## Doubly Linked List\n\nA **doubly linked list** stores an extra \`prev\` pointer in every node, so you can walk in both directions. That extra pointer gives you **O(1) deletion** once you have a reference to the node — which is exactly why the LRU cache, browser history, and many kernel data structures use it.\n\n### Anatomy\n\`\`\`\nnull <- [1] <-> [2] <-> [3] <-> [4] -> null\n\`\`\`\nMost implementations keep **sentinel head and tail nodes** so edge cases (empty list, inserting at either end) collapse into the general case — you always have neighbours on both sides.\n\n### When it pays off vs singly linked\n- You need to splice a known node out in O(1) (LRU).\n- You traverse backwards.\n- You want O(1) access to both ends — a **deque**.\n\n### When it doesn't\n- Memory is tight — every node costs an extra pointer.\n- You only insert/delete at the head.\n\n### Pitfalls\n- Forgetting one of the **four** pointer updates on splice — the list silently corrupts.\n- Not maintaining the sentinel invariants after custom \`moveToFront\` / \`moveToBack\`.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class Node {\n  constructor(val) {\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass DoublyLinkedList {\n  constructor() {\n    this.head = new Node(null); // sentinel\n    this.tail = new Node(null); // sentinel\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n    this.size = 0;\n  }\n\n  // O(1) — splice between prev-node and its current successor\n  _insertBetween(node, prev, next) {\n    node.prev = prev;\n    node.next = next;\n    prev.next = node;\n    next.prev = node;\n  }\n\n  pushFront(val) { const n = new Node(val); this._insertBetween(n, this.head, this.head.next); this.size++; return n; }\n  pushBack(val)  { const n = new Node(val); this._insertBetween(n, this.tail.prev, this.tail); this.size++; return n; }\n\n  // O(1) — unlink a node given a direct reference (this is the magic)\n  remove(node) {\n    if (!node || node === this.head || node === this.tail) return;\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n    node.prev = node.next = null;\n    this.size--;\n  }\n\n  // O(1) — classic LRU primitive\n  moveToFront(node) {\n    this.remove(node);\n    this._insertBetween(node, this.head, this.head.next);\n    this.size++;\n  }\n\n  toString() {\n    const parts = [];\n    for (let c = this.head.next; c !== this.tail; c = c.next) parts.push(c.val);\n    return \`null <-> \${parts.join(" <-> ")} <-> null\`;\n  }\n}\n\n// Demo\nconst dll = new DoublyLinkedList();\nconst a = dll.pushBack(1);\nconst b = dll.pushBack(2);\ndll.pushBack(3);\nconsole.log(dll.toString());        // null <-> 1 <-> 2 <-> 3 <-> null\ndll.moveToFront(b);\nconsole.log(dll.toString());        // null <-> 2 <-> 1 <-> 3 <-> null\ndll.remove(a);\nconsole.log(dll.toString());        // null <-> 2 <-> 3 <-> null`,
          },
          {
            language: "python",
            label: "Python",
            code: `class Node:\n    __slots__ = ("val", "prev", "next")\n    def __init__(self, val=None):\n        self.val = val\n        self.prev = None\n        self.next = None\n\nclass DoublyLinkedList:\n    def __init__(self):\n        self.head = Node()   # sentinel\n        self.tail = Node()   # sentinel\n        self.head.next = self.tail\n        self.tail.prev = self.head\n        self.size = 0\n\n    def _splice(self, node, prev, nxt):\n        node.prev, node.next = prev, nxt\n        prev.next = node\n        nxt.prev = node\n\n    def push_front(self, val):\n        n = Node(val); self._splice(n, self.head, self.head.next); self.size += 1; return n\n    def push_back(self, val):\n        n = Node(val); self._splice(n, self.tail.prev, self.tail); self.size += 1; return n\n\n    def remove(self, node):       # O(1)\n        if node is None or node is self.head or node is self.tail:\n            return\n        node.prev.next = node.next\n        node.next.prev = node.prev\n        node.prev = node.next = None\n        self.size -= 1\n\n    def move_to_front(self, node):\n        self.remove(node)\n        self._splice(node, self.head, self.head.next)\n        self.size += 1\n\n    def __str__(self):\n        vals = []\n        c = self.head.next\n        while c is not self.tail:\n            vals.append(str(c.val)); c = c.next\n        return "null <-> " + " <-> ".join(vals) + " <-> null"\n\n# Demo\ndll = DoublyLinkedList()\na = dll.push_back(1); b = dll.push_back(2); dll.push_back(3)\nprint(dll)             # null <-> 1 <-> 2 <-> 3 <-> null\ndll.move_to_front(b)\nprint(dll)             # null <-> 2 <-> 1 <-> 3 <-> null\ndll.remove(a)\nprint(dll)             # null <-> 2 <-> 3 <-> null`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node *prev = nullptr, *next = nullptr;\n    Node(int v = 0) : val(v) {}\n};\n\nclass DoublyLinkedList {\n    Node head{0}, tail{0};\n    int _size = 0;\n    void splice(Node* n, Node* p, Node* nx) {\n        n->prev = p; n->next = nx;\n        p->next = n; nx->prev = n;\n    }\npublic:\n    DoublyLinkedList() { head.next = &tail; tail.prev = &head; }\n    ~DoublyLinkedList() {\n        Node* c = head.next;\n        while (c != &tail) { Node* n = c->next; delete c; c = n; }\n    }\n    Node* pushBack(int v) {\n        Node* n = new Node(v);\n        splice(n, tail.prev, &tail);\n        ++_size; return n;\n    }\n    void remove(Node* n) {\n        if (!n || n == &head || n == &tail) return;\n        n->prev->next = n->next;\n        n->next->prev = n->prev;\n        delete n; --_size;\n    }\n    string str() const {\n        string s = "null";\n        for (auto* c = head.next; c != &tail; c = c->next)\n            s += " <-> " + std::to_string(c->val);\n        return s + " <-> null";\n    }\n};\n\nint main() {\n    DoublyLinkedList dll;\n    dll.pushBack(1); auto* b = dll.pushBack(2); dll.pushBack(3);\n    cout << dll.str() << "\\n";   // null <-> 1 <-> 2 <-> 3 <-> null\n    dll.remove(b);\n    cout << dll.str() << "\\n";   // null <-> 1 <-> 3 <-> null\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class DoublyLinkedList {\n    static class Node {\n        int val; Node prev, next;\n        Node(int v) { this.val = v; }\n    }\n    private final Node head = new Node(0), tail = new Node(0);\n    private int size = 0;\n\n    public DoublyLinkedList() { head.next = tail; tail.prev = head; }\n\n    private void splice(Node n, Node p, Node nx) {\n        n.prev = p; n.next = nx; p.next = n; nx.prev = n;\n    }\n    public Node pushBack(int v) {\n        Node n = new Node(v); splice(n, tail.prev, tail); size++; return n;\n    }\n    public void remove(Node n) {\n        if (n == null || n == head || n == tail) return;\n        n.prev.next = n.next; n.next.prev = n.prev;\n        size--;\n    }\n    @Override public String toString() {\n        StringBuilder sb = new StringBuilder("null");\n        for (Node c = head.next; c != tail; c = c.next) sb.append(" <-> ").append(c.val);\n        return sb.append(" <-> null").toString();\n    }\n    public static void main(String[] a) {\n        DoublyLinkedList dll = new DoublyLinkedList();\n        dll.pushBack(1); Node b = dll.pushBack(2); dll.pushBack(3);\n        System.out.println(dll); // null <-> 1 <-> 2 <-> 3 <-> null\n        dll.remove(b);\n        System.out.println(dll); // null <-> 1 <-> 3 <-> null\n    }\n}`,
          },
        ],
        visualizationConfig: { type: "linked-list", defaultInput: [1, 2, 3, 4] },
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
        content: `## Fast & Slow Pointers (Floyd's Algorithm)\n\nRun two pointers down the list at different speeds:\n- \`slow\` moves **1 step** per iteration.\n- \`fast\` moves **2 steps** per iteration.\n\n### What this unlocks\n1. **Find the middle** — when \`fast\` reaches the end, \`slow\` is at the midpoint (or just past it for even length).\n2. **Cycle detection** — if a cycle exists, \`fast\` laps \`slow\` and they meet. If \`fast\` ever hits \`null\`, there's no cycle.\n3. **Cycle entry** — after they meet, reset one pointer to \`head\` and walk both at speed 1; they meet at the cycle's first node.\n\n### Why speed 2 works\nEach iteration the pointers close the gap by 1 node. In a cycle of length \`C\`, they must collide within at most \`C\` iterations after slow enters the cycle.\n\n### Visualization\nThe animation below walks both pointers to find the middle of \`[1,2,3,4,5,6,7]\`. Watch \`slow\` inch forward while \`fast\` darts ahead.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class ListNode {\n  constructor(val, next = null) { this.val = val; this.next = next; }\n}\n\n// Build a list from an array (helper)\nfunction listFrom(arr) {\n  let head = null;\n  for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head);\n  return head;\n}\n\nfunction hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}\n\nfunction findMiddle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow; // for even length, returns the second middle\n}\n\n// Demo\nconst list = listFrom([1, 2, 3, 4, 5, 6, 7]);\nconsole.log(findMiddle(list).val); // 4\nconsole.log(hasCycle(list));       // false`,
          },
          {
            language: "python",
            label: "Python",
            code: `class ListNode:\n    def __init__(self, val=0, nxt=None):\n        self.val = val\n        self.next = nxt\n\ndef list_from(arr):\n    head = None\n    for v in reversed(arr):\n        head = ListNode(v, head)\n    return head\n\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False\n\ndef find_middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow\n\n# Demo\nhead = list_from([1, 2, 3, 4, 5, 6, 7])\nprint(find_middle(head).val)  # 4\nprint(has_cycle(head))        # False`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct ListNode { int val; ListNode* next; ListNode(int v):val(v),next(nullptr){} };\n\nListNode* listFrom(const vector<int>& a) {\n    ListNode* head = nullptr;\n    for (int i = (int)a.size() - 1; i >= 0; --i) {\n        auto* n = new ListNode(a[i]); n->next = head; head = n;\n    }\n    return head;\n}\n\nbool hasCycle(ListNode* head) {\n    auto *s = head, *f = head;\n    while (f && f->next) {\n        s = s->next; f = f->next->next;\n        if (s == f) return true;\n    }\n    return false;\n}\n\nListNode* findMiddle(ListNode* head) {\n    auto *s = head, *f = head;\n    while (f && f->next) { s = s->next; f = f->next->next; }\n    return s;\n}\n\nint main() {\n    auto* head = listFrom({1,2,3,4,5,6,7});\n    cout << findMiddle(head)->val << "\\n"; // 4\n    cout << hasCycle(head) << "\\n";        // 0\n}`,
          },
        ],
        visualizationConfig: {
          type: "linked-list",
          defaultInput: [1, 2, 3, 4, 5, 6, 7],
        },
      },
      {
        id: "reverse-linked-list",
        slug: "reverse-linked-list-topic",
        title: "Reverse a Linked List",
        difficulty: "easy",
        description:
          "Iteratively flip each node's next pointer using prev/curr/next.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Reverse a Linked List\n\nWe walk the list once and flip each \`next\` pointer in place. Three pointers track the state:\n\n| Pointer | Meaning |\n|---------|---------|\n| \`prev\` | last node whose \`next\` has already been reversed (starts as \`null\`) |\n| \`curr\` | node whose \`next\` we'll flip this iteration |\n| \`next\` | cached \`curr.next\` so we don't lose the rest of the list |\n\n### The four-line loop\n1. \`next = curr.next\` — cache the tail.\n2. \`curr.next = prev\` — flip the pointer.\n3. \`prev = curr\` — the frontier moved forward.\n4. \`curr = next\` — advance.\n\nWhen \`curr\` is \`null\`, \`prev\` is the new head.\n\n### Recursive variant\n\`\`\`\nreverse(head):\n  if head is null or head.next is null: return head\n  newHead = reverse(head.next)\n  head.next.next = head\n  head.next = null\n  return newHead\n\`\`\`\nElegant, but uses O(n) stack space.\n\n### Pitfalls\n- Forgetting to cache \`next\` before overwriting \`curr.next\`.\n- Returning \`curr\` (\`null\` at the end) instead of \`prev\`.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class ListNode {\n  constructor(val, next = null) { this.val = val; this.next = next; }\n}\n\nfunction listFrom(arr) {\n  let head = null;\n  for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head);\n  return head;\n}\n\nfunction toArray(head) {\n  const out = [];\n  for (let c = head; c; c = c.next) out.push(c.val);\n  return out;\n}\n\n// Iterative — O(n) time, O(1) space\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next; // cache tail\n    curr.next = prev;       // flip pointer\n    prev = curr;            // move frontier\n    curr = next;            // advance\n  }\n  return prev;              // new head\n}\n\n// Recursive — O(n) time, O(n) stack\nfunction reverseListRec(head) {\n  if (!head || !head.next) return head;\n  const newHead = reverseListRec(head.next);\n  head.next.next = head;\n  head.next = null;\n  return newHead;\n}\n\n// Demo\nconsole.log(toArray(reverseList(listFrom([1,2,3,4,5]))));     // [5,4,3,2,1]\nconsole.log(toArray(reverseListRec(listFrom([1,2,3,4,5]))));  // [5,4,3,2,1]`,
          },
          {
            language: "python",
            label: "Python",
            code: `class ListNode:\n    def __init__(self, val=0, nxt=None):\n        self.val = val\n        self.next = nxt\n\ndef list_from(arr):\n    head = None\n    for v in reversed(arr):\n        head = ListNode(v, head)\n    return head\n\ndef to_array(head):\n    out = []\n    while head:\n        out.append(head.val); head = head.next\n    return out\n\n# Iterative — O(n) time, O(1) space\ndef reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev, curr = curr, nxt\n    return prev\n\n# Recursive — O(n) stack\ndef reverse_list_rec(head):\n    if head is None or head.next is None:\n        return head\n    new_head = reverse_list_rec(head.next)\n    head.next.next = head\n    head.next = None\n    return new_head\n\nprint(to_array(reverse_list(list_from([1,2,3,4,5]))))      # [5,4,3,2,1]\nprint(to_array(reverse_list_rec(list_from([1,2,3,4,5]))))  # [5,4,3,2,1]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct ListNode { int val; ListNode* next; ListNode(int v):val(v),next(nullptr){} };\n\nListNode* listFrom(const vector<int>& a) {\n    ListNode* head = nullptr;\n    for (int i = (int)a.size() - 1; i >= 0; --i) {\n        auto* n = new ListNode(a[i]); n->next = head; head = n;\n    }\n    return head;\n}\nvoid print(ListNode* h) {\n    for (; h; h = h->next) cout << h->val << (h->next ? " -> " : "");\n    cout << "\\n";\n}\n\nListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr) {\n        auto* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}\n\nint main() {\n    print(reverseList(listFrom({1,2,3,4,5}))); // 5 -> 4 -> 3 -> 2 -> 1\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class ReverseList {\n    static class ListNode { int val; ListNode next; ListNode(int v){val=v;} }\n\n    static ListNode listFrom(int[] a) {\n        ListNode head = null;\n        for (int i = a.length - 1; i >= 0; i--) {\n            ListNode n = new ListNode(a[i]); n.next = head; head = n;\n        }\n        return head;\n    }\n    static String print(ListNode h) {\n        StringBuilder sb = new StringBuilder();\n        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(" -> "); h = h.next; }\n        return sb.toString();\n    }\n\n    static ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n\n    public static void main(String[] a) {\n        System.out.println(print(reverseList(listFrom(new int[]{1,2,3,4,5}))));\n        // 5 -> 4 -> 3 -> 2 -> 1\n    }\n}`,
          },
        ],
        relatedProblems: ["reverse-linked-list"],
        tags: ["Two Pointers", "In-Place"],
        visualizationConfig: {
          type: "linked-list",
          defaultInput: [1, 2, 3, 4, 5],
        },
      },
      {
        id: "merge-two-sorted-lists",
        slug: "merge-two-sorted-lists-topic",
        title: "Merge Two Sorted Lists",
        difficulty: "easy",
        description:
          "Splice two sorted linked lists into one using a dummy head.",
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(1)",
        content: `## Merge Two Sorted Lists\n\nUse a **dummy head** so you don't special-case the first append. Walk both lists with two pointers, picking the smaller node each step.\n\n### Why a dummy head?\nIt eliminates the need to check whether the result list is empty before appending.\n\n### Generalization\n- For *k* lists: use a min-heap of \`(val, listIdx)\` for O(N log k).`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function mergeTwoLists(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }\n    else { tail.next = l2; l2 = l2.next; }\n    tail = tail.next;\n  }\n  tail.next = l1 ?? l2;\n  return dummy.next;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def merge_two_lists(l1, l2):\n    dummy = tail = ListNode()\n    while l1 and l2:\n        if l1.val <= l2.val:\n            tail.next, l1 = l1, l1.next\n        else:\n            tail.next, l2 = l2, l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `ListNode* mergeTwoLists(ListNode* a, ListNode* b) {\n  ListNode dummy(0), *tail=&dummy;\n  while (a && b) {\n    if (a->val <= b->val) { tail->next = a; a = a->next; }\n    else { tail->next = b; b = b->next; }\n    tail = tail->next;\n  }\n  tail->next = a ? a : b;\n  return dummy.next;\n}`,
          },
        ],
        relatedProblems: ["merge-two-sorted-lists"],
        tags: ["Two Pointers", "Dummy Head"],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 4] },
      },
      {
        id: "remove-nth-from-end",
        slug: "remove-nth-from-end-topic",
        title: "Remove Nth Node From End",
        difficulty: "medium",
        description:
          "Two pointers with a fixed gap of n+1 to delete in one pass.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Remove Nth Node From End\n\nAdvance \`fast\` by **n + 1** from a dummy head, then walk both pointers in tandem until \`fast\` falls off the end. \`slow\` will land **just before** the node to remove.\n\n### Why dummy?\nMakes removing the head node a uniform case.\n\n### One-pass intuition\nGap of n+1 ensures slow's *next* is the target.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function removeNthFromEnd(head, n) {\n  const dummy = { val: 0, next: head };\n  let fast = dummy, slow = dummy;\n  for (let i = 0; i <= n; i++) fast = fast.next;\n  while (fast) { fast = fast.next; slow = slow.next; }\n  slow.next = slow.next.next;\n  return dummy.next;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    fast = slow = dummy\n    for _ in range(n + 1):\n        fast = fast.next\n    while fast:\n        fast, slow = fast.next, slow.next\n    slow.next = slow.next.next\n    return dummy.next`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `ListNode* removeNthFromEnd(ListNode* head, int n) {\n  ListNode dummy(0); dummy.next = head;\n  auto *fast=&dummy, *slow=&dummy;\n  for (int i=0; i<=n; ++i) fast = fast->next;\n  while (fast) { fast = fast->next; slow = slow->next; }\n  auto* tmp = slow->next;\n  slow->next = slow->next->next;\n  delete tmp;\n  return dummy.next;\n}`,
          },
        ],
        relatedProblems: ["remove-nth-from-end"],
        tags: ["Two Pointers", "Dummy Head"],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "linked-list-cycle-detection",
        slug: "linked-list-cycle-detection",
        title: "Linked List Cycle Detection",
        difficulty: "medium",
        description:
          "Detect a cycle and find its entry point with Floyd's algorithm.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Linked List Cycle Detection\n\n### Has Cycle?\nFloyd's tortoise & hare. If \`fast\` ever equals \`slow\`, there is a cycle.\n\n### Cycle Entry Point\nAfter they meet, reset one pointer to head and move both at speed 1. They meet at the cycle's entrance.\n\n### Math intuition\nLet \`L\` = distance from head to cycle entry, \`C\` = cycle length, \`k\` = distance from entry to meeting point. Then \`L ≡ -k (mod C)\` — walking \`L\` steps from the meeting point lands at the entry.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function detectCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) {\n      let p = head;\n      while (p !== slow) { p = p.next; slow = slow.next; }\n      return p;\n    }\n  }\n  return null;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def detect_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n        if slow is fast:\n            p = head\n            while p is not slow:\n                p, slow = p.next, slow.next\n            return p\n    return None`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `ListNode* detectCycle(ListNode* head) {\n  auto *s=head, *f=head;\n  while (f && f->next) {\n    s = s->next; f = f->next->next;\n    if (s == f) {\n      auto* p = head;\n      while (p != s) { p = p->next; s = s->next; }\n      return p;\n    }\n  }\n  return nullptr;\n}`,
          },
        ],
        relatedProblems: ["linked-list-cycle"],
        tags: ["Floyd's Algorithm", "Two Pointers"],
        visualizationConfig: { type: "array", defaultInput: [3, 2, 0, -4] },
      },
      {
        id: "palindrome-linked-list",
        slug: "palindrome-linked-list-topic",
        title: "Palindrome Linked List",
        difficulty: "easy",
        description:
          "Check palindrome in O(1) space by reversing the second half.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Palindrome Linked List\n\n### Approach\n1. Find the middle with fast/slow pointers.\n2. Reverse the second half in place.\n3. Walk both halves and compare values.\n\n### Trade-offs\n- O(1) space but mutates the list (restore it after if needed).\n- A simpler O(n) space approach: copy values into an array and two-pointer compare.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function isPalindrome(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n  let prev = null, curr = slow;\n  while (curr) { const n = curr.next; curr.next = prev; prev = curr; curr = n; }\n  let a = head, b = prev;\n  while (b) { if (a.val !== b.val) return false; a = a.next; b = b.next; }\n  return true;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def is_palindrome(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    prev, curr = None, slow\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev, curr = curr, nxt\n    a, b = head, prev\n    while b:\n        if a.val != b.val: return False\n        a, b = a.next, b.next\n    return True`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `bool isPalindrome(ListNode* head) {\n  auto *s=head, *f=head;\n  while (f && f->next) { s=s->next; f=f->next->next; }\n  ListNode *prev=nullptr, *curr=s;\n  while (curr) { auto* n=curr->next; curr->next=prev; prev=curr; curr=n; }\n  auto *a=head, *b=prev;\n  while (b) { if (a->val != b->val) return false; a=a->next; b=b->next; }\n  return true;\n}`,
          },
        ],
        relatedProblems: ["palindrome-linked-list"],
        tags: ["Two Pointers", "Reverse"],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 2, 1] },
      },
      {
        id: "intersection-of-two-linked-lists",
        slug: "intersection-of-two-linked-lists",
        title: "Intersection of Two Linked Lists",
        difficulty: "easy",
        description:
          "Find the node where two lists join using length-equalizing pointers.",
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(1)",
        content: `## Intersection of Two Linked Lists\n\n### Trick\nWalk pointer A through list A then list B, and pointer B through list B then list A. Both traverse exactly \`n + m\` nodes, so they align at the intersection (or both reach \`null\` together).\n\n### Why it works\nIf the lists share a tail of length \`t\` and have unique prefixes \`a\` and \`b\`, after \`a + b\` steps both pointers stand exactly \`t\` nodes from the end.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function getIntersectionNode(headA, headB) {\n  let a = headA, b = headB;\n  while (a !== b) {\n    a = a ? a.next : headB;\n    b = b ? b.next : headA;\n  }\n  return a;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def get_intersection_node(a, b):\n    pa, pb = a, b\n    while pa is not pb:\n        pa = pa.next if pa else b\n        pb = pb.next if pb else a\n    return pa`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `ListNode* getIntersectionNode(ListNode* a, ListNode* b) {\n  auto *pa=a, *pb=b;\n  while (pa != pb) {\n    pa = pa ? pa->next : b;\n    pb = pb ? pb->next : a;\n  }\n  return pa;\n}`,
          },
        ],
        tags: ["Two Pointers"],
        visualizationConfig: { type: "array", defaultInput: [4, 1, 8, 4, 5] },
      },
      {
        id: "add-two-numbers-linked-list",
        slug: "add-two-numbers-linked-list",
        title: "Add Two Numbers (Linked List)",
        difficulty: "medium",
        description:
          "Sum two numbers stored as reversed digit lists, propagating carry.",
        timeComplexity: "O(max(n, m))",
        spaceComplexity: "O(max(n, m))",
        content: `## Add Two Numbers\n\nDigits are stored in **reverse order** (units first), so you can add column-by-column while propagating a \`carry\`.\n\n### Edge Cases\n- Different list lengths — treat missing digits as 0.\n- A final carry leaves an extra trailing node (e.g. 999 + 1 = 1000 → \`[0,0,0,1]\`).`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function addTwoNumbers(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy, carry = 0;\n  while (l1 || l2 || carry) {\n    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;\n    carry = Math.floor(sum / 10);\n    tail.next = { val: sum % 10, next: null };\n    tail = tail.next;\n    l1 = l1?.next ?? null;\n    l2 = l2?.next ?? null;\n  }\n  return dummy.next;\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def add_two_numbers(l1, l2):\n    dummy = tail = ListNode()\n    carry = 0\n    while l1 or l2 or carry:\n        s = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry\n        carry, d = divmod(s, 10)\n        tail.next = ListNode(d)\n        tail = tail.next\n        l1 = l1.next if l1 else None\n        l2 = l2.next if l2 else None\n    return dummy.next`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `ListNode* addTwoNumbers(ListNode* a, ListNode* b) {\n  ListNode dummy(0), *tail=&dummy;\n  int carry = 0;\n  while (a || b || carry) {\n    int s = (a?a->val:0) + (b?b->val:0) + carry;\n    carry = s / 10;\n    tail->next = new ListNode(s % 10);\n    tail = tail->next;\n    if (a) a = a->next;\n    if (b) b = b->next;\n  }\n  return dummy.next;\n}`,
          },
        ],
        tags: ["Math", "Carry"],
        visualizationConfig: { type: "array", defaultInput: [2, 4, 3] },
      },
      {
        id: "reorder-list",
        slug: "reorder-list",
        title: "Reorder List",
        difficulty: "medium",
        description:
          "Rearrange L0→L1→…→Ln to L0→Ln→L1→Ln-1→… using middle + reverse + merge.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Reorder List\n\n### Three classic sub-problems chained\n1. **Find middle** with fast/slow pointers.\n2. **Reverse** the second half in place.\n3. **Merge** the two halves alternately.\n\nEach is O(n) and O(1) space, so the whole pipeline is linear time, constant space.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function reorderList(head) {\n  if (!head || !head.next) return;\n  let slow = head, fast = head;\n  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }\n  let prev = null, curr = slow.next;\n  slow.next = null;\n  while (curr) { const n = curr.next; curr.next = prev; prev = curr; curr = n; }\n  let a = head, b = prev;\n  while (b) {\n    const an = a.next, bn = b.next;\n    a.next = b; b.next = an;\n    a = an; b = bn;\n  }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def reorder_list(head):\n    if not head or not head.next: return\n    slow = fast = head\n    while fast.next and fast.next.next:\n        slow, fast = slow.next, fast.next.next\n    prev, curr = None, slow.next\n    slow.next = None\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev, curr = curr, nxt\n    a, b = head, prev\n    while b:\n        an, bn = a.next, b.next\n        a.next = b; b.next = an\n        a, b = an, bn`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `void reorderList(ListNode* head) {\n  if (!head || !head->next) return;\n  auto *s=head, *f=head;\n  while (f->next && f->next->next) { s=s->next; f=f->next->next; }\n  ListNode *prev=nullptr, *curr=s->next;\n  s->next = nullptr;\n  while (curr) { auto* n=curr->next; curr->next=prev; prev=curr; curr=n; }\n  auto *a=head, *b=prev;\n  while (b) {\n    auto *an=a->next, *bn=b->next;\n    a->next=b; b->next=an;\n    a=an; b=bn;\n  }\n}`,
          },
        ],
        tags: ["Two Pointers", "Reverse", "Merge"],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4, 5] },
      },
      {
        id: "copy-list-with-random-pointer",
        slug: "copy-list-with-random-pointer",
        title: "Copy List With Random Pointer",
        difficulty: "medium",
        description:
          "Deep-copy a list whose nodes have an extra random pointer.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) interleaved / O(n) hash map",
        content: `## Copy List With Random Pointer\n\n### Hash-map approach (O(n) space)\nFirst pass: clone each node and store \`old → new\` in a map. Second pass: wire \`new.next\` and \`new.random\` via the map.\n\n### Interleaving approach (O(1) extra space)\n1. Insert each clone right after its original (\`A → A' → B → B' → …\`).\n2. Set \`A'.random = A.random.next\` for each clone.\n3. Detach the clone list from the original.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function copyRandomList(head) {\n  if (!head) return null;\n  const map = new Map();\n  let curr = head;\n  while (curr) { map.set(curr, { val: curr.val, next: null, random: null }); curr = curr.next; }\n  curr = head;\n  while (curr) {\n    const c = map.get(curr);\n    c.next = curr.next ? map.get(curr.next) : null;\n    c.random = curr.random ? map.get(curr.random) : null;\n    curr = curr.next;\n  }\n  return map.get(head);\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def copy_random_list(head):\n    if not head: return None\n    mp = {}\n    curr = head\n    while curr:\n        mp[curr] = Node(curr.val)\n        curr = curr.next\n    curr = head\n    while curr:\n        mp[curr].next = mp.get(curr.next)\n        mp[curr].random = mp.get(curr.random)\n        curr = curr.next\n    return mp[head]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `Node* copyRandomList(Node* head) {\n  if (!head) return nullptr;\n  unordered_map<Node*, Node*> mp;\n  for (auto* c = head; c; c = c->next) mp[c] = new Node(c->val);\n  for (auto* c = head; c; c = c->next) {\n    mp[c]->next = mp[c->next];\n    mp[c]->random = mp[c->random];\n  }\n  return mp[head];\n}`,
          },
        ],
        tags: ["Hash Map", "Two Pass"],
        visualizationConfig: { type: "array", defaultInput: [7, 13, 11, 10, 1] },
      },
      {
        id: "lru-cache-doubly-linked-list",
        slug: "lru-cache-doubly-linked-list",
        title: "LRU Cache (DLL + Hash Map)",
        difficulty: "hard",
        description:
          "O(1) get/put using a doubly linked list ordered by recency.",
        timeComplexity: "O(1) get / O(1) put",
        spaceComplexity: "O(capacity)",
        content: `## LRU Cache\n\nCombine a **hash map** (key → node) with a **doubly linked list** (most recent at head, least recent at tail).\n\n### Operations\n- **get(key)**: lookup node, move to head, return value.\n- **put(key, val)**: if exists, update + move to head; else create + insert at head; if over capacity, evict tail.\n\n### Why doubly linked?\nO(1) removal of an arbitrary node requires a \`prev\` pointer.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class LRUCache {\n  constructor(capacity) {\n    this.cap = capacity;\n    this.map = new Map();\n    this.head = { k: 0, v: 0 };\n    this.tail = { k: 0, v: 0 };\n    this.head.next = this.tail; this.tail.prev = this.head;\n  }\n  _add(node) { node.next = this.head.next; node.prev = this.head; this.head.next.prev = node; this.head.next = node; }\n  _remove(node) { node.prev.next = node.next; node.next.prev = node.prev; }\n  get(k) { if (!this.map.has(k)) return -1; const n = this.map.get(k); this._remove(n); this._add(n); return n.v; }\n  put(k, v) {\n    if (this.map.has(k)) this._remove(this.map.get(k));\n    const n = { k, v };\n    this._add(n); this.map.set(k, n);\n    if (this.map.size > this.cap) { const old = this.tail.prev; this._remove(old); this.map.delete(old.k); }\n  }\n}`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key, val):\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = val\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class LRUCache {\n  int cap;\n  list<pair<int,int>> dll;\n  unordered_map<int, list<pair<int,int>>::iterator> mp;\npublic:\n  LRUCache(int c) : cap(c) {}\n  int get(int k) {\n    if (!mp.count(k)) return -1;\n    dll.splice(dll.begin(), dll, mp[k]);\n    return mp[k]->second;\n  }\n  void put(int k, int v) {\n    if (mp.count(k)) { mp[k]->second = v; dll.splice(dll.begin(), dll, mp[k]); return; }\n    if ((int)dll.size() == cap) { mp.erase(dll.back().first); dll.pop_back(); }\n    dll.emplace_front(k, v);\n    mp[k] = dll.begin();\n  }\n};`,
          },
        ],
        relatedProblems: ["lru-cache"],
        tags: ["Hash Map", "Doubly Linked List", "Design"],
        visualizationConfig: { type: "array", defaultInput: [1, 2, 3, 4] },
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
        id: "binary-tree-basics",
        slug: "binary-tree-basics",
        title: "Binary Tree Basics",
        difficulty: "easy",
        description:
          "TreeNode structure, terminology, and common tree shapes.",
        timeComplexity: "O(1) per node",
        spaceComplexity: "O(n)",
        content: `## Binary Tree Basics\n\nA **binary tree** is a hierarchical structure where each node has at most two children — conventionally called \`left\` and \`right\`.\n\n### Core terminology\n- **Root** — the top node\n- **Leaf** — a node with no children\n- **Depth of a node** — edges from the root to that node\n- **Height of a tree** — depth of the deepest leaf\n- **Subtree** — any node together with all its descendants\n\n### Common shapes\n| Shape | Rule | Notes |\n|---|---|---|\n| **Full** | every node has 0 or 2 children | no "only-child" nodes |\n| **Complete** | every level filled left-to-right, last level may be partial | heaps are complete |\n| **Perfect** | every internal node has 2 children and all leaves at the same depth | node count = 2^h − 1 |\n| **Balanced** | heights of the two subtrees of every node differ by ≤ 1 | AVL / Red-Black |\n| **Skewed** | every node has at most one child | degenerates into a linked list, O(n) height |\n\n### Why study trees first\n- Recursion + pointers in a single shape — the perfect training ground.\n- File systems, the DOM, expression parsers, syntax trees, BSTs, heaps, tries, segment trees, and most game-AI data structures are all trees.\n\n### Representing a tree in memory\n\`\`\`\nTreeNode { val, left, right }\n\`\`\`\nFor testing we often pass a **level-order array** with \`null\` for missing nodes, e.g. \`[1, 2, 3, null, 4]\` ⇒\n\`\`\`\n      1\n     / \\\n    2   3\n     \\\n      4\n\`\`\``,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Minimal TreeNode and level-order builder used throughout this section\nclass TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}\n\n// Build a tree from a LeetCode-style level-order array with nulls.\nfunction buildTree(arr) {\n  if (!arr.length || arr[0] == null) return null;\n  const root = new TreeNode(arr[0]);\n  const q = [root];\n  let i = 1;\n  while (q.length && i < arr.length) {\n    const node = q.shift();\n    if (i < arr.length && arr[i] != null) {\n      node.left = new TreeNode(arr[i]);\n      q.push(node.left);\n    }\n    i++;\n    if (i < arr.length && arr[i] != null) {\n      node.right = new TreeNode(arr[i]);\n      q.push(node.right);\n    }\n    i++;\n  }\n  return root;\n}\n\n// Demo\nconst root = buildTree([1, 2, 3, null, 4, 5, 6]);\nconsole.log(root.val);               // 1\nconsole.log(root.left.val);          // 2\nconsole.log(root.left.right.val);    // 4\nconsole.log(root.right.left.val);    // 5`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(arr):\n    if not arr or arr[0] is None:\n        return None\n    root = TreeNode(arr[0])\n    q = deque([root])\n    i = 1\n    while q and i < len(arr):\n        node = q.popleft()\n        if i < len(arr) and arr[i] is not None:\n            node.left = TreeNode(arr[i]); q.append(node.left)\n        i += 1\n        if i < len(arr) and arr[i] is not None:\n            node.right = TreeNode(arr[i]); q.append(node.right)\n        i += 1\n    return root\n\nroot = build_tree([1, 2, 3, None, 4, 5, 6])\nprint(root.val, root.left.val, root.left.right.val, root.right.left.val)\n# 1 2 4 5`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <queue>\n#include <vector>\n#include <optional>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<optional<int>>& a) {\n  if (a.empty() || !a[0].has_value()) return nullptr;\n  auto* root = new TreeNode(*a[0]);\n  queue<TreeNode*> q; q.push(root);\n  size_t i = 1;\n  while (!q.empty() && i < a.size()) {\n    auto* n = q.front(); q.pop();\n    if (i < a.size() && a[i]) { n->left = new TreeNode(*a[i]); q.push(n->left); }\n    i++;\n    if (i < a.size() && a[i]) { n->right = new TreeNode(*a[i]); q.push(n->right); }\n    i++;\n  }\n  return root;\n}\n\nint main() {\n  auto* root = buildTree({1, 2, 3, nullopt, 4, 5, 6});\n  cout << root->val << " " << root->left->val << " " << root->left->right->val << "\\n";\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;\n\nclass TreeNode {\n  int val;\n  TreeNode left, right;\n  TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n  static TreeNode buildTree(Integer[] a) {\n    if (a.length == 0 || a[0] == null) return null;\n    TreeNode root = new TreeNode(a[0]);\n    Queue<TreeNode> q = new LinkedList<>();\n    q.add(root);\n    int i = 1;\n    while (!q.isEmpty() && i < a.length) {\n      TreeNode n = q.poll();\n      if (i < a.length && a[i] != null) { n.left = new TreeNode(a[i]); q.add(n.left); }\n      i++;\n      if (i < a.length && a[i] != null) { n.right = new TreeNode(a[i]); q.add(n.right); }\n      i++;\n    }\n    return root;\n  }\n\n  public static void main(String[] args) {\n    TreeNode root = buildTree(new Integer[]{1, 2, 3, null, 4, 5, 6});\n    System.out.println(root.val + " " + root.left.val + " " + root.left.right.val);\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [1, 2, 3, 4, 5, 6, 7],
          defaultTreeInput: [1, 2, 3, null, 4, 5, 6],
        },
      },
      {
        id: "binary-tree-traversal",
        slug: "binary-tree-traversal",
        title: "DFS Traversals (In / Pre / Post)",
        difficulty: "easy",
        description:
          "Depth-first traversals of a binary tree — the three orderings and when to use each.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) recursion",
        content: `## DFS Traversals\n\nAll three DFS orderings visit every node exactly once — what differs is **when** the current node is recorded relative to its children.\n\n| Order | Sequence | Classic use-case |\n|---|---|---|\n| **In-order** | Left → **Root** → Right | BST → sorted output |\n| **Pre-order** | **Root** → Left → Right | Copy / serialize a tree |\n| **Post-order** | Left → Right → **Root** | Delete tree, evaluate expression tree, compute subtree metrics |\n\n### Visual walkthrough — in-order on \`[1,2,3,4,5,6,7]\`\nShape:\n\`\`\`\n        1\n       / \\\n      2   3\n     / \\ / \\\n    4  5 6  7\n\`\`\`\nIn-order visits: 4, 2, 5, 1, 6, 3, 7.\n\n### Iterative forms\n- **In-order** uses an explicit stack + "go-left-as-far-as-possible" pointer.\n- **Pre-order** can use a stack by pushing right before left.\n- **Post-order** is trickiest — use two stacks or a visited flag.\n\n### Pitfalls\n- Returning \`void\` and relying on a closure \`result\` array is fine, but be careful with recursion limits on very deep trees.\n- A skewed tree gives O(n) stack depth — iterative versions prevent stack overflows.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nfunction inorder(root) {\n  const res = [];\n  (function dfs(n) {\n    if (!n) return;\n    dfs(n.left);\n    res.push(n.val);\n    dfs(n.right);\n  })(root);\n  return res;\n}\n\nfunction preorder(root) {\n  const res = [];\n  (function dfs(n) {\n    if (!n) return;\n    res.push(n.val);\n    dfs(n.left);\n    dfs(n.right);\n  })(root);\n  return res;\n}\n\nfunction postorder(root) {\n  const res = [];\n  (function dfs(n) {\n    if (!n) return;\n    dfs(n.left);\n    dfs(n.right);\n    res.push(n.val);\n  })(root);\n  return res;\n}\n\n// Iterative in-order (no recursion)\nfunction inorderIter(root) {\n  const res = [], stack = [];\n  let cur = root;\n  while (cur || stack.length) {\n    while (cur) { stack.push(cur); cur = cur.left; }\n    cur = stack.pop();\n    res.push(cur.val);\n    cur = cur.right;\n  }\n  return res;\n}\n\n// Demo\nconst build = (arr) => { /* level-order helper, see Binary Tree Basics */\n  if (!arr.length) return null;\n  const nodes = arr.map(v => v == null ? null : new TreeNode(v));\n  for (let i = 0, j = 1; j < nodes.length; i++) {\n    if (!nodes[i]) continue;\n    if (j < nodes.length) nodes[i].left = nodes[j++];\n    if (j < nodes.length) nodes[i].right = nodes[j++];\n  }\n  return nodes[0];\n};\nconst root = build([1, 2, 3, 4, 5, 6, 7]);\nconsole.log("in  ", inorder(root));     // [4,2,5,1,6,3,7]\nconsole.log("pre ", preorder(root));    // [1,2,4,5,3,6,7]\nconsole.log("post", postorder(root));   // [4,5,2,6,7,3,1]\nconsole.log("iter", inorderIter(root)); // [4,2,5,1,6,3,7]`,
          },
          {
            language: "python",
            label: "Python",
            code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef inorder(root):\n    res = []\n    def dfs(n):\n        if not n: return\n        dfs(n.left); res.append(n.val); dfs(n.right)\n    dfs(root); return res\n\ndef preorder(root):\n    res = []\n    def dfs(n):\n        if not n: return\n        res.append(n.val); dfs(n.left); dfs(n.right)\n    dfs(root); return res\n\ndef postorder(root):\n    res = []\n    def dfs(n):\n        if not n: return\n        dfs(n.left); dfs(n.right); res.append(n.val)\n    dfs(root); return res\n\ndef inorder_iter(root):\n    res, stack, cur = [], [], root\n    while cur or stack:\n        while cur:\n            stack.append(cur); cur = cur.left\n        cur = stack.pop()\n        res.append(cur.val)\n        cur = cur.right\n    return res\n\n# Demo: build from level-order [1,2,3,4,5,6,7]\ndef build(a):\n    if not a: return None\n    nodes = [TreeNode(v) if v is not None else None for v in a]\n    j = 1\n    for i in range(len(a)):\n        if not nodes[i]: continue\n        if j < len(a): nodes[i].left = nodes[j]; j += 1\n        if j < len(a): nodes[i].right = nodes[j]; j += 1\n    return nodes[0]\n\nroot = build([1, 2, 3, 4, 5, 6, 7])\nprint("in  ", inorder(root))       # [4,2,5,1,6,3,7]\nprint("pre ", preorder(root))      # [1,2,4,5,3,6,7]\nprint("post", postorder(root))     # [4,5,2,6,7,3,1]\nprint("iter", inorder_iter(root))  # [4,2,5,1,6,3,7]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <vector>\n#include <stack>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nvoid inorder(TreeNode* n, vector<int>& res) {\n  if (!n) return;\n  inorder(n->left, res);\n  res.push_back(n->val);\n  inorder(n->right, res);\n}\n\nvector<int> inorderIter(TreeNode* root) {\n  vector<int> res;\n  stack<TreeNode*> st;\n  TreeNode* cur = root;\n  while (cur || !st.empty()) {\n    while (cur) { st.push(cur); cur = cur->left; }\n    cur = st.top(); st.pop();\n    res.push_back(cur->val);\n    cur = cur->right;\n  }\n  return res;\n}\n\nint main() {\n  TreeNode* root = new TreeNode(1);\n  root->left = new TreeNode(2); root->right = new TreeNode(3);\n  root->left->left = new TreeNode(4); root->left->right = new TreeNode(5);\n  root->right->left = new TreeNode(6); root->right->right = new TreeNode(7);\n  vector<int> res;\n  inorder(root, res);\n  for (int v : res) cout << v << ' '; // 4 2 5 1 6 3 7\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;\n\nclass TreeNode {\n  int val; TreeNode left, right;\n  TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n  static void inorder(TreeNode n, List<Integer> res) {\n    if (n == null) return;\n    inorder(n.left, res);\n    res.add(n.val);\n    inorder(n.right, res);\n  }\n\n  public static void main(String[] args) {\n    TreeNode root = new TreeNode(1);\n    root.left = new TreeNode(2); root.right = new TreeNode(3);\n    root.left.left = new TreeNode(4); root.left.right = new TreeNode(5);\n    root.right.left = new TreeNode(6); root.right.right = new TreeNode(7);\n    List<Integer> out = new ArrayList<>();\n    inorder(root, out);\n    System.out.println(out); // [4, 2, 5, 1, 6, 3, 7]\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [1, 2, 3, 4, 5, 6, 7],
          defaultTreeInput: [1, 2, 3, 4, 5, 6, 7],
        },
      },
      {
        id: "level-order-traversal",
        slug: "level-order-traversal",
        title: "Level-Order Traversal (BFS)",
        difficulty: "easy",
        description:
          "Visit every node level-by-level using a queue — the bread-and-butter of BFS on trees.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(w) — max width",
        content: `## Level-Order Traversal\n\nProcess nodes level-by-level using a **FIFO queue**.\n\n### Algorithm\n1. Push root into a queue.\n2. While the queue is not empty:\n   - Record its current \`size\` — that's how many nodes are on this level.\n   - Dequeue \`size\` nodes, recording their values into a \`level\` array.\n   - For each dequeued node, enqueue its non-null children.\n3. Append \`level\` to the result.\n\n### When to pick BFS over DFS\n- You need results **grouped by depth** (level-order output).\n- You're computing shortest paths in an unweighted tree/graph.\n- You need the **minimum depth** of a tree (BFS stops at the first leaf).\n- You need a **zig-zag / right-side view / bottom-up** ordering — all trivial variants of BFS.\n\n### Complexity\n- Time O(n) — each node enqueued once.\n- Space O(w) where \`w\` is the maximum level width — for a complete tree of height \`h\`, w ≈ n/2.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nfunction levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  while (queue.length) {\n    const size = queue.length;\n    const level = [];\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}\n\n// Demo tree:  3\n//            / \\\n//           9  20\n//              / \\\n//            15   7\nconst root = new TreeNode(3,\n  new TreeNode(9),\n  new TreeNode(20, new TreeNode(15), new TreeNode(7))\n);\nconsole.log(levelOrder(root)); // [[3], [9, 20], [15, 7]]`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef level_order(root):\n    if not root: return []\n    out, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            n = q.popleft()\n            level.append(n.val)\n            if n.left: q.append(n.left)\n            if n.right: q.append(n.right)\n        out.append(level)\n    return out\n\nroot = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint(level_order(root))  # [[3], [9, 20], [15, 7]]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n  vector<vector<int>> out;\n  if (!root) return out;\n  queue<TreeNode*> q; q.push(root);\n  while (!q.empty()) {\n    int sz = q.size();\n    vector<int> level;\n    while (sz--) {\n      auto* n = q.front(); q.pop();\n      level.push_back(n->val);\n      if (n->left) q.push(n->left);\n      if (n->right) q.push(n->right);\n    }\n    out.push_back(level);\n  }\n  return out;\n}\n\nint main() {\n  auto* root = new TreeNode(3);\n  root->left = new TreeNode(9);\n  root->right = new TreeNode(20);\n  root->right->left = new TreeNode(15);\n  root->right->right = new TreeNode(7);\n  for (auto& lvl : levelOrder(root)) {\n    for (int v : lvl) cout << v << ' ';\n    cout << '\\n';\n  }\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;\n\nclass TreeNode {\n  int val; TreeNode left, right;\n  TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n  static List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> out = new ArrayList<>();\n    if (root == null) return out;\n    Deque<TreeNode> q = new ArrayDeque<>();\n    q.add(root);\n    while (!q.isEmpty()) {\n      int sz = q.size();\n      List<Integer> level = new ArrayList<>();\n      while (sz-- > 0) {\n        TreeNode n = q.poll();\n        level.add(n.val);\n        if (n.left != null) q.add(n.left);\n        if (n.right != null) q.add(n.right);\n      }\n      out.add(level);\n    }\n    return out;\n  }\n\n  public static void main(String[] args) {\n    TreeNode root = new TreeNode(3);\n    root.left = new TreeNode(9);\n    root.right = new TreeNode(20);\n    root.right.left = new TreeNode(15);\n    root.right.right = new TreeNode(7);\n    System.out.println(levelOrder(root)); // [[3], [9, 20], [15, 7]]\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [3, 9, 20, 15, 7],
          defaultTreeInput: [3, 9, 20, null, null, 15, 7],
        },
      },
      {
        id: "tree-height-depth",
        slug: "tree-height-depth",
        title: "Tree Height & Max Depth",
        difficulty: "easy",
        description:
          "Compute the maximum depth of a binary tree with a one-line recurrence.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        content: `## Tree Height & Max Depth\n\n\`\`\`\nheight(root) = 0,                                if root is null\n             = 1 + max(height(left), height(right)), otherwise\n\`\`\`\n\n### Why this matters\n- **Balance checks** use subtree heights.\n- **Diameter** = max over all nodes of \`height(left) + height(right)\`.\n- Many "compute-something-bottom-up" problems are variations of this recurrence.\n\n### Iterative alternative\nDo BFS and count how many levels the queue produces.\n\n### Edge cases\n| Input | Height |\n|---|---|\n| \`null\` | 0 |\n| single node | 1 |\n| skewed chain of n nodes | n |`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nfunction maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n\n// Iterative BFS version\nfunction maxDepthIter(root) {\n  if (!root) return 0;\n  let depth = 0;\n  const q = [root];\n  while (q.length) {\n    let size = q.length;\n    depth++;\n    while (size--) {\n      const n = q.shift();\n      if (n.left) q.push(n.left);\n      if (n.right) q.push(n.right);\n    }\n  }\n  return depth;\n}\n\nconst root = new TreeNode(3,\n  new TreeNode(9),\n  new TreeNode(20, new TreeNode(15), new TreeNode(7))\n);\nconsole.log(maxDepth(root));     // 3\nconsole.log(maxDepthIter(root)); // 3`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef max_depth(root):\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\ndef max_depth_iter(root):\n    if not root: return 0\n    depth, q = 0, deque([root])\n    while q:\n        depth += 1\n        for _ in range(len(q)):\n            n = q.popleft()\n            if n.left: q.append(n.left)\n            if n.right: q.append(n.right)\n    return depth\n\nroot = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint(max_depth(root), max_depth_iter(root))  # 3 3`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *l, *r; TreeNode(int v): val(v), l(nullptr), r(nullptr) {} };\n\nint maxDepth(TreeNode* root) {\n  if (!root) return 0;\n  return 1 + max(maxDepth(root->l), maxDepth(root->r));\n}\n\nint main() {\n  auto* root = new TreeNode(3);\n  root->l = new TreeNode(9);\n  root->r = new TreeNode(20);\n  root->r->l = new TreeNode(15);\n  root->r->r = new TreeNode(7);\n  cout << maxDepth(root); // 3\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }\n\npublic class Main {\n  static int maxDepth(TreeNode n) {\n    if (n == null) return 0;\n    return 1 + Math.max(maxDepth(n.left), maxDepth(n.right));\n  }\n  public static void main(String[] args) {\n    TreeNode root = new TreeNode(3);\n    root.left = new TreeNode(9);\n    root.right = new TreeNode(20);\n    root.right.left = new TreeNode(15);\n    root.right.right = new TreeNode(7);\n    System.out.println(maxDepth(root)); // 3\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [3, 9, 20, 15, 7],
          defaultTreeInput: [3, 9, 20, null, null, 15, 7],
        },
      },
      {
        id: "invert-binary-tree-topic",
        slug: "invert-binary-tree-topic",
        title: "Invert a Binary Tree",
        difficulty: "easy",
        description:
          "Swap left and right children of every node — the classic recursion warm-up.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        content: `## Invert a Binary Tree\n\n> "Swap every node's left and right children." — *Google phone screen, 2015* 🙂\n\n### Recursive post-order\n1. Invert the left subtree.\n2. Invert the right subtree.\n3. Swap \`node.left\` and \`node.right\`.\n\n### Iterative BFS\nPush nodes in a queue; for each, swap its children then enqueue both sides.\n\n### Why it's worth doing\n- It teaches **tree recursion without a return value that matters** — the work happens *as a side effect*.\n- The identical pattern is reused for "apply a transformation to every node in a tree".\n\n### Sanity check\nAfter inverting a BST, an in-order traversal yields values in **reverse** sorted order.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nfunction invertTree(root) {\n  if (!root) return null;\n  [root.left, root.right] = [root.right, root.left];\n  invertTree(root.left);\n  invertTree(root.right);\n  return root;\n}\n\nfunction inorder(root, out = []) {\n  if (!root) return out;\n  inorder(root.left, out);\n  out.push(root.val);\n  inorder(root.right, out);\n  return out;\n}\n\n// Demo:  4           4\n//       / \\         / \\\n//      2   7   →   7   2\n//     /\\ /\\       /\\ /\\\n//    1 3 6 9     9 6 3 1\nconst root = new TreeNode(4,\n  new TreeNode(2, new TreeNode(1), new TreeNode(3)),\n  new TreeNode(7, new TreeNode(6), new TreeNode(9))\n);\nconsole.log(inorder(root));             // [1,2,3,4,6,7,9]\ninvertTree(root);\nconsole.log(inorder(root));             // [9,7,6,4,3,2,1]`,
          },
          {
            language: "python",
            label: "Python",
            code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef invert(root):\n    if not root: return None\n    root.left, root.right = root.right, root.left\n    invert(root.left); invert(root.right)\n    return root\n\ndef inorder(r, out=None):\n    if out is None: out = []\n    if not r: return out\n    inorder(r.left, out); out.append(r.val); inorder(r.right, out)\n    return out\n\nroot = TreeNode(4,\n    TreeNode(2, TreeNode(1), TreeNode(3)),\n    TreeNode(7, TreeNode(6), TreeNode(9)))\nprint(inorder(root))           # [1,2,3,4,6,7,9]\ninvert(root)\nprint(inorder(root))           # [9,7,6,4,3,2,1]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *l, *r; TreeNode(int v): val(v), l(nullptr), r(nullptr) {} };\n\nTreeNode* invert(TreeNode* root) {\n  if (!root) return nullptr;\n  swap(root->l, root->r);\n  invert(root->l); invert(root->r);\n  return root;\n}\n\nvoid inorder(TreeNode* n) {\n  if (!n) return;\n  inorder(n->l); cout << n->val << ' '; inorder(n->r);\n}\n\nint main() {\n  auto* root = new TreeNode(4);\n  root->l = new TreeNode(2); root->r = new TreeNode(7);\n  root->l->l = new TreeNode(1); root->l->r = new TreeNode(3);\n  root->r->l = new TreeNode(6); root->r->r = new TreeNode(9);\n  inorder(root); cout << '\\n';        // 1 2 3 4 6 7 9\n  invert(root);\n  inorder(root);                      // 9 7 6 4 3 2 1\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }\n\npublic class Main {\n  static TreeNode invert(TreeNode n) {\n    if (n == null) return null;\n    TreeNode t = n.left; n.left = n.right; n.right = t;\n    invert(n.left); invert(n.right);\n    return n;\n  }\n  static void inorder(TreeNode n) {\n    if (n == null) return;\n    inorder(n.left); System.out.print(n.val + " "); inorder(n.right);\n  }\n  public static void main(String[] args) {\n    TreeNode root = new TreeNode(4);\n    root.left = new TreeNode(2); root.right = new TreeNode(7);\n    root.left.left = new TreeNode(1); root.left.right = new TreeNode(3);\n    root.right.left = new TreeNode(6); root.right.right = new TreeNode(9);\n    inorder(root); System.out.println();\n    invert(root);\n    inorder(root); // 9 7 6 4 3 2 1\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [4, 2, 7, 1, 3, 6, 9],
          defaultTreeInput: [4, 2, 7, 1, 3, 6, 9],
        },
      },
      {
        id: "binary-search-tree",
        slug: "binary-search-tree",
        title: "Binary Search Tree",
        difficulty: "medium",
        description:
          "A tree where left < parent < right — gives O(h) search, insert, and delete.",
        timeComplexity: "O(h) — O(log n) balanced, O(n) worst-case",
        spaceComplexity: "O(n)",
        content: `## Binary Search Tree (BST)\n\n**BST invariant**: for every node, all values in the left subtree are **strictly less**, all values in the right subtree are **strictly greater**.\n\n### Core operations\n| Operation | Idea | Time |\n|---|---|---|\n| **search(x)** | compare → go left / right | O(h) |\n| **insert(x)** | walk down, attach new leaf | O(h) |\n| **delete(x)** | 3 cases — see below | O(h) |\n| **in-order traversal** | yields **sorted** output | O(n) |\n\n### Delete cases\n1. **Leaf** → just detach.\n2. **One child** → replace node with its only child.\n3. **Two children** → replace with **in-order successor** (smallest value in the right subtree), then delete that successor.\n\n### Why balance matters\nA BST built from a sorted input degenerates into a linked list — operations become O(n). That's why self-balancing variants (AVL, Red-Black, Treap) exist.\n\n### Visual walkthrough (default input \`[5, 3, 7, 1, 4, 6, 8]\`)\nInserting in that order produces:\n\`\`\`\n        5\n       / \\\n      3   7\n     / \\ / \\\n    1  4 6  8\n\`\`\`\nIn-order traversal → \`[1, 3, 4, 5, 6, 7, 8]\` ✓`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class BSTNode {\n  constructor(val) { this.val = val; this.left = this.right = null; }\n}\n\nfunction insert(root, val) {\n  if (!root) return new BSTNode(val);\n  if (val < root.val) root.left = insert(root.left, val);\n  else if (val > root.val) root.right = insert(root.right, val);\n  return root;\n}\n\nfunction search(root, val) {\n  if (!root || root.val === val) return root;\n  return val < root.val ? search(root.left, val) : search(root.right, val);\n}\n\nfunction remove(root, val) {\n  if (!root) return null;\n  if (val < root.val) root.left = remove(root.left, val);\n  else if (val > root.val) root.right = remove(root.right, val);\n  else {\n    if (!root.left)  return root.right;\n    if (!root.right) return root.left;\n    // Two children — find in-order successor.\n    let succ = root.right;\n    while (succ.left) succ = succ.left;\n    root.val = succ.val;\n    root.right = remove(root.right, succ.val);\n  }\n  return root;\n}\n\nfunction inorder(r, out = []) {\n  if (!r) return out;\n  inorder(r.left, out); out.push(r.val); inorder(r.right, out);\n  return out;\n}\n\n// Demo\nlet root = null;\nfor (const v of [5, 3, 7, 1, 4, 6, 8]) root = insert(root, v);\nconsole.log(inorder(root));           // [1, 3, 4, 5, 6, 7, 8]\nconsole.log(!!search(root, 4));       // true\nconsole.log(!!search(root, 10));      // false\nroot = remove(root, 7);\nconsole.log(inorder(root));           // [1, 3, 4, 5, 6, 8]`,
          },
          {
            language: "python",
            label: "Python",
            code: `class BSTNode:\n    def __init__(self, val):\n        self.val = val; self.left = self.right = None\n\ndef insert(root, val):\n    if not root: return BSTNode(val)\n    if val < root.val: root.left = insert(root.left, val)\n    elif val > root.val: root.right = insert(root.right, val)\n    return root\n\ndef search(root, val):\n    if not root or root.val == val: return root\n    return search(root.left, val) if val < root.val else search(root.right, val)\n\ndef remove(root, val):\n    if not root: return None\n    if val < root.val: root.left = remove(root.left, val)\n    elif val > root.val: root.right = remove(root.right, val)\n    else:\n        if not root.left: return root.right\n        if not root.right: return root.left\n        succ = root.right\n        while succ.left: succ = succ.left\n        root.val = succ.val\n        root.right = remove(root.right, succ.val)\n    return root\n\ndef inorder(r, out=None):\n    if out is None: out = []\n    if not r: return out\n    inorder(r.left, out); out.append(r.val); inorder(r.right, out)\n    return out\n\nroot = None\nfor v in [5, 3, 7, 1, 4, 6, 8]: root = insert(root, v)\nprint(inorder(root))      # [1, 3, 4, 5, 6, 7, 8]\nprint(bool(search(root, 4)), bool(search(root, 10)))  # True False\nroot = remove(root, 7)\nprint(inorder(root))      # [1, 3, 4, 5, 6, 8]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Node { int val; Node *l, *r; Node(int v): val(v), l(nullptr), r(nullptr) {} };\n\nNode* insert(Node* r, int v) {\n  if (!r) return new Node(v);\n  if (v < r->val) r->l = insert(r->l, v);\n  else if (v > r->val) r->r = insert(r->r, v);\n  return r;\n}\n\nNode* search(Node* r, int v) {\n  if (!r || r->val == v) return r;\n  return v < r->val ? search(r->l, v) : search(r->r, v);\n}\n\nvoid inorder(Node* n, vector<int>& out) {\n  if (!n) return;\n  inorder(n->l, out); out.push_back(n->val); inorder(n->r, out);\n}\n\nint main() {\n  Node* root = nullptr;\n  for (int v : {5, 3, 7, 1, 4, 6, 8}) root = insert(root, v);\n  vector<int> out; inorder(root, out);\n  for (int v : out) cout << v << ' '; // 1 3 4 5 6 7 8\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;\n\nclass Node { int val; Node l, r; Node(int v) { val = v; } }\n\npublic class Main {\n  static Node insert(Node r, int v) {\n    if (r == null) return new Node(v);\n    if (v < r.val) r.l = insert(r.l, v);\n    else if (v > r.val) r.r = insert(r.r, v);\n    return r;\n  }\n  static void inorder(Node n, List<Integer> out) {\n    if (n == null) return;\n    inorder(n.l, out); out.add(n.val); inorder(n.r, out);\n  }\n  public static void main(String[] args) {\n    Node root = null;\n    for (int v : new int[]{5, 3, 7, 1, 4, 6, 8}) root = insert(root, v);\n    List<Integer> out = new ArrayList<>();\n    inorder(root, out);\n    System.out.println(out); // [1, 3, 4, 5, 6, 7, 8]\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [5, 3, 7, 1, 4, 6, 8],
        },
      },
      {
        id: "validate-bst",
        slug: "validate-bst",
        title: "Validate BST",
        difficulty: "medium",
        description:
          "Check whether a binary tree obeys the BST ordering property.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        content: `## Validate BST\n\nA common bug: comparing only a node with its two immediate children — that's not enough.\n\n### Example — fails the naive check\n\`\`\`\n    5\n   / \\\n  1   6\n     / \\\n    3   7    ← 3 < 5, but it sits in the right subtree of 5 → invalid BST\n\`\`\`\n\n### Technique 1 — tight bounds\nPropagate (min, max) limits down the recursion:\n\`\`\`\nvalid(node, min, max):\n  if node is null: return true\n  if node.val <= min or node.val >= max: return false\n  return valid(left, min, node.val) and valid(right, node.val, max)\n\`\`\`\nInitial call: \`valid(root, -∞, +∞)\`.\n\n### Technique 2 — in-order must be strictly increasing\nRun an in-order traversal, tracking the previous value. If \`prev >= current\`, reject.\n\nBoth are O(n); the bounds version is usually easier to reason about with \`null\` corner cases.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nfunction isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val)\n      && isValidBST(root.right, root.val, max);\n}\n\n// Demo\nconst good = new TreeNode(5,\n  new TreeNode(3, new TreeNode(1), new TreeNode(4)),\n  new TreeNode(7, new TreeNode(6), new TreeNode(8))\n);\nconst bad = new TreeNode(5,\n  new TreeNode(1),\n  new TreeNode(6, new TreeNode(3), new TreeNode(7))\n);\nconsole.log(isValidBST(good)); // true\nconsole.log(isValidBST(bad));  // false`,
          },
          {
            language: "python",
            label: "Python",
            code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef is_valid_bst(node, lo=float('-inf'), hi=float('inf')):\n    if not node: return True\n    if not (lo < node.val < hi): return False\n    return is_valid_bst(node.left, lo, node.val) and \\\n           is_valid_bst(node.right, node.val, hi)\n\ngood = TreeNode(5, TreeNode(3, TreeNode(1), TreeNode(4)),\n                   TreeNode(7, TreeNode(6), TreeNode(8)))\nbad  = TreeNode(5, TreeNode(1), TreeNode(6, TreeNode(3), TreeNode(7)))\nprint(is_valid_bst(good), is_valid_bst(bad))  # True False`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <limits>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *l, *r; TreeNode(int v): val(v), l(nullptr), r(nullptr) {} };\n\nbool isValid(TreeNode* n, long lo, long hi) {\n  if (!n) return true;\n  if (n->val <= lo || n->val >= hi) return false;\n  return isValid(n->l, lo, n->val) && isValid(n->r, n->val, hi);\n}\nbool isValidBST(TreeNode* r) {\n  return isValid(r, LONG_MIN, LONG_MAX);\n}\n\nint main() {\n  auto* t = new TreeNode(5);\n  t->l = new TreeNode(3); t->r = new TreeNode(7);\n  t->l->l = new TreeNode(1); t->l->r = new TreeNode(4);\n  cout << isValidBST(t); // 1\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }\n\npublic class Main {\n  static boolean valid(TreeNode n, long lo, long hi) {\n    if (n == null) return true;\n    if (n.val <= lo || n.val >= hi) return false;\n    return valid(n.left, lo, n.val) && valid(n.right, n.val, hi);\n  }\n  static boolean isValidBST(TreeNode r) {\n    return valid(r, Long.MIN_VALUE, Long.MAX_VALUE);\n  }\n  public static void main(String[] args) {\n    TreeNode t = new TreeNode(5);\n    t.left = new TreeNode(3); t.right = new TreeNode(7);\n    System.out.println(isValidBST(t)); // true\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [5, 3, 7, 1, 4, 6, 8],
          defaultTreeInput: [5, 3, 7, 1, 4, 6, 8],
        },
      },
      {
        id: "lowest-common-ancestor-topic",
        slug: "lowest-common-ancestor-topic",
        title: "Lowest Common Ancestor",
        difficulty: "medium",
        description:
          "Find the deepest node that is an ancestor of both p and q.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        content: `## Lowest Common Ancestor (LCA)\n\nGiven a binary tree and two nodes \`p\` and \`q\`, the LCA is the **lowest** node that has both \`p\` and \`q\` in its subtrees (a node is allowed to be its own ancestor).\n\n### General binary tree — recursive\n\`\`\`\nlca(node, p, q):\n  if node is null or node == p or node == q:\n    return node\n  L = lca(node.left,  p, q)\n  R = lca(node.right, p, q)\n  if L and R: return node            # p in one side, q in the other\n  return L or R                      # both in one side, or neither\n\`\`\`\nInvariant: once \`lca\` returns non-null from both subtrees, the current node is the answer.\n\n### BST shortcut\nWhile both values are < node, go left. While both > node, go right. The first split is the LCA.\n\n### Why post-order\nThe recursion only decides what to return *after* seeing both subtrees — that's the hallmark of a post-order solution.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nfunction lca(root, p, q) {\n  if (!root || root.val === p || root.val === q) return root;\n  const L = lca(root.left,  p, q);\n  const R = lca(root.right, p, q);\n  if (L && R) return root;\n  return L || R;\n}\n\n// Demo tree: [3,5,1,6,2,0,8,null,null,7,4]\nconst n = (v, l=null, r=null) => new TreeNode(v, l, r);\nconst root = n(3,\n  n(5, n(6), n(2, n(7), n(4))),\n  n(1, n(0), n(8))\n);\nconsole.log(lca(root, 5, 1).val); // 3\nconsole.log(lca(root, 5, 4).val); // 5  (5 is an ancestor of itself)`,
          },
          {
            language: "python",
            label: "Python",
            code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef lca(root, p, q):\n    if not root or root.val == p or root.val == q:\n        return root\n    L = lca(root.left,  p, q)\n    R = lca(root.right, p, q)\n    if L and R: return root\n    return L or R\n\nn = TreeNode\nroot = n(3,\n    n(5, n(6), n(2, n(7), n(4))),\n    n(1, n(0), n(8))\n)\nprint(lca(root, 5, 1).val)  # 3\nprint(lca(root, 5, 4).val)  # 5`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *l, *r; TreeNode(int v): val(v), l(nullptr), r(nullptr) {} };\n\nTreeNode* lca(TreeNode* r, int p, int q) {\n  if (!r || r->val == p || r->val == q) return r;\n  auto* L = lca(r->l, p, q);\n  auto* R = lca(r->r, p, q);\n  if (L && R) return r;\n  return L ? L : R;\n}\n\nint main() {\n  auto* r = new TreeNode(3);\n  r->l = new TreeNode(5); r->r = new TreeNode(1);\n  r->l->l = new TreeNode(6); r->l->r = new TreeNode(2);\n  r->r->l = new TreeNode(0); r->r->r = new TreeNode(8);\n  cout << lca(r, 5, 1)->val; // 3\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }\n\npublic class Main {\n  static TreeNode lca(TreeNode r, int p, int q) {\n    if (r == null || r.val == p || r.val == q) return r;\n    TreeNode L = lca(r.left, p, q), R = lca(r.right, p, q);\n    if (L != null && R != null) return r;\n    return L != null ? L : R;\n  }\n  public static void main(String[] args) {\n    TreeNode r = new TreeNode(3);\n    r.left = new TreeNode(5); r.right = new TreeNode(1);\n    System.out.println(lca(r, 5, 1).val); // 3\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [3, 5, 1, 6, 2, 0, 8],
          defaultTreeInput: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
          target: 5,
        },
      },
      {
        id: "path-sum-topic",
        slug: "path-sum-topic",
        title: "Path Sum",
        difficulty: "easy",
        description:
          "Does the tree have a root-to-leaf path whose node values sum to a target?",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        content: `## Path Sum\n\n> Return \`true\` iff some **root-to-leaf** path in the tree has values summing to \`target\`.\n\n### Technique\nSubtract the current node's value from the target as you descend. At a leaf, succeed iff the remaining sum is zero.\n\n\`\`\`\nhasPath(node, remaining):\n  if node is null: return false\n  remaining -= node.val\n  if node is a leaf: return remaining == 0\n  return hasPath(left,  remaining) or hasPath(right, remaining)\n\`\`\`\n\n### Variations\n- **Count all paths with sum = target** (not necessarily root-to-leaf) — prefix-sum trick, O(n).\n- **Return all root-to-leaf paths that sum to target** — same recursion, carry a path array, copy into result on success.\n- **Max path sum (any node → any node)** — LeetCode 124, classic tree DP with a global maximum.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nfunction hasPathSum(root, target) {\n  if (!root) return false;\n  const remaining = target - root.val;\n  if (!root.left && !root.right) return remaining === 0;\n  return hasPathSum(root.left,  remaining)\n      || hasPathSum(root.right, remaining);\n}\n\n// List every root-to-leaf path that hits the target\nfunction pathSum(root, target) {\n  const out = [];\n  (function dfs(n, remaining, path) {\n    if (!n) return;\n    path.push(n.val);\n    if (!n.left && !n.right && remaining === n.val) out.push([...path]);\n    dfs(n.left,  remaining - n.val, path);\n    dfs(n.right, remaining - n.val, path);\n    path.pop();\n  })(root, target, []);\n  return out;\n}\n\nconst n = (v, l=null, r=null) => new TreeNode(v, l, r);\nconst root = n(5,\n  n(4, n(11, n(7), n(2))),\n  n(8, n(13), n(4, null, n(1)))\n);\nconsole.log(hasPathSum(root, 22)); // true\nconsole.log(pathSum(root, 22));    // [[5,4,11,2], [5,8,4,...]]`,
          },
          {
            language: "python",
            label: "Python",
            code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef has_path_sum(root, target):\n    if not root: return False\n    rem = target - root.val\n    if not root.left and not root.right:\n        return rem == 0\n    return has_path_sum(root.left, rem) or has_path_sum(root.right, rem)\n\ndef path_sum(root, target):\n    out = []\n    def dfs(n, rem, path):\n        if not n: return\n        path.append(n.val)\n        if not n.left and not n.right and rem == n.val:\n            out.append(list(path))\n        dfs(n.left, rem - n.val, path)\n        dfs(n.right, rem - n.val, path)\n        path.pop()\n    dfs(root, target, [])\n    return out\n\nn = TreeNode\nroot = n(5,\n    n(4, n(11, n(7), n(2))),\n    n(8, n(13), n(4, None, n(1))))\nprint(has_path_sum(root, 22))  # True\nprint(path_sum(root, 22))`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *l, *r; TreeNode(int v): val(v), l(nullptr), r(nullptr) {} };\n\nbool hasPathSum(TreeNode* n, int target) {\n  if (!n) return false;\n  int rem = target - n->val;\n  if (!n->l && !n->r) return rem == 0;\n  return hasPathSum(n->l, rem) || hasPathSum(n->r, rem);\n}\n\nint main() {\n  auto* r = new TreeNode(5);\n  r->l = new TreeNode(4); r->r = new TreeNode(8);\n  r->l->l = new TreeNode(11);\n  r->l->l->l = new TreeNode(7);\n  r->l->l->r = new TreeNode(2);\n  cout << hasPathSum(r, 22); // 1\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }\n\npublic class Main {\n  static boolean hasPathSum(TreeNode n, int target) {\n    if (n == null) return false;\n    int rem = target - n.val;\n    if (n.left == null && n.right == null) return rem == 0;\n    return hasPathSum(n.left, rem) || hasPathSum(n.right, rem);\n  }\n  public static void main(String[] args) {\n    TreeNode r = new TreeNode(5);\n    r.left = new TreeNode(4); r.right = new TreeNode(8);\n    r.left.left = new TreeNode(11);\n    r.left.left.left = new TreeNode(7);\n    r.left.left.right = new TreeNode(2);\n    System.out.println(hasPathSum(r, 22)); // true\n  }\n}`,
          },
        ],
        visualizationConfig: {
          type: "tree",
          defaultInput: [5, 4, 8, 11, 13, 4, 7, 2, 1],
          defaultTreeInput: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1],
          target: 22,
        },
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
            code: `class TrieNode {\n  constructor() { this.children = {}; this.isEnd = false; }\n}\n\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    const node = this._walk(word);\n    return node != null && node.isEnd;\n  }\n  startsWith(prefix) { return this._walk(prefix) != null; }\n  _walk(s) {\n    let node = this.root;\n    for (const ch of s) {\n      if (!node.children[ch]) return null;\n      node = node.children[ch];\n    }\n    return node;\n  }\n}\n\n// Demo\nconst t = new Trie();\n["cat", "car", "cap", "dog"].forEach(w => t.insert(w));\nconsole.log(t.search("cat"));       // true\nconsole.log(t.search("ca"));        // false — not marked end\nconsole.log(t.startsWith("ca"));    // true\nconsole.log(t.startsWith("do"));    // true\nconsole.log(t.startsWith("dox"));   // false`,
          },
          {
            language: "python",
            label: "Python",
            code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def _walk(self, s):\n        node = self.root\n        for ch in s:\n            if ch not in node.children: return None\n            node = node.children[ch]\n        return node\n\n    def search(self, word):\n        node = self._walk(word)\n        return node is not None and node.is_end\n\n    def starts_with(self, prefix):\n        return self._walk(prefix) is not None\n\nt = Trie()\nfor w in ["cat", "car", "cap", "dog"]: t.insert(w)\nprint(t.search("cat"))        # True\nprint(t.search("ca"))         # False\nprint(t.starts_with("ca"))    # True\nprint(t.starts_with("dox"))   # False`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nstruct TrieNode {\n  unordered_map<char, TrieNode*> children;\n  bool isEnd = false;\n};\n\nclass Trie {\n  TrieNode* root = new TrieNode();\n  TrieNode* walk(const string& s) {\n    auto* n = root;\n    for (char c : s) {\n      if (!n->children.count(c)) return nullptr;\n      n = n->children[c];\n    }\n    return n;\n  }\npublic:\n  void insert(const string& w) {\n    auto* n = root;\n    for (char c : w) {\n      if (!n->children.count(c)) n->children[c] = new TrieNode();\n      n = n->children[c];\n    }\n    n->isEnd = true;\n  }\n  bool search(const string& w) { auto* n = walk(w); return n && n->isEnd; }\n  bool startsWith(const string& p) { return walk(p) != nullptr; }\n};\n\nint main() {\n  Trie t;\n  for (auto& w : {"cat", "car", "cap", "dog"}) t.insert(w);\n  cout << t.search("cat") << ' ' << t.search("ca") << ' ' << t.startsWith("ca");\n}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;\n\nclass TrieNode {\n  Map<Character, TrieNode> children = new HashMap<>();\n  boolean isEnd = false;\n}\n\nclass Trie {\n  TrieNode root = new TrieNode();\n  public void insert(String w) {\n    TrieNode n = root;\n    for (char c : w.toCharArray()) {\n      n.children.putIfAbsent(c, new TrieNode());\n      n = n.children.get(c);\n    }\n    n.isEnd = true;\n  }\n  private TrieNode walk(String s) {\n    TrieNode n = root;\n    for (char c : s.toCharArray()) {\n      n = n.children.get(c);\n      if (n == null) return null;\n    }\n    return n;\n  }\n  public boolean search(String w) { TrieNode n = walk(w); return n != null && n.isEnd; }\n  public boolean startsWith(String p) { return walk(p) != null; }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Trie t = new Trie();\n    for (String w : new String[]{"cat", "car", "cap", "dog"}) t.insert(w);\n    System.out.println(t.search("cat"));      // true\n    System.out.println(t.startsWith("ca"));   // true\n  }\n}`,
          },
        ],
        visualizationConfig: { type: "tree", defaultInput: [1, 2, 3, 4, 5] },
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
        visualizationConfig: { type: "tree", defaultInput: [1, 3, 5, 7, 9, 11] },
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
      "Graph traversals, shortest paths, MSTs, and connectivity algorithms.",
    color: "bg-indigo-500",
    topics: [
      {
        id: "bfs-dfs",
        slug: "bfs-dfs",
        title: "BFS Graph Traversal",
        difficulty: "medium",
        description:
          "Breadth-first exploration: visit every vertex in layers using a queue.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Breadth-First Search on Graphs

BFS visits vertices in **increasing order of distance** from the source, using a **FIFO queue**. It is the foundation for shortest-path-in-unweighted-graphs, level-order reasoning, bipartite checking, and crawler-style expansions.

### Algorithm
1. Enqueue the source and mark it visited.
2. While the queue is non-empty:
   - Dequeue \`u\`.
   - For every neighbor \`v\` of \`u\` not yet visited, mark it and enqueue it.
3. Optionally record a parent pointer per vertex to reconstruct paths.

### When to reach for BFS
| Problem | Why BFS |
| --- | --- |
| Shortest path in unweighted graph | First visit = fewest edges |
| Connected components | One BFS per unvisited node |
| Bipartite check | Alternate colors layer by layer |
| Word ladder, maze shortest steps | Uniform-cost expansion |

### Complexity
- **Time:** \`O(V + E)\` — each vertex and edge touched once.
- **Space:** \`O(V)\` — queue + visited set.

### Pitfalls
- Using \`array.shift()\` in JavaScript is \`O(n)\` — acceptable for small inputs, but use a real queue for large graphs.
- Forgetting to mark a neighbor visited **when enqueued** (not when dequeued) creates duplicates.
- On directed graphs, remember edges are one-way — don't traverse \`v → u\` unless the edge exists.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of graph[u] || []) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }
  return order;
}

// Demo
const graph = {
  A: ["B", "D"],
  B: ["A", "C", "E"],
  C: ["B", "E"],
  D: ["A", "E", "F"],
  E: ["B", "C", "D", "F", "G"],
  F: ["D", "E", "G"],
  G: ["E", "F"],
};
console.log(bfs(graph, "A").join(" -> "));
// A -> B -> D -> C -> E -> F -> G`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph.get(u, []):
            if v not in visited:
                visited.add(v)
                queue.append(v)
    return order

if __name__ == "__main__":
    graph = {
        "A": ["B", "D"],
        "B": ["A", "C", "E"],
        "C": ["B", "E"],
        "D": ["A", "E", "F"],
        "E": ["B", "C", "D", "F", "G"],
        "F": ["D", "E", "G"],
        "G": ["E", "F"],
    }
    print(" -> ".join(bfs(graph, "A")))
    # A -> B -> D -> C -> E -> F -> G`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

vector<int> bfs(const unordered_map<int, vector<int>>& g, int s) {
    unordered_set<int> vis{s};
    queue<int> q; q.push(s);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        auto it = g.find(u);
        if (it == g.end()) continue;
        for (int v : it->second)
            if (!vis.count(v)) { vis.insert(v); q.push(v); }
    }
    return order;
}

int main() {
    unordered_map<int, vector<int>> g = {
        {0, {1, 3}}, {1, {0, 2, 4}}, {2, {1, 4}},
        {3, {0, 4, 5}}, {4, {1, 2, 3, 5, 6}},
        {5, {3, 4, 6}}, {6, {4, 5}},
    };
    for (int x : bfs(g, 0)) cout << x << ' ';
    // 0 1 3 2 4 5 6
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class GraphBFS {
    public static List<Integer> bfs(Map<Integer, List<Integer>> g, int s) {
        Set<Integer> vis = new HashSet<>();
        Deque<Integer> q = new ArrayDeque<>();
        List<Integer> order = new ArrayList<>();
        vis.add(s); q.add(s);
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : g.getOrDefault(u, List.of()))
                if (vis.add(v)) q.add(v);
        }
        return order;
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> g = Map.of(
            0, List.of(1, 3), 1, List.of(0, 2, 4), 2, List.of(1, 4),
            3, List.of(0, 4, 5), 4, List.of(1, 2, 3, 5, 6),
            5, List.of(3, 4, 6), 6, List.of(4, 5)
        );
        System.out.println(bfs(g, 0));
        // [0, 1, 3, 2, 4, 5, 6]
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "graph-dfs",
        slug: "graph-dfs",
        title: "DFS Graph Traversal",
        difficulty: "medium",
        description:
          "Depth-first exploration: dive as deep as possible, then backtrack.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Depth-First Search on Graphs

DFS commits to one branch, explores it fully, then backtracks. It's the natural choice whenever you care about **paths, topological order, cycles, bridges, or recursion structure** rather than shortest distance.

### Two implementations
- **Recursive** — clean, matches the call-tree intuition; limited by stack depth.
- **Explicit stack** — push start; pop \`u\`; push unvisited neighbors.

### Classic applications
- Cycle detection (back-edge in an undirected DFS tree, or gray-to-gray in a directed one)
- Topological sort via reverse post-order
- Finding bridges / articulation points (Tarjan)
- Counting connected components
- Flood fill / solving mazes

### Colors trick (directed cycle detection)
- **white** = not visited
- **gray** = on the current recursion stack
- **black** = fully processed

A gray → gray edge ⇒ cycle.

### Pitfalls
- Deep graphs blow the call stack; use an iterative version for \`V > ~10 000\`.
- Don't confuse "visited" with "finished" — you need both for algorithms like SCC.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  (function visit(u) {
    visited.add(u);
    order.push(u);
    for (const v of graph[u] || [])
      if (!visited.has(v)) visit(v);
  })(start);
  return order;
}

const graph = {
  A: ["B", "D"], B: ["A", "C", "E"], C: ["B", "E"],
  D: ["A", "E", "F"], E: ["B", "C", "D", "F", "G"],
  F: ["D", "E", "G"], G: ["E", "F"],
};
console.log(dfs(graph, "A").join(" -> "));
// A -> B -> C -> E -> D -> F -> G`,
          },
          {
            language: "python",
            label: "Python",
            code: `def dfs(graph, start):
    visited, order = set(), []
    def visit(u):
        visited.add(u)
        order.append(u)
        for v in graph.get(u, []):
            if v not in visited:
                visit(v)
    visit(start)
    return order

if __name__ == "__main__":
    graph = {
        "A": ["B", "D"], "B": ["A", "C", "E"], "C": ["B", "E"],
        "D": ["A", "E", "F"], "E": ["B", "C", "D", "F", "G"],
        "F": ["D", "E", "G"], "G": ["E", "F"],
    }
    print(" -> ".join(dfs(graph, "A")))
    # A -> B -> C -> E -> D -> F -> G`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

unordered_set<int> vis;
vector<int> order_;

void dfs(const unordered_map<int, vector<int>>& g, int u) {
    vis.insert(u);
    order_.push_back(u);
    auto it = g.find(u);
    if (it == g.end()) return;
    for (int v : it->second)
        if (!vis.count(v)) dfs(g, v);
}

int main() {
    unordered_map<int, vector<int>> g = {
        {0, {1, 3}}, {1, {0, 2, 4}}, {2, {1, 4}},
        {3, {0, 4, 5}}, {4, {1, 2, 3, 5, 6}},
        {5, {3, 4, 6}}, {6, {4, 5}},
    };
    dfs(g, 0);
    for (int x : order_) cout << x << ' ';
    // 0 1 2 4 3 5 6
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class GraphDFS {
    static Set<Integer> vis = new HashSet<>();
    static List<Integer> order = new ArrayList<>();

    static void dfs(Map<Integer, List<Integer>> g, int u) {
        vis.add(u); order.add(u);
        for (int v : g.getOrDefault(u, List.of()))
            if (!vis.contains(v)) dfs(g, v);
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> g = Map.of(
            0, List.of(1, 3), 1, List.of(0, 2, 4), 2, List.of(1, 4),
            3, List.of(0, 4, 5), 4, List.of(1, 2, 3, 5, 6),
            5, List.of(3, 4, 6), 6, List.of(4, 5)
        );
        dfs(g, 0);
        System.out.println(order);
        // [0, 1, 2, 4, 3, 5, 6]
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "shortest-path-bfs",
        slug: "shortest-path-bfs",
        title: "Shortest Path (Unweighted)",
        difficulty: "medium",
        description:
          "Use BFS with a parent array to recover the minimum-edge path.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## BFS for Shortest Paths

When all edge weights are equal, **BFS gives the shortest path** — the first time a vertex is dequeued, you've reached it with the minimum number of edges.

### Pattern
1. Keep \`dist[v]\` and \`parent[v]\`. Initialize \`dist[src] = 0\`.
2. Run BFS. When you first discover \`v\` through edge \`u → v\`:
   \`\`\`
   dist[v] = dist[u] + 1
   parent[v] = u
   \`\`\`
3. To recover the path, walk \`parent\` from target back to source, then reverse.

### When to use vs Dijkstra
- **All weights equal** (unweighted, or uniform weight 1) → BFS, \`O(V+E)\`.
- **Non-negative weights, possibly different** → Dijkstra, \`O((V+E)log V)\`.
- **Weights ∈ {0, 1}** → 0-1 BFS with a deque, still \`O(V+E)\`.

### Pitfalls
- Don't mark visited at dequeue time — a later, longer path might squeeze in first.
- If target is unreachable, \`dist[target]\` stays \`-1\` / \`∞\`; handle the miss.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function shortestPath(graph, src, dst) {
  const dist = {}, parent = {};
  for (const k of Object.keys(graph)) { dist[k] = -1; parent[k] = null; }
  dist[src] = 0;
  const q = [src];
  while (q.length) {
    const u = q.shift();
    if (u === dst) break;
    for (const v of graph[u] || []) {
      if (dist[v] === -1) { dist[v] = dist[u] + 1; parent[v] = u; q.push(v); }
    }
  }
  if (dist[dst] === -1) return null;
  const path = [];
  for (let x = dst; x != null; x = parent[x]) path.push(x);
  return { length: dist[dst], path: path.reverse() };
}

const graph = {
  A: ["B", "D"], B: ["A", "C", "E"], C: ["B", "E"],
  D: ["A", "E", "F"], E: ["B", "C", "D", "F", "G"],
  F: ["D", "E", "G"], G: ["E", "F"],
};
console.log(shortestPath(graph, "A", "G"));
// { length: 3, path: ["A","D","E","G"] }`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque

def shortest_path(graph, src, dst):
    dist = {k: -1 for k in graph}
    parent = {k: None for k in graph}
    dist[src] = 0
    q = deque([src])
    while q:
        u = q.popleft()
        if u == dst: break
        for v in graph.get(u, []):
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                parent[v] = u
                q.append(v)
    if dist[dst] == -1: return None
    path, x = [], dst
    while x is not None:
        path.append(x); x = parent[x]
    return {"length": dist[dst], "path": path[::-1]}

if __name__ == "__main__":
    g = {"A": ["B","D"], "B": ["A","C","E"], "C": ["B","E"],
         "D": ["A","E","F"], "E": ["B","C","D","F","G"],
         "F": ["D","E","G"], "G": ["E","F"]}
    print(shortest_path(g, "A", "G"))
    # {'length': 3, 'path': ['A', 'D', 'E', 'G']}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

pair<int, vector<int>> shortestPath(
    const vector<vector<int>>& g, int src, int dst) {
    int n = g.size();
    vector<int> dist(n, -1), par(n, -1);
    dist[src] = 0;
    queue<int> q; q.push(src);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (u == dst) break;
        for (int v : g[u])
            if (dist[v] == -1) { dist[v] = dist[u]+1; par[v]=u; q.push(v); }
    }
    if (dist[dst] == -1) return {-1, {}};
    vector<int> path;
    for (int x = dst; x != -1; x = par[x]) path.push_back(x);
    reverse(path.begin(), path.end());
    return {dist[dst], path};
}

int main() {
    vector<vector<int>> g = {
        {1,3}, {0,2,4}, {1,4},
        {0,4,5}, {1,2,3,5,6}, {3,4,6}, {4,5}
    };
    auto [len, path] = shortestPath(g, 0, 6);
    cout << "len=" << len << " path:";
    for (int x : path) cout << ' ' << x;
    // len=3 path: 0 3 4 6
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class ShortestPathBFS {
    public static Object[] shortestPath(int[][] g, int src, int dst) {
        int n = g.length;
        int[] dist = new int[n], par = new int[n];
        Arrays.fill(dist, -1); Arrays.fill(par, -1);
        dist[src] = 0;
        Deque<Integer> q = new ArrayDeque<>();
        q.add(src);
        while (!q.isEmpty()) {
            int u = q.poll();
            if (u == dst) break;
            for (int v : g[u])
                if (dist[v] == -1) { dist[v] = dist[u]+1; par[v]=u; q.add(v); }
        }
        if (dist[dst] == -1) return new Object[]{-1, List.of()};
        List<Integer> path = new ArrayList<>();
        for (int x = dst; x != -1; x = par[x]) path.add(x);
        Collections.reverse(path);
        return new Object[]{dist[dst], path};
    }

    public static void main(String[] args) {
        int[][] g = {
            {1,3}, {0,2,4}, {1,4},
            {0,4,5}, {1,2,3,5,6}, {3,4,6}, {4,5}
        };
        Object[] r = shortestPath(g, 0, 6);
        System.out.println("len=" + r[0] + " path=" + r[1]);
        // len=3 path=[0, 3, 4, 6]
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "dijkstra",
        slug: "dijkstra",
        title: "Dijkstra's Algorithm",
        difficulty: "medium",
        description:
          "Single-source shortest paths on graphs with non-negative weights.",
        timeComplexity: "O((V + E) log V)",
        spaceComplexity: "O(V)",
        content: `## Dijkstra's Algorithm

Greedy shortest-path algorithm for graphs with **non-negative** edge weights. Repeatedly finalize the closest unvisited vertex and relax its outgoing edges.

### Core invariant
When we pop \`u\` from the priority queue with distance \`d\`, \`d\` is the final shortest distance from source to \`u\` — because all remaining candidates are at least as far.

### Algorithm
1. \`dist[src] = 0\`; everywhere else \`∞\`.
2. Push \`(0, src)\` into a min-heap.
3. Pop the smallest \`(d, u)\`. If \`d > dist[u]\`, skip (stale).
4. For each edge \`u → v\` with weight \`w\`: if \`dist[u] + w < dist[v]\`, update and push.

### Complexity
- Binary heap: \`O((V + E) log V)\`.
- Fibonacci heap: \`O(V log V + E)\` (rarely used in practice).
- Dense graphs: array-based \`O(V²)\` is sometimes faster.

### Pitfalls
- **Negative edges break it.** Use Bellman-Ford or Johnson's algorithm.
- Always check \`d > dist[u]\` before relaxing — standard heaps don't support decrease-key, so stale entries must be discarded.
- If you need *shortest path* (not just distance), keep a \`parent[v]\` array updated in step 4.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function dijkstra(graph, src) {
  const dist = {};
  for (const n of Object.keys(graph)) dist[n] = Infinity;
  dist[src] = 0;
  // Simple priority queue; for production use a real heap.
  const pq = [[0, src]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u] || []) {
      const nd = d + w;
      if (nd < dist[v]) { dist[v] = nd; pq.push([nd, v]); }
    }
  }
  return dist;
}

const graph = {
  A: [["B", 4], ["D", 1]],
  B: [["A", 4], ["C", 5], ["E", 3]],
  C: [["B", 5], ["E", 2]],
  D: [["A", 1], ["E", 2], ["F", 6]],
  E: [["B", 3], ["C", 2], ["D", 2], ["F", 4], ["G", 3]],
  F: [["D", 6], ["E", 4], ["G", 2]],
  G: [["E", 3], ["F", 2]],
};
console.log(dijkstra(graph, "A"));
// { A:0, B:4, C:5, D:1, E:3, F:7, G:6 }`,
          },
          {
            language: "python",
            label: "Python",
            code: `import heapq

def dijkstra(graph, src):
    dist = {n: float('inf') for n in graph}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

if __name__ == "__main__":
    g = {
        "A": [("B",4),("D",1)],
        "B": [("A",4),("C",5),("E",3)],
        "C": [("B",5),("E",2)],
        "D": [("A",1),("E",2),("F",6)],
        "E": [("B",3),("C",2),("D",2),("F",4),("G",3)],
        "F": [("D",6),("E",4),("G",2)],
        "G": [("E",3),("F",2)],
    }
    print(dijkstra(g, "A"))
    # {'A': 0, 'B': 4, 'C': 5, 'D': 1, 'E': 3, 'F': 7, 'G': 6}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

vector<int> dijkstra(const vector<vector<pair<int,int>>>& g, int src) {
    int n = g.size();
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : g[u]) {
            int nd = d + w;
            if (nd < dist[v]) { dist[v] = nd; pq.push({nd, v}); }
        }
    }
    return dist;
}

int main() {
    vector<vector<pair<int,int>>> g(7);
    auto add = [&](int u, int v, int w){ g[u].push_back({v,w}); g[v].push_back({u,w}); };
    add(0,1,4); add(0,3,1); add(1,2,5); add(1,4,3);
    add(2,4,2); add(3,4,2); add(3,5,6); add(4,5,4); add(4,6,3); add(5,6,2);
    for (int d : dijkstra(g, 0)) cout << d << ' ';
    // 0 4 5 1 3 7 6
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class Dijkstra {
    public static int[] dijkstra(List<int[]>[] g, int src) {
        int n = g.length;
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
        pq.add(new int[]{0, src});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;
            for (int[] e : g[u]) {
                int v = e[0], w = e[1], nd = d + w;
                if (nd < dist[v]) { dist[v] = nd; pq.add(new int[]{nd, v}); }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        int n = 7;
        List<int[]>[] g = new List[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        int[][] edges = {{0,1,4},{0,3,1},{1,2,5},{1,4,3},{2,4,2},
                         {3,4,2},{3,5,6},{4,5,4},{4,6,3},{5,6,2}};
        for (int[] e : edges) {
            g[e[0]].add(new int[]{e[1], e[2]});
            g[e[1]].add(new int[]{e[0], e[2]});
        }
        System.out.println(Arrays.toString(dijkstra(g, 0)));
        // [0, 4, 5, 1, 3, 7, 6]
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "bellman-ford",
        slug: "bellman-ford",
        title: "Bellman-Ford",
        difficulty: "medium",
        description:
          "Shortest paths that tolerates negative weights and detects negative cycles.",
        timeComplexity: "O(V · E)",
        spaceComplexity: "O(V)",
        content: `## Bellman-Ford

Unlike Dijkstra, Bellman-Ford **handles negative edge weights** and can **detect reachable negative cycles**. It's slower — \`O(V·E)\` — but unbeatable for currency-arbitrage, difference-constraints, and routing protocols (RIP).

### Algorithm
1. \`dist[src] = 0\`; everywhere else \`∞\`.
2. Repeat \`V − 1\` times:
   - For every edge \`(u → v, w)\`: if \`dist[u] + w < dist[v]\`, relax.
3. One more pass: if any edge still relaxes, there is a **negative cycle** reachable from \`src\`.

### Why \`V − 1\` iterations?
The shortest simple path uses at most \`V − 1\` edges. After \`k\` passes, \`dist[v]\` is correct for all vertices reachable in \`≤ k\` edges.

### Optimizations
- **SPFA** — queue-based variant, faster on average but still \`O(V·E)\` worst-case.
- **Early stop** — if a pass changes no distance, you're done.

### Pitfalls
- Only declares a negative cycle if it is **reachable from the source**. To detect any negative cycle in a graph, add a dummy vertex with 0-weight edges to every vertex and run from there.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function bellmanFord(n, edges, src) {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < n - 1; i++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges)
    if (dist[u] !== Infinity && dist[u] + w < dist[v])
      return { dist: null, negativeCycle: true };
  return { dist, negativeCycle: false };
}

// Edges may have negative weights
const edges = [
  [0,1,4], [0,2,5], [1,2,-3], [1,3,6], [2,3,1], [3,4,2],
];
console.log(bellmanFord(5, edges, 0));
// { dist: [0, 4, 1, 2, 4], negativeCycle: false }`,
          },
          {
            language: "python",
            label: "Python",
            code: `def bellman_ford(n, edges, src):
    INF = float('inf')
    dist = [INF]*n
    dist[src] = 0
    for _ in range(n-1):
        changed = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed: break
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            return None, True
    return dist, False

if __name__ == "__main__":
    edges = [(0,1,4),(0,2,5),(1,2,-3),(1,3,6),(2,3,1),(3,4,2)]
    print(bellman_ford(5, edges, 0))
    # ([0, 4, 1, 2, 4], False)`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

pair<vector<long long>, bool> bellmanFord(
    int n, const vector<tuple<int,int,int>>& edges, int src) {
    const long long INF = LLONG_MAX / 4;
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++) {
        bool changed = false;
        for (auto [u, v, w] : edges)
            if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
        if (!changed) break;
    }
    for (auto [u, v, w] : edges)
        if (dist[u] + w < dist[v]) return {{}, true};
    return {dist, false};
}

int main() {
    vector<tuple<int,int,int>> edges = {
        {0,1,4},{0,2,5},{1,2,-3},{1,3,6},{2,3,1},{3,4,2}
    };
    auto [d, neg] = bellmanFord(5, edges, 0);
    if (neg) cout << "neg cycle";
    else for (auto x : d) cout << x << ' ';
    // 0 4 1 2 4
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class BellmanFord {
    public static long[] bellmanFord(int n, int[][] edges, int src) {
        long INF = Long.MAX_VALUE / 4;
        long[] dist = new long[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        for (int i = 0; i < n - 1; i++) {
            boolean changed = false;
            for (int[] e : edges)
                if (dist[e[0]] + e[2] < dist[e[1]]) {
                    dist[e[1]] = dist[e[0]] + e[2]; changed = true;
                }
            if (!changed) break;
        }
        for (int[] e : edges)
            if (dist[e[0]] + e[2] < dist[e[1]])
                throw new RuntimeException("negative cycle");
        return dist;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,1,4},{0,2,5},{1,2,-3},{1,3,6},{2,3,1},{3,4,2}};
        System.out.println(Arrays.toString(bellmanFord(5, edges, 0)));
        // [0, 4, 1, 2, 4]
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "topological-sort",
        slug: "topological-sort",
        title: "Topological Sort",
        difficulty: "medium",
        description:
          "Linear ordering of DAG vertices that respects all edge directions.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Topological Sort (Kahn's Algorithm)

For a **directed acyclic graph** (DAG), a topological order \`π\` satisfies: for every edge \`u → v\`, \`π(u) < π(v)\`.

### Kahn's BFS variant
1. Compute \`inDeg[v]\` for every vertex.
2. Enqueue every vertex with \`inDeg == 0\`.
3. Loop: dequeue \`u\`, append to order, decrement \`inDeg\` of each neighbor; enqueue any that hit 0.
4. If the final order has fewer than \`V\` vertices, the graph has a cycle — no topological order exists.

### DFS variant
Run DFS; when a node finishes, prepend it to the result (or append and reverse). The finish order is a reverse topological order.

### Applications
- Build systems / Makefiles
- Course prerequisite planning
- Package dependency resolution
- Compile-time evaluation order

### Pitfalls
- Works only on DAGs; a cycle means no valid order.
- Topological order is rarely unique — any valid one is acceptable.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function topologicalSort(n, edges) {
  const inDeg = new Array(n).fill(0);
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); inDeg[v]++; }
  const queue = [];
  for (let i = 0; i < n; i++) if (inDeg[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of adj[u]) if (--inDeg[v] === 0) queue.push(v);
  }
  return order.length === n ? order : null; // null ⇒ cycle
}

// 0→C(2), 0→D(3), 1→D, C→E(4), C→F(5), D→F, E→F
const edges = [[0,2],[0,3],[1,3],[2,4],[2,5],[3,5],[4,5]];
console.log(topologicalSort(6, edges));
// e.g. [0, 1, 2, 3, 4, 5]`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque

def topo_sort(n, edges):
    in_deg = [0]*n
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v); in_deg[v] += 1
    q = deque(i for i in range(n) if in_deg[i] == 0)
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            in_deg[v] -= 1
            if in_deg[v] == 0: q.append(v)
    return order if len(order) == n else None

if __name__ == "__main__":
    edges = [(0,2),(0,3),(1,3),(2,4),(2,5),(3,5),(4,5)]
    print(topo_sort(6, edges))
    # [0, 1, 2, 3, 4, 5]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

vector<int> topoSort(int n, vector<vector<int>>& adj) {
    vector<int> inDeg(n, 0);
    for (int u = 0; u < n; u++) for (int v : adj[u]) inDeg[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++) if (!inDeg[i]) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : adj[u]) if (--inDeg[v] == 0) q.push(v);
    }
    return (int)order.size() == n ? order : vector<int>{};
}

int main() {
    vector<vector<int>> adj(6);
    int e[][2] = {{0,2},{0,3},{1,3},{2,4},{2,5},{3,5},{4,5}};
    for (auto& p : e) adj[p[0]].push_back(p[1]);
    for (int x : topoSort(6, adj)) cout << x << ' ';
    // 0 1 2 3 4 5
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class TopoSort {
    public static List<Integer> topo(int n, int[][] edges) {
        int[] inDeg = new int[n];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); inDeg[e[1]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (inDeg[i] == 0) q.add(i);
        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll(); order.add(u);
            for (int v : adj.get(u)) if (--inDeg[v] == 0) q.add(v);
        }
        return order.size() == n ? order : null;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,2},{0,3},{1,3},{2,4},{2,5},{3,5},{4,5}};
        System.out.println(topo(6, edges));
        // [0, 1, 2, 3, 4, 5]
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "union-find",
        slug: "union-find",
        title: "Union-Find (Disjoint Set)",
        difficulty: "medium",
        description:
          "Near-constant time merge/query for disjoint sets of elements.",
        timeComplexity: "O(α(n)) per op",
        spaceComplexity: "O(n)",
        content: `## Union-Find (DSU)

A data structure that maintains a partition of \`{0, …, n−1}\` into disjoint sets and supports:
- \`find(x)\` — representative of \`x\`'s set.
- \`union(x, y)\` — merge the sets containing \`x\` and \`y\`.

With **path compression + union by rank (or size)** the amortized cost per operation is \`O(α(n))\`, where α is the inverse-Ackermann function — effectively constant.

### Why it matters
- **Kruskal's MST** — accept an edge iff its endpoints live in different sets.
- **Cycle detection in undirected graphs** — iterating edges, \`union\` fails when we'd merge a set with itself.
- **Online connectivity queries** — \`"are x and y connected?"\` ⇒ \`find(x) === find(y)\`.
- **Kruskal-style clustering**, account merging, percolation.

### Pitfalls
- Without path compression **or** union by rank, worst case degrades to \`O(n)\` per op.
- \`find\` must be idempotent; bugs often come from stale parent pointers after recursion.
- For string keys, use a hash map for the parent table.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.components = n;
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x, y) {
    const a = this.find(x), b = this.find(y);
    if (a === b) return false;
    if (this.rank[a] < this.rank[b]) this.parent[a] = b;
    else if (this.rank[a] > this.rank[b]) this.parent[b] = a;
    else { this.parent[b] = a; this.rank[a]++; }
    this.components--;
    return true;
  }
}

// Demo
const uf = new UnionFind(7);
for (const [u, v] of [[0,1],[0,2],[1,2],[3,4],[5,6]]) uf.union(u, v);
console.log("components:", uf.components);  // 3
console.log("0↔2?", uf.find(0) === uf.find(2)); // true
console.log("0↔4?", uf.find(0) === uf.find(4)); // false`,
          },
          {
            language: "python",
            label: "Python",
            code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0]*n
        self.components = n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    def union(self, x, y):
        a, b = self.find(x), self.find(y)
        if a == b: return False
        if self.rank[a] < self.rank[b]: a, b = b, a
        self.parent[b] = a
        if self.rank[a] == self.rank[b]: self.rank[a] += 1
        self.components -= 1
        return True

if __name__ == "__main__":
    uf = UnionFind(7)
    for u, v in [(0,1),(0,2),(1,2),(3,4),(5,6)]: uf.union(u, v)
    print("components:", uf.components)           # 3
    print("0 ↔ 2?", uf.find(0) == uf.find(2))     # True
    print("0 ↔ 4?", uf.find(0) == uf.find(4))     # False`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

struct UnionFind {
    vector<int> par, rnk;
    int components;
    UnionFind(int n) : par(n), rnk(n, 0), components(n) {
        iota(par.begin(), par.end(), 0);
    }
    int find(int x) { return par[x] == x ? x : par[x] = find(par[x]); }
    bool unite(int x, int y) {
        int a = find(x), b = find(y);
        if (a == b) return false;
        if (rnk[a] < rnk[b]) swap(a, b);
        par[b] = a;
        if (rnk[a] == rnk[b]) rnk[a]++;
        components--;
        return true;
    }
};

int main() {
    UnionFind uf(7);
    for (auto [u, v] : vector<pair<int,int>>{{0,1},{0,2},{1,2},{3,4},{5,6}})
        uf.unite(u, v);
    cout << "components: " << uf.components << '\\n';       // 3
    cout << "0-2? " << (uf.find(0) == uf.find(2)) << '\\n';  // 1
    cout << "0-4? " << (uf.find(0) == uf.find(4)) << '\\n';  // 0
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class UnionFind {
    int[] parent, rank;
    int components;
    public UnionFind(int n) {
        parent = new int[n]; rank = new int[n]; components = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
    public boolean union(int x, int y) {
        int a = find(x), b = find(y);
        if (a == b) return false;
        if (rank[a] < rank[b]) { int t = a; a = b; b = t; }
        parent[b] = a;
        if (rank[a] == rank[b]) rank[a]++;
        components--;
        return true;
    }
    public static void main(String[] args) {
        UnionFind uf = new UnionFind(7);
        int[][] ops = {{0,1},{0,2},{1,2},{3,4},{5,6}};
        for (int[] e : ops) uf.union(e[0], e[1]);
        System.out.println("components: " + uf.components); // 3
        System.out.println("0-2? " + (uf.find(0) == uf.find(2))); // true
        System.out.println("0-4? " + (uf.find(0) == uf.find(4))); // false
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "connected-components",
        slug: "connected-components",
        title: "Connected Components",
        difficulty: "easy",
        description:
          "Count and label connected components with BFS, DFS, or union-find.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Connected Components

A connected component of an undirected graph is a maximal set of vertices mutually reachable via edges. Counting / labeling them is the backbone of countless problems (islands on a grid, social-network cliques, clustering, duplicate-group merging).

### Three common recipes
1. **BFS / DFS** — iterate vertices; whenever one is unvisited, launch a traversal from it and tag every reachable vertex with the current component id. Components = number of launches.
2. **Union-Find** — for every edge \`(u, v)\`, \`union(u, v)\`. Components = \`uf.components\`.
3. **Matrix / grid variants** — neighbors are \`(r±1, c)\` and \`(r, c±1)\`; same DFS/BFS template.

### Complexity
- BFS/DFS: \`O(V + E)\`.
- Union-Find: \`O((V + E) α(V))\`, slightly slower in constant factor but online-friendly (edges may stream in).

### Pitfalls
- Directed graphs need **strongly** connected components (Tarjan / Kosaraju) — plain BFS/DFS only finds weakly connected pieces.
- Forgetting to loop over all vertices misses components that contain the source's enemies. Always outer-loop every \`i\`.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function connectedComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const comp = new Array(n).fill(-1);
  let c = 0;
  for (let start = 0; start < n; start++) {
    if (comp[start] !== -1) continue;
    const stack = [start]; comp[start] = c;
    while (stack.length) {
      const u = stack.pop();
      for (const v of adj[u]) if (comp[v] === -1) { comp[v] = c; stack.push(v); }
    }
    c++;
  }
  return { count: c, labels: comp };
}

// 3 components: {0,1,2}, {3,4}, {5,6}
console.log(connectedComponents(7, [[0,1],[0,2],[1,2],[3,4],[5,6]]));
// { count: 3, labels: [0,0,0,1,1,2,2] }`,
          },
          {
            language: "python",
            label: "Python",
            code: `def connected_components(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    comp = [-1]*n
    c = 0
    for start in range(n):
        if comp[start] != -1: continue
        stack = [start]; comp[start] = c
        while stack:
            u = stack.pop()
            for v in adj[u]:
                if comp[v] == -1: comp[v] = c; stack.append(v)
        c += 1
    return c, comp

if __name__ == "__main__":
    print(connected_components(7, [(0,1),(0,2),(1,2),(3,4),(5,6)]))
    # (3, [0, 0, 0, 1, 1, 2, 2])`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

pair<int, vector<int>> components(int n, const vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto [u, v] : edges) { adj[u].push_back(v); adj[v].push_back(u); }
    vector<int> comp(n, -1);
    int c = 0;
    for (int s = 0; s < n; s++) {
        if (comp[s] != -1) continue;
        stack<int> st; st.push(s); comp[s] = c;
        while (!st.empty()) {
            int u = st.top(); st.pop();
            for (int v : adj[u]) if (comp[v] == -1) { comp[v]=c; st.push(v); }
        }
        c++;
    }
    return {c, comp};
}

int main() {
    auto [c, lab] = components(7, {{0,1},{0,2},{1,2},{3,4},{5,6}});
    cout << "count=" << c << " labels:";
    for (int x : lab) cout << ' ' << x;
    // count=3 labels: 0 0 0 1 1 2 2
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class ConnectedComponents {
    public static int[] components(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        int[] comp = new int[n]; Arrays.fill(comp, -1);
        int c = 0;
        for (int s = 0; s < n; s++) {
            if (comp[s] != -1) continue;
            Deque<Integer> st = new ArrayDeque<>();
            st.push(s); comp[s] = c;
            while (!st.isEmpty()) {
                int u = st.pop();
                for (int v : adj.get(u))
                    if (comp[v] == -1) { comp[v] = c; st.push(v); }
            }
            c++;
        }
        int[] out = new int[n + 1];
        out[0] = c;
        System.arraycopy(comp, 0, out, 1, n);
        return out;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,1},{0,2},{1,2},{3,4},{5,6}};
        int[] r = components(7, edges);
        System.out.println("count=" + r[0] + " labels=" +
            Arrays.toString(Arrays.copyOfRange(r, 1, r.length)));
        // count=3 labels=[0, 0, 0, 1, 1, 2, 2]
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "cycle-detection",
        slug: "cycle-detection",
        title: "Cycle Detection",
        difficulty: "medium",
        description:
          "Detect cycles in directed and undirected graphs with DFS coloring.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Cycle Detection

### Undirected graphs
DFS from every unvisited vertex. While exploring \`u\`, if we meet a neighbor \`v\` that is **already visited and is not the parent** of \`u\`, we've found a back-edge ⇒ a cycle.

### Directed graphs — 3-color DFS
- **white** — untouched.
- **gray** — currently on the recursion stack.
- **black** — fully processed.

If DFS ever tries to go from gray to gray, that gray-to-gray edge closes a directed cycle.

### Alternative for undirected graphs: Union-Find
For every edge \`(u, v)\`, \`find(u) == find(v)\` before \`union\` means the edge would close a cycle. This is how Kruskal's MST recognizes and rejects cycle edges.

### Pitfalls
- In directed graphs, **visited is not enough** — a node finished in a previous DFS tree looks identical to one still active. Use the gray/black distinction.
- Undirected: remember to skip the immediate parent. Otherwise every edge trivially looks like a cycle.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function undirectedHasCycle(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const visited = new Array(n).fill(false);
  function dfs(u, parent) {
    visited[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) { if (dfs(v, u)) return true; }
      else if (v !== parent) return true;
    }
    return false;
  }
  for (let i = 0; i < n; i++)
    if (!visited[i] && dfs(i, -1)) return true;
  return false;
}

function directedHasCycle(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const color = new Array(n).fill(0); // 0 white, 1 gray, 2 black
  function dfs(u) {
    color[u] = 1;
    for (const v of adj[u]) {
      if (color[v] === 1) return true;
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  }
  for (let i = 0; i < n; i++) if (color[i] === 0 && dfs(i)) return true;
  return false;
}

console.log(undirectedHasCycle(4, [[0,1],[1,2],[2,3],[3,0]])); // true
console.log(directedHasCycle(3, [[0,1],[1,2]]));                // false
console.log(directedHasCycle(3, [[0,1],[1,2],[2,0]]));          // true`,
          },
          {
            language: "python",
            label: "Python",
            code: `def undirected_has_cycle(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    visited = [False]*n
    def dfs(u, parent):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                if dfs(v, u): return True
            elif v != parent:
                return True
        return False
    return any(not visited[i] and dfs(i, -1) for i in range(n))

def directed_has_cycle(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges: adj[u].append(v)
    color = [0]*n  # 0 white, 1 gray, 2 black
    def dfs(u):
        color[u] = 1
        for v in adj[u]:
            if color[v] == 1: return True
            if color[v] == 0 and dfs(v): return True
        color[u] = 2
        return False
    return any(color[i] == 0 and dfs(i) for i in range(n))

if __name__ == "__main__":
    print(undirected_has_cycle(4, [(0,1),(1,2),(2,3),(3,0)]))  # True
    print(directed_has_cycle(3, [(0,1),(1,2)]))                # False
    print(directed_has_cycle(3, [(0,1),(1,2),(2,0)]))          # True`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

bool dfsDir(int u, vector<vector<int>>& adj, vector<int>& color) {
    color[u] = 1;
    for (int v : adj[u]) {
        if (color[v] == 1) return true;
        if (color[v] == 0 && dfsDir(v, adj, color)) return true;
    }
    color[u] = 2;
    return false;
}

bool directedHasCycle(int n, vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto [u, v] : edges) adj[u].push_back(v);
    vector<int> color(n, 0);
    for (int i = 0; i < n; i++)
        if (color[i] == 0 && dfsDir(i, adj, color)) return true;
    return false;
}

int main() {
    vector<pair<int,int>> a = {{0,1},{1,2}};
    vector<pair<int,int>> b = {{0,1},{1,2},{2,0}};
    cout << directedHasCycle(3, a) << ' ' << directedHasCycle(3, b);
    // 0 1
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class CycleDetection {
    static boolean dfs(int u, List<List<Integer>> adj, int[] color) {
        color[u] = 1;
        for (int v : adj.get(u)) {
            if (color[v] == 1) return true;
            if (color[v] == 0 && dfs(v, adj, color)) return true;
        }
        color[u] = 2;
        return false;
    }
    public static boolean directedHasCycle(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) adj.get(e[0]).add(e[1]);
        int[] color = new int[n];
        for (int i = 0; i < n; i++)
            if (color[i] == 0 && dfs(i, adj, color)) return true;
        return false;
    }
    public static void main(String[] args) {
        System.out.println(directedHasCycle(3, new int[][]{{0,1},{1,2}}));       // false
        System.out.println(directedHasCycle(3, new int[][]{{0,1},{1,2},{2,0}})); // true
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "bipartite-check",
        slug: "bipartite-check",
        title: "Bipartite Check",
        difficulty: "medium",
        description:
          "Decide whether a graph can be 2-colored — equivalently, contains no odd cycle.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        content: `## Is the Graph Bipartite?

A graph is **bipartite** iff it admits a valid 2-coloring: every edge connects nodes of different colors. Equivalently, it contains **no odd-length cycle**.

### BFS coloring
Launch BFS from each uncolored vertex, assigning it color 0. Each neighbor must get the opposite color. A conflict — two adjacent vertices with the same color — proves the graph is **not** bipartite.

### Why bipartiteness matters
- **Matching problems** — Hopcroft–Karp runs only on bipartite graphs.
- **Scheduling** — conflict graphs. 2-colorable ⇒ two shifts suffice.
- **Flow modeling** — flow networks often have a natural bipartite structure (left/right).
- **SAT-style reductions**.

### Pitfalls
- The graph may be **disconnected**; outer-loop every vertex, not just 0.
- Use BFS, not recursion, if the graph is deep — stack overflow otherwise.
- Mapping back from colors: nodes of color 0 form one part, color 1 the other; either is a valid "side".
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function isBipartite(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const color = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    const q = [start];
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) {
        if (color[v] === -1) { color[v] = 1 - color[u]; q.push(v); }
        else if (color[v] === color[u]) return { bipartite: false };
      }
    }
  }
  return { bipartite: true, coloring: color };
}

console.log(isBipartite(6, [[0,3],[0,4],[1,3],[1,5],[2,4],[2,5]]));
// { bipartite: true, coloring: [0,0,0,1,1,1] }
console.log(isBipartite(3, [[0,1],[1,2],[2,0]]));
// { bipartite: false }   (triangle = odd cycle)`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import deque

def is_bipartite(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    color = [-1]*n
    for start in range(n):
        if color[start] != -1: continue
        color[start] = 0
        q = deque([start])
        while q:
            u = q.popleft()
            for v in adj[u]:
                if color[v] == -1:
                    color[v] = 1 - color[u]; q.append(v)
                elif color[v] == color[u]:
                    return False, None
    return True, color

if __name__ == "__main__":
    print(is_bipartite(6, [(0,3),(0,4),(1,3),(1,5),(2,4),(2,5)]))
    # (True, [0, 0, 0, 1, 1, 1])
    print(is_bipartite(3, [(0,1),(1,2),(2,0)]))
    # (False, None)`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

bool isBipartite(int n, vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto [u,v]: edges) { adj[u].push_back(v); adj[v].push_back(u); }
    vector<int> color(n, -1);
    for (int s = 0; s < n; s++) {
        if (color[s] != -1) continue;
        color[s] = 0;
        queue<int> q; q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) { color[v] = 1 - color[u]; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}

int main() {
    vector<pair<int,int>> ok = {{0,3},{0,4},{1,3},{1,5},{2,4},{2,5}};
    vector<pair<int,int>> bad = {{0,1},{1,2},{2,0}};
    cout << isBipartite(6, ok) << ' ' << isBipartite(3, bad);
    // 1 0
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class Bipartite {
    public static boolean isBipartite(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        int[] color = new int[n]; Arrays.fill(color, -1);
        for (int s = 0; s < n; s++) {
            if (color[s] != -1) continue;
            color[s] = 0;
            Deque<Integer> q = new ArrayDeque<>(); q.add(s);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : adj.get(u)) {
                    if (color[v] == -1) { color[v] = 1 - color[u]; q.add(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }
    public static void main(String[] args) {
        int[][] ok = {{0,3},{0,4},{1,3},{1,5},{2,4},{2,5}};
        int[][] bad = {{0,1},{1,2},{2,0}};
        System.out.println(isBipartite(6, ok));  // true
        System.out.println(isBipartite(3, bad)); // false
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
      },
      {
        id: "minimum-spanning-tree",
        slug: "minimum-spanning-tree",
        title: "Minimum Spanning Tree",
        difficulty: "medium",
        description:
          "Kruskal's and Prim's: a spanning tree with the smallest total edge weight.",
        timeComplexity: "O(E log E)",
        spaceComplexity: "O(V + E)",
        content: `## Minimum Spanning Tree (MST)

Given a connected, weighted, undirected graph, an MST is a subset of \`V − 1\` edges that connects all vertices with the **smallest possible total weight**.

### Kruskal's algorithm (edge-centric + Union-Find)
1. Sort edges by weight.
2. Iterate; for each edge, \`union\` the endpoints unless they already share a set (that would create a cycle).
3. Stop when you've taken \`V − 1\` edges.

\`O(E log E)\` total, dominated by the sort.

### Prim's algorithm (vertex-centric + min-heap)
1. Start with any vertex; push its edges into a min-heap.
2. Pop the cheapest edge whose far endpoint is outside the tree; add it.
3. Push the new vertex's outgoing edges. Repeat.

\`O((V + E) log V)\` with a binary heap.

### When each wins
- **Sparse graphs** (\`E ≈ V\`): Kruskal's tends to be simpler and fast.
- **Dense graphs** (\`E ≈ V²\`): Prim's with an array (\`O(V²)\`) often beats Kruskal's.

### Pitfalls
- MSTs are **not unique** when edges share weights — any valid minimum-weight tree is correct.
- On a disconnected graph there is no MST; you get a **minimum spanning forest** (one tree per component).
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `class UnionFind {
  constructor(n) { this.p = Array.from({length:n},(_,i)=>i); this.r = new Array(n).fill(0); }
  find(x) { if (this.p[x] !== x) this.p[x] = this.find(this.p[x]); return this.p[x]; }
  union(x, y) {
    const a = this.find(x), b = this.find(y);
    if (a === b) return false;
    if (this.r[a] < this.r[b]) this.p[a] = b;
    else if (this.r[a] > this.r[b]) this.p[b] = a;
    else { this.p[b] = a; this.r[a]++; }
    return true;
  }
}

function kruskal(n, edges) {
  edges.sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  const picked = []; let cost = 0;
  for (const [u, v, w] of edges) {
    if (uf.union(u, v)) {
      picked.push([u, v, w]); cost += w;
      if (picked.length === n - 1) break;
    }
  }
  return { cost, edges: picked };
}

const edges = [
  [0,1,4],[0,3,1],[1,2,5],[1,4,3],[2,4,2],
  [3,4,2],[3,5,6],[4,5,4],[4,6,3],[5,6,2],
];
console.log(kruskal(7, edges));
// cost: 13, edges: [[0,3,1],[2,4,2],[3,4,2],[5,6,2],[1,4,3],[4,6,3]]`,
          },
          {
            language: "python",
            label: "Python",
            code: `class UF:
    def __init__(self, n): self.p = list(range(n)); self.r = [0]*n
    def find(self, x):
        while self.p[x] != x: self.p[x] = self.p[self.p[x]]; x = self.p[x]
        return x
    def union(self, x, y):
        a, b = self.find(x), self.find(y)
        if a == b: return False
        if self.r[a] < self.r[b]: a, b = b, a
        self.p[b] = a
        if self.r[a] == self.r[b]: self.r[a] += 1
        return True

def kruskal(n, edges):
    edges.sort(key=lambda e: e[2])
    uf = UF(n)
    picked, cost = [], 0
    for u, v, w in edges:
        if uf.union(u, v):
            picked.append((u, v, w)); cost += w
            if len(picked) == n - 1: break
    return cost, picked

if __name__ == "__main__":
    edges = [(0,1,4),(0,3,1),(1,2,5),(1,4,3),(2,4,2),
             (3,4,2),(3,5,6),(4,5,4),(4,6,3),(5,6,2)]
    print(kruskal(7, edges))
    # (13, [(0,3,1),(2,4,2),(3,4,2),(5,6,2),(1,4,3),(4,6,3)])`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

struct UF {
    vector<int> p, r;
    UF(int n) : p(n), r(n,0) { iota(p.begin(), p.end(), 0); }
    int find(int x){ return p[x]==x?x:p[x]=find(p[x]); }
    bool unite(int x, int y){
        int a=find(x), b=find(y);
        if (a==b) return false;
        if (r[a]<r[b]) swap(a,b);
        p[b]=a; if (r[a]==r[b]) r[a]++;
        return true;
    }
};

int kruskal(int n, vector<tuple<int,int,int>> edges) {
    sort(edges.begin(), edges.end(),
        [](auto& a, auto& b){ return get<2>(a) < get<2>(b); });
    UF uf(n);
    int cost = 0, taken = 0;
    for (auto [u, v, w] : edges)
        if (uf.unite(u, v)) { cost += w; if (++taken == n-1) break; }
    return cost;
}

int main() {
    vector<tuple<int,int,int>> edges = {
        {0,1,4},{0,3,1},{1,2,5},{1,4,3},{2,4,2},
        {3,4,2},{3,5,6},{4,5,4},{4,6,3},{5,6,2}
    };
    cout << kruskal(7, edges); // 13
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class Kruskal {
    static int[] p, r;
    static int find(int x) { while (p[x]!=x){p[x]=p[p[x]]; x=p[x];} return x; }
    static boolean union(int x, int y) {
        int a=find(x), b=find(y);
        if (a==b) return false;
        if (r[a]<r[b]) { int t=a; a=b; b=t; }
        p[b]=a; if (r[a]==r[b]) r[a]++;
        return true;
    }
    public static int kruskal(int n, int[][] edges) {
        Arrays.sort(edges, (x,y) -> x[2]-y[2]);
        p = new int[n]; r = new int[n];
        for (int i=0;i<n;i++) p[i]=i;
        int cost=0, taken=0;
        for (int[] e : edges)
            if (union(e[0], e[1])) { cost+=e[2]; if (++taken==n-1) break; }
        return cost;
    }
    public static void main(String[] args) {
        int[][] edges = {
            {0,1,4},{0,3,1},{1,2,5},{1,4,3},{2,4,2},
            {3,4,2},{3,5,6},{4,5,4},{4,6,3},{5,6,2}
        };
        System.out.println(kruskal(7, edges)); // 13
    }
}`,
          },
        ],
        visualizationConfig: { type: "graph", defaultInput: [] },
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
        description:
          "How memoization and tabulation turn exponential recursion into linear DP.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) rolling / O(n) table",
        content: `## Dynamic Programming — the mental model

DP applies to problems with:
1. **Optimal substructure** — an optimal solution composes cleanly out of optimal solutions of smaller subproblems.
2. **Overlapping subproblems** — the same subproblem is revisited over and over by naive recursion.

Cache each subproblem once, and the exponential blow-up collapses into polynomial work.

### Two styles
| Style | Direction | Data structure | Upside |
| --- | --- | --- | --- |
| **Top-down (memo)** | Recurse from the answer | Hash map / array cache | Mirrors recurrence; only computes needed subproblems |
| **Bottom-up (tabulation)** | Build from base cases | Array / table | No recursion; easy to roll space |

### A clean recipe
1. **Define the state.** Usually "dp[i] = answer for the first i items" or "dp[i][j] = answer for a 2-axis subproblem".
2. **Write the recurrence.** What choice/transition leads from smaller states to the current one?
3. **Pin the base cases.** dp[0], dp[0][*], dp[*][0] …
4. **Pick an order** so each state reads only already-computed dependencies.
5. **(Optional) roll space.** If only the last row/col is needed, collapse to 1D.

### Fibonacci — the canonical example
- Naive recursion: \`O(2^n)\` with many repeated calls.
- Memoized: \`O(n)\` time, \`O(n)\` space.
- Tabulated with two rolling variables: \`O(n)\` time, \`O(1)\` space.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function fibMemo(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const val = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, val);
  return val;
}

function fibRolling(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

console.log(fibMemo(30));     // 832040
console.log(fibRolling(30));  // 832040`,
          },
          {
            language: "python",
            label: "Python",
            code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1: return n
    return fib_memo(n-1) + fib_memo(n-2)

def fib_rolling(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b

if __name__ == "__main__":
    print(fib_memo(30))      # 832040
    print(fib_rolling(30))   # 832040`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

long long fibRolling(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) { long long c = a + b; a = b; b = c; }
    return b;
}

int main() {
    cout << fibRolling(30); // 832040
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class Fib {
    public static long fib(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) { long c = a + b; a = b; b = c; }
        return b;
    }
    public static void main(String[] args) {
        System.out.println(fib(30)); // 832040
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "climbing-stairs",
        slug: "climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "easy",
        description:
          "Count ways to reach the top taking 1 or 2 steps at a time.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) rolling",
        content: `## Climbing Stairs

At step \`i\` you arrived either by taking a **1-step** from \`i-1\` or a **2-step** from \`i-2\`. Hence:

$$ways(i) = ways(i-1) + ways(i-2)$$

This is literally Fibonacci shifted by one, but framed as a counting recurrence — the classic gateway into DP thinking.

### Why it matters
- Teaches the "count the ways" template: every DP *counting* problem is some variation of summing over disjoint last moves.
- Shows how to collapse \`O(n)\` space into \`O(1)\` by keeping only the two latest values.

### Variations
- **K-step stairs:** \`ways(i) = Σ ways(i-j)\` for \`j ∈ steps[]\`.
- **With cost (min-cost stairs):** min instead of sum.
- **Forbidden steps:** set certain \`ways(i) = 0\`.

### Pitfall
For \`n > 92\` the answer overflows JS \`number\` / C++ \`long long\`. Use \`BigInt\` / big-integer libraries when the problem allows arbitrary \`n\`.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function climbStairs(n) {
  if (n <= 1) return 1;
  let a = 1, b = 1;  // ways(0), ways(1)
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

for (let n = 1; n <= 6; n++) console.log(\`n=\${n} → \${climbStairs(n)}\`);
// n=1 → 1, n=2 → 2, n=3 → 3, n=4 → 5, n=5 → 8, n=6 → 13`,
          },
          {
            language: "python",
            label: "Python",
            code: `def climb_stairs(n):
    if n <= 1: return 1
    a, b = 1, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b

if __name__ == "__main__":
    for n in range(1, 7):
        print(f"n={n} → {climb_stairs(n)}")
    # 1, 2, 3, 5, 8, 13`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    if (n <= 1) return 1;
    int a = 1, b = 1;
    for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
}

int main() {
    for (int n = 1; n <= 6; n++) cout << climbStairs(n) << ' ';
    // 1 2 3 5 8 13
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class ClimbStairs {
    public static int climb(int n) {
        if (n <= 1) return 1;
        int a = 1, b = 1;
        for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }
        return b;
    }
    public static void main(String[] args) {
        for (int n = 1; n <= 6; n++) System.out.print(climb(n) + " ");
        // 1 2 3 5 8 13
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "kadanes-dp",
        slug: "kadanes-dp",
        title: "Kadane's Algorithm (Max Subarray)",
        difficulty: "easy",
        description:
          "Maximum contiguous subarray sum in linear time — a pure DP on a single rolling variable.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Kadane's Algorithm

Find the contiguous subarray with the largest sum.

### DP state
\`dp[i] = \` max sum of a contiguous subarray **ending at index i**.

$$dp[i] = \\max(nums[i],\\;dp[i-1] + nums[i])$$

Either extend the previous running sum, or start fresh at \`i\`. The global answer is \`max(dp[0..n-1])\`.

Since \`dp[i]\` only reads \`dp[i-1]\`, we keep a single rolling \`cur\` variable.

### Why it's interesting
- One of the cleanest DP templates — entire algorithm fits in a single loop.
- Generalizes: circular max subarray, max product subarray, 2D max sub-rectangle.
- Built-in edge case: what if all numbers are negative? \`max\` still returns the least-negative element. Exactly what's expected.

### Pitfalls
- Confusing "subarray" (contiguous) with "subsequence" (any order).
- When all elements are negative, **return the maximum element**, not 0.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6  (subarray [4, -1, 2, 1])
console.log(maxSubArray([-3, -1, -4]));                    // -1`,
          },
          {
            language: "python",
            label: "Python",
            code: `def max_sub_array(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best

if __name__ == "__main__":
    print(max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6
    print(max_sub_array([-3, -1, -4]))                     # -1`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}

int main() {
    vector<int> v = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << maxSubArray(v); // 6
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class Kadane {
    public static int maxSubArray(int[] nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
    public static void main(String[] args) {
        int[] v = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println(maxSubArray(v)); // 6
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "house-robber",
        slug: "house-robber",
        title: "House Robber",
        difficulty: "medium",
        description:
          "Maximize loot along a row of houses — you cannot rob two adjacent houses.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) rolling",
        content: `## House Robber

At each house you **pick one of two last moves**:
- **Rob house \`i\`** ⇒ previous loot must end at \`i-2\`: \`dp[i-2] + nums[i]\`.
- **Skip house \`i\`** ⇒ previous best: \`dp[i-1]\`.

$$dp[i] = \\max(dp[i-1],\\;dp[i-2] + nums[i])$$

### The decision framing
Almost every 1-D selection DP follows the same "take or skip" shape. Once you internalize this, problems like:
- **House Robber II** (houses in a circle) ⇒ split into two linear cases.
- **Delete and Earn** ⇒ collapse duplicate values, then reduce to House Robber.
- **Paint Fence** ⇒ "same as last" vs "different from last".

…all become 15-line programs.

### Complexity
- \`dp\` can be reduced to two rolling variables.

### Pitfalls
- **Circular variant:** run DP twice (exclude first, exclude last) and take the max.
- **Empty input:** \`nums.length === 0\` ⇒ return 0 before indexing.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function rob(nums) {
  if (!nums.length) return 0;
  let prev2 = 0, prev1 = 0;
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1; prev1 = cur;
  }
  return prev1;
}

console.log(rob([2, 7, 9, 3, 1, 8, 5])); // 21  (7 + 9 + ... actually 2+9+1+... pick 7+3+8 = 18? let's re-check)
// Best plan: skip 2, take 7; skip 9, take 3? no. Actual optimal = 2+9+1+5 or 2+9+8 = 19, or 7+3+8 = 18.
// Algorithm finds: 2+9+1+5 = 17 or 2+9+8 = 19. Returns 19.`,
          },
          {
            language: "python",
            label: "Python",
            code: `def rob(nums):
    prev2 = prev1 = 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1

if __name__ == "__main__":
    print(rob([2, 7, 9, 3, 1, 8, 5]))   # 19
    print(rob([2, 1, 1, 2]))            # 4`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = max(prev1, prev2 + x);
        prev2 = prev1; prev1 = cur;
    }
    return prev1;
}

int main() {
    vector<int> v = {2, 7, 9, 3, 1, 8, 5};
    cout << rob(v); // 19
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class HouseRobber {
    public static int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);
            prev2 = prev1; prev1 = cur;
        }
        return prev1;
    }
    public static void main(String[] args) {
        System.out.println(rob(new int[]{2, 7, 9, 3, 1, 8, 5})); // 19
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "coin-change",
        slug: "coin-change",
        title: "Coin Change (min coins)",
        difficulty: "medium",
        description: "Fewest coins that add up to a target amount.",
        timeComplexity: "O(n × amount)",
        spaceComplexity: "O(amount)",
        content: `## Coin Change

Given denominations \`coins[]\` (unlimited supply each) and a target \`amount\`, find the **minimum number of coins** that sum to the target, or \`-1\` if impossible.

### State + recurrence
\`dp[a] = \` min coins to reach amount \`a\`.

$$dp[a] = 1 + \\min_{c \\in coins,\\; c \\le a} dp[a - c]$$

Base: \`dp[0] = 0\`; everywhere else initialize to ∞.

### Why the order matters
In the unbounded variant, iterating **amount in the outer loop** (or coin-outer with inner ascending) keeps the solution unbounded — each coin can be re-used. For 0/1 (each coin once), iterate capacity **descending** like 0/1 Knapsack.

### Variants
- **Count the ways** instead of min coins: same DP shape, addition instead of \`1 + min\`.
- **Coin Change II**: number of combinations summing to amount.
- **Minimum coins with a fixed limit per coin**: turns into bounded knapsack.

### Pitfalls
- Don't return \`dp[amount]\` when it's still \`∞\` — output \`-1\`.
- Beware of \`amount = 0\`: answer is \`0\`, not \`-1\`.
- Watch for overflow in C++: guard \`dp[a-c] != INT_MAX\` before adding 1.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 2, 5], 11)); // 3  (5 + 5 + 1)
console.log(coinChange([2], 3));         // -1
console.log(coinChange([1], 0));         // 0`,
          },
          {
            language: "python",
            label: "Python",
            code: `def coin_change(coins, amount):
    INF = float('inf')
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return -1 if dp[amount] == INF else dp[amount]

if __name__ == "__main__":
    print(coin_change([1, 2, 5], 11))  # 3
    print(coin_change([2], 3))          # -1
    print(coin_change([1], 0))          # 0`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a && dp[a - c] != INT_MAX)
                dp[a] = min(dp[a], dp[a - c] + 1);
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}

int main() {
    vector<int> c = {1, 2, 5};
    cout << coinChange(c, 11); // 3
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class CoinChange {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a && dp[a - c] != Integer.MAX_VALUE)
                    dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1, 2, 5}, 11)); // 3
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "longest-increasing-subsequence",
        slug: "longest-increasing-subsequence",
        title: "Longest Increasing Subsequence",
        difficulty: "medium",
        description:
          "Longest strictly-increasing subsequence — O(n²) DP and O(n log n) patience trick.",
        timeComplexity: "O(n²) DP · O(n log n) patience",
        spaceComplexity: "O(n)",
        content: `## Longest Increasing Subsequence

### O(n²) DP
\`dp[i] = \` length of LIS ending exactly at index \`i\`.

$$dp[i] = 1 + \\max\\{\\,dp[j] : j < i,\\; nums[j] < nums[i]\\,\\}$$

Answer: \`max(dp)\`.

### O(n log n) patience sorting
Maintain \`tails[]\` where \`tails[k]\` = smallest tail of any LIS of length \`k+1\` seen so far.
- For each \`x\`, binary-search the leftmost \`tails[k] ≥ x\`.
- If found, replace; if not, append.
- Final \`tails.length\` = LIS length.

\`tails\` is not itself a valid LIS, but its length is correct.

### Why patience sorting works
By keeping \`tails\` as small as possible per length, any future value has the best chance of extending **some** length, so no opportunity is lost.

### Variants
- **LIS reconstruction:** keep parent pointers alongside DP.
- **Longest non-decreasing subsequence:** switch to \`bisect_right\`.
- **Count the number of LIS:** track counts beside lengths.

### Pitfalls
- Binary search for **lower-bound**, not upper-bound, when subsequence must be **strictly** increasing.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
    if (lo === tails.length) tails.push(x);
  }
  // tails.length counts, but tails itself may NOT be an actual LIS.
  return tails.length;
}

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3]));           // 4
console.log(lengthOfLIS([7, 7, 7, 7]));                 // 1`,
          },
          {
            language: "python",
            label: "Python",
            code: `from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for x in nums:
        pos = bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)

if __name__ == "__main__":
    print(length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]))  # 4
    print(length_of_lis([0, 1, 0, 3, 2, 3]))            # 4
    print(length_of_lis([7, 7, 7, 7]))                  # 1`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}

int main() {
    vector<int> v = {10, 9, 2, 5, 3, 7, 101, 18};
    cout << lengthOfLIS(v); // 4
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class LIS {
    public static int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int x : nums) {
            int lo = 0, hi = tails.size();
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails.get(mid) < x) lo = mid + 1; else hi = mid;
            }
            if (lo == tails.size()) tails.add(x);
            else tails.set(lo, x);
        }
        return tails.size();
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLIS(new int[]{10, 9, 2, 5, 3, 7, 101, 18})); // 4
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "knapsack",
        slug: "knapsack",
        title: "0/1 Knapsack",
        difficulty: "medium",
        description:
          "Maximize value picking a subset of items under a weight budget — each item taken at most once.",
        timeComplexity: "O(n × W)",
        spaceComplexity: "O(W) rolled",
        content: `## 0/1 Knapsack

You have \`n\` items with weights \`w[i]\` and values \`v[i]\`, and a knapsack of capacity \`W\`. Select a subset maximizing total value with \`Σ w[i] ≤ W\`. Each item is either in or out — **0 or 1**.

### State + recurrence
\`dp[i][c] = \` max value achievable using the first \`i\` items with capacity \`c\`.

$$dp[i][c] = \\begin{cases} dp[i-1][c] & c < w_i \\\\[2pt] \\max(dp[i-1][c],\\; dp[i-1][c - w_i] + v_i) & c \\ge w_i \\end{cases}$$

Answer: \`dp[n][W]\`.

### Space rolling — one 1D array
Because \`dp[i][c]\` only reads \`dp[i-1][*]\`, drop the first dimension. The trick is iterating \`c\` **from W down to w[i]** so the "previous row" entries aren't overwritten before being read.

### Sibling problems (same template)
- **Subset Sum / Partition Equal Subset Sum** — boolean DP.
- **Target Sum** — shift by total to reuse subset-sum.
- **Bounded Knapsack** — decompose counts into powers of two.
- **Unbounded Knapsack / Coin Change II** — loop \`c\` ascending instead.

### Pitfalls
- Looping \`c\` ascending in the 1D version silently turns 0/1 knapsack into **unbounded**.
- \`O(n·W)\` is **pseudo-polynomial**: big \`W\` is bad. With huge capacity + small items, switch to value-DP.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function knapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let c = capacity; c >= weights[i]; c--) {
      dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}

const weights = [2, 3, 4, 5];
const values  = [3, 4, 5, 6];
console.log(knapsack(weights, values, 5));  // 7  (items 0 + 1)
console.log(knapsack(weights, values, 8));  // 10 (items 1 + 2 or 0 + 2)`,
          },
          {
            language: "python",
            label: "Python",
            code: `def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for w, v in zip(weights, values):
        for c in range(capacity, w - 1, -1):
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[capacity]

if __name__ == "__main__":
    print(knapsack([2,3,4,5], [3,4,5,6], 5))  # 7
    print(knapsack([2,3,4,5], [3,4,5,6], 8))  # 10`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int knapsack(vector<int>& wt, vector<int>& val, int W) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < (int)wt.size(); i++)
        for (int c = W; c >= wt[i]; c--)
            dp[c] = max(dp[c], dp[c - wt[i]] + val[i]);
    return dp[W];
}

int main() {
    vector<int> w = {2,3,4,5}, v = {3,4,5,6};
    cout << knapsack(w, v, 8); // 10
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class Knapsack {
    public static int knapsack(int[] wt, int[] val, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++)
            for (int c = W; c >= wt[i]; c--)
                dp[c] = Math.max(dp[c], dp[c - wt[i]] + val[i]);
        return dp[W];
    }

    public static void main(String[] args) {
        System.out.println(knapsack(new int[]{2,3,4,5}, new int[]{3,4,5,6}, 8)); // 10
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "partition-equal-subset-sum",
        slug: "partition-equal-subset-sum",
        title: "Partition Equal Subset Sum",
        difficulty: "medium",
        description:
          "Can the array be split into two subsets with equal sum? A boolean flavor of subset-sum DP.",
        timeComplexity: "O(n × sum / 2)",
        spaceComplexity: "O(sum / 2)",
        content: `## Partition Equal Subset Sum

Given \`nums\`, decide whether it can be partitioned into two subsets with equal sums.

### Reduction
Let \`total = Σ nums\`. If \`total\` is odd, answer is \`false\`. Otherwise we need a subset summing to \`total / 2\` — **subset-sum**, a boolean flavor of 0/1 knapsack.

### State + recurrence
\`dp[i][s] = \` can we reach sum \`s\` using first \`i\` numbers?

$$dp[i][s] = dp[i-1][s] \\;\\lor\\; (s \\ge nums_i \\;\\land\\; dp[i-1][s - nums_i])$$

Again rollable to a 1D boolean array with \`s\` iterating **downward**.

### Why bitwise rolling beats arrays
Encode \`dp\` as a bitset of length \`target + 1\`. Each new number becomes:

\`\`\`
dp |= dp << num;
\`\`\`

Cuts constants by 32× or 64× and often turns TLE into AC on large inputs.

### Pitfalls
- Don't forget to early-exit when \`total\` is odd.
- \`target\` can be large; guard against \`O(n · sum)\` explosion (\`sum ≤ 10^5\` typically).
- When array has huge single element > target/2, answer is immediately \`false\`.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function canPartition(nums) {
  const total = nums.reduce((s, x) => s + x, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let s = target; s >= x; s--) {
      if (dp[s - x]) dp[s] = true;
    }
    if (dp[target]) return true;
  }
  return dp[target];
}

console.log(canPartition([1, 5, 11, 5])); // true  ({1,5,5} & {11})
console.log(canPartition([1, 2, 3, 5]));  // false`,
          },
          {
            language: "python",
            label: "Python",
            code: `def can_partition(nums):
    total = sum(nums)
    if total % 2: return False
    target = total // 2
    # Use an int as a bitset: bit k is 1 iff sum k is reachable.
    dp = 1  # bit 0 set
    for x in nums:
        dp |= dp << x
        if (dp >> target) & 1:
            return True
    return bool((dp >> target) & 1)

if __name__ == "__main__":
    print(can_partition([1, 5, 11, 5]))  # True
    print(can_partition([1, 2, 3, 5]))   # False`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total & 1) return false;
    int target = total / 2;
    bitset<10001> dp; dp[0] = 1;
    for (int x : nums) dp |= (dp << x);
    return dp[target];
}

int main() {
    vector<int> a = {1, 5, 11, 5};
    cout << boolalpha << canPartition(a); // true
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class PartitionSum {
    public static boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        if ((total & 1) != 0) return false;
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums)
            for (int s = target; s >= x; s--)
                if (dp[s - x]) dp[s] = true;
        return dp[target];
    }

    public static void main(String[] args) {
        System.out.println(canPartition(new int[]{1, 5, 11, 5})); // true
        System.out.println(canPartition(new int[]{1, 2, 3, 5}));  // false
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "unique-paths",
        slug: "unique-paths",
        title: "Unique Paths",
        difficulty: "medium",
        description:
          "Count monotone paths from top-left to bottom-right of an m × n grid.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(n) rolled",
        content: `## Unique Paths

Robot starts at \`(0, 0)\`, may move only **right** or **down**, must reach \`(m-1, n-1)\`. How many distinct paths exist?

### Recurrence
\`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`, with row 0 and column 0 equal to 1 (only one path along the border).

### Closed form
$$ C(m+n-2,\\; m-1) $$

…the number of ways to interleave \`m-1\` downs and \`n-1\` rights. Good for a follow-up "can you do better than DP" answer.

### Variants
- **Unique Paths II** — obstacles in the grid zero out certain \`dp[i][j]\`.
- **Minimum path sum** — replace \`+\` with \`min\`, add \`grid[i][j]\`.
- **Dungeon game** — solve bottom-up with min-HP targeting.
- **Paths with at most k turns / specific blocks** — add dimensions to state.

### Pitfalls
- \`m\` or \`n\` = 1 ⇒ exactly one path; make sure your loop handles that.
- The pure DP is \`O(mn)\` space; roll to 1D \`O(n)\` by updating in place left-to-right.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      dp[j] += dp[j - 1];
  return dp[n - 1];
}

console.log(uniquePaths(3, 7));  // 28
console.log(uniquePaths(3, 2));  // 3
console.log(uniquePaths(1, 1));  // 1`,
          },
          {
            language: "python",
            label: "Python",
            code: `def unique_paths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[-1]

if __name__ == "__main__":
    print(unique_paths(3, 7))  # 28
    print(unique_paths(3, 2))  # 3`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}

int main() {
    cout << uniquePaths(3, 7); // 28
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class UniquePaths {
    public static int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        java.util.Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j - 1];
        return dp[n - 1];
    }
    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 7)); // 28
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "longest-common-subsequence",
        slug: "longest-common-subsequence",
        title: "Longest Common Subsequence",
        difficulty: "medium",
        description:
          "Longest string that appears as a subsequence of both inputs — the workhorse 2D DP.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n) · O(min(m,n)) rolled",
        content: `## Longest Common Subsequence (LCS)

Given two strings \`a\` and \`b\`, find the longest string that is a subsequence of both.

### Recurrence
\`dp[i][j] = \` LCS length of \`a[0..i-1]\` and \`b[0..j-1]\`.

$$dp[i][j] = \\begin{cases} 1 + dp[i-1][j-1] & a_{i-1} = b_{j-1} \\\\[2pt] \\max(dp[i-1][j],\\; dp[i][j-1]) & \\text{otherwise} \\end{cases}$$

### Reconstruction
Walk the table from \`(m, n)\` toward \`(0, 0)\`:
- If \`a[i-1] == b[j-1]\` prepend the char and move to \`(i-1, j-1)\`.
- Else move to the larger of \`dp[i-1][j]\` / \`dp[i][j-1]\`.

### Space rolling
Only two rows are ever needed; roll into \`O(min(m, n))\`.

### Applications
- **diff / patch** (row-by-row LCS on lines).
- **Edit distance** (a close cousin, different cost model).
- **DNA alignment** (LCS-like with scoring matrices — Needleman–Wunsch).
- **Longest palindromic subsequence** — LCS of string with its reverse.

### Pitfalls
- Subsequence ≠ substring. \`"abc"\` is a subsequence of \`"axbycz"\` but not a substring.
- When reconstructing, multiple LCSs of the same length can exist; any is valid.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function longestCommonSubsequence(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  // Reconstruct
  let i = m, j = n, out = "";
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { out = a[i - 1] + out; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
  }
  return { length: dp[m][n], lcs: out };
}

console.log(longestCommonSubsequence("ABCBDAB", "BDCAB"));
// { length: 4, lcs: "BCAB"  (or "BDAB") }`,
          },
          {
            language: "python",
            label: "Python",
            code: `def longest_common_subsequence(a, b):
    m, n = len(a), len(b)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            dp[i][j] = dp[i-1][j-1] + 1 if a[i-1] == b[j-1] \\
                else max(dp[i-1][j], dp[i][j-1])
    # Reconstruct
    i, j, out = m, n, []
    while i and j:
        if a[i-1] == b[j-1]: out.append(a[i-1]); i -= 1; j -= 1
        elif dp[i-1][j] >= dp[i][j-1]: i -= 1
        else: j -= 1
    return dp[m][n], ''.join(reversed(out))

if __name__ == "__main__":
    print(longest_common_subsequence("ABCBDAB", "BDCAB"))
    # (4, 'BCAB')`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

pair<int,string> lcs(const string& a, const string& b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = a[i-1] == b[j-1]
                ? dp[i-1][j-1] + 1
                : max(dp[i-1][j], dp[i][j-1]);
    string out;
    int i = m, j = n;
    while (i && j) {
        if (a[i-1] == b[j-1]) { out += a[i-1]; i--; j--; }
        else if (dp[i-1][j] >= dp[i][j-1]) i--; else j--;
    }
    reverse(out.begin(), out.end());
    return {dp[m][n], out};
}

int main() {
    auto [len, s] = lcs("ABCBDAB", "BDCAB");
    cout << len << ' ' << s; // 4 BCAB
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class LCS {
    public static String[] lcs(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m+1][n+1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = a.charAt(i-1) == b.charAt(j-1)
                    ? dp[i-1][j-1] + 1
                    : Math.max(dp[i-1][j], dp[i][j-1]);
        StringBuilder sb = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (a.charAt(i-1) == b.charAt(j-1)) { sb.append(a.charAt(i-1)); i--; j--; }
            else if (dp[i-1][j] >= dp[i][j-1]) i--; else j--;
        }
        return new String[]{ String.valueOf(dp[m][n]), sb.reverse().toString() };
    }
    public static void main(String[] args) {
        String[] r = lcs("ABCBDAB", "BDCAB");
        System.out.println(r[0] + " " + r[1]); // 4 BCAB
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
      },
      {
        id: "edit-distance",
        slug: "edit-distance",
        title: "Edit Distance (Levenshtein)",
        difficulty: "hard",
        description:
          "Minimum single-character edits to transform string A into string B.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n) · O(min(m,n)) rolled",
        content: `## Edit Distance

Convert string \`a\` into string \`b\` using **insert**, **delete**, and **replace** operations, each costing 1. What is the minimum total cost?

### State + recurrence
\`dp[i][j] = \` edit distance between \`a[0..i-1]\` and \`b[0..j-1]\`.

Base cases:
- \`dp[0][j] = j\` (j inserts)
- \`dp[i][0] = i\` (i deletes)

Transition:

$$dp[i][j] = \\begin{cases} dp[i-1][j-1] & a_{i-1} = b_{j-1} \\\\[2pt] 1 + \\min\\bigl(dp[i-1][j],\\; dp[i][j-1],\\; dp[i-1][j-1]\\bigr) & \\text{otherwise} \\end{cases}$$

Those three options correspond to: **delete**, **insert**, **replace**.

### Applications
- **Spell checkers / autocorrect** — rank candidates by distance.
- **DNA alignment** with scoring matrices.
- **diff tools** — bound the min number of line edits.
- **Fuzzy search / typo-tolerant lookup**.

### Optimizations
- **Rolling rows** drops space to \`O(min(m, n))\`.
- **Hirschberg's algorithm** recovers the alignment in \`O(m·n)\` time with \`O(m + n)\` space.
- **Bit-parallel Myers' algorithm** hits \`O(mn / 64)\` — the fastest known for strict Levenshtein.

### Pitfalls
- Weighted variants (different costs for insert/delete/replace) need the cost baked into the recurrence — don't just multiply at the end.
- Replace-only distance (no insert/delete) is **Hamming distance**, not Levenshtein.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    new Array(n + 1).fill(0).map((_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

console.log(editDistance("horse", "ros"));     // 3  (horse → rorse → rose → ros)
console.log(editDistance("intention", "execution")); // 5
console.log(editDistance("", "abc"));          // 3`,
          },
          {
            language: "python",
            label: "Python",
            code: `def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]

if __name__ == "__main__":
    print(edit_distance("horse", "ros"))           # 3
    print(edit_distance("intention", "execution")) # 5`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int editDistance(const string& a, const string& b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = a[i-1] == b[j-1]
                ? dp[i-1][j-1]
                : 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
    return dp[m][n];
}

int main() {
    cout << editDistance("horse", "ros") << ' '
         << editDistance("intention", "execution");
    // 3 5
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class EditDistance {
    public static int editDistance(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m+1][n+1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = a.charAt(i-1) == b.charAt(j-1)
                    ? dp[i-1][j-1]
                    : 1 + Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]);
        return dp[m][n];
    }
    public static void main(String[] args) {
        System.out.println(editDistance("horse", "ros"));           // 3
        System.out.println(editDistance("intention", "execution")); // 5
    }
}`,
          },
        ],
        visualizationConfig: { type: "dp", defaultInput: [] },
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
      "Make the locally optimal choice at each step and prove it yields the global optimum.",
    color: "bg-amber-500",
    topics: [
      {
        id: "greedy-introduction",
        slug: "greedy-introduction",
        title: "Greedy Mental Model",
        difficulty: "easy",
        description:
          "When do local choices sum to a global optimum — and when do they fail?",
        timeComplexity: "Usually O(n log n) (sort + scan)",
        spaceComplexity: "O(1) – O(n)",
        content: `## Greedy — when local optimum = global optimum

A **greedy algorithm** builds the answer by committing, at each step, to the choice that looks best *right now*. No backtracking, no lookahead. This only works when the problem has:

1. **Greedy choice property** — there exists an optimal solution that begins with some locally optimal step.
2. **Optimal substructure** — after making that step, the remaining subproblem is of the same shape.

### Proof techniques you'll keep using
- **Exchange argument:** assume any optimal solution differs from the greedy; swap the first differing element *into* the greedy choice and show total value can't decrease.
- **Stay-ahead:** prove that after \`k\` steps greedy has a weakly-better partial solution than any other.

### When greedy **fails**
- **0/1 Knapsack** (must take whole items). The ratio-greedy picks the best ratio first but can leave waste — needs DP.
- **Coin change with arbitrary denominations** (e.g. \`[1, 3, 4]\`, target 6). Greedy picks 4+1+1 (3 coins); DP finds 3+3 (2 coins).
- **Longest path** in a graph. Greedy local decisions can trap you.

### When greedy **works** (rule of thumb)
- Problem reduces to sorting + one pass.
- A clean exchange argument exists.
- The underlying structure is a **matroid** (activity selection, Kruskal's MST).

### Recipe
1. Try a handful of candidate greedy rules on small cases.
2. Look for a counterexample before coding.
3. If none appears, write the exchange argument before calling it correct.
4. Otherwise fall back to DP or search.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Canonical counterexample: greedy coin change fails on [1, 3, 4], target 6.
function greedyCoins(coins, amount) {
  coins = [...coins].sort((a, b) => b - a);
  const picked = [];
  for (const c of coins) while (amount >= c) { picked.push(c); amount -= c; }
  return amount === 0 ? picked : null;
}

console.log(greedyCoins([1, 3, 4], 6));   // [4, 1, 1]   → 3 coins (suboptimal!)
console.log(greedyCoins([1, 5, 10, 25], 30)); // [25, 5]  → 2 coins (optimal)
// Greedy matches DP only when denominations form a "canonical" system.`,
          },
          {
            language: "python",
            label: "Python",
            code: `def greedy_coins(coins, amount):
    coins = sorted(coins, reverse=True)
    picked = []
    for c in coins:
        while amount >= c:
            picked.append(c); amount -= c
    return picked if amount == 0 else None

print(greedy_coins([1, 3, 4], 6))       # [4, 1, 1]  (3 coins; optimum is 2)
print(greedy_coins([1, 5, 10, 25], 30)) # [25, 5]    (optimum)
`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

vector<int> greedyCoins(vector<int> coins, int amount) {
    sort(coins.rbegin(), coins.rend());
    vector<int> picked;
    for (int c : coins) while (amount >= c) { picked.push_back(c); amount -= c; }
    return amount == 0 ? picked : vector<int>{};
}

int main() {
    for (int x : greedyCoins({1, 3, 4}, 6)) cout << x << ' ';
    cout << '\\n';
    for (int x : greedyCoins({1, 5, 10, 25}, 30)) cout << x << ' ';
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class GreedyIntro {
    public static List<Integer> coins(int[] denoms, int amount) {
        Integer[] c = Arrays.stream(denoms).boxed().toArray(Integer[]::new);
        Arrays.sort(c, Comparator.reverseOrder());
        List<Integer> picked = new ArrayList<>();
        for (int x : c) while (amount >= x) { picked.add(x); amount -= x; }
        return amount == 0 ? picked : Collections.emptyList();
    }
    public static void main(String[] args) {
        System.out.println(coins(new int[]{1, 3, 4}, 6));        // [4, 1, 1]
        System.out.println(coins(new int[]{1, 5, 10, 25}, 30));  // [25, 5]
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "activity-selection",
        slug: "activity-selection",
        title: "Activity Selection",
        difficulty: "medium",
        description:
          "Pick the maximum number of pairwise non-overlapping intervals.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        content: `## Activity Selection

Given \`n\` intervals \`[start, end)\`, pick the **largest subset** with no two overlapping.

### The rule that works
Sort by **end time** (ascending). Always pick the next interval whose \`start ≥ last_end\`.

### Why "earliest end" beats "earliest start" and "shortest duration"
- **Earliest start:** picks \`[0, 10)\` first, blocks everything else.
- **Shortest duration:** picks \`[5, 6)\` first, can block two disjoint longer ones.
- **Earliest end** leaves the *most room* for future picks. Exchange argument: if an optimal solution's first pick ends later than the greedy's, swap — the rest still fits.

### Relatives (same trick)
- **Non-overlapping Intervals** — total − kept.
- **Minimum Arrows to Burst Balloons** — same sort, pick earliest end.
- **Erase Overlap Intervals**.

### Pitfalls
- Touching (e.g. \`[1,3)\` and \`[3,5)\`) usually counts as non-overlapping — check whether the problem uses \`>\` or \`≥\`.
- On **weighted** intervals (maximize total value, not count) greedy fails — that's **weighted interval scheduling**, a DP.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function maxActivities(intervals) {
  intervals = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0, end = -Infinity;
  const picked = [];
  for (const [s, e] of intervals) {
    if (s >= end) { count++; end = e; picked.push([s, e]); }
  }
  return { count, picked };
}

console.log(maxActivities([[1,4],[3,5],[0,6],[5,7],[3,9],[5,9],[6,10],[8,11],[8,12],[2,14],[12,16]]));
// { count: 4, picked: [ [1,4], [5,7], [8,11], [12,16] ] }`,
          },
          {
            language: "python",
            label: "Python",
            code: `def max_activities(intervals):
    intervals = sorted(intervals, key=lambda x: x[1])
    picked, end = [], float('-inf')
    for s, e in intervals:
        if s >= end:
            picked.append((s, e)); end = e
    return picked

if __name__ == "__main__":
    print(max_activities([(1,4),(3,5),(0,6),(5,7),(3,9),(5,9),(6,10),(8,11),(8,12),(2,14),(12,16)]))
    # [(1, 4), (5, 7), (8, 11), (12, 16)]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

vector<pair<int,int>> maxActivities(vector<pair<int,int>> iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a.second < b.second; });
    vector<pair<int,int>> picked;
    int end = INT_MIN;
    for (auto& [s, e] : iv) if (s >= end) { picked.push_back({s, e}); end = e; }
    return picked;
}

int main() {
    vector<pair<int,int>> v = {{1,4},{3,5},{0,6},{5,7},{3,9},{5,9},{6,10},{8,11},{8,12},{2,14},{12,16}};
    for (auto [s, e] : maxActivities(v)) cout << '[' << s << ',' << e << "] ";
    // [1,4] [5,7] [8,11] [12,16]
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class ActivitySelection {
    public static List<int[]> maxActivities(int[][] iv) {
        Arrays.sort(iv, Comparator.comparingInt(a -> a[1]));
        List<int[]> picked = new ArrayList<>();
        int end = Integer.MIN_VALUE;
        for (int[] p : iv) if (p[0] >= end) { picked.add(p); end = p[1]; }
        return picked;
    }

    public static void main(String[] args) {
        int[][] v = {{1,4},{3,5},{0,6},{5,7},{3,9},{5,9},{6,10},{8,11},{8,12},{2,14},{12,16}};
        for (int[] p : maxActivities(v)) System.out.print(Arrays.toString(p) + " ");
        // [1, 4] [5, 7] [8, 11] [12, 16]
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "jump-game",
        slug: "jump-game",
        title: "Jump Game",
        difficulty: "medium",
        description:
          "Can you reach the last index from the first? Track the max reachable frontier.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Jump Game

Each \`nums[i]\` is the maximum jump length from index \`i\`. Starting at index 0, can you reach the last index?

### Greedy rule
Walk left → right keeping \`maxReach = max(maxReach, i + nums[i])\`. If you ever encounter \`i > maxReach\`, you're stuck.

### Why one pass is enough
At index \`i\` the best you can possibly do next is \`i + nums[i]\`. Any future index \`j ≤ maxReach\` is reachable — no need to enumerate *how*. This is a **reachability** argument, not a path argument.

### Variants
- **Jump Game II** — minimum number of jumps (BFS-style layered greedy).
- **Jump Game III** — bi-directional from arbitrary start, still BFS.
- **Jump Game IV** — BFS over indices grouped by value.

### Pitfalls
- Off-by-one: target is \`n-1\`, not \`n\`.
- Zeros can still be skipped *over* as long as a prior index's jump covers them.
- Negative numbers aren't allowed in the classic problem — different variants define "jump" differently.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}

console.log(canJump([2, 3, 1, 1, 4])); // true
console.log(canJump([3, 2, 1, 0, 4])); // false
console.log(canJump([0]));             // true (already at end)`,
          },
          {
            language: "python",
            label: "Python",
            code: `def can_jump(nums):
    max_reach = 0
    for i, x in enumerate(nums):
        if i > max_reach: return False
        if i + x > max_reach: max_reach = i + x
        if max_reach >= len(nums) - 1: return True
    return True

if __name__ == "__main__":
    print(can_jump([2, 3, 1, 1, 4]))  # True
    print(can_jump([3, 2, 1, 0, 4]))  # False
    print(can_jump([0]))              # True`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
        if (maxReach >= (int)nums.size() - 1) return true;
    }
    return true;
}

int main() {
    vector<int> a = {2, 3, 1, 1, 4}, b = {3, 2, 1, 0, 4};
    cout << boolalpha << canJump(a) << ' ' << canJump(b); // true false
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class JumpGame {
    public static boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(canJump(new int[]{2, 3, 1, 1, 4})); // true
        System.out.println(canJump(new int[]{3, 2, 1, 0, 4})); // false
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "gas-station",
        slug: "gas-station",
        title: "Gas Station",
        difficulty: "medium",
        description:
          "Find the starting index that completes a circular tour — or prove it's impossible.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Gas Station

Circular route with \`n\` stations. At station \`i\` you gain \`gas[i]\` fuel and pay \`cost[i]\` to reach \`i+1\`. Find any starting index that completes the loop, or return \`-1\`.

### Two observations
1. If \`Σ (gas[i] - cost[i]) < 0\`, **no start works**. You burn more than you gain overall.
2. If the sum is \`≥ 0\`, **exactly one valid start exists**, and greedy finds it in one pass.

### The greedy sweep
Walk left → right, tracking a running \`tank\`. Whenever \`tank\` drops below 0 at station \`i\`, **no station in \`[start, i]\` can be a valid start** — reset \`start = i + 1\` and \`tank = 0\`.

### Why skipping is safe
If start = \`s\` reaches index \`i\` with \`tank < 0\`, then *any* intermediate start \`s' ∈ (s, i]\` also arrives with \`tank ≤ 0\` at \`i\` — it would have had **less** fuel than \`s\` did (stations in \`[s, s')\` only contributed non-negative to \`s\`'s tank). So none of them work either.

### Pitfalls
- Don't forget to check the total sum — without it you might miss the "impossible" case.
- Works for **circular** tours specifically; doesn't transfer to non-circular variants.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total < 0 ? -1 : start;
}

console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])); // 3
console.log(canCompleteCircuit([2, 3, 4],       [3, 4, 3]));       // -1`,
          },
          {
            language: "python",
            label: "Python",
            code: `def can_complete_circuit(gas, cost):
    total = tank = start = 0
    for i, (g, c) in enumerate(zip(gas, cost)):
        d = g - c
        total += d
        tank  += d
        if tank < 0:
            start = i + 1
            tank = 0
    return -1 if total < 0 else start

if __name__ == "__main__":
    print(can_complete_circuit([1,2,3,4,5], [3,4,5,1,2]))  # 3
    print(can_complete_circuit([2,3,4],     [3,4,3]))      # -1`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < (int)gas.size(); i++) {
        int d = gas[i] - cost[i];
        total += d; tank += d;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total < 0 ? -1 : start;
}

int main() {
    vector<int> g = {1,2,3,4,5}, c = {3,4,5,1,2};
    cout << canCompleteCircuit(g, c); // 3
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class GasStation {
    public static int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int d = gas[i] - cost[i];
            total += d; tank += d;
            if (tank < 0) { start = i + 1; tank = 0; }
        }
        return total < 0 ? -1 : start;
    }
    public static void main(String[] args) {
        System.out.println(canCompleteCircuit(new int[]{1,2,3,4,5}, new int[]{3,4,5,1,2})); // 3
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "fractional-knapsack",
        slug: "fractional-knapsack",
        title: "Fractional Knapsack",
        difficulty: "medium",
        description:
          "When items can be split, sort by value/weight and pack densest first.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        content: `## Fractional Knapsack

Unlike 0/1 knapsack, each item can be taken as a **fraction**. Maximize total value under weight capacity \`W\`.

### Optimal rule
Sort items by **value / weight** descending. Take each item whole while it fits; then fill the residual capacity with a fraction of the next item.

### Exchange-argument proof
Suppose an optimal solution doesn't fully include the highest-ratio item. Take \`ε\` weight from a lower-ratio item and swap it for \`ε\` of the higher-ratio item. Total value strictly increases (or stays equal). Contradiction ⇒ the greedy is optimal.

### Why 0/1 knapsack **breaks** this
With indivisible items the exchange argument fails — you can't take a fraction to close the gap, so ratio-greedy may leave usable capacity empty. Use DP there.

### Pitfalls
- Watch floating-point accumulation. For exact output, scale so all weights and capacities are integers when possible.
- If weights can be zero, put those items first (free value).
- When capacity is 0, answer is 0 — guard early.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function fractionalKnapsack(weights, values, capacity) {
  const items = weights
    .map((w, i) => ({ w, v: values[i], ratio: values[i] / w, idx: i }))
    .sort((a, b) => b.ratio - a.ratio);
  let total = 0;
  const plan = [];
  for (const it of items) {
    if (capacity === 0) break;
    if (it.w <= capacity) {
      plan.push({ idx: it.idx, fraction: 1 });
      total += it.v; capacity -= it.w;
    } else {
      plan.push({ idx: it.idx, fraction: capacity / it.w });
      total += it.v * (capacity / it.w); capacity = 0;
    }
  }
  return { total, plan };
}

console.log(fractionalKnapsack([10, 20, 30], [60, 100, 120], 50));
// { total: 240, plan: [ {idx:0,1}, {idx:1,1}, {idx:2, 2/3} ] }`,
          },
          {
            language: "python",
            label: "Python",
            code: `def fractional_knapsack(weights, values, capacity):
    items = sorted(
        [(w, v, i) for i, (w, v) in enumerate(zip(weights, values))],
        key=lambda x: x[1]/x[0], reverse=True,
    )
    total, plan = 0.0, []
    for w, v, i in items:
        if capacity == 0: break
        if w <= capacity:
            plan.append((i, 1.0)); total += v; capacity -= w
        else:
            frac = capacity / w
            plan.append((i, frac)); total += v * frac; capacity = 0
    return total, plan

if __name__ == "__main__":
    print(fractional_knapsack([10, 20, 30], [60, 100, 120], 50))
    # (240.0, [(0, 1.0), (1, 1.0), (2, 0.666…)])`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

double fractionalKnapsack(vector<int>& w, vector<int>& v, int W) {
    int n = w.size();
    vector<int> idx(n); iota(idx.begin(), idx.end(), 0);
    sort(idx.begin(), idx.end(), [&](int a, int b){
        return (double)v[a]/w[a] > (double)v[b]/w[b];
    });
    double total = 0;
    for (int i : idx) {
        if (W == 0) break;
        if (w[i] <= W) { total += v[i]; W -= w[i]; }
        else { total += v[i] * ((double)W / w[i]); W = 0; }
    }
    return total;
}

int main() {
    vector<int> w = {10, 20, 30}, v = {60, 100, 120};
    cout << fixed << setprecision(2) << fractionalKnapsack(w, v, 50); // 240.00
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class FractionalKnapsack {
    public static double maxValue(int[] w, int[] v, int W) {
        Integer[] idx = new Integer[w.length];
        for (int i = 0; i < w.length; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Double.compare((double)v[b]/w[b], (double)v[a]/w[a]));
        double total = 0;
        for (int i : idx) {
            if (W == 0) break;
            if (w[i] <= W) { total += v[i]; W -= w[i]; }
            else { total += v[i] * ((double)W / w[i]); W = 0; }
        }
        return total;
    }
    public static void main(String[] args) {
        System.out.println(maxValue(new int[]{10,20,30}, new int[]{60,100,120}, 50)); // 240.0
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "merge-intervals",
        slug: "merge-intervals",
        title: "Merge Intervals",
        difficulty: "medium",
        description:
          "Sort by start time and sweep — merge each overlapping pair into one.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        content: `## Merge Intervals

Given a list of intervals, return the minimal list of intervals that cover exactly the same union.

### Sweep-line approach
1. Sort intervals by **start** (stable is fine).
2. Maintain a running "merged end" \`e\`.
3. For each new interval \`[s, t)\`:
   - If \`s ≤ e\` ⇒ overlap ⇒ extend \`e = max(e, t)\`.
   - Otherwise push the previous and open a new one.

### Where this shows up
- Calendar conflict detection.
- Compaction of log time ranges.
- Memory allocators reclaiming neighboring free blocks.
- Preprocessing for **line-sweep** geometry algorithms.

### Pitfalls
- Decide once whether \`[1, 3)\` and \`[3, 5)\` touch (usually yes, they merge).
- For very large \`n\`, the \`O(n log n)\` sort dominates — but it's unavoidable without coordinate compression or bucket assumptions.
- Don't use \`sort by end time\` — it breaks the sweep (you might miss a later interval that extends earlier ones).
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function merge(intervals) {
  if (!intervals.length) return [];
  intervals = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    const last = out[out.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}

console.log(merge([[1,3],[2,6],[8,10],[15,18]]));
// [ [1,6], [8,10], [15,18] ]
console.log(merge([[1,4],[4,5]])); // [ [1,5] ]`,
          },
          {
            language: "python",
            label: "Python",
            code: `def merge(intervals):
    if not intervals: return []
    intervals.sort(key=lambda x: x[0])
    out = [list(intervals[0])]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out

if __name__ == "__main__":
    print(merge([[1,3],[2,6],[8,10],[15,18]]))  # [[1,6],[8,10],[15,18]]
    print(merge([[1,4],[4,5]]))                 # [[1,5]]`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& iv) {
    if (iv.empty()) return {};
    sort(iv.begin(), iv.end());
    vector<vector<int>> out = { iv[0] };
    for (int i = 1; i < (int)iv.size(); i++) {
        if (iv[i][0] <= out.back()[1]) out.back()[1] = max(out.back()[1], iv[i][1]);
        else out.push_back(iv[i]);
    }
    return out;
}

int main() {
    vector<vector<int>> v = {{1,3},{2,6},{8,10},{15,18}};
    for (auto& p : merge(v)) cout << '[' << p[0] << ',' << p[1] << "] ";
    // [1,6] [8,10] [15,18]
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class MergeIntervals {
    public static int[][] merge(int[][] iv) {
        if (iv.length == 0) return new int[0][0];
        Arrays.sort(iv, Comparator.comparingInt(a -> a[0]));
        List<int[]> out = new ArrayList<>();
        out.add(iv[0]);
        for (int i = 1; i < iv.length; i++) {
            int[] last = out.get(out.size() - 1);
            if (iv[i][0] <= last[1]) last[1] = Math.max(last[1], iv[i][1]);
            else out.add(iv[i]);
        }
        return out.toArray(new int[0][]);
    }
    public static void main(String[] args) {
        int[][] v = {{1,3},{2,6},{8,10},{15,18}};
        for (int[] p : merge(v)) System.out.print(Arrays.toString(p) + " ");
        // [1, 6] [8, 10] [15, 18]
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "non-overlapping-intervals",
        slug: "non-overlapping-intervals",
        title: "Non-overlapping Intervals",
        difficulty: "medium",
        description:
          "Minimum intervals to delete so the rest are non-overlapping — complement of Activity Selection.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        content: `## Non-overlapping Intervals

Return the minimum number of intervals to **remove** so that no two remaining intervals overlap.

### Reduction
\`removed = total − kept\`. "Kept" is exactly Activity Selection: sort by \`end\`, sweep, keep each that doesn't conflict with the last kept.

### Why end-sorted sweep beats start-sorted
A shorter-end interval leaves more room for subsequent intervals. End-sorted guarantees every "remove" step deletes the interval with the **later** end — the one more likely to conflict with the future anyway.

### Same-template problems
- **Minimum Arrows to Burst Balloons** — arrows per group = number of picks.
- **Erase Overlap Intervals** — identical to this problem.
- **Maximum Length of Pair Chain** — pick pairs, sort by second element.

### Pitfalls
- If the problem says overlapping at endpoints doesn't count (\`[1, 2]\` vs \`[2, 3]\` allowed), use \`>\` in the comparison; if it does count, use \`≥\`.
- Doesn't generalize to weighted intervals — use DP.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function eraseOverlapIntervals(intervals) {
  intervals = [...intervals].sort((a, b) => a[1] - b[1]);
  let end = -Infinity, kept = 0;
  for (const [s, e] of intervals) {
    if (s >= end) { kept++; end = e; }
  }
  return intervals.length - kept;
}

console.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])); // 1
console.log(eraseOverlapIntervals([[1,2],[1,2],[1,2]]));       // 2
console.log(eraseOverlapIntervals([[1,2],[2,3]]));             // 0`,
          },
          {
            language: "python",
            label: "Python",
            code: `def erase_overlap_intervals(intervals):
    intervals = sorted(intervals, key=lambda x: x[1])
    end = float('-inf'); kept = 0
    for s, e in intervals:
        if s >= end:
            kept += 1; end = e
    return len(intervals) - kept

if __name__ == "__main__":
    print(erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]))  # 1
    print(erase_overlap_intervals([[1,2],[1,2],[1,2]]))        # 2`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int eraseOverlapIntervals(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
    int end = INT_MIN, kept = 0;
    for (auto& p : iv) if (p[0] >= end) { kept++; end = p[1]; }
    return (int)iv.size() - kept;
}

int main() {
    vector<vector<int>> v = {{1,2},{2,3},{3,4},{1,3}};
    cout << eraseOverlapIntervals(v); // 1
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class NonOverlapping {
    public static int eraseOverlapIntervals(int[][] iv) {
        Arrays.sort(iv, Comparator.comparingInt(a -> a[1]));
        int end = Integer.MIN_VALUE, kept = 0;
        for (int[] p : iv) if (p[0] >= end) { kept++; end = p[1]; }
        return iv.length - kept;
    }
    public static void main(String[] args) {
        System.out.println(eraseOverlapIntervals(new int[][]{{1,2},{2,3},{3,4},{1,3}})); // 1
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "task-scheduler",
        slug: "task-scheduler",
        title: "Task Scheduler",
        difficulty: "medium",
        description:
          "Minimum total CPU slots given a cooldown between identical tasks.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(26) ≈ O(1) for fixed alphabet",
        content: `## Task Scheduler

Given task labels and a cooldown \`n\`, schedule the tasks so the same label is at least \`n\` slots apart, minimizing total time (including idle slots).

### Closed-form greedy
Let \`maxF\` = highest frequency, \`tied\` = how many labels share \`maxF\`. Then:

$$ \\text{slots} = \\max\\bigl(\\,|\\text{tasks}|,\\; (maxF - 1) \\cdot (n + 1) + tied\\,\\bigr) $$

**Why:**
- Most-frequent label dictates the skeleton: \`maxF - 1\` gaps of length \`n + 1\` slots each, plus one final slot for the last occurrence ⇒ \`(maxF - 1) · (n + 1) + tied\` slots.
- But if you have *so many distinct tasks* that the total length exceeds the skeleton, you just pack everything without idles — hence \`max\` against \`|tasks|\`.

### Heap-based simulation (alternate view)
If you want the actual schedule, not just its length: push all counts into a max-heap, each tick pop up to \`n + 1\` distinct tasks into a round, decrement, and re-push. Produces a valid plan.

### Pitfalls
- \`n = 0\` ⇒ answer is just \`|tasks|\`.
- With huge cooldown + few distinct tasks, most of the time is idle — expect it.
- This is one of the few problems where the formula is **faster** and **cleaner** than simulation.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function leastInterval(tasks, n) {
  const freq = new Map();
  for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);
  let maxF = 0, tied = 0;
  for (const f of freq.values()) {
    if (f > maxF) { maxF = f; tied = 1; }
    else if (f === maxF) tied++;
  }
  return Math.max(tasks.length, (maxF - 1) * (n + 1) + tied);
}

console.log(leastInterval(["A","A","A","B","B","B"], 2));                 // 8
console.log(leastInterval(["A","C","A","B","D","B"], 1));                 // 6
console.log(leastInterval(["A","A","A","A","A","A","B","C","D","E"], 2)); // 16`,
          },
          {
            language: "python",
            label: "Python",
            code: `from collections import Counter

def least_interval(tasks, n):
    freq = Counter(tasks)
    max_f = max(freq.values())
    tied = sum(1 for v in freq.values() if v == max_f)
    return max(len(tasks), (max_f - 1) * (n + 1) + tied)

if __name__ == "__main__":
    print(least_interval(["A","A","A","B","B","B"], 2))                   # 8
    print(least_interval(["A","C","A","B","D","B"], 1))                   # 6
    print(least_interval(["A","A","A","A","A","A","B","C","D","E"], 2))   # 16`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {0};
    for (char c : tasks) freq[c - 'A']++;
    int maxF = *max_element(freq, freq + 26);
    int tied = count(freq, freq + 26, maxF);
    return max((int)tasks.size(), (maxF - 1) * (n + 1) + tied);
}

int main() {
    vector<char> t = {'A','A','A','B','B','B'};
    cout << leastInterval(t, 2); // 8
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `public class TaskScheduler {
    public static int leastInterval(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char c : tasks) freq[c - 'A']++;
        int maxF = 0, tied = 0;
        for (int f : freq) {
            if (f > maxF) { maxF = f; tied = 1; }
            else if (f == maxF) tied++;
        }
        return Math.max(tasks.length, (maxF - 1) * (n + 1) + tied);
    }
    public static void main(String[] args) {
        System.out.println(leastInterval(new char[]{'A','A','A','B','B','B'}, 2)); // 8
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
      },
      {
        id: "huffman-coding",
        slug: "huffman-coding",
        title: "Huffman Coding",
        difficulty: "hard",
        description:
          "Build an optimal prefix-free binary code by repeatedly merging the two least-frequent nodes.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        content: `## Huffman Coding

For a set of characters with frequencies, Huffman builds a **prefix-free** binary code that minimizes the total encoded length \`Σ freq[c] · len(code[c])\`.

### Algorithm
1. Create a leaf node per character; push into a min-heap keyed by frequency.
2. Repeatedly: pop the two smallest, create a parent node whose freq is their sum, push the parent back.
3. Continue until one root remains.
4. Traverse: left edge = \`0\`, right edge = \`1\`. Each leaf's root-to-leaf path is its code.

### Why the two-smallest merge is optimal
In any optimal prefix tree, the two least-frequent characters can be made siblings at the deepest level without loss — a classic exchange argument. Merging them reduces the problem to a smaller instance with identical structure.

### Where Huffman shows up
- **DEFLATE** (ZIP, gzip, PNG): Huffman on top of LZ77.
- **JPEG / MP3**: quantized coefficients Huffman-coded.
- **Any entropy coder** as a building block (along with arithmetic coding and ANS).

### Pitfalls
- Ties can yield different (but equally optimal) trees — keep tie-breaking deterministic when you need reproducibility.
- For a single character, the standard algorithm assigns code \`""\`; patch to \`"0"\` so decoding doesn't ambiguously terminate.
- Huffman is only optimal among prefix-free codes on integer-length symbols — arithmetic/ANS can do better near the Shannon limit.
`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function huffmanCodes(freq) {
  // freq: Record<string, number>
  let heap = Object.entries(freq).map(([ch, f]) => ({ ch, f, l: null, r: null }));
  if (heap.length === 1) return { [heap[0].ch]: "0" };
  while (heap.length > 1) {
    heap.sort((a, b) => a.f - b.f);
    const a = heap.shift(), b = heap.shift();
    heap.push({ ch: null, f: a.f + b.f, l: a, r: b });
  }
  const codes = {};
  (function walk(node, path) {
    if (!node) return;
    if (node.ch !== null) { codes[node.ch] = path || "0"; return; }
    walk(node.l, path + "0");
    walk(node.r, path + "1");
  })(heap[0], "");
  return codes;
}

console.log(huffmanCodes({ a: 5, b: 9, c: 12, d: 13, e: 16, f: 45 }));
// Example: { f: "0", c: "100", d: "101", a: "1100", b: "1101", e: "111" }`,
          },
          {
            language: "python",
            label: "Python",
            code: `import heapq

def huffman_codes(freq):
    heap = [[f, i, ch, None, None] for i, (ch, f) in enumerate(freq.items())]
    heapq.heapify(heap)
    nxt = len(heap)
    if len(heap) == 1:
        return { heap[0][2]: "0" }
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        heapq.heappush(heap, [lo[0] + hi[0], nxt, None, lo, hi]); nxt += 1
    codes = {}
    def walk(node, path):
        if node is None: return
        _, _, ch, l, r = node
        if ch is not None:
            codes[ch] = path or "0"; return
        walk(l, path + "0"); walk(r, path + "1")
    walk(heap[0], "")
    return codes

if __name__ == "__main__":
    print(huffman_codes({'a':5,'b':9,'c':12,'d':13,'e':16,'f':45}))`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `#include <bits/stdc++.h>
using namespace std;

struct Node { char ch; int f; Node *l, *r; };
struct Cmp { bool operator()(Node* a, Node* b) const { return a->f > b->f; } };

void walk(Node* n, string path, map<char,string>& codes) {
    if (!n) return;
    if (!n->l && !n->r) { codes[n->ch] = path.empty() ? "0" : path; return; }
    walk(n->l, path + "0", codes);
    walk(n->r, path + "1", codes);
}

map<char,string> huffman(vector<pair<char,int>> freq) {
    priority_queue<Node*, vector<Node*>, Cmp> pq;
    for (auto [c, f] : freq) pq.push(new Node{c, f, nullptr, nullptr});
    while (pq.size() > 1) {
        auto a = pq.top(); pq.pop();
        auto b = pq.top(); pq.pop();
        pq.push(new Node{'\\0', a->f + b->f, a, b});
    }
    map<char,string> codes;
    walk(pq.top(), "", codes);
    return codes;
}

int main() {
    for (auto& [c, s] : huffman({{'a',5},{'b',9},{'c',12},{'d',13},{'e',16},{'f',45}}))
        cout << c << ':' << s << ' ';
}`,
          },
          {
            language: "java",
            label: "Java",
            code: `import java.util.*;

public class Huffman {
    static class Node { char ch; int f; Node l, r; Node(char c,int f,Node l,Node r){this.ch=c;this.f=f;this.l=l;this.r=r;} }

    public static Map<Character,String> huffman(Map<Character,Integer> freq) {
        PriorityQueue<Node> pq = new PriorityQueue<>((a,b)->a.f-b.f);
        for (var e : freq.entrySet()) pq.add(new Node(e.getKey(), e.getValue(), null, null));
        while (pq.size() > 1) {
            Node a = pq.poll(), b = pq.poll();
            pq.add(new Node('\\0', a.f + b.f, a, b));
        }
        Map<Character,String> codes = new HashMap<>();
        walk(pq.peek(), "", codes);
        return codes;
    }
    static void walk(Node n, String p, Map<Character,String> codes) {
        if (n == null) return;
        if (n.l == null && n.r == null) { codes.put(n.ch, p.isEmpty() ? "0" : p); return; }
        walk(n.l, p + "0", codes);
        walk(n.r, p + "1", codes);
    }
    public static void main(String[] args) {
        Map<Character,Integer> f = Map.of('a',5,'b',9,'c',12,'d',13,'e',16,'f',45);
        System.out.println(huffman(f));
    }
}`,
          },
        ],
        visualizationConfig: { type: "greedy", defaultInput: [] },
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
      "Explore the solution space by building candidates incrementally and undoing choices that can't lead to a valid answer.",
    color: "bg-pink-500",
    topics: [
      {
        id: "backtracking-introduction",
        slug: "backtracking-introduction",
        title: "Introduction to Backtracking",
        difficulty: "easy",
        description:
          "The choose / explore / un-choose recursion template and when to use it.",
        timeComplexity: "Varies — typically O(branching^depth)",
        spaceComplexity: "O(depth) for the recursion stack",
        content: `## What is Backtracking?

Backtracking is **DFS through a solution tree**. At every node we:

1. **Choose** a candidate extension of the current partial solution.
2. **Explore** recursively with that choice applied.
3. **Un-choose** it on return, so the next sibling starts from a clean state.

It's the right tool when:

- We need **all** valid configurations (permutations, subsets, partitions).
- We need **any one** valid configuration under non-trivial constraints (Sudoku, N-Queens).
- Greedy/DP can't model the constraints cleanly.

### The canonical template

\`\`\`
backtrack(state):
    if is_goal(state):
        record(state)
        return
    for choice in candidates(state):
        if feasible(state, choice):
            apply(state, choice)        # choose
            backtrack(state)            # explore
            undo(state, choice)         # un-choose
\`\`\`

### The most important optimization: **pruning**

A pure backtracker explores the full tree. Real-world backtrackers win by **pruning** branches that provably cannot yield a solution:

- **Constraint propagation** — once a column is occupied in N-Queens, skip it.
- **Bounding** — if the current partial cost already exceeds the best known, stop.
- **Ordering** — try the most constrained cell / most promising move first.

### Complexity intuition

| Problem              | Tree shape    | Work per node | Total                     |
|----------------------|---------------|---------------|----------------------------|
| Permutations of n    | n! leaves     | O(n) copy     | **O(n · n!)**              |
| Subsets of n         | 2^n leaves    | O(n)          | **O(n · 2^n)**             |
| N-Queens             | ≈ n branches  | O(1) w/ sets  | Much less than n^n in practice |
| Sudoku               | ≤ 9 per cell  | O(1) w/ bitmasks | Practically instant for real puzzles |

### Backtracking vs DFS vs DP

- **DFS** is the traversal strategy backtracking rides on top of.
- **Backtracking = DFS + undo**. The "undo" is the core signature.
- **DP** reuses overlapping sub-solutions; backtracking is for when sub-problems don't overlap or when we need the *enumeration*, not just a count/cost.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Generic backtracking skeleton
function backtrack(state, result) {
  if (isGoal(state)) {
    result.push(snapshot(state));
    return;
  }
  for (const choice of candidates(state)) {
    if (!feasible(state, choice)) continue;   // pruning
    apply(state, choice);                     // choose
    backtrack(state, result);                 // explore
    undo(state, choice);                      // un-choose
  }
}

// Example: print every path root → leaf in a binary tree
function allRootToLeafPaths(root) {
  const out = [], path = [];
  function dfs(node) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) out.push([...path]);
    dfs(node.left);
    dfs(node.right);
    path.pop();                               // ← backtrack
  }
  dfs(root);
  return out;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `# Generic backtracking skeleton
def backtrack(state, result):
    if is_goal(state):
        result.append(snapshot(state))
        return
    for choice in candidates(state):
        if not feasible(state, choice):       # pruning
            continue
        apply(state, choice)                  # choose
        backtrack(state, result)              # explore
        undo(state, choice)                   # un-choose


# Example: all root-to-leaf paths in a binary tree
def all_root_to_leaf_paths(root):
    out, path = [], []
    def dfs(node):
        if not node: return
        path.append(node.val)
        if not node.left and not node.right:
            out.append(path[:])
        dfs(node.left)
        dfs(node.right)
        path.pop()                            # ← backtrack
    dfs(root)
    return out`,
          },
          {
            language: "java",
            label: "Java",
            code: `// Generic backtracking skeleton
void backtrack(State state, List<Snapshot> result) {
    if (isGoal(state)) { result.add(snapshot(state)); return; }
    for (Choice c : candidates(state)) {
        if (!feasible(state, c)) continue;    // pruning
        apply(state, c);                      // choose
        backtrack(state, result);             // explore
        undo(state, c);                       // un-choose
    }
}

// Example: all root-to-leaf paths
List<List<Integer>> allPaths(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    Deque<Integer> path = new ArrayDeque<>();
    dfs(root, path, out);
    return out;
}
void dfs(TreeNode n, Deque<Integer> path, List<List<Integer>> out) {
    if (n == null) return;
    path.addLast(n.val);
    if (n.left == null && n.right == null) out.add(new ArrayList<>(path));
    dfs(n.left, path, out);
    dfs(n.right, path, out);
    path.removeLast();                        // ← backtrack
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `// Generic backtracking skeleton
void backtrack(State& s, vector<Snapshot>& out) {
    if (isGoal(s)) { out.push_back(snapshot(s)); return; }
    for (auto& c : candidates(s)) {
        if (!feasible(s, c)) continue;        // pruning
        apply(s, c);                          // choose
        backtrack(s, out);                    // explore
        undo(s, c);                           // un-choose
    }
}

// Example: all root-to-leaf paths
void dfs(TreeNode* n, vector<int>& path, vector<vector<int>>& out) {
    if (!n) return;
    path.push_back(n->val);
    if (!n->left && !n->right) out.push_back(path);
    dfs(n->left, path, out);
    dfs(n->right, path, out);
    path.pop_back();                          // ← backtrack
}`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [1, 2, 3] },
      },
      {
        id: "permutations",
        slug: "permutations",
        title: "Permutations",
        difficulty: "medium",
        description: "Generate every ordering of n distinct elements.",
        timeComplexity: "O(n · n!)",
        spaceComplexity: "O(n) recursion + O(n · n!) output",
        content: `## Permutations

Given \`nums\` with distinct values, return **all** orderings.

### Approach — swap-in-place

- At recursion depth \`k\`, pick any element from \`nums[k..n-1]\` to place at index \`k\`.
- Swap it into position, recurse on depth \`k+1\`, swap back.

This avoids maintaining a separate "used" set and reuses the input array as working storage.

### Approach — used-flag

Keep a boolean array \`used[i]\`. Walk \`0..n-1\`; skip indices already used; append, recurse, pop, unset. Easier to read; strictly needed when duplicates are involved.

### Duplicates (Permutations II)

If input has duplicates and you want unique permutations:

1. Sort.
2. Skip \`nums[i]\` when \`i > 0 && nums[i] == nums[i-1] && !used[i-1]\` — the duplicate at a previous position must appear **before** this one for the permutation to be canonical.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function permute(nums) {
  const res = [];
  const bt = (i) => {
    if (i === nums.length) { res.push([...nums]); return; }
    for (let j = i; j < nums.length; j++) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      bt(i + 1);
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  };
  bt(0);
  return res;
}

// With duplicates → unique permutations
function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const res = [], path = [], used = Array(nums.length).fill(false);
  const bt = () => {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
      used[i] = true; path.push(nums[i]);
      bt();
      path.pop(); used[i] = false;
    }
  };
  bt();
  return res;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def permute(nums):
    res = []
    def bt(i):
        if i == len(nums):
            res.append(nums[:]); return
        for j in range(i, len(nums)):
            nums[i], nums[j] = nums[j], nums[i]
            bt(i + 1)
            nums[i], nums[j] = nums[j], nums[i]
    bt(0)
    return res


def permute_unique(nums):
    nums.sort()
    res, path, used = [], [], [False] * len(nums)
    def bt():
        if len(path) == len(nums):
            res.append(path[:]); return
        for i in range(len(nums)):
            if used[i]: continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue
            used[i] = True; path.append(nums[i])
            bt()
            path.pop(); used[i] = False
    bt()
    return res`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, 0, res);
        return res;
    }
    void bt(int[] a, int i, List<List<Integer>> res) {
        if (i == a.length) {
            List<Integer> p = new ArrayList<>();
            for (int x : a) p.add(x);
            res.add(p); return;
        }
        for (int j = i; j < a.length; j++) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
            bt(a, i + 1, res);
            t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> res;
        bt(nums, 0, res);
        return res;
    }
private:
    void bt(vector<int>& a, int i, vector<vector<int>>& res) {
        if (i == (int)a.size()) { res.push_back(a); return; }
        for (int j = i; j < (int)a.size(); j++) {
            swap(a[i], a[j]);
            bt(a, i + 1, res);
            swap(a[i], a[j]);
        }
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [1, 2, 3] },
      },
      {
        id: "subsets",
        slug: "subsets",
        title: "Subsets (Power Set)",
        difficulty: "medium",
        description: "Enumerate every subset of n elements — 2ⁿ total.",
        timeComplexity: "O(n · 2^n)",
        spaceComplexity: "O(n) recursion + O(n · 2^n) output",
        content: `## Subsets

There are \`2^n\` subsets of an \`n\`-element set. Three equivalent formulations:

### 1. Include / exclude (pure backtracking)

At index \`i\`, either **include** \`nums[i]\` in the current subset and recurse, or **skip** it and recurse. Record the subset at every node, not only leaves.

### 2. "For each start" backtracking

Loop \`i = start..n-1\`, push, recurse with \`start = i+1\`, pop. This naturally generates subsets in combinatoric order and generalizes cleanly to combinations.

### 3. Bitmask enumeration

For \`mask\` from \`0\` to \`2^n - 1\`, the bits of \`mask\` indicate which elements are included. No recursion, branch-free.

### Subsets II (with duplicates)

Sort, then within a single recursion call **skip duplicates** at the same level — i.e., if \`i > start && nums[i] === nums[i-1]\` continue. This prevents generating identical subsets via different branches.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function subsets(nums) {
  const res = [], path = [];
  const bt = (start) => {
    res.push([...path]);                    // record every node
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      bt(i + 1);
      path.pop();
    }
  };
  bt(0);
  return res;
}

// Bitmask variant
function subsetsBitmask(nums) {
  const n = nums.length, res = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const s = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s.push(nums[i]);
    res.push(s);
  }
  return res;
}

// Subsets II — handle duplicates
function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = (start) => {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      bt(i + 1);
      path.pop();
    }
  };
  bt(0);
  return res;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def subsets(nums):
    res, path = [], []
    def bt(start):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i + 1)
            path.pop()
    bt(0)
    return res


def subsets_with_dup(nums):
    nums.sort()
    res, path = [], []
    def bt(start):
        res.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i-1]: continue
            path.append(nums[i])
            bt(i + 1)
            path.pop()
    bt(0)
    return res`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, 0, new ArrayList<>(), res);
        return res;
    }
    void bt(int[] a, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < a.length; i++) {
            path.add(a[i]);
            bt(a, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> path;
        bt(nums, 0, path, res);
        return res;
    }
private:
    void bt(vector<int>& a, int start, vector<int>& path, vector<vector<int>>& res) {
        res.push_back(path);
        for (int i = start; i < (int)a.size(); i++) {
            path.push_back(a[i]);
            bt(a, i + 1, path, res);
            path.pop_back();
        }
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [1, 2, 3] },
      },
      {
        id: "combination-sum",
        slug: "combination-sum",
        title: "Combination Sum",
        difficulty: "medium",
        description:
          "Find every combination of candidates (unlimited reuse) that sums to target.",
        timeComplexity: "O(2^t) in the worst case; pruning helps drastically",
        spaceComplexity: "O(t/min(candidates))",
        content: `## Combination Sum

Classic unbounded-choice backtracking: each candidate can be picked **any number of times**. Return every combination that sums to \`target\`.

### Template

- Sort candidates so we can **prune** once the running sum exceeds \`target\`.
- At each step, loop \`i = start..n-1\`. Recurse with \`start = i\` (not \`i+1\`) because the same element may be reused.
- On return, pop the element.

### Common variant — Combination Sum II (each element at most once)

- Recurse with \`start = i + 1\`.
- Skip duplicates at the same level: \`if (i > start && cand[i] === cand[i-1]) continue\`.

### Why not DP?

You *can* count the number of ways with DP in \`O(n · target)\`. But **enumerating** all combinations is output-sensitive; backtracking lets you stream each combination as it's completed, with tight pruning.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = (start, remaining) => {
    if (remaining === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      const c = candidates[i];
      if (c > remaining) break;                // pruning (sorted input)
      path.push(c);
      bt(i, remaining - c);                    // reuse allowed → start = i
      path.pop();
    }
  };
  bt(0, target);
  return res;
}

// Combination Sum II — each candidate used at most once, skip dup branches
function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = (start, remaining) => {
    if (remaining === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      if (candidates[i] > remaining) break;
      path.push(candidates[i]);
      bt(i + 1, remaining - candidates[i]);
      path.pop();
    }
  };
  bt(0, target);
  return res;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def combination_sum(candidates, target):
    candidates.sort()
    res, path = [], []
    def bt(start, remaining):
        if remaining == 0:
            res.append(path[:]); return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remaining: break            # pruning
            path.append(c)
            bt(i, remaining - c)               # reuse allowed
            path.pop()
    bt(0, target)
    return res


def combination_sum2(candidates, target):
    candidates.sort()
    res, path = [], []
    def bt(start, remaining):
        if remaining == 0:
            res.append(path[:]); return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i-1]: continue
            if candidates[i] > remaining: break
            path.append(candidates[i])
            bt(i + 1, remaining - candidates[i])
            path.pop()
    bt(0, target)
    return res`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public List<List<Integer>> combinationSum(int[] c, int target) {
        Arrays.sort(c);
        List<List<Integer>> res = new ArrayList<>();
        bt(c, 0, target, new ArrayList<>(), res);
        return res;
    }
    void bt(int[] c, int start, int rem, List<Integer> path, List<List<Integer>> res) {
        if (rem == 0) { res.add(new ArrayList<>(path)); return; }
        for (int i = start; i < c.length; i++) {
            if (c[i] > rem) break;
            path.add(c[i]);
            bt(c, i, rem - c[i], path, res);
            path.remove(path.size() - 1);
        }
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& c, int target) {
        sort(c.begin(), c.end());
        vector<vector<int>> res;
        vector<int> path;
        bt(c, 0, target, path, res);
        return res;
    }
private:
    void bt(vector<int>& c, int start, int rem,
            vector<int>& path, vector<vector<int>>& res) {
        if (rem == 0) { res.push_back(path); return; }
        for (int i = start; i < (int)c.size(); i++) {
            if (c[i] > rem) break;
            path.push_back(c[i]);
            bt(c, i, rem - c[i], path, res);
            path.pop_back();
        }
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [2, 3, 6, 7] },
      },
      {
        id: "generate-parentheses",
        slug: "generate-parentheses",
        title: "Generate Parentheses",
        difficulty: "medium",
        description: "Produce every well-formed string with n pairs of parens.",
        timeComplexity: "O(4^n / √n) — the n-th Catalan number",
        spaceComplexity: "O(n) recursion + output",
        content: `## Generate Parentheses

Return all well-formed strings with exactly \`n\` pairs of \`()\`.

### Key insight

A brute force generates all \`2^(2n)\` strings and filters — exponential waste. Backtracking with **two counters** prunes every invalid prefix the moment it forms:

- \`open\` — number of \`(\` placed so far.
- \`close\` — number of \`)\` placed so far.

Rules:

1. We may place \`(\` if \`open < n\`.
2. We may place \`)\` if \`close < open\` (otherwise the string goes negative).

### Why 4^n / √n?

The count of valid strings is the **n-th Catalan number**, \`C_n ~ 4^n / (n^(3/2) · √π)\`. Our backtracker visits only valid prefixes, so work is proportional to the output size.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function generateParenthesis(n) {
  const res = [];
  const bt = (cur, open, close) => {
    if (cur.length === 2 * n) { res.push(cur); return; }
    if (open < n)   bt(cur + '(', open + 1, close);
    if (close < open) bt(cur + ')', open, close + 1);
  };
  bt('', 0, 0);
  return res;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def generate_parenthesis(n):
    res = []
    def bt(cur, open_, close_):
        if len(cur) == 2 * n:
            res.append(cur); return
        if open_ < n:      bt(cur + '(', open_ + 1, close_)
        if close_ < open_: bt(cur + ')', open_, close_ + 1)
    bt('', 0, 0)
    return res`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        bt(new StringBuilder(), 0, 0, n, res);
        return res;
    }
    void bt(StringBuilder sb, int open, int close, int n, List<String> res) {
        if (sb.length() == 2 * n) { res.add(sb.toString()); return; }
        if (open < n) {
            sb.append('('); bt(sb, open + 1, close, n, res); sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')'); bt(sb, open, close + 1, n, res); sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> res;
        string cur;
        bt(cur, 0, 0, n, res);
        return res;
    }
private:
    void bt(string& cur, int open, int close, int n, vector<string>& res) {
        if ((int)cur.size() == 2 * n) { res.push_back(cur); return; }
        if (open < n)     { cur.push_back('('); bt(cur, open + 1, close, n, res); cur.pop_back(); }
        if (close < open) { cur.push_back(')'); bt(cur, open, close + 1, n, res); cur.pop_back(); }
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [3] },
      },
      {
        id: "word-search",
        slug: "word-search",
        title: "Word Search in a Grid",
        difficulty: "medium",
        description:
          "Check whether a word can be spelled by moving 4-directionally in a character grid, reusing no cell.",
        timeComplexity: "O(m · n · 3^L) — L = word length",
        spaceComplexity: "O(L) recursion",
        content: `## Word Search

Given an \`m × n\` board of letters and a string \`word\`, return whether the word exists as a **path of adjacent cells** (up/down/left/right) with no cell reused.

### Approach — DFS with in-place marking

For every cell that matches \`word[0]\`, launch a DFS:

1. If we matched all characters, return true.
2. Temporarily mark the current cell (e.g. set it to \`'#'\`) so the path doesn't reuse it.
3. Recurse on the 4 neighbors against \`word[k+1]\`.
4. **Restore** the cell on the way back up — this is the backtracking step.

### Why mark in-place?

Allocating a separate \`visited\` matrix per call adds overhead and memory. Overwriting the board character and restoring it later is O(1) and cache-friendly.

### Pruning tricks

- Precompute the letter frequency of \`board\` and \`word\`; if the word needs a character not present enough times, return false immediately.
- Start from the **rarer** end of the word (reverse \`word\` if its last character appears less often). Each starting cell seeds exponential work.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function exist(board, word) {
  const m = board.length, n = board[0].length;
  const dfs = (r, c, k) => {
    if (k === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n) return false;
    if (board[r][c] !== word[k]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';                        // mark visited
    const found =
      dfs(r + 1, c, k + 1) ||
      dfs(r - 1, c, k + 1) ||
      dfs(r, c + 1, k + 1) ||
      dfs(r, c - 1, k + 1);
    board[r][c] = tmp;                        // restore (backtrack)
    return found;
  };
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(r, c, k):
        if k == len(word): return True
        if r < 0 or r >= m or c < 0 or c >= n: return False
        if board[r][c] != word[k]: return False
        tmp, board[r][c] = board[r][c], '#'
        found = (dfs(r+1, c, k+1) or dfs(r-1, c, k+1)
              or dfs(r, c+1, k+1) or dfs(r, c-1, k+1))
        board[r][c] = tmp
        return found
    return any(dfs(r, c, 0) for r in range(m) for c in range(n))`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public boolean exist(char[][] b, String word) {
        int m = b.length, n = b[0].length;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (dfs(b, r, c, word, 0)) return true;
        return false;
    }
    boolean dfs(char[][] b, int r, int c, String w, int k) {
        if (k == w.length()) return true;
        if (r < 0 || r >= b.length || c < 0 || c >= b[0].length) return false;
        if (b[r][c] != w.charAt(k)) return false;
        char tmp = b[r][c];
        b[r][c] = '#';
        boolean found = dfs(b, r+1, c, w, k+1) || dfs(b, r-1, c, w, k+1)
                     || dfs(b, r, c+1, w, k+1) || dfs(b, r, c-1, w, k+1);
        b[r][c] = tmp;
        return found;
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    bool exist(vector<vector<char>>& b, string word) {
        int m = b.size(), n = b[0].size();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (dfs(b, r, c, word, 0)) return true;
        return false;
    }
private:
    bool dfs(vector<vector<char>>& b, int r, int c, const string& w, int k) {
        if (k == (int)w.size()) return true;
        if (r < 0 || r >= (int)b.size() || c < 0 || c >= (int)b[0].size()) return false;
        if (b[r][c] != w[k]) return false;
        char tmp = b[r][c]; b[r][c] = '#';
        bool found = dfs(b, r+1, c, w, k+1) || dfs(b, r-1, c, w, k+1)
                  || dfs(b, r, c+1, w, k+1) || dfs(b, r, c-1, w, k+1);
        b[r][c] = tmp;
        return found;
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [0] },
      },
      {
        id: "palindrome-partitioning",
        slug: "palindrome-partitioning",
        title: "Palindrome Partitioning",
        difficulty: "medium",
        description:
          "Partition a string into every possible list of palindromic substrings.",
        timeComplexity: "O(n · 2^n) worst case",
        spaceComplexity: "O(n) recursion",
        content: `## Palindrome Partitioning

Return **every** way to split \`s\` so each substring is a palindrome.

### Approach

Think of the string as a sequence of cut points. At each \`start\`, try every \`end >= start\`; if \`s[start..end]\` is a palindrome, include it and recurse from \`end+1\`.

### Palindrome test — two tricks

1. **Two-pointer check** inline — O(length) per test; O(n · 2^n) overall, often fast enough.
2. **Precompute** \`isPal[l][r]\` with a DP in O(n²) so each membership test is O(1):

\`\`\`
isPal[l][r] = (s[l] == s[r]) and (r - l < 2 or isPal[l+1][r-1])
\`\`\`

### Related: Palindrome Partitioning II

Minimum number of cuts. That's a DP problem, not a backtracking one — once you only care about the count, backtracking is overkill.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function partition(s) {
  const n = s.length;
  const isPal = Array.from({ length: n }, () => Array(n).fill(false));
  for (let r = 0; r < n; r++)
    for (let l = 0; l <= r; l++)
      if (s[l] === s[r] && (r - l < 2 || isPal[l + 1][r - 1]))
        isPal[l][r] = true;

  const res = [], path = [];
  const bt = (start) => {
    if (start === n) { res.push([...path]); return; }
    for (let end = start; end < n; end++) {
      if (!isPal[start][end]) continue;
      path.push(s.slice(start, end + 1));
      bt(end + 1);
      path.pop();
    }
  };
  bt(0);
  return res;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def partition(s):
    n = len(s)
    is_pal = [[False] * n for _ in range(n)]
    for r in range(n):
        for l in range(r + 1):
            if s[l] == s[r] and (r - l < 2 or is_pal[l+1][r-1]):
                is_pal[l][r] = True

    res, path = [], []
    def bt(start):
        if start == n:
            res.append(path[:]); return
        for end in range(start, n):
            if not is_pal[start][end]: continue
            path.append(s[start:end+1])
            bt(end + 1)
            path.pop()
    bt(0)
    return res`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public List<List<String>> partition(String s) {
        int n = s.length();
        boolean[][] isPal = new boolean[n][n];
        for (int r = 0; r < n; r++)
            for (int l = 0; l <= r; l++)
                if (s.charAt(l) == s.charAt(r) && (r - l < 2 || isPal[l+1][r-1]))
                    isPal[l][r] = true;

        List<List<String>> res = new ArrayList<>();
        bt(s, 0, isPal, new ArrayList<>(), res);
        return res;
    }
    void bt(String s, int start, boolean[][] isPal, List<String> path, List<List<String>> res) {
        if (start == s.length()) { res.add(new ArrayList<>(path)); return; }
        for (int end = start; end < s.length(); end++) {
            if (!isPal[start][end]) continue;
            path.add(s.substring(start, end + 1));
            bt(s, end + 1, isPal, path, res);
            path.remove(path.size() - 1);
        }
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    vector<vector<string>> partition(string s) {
        int n = s.size();
        vector<vector<bool>> isPal(n, vector<bool>(n, false));
        for (int r = 0; r < n; r++)
            for (int l = 0; l <= r; l++)
                if (s[l] == s[r] && (r - l < 2 || isPal[l+1][r-1]))
                    isPal[l][r] = true;

        vector<vector<string>> res;
        vector<string> path;
        bt(s, 0, isPal, path, res);
        return res;
    }
private:
    void bt(const string& s, int start, vector<vector<bool>>& isPal,
            vector<string>& path, vector<vector<string>>& res) {
        if (start == (int)s.size()) { res.push_back(path); return; }
        for (int end = start; end < (int)s.size(); end++) {
            if (!isPal[start][end]) continue;
            path.push_back(s.substr(start, end - start + 1));
            bt(s, end + 1, isPal, path, res);
            path.pop_back();
        }
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [0] },
      },
      {
        id: "n-queens",
        slug: "n-queens",
        title: "N-Queens",
        difficulty: "hard",
        description:
          "Place N queens on an N×N board so no two attack each other.",
        timeComplexity: "Practical O(n!) with pruning",
        spaceComplexity: "O(n)",
        content: `## N-Queens

Place \`n\` queens so none share a row, column, or diagonal.

### Three constraints → three sets

Place one queen per row. At row \`r\`, column \`c\` is a valid choice iff:

- \`cols\` does not contain \`c\` — no shared column.
- \`diag1\` does not contain \`r - c\` — no shared "↘" diagonal.
- \`diag2\` does not contain \`r + c\` — no shared "↙" diagonal.

### Why \`r - c\` and \`r + c\` identify diagonals

Along a "↘" diagonal, both row and column increase by 1 per step → \`r - c\` is constant. Along a "↙" diagonal, row increases while column decreases → \`r + c\` is constant. Three integer sets are enough; no need for an \`n × n\` attack matrix.

### Bitmask optimization

For large \`n\`, represent each of \`cols\`, \`diag1\`, \`diag2\` as a single integer. "Not under attack" is \`avail = ~(cols | diag1 | diag2) & ((1 << n) - 1)\`. The lowest set bit of \`avail\` is \`avail & -avail\`. This turns the inner loop into a few bit ops — the standard high-performance implementation.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function solveNQueens(n) {
  const res = [];
  const queens = new Array(n).fill(-1);      // queens[r] = column
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  const bt = (r) => {
    if (r === n) {
      res.push(queens.map(c => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      queens[r] = c;
      cols.add(c); d1.add(r - c); d2.add(r + c);
      bt(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c);
    }
  };
  bt(0);
  return res;
}

// Count-only variant with bitmasks — counts solutions fast
function totalNQueens(n) {
  const full = (1 << n) - 1;
  let count = 0;
  const bt = (cols, d1, d2) => {
    if (cols === full) { count++; return; }
    let avail = ~(cols | d1 | d2) & full;
    while (avail) {
      const bit = avail & -avail;
      avail ^= bit;
      bt(cols | bit, (d1 | bit) << 1 & full, (d2 | bit) >> 1);
    }
  };
  bt(0, 0, 0);
  return count;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def solve_n_queens(n):
    res = []
    queens = [-1] * n
    cols, d1, d2 = set(), set(), set()
    def bt(r):
        if r == n:
            res.append(['.' * c + 'Q' + '.' * (n - c - 1) for c in queens]); return
        for c in range(n):
            if c in cols or (r - c) in d1 or (r + c) in d2: continue
            queens[r] = c
            cols.add(c); d1.add(r - c); d2.add(r + c)
            bt(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c)
    bt(0)
    return res


def total_n_queens(n):
    full = (1 << n) - 1
    count = 0
    def bt(cols, d1, d2):
        nonlocal count
        if cols == full: count += 1; return
        avail = ~(cols | d1 | d2) & full
        while avail:
            bit = avail & -avail
            avail ^= bit
            bt(cols | bit, ((d1 | bit) << 1) & full, (d2 | bit) >> 1)
    bt(0, 0, 0)
    return count`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    List<List<String>> res = new ArrayList<>();
    int[] queens;
    Set<Integer> cols = new HashSet<>(), d1 = new HashSet<>(), d2 = new HashSet<>();

    public List<List<String>> solveNQueens(int n) {
        queens = new int[n];
        bt(0, n);
        return res;
    }
    void bt(int r, int n) {
        if (r == n) {
            List<String> board = new ArrayList<>();
            for (int c : queens) {
                char[] row = new char[n];
                Arrays.fill(row, '.');
                row[c] = 'Q';
                board.add(new String(row));
            }
            res.add(board); return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || d1.contains(r - c) || d2.contains(r + c)) continue;
            queens[r] = c;
            cols.add(c); d1.add(r - c); d2.add(r + c);
            bt(r + 1, n);
            cols.remove(c); d1.remove(r - c); d2.remove(r + c);
        }
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> res;
        vector<int> queens(n, -1);
        unordered_set<int> cols, d1, d2;
        function<void(int)> bt = [&](int r) {
            if (r == n) {
                vector<string> board;
                for (int c : queens) {
                    string row(n, '.');
                    row[c] = 'Q';
                    board.push_back(row);
                }
                res.push_back(board); return;
            }
            for (int c = 0; c < n; c++) {
                if (cols.count(c) || d1.count(r - c) || d2.count(r + c)) continue;
                queens[r] = c;
                cols.insert(c); d1.insert(r - c); d2.insert(r + c);
                bt(r + 1);
                cols.erase(c); d1.erase(r - c); d2.erase(r + c);
            }
        };
        bt(0);
        return res;
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [4] },
      },
      {
        id: "sudoku-solver",
        slug: "sudoku-solver",
        title: "Sudoku Solver",
        difficulty: "hard",
        description:
          "Fill a partially filled 9×9 grid respecting row, column, and 3×3 box constraints.",
        timeComplexity: "O(9^m) worst case; practically fast with bitmasks",
        spaceComplexity: "O(1)",
        content: `## Sudoku Solver

Solve a standard 9×9 Sudoku in-place.

### Three constraint sets

For every cell \`(r, c)\` holding digit \`d\`, three membership checks must all succeed:

- Row \`r\` does not already contain \`d\`.
- Column \`c\` does not already contain \`d\`.
- Box index \`b = 3·(r/3) + (c/3)\` does not already contain \`d\`.

Maintain \`rowUsed[9][10]\`, \`colUsed[9][10]\`, \`boxUsed[9][10]\` (or bitmasks) and update on choose / undo on backtrack.

### The two practical speed-ups

1. **Most Constrained Variable (MRV)**: at every recursion step, pick the empty cell with the **fewest** legal digits. Drastically reduces branching near the end of solve.
2. **Bitmasks**: one 9-bit integer per row/col/box. Legal digits at \`(r, c)\` are \`~(row[r] | col[c] | box[b]) & 0x1FF\`. Iterate via \`bit = avail & -avail\` and update with XOR.

With these two, even "hard" Sudokus solve in microseconds.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function solveSudoku(board) {
  const row = Array.from({ length: 9 }, () => new Array(10).fill(false));
  const col = Array.from({ length: 9 }, () => new Array(10).fill(false));
  const box = Array.from({ length: 9 }, () => new Array(10).fill(false));
  const empties = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === '.') { empties.push([r, c]); continue; }
      const d = +board[r][c], b = 3 * ((r / 3) | 0) + ((c / 3) | 0);
      row[r][d] = col[c][d] = box[b][d] = true;
    }

  const dfs = (k) => {
    if (k === empties.length) return true;
    const [r, c] = empties[k], b = 3 * ((r / 3) | 0) + ((c / 3) | 0);
    for (let d = 1; d <= 9; d++) {
      if (row[r][d] || col[c][d] || box[b][d]) continue;
      board[r][c] = String(d);
      row[r][d] = col[c][d] = box[b][d] = true;
      if (dfs(k + 1)) return true;
      row[r][d] = col[c][d] = box[b][d] = false;
      board[r][c] = '.';
    }
    return false;
  };
  dfs(0);
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def solve_sudoku(board):
    row = [[False]*10 for _ in range(9)]
    col = [[False]*10 for _ in range(9)]
    box = [[False]*10 for _ in range(9)]
    empties = []
    for r in range(9):
        for c in range(9):
            if board[r][c] == '.':
                empties.append((r, c))
            else:
                d = int(board[r][c])
                b = 3*(r//3) + c//3
                row[r][d] = col[c][d] = box[b][d] = True

    def dfs(k):
        if k == len(empties): return True
        r, c = empties[k]
        b = 3*(r//3) + c//3
        for d in range(1, 10):
            if row[r][d] or col[c][d] or box[b][d]: continue
            board[r][c] = str(d)
            row[r][d] = col[c][d] = box[b][d] = True
            if dfs(k + 1): return True
            row[r][d] = col[c][d] = box[b][d] = False
            board[r][c] = '.'
        return False
    dfs(0)`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public void solveSudoku(char[][] board) {
        boolean[][] row = new boolean[9][10], col = new boolean[9][10], box = new boolean[9][10];
        List<int[]> empties = new ArrayList<>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') { empties.add(new int[]{r, c}); continue; }
                int d = board[r][c] - '0', b = 3*(r/3) + c/3;
                row[r][d] = col[c][d] = box[b][d] = true;
            }
        dfs(0, board, row, col, box, empties);
    }
    boolean dfs(int k, char[][] board, boolean[][] row, boolean[][] col, boolean[][] box, List<int[]> empties) {
        if (k == empties.size()) return true;
        int r = empties.get(k)[0], c = empties.get(k)[1], b = 3*(r/3) + c/3;
        for (int d = 1; d <= 9; d++) {
            if (row[r][d] || col[c][d] || box[b][d]) continue;
            board[r][c] = (char)('0' + d);
            row[r][d] = col[c][d] = box[b][d] = true;
            if (dfs(k + 1, board, row, col, box, empties)) return true;
            row[r][d] = col[c][d] = box[b][d] = false;
            board[r][c] = '.';
        }
        return false;
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        vector<vector<bool>> row(9, vector<bool>(10, false)),
                             col(9, vector<bool>(10, false)),
                             box(9, vector<bool>(10, false));
        vector<pair<int,int>> empties;
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') { empties.push_back({r, c}); continue; }
                int d = board[r][c] - '0', b = 3*(r/3) + c/3;
                row[r][d] = col[c][d] = box[b][d] = true;
            }
        dfs(0, board, row, col, box, empties);
    }
private:
    bool dfs(int k, vector<vector<char>>& b,
             vector<vector<bool>>& row, vector<vector<bool>>& col, vector<vector<bool>>& box,
             vector<pair<int,int>>& empties) {
        if (k == (int)empties.size()) return true;
        auto [r, c] = empties[k];
        int bx = 3*(r/3) + c/3;
        for (int d = 1; d <= 9; d++) {
            if (row[r][d] || col[c][d] || box[bx][d]) continue;
            b[r][c] = '0' + d;
            row[r][d] = col[c][d] = box[bx][d] = true;
            if (dfs(k + 1, b, row, col, box, empties)) return true;
            row[r][d] = col[c][d] = box[bx][d] = false;
            b[r][c] = '.';
        }
        return false;
    }
};`,
          },
        ],
        visualizationConfig: { type: "backtracking", defaultInput: [0] },
      },
    ],
  },

  // ─────────── 12. Bit Manipulation ───────────
  {
    id: "bit-manipulation",
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    icon: "🔢",
    description:
      "Work with numbers as bit vectors for constant-time set operations, parity tricks, and space-efficient state.",
    color: "bg-gray-500",
    topics: [
      {
        id: "bit-basics",
        slug: "bit-basics",
        title: "Bitwise Operators & Tricks",
        difficulty: "easy",
        description:
          "AND, OR, XOR, shifts, and the identities that power every bit-level algorithm.",
        timeComplexity: "O(1) per operation",
        spaceComplexity: "O(1)",
        content: `## Thinking in Bits

Every unsigned integer is a fixed-width bit vector. The five primitive operations compose into a surprisingly rich toolkit:

### The five operators

| Op    | Meaning                       | Key identity                |
|-------|-------------------------------|-----------------------------|
| \`&\` | AND — bit set iff **both** are | \`x & 0 = 0\`, \`x & x = x\` |
| \`|\` | OR — bit set iff **either** is | \`x | 0 = x\`, \`x | x = x\` |
| \`^\` | XOR — bit set iff **exactly one** | \`x ^ 0 = x\`, \`x ^ x = 0\` |
| \`~\` | NOT — flip every bit           | \`~x = -x - 1\` (two's complement) |
| \`<<\`, \`>>\` | Shift left / right (arithmetic or logical) | \`x << k\` = \`x · 2^k\` (no overflow check) |

### The essential one-liners

| Task                          | Expression              |
|-------------------------------|-------------------------|
| Test bit \`k\`                | \`(x >> k) & 1\`        |
| Set bit \`k\`                 | \`x | (1 << k)\`        |
| Clear bit \`k\`               | \`x & ~(1 << k)\`       |
| Toggle bit \`k\`              | \`x ^ (1 << k)\`        |
| Is odd                        | \`x & 1\`               |
| Is power of two               | \`x > 0 && (x & (x-1)) == 0\` |
| Lowest set bit (isolated)     | \`x & -x\`              |
| Clear lowest set bit          | \`x & (x-1)\`           |
| Count bits to flip to get y   | \`popcount(x ^ y)\`     |
| Swap without temp             | \`a ^= b; b ^= a; a ^= b;\` |

### Why XOR shows up everywhere

\`x ^ x = 0\` and XOR is commutative + associative. So XORing every element of an array cancels out any value that appears an **even** number of times — ideal for "find the unique element" problems and for parity arguments.

### Gotchas

- In JavaScript, bitwise operators coerce to **32-bit signed ints**. \`(1 << 31)\` is \`-2147483648\`. Use \`>>>\` for unsigned right shift.
- In Python, integers are arbitrary precision; \`~x = -x - 1\` can give weird-looking negatives.
- In C/C++/Java, shifting by ≥ the width of the type is **undefined / implementation-defined**. Mask first.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `const testBit   = (x, k) => ((x >> k) & 1) === 1;
const setBit    = (x, k) => x | (1 << k);
const clearBit  = (x, k) => x & ~(1 << k);
const toggleBit = (x, k) => x ^ (1 << k);

const lowestBit      = (x) => x & -x;          // isolate lowest set bit
const clearLowestBit = (x) => x & (x - 1);     // clear  lowest set bit

// Swap in place without a temp
function swap(a, b) { a ^= b; b ^= a; a ^= b; return [a, b]; }`,
          },
          {
            language: "python",
            label: "Python",
            code: `def test_bit(x, k):   return (x >> k) & 1 == 1
def set_bit(x, k):    return x | (1 << k)
def clear_bit(x, k):  return x & ~(1 << k)
def toggle_bit(x, k): return x ^ (1 << k)

def lowest_bit(x):       return x & -x
def clear_lowest_bit(x): return x & (x - 1)

# Python int.bit_count() returns popcount on 3.10+
def popcount(x): return bin(x & 0xFFFFFFFF).count("1")`,
          },
          {
            language: "java",
            label: "Java",
            code: `class BitTricks {
    static boolean testBit(int x, int k)  { return ((x >> k) & 1) == 1; }
    static int setBit(int x, int k)       { return x |  (1 << k); }
    static int clearBit(int x, int k)     { return x & ~(1 << k); }
    static int toggleBit(int x, int k)    { return x ^  (1 << k); }

    static int lowestBit(int x)      { return x & -x; }
    static int clearLowestBit(int x) { return x & (x - 1); }

    static int popcount(int x) { return Integer.bitCount(x); }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `inline bool testBit(int x, int k)  { return (x >> k) & 1; }
inline int  setBit(int x, int k)   { return x |  (1 << k); }
inline int  clearBit(int x, int k) { return x & ~(1 << k); }
inline int  toggleBit(int x, int k){ return x ^  (1 << k); }

inline int  lowestBit(int x)       { return x & -x; }
inline int  clearLowestBit(int x)  { return x & (x - 1); }

// GCC/Clang builtin
inline int  popcount(unsigned x)   { return __builtin_popcount(x); }`,
          },
        ],
        visualizationConfig: { type: "bit", defaultInput: [29] },
      },
      {
        id: "single-number",
        slug: "single-number",
        title: "Single Number (XOR)",
        difficulty: "easy",
        description:
          "Find the element that appears exactly once when every other element appears twice.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        content: `## Single Number

Given \`nums\` where every element appears **twice** except one, return the unique element.

### One-liner: XOR-accumulate

Because \`x ^ x = 0\` and \`x ^ 0 = x\`, XORing the whole array cancels out every pair and leaves the unique value.

\`\`\`
result = nums[0] ^ nums[1] ^ ... ^ nums[n-1]
\`\`\`

**No extra memory, order-independent, one pass.** This is why XOR shows up in hash-less "find the odd one out" solutions.

### Generalizations

- **Single Number II** — every element appears *three* times except one. Count bits modulo 3 using two accumulators \`ones\`, \`twos\` that form a bit-level finite-state machine.
- **Single Number III** — *two* elements appear once, the rest appear twice. XOR the whole array → \`x ^ y\`. Pick any bit that's set in the result (they differ there), partition the array by that bit, and XOR each partition separately to recover \`x\` and \`y\`.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `function singleNumber(nums) {
  let r = 0;
  for (const x of nums) r ^= x;
  return r;
}

// Single Number III — two uniques, everything else paired.
function singleNumberIII(nums) {
  let xor = 0;
  for (const x of nums) xor ^= x;
  const diffBit = xor & -xor;      // any bit where the two uniques differ
  let a = 0, b = 0;
  for (const x of nums) {
    if (x & diffBit) a ^= x; else b ^= x;
  }
  return [a, b];
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def single_number(nums):
    r = 0
    for x in nums: r ^= x
    return r


def single_number_iii(nums):
    xor = 0
    for x in nums: xor ^= x
    diff = xor & -xor
    a = b = 0
    for x in nums:
        if x & diff: a ^= x
        else:        b ^= x
    return [a, b]`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public int singleNumber(int[] nums) {
        int r = 0;
        for (int x : nums) r ^= x;
        return r;
    }

    public int[] singleNumberIII(int[] nums) {
        int xor = 0;
        for (int x : nums) xor ^= x;
        int diff = xor & -xor;
        int a = 0, b = 0;
        for (int x : nums) {
            if ((x & diff) != 0) a ^= x;
            else                 b ^= x;
        }
        return new int[]{a, b};
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int singleNumber(vector<int>& nums) {
    int r = 0;
    for (int x : nums) r ^= x;
    return r;
}

vector<int> singleNumberIII(vector<int>& nums) {
    int xorAll = 0;
    for (int x : nums) xorAll ^= x;
    int diff = xorAll & -xorAll;
    int a = 0, b = 0;
    for (int x : nums) {
        if (x & diff) a ^= x;
        else          b ^= x;
    }
    return {a, b};
}`,
          },
        ],
        visualizationConfig: { type: "bit", defaultInput: [2, 3, 5, 4, 5, 3, 4] },
      },
      {
        id: "count-set-bits",
        slug: "count-set-bits",
        title: "Count Set Bits",
        difficulty: "easy",
        description:
          "Three techniques to count 1-bits (popcount), in increasing sophistication.",
        timeComplexity: "O(bits) / O(set bits) / O(1)",
        spaceComplexity: "O(1)",
        content: `## Counting 1-Bits (popcount / Hamming Weight)

### 1. Scan every bit — O(log x)

\`\`\`
count = 0
while x > 0:
    count += x & 1
    x >>= 1
\`\`\`

Simple, works, but visits zero bits too.

### 2. Brian Kernighan's algorithm — O(number of set bits)

\`x & (x - 1)\` clears the lowest set bit. Count how many times you can do that before \`x\` is 0. For sparse integers this is much faster than scanning.

\`\`\`
count = 0
while x > 0:
    x &= x - 1
    count += 1
\`\`\`

### 3. SWAR / builtin — effectively O(1)

Bit-parallel swizzling (below) counts all bits in a fixed-width int in a constant number of shift/mask/add operations:

\`\`\`
x = x - ((x >> 1) & 0x55555555);
x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
x = (x + (x >> 4)) & 0x0F0F0F0F;
return (x * 0x01010101) >> 24;
\`\`\`

In practice, use the language builtin (\`Integer.bitCount\`, \`int.bit_count()\`, \`__builtin_popcount\`) — hardware instructions on modern CPUs.

### Counting Bits for every i in \[0..n\] — DP

\`popcount(i) = popcount(i >> 1) + (i & 1)\`, or equivalently \`popcount(i) = popcount(i & (i-1)) + 1\`. Fills an array in O(n).`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Brian Kernighan
function hammingWeight(n) {
  let count = 0;
  while (n !== 0) { n &= (n - 1); count++; }
  return count;
}

// Build popcount[0..n] in O(n)
function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
  return dp;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def hamming_weight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count


def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) { n &= (n - 1); count++; }
        return count;
    }

    public int[] countBits(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
        return dp;
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) { n &= (n - 1); count++; }
    return count;
}

vector<int> countBits(int n) {
    vector<int> dp(n + 1);
    for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
    return dp;
}`,
          },
        ],
        visualizationConfig: { type: "bit", defaultInput: [29] },
      },
      {
        id: "power-of-two",
        slug: "power-of-two",
        title: "Power of Two / Four",
        difficulty: "easy",
        description:
          "Detect powers using bit tricks that replace division and logarithms.",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        content: `## Is \`n\` a Power of Two?

Exactly one bit is set, so \`n & (n - 1) == 0\` **and** \`n > 0\`.

\`\`\`
isPowerOfTwo(n) = n > 0 && (n & (n - 1)) == 0
\`\`\`

### Why it works

A power of two has binary form \`10…0\`. Subtracting 1 flips that bit to 0 and all lower bits to 1 (e.g. \`1000 - 1 = 0111\`). The AND therefore is 0. Any number with two or more set bits leaves something non-zero after that AND.

### Power of Four

In addition to "single bit set", require that bit to be at an **even** index. Mask with the 32-bit constant \`0x55555555\` (= \`0101…0101\`): that's non-zero iff the single bit sits at an even position.

\`\`\`
isPowerOfFour(n) = n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0
\`\`\`

### Power of Three

There is no pure-bit trick because 3 is odd. The elegant one-liner relies on the fact that the largest 32-bit power of three is \`3^19 = 1162261467\`:

\`\`\`
isPowerOfThree(n) = n > 0 && 1162261467 % n == 0
\`\`\``,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `const isPowerOfTwo  = (n) => n > 0 && (n & (n - 1)) === 0;
const isPowerOfFour = (n) => isPowerOfTwo(n) && (n & 0x55555555) !== 0;
const isPowerOfThree = (n) => n > 0 && 1162261467 % n === 0;`,
          },
          {
            language: "python",
            label: "Python",
            code: `def is_power_of_two(n):   return n > 0 and (n & (n - 1)) == 0
def is_power_of_four(n):  return is_power_of_two(n) and (n & 0x55555555) != 0
def is_power_of_three(n): return n > 0 and 1162261467 % n == 0`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public boolean isPowerOfTwo(int n)  { return n > 0 && (n & (n - 1)) == 0; }
    public boolean isPowerOfFour(int n) { return isPowerOfTwo(n) && (n & 0x55555555) != 0; }
    public boolean isPowerOfThree(int n){ return n > 0 && 1162261467 % n == 0; }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `bool isPowerOfTwo(int n)   { return n > 0 && (n & (n - 1)) == 0; }
bool isPowerOfFour(int n)  { return isPowerOfTwo(n) && (n & 0x55555555) != 0; }
bool isPowerOfThree(int n) { return n > 0 && 1162261467 % n == 0; }`,
          },
        ],
        visualizationConfig: { type: "bit", defaultInput: [16] },
      },
      {
        id: "reverse-bits",
        slug: "reverse-bits",
        title: "Reverse Bits",
        difficulty: "easy",
        description:
          "Reverse the 32-bit representation of an unsigned integer.",
        timeComplexity: "O(1) / O(log width) with SWAR",
        spaceComplexity: "O(1)",
        content: `## Reverse Bits

Reverse the binary representation of a 32-bit unsigned integer.

### Bit-by-bit — straightforward, O(32)

Shift the input right; shift the output left; OR in the plucked low bit. 32 iterations.

### SWAR — O(log 32) = 5 steps, branch-free

Swap pairs of neighbors, then pairs-of-pairs, then nibbles, then bytes, then halves:

\`\`\`
n = ((n >> 1)  & 0x55555555) | ((n & 0x55555555) << 1);
n = ((n >> 2)  & 0x33333333) | ((n & 0x33333333) << 2);
n = ((n >> 4)  & 0x0F0F0F0F) | ((n & 0x0F0F0F0F) << 4);
n = ((n >> 8)  & 0x00FF00FF) | ((n & 0x00FF00FF) << 8);
n = (n >> 16) | (n << 16);
\`\`\`

Each line reverses bits within groups of width \`2^line\`. Five lines ⇒ 32 bits reversed. This is the canonical constant-time bit-reverse trick used in FFT implementations and hardware.`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Bit-by-bit, unsigned right shift to stay in 32-bit space.
function reverseBits(n) {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    res = (res << 1) | (n & 1);
    n >>>= 1;
  }
  return res >>> 0;
}

// SWAR — five ops, constant time.
function reverseBitsSwar(n) {
  n = ((n >>> 1)  & 0x55555555) | ((n & 0x55555555) << 1);
  n = ((n >>> 2)  & 0x33333333) | ((n & 0x33333333) << 2);
  n = ((n >>> 4)  & 0x0F0F0F0F) | ((n & 0x0F0F0F0F) << 4);
  n = ((n >>> 8)  & 0x00FF00FF) | ((n & 0x00FF00FF) << 8);
  n = (n >>> 16) | (n << 16);
  return n >>> 0;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def reverse_bits(n):
    res = 0
    for _ in range(32):
        res = (res << 1) | (n & 1)
        n >>= 1
    return res & 0xFFFFFFFF


def reverse_bits_swar(n):
    n = ((n >> 1)  & 0x55555555) | ((n & 0x55555555) << 1)
    n = ((n >> 2)  & 0x33333333) | ((n & 0x33333333) << 2)
    n = ((n >> 4)  & 0x0F0F0F0F) | ((n & 0x0F0F0F0F) << 4)
    n = ((n >> 8)  & 0x00FF00FF) | ((n & 0x00FF00FF) << 8)
    n = (n >> 16) | ((n & 0xFFFF) << 16)
    return n & 0xFFFFFFFF`,
          },
          {
            language: "java",
            label: "Java",
            code: `class Solution {
    public int reverseBits(int n) {
        int res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>>= 1;
        }
        return res;
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `uint32_t reverseBits(uint32_t n) {
    uint32_t res = 0;
    for (int i = 0; i < 32; i++) {
        res = (res << 1) | (n & 1u);
        n >>= 1;
    }
    return res;
}`,
          },
        ],
        visualizationConfig: { type: "bit", defaultInput: [43261596] },
      },
      {
        id: "bitmask-subsets",
        slug: "bitmask-subsets",
        title: "Bitmask Subset Enumeration",
        difficulty: "medium",
        description:
          "Use integers as subset identifiers for DP over subsets and fast enumeration.",
        timeComplexity: "O(2^n · n) for full DP",
        spaceComplexity: "O(2^n)",
        content: `## Bitmasks as Sets

An \`n\`-bit integer encodes a subset of \`{0, 1, …, n-1}\`: bit \`i\` is 1 iff element \`i\` is in the subset.

This representation turns set operations into single CPU instructions:

| Set op            | Bitmask expression       |
|-------------------|--------------------------|
| Union             | \`a | b\`                 |
| Intersection      | \`a & b\`                 |
| Difference        | \`a & ~b\`                |
| Symmetric diff    | \`a ^ b\`                 |
| Is \`i\` in \`s\` | \`(s >> i) & 1\`         |
| Add \`i\`         | \`s | (1 << i)\`          |
| Remove \`i\`      | \`s & ~(1 << i)\`         |
| Toggle \`i\`      | \`s ^ (1 << i)\`          |

### Enumerate every subset of \`{0…n-1}\`

\`\`\`
for mask in 0 .. (1 << n) - 1:
    process(mask)
\`\`\`

### Enumerate every subset of a specific mask \`m\`

\`\`\`
sub = m
while True:
    process(sub)
    if sub == 0: break
    sub = (sub - 1) & m
\`\`\`

This walks exactly the subsets of \`m\` in decreasing order and **skips** bits that aren't in \`m\`. It's the workhorse of bitmask-DP problems like Travelling Salesman and set-cover variants.

### When to reach for bitmask DP

Use it when the state naturally includes "which elements have I used / visited so far" **and** \`n\` is small (≤ 20 or so). Beyond ~22 bits, \`2^n\` blows up.

### Common bitmask-DP problems

- **Travelling Salesman** — \`dp[mask][i]\` = min cost to visit set \`mask\` ending at city \`i\`.
- **Assign n jobs to n workers** — \`dp[mask]\` = min cost when the set of assigned workers = \`mask\`.
- **Word Break with fixed dictionary size** — bitmask of "words remaining".`,
        codeExamples: [
          {
            language: "javascript",
            label: "JavaScript",
            code: `// Enumerate all 2^n subsets
function allSubsets(n) {
  const out = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(i);
    out.push(subset);
  }
  return out;
}

// Enumerate every subset of a given mask m
function subsetsOf(m) {
  const out = [];
  let sub = m;
  while (true) {
    out.push(sub);
    if (sub === 0) break;
    sub = (sub - 1) & m;
  }
  return out;
}

// Travelling Salesman — bitmask DP, O(2^n · n^2)
function tsp(dist) {
  const n = dist.length;
  const INF = Infinity;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(INF));
  dp[1][0] = 0;
  for (let mask = 1; mask < (1 << n); mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u)) || dp[mask][u] === INF) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        const next = mask | (1 << v);
        if (dp[mask][u] + dist[u][v] < dp[next][v])
          dp[next][v] = dp[mask][u] + dist[u][v];
      }
    }
  }
  let best = INF;
  for (let u = 1; u < n; u++)
    best = Math.min(best, dp[(1 << n) - 1][u] + dist[u][0]);
  return best;
}`,
          },
          {
            language: "python",
            label: "Python",
            code: `def all_subsets(n):
    return [[i for i in range(n) if mask & (1 << i)]
            for mask in range(1 << n)]


def subsets_of(m):
    out, sub = [], m
    while True:
        out.append(sub)
        if sub == 0: break
        sub = (sub - 1) & m
    return out


def tsp(dist):
    n = len(dist)
    INF = float('inf')
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if not (mask & (1 << u)) or dp[mask][u] == INF: continue
            for v in range(n):
                if mask & (1 << v): continue
                nxt = mask | (1 << v)
                if dp[mask][u] + dist[u][v] < dp[nxt][v]:
                    dp[nxt][v] = dp[mask][u] + dist[u][v]
    return min(dp[(1 << n) - 1][u] + dist[u][0] for u in range(1, n))`,
          },
          {
            language: "java",
            label: "Java",
            code: `class BitmaskDP {
    public int tsp(int[][] dist) {
        int n = dist.length, FULL = (1 << n) - 1, INF = Integer.MAX_VALUE / 2;
        int[][] dp = new int[1 << n][n];
        for (int[] row : dp) Arrays.fill(row, INF);
        dp[1][0] = 0;
        for (int mask = 1; mask <= FULL; mask++)
            for (int u = 0; u < n; u++) {
                if ((mask & (1 << u)) == 0 || dp[mask][u] == INF) continue;
                for (int v = 0; v < n; v++) {
                    if ((mask & (1 << v)) != 0) continue;
                    int nxt = mask | (1 << v);
                    dp[nxt][v] = Math.min(dp[nxt][v], dp[mask][u] + dist[u][v]);
                }
            }
        int best = INF;
        for (int u = 1; u < n; u++)
            best = Math.min(best, dp[FULL][u] + dist[u][0]);
        return best;
    }
}`,
          },
          {
            language: "cpp",
            label: "C++",
            code: `int tsp(vector<vector<int>>& dist) {
    int n = dist.size(), FULL = (1 << n) - 1;
    const int INF = INT_MAX / 2;
    vector<vector<int>> dp(1 << n, vector<int>(n, INF));
    dp[1][0] = 0;
    for (int mask = 1; mask <= FULL; ++mask)
        for (int u = 0; u < n; ++u) {
            if (!(mask & (1 << u)) || dp[mask][u] == INF) continue;
            for (int v = 0; v < n; ++v) {
                if (mask & (1 << v)) continue;
                int nxt = mask | (1 << v);
                dp[nxt][v] = min(dp[nxt][v], dp[mask][u] + dist[u][v]);
            }
        }
    int best = INF;
    for (int u = 1; u < n; ++u)
        best = min(best, dp[FULL][u] + dist[u][0]);
    return best;
}`,
          },
        ],
        visualizationConfig: { type: "bit", defaultInput: [13] },
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
