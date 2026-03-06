import type { LearningPath } from '@/data/types'

export const learningPaths: LearningPath[] = [
  {
    id: 'intern',
    title: 'Software Intern',
    role: 'intern',
    icon: '🎓',
    description: 'Start your journey with computer science fundamentals, basic data structures, and your first programming language.',
    color: 'bg-emerald-500',
    estimatedHours: 80,
    sections: [
      {
        title: 'Programming Fundamentals',
        description: 'Learn the building blocks of programming',
        topics: [
          { id: 'js-variables', title: 'Variables & Data Types', ref: '/languages/javascript/variables' },
          { id: 'js-functions', title: 'Functions & Scope', ref: '/languages/javascript/functions' },
          { id: 'js-control-flow', title: 'Control Flow', ref: '/languages/javascript/control-flow' },
          { id: 'py-basics', title: 'Python Basics', ref: '/languages/python/basics' },
        ],
      },
      {
        title: 'Basic Data Structures',
        description: 'Understand how data is organized',
        topics: [
          { id: 'dsa-arrays', title: 'Arrays', ref: '/dsa/arrays/basics' },
          { id: 'dsa-strings', title: 'Strings', ref: '/dsa/strings/basics' },
          { id: 'dsa-linked-lists', title: 'Linked Lists', ref: '/dsa/linked-lists/singly-linked-list' },
          { id: 'dsa-stacks', title: 'Stacks & Queues', ref: '/dsa/stacks-queues/basics' },
        ],
      },
      {
        title: 'Basic Algorithms',
        description: 'Learn fundamental algorithmic patterns',
        topics: [
          { id: 'dsa-linear-search', title: 'Linear Search', ref: '/dsa/searching/linear-search' },
          { id: 'dsa-binary-search', title: 'Binary Search', ref: '/dsa/searching/binary-search' },
          { id: 'dsa-bubble-sort', title: 'Bubble Sort', ref: '/dsa/sorting/bubble-sort' },
          { id: 'dsa-selection-sort', title: 'Selection Sort', ref: '/dsa/sorting/selection-sort' },
        ],
      },
      {
        title: 'Practice Problems',
        description: 'Solve beginner-friendly problems',
        topics: [
          { id: 'prob-two-sum', title: 'Two Sum', ref: '/problems/two-sum' },
          { id: 'prob-palindrome', title: 'Valid Palindrome', ref: '/problems/valid-palindrome' },
          { id: 'prob-reverse-string', title: 'Reverse String', ref: '/problems/reverse-string' },
        ],
      },
    ],
  },
  {
    id: 'junior-developer',
    title: 'Junior Developer',
    role: 'junior-developer',
    icon: '💻',
    description: 'Build on fundamentals with intermediate DSA, OOP concepts, and deeper language knowledge.',
    color: 'bg-blue-500',
    estimatedHours: 120,
    sections: [
      {
        title: 'Object-Oriented Programming',
        topics: [
          { id: 'js-prototypes', title: 'Prototypes & Classes', ref: '/languages/javascript/prototypes' },
          { id: 'py-oop', title: 'Python OOP', ref: '/languages/python/oop' },
          { id: 'java-basics', title: 'Java Fundamentals', ref: '/languages/java/basics' },
        ],
      },
      {
        title: 'Intermediate Data Structures',
        topics: [
          { id: 'dsa-hash-map', title: 'Hash Maps', ref: '/dsa/hashing/hash-maps' },
          { id: 'dsa-trees-basics', title: 'Binary Trees', ref: '/dsa/trees/binary-tree' },
          { id: 'dsa-bst', title: 'Binary Search Trees', ref: '/dsa/trees/binary-search-tree' },
          { id: 'dsa-heaps', title: 'Heaps', ref: '/dsa/trees/heaps' },
        ],
      },
      {
        title: 'Intermediate Algorithms',
        topics: [
          { id: 'dsa-merge-sort', title: 'Merge Sort', ref: '/dsa/sorting/merge-sort' },
          { id: 'dsa-quick-sort', title: 'Quick Sort', ref: '/dsa/sorting/quick-sort' },
          { id: 'dsa-bfs', title: 'BFS', ref: '/dsa/graphs/bfs' },
          { id: 'dsa-dfs', title: 'DFS', ref: '/dsa/graphs/dfs' },
          { id: 'dsa-two-pointers', title: 'Two Pointers Pattern', ref: '/dsa/arrays/two-pointers' },
        ],
      },
    ],
  },
  {
    id: 'senior-developer',
    title: 'Senior Developer',
    role: 'senior-developer',
    icon: '🚀',
    description: 'Master advanced algorithms, system design concepts, and complex problem-solving strategies.',
    color: 'bg-purple-500',
    estimatedHours: 160,
    sections: [
      {
        title: 'Advanced Algorithms',
        topics: [
          { id: 'dsa-dp', title: 'Dynamic Programming', ref: '/dsa/dynamic-programming/basics' },
          { id: 'dsa-greedy', title: 'Greedy Algorithms', ref: '/dsa/greedy/basics' },
          { id: 'dsa-backtracking', title: 'Backtracking', ref: '/dsa/backtracking/basics' },
          { id: 'dsa-graph-advanced', title: 'Graph Algorithms (Dijkstra)', ref: '/dsa/graphs/dijkstra' },
        ],
      },
      {
        title: 'Advanced Language Features',
        topics: [
          { id: 'js-event-loop', title: 'JavaScript Event Loop', ref: '/languages/javascript/event-loop' },
          { id: 'js-async', title: 'Async/Await Patterns', ref: '/languages/javascript/async-await' },
          { id: 'py-decorators', title: 'Python Decorators', ref: '/languages/python/decorators' },
          { id: 'py-generators', title: 'Python Generators', ref: '/languages/python/generators' },
        ],
      },
      {
        title: 'Interview Preparation',
        topics: [
          { id: 'int-google', title: 'Google Interview Questions', ref: '/interviews/google' },
          { id: 'int-amazon', title: 'Amazon Interview Questions', ref: '/interviews/amazon' },
        ],
      },
    ],
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    role: 'frontend-developer',
    icon: '🎨',
    description: 'Master JavaScript/TypeScript, DOM manipulation, frameworks, and frontend-specific design patterns.',
    color: 'bg-amber-500',
    estimatedHours: 140,
    sections: [
      {
        title: 'JavaScript Deep Dive',
        topics: [
          { id: 'js-closures', title: 'Closures', ref: '/languages/javascript/closures' },
          { id: 'js-promises', title: 'Promises', ref: '/languages/javascript/promises' },
          { id: 'js-event-loop-fe', title: 'Event Loop', ref: '/languages/javascript/event-loop' },
          { id: 'ts-basics', title: 'TypeScript Fundamentals', ref: '/languages/typescript/basics' },
        ],
      },
      {
        title: 'Frontend DSA Patterns',
        topics: [
          { id: 'dsa-arrays-fe', title: 'Array Manipulation', ref: '/dsa/arrays/basics' },
          { id: 'dsa-strings-fe', title: 'String Processing', ref: '/dsa/strings/basics' },
          { id: 'dsa-trees-dom', title: 'Tree Traversal (DOM)', ref: '/dsa/trees/binary-tree' },
        ],
      },
    ],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    role: 'backend-developer',
    icon: '⚙️',
    description: 'Focus on server-side languages (Python, .NET, Java), databases, APIs, and backend architecture.',
    color: 'bg-teal-500',
    estimatedHours: 150,
    sections: [
      {
        title: 'Server-Side Languages',
        topics: [
          { id: 'py-data-structures', title: 'Python Data Structures', ref: '/languages/python/data-structures' },
          { id: 'cs-basics', title: 'C# Basics', ref: '/languages/csharp/basics' },
          { id: 'java-fundamentals', title: 'Java Fundamentals', ref: '/languages/java/basics' },
          { id: 'go-basics', title: 'Go Basics', ref: '/languages/go/basics' },
        ],
      },
      {
        title: 'Backend-Focused DSA',
        topics: [
          { id: 'dsa-hashing-be', title: 'Hash Tables', ref: '/dsa/hashing/hash-maps' },
          { id: 'dsa-graphs-be', title: 'Graph Algorithms', ref: '/dsa/graphs/bfs' },
          { id: 'dsa-dp-be', title: 'Dynamic Programming', ref: '/dsa/dynamic-programming/basics' },
        ],
      },
    ],
  },
  {
    id: 'fullstack-developer',
    title: 'Fullstack Developer',
    role: 'fullstack-developer',
    icon: '🔗',
    description: 'Combine frontend and backend skills with full-stack architecture knowledge.',
    color: 'bg-indigo-500',
    estimatedHours: 200,
    sections: [
      {
        title: 'Frontend Foundation',
        topics: [
          { id: 'js-closures-fs', title: 'JavaScript Closures', ref: '/languages/javascript/closures' },
          { id: 'js-promises-fs', title: 'Promises & Async', ref: '/languages/javascript/promises' },
          { id: 'ts-basics-fs', title: 'TypeScript', ref: '/languages/typescript/basics' },
        ],
      },
      {
        title: 'Backend Foundation',
        topics: [
          { id: 'py-basics-fs', title: 'Python', ref: '/languages/python/basics' },
          { id: 'cs-basics-fs', title: 'C# / .NET', ref: '/languages/csharp/basics' },
        ],
      },
      {
        title: 'Full-Stack DSA',
        topics: [
          { id: 'dsa-arrays-fs', title: 'Arrays & Strings', ref: '/dsa/arrays/basics' },
          { id: 'dsa-trees-fs', title: 'Trees', ref: '/dsa/trees/binary-tree' },
          { id: 'dsa-graphs-fs', title: 'Graphs', ref: '/dsa/graphs/bfs' },
        ],
      },
    ],
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    role: 'devops-engineer',
    icon: '🔧',
    description: 'Learn scripting, automation, CI/CD pipelines, and DevOps culture alongside essential coding skills.',
    color: 'bg-orange-500',
    estimatedHours: 100,
    sections: [
      {
        title: 'Scripting Essentials',
        topics: [
          { id: 'py-basics-devops', title: 'Python for Scripting', ref: '/languages/python/basics' },
          { id: 'go-basics-devops', title: 'Go for Infrastructure', ref: '/languages/go/basics' },
        ],
      },
      {
        title: 'DevOps Methodologies',
        topics: [
          { id: 'meth-agile-devops', title: 'Agile Principles', ref: '/methodology/agile' },
          { id: 'meth-kanban-devops', title: 'Kanban', ref: '/methodology/kanban' },
          { id: 'meth-devops', title: 'DevOps Culture', ref: '/methodology/devops' },
        ],
      },
    ],
  },
  {
    id: 'architect',
    title: 'Software Architect',
    role: 'architect',
    icon: '🏗️',
    description: 'System design, design patterns, architectural principles, and advanced problem-solving at scale.',
    color: 'bg-rose-500',
    estimatedHours: 180,
    sections: [
      {
        title: 'Algorithmic Mastery',
        topics: [
          { id: 'dsa-dp-arch', title: 'Dynamic Programming', ref: '/dsa/dynamic-programming/basics' },
          { id: 'dsa-graphs-arch', title: 'Advanced Graph Algorithms', ref: '/dsa/graphs/dijkstra' },
          { id: 'dsa-greedy-arch', title: 'Greedy Strategies', ref: '/dsa/greedy/basics' },
        ],
      },
      {
        title: 'Multi-Language Proficiency',
        topics: [
          { id: 'js-advanced-arch', title: 'JavaScript Advanced', ref: '/languages/javascript/event-loop' },
          { id: 'py-advanced-arch', title: 'Python Advanced', ref: '/languages/python/decorators' },
          { id: 'java-arch', title: 'Java', ref: '/languages/java/basics' },
          { id: 'go-arch', title: 'Go', ref: '/languages/go/basics' },
        ],
      },
      {
        title: 'Methodologies & Processes',
        topics: [
          { id: 'meth-agile-arch', title: 'Agile at Scale', ref: '/methodology/agile' },
          { id: 'meth-scrum-arch', title: 'Scrum Framework', ref: '/methodology/scrum' },
        ],
      },
    ],
  },
  {
    id: 'product-owner',
    title: 'Product Owner',
    role: 'product-owner',
    icon: '📋',
    description: 'Understand Agile/Scrum methodologies, basic technical concepts, and communication with dev teams.',
    color: 'bg-cyan-500',
    estimatedHours: 60,
    sections: [
      {
        title: 'Methodology Mastery',
        topics: [
          { id: 'meth-agile-po', title: 'Agile Manifesto & Principles', ref: '/methodology/agile' },
          { id: 'meth-scrum-po', title: 'Scrum Framework', ref: '/methodology/scrum' },
          { id: 'meth-kanban-po', title: 'Kanban Method', ref: '/methodology/kanban' },
        ],
      },
      {
        title: 'Technical Literacy',
        topics: [
          { id: 'js-basics-po', title: 'Programming Concepts', ref: '/languages/javascript/variables' },
          { id: 'dsa-basics-po', title: 'Data Structures Overview', ref: '/dsa/arrays/basics' },
        ],
      },
    ],
  },
  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    role: 'qa-engineer',
    icon: '🧪',
    description: 'Learn testing fundamentals, automation scripting, and enough DSA to write efficient test suites.',
    color: 'bg-lime-500',
    estimatedHours: 90,
    sections: [
      {
        title: 'Scripting for Testing',
        topics: [
          { id: 'py-basics-qa', title: 'Python Basics', ref: '/languages/python/basics' },
          { id: 'js-basics-qa', title: 'JavaScript Basics', ref: '/languages/javascript/variables' },
        ],
      },
      {
        title: 'DSA for QA',
        topics: [
          { id: 'dsa-arrays-qa', title: 'Arrays & Strings', ref: '/dsa/arrays/basics' },
          { id: 'dsa-searching-qa', title: 'Searching Algorithms', ref: '/dsa/searching/binary-search' },
          { id: 'dsa-sorting-qa', title: 'Sorting', ref: '/dsa/sorting/bubble-sort' },
        ],
      },
    ],
  },
]

export function getPathByRole(role: string): LearningPath | undefined {
  return learningPaths.find((p) => p.role === role)
}
