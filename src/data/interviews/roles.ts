import type { CompanyRole, InterviewQuestion, InterviewRound } from "@/data/types";

// ---------------- Shared question banks (reused across companies) ----------------

const coding_arrays_hashing: InterviewQuestion[] = [
  {
    id: "q-two-sum",
    question: "Given an array of integers, return indices of two numbers that add up to a target.",
    category: "Arrays & Hashing",
    difficulty: "easy",
    answer: `### Two Sum

**Approach: Hash Map — O(n) time, O(n) space**

Iterate once. For each element \`x\`, check if \`target - x\` is already in the map. If yes, return indices. Otherwise, store \`x -> index\`.

\`\`\`javascript
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
\`\`\`

**Follow-ups interviewers often ask:**
- What if the array is sorted? → Two pointers, O(1) space.
- What if there can be multiple pairs? → Return all, watch for duplicates.
- What if numbers are streaming? → Maintain rolling hash set.`,
  },
  {
    id: "q-group-anagrams",
    question: "Group an array of strings into anagram groups.",
    category: "Arrays & Hashing",
    difficulty: "medium",
    answer: `### Group Anagrams

**Key insight:** Two words are anagrams iff they produce the same sorted string, or the same 26-letter frequency tuple.

\`\`\`javascript
function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = [...s].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}
\`\`\`

- Sort key: **O(n · k log k)**
- Counting key (26 ints): **O(n · k)** — faster for lowercase ASCII inputs.`,
  },
  {
    id: "q-longest-substring",
    question: "Find the length of the longest substring without repeating characters.",
    category: "Sliding Window",
    difficulty: "medium",
    answer: `### Longest Substring Without Repeating Characters

**Sliding window + hash map** — O(n) time.

\`\`\`javascript
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    if (last.has(s[r]) && last.get(s[r]) >= left) {
      left = last.get(s[r]) + 1;
    }
    last.set(s[r], r);
    best = Math.max(best, r - left + 1);
  }
  return best;
}
\`\`\`

Common pitfalls:
- Only advance \`left\` when the duplicate is **inside** the current window.
- Don't reset the whole map; update the last seen index.`,
  },
];

const coding_trees_graphs: InterviewQuestion[] = [
  {
    id: "q-bt-level-order",
    question: "Perform a level-order (BFS) traversal of a binary tree.",
    category: "Trees",
    difficulty: "medium",
    answer: `### Level Order Traversal

Use a queue. Track level size to group nodes per level.

\`\`\`javascript
function levelOrder(root) {
  if (!root) return [];
  const q = [root], out = [];
  while (q.length) {
    const size = q.length, level = [];
    for (let i = 0; i < size; i++) {
      const n = q.shift();
      level.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    out.push(level);
  }
  return out;
}
\`\`\`

**Interview variants:** zig-zag order, right-side view, average of each level.`,
  },
  {
    id: "q-clone-graph",
    question: "Clone an undirected connected graph (deep copy).",
    category: "Graphs",
    difficulty: "medium",
    answer: `### Clone Graph

**Hash map of original → clone**, DFS or BFS.

\`\`\`javascript
function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  const dfs = (n) => {
    if (map.has(n)) return map.get(n);
    const copy = { val: n.val, neighbors: [] };
    map.set(n, copy);
    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb));
    return copy;
  };
  return dfs(node);
}
\`\`\`

- Time: O(V + E)
- Space: O(V) for the map + recursion stack.`,
  },
  {
    id: "q-word-ladder",
    question: "Given begin/end word and a dictionary, return the shortest transformation length.",
    category: "Graphs / BFS",
    difficulty: "hard",
    answer: `### Word Ladder (BFS shortest path)

Model: each word is a node; edge exists between words differing in exactly one letter.

**Trick:** Instead of comparing all pairs (O(N² · L)), use pattern buckets like \`h*t\`, \`*ot\`, \`ho*\`.

\`\`\`javascript
function ladderLength(begin, end, words) {
  const set = new Set(words);
  if (!set.has(end)) return 0;
  let q = [[begin, 1]];
  while (q.length) {
    const next = [];
    for (const [w, d] of q) {
      if (w === end) return d;
      for (let i = 0; i < w.length; i++) {
        for (let c = 97; c < 123; c++) {
          const cand = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
          if (set.has(cand)) {
            next.push([cand, d + 1]);
            set.delete(cand);
          }
        }
      }
    }
    q = next;
  }
  return 0;
}
\`\`\``,
  },
];

const coding_dp: InterviewQuestion[] = [
  {
    id: "q-lis",
    question: "Find the length of the longest increasing subsequence.",
    category: "Dynamic Programming",
    difficulty: "medium",
    answer: `### Longest Increasing Subsequence

**O(n²) DP:** \`dp[i] = 1 + max(dp[j])\` for \`j < i, nums[j] < nums[i]\`.

**O(n log n) patience sorting / binary search:**

\`\`\`javascript
function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (tails[m] < x) lo = m + 1; else hi = m;
    }
    tails[lo] = x;
  }
  return tails.length;
}
\`\`\`

\`tails[i]\` = smallest possible tail of an increasing subseq of length \`i+1\`. It's not the actual LIS, but its length is correct.`,
  },
  {
    id: "q-coin-change",
    question: "Given coins and a target, return the fewest coins needed to make the amount.",
    category: "Dynamic Programming",
    difficulty: "medium",
    answer: `### Coin Change (Min Coins)

**Unbounded knapsack:** \`dp[a] = 1 + min(dp[a - c])\` for each coin \`c ≤ a\`.

\`\`\`javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
\`\`\`

Time **O(amount · coins)**, space **O(amount)**.`,
  },
];

const frontend_js_dom: InterviewQuestion[] = [
  {
    id: "q-debounce",
    question: "Implement debounce(fn, delay).",
    category: "JavaScript",
    difficulty: "medium",
    answer: `### Debounce

Delay invocation of \`fn\` until \`delay\` ms have passed since the **last** call.

\`\`\`javascript
function debounce(fn, delay) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}
\`\`\`

**Variations to discuss:**
- \`leading\` / \`trailing\` invocation flags.
- Cancel method to clear pending call.
- Difference vs **throttle** (throttle guarantees at most one call per window).`,
  },
  {
    id: "q-event-delegation",
    question: "What is event delegation and why is it useful?",
    category: "DOM / Browser",
    difficulty: "easy",
    answer: `### Event Delegation

Attach a **single listener on a common ancestor** and use \`event.target\` to route logic. Events bubble up, so children don't each need their own listener.

**Benefits:**
- Fewer listeners → less memory.
- Works for elements added dynamically after mount.
- Centralized handler logic.

**Caveats:**
- Some events don't bubble (\`focus\`, \`blur\`, \`mouseenter\`). Use capture phase or \`focusin\`/\`focusout\`.
- \`event.target\` vs \`event.currentTarget\` — the target is what was clicked; currentTarget is the listener's element.`,
  },
  {
    id: "q-css-specificity",
    question: "Explain CSS specificity and how conflicts are resolved.",
    category: "CSS",
    difficulty: "easy",
    answer: `### CSS Specificity

Specificity is a 4-part score **(inline, IDs, classes/attrs/pseudo-classes, elements/pseudo-elements)**, compared left-to-right.

Examples:
- \`#main .title\` → (0,1,1,0)
- \`div.title.active\` → (0,0,2,1)
- Inline \`style=""\` → (1,0,0,0)
- \`!important\` **overrides** normal cascade but specificity still decides among multiple \`!important\` rules.

**Tie-breakers** (in order): specificity → source order (later wins).`,
  },
];

const frontend_react: InterviewQuestion[] = [
  {
    id: "q-react-reconciliation",
    question: "How does React's reconciliation / virtual DOM diffing work?",
    category: "React",
    difficulty: "medium",
    answer: `### React Reconciliation

On each render, React builds a new virtual DOM tree and diffs it against the previous one.

**Key heuristics:**
1. **Different element types** → destroy and rebuild the subtree.
2. **Same type** → update props, recurse into children.
3. **Lists** → match by \`key\`. Without stable keys, React falls back to index-based matching, causing unnecessary re-mounts and lost state.

**Fiber** (since React 16) makes this incremental: work is sliced into units that can be paused, prioritized, and resumed — enabling concurrent features like \`useTransition\`.`,
  },
  {
    id: "q-react-memo-vs-usememo",
    question: "When would you use React.memo vs useMemo vs useCallback?",
    category: "React",
    difficulty: "medium",
    answer: `### memo / useMemo / useCallback

- **React.memo(Component)** — skips re-render if props are shallow-equal.
- **useMemo(fn, deps)** — memoizes a **value** (expensive computation, referential stability).
- **useCallback(fn, deps)** — memoizes a **function reference** (usually to keep memoized children stable).

**Rule of thumb:** Don't wrap everything. Use these when you have measured a real render cost, or when referential equality is required by a dependency array or memoized child.`,
  },
];

const system_design_common: InterviewQuestion[] = [
  {
    id: "q-sd-url-shortener",
    question: "Design a URL shortener (bit.ly).",
    category: "System Design",
    difficulty: "medium",
    answer: `### URL Shortener

**Requirements**
- Shorten long URL → short code; redirect short code → long URL.
- Read-heavy (~100:1 reads:writes), billions of URLs, low latency redirects.

**Short code generation**
- **Counter + base62** → monotonic, 6 chars → 56B codes.
- Or **hash(url)[:7]** with collision retry.

**Storage**
- KV store (e.g., DynamoDB / Cassandra): \`short -> { url, createdAt, owner, ttl }\`.
- Cache hot keys in Redis (LRU). Most traffic served from cache.

**Serving layer**
- Stateless API behind a load balancer.
- 301 vs 302: 301 is cached by browsers → fewer server hits but less analytics fidelity.

**Extras**
- Analytics → async write to Kafka + batch aggregate.
- Custom aliases → unique constraint, reserved namespace.
- Expiration → TTL column + background cleaner.`,
  },
  {
    id: "q-sd-newsfeed",
    question: "Design a news feed (Twitter / Facebook).",
    category: "System Design",
    difficulty: "hard",
    answer: `### News Feed

**Two main strategies**

1. **Fan-out on write (push)** — when user posts, write to each follower's feed list. Fast reads, expensive for celebrities.
2. **Fan-out on read (pull)** — merge latest posts from followed users at read time. Fresh, but heavy reads.
3. **Hybrid** — push for normal users, pull for celebrities (Twitter's approach).

**Components**
- Post service (write), Timeline service (read).
- Feed cache per user (Redis sorted set by timestamp).
- Ranking service (ML / rules) for relevance ordering.

**Scaling tricks**
- Precompute feeds in the background.
- Store only post IDs in timelines; hydrate post content from post store + cache.
- Shard by user ID.`,
  },
  {
    id: "q-sd-rate-limiter",
    question: "Design a distributed rate limiter.",
    category: "System Design",
    difficulty: "medium",
    answer: `### Distributed Rate Limiter

**Algorithms**
- **Fixed window** — simple but boundary bursts.
- **Sliding window log** — accurate, memory heavy.
- **Sliding window counter** — weighted interpolation of two fixed windows.
- **Token bucket** — most common; allows bursts up to bucket size, refills at rate R.
- **Leaky bucket** — smooths output rate.

**Distributed implementation**
- Redis with Lua script (atomic INCR + EXPIRE) for per-key counters keyed by user / IP / API key.
- Return HTTP 429 with \`Retry-After\`.
- Avoid race conditions by using Lua or Redis \`INCRBY\` + \`PEXPIRE\`.

**Edge cases**
- Clock skew → use server time, not client.
- Multi-region → usually local limits with a global soft cap; eventual sync.`,
  },
];

const behavioral_common: InterviewQuestion[] = [
  {
    id: "q-beh-conflict",
    question: "Tell me about a time you disagreed with a teammate. How did you resolve it?",
    category: "Behavioral",
    difficulty: "easy",
    answer: `### Disagreement / Conflict

Use **STAR**: Situation, Task, Action, Result.

**What interviewers look for**
- You engage with the **data**, not personalities.
- You separate opinions from decisions: "disagree and commit" is respected.
- You describe what **you** did, not what "we" did.

**Template answer skeleton**
- *Situation:* On project X, we needed to choose between approach A and B.
- *Task:* I owned the technical decision for my component.
- *Action:* I laid out trade-offs in a short doc, ran a small spike, got my teammate's objections addressed.
- *Result:* We aligned on B with a clear fallback, shipped on time, no follow-up friction.`,
  },
  {
    id: "q-beh-failure",
    question: "Tell me about a project that failed or went off the rails. What did you learn?",
    category: "Behavioral",
    difficulty: "medium",
    answer: `### Failure Story

**Do:**
- Pick a real, meaningful failure (not a humble-brag).
- Own your part clearly — "I underestimated X", "I didn't escalate soon enough".
- Explain the **systemic change** you made after (process, testing, communication).

**Don't:**
- Blame others or external factors only.
- Pick something trivially small.
- Skip the lesson.

**Good structure:** context → what went wrong → your role → what you changed after → how you applied that lesson on the next project.`,
  },
];

// ---------------- Round templates ----------------

const round = (
  id: string,
  name: string,
  description: string,
  questions: InterviewQuestion[],
  extras: Partial<InterviewRound> = {}
): InterviewRound => ({
  id,
  slug: id,
  name,
  description,
  questions,
  ...extras,
});

// ---------------- Role builders ----------------

function roleSWE(prefix: string, companyName: string, level = "L3 / Mid-level"): CompanyRole {
  return {
    id: `${prefix}-swe`,
    slug: "software-engineer",
    title: "Software Engineer",
    level,
    description: `Generalist software engineer building ${companyName}'s core products and services. Strong bar on coding, data structures, and systems fundamentals.`,
    focus: ["Data Structures", "Algorithms", "System Design", "Core CS"],
    interviewLoop: `Typically: recruiter screen → technical phone screen → 4-5 onsite rounds (coding, system design, behavioral). Total ~5 hours of interviews.`,
    rounds: [
      round(
        "phone-screen",
        "Phone Screen",
        `A 45-60 minute technical screen with one engineer. Usually **one medium coding problem** on a shared editor. Communication and clean implementation matter as much as the final answer.`,
        [coding_arrays_hashing[0], coding_arrays_hashing[2]],
        { duration: "45 min", format: "Virtual", topics: ["Arrays", "Hashing", "Sliding Window"] }
      ),
      round(
        "coding-1",
        "Coding Round 1 — DS & Algorithms",
        `One or two medium problems focused on arrays, hashing, and strings. Expect follow-ups about complexity trade-offs and edge cases.`,
        coding_arrays_hashing,
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Arrays", "Hashing", "Strings"] }
      ),
      round(
        "coding-2",
        "Coding Round 2 — Trees & Graphs",
        `Tree/graph traversal, connectivity, and shortest paths. Expect one hard-leaning problem and a discussion of variants.`,
        coding_trees_graphs,
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Trees", "Graphs", "BFS/DFS"] }
      ),
      round(
        "system-design",
        "System Design",
        `Open-ended design discussion. Drive the conversation: clarify requirements, estimate scale, propose an architecture, go deep on one component.`,
        system_design_common,
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Scalability", "Storage", "Caching", "APIs"] }
      ),
      round(
        "behavioral",
        "Behavioral / Leadership",
        `STAR-format questions about collaboration, conflict, ambiguity, and impact. Prepare 4-6 stories that can flex to multiple prompts.`,
        behavioral_common,
        { duration: "45 min", format: "Virtual", topics: ["Leadership", "Collaboration", "Ownership"] }
      ),
    ],
  };
}

function roleFrontend(prefix: string, companyName: string): CompanyRole {
  return {
    id: `${prefix}-frontend`,
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    level: "Mid / Senior",
    description: `Builds user-facing web experiences at ${companyName}. Deep focus on JavaScript, browser internals, accessibility, and UI performance.`,
    focus: ["JavaScript", "CSS", "React / Framework", "Web Performance", "Accessibility"],
    interviewLoop: `Recruiter → JS/DOM screen → onsite with UI build round, JS trivia/design, system design (frontend), behavioral.`,
    rounds: [
      round(
        "js-screen",
        "JavaScript / DOM Screen",
        `Implement small utilities (debounce, throttle, deepEqual, event emitter) and answer questions about closures, the event loop, and promise semantics.`,
        frontend_js_dom,
        { duration: "1 hour", format: "Virtual", topics: ["JavaScript", "DOM", "Event Loop"] }
      ),
      round(
        "ui-build",
        "UI Build / Coding",
        `Build a small interactive component from scratch (e.g., autocomplete, carousel, nested comments, star rating). Focus on state modeling, accessibility, and edge cases.`,
        [
          {
            id: "q-build-autocomplete",
            question: "Build an accessible autocomplete component with keyboard navigation.",
            category: "UI Build",
            difficulty: "medium",
            answer: `### Autocomplete — what interviewers look for

**State model**
- \`query\` (controlled input)
- \`results\` (fetched, cached, or filtered client-side)
- \`highlightIndex\` (keyboard selection)
- \`isOpen\`

**UX details**
- Debounce fetches (~200ms).
- ArrowUp / ArrowDown move highlight; Enter selects; Esc closes.
- **Aria:** \`role="combobox"\`, \`aria-autocomplete="list"\`, \`aria-activedescendant\` on the active option, \`role="listbox"\` on results.
- Don't lose focus when clicking an option — use \`onMouseDown\` (fires before blur) or prevent default on blur.
- Cancel stale requests when the user types again (AbortController).`,
          },
          ...frontend_react,
        ],
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Components", "State", "Accessibility"] }
      ),
      round(
        "frontend-system-design",
        "Frontend System Design",
        `Design a complex UI system: a feed, a spreadsheet, a rich text editor, or a design system. Cover data flow, caching, virtualization, state management, and offline.`,
        [
          {
            id: "q-sd-feed-client",
            question: "Design the client-side architecture of an infinite-scroll feed (Twitter-like).",
            category: "Frontend System Design",
            difficulty: "hard",
            answer: `### Infinite Feed — Client Architecture

**Data layer**
- Paginated API with cursor-based pagination (stable under inserts).
- Client cache keyed by cursor / post ID. Normalize posts in a store (e.g., Redux / Zustand) to avoid duplication.

**Rendering**
- **Windowing / virtualization** — only render viewport + buffer (e.g., react-window).
- IntersectionObserver on a sentinel to trigger next page fetch.
- Maintain scroll anchor when prepending new items (preserve scrollTop relative to anchor element).

**Concerns**
- **Optimistic updates** for likes/retweets; reconcile on server response.
- Handle stale cache when user returns after hours (background refresh, "new posts" pill).
- Accessibility: keep focus management predictable; announce new items for screen readers sparingly.`,
          },
          ...system_design_common,
        ],
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Caching", "Virtualization", "State", "Performance"] }
      ),
      round(
        "behavioral",
        "Behavioral",
        `Cross-functional collaboration stories — designers, PMs, backend. Impact on UX metrics.`,
        behavioral_common,
        { duration: "45 min", format: "Virtual" }
      ),
    ],
  };
}

function roleBackend(prefix: string, companyName: string): CompanyRole {
  return {
    id: `${prefix}-backend`,
    slug: "backend-engineer",
    title: "Backend Engineer",
    level: "Mid / Senior",
    description: `Owns services, APIs, and data pipelines at ${companyName}. Heavy focus on distributed systems, databases, and reliability.`,
    focus: ["Distributed Systems", "Databases", "APIs", "Concurrency", "Reliability"],
    interviewLoop: `Recruiter → coding screen → onsite with 2 coding, 1-2 system design (one deep on storage / concurrency), behavioral.`,
    rounds: [
      round(
        "coding-screen",
        "Coding Screen",
        `Medium problem focused on data structures and clean API design.`,
        coding_arrays_hashing,
        { duration: "1 hour", format: "Virtual", topics: ["Arrays", "Hashing", "Strings"] }
      ),
      round(
        "coding-dsa",
        "Coding — DS & Algorithms",
        `Graphs and DP are common. Focus on time/space trade-offs and handling large inputs.`,
        [...coding_trees_graphs, ...coding_dp],
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Graphs", "DP", "Algorithms"] }
      ),
      round(
        "system-design",
        "System Design — Services & Storage",
        `End-to-end service design. Expect deep dives on data modeling, consistency, and failure modes.`,
        system_design_common,
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Databases", "Queues", "Caching", "Sharding"] }
      ),
      round(
        "deep-dive",
        "Technical Deep Dive",
        `Walkthrough of a past project you owned. Expect probing on trade-offs, incidents, and what you'd do differently.`,
        [
          {
            id: "q-deep-dive-project",
            question: "Walk me through the most technically challenging project you've shipped.",
            category: "Deep Dive",
            difficulty: "medium",
            answer: `### Project Deep Dive — How to Structure It

1. **Context (30s):** team, product, constraints.
2. **Problem:** *why* it was hard. Concrete numbers: QPS, latency SLOs, data volume.
3. **Options considered:** 2-3 approaches, why you rejected them.
4. **What you built:** architecture diagram, key decisions (consistency, schema, protocol).
5. **Failure modes & mitigations:** what broke in staging / prod, what you monitored.
6. **Outcome:** measurable impact (latency, cost, reliability).
7. **In hindsight:** what you'd change now.

Interviewers probe at every layer — be ready to go 2-3 levels deeper on any choice.`,
          },
          ...behavioral_common,
        ],
        { duration: "1 hour", format: "Onsite / Virtual Onsite", topics: ["Architecture", "Trade-offs", "Reliability"] }
      ),
      round(
        "behavioral",
        "Behavioral",
        `Ownership, dealing with on-call, cross-team collaboration.`,
        behavioral_common,
        { duration: "45 min", format: "Virtual" }
      ),
    ],
  };
}

function roleData(prefix: string, companyName: string): CompanyRole {
  return {
    id: `${prefix}-data`,
    slug: "data-engineer",
    title: "Data / ML Engineer",
    level: "Mid / Senior",
    description: `Builds data platforms and ML-adjacent systems at ${companyName}. Pipelines, feature stores, batch + streaming, model serving.`,
    focus: ["SQL", "Distributed Compute", "Pipelines", "ML Systems"],
    interviewLoop: `Recruiter → SQL + coding screen → onsite with coding, data modeling, ML/data system design, behavioral.`,
    rounds: [
      round(
        "sql-coding",
        "SQL + Coding Screen",
        `A SQL problem (window functions, self-joins, gaps & islands) plus a short coding warm-up.`,
        [
          {
            id: "q-sql-window",
            question: "Given a login events table, compute each user's longest consecutive login streak (in days).",
            category: "SQL",
            difficulty: "hard",
            answer: `### Consecutive Streak — "Gaps and Islands"

**Idea:** Subtract a dense \`ROW_NUMBER()\` from the date. Consecutive days share the same offset, forming an island.

\`\`\`sql
WITH ordered AS (
  SELECT user_id, login_date,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
  FROM logins
),
islands AS (
  SELECT user_id, login_date,
         DATE_SUB(login_date, INTERVAL rn DAY) AS grp
  FROM ordered
)
SELECT user_id, MAX(cnt) AS longest_streak
FROM (
  SELECT user_id, grp, COUNT(*) AS cnt
  FROM islands
  GROUP BY user_id, grp
) t
GROUP BY user_id;
\`\`\`

Dedupe logins per day first if the same user can log in multiple times a day.`,
          },
          coding_arrays_hashing[0],
        ],
        { duration: "1 hour", format: "Virtual", topics: ["SQL", "Window Functions", "Arrays"] }
      ),
      round(
        "coding-dsa",
        "Coding — DS & Algorithms",
        `Medium coding problem; often on strings, intervals, or graphs relevant to data processing.`,
        [...coding_trees_graphs, ...coding_dp],
        { duration: "1 hour", format: "Onsite", topics: ["Graphs", "DP", "Intervals"] }
      ),
      round(
        "data-modeling",
        "Data Modeling / Pipelines",
        `Design a warehouse schema and ETL pipeline for a given product (e.g., ride-sharing trips, ad impressions). Cover ingestion, deduping, late data, backfills.`,
        [
          {
            id: "q-sd-etl",
            question: "Design a daily ETL pipeline for ad impression events (~10B/day).",
            category: "Data System Design",
            difficulty: "hard",
            answer: `### Ad Impressions ETL

**Ingestion**
- Producers write to Kafka with partition key = \`advertiser_id\` for locality.
- Schema registry (Avro/Protobuf) for forward/backward compatibility.

**Raw landing**
- Stream into object storage (S3 / GCS) partitioned by \`dt=YYYY-MM-DD/hour=HH\`.
- Use a streaming job (Flink / Spark Structured Streaming) for bucketing and light validation.

**Transform**
- Daily Spark job: dedupe by \`(impression_id)\` with a 24h lookback window for late events.
- Join with dimension tables (advertisers, campaigns) using broadcast joins.

**Serving**
- Partitioned Parquet in a lake + an aggregated mart (e.g., Iceberg / Snowflake) for BI.
- Idempotent writes: overwrite partition on retry.

**Ops**
- Backfills: parameterize the job on date range; quarantine bad partitions.
- Data quality: row counts, null rates, schema drift alerts.`,
          },
          ...system_design_common,
        ],
        { duration: "1 hour", format: "Onsite", topics: ["Warehousing", "Streaming", "Schema"] }
      ),
      round(
        "ml-system-design",
        "ML / Data System Design",
        `Design a recommendation, ranking, or anomaly detection system end-to-end.`,
        system_design_common,
        { duration: "1 hour", format: "Onsite", topics: ["Feature Store", "Serving", "Offline/Online Skew"] }
      ),
      round(
        "behavioral",
        "Behavioral",
        `Stakeholder management, data quality incidents, scope negotiation.`,
        behavioral_common,
        { duration: "45 min", format: "Virtual" }
      ),
    ],
  };
}

function roleSRE(prefix: string, companyName: string): CompanyRole {
  return {
    id: `${prefix}-sre`,
    slug: "site-reliability-engineer",
    title: "Site Reliability Engineer",
    level: "Mid / Senior",
    description: `Keeps ${companyName}'s services reliable, performant, and observable. Focus on Linux, networking, and production systems.`,
    focus: ["Linux", "Networking", "Observability", "Automation", "Incident Response"],
    interviewLoop: `Recruiter → coding screen → onsite with coding, systems/Linux debugging, system design, incident/behavioral.`,
    rounds: [
      round(
        "coding-screen",
        "Coding Screen",
        `Medium scripting / algorithm problem. Often parsing logs, computing stats, or graph reachability.`,
        coding_arrays_hashing,
        { duration: "45 min", format: "Virtual", topics: ["Scripting", "Parsing", "Algorithms"] }
      ),
      round(
        "linux-debug",
        "Linux / Systems Debugging",
        `"A service is slow — here's what you see." Walk through diagnosis: \`top\`, \`iostat\`, \`tcpdump\`, \`strace\`, flame graphs, GC logs.`,
        [
          {
            id: "q-sre-slow-service",
            question: "A backend service p99 just tripled. Walk through how you'd investigate.",
            category: "Debugging",
            difficulty: "hard",
            answer: `### p99 Regression — Investigation Playbook

1. **Correlate the spike** — deploys? config change? traffic shift? upstream dependency?
2. **Check the four golden signals**: latency, traffic, errors, saturation.
3. **Host level** — CPU steal, run queue, memory pressure, disk I/O wait, network retransmits.
4. **Process level** — threads blocked? GC pauses? thread pool exhaustion? lock contention (look at stack samples / flame graph).
5. **Downstream** — DB slow queries, cache miss rate, external API latency.
6. **Narrow the blast radius** — is it one AZ? one host? one endpoint? one tenant?
7. **Mitigate first, root-cause after** — roll back, shed load, scale out, failover.
8. **Write the postmortem** — timeline, contributing factors, action items with owners.`,
          },
        ],
        { duration: "1 hour", format: "Onsite", topics: ["Linux", "Profiling", "Networking"] }
      ),
      round(
        "system-design",
        "System Design — Reliability",
        `Design a highly available service. Cover load balancing, failure domains, deploys, rollback, capacity planning.`,
        system_design_common,
        { duration: "1 hour", format: "Onsite", topics: ["HA", "Load Balancing", "Deploys"] }
      ),
      round(
        "incident-behavioral",
        "Incident / Behavioral",
        `Walk through a past production incident. What was the blast radius, how did you mitigate, what changed after?`,
        behavioral_common,
        { duration: "45 min", format: "Virtual", topics: ["On-call", "Postmortems", "Ownership"] }
      ),
    ],
  };
}

// ---------------- Public: per-company role selections ----------------

export function buildRolesForCompany(slug: string, name: string): CompanyRole[] {
  const prefix = slug;

  // Companies with a strong frontend culture get the Frontend role.
  const hasFrontend = new Set([
    "google", "meta", "airbnb", "netflix", "linkedin", "twitter", "spotify", "stripe", "adobe",
  ]);
  // Companies where data / ML is central.
  const hasData = new Set([
    "google", "meta", "netflix", "linkedin", "airbnb", "uber", "twitter", "spotify", "amazon",
  ]);
  // Companies where SRE / infra is a named ladder.
  const hasSRE = new Set([
    "google", "amazon", "microsoft", "meta", "netflix", "uber", "linkedin", "stripe",
  ]);

  const roles: CompanyRole[] = [
    roleSWE(prefix, name),
    roleBackend(prefix, name),
  ];
  if (hasFrontend.has(slug)) roles.push(roleFrontend(prefix, name));
  if (hasData.has(slug)) roles.push(roleData(prefix, name));
  if (hasSRE.has(slug)) roles.push(roleSRE(prefix, name));

  return roles;
}
