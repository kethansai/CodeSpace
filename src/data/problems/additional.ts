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

  // ─── Tree practice problems ───
  {
    id: "same-tree",
    slug: "same-tree",
    title: "Same Tree",
    difficulty: "easy",
    category: "trees",
    tags: ["Tree", "DFS", "BFS", "Recursion"],
    description: `Given the roots of two binary trees \`p\` and \`q\`, return \`true\` iff they are structurally identical and every corresponding pair of nodes has the same value.

### Examples
**Input:** p = [1,2,3], q = [1,2,3]  **Output:** true
**Input:** p = [1,2], q = [1,null,2] **Output:** false`,
    starterCode: {
      javascript: `function isSameTree(p, q) {\n  // Your code here\n}`,
      python: `def is_same_tree(p, q):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isSameTree(p, q) {\n  if (!p && !q) return true;\n  if (!p || !q) return false;\n  if (p.val !== q.val) return false;\n  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}\n\nclass TreeNode {\n  constructor(v, l=null, r=null){ this.val=v; this.left=l; this.right=r; }\n}\nconst n = (v,l=null,r=null)=>new TreeNode(v,l,r);\nconsole.log(isSameTree(n(1,n(2),n(3)), n(1,n(2),n(3))));         // true\nconsole.log(isSameTree(n(1,n(2)),       n(1,null,n(2))));        // false`,
      python: `class TreeNode:\n    def __init__(self,v,l=None,r=None): self.val,self.left,self.right=v,l,r\n\ndef is_same_tree(p, q):\n    if not p and not q: return True\n    if not p or not q: return False\n    if p.val != q.val: return False\n    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)\n\nn = TreeNode\nprint(is_same_tree(n(1,n(2),n(3)), n(1,n(2),n(3))))   # True\nprint(is_same_tree(n(1,n(2)),      n(1,None,n(2))))   # False`,
    },
    testCases: [
      { input: "p = [1,2,3], q = [1,2,3]", expectedOutput: "true" },
      { input: "p = [1,2], q = [1,null,2]", expectedOutput: "false" },
    ],
    hints: [
      "Recurse in lock-step on both trees.",
      "Handle null cases first.",
    ],
  },
  {
    id: "symmetric-tree",
    slug: "symmetric-tree",
    title: "Symmetric Tree",
    difficulty: "easy",
    category: "trees",
    tags: ["Tree", "DFS", "Recursion"],
    description: `Check whether a binary tree is a mirror of itself — i.e. symmetric around its center.

### Examples
**Input:** root = [1,2,2,3,4,4,3] **Output:** true
**Input:** root = [1,2,2,null,3,null,3] **Output:** false`,
    starterCode: {
      javascript: `function isSymmetric(root) {\n  // Your code here\n}`,
      python: `def is_symmetric(root):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isSymmetric(root) {\n  const mirror = (a, b) => {\n    if (!a && !b) return true;\n    if (!a || !b) return false;\n    return a.val === b.val && mirror(a.left, b.right) && mirror(a.right, b.left);\n  };\n  return !root || mirror(root.left, root.right);\n}\n\nclass TreeNode { constructor(v,l=null,r=null){ this.val=v; this.left=l; this.right=r; } }\nconst n = (v,l=null,r=null)=>new TreeNode(v,l,r);\nconsole.log(isSymmetric(n(1, n(2,n(3),n(4)), n(2,n(4),n(3)))));  // true\nconsole.log(isSymmetric(n(1, n(2,null,n(3)), n(2,null,n(3)))));  // false`,
      python: `class TreeNode:\n    def __init__(self,v,l=None,r=None): self.val,self.left,self.right=v,l,r\n\ndef is_symmetric(root):\n    def mirror(a, b):\n        if not a and not b: return True\n        if not a or not b: return False\n        return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)\n    return not root or mirror(root.left, root.right)\n\nn = TreeNode\nprint(is_symmetric(n(1, n(2,n(3),n(4)), n(2,n(4),n(3)))))   # True\nprint(is_symmetric(n(1, n(2,None,n(3)), n(2,None,n(3)))))   # False`,
    },
    testCases: [
      { input: "root = [1,2,2,3,4,4,3]", expectedOutput: "true" },
      { input: "root = [1,2,2,null,3,null,3]", expectedOutput: "false" },
    ],
    hints: [
      "Compare left subtree with mirrored right subtree.",
      "Pair (a.left ↔ b.right) and (a.right ↔ b.left).",
    ],
  },
  {
    id: "validate-bst",
    slug: "validate-bst",
    title: "Validate Binary Search Tree",
    difficulty: "medium",
    category: "trees",
    tags: ["Tree", "BST", "DFS"],
    description: `Given the root of a binary tree, determine whether it is a valid binary search tree.

A valid BST means: for every node, all values in the left subtree are strictly less, and all values in the right subtree are strictly greater.

### Examples
**Input:** root = [2,1,3]            **Output:** true
**Input:** root = [5,1,4,null,null,3,6] **Output:** false`,
    starterCode: {
      javascript: `function isValidBST(root) {\n  // Your code here\n}`,
      python: `def is_valid_bst(root):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isValidBST(root, lo = -Infinity, hi = Infinity) {\n  if (!root) return true;\n  if (root.val <= lo || root.val >= hi) return false;\n  return isValidBST(root.left, lo, root.val)\n      && isValidBST(root.right, root.val, hi);\n}\n\nclass TreeNode { constructor(v,l=null,r=null){ this.val=v; this.left=l; this.right=r; } }\nconst n = (v,l=null,r=null)=>new TreeNode(v,l,r);\nconsole.log(isValidBST(n(2, n(1), n(3))));                    // true\nconsole.log(isValidBST(n(5, n(1), n(4, n(3), n(6)))));        // false`,
      python: `class TreeNode:\n    def __init__(self,v,l=None,r=None): self.val,self.left,self.right=v,l,r\n\ndef is_valid_bst(root, lo=float('-inf'), hi=float('inf')):\n    if not root: return True\n    if not (lo < root.val < hi): return False\n    return is_valid_bst(root.left, lo, root.val) and \\\n           is_valid_bst(root.right, root.val, hi)\n\nn = TreeNode\nprint(is_valid_bst(n(2, n(1), n(3))))                     # True\nprint(is_valid_bst(n(5, n(1), n(4, n(3), n(6)))))         # False`,
    },
    testCases: [
      { input: "root = [2,1,3]", expectedOutput: "true" },
      { input: "root = [5,1,4,null,null,3,6]", expectedOutput: "false" },
    ],
    hints: [
      "Pass down (min, max) bounds.",
      "A node must be strictly between its ancestors' bounds.",
      "Alternative: an in-order traversal must be strictly increasing.",
    ],
  },
  {
    id: "diameter-of-binary-tree",
    slug: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    difficulty: "easy",
    category: "trees",
    tags: ["Tree", "DFS", "Recursion"],
    description: `The diameter of a binary tree is the length (in edges) of the longest path between any two nodes in the tree. The path may or may not pass through the root.

### Examples
**Input:** root = [1,2,3,4,5] **Output:** 3 (path 4 → 2 → 1 → 3 or 5 → 2 → 1 → 3)`,
    starterCode: {
      javascript: `function diameterOfBinaryTree(root) {\n  // Your code here\n}`,
      python: `def diameter_of_binary_tree(root):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function diameterOfBinaryTree(root) {\n  let best = 0;\n  const depth = (n) => {\n    if (!n) return 0;\n    const L = depth(n.left), R = depth(n.right);\n    best = Math.max(best, L + R);\n    return 1 + Math.max(L, R);\n  };\n  depth(root);\n  return best;\n}\n\nclass TreeNode { constructor(v,l=null,r=null){ this.val=v; this.left=l; this.right=r; } }\nconst n = (v,l=null,r=null)=>new TreeNode(v,l,r);\nconsole.log(diameterOfBinaryTree(n(1, n(2,n(4),n(5)), n(3)))); // 3`,
      python: `class TreeNode:\n    def __init__(self,v,l=None,r=None): self.val,self.left,self.right=v,l,r\n\ndef diameter_of_binary_tree(root):\n    best = [0]\n    def depth(n):\n        if not n: return 0\n        L, R = depth(n.left), depth(n.right)\n        best[0] = max(best[0], L + R)\n        return 1 + max(L, R)\n    depth(root)\n    return best[0]\n\nn = TreeNode\nprint(diameter_of_binary_tree(n(1, n(2,n(4),n(5)), n(3))))  # 3`,
    },
    testCases: [
      { input: "root = [1,2,3,4,5]", expectedOutput: "3" },
      { input: "root = [1,2]", expectedOutput: "1" },
    ],
    hints: [
      "Compute subtree depths post-order.",
      "At each node, the longest path *through* it is left depth + right depth.",
      "Track the global maximum separately from the return value.",
    ],
  },
  {
    id: "balanced-binary-tree",
    slug: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    difficulty: "easy",
    category: "trees",
    tags: ["Tree", "DFS", "Recursion"],
    description: `Given a binary tree, return \`true\` iff it is height-balanced — i.e. every node's two subtrees differ in height by at most 1.

### Examples
**Input:** root = [3,9,20,null,null,15,7]   **Output:** true
**Input:** root = [1,2,2,3,3,null,null,4,4] **Output:** false`,
    starterCode: {
      javascript: `function isBalanced(root) {\n  // Your code here\n}`,
      python: `def is_balanced(root):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isBalanced(root) {\n  // Return height, or -1 if already unbalanced somewhere below.\n  const check = (n) => {\n    if (!n) return 0;\n    const L = check(n.left);  if (L === -1) return -1;\n    const R = check(n.right); if (R === -1) return -1;\n    if (Math.abs(L - R) > 1) return -1;\n    return 1 + Math.max(L, R);\n  };\n  return check(root) !== -1;\n}\n\nclass TreeNode { constructor(v,l=null,r=null){ this.val=v; this.left=l; this.right=r; } }\nconst n = (v,l=null,r=null)=>new TreeNode(v,l,r);\nconsole.log(isBalanced(n(3, n(9), n(20, n(15), n(7)))));           // true\nconsole.log(isBalanced(n(1, n(2, n(3, n(4))), n(2))));             // false`,
      python: `class TreeNode:\n    def __init__(self,v,l=None,r=None): self.val,self.left,self.right=v,l,r\n\ndef is_balanced(root):\n    def check(n):\n        if not n: return 0\n        L = check(n.left)\n        if L == -1: return -1\n        R = check(n.right)\n        if R == -1: return -1\n        if abs(L - R) > 1: return -1\n        return 1 + max(L, R)\n    return check(root) != -1\n\nn = TreeNode\nprint(is_balanced(n(3, n(9), n(20, n(15), n(7)))))   # True\nprint(is_balanced(n(1, n(2, n(3, n(4))), n(2))))     # False`,
    },
    testCases: [
      { input: "root = [3,9,20,null,null,15,7]", expectedOutput: "true" },
      {
        input: "root = [1,2,2,3,3,null,null,4,4]",
        expectedOutput: "false",
      },
    ],
    hints: [
      "Bottom-up: return subtree height, or a sentinel for unbalanced.",
      "Short-circuit as soon as one subtree reports unbalanced.",
    ],
  },
  {
    id: "binary-tree-level-order-traversal",
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    category: "trees",
    tags: ["Tree", "BFS", "Queue"],
    description: `Given the root of a binary tree, return the level-order traversal of its nodes' values (level-by-level, left-to-right).

### Examples
**Input:** root = [3,9,20,null,null,15,7]
**Output:** [[3],[9,20],[15,7]]`,
    starterCode: {
      javascript: `function levelOrder(root) {\n  // Your code here\n}`,
      python: `def level_order(root):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function levelOrder(root) {\n  if (!root) return [];\n  const out = [], q = [root];\n  while (q.length) {\n    const level = [], size = q.length;\n    for (let i = 0; i < size; i++) {\n      const n = q.shift();\n      level.push(n.val);\n      if (n.left)  q.push(n.left);\n      if (n.right) q.push(n.right);\n    }\n    out.push(level);\n  }\n  return out;\n}\n\nclass TreeNode { constructor(v,l=null,r=null){ this.val=v; this.left=l; this.right=r; } }\nconst n = (v,l=null,r=null)=>new TreeNode(v,l,r);\nconsole.log(levelOrder(n(3, n(9), n(20, n(15), n(7))))); // [[3],[9,20],[15,7]]`,
      python: `from collections import deque\n\nclass TreeNode:\n    def __init__(self,v,l=None,r=None): self.val,self.left,self.right=v,l,r\n\ndef level_order(root):\n    if not root: return []\n    out, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            n = q.popleft()\n            level.append(n.val)\n            if n.left: q.append(n.left)\n            if n.right: q.append(n.right)\n        out.append(level)\n    return out\n\nn = TreeNode\nprint(level_order(n(3, n(9), n(20, n(15), n(7)))))  # [[3], [9, 20], [15, 7]]`,
    },
    testCases: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        expectedOutput: "[[3],[9,20],[15,7]]",
      },
      { input: "root = []", expectedOutput: "[]" },
    ],
    hints: [
      "Use a queue and process each level by its current size.",
      "Record `q.length` before draining — new children belong to the next level.",
    ],
  },
  {
    id: "path-sum",
    slug: "path-sum",
    title: "Path Sum",
    difficulty: "easy",
    category: "trees",
    tags: ["Tree", "DFS", "Recursion"],
    description: `Given the root of a binary tree and an integer \`targetSum\`, return \`true\` iff the tree has a root-to-leaf path such that adding up all the values equals \`targetSum\`.

### Examples
**Input:** root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
**Output:** true (path 5 → 4 → 11 → 2)`,
    starterCode: {
      javascript: `function hasPathSum(root, targetSum) {\n  // Your code here\n}`,
      python: `def has_path_sum(root, target_sum):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function hasPathSum(root, targetSum) {\n  if (!root) return false;\n  const rem = targetSum - root.val;\n  if (!root.left && !root.right) return rem === 0;\n  return hasPathSum(root.left, rem) || hasPathSum(root.right, rem);\n}\n\nclass TreeNode { constructor(v,l=null,r=null){ this.val=v; this.left=l; this.right=r; } }\nconst n = (v,l=null,r=null)=>new TreeNode(v,l,r);\nconst root = n(5, n(4, n(11, n(7), n(2))), n(8, n(13), n(4, null, n(1))));\nconsole.log(hasPathSum(root, 22)); // true`,
      python: `class TreeNode:\n    def __init__(self,v,l=None,r=None): self.val,self.left,self.right=v,l,r\n\ndef has_path_sum(root, target_sum):\n    if not root: return False\n    rem = target_sum - root.val\n    if not root.left and not root.right:\n        return rem == 0\n    return has_path_sum(root.left, rem) or has_path_sum(root.right, rem)\n\nn = TreeNode\nroot = n(5, n(4, n(11, n(7), n(2))), n(8, n(13), n(4, None, n(1))))\nprint(has_path_sum(root, 22))  # True`,
    },
    testCases: [
      {
        input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], target=22",
        expectedOutput: "true",
      },
      { input: "root = [1,2,3], target=5", expectedOutput: "false" },
    ],
    hints: [
      "Subtract the current value from target as you descend.",
      "Succeed at a leaf when the remaining target is zero.",
    ],
  },
  {
    id: "number-of-connected-components",
    slug: "number-of-connected-components",
    title: "Number of Connected Components in an Undirected Graph",
    difficulty: "medium",
    category: "graphs",
    tags: ["Graph", "Union Find", "DFS", "BFS"],
    description: `You have a graph of \`n\` nodes labeled \`0..n-1\`. Given an array \`edges\` where \`edges[i] = [a, b]\` indicates an undirected edge between \`a\` and \`b\`, return the number of connected components.

### Examples
**Input:** n = 5, edges = [[0,1],[1,2],[3,4]]
**Output:** 2

**Input:** n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
**Output:** 1`,
    starterCode: {
      javascript: `function countComponents(n, edges) {\n  // Your code here\n}`,
      python: `def count_components(n, edges):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function countComponents(n, edges) {\n  const parent = Array.from({length:n}, (_,i)=>i);\n  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };\n  let components = n;\n  for (const [a, b] of edges) {\n    const ra = find(a), rb = find(b);\n    if (ra !== rb) { parent[ra] = rb; components--; }\n  }\n  return components;\n}\n\nconsole.log(countComponents(5, [[0,1],[1,2],[3,4]])); // 2`,
      python: `def count_components(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    components = n\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra != rb:\n            parent[ra] = rb\n            components -= 1\n    return components\n\nprint(count_components(5, [[0,1],[1,2],[3,4]]))  # 2`,
    },
    testCases: [
      { input: "n=5, edges=[[0,1],[1,2],[3,4]]", expectedOutput: "2" },
      { input: "n=5, edges=[[0,1],[1,2],[2,3],[3,4]]", expectedOutput: "1" },
    ],
    hints: [
      "Use Union-Find: components = n − successful unions.",
      "Alternatively, run DFS/BFS from each unvisited node.",
    ],
  },
  {
    id: "is-graph-bipartite",
    slug: "is-graph-bipartite",
    title: "Is Graph Bipartite?",
    difficulty: "medium",
    category: "graphs",
    tags: ["Graph", "BFS", "DFS", "Coloring"],
    description: `Given an undirected graph as adjacency list \`graph\` where \`graph[i]\` is the list of neighbors of node \`i\`, return \`true\` if the graph is bipartite (2-colorable with no conflicts).

### Examples
**Input:** graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
**Output:** false

**Input:** graph = [[1,3],[0,2],[1,3],[0,2]]
**Output:** true`,
    starterCode: {
      javascript: `function isBipartite(graph) {\n  // Your code here\n}`,
      python: `def is_bipartite(graph):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isBipartite(graph) {\n  const n = graph.length;\n  const color = new Array(n).fill(-1);\n  for (let s = 0; s < n; s++) {\n    if (color[s] !== -1) continue;\n    color[s] = 0;\n    const q = [s];\n    while (q.length) {\n      const u = q.shift();\n      for (const v of graph[u]) {\n        if (color[v] === -1) { color[v] = 1 - color[u]; q.push(v); }\n        else if (color[v] === color[u]) return false;\n      }\n    }\n  }\n  return true;\n}\n\nconsole.log(isBipartite([[1,3],[0,2],[1,3],[0,2]])); // true\nconsole.log(isBipartite([[1,2,3],[0,2],[0,1,3],[0,2]])); // false`,
      python: `from collections import deque\ndef is_bipartite(graph):\n    n = len(graph)\n    color = [-1]*n\n    for s in range(n):\n        if color[s] != -1: continue\n        color[s] = 0\n        q = deque([s])\n        while q:\n            u = q.popleft()\n            for v in graph[u]:\n                if color[v] == -1:\n                    color[v] = 1 - color[u]; q.append(v)\n                elif color[v] == color[u]:\n                    return False\n    return True\n\nprint(is_bipartite([[1,3],[0,2],[1,3],[0,2]]))      # True\nprint(is_bipartite([[1,2,3],[0,2],[0,1,3],[0,2]]))  # False`,
    },
    testCases: [
      { input: "graph=[[1,3],[0,2],[1,3],[0,2]]", expectedOutput: "true" },
      {
        input: "graph=[[1,2,3],[0,2],[0,1,3],[0,2]]",
        expectedOutput: "false",
      },
    ],
    hints: [
      "Color with BFS; each neighbor must get the opposite color.",
      "A same-color conflict proves the graph is not bipartite.",
      "Remember to restart BFS on disconnected components.",
    ],
  },
  {
    id: "network-delay-time",
    slug: "network-delay-time",
    title: "Network Delay Time",
    difficulty: "medium",
    category: "graphs",
    tags: ["Graph", "Dijkstra", "Shortest Path"],
    description: `You are given a network of \`n\` nodes labeled \`1..n\`. \`times[i] = [u, v, w]\` means a signal travels from \`u\` to \`v\` in \`w\` ms. Starting at node \`k\`, return the time it takes for all nodes to receive the signal, or \`-1\` if impossible.

### Examples
**Input:** times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
**Output:** 2`,
    starterCode: {
      javascript: `function networkDelayTime(times, n, k) {\n  // Your code here\n}`,
      python: `def network_delay_time(times, n, k):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function networkDelayTime(times, n, k) {\n  const adj = Array.from({length: n+1}, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  const dist = new Array(n+1).fill(Infinity);\n  dist[k] = 0;\n  const pq = [[0, k]];\n  while (pq.length) {\n    pq.sort((a,b)=>a[0]-b[0]);\n    const [d, u] = pq.shift();\n    if (d > dist[u]) continue;\n    for (const [v, w] of adj[u]) {\n      const nd = d + w;\n      if (nd < dist[v]) { dist[v] = nd; pq.push([nd, v]); }\n    }\n  }\n  let ans = 0;\n  for (let i = 1; i <= n; i++) {\n    if (dist[i] === Infinity) return -1;\n    ans = Math.max(ans, dist[i]);\n  }\n  return ans;\n}\n\nconsole.log(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2)); // 2`,
      python: `import heapq\ndef network_delay_time(times, n, k):\n    adj = [[] for _ in range(n+1)]\n    for u, v, w in times: adj[u].append((v, w))\n    dist = [float('inf')] * (n+1)\n    dist[k] = 0\n    pq = [(0, k)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in adj[u]:\n            nd = d + w\n            if nd < dist[v]:\n                dist[v] = nd\n                heapq.heappush(pq, (nd, v))\n    ans = max(dist[1:])\n    return -1 if ans == float('inf') else ans\n\nprint(network_delay_time([[2,1,1],[2,3,1],[3,4,1]], 4, 2))  # 2`,
    },
    testCases: [
      {
        input: "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2",
        expectedOutput: "2",
      },
      { input: "times=[[1,2,1]], n=2, k=1", expectedOutput: "1" },
      { input: "times=[[1,2,1]], n=2, k=2", expectedOutput: "-1" },
    ],
    hints: [
      "Run Dijkstra from k.",
      "The answer is the max shortest distance (or -1 if any stays ∞).",
    ],
  },
  {
    id: "redundant-connection",
    slug: "redundant-connection",
    title: "Redundant Connection",
    difficulty: "medium",
    category: "graphs",
    tags: ["Graph", "Union Find", "Cycle"],
    description: `A tree on \`n\` nodes gets one extra edge added, creating exactly one cycle. Given \`edges\` (1-indexed), return the last edge that, if removed, restores a tree (prefer later-appearing edges on ties).

### Examples
**Input:** edges = [[1,2],[1,3],[2,3]]
**Output:** [2,3]

**Input:** edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]
**Output:** [1,4]`,
    starterCode: {
      javascript: `function findRedundantConnection(edges) {\n  // Your code here\n}`,
      python: `def find_redundant_connection(edges):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function findRedundantConnection(edges) {\n  const n = edges.length;\n  const parent = Array.from({length: n+1}, (_,i)=>i);\n  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };\n  for (const [a, b] of edges) {\n    const ra = find(a), rb = find(b);\n    if (ra === rb) return [a, b];\n    parent[ra] = rb;\n  }\n  return [];\n}\n\nconsole.log(findRedundantConnection([[1,2],[1,3],[2,3]]));              // [2,3]\nconsole.log(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]])); // [1,4]`,
      python: `def find_redundant_connection(edges):\n    n = len(edges)\n    parent = list(range(n+1))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb: return [a, b]\n        parent[ra] = rb\n    return []\n\nprint(find_redundant_connection([[1,2],[1,3],[2,3]]))              # [2, 3]\nprint(find_redundant_connection([[1,2],[2,3],[3,4],[1,4],[1,5]])) # [1, 4]`,
    },
    testCases: [
      { input: "edges=[[1,2],[1,3],[2,3]]", expectedOutput: "[2,3]" },
      {
        input: "edges=[[1,2],[2,3],[3,4],[1,4],[1,5]]",
        expectedOutput: "[1,4]",
      },
    ],
    hints: [
      "Union-Find. The first edge whose endpoints are already in the same set closes the cycle.",
    ],
  },

  // ─── Dynamic Programming practice problems ───
  {
    id: "climbing-stairs",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "easy",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "Math"],
    description: `You are climbing a staircase of \`n\` steps. Each move you may climb 1 or 2 steps. How many distinct ways can you reach the top?

### Examples
**Input:** n = 2  **Output:** 2  (1+1, 2)
**Input:** n = 3  **Output:** 3  (1+1+1, 1+2, 2+1)
**Input:** n = 5  **Output:** 8`,
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Your code here\n}`,
      python: `def climb_stairs(n):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function climbStairs(n) {\n  if (n <= 1) return 1;\n  let a = 1, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}\n\nconsole.log(climbStairs(2)); // 2\nconsole.log(climbStairs(3)); // 3\nconsole.log(climbStairs(5)); // 8`,
      python: `def climb_stairs(n):\n    if n <= 1: return 1\n    a, b = 1, 1\n    for _ in range(2, n+1):\n        a, b = b, a + b\n    return b\n\nprint(climb_stairs(2))  # 2\nprint(climb_stairs(3))  # 3\nprint(climb_stairs(5))  # 8`,
    },
    testCases: [
      { input: "n = 2", expectedOutput: "2" },
      { input: "n = 3", expectedOutput: "3" },
      { input: "n = 5", expectedOutput: "8" },
    ],
    hints: [
      "ways(i) = ways(i-1) + ways(i-2). It's literally Fibonacci.",
      "Roll two variables — no array needed.",
    ],
  },
  {
    id: "house-robber",
    slug: "house-robber",
    title: "House Robber",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming"],
    description: `A row of \`n\` houses each has money \`nums[i]\`. You cannot rob two adjacent houses. Maximize the total amount.

### Examples
**Input:** nums = [1,2,3,1]     **Output:** 4  (1 + 3)
**Input:** nums = [2,7,9,3,1]   **Output:** 12 (2 + 9 + 1)`,
    starterCode: {
      javascript: `function rob(nums) {\n  // Your code here\n}`,
      python: `def rob(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function rob(nums) {\n  let prev2 = 0, prev1 = 0;\n  for (const x of nums) {\n    const cur = Math.max(prev1, prev2 + x);\n    prev2 = prev1; prev1 = cur;\n  }\n  return prev1;\n}\n\nconsole.log(rob([1,2,3,1]));     // 4\nconsole.log(rob([2,7,9,3,1]));   // 12`,
      python: `def rob(nums):\n    prev2 = prev1 = 0\n    for x in nums:\n        prev2, prev1 = prev1, max(prev1, prev2 + x)\n    return prev1\n\nprint(rob([1,2,3,1]))     # 4\nprint(rob([2,7,9,3,1]))   # 12`,
    },
    testCases: [
      { input: "nums = [1,2,3,1]", expectedOutput: "4" },
      { input: "nums = [2,7,9,3,1]", expectedOutput: "12" },
    ],
    hints: [
      "At each house: rob it (prev2 + x) or skip it (prev1).",
      "Keep only the two most recent values.",
    ],
  },
  {
    id: "house-robber-ii",
    slug: "house-robber-ii",
    title: "House Robber II (Circular)",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming"],
    description: `Same as House Robber, but the houses are arranged **in a circle** — the first and last are adjacent.

### Example
**Input:** nums = [2,3,2]  **Output:** 3  (rob house 1)
**Input:** nums = [1,2,3,1] **Output:** 4`,
    starterCode: {
      javascript: `function rob(nums) {\n  // Your code here\n}`,
      python: `def rob(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function rob(nums) {\n  const linear = (arr) => {\n    let p2 = 0, p1 = 0;\n    for (const x of arr) { const c = Math.max(p1, p2 + x); p2 = p1; p1 = c; }\n    return p1;\n  };\n  if (nums.length === 1) return nums[0];\n  return Math.max(linear(nums.slice(0, -1)), linear(nums.slice(1)));\n}\n\nconsole.log(rob([2,3,2]));   // 3\nconsole.log(rob([1,2,3,1])); // 4`,
      python: `def rob(nums):\n    def linear(arr):\n        p2 = p1 = 0\n        for x in arr:\n            p2, p1 = p1, max(p1, p2 + x)\n        return p1\n    if len(nums) == 1: return nums[0]\n    return max(linear(nums[:-1]), linear(nums[1:]))\n\nprint(rob([2,3,2]))    # 3\nprint(rob([1,2,3,1]))  # 4`,
    },
    testCases: [
      { input: "nums = [2,3,2]", expectedOutput: "3" },
      { input: "nums = [1,2,3,1]", expectedOutput: "4" },
    ],
    hints: [
      "Split into two linear sub-problems: exclude the first house, or exclude the last.",
      "Return the max of the two.",
    ],
  },
  {
    id: "partition-equal-subset-sum",
    slug: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "Subset Sum"],
    description: `Given an integer array \`nums\`, return \`true\` iff it can be partitioned into two subsets with equal sums.

### Examples
**Input:** nums = [1,5,11,5] **Output:** true   ({1,5,5} & {11})
**Input:** nums = [1,2,3,5]  **Output:** false`,
    starterCode: {
      javascript: `function canPartition(nums) {\n  // Your code here\n}`,
      python: `def can_partition(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function canPartition(nums) {\n  const total = nums.reduce((s, x) => s + x, 0);\n  if (total % 2) return false;\n  const target = total / 2;\n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n  for (const x of nums)\n    for (let s = target; s >= x; s--)\n      if (dp[s - x]) dp[s] = true;\n  return dp[target];\n}\n\nconsole.log(canPartition([1,5,11,5])); // true\nconsole.log(canPartition([1,2,3,5]));  // false`,
      python: `def can_partition(nums):\n    total = sum(nums)\n    if total % 2: return False\n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for x in nums:\n        for s in range(target, x - 1, -1):\n            if dp[s - x]: dp[s] = True\n    return dp[target]\n\nprint(can_partition([1,5,11,5])) # True\nprint(can_partition([1,2,3,5]))  # False`,
    },
    testCases: [
      { input: "nums = [1,5,11,5]", expectedOutput: "true" },
      { input: "nums = [1,2,3,5]", expectedOutput: "false" },
    ],
    hints: [
      "Reduce to subset-sum with target = total / 2.",
      "Iterate capacity descending to enforce 0/1 selection.",
    ],
  },
  {
    id: "edit-distance",
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "hard",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "Strings"],
    description: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations (insert, delete, or replace a single character) required to transform \`word1\` into \`word2\`.

### Examples
**Input:** word1 = "horse",     word2 = "ros"       **Output:** 3
**Input:** word1 = "intention", word2 = "execution" **Output:** 5`,
    starterCode: {
      javascript: `function minDistance(word1, word2) {\n  // Your code here\n}`,
      python: `def min_distance(w1, w2):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function minDistance(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({length:m+1},(_,i)=>\n    new Array(n+1).fill(0).map((_,j)=> (i===0?j:j===0?i:0)));\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = a[i-1] === b[j-1]\n        ? dp[i-1][j-1]\n        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);\n  return dp[m][n];\n}\n\nconsole.log(minDistance("horse","ros"));         // 3\nconsole.log(minDistance("intention","execution"));// 5`,
      python: `def min_distance(a, b):\n    m, n = len(a), len(b)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0] = i\n    for j in range(n+1): dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            dp[i][j] = dp[i-1][j-1] if a[i-1]==b[j-1] \\\n                else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]\n\nprint(min_distance("horse","ros"))          # 3\nprint(min_distance("intention","execution"))# 5`,
    },
    testCases: [
      { input: 'word1 = "horse", word2 = "ros"', expectedOutput: "3" },
      { input: 'word1 = "intention", word2 = "execution"', expectedOutput: "5" },
    ],
    hints: [
      "Three options per mismatch: insert, delete, replace — all cost 1.",
      "dp[i][j] = dp[i-1][j-1] when chars match.",
      "Base: dp[i][0] = i, dp[0][j] = j.",
    ],
  },
  {
    id: "unique-paths",
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "Combinatorics"],
    description: `A robot on an \`m x n\` grid starts at top-left and can only move right or down. Count the distinct paths to the bottom-right.

### Examples
**Input:** m = 3, n = 7  **Output:** 28
**Input:** m = 3, n = 2  **Output:** 3`,
    starterCode: {
      javascript: `function uniquePaths(m, n) {\n  // Your code here\n}`,
      python: `def unique_paths(m, n):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function uniquePaths(m, n) {\n  const dp = new Array(n).fill(1);\n  for (let i = 1; i < m; i++)\n    for (let j = 1; j < n; j++)\n      dp[j] += dp[j-1];\n  return dp[n-1];\n}\n\nconsole.log(uniquePaths(3,7)); // 28\nconsole.log(uniquePaths(3,2)); // 3`,
      python: `def unique_paths(m, n):\n    dp = [1] * n\n    for _ in range(1, m):\n        for j in range(1, n):\n            dp[j] += dp[j-1]\n    return dp[-1]\n\nprint(unique_paths(3,7)) # 28\nprint(unique_paths(3,2)) # 3`,
    },
    testCases: [
      { input: "m = 3, n = 7", expectedOutput: "28" },
      { input: "m = 3, n = 2", expectedOutput: "3" },
    ],
    hints: [
      "dp[i][j] = dp[i-1][j] + dp[i][j-1].",
      "Roll to 1D — updating dp[j] += dp[j-1] in place works.",
      "Closed form: C(m+n-2, m-1).",
    ],
  },
  {
    id: "word-break",
    slug: "word-break",
    title: "Word Break",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "Strings", "Hash Set"],
    description: `Given a string \`s\` and a dictionary of words \`wordDict\`, return \`true\` iff \`s\` can be segmented into a sequence of one or more dictionary words.

### Examples
**Input:** s = "leetcode",  wordDict = ["leet","code"]              **Output:** true
**Input:** s = "applepenapple", wordDict = ["apple","pen"]          **Output:** true
**Input:** s = "catsandog", wordDict = ["cats","dog","sand","and","cat"] **Output:** false`,
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {\n  // Your code here\n}`,
      python: `def word_break(s, word_dict):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function wordBreak(s, wordDict) {\n  const set = new Set(wordDict);\n  const n = s.length;\n  const dp = new Array(n + 1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= n; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }\n    }\n  }\n  return dp[n];\n}\n\nconsole.log(wordBreak("leetcode", ["leet","code"]));                    // true\nconsole.log(wordBreak("applepenapple", ["apple","pen"]));               // true\nconsole.log(wordBreak("catsandog", ["cats","dog","sand","and","cat"])); // false`,
      python: `def word_break(s, word_dict):\n    words = set(word_dict)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True\n    for i in range(1, n + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in words:\n                dp[i] = True\n                break\n    return dp[n]\n\nprint(word_break("leetcode", ["leet","code"]))                     # True\nprint(word_break("applepenapple", ["apple","pen"]))                # True\nprint(word_break("catsandog", ["cats","dog","sand","and","cat"])) # False`,
    },
    testCases: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', expectedOutput: "true" },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', expectedOutput: "false" },
    ],
    hints: [
      "dp[i] = true iff some prefix of length j < i has dp[j]=true and s[j..i) is a word.",
      "Store the dictionary as a Set for O(1) lookup.",
    ],
  },
  {
    id: "decode-ways",
    slug: "decode-ways",
    title: "Decode Ways",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "Strings"],
    description: `A message containing letters A–Z is encoded as digits: A=1 … Z=26. Given a digit string \`s\`, return the number of ways to decode it.

### Examples
**Input:** s = "12"    **Output:** 2  ("AB" or "L")
**Input:** s = "226"   **Output:** 3  ("BZ","VF","BBF")
**Input:** s = "06"    **Output:** 0  (leading zero)`,
    starterCode: {
      javascript: `function numDecodings(s) {\n  // Your code here\n}`,
      python: `def num_decodings(s):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function numDecodings(s) {\n  const n = s.length;\n  if (!n || s[0] === '0') return 0;\n  let prev2 = 1, prev1 = 1;\n  for (let i = 1; i < n; i++) {\n    let cur = 0;\n    if (s[i] !== '0') cur += prev1;\n    const two = parseInt(s.slice(i-1, i+1), 10);\n    if (two >= 10 && two <= 26) cur += prev2;\n    prev2 = prev1; prev1 = cur;\n  }\n  return prev1;\n}\n\nconsole.log(numDecodings("12"));  // 2\nconsole.log(numDecodings("226")); // 3\nconsole.log(numDecodings("06"));  // 0`,
      python: `def num_decodings(s):\n    n = len(s)\n    if not n or s[0] == '0': return 0\n    prev2 = prev1 = 1\n    for i in range(1, n):\n        cur = 0\n        if s[i] != '0': cur += prev1\n        two = int(s[i-1:i+1])\n        if 10 <= two <= 26: cur += prev2\n        prev2, prev1 = prev1, cur\n    return prev1\n\nprint(num_decodings("12"))  # 2\nprint(num_decodings("226")) # 3\nprint(num_decodings("06"))  # 0`,
    },
    testCases: [
      { input: 's = "12"', expectedOutput: "2" },
      { input: 's = "226"', expectedOutput: "3" },
      { input: 's = "06"', expectedOutput: "0" },
    ],
    hints: [
      "Two overlapping sub-moves: decode one digit, or decode two digits.",
      "A '0' can only be consumed as the second digit of 10 or 20.",
      "Leading zeros and pairs > 26 invalidate a path.",
    ],
  },
  {
    id: "coin-change-problem",
    slug: "coin-change-problem",
    title: "Coin Change",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "BFS"],
    description: `Given an integer array \`coins\` and an integer \`amount\`, return the fewest number of coins needed to make up \`amount\`. If it cannot be made, return -1.

### Examples
**Input:** coins = [1,2,5], amount = 11 **Output:** 3  (5+5+1)
**Input:** coins = [2],     amount = 3  **Output:** -1
**Input:** coins = [1],     amount = 0  **Output:** 0`,
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Your code here\n}`,
      python: `def coin_change(coins, amount):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++)\n    for (const c of coins)\n      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log(coinChange([1,2,5], 11)); // 3\nconsole.log(coinChange([2], 3));      // -1\nconsole.log(coinChange([1], 0));      // 0`,
      python: `def coin_change(coins, amount):\n    INF = float('inf')\n    dp = [INF] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and dp[a-c] + 1 < dp[a]:\n                dp[a] = dp[a-c] + 1\n    return -1 if dp[amount] == INF else dp[amount]\n\nprint(coin_change([1,2,5], 11)) # 3\nprint(coin_change([2], 3))      # -1\nprint(coin_change([1], 0))      # 0`,
    },
    testCases: [
      { input: "coins=[1,2,5], amount=11", expectedOutput: "3" },
      { input: "coins=[2], amount=3", expectedOutput: "-1" },
      { input: "coins=[1], amount=0", expectedOutput: "0" },
    ],
    hints: [
      "dp[a] = 1 + min over coins c of dp[a - c].",
      "Initialize dp[] to ∞; dp[0] = 0.",
      "If dp[amount] is still ∞ at the end, return -1.",
    ],
  },

  // ─── Greedy practice problems ───
  {
    id: "jump-game",
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Array", "Dynamic Programming"],
    description: `You are given an integer array \`nums\`. Starting at index 0, each \`nums[i]\` is the maximum jump length from that position. Return \`true\` iff you can reach the last index.

### Examples
**Input:** nums = [2,3,1,1,4]  **Output:** true
**Input:** nums = [3,2,1,0,4]  **Output:** false`,
    starterCode: {
      javascript: `function canJump(nums) {\n  // Your code here\n}`,
      python: `def can_jump(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    if (i + nums[i] > maxReach) maxReach = i + nums[i];\n    if (maxReach >= nums.length - 1) return true;\n  }\n  return true;\n}\n\nconsole.log(canJump([2,3,1,1,4])); // true\nconsole.log(canJump([3,2,1,0,4])); // false`,
      python: `def can_jump(nums):\n    max_reach = 0\n    for i, x in enumerate(nums):\n        if i > max_reach: return False\n        if i + x > max_reach: max_reach = i + x\n        if max_reach >= len(nums) - 1: return True\n    return True\n\nprint(can_jump([2,3,1,1,4]))  # True\nprint(can_jump([3,2,1,0,4]))  # False`,
    },
    testCases: [
      { input: "nums = [2,3,1,1,4]", expectedOutput: "true" },
      { input: "nums = [3,2,1,0,4]", expectedOutput: "false" },
    ],
    hints: [
      "Track the farthest index reachable so far.",
      "If current index exceeds maxReach, you're stuck.",
      "Early-exit once maxReach ≥ n - 1.",
    ],
  },
  {
    id: "jump-game-ii",
    slug: "jump-game-ii",
    title: "Jump Game II",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "BFS", "Array"],
    description: `Given a non-empty array \`nums\` guaranteed reachable, return the minimum number of jumps to reach the last index.

### Examples
**Input:** nums = [2,3,1,1,4]       **Output:** 2
**Input:** nums = [2,3,0,1,4]       **Output:** 2`,
    starterCode: {
      javascript: `function jump(nums) {\n  // Your code here\n}`,
      python: `def jump(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function jump(nums) {\n  let jumps = 0, end = 0, farthest = 0;\n  for (let i = 0; i < nums.length - 1; i++) {\n    if (i + nums[i] > farthest) farthest = i + nums[i];\n    if (i === end) { jumps++; end = farthest; }\n  }\n  return jumps;\n}\n\nconsole.log(jump([2,3,1,1,4])); // 2\nconsole.log(jump([2,3,0,1,4])); // 2`,
      python: `def jump(nums):\n    jumps = end = farthest = 0\n    for i in range(len(nums) - 1):\n        if i + nums[i] > farthest: farthest = i + nums[i]\n        if i == end:\n            jumps += 1\n            end = farthest\n    return jumps\n\nprint(jump([2,3,1,1,4]))  # 2\nprint(jump([2,3,0,1,4]))  # 2`,
    },
    testCases: [
      { input: "nums = [2,3,1,1,4]", expectedOutput: "2" },
      { input: "nums = [2,3,0,1,4]", expectedOutput: "2" },
    ],
    hints: [
      "Layered BFS: each jump lets you reach anywhere in [end+1, farthest].",
      "Bump jump count when i reaches the end of the current layer.",
      "Stop before the last index to avoid an off-by-one.",
    ],
  },
  {
    id: "gas-station",
    slug: "gas-station",
    title: "Gas Station",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Array"],
    description: `Two arrays \`gas\` and \`cost\` of length \`n\` describe a circular route. You start with an empty tank at some station; traveling from station \`i\` to \`i+1\` costs \`cost[i]\` and gains \`gas[i]\`. Return the starting index to complete the loop once, or \`-1\` if impossible.

### Examples
**Input:** gas = [1,2,3,4,5], cost = [3,4,5,1,2] **Output:** 3
**Input:** gas = [2,3,4],     cost = [3,4,3]     **Output:** -1`,
    starterCode: {
      javascript: `function canCompleteCircuit(gas, cost) {\n  // Your code here\n}`,
      python: `def can_complete_circuit(gas, cost):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function canCompleteCircuit(gas, cost) {\n  let total = 0, tank = 0, start = 0;\n  for (let i = 0; i < gas.length; i++) {\n    const d = gas[i] - cost[i];\n    total += d; tank += d;\n    if (tank < 0) { start = i + 1; tank = 0; }\n  }\n  return total < 0 ? -1 : start;\n}\n\nconsole.log(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])); // 3\nconsole.log(canCompleteCircuit([2,3,4],     [3,4,3]));     // -1`,
      python: `def can_complete_circuit(gas, cost):\n    total = tank = start = 0\n    for i, (g, c) in enumerate(zip(gas, cost)):\n        d = g - c\n        total += d\n        tank += d\n        if tank < 0:\n            start = i + 1\n            tank = 0\n    return -1 if total < 0 else start\n\nprint(can_complete_circuit([1,2,3,4,5], [3,4,5,1,2]))  # 3\nprint(can_complete_circuit([2,3,4],     [3,4,3]))      # -1`,
    },
    testCases: [
      { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", expectedOutput: "3" },
      { input: "gas = [2,3,4], cost = [3,4,3]", expectedOutput: "-1" },
    ],
    hints: [
      "If total(gas) < total(cost), no start is valid.",
      "When tank drops below 0 at station i, reset start to i + 1.",
      "Works in one pass.",
    ],
  },
  {
    id: "merge-intervals-problem",
    slug: "merge-intervals-problem",
    title: "Merge Intervals",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Sorting", "Intervals"],
    description: `Given a list of intervals \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals and return the minimum list that covers the same union.

### Examples
**Input:** intervals = [[1,3],[2,6],[8,10],[15,18]]  **Output:** [[1,6],[8,10],[15,18]]
**Input:** intervals = [[1,4],[4,5]]                 **Output:** [[1,5]]`,
    starterCode: {
      javascript: `function merge(intervals) {\n  // Your code here\n}`,
      python: `def merge(intervals):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals = [...intervals].sort((a, b) => a[0] - b[0]);\n  const out = [intervals[0].slice()];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = out[out.length - 1];\n    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);\n    else out.push(intervals[i].slice());\n  }\n  return out;\n}\n\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]]\nconsole.log(merge([[1,4],[4,5]]));                // [[1,5]]`,
      python: `def merge(intervals):\n    if not intervals: return []\n    intervals = sorted(intervals, key=lambda x: x[0])\n    out = [list(intervals[0])]\n    for s, e in intervals[1:]:\n        if s <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], e)\n        else:\n            out.append([s, e])\n    return out\n\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))  # [[1,6],[8,10],[15,18]]\nprint(merge([[1,4],[4,5]]))                 # [[1,5]]`,
    },
    testCases: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        expectedOutput: "[[1,6],[8,10],[15,18]]",
      },
      { input: "intervals = [[1,4],[4,5]]", expectedOutput: "[[1,5]]" },
    ],
    hints: [
      "Sort by start time.",
      "Sweep left→right, extending the last merged block when the current interval overlaps.",
    ],
  },
  {
    id: "non-overlapping-intervals",
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Sorting", "Intervals"],
    description: `Return the minimum number of intervals to remove so the remaining ones are pairwise non-overlapping.

### Examples
**Input:** intervals = [[1,2],[2,3],[3,4],[1,3]]  **Output:** 1
**Input:** intervals = [[1,2],[1,2],[1,2]]        **Output:** 2`,
    starterCode: {
      javascript: `function eraseOverlapIntervals(intervals) {\n  // Your code here\n}`,
      python: `def erase_overlap_intervals(intervals):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function eraseOverlapIntervals(intervals) {\n  intervals = [...intervals].sort((a, b) => a[1] - b[1]);\n  let end = -Infinity, kept = 0;\n  for (const [s, e] of intervals) {\n    if (s >= end) { kept++; end = e; }\n  }\n  return intervals.length - kept;\n}\n\nconsole.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])); // 1\nconsole.log(eraseOverlapIntervals([[1,2],[1,2],[1,2]]));       // 2`,
      python: `def erase_overlap_intervals(intervals):\n    intervals = sorted(intervals, key=lambda x: x[1])\n    end, kept = float('-inf'), 0\n    for s, e in intervals:\n        if s >= end:\n            kept += 1; end = e\n    return len(intervals) - kept\n\nprint(erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]))  # 1\nprint(erase_overlap_intervals([[1,2],[1,2],[1,2]]))        # 2`,
    },
    testCases: [
      {
        input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        expectedOutput: "1",
      },
      { input: "intervals = [[1,2],[1,2],[1,2]]", expectedOutput: "2" },
    ],
    hints: [
      "Sort by end time.",
      "Greedy: keep the interval that ends soonest among non-conflicting ones.",
      "Answer = total − kept.",
    ],
  },
  {
    id: "meeting-rooms-ii",
    slug: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Heap", "Sweep Line"],
    description: `Given meeting intervals \`intervals[i] = [start_i, end_i]\`, return the minimum number of meeting rooms required.

### Examples
**Input:** intervals = [[0,30],[5,10],[15,20]]  **Output:** 2
**Input:** intervals = [[7,10],[2,4]]           **Output:** 1`,
    starterCode: {
      javascript: `function minMeetingRooms(intervals) {\n  // Your code here\n}`,
      python: `def min_meeting_rooms(intervals):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function minMeetingRooms(intervals) {\n  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);\n  const ends   = intervals.map(i => i[1]).sort((a, b) => a - b);\n  let rooms = 0, maxRooms = 0, j = 0;\n  for (let i = 0; i < starts.length; i++) {\n    if (starts[i] < ends[j]) { rooms++; maxRooms = Math.max(maxRooms, rooms); }\n    else { j++; }\n  }\n  return maxRooms;\n}\n\nconsole.log(minMeetingRooms([[0,30],[5,10],[15,20]])); // 2\nconsole.log(minMeetingRooms([[7,10],[2,4]]));          // 1`,
      python: `def min_meeting_rooms(intervals):\n    starts = sorted(i[0] for i in intervals)\n    ends   = sorted(i[1] for i in intervals)\n    rooms = max_rooms = j = 0\n    for s in starts:\n        if s < ends[j]:\n            rooms += 1\n            if rooms > max_rooms: max_rooms = rooms\n        else:\n            j += 1\n    return max_rooms\n\nprint(min_meeting_rooms([[0,30],[5,10],[15,20]]))  # 2\nprint(min_meeting_rooms([[7,10],[2,4]]))           # 1`,
    },
    testCases: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", expectedOutput: "2" },
      { input: "intervals = [[7,10],[2,4]]", expectedOutput: "1" },
    ],
    hints: [
      "Two-pointer sweep over sorted starts and ends.",
      "Whenever a start precedes the earliest unfinished end, a new room opens.",
      "Equivalent min-heap solution: keep a heap of end times of rooms in use.",
    ],
  },
  {
    id: "task-scheduler-problem",
    slug: "task-scheduler-problem",
    title: "Task Scheduler",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Heap", "Counting"],
    description: `You are given a character array \`tasks\` and a positive integer \`n\`. Each task takes one unit of time. Between two **identical** tasks there must be at least \`n\` units of cooldown. Return the minimum total time (including idle slots) to finish all tasks.

### Examples
**Input:** tasks = ["A","A","A","B","B","B"], n = 2 **Output:** 8
**Input:** tasks = ["A","C","A","B","D","B"], n = 1 **Output:** 6`,
    starterCode: {
      javascript: `function leastInterval(tasks, n) {\n  // Your code here\n}`,
      python: `def least_interval(tasks, n):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function leastInterval(tasks, n) {\n  const freq = new Map();\n  for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);\n  let maxF = 0, tied = 0;\n  for (const f of freq.values()) {\n    if (f > maxF) { maxF = f; tied = 1; }\n    else if (f === maxF) tied++;\n  }\n  return Math.max(tasks.length, (maxF - 1) * (n + 1) + tied);\n}\n\nconsole.log(leastInterval(["A","A","A","B","B","B"], 2)); // 8\nconsole.log(leastInterval(["A","C","A","B","D","B"], 1)); // 6`,
      python: `from collections import Counter\n\ndef least_interval(tasks, n):\n    freq = Counter(tasks)\n    max_f = max(freq.values())\n    tied = sum(1 for v in freq.values() if v == max_f)\n    return max(len(tasks), (max_f - 1) * (n + 1) + tied)\n\nprint(least_interval(['A','A','A','B','B','B'], 2))  # 8\nprint(least_interval(['A','C','A','B','D','B'], 1))  # 6`,
    },
    testCases: [
      {
        input: 'tasks = ["A","A","A","B","B","B"], n = 2',
        expectedOutput: "8",
      },
      {
        input: 'tasks = ["A","C","A","B","D","B"], n = 1',
        expectedOutput: "6",
      },
    ],
    hints: [
      "Let maxF be the highest frequency and tied the number of labels that share it.",
      "Skeleton length = (maxF - 1) × (n + 1) + tied.",
      "Answer = max(len(tasks), skeleton) — distinct tasks can fill idles and make the skeleton redundant.",
    ],
  },
  {
    id: "assign-cookies",
    slug: "assign-cookies",
    title: "Assign Cookies",
    difficulty: "easy",
    category: "greedy",
    tags: ["Greedy", "Sorting", "Two Pointers"],
    description: `Given children's greed factors \`g[]\` and cookie sizes \`s[]\`, each child can get at most one cookie and a cookie of size \`s[j]\` satisfies child \`i\` iff \`s[j] >= g[i]\`. Return the maximum number of content children.

### Examples
**Input:** g = [1,2,3], s = [1,1]     **Output:** 1
**Input:** g = [1,2],   s = [1,2,3]   **Output:** 2`,
    starterCode: {
      javascript: `function findContentChildren(g, s) {\n  // Your code here\n}`,
      python: `def find_content_children(g, s):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function findContentChildren(g, s) {\n  g = [...g].sort((a, b) => a - b);\n  s = [...s].sort((a, b) => a - b);\n  let i = 0, j = 0;\n  while (i < g.length && j < s.length) {\n    if (s[j] >= g[i]) i++;\n    j++;\n  }\n  return i;\n}\n\nconsole.log(findContentChildren([1,2,3], [1,1]));   // 1\nconsole.log(findContentChildren([1,2],   [1,2,3])); // 2`,
      python: `def find_content_children(g, s):\n    g = sorted(g); s = sorted(s)\n    i = j = 0\n    while i < len(g) and j < len(s):\n        if s[j] >= g[i]: i += 1\n        j += 1\n    return i\n\nprint(find_content_children([1,2,3], [1,1]))    # 1\nprint(find_content_children([1,2],   [1,2,3]))  # 2`,
    },
    testCases: [
      { input: "g = [1,2,3], s = [1,1]", expectedOutput: "1" },
      { input: "g = [1,2], s = [1,2,3]", expectedOutput: "2" },
    ],
    hints: [
      "Sort both arrays ascending.",
      "For each cookie, try to satisfy the least greedy remaining child.",
    ],
  },
  {
    id: "partition-labels",
    slug: "partition-labels",
    title: "Partition Labels",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Hash Map", "Two Pointers"],
    description: `Given a string \`s\`, partition it into as many parts as possible so each letter appears in at most one part. Return the list of part sizes.

### Example
**Input:** s = "ababcbacadefegdehijhklij" **Output:** [9,7,8]`,
    starterCode: {
      javascript: `function partitionLabels(s) {\n  // Your code here\n}`,
      python: `def partition_labels(s):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function partitionLabels(s) {\n  const last = {};\n  for (let i = 0; i < s.length; i++) last[s[i]] = i;\n  const out = [];\n  let start = 0, end = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (last[s[i]] > end) end = last[s[i]];\n    if (i === end) { out.push(end - start + 1); start = i + 1; }\n  }\n  return out;\n}\n\nconsole.log(partitionLabels("ababcbacadefegdehijhklij")); // [9, 7, 8]`,
      python: `def partition_labels(s):\n    last = {ch: i for i, ch in enumerate(s)}\n    out = []\n    start = end = 0\n    for i, ch in enumerate(s):\n        if last[ch] > end: end = last[ch]\n        if i == end:\n            out.append(end - start + 1)\n            start = i + 1\n    return out\n\nprint(partition_labels("ababcbacadefegdehijhklij"))  # [9, 7, 8]`,
    },
    testCases: [
      {
        input: 's = "ababcbacadefegdehijhklij"',
        expectedOutput: "[9,7,8]",
      },
    ],
    hints: [
      "Precompute each character's last occurrence.",
      "Sweep: extend the current part's end to include every character's last occurrence.",
      "When i reaches end, close the part.",
    ],
  },
  {
    id: "min-arrows-balloons",
    slug: "min-arrows-balloons",
    title: "Minimum Arrows to Burst Balloons",
    difficulty: "medium",
    category: "greedy",
    tags: ["Greedy", "Sorting", "Intervals"],
    description: `Balloons span horizontal intervals \`points[i] = [x_start, x_end]\`. A vertical arrow shot at \`x\` bursts any balloon whose interval contains \`x\`. Return the minimum number of arrows to burst all balloons.

### Examples
**Input:** points = [[10,16],[2,8],[1,6],[7,12]]  **Output:** 2
**Input:** points = [[1,2],[3,4],[5,6],[7,8]]    **Output:** 4`,
    starterCode: {
      javascript: `function findMinArrowShots(points) {\n  // Your code here\n}`,
      python: `def find_min_arrow_shots(points):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function findMinArrowShots(points) {\n  if (!points.length) return 0;\n  points = [...points].sort((a, b) => a[1] - b[1]);\n  let arrows = 1, end = points[0][1];\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] > end) { arrows++; end = points[i][1]; }\n  }\n  return arrows;\n}\n\nconsole.log(findMinArrowShots([[10,16],[2,8],[1,6],[7,12]])); // 2\nconsole.log(findMinArrowShots([[1,2],[3,4],[5,6],[7,8]]));    // 4`,
      python: `def find_min_arrow_shots(points):\n    if not points: return 0\n    points = sorted(points, key=lambda x: x[1])\n    arrows = 1\n    end = points[0][1]\n    for s, e in points[1:]:\n        if s > end:\n            arrows += 1\n            end = e\n    return arrows\n\nprint(find_min_arrow_shots([[10,16],[2,8],[1,6],[7,12]]))  # 2\nprint(find_min_arrow_shots([[1,2],[3,4],[5,6],[7,8]]))     # 4`,
    },
    testCases: [
      {
        input: "points = [[10,16],[2,8],[1,6],[7,12]]",
        expectedOutput: "2",
      },
      { input: "points = [[1,2],[3,4],[5,6],[7,8]]", expectedOutput: "4" },
    ],
    hints: [
      "Sort by end coordinate.",
      "Shoot an arrow at the current group's end; all overlapping balloons burst.",
      "Whenever the next balloon starts beyond the last arrow, shoot a new one.",
    ],
  },
];
