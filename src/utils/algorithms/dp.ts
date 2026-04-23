import type { AnimationStep } from "@/data/types";

// ─────────── Types matching DPVisualizer ───────────

type HLKind = "current" | "dependency" | "result" | "done";
interface Highlight {
  r: number;
  c: number;
  kind: HLKind;
}
interface DPData {
  title?: string;
  rowLabels?: string[];
  colLabels?: string[];
  table: (number | string | null)[][];
  highlights?: Highlight[];
  axisRowLabel?: string;
  axisColLabel?: string;
}

function snap(dp: DPData): DPData {
  return {
    ...dp,
    table: dp.table.map((r) => [...r]),
    highlights: dp.highlights ? dp.highlights.map((h) => ({ ...h })) : [],
  };
}

// ─────────── Fibonacci (1D tabulation) ───────────

export function generateFibDPSteps(n = 8): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const dp = new Array(n + 1).fill(null) as (number | null)[];
  const cols = Array.from({ length: n + 1 }, (_, i) => String(i));

  dp[0] = 0;
  dp[1] = n >= 1 ? 1 : 0;
  steps.push({
    description: "Base cases: fib(0) = 0, fib(1) = 1.",
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Fibonacci up to n = ${n}`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "i",
        highlights: [
          { r: 0, c: 0, kind: "done" },
          { r: 0, c: 1, kind: "done" },
        ],
      }),
    },
    variables: {},
  });

  for (let i = 2; i <= n; i++) {
    steps.push({
      description: `Compute dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}.`,
      array: [],
      auxiliaryData: {
        dp: snap({
          title: `Fibonacci up to n = ${n}`,
          colLabels: cols,
          table: [dp],
          axisColLabel: "i",
          highlights: [
            { r: 0, c: i - 2, kind: "dependency" },
            { r: 0, c: i - 1, kind: "dependency" },
            { r: 0, c: i, kind: "current" },
          ],
        }),
      },
      variables: { i, "dp[i-1]": dp[i - 1]!, "dp[i-2]": dp[i - 2]! },
    });
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
    steps.push({
      description: `dp[${i}] = ${dp[i]}.`,
      array: [],
      auxiliaryData: {
        dp: snap({
          title: `Fibonacci up to n = ${n}`,
          colLabels: cols,
          table: [dp],
          axisColLabel: "i",
          highlights: [{ r: 0, c: i, kind: "done" }],
        }),
      },
      variables: { i, [`dp[${i}]`]: dp[i]! },
    });
  }

  steps.push({
    description: `fib(${n}) = ${dp[n]}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Fibonacci up to n = ${n}`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "i",
        highlights: [{ r: 0, c: n, kind: "result" }],
      }),
      resultList: `fib(${n}) = ${dp[n]}`,
    },
  });
  return steps;
}

// ─────────── Climbing Stairs (1D) ───────────

export function generateClimbStairsSteps(n = 6): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const dp = new Array(n + 1).fill(null) as (number | null)[];
  const cols = Array.from({ length: n + 1 }, (_, i) => String(i));

  dp[0] = 1;
  dp[1] = 1;
  steps.push({
    description: "Base: 1 way to stay at step 0, 1 way to reach step 1.",
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Climbing Stairs (n = ${n})`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "step",
        highlights: [
          { r: 0, c: 0, kind: "done" },
          { r: 0, c: 1, kind: "done" },
        ],
      }),
    },
  });

  for (let i = 2; i <= n; i++) {
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
    steps.push({
      description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]} (take 1 step OR 2 steps).`,
      array: [],
      auxiliaryData: {
        dp: snap({
          title: `Climbing Stairs (n = ${n})`,
          colLabels: cols,
          table: [dp],
          axisColLabel: "step",
          highlights: [
            { r: 0, c: i - 2, kind: "dependency" },
            { r: 0, c: i - 1, kind: "dependency" },
            { r: 0, c: i, kind: "current" },
          ],
        }),
      },
      variables: { i, ways: dp[i]! },
    });
  }

  steps.push({
    description: `Total distinct ways = ${dp[n]}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Climbing Stairs (n = ${n})`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "step",
        highlights: [{ r: 0, c: n, kind: "result" }],
      }),
      resultList: `ways(${n}) = ${dp[n]}`,
    },
  });
  return steps;
}

// ─────────── House Robber (1D) ───────────

export function generateHouseRobberSteps(
  houses: number[] = [2, 7, 9, 3, 1, 8, 5],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = houses.length;
  const dp = new Array(n).fill(null) as (number | null)[];
  const cols = houses.map(String);

  dp[0] = houses[0];
  steps.push({
    description: `dp[0] = ${houses[0]} (rob only house 0).`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `House Robber — houses = [${houses.join(", ")}]`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "house value",
        highlights: [{ r: 0, c: 0, kind: "done" }],
      }),
    },
  });
  if (n >= 2) {
    dp[1] = Math.max(houses[0], houses[1]);
    steps.push({
      description: `dp[1] = max(${houses[0]}, ${houses[1]}) = ${dp[1]}.`,
      array: [],
      auxiliaryData: {
        dp: snap({
          title: `House Robber — houses = [${houses.join(", ")}]`,
          colLabels: cols,
          table: [dp],
          axisColLabel: "house value",
          highlights: [
            { r: 0, c: 0, kind: "dependency" },
            { r: 0, c: 1, kind: "current" },
          ],
        }),
      },
    });
  }
  for (let i = 2; i < n; i++) {
    const rob = (dp[i - 2] as number) + houses[i];
    const skip = dp[i - 1] as number;
    dp[i] = Math.max(rob, skip);
    steps.push({
      description: `dp[${i}] = max(dp[${i - 1}]=${skip}, dp[${i - 2}]+${houses[i]}=${rob}) = ${dp[i]}.`,
      array: [],
      auxiliaryData: {
        dp: snap({
          title: `House Robber — houses = [${houses.join(", ")}]`,
          colLabels: cols,
          table: [dp],
          axisColLabel: "house value",
          highlights: [
            { r: 0, c: i - 2, kind: "dependency" },
            { r: 0, c: i - 1, kind: "dependency" },
            { r: 0, c: i, kind: "current" },
          ],
        }),
      },
      variables: { i, rob, skip, chosen: dp[i]! },
    });
  }

  steps.push({
    description: `Maximum loot = ${dp[n - 1]}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `House Robber — houses = [${houses.join(", ")}]`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "house value",
        highlights: [{ r: 0, c: n - 1, kind: "result" }],
      }),
      resultList: `max loot = ${dp[n - 1]}`,
    },
  });
  return steps;
}

// ─────────── Coin Change (1D, min coins) ───────────

export function generateCoinChangeDPSteps(
  coins: number[] = [1, 3, 4],
  amount = 6,
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const dp = new Array(amount + 1).fill(Infinity) as number[];
  dp[0] = 0;
  const cols = Array.from({ length: amount + 1 }, (_, i) => String(i));

  const tableView = (): (number | string)[][] => [
    dp.map((v) => (v === Infinity ? "∞" : v)),
  ];

  steps.push({
    description: `Base: dp[0] = 0. All others start at ∞.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Coin Change — coins = [${coins.join(", ")}], target = ${amount}`,
        colLabels: cols,
        table: tableView(),
        axisColLabel: "amount",
        highlights: [{ r: 0, c: 0, kind: "done" }],
      }),
    },
  });

  for (const c of coins) {
    steps.push({
      description: `Process coin = ${c}. For each amount i ≥ ${c}, try dp[i − ${c}] + 1.`,
      array: [],
      auxiliaryData: {
        dp: snap({
          title: `Coin Change — coins = [${coins.join(", ")}], target = ${amount}`,
          colLabels: cols,
          table: tableView(),
          axisColLabel: "amount",
        }),
      },
      variables: { coin: c },
    });
    for (let i = c; i <= amount; i++) {
      const cand = dp[i - c] + 1;
      const updated = cand < dp[i];
      if (updated) dp[i] = cand;
      steps.push({
        description: updated
          ? `dp[${i}] = dp[${i - c}] + 1 = ${cand} (better).`
          : `dp[${i}] stays ${dp[i] === Infinity ? "∞" : dp[i]} (not improved by coin ${c}).`,
        array: [],
        auxiliaryData: {
          dp: snap({
            title: `Coin Change — coins = [${coins.join(", ")}], target = ${amount}`,
            colLabels: cols,
            table: tableView(),
            axisColLabel: "amount",
            highlights: [
              { r: 0, c: i - c, kind: "dependency" },
              { r: 0, c: i, kind: "current" },
            ],
          }),
        },
        variables: { coin: c, i, cand: cand === Infinity ? "∞" : cand },
      });
    }
  }

  const ans = dp[amount];
  steps.push({
    description:
      ans === Infinity
        ? `Impossible to make ${amount} with the given coins.`
        : `Minimum coins to make ${amount} = ${ans}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Coin Change — coins = [${coins.join(", ")}], target = ${amount}`,
        colLabels: cols,
        table: tableView(),
        axisColLabel: "amount",
        highlights: [{ r: 0, c: amount, kind: "result" }],
      }),
      resultList: ans === Infinity ? "no solution" : `min coins = ${ans}`,
    },
  });
  return steps;
}

// ─────────── LIS (patience sort, 1D tails) ───────────

export function generateLISDPSteps(
  nums: number[] = [10, 9, 2, 5, 3, 7, 101, 18],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  // dp[i] = length of LIS ending at i
  const n = nums.length;
  const dp = new Array(n).fill(1) as number[];
  const cols = nums.map(String);

  steps.push({
    description: `Init dp[i] = 1 (every element alone is an LIS of length 1).`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `LIS — nums = [${nums.join(", ")}]`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "nums[i]",
      }),
    },
  });

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        steps.push({
          description: `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]} → extend. dp[${i}] = dp[${j}]+1 = ${dp[i]}.`,
          array: [],
          auxiliaryData: {
            dp: snap({
              title: `LIS — nums = [${nums.join(", ")}]`,
              colLabels: cols,
              table: [dp],
              axisColLabel: "nums[i]",
              highlights: [
                { r: 0, c: j, kind: "dependency" },
                { r: 0, c: i, kind: "current" },
              ],
            }),
          },
          variables: { i, j, "dp[i]": dp[i] },
        });
      }
    }
  }

  const best = Math.max(...dp);
  const bestIdx = dp.indexOf(best);
  steps.push({
    description: `Longest increasing subsequence length = ${best}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `LIS — nums = [${nums.join(", ")}]`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "nums[i]",
        highlights: [{ r: 0, c: bestIdx, kind: "result" }],
      }),
      resultList: `LIS length = ${best}`,
    },
  });
  return steps;
}

// ─────────── 0/1 Knapsack (2D) ───────────

export function generateKnapsackDPSteps(
  weights: number[] = [2, 3, 4, 5],
  values: number[] = [3, 4, 5, 6],
  capacity = 8,
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0),
  );
  const rowLabels = ["∅", ...weights.map((w, i) => `#${i + 1} w=${w} v=${values[i]}`)];
  const colLabels = Array.from({ length: capacity + 1 }, (_, i) => String(i));

  steps.push({
    description:
      "Build dp[i][w]: max value using first i items with capacity w. Row 0 / col 0 are all 0.",
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `0/1 Knapsack — capacity = ${capacity}`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: "items",
        axisColLabel: "capacity",
      }),
    },
  });

  for (let i = 1; i <= n; i++) {
    const wi = weights[i - 1];
    const vi = values[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (w < wi) {
        dp[i][w] = dp[i - 1][w];
        steps.push({
          description: `item ${i}: w=${wi} > cap=${w} → skip. dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}.`,
          array: [],
          auxiliaryData: {
            dp: snap({
              title: `0/1 Knapsack — capacity = ${capacity}`,
              rowLabels,
              colLabels,
              table: dp,
              axisRowLabel: "items",
              axisColLabel: "capacity",
              highlights: [
                { r: i - 1, c: w, kind: "dependency" },
                { r: i, c: w, kind: "current" },
              ],
            }),
          },
          variables: { i, w, choice: "skip" },
        });
      } else {
        const skip = dp[i - 1][w];
        const take = dp[i - 1][w - wi] + vi;
        dp[i][w] = Math.max(skip, take);
        steps.push({
          description: `item ${i}: max(skip=${skip}, take=${take}) = ${dp[i][w]}.`,
          array: [],
          auxiliaryData: {
            dp: snap({
              title: `0/1 Knapsack — capacity = ${capacity}`,
              rowLabels,
              colLabels,
              table: dp,
              axisRowLabel: "items",
              axisColLabel: "capacity",
              highlights: [
                { r: i - 1, c: w, kind: "dependency" },
                { r: i - 1, c: w - wi, kind: "dependency" },
                { r: i, c: w, kind: "current" },
              ],
            }),
          },
          variables: { i, w, skip, take, chosen: dp[i][w] },
        });
      }
    }
  }

  steps.push({
    description: `Maximum value = dp[${n}][${capacity}] = ${dp[n][capacity]}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `0/1 Knapsack — capacity = ${capacity}`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: "items",
        axisColLabel: "capacity",
        highlights: [{ r: n, c: capacity, kind: "result" }],
      }),
      resultList: `max value = ${dp[n][capacity]}`,
    },
  });
  return steps;
}

// ─────────── LCS (2D) ───────────

export function generateLCSDPSteps(
  a = "ABCBDAB",
  b = "BDCAB",
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  const rowLabels = ["ε", ...[...a]];
  const colLabels = ["ε", ...[...b]];

  steps.push({
    description: `LCS of "${a}" and "${b}". Empty prefix ⇒ 0.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `LCS("${a}", "${b}")`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: `"${a}"`,
        axisColLabel: `"${b}"`,
      }),
    },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          description: `'${a[i - 1]}' == '${b[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`,
          array: [],
          auxiliaryData: {
            dp: snap({
              title: `LCS("${a}", "${b}")`,
              rowLabels,
              colLabels,
              table: dp,
              axisRowLabel: `"${a}"`,
              axisColLabel: `"${b}"`,
              highlights: [
                { r: i - 1, c: j - 1, kind: "dependency" },
                { r: i, c: j, kind: "current" },
              ],
            }),
          },
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          description: `'${a[i - 1]}' ≠ '${b[j - 1]}' → dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}.`,
          array: [],
          auxiliaryData: {
            dp: snap({
              title: `LCS("${a}", "${b}")`,
              rowLabels,
              colLabels,
              table: dp,
              axisRowLabel: `"${a}"`,
              axisColLabel: `"${b}"`,
              highlights: [
                { r: i - 1, c: j, kind: "dependency" },
                { r: i, c: j - 1, kind: "dependency" },
                { r: i, c: j, kind: "current" },
              ],
            }),
          },
        });
      }
    }
  }

  // Reconstruct
  let i = m;
  let j = n;
  const lcs: string[] = [];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.push(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  lcs.reverse();

  steps.push({
    description: `LCS length = ${dp[m][n]}. One LCS: "${lcs.join("")}".`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `LCS("${a}", "${b}")`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: `"${a}"`,
        axisColLabel: `"${b}"`,
        highlights: [{ r: m, c: n, kind: "result" }],
      }),
      resultList: `LCS = "${lcs.join("")}" (length ${dp[m][n]})`,
    },
  });
  return steps;
}

// ─────────── Edit Distance / Levenshtein (2D) ───────────

export function generateEditDistanceSteps(
  a = "horse",
  b = "ros",
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  const rowLabels = ["ε", ...[...a]];
  const colLabels = ["ε", ...[...b]];

  steps.push({
    description: `Init row 0 and column 0: cost of inserting/deleting all chars.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Edit Distance("${a}", "${b}")`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: `"${a}"`,
        axisColLabel: `"${b}"`,
      }),
    },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          description: `'${a[i - 1]}' == '${b[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
          array: [],
          auxiliaryData: {
            dp: snap({
              title: `Edit Distance("${a}", "${b}")`,
              rowLabels,
              colLabels,
              table: dp,
              axisRowLabel: `"${a}"`,
              axisColLabel: `"${b}"`,
              highlights: [
                { r: i - 1, c: j - 1, kind: "dependency" },
                { r: i, c: j, kind: "current" },
              ],
            }),
          },
        });
      } else {
        const ins = dp[i][j - 1];
        const del = dp[i - 1][j];
        const sub = dp[i - 1][j - 1];
        dp[i][j] = 1 + Math.min(ins, del, sub);
        steps.push({
          description: `'${a[i - 1]}' ≠ '${b[j - 1]}' → 1 + min(ins=${ins}, del=${del}, sub=${sub}) = ${dp[i][j]}.`,
          array: [],
          auxiliaryData: {
            dp: snap({
              title: `Edit Distance("${a}", "${b}")`,
              rowLabels,
              colLabels,
              table: dp,
              axisRowLabel: `"${a}"`,
              axisColLabel: `"${b}"`,
              highlights: [
                { r: i - 1, c: j, kind: "dependency" },
                { r: i, c: j - 1, kind: "dependency" },
                { r: i - 1, c: j - 1, kind: "dependency" },
                { r: i, c: j, kind: "current" },
              ],
            }),
          },
          variables: { ins, del, sub, chosen: dp[i][j] },
        });
      }
    }
  }

  steps.push({
    description: `Edit distance = ${dp[m][n]}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Edit Distance("${a}", "${b}")`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: `"${a}"`,
        axisColLabel: `"${b}"`,
        highlights: [{ r: m, c: n, kind: "result" }],
      }),
      resultList: `edit distance = ${dp[m][n]}`,
    },
  });
  return steps;
}

// ─────────── Unique Paths (2D grid) ───────────

export function generateUniquePathsSteps(m = 4, n = 5): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const dp: number[][] = Array.from({ length: m }, () =>
    new Array(n).fill(0),
  );
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  const rowLabels = Array.from({ length: m }, (_, i) => String(i));
  const colLabels = Array.from({ length: n }, (_, j) => String(j));

  steps.push({
    description: `Grid ${m}×${n}. Only right or down moves. Row 0 and column 0 have exactly one path.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Unique Paths on ${m}×${n} grid`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: "row",
        axisColLabel: "col",
      }),
    },
  });

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      steps.push({
        description: `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i}][${j - 1}] = ${dp[i][j]}.`,
        array: [],
        auxiliaryData: {
          dp: snap({
            title: `Unique Paths on ${m}×${n} grid`,
            rowLabels,
            colLabels,
            table: dp,
            axisRowLabel: "row",
            axisColLabel: "col",
            highlights: [
              { r: i - 1, c: j, kind: "dependency" },
              { r: i, c: j - 1, kind: "dependency" },
              { r: i, c: j, kind: "current" },
            ],
          }),
        },
      });
    }
  }

  steps.push({
    description: `Total unique paths = ${dp[m - 1][n - 1]}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Unique Paths on ${m}×${n} grid`,
        rowLabels,
        colLabels,
        table: dp,
        axisRowLabel: "row",
        axisColLabel: "col",
        highlights: [{ r: m - 1, c: n - 1, kind: "result" }],
      }),
      resultList: `unique paths = ${dp[m - 1][n - 1]}`,
    },
  });
  return steps;
}

// ─────────── Partition Equal Subset Sum (2D) ───────────

export function generatePartitionSubsetSumSteps(
  nums: number[] = [1, 5, 11, 5],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const total = nums.reduce((s, x) => s + x, 0);
  if (total % 2 !== 0) {
    return [
      {
        description: `Sum = ${total} is odd ⇒ cannot partition into two equal subsets.`,
        array: [],
        auxiliaryData: {
          dp: {
            title: `Partition Equal Subset Sum — nums = [${nums.join(", ")}]`,
            table: [[0]],
          },
          resultList: "impossible",
        },
      },
    ];
  }
  const target = total / 2;
  const n = nums.length;
  // dp[i][s] = can we reach sum s using first i numbers
  const dp: (boolean)[][] = Array.from({ length: n + 1 }, () =>
    new Array(target + 1).fill(false),
  );
  for (let i = 0; i <= n; i++) dp[i][0] = true;

  const toTable = () =>
    dp.map((row) => row.map((v) => (v ? "✓" : "·"))) as (
      | number
      | string
      | null
    )[][];

  const rowLabels = ["∅", ...nums.map(String)];
  const colLabels = Array.from({ length: target + 1 }, (_, i) => String(i));

  steps.push({
    description: `Target per subset = ${target}. Column 0 = true (empty subset).`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Partition Equal Subset Sum — nums = [${nums.join(", ")}]`,
        rowLabels,
        colLabels,
        table: toTable(),
        axisRowLabel: "items",
        axisColLabel: "subset sum",
      }),
    },
  });

  for (let i = 1; i <= n; i++) {
    const x = nums[i - 1];
    for (let s = 1; s <= target; s++) {
      if (s < x) {
        dp[i][s] = dp[i - 1][s];
      } else {
        dp[i][s] = dp[i - 1][s] || dp[i - 1][s - x];
      }
      steps.push({
        description:
          s < x
            ? `${x} > s=${s} ⇒ skip. dp[${i}][${s}] = dp[${i - 1}][${s}] = ${dp[i][s]}.`
            : `dp[${i}][${s}] = dp[${i - 1}][${s}] OR dp[${i - 1}][${s - x}] = ${dp[i][s]}.`,
        array: [],
        auxiliaryData: {
          dp: snap({
            title: `Partition Equal Subset Sum — nums = [${nums.join(", ")}]`,
            rowLabels,
            colLabels,
            table: toTable(),
            axisRowLabel: "items",
            axisColLabel: "subset sum",
            highlights: [
              { r: i - 1, c: s, kind: "dependency" },
              ...(s >= x
                ? [{ r: i - 1, c: s - x, kind: "dependency" as const }]
                : []),
              { r: i, c: s, kind: "current" },
            ],
          }),
        },
      });
    }
  }

  const ok = dp[n][target];
  steps.push({
    description: ok
      ? `Subset summing to ${target} exists ⇒ partition possible.`
      : `No subset reaches ${target} ⇒ cannot partition.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Partition Equal Subset Sum — nums = [${nums.join(", ")}]`,
        rowLabels,
        colLabels,
        table: toTable(),
        axisRowLabel: "items",
        axisColLabel: "subset sum",
        highlights: [{ r: n, c: target, kind: "result" }],
      }),
      resultList: ok ? `partition possible` : `impossible`,
    },
  });
  return steps;
}

// ─────────── Kadane's (1D, maximum subarray) ───────────

export function generateKadaneSteps(
  nums: number[] = [-2, 1, -3, 4, -1, 2, 1, -5, 4],
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = nums.length;
  const dp = new Array(n).fill(0) as number[];
  dp[0] = nums[0];
  const cols = nums.map(String);

  steps.push({
    description: `dp[0] = nums[0] = ${nums[0]}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Kadane's — nums = [${nums.join(", ")}]`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "nums[i]",
        highlights: [{ r: 0, c: 0, kind: "done" }],
      }),
    },
    variables: { best: dp[0] },
  });

  let best = dp[0];
  for (let i = 1; i < n; i++) {
    const extend = dp[i - 1] + nums[i];
    const restart = nums[i];
    dp[i] = Math.max(extend, restart);
    best = Math.max(best, dp[i]);
    steps.push({
      description: `dp[${i}] = max(dp[${i - 1}]+${nums[i]}=${extend}, ${nums[i]}) = ${dp[i]}.`,
      array: [],
      auxiliaryData: {
        dp: snap({
          title: `Kadane's — nums = [${nums.join(", ")}]`,
          colLabels: cols,
          table: [dp],
          axisColLabel: "nums[i]",
          highlights: [
            { r: 0, c: i - 1, kind: "dependency" },
            { r: 0, c: i, kind: "current" },
          ],
        }),
      },
      variables: { i, extend, restart, "dp[i]": dp[i], best },
    });
  }

  const bestIdx = dp.indexOf(best);
  steps.push({
    description: `Maximum subarray sum = ${best}.`,
    array: [],
    auxiliaryData: {
      dp: snap({
        title: `Kadane's — nums = [${nums.join(", ")}]`,
        colLabels: cols,
        table: [dp],
        axisColLabel: "nums[i]",
        highlights: [{ r: 0, c: bestIdx, kind: "result" }],
      }),
      resultList: `max subarray sum = ${best}`,
    },
  });
  return steps;
}
