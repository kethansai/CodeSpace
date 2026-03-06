const fs = require("fs");
let content = fs.readFileSync("src/data/dsa/index.ts", "utf8");

const configs = {
  "binary-search-on-answer": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "doubly-linked-list": [1, 2, 3, 4, 5],
  "fast-slow-pointers": [1, 2, 3, 4, 5, 6, 7, 8],
  "monotonic-stack": [4, 2, 7, 5, 3, 8, 1],
  "queue-implementation": [1, 2, 3, 4, 5],
  "priority-queue": [3, 1, 4, 1, 5, 9, 2, 6],
  "binary-search-tree": [5, 3, 7, 1, 4, 6, 8],
  trie: [1, 2, 3, 4, 5],
  "segment-tree": [1, 3, 5, 7, 9, 11],
  dijkstra: [0, 4, 8, 5, 3, 7, 6],
  "topological-sort": [0, 1, 2, 3, 4, 5],
  "union-find": [0, 1, 2, 3, 4, 5, 6],
  "minimum-spanning-tree": [2, 3, 1, 4, 5, 6],
  knapsack: [2, 3, 4, 5],
  "longest-common-subsequence": [1, 3, 5, 2, 4],
  "coin-change": [1, 5, 10, 25],
  "longest-increasing-subsequence": [10, 9, 2, 5, 3, 7, 101, 18],
  "hash-set": [100, 4, 200, 1, 3, 2],
  "activity-selection": [1, 3, 2, 5, 4, 7],
  "huffman-coding": [5, 9, 12, 13, 16, 45],
  "permutations-combinations": [1, 2, 3],
  "n-queens": [1, 3, 0, 2],
  "sudoku-solver": [5, 3, 4, 6, 7, 8, 9, 1, 2],
  "bit-basics": [1, 2, 3, 4, 5],
};

// Detect line ending
const lineEnding = content.includes("\r\n") ? "\r\n" : "\n";
console.log("Line ending:", lineEnding === "\r\n" ? "CRLF" : "LF");

let count = 0;
for (const [slug, input] of Object.entries(configs)) {
  const slugStr = `slug: "${slug}"`;
  const slugIdx = content.indexOf(slugStr);
  if (slugIdx === -1) {
    console.log("NOT FOUND:", slug);
    continue;
  }

  const after = content.substring(slugIdx);

  // Pattern: "        ]," (8 spaces + ],) followed by line ending and "      }," (6 spaces + },)
  const closePattern = `        ],${lineEnding}      },`;
  const closeIdx = after.indexOf(closePattern);
  if (closeIdx === -1) {
    console.log("CLOSE NOT FOUND:", slug);
    continue;
  }

  // Check if visualizationConfig already exists between slug and this close
  const section = after.substring(0, closeIdx);
  if (section.includes("visualizationConfig")) {
    console.log("ALREADY HAS:", slug);
    continue;
  }

  // Insert after "        ]," and before the line ending + "      },"
  const insertPosition = slugIdx + closeIdx + "        ],".length;
  const vizLine = `${lineEnding}        visualizationConfig: { type: "array", defaultInput: [${input.join(", ")}] },`;
  content =
    content.substring(0, insertPosition) +
    vizLine +
    content.substring(insertPosition);
  count++;
  console.log("Added:", slug);
}

fs.writeFileSync("src/data/dsa/index.ts", content);
console.log(`\nDone! Added visualizationConfig to ${count} topics.`);
