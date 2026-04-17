import type { Problem } from "@/data/types";
import { additionalProblems } from "./additional";
import { moreProblems } from "./more";

export const problems: Problem[] = [
  {
    id: "two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    category: "arrays",
    tags: ["Array", "Hash Map"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

### Examples

**Input:** nums = [2,7,11,15], target = 9
**Output:** [0,1]
**Explanation:** nums[0] + nums[1] = 2 + 7 = 9

**Input:** nums = [3,2,4], target = 6
**Output:** [1,2]

### Constraints
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- Only one valid answer exists`,
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Your code here\n}`,
      python: `def two_sum(nums, target):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}`,
    },
    solution: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\n// Test\nconsole.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
      python: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# Test\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (map.count(complement)) {\n            return {map[complement], i};\n        }\n        map[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    auto result = twoSum(nums, 9);\n    cout << result[0] << ", " << result[1] << endl;\n}`,
      java: `import java.util.*;\n\nclass Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[]{map.get(complement), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println(result[0] + ", " + result[1]);\n    }\n}`,
    },
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
      { input: "nums = [3,3], target = 6", expectedOutput: "[0,1]" },
    ],
    hints: [
      "Think about what value you need to find for each element.",
      "Can you use a hash map to store elements you've seen?",
      "For each element, check if target - element exists in the map.",
    ],
  },
  {
    id: "reverse-string",
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "easy",
    category: "arrays",
    tags: ["String", "Two Pointers"],
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with O(1) extra memory.

### Examples

**Input:** s = ["h","e","l","l","o"]
**Output:** ["o","l","l","e","h"]

**Input:** s = ["H","a","n","n","a","h"]
**Output:** ["h","a","n","n","a","H"]`,
    starterCode: {
      javascript: `function reverseString(s) {\n  // Modify s in-place\n}`,
      python: `def reverse_string(s):\n    # Modify s in-place\n    pass`,
    },
    solution: {
      javascript: `function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  return s;\n}\n\nconsole.log(reverseString(["h","e","l","l","o"]));\n// ["o","l","l","e","h"]`,
      python: `def reverse_string(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1\n    return s\n\nprint(reverse_string(["h","e","l","l","o"]))\n# ["o","l","l","e","h"]`,
    },
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
      },
    ],
    hints: [
      "Use two pointers — one at the start, one at the end.",
      "Swap elements and move pointers inward.",
    ],
  },
  {
    id: "valid-parentheses",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    category: "stacks-queues",
    tags: ["Stack", "String"],
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket.

### Examples
**Input:** s = "()"  **Output:** true
**Input:** s = "()[]{}"  **Output:** true
**Input:** s = "(]"  **Output:** false`,
    starterCode: {
      javascript: `function isValid(s) {\n  // Your code here\n}`,
      python: `def is_valid(s):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', ']': '[', '}': '{' };\n\n  for (const char of s) {\n    if ('({['.includes(char)) {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n\n  return stack.length === 0;\n}\n\nconsole.log(isValid("({[]})")); // true\nconsole.log(isValid("(]")); // false`,
      python: `def is_valid(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n\n    for char in s:\n        if char in '({[':\n            stack.append(char)\n        else:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n\n    return len(stack) == 0\n\nprint(is_valid("({[]})"))  # True\nprint(is_valid("(]"))      # False`,
    },
    testCases: [
      { input: '"()"', expectedOutput: "true" },
      { input: '"()[]{}"', expectedOutput: "true" },
      { input: '"(]"', expectedOutput: "false" },
    ],
    hints: [
      "Use a stack to track opening brackets.",
      "When you see a closing bracket, check if it matches the top of the stack.",
    ],
  },
  {
    id: "merge-sorted-arrays",
    slug: "merge-sorted-arrays",
    title: "Merge Two Sorted Arrays",
    difficulty: "easy",
    category: "arrays",
    tags: ["Array", "Two Pointers", "Sorting"],
    description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order. Merge them into a single sorted array.

### Examples
**Input:** nums1 = [1,2,3], nums2 = [2,5,6]
**Output:** [1,2,2,3,5,6]

**Input:** nums1 = [1], nums2 = []
**Output:** [1]`,
    starterCode: {
      javascript: `function mergeSortedArrays(nums1, nums2) {\n  // Your code here\n}`,
      python: `def merge_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function mergeSortedArrays(nums1, nums2) {\n  const result = [];\n  let i = 0, j = 0;\n\n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] <= nums2[j]) {\n      result.push(nums1[i++]);\n    } else {\n      result.push(nums2[j++]);\n    }\n  }\n\n  return result.concat(nums1.slice(i), nums2.slice(j));\n}\n\nconsole.log(mergeSortedArrays([1,2,3], [2,5,6]));\n// [1,2,2,3,5,6]`,
      python: `def merge_sorted_arrays(nums1, nums2):\n    result = []\n    i = j = 0\n\n    while i < len(nums1) and j < len(nums2):\n        if nums1[i] <= nums2[j]:\n            result.append(nums1[i])\n            i += 1\n        else:\n            result.append(nums2[j])\n            j += 1\n\n    result.extend(nums1[i:])\n    result.extend(nums2[j:])\n    return result\n\nprint(merge_sorted_arrays([1,2,3], [2,5,6]))\n# [1,2,2,3,5,6]`,
    },
    testCases: [
      {
        input: "nums1 = [1,2,3], nums2 = [2,5,6]",
        expectedOutput: "[1,2,2,3,5,6]",
      },
      { input: "nums1 = [1], nums2 = []", expectedOutput: "[1]" },
    ],
    hints: [
      "Use two pointers, one for each array.",
      "Compare elements at both pointers and pick the smaller one.",
    ],
  },
  {
    id: "maximum-subarray",
    slug: "maximum-subarray",
    title: "Maximum Subarray (Kadane's)",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

### Examples
**Input:** nums = [-2,1,-3,4,-1,2,1,-5,4]
**Output:** 6
**Explanation:** The subarray [4,-1,2,1] has the largest sum = 6.

**Input:** nums = [1]
**Output:** 1

**Input:** nums = [5,4,-1,7,8]
**Output:** 23`,
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Your code here\n}`,
      python: `def max_sub_array(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n\n  for (let i = 1; i < nums.length; i++) {\n    // Either extend the current subarray or start fresh\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n\n  return maxSum;\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6`,
      python: `def max_sub_array(nums):\n    max_sum = current_sum = nums[0]\n\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n\n    return max_sum\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))  # 6`,
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { input: "[1]", expectedOutput: "1" },
      { input: "[5,4,-1,7,8]", expectedOutput: "23" },
    ],
    hints: [
      "This is Kadane's Algorithm.",
      "At each position, decide: start a new subarray or extend the current one.",
      "Track the maximum sum seen so far.",
    ],
  },
  {
    id: "climbing-stairs",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "easy",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "Math"],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

### Examples
**Input:** n = 2  **Output:** 2
**Explanation:** 1+1 or 2

**Input:** n = 3  **Output:** 3
**Explanation:** 1+1+1, 1+2, or 2+1`,
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Your code here\n}`,
      python: `def climb_stairs(n):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}\n\nconsole.log(climbStairs(5)); // 8`,
      python: `def climb_stairs(n):\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    for _ in range(3, n + 1):\n        prev2, prev1 = prev1, prev1 + prev2\n    return prev1\n\nprint(climb_stairs(5))  # 8`,
    },
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" },
      { input: "5", expectedOutput: "8" },
    ],
    hints: [
      "This is exactly the Fibonacci sequence!",
      "dp[i] = dp[i-1] + dp[i-2]",
    ],
  },
  {
    id: "best-time-to-buy-sell-stock",
    slug: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy & Sell Stock",
    difficulty: "easy",
    category: "arrays",
    tags: ["Array", "Greedy"],
    description: `Given an array \`prices\` where \`prices[i]\` is the price of a stock on the iᵗʰ day, find the maximum profit from one buy and one sell.

### Examples
**Input:** prices = [7,1,5,3,6,4]
**Output:** 5
**Explanation:** Buy on day 2 (price = 1), sell on day 5 (price = 6), profit = 5.

**Input:** prices = [7,6,4,3,1]
**Output:** 0 (no profitable transaction)`,
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // Your code here\n}`,
      python: `def max_profit(prices):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n\n  for (const price of prices) {\n    minPrice = Math.min(minPrice, price);\n    maxProfit = Math.max(maxProfit, price - minPrice);\n  }\n\n  return maxProfit;\n}\n\nconsole.log(maxProfit([7,1,5,3,6,4])); // 5`,
      python: `def max_profit(prices):\n    min_price = float('inf')\n    max_profit = 0\n\n    for price in prices:\n        min_price = min(min_price, price)\n        max_profit = max(max_profit, price - min_price)\n\n    return max_profit\n\nprint(max_profit([7,1,5,3,6,4]))  # 5`,
    },
    testCases: [
      { input: "[7,1,5,3,6,4]", expectedOutput: "5" },
      { input: "[7,6,4,3,1]", expectedOutput: "0" },
    ],
    hints: [
      "Track the minimum price seen so far.",
      "At each day, calculate profit if you sell today.",
    ],
  },
  {
    id: "contains-duplicate",
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "easy",
    category: "hashing",
    tags: ["Array", "Hash Set"],
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice, and \`false\` if every element is distinct.

### Examples
**Input:** nums = [1,2,3,1]  **Output:** true
**Input:** nums = [1,2,3,4]  **Output:** false`,
    starterCode: {
      javascript: `function containsDuplicate(nums) {\n  // Your code here\n}`,
      python: `def contains_duplicate(nums):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}\n\nconsole.log(containsDuplicate([1,2,3,1])); // true\nconsole.log(containsDuplicate([1,2,3,4])); // false`,
      python: `def contains_duplicate(nums):\n    return len(set(nums)) != len(nums)\n\nprint(contains_duplicate([1,2,3,1]))  # True\nprint(contains_duplicate([1,2,3,4]))  # False`,
    },
    testCases: [
      { input: "[1,2,3,1]", expectedOutput: "true" },
      { input: "[1,2,3,4]", expectedOutput: "false" },
    ],
    hints: [
      "A Set only stores unique values.",
      "Compare Set size with array length.",
    ],
  },
  {
    id: "linked-list-cycle",
    slug: "linked-list-cycle",
    title: "Linked List Cycle Detection",
    difficulty: "easy",
    category: "linked-lists",
    tags: ["Linked List", "Two Pointers", "Floyd's Algorithm"],
    description: `Given the head of a linked list, determine if it has a cycle.

A cycle exists if some node can be reached again by continuously following the \`next\` pointer.

**Follow up:** Can you solve it using O(1) memory?

### Examples
**Input:** head = [3,2,0,-4], pos = 1
**Output:** true (tail connects to node at index 1)

**Input:** head = [1], pos = -1
**Output:** false (no cycle)`,
    starterCode: {
      javascript: `function hasCycle(head) {\n  // Your code here\n}`,
      python: `def has_cycle(head):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `// Floyd's Cycle Detection (Tortoise & Hare)\nfunction hasCycle(head) {\n  let slow = head;\n  let fast = head;\n\n  while (fast && fast.next) {\n    slow = slow.next;       // Move 1 step\n    fast = fast.next.next;  // Move 2 steps\n\n    if (slow === fast) return true; // They met — cycle!\n  }\n\n  return false; // Fast reached end — no cycle\n}\n\n// Test with cycle\nclass ListNode {\n  constructor(val) { this.val = val; this.next = null; }\n}\nconst n1 = new ListNode(3);\nconst n2 = new ListNode(2);\nconst n3 = new ListNode(0);\nconst n4 = new ListNode(-4);\nn1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2;\nconsole.log(hasCycle(n1)); // true`,
      python: `def has_cycle(head):\n    slow = fast = head\n\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n\n        if slow is fast:\n            return True\n\n    return False`,
    },
    testCases: [
      { input: "head = [3,2,0,-4], cycle at pos 1", expectedOutput: "true" },
      { input: "head = [1], no cycle", expectedOutput: "false" },
    ],
    hints: [
      "Use Floyd's Tortoise & Hare algorithm.",
      "If there's a cycle, the fast pointer will eventually catch the slow pointer.",
    ],
  },
  {
    id: "binary-search-problem",
    slug: "binary-search-problem",
    title: "Binary Search",
    difficulty: "easy",
    category: "searching",
    tags: ["Binary Search", "Array"],
    description: `Given a sorted array of integers \`nums\` and a target value, return the index if found. If not, return -1.

You must write an algorithm with **O(log n)** runtime complexity.

### Examples
**Input:** nums = [-1,0,3,5,9,12], target = 9
**Output:** 4

**Input:** nums = [-1,0,3,5,9,12], target = 2
**Output:** -1`,
    starterCode: {
      javascript: `function search(nums, target) {\n  // Your code here\n}`,
      python: `def search(nums, target):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n\n  return -1;\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9)); // 4`,
      python: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return -1\n\nprint(search([-1,0,3,5,9,12], 9))  # 4`,
    },
    testCases: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", expectedOutput: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", expectedOutput: "-1" },
    ],
    hints: [
      "Use left and right pointers.",
      "Compare target with the middle element.",
    ],
  },
  {
    id: "max-depth-binary-tree",
    slug: "max-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    category: "trees",
    tags: ["Tree", "DFS", "Recursion"],
    description: `Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root to a leaf.

### Examples
**Input:** root = [3,9,20,null,null,15,7]
**Output:** 3`,
    starterCode: {
      javascript: `function maxDepth(root) {\n  // Your code here\n}`,
      python: `def max_depth(root):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n\n// Test\nclass TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}\n\nconst root = new TreeNode(3,\n  new TreeNode(9),\n  new TreeNode(20, new TreeNode(15), new TreeNode(7))\n);\nconsole.log(maxDepth(root)); // 3`,
      python: `def max_depth(root):\n    if not root:\n        return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nroot = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint(max_depth(root))  # 3`,
    },
    testCases: [
      { input: "root = [3,9,20,null,null,15,7]", expectedOutput: "3" },
      { input: "root = [1,null,2]", expectedOutput: "2" },
    ],
    hints: ["Use recursion.", "Depth = 1 + max(left depth, right depth)."],
  },
  {
    id: "number-of-islands",
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "medium",
    category: "graphs",
    tags: ["Graph", "BFS", "DFS", "Matrix"],
    description: `Given an m×n 2D grid of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

### Examples
**Input:**
\`\`\`
[["1","1","0","0","0"],
 ["1","1","0","0","0"],
 ["0","0","1","0","0"],
 ["0","0","0","1","1"]]
\`\`\`
**Output:** 3`,
    starterCode: {
      javascript: `function numIslands(grid) {\n  // Your code here\n}`,
      python: `def num_islands(grid):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function numIslands(grid) {\n  let count = 0;\n  const rows = grid.length;\n  const cols = grid[0].length;\n\n  function dfs(r, c) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;\n    grid[r][c] = '0'; // Mark visited\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n\n  return count;\n}\n\nconsole.log(numIslands([\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n])); // 3`,
      python: `def num_islands(grid):\n    if not grid:\n        return 0\n\n    count = 0\n    rows, cols = len(grid), len(grid[0])\n\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':\n            return\n        grid[r][c] = '0'  # Mark visited\n        dfs(r + 1, c)\n        dfs(r - 1, c)\n        dfs(r, c + 1)\n        dfs(r, c - 1)\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                count += 1\n                dfs(r, c)\n\n    return count`,
    },
    testCases: [
      { input: "grid with 3 islands", expectedOutput: "3" },
      { input: "grid with 1 island", expectedOutput: "1" },
    ],
    hints: [
      "Use DFS/BFS to explore each island.",
      "When you find a '1', increment count and flood-fill to mark the entire island.",
    ],
  },
  {
    id: "longest-common-subsequence",
    slug: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming", "String"],
    description: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence.

A subsequence is a sequence derived by deleting some or no elements without changing the order of the remaining elements.

### Examples
**Input:** text1 = "abcde", text2 = "ace"
**Output:** 3 (LCS is "ace")

**Input:** text1 = "abc", text2 = "def"
**Output:** 0`,
    starterCode: {
      javascript: `function longestCommonSubsequence(text1, text2) {\n  // Your code here\n}`,
      python: `def longest_common_subsequence(text1, text2):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n\n  return dp[m][n];\n}\n\nconsole.log(longestCommonSubsequence("abcde", "ace")); // 3`,
      python: `def longest_common_subsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n\n    return dp[m][n]\n\nprint(longest_common_subsequence("abcde", "ace"))  # 3`,
    },
    testCases: [
      { input: 'text1 = "abcde", text2 = "ace"', expectedOutput: "3" },
      { input: 'text1 = "abc", text2 = "def"', expectedOutput: "0" },
    ],
    hints: [
      "Use a 2D DP table.",
      "If characters match, extend the previous diagonal. If not, take max of left or above.",
    ],
  },
  {
    id: "coin-change",
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["Dynamic Programming"],
    description: `Given an array of coin denominations and a total amount, return the fewest number of coins needed. Return -1 if it cannot be made.

### Examples
**Input:** coins = [1,5,10,25], amount = 30
**Output:** 2 (25 + 5)

**Input:** coins = [2], amount = 3
**Output:** -1`,
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Your code here\n}`,
      python: `def coin_change(coins, amount):\n    # Your code here\n    pass`,
    },
    solution: {
      javascript: `function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (coin <= i) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log(coinChange([1,5,10,25], 30)); // 2`,
      python: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n\n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coin_change([1,5,10,25], 30))  # 2`,
    },
    testCases: [
      { input: "coins = [1,5,10,25], amount = 30", expectedOutput: "2" },
      { input: "coins = [2], amount = 3", expectedOutput: "-1" },
    ],
    hints: ["Use bottom-up DP.", "dp[i] = minimum coins to make amount i."],
  },
  ...additionalProblems,
  ...moreProblems,
];

export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export function getProblemsByCategory(category: string): Problem[] {
  return problems.filter((p) => p.category === category);
}

export function getProblemsByDifficulty(difficulty: string): Problem[] {
  return problems.filter((p) => p.difficulty === difficulty);
}
