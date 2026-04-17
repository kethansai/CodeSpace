import type { SystemDesign } from "@/data/types";

/**
 * Additional System Design topics with rich animated walkthroughs.
 * Each topic includes:
 *  - A mermaid architecture diagram
 *  - Detailed markdown content
 *  - Scale metrics & tradeoff tables
 *  - Step-by-step animations rendered via SystemDesignAnimator
 */

export const additionalSystemDesigns: SystemDesign[] = [
  // ============================================================
  // 1. Twitter-like Timeline (distinct from news-feed, deeper)
  // ============================================================
  {
    id: "twitter-timeline",
    slug: "twitter-timeline",
    title: "Twitter / X Timeline",
    icon: "🐦",
    difficulty: "hard",
    category: "Social",
    description:
      "Design a 500M-user microblogging timeline with hybrid fan-out, trending topics, and sub-200ms feed loads.",
    realWorld: ["Twitter/X", "Threads", "Mastodon", "Bluesky"],
    diagram: `graph TD
    A[Client] -->|Tweet| B[Write API]
    B --> C[(Tweet DB)]
    B --> D[Fan-out Worker]
    D -->|Push to followers| E[(Home Timeline Cache)]
    F[Celebrity Filter] -.skip fan-out.-> D
    G[Client Read] --> H[Timeline API]
    H --> E
    H -->|Merge celeb tweets| I[Celebrity Pull]
    I --> C
    H --> J[Ranker]
    style D fill:#F59E0B,color:#000
    style E fill:#DC2626,color:#fff
    style J fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Active Users", value: "500M", hint: "Daily active" },
      { label: "Tweets/day", value: "500M", hint: "~6K/sec peak" },
      { label: "Timeline reads", value: "300B/day", hint: "600:1 read/write" },
      { label: "Latency target", value: "< 200ms", hint: "p99 home feed" },
    ],
    tradeoffs: [
      {
        option: "Pure fan-out on write (push)",
        pros: ["Fast reads (pre-computed)", "Simple read path"],
        cons: ["Celebrity problem: 100M writes for 1 tweet", "Wasted work for inactive users"],
      },
      {
        option: "Pure fan-out on read (pull)",
        pros: ["No wasted computation", "Cheap writes"],
        cons: ["Slow reads (N follower queries)", "Hard to personalize/rank at scale"],
      },
      {
        option: "Hybrid (Twitter's real choice)",
        pros: ["Balances cost & latency", "Scales to celebrities naturally"],
        cons: ["Complex: two code paths", "Merge + rank adds latency"],
      },
    ],
    content: `## Twitter / X Timeline

### The 100M Follower Problem

A regular user fan-out is trivial — push a tweet to 500 followers.
A celebrity has **100M+ followers**. Writing 100M timeline entries per tweet melts your cluster.

### Hybrid Fan-out

- **Regular users (< 10K followers):** Push at write time → pre-computed feed
- **Celebrities (> 10K followers):** Pull at read time → merge into feed
- Clients experience the same API; complexity lives in the timeline service

### Home Timeline Cache

- **Redis sorted set** per user, keyed \`timeline:{userId}\`
- Score = tweet timestamp (for chronological) or ranker score
- Cap at latest 800 entries — older pages fall back to DB

### Tweet Storage

- **Sharded MySQL** or Manhattan (Twitter's KV)
- Sharded by \`tweet_id\` using Snowflake (time-ordered 64-bit IDs)
- Snowflake layout: \`[41 bits timestamp][10 bits machine][12 bits sequence]\`

### Trending Topics

- Use **Count-Min Sketch** for probabilistic frequency counting
- Sliding window (1h, 6h, 24h)
- Subtract long-term baseline to find *rising* topics, not just popular ones
- Re-compute every 30s from a Kafka stream of hashtags

### Search

- Real-time indexing via Lucene/Elasticsearch
- Tweets flow into search index within 1s of posting
- Filter: user, language, media type, date range, location
`,
    keyTakeaways: [
      "Hybrid fan-out: push for regulars, pull for celebrities",
      "Snowflake IDs give time-ordered globally unique keys",
      "Cap timeline cache at ~800 entries per user",
      "Count-Min Sketch is the trick behind trending topics",
    ],
    animations: [
      {
        id: "tweet-fanout",
        title: "Posting a Tweet — Hybrid Fan-out",
        description:
          "Follow a tweet from submission through fan-out to millions of home timelines.",
        intervalMs: 2800,
        nodes: [
          { id: "user", label: "User", icon: "👤", x: 8, y: 50, kind: "client" },
          { id: "api", label: "Write API", icon: "🟢", x: 25, y: 50, kind: "service" },
          { id: "db", label: "Tweet DB", icon: "🗄️", x: 42, y: 20, kind: "db" },
          { id: "classifier", label: "Classifier", icon: "🧠", x: 42, y: 80, kind: "service" },
          { id: "fanout", label: "Fan-out Worker", icon: "🌀", x: 62, y: 50, kind: "worker" },
          { id: "cache1", label: "Timeline 1", icon: "⚡", x: 85, y: 20, kind: "cache" },
          { id: "cache2", label: "Timeline 2", icon: "⚡", x: 92, y: 50, kind: "cache" },
          { id: "cache3", label: "Timeline N", icon: "⚡", x: 85, y: 80, kind: "cache" },
        ],
        edges: [
          { id: "e1", from: "user", to: "api", label: "POST /tweet" },
          { id: "e2", from: "api", to: "db", label: "persist" },
          { id: "e3", from: "api", to: "classifier", label: "follower count?" },
          { id: "e4", from: "classifier", to: "fanout", label: "push or skip" },
          { id: "e5", from: "fanout", to: "cache1" },
          { id: "e6", from: "fanout", to: "cache2" },
          { id: "e7", from: "fanout", to: "cache3" },
        ],
        steps: [
          {
            title: "User posts a tweet",
            description: "The client sends a POST /tweet request to the Write API.",
            activeNodes: ["user", "api"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", label: "tweet", color: "#22d3ee" }],
          },
          {
            title: "Tweet persisted",
            description:
              "API writes to a sharded tweet DB using a Snowflake ID for global ordering.",
            activeNodes: ["api", "db"],
            activeEdges: ["e2"],
            packets: [{ edgeId: "e2", color: "#10b981" }],
          },
          {
            title: "Check author follower count",
            description:
              "If author is a celebrity (> 10K followers), we SKIP fan-out to avoid 100M writes.",
            activeNodes: ["api", "classifier"],
            activeEdges: ["e3"],
            notes: [
              "Regular user → push model",
              "Celebrity → pull model at read time",
            ],
            packets: [{ edgeId: "e3", color: "#f59e0b" }],
          },
          {
            title: "Fan-out worker activates",
            description: "For regular users, classifier tells worker to push to every follower.",
            activeNodes: ["classifier", "fanout"],
            activeEdges: ["e4"],
            packets: [{ edgeId: "e4", label: "push", color: "#f59e0b" }],
          },
          {
            title: "Parallel push to timelines",
            description:
              "Worker fans out to every follower's home timeline cache in parallel Redis writes.",
            activeNodes: ["fanout", "cache1", "cache2", "cache3"],
            activeEdges: ["e5", "e6", "e7"],
            packets: [
              { edgeId: "e5", color: "#dc2626" },
              { edgeId: "e6", color: "#dc2626" },
              { edgeId: "e7", color: "#dc2626" },
            ],
          },
          {
            title: "Tweet is live",
            description:
              "Each follower's timeline cache is updated. When they open the app, the feed is pre-computed.",
            activeNodes: ["cache1", "cache2", "cache3"],
            notes: [
              "Reads served in < 10ms from Redis",
              "Celebrity tweets merged in at read time",
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 2. Uber / Ride-sharing
  // ============================================================
  {
    id: "ride-sharing",
    slug: "ride-sharing",
    title: "Uber / Ride-Sharing System",
    icon: "🚕",
    difficulty: "hard",
    category: "Location",
    description:
      "Design Uber: real-time driver matching, geospatial indexing, surge pricing, and trip state machines.",
    realWorld: ["Uber", "Lyft", "Didi", "Bolt", "Grab"],
    diagram: `graph TD
    R[Rider App] -->|Request ride| A[Dispatch Service]
    D[Driver App] -->|Location ping every 4s| L[Location Service]
    L --> G[(Geo Index / QuadTree)]
    A --> G
    A --> M[Matching Engine]
    M -->|Match| D
    M -->|Confirm| R
    A --> S[Surge Pricing]
    A --> T[(Trip DB)]
    T --> P[Payment Service]
    style M fill:#F59E0B,color:#000
    style G fill:#059669,color:#fff
    style S fill:#DC2626,color:#fff`,
    scaleMetrics: [
      { label: "Drivers online", value: "5M", hint: "Peak concurrent" },
      { label: "Location pings", value: "1.2M/sec", hint: "Every 4s per driver" },
      { label: "Requests/sec", value: "15K", hint: "Peak ride requests" },
      { label: "Match latency", value: "< 3s", hint: "Rider → driver ETA" },
    ],
    tradeoffs: [
      {
        option: "Geohash grid",
        pros: ["Simple lookup", "Works with any KV store"],
        cons: ["Fixed cell size = dense areas overflow", "Boundary-crossing bugs"],
      },
      {
        option: "QuadTree (Uber's H3)",
        pros: ["Adaptive density", "Hierarchical zoom queries"],
        cons: ["More complex to maintain", "Rebuild cost on heavy churn"],
      },
    ],
    content: `## Ride-Sharing System

### Core Challenge

Match a rider with the nearest available driver in under 3 seconds while
handling 1M+ location updates per second.

### Geospatial Index

Dense urban areas have thousands of drivers per sq km. A fixed grid won't work.

**H3 / QuadTree Hierarchy:**
- Divide the map into hexagonal cells
- Subdivide dense cells until each contains ≤ N drivers
- Parent cells aggregate child counts for fast "drivers nearby?" queries

### Driver Location Updates

\`\`\`
Every 4 seconds:
  Driver app → Location Service (UDP or HTTP/2)
  Location Service updates in-memory geo index (Redis with GEOADD)
  Recent locations also written to Cassandra for trip history
\`\`\`

### Matching Algorithm

1. **Candidate search:** Find all drivers within N km of pickup
2. **Filter:** Vehicle type, rating, recent cancellations
3. **Score:** ETA + driver rating + distance from pickup
4. **Offer:** Send push notification to top-ranked driver
5. **Timeout:** If no accept in 15s → offer to next driver
6. **Assign:** On accept, trip state → MATCHED

### Trip State Machine

\`\`\`
REQUESTED → MATCHED → EN_ROUTE → ARRIVED →
TRIP_STARTED → TRIP_ENDED → PAID → RATED
\`\`\`

Each transition triggers events on Kafka for downstream services
(analytics, ETA re-estimation, driver earnings, fraud checks).

### Surge Pricing

- Demand / Supply ratio per cell, updated every 30s
- Multiplier = max(1.0, demand / supply × sensitivity)
- Cap at 3.0x to avoid PR disasters
- Notify riders before confirming trip

### Payment

- Pre-authorize card at trip start (hold estimated fare)
- Capture actual fare at trip end
- Split: driver payout (70-80%), commission, taxes, tips
`,
    keyTakeaways: [
      "Hierarchical geospatial index (H3) for adaptive density",
      "4-second location pings balance freshness vs. battery",
      "Trip state machine with Kafka events drives every downstream service",
      "Surge = demand/supply × sensitivity, updated per cell",
    ],
    animations: [
      {
        id: "ride-match",
        title: "Matching a Rider to the Nearest Driver",
        description:
          "From the moment a rider taps 'Request' to a driver heading their way.",
        intervalMs: 2600,
        nodes: [
          { id: "rider", label: "Rider", icon: "🧍", x: 8, y: 50, kind: "client" },
          { id: "dispatch", label: "Dispatch", icon: "🎯", x: 28, y: 50, kind: "service" },
          { id: "geo", label: "Geo Index", icon: "🗺️", x: 48, y: 25, kind: "db" },
          { id: "match", label: "Matcher", icon: "⚙️", x: 48, y: 75, kind: "service" },
          { id: "d1", label: "Driver A", icon: "🚗", x: 72, y: 20, kind: "client" },
          { id: "d2", label: "Driver B", icon: "🚗", x: 72, y: 50, kind: "client" },
          { id: "d3", label: "Driver C", icon: "🚗", x: 72, y: 80, kind: "client" },
          { id: "trip", label: "Trip DB", icon: "🗄️", x: 92, y: 50, kind: "db" },
        ],
        edges: [
          { id: "r-d", from: "rider", to: "dispatch", label: "request" },
          { id: "d-g", from: "dispatch", to: "geo", label: "nearby?" },
          { id: "g-m", from: "geo", to: "match", label: "3 candidates" },
          { id: "m-d1", from: "match", to: "d1" },
          { id: "m-d2", from: "match", to: "d2" },
          { id: "m-d3", from: "match", to: "d3" },
          { id: "d2-m", from: "d2", to: "match", label: "accept" },
          { id: "m-trip", from: "match", to: "trip" },
          { id: "d-r", from: "dispatch", to: "rider", label: "matched!" },
        ],
        steps: [
          {
            title: "Rider taps 'Request'",
            description: "Rider app sends pickup coordinates to the Dispatch service.",
            activeNodes: ["rider", "dispatch"],
            activeEdges: ["r-d"],
            packets: [{ edgeId: "r-d", label: "req", color: "#22d3ee" }],
          },
          {
            title: "Query the geo index",
            description:
              "Dispatch asks the H3-based geo index for drivers within 2km of pickup.",
            activeNodes: ["dispatch", "geo"],
            activeEdges: ["d-g"],
            packets: [{ edgeId: "d-g", color: "#0ea5e9" }],
          },
          {
            title: "Geo index returns candidates",
            description: "Three nearest drivers returned, ranked by ETA and rating.",
            activeNodes: ["geo", "match"],
            activeEdges: ["g-m"],
            notes: ["Driver A: 4 min ETA", "Driver B: 2 min ETA ✅", "Driver C: 6 min ETA"],
            packets: [{ edgeId: "g-m", color: "#10b981" }],
          },
          {
            title: "Offer sent to best driver",
            description: "Matcher pushes offer to Driver B (shortest ETA + highest rating).",
            activeNodes: ["match", "d2"],
            activeEdges: ["m-d2"],
            packets: [{ edgeId: "m-d2", label: "offer", color: "#f59e0b" }],
          },
          {
            title: "Driver accepts",
            description: "Driver B taps 'Accept' within the 15s window.",
            activeNodes: ["d2", "match"],
            activeEdges: ["d2-m"],
            packets: [{ edgeId: "d2-m", label: "✓", color: "#10b981" }],
          },
          {
            title: "Trip created",
            description:
              "Trip row inserted (state=MATCHED), Kafka event emitted, rider gets ETA.",
            activeNodes: ["match", "trip", "dispatch", "rider"],
            activeEdges: ["m-trip", "d-r"],
            packets: [
              { edgeId: "m-trip", color: "#059669" },
              { edgeId: "d-r", label: "ETA 2m", color: "#22d3ee" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 3. Google Drive / Dropbox
  // ============================================================
  {
    id: "cloud-storage",
    slug: "cloud-storage",
    title: "Dropbox / Google Drive",
    icon: "📁",
    difficulty: "hard",
    category: "Storage",
    description:
      "Design a cloud file sync service with deduplication, delta sync, end-to-end encryption, and real-time collaboration.",
    realWorld: ["Dropbox", "Google Drive", "OneDrive", "iCloud"],
    diagram: `graph TD
    C[Client] -->|Chunk + hash| M[Metadata Service]
    C -->|Upload new chunks| B[Block Storage]
    B --> S[(S3 / Object Store)]
    M --> D[(Metadata DB)]
    M --> N[Notification Service]
    N -->|WebSocket| C2[Other devices]
    C2 -->|Sync| M
    C2 -->|Fetch chunks| B
    style B fill:#4F46E5,color:#fff
    style S fill:#059669,color:#fff
    style N fill:#DC2626,color:#fff`,
    scaleMetrics: [
      { label: "Users", value: "700M", hint: "Dropbox scale" },
      { label: "Files stored", value: "500B+", hint: "Trillions of objects" },
      { label: "Storage", value: "1+ Exabyte" },
      { label: "Dedup savings", value: "~40%", hint: "Of raw uploads" },
    ],
    content: `## Cloud File Sync

### Chunk-level Deduplication

Instead of uploading whole files:
1. Client splits file into **4 MB chunks** (content-defined chunking helps)
2. SHA-256 hash each chunk
3. Send hash list to metadata service → server replies which chunks are new
4. Client uploads only new chunks to block storage

Result: Moving a 1 GB file renames metadata but uploads 0 bytes. Dropping
the same photo twice uploads it once. Real-world savings: ~40%.

### Delta Sync

When a file changes:
1. Client re-chunks the modified file
2. Computes diff vs. previous chunk list
3. Uploads only changed chunks
4. Metadata service updates the chunk manifest

### Metadata Schema

\`\`\`
files: (file_id, user_id, path, version, size, created_at, updated_at)
blocks: (block_hash, size, s3_key, ref_count)
file_blocks: (file_id, version, block_index, block_hash)
\`\`\`

Ref-counting blocks enables garbage collection when all referencing files
are deleted.

### Sync Protocol

- Client maintains a local **sync cursor** (last known version)
- On change elsewhere → push notification via long-lived WebSocket
- Client pulls metadata diff → downloads only changed chunks
- Conflicts: last-writer-wins, conflicting copy saved with suffix

### Collaboration (Google Docs–style)

- **Operational Transformation (OT)** or **CRDTs** for concurrent edits
- Each edit broadcast via WebSocket to all connected clients
- Server maintains authoritative document state
- Periodic snapshots written to disk; operations appended between snapshots
`,
    keyTakeaways: [
      "Chunk-level dedup = massive storage savings",
      "Delta sync: upload only changed chunks, not full files",
      "Reference counting + GC for safe block reuse",
      "CRDTs/OT power real-time collaborative editing",
    ],
    animations: [
      {
        id: "dedup-upload",
        title: "Uploading with Chunk Deduplication",
        description: "How Dropbox avoids uploading bytes the server already has.",
        intervalMs: 2600,
        nodes: [
          { id: "c", label: "Client", icon: "💻", x: 10, y: 50, kind: "client" },
          { id: "chunker", label: "Chunker", icon: "✂️", x: 30, y: 50, kind: "worker" },
          { id: "meta", label: "Metadata API", icon: "📇", x: 55, y: 30, kind: "service" },
          { id: "blocks", label: "Block Service", icon: "📦", x: 55, y: 70, kind: "service" },
          { id: "mdb", label: "Metadata DB", icon: "🗄️", x: 82, y: 20, kind: "db" },
          { id: "s3", label: "Object Store", icon: "☁️", x: 82, y: 75, kind: "storage" },
        ],
        edges: [
          { id: "e1", from: "c", to: "chunker", label: "file" },
          { id: "e2", from: "chunker", to: "meta", label: "hash list" },
          { id: "e3", from: "meta", to: "mdb", label: "lookup hashes" },
          { id: "e4", from: "meta", to: "chunker", label: "missing: 2/10" },
          { id: "e5", from: "chunker", to: "blocks", label: "2 new chunks" },
          { id: "e6", from: "blocks", to: "s3", label: "store" },
          { id: "e7", from: "blocks", to: "meta", label: "ack" },
          { id: "e8", from: "meta", to: "mdb", label: "commit version" },
        ],
        steps: [
          {
            title: "Client picks a file",
            description: "User drops a 40 MB PDF into the sync folder.",
            activeNodes: ["c", "chunker"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", color: "#22d3ee" }],
          },
          {
            title: "Split into 4 MB chunks + hash",
            description: "File → 10 chunks, each SHA-256 hashed locally.",
            activeNodes: ["chunker"],
            notes: ["Chunk boundaries use content-defined chunking for stability on edits"],
          },
          {
            title: "Send hash list to metadata API",
            description: "Tiny payload (320 bytes) instead of 40 MB.",
            activeNodes: ["chunker", "meta"],
            activeEdges: ["e2"],
            packets: [{ edgeId: "e2", color: "#0ea5e9" }],
          },
          {
            title: "Lookup existing blocks",
            description: "Server checks which hashes already exist across all users.",
            activeNodes: ["meta", "mdb"],
            activeEdges: ["e3"],
            packets: [{ edgeId: "e3", color: "#10b981" }],
          },
          {
            title: "Server reports missing chunks",
            description: "Only 2 of 10 chunks are new — the rest are dedup'd.",
            activeNodes: ["meta", "chunker"],
            activeEdges: ["e4"],
            packets: [{ edgeId: "e4", label: "2/10", color: "#f59e0b", reverse: false }],
          },
          {
            title: "Upload only the 2 new chunks",
            description: "Client streams just 8 MB to the block service.",
            activeNodes: ["chunker", "blocks", "s3"],
            activeEdges: ["e5", "e6"],
            packets: [
              { edgeId: "e5", color: "#dc2626" },
              { edgeId: "e6", color: "#059669" },
            ],
          },
          {
            title: "Metadata commits new version",
            description: "File manifest saved. Other devices get a push notification.",
            activeNodes: ["blocks", "meta", "mdb"],
            activeEdges: ["e7", "e8"],
            packets: [
              { edgeId: "e7", color: "#10b981" },
              { edgeId: "e8", color: "#10b981" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 4. Web Crawler (deep dive, distinct from search-engine)
  // ============================================================
  {
    id: "web-crawler",
    slug: "web-crawler",
    title: "Distributed Web Crawler",
    icon: "🕷️",
    difficulty: "hard",
    category: "Data Systems",
    description:
      "Design a polite, distributed web crawler that fetches billions of pages with freshness guarantees.",
    realWorld: ["Googlebot", "Bingbot", "Common Crawl"],
    diagram: `graph TD
    S[Seed URLs] --> F[URL Frontier]
    F -->|Priority queue| FW[Fetcher Workers]
    FW -->|robots.txt check| R[Robots Cache]
    FW -->|HTTP GET| WEB[The Web]
    FW --> PP[Parser]
    PP -->|Links| F
    PP -->|Content| DS[(Doc Store)]
    PP -->|Dedup hash| BF[Bloom Filter]
    DS --> IDX[Indexer]
    style F fill:#F59E0B,color:#000
    style BF fill:#DC2626,color:#fff
    style WEB fill:#4F46E5,color:#fff`,
    content: `## Distributed Web Crawler

### Politeness Constraints

- Respect **robots.txt** (cache per domain, refresh every 24h)
- Rate limit per domain (e.g., 1 request per 2 seconds)
- Obey \`Crawl-Delay\` header
- User-Agent identifies the bot with contact info

### URL Frontier

Priority queue of URLs to crawl. Two dimensions:
1. **Priority queues** per importance tier (high/medium/low)
2. **Per-host queues** to enforce politeness — each host gets its own queue

A worker picks a host, not a URL. One worker owns a host at a time.

### Dedup & Revisit

- **Bloom filter** for "have we seen this URL?" — 1B URLs in ~1.2 GB
- Content hash (SHA-1 of normalized HTML) to detect mirrors
- Revisit schedule: Homepage daily, article pages weekly, archived pages monthly

### Parsing

- Extract links via HTML parser (lenient — web is messy)
- Normalize URLs: lowercase host, strip fragments, resolve relative paths
- Skip binary files unless targeting images/video
- Respect \`<meta name="robots" content="nofollow">\`

### Scale

\`\`\`
10B pages × 100 KB avg = 1 PB
Recrawl every 30 days → 333M fetches/day = 3.8K/sec
Need ~5000 fetcher workers for 2s avg fetch time
\`\`\`
`,
    keyTakeaways: [
      "URL frontier = priority queue + per-host politeness queue",
      "Bloom filter dedups URLs with tiny memory footprint",
      "Content hash catches mirrors and duplicate content",
      "Revisit schedule depends on page type (news vs. archive)",
    ],
    animations: [
      {
        id: "crawl-cycle",
        title: "One Crawl Cycle",
        description: "From URL dequeue to content storage and new links.",
        intervalMs: 2400,
        nodes: [
          { id: "frontier", label: "Frontier", icon: "📋", x: 10, y: 50, kind: "queue" },
          { id: "worker", label: "Fetcher", icon: "🤖", x: 32, y: 50, kind: "worker" },
          { id: "robots", label: "Robots Cache", icon: "🤔", x: 32, y: 15, kind: "cache" },
          { id: "web", label: "The Web", icon: "🌐", x: 55, y: 50, kind: "external" },
          { id: "parser", label: "Parser", icon: "📄", x: 78, y: 50, kind: "worker" },
          { id: "bloom", label: "Bloom Filter", icon: "🧪", x: 78, y: 15, kind: "cache" },
          { id: "store", label: "Doc Store", icon: "🗄️", x: 92, y: 80, kind: "storage" },
        ],
        edges: [
          { id: "e1", from: "frontier", to: "worker", label: "dequeue URL" },
          { id: "e2", from: "worker", to: "robots", label: "allowed?" },
          { id: "e3", from: "worker", to: "web", label: "HTTP GET" },
          { id: "e4", from: "web", to: "worker", label: "200 OK" },
          { id: "e5", from: "worker", to: "parser" },
          { id: "e6", from: "parser", to: "store", label: "save" },
          { id: "e7", from: "parser", to: "bloom", label: "new links?" },
          { id: "e8", from: "parser", to: "frontier", label: "enqueue" },
        ],
        steps: [
          {
            title: "Dequeue a URL",
            description:
              "Worker picks the highest-priority URL whose host is not currently being crawled.",
            activeNodes: ["frontier", "worker"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", color: "#22d3ee" }],
          },
          {
            title: "Check robots.txt",
            description: "Lookup cached robots.txt. If disallowed, skip and requeue later.",
            activeNodes: ["worker", "robots"],
            activeEdges: ["e2"],
            packets: [{ edgeId: "e2", color: "#f59e0b" }],
          },
          {
            title: "Fetch the page",
            description: "HTTP GET with proper User-Agent and If-Modified-Since.",
            activeNodes: ["worker", "web"],
            activeEdges: ["e3"],
            packets: [{ edgeId: "e3", color: "#0ea5e9" }],
          },
          {
            title: "Receive HTML",
            description: "Page returned. Check status, Content-Type, size limits.",
            activeNodes: ["web", "worker"],
            activeEdges: ["e4"],
            packets: [{ edgeId: "e4", label: "HTML", color: "#10b981" }],
          },
          {
            title: "Parse for content + links",
            description: "Extract text, links, metadata. Normalize all URLs.",
            activeNodes: ["worker", "parser"],
            activeEdges: ["e5"],
            packets: [{ edgeId: "e5", color: "#8b5cf6" }],
          },
          {
            title: "Dedup new links via Bloom filter",
            description: "Filter out URLs we've already seen. Bloom filter is ~99% accurate.",
            activeNodes: ["parser", "bloom"],
            activeEdges: ["e7"],
            packets: [{ edgeId: "e7", color: "#dc2626" }],
          },
          {
            title: "Store content & enqueue new URLs",
            description: "Content persisted, new URLs pushed to frontier for future crawls.",
            activeNodes: ["parser", "store", "frontier"],
            activeEdges: ["e6", "e8"],
            packets: [
              { edgeId: "e6", color: "#059669" },
              { edgeId: "e8", color: "#22d3ee" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 5. Typeahead / Autocomplete
  // ============================================================
  {
    id: "autocomplete",
    slug: "autocomplete",
    title: "Typeahead / Autocomplete",
    icon: "⌨️",
    difficulty: "medium",
    category: "Data Systems",
    description:
      "Design a Google-style typeahead that returns top suggestions in under 100ms as the user types.",
    realWorld: ["Google Search", "Amazon Search", "LinkedIn", "YouTube"],
    diagram: `graph LR
    U[User Types] --> API[Autocomplete API]
    API --> C[(Prefix Cache)]
    C -->|Miss| T[Trie Service]
    T --> DB[(Suggestion DB)]
    L[Query Log] --> AGG[Aggregator]
    AGG --> T
    style C fill:#DC2626,color:#fff
    style T fill:#4F46E5,color:#fff
    style AGG fill:#F59E0B,color:#000`,
    content: `## Typeahead / Autocomplete

### Requirements

- Suggest top-5 completions as user types each key
- Return in < 100ms (perceived as instant)
- Reflect recent trends (today's news, viral topics)
- Personalize based on user history

### Data Structure: Trie with Top-k Cache

Plain trie gives O(L) prefix lookup but then we'd walk the subtree to find
top suggestions — too slow.

**Optimization:** Store **top-k suggestions at every trie node**.

\`\`\`
       (root)
       /  |  \\
     "a" "b" "c"
      |
     "ap" → top5: ["apple", "app", "apartment", "apply", "appointment"]
\`\`\`

Tradeoff: Higher memory for O(L) lookup + O(1) top-k retrieval.

### Query Aggregation Pipeline

- **Kafka stream** of user queries
- **Flink/Spark job** aggregates counts per prefix over sliding windows (1h, 24h, 7d)
- Trie rebuilt nightly + incremental top-k updates hourly
- Weight recent queries higher (exponential decay)

### Sharding

- Shard trie by first 2 characters of prefix
- 26² = 676 possible shards → distribute across fewer physical nodes
- Each node holds ~100-1000 prefix shards

### Caching

- CDN-level cache for popular prefixes (edge-side)
- Redis for hot prefix → top-5 lookups
- Cache hit rate should be 80%+ for common prefixes

### Personalization

- Client-side reranking with user history
- Keep personalization on device to avoid leaking PII
`,
    keyTakeaways: [
      "Pre-compute top-k at every trie node for O(1) retrieval after O(L) traversal",
      "Shard by prefix — 2-char prefix gives 676 natural shards",
      "Aggregate query logs through Kafka + streaming job",
      "Cache hot prefixes at the edge; 80%+ hit rate is achievable",
    ],
    animations: [
      {
        id: "typeahead-query",
        title: "A Single Keystroke",
        description: "User types 'ap' and sees suggestions before finishing the word.",
        intervalMs: 2200,
        nodes: [
          { id: "u", label: "User", icon: "👤", x: 8, y: 50, kind: "client" },
          { id: "api", label: "API", icon: "🟢", x: 30, y: 50, kind: "service" },
          { id: "cache", label: "Edge Cache", icon: "⚡", x: 50, y: 25, kind: "cache" },
          { id: "trie", label: "Trie Node", icon: "🌳", x: 50, y: 75, kind: "service" },
          { id: "agg", label: "Aggregator", icon: "📊", x: 78, y: 50, kind: "worker" },
          { id: "kafka", label: "Query Log", icon: "📜", x: 92, y: 50, kind: "queue" },
        ],
        edges: [
          { id: "e1", from: "u", to: "api", label: "'ap'" },
          { id: "e2", from: "api", to: "cache", label: "check" },
          { id: "e3", from: "cache", to: "trie", label: "miss" },
          { id: "e4", from: "trie", to: "api", label: "top5" },
          { id: "e5", from: "api", to: "u", label: "apple, app…" },
          { id: "e6", from: "api", to: "kafka", label: "log" },
          { id: "e7", from: "kafka", to: "agg" },
          { id: "e8", from: "agg", to: "trie", label: "update top-k" },
        ],
        steps: [
          {
            title: "User types 'ap'",
            description: "Client debounces keystrokes (100ms) then sends prefix.",
            activeNodes: ["u", "api"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", label: "ap", color: "#22d3ee" }],
          },
          {
            title: "Check edge cache",
            description: "80% of common prefixes are served from here.",
            activeNodes: ["api", "cache"],
            activeEdges: ["e2"],
            packets: [{ edgeId: "e2", color: "#dc2626" }],
          },
          {
            title: "Cache miss → trie lookup",
            description: "Walk the trie to node 'ap', return pre-computed top-5.",
            activeNodes: ["cache", "trie"],
            activeEdges: ["e3"],
            packets: [{ edgeId: "e3", color: "#f59e0b" }],
          },
          {
            title: "Return top-5 suggestions",
            description: "apple, app, apartment, apply, appointment.",
            activeNodes: ["trie", "api", "u"],
            activeEdges: ["e4", "e5"],
            packets: [
              { edgeId: "e4", color: "#10b981" },
              { edgeId: "e5", label: "apple…", color: "#10b981" },
            ],
          },
          {
            title: "Log the query async",
            description: "Feed the query stream to train future top-k rankings.",
            activeNodes: ["api", "kafka"],
            activeEdges: ["e6"],
            packets: [{ edgeId: "e6", color: "#8b5cf6" }],
          },
          {
            title: "Aggregator updates trie",
            description: "Streaming job recomputes top-k periodically.",
            activeNodes: ["kafka", "agg", "trie"],
            activeEdges: ["e7", "e8"],
            packets: [
              { edgeId: "e7", color: "#f59e0b" },
              { edgeId: "e8", color: "#0ea5e9" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 6. Consistent Hashing (visual deep dive)
  // ============================================================
  {
    id: "consistent-hashing",
    slug: "consistent-hashing",
    title: "Consistent Hashing",
    icon: "🔄",
    difficulty: "medium",
    category: "Fundamentals",
    description:
      "The algorithm behind DynamoDB, Cassandra, and every distributed cache. Understand it visually.",
    diagram: `graph TD
    K1[Key: user_123] -->|hash| R[Hash Ring]
    R --> N1[Node A]
    R --> N2[Node B]
    R --> N3[Node C]
    K2[Key: photo_99] -->|hash| R
    style R fill:#4F46E5,color:#fff`,
    content: `## Consistent Hashing

### The Problem

Naive sharding: \`server = hash(key) % N\`

If you add a server → N changes → **every key remaps**. Catastrophic cache invalidation.

### The Solution

1. Map servers to positions on a conceptual circle (0 to 2³²)
2. Map keys to positions on the same circle
3. Each key belongs to the **next clockwise server**

When a server is added/removed, only keys between it and its neighbor move.
**Expected movement: K/N keys** (where K = total keys, N = servers).

### Virtual Nodes

Naive: one position per server → load imbalance.

**Virtual nodes:** Each physical server owns 100-200 positions on the ring.
Law of large numbers evens out load and provides smooth rebalancing.

### Replication

Walk clockwise from the primary node and take the next N-1 distinct
physical servers as replicas.

### Where It's Used

- **DynamoDB, Cassandra:** Data partitioning
- **Memcached, Redis Cluster:** Cache distribution
- **Akamai CDN:** Content routing
- **Discord:** Voice server assignment

### Alternative: Rendezvous Hashing (HRW)

For each key, compute \`hash(key, server_i)\` for every server.
Pick the server with the highest score. Also O(1) movement on add/remove.
Simpler but O(N) per lookup.
`,
    keyTakeaways: [
      "Consistent hashing limits data movement to K/N keys on cluster changes",
      "Virtual nodes (100-200 per physical node) smooth out load distribution",
      "Replication = walk clockwise N-1 more distinct servers",
      "Rendezvous hashing is a simpler alternative with similar guarantees",
    ],
    animations: [
      {
        id: "ring-rebalance",
        title: "Adding a Node to the Ring",
        description: "Only a fraction of keys move when we add a new node.",
        intervalMs: 2500,
        nodes: [
          { id: "k1", label: "key:user_1", icon: "🔑", x: 10, y: 20, kind: "client" },
          { id: "k2", label: "key:photo", icon: "🔑", x: 10, y: 50, kind: "client" },
          { id: "k3", label: "key:order", icon: "🔑", x: 10, y: 80, kind: "client" },
          { id: "ring", label: "Hash Ring", icon: "🔄", x: 40, y: 50, kind: "service" },
          { id: "a", label: "Node A", icon: "🟢", x: 70, y: 20, kind: "db" },
          { id: "b", label: "Node B", icon: "🟢", x: 70, y: 55, kind: "db" },
          { id: "c", label: "Node C", icon: "🟢", x: 70, y: 85, kind: "db" },
          { id: "d", label: "Node D (new)", icon: "✨", x: 92, y: 55, kind: "cache" },
        ],
        edges: [
          { id: "k1-r", from: "k1", to: "ring" },
          { id: "k2-r", from: "k2", to: "ring" },
          { id: "k3-r", from: "k3", to: "ring" },
          { id: "r-a", from: "ring", to: "a" },
          { id: "r-b", from: "ring", to: "b" },
          { id: "r-c", from: "ring", to: "c" },
          { id: "b-d", from: "b", to: "d", label: "1/4 keys migrate", dashed: true },
        ],
        steps: [
          {
            title: "Initial state",
            description: "3 nodes on the ring, keys evenly distributed.",
            activeNodes: ["a", "b", "c", "ring"],
          },
          {
            title: "Hash each key to a ring position",
            description: "Keys hash to a point, go clockwise to find their owner.",
            activeNodes: ["k1", "k2", "k3", "ring"],
            activeEdges: ["k1-r", "k2-r", "k3-r"],
            packets: [
              { edgeId: "k1-r", color: "#22d3ee" },
              { edgeId: "k2-r", color: "#22d3ee" },
              { edgeId: "k3-r", color: "#22d3ee" },
            ],
          },
          {
            title: "Keys routed to owners",
            description: "key:user_1 → A, key:photo → B, key:order → C.",
            activeNodes: ["ring", "a", "b", "c"],
            activeEdges: ["r-a", "r-b", "r-c"],
            packets: [
              { edgeId: "r-a", color: "#10b981" },
              { edgeId: "r-b", color: "#10b981" },
              { edgeId: "r-c", color: "#10b981" },
            ],
          },
          {
            title: "Add Node D",
            description: "New node joins between B and C on the ring.",
            activeNodes: ["d"],
          },
          {
            title: "Only 1/N keys move",
            description:
              "Only keys between B's and D's positions move. A's and C's keys are untouched.",
            activeNodes: ["b", "d"],
            activeEdges: ["b-d"],
            notes: [
              "Naive hash(key) % N would rehash ALL keys",
              "Consistent hashing rehashes only ~25% with 4 nodes",
            ],
            packets: [{ edgeId: "b-d", color: "#f59e0b" }],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 7. Real-time Leaderboard
  // ============================================================
  {
    id: "leaderboard",
    slug: "leaderboard",
    title: "Real-Time Leaderboard",
    icon: "🏆",
    difficulty: "medium",
    category: "Gaming",
    description:
      "Design a global leaderboard that ranks 10M+ players with sub-second updates and fast 'my rank' lookups.",
    realWorld: ["Fortnite", "League of Legends", "Stack Overflow", "Strava"],
    diagram: `graph LR
    P[Player Action] --> GS[Game Service]
    GS --> K[Kafka]
    K --> SW[Score Worker]
    SW --> RZ[(Redis Sorted Set)]
    RZ --> LB[Leaderboard API]
    LB --> C[Client]
    SW --> DB[(Durable DB)]
    style RZ fill:#DC2626,color:#fff
    style K fill:#F59E0B,color:#000`,
    content: `## Real-Time Leaderboard

### Core Data Structure: Sorted Set

Redis sorted sets give us exactly what we need:

\`\`\`
ZADD leaderboard 9500 "player:123"    → O(log N)
ZREVRANK leaderboard "player:123"     → O(log N)  "what rank am I?"
ZREVRANGE leaderboard 0 9 WITHSCORES  → O(log N + M)  "top 10"
ZINCRBY leaderboard 100 "player:123"  → O(log N)  "score +100"
\`\`\`

**10M players in one sorted set consumes ~400 MB.** Fits in RAM easily.

### Write Path

Game events flow through Kafka → score worker → Redis + durable DB.

Why Kafka? Decouples game server from leaderboard service and provides
replayability. If Redis dies, replay events to rebuild.

### Partitioning for Scale

Single sorted set maxes around 100M members. For 1B+ players:

1. **Shard by region:** NA, EU, APAC leaderboards
2. **Global leaderboard:** Aggregation job merges top-K from each shard
3. **Player percentile:** Use bucketing (top 1%, top 10%) instead of exact rank

### Time-Based Leaderboards

- **Daily/weekly boards:** Separate sorted set per period
- Use TTL to auto-expire old boards
- Archive to cold storage for historical records

### Approximate Rank for Massive Scale

At 100M+ players, exact rank is expensive. Alternatives:
- **Rank by bucket:** Map score to bucket, show "rank #~12,345"
- **Percentile only:** "You're in the top 3%"
- **T-Digest** for distribution-aware percentile estimation

### Anti-Cheat

- Rate limit score updates per player
- Validate server-side (never trust client-reported scores)
- Sudden rank jumps trigger review
`,
    keyTakeaways: [
      "Redis sorted set: O(log N) updates, ranks, and top-K queries",
      "Kafka between game server and leaderboard gives replay + decoupling",
      "Shard by region for >100M players; aggregate for global view",
      "Use percentiles or bucketed ranks for massive-scale boards",
    ],
    animations: [
      {
        id: "score-update",
        title: "Score Update → Leaderboard",
        description: "Player scores a goal — watch the rank update flow.",
        intervalMs: 2400,
        nodes: [
          { id: "p", label: "Player", icon: "🎮", x: 8, y: 50, kind: "client" },
          { id: "game", label: "Game Server", icon: "🕹️", x: 28, y: 50, kind: "service" },
          { id: "k", label: "Kafka", icon: "📨", x: 48, y: 50, kind: "queue" },
          { id: "worker", label: "Score Worker", icon: "⚙️", x: 68, y: 50, kind: "worker" },
          { id: "redis", label: "Redis ZSET", icon: "⚡", x: 88, y: 25, kind: "cache" },
          { id: "db", label: "Durable DB", icon: "🗄️", x: 88, y: 75, kind: "db" },
          { id: "client", label: "Any Client", icon: "👥", x: 28, y: 15, kind: "client" },
          { id: "api", label: "Board API", icon: "📊", x: 58, y: 15, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "p", to: "game", label: "+100 pts" },
          { id: "e2", from: "game", to: "k", label: "event" },
          { id: "e3", from: "k", to: "worker" },
          { id: "e4", from: "worker", to: "redis", label: "ZINCRBY" },
          { id: "e5", from: "worker", to: "db", label: "persist" },
          { id: "e6", from: "client", to: "api", label: "top 10?" },
          { id: "e7", from: "api", to: "redis", label: "ZREVRANGE" },
          { id: "e8", from: "redis", to: "api" },
          { id: "e9", from: "api", to: "client", label: "leaderboard" },
        ],
        steps: [
          {
            title: "Player scores",
            description: "Client reports 'kill +100'. Server validates.",
            activeNodes: ["p", "game"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", label: "+100", color: "#22d3ee" }],
          },
          {
            title: "Emit Kafka event",
            description: "Decouples game server from leaderboard. Durable & replayable.",
            activeNodes: ["game", "k"],
            activeEdges: ["e2"],
            packets: [{ edgeId: "e2", color: "#f59e0b" }],
          },
          {
            title: "Worker consumes",
            description: "Score worker picks up event, applies update atomically.",
            activeNodes: ["k", "worker"],
            activeEdges: ["e3"],
            packets: [{ edgeId: "e3", color: "#f59e0b" }],
          },
          {
            title: "Update Redis sorted set",
            description: "ZINCRBY in O(log N). Rank is now correct globally.",
            activeNodes: ["worker", "redis"],
            activeEdges: ["e4"],
            packets: [{ edgeId: "e4", color: "#dc2626" }],
          },
          {
            title: "Persist to durable store",
            description:
              "Durable DB for recovery. Redis is fast but volatile.",
            activeNodes: ["worker", "db"],
            activeEdges: ["e5"],
            packets: [{ edgeId: "e5", color: "#059669" }],
          },
          {
            title: "Any client can query",
            description: "ZREVRANGE returns top 10 in milliseconds.",
            activeNodes: ["client", "api", "redis"],
            activeEdges: ["e6", "e7", "e8", "e9"],
            packets: [
              { edgeId: "e6", color: "#22d3ee" },
              { edgeId: "e7", color: "#dc2626" },
              { edgeId: "e8", color: "#10b981" },
              { edgeId: "e9", color: "#10b981" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 8. Collaborative Editor (Google Docs)
  // ============================================================
  {
    id: "collaborative-editor",
    slug: "collaborative-editor",
    title: "Collaborative Editor (Google Docs)",
    icon: "✍️",
    difficulty: "hard",
    category: "Real-Time",
    description:
      "Design a multi-user collaborative editor with conflict-free concurrent edits using OT or CRDTs.",
    realWorld: ["Google Docs", "Notion", "Figma", "Linear", "Quip"],
    diagram: `graph TD
    A[User A] -->|Edit op| WS1[WS Server 1]
    B[User B] -->|Edit op| WS2[WS Server 2]
    WS1 --> OT[OT Engine]
    WS2 --> OT
    OT --> DOC[(Document State)]
    OT --> PubSub[Redis Pub/Sub]
    PubSub --> WS1
    PubSub --> WS2
    DOC --> Snap[Snapshot Job]
    Snap --> S3[(Blob Store)]
    style OT fill:#F59E0B,color:#000
    style PubSub fill:#DC2626,color:#fff`,
    content: `## Collaborative Editor

### The Hard Problem

Two users edit the same document simultaneously. Their edits arrive out of order.
How do we converge to a consistent state without losing edits?

### Operational Transformation (OT)

Each edit is an **operation**: \`insert(pos, char)\` or \`delete(pos, len)\`.

When an op arrives that was generated against an older document state,
**transform** it against intervening ops.

\`\`\`
Initial: "abc"
Alice inserts 'X' at pos 1 → "aXbc"
Bob deletes at pos 2 (originally 'c') → should delete 'c' not 'b'
Transform: Bob's delete(2) → delete(3) after Alice's insert
\`\`\`

Google Docs uses OT. Works great, but transform logic is tricky.

### CRDTs (Conflict-free Replicated Data Types)

Each character gets a **globally unique ID** with a position.
Concurrent insertions/deletions merge deterministically with zero
transformation logic. Examples: Yjs, Automerge, RGA.

**Tradeoffs:**
- OT: Smaller payloads, complex server-side transform
- CRDT: Larger payloads, peer-to-peer friendly, simpler logic

### Architecture

1. **WebSocket servers** hold open connections per document
2. **Edit operations** go to a central OT engine (or peer-to-peer for CRDT)
3. **Transformed ops** broadcast to all other clients via Redis Pub/Sub
4. **Snapshots** saved every N ops or every 30s; ops between snapshots are
   kept as a log for replay

### Presence & Cursors

- Broadcast cursor positions via same WebSocket
- Color-code per user
- Short TTL (5s) — if no update, hide cursor
- Keep this channel separate from edit channel to avoid interference

### Offline Support

- Client queues ops locally while offline
- On reconnect, send all queued ops; server transforms against anything newer
- CRDTs make offline much easier since merging is automatic
`,
    keyTakeaways: [
      "OT transforms incoming ops against newer ops to converge state",
      "CRDTs give unique IDs to every insertion for deterministic merge",
      "WebSocket + Redis Pub/Sub fans out edits across multiple servers",
      "Separate presence channel from edit channel; snapshot periodically",
    ],
    animations: [
      {
        id: "concurrent-edit",
        title: "Two Users Editing at Once",
        description: "Concurrent ops transformed and replicated in under 100ms.",
        intervalMs: 2500,
        nodes: [
          { id: "a", label: "Alice", icon: "👩", x: 6, y: 25, kind: "client" },
          { id: "b", label: "Bob", icon: "👨", x: 6, y: 75, kind: "client" },
          { id: "ws1", label: "WS Server", icon: "🔌", x: 30, y: 25, kind: "service" },
          { id: "ws2", label: "WS Server", icon: "🔌", x: 30, y: 75, kind: "service" },
          { id: "ot", label: "OT Engine", icon: "🔀", x: 55, y: 50, kind: "worker" },
          { id: "doc", label: "Doc State", icon: "📄", x: 78, y: 30, kind: "db" },
          { id: "pub", label: "Pub/Sub", icon: "📡", x: 78, y: 70, kind: "queue" },
        ],
        edges: [
          { id: "a-ws1", from: "a", to: "ws1", label: "insert 'X'" },
          { id: "b-ws2", from: "b", to: "ws2", label: "delete 3" },
          { id: "ws1-ot", from: "ws1", to: "ot" },
          { id: "ws2-ot", from: "ws2", to: "ot" },
          { id: "ot-doc", from: "ot", to: "doc" },
          { id: "ot-pub", from: "ot", to: "pub" },
          { id: "pub-ws1", from: "pub", to: "ws1" },
          { id: "pub-ws2", from: "pub", to: "ws2" },
          { id: "ws1-b", from: "ws1", to: "a", label: "B's delete'" },
          { id: "ws2-a", from: "ws2", to: "b", label: "A's insert" },
        ],
        steps: [
          {
            title: "Both users type simultaneously",
            description: "Alice inserts 'X' at pos 1. Bob deletes at pos 3. No coordination yet.",
            activeNodes: ["a", "b", "ws1", "ws2"],
            activeEdges: ["a-ws1", "b-ws2"],
            packets: [
              { edgeId: "a-ws1", color: "#22d3ee" },
              { edgeId: "b-ws2", color: "#ec4899" },
            ],
          },
          {
            title: "Ops reach the OT engine",
            description: "Central sequencer orders operations with global logical clocks.",
            activeNodes: ["ws1", "ws2", "ot"],
            activeEdges: ["ws1-ot", "ws2-ot"],
            packets: [
              { edgeId: "ws1-ot", color: "#22d3ee" },
              { edgeId: "ws2-ot", color: "#ec4899" },
            ],
          },
          {
            title: "Transform",
            description:
              "OT engine rewrites Bob's delete from pos 3 → pos 4 to account for Alice's insert.",
            activeNodes: ["ot"],
            notes: [
              "Without transform: Bob would delete the wrong character",
              "After transform: Both users see identical final document",
            ],
          },
          {
            title: "Apply to canonical state + publish",
            description: "Document state updated; transformed ops published to all subscribers.",
            activeNodes: ["ot", "doc", "pub"],
            activeEdges: ["ot-doc", "ot-pub"],
            packets: [
              { edgeId: "ot-doc", color: "#059669" },
              { edgeId: "ot-pub", color: "#f59e0b" },
            ],
          },
          {
            title: "Fan out to other clients",
            description: "Each WS server receives the op broadcast.",
            activeNodes: ["pub", "ws1", "ws2"],
            activeEdges: ["pub-ws1", "pub-ws2"],
            packets: [
              { edgeId: "pub-ws1", color: "#f59e0b" },
              { edgeId: "pub-ws2", color: "#f59e0b" },
            ],
          },
          {
            title: "Clients apply remote ops",
            description: "Alice sees Bob's delete. Bob sees Alice's insert. Convergence ✓.",
            activeNodes: ["a", "b"],
            activeEdges: ["ws1-b", "ws2-a"],
            packets: [
              { edgeId: "ws1-b", color: "#ec4899" },
              { edgeId: "ws2-a", color: "#22d3ee" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 9. Online Ticket Booking (Ticketmaster / IRCTC)
  // ============================================================
  {
    id: "ticket-booking",
    slug: "ticket-booking",
    title: "Online Ticket Booking",
    icon: "🎫",
    difficulty: "hard",
    category: "Transactional",
    description:
      "Design Ticketmaster: prevent double-booking for popular concerts with 1M+ users refreshing at the same time.",
    realWorld: ["Ticketmaster", "BookMyShow", "IRCTC", "StubHub", "Eventbrite"],
    diagram: `graph TD
    U[1M Users] --> Q[Virtual Queue]
    Q --> API[Booking API]
    API -->|Reserve seat 2-min lock| R[(Redis Seat Map)]
    API --> DB[(Seat DB)]
    API --> PAY[Payment Service]
    PAY -->|Success| DB
    PAY -->|Fail| R
    style Q fill:#F59E0B,color:#000
    style R fill:#DC2626,color:#fff`,
    content: `## Online Ticket Booking

### The Core Problem

1M users hit "Book" on the same Taylor Swift concert at the same millisecond.
Only 50K seats exist. Prevent double-booking while providing a fair experience.

### Virtual Queue

On popular events, **put all users into a virtual queue** before letting
them see the seat map.

- Queue position is cryptographically signed
- Each user waits their turn (N minutes estimated)
- Only a controlled rate of users reach the booking page

This flattens the thundering herd and smooths load.

### Seat Reservation Flow

\`\`\`
1. User selects seat → API attempts reservation
2. Redis SETNX seat_id with 2-minute TTL + user_id
   - Success: Lock acquired, user has 2 min to pay
   - Failure: Another user grabbed it — show error, pick another seat
3. User submits payment within TTL
4. On payment success: write permanent reservation to DB, delete Redis lock
5. On timeout: Redis auto-expires lock, seat available again
\`\`\`

### Avoiding Oversells

- Database is the **source of truth**; Redis is the fast coordinator
- Write to DB uses a unique constraint on (event_id, seat_id)
- Idempotency key on payment prevents double charges
- Two-phase commit avoids "payment succeeded but DB write failed"

### Fair Queuing

- FIFO with jitter — random small offset prevents perfect synchronization
- Bot detection: CAPTCHA, device fingerprinting, behavior scoring
- Pre-queue waiting room opens N minutes before on-sale

### Hot-Partition Problem

A single event's seat map can be 50K rows. All 1M users read the same data.

- Cache the seat map in Redis (small blob per section)
- Invalidate only affected section on reservation
- Use WebSocket to push seat state changes instead of polling
`,
    keyTakeaways: [
      "Virtual queue absorbs thundering herd before users hit seat map",
      "Redis SETNX with TTL reserves seats without locks in the DB",
      "DB uniqueness constraint is the final oversell guard",
      "WebSocket pushes beat polling for real-time seat availability",
    ],
    animations: [
      {
        id: "book-seat",
        title: "Booking a Hot Seat (Race Condition)",
        description: "Two users click the same seat — only one wins.",
        intervalMs: 2500,
        nodes: [
          { id: "u1", label: "User 1", icon: "🙋", x: 8, y: 25, kind: "client" },
          { id: "u2", label: "User 2", icon: "🙋‍♂️", x: 8, y: 75, kind: "client" },
          { id: "q", label: "Queue", icon: "⏳", x: 26, y: 50, kind: "queue" },
          { id: "api", label: "Booking API", icon: "🟢", x: 46, y: 50, kind: "service" },
          { id: "redis", label: "Redis Lock", icon: "🔒", x: 68, y: 30, kind: "cache" },
          { id: "pay", label: "Payment", icon: "💳", x: 90, y: 30, kind: "external" },
          { id: "db", label: "Seat DB", icon: "🗄️", x: 90, y: 75, kind: "db" },
        ],
        edges: [
          { id: "u1-q", from: "u1", to: "q", label: "pos #42" },
          { id: "u2-q", from: "u2", to: "q", label: "pos #87" },
          { id: "q-api", from: "q", to: "api" },
          { id: "api-r1", from: "api", to: "redis", label: "SETNX A12" },
          { id: "r-u1", from: "redis", to: "u1", label: "lock acquired" },
          { id: "r-u2", from: "redis", to: "u2", label: "taken ✗" },
          { id: "api-pay", from: "api", to: "pay", label: "charge" },
          { id: "pay-api", from: "pay", to: "api", label: "success" },
          { id: "api-db", from: "api", to: "db", label: "commit reservation" },
        ],
        steps: [
          {
            title: "Both users click seat A12",
            description: "Only one can win. Virtual queue handles ordering.",
            activeNodes: ["u1", "u2", "q"],
            activeEdges: ["u1-q", "u2-q"],
            packets: [
              { edgeId: "u1-q", color: "#22d3ee" },
              { edgeId: "u2-q", color: "#ec4899" },
            ],
          },
          {
            title: "Queue releases User 1 first",
            description: "User 1 reaches the API slightly before User 2.",
            activeNodes: ["q", "api"],
            activeEdges: ["q-api"],
            packets: [{ edgeId: "q-api", color: "#22d3ee" }],
          },
          {
            title: "Attempt Redis lock",
            description: "SETNX seat:A12 user:1 EX 120. Atomic, returns 1 = acquired.",
            activeNodes: ["api", "redis"],
            activeEdges: ["api-r1"],
            packets: [{ edgeId: "api-r1", color: "#f59e0b" }],
          },
          {
            title: "User 1 wins the lock",
            description: "2-minute window to complete payment.",
            activeNodes: ["redis", "u1"],
            activeEdges: ["r-u1"],
            packets: [{ edgeId: "r-u1", label: "✓", color: "#10b981" }],
          },
          {
            title: "User 2 sees 'seat taken'",
            description: "Immediate feedback; user can pick another seat.",
            activeNodes: ["redis", "u2"],
            activeEdges: ["r-u2"],
            packets: [{ edgeId: "r-u2", label: "✗", color: "#dc2626" }],
          },
          {
            title: "Charge payment",
            description: "User 1 confirms. API calls payment provider with idempotency key.",
            activeNodes: ["api", "pay"],
            activeEdges: ["api-pay", "pay-api"],
            packets: [
              { edgeId: "api-pay", color: "#8b5cf6" },
              { edgeId: "pay-api", label: "✓", color: "#10b981" },
            ],
          },
          {
            title: "Commit reservation",
            description:
              "DB insert with UNIQUE(event_id, seat_id). Redis lock deleted. Done.",
            activeNodes: ["api", "db"],
            activeEdges: ["api-db"],
            packets: [{ edgeId: "api-db", color: "#059669" }],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 10. Stock Exchange / Trading Engine
  // ============================================================
  {
    id: "trading-engine",
    slug: "trading-engine",
    title: "Stock Exchange / Trading Engine",
    icon: "📈",
    difficulty: "hard",
    category: "Financial",
    description:
      "Design a low-latency matching engine handling millions of orders per second with strict ordering and fairness.",
    realWorld: ["NASDAQ", "NYSE", "LSE", "Robinhood", "Interactive Brokers"],
    diagram: `graph TD
    T[Trader Terminal] -->|FIX Protocol| GW[Order Gateway]
    GW --> RM[Risk Check]
    RM --> ME[Matching Engine]
    ME --> OB[(Order Book)]
    ME --> MD[Market Data Feed]
    MD --> T2[All Subscribers]
    ME --> TR[Trade Report]
    TR --> CS[Clearing & Settlement]
    style ME fill:#DC2626,color:#fff
    style OB fill:#F59E0B,color:#000`,
    content: `## Stock Exchange / Trading Engine

### Latency Matters

High-frequency traders measure latency in **microseconds**. Exchanges
co-locate trader servers in the same data center to save nanoseconds on
the wire.

### Matching Algorithm: Price-Time Priority

Order book has two sides: **bids** (buy) and **asks** (sell).
- Sort bids descending by price, ascending by arrival time
- Sort asks ascending by price, ascending by arrival time
- Match when best bid ≥ best ask

\`\`\`
Buy   100 @ $50 (10:00:01.123)
Buy    50 @ $49 (10:00:01.124)
────────────────────────────────
Sell  75 @ $50 (10:00:01.125)  ← matches 75 of the 100@$50 buy order
\`\`\`

### Data Structure

Order book = two **price-sorted red-black trees** (one per side).
Each price level = a FIFO queue of orders at that price.
- Insert: O(log P) where P = distinct prices
- Match: O(1) for best bid/ask

### Single-threaded Deterministic Engine

Yes, single-threaded per instrument. Reasons:
- No locking overhead
- Deterministic, reproducible sequencing
- Parallelize by sharding instruments across engines (AAPL on engine 3, MSFT on engine 7)

### Market Data Fan-out

Every trade and order book change is broadcast to thousands of subscribers.
- **Multicast UDP** on the exchange LAN for lowest latency
- Sequence numbers so subscribers can detect drops
- Snapshot + incremental updates pattern

### Order Types

| Type | Behavior |
|------|----------|
| Market | Execute immediately at best price |
| Limit | Execute only at specified price or better |
| Stop | Becomes market order when trigger price hits |
| IOC | Immediate or cancel: fill what you can, kill rest |
| FOK | Fill or kill: all-or-nothing |

### Risk Checks (< 10µs)

Before any order hits the engine:
- Position limits (max exposure per trader)
- Kill switch if losses exceed threshold
- Circuit breakers on abnormal price moves
`,
    keyTakeaways: [
      "Single-threaded deterministic matching engine per instrument",
      "Price-time priority with two RB-trees (bids / asks)",
      "Shard across engines by instrument for horizontal scale",
      "UDP multicast for market data fan-out at microsecond latency",
    ],
    animations: [
      {
        id: "order-match",
        title: "Matching an Incoming Order",
        description: "From FIX message to executed trade in microseconds.",
        intervalMs: 2400,
        nodes: [
          { id: "t", label: "Trader", icon: "👨‍💼", x: 8, y: 50, kind: "client" },
          { id: "gw", label: "Gateway", icon: "📥", x: 26, y: 50, kind: "service" },
          { id: "risk", label: "Risk Check", icon: "🛡️", x: 44, y: 50, kind: "service" },
          { id: "me", label: "Match Engine", icon: "⚖️", x: 62, y: 50, kind: "worker" },
          { id: "book", label: "Order Book", icon: "📒", x: 80, y: 25, kind: "db" },
          { id: "md", label: "Market Data", icon: "📡", x: 80, y: 75, kind: "queue" },
          { id: "t2", label: "Other Traders", icon: "👥", x: 94, y: 85, kind: "client" },
        ],
        edges: [
          { id: "e1", from: "t", to: "gw", label: "BUY 100 @ $50" },
          { id: "e2", from: "gw", to: "risk" },
          { id: "e3", from: "risk", to: "me", label: "OK" },
          { id: "e4", from: "me", to: "book", label: "find best ask" },
          { id: "e5", from: "book", to: "me", label: "ASK 75@$50" },
          { id: "e6", from: "me", to: "md", label: "trade tick" },
          { id: "e7", from: "md", to: "t2" },
          { id: "e8", from: "me", to: "t", label: "filled 75" },
        ],
        steps: [
          {
            title: "Trader sends FIX order",
            description: "BUY 100 shares @ $50 limit. Clocked in microseconds.",
            activeNodes: ["t", "gw"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", color: "#22d3ee" }],
          },
          {
            title: "Pre-trade risk check",
            description: "Position limits, kill switch, credit check — all in < 10µs.",
            activeNodes: ["gw", "risk"],
            activeEdges: ["e2"],
            packets: [{ edgeId: "e2", color: "#f59e0b" }],
          },
          {
            title: "Enter matching engine",
            description: "Single-threaded, deterministic, no locks.",
            activeNodes: ["risk", "me"],
            activeEdges: ["e3"],
            packets: [{ edgeId: "e3", color: "#10b981" }],
          },
          {
            title: "Scan order book",
            description: "Best ask at $50 has 75 shares available. Match!",
            activeNodes: ["me", "book"],
            activeEdges: ["e4", "e5"],
            packets: [
              { edgeId: "e4", color: "#8b5cf6" },
              { edgeId: "e5", label: "75@$50", color: "#10b981" },
            ],
          },
          {
            title: "Execute trade",
            description: "75 matched. 25 remain in book as new bid @ $50.",
            activeNodes: ["me", "book"],
            notes: ["Trade printed on tape with sequence number", "Book updated atomically"],
          },
          {
            title: "Broadcast market data",
            description: "UDP multicast to all subscribers. Sub-millisecond fan-out.",
            activeNodes: ["me", "md", "t2"],
            activeEdges: ["e6", "e7"],
            packets: [
              { edgeId: "e6", color: "#dc2626" },
              { edgeId: "e7", color: "#dc2626" },
            ],
          },
          {
            title: "Acknowledge trader",
            description: "Fill report: 75@$50 executed; 25 resting.",
            activeNodes: ["me", "t"],
            activeEdges: ["e8"],
            packets: [{ edgeId: "e8", label: "filled", color: "#10b981" }],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 11. Metrics & Monitoring (Prometheus-like)
  // ============================================================
  {
    id: "metrics-monitoring",
    slug: "metrics-monitoring",
    title: "Metrics & Monitoring System",
    icon: "📊",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Design a Prometheus/Datadog-style metrics pipeline that ingests 10M+ points/sec and powers dashboards.",
    realWorld: ["Prometheus", "Datadog", "Grafana Cloud", "New Relic", "CloudWatch"],
    diagram: `graph LR
    A[App Services] -->|expose /metrics| SC[Scrapers]
    SC --> KQ[Kafka]
    KQ --> IS[Ingest Service]
    IS --> TSDB[(TSDB / InfluxDB)]
    IS -->|downsample| L[Long-term Store]
    TSDB --> Q[Query Engine]
    Q --> D[Dashboard]
    Q --> AL[Alert Manager]
    AL --> N[Notification Channels]
    style TSDB fill:#4F46E5,color:#fff
    style AL fill:#DC2626,color:#fff`,
    content: `## Metrics & Monitoring

### Metric Types

- **Counter:** Monotonically increasing (total HTTP requests)
- **Gauge:** Up-and-down value (CPU %, queue size)
- **Histogram:** Distribution (request latency buckets)
- **Summary:** Quantile-based distribution

### Data Model

\`\`\`
metric_name{label1="value1",label2="value2"} value timestamp

http_requests_total{method="GET",status="200"} 4321 1678901234
\`\`\`

Each unique label combination is a **time series**. Thousands of labels
= thousands of series. Cardinality explosion is the #1 operational risk.

### Time Series Database (TSDB)

Optimized for:
- Append-heavy writes (10M+ points/sec)
- Range queries ("last 1h for metric X")
- Compression — adjacent samples are similar (Gorilla compression: 1.37 bytes/sample)

### Pull vs Push

**Pull (Prometheus):**
- Central scraper hits \`/metrics\` on each target every 15s
- Simple service discovery
- Targets don't need to know collectors

**Push (StatsD, Datadog agent):**
- Agents push metrics to central aggregator
- Works better for ephemeral tasks (cron jobs, serverless)

### Downsampling

- Raw resolution kept for 2 weeks (15s steps)
- Rolled up to 1-min for 3 months
- Rolled up to 5-min for 1 year
- Rolled up to 1-hour for 5 years
- Each rollup ~12x smaller than previous

### Alerting

- Rules: \`rate(http_errors[5m]) > 10\`
- Evaluated every 30s by the rule engine
- Fires alert → notification manager → Slack/PagerDuty/email
- Grouping + deduplication prevents alert storms

### Cardinality Control

- Avoid high-cardinality labels (user_id is usually bad)
- Use structured logs for per-request detail
- Limit metric series per target (Prometheus sets a soft cap)
`,
    keyTakeaways: [
      "TSDBs use Gorilla compression — 1.37 bytes/sample typical",
      "Cardinality explosion from bad labels is the top killer",
      "Downsample aggressively: 15s raw → 1h rollups for long-term",
      "Alert grouping + dedup prevents 2AM pager fatigue",
    ],
    animations: [
      {
        id: "metric-pipeline",
        title: "A Metric's Journey",
        description: "From app counter to dashboard graph to paging an on-call engineer.",
        intervalMs: 2400,
        nodes: [
          { id: "app", label: "App", icon: "🚀", x: 8, y: 50, kind: "service" },
          { id: "scrape", label: "Scraper", icon: "🤖", x: 25, y: 50, kind: "worker" },
          { id: "k", label: "Kafka", icon: "📨", x: 42, y: 50, kind: "queue" },
          { id: "ts", label: "TSDB", icon: "📈", x: 60, y: 30, kind: "db" },
          { id: "long", label: "Cold Store", icon: "❄️", x: 60, y: 75, kind: "storage" },
          { id: "q", label: "Query Engine", icon: "🔎", x: 78, y: 30, kind: "service" },
          { id: "dash", label: "Dashboard", icon: "📊", x: 94, y: 15, kind: "client" },
          { id: "alert", label: "Alert Mgr", icon: "🚨", x: 78, y: 75, kind: "service" },
          { id: "oncall", label: "On-call", icon: "📟", x: 94, y: 85, kind: "client" },
        ],
        edges: [
          { id: "a-s", from: "app", to: "scrape", label: "/metrics" },
          { id: "s-k", from: "scrape", to: "k" },
          { id: "k-t", from: "k", to: "ts" },
          { id: "t-l", from: "ts", to: "long", label: "rollup" },
          { id: "t-q", from: "ts", to: "q" },
          { id: "q-d", from: "q", to: "dash" },
          { id: "q-a", from: "q", to: "alert", label: "error rate high!" },
          { id: "a-o", from: "alert", to: "oncall" },
        ],
        steps: [
          {
            title: "App exposes /metrics",
            description: "HTTP endpoint returns text in Prometheus format.",
            activeNodes: ["app", "scrape"],
            activeEdges: ["a-s"],
            packets: [{ edgeId: "a-s", color: "#22d3ee" }],
          },
          {
            title: "Scraper ships to Kafka",
            description: "Batching & back-pressure; avoids overwhelming the TSDB on spikes.",
            activeNodes: ["scrape", "k"],
            activeEdges: ["s-k"],
            packets: [{ edgeId: "s-k", color: "#f59e0b" }],
          },
          {
            title: "Ingest into TSDB",
            description: "Points compressed with Gorilla and written to WAL.",
            activeNodes: ["k", "ts"],
            activeEdges: ["k-t"],
            packets: [{ edgeId: "k-t", color: "#0ea5e9" }],
          },
          {
            title: "Downsample to cold storage",
            description: "Periodic jobs roll up raw data into 1m/5m/1h buckets.",
            activeNodes: ["ts", "long"],
            activeEdges: ["t-l"],
            packets: [{ edgeId: "t-l", color: "#8b5cf6" }],
          },
          {
            title: "User opens dashboard",
            description: "Query engine fans queries across raw + rollup shards.",
            activeNodes: ["ts", "q", "dash"],
            activeEdges: ["t-q", "q-d"],
            packets: [
              { edgeId: "t-q", color: "#10b981" },
              { edgeId: "q-d", color: "#10b981" },
            ],
          },
          {
            title: "Alert fires",
            description: "Rule: error rate > 5% for 2m. Evaluator triggers alert manager.",
            activeNodes: ["q", "alert"],
            activeEdges: ["q-a"],
            packets: [{ edgeId: "q-a", label: "🔥", color: "#dc2626" }],
          },
          {
            title: "On-call paged",
            description: "PagerDuty gets a webhook, phone rings, engineer wakes up.",
            activeNodes: ["alert", "oncall"],
            activeEdges: ["a-o"],
            packets: [{ edgeId: "a-o", color: "#dc2626" }],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 12. Distributed Task Queue
  // ============================================================
  {
    id: "task-queue",
    slug: "task-queue",
    title: "Distributed Task Queue",
    icon: "📬",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Design a Celery/Sidekiq-style background job system with retries, scheduling, and exactly-once semantics.",
    realWorld: ["Celery", "Sidekiq", "AWS SQS + Lambda", "Temporal", "BullMQ"],
    diagram: `graph LR
    P[Producer] -->|enqueue| Q[Broker / Redis]
    Q --> W1[Worker 1]
    Q --> W2[Worker 2]
    Q --> W3[Worker N]
    W1 --> DL[Dead Letter Queue]
    W1 --> RES[(Results Store)]
    SCH[Scheduler] --> Q
    style Q fill:#F59E0B,color:#000
    style DL fill:#DC2626,color:#fff`,
    content: `## Distributed Task Queue

### Problem

Web requests must stay under 200ms, but some work takes 30 seconds
(send email, generate PDF, process image). Move it to the background.

### Core Components

- **Broker:** Redis, RabbitMQ, SQS — stores the queue
- **Workers:** Long-running processes that pull jobs
- **Producer:** Web app that enqueues jobs
- **Scheduler:** Enqueues jobs at specific times (cron-like)
- **Results backend:** Stores job outputs (optional)

### Delivery Semantics

- **At-most-once:** Fire and forget. Can lose jobs.
- **At-least-once:** Retry on failure. Can duplicate (common default).
- **Exactly-once:** Expensive — requires distributed consensus or idempotent jobs.

**Pragmatic approach:** At-least-once delivery + idempotent workers.

### Retries & Backoff

\`\`\`
attempt 1: immediate
attempt 2: +2s
attempt 3: +4s
attempt 4: +8s  (exponential backoff)
attempt 5: +jitter(16s, 30s)  (add randomness)
after 5 failures → dead letter queue
\`\`\`

### Priority & Fairness

- Separate queues per priority: \`critical\`, \`default\`, \`low\`
- Workers poll all queues, but in priority order
- Per-tenant rate limiting prevents one tenant starving others

### Visibility Timeout

When a worker picks a job, it becomes invisible for N minutes.
- If worker crashes → job reappears, another worker picks it up
- Worker must finish or extend visibility before timeout
- Too short: duplicate work; too long: slow failover

### Scheduler

- Store future jobs in a **sorted set** by scheduled timestamp
- Scheduler process wakes every second, moves due jobs to main queue
- For cron jobs: compute next run after each execution

### Monitoring

- Queue depth per queue (growing = workers falling behind)
- Worker throughput
- Retry rate
- Dead letter queue size (non-zero is a bug)
`,
    keyTakeaways: [
      "At-least-once + idempotent workers is the pragmatic default",
      "Exponential backoff + jitter prevents retry storms",
      "Visibility timeout handles worker crashes gracefully",
      "Dead letter queue for jobs that fail all retries",
    ],
    animations: [
      {
        id: "job-retry",
        title: "Job Failure + Retry + DLQ",
        description: "Watch a failing job retry with backoff and end up in the DLQ.",
        intervalMs: 2200,
        nodes: [
          { id: "prod", label: "Producer", icon: "🏭", x: 8, y: 50, kind: "client" },
          { id: "q", label: "Queue", icon: "📥", x: 28, y: 50, kind: "queue" },
          { id: "w", label: "Worker", icon: "⚙️", x: 48, y: 50, kind: "worker" },
          { id: "api", label: "3rd-party API", icon: "🌐", x: 68, y: 30, kind: "external" },
          { id: "res", label: "Results", icon: "✅", x: 88, y: 30, kind: "db" },
          { id: "dlq", label: "DLQ", icon: "💀", x: 88, y: 75, kind: "queue" },
        ],
        edges: [
          { id: "p-q", from: "prod", to: "q", label: "enqueue" },
          { id: "q-w", from: "q", to: "w", label: "pull" },
          { id: "w-api", from: "w", to: "api" },
          { id: "api-w", from: "api", to: "w" },
          { id: "w-res", from: "w", to: "res" },
          { id: "w-q", from: "w", to: "q", label: "nack + delay" },
          { id: "w-dlq", from: "w", to: "dlq", label: "max retries" },
        ],
        steps: [
          {
            title: "Producer enqueues job",
            description: "Web handler enqueues 'send_invoice_email(order=42)'.",
            activeNodes: ["prod", "q"],
            activeEdges: ["p-q"],
            packets: [{ edgeId: "p-q", color: "#22d3ee" }],
          },
          {
            title: "Worker pulls job",
            description: "Visibility timeout: 5 min. Another worker won't pick it.",
            activeNodes: ["q", "w"],
            activeEdges: ["q-w"],
            packets: [{ edgeId: "q-w", color: "#f59e0b" }],
          },
          {
            title: "Call third-party API",
            description: "Email provider is flaky today...",
            activeNodes: ["w", "api"],
            activeEdges: ["w-api"],
            packets: [{ edgeId: "w-api", color: "#0ea5e9" }],
          },
          {
            title: "API returns 503",
            description: "Transient failure. Worker doesn't ack.",
            activeNodes: ["api", "w"],
            activeEdges: ["api-w"],
            packets: [{ edgeId: "api-w", label: "503", color: "#dc2626" }],
          },
          {
            title: "Requeue with backoff",
            description: "Attempt #2 scheduled +2s. Attempt #3 +4s. Etc.",
            activeNodes: ["w", "q"],
            activeEdges: ["w-q"],
            packets: [{ edgeId: "w-q", label: "+2s", color: "#f59e0b" }],
          },
          {
            title: "After 5 failures → DLQ",
            description: "Move to dead letter queue for human review.",
            activeNodes: ["w", "dlq"],
            activeEdges: ["w-dlq"],
            packets: [{ edgeId: "w-dlq", color: "#dc2626" }],
          },
        ],
      },
    ],
  },
];
