import type { Problem } from "@/data/types";

// ──────────────────────────────────────────────────────────────
// 20 more DSA problems.
// All have an associated animated walkthrough in
// `src/utils/problems/animations.ts`.
// ──────────────────────────────────────────────────────────────

export const moreProblems: Problem[] = [
  // 1
  {
    id: "valid-anagram",
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "easy",
    category: "strings",
    tags: ["String", "Hash Map"],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

### Examples
**Input:** s = "anagram", t = "nagaram"
**Output:** true

**Input:** s = "rat", t = "car"
**Output:** false`,
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // Your code here\n}`,
      python: `def is_anagram(s, t):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}`,
      python: `def is_anagram(s, t):\n    if len(s) != len(t): return False\n    from collections import Counter\n    return Counter(s) == Counter(t)`,
    },
    testCases: [
      { input: 's = "anagram", t = "nagaram"', expectedOutput: "true" },
      { input: 's = "rat", t = "car"', expectedOutput: "false" },
    ],
    hints: [
      "Count character frequencies.",
      "If sums cancel to zero in a single pass, it's an anagram.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // 2
  {
    id: "reverse-linked-list",
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "easy",
    category: "linked-list",
    tags: ["Linked List", "Recursion"],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

### Examples
**Input:** head = [1,2,3,4,5]
**Output:** [5,4,3,2,1]`,
    starterCode: {
      javascript: `function reverseList(head) {\n  // Your code here\n}`,
      python: `def reverse_list(head):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}`,
      python: `def reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
    },
    testCases: [
      { input: "head = [1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
      { input: "head = [1,2]", expectedOutput: "[2,1]" },
    ],
    hints: [
      "Track three pointers: prev, curr, next.",
      "Flip curr.next to prev each step.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // 3
  {
    id: "merge-two-sorted-lists",
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    category: "linked-list",
    tags: ["Linked List", "Recursion", "Two Pointers"],
    description: `Merge two sorted linked lists and return it as a sorted list.

### Examples
**Input:** l1 = [1,2,4], l2 = [1,3,4]
**Output:** [1,1,2,3,4,4]`,
    starterCode: {
      javascript: `function mergeTwoLists(l1, l2) {\n  // Your code here\n}`,
      python: `def merge_two_lists(l1, l2):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function mergeTwoLists(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }\n    else { tail.next = l2; l2 = l2.next; }\n    tail = tail.next;\n  }\n  tail.next = l1 ?? l2;\n  return dummy.next;\n}`,
      python: `def merge_two_lists(l1, l2):\n    dummy = tail = ListNode()\n    while l1 and l2:\n        if l1.val <= l2.val:\n            tail.next, l1 = l1, l1.next\n        else:\n            tail.next, l2 = l2, l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next`,
    },
    testCases: [
      { input: "l1 = [1,2,4], l2 = [1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
    ],
    hints: [
      "Use a dummy head to simplify edge cases.",
      "Walk both lists with two pointers.",
    ],
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)",
  },
  // 4
  {
    id: "remove-nth-from-end",
    slug: "remove-nth-from-end",
    title: "Remove Nth Node From End",
    difficulty: "medium",
    category: "linked-list",
    tags: ["Linked List", "Two Pointers"],
    description: `Given the head of a linked list, remove the nth node from the end of the list and return its head.

### Examples
**Input:** head = [1,2,3,4,5], n = 2
**Output:** [1,2,3,5]`,
    starterCode: {
      javascript: `function removeNthFromEnd(head, n) {\n  // Your code here\n}`,
      python: `def remove_nth_from_end(head, n):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function removeNthFromEnd(head, n) {\n  const dummy = { val: 0, next: head };\n  let fast = dummy, slow = dummy;\n  for (let i = 0; i <= n; i++) fast = fast.next;\n  while (fast) { fast = fast.next; slow = slow.next; }\n  slow.next = slow.next.next;\n  return dummy.next;\n}`,
      python: `def remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    fast = slow = dummy\n    for _ in range(n + 1):\n        fast = fast.next\n    while fast:\n        fast, slow = fast.next, slow.next\n    slow.next = slow.next.next\n    return dummy.next`,
    },
    testCases: [
      { input: "head = [1,2,3,4,5], n = 2", expectedOutput: "[1,2,3,5]" },
    ],
    hints: [
      "Two pointers with a gap of n+1 nodes.",
      "When fast reaches end, slow is right before the target.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // 5
  {
    id: "container-with-most-water",
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "medium",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Greedy"],
    description: `Given n non-negative integers, find two lines that together with the x-axis form a container holding the most water.

### Examples
**Input:** height = [1,8,6,2,5,4,8,3,7]
**Output:** 49`,
    starterCode: {
      javascript: `function maxArea(height) {\n  // Your code here\n}`,
      python: `def max_area(height):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function maxArea(height) {\n  let l = 0, r = height.length - 1, best = 0;\n  while (l < r) {\n    const area = (r - l) * Math.min(height[l], height[r]);\n    if (area > best) best = area;\n    if (height[l] < height[r]) l++; else r--;\n  }\n  return best;\n}`,
      python: `def max_area(height):\n    l, r, best = 0, len(height) - 1, 0\n    while l < r:\n        best = max(best, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return best`,
    },
    testCases: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
    ],
    hints: [
      "Start with the widest container.",
      "Move the pointer at the shorter line inward.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // 6
  {
    id: "search-rotated-sorted-array",
    slug: "search-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    category: "binary-search",
    tags: ["Array", "Binary Search"],
    description: `Given a rotated sorted array \`nums\` and a value \`target\`, return the index of target if found, else -1. Must run in O(log n).

### Examples
**Input:** nums = [4,5,6,7,0,1,2], target = 0
**Output:** 4`,
    starterCode: {
      javascript: `function search(nums, target) {\n  // Your code here\n}`,
      python: `def search(nums, target):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const m = (l + r) >> 1;\n    if (nums[m] === target) return m;\n    if (nums[l] <= nums[m]) {\n      if (nums[l] <= target && target < nums[m]) r = m - 1;\n      else l = m + 1;\n    } else {\n      if (nums[m] < target && target <= nums[r]) l = m + 1;\n      else r = m - 1;\n    }\n  }\n  return -1;\n}`,
      python: `def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target: return m\n        if nums[l] <= nums[m]:\n            if nums[l] <= target < nums[m]: r = m - 1\n            else: l = m + 1\n        else:\n            if nums[m] < target <= nums[r]: l = m + 1\n            else: r = m - 1\n    return -1`,
    },
    testCases: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", expectedOutput: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", expectedOutput: "-1" },
    ],
    hints: [
      "One half of any range is always sorted.",
      "Decide which half to keep based on target's range.",
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  // 7
  {
    id: "find-min-rotated-sorted-array",
    slug: "find-min-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    category: "binary-search",
    tags: ["Array", "Binary Search"],
    description: `Given a rotated sorted array \`nums\`, return its minimum element.

### Examples
**Input:** nums = [3,4,5,1,2]
**Output:** 1`,
    starterCode: {
      javascript: `function findMin(nums) {\n  // Your code here\n}`,
      python: `def find_min(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function findMin(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const m = (l + r) >> 1;\n    if (nums[m] > nums[r]) l = m + 1; else r = m;\n  }\n  return nums[l];\n}`,
      python: `def find_min(nums):\n    l, r = 0, len(nums) - 1\n    while l < r:\n        m = (l + r) // 2\n        if nums[m] > nums[r]: l = m + 1\n        else: r = m\n    return nums[l]`,
    },
    testCases: [
      { input: "nums = [3,4,5,1,2]", expectedOutput: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", expectedOutput: "0" },
    ],
    hints: [
      "Compare mid to the right-most element.",
      "Shrink the range toward the rotation pivot.",
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  // 8
  {
    id: "jump-game",
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "medium",
    category: "greedy",
    tags: ["Array", "Greedy", "DP"],
    description: `Each element of \`nums\` is your max jump length from that position. Return true if you can reach the last index.

### Examples
**Input:** nums = [2,3,1,1,4]
**Output:** true

**Input:** nums = [3,2,1,0,4]
**Output:** false`,
    starterCode: {
      javascript: `function canJump(nums) {\n  // Your code here\n}`,
      python: `def can_jump(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function canJump(nums) {\n  let reach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > reach) return false;\n    reach = Math.max(reach, i + nums[i]);\n  }\n  return true;\n}`,
      python: `def can_jump(nums):\n    reach = 0\n    for i, v in enumerate(nums):\n        if i > reach: return False\n        reach = max(reach, i + v)\n    return True`,
    },
    testCases: [
      { input: "nums = [2,3,1,1,4]", expectedOutput: "true" },
      { input: "nums = [3,2,1,0,4]", expectedOutput: "false" },
    ],
    hints: [
      "Track the furthest reachable index.",
      "If i ever exceeds reach, the answer is false.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // 9
  {
    id: "unique-paths",
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "medium",
    category: "dp",
    tags: ["Math", "DP", "Combinatorics"],
    description: `Count distinct paths from top-left to bottom-right of an m x n grid, moving only right or down.

### Examples
**Input:** m = 3, n = 7
**Output:** 28`,
    starterCode: {
      javascript: `function uniquePaths(m, n) {\n  // Your code here\n}`,
      python: `def unique_paths(m, n):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function uniquePaths(m, n) {\n  const dp = Array(n).fill(1);\n  for (let i = 1; i < m; i++)\n    for (let j = 1; j < n; j++) dp[j] += dp[j - 1];\n  return dp[n - 1];\n}`,
      python: `def unique_paths(m, n):\n    dp = [1] * n\n    for _ in range(1, m):\n        for j in range(1, n):\n            dp[j] += dp[j - 1]\n    return dp[n - 1]`,
    },
    testCases: [
      { input: "m = 3, n = 7", expectedOutput: "28" },
      { input: "m = 3, n = 2", expectedOutput: "3" },
    ],
    hints: [
      "dp[i][j] = dp[i-1][j] + dp[i][j-1].",
      "You can collapse to a single row.",
    ],
    timeComplexity: "O(m·n)",
    spaceComplexity: "O(n)",
  },
  // 10
  {
    id: "edit-distance",
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "hard",
    category: "dp",
    tags: ["String", "DP"],
    description: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations (insert, delete, replace) to convert word1 to word2.

### Examples
**Input:** word1 = "horse", word2 = "ros"
**Output:** 3`,
    starterCode: {
      javascript: `function minDistance(a, b) {\n  // Your code here\n}`,
      python: `def min_distance(a, b):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function minDistance(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({length: m+1}, (_, i) => [i, ...Array(n).fill(0)]);\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = a[i-1] === b[j-1]\n        ? dp[i-1][j-1]\n        : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);\n  return dp[m][n];\n}`,
      python: `def min_distance(a, b):\n    m, n = len(a), len(b)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0] = i\n    for j in range(n+1): dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            dp[i][j] = dp[i-1][j-1] if a[i-1]==b[j-1] else 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])\n    return dp[m][n]`,
    },
    testCases: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        expectedOutput: "3",
      },
    ],
    hints: [
      "Classic 2-D DP over prefixes.",
      "Equal chars copy diagonally; else 1 + min of three neighbours.",
    ],
    timeComplexity: "O(m·n)",
    spaceComplexity: "O(m·n)",
  },
  // 11
  {
    id: "house-robber",
    slug: "house-robber",
    title: "House Robber",
    difficulty: "medium",
    category: "dp",
    tags: ["Array", "DP"],
    description: `You can't rob two adjacent houses. Given \`nums[i]\` representing money at house i, return the maximum money you can rob.

### Examples
**Input:** nums = [2,7,9,3,1]
**Output:** 12`,
    starterCode: {
      javascript: `function rob(nums) {\n  // Your code here\n}`,
      python: `def rob(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function rob(nums) {\n  let prev = 0, curr = 0;\n  for (const n of nums) {\n    [prev, curr] = [curr, Math.max(curr, prev + n)];\n  }\n  return curr;\n}`,
      python: `def rob(nums):\n    prev = curr = 0\n    for n in nums:\n        prev, curr = curr, max(curr, prev + n)\n    return curr`,
    },
    testCases: [
      { input: "nums = [2,7,9,3,1]", expectedOutput: "12" },
      { input: "nums = [1,2,3,1]", expectedOutput: "4" },
    ],
    hints: [
      "At each house: take it (+ dp[i-2]) or skip it (dp[i-1]).",
      "You only need the last two values.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // 12
  {
    id: "word-break",
    slug: "word-break",
    title: "Word Break",
    difficulty: "medium",
    category: "dp",
    tags: ["String", "DP", "Trie"],
    description: `Return true if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

### Examples
**Input:** s = "leetcode", wordDict = ["leet","code"]
**Output:** true`,
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {\n  // Your code here\n}`,
      python: `def word_break(s, word_dict):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function wordBreak(s, wordDict) {\n  const set = new Set(wordDict);\n  const dp = Array(s.length + 1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++)\n    for (let j = 0; j < i; j++)\n      if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }\n  return dp[s.length];\n}`,
      python: `def word_break(s, word_dict):\n    words = set(word_dict)\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in words:\n                dp[i] = True\n                break\n    return dp[-1]`,
    },
    testCases: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', expectedOutput: "true" },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', expectedOutput: "false" },
    ],
    hints: [
      "dp[i] = some j where dp[j] and s[j..i] is a word.",
      "Store the dictionary in a Set for O(1) lookups.",
    ],
    timeComplexity: "O(n² · L)",
    spaceComplexity: "O(n)",
  },
  // 13
  {
    id: "subarray-sum-equals-k",
    slug: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    difficulty: "medium",
    category: "arrays",
    tags: ["Array", "Hash Map", "Prefix Sum"],
    description: `Given an array of integers \`nums\` and an integer \`k\`, return the number of contiguous subarrays whose sum equals k.

### Examples
**Input:** nums = [1,1,1], k = 2
**Output:** 2`,
    starterCode: {
      javascript: `function subarraySum(nums, k) {\n  // Your code here\n}`,
      python: `def subarray_sum(nums, k):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function subarraySum(nums, k) {\n  const counts = new Map([[0, 1]]);\n  let sum = 0, ans = 0;\n  for (const n of nums) {\n    sum += n;\n    ans += counts.get(sum - k) ?? 0;\n    counts.set(sum, (counts.get(sum) ?? 0) + 1);\n  }\n  return ans;\n}`,
      python: `def subarray_sum(nums, k):\n    counts = {0: 1}\n    s = ans = 0\n    for n in nums:\n        s += n\n        ans += counts.get(s - k, 0)\n        counts[s] = counts.get(s, 0) + 1\n    return ans`,
    },
    testCases: [
      { input: "nums = [1,1,1], k = 2", expectedOutput: "2" },
      { input: "nums = [1,2,3], k = 3", expectedOutput: "2" },
    ],
    hints: [
      "Use prefix sums.",
      "Count how many prefixSum - k we've seen before.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // 14
  {
    id: "top-k-frequent",
    slug: "top-k-frequent",
    title: "Top K Frequent Elements",
    difficulty: "medium",
    category: "heap",
    tags: ["Array", "Hash Map", "Heap", "Bucket Sort"],
    description: `Given an integer array \`nums\` and an integer \`k\`, return the k most frequent elements.

### Examples
**Input:** nums = [1,1,1,2,2,3], k = 2
**Output:** [1,2]`,
    starterCode: {
      javascript: `function topKFrequent(nums, k) {\n  // Your code here\n}`,
      python: `def top_k_frequent(nums, k):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function topKFrequent(nums, k) {\n  const freq = new Map();\n  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);\n  const buckets = Array.from({length: nums.length + 1}, () => []);\n  for (const [n, c] of freq) buckets[c].push(n);\n  const result = [];\n  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--)\n    result.push(...buckets[i]);\n  return result.slice(0, k);\n}`,
      python: `def top_k_frequent(nums, k):\n    from collections import Counter\n    freq = Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for n, c in freq.items():\n        buckets[c].append(n)\n    out = []\n    for i in range(len(buckets) - 1, -1, -1):\n        out += buckets[i]\n        if len(out) >= k: break\n    return out[:k]`,
    },
    testCases: [
      { input: "nums = [1,1,1,2,2,3], k = 2", expectedOutput: "[1,2]" },
    ],
    hints: [
      "Bucket by frequency for O(n).",
      "Or use a min-heap of size k.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // 15
  {
    id: "daily-temperatures",
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "medium",
    category: "stack",
    tags: ["Array", "Monotonic Stack"],
    description: `Given daily temperatures, return an array \`answer\` where \`answer[i]\` is the number of days until a warmer temperature. 0 if none.

### Examples
**Input:** temps = [73,74,75,71,69,72,76,73]
**Output:** [1,1,4,2,1,1,0,0]`,
    starterCode: {
      javascript: `function dailyTemperatures(t) {\n  // Your code here\n}`,
      python: `def daily_temperatures(t):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function dailyTemperatures(t) {\n  const res = Array(t.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < t.length; i++) {\n    while (stack.length && t[stack.at(-1)] < t[i]) {\n      const j = stack.pop();\n      res[j] = i - j;\n    }\n    stack.push(i);\n  }\n  return res;\n}`,
      python: `def daily_temperatures(t):\n    res, stack = [0]*len(t), []\n    for i, v in enumerate(t):\n        while stack and t[stack[-1]] < v:\n            j = stack.pop()\n            res[j] = i - j\n        stack.append(i)\n    return res`,
    },
    testCases: [
      {
        input: "temps = [73,74,75,71,69,72,76,73]",
        expectedOutput: "[1,1,4,2,1,1,0,0]",
      },
    ],
    hints: [
      "Maintain a monotonic decreasing stack of indices.",
      "Pop while top < current; fill in answer by distance.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // 16
  {
    id: "sliding-window-maximum",
    slug: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    difficulty: "hard",
    category: "sliding-window",
    tags: ["Array", "Sliding Window", "Monotonic Deque"],
    description: `Return the max of every window of size k in \`nums\`.

### Examples
**Input:** nums = [1,3,-1,-3,5,3,6,7], k = 3
**Output:** [3,3,5,5,6,7]`,
    starterCode: {
      javascript: `function maxSlidingWindow(nums, k) {\n  // Your code here\n}`,
      python: `def max_sliding_window(nums, k):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function maxSlidingWindow(nums, k) {\n  const dq = [], out = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (dq.length && nums[dq.at(-1)] < nums[i]) dq.pop();\n    dq.push(i);\n    if (dq[0] <= i - k) dq.shift();\n    if (i >= k - 1) out.push(nums[dq[0]]);\n  }\n  return out;\n}`,
      python: `def max_sliding_window(nums, k):\n    from collections import deque\n    dq, out = deque(), []\n    for i, v in enumerate(nums):\n        while dq and nums[dq[-1]] < v: dq.pop()\n        dq.append(i)\n        if dq[0] <= i - k: dq.popleft()\n        if i >= k - 1: out.append(nums[dq[0]])\n    return out`,
    },
    testCases: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", expectedOutput: "[3,3,5,5,6,7]" },
    ],
    hints: [
      "Deque of indices, monotonically decreasing values.",
      "Front of the deque is always the window's max.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
  },
  // 17
  {
    id: "clone-graph",
    slug: "clone-graph",
    title: "Clone Graph",
    difficulty: "medium",
    category: "graph",
    tags: ["Graph", "BFS", "DFS", "Hash Map"],
    description: `Given a node in a connected undirected graph, return a deep copy of the graph.`,
    starterCode: {
      javascript: `function cloneGraph(node) {\n  // Your code here\n}`,
      python: `def clone_graph(node):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function cloneGraph(node) {\n  if (!node) return null;\n  const map = new Map();\n  const dfs = n => {\n    if (map.has(n)) return map.get(n);\n    const copy = { val: n.val, neighbors: [] };\n    map.set(n, copy);\n    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb));\n    return copy;\n  };\n  return dfs(node);\n}`,
      python: `def clone_graph(node):\n    if not node: return None\n    mp = {}\n    def dfs(n):\n        if n in mp: return mp[n]\n        copy = Node(n.val)\n        mp[n] = copy\n        copy.neighbors = [dfs(nb) for nb in n.neighbors]\n        return copy\n    return dfs(node)`,
    },
    testCases: [{ input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", expectedOutput: "deep copy" }],
    hints: [
      "Use a map old→new to avoid cycles.",
      "DFS or BFS, both work.",
    ],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
  },
  // 18
  {
    id: "pacific-atlantic",
    slug: "pacific-atlantic",
    title: "Pacific Atlantic Water Flow",
    difficulty: "medium",
    category: "graph",
    tags: ["Matrix", "DFS", "BFS"],
    description: `Return cells from which water can flow to both the Pacific (top/left edges) and Atlantic (bottom/right edges) oceans.`,
    starterCode: {
      javascript: `function pacificAtlantic(heights) {\n  // Your code here\n}`,
      python: `def pacific_atlantic(heights):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function pacificAtlantic(h) {\n  const m = h.length, n = h[0].length;\n  const P = Array.from({length:m},()=>Array(n).fill(false));\n  const A = Array.from({length:m},()=>Array(n).fill(false));\n  const dfs = (i,j,seen,prev) => {\n    if (i<0||j<0||i>=m||j>=n||seen[i][j]||h[i][j]<prev) return;\n    seen[i][j] = true;\n    dfs(i+1,j,seen,h[i][j]); dfs(i-1,j,seen,h[i][j]);\n    dfs(i,j+1,seen,h[i][j]); dfs(i,j-1,seen,h[i][j]);\n  };\n  for (let i = 0; i < m; i++) { dfs(i,0,P,-Infinity); dfs(i,n-1,A,-Infinity); }\n  for (let j = 0; j < n; j++) { dfs(0,j,P,-Infinity); dfs(m-1,j,A,-Infinity); }\n  const res = [];\n  for (let i = 0; i < m; i++)\n    for (let j = 0; j < n; j++)\n      if (P[i][j] && A[i][j]) res.push([i,j]);\n  return res;\n}`,
      python: `def pacific_atlantic(h):\n    m, n = len(h), len(h[0])\n    P, A = set(), set()\n    def dfs(i, j, seen, prev):\n        if (i,j) in seen or not (0<=i<m and 0<=j<n) or h[i][j]<prev: return\n        seen.add((i,j))\n        for di,dj in [(1,0),(-1,0),(0,1),(0,-1)]:\n            dfs(i+di, j+dj, seen, h[i][j])\n    for i in range(m):\n        dfs(i,0,P,-1); dfs(i,n-1,A,-1)\n    for j in range(n):\n        dfs(0,j,P,-1); dfs(m-1,j,A,-1)\n    return [list(c) for c in P & A]`,
    },
    testCases: [{ input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", expectedOutput: "cells reaching both oceans" }],
    hints: [
      "Reverse the flow: start from each ocean border and BFS/DFS upward.",
      "Intersect the two visited sets.",
    ],
    timeComplexity: "O(m·n)",
    spaceComplexity: "O(m·n)",
  },
  // 19
  {
    id: "maximum-product-subarray",
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "medium",
    category: "dp",
    tags: ["Array", "DP"],
    description: `Find the contiguous subarray within an array of integers that has the largest product.

### Examples
**Input:** nums = [2,3,-2,4]
**Output:** 6`,
    starterCode: {
      javascript: `function maxProduct(nums) {\n  // Your code here\n}`,
      python: `def max_product(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function maxProduct(nums) {\n  let max = nums[0], min = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    const n = nums[i];\n    if (n < 0) [max, min] = [min, max];\n    max = Math.max(n, max * n);\n    min = Math.min(n, min * n);\n    best = Math.max(best, max);\n  }\n  return best;\n}`,
      python: `def max_product(nums):\n    mx = mn = best = nums[0]\n    for n in nums[1:]:\n        if n < 0: mx, mn = mn, mx\n        mx = max(n, mx * n)\n        mn = min(n, mn * n)\n        best = max(best, mx)\n    return best`,
    },
    testCases: [
      { input: "nums = [2,3,-2,4]", expectedOutput: "6" },
      { input: "nums = [-2,0,-1]", expectedOutput: "0" },
    ],
    hints: [
      "Track both running max and running min (negatives flip them).",
      "Reset when current beats extension.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // 20
  {
    id: "longest-consecutive-sequence",
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "medium",
    category: "arrays",
    tags: ["Array", "Hash Set"],
    description: `Return the length of the longest consecutive elements sequence in an unsorted integer array, in O(n).

### Examples
**Input:** nums = [100,4,200,1,3,2]
**Output:** 4`,
    starterCode: {
      javascript: `function longestConsecutive(nums) {\n  // Your code here\n}`,
      python: `def longest_consecutive(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let best = 0;\n  for (const n of set) {\n    if (!set.has(n - 1)) {\n      let cur = n, len = 1;\n      while (set.has(cur + 1)) { cur++; len++; }\n      if (len > best) best = len;\n    }\n  }\n  return best;\n}`,
      python: `def longest_consecutive(nums):\n    s = set(nums); best = 0\n    for n in s:\n        if n - 1 not in s:\n            c, l = n, 1\n            while c + 1 in s: c += 1; l += 1\n            best = max(best, l)\n    return best`,
    },
    testCases: [
      { input: "nums = [100,4,200,1,3,2]", expectedOutput: "4" },
    ],
    hints: [
      "Start counting only at the smallest member of each run.",
      "Each number is visited at most twice.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
];
