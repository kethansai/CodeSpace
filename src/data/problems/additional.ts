import type { Problem } from "@/data/types";

export const additionalProblems: Problem[] = [
  {
    id: "three-sum",
    slug: "three-sum",
    title: "3Sum",
    difficulty: "medium",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Sorting"],
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set must not contain duplicate triplets.

### Examples
**Input:** nums = [-1,0,1,2,-1,-4]
**Output:** [[-1,-1,2],[-1,0,1]]

**Input:** nums = [0,1,1]
**Output:** []`,
    starterCode: {
      javascript: `function threeSum(nums) {\n  // Your code here\n}`,
      python: `def three_sum(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const result = [];\n\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let left = i + 1, right = nums.length - 1;\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++; right--;\n      } else if (sum < 0) left++;\n      else right--;\n    }\n  }\n  return result;\n}\n\nconsole.log(threeSum([-1,0,1,2,-1,-4]));`,
      python: `def three_sum(nums):\n    nums.sort()\n    result = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            s = nums[i] + nums[left] + nums[right]\n            if s == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                while left < right and nums[left] == nums[left+1]: left += 1\n                while left < right and nums[right] == nums[right-1]: right -= 1\n                left += 1; right -= 1\n            elif s < 0: left += 1\n            else: right -= 1\n    return result\n\nprint(three_sum([-1,0,1,2,-1,-4]))`,
    },
    testCases: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        expectedOutput: "[[-1,-1,2],[-1,0,1]]",
      },
      { input: "nums = [0,1,1]", expectedOutput: "[]" },
      { input: "nums = [0,0,0]", expectedOutput: "[[0,0,0]]" },
    ],
    hints: [
      "Sort the array first.",
      "Fix one number then use two pointers.",
      "Skip duplicates to avoid duplicate triplets.",
    ],
  },
  {
    id: "product-except-self",
    slug: "product-except-self",
    title: "Product of Array Except Self",
    difficulty: "medium",
    category: "arrays",
    tags: ["Array", "Prefix Product"],
    description: `Given an integer array \`nums\`, return an array \`answer\` where \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must solve it in O(n) time without using division.

### Examples
**Input:** nums = [1,2,3,4]
**Output:** [24,12,8,6]

**Input:** nums = [-1,1,0,-3,3]
**Output:** [0,0,9,0,0]`,
    starterCode: {
      javascript: `function productExceptSelf(nums) {\n  // Your code here\n}`,
      python: `def product_except_self(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function productExceptSelf(nums) {\n  const n = nums.length;\n  const result = new Array(n).fill(1);\n\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    result[i] = prefix;\n    prefix *= nums[i];\n  }\n\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    result[i] *= suffix;\n    suffix *= nums[i];\n  }\n\n  return result;\n}\n\nconsole.log(productExceptSelf([1,2,3,4])); // [24,12,8,6]`,
      python: `def product_except_self(nums):\n    n = len(nums)\n    result = [1] * n\n\n    prefix = 1\n    for i in range(n):\n        result[i] = prefix\n        prefix *= nums[i]\n\n    suffix = 1\n    for i in range(n-1, -1, -1):\n        result[i] *= suffix\n        suffix *= nums[i]\n\n    return result\n\nprint(product_except_self([1,2,3,4]))  # [24,12,8,6]`,
    },
    testCases: [
      { input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" },
      { input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" },
    ],
    hints: [
      "Build prefix products from left.",
      "Build suffix products from right.",
      "Multiply them together.",
    ],
  },
  {
    id: "merge-intervals",
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "medium",
    category: "arrays",
    tags: ["Array", "Sorting", "Intervals"],
    description: `Given an array of intervals where \`intervals[i] = [start, end]\`, merge all overlapping intervals.

### Examples
**Input:** intervals = [[1,3],[2,6],[8,10],[15,18]]
**Output:** [[1,6],[8,10],[15,18]]

**Input:** intervals = [[1,4],[4,5]]
**Output:** [[1,5]]`,
    starterCode: {
      javascript: `function merge(intervals) {\n  // Your code here\n}`,
      python: `def merge(intervals):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n\n  for (let i = 1; i < intervals.length; i++) {\n    const prev = merged[merged.length - 1];\n    if (intervals[i][0] <= prev[1]) {\n      prev[1] = Math.max(prev[1], intervals[i][1]);\n    } else {\n      merged.push(intervals[i]);\n    }\n  }\n\n  return merged;\n}\n\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]]));`,
      python: `def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged\n\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))`,
    },
    testCases: [
      {
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        expectedOutput: "[[1,6],[8,10],[15,18]]",
      },
      { input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]" },
    ],
    hints: [
      "Sort by start time.",
      "If current overlaps with previous, merge them.",
    ],
  },
  {
    id: "rotate-array",
    slug: "rotate-array",
    title: "Rotate Array",
    difficulty: "medium",
    category: "arrays",
    tags: ["Array", "Math"],
    description: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps.

### Examples
**Input:** nums = [1,2,3,4,5,6,7], k = 3
**Output:** [5,6,7,1,2,3,4]`,
    starterCode: {
      javascript: `function rotate(nums, k) {\n  // Modify in-place\n}`,
      python: `def rotate(nums, k):\n    # Modify in-place\n    pass`,
    },
    solution: {
      javascript: `function rotate(nums, k) {\n  k %= nums.length;\n  const reverse = (l, r) => {\n    while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }\n  };\n  reverse(0, nums.length - 1);\n  reverse(0, k - 1);\n  reverse(k, nums.length - 1);\n  return nums;\n}\n\nconsole.log(rotate([1,2,3,4,5,6,7], 3)); // [5,6,7,1,2,3,4]`,
      python: `def rotate(nums, k):\n    n = len(nums)\n    k %= n\n    def rev(l, r):\n        while l < r:\n            nums[l], nums[r] = nums[r], nums[l]\n            l += 1; r -= 1\n    rev(0, n-1)\n    rev(0, k-1)\n    rev(k, n-1)\n    return nums\n\nprint(rotate([1,2,3,4,5,6,7], 3))`,
    },
    testCases: [
      {
        input: "nums = [1,2,3,4,5,6,7], k = 3",
        expectedOutput: "[5,6,7,1,2,3,4]",
      },
    ],
    hints: [
      "Reverse the whole array, then reverse first k, then reverse rest.",
    ],
  },
  {
    id: "group-anagrams",
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "medium",
    category: "hashing",
    tags: ["Hash Map", "String", "Sorting"],
    description: `Given an array of strings, group the anagrams together.

### Examples
**Input:** strs = ["eat","tea","tan","ate","nat","bat"]
**Output:** [["bat"],["nat","tan"],["ate","eat","tea"]]`,
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Your code here\n}`,
      python: `def group_anagrams(strs):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = [...s].sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return [...map.values()];\n}\n\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));`,
      python: `def group_anagrams(strs):\n    from collections import defaultdict\n    groups = defaultdict(list)\n    for s in strs:\n        key = ''.join(sorted(s))\n        groups[key].append(s)\n    return list(groups.values())\n\nprint(group_anagrams(["eat","tea","tan","ate","nat","bat"]))`,
    },
    testCases: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
    ],
    hints: [
      "Sort each word to create a key.",
      "Group words with the same sorted key.",
    ],
  },
  {
    id: "longest-substring-no-repeat",
    slug: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    category: "arrays",
    tags: ["String", "Sliding Window", "Hash Set"],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

### Examples
**Input:** s = "abcabcbb" **Output:** 3 ("abc")
**Input:** s = "bbbbb" **Output:** 1 ("b")
**Input:** s = "pwwkew" **Output:** 3 ("wke")`,
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Your code here\n}`,
      python: `def length_of_longest_substring(s):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb")); // 3`,
      python: `def length_of_longest_substring(s):\n    seen = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(length_of_longest_substring("abcabcbb"))  # 3`,
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: "3" },
      { input: '"bbbbb"', expectedOutput: "1" },
      { input: '"pwwkew"', expectedOutput: "3" },
    ],
    hints: [
      "Use sliding window with a set.",
      "Shrink window from left when you see a duplicate.",
    ],
  },
  {
    id: "trapping-rain-water",
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "hard",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Stack"],
    description: `Given \`n\` non-negative integers representing an elevation map, compute how much water it can trap after raining.

### Examples
**Input:** height = [0,1,0,2,1,0,1,3,2,1,2,1]
**Output:** 6`,
    starterCode: {
      javascript: `function trap(height) {\n  // Your code here\n}`,
      python: `def trap(height):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n\n  while (left < right) {\n    if (height[left] < height[right]) {\n      leftMax = Math.max(leftMax, height[left]);\n      water += leftMax - height[left];\n      left++;\n    } else {\n      rightMax = Math.max(rightMax, height[right]);\n      water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}\n\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6`,
      python: `def trap(height):\n    left, right = 0, len(height) - 1\n    left_max = right_max = water = 0\n    while left < right:\n        if height[left] < height[right]:\n            left_max = max(left_max, height[left])\n            water += left_max - height[left]\n            left += 1\n        else:\n            right_max = max(right_max, height[right])\n            water += right_max - height[right]\n            right -= 1\n    return water\n\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # 6`,
    },
    testCases: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" },
      { input: "[4,2,0,3,2,5]", expectedOutput: "9" },
    ],
    hints: [
      "Two pointer approach from both ends.",
      "Water at each position = min(leftMax, rightMax) - height[i].",
    ],
  },
  {
    id: "lru-cache",
    slug: "lru-cache",
    title: "LRU Cache",
    difficulty: "medium",
    category: "linked-lists",
    tags: ["Hash Map", "Doubly Linked List", "Design"],
    description: `Design a data structure that follows **Least Recently Used (LRU)** cache constraints.

Implement \`LRUCache\` class:
- \`LRUCache(capacity)\` — Initialize with positive capacity.
- \`get(key)\` — Return value if exists, else -1.
- \`put(key, value)\` — Update/insert. If at capacity, evict the least recently used key.

Both operations must be O(1).

### Examples
\`\`\`
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
cache.get(1)      // returns 1
cache.put(3, 3)   // evicts key 2
cache.get(2)      // returns -1
\`\`\``,
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  get(key) {\n    // Your code here\n  }\n  put(key, value) {\n    // Your code here\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        # Your code here\n        pass\n    def get(self, key):\n        # Your code here\n        pass\n    def put(self, key, value):\n        # Your code here\n        pass`,
    },
    solution: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.cap = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.cap) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n  }\n}\n\nconst cache = new LRUCache(2);\ncache.put(1, 1);\ncache.put(2, 2);\nconsole.log(cache.get(1)); // 1\ncache.put(3, 3);\nconsole.log(cache.get(2)); // -1`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key, value):\n        if key in self.cache: del self.cache[key]\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)\n\ncache = LRUCache(2)\ncache.put(1, 1)\ncache.put(2, 2)\nprint(cache.get(1))  # 1\ncache.put(3, 3)\nprint(cache.get(2))  # -1`,
    },
    testCases: [
      { input: "LRUCache(2), put(1,1), put(2,2), get(1)", expectedOutput: "1" },
      { input: "then put(3,3), get(2)", expectedOutput: "-1" },
    ],
    hints: [
      "Use a hash map + doubly linked list.",
      "Or use Map/OrderedDict which preserves insertion order.",
    ],
  },
  {
    id: "word-search",
    slug: "word-search",
    title: "Word Search",
    difficulty: "medium",
    category: "backtracking",
    tags: ["Backtracking", "Matrix", "DFS"],
    description: `Given an m×n grid of characters \`board\` and a string \`word\`, return \`true\` if the word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells (horizontal or vertical). The same cell cannot be used more than once.

### Examples
**Input:** board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
**Output:** true`,
    starterCode: {
      javascript: `function exist(board, word) {\n  // Your code here\n}`,
      python: `def exist(board, word):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function exist(board, word) {\n  const rows = board.length, cols = board[0].length;\n  function dfs(r, c, i) {\n    if (i === word.length) return true;\n    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i]) return false;\n    const temp = board[r][c];\n    board[r][c] = '#';\n    const found = dfs(r+1,c,i+1) || dfs(r-1,c,i+1) || dfs(r,c+1,i+1) || dfs(r,c-1,i+1);\n    board[r][c] = temp;\n    return found;\n  }\n  for (let r = 0; r < rows; r++)\n    for (let c = 0; c < cols; c++)\n      if (dfs(r, c, 0)) return true;\n  return false;\n}\n\nconsole.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"));`,
      python: `def exist(board, word):\n    rows, cols = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]: return False\n        tmp = board[r][c]\n        board[r][c] = '#'\n        found = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)\n        board[r][c] = tmp\n        return found\n    for r in range(rows):\n        for c in range(cols):\n            if dfs(r, c, 0): return True\n    return False\n\nprint(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"))`,
    },
    testCases: [
      { input: 'board, word = "ABCCED"', expectedOutput: "true" },
      { input: 'board, word = "SEE"', expectedOutput: "true" },
      { input: 'board, word = "ABCB"', expectedOutput: "false" },
    ],
    hints: [
      "Use DFS from each cell.",
      "Mark visited cells temporarily.",
      "Restore them when backtracking.",
    ],
  },
  {
    id: "invert-binary-tree",
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "easy",
    category: "trees",
    tags: ["Tree", "DFS", "BFS"],
    description: `Given the root of a binary tree, invert the tree, and return its root.

### Examples
**Input:** root = [4,2,7,1,3,6,9]
**Output:** [4,7,2,9,6,3,1]`,
    starterCode: {
      javascript: `function invertTree(root) {\n  // Your code here\n}`,
      python: `def invert_tree(root):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function invertTree(root) {\n  if (!root) return null;\n  [root.left, root.right] = [root.right, root.left];\n  invertTree(root.left);\n  invertTree(root.right);\n  return root;\n}\n\nconsole.log("Tree inverted successfully");`,
      python: `def invert_tree(root):\n    if not root: return None\n    root.left, root.right = root.right, root.left\n    invert_tree(root.left)\n    invert_tree(root.right)\n    return root\n\nprint("Tree inverted successfully")`,
    },
    testCases: [
      { input: "root = [4,2,7,1,3,6,9]", expectedOutput: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", expectedOutput: "[2,3,1]" },
    ],
    hints: ["Swap left and right children.", "Recursively invert subtrees."],
  },
  {
    id: "lowest-common-ancestor",
    slug: "lowest-common-ancestor",
    title: "Lowest Common Ancestor of BST",
    difficulty: "medium",
    category: "trees",
    tags: ["Tree", "BST", "DFS"],
    description: `Given a BST and two nodes p and q, find their lowest common ancestor (LCA).

The LCA is the lowest node that has both p and q as descendants (a node can be a descendant of itself).

### Examples
**Input:** root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
**Output:** 6`,
    starterCode: {
      javascript: `function lowestCommonAncestor(root, p, q) {\n  // Your code here\n}`,
      python: `def lowest_common_ancestor(root, p, q):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function lowestCommonAncestor(root, p, q) {\n  while (root) {\n    if (p < root.val && q < root.val) root = root.left;\n    else if (p > root.val && q > root.val) root = root.right;\n    else return root;\n  }\n}\n\nconsole.log("LCA found");`,
      python: `def lowest_common_ancestor(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.left\n        elif p > root.val and q > root.val:\n            root = root.right\n        else:\n            return root\n\nprint("LCA found")`,
    },
    testCases: [
      { input: "root = [6,2,8,...], p=2, q=8", expectedOutput: "6" },
      { input: "root = [6,2,8,...], p=2, q=4", expectedOutput: "2" },
    ],
    hints: [
      "In a BST, if both values are smaller, go left. If both larger, go right.",
      "Otherwise, current node is the LCA.",
    ],
  },
  {
    id: "min-window-substring",
    slug: "min-window-substring",
    title: "Minimum Window Substring",
    difficulty: "hard",
    category: "arrays",
    tags: ["String", "Sliding Window", "Hash Map"],
    description: `Given two strings \`s\` and \`t\`, return the minimum window substring of \`s\` such that every character in \`t\` (including duplicates) is included in the window.

### Examples
**Input:** s = "ADOBECODEBANC", t = "ABC"
**Output:** "BANC"`,
    starterCode: {
      javascript: `function minWindow(s, t) {\n  // Your code here\n}`,
      python: `def min_window(s, t):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function minWindow(s, t) {\n  const need = {};\n  for (const c of t) need[c] = (need[c] || 0) + 1;\n  let have = 0, required = Object.keys(need).length;\n  let left = 0, minLen = Infinity, minStart = 0;\n  const window = {};\n\n  for (let right = 0; right < s.length; right++) {\n    const c = s[right];\n    window[c] = (window[c] || 0) + 1;\n    if (need[c] && window[c] === need[c]) have++;\n\n    while (have === required) {\n      if (right - left + 1 < minLen) {\n        minLen = right - left + 1;\n        minStart = left;\n      }\n      const lc = s[left];\n      window[lc]--;\n      if (need[lc] && window[lc] < need[lc]) have--;\n      left++;\n    }\n  }\n  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);\n}\n\nconsole.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"`,
      python: `def min_window(s, t):\n    from collections import Counter\n    need = Counter(t)\n    have, required = 0, len(need)\n    window = {}\n    left = 0\n    min_len, min_start = float('inf'), 0\n\n    for right in range(len(s)):\n        c = s[right]\n        window[c] = window.get(c, 0) + 1\n        if c in need and window[c] == need[c]: have += 1\n\n        while have == required:\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                min_start = left\n            lc = s[left]\n            window[lc] -= 1\n            if lc in need and window[lc] < need[lc]: have -= 1\n            left += 1\n\n    return "" if min_len == float('inf') else s[min_start:min_start+min_len]\n\nprint(min_window("ADOBECODEBANC", "ABC"))  # "BANC"`,
    },
    testCases: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', expectedOutput: '"BANC"' },
      { input: 's = "a", t = "a"', expectedOutput: '"a"' },
    ],
    hints: [
      "Use sliding window with character counts.",
      "Expand right to find valid window, shrink left to minimize.",
    ],
  },
  {
    id: "course-schedule",
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "medium",
    category: "graphs",
    tags: ["Graph", "Topological Sort", "BFS"],
    description: `There are \`numCourses\` courses labeled \`0\` to \`numCourses-1\`. You are given prerequisites: \`prerequisites[i] = [a, b]\` means you must take course \`b\` before course \`a\`. Return \`true\` if you can finish all courses.

### Examples
**Input:** numCourses = 2, prerequisites = [[1,0]]
**Output:** true

**Input:** numCourses = 2, prerequisites = [[1,0],[0,1]]
**Output:** false (cycle!)`,
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {\n  // Your code here\n}`,
      python: `def can_finish(num_courses, prerequisites):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function canFinish(numCourses, prerequisites) {\n  const adj = Array.from({length: numCourses}, () => []);\n  const inDeg = new Array(numCourses).fill(0);\n  for (const [a, b] of prerequisites) { adj[b].push(a); inDeg[a]++; }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) queue.push(i);\n  let count = 0;\n  while (queue.length) {\n    const course = queue.shift();\n    count++;\n    for (const next of adj[course])\n      if (--inDeg[next] === 0) queue.push(next);\n  }\n  return count === numCourses;\n}\n\nconsole.log(canFinish(2, [[1,0]])); // true`,
      python: `def can_finish(num_courses, prerequisites):\n    from collections import deque\n    adj = [[] for _ in range(num_courses)]\n    in_deg = [0] * num_courses\n    for a, b in prerequisites:\n        adj[b].append(a); in_deg[a] += 1\n    q = deque(i for i in range(num_courses) if in_deg[i] == 0)\n    count = 0\n    while q:\n        course = q.popleft(); count += 1\n        for nxt in adj[course]:\n            in_deg[nxt] -= 1\n            if in_deg[nxt] == 0: q.append(nxt)\n    return count == num_courses\n\nprint(can_finish(2, [[1,0]]))  # True`,
    },
    testCases: [
      { input: "numCourses=2, prerequisites=[[1,0]]", expectedOutput: "true" },
      {
        input: "numCourses=2, prerequisites=[[1,0],[0,1]]",
        expectedOutput: "false",
      },
    ],
    hints: [
      "This is cycle detection in a directed graph.",
      "Use topological sort (Kahn's algorithm).",
    ],
  },
  {
    id: "kth-largest-element",
    slug: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    category: "sorting",
    tags: ["Array", "Heap", "Quick Select"],
    description: `Given an integer array \`nums\` and an integer \`k\`, return the kth largest element.

Note: It is the kth largest in sorted order, not the kth distinct element.

### Examples
**Input:** nums = [3,2,1,5,6,4], k = 2
**Output:** 5

**Input:** nums = [3,2,3,1,2,4,5,5,6], k = 4
**Output:** 4`,
    starterCode: {
      javascript: `function findKthLargest(nums, k) {\n  // Your code here\n}`,
      python: `def find_kth_largest(nums, k):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function findKthLargest(nums, k) {\n  // Using min-heap of size k\n  const heap = [];\n  const push = (val) => {\n    heap.push(val);\n    let i = heap.length - 1;\n    while (i > 0) {\n      const p = Math.floor((i-1)/2);\n      if (heap[p] <= heap[i]) break;\n      [heap[p], heap[i]] = [heap[i], heap[p]];\n      i = p;\n    }\n  };\n  const pop = () => {\n    const min = heap[0];\n    heap[0] = heap[heap.length-1];\n    heap.pop();\n    let i = 0;\n    while (true) {\n      let s = i, l = 2*i+1, r = 2*i+2;\n      if (l < heap.length && heap[l] < heap[s]) s = l;\n      if (r < heap.length && heap[r] < heap[s]) s = r;\n      if (s === i) break;\n      [heap[i], heap[s]] = [heap[s], heap[i]];\n      i = s;\n    }\n    return min;\n  };\n  for (const num of nums) {\n    push(num);\n    if (heap.length > k) pop();\n  }\n  return heap[0];\n}\n\nconsole.log(findKthLargest([3,2,1,5,6,4], 2)); // 5`,
      python: `import heapq\ndef find_kth_largest(nums, k):\n    return heapq.nlargest(k, nums)[-1]\n\nprint(find_kth_largest([3,2,1,5,6,4], 2))  # 5`,
    },
    testCases: [
      { input: "nums = [3,2,1,5,6,4], k = 2", expectedOutput: "5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", expectedOutput: "4" },
    ],
    hints: [
      "Use a min-heap of size k.",
      "After processing all elements, the top of the heap is the answer.",
    ],
  },
  {
    id: "palindrome-linked-list",
    slug: "palindrome-linked-list",
    title: "Palindrome Linked List",
    difficulty: "easy",
    category: "linked-lists",
    tags: ["Linked List", "Two Pointers", "Stack"],
    description: `Given the head of a singly linked list, return \`true\` if it is a palindrome or \`false\` otherwise.

### Examples
**Input:** head = [1,2,2,1] **Output:** true
**Input:** head = [1,2] **Output:** false`,
    starterCode: {
      javascript: `function isPalindrome(head) {\n  // Your code here\n}`,
      python: `def is_palindrome(head):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isPalindrome(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  // Reverse second half\n  let prev = null;\n  while (slow) {\n    const next = slow.next;\n    slow.next = prev;\n    prev = slow;\n    slow = next;\n  }\n  // Compare\n  let left = head, right = prev;\n  while (right) {\n    if (left.val !== right.val) return false;\n    left = left.next;\n    right = right.next;\n  }\n  return true;\n}\n\nconsole.log("Palindrome check complete");`,
      python: `def is_palindrome(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    prev = None\n    while slow:\n        slow.next, prev, slow = prev, slow, slow.next\n    left, right = head, prev\n    while right:\n        if left.val != right.val: return False\n        left = left.next\n        right = right.next\n    return True\n\nprint("Palindrome check complete")`,
    },
    testCases: [
      { input: "head = [1,2,2,1]", expectedOutput: "true" },
      { input: "head = [1,2]", expectedOutput: "false" },
    ],
    hints: [
      "Find middle with slow/fast pointers.",
      "Reverse the second half.",
      "Compare both halves.",
    ],
  },
  {
    id: "implement-trie",
    slug: "implement-trie",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "medium",
    category: "trees",
    tags: ["Trie", "Design", "String"],
    description: `Implement a trie with \`insert\`, \`search\`, and \`startsWith\` methods.

### Examples
\`\`\`
trie = Trie()
trie.insert("apple")
trie.search("apple")   // true
trie.search("app")     // false
trie.startsWith("app") // true
trie.insert("app")
trie.search("app")     // true
\`\`\``,
    starterCode: {
      javascript: `class Trie {\n  constructor() { /* init */ }\n  insert(word) { /* code */ }\n  search(word) { /* code */ }\n  startsWith(prefix) { /* code */ }\n}`,
      python: `class Trie:\n    def __init__(self): pass\n    def insert(self, word): pass\n    def search(self, word): pass\n    def starts_with(self, prefix): pass`,
    },
    solution: {
      javascript: `class TrieNode {\n  constructor() { this.children = {}; this.isEnd = false; }\n}\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}\n\nconst trie = new Trie();\ntrie.insert("apple");\nconsole.log(trie.search("apple"));     // true\nconsole.log(trie.startsWith("app"));   // true`,
      python: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n    def search(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children: return False\n            node = node.children[ch]\n        return node.is_end\n    def starts_with(self, prefix):\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children: return False\n            node = node.children[ch]\n        return True\n\ntrie = Trie()\ntrie.insert("apple")\nprint(trie.search("apple"))     # True\nprint(trie.starts_with("app"))  # True`,
    },
    testCases: [
      { input: 'insert("apple"), search("apple")', expectedOutput: "true" },
      { input: 'search("app")', expectedOutput: "false" },
      { input: 'startsWith("app")', expectedOutput: "true" },
    ],
    hints: [
      "Each node has a map of children.",
      "Each node tracks if it's the end of a word.",
    ],
  },
  {
    id: "median-of-two-sorted-arrays",
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    category: "searching",
    tags: ["Binary Search", "Array", "Divide and Conquer"],
    description: `Given two sorted arrays \`nums1\` and \`nums2\`, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

### Examples
**Input:** nums1 = [1,3], nums2 = [2]
**Output:** 2.0

**Input:** nums1 = [1,2], nums2 = [3,4]
**Output:** 2.5`,
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}`,
      python: `def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];\n  const m = nums1.length, n = nums2.length;\n  let lo = 0, hi = m;\n  while (lo <= hi) {\n    const i = Math.floor((lo + hi) / 2);\n    const j = Math.floor((m + n + 1) / 2) - i;\n    const left1 = i === 0 ? -Infinity : nums1[i-1];\n    const right1 = i === m ? Infinity : nums1[i];\n    const left2 = j === 0 ? -Infinity : nums2[j-1];\n    const right2 = j === n ? Infinity : nums2[j];\n    if (left1 <= right2 && left2 <= right1) {\n      if ((m + n) % 2 === 0) return (Math.max(left1,left2) + Math.min(right1,right2)) / 2;\n      return Math.max(left1, left2);\n    } else if (left1 > right2) hi = i - 1;\n    else lo = i + 1;\n  }\n  return 0;\n}\n\nconsole.log(findMedianSortedArrays([1,3], [2])); // 2`,
      python: `def find_median_sorted_arrays(nums1, nums2):\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n    m, n = len(nums1), len(nums2)\n    lo, hi = 0, m\n    while lo <= hi:\n        i = (lo + hi) // 2\n        j = (m + n + 1) // 2 - i\n        left1 = nums1[i-1] if i > 0 else float('-inf')\n        right1 = nums1[i] if i < m else float('inf')\n        left2 = nums2[j-1] if j > 0 else float('-inf')\n        right2 = nums2[j] if j < n else float('inf')\n        if left1 <= right2 and left2 <= right1:\n            if (m + n) % 2 == 0:\n                return (max(left1,left2) + min(right1,right2)) / 2\n            return max(left1, left2)\n        elif left1 > right2: hi = i - 1\n        else: lo = i + 1\n    return 0\n\nprint(find_median_sorted_arrays([1,3], [2]))  # 2`,
    },
    testCases: [
      { input: "nums1 = [1,3], nums2 = [2]", expectedOutput: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", expectedOutput: "2.5" },
    ],
    hints: [
      "Binary search on the smaller array.",
      "Find the correct partition so left elements <= right elements.",
    ],
  },
  {
    id: "serialize-deserialize-tree",
    slug: "serialize-deserialize-tree",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "hard",
    category: "trees",
    tags: ["Tree", "BFS", "DFS", "Design"],
    description: `Design an algorithm to serialize a binary tree to a string and deserialize it back.

### Examples
**Input:** root = [1,2,3,null,null,4,5]
**Output:** After serialize then deserialize, the tree should be identical`,
    starterCode: {
      javascript: `function serialize(root) { /* code */ }\nfunction deserialize(data) { /* code */ }`,
      python: `def serialize(root): pass\ndef deserialize(data): pass`,
    },
    solution: {
      javascript: `function serialize(root) {\n  if (!root) return "null";\n  return root.val + "," + serialize(root.left) + "," + serialize(root.right);\n}\nfunction deserialize(data) {\n  const vals = data.split(",");\n  let i = 0;\n  function build() {\n    if (i >= vals.length || vals[i] === "null") { i++; return null; }\n    const node = { val: parseInt(vals[i++]), left: null, right: null };\n    node.left = build();\n    node.right = build();\n    return node;\n  }\n  return build();\n}\n\nconst tree = { val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } };\nconsole.log(serialize(tree)); // "1,2,null,null,3,null,null"`,
      python: `def serialize(root):\n    if not root: return "null"\n    return f"{root.val},{serialize(root.left)},{serialize(root.right)}"\n\ndef deserialize(data):\n    vals = iter(data.split(","))\n    def build():\n        val = next(vals)\n        if val == "null": return None\n        node = TreeNode(int(val))\n        node.left = build()\n        node.right = build()\n        return node\n    return build()\n\nprint("Serialize/Deserialize implemented")`,
    },
    testCases: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        expectedOutput: "Same tree after round-trip",
      },
    ],
    hints: [
      'Use preorder traversal with "null" markers.',
      "Deserialize by reading values in order and building recursively.",
    ],
  },
  {
    id: "longest-palindromic-substring",
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["String", "Dynamic Programming"],
    description: `Given a string \`s\`, return the longest palindromic substring.

### Examples
**Input:** s = "babad" **Output:** "bab" or "aba"
**Input:** s = "cbbd" **Output:** "bb"`,
    starterCode: {
      javascript: `function longestPalindrome(s) {\n  // Your code here\n}`,
      python: `def longest_palindrome(s):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function longestPalindrome(s) {\n  let start = 0, maxLen = 1;\n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }\n    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }\n  }\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);     // odd\n    expand(i, i + 1); // even\n  }\n  return s.substring(start, start + maxLen);\n}\n\nconsole.log(longestPalindrome("babad")); // "bab"`,
      python: `def longest_palindrome(s):\n    start, max_len = 0, 1\n    def expand(l, r):\n        nonlocal start, max_len\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            l -= 1; r += 1\n        if r - l - 1 > max_len:\n            max_len = r - l - 1\n            start = l + 1\n    for i in range(len(s)):\n        expand(i, i)\n        expand(i, i+1)\n    return s[start:start+max_len]\n\nprint(longest_palindrome("babad"))  # "bab"`,
    },
    testCases: [
      { input: '"babad"', expectedOutput: '"bab" or "aba"' },
      { input: '"cbbd"', expectedOutput: '"bb"' },
    ],
    hints: [
      "Expand around each center.",
      "Check both odd and even length palindromes.",
    ],
  },
];
