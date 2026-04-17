import type { SystemDesign } from "@/data/types";

/**
 * Another batch of 20 system design topics with rich animated walkthroughs.
 * Mirrors the shape of additional.ts — each topic has mermaid diagram,
 * scale metrics, tradeoffs, markdown content, and a step-by-step animation.
 */

export const moreSystemDesigns: SystemDesign[] = [
  // ============================================================
  // 1. Distributed Message Queue (Kafka-style)
  // ============================================================
  {
    id: "message-queue",
    slug: "message-queue",
    title: "Distributed Message Queue",
    icon: "📨",
    difficulty: "hard",
    category: "Infrastructure",
    description:
      "Design a durable, partitioned log-based message broker handling millions of messages/sec with at-least-once delivery.",
    realWorld: ["Apache Kafka", "AWS Kinesis", "Google Pub/Sub", "Pulsar"],
    diagram: `graph LR
    P[Producer] -->|append| B1[Broker 1<br/>Partition 0 Leader]
    P -->|append| B2[Broker 2<br/>Partition 1 Leader]
    B1 -.replicate.-> R1[Follower]
    B2 -.replicate.-> R2[Follower]
    B1 --> C1[Consumer A]
    B2 --> C2[Consumer B]
    ZK[Metadata /<br/>Controller] --- B1
    ZK --- B2
    style B1 fill:#F59E0B,color:#000
    style B2 fill:#F59E0B,color:#000
    style ZK fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Throughput", value: "10M msg/s", hint: "Per cluster" },
      { label: "Latency", value: "< 10ms", hint: "Producer → broker ack" },
      { label: "Retention", value: "7 days", hint: "Configurable per topic" },
      { label: "Replicas", value: "3× ISR", hint: "In-sync replicas for durability" },
    ],
    tradeoffs: [
      {
        option: "acks=0 (fire & forget)",
        pros: ["Max throughput", "Lowest latency"],
        cons: ["Data loss possible", "No delivery guarantees"],
      },
      {
        option: "acks=1 (leader only)",
        pros: ["Balanced durability/latency", "Single-node replication wait"],
        cons: ["Data loss if leader dies before replicating"],
      },
      {
        option: "acks=all (ISR)",
        pros: ["Strongest durability", "No loss with min.insync.replicas ≥ 2"],
        cons: ["Higher latency", "Throughput capped by slowest follower"],
      },
    ],
    content: `## Distributed Message Queue

### Why a Log, Not a Queue?

Traditional queues delete messages on ack. Log-based brokers **retain** messages and let consumers track their own offset — this enables replay, multiple independent consumers, and high throughput via sequential disk I/O.

### Partitioning

A topic is split into N **partitions**; each is an ordered, immutable log. Producers route messages to partitions by key hash, guaranteeing per-key ordering. Throughput scales linearly with partition count.

### Replication (ISR Model)

- Every partition has a **leader** and R−1 **followers**.
- Followers pull from the leader, staying in the **In-Sync Replica** set.
- Producer with \`acks=all\` waits for the leader + \`min.insync.replicas − 1\` followers to confirm.
- On leader failure, the controller elects a new leader from the ISR.

### Consumer Groups

- A consumer group divides partitions among its members — each partition consumed by exactly one member.
- Offsets committed to a special internal topic (\`__consumer_offsets\`).
- Rebalancing triggers when members join/leave.

### Exactly-Once Semantics

Combine **idempotent producers** (per-partition sequence numbers) with **transactional writes** that span producer + offset commit, enabling read-process-write pipelines without duplicates.
`,
    keyTakeaways: [
      "Append-only log beats a traditional queue for throughput & replay",
      "Partition count caps per-topic parallelism",
      "ISR replication trades latency for durability",
      "Exactly-once needs idempotent producers + transactions",
    ],
    animations: [
      {
        id: "mq-flow",
        title: "Produce → Replicate → Consume",
        description: "Follow one message from producer to committed offset.",
        intervalMs: 2400,
        nodes: [
          { id: "prod", label: "Producer", icon: "📤", x: 8, y: 50, kind: "client" },
          { id: "leader", label: "Leader (P0)", icon: "📗", x: 32, y: 50, kind: "service" },
          { id: "f1", label: "Follower 1", icon: "📘", x: 56, y: 25, kind: "service" },
          { id: "f2", label: "Follower 2", icon: "📘", x: 56, y: 75, kind: "service" },
          { id: "log", label: "Partition Log", icon: "🗃️", x: 78, y: 50, kind: "storage" },
          { id: "cons", label: "Consumer", icon: "📥", x: 94, y: 50, kind: "client" },
        ],
        edges: [
          { id: "e1", from: "prod", to: "leader", label: "send" },
          { id: "e2", from: "leader", to: "f1", label: "replicate" },
          { id: "e3", from: "leader", to: "f2", label: "replicate" },
          { id: "e4", from: "leader", to: "log", label: "fsync" },
          { id: "e5", from: "log", to: "cons", label: "poll" },
        ],
        steps: [
          {
            title: "Producer sends to partition leader",
            description: "Key is hashed to select P0; batch is sent to the leader broker.",
            activeNodes: ["prod", "leader"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", label: "msg", color: "#22d3ee" }],
          },
          {
            title: "Leader appends to local log",
            description: "Append is an O(1) sequential write. Offset assigned and fsync'd.",
            activeNodes: ["leader", "log"],
            activeEdges: ["e4"],
            packets: [{ edgeId: "e4", color: "#10b981" }],
          },
          {
            title: "Followers replicate",
            description: "Followers pull the new records and append to their own logs.",
            activeNodes: ["leader", "f1", "f2"],
            activeEdges: ["e2", "e3"],
            packets: [
              { edgeId: "e2", color: "#f59e0b" },
              { edgeId: "e3", color: "#f59e0b" },
            ],
          },
          {
            title: "High-watermark advances",
            description: "Once all ISR members have the offset, it becomes visible to consumers.",
            activeNodes: ["leader", "f1", "f2"],
            notes: [
              "acks=all producer now receives its ack",
              "Offset below high-watermark is durable",
            ],
          },
          {
            title: "Consumer polls & commits offset",
            description: "Consumer reads from the log and commits the processed offset.",
            activeNodes: ["log", "cons"],
            activeEdges: ["e5"],
            packets: [{ edgeId: "e5", color: "#7c3aed" }],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 2. Online Code Judge (LeetCode-like)
  // ============================================================
  {
    id: "online-code-judge",
    slug: "online-code-judge",
    title: "Online Code Judge",
    icon: "⚖️",
    difficulty: "medium",
    category: "Developer Tools",
    description:
      "Design a platform that safely compiles and runs untrusted user code against hidden test cases at scale.",
    realWorld: ["LeetCode", "HackerRank", "Codeforces", "CodeSignal"],
    diagram: `graph TD
    U[User] --> API[Submit API]
    API --> Q[(Submission Queue)]
    Q --> W[Worker Pool]
    W -->|docker run| S[Sandbox]
    S --> J[Judge]
    J -->|verdict| DB[(Result DB)]
    DB --> U
    style S fill:#DC2626,color:#fff
    style Q fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Submissions/day", value: "10M" },
      { label: "Languages", value: "40+" },
      { label: "Time limit", value: "2s / test" },
      { label: "Memory limit", value: "256 MB" },
    ],
    tradeoffs: [
      {
        option: "Docker per run",
        pros: ["Strong isolation", "Reproducible"],
        cons: ["~300ms cold-start overhead", "Higher resource cost"],
      },
      {
        option: "Pre-warmed container pool",
        pros: ["Sub-50ms spin-up", "Amortized cost"],
        cons: ["Reset/cleanup complexity", "State leakage risk"],
      },
      {
        option: "Firecracker microVM",
        pros: ["Near-docker speed with VM-level isolation", "Kernel-isolated"],
        cons: ["Operational complexity", "Fewer languages OOTB"],
      },
    ],
    content: `## Online Code Judge

### Why Not Just eval()?

Running untrusted code needs **three walls**: process (seccomp, rlimit), filesystem (read-only rootfs), and network (egress block). Language-level sandboxes are never enough against determined attackers.

### Execution Pipeline

1. User submits → API drops a row in a SQL submissions table + pushes a job to a queue.
2. A worker pulls the job, spins up a sandbox (pre-warmed container or Firecracker microVM).
3. Inside the sandbox: compile (if needed), then run once per hidden test case with strict time/mem limits.
4. Compare stdout to expected; produce verdict (AC / WA / TLE / MLE / RE / CE).
5. Worker pushes verdict back; API streams results to the client (WebSocket or long-poll).

### Isolation Layers

- **Linux namespaces** — separate PID, network, mount.
- **seccomp-bpf** — deny syscalls like \`mount\`, \`ptrace\`, \`fork\` beyond a cap.
- **cgroups** — cap CPU, memory, PIDs, I/O.
- **Read-only rootfs** + tmpfs \`/tmp\` for writes.

### Language Support

- One Docker image per language; warm pool of ~200 containers.
- Compiled languages (C++, Rust, Go) compile once per submission, then run per test case.
- Interpreted languages (Python, JS) skip compile.

### Cheating Resistance

- Hash & diff code vs public solutions.
- Pattern-match for calls that write outside the sandbox or sleep to time out.
- Randomize test order; keep some tests hidden.
`,
    keyTakeaways: [
      "Use OS-level isolation (namespaces + seccomp + cgroups), not language-level",
      "Pre-warmed container pool eliminates cold-start latency",
      "Queue + worker pool decouples submission rate from execution rate",
      "Stream verdict back via WebSocket for real-time UX",
    ],
    animations: [
      {
        id: "judge-flow",
        title: "Submission Lifecycle",
        description: "From Submit button to AC verdict.",
        intervalMs: 2500,
        nodes: [
          { id: "u", label: "User", icon: "👩‍💻", x: 6, y: 50, kind: "client" },
          { id: "api", label: "Submit API", icon: "🟢", x: 24, y: 50, kind: "service" },
          { id: "q", label: "Queue", icon: "📬", x: 42, y: 50, kind: "queue" },
          { id: "w", label: "Worker", icon: "⚙️", x: 60, y: 50, kind: "worker" },
          { id: "sb", label: "Sandbox", icon: "🧪", x: 78, y: 50, kind: "service" },
          { id: "db", label: "Verdict DB", icon: "🗄️", x: 94, y: 50, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "u", to: "api" },
          { id: "e2", from: "api", to: "q" },
          { id: "e3", from: "q", to: "w" },
          { id: "e4", from: "w", to: "sb" },
          { id: "e5", from: "sb", to: "db" },
          { id: "e6", from: "db", to: "u", label: "verdict" },
        ],
        steps: [
          { title: "Submit code", description: "User submits a solution.", activeNodes: ["u", "api"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Enqueue job", description: "API persists row & pushes job to queue.", activeNodes: ["api", "q"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Worker pulls job", description: "Free worker dequeues next submission.", activeNodes: ["q", "w"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Run in sandbox", description: "Compile, then run once per hidden test case with rlimits.", activeNodes: ["w", "sb"], activeEdges: ["e4"], notes: ["seccomp + cgroups active", "Time-limit 2s, mem 256MB"] },
          { title: "Persist verdict", description: "Worker writes AC/WA/TLE/… to DB.", activeNodes: ["sb", "db"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#7c3aed" }] },
          { title: "Push to client", description: "Verdict streamed back over WebSocket.", activeNodes: ["db", "u"], activeEdges: ["e6"], packets: [{ edgeId: "e6", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 3. Real-time Analytics (Flink-style streaming)
  // ============================================================
  {
    id: "streaming-analytics",
    slug: "streaming-analytics",
    title: "Real-time Streaming Analytics",
    icon: "📊",
    difficulty: "hard",
    category: "Data",
    description:
      "Design a pipeline that ingests millions of events/sec and computes windowed aggregations with <1s latency.",
    realWorld: ["Apache Flink", "Kafka Streams", "Spark Structured Streaming", "Materialize"],
    diagram: `graph LR
    S[Sources] --> K[(Kafka)]
    K --> F[Flink Job]
    F -->|windowed agg| ST[(State Store)]
    F --> SK[Sinks]
    SK --> DB[(OLAP DB)]
    SK --> DASH[Dashboard]
    style F fill:#7C3AED,color:#fff
    style ST fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Ingest", value: "5M events/s" },
      { label: "E2E latency", value: "< 1s" },
      { label: "Window size", value: "1m / 5m / 1h" },
      { label: "State size", value: "TB-scale", hint: "RocksDB-backed" },
    ],
    tradeoffs: [
      {
        option: "Tumbling windows",
        pros: ["Non-overlapping, simple", "Cheap state"],
        cons: ["Coarse — misses bursts at boundaries"],
      },
      {
        option: "Sliding windows",
        pros: ["Smooth metrics", "Better for alerts"],
        cons: ["Larger state (every event in multiple windows)"],
      },
      {
        option: "Session windows",
        pros: ["Natural for user sessions", "Dynamic size"],
        cons: ["Unpredictable state growth", "Complex timeouts"],
      },
    ],
    content: `## Real-time Streaming Analytics

### Event Time vs Processing Time

Events are timestamped at the source; network delays mean they arrive out of order. Using **event time** with **watermarks** (a monotonic lower bound on past event times) lets the system close windows correctly despite late arrivals.

### Exactly-Once via Checkpoints

Flink periodically broadcasts **checkpoint barriers** through the DAG. When every operator acks the barrier, an immutable snapshot of all operator state + source offsets is committed. On failure, rewind to the last good checkpoint.

### State Backend

- Hot state lives in **RocksDB** on local SSD per task manager.
- Async snapshots uploaded to S3/HDFS for durability.
- Keyed state is partitioned by a hash function — same key always processed by the same operator instance.

### Output Sinks

- **OLAP DB (Druid, ClickHouse, Pinot)** for sub-second dashboards.
- **Kafka topic** for downstream consumers.
- **Alerting** on anomalies (sudden spike / drop).

### Late Data Handling

- Watermark = max event time seen − tolerance (e.g., 10s).
- Events behind the watermark go to a **side output** (dead-letter) or update existing windows (if allowed).
`,
    keyTakeaways: [
      "Event time + watermarks handle out-of-order events correctly",
      "Checkpoint barriers give exactly-once across the DAG",
      "RocksDB on SSD + async snapshots scales state to TB",
      "Choose window type (tumbling/sliding/session) to match the question",
    ],
    animations: [
      {
        id: "stream-flow",
        title: "Event Through the DAG",
        description: "Ingest → partition → window → sink.",
        intervalMs: 2400,
        nodes: [
          { id: "src", label: "Source", icon: "🌊", x: 6, y: 50, kind: "client" },
          { id: "k", label: "Kafka", icon: "📨", x: 24, y: 50, kind: "queue" },
          { id: "par", label: "Partitioner", icon: "🔀", x: 42, y: 50, kind: "service" },
          { id: "win", label: "Window Op", icon: "⏳", x: 60, y: 50, kind: "service" },
          { id: "st", label: "RocksDB", icon: "🗃️", x: 72, y: 20, kind: "storage" },
          { id: "sink", label: "Sink", icon: "📥", x: 82, y: 50, kind: "service" },
          { id: "db", label: "OLAP", icon: "📊", x: 96, y: 50, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "src", to: "k" },
          { id: "e2", from: "k", to: "par" },
          { id: "e3", from: "par", to: "win" },
          { id: "e4", from: "win", to: "st", label: "state" },
          { id: "e5", from: "win", to: "sink" },
          { id: "e6", from: "sink", to: "db" },
        ],
        steps: [
          { title: "Event emitted", description: "Source tags the event with its event-time timestamp.", activeNodes: ["src", "k"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Buffered in Kafka", description: "Topic partition is append-only; offsets guarantee replay.", activeNodes: ["k", "par"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Key-hashed routing", description: "Partitioner sends by key so same user hits the same window operator.", activeNodes: ["par", "win"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Update windowed state", description: "Operator merges the event into its 1-minute tumbling window.", activeNodes: ["win", "st"], activeEdges: ["e4"], notes: ["RocksDB keyed by (user, windowStart)", "Async snapshot every 30s"] },
          { title: "Watermark closes window", description: "When watermark passes windowEnd, emit final aggregate.", activeNodes: ["win", "sink"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#7c3aed" }] },
          { title: "Write to OLAP", description: "Sink batches writes into an OLAP store for dashboards.", activeNodes: ["sink", "db"], activeEdges: ["e6"], packets: [{ edgeId: "e6", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 4. Video Conferencing (Zoom-style)
  // ============================================================
  {
    id: "video-conferencing",
    slug: "video-conferencing",
    title: "Video Conferencing",
    icon: "🎥",
    difficulty: "hard",
    category: "Real-time",
    description:
      "Design a multi-party video meeting system using SFU media routing with adaptive bitrate.",
    realWorld: ["Zoom", "Google Meet", "Microsoft Teams", "Jitsi"],
    diagram: `graph TD
    A[Attendee A] -->|WebRTC RTP| SFU[Selective<br/>Forwarding Unit]
    B[Attendee B] --> SFU
    C[Attendee C] --> SFU
    SFU --> A
    SFU --> B
    SFU --> C
    SIG[Signaling /<br/>SDP Exchange] -.-> A
    SIG -.-> B
    SIG -.-> C
    TURN[TURN Relay] -.-> SFU
    style SFU fill:#DC2626,color:#fff`,
    scaleMetrics: [
      { label: "Participants/room", value: "1,000+" },
      { label: "Latency", value: "< 150ms", hint: "End-to-end" },
      { label: "Media", value: "VP9 / AV1" },
      { label: "Uplink", value: "1 stream/user", hint: "Simulcast layers" },
    ],
    tradeoffs: [
      {
        option: "Peer-to-peer mesh",
        pros: ["No server CPU cost", "Lowest latency"],
        cons: ["O(N²) uplink bandwidth", "Fails beyond ~4 peers"],
      },
      {
        option: "MCU (mixer)",
        pros: ["1 downstream per user", "Client-side simplicity"],
        cons: ["Massive server CPU (transcode per room)", "Quality loss from re-encoding"],
      },
      {
        option: "SFU (forwarder)",
        pros: ["Scales to hundreds per room", "No transcoding on server"],
        cons: ["Client must decode N streams", "Server bandwidth heavy"],
      },
    ],
    content: `## Video Conferencing

### Media Topologies

- **P2P Mesh**: every peer sends to every other peer. Works up to 3–4 participants.
- **MCU (Multipoint Control Unit)**: server decodes + composites a single video → sends one stream to each client. Expensive.
- **SFU (Selective Forwarding Unit)**: server forwards packets unchanged. The dominant design today.

### Simulcast / SVC

Each publisher sends **3 layers** (e.g., 180p, 360p, 720p) simultaneously. The SFU picks per-subscriber which layer to forward based on their downlink bandwidth and active-speaker state — no transcoding needed.

### Signaling

WebRTC needs an **SDP** exchange before media flows. A signaling service (often WebSocket) passes SDP offers/answers and ICE candidates between peers.

### NAT Traversal

- **STUN** lets peers discover their public IP.
- **TURN** relays media when direct P2P fails (~10% of connections).

### Recording / Transcription

A bot joins as a silent participant, subscribes to all streams, writes MKV files to object storage, and emits audio to a speech-to-text service for live captions.
`,
    keyTakeaways: [
      "SFU scales where mesh and MCU break",
      "Simulcast lets the server match quality to each subscriber without transcoding",
      "WebRTC needs signaling + STUN/TURN for NAT traversal",
      "Record by having a bot join the meeting — same media path",
    ],
    animations: [
      {
        id: "vc-sfu",
        title: "SFU Routing a Frame",
        description: "A publisher's frame fans out to three subscribers at different qualities.",
        intervalMs: 2400,
        nodes: [
          { id: "pub", label: "Publisher", icon: "📹", x: 8, y: 50, kind: "client" },
          { id: "sfu", label: "SFU", icon: "🧭", x: 40, y: 50, kind: "service" },
          { id: "s1", label: "Sub 720p", icon: "🖥️", x: 80, y: 20, kind: "client" },
          { id: "s2", label: "Sub 360p", icon: "📱", x: 90, y: 50, kind: "client" },
          { id: "s3", label: "Sub 180p", icon: "📱", x: 80, y: 80, kind: "client" },
        ],
        edges: [
          { id: "e0", from: "pub", to: "sfu", label: "simulcast 3 layers" },
          { id: "e1", from: "sfu", to: "s1", label: "720p" },
          { id: "e2", from: "sfu", to: "s2", label: "360p" },
          { id: "e3", from: "sfu", to: "s3", label: "180p" },
        ],
        steps: [
          { title: "Publisher uploads simulcast", description: "Three layers encoded in parallel are sent over RTP.", activeNodes: ["pub", "sfu"], activeEdges: ["e0"], packets: [{ edgeId: "e0", color: "#22d3ee" }] },
          { title: "SFU inspects subscriber bandwidth", description: "REMB / TWCC feedback tells the SFU each subscriber's available bitrate.", activeNodes: ["sfu"] },
          { title: "Forward best-fit layer", description: "Each subscriber receives only the layer their link can handle.", activeNodes: ["sfu", "s1", "s2", "s3"], activeEdges: ["e1", "e2", "e3"], packets: [
            { edgeId: "e1", color: "#dc2626" },
            { edgeId: "e2", color: "#f59e0b" },
            { edgeId: "e3", color: "#4ade80" },
          ] },
          { title: "Congestion drops a subscriber", description: "If Sub1 loses bandwidth, SFU switches them to 360p — no re-encode needed.", activeNodes: ["sfu", "s1"], notes: ["Zero transcoding cost", "Sub-second quality adaptation"] },
        ],
      },
    ],
  },

  // ============================================================
  // 5. Food Delivery Dispatch
  // ============================================================
  {
    id: "food-delivery",
    slug: "food-delivery",
    title: "Food Delivery Dispatch",
    icon: "🛵",
    difficulty: "hard",
    category: "Logistics",
    description:
      "Match orders to couriers, predict delivery times, and batch pickups — the DoorDash / Uber Eats core.",
    realWorld: ["DoorDash", "Uber Eats", "Deliveroo", "Swiggy"],
    diagram: `graph TD
    C[Customer] --> OS[Order Service]
    OS --> RS[Restaurant<br/>Service]
    OS --> DS[Dispatcher]
    DS --> ETA[ETA Predictor<br/>ML]
    DS --> GEO[Geo Index<br/>H3]
    GEO --> CS[Courier Sim]
    DS -->|assign| CR[Courier App]
    RS --> CR
    style DS fill:#F59E0B,color:#000
    style ETA fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Orders/day", value: "10M" },
      { label: "Peak dispatches", value: "50K/min" },
      { label: "ETA error", value: "± 3 min" },
      { label: "Batch rate", value: "30%", hint: "2 orders per trip" },
    ],
    tradeoffs: [
      {
        option: "Greedy nearest-courier",
        pros: ["Fast, simple", "Low compute"],
        cons: ["Ignores future orders", "Bad for batching"],
      },
      {
        option: "Batched optimization window",
        pros: ["Can batch 2 orders per courier", "Global optimum"],
        cons: ["Customers wait longer for assignment", "Harder to tune"],
      },
      {
        option: "RL-based dispatcher",
        pros: ["Adapts to demand surges", "Best long-term efficiency"],
        cons: ["Expensive to train", "Hard to debug failures"],
      },
    ],
    content: `## Food Delivery Dispatch

### The Three-Sided Problem

Customer wants fast delivery; restaurant wants timely pickup; courier wants continuous earning. The dispatcher is the meeting point — a constrained matching problem under tight SLA.

### Geo Indexing (H3)

Uber's **H3** hex grid turns a lat/lng into a 64-bit index. A k-ring around a restaurant finds nearby couriers in O(k) regardless of world size. Alternative: geohash, but hex avoids corner distortions.

### ETA = Prep + Drive + Drop

- **Prep time**: per-restaurant historical median + current queue depth.
- **Drive time**: routing API (e.g., OSRM) corrected by live traffic.
- **Drop time**: apartment vs single family, time of day, weather.

### Batching

If two orders have pickups within 400m and drops within 800m **and** their ETAs overlap, a courier can deliver both in one trip. This is solved as a mini **Vehicle Routing Problem** per batching window (typically 10s).

### Supply Balancing

Offer **bonuses / price surges** in regions where demand exceeds supply. A second pipeline runs on a 1-minute cadence, computing region-level elasticity from historical data.
`,
    keyTakeaways: [
      "H3 hex grids make nearest-courier queries O(k-ring)",
      "ETA = prep + drive + drop, each modelled separately",
      "Batching is a 10s VRP, not a realtime decision",
      "Supply balancing runs on a slower loop than dispatch",
    ],
    animations: [
      {
        id: "dispatch-flow",
        title: "Order → Dispatch → Delivery",
        description: "From order placement to courier assignment.",
        intervalMs: 2400,
        nodes: [
          { id: "cust", label: "Customer", icon: "🙋", x: 6, y: 50, kind: "client" },
          { id: "os", label: "Order Svc", icon: "🟢", x: 22, y: 50, kind: "service" },
          { id: "disp", label: "Dispatcher", icon: "🎯", x: 42, y: 50, kind: "service" },
          { id: "geo", label: "H3 Index", icon: "🗺️", x: 60, y: 20, kind: "cache" },
          { id: "eta", label: "ETA Model", icon: "🧠", x: 60, y: 80, kind: "service" },
          { id: "cour", label: "Courier", icon: "🛵", x: 82, y: 50, kind: "client" },
          { id: "rest", label: "Restaurant", icon: "🍕", x: 94, y: 50, kind: "external" },
        ],
        edges: [
          { id: "e1", from: "cust", to: "os" },
          { id: "e2", from: "os", to: "disp" },
          { id: "e3", from: "disp", to: "geo", label: "k-ring" },
          { id: "e4", from: "disp", to: "eta" },
          { id: "e5", from: "disp", to: "cour", label: "assign" },
          { id: "e6", from: "cour", to: "rest", label: "pickup" },
        ],
        steps: [
          { title: "Customer places order", description: "Order persisted and routed to dispatcher.", activeNodes: ["cust", "os"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Find candidate couriers", description: "Dispatcher queries H3 k-ring around the restaurant.", activeNodes: ["disp", "geo"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#f59e0b" }] },
          { title: "Score each candidate", description: "ETA model scores (courier × order) pairs on prep + drive + drop.", activeNodes: ["disp", "eta"], activeEdges: ["e4"], notes: ["Lower expected total time = higher score"] },
          { title: "Consider batching", description: "If another order is within the batching window & radius, pair them.", activeNodes: ["disp"] },
          { title: "Assign best courier", description: "Offer goes out; courier has 10s to accept before fallback.", activeNodes: ["disp", "cour"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#10b981" }] },
          { title: "Courier heads to restaurant", description: "Pickup → deliver; real-time GPS updates refine ETA for the customer.", activeNodes: ["cour", "rest"], activeEdges: ["e6"], packets: [{ edgeId: "e6", color: "#7c3aed" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 6. Hotel / Flight Booking
  // ============================================================
  {
    id: "booking-system",
    slug: "booking-system",
    title: "Hotel / Flight Booking",
    icon: "🏨",
    difficulty: "hard",
    category: "Transactions",
    description:
      "Design inventory & reservations with strong consistency — no double-bookings, even under load.",
    realWorld: ["Booking.com", "Expedia", "Airbnb", "Kayak"],
    diagram: `graph TD
    U[User] --> API[Booking API]
    API --> INV[Inventory Svc]
    INV --> C[(Inventory DB<br/>SERIALIZABLE)]
    API --> PAY[Payment Svc]
    PAY --> STRIPE[Stripe]
    API --> SAGA[Saga Coord.]
    SAGA --> INV
    SAGA --> PAY
    SAGA --> NOTIF[Notification]
    style INV fill:#DC2626,color:#fff
    style SAGA fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Searches/day", value: "1B" },
      { label: "Bookings/day", value: "5M" },
      { label: "Search latency", value: "< 300ms" },
      { label: "Availability TTL", value: "15 min", hint: "Price/seat lock" },
    ],
    tradeoffs: [
      {
        option: "Lock on read (pessimistic)",
        pros: ["No double-booking possible"],
        cons: ["Kills concurrency", "Users abandon long searches"],
      },
      {
        option: "Optimistic concurrency (CAS)",
        pros: ["High throughput", "Retries are cheap"],
        cons: ["Rare conflicts surface to user as error"],
      },
      {
        option: "Saga (compensating txns)",
        pros: ["Works across microservices", "No distributed txn manager"],
        cons: ["Compensations must be idempotent", "Harder to reason about"],
      },
    ],
    content: `## Hotel / Flight Booking

### The Double-Booking Nightmare

Two users trying to buy the last seat is the oldest problem in the book. Solutions progress from row-level locks to optimistic CAS to sagas — each trading concurrency for correctness.

### Temporary Holds

A **15-minute hold** (row with \`status=held\`, \`hold_expires_at\`) on the seat/room prevents others from buying it while the user enters payment details. A sweeper removes expired holds.

### Saga for Payment

1. Reserve inventory (hold).
2. Charge card (external — may take seconds).
3. On success: confirm inventory.
4. On failure: **compensate** — release the hold.

Each step is a separate service; the saga coordinator (or events in a queue) drives the state machine.

### Search Performance

- Indexed on (city, checkInDate, checkOutDate).
- Aggressive **result caching** for popular queries (top 100 cities, next 30 days) — 15s TTL.
- **Pricing API** is the slowest step; parallelize calls to supplier GDS systems.

### Availability Cache

A **hot path** Redis cache of \`available(hotel, date) → rooms_left\`. Decrement optimistically; DB is the source of truth on conflict.
`,
    keyTakeaways: [
      "Temporary holds bridge the gap between search and payment",
      "Sagas beat 2PC for multi-service transactions",
      "Optimistic concurrency scales better than locks for booking workloads",
      "Search cache TTL must be short enough to avoid stale availability",
    ],
    animations: [
      {
        id: "booking-saga",
        title: "Saga: Hold → Pay → Confirm",
        description: "A booking's happy path and rollback.",
        intervalMs: 2500,
        nodes: [
          { id: "u", label: "User", icon: "👤", x: 6, y: 50, kind: "client" },
          { id: "api", label: "Booking API", icon: "🟢", x: 22, y: 50, kind: "service" },
          { id: "inv", label: "Inventory", icon: "🛏️", x: 42, y: 25, kind: "service" },
          { id: "db", label: "Inv DB", icon: "🗄️", x: 62, y: 25, kind: "db" },
          { id: "pay", label: "Payment", icon: "💳", x: 42, y: 75, kind: "service" },
          { id: "stripe", label: "Stripe", icon: "🌐", x: 62, y: 75, kind: "external" },
          { id: "saga", label: "Saga Coord.", icon: "🧭", x: 82, y: 50, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "u", to: "api" },
          { id: "e2", from: "api", to: "inv", label: "hold" },
          { id: "e3", from: "inv", to: "db" },
          { id: "e4", from: "api", to: "pay", label: "charge" },
          { id: "e5", from: "pay", to: "stripe" },
          { id: "e6", from: "saga", to: "inv", label: "confirm/revert" },
        ],
        steps: [
          { title: "User clicks Book", description: "Booking API receives the reservation intent.", activeNodes: ["u", "api"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Place 15-minute hold", description: "Inventory service conditionally updates the room status to 'held'.", activeNodes: ["api", "inv", "db"], activeEdges: ["e2", "e3"], packets: [{ edgeId: "e2", color: "#f59e0b" }, { edgeId: "e3", color: "#f59e0b" }] },
          { title: "Charge payment method", description: "Async call to the payment provider; can take seconds.", activeNodes: ["api", "pay", "stripe"], activeEdges: ["e4", "e5"], packets: [{ edgeId: "e4", color: "#10b981" }, { edgeId: "e5", color: "#10b981" }] },
          { title: "Saga coordinator resolves", description: "On success, flip hold → confirmed. On failure, emit a compensating release.", activeNodes: ["saga", "inv"], activeEdges: ["e6"], notes: ["Compensations must be idempotent", "Timeouts trigger sweeper"] },
          { title: "Confirmation emailed", description: "Notification service sends booking confirmation.", activeNodes: ["api"] },
        ],
      },
    ],
  },

  // ============================================================
  // 7. Recommendation Engine
  // ============================================================
  {
    id: "recommendation-engine",
    slug: "recommendation-engine",
    title: "Recommendation Engine",
    icon: "🎯",
    difficulty: "hard",
    category: "ML",
    description:
      "Serve personalized recommendations with candidate generation + ranking at sub-100ms latency.",
    realWorld: ["YouTube", "Netflix", "Spotify", "TikTok"],
    diagram: `graph LR
    U[User] --> API[Recs API]
    API --> CG[Candidate<br/>Gen]
    CG --> ANN[(ANN Index<br/>HNSW)]
    CG --> HIST[(User History)]
    API --> RK[Ranker<br/>DeepFM]
    RK --> FS[(Feature Store)]
    API --> DIV[Diversifier]
    DIV --> U
    style CG fill:#F59E0B,color:#000
    style RK fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Catalog size", value: "100M items" },
      { label: "Candidate pool", value: "500", hint: "Per request" },
      { label: "Rank latency", value: "< 50ms" },
      { label: "Model refresh", value: "Hourly" },
    ],
    tradeoffs: [
      {
        option: "Collaborative filtering only",
        pros: ["Captures user taste signals", "Simple to ship"],
        cons: ["Cold-start for new users/items", "Filter bubble"],
      },
      {
        option: "Content-based only",
        pros: ["Works for new items", "Explainable"],
        cons: ["No serendipity", "Missing user context"],
      },
      {
        option: "Two-tower hybrid",
        pros: ["Fast ANN retrieval", "Combines both signals"],
        cons: ["Training pipeline complexity", "Embedding drift"],
      },
    ],
    content: `## Recommendation Engine

### Two-Stage Architecture

1. **Candidate generation**: reduce 100M items → ~500 plausible ones in < 10ms.
2. **Ranking**: a heavier model scores the 500 candidates with rich features.

This is universal across Netflix, YouTube, TikTok — it's the only way to hit latency targets against a massive catalog.

### Candidate Generators

- **ANN search**: embed user & items in the same space; retrieve K nearest items via HNSW/FAISS.
- **Collaborative filtering**: "users who liked X also liked Y" precomputed offline.
- **Trending**: recency-weighted popularity in the user's geography.
- **Recent history**: items similar to the last 10 watched.

Each generator contributes some candidates; union deduplicated.

### Ranker (DeepFM / Wide&Deep)

Inputs: user features (demographics, history), item features (topic, creator, recency), interaction features (click-through rate). Output: predicted engagement (watch-time, like).

### Diversification

Pure ranker output looks like 10 copies of the same thing. Apply **MMR** or **Determinantal Point Process** to drop items too similar to already-chosen ones.

### Online Learning

Impression & click logs stream into a feature store every minute; small online updates nudge user embeddings without a full retrain.
`,
    keyTakeaways: [
      "Two-stage (candidate + ranker) is the universal recs pattern",
      "ANN on embeddings gives sub-10ms retrieval at 100M scale",
      "Diversification saves the feed from mono-topic boredom",
      "Online feature updates close the loop in near-real-time",
    ],
    animations: [
      {
        id: "recs-flow",
        title: "Request → 500 → 50 → 10 shown",
        description: "Funnel from catalog to final feed.",
        intervalMs: 2400,
        nodes: [
          { id: "u", label: "User", icon: "👤", x: 6, y: 50, kind: "client" },
          { id: "api", label: "Recs API", icon: "🟢", x: 22, y: 50, kind: "service" },
          { id: "ann", label: "ANN", icon: "🔎", x: 42, y: 25, kind: "cache" },
          { id: "cf", label: "CF", icon: "🧠", x: 42, y: 75, kind: "service" },
          { id: "rk", label: "Ranker", icon: "🎯", x: 62, y: 50, kind: "service" },
          { id: "div", label: "Diversifier", icon: "🎨", x: 82, y: 50, kind: "service" },
          { id: "feed", label: "Feed", icon: "📋", x: 96, y: 50, kind: "client" },
        ],
        edges: [
          { id: "e1", from: "u", to: "api" },
          { id: "e2", from: "api", to: "ann" },
          { id: "e3", from: "api", to: "cf" },
          { id: "e4", from: "ann", to: "rk" },
          { id: "e5", from: "cf", to: "rk" },
          { id: "e6", from: "rk", to: "div" },
          { id: "e7", from: "div", to: "feed" },
        ],
        steps: [
          { title: "User opens app", description: "Recs API receives the request with user context.", activeNodes: ["u", "api"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Candidate generators fire", description: "ANN & CF each return ~250 candidates in parallel.", activeNodes: ["api", "ann", "cf"], activeEdges: ["e2", "e3"], packets: [{ edgeId: "e2", color: "#f59e0b" }, { edgeId: "e3", color: "#f59e0b" }] },
          { title: "Merge & dedupe", description: "~500 unique candidates forwarded to the ranker.", activeNodes: ["ann", "cf", "rk"], activeEdges: ["e4", "e5"], packets: [{ edgeId: "e4", color: "#10b981" }, { edgeId: "e5", color: "#10b981" }] },
          { title: "Score & top-K", description: "DeepFM scores all 500; keep top 50 by predicted engagement.", activeNodes: ["rk", "div"], activeEdges: ["e6"], packets: [{ edgeId: "e6", color: "#7c3aed" }] },
          { title: "Diversify & render", description: "MMR drops near-duplicates, returning 10 items to the client.", activeNodes: ["div", "feed"], activeEdges: ["e7"], packets: [{ edgeId: "e7", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 8. CI/CD Pipeline
  // ============================================================
  {
    id: "ci-cd-pipeline",
    slug: "ci-cd-pipeline",
    title: "CI/CD Pipeline",
    icon: "🚀",
    difficulty: "medium",
    category: "DevOps",
    description:
      "Design a build → test → deploy system that scales to thousands of commits per day with safe rollouts.",
    realWorld: ["GitHub Actions", "CircleCI", "Jenkins", "GitLab CI", "Buildkite"],
    diagram: `graph LR
    DEV[Dev Push] --> WEB[Webhook]
    WEB --> SCH[Scheduler]
    SCH --> RUN[Runner Pool]
    RUN --> ART[Artifact Store]
    ART --> REG[(Registry)]
    REG --> CD[CD Service]
    CD --> K8S[Kubernetes]
    K8S --> PROD[Production]
    style SCH fill:#F59E0B,color:#000
    style CD fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Builds/day", value: "100K" },
      { label: "Runner pool", value: "10K VMs" },
      { label: "Queue p50", value: "< 5s" },
      { label: "Deploy time", value: "< 3 min" },
    ],
    tradeoffs: [
      {
        option: "Rolling deploy",
        pros: ["Zero downtime", "Incremental risk"],
        cons: ["Mixed versions live", "Hard to debug issues"],
      },
      {
        option: "Blue/Green",
        pros: ["Instant rollback", "Clean version separation"],
        cons: ["2× resources during swap", "DB migrations tricky"],
      },
      {
        option: "Canary (1% → 10% → 100%)",
        pros: ["Catches bad deploys early", "Metric-driven rollout"],
        cons: ["Longer deploy time", "Requires traffic slicing"],
      },
    ],
    content: `## CI/CD Pipeline

### Fan-in / Fan-out

Triggers (push, PR, cron, chatops) fan in to a scheduler. Jobs fan out to a runner pool — each runner is ephemeral (VM or container) to prevent state leakage.

### Caching

- **Dependency cache** keyed by \`hash(lockfile)\`: saves 60% of build time.
- **Docker layer cache** via BuildKit remote cache.
- **Test cache**: skip tests whose inputs are unchanged (Bazel-style).

### Runner Pool Autoscaling

- Queue length → desired capacity.
- Scale up in ~30s (warm AMIs, pre-pulled images).
- Scale down aggressively to contain cost.
- Spot/preemptible instances for stateless jobs.

### Deploy Strategies

- **Rolling**: N-at-a-time replacement.
- **Blue/Green**: two environments, atomic cutover.
- **Canary**: percentage-based, auto-abort on bad metrics.

### Safe Rollbacks

- Every deploy tagged with an immutable image digest.
- \`kubectl rollout undo\` or re-apply the previous manifest.
- DB migrations must be **backward compatible** to allow safe rollback without data-layer surprises.
`,
    keyTakeaways: [
      "Ephemeral runners prevent state leakage across builds",
      "Caching is the #1 lever for build speed",
      "Canary deploys catch bad releases before full rollout",
      "Backward-compatible migrations unblock rollback",
    ],
    animations: [
      {
        id: "cicd-flow",
        title: "Commit to Production",
        description: "A git push traveling through the pipeline.",
        intervalMs: 2300,
        nodes: [
          { id: "dev", label: "Dev", icon: "👨‍💻", x: 6, y: 50, kind: "client" },
          { id: "hook", label: "Webhook", icon: "🪝", x: 22, y: 50, kind: "service" },
          { id: "sch", label: "Scheduler", icon: "📅", x: 38, y: 50, kind: "service" },
          { id: "run", label: "Runners", icon: "🏃", x: 54, y: 50, kind: "worker" },
          { id: "reg", label: "Registry", icon: "📦", x: 70, y: 50, kind: "storage" },
          { id: "cd", label: "CD", icon: "🚢", x: 84, y: 50, kind: "service" },
          { id: "prod", label: "Prod", icon: "🌐", x: 96, y: 50, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "dev", to: "hook" },
          { id: "e2", from: "hook", to: "sch" },
          { id: "e3", from: "sch", to: "run" },
          { id: "e4", from: "run", to: "reg", label: "image" },
          { id: "e5", from: "reg", to: "cd" },
          { id: "e6", from: "cd", to: "prod", label: "canary" },
        ],
        steps: [
          { title: "Git push", description: "Webhook fires on branch update.", activeNodes: ["dev", "hook"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Scheduler queues jobs", description: "Build + lint + test jobs go onto the queue.", activeNodes: ["hook", "sch"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Runners execute", description: "A pool of ephemeral runners picks up jobs; cache keys reuse deps.", activeNodes: ["sch", "run"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Publish artifact", description: "Passing build produces an image with a content-addressable digest.", activeNodes: ["run", "reg"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#7c3aed" }] },
          { title: "Canary rollout", description: "CD routes 1% traffic to new version, monitors error rate, then ramps up.", activeNodes: ["reg", "cd", "prod"], activeEdges: ["e5", "e6"], packets: [{ edgeId: "e5", color: "#fb7185" }, { edgeId: "e6", color: "#4ade80" }], notes: ["Auto-abort on SLO regression"] },
        ],
      },
    ],
  },

  // ============================================================
  // 9. Feature Flag Service
  // ============================================================
  {
    id: "feature-flags",
    slug: "feature-flags",
    title: "Feature Flag Service",
    icon: "🚩",
    difficulty: "medium",
    category: "Developer Tools",
    description:
      "Design a service that toggles code paths per-user with sub-ms evaluation and real-time updates to thousands of servers.",
    realWorld: ["LaunchDarkly", "Optimizely", "Unleash", "Flagsmith"],
    diagram: `graph LR
    UI[Admin UI] --> API[Flag API]
    API --> DB[(Config DB)]
    API --> PUB[Pub/Sub]
    PUB --> SDK[SDK in App]
    SDK --> CACHE[In-proc Cache]
    APP[App Code] --> SDK
    SDK --> EVT[Event Pipe]
    EVT --> ANA[(Analytics)]
    style SDK fill:#10B981,color:#fff
    style PUB fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Evaluations/s", value: "10M", hint: "Global" },
      { label: "Eval latency", value: "< 1 µs", hint: "Local, in-proc" },
      { label: "Flag propagation", value: "< 200ms" },
      { label: "Daily unique flags", value: "50K" },
    ],
    tradeoffs: [
      {
        option: "Server-side evaluation",
        pros: ["Rules hidden from clients", "Central audit"],
        cons: ["Round-trip per eval", "Server becomes critical path"],
      },
      {
        option: "Client-side evaluation (SDK)",
        pros: ["Sub-µs local lookup", "Offline-friendly"],
        cons: ["Rules exposed in bundles", "Stale until next fetch"],
      },
      {
        option: "Streaming updates (SSE)",
        pros: ["Near-real-time propagation", "Low overhead on steady state"],
        cons: ["Long-lived connections to manage", "Reconnect storms"],
      },
    ],
    content: `## Feature Flag Service

### Why Flags Matter

Decouple **deploy** from **release**: code can ship dark and flip on later. Also enables kill switches, gradual rollouts, A/B experiments, entitlements.

### Evaluation Model

A flag's config is a rules tree: \`IF user.plan == 'pro' AND country IN (US,CA) THEN true ELSE percentile(hash(user.id)) < 20\`.

The SDK caches this config locally and evaluates it for each call — no network round-trip.

### Propagation

- Admin change hits the API → persists to DB → publishes to a stream (SSE / WebSocket / MQTT).
- Every SDK instance has an open connection; update arrives in < 200ms worldwide.
- On reconnect, SDK fetches the current config snapshot to catch up.

### Consistency

**Eventual** — briefly different servers may see different flag values. This is acceptable; never use flags for financial decisions.

### Experimentation

Every eval emits an **impression event** (user, flag, variant). Joined with conversion events downstream to compute lift per variant. Guards against **assignment leakage** by recording the user's bucket on first eval.

### Flag Hygiene

Flags have a lifecycle. Stale ones accumulate — track last-evaluated-at timestamps; auto-nag owners to clean up unused flags after 30 days.
`,
    keyTakeaways: [
      "Client-side SDK eval is the only way to hit sub-µs",
      "Streaming updates beat polling for propagation latency",
      "Every eval emits an impression — the A/B substrate",
      "Track flag lifecycle; stale flags are tech debt",
    ],
    animations: [
      {
        id: "ff-flow",
        title: "Flip a Flag → 10M servers",
        description: "Admin change propagating to every SDK worldwide.",
        intervalMs: 2400,
        nodes: [
          { id: "adm", label: "Admin", icon: "👨‍💼", x: 6, y: 50, kind: "client" },
          { id: "api", label: "Flag API", icon: "🟢", x: 22, y: 50, kind: "service" },
          { id: "db", label: "Config DB", icon: "🗄️", x: 38, y: 20, kind: "db" },
          { id: "pub", label: "Pub/Sub", icon: "📡", x: 38, y: 80, kind: "queue" },
          { id: "sdk1", label: "App SDK 1", icon: "📦", x: 66, y: 25, kind: "service" },
          { id: "sdk2", label: "App SDK 2", icon: "📦", x: 66, y: 50, kind: "service" },
          { id: "sdk3", label: "App SDK N", icon: "📦", x: 66, y: 75, kind: "service" },
          { id: "app", label: "App Code", icon: "💻", x: 90, y: 50, kind: "client" },
        ],
        edges: [
          { id: "e1", from: "adm", to: "api" },
          { id: "e2", from: "api", to: "db" },
          { id: "e3", from: "api", to: "pub" },
          { id: "e4", from: "pub", to: "sdk1" },
          { id: "e5", from: "pub", to: "sdk2" },
          { id: "e6", from: "pub", to: "sdk3" },
          { id: "e7", from: "sdk2", to: "app", label: "eval" },
        ],
        steps: [
          { title: "Admin toggles the flag", description: "Config change submitted via UI.", activeNodes: ["adm", "api"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Persist & publish", description: "New rules saved; change event fans out.", activeNodes: ["api", "db", "pub"], activeEdges: ["e2", "e3"], packets: [{ edgeId: "e2", color: "#10b981" }, { edgeId: "e3", color: "#f59e0b" }] },
          { title: "SDKs receive update", description: "Every connected SDK receives the delta in < 200ms.", activeNodes: ["pub", "sdk1", "sdk2", "sdk3"], activeEdges: ["e4", "e5", "e6"], packets: [
            { edgeId: "e4", color: "#7c3aed" },
            { edgeId: "e5", color: "#7c3aed" },
            { edgeId: "e6", color: "#7c3aed" },
          ] },
          { title: "App evaluates locally", description: "Next call to flags.isOn(key) reads the new rule — sub-µs, no network.", activeNodes: ["sdk2", "app"], activeEdges: ["e7"], packets: [{ edgeId: "e7", color: "#4ade80" }], notes: ["Impression emitted asynchronously"] },
        ],
      },
    ],
  },

  // ============================================================
  // 10. Fraud Detection
  // ============================================================
  {
    id: "fraud-detection",
    slug: "fraud-detection",
    title: "Real-time Fraud Detection",
    icon: "🛡️",
    difficulty: "hard",
    category: "ML",
    description:
      "Score every transaction in < 100ms using rules + ML, with feedback loops for adaptive protection.",
    realWorld: ["Stripe Radar", "PayPal", "Visa", "Adyen"],
    diagram: `graph LR
    TX[Transaction] --> FE[Feature Extract]
    FE --> FS[(Feature Store)]
    FE --> RL[Rules Engine]
    FE --> ML[ML Model]
    RL --> D[Decision]
    ML --> D
    D -->|allow/block/3DS| TX
    D --> LOG[(Event Log)]
    LOG --> RT[Re-train]
    RT --> ML
    style ML fill:#7C3AED,color:#fff
    style D fill:#DC2626,color:#fff`,
    scaleMetrics: [
      { label: "Transactions/s", value: "50K" },
      { label: "Decision latency", value: "< 100ms" },
      { label: "Recall", value: "85%", hint: "Of fraud caught" },
      { label: "False-positive rate", value: "< 1%" },
    ],
    tradeoffs: [
      {
        option: "Rules-only",
        pros: ["Explainable", "Easy to add new checks"],
        cons: ["Bypassed by adaptive fraudsters", "High maintenance"],
      },
      {
        option: "ML-only",
        pros: ["Catches novel patterns", "Self-improving"],
        cons: ["Opaque — hard to debug", "Biases in training data"],
      },
      {
        option: "Layered (rules + ML)",
        pros: ["Rules as tripwire, ML as scorer", "Best coverage"],
        cons: ["Two systems to maintain", "Conflict resolution rules needed"],
      },
    ],
    content: `## Real-time Fraud Detection

### Why < 100ms Matters

The check runs **inline** during checkout. Users abandon slow carts. Every ms counts against revenue.

### Feature Extraction

Features are **per-entity** rollups over different time windows:

- **Card**: txns in last 1h / 24h / 7d; count of unique merchants; chargeback history.
- **Device**: new device?; IP reputation; geolocation drift.
- **Merchant**: recent dispute rate; avg ticket size.

All sourced from a **real-time feature store** (Redis / Cassandra) updated by the event log.

### Rules + ML

- Rules catch "known bad" quickly: 20 txns in 60s, BIN blocklist, geo mismatch.
- An ML model (gradient-boosted trees or DNN) assigns a risk score 0–1.
- The combined decision: rule-hit → block; high ML score → **3DS challenge**; low score → allow.

### Labelling Problem

True labels arrive **weeks later** when chargebacks land. Models must work from a delayed ground-truth loop. Use semi-supervised methods and pre-label with rules-based signals.

### Adversarial Adaptation

Fraudsters probe the system. **Shadow deploys** run new models in parallel without blocking, so you can compare before switching. Monitor feature drift and retrain weekly.
`,
    keyTakeaways: [
      "Inline check → latency budget < 100ms end-to-end",
      "Feature store is the heart — rollups keyed by card/device/merchant",
      "Combine rules (fast, explainable) with ML (adaptive, catch novel)",
      "Chargebacks are delayed labels; shadow-deploy models before switch",
    ],
    animations: [
      {
        id: "fraud-flow",
        title: "Scoring a Transaction",
        description: "From swipe to decision in under 100ms.",
        intervalMs: 2200,
        nodes: [
          { id: "tx", label: "Transaction", icon: "💳", x: 6, y: 50, kind: "client" },
          { id: "fe", label: "Feature Extract", icon: "🧩", x: 26, y: 50, kind: "service" },
          { id: "fs", label: "Feature Store", icon: "🗃️", x: 46, y: 20, kind: "cache" },
          { id: "rl", label: "Rules", icon: "📋", x: 46, y: 80, kind: "service" },
          { id: "ml", label: "ML Model", icon: "🧠", x: 66, y: 50, kind: "service" },
          { id: "d", label: "Decision", icon: "⚖️", x: 86, y: 50, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "tx", to: "fe" },
          { id: "e2", from: "fe", to: "fs", label: "lookup" },
          { id: "e3", from: "fe", to: "rl" },
          { id: "e4", from: "fe", to: "ml" },
          { id: "e5", from: "rl", to: "d" },
          { id: "e6", from: "ml", to: "d" },
          { id: "e7", from: "d", to: "tx", label: "verdict" },
        ],
        steps: [
          { title: "Txn arrives", description: "Authorization request hits the fraud pipeline.", activeNodes: ["tx", "fe"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Pull rolling features", description: "Feature store returns card + device + merchant rollups.", activeNodes: ["fe", "fs"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Rules + ML in parallel", description: "Rules engine & model score the txn concurrently.", activeNodes: ["fe", "rl", "ml"], activeEdges: ["e3", "e4"], packets: [{ edgeId: "e3", color: "#10b981" }, { edgeId: "e4", color: "#7c3aed" }] },
          { title: "Combine", description: "Hard rules win → block. Otherwise model score decides allow / 3DS challenge.", activeNodes: ["rl", "ml", "d"], activeEdges: ["e5", "e6"], packets: [{ edgeId: "e5", color: "#dc2626" }, { edgeId: "e6", color: "#dc2626" }] },
          { title: "Verdict returned", description: "Decision sent back to the payment authorization flow.", activeNodes: ["d", "tx"], activeEdges: ["e7"], packets: [{ edgeId: "e7", color: "#4ade80" }], notes: ["All steps completed within 100ms budget"] },
        ],
      },
    ],
  },

  // ============================================================
  // 11. Web Analytics Tracker
  // ============================================================
  {
    id: "web-analytics",
    slug: "web-analytics",
    title: "Web Analytics Tracker",
    icon: "📈",
    difficulty: "medium",
    category: "Data",
    description:
      "Design a pipeline that ingests billions of pageviews/day with efficient aggregation and dashboards.",
    realWorld: ["Google Analytics", "Mixpanel", "Amplitude", "Plausible"],
    diagram: `graph LR
    JS[Tracker JS] --> CF[CDN Edge]
    CF --> COL[Collector]
    COL --> Q[(Kafka)]
    Q --> EN[Enricher]
    EN --> DL[(Data Lake)]
    EN --> OLAP[(Druid)]
    OLAP --> DASH[Dashboard]
    style CF fill:#10B981,color:#fff
    style OLAP fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Events/day", value: "50B" },
      { label: "Collect p99", value: "< 30ms" },
      { label: "Dashboard p50", value: "< 1s" },
      { label: "Retention", value: "2 yrs raw" },
    ],
    tradeoffs: [
      {
        option: "Synchronous write to store",
        pros: ["Fresh data", "Simple"],
        cons: ["Store becomes the bottleneck", "Tracker slowness harms page load"],
      },
      {
        option: "Queue + batch loader",
        pros: ["Absorbs bursts", "Tracker stays fast"],
        cons: ["Small ingest lag", "Extra infra"],
      },
      {
        option: "CDN edge collector",
        pros: ["Global low latency collection", "Offloads origin"],
        cons: ["Harder debugging", "Tie-in to CDN vendor"],
      },
    ],
    content: `## Web Analytics Tracker

### Collector Design

A 1×1 pixel or \`navigator.sendBeacon\` POST fires from the browser. Received at the nearest **CDN edge** which appends a timestamp + geo + IP, drops into a Kafka topic via Lambda@Edge.

### Enrichment

- UA string → browser/OS/device.
- IP → city/country (MaxMind DB).
- Referrer → channel (organic / paid / direct).
- Sessionization: same user + inactivity gap < 30 min = same session.

### Storage Tiers

| Tier | Store | TTL | Purpose |
|------|-------|-----|---------|
| Hot | Druid/Pinot | 90 days | Interactive dashboards |
| Warm | Parquet in S3 | 1 year | Ad-hoc Presto |
| Cold | Glacier | 7 years | Compliance |

### Sessionization

Event time based: on event E with user U, check if the prior event for U was within the session timeout. Otherwise start a new session. Done as a stateful stream job keyed by user.

### Sampling

For very high-volume customers, emit **1-in-N** events (preserving full cardinality in aggregates via scaling). Essential for hot keys.
`,
    keyTakeaways: [
      "CDN edge + Kafka absorbs spikes without hitting the origin",
      "Enrichment (UA/geo/session) is a stream-processing job",
      "Tier to OLAP (hot), columnar (warm), Glacier (cold)",
      "Sampling is the only way to survive top-1% customers",
    ],
    animations: [
      {
        id: "analytics-flow",
        title: "Pageview Journey",
        description: "A single event travels from browser to dashboard.",
        intervalMs: 2300,
        nodes: [
          { id: "br", label: "Browser", icon: "🌐", x: 6, y: 50, kind: "client" },
          { id: "cdn", label: "CDN Edge", icon: "☁️", x: 22, y: 50, kind: "cdn" },
          { id: "q", label: "Kafka", icon: "📨", x: 38, y: 50, kind: "queue" },
          { id: "en", label: "Enricher", icon: "🧩", x: 54, y: 50, kind: "service" },
          { id: "dl", label: "Data Lake", icon: "🗃️", x: 70, y: 25, kind: "storage" },
          { id: "ol", label: "OLAP", icon: "📊", x: 70, y: 75, kind: "db" },
          { id: "d", label: "Dashboard", icon: "📈", x: 94, y: 75, kind: "client" },
        ],
        edges: [
          { id: "e1", from: "br", to: "cdn" },
          { id: "e2", from: "cdn", to: "q" },
          { id: "e3", from: "q", to: "en" },
          { id: "e4", from: "en", to: "dl" },
          { id: "e5", from: "en", to: "ol" },
          { id: "e6", from: "ol", to: "d" },
        ],
        steps: [
          { title: "Beacon sent", description: "Browser fires sendBeacon to nearest CDN edge.", activeNodes: ["br", "cdn"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Edge stamps & enqueues", description: "Lambda@Edge adds geo, drops into Kafka.", activeNodes: ["cdn", "q"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Stream enrichment", description: "UA parsed, session assigned, bot filtered.", activeNodes: ["q", "en"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Dual-write storage", description: "Raw JSON to lake; pre-aggregated to OLAP.", activeNodes: ["en", "dl", "ol"], activeEdges: ["e4", "e5"], packets: [{ edgeId: "e4", color: "#7c3aed" }, { edgeId: "e5", color: "#7c3aed" }] },
          { title: "Dashboard refresh", description: "Grafana queries Druid with sub-second latency.", activeNodes: ["ol", "d"], activeEdges: ["e6"], packets: [{ edgeId: "e6", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 12. Online Multiplayer Game Backend
  // ============================================================
  {
    id: "game-backend",
    slug: "game-backend",
    title: "Multiplayer Game Backend",
    icon: "🎮",
    difficulty: "hard",
    category: "Real-time",
    description:
      "Design matchmaking, authoritative game servers, and anti-cheat for a fast-paced shooter.",
    realWorld: ["Fortnite", "League of Legends", "Valorant", "Apex Legends"],
    diagram: `graph TD
    C[Client] --> LB[Global LB]
    LB --> MM[Matchmaker]
    MM --> ALLOC[Session Allocator]
    ALLOC --> GS[Game Server<br/>authoritative]
    C -->|UDP 60Hz| GS
    GS --> AC[Anti-cheat]
    GS --> DB[(Match Log)]
    DB --> R[Ranking]
    style GS fill:#DC2626,color:#fff
    style AC fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Concurrent players", value: "10M" },
      { label: "Matchmaking p50", value: "< 30s" },
      { label: "Tick rate", value: "60 Hz", hint: "16.7ms per tick" },
      { label: "Session duration", value: "20 min avg" },
    ],
    tradeoffs: [
      {
        option: "Peer-to-peer",
        pros: ["No server cost", "Zero-latency host"],
        cons: ["Host cheats", "NAT problems", "Unfair for non-host"],
      },
      {
        option: "Dedicated authoritative server",
        pros: ["Anti-cheat trivial", "Fair latency to all"],
        cons: ["Expensive", "Must colocate to players"],
      },
      {
        option: "Listen-server + validation",
        pros: ["Cheaper than dedicated", "Still server-authoritative"],
        cons: ["Validation adds compute", "Host still has edge"],
      },
    ],
    content: `## Multiplayer Game Backend

### Matchmaking

Skill-based (Elo / TrueSkill). Group players whose μ ± σ ranges overlap. As wait-time grows, broaden the σ tolerance to keep the queue moving.

### Session Allocation

Once a match is assembled, allocate a **bare-metal** game server close to the player centroid (by latency). Tools: Agones on Kubernetes allocates pre-warmed game-server pods.

### Tick Loop (60 Hz)

Server runs a fixed loop at 16.67ms. Each tick:
1. Apply inputs received since last tick.
2. Run physics / game logic.
3. Snapshot state to each player (delta-encoded).

### Client Prediction + Lag Compensation

- **Client prediction**: client simulates its own movement immediately.
- **Server reconciliation**: when server snapshot disagrees, client replays unacknowledged inputs from the corrected state.
- **Lag compensation for shots**: server rewinds world state to the shooter's time-of-fire to decide hits.

### Anti-cheat

Hooks into the client's memory space to detect hacks. All hit decisions are server-authoritative. Server runs statistical checks: impossible aim snap, bullet spam through walls.
`,
    keyTakeaways: [
      "Dedicated authoritative servers are the only way to be fair",
      "60Hz tick + client prediction + lag comp make latency invisible",
      "Agones + pre-warmed pods deliver sub-second allocation",
      "Server authority is the foundation of anti-cheat",
    ],
    animations: [
      {
        id: "game-match",
        title: "Queue → Match → Game Loop",
        description: "10 players from lobby to an active tick.",
        intervalMs: 2300,
        nodes: [
          { id: "cli", label: "Client", icon: "🎮", x: 6, y: 50, kind: "client" },
          { id: "mm", label: "Matchmaker", icon: "🎯", x: 26, y: 50, kind: "service" },
          { id: "al", label: "Allocator", icon: "📦", x: 46, y: 50, kind: "service" },
          { id: "gs", label: "Game Server", icon: "🖥️", x: 66, y: 50, kind: "worker" },
          { id: "ac", label: "Anti-cheat", icon: "🛡️", x: 84, y: 20, kind: "service" },
          { id: "db", label: "Match Log", icon: "🗄️", x: 84, y: 80, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "cli", to: "mm", label: "join queue" },
          { id: "e2", from: "mm", to: "al" },
          { id: "e3", from: "al", to: "gs", label: "start pod" },
          { id: "e4", from: "cli", to: "gs", label: "UDP 60Hz" },
          { id: "e5", from: "gs", to: "ac" },
          { id: "e6", from: "gs", to: "db" },
        ],
        steps: [
          { title: "Join queue", description: "Client enters matchmaking with its MMR.", activeNodes: ["cli", "mm"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Assemble match", description: "Matchmaker groups 10 players within skill + ping tolerance.", activeNodes: ["mm"] },
          { title: "Allocate server", description: "Allocator chooses region closest to centroid, starts pod.", activeNodes: ["mm", "al", "gs"], activeEdges: ["e2", "e3"], packets: [{ edgeId: "e2", color: "#f59e0b" }, { edgeId: "e3", color: "#f59e0b" }] },
          { title: "Tick loop", description: "UDP inputs flow at 60Hz; server simulates & snapshots back.", activeNodes: ["cli", "gs"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#10b981" }, { edgeId: "e4", color: "#10b981", reverse: true }], notes: ["Tick = 16.67ms", "Client prediction fills gaps"] },
          { title: "Anti-cheat + log", description: "Server streams suspicious events to anti-cheat & persists match log.", activeNodes: ["gs", "ac", "db"], activeEdges: ["e5", "e6"], packets: [{ edgeId: "e5", color: "#dc2626" }, { edgeId: "e6", color: "#7c3aed" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 13. IoT Data Ingestion
  // ============================================================
  {
    id: "iot-ingestion",
    slug: "iot-ingestion",
    title: "IoT Device Ingestion",
    icon: "📡",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Accept telemetry from millions of low-power devices and route it to time-series storage.",
    realWorld: ["AWS IoT Core", "Azure IoT Hub", "Google Cloud IoT", "Tesla fleet"],
    diagram: `graph LR
    D[Device] -->|MQTT| GW[Edge Gateway]
    GW --> BRK[MQTT Broker]
    BRK --> RL[Rule Engine]
    RL --> TSDB[(TSDB)]
    RL --> ALRM[Alert Svc]
    RL --> DL[(Data Lake)]
    style BRK fill:#F59E0B,color:#000
    style TSDB fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Devices", value: "50M" },
      { label: "Msgs/s", value: "1M" },
      { label: "Payload size", value: "< 256B" },
      { label: "TSDB retention", value: "1 yr" },
    ],
    tradeoffs: [
      {
        option: "MQTT",
        pros: ["Low overhead", "QoS levels", "Widely supported"],
        cons: ["Pub/sub semantics can be confusing", "Broker is SPOF without clustering"],
      },
      {
        option: "HTTPS polling",
        pros: ["Easy through firewalls", "Stateless"],
        cons: ["High battery drain", "Higher bandwidth"],
      },
      {
        option: "CoAP over UDP",
        pros: ["Lowest power", "Tiny payloads"],
        cons: ["Less tooling", "Newer standard"],
      },
    ],
    content: `## IoT Device Ingestion

### Why MQTT

A tiny binary protocol with **QoS levels** (0/1/2), publish/subscribe, and keepalive. Built for constrained devices — single-byte fixed header.

### Authentication

- **X.509 client certs** on each device (unique key pair).
- **TLS mutual auth** at broker.
- Certs rotated OTA; revocation list pushed to brokers.

### Rule Engine

A declarative language: \`SELECT * FROM 'temp/+' WHERE value > 80\` → route to alert service + TSDB. Scales horizontally; each rule evaluated once per matching message.

### Time-Series Storage

- Compressed columnar format (Gorilla/Prometheus encoding).
- Downsample: 10s raw → 1m (7d) → 1h (1yr) → 1d (5yr).
- Partition by tenant + device-group to isolate noisy neighbors.

### Offline-First Devices

- Device buffers messages locally while offline.
- Syncs on reconnect with monotonically increasing sequence numbers.
- Broker dedupes on \`(deviceId, seq)\`.
`,
    keyTakeaways: [
      "MQTT + mutual TLS is the baseline for IoT fleets",
      "Rule engine decouples producers from consumers cleanly",
      "TSDB downsampling keeps long-term storage affordable",
      "Devices must handle offline + reconnect gracefully",
    ],
    animations: [
      {
        id: "iot-flow",
        title: "Temperature Spike → Alert",
        description: "A sensor reading from device to PagerDuty.",
        intervalMs: 2200,
        nodes: [
          { id: "dev", label: "Sensor", icon: "🌡️", x: 6, y: 50, kind: "client" },
          { id: "gw", label: "Gateway", icon: "📡", x: 22, y: 50, kind: "service" },
          { id: "brk", label: "MQTT Broker", icon: "📨", x: 40, y: 50, kind: "queue" },
          { id: "rl", label: "Rule Engine", icon: "⚙️", x: 58, y: 50, kind: "service" },
          { id: "ts", label: "TSDB", icon: "📉", x: 76, y: 20, kind: "db" },
          { id: "al", label: "Alerting", icon: "🚨", x: 76, y: 80, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "dev", to: "gw" },
          { id: "e2", from: "gw", to: "brk" },
          { id: "e3", from: "brk", to: "rl" },
          { id: "e4", from: "rl", to: "ts" },
          { id: "e5", from: "rl", to: "al" },
        ],
        steps: [
          { title: "Sensor reports 91°C", description: "Device batches readings and sends every 30s.", activeNodes: ["dev", "gw"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Edge gateway forwards", description: "Local gateway aggregates & forwards to cloud broker.", activeNodes: ["gw", "brk"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Broker fans out", description: "Topic 'temp/+' has two subscribers: TSDB sink & alert rule.", activeNodes: ["brk", "rl"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Write to TSDB & fire alert", description: "Rule 'value > 80' matches → alert service paged.", activeNodes: ["rl", "ts", "al"], activeEdges: ["e4", "e5"], packets: [{ edgeId: "e4", color: "#7c3aed" }, { edgeId: "e5", color: "#dc2626" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 14. Distributed Job Scheduler
  // ============================================================
  {
    id: "job-scheduler",
    slug: "job-scheduler",
    title: "Distributed Job Scheduler",
    icon: "⏰",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Run millions of cron jobs and DAG workflows with retries, backfills, and exactly-once semantics.",
    realWorld: ["Airflow", "Temporal", "AWS Step Functions", "Google Cloud Scheduler"],
    diagram: `graph TD
    UI[UI / CLI] --> SCH[Scheduler]
    SCH --> DB[(Job DB)]
    SCH --> Q[(Task Queue)]
    Q --> W1[Worker 1]
    Q --> W2[Worker 2]
    Q --> W3[Worker N]
    W1 --> R[(Run History)]
    W2 --> R
    W3 --> R
    style SCH fill:#F59E0B,color:#000
    style Q fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Jobs", value: "1M+" },
      { label: "Triggers/s", value: "10K" },
      { label: "Worker pool", value: "1K nodes" },
      { label: "Task p99 retry", value: "3 tries" },
    ],
    tradeoffs: [
      {
        option: "Polling scheduler",
        pros: ["Simple", "Easy to scale horizontally"],
        cons: ["DB-heavy", "Poll interval = latency floor"],
      },
      {
        option: "Event-driven scheduler",
        pros: ["Lower latency", "No useless polling"],
        cons: ["Needs lease-based locks", "Harder recovery"],
      },
      {
        option: "Leader-elected scheduler",
        pros: ["Single writer — simple reasoning", "Good for cron-like"],
        cons: ["Leader is SPOF until failover", "Leader hotspot"],
      },
    ],
    content: `## Distributed Job Scheduler

### The Exactly-Once Lie

You can have **exactly-once triggering** *or* **exactly-once execution** — never both across a network. Most schedulers give at-least-once dispatch + idempotent tasks.

### Time Wheels

For many cron jobs (1M+), a **hierarchical time wheel** is O(1) to schedule and tick. Beats per-job timers or a ORDER BY next_run query.

### Lease + Heartbeat

Worker leases a task for N seconds. If heartbeat stops, the scheduler re-dispatches. Tasks **must be idempotent** because retries are inevitable.

### DAG Workflows

- Task graph with inputs/outputs.
- Scheduler walks ready tasks (deps satisfied) and enqueues.
- Failures propagate to downstream tasks unless a retry policy saves them.

### Backfills

Given a past date range, replay scheduled runs. Must respect original cron expressions; careful with time-zones and DST.

### Observability

Every task logs: start, end, exit, resource usage, stdout/stderr. UI shows Gantt of run history.
`,
    keyTakeaways: [
      "At-least-once dispatch + idempotent tasks is the honest contract",
      "Time wheels beat DB queries at million-job scale",
      "Leases + heartbeat recover crashed workers automatically",
      "Backfills must respect original cron semantics, incl. time-zones",
    ],
    animations: [
      {
        id: "sched-flow",
        title: "Cron Fires → Task Runs",
        description: "Follow a 09:00 UTC cron job through the system.",
        intervalMs: 2200,
        nodes: [
          { id: "cr", label: "Cron Fires", icon: "⏰", x: 6, y: 50, kind: "external" },
          { id: "sch", label: "Scheduler", icon: "📅", x: 24, y: 50, kind: "service" },
          { id: "db", label: "Job DB", icon: "🗄️", x: 42, y: 20, kind: "db" },
          { id: "q", label: "Task Queue", icon: "📬", x: 42, y: 80, kind: "queue" },
          { id: "w", label: "Worker", icon: "👷", x: 66, y: 80, kind: "worker" },
          { id: "hist", label: "Run History", icon: "📜", x: 90, y: 50, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "cr", to: "sch" },
          { id: "e2", from: "sch", to: "db" },
          { id: "e3", from: "sch", to: "q" },
          { id: "e4", from: "q", to: "w" },
          { id: "e5", from: "w", to: "hist" },
        ],
        steps: [
          { title: "Wheel ticks", description: "Time wheel advances; matching jobs emitted.", activeNodes: ["cr", "sch"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Create run row", description: "Scheduler writes a row with status=queued (idempotency key = runId).", activeNodes: ["sch", "db"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#10b981" }] },
          { title: "Enqueue task", description: "Message pushed to queue with lease TTL.", activeNodes: ["sch", "q"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#f59e0b" }] },
          { title: "Worker picks up", description: "Worker leases the task & sends heartbeats while running.", activeNodes: ["q", "w"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#7c3aed" }], notes: ["Heartbeat every 10s", "Lost heartbeat → re-dispatch"] },
          { title: "Log result", description: "On success write status=succeeded, stdout, metrics.", activeNodes: ["w", "hist"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 15. Content Moderation Pipeline
  // ============================================================
  {
    id: "content-moderation",
    slug: "content-moderation",
    title: "Content Moderation",
    icon: "🛡️",
    difficulty: "medium",
    category: "ML",
    description:
      "Screen user-generated text/images/video at upload time with rules, ML, and human review.",
    realWorld: ["Meta", "TikTok", "Reddit", "Discord"],
    diagram: `graph TD
    UP[User Upload] --> ST[Staging Store]
    ST --> HASH[Hash Check<br/>PhotoDNA]
    HASH --> PUB[Publish]
    HASH -->|match| BLK[Block]
    ST --> ML[ML Classifier]
    ML -->|high conf unsafe| BLK
    ML -->|borderline| Q[Human Queue]
    Q --> MOD[Moderator]
    MOD --> BLK
    MOD --> PUB
    style HASH fill:#DC2626,color:#fff
    style MOD fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Uploads/day", value: "1B" },
      { label: "ML latency", value: "< 2s", hint: "Async ok" },
      { label: "Human queue p50", value: "< 5 min" },
      { label: "Auto-actioned", value: "95%" },
    ],
    tradeoffs: [
      {
        option: "Hash match only",
        pros: ["Deterministic", "Fast"],
        cons: ["Misses novel content", "Adversarial edits bypass"],
      },
      {
        option: "ML only",
        pros: ["Catches unseen patterns", "Continuously improves"],
        cons: ["False positives", "Biased on rare cultures"],
      },
      {
        option: "Layered (hash → ML → human)",
        pros: ["High precision + recall", "Graceful fallback"],
        cons: ["Complex orchestration", "Human review is costly"],
      },
    ],
    content: `## Content Moderation

### Upload Pipeline

1. Upload to staging bucket (not yet public).
2. **Hash match**: PhotoDNA / PDQ against known-bad DB.
3. **ML classify**: CSAM, violence, nudity, hate — per-category score.
4. Decision:
   - Hash match → hard block.
   - High-confidence unsafe → block + appeal option.
   - Borderline → human queue.
   - Safe → promote to public bucket.

### Human Review

- Moderators work a prioritized queue (highest risk first).
- Double-review for borderline decisions.
- Wellness: rotation limits, counseling, blurred previews.

### Appeals

Every block is appealable. A second reviewer (or ML+human panel) re-examines. Track reversal rate per classifier to catch drift.

### Scale Tricks

- **Pre-screening on the client**: CoreML on-device check for obvious cases.
- **Hash cache** with billions of entries; bloom filter first-level.
- **Batched GPU inference** at 30ms/image with dynamic batching.

### Feedback Loop

Reviewed decisions feed back into training. Active learning surfaces images the model is least confident on for human labelling first.
`,
    keyTakeaways: [
      "Layered moderation: hash → ML → human",
      "95% auto-actioned makes human review feasible",
      "Appeals + drift monitoring keep the classifier honest",
      "Active learning makes the most of scarce human labels",
    ],
    animations: [
      {
        id: "mod-flow",
        title: "Upload to Public",
        description: "Path of a photo through moderation.",
        intervalMs: 2300,
        nodes: [
          { id: "u", label: "User", icon: "📷", x: 6, y: 50, kind: "client" },
          { id: "st", label: "Staging", icon: "📦", x: 22, y: 50, kind: "storage" },
          { id: "h", label: "Hash Check", icon: "#️⃣", x: 40, y: 20, kind: "service" },
          { id: "ml", label: "ML Class.", icon: "🧠", x: 40, y: 80, kind: "service" },
          { id: "q", label: "Human Queue", icon: "👥", x: 64, y: 80, kind: "queue" },
          { id: "ok", label: "Public", icon: "✅", x: 92, y: 25, kind: "cdn" },
          { id: "blk", label: "Block", icon: "🚫", x: 92, y: 75, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "u", to: "st" },
          { id: "e2", from: "st", to: "h" },
          { id: "e3", from: "st", to: "ml" },
          { id: "e4", from: "ml", to: "q", label: "borderline" },
          { id: "e5", from: "h", to: "blk", label: "match" },
          { id: "e6", from: "q", to: "blk" },
          { id: "e7", from: "q", to: "ok" },
          { id: "e8", from: "ml", to: "ok", label: "safe" },
        ],
        steps: [
          { title: "Upload received", description: "File lands in staging bucket (not yet public).", activeNodes: ["u", "st"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Hash vs known-bad DB", description: "PhotoDNA / PDQ matches against billions of hashes.", activeNodes: ["st", "h"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "ML classifies in parallel", description: "Multi-head model scores 7 categories in < 2s.", activeNodes: ["st", "ml"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Route", description: "Match → block; high score → block; borderline → queue; safe → public.", activeNodes: ["h", "ml", "q", "ok", "blk"], activeEdges: ["e4", "e5", "e8"], packets: [
            { edgeId: "e4", color: "#f59e0b" },
            { edgeId: "e5", color: "#dc2626" },
            { edgeId: "e8", color: "#4ade80" },
          ] },
          { title: "Human verdict", description: "Moderator decides on borderline cases; decision feeds retraining.", activeNodes: ["q", "ok", "blk"], activeEdges: ["e6", "e7"], packets: [{ edgeId: "e6", color: "#7c3aed" }, { edgeId: "e7", color: "#7c3aed" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 16. Email Delivery Service
  // ============================================================
  {
    id: "email-service",
    slug: "email-service",
    title: "Bulk Email Delivery",
    icon: "📧",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Send billions of emails/day with deliverability, tracking, and bounce handling.",
    realWorld: ["SendGrid", "Mailgun", "Postmark", "Amazon SES"],
    diagram: `graph LR
    C[Customer API] --> VAL[Validation]
    VAL --> Q[(Send Queue)]
    Q --> MTA[SMTP Workers]
    MTA --> GM[Gmail / Yahoo / …]
    GM -->|bounce/compl.| FB[Feedback Loop]
    FB --> SUP[(Suppression DB)]
    MTA --> TR[Tracker<br/>opens/clicks]
    style MTA fill:#F59E0B,color:#000
    style SUP fill:#DC2626,color:#fff`,
    scaleMetrics: [
      { label: "Emails/day", value: "10B" },
      { label: "IPs", value: "10K dedicated" },
      { label: "Bounce rate", value: "< 2%" },
      { label: "Inbox rate", value: "> 97%" },
    ],
    tradeoffs: [
      {
        option: "Dedicated IP",
        pros: ["Full reputation control", "No neighbor harm"],
        cons: ["Long warm-up (30d)", "Cost"],
      },
      {
        option: "Shared IP pool",
        pros: ["No warm-up needed", "Cheap"],
        cons: ["Bad neighbors kill deliverability", "No brand isolation"],
      },
      {
        option: "IP pool sharding by tier",
        pros: ["Separates transactional vs promotional", "Good reputation hygiene"],
        cons: ["More ops overhead", "Requires customer segmentation"],
      },
    ],
    content: `## Bulk Email Delivery

### Deliverability ≠ Throughput

Sending is trivial. Getting into the **inbox** is the hard part — it depends on IP reputation, authentication (SPF/DKIM/DMARC), engagement signals, and content quality.

### Authentication Stack

- **SPF**: "these IPs can send for my domain"
- **DKIM**: cryptographic signature on the message
- **DMARC**: policy for what to do if SPF/DKIM fail

All three must pass to be treated as trusted.

### IP Warm-up

New IPs start with aggressive throttles (1K/day), ramping over 30 days to millions/day. Mailbox providers watch bounce + complaint rates.

### Suppression List

Never send to a recipient who **hard bounced, complained, or unsubscribed**. Global suppression DB checked at enqueue.

### Feedback Loops

- Mailbox providers forward complaints via ARF.
- Parser extracts abuse reports into suppression DB.
- Bad-sender campaigns auto-paused.

### Tracking

Unique IDs in URLs (click tracking) and a 1×1 pixel (open tracking). Events stream into the analytics pipeline; aggregated back per campaign.
`,
    keyTakeaways: [
      "SPF + DKIM + DMARC is the price of entry",
      "IP warm-up is a 30-day discipline, not a button",
      "Suppression list is the first safety layer",
      "Track engagement — it feeds reputation loops",
    ],
    animations: [
      {
        id: "email-flow",
        title: "From API Call to Inbox",
        description: "A transactional email on its journey.",
        intervalMs: 2300,
        nodes: [
          { id: "api", label: "API", icon: "🟢", x: 6, y: 50, kind: "service" },
          { id: "val", label: "Validate", icon: "✔️", x: 22, y: 50, kind: "service" },
          { id: "sup", label: "Suppression", icon: "🚫", x: 40, y: 20, kind: "db" },
          { id: "q", label: "Send Queue", icon: "📬", x: 40, y: 80, kind: "queue" },
          { id: "mta", label: "SMTP Worker", icon: "📤", x: 62, y: 50, kind: "worker" },
          { id: "gm", label: "Gmail / …", icon: "📥", x: 82, y: 50, kind: "external" },
          { id: "fb", label: "Feedback", icon: "📣", x: 96, y: 20, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "api", to: "val" },
          { id: "e2", from: "val", to: "sup", label: "check" },
          { id: "e3", from: "val", to: "q" },
          { id: "e4", from: "q", to: "mta" },
          { id: "e5", from: "mta", to: "gm" },
          { id: "e6", from: "gm", to: "fb" },
          { id: "e7", from: "fb", to: "sup" },
        ],
        steps: [
          { title: "API receives send request", description: "Customer posts a templated email.", activeNodes: ["api", "val"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Validate + check suppression", description: "Ensure recipient isn't in global suppression list.", activeNodes: ["val", "sup"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Enqueue for sending", description: "Queued; IP pool + throttle selected based on customer tier.", activeNodes: ["val", "q"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "SMTP dispatch", description: "Worker signs with DKIM, connects, delivers over port 25.", activeNodes: ["q", "mta", "gm"], activeEdges: ["e4", "e5"], packets: [{ edgeId: "e4", color: "#7c3aed" }, { edgeId: "e5", color: "#7c3aed" }] },
          { title: "Bounce / complaint", description: "Mailbox provider sends ARF report back.", activeNodes: ["gm", "fb", "sup"], activeEdges: ["e6", "e7"], packets: [{ edgeId: "e6", color: "#dc2626" }, { edgeId: "e7", color: "#dc2626" }], notes: ["Auto-suppress on hard bounce"] },
        ],
      },
    ],
  },

  // ============================================================
  // 17. Stock Exchange Matching Engine
  // ============================================================
  {
    id: "stock-exchange",
    slug: "stock-exchange",
    title: "Stock Exchange Matcher",
    icon: "📉",
    difficulty: "hard",
    category: "Transactions",
    description:
      "Match millions of buy/sell orders per second with microsecond latency and strict ordering.",
    realWorld: ["NYSE", "NASDAQ", "CME", "Binance"],
    diagram: `graph TD
    T[Trader] --> GW[Gateway]
    GW --> ME[Matching Engine<br/>single-threaded]
    ME --> OB[(Order Book)]
    ME --> TR[(Trade Feed)]
    TR --> MD[Market Data Bus]
    TR --> CLR[Clearing]
    CLR --> ST[Settlement]
    style ME fill:#DC2626,color:#fff
    style MD fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Orders/s", value: "10M" },
      { label: "Match latency", value: "< 10µs", hint: "p99" },
      { label: "Market data fanout", value: "100K clients" },
      { label: "Uptime", value: "99.999%" },
    ],
    tradeoffs: [
      {
        option: "Single-threaded matcher",
        pros: ["Deterministic order", "Tiny code path", "Easy audit"],
        cons: ["Caps per-core throughput", "CPU pinning needed"],
      },
      {
        option: "Sharded by symbol",
        pros: ["Horizontal scale", "Isolation"],
        cons: ["Cross-symbol orders coordinate", "Harder to audit"],
      },
      {
        option: "FPGA-based matcher",
        pros: ["Sub-microsecond", "Deterministic"],
        cons: ["Extreme dev cost", "Change cycle measured in weeks"],
      },
    ],
    content: `## Stock Exchange Matcher

### Why Single-Threaded

Locks destroy latency determinism. A **single thread per symbol**, pinned to an isolated core, reading from a lockfree ringbuffer, gives < 10µs p99. You shard by symbol to scale horizontally, never share threads within a symbol.

### The Order Book

Two priority queues per symbol: buys (max-heap by price then time), sells (min-heap). A market buy crosses until filled or book empty.

Price-Time priority is the universal rule: at the same price, older orders fill first.

### Types of Orders

- **Market**: execute now at best available.
- **Limit**: execute only at price ≤ limit (buy) / ≥ limit (sell).
- **IOC**: fill what you can, cancel rest.
- **FOK**: fill entirely or cancel.

### Market Data Feeds

- **L1**: top of book only (BBO).
- **L2**: full depth (every level).
- Multicast UDP to subscribers; lossless via sequence numbers + snapshot recovery.

### Clearing / Settlement

Matching is the fast path. After match, trades go to a clearing house (T+1 or T+2 settlement traditionally; instant in crypto).
`,
    keyTakeaways: [
      "Single thread per symbol on a pinned core — locks are poison",
      "Price-Time priority is the universal ordering rule",
      "Sharding by symbol is the only safe horizontal scale",
      "Market data fanout is a separate hot path from matching",
    ],
    animations: [
      {
        id: "exchange-match",
        title: "Match a Market Order",
        description: "Buy 100 @ market meets resting sell orders.",
        intervalMs: 2200,
        nodes: [
          { id: "t", label: "Trader", icon: "👤", x: 6, y: 50, kind: "client" },
          { id: "gw", label: "Gateway", icon: "🚪", x: 22, y: 50, kind: "service" },
          { id: "me", label: "Matcher", icon: "⚡", x: 44, y: 50, kind: "service" },
          { id: "ob", label: "Order Book", icon: "📚", x: 60, y: 20, kind: "storage" },
          { id: "tr", label: "Trade Feed", icon: "📝", x: 60, y: 80, kind: "queue" },
          { id: "md", label: "Market Data", icon: "📡", x: 84, y: 80, kind: "service" },
          { id: "cl", label: "Clearing", icon: "🏦", x: 84, y: 20, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "t", to: "gw" },
          { id: "e2", from: "gw", to: "me" },
          { id: "e3", from: "me", to: "ob", label: "read/update" },
          { id: "e4", from: "me", to: "tr" },
          { id: "e5", from: "tr", to: "md" },
          { id: "e6", from: "tr", to: "cl" },
        ],
        steps: [
          { title: "Order enters", description: "Trader sends 'buy 100 @ MKT' over FIX/binary.", activeNodes: ["t", "gw"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Gateway validates & forwards", description: "Risk checks pass; forwarded to the symbol's matcher.", activeNodes: ["gw", "me"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Match against book", description: "Matcher walks the sell side filling best prices first.", activeNodes: ["me", "ob"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }], notes: ["Price-Time priority", "Lockfree read/modify"] },
          { title: "Emit trade(s)", description: "Each fill becomes a trade tick in the feed.", activeNodes: ["me", "tr"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#7c3aed" }] },
          { title: "Fanout & clear", description: "Trade feeds into market data bus and clearing house.", activeNodes: ["tr", "md", "cl"], activeEdges: ["e5", "e6"], packets: [{ edgeId: "e5", color: "#4ade80" }, { edgeId: "e6", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 18. OAuth 2.0 / Identity Provider
  // ============================================================
  {
    id: "identity-provider",
    slug: "identity-provider",
    title: "OAuth / Identity Provider",
    icon: "🔐",
    difficulty: "medium",
    category: "Security",
    description:
      "Design an IdP supporting OAuth 2.0 authorization code + PKCE with federated social login.",
    realWorld: ["Auth0", "Okta", "Firebase Auth", "AWS Cognito"],
    diagram: `graph TD
    U[User] --> APP[Client App]
    APP -->|redirect| IDP[IdP Auth Page]
    IDP --> LOG[(User DB)]
    IDP -->|code| APP
    APP -->|code + verifier| TOK[Token Svc]
    TOK --> JWK[JWKS]
    TOK -->|JWT| APP
    APP -->|bearer| API[Resource API]
    API --> JWK
    style IDP fill:#7C3AED,color:#fff
    style TOK fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Users", value: "500M" },
      { label: "Logins/s", value: "50K" },
      { label: "Token TTL", value: "1h access / 30d refresh" },
      { label: "JWKS refresh", value: "24h" },
    ],
    tradeoffs: [
      {
        option: "Opaque session IDs",
        pros: ["Easy revocation", "Small cookie"],
        cons: ["DB lookup per request", "Harder for microservices"],
      },
      {
        option: "JWT access tokens",
        pros: ["Stateless validation", "Microservice-friendly"],
        cons: ["Revocation is hard", "Larger payload in every request"],
      },
      {
        option: "JWT + short TTL + refresh",
        pros: ["Validation fast", "Revocation via refresh blocklist"],
        cons: ["Refresh endpoint becomes critical", "Clock skew pain"],
      },
    ],
    content: `## OAuth / Identity Provider

### Authorization Code + PKCE

The modern, secure flow for SPAs and mobile apps:

1. Client generates a random \`code_verifier\`; sends \`code_challenge = SHA256(verifier)\` to the authorize endpoint.
2. User authenticates at the IdP.
3. IdP redirects back with an auth code.
4. Client exchanges code + \`code_verifier\` for tokens.
5. IdP hashes the verifier and compares — no way for an attacker who stole the code to use it.

### Tokens

- **Access token** (JWT): 1h TTL, signed by private key; APIs verify via JWKS.
- **Refresh token**: 30d, stored in HttpOnly cookie or secure storage. Used to mint new access tokens.
- **ID token** (OIDC): claims about the user (email, sub).

### JWKS Rotation

- Sign with \`kid\` header; publishers have multiple public keys at \`.well-known/jwks.json\`.
- Rotate monthly. Old keys stay for ≥ access-token TTL so in-flight tokens still verify.

### Session Management

Refresh-token rotation: each refresh issues a new one and invalidates the old. Reuse triggers revoke-all-sessions for that user (token theft detection).

### Federation

Social login: user authenticates with Google; IdP validates Google's ID token, creates/links a local user, issues its own tokens. Never expose Google's tokens to the client.
`,
    keyTakeaways: [
      "Authorization Code + PKCE is the 2026 default",
      "JWT access + opaque refresh balances stateless speed & revocation",
      "Rotate JWKS with overlap to avoid downtime",
      "Refresh-token rotation detects stolen credentials",
    ],
    animations: [
      {
        id: "oauth-flow",
        title: "Login via Auth Code + PKCE",
        description: "A user signs in to a SPA using the modern OAuth flow.",
        intervalMs: 2300,
        nodes: [
          { id: "u", label: "User", icon: "👤", x: 6, y: 50, kind: "client" },
          { id: "app", label: "SPA", icon: "💻", x: 22, y: 50, kind: "client" },
          { id: "idp", label: "IdP", icon: "🔐", x: 44, y: 50, kind: "service" },
          { id: "db", label: "User DB", icon: "🗄️", x: 58, y: 20, kind: "db" },
          { id: "tok", label: "Token Svc", icon: "🎟️", x: 68, y: 50, kind: "service" },
          { id: "jwk", label: "JWKS", icon: "🔑", x: 82, y: 20, kind: "cache" },
          { id: "api", label: "Resource API", icon: "🟢", x: 94, y: 50, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "app", to: "idp", label: "auth + challenge" },
          { id: "e2", from: "idp", to: "db" },
          { id: "e3", from: "idp", to: "app", label: "code" },
          { id: "e4", from: "app", to: "tok", label: "code + verifier" },
          { id: "e5", from: "tok", to: "app", label: "JWT" },
          { id: "e6", from: "app", to: "api", label: "bearer" },
          { id: "e7", from: "api", to: "jwk" },
        ],
        steps: [
          { title: "User clicks Sign in", description: "SPA computes code_verifier & challenge, redirects to IdP.", activeNodes: ["u", "app", "idp"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "IdP authenticates user", description: "Password / passkey / MFA flow completes against the user DB.", activeNodes: ["idp", "db"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Redirect back with code", description: "IdP sends a short-lived auth code via redirect.", activeNodes: ["idp", "app"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Exchange code for tokens", description: "SPA POSTs code + verifier. Token service validates the hash & mints JWT.", activeNodes: ["app", "tok"], activeEdges: ["e4", "e5"], packets: [{ edgeId: "e4", color: "#7c3aed" }, { edgeId: "e5", color: "#7c3aed" }] },
          { title: "Call API", description: "SPA sends Authorization: Bearer …; API verifies via cached JWKS.", activeNodes: ["app", "api", "jwk"], activeEdges: ["e6", "e7"], packets: [{ edgeId: "e6", color: "#4ade80" }, { edgeId: "e7", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 19. Live Streaming (Low-latency)
  // ============================================================
  {
    id: "live-streaming",
    slug: "live-streaming",
    title: "Low-latency Live Streaming",
    icon: "📺",
    difficulty: "hard",
    category: "Real-time",
    description:
      "Broadcast live video to millions with sub-3s glass-to-glass latency using LL-HLS and WebRTC.",
    realWorld: ["Twitch", "YouTube Live", "Instagram Live"],
    diagram: `graph LR
    CR[Creator<br/>OBS/WebRTC] --> ING[Ingest]
    ING --> TX[Transcoder<br/>ABR ladder]
    TX --> PKG[Packager<br/>LL-HLS]
    PKG --> CDN[CDN]
    CDN --> V[Viewer]
    CR -.sub-1s .-> WR[WebRTC Relay]
    WR --> V
    style TX fill:#DC2626,color:#fff
    style CDN fill:#10B981,color:#fff`,
    scaleMetrics: [
      { label: "Concurrent viewers", value: "5M" },
      { label: "Glass-to-glass", value: "< 3s (LL-HLS)" },
      { label: "WebRTC path", value: "< 500ms" },
      { label: "ABR rungs", value: "5 bitrates" },
    ],
    tradeoffs: [
      {
        option: "RTMP + HLS (classic)",
        pros: ["Universal support", "CDN-friendly"],
        cons: ["10-30s glass-to-glass", "Not interactive"],
      },
      {
        option: "LL-HLS / DASH",
        pros: ["2-5s latency", "Same CDN infra"],
        cons: ["Clients need newer players", "Partial-segment overhead"],
      },
      {
        option: "WebRTC end-to-end",
        pros: ["Sub-1s latency", "Bi-directional"],
        cons: ["No traditional CDN", "Scale via SFU trees"],
      },
    ],
    content: `## Low-latency Live Streaming

### Two-Path Delivery

- **WebRTC** (< 1s) for interactive viewers: co-streams, Q&A.
- **LL-HLS** (< 3s) via CDN for the long tail of passive viewers.

### Ingest → Transcode → Package

1. Creator publishes a single high-bitrate stream (RTMP or WebRTC).
2. **Transcoder** produces an **ABR ladder** (e.g., 240p, 360p, 480p, 720p, 1080p).
3. **Packager** creates LL-HLS segments (CMAF, 200ms chunks) and pushes to CDN.
4. Viewer's player chooses a rung based on bandwidth.

### LL-HLS Tricks

- **Partial segments** (0.2s) delivered via HTTP/2 push / blocking playlist requests.
- **Preload hints** let the CDN know what to expect next.
- Adaptive switching happens chunk-by-chunk.

### WebRTC Scale

One creator can't directly feed 1M viewers. **Cascaded SFUs** form a tree: regional SFUs subscribe to an origin SFU. Each viewer connects to their nearest leaf.

### Moderation

- Real-time audio → speech-to-text → content filter.
- On-screen OCR for banned symbols.
- Auto-time out creator's stream if threshold breached.
`,
    keyTakeaways: [
      "Hybrid WebRTC + LL-HLS balances latency with scale",
      "CMAF + 200ms partial segments unlock 2-5s glass-to-glass",
      "Cascaded SFU trees scale WebRTC beyond 10K viewers",
      "Transcoder ABR ladder feeds every viewer their best rung",
    ],
    animations: [
      {
        id: "live-flow",
        title: "Broadcast Path",
        description: "Creator's feed to a viewer in three hops.",
        intervalMs: 2300,
        nodes: [
          { id: "cr", label: "Creator", icon: "🎥", x: 6, y: 50, kind: "client" },
          { id: "ing", label: "Ingest", icon: "🎬", x: 22, y: 50, kind: "service" },
          { id: "tx", label: "Transcoder", icon: "🎚️", x: 42, y: 50, kind: "service" },
          { id: "pkg", label: "Packager", icon: "📦", x: 60, y: 50, kind: "service" },
          { id: "cdn", label: "CDN Edge", icon: "☁️", x: 80, y: 50, kind: "cdn" },
          { id: "v", label: "Viewer", icon: "📱", x: 96, y: 50, kind: "client" },
        ],
        edges: [
          { id: "e1", from: "cr", to: "ing", label: "RTMP" },
          { id: "e2", from: "ing", to: "tx" },
          { id: "e3", from: "tx", to: "pkg", label: "ABR ladder" },
          { id: "e4", from: "pkg", to: "cdn", label: "CMAF" },
          { id: "e5", from: "cdn", to: "v", label: "LL-HLS" },
        ],
        steps: [
          { title: "Creator streams", description: "OBS pushes 6 Mbps RTMP to ingest.", activeNodes: ["cr", "ing"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Transcode ABR ladder", description: "GPU transcoder emits 5 parallel streams at different bitrates.", activeNodes: ["ing", "tx"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#dc2626" }], notes: ["Keyframe interval = 1s"] },
          { title: "Package into CMAF", description: "Each rung split into 200ms chunks; LL-HLS playlist updated.", activeNodes: ["tx", "pkg"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#f59e0b" }] },
          { title: "Push to CDN", description: "Segments fan out to edges; preload hints let them cache ahead.", activeNodes: ["pkg", "cdn"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#10b981" }] },
          { title: "Viewer plays back", description: "Player chooses 720p rung and streams with < 3s latency.", activeNodes: ["cdn", "v"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 20. Global Load Balancer / Anycast
  // ============================================================
  {
    id: "global-load-balancer",
    slug: "global-load-balancer",
    title: "Global Anycast Load Balancer",
    icon: "🌍",
    difficulty: "hard",
    category: "Infrastructure",
    description:
      "Route users to the nearest healthy PoP using anycast BGP and intelligent failover.",
    realWorld: ["Cloudflare", "AWS Global Accelerator", "GCP Global LB", "Fastly"],
    diagram: `graph TD
    U[User] -->|DNS / Anycast| PoP[Nearest PoP]
    PoP --> L4[L4 LB]
    L4 --> L7[L7 LB]
    L7 --> ORI[Origin Region]
    HC[Health Checker] -.-> PoP
    HC -.-> ORI
    BGP[BGP Anycast] -.announce.-> U
    style PoP fill:#10B981,color:#fff
    style BGP fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "PoPs", value: "300+" },
      { label: "Failover", value: "< 30s" },
      { label: "DDoS absorb", value: "100+ Tbps" },
      { label: "TLS handshake", value: "< 20ms", hint: "at edge" },
    ],
    tradeoffs: [
      {
        option: "DNS-based GSLB",
        pros: ["Works everywhere", "Easy to implement"],
        cons: ["TTL cache lag on failover", "DNS resolver location ≠ user"],
      },
      {
        option: "Anycast BGP",
        pros: ["Network picks nearest PoP", "Instant failover on BGP withdrawal"],
        cons: ["ISP routing quirks", "Session persistence harder"],
      },
      {
        option: "HTTP-level CDN redirect",
        pros: ["Precise routing based on client IP/features", "Full control"],
        cons: ["Extra RTT for redirect", "Initial PoP still handles DDoS"],
      },
    ],
    content: `## Global Anycast Load Balancer

### The Layers

1. **BGP Anycast**: the same IP is announced from hundreds of PoPs; the internet routes each packet to the nearest.
2. **L4 (TCP/QUIC)**: PoP-local load balancer spreads across L7 instances.
3. **L7 (HTTP/3)**: applies WAF, routes based on host/path to backend pool.
4. **Origin**: regional backend in AWS/GCP/on-prem.

### Health Checks

Each L7 probes upstreams every few seconds. Unhealthy pool → drain traffic → BGP withdrawal if PoP is unreachable. Controllers watch aggregate PoP health and can **drain an entire PoP** by withdrawing its route.

### Failover

Anycast handles most cases automatically: if a PoP vanishes, BGP routes converge within seconds. DNS-based failover is a last resort (tens of seconds).

### DDoS Absorption

Anycast spreads attack traffic across every PoP — no single PoP melts. Combined with scrubbers that filter malicious packets at line rate (FPGA-accelerated).

### TLS at Edge

Edge terminates TLS, owns cert inventory, does OCSP stapling. Uses session resumption + TLS 1.3 0-RTT to shave RTTs on repeat visitors.

### Split-horizon Consistency

- Static assets served from edge cache.
- Dynamic requests tunneled to origin over persistent QUIC connections.
- **Argo-like** optimization: choose lower-latency origin paths dynamically.
`,
    keyTakeaways: [
      "BGP Anycast is the only way to get 'nearest-PoP' at line rate",
      "L4 + L7 + Origin is the universal three-tier edge model",
      "Health-check → drain → BGP withdraw is how PoPs fail safely",
      "DDoS spread across hundreds of PoPs = absorption at Tbps scale",
    ],
    animations: [
      {
        id: "glb-flow",
        title: "User in Tokyo Hits the Edge",
        description: "Anycast routes to nearest PoP; L4→L7→Origin completes the request.",
        intervalMs: 2200,
        nodes: [
          { id: "u", label: "User (Tokyo)", icon: "👤", x: 6, y: 50, kind: "client" },
          { id: "bgp", label: "BGP Anycast", icon: "🌐", x: 22, y: 20, kind: "external" },
          { id: "pop", label: "Tokyo PoP", icon: "🏯", x: 40, y: 50, kind: "cdn" },
          { id: "l4", label: "L4 LB", icon: "🔄", x: 56, y: 50, kind: "lb" },
          { id: "l7", label: "L7 LB", icon: "📋", x: 72, y: 50, kind: "lb" },
          { id: "ori", label: "Origin (US)", icon: "🗄️", x: 92, y: 50, kind: "service" },
          { id: "hc", label: "Health", icon: "❤️", x: 72, y: 15, kind: "service" },
        ],
        edges: [
          { id: "e1", from: "u", to: "pop", label: "anycast" },
          { id: "e2", from: "pop", to: "l4" },
          { id: "e3", from: "l4", to: "l7" },
          { id: "e4", from: "l7", to: "ori" },
          { id: "e5", from: "hc", to: "l7", label: "probe" },
          { id: "e6", from: "bgp", to: "pop", label: "announce /24" },
        ],
        steps: [
          { title: "BGP announces PoP", description: "Every PoP advertises the anycast IP; internet routes to the closest.", activeNodes: ["bgp", "pop"], activeEdges: ["e6"], packets: [{ edgeId: "e6", color: "#f59e0b" }] },
          { title: "User packet lands in Tokyo", description: "Shortest BGP path = Tokyo PoP. TLS terminates here.", activeNodes: ["u", "pop"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "L4 → L7", description: "PoP-local L4 spreads across L7 instances for HTTP routing.", activeNodes: ["pop", "l4", "l7"], activeEdges: ["e2", "e3"], packets: [{ edgeId: "e2", color: "#10b981" }, { edgeId: "e3", color: "#10b981" }] },
          { title: "Health gate", description: "L7 excludes origin pools failing recent health probes.", activeNodes: ["hc", "l7"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#dc2626" }] },
          { title: "Tunnel to origin", description: "Persistent QUIC tunnel carries the request back to the US origin.", activeNodes: ["l7", "ori"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#7c3aed" }], notes: ["Response cached at edge on the way back"] },
        ],
      },
    ],
  },
];
