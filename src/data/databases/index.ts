import type { SystemDesign } from "@/data/types";

/**
 * Database topics with animated architecture walkthroughs.
 * Reuses the SystemDesign shape (same viewer component).
 */

export const databases: SystemDesign[] = [
  // ============================================================
  // 1. PostgreSQL — deep dive
  // ============================================================
  {
    id: "postgresql",
    slug: "postgresql",
    title: "PostgreSQL",
    icon: "🐘",
    difficulty: "medium",
    category: "Relational (SQL)",
    description:
      "Battle-tested open-source RDBMS with MVCC, rich SQL, JSON, full-text, and a famously deep extension ecosystem.",
    realWorld: ["Instagram", "Reddit", "Apple", "Spotify", "Stripe"],
    diagram: `graph TD
    C[Client] --> PG[Postmaster]
    PG --> BE[Backend Process<br/>per connection]
    BE --> PL[Parser / Planner / Executor]
    PL --> SB[Shared Buffers]
    SB --> OS[OS Page Cache]
    OS --> HEAP[(Heap Files)]
    BE --> WAL[WAL Buffer]
    WAL --> WALFS[(pg_wal / xlog)]
    WALFS -->|replicate| REP[Replica]
    VAC[Autovacuum] -.-> HEAP
    style PG fill:#336791,color:#fff
    style WAL fill:#F59E0B,color:#000
    style SB fill:#10B981,color:#fff`,
    scaleMetrics: [
      { label: "Max DB size", value: "Unlimited" },
      { label: "Max row size", value: "1.6 TB", hint: "With TOAST" },
      { label: "Max table size", value: "32 TB" },
      { label: "Parallel workers", value: "Per query", hint: "8+ default" },
    ],
    tradeoffs: [
      {
        option: "MVCC (default)",
        pros: ["Readers never block writers", "Snapshot isolation out of the box"],
        cons: ["Bloat — needs vacuuming", "Long transactions delay cleanup"],
      },
      {
        option: "Logical replication",
        pros: ["Cross-version replica", "Subset of tables", "Bi-directional possible"],
        cons: ["DDL not replicated", "Higher CPU than physical"],
      },
      {
        option: "Physical (streaming) replication",
        pros: ["Block-level, low overhead", "Byte-identical replicas"],
        cons: ["Same major version only", "Whole cluster, no filtering"],
      },
    ],
    content: `## PostgreSQL — How It Works

### Process Model

PostgreSQL uses a **multi-process** architecture, not threads:

- **Postmaster** — the parent. Listens on the port and forks a child per new client connection.
- **Backend process** — one OS process per connection, does all the work for that client.
- **Background workers** — autovacuum launcher, WAL writer, checkpointer, bgwriter, stats collector, logical replication workers, parallel query workers.

Each backend has its own memory; shared state lives in **shared_buffers** (the DB-wide page cache) and **WAL buffers** (unflushed redo records).

### MVCC — Multi-Version Concurrency Control

Every tuple (row version) carries \`xmin\` (inserting txn) and \`xmax\` (deleting txn). Read queries see only versions whose xmin is committed before their snapshot and whose xmax isn't.

- **No read locks** — readers and writers don't block each other.
- **UPDATE = INSERT new + mark old dead** — the old version stays until vacuumed.
- **Dead tuples** accumulate → **autovacuum** reclaims space and updates the visibility map.

### Write Path (WAL)

1. Client: \`UPDATE users SET … WHERE id=42\`
2. Backend locates the page in shared_buffers (or loads from disk).
3. Modifies the page in-memory AND writes a **WAL record** to the WAL buffer.
4. On COMMIT, the WAL buffer is **fsync**'d to \`pg_wal\`. Page itself is dirty but not yet flushed.
5. **Checkpointer** periodically flushes dirty pages. On crash, replay WAL forward from the last checkpoint.

This is why PostgreSQL is durable even with unflushed data pages — the WAL is the source of truth.

### Query Execution

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.name, COUNT(*) 
FROM users u JOIN orders o ON o.user_id = u.id
WHERE o.created_at > now() - interval '7 days'
GROUP BY u.name;
\`\`\`

The planner picks among: **Seq Scan**, **Index Scan**, **Bitmap Heap Scan**, **Index Only Scan**, and joins **Nested Loop**, **Hash Join**, **Merge Join**. It uses statistics from \`pg_statistic\` (collected by ANALYZE) to estimate row counts and costs.

### Core Features

| Feature | What it gives you |
|---------|-------------------|
| **JSONB** | Binary JSON with GIN indexes. Query with \`data @> '{"active":true}'\` |
| **Arrays** | First-class \`TEXT[]\`, \`INT[]\` — no join table for simple lists |
| **Window functions** | \`ROW_NUMBER() OVER (PARTITION BY …)\` — analytics in SQL |
| **CTEs + recursive CTEs** | Build iterative queries (trees, graphs) |
| **Partitioning** | Declarative RANGE/LIST/HASH — queries prune partitions automatically |
| **Parallel query** | Planner splits seq scan/hash join across workers |
| **Logical decoding** | Stream commits out of WAL for CDC (change data capture) |
| **Row-Level Security** | Policies enforce per-user visibility (\`USING (user_id = current_user_id())\`) |
| **Foreign Data Wrappers** | \`postgres_fdw\`, \`file_fdw\`, \`mongo_fdw\` — query remote sources as tables |
| **Generated columns** | Stored or virtual computed columns |

### Index Types

| Index | Best for |
|-------|----------|
| **B-tree** (default) | Equality + range on any sortable type |
| **Hash** | Equality only; lighter than B-tree |
| **GIN** | Array containment, JSONB, full-text |
| **GiST** | Geometric, range types, fuzzy |
| **SP-GiST** | Phone numbers, IPs — non-balanced structures |
| **BRIN** | Very large, naturally-ordered tables (timestamps) — tiny index |
| **Partial index** | \`CREATE INDEX … WHERE status='active'\` |
| **Expression index** | \`CREATE INDEX ON users(lower(email))\` |

### Popular Extensions

\`\`\`sql
CREATE EXTENSION pg_stat_statements;  -- slow query analysis
CREATE EXTENSION pgcrypto;             -- hashing, UUIDs
CREATE EXTENSION postgis;              -- geospatial queries
CREATE EXTENSION pgvector;             -- vector similarity (RAG / AI)
CREATE EXTENSION pg_trgm;              -- fuzzy text matching
CREATE EXTENSION hstore;               -- key-value map column
CREATE EXTENSION citext;               -- case-insensitive text
CREATE EXTENSION pg_partman;           -- partition maintenance
\`\`\`

- **TimescaleDB** — time-series on top of Postgres. Hypertables auto-partition by time; continuous aggregates pre-compute rollups.
- **Citus** — shards Postgres across many nodes into a distributed DB.
- **pg_cron** — cron-style scheduler living inside the database.
- **pgaudit** — session/object audit logging for compliance.
- **pgvector** — \`CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops)\` enables \`SELECT * ORDER BY embedding <=> '[...]' LIMIT 5\` — an HNSW ANN search in SQL.

### Replication & HA

- **Streaming replication** — primary ships WAL to hot-standby replicas in real time.
- **Synchronous commit** — primary waits for standby fsync before ack. Trade latency for zero data loss.
- **Logical replication** — publishers emit row-level changes subscribers apply. Good for cross-version and selective replication.
- **Failover** — tools like **Patroni** + etcd elect a new leader on primary failure.

### Example — JSONB in action

\`\`\`sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL
);

CREATE INDEX events_data_idx ON events USING GIN (data jsonb_path_ops);

-- All events with { "type": "signup", "plan": "pro" }
SELECT * FROM events
WHERE data @> '{"type":"signup","plan":"pro"}';

-- Extract and aggregate
SELECT data->>'country' AS country, COUNT(*)
FROM events
WHERE data->>'type' = 'signup'
GROUP BY 1
ORDER BY 2 DESC;
\`\`\`

### Example — Recursive CTE (org tree)

\`\`\`sql
WITH RECURSIVE subs AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees WHERE id = 101
  UNION ALL
  SELECT e.id, e.name, e.manager_id, s.depth + 1
  FROM employees e JOIN subs s ON e.manager_id = s.id
)
SELECT * FROM subs;
\`\`\`

### When Postgres Hurts

- **Write-heavy point updates** on huge rows → bloat; consider HOT updates, fillfactor tuning.
- **Connection storms** — each connection is a process; use **PgBouncer** to pool.
- **Very long transactions** block vacuum — break into smaller ones.
- **Massive scans on tiny selective filters** → you need an index, not bigger hardware.
`,
    keyTakeaways: [
      "Process-per-connection + MVCC = readers never block writers",
      "WAL is the durability contract; dirty pages flush lazily",
      "Extensions (PostGIS, TimescaleDB, pgvector, Citus) turn Postgres into a platform",
      "Use PgBouncer + tuned autovacuum in production",
      "Indexes beyond B-tree: GIN (JSONB/FTS), BRIN (time-series), partial/expression for hot queries",
    ],
    animations: [
      {
        id: "pg-write-path",
        title: "Write Path: INSERT → COMMIT → Replica",
        description: "How a single INSERT travels through WAL to a streaming replica.",
        intervalMs: 2400,
        nodes: [
          { id: "c", label: "Client", icon: "💻", x: 6, y: 50, kind: "client" },
          { id: "be", label: "Backend", icon: "⚙️", x: 22, y: 50, kind: "service" },
          { id: "sb", label: "Shared Buffers", icon: "🗂️", x: 42, y: 25, kind: "cache" },
          { id: "wb", label: "WAL Buffer", icon: "📝", x: 42, y: 75, kind: "cache" },
          { id: "heap", label: "Heap File", icon: "🗄️", x: 64, y: 25, kind: "storage" },
          { id: "wal", label: "pg_wal", icon: "💾", x: 64, y: 75, kind: "storage" },
          { id: "ck", label: "Checkpointer", icon: "🚰", x: 82, y: 25, kind: "worker" },
          { id: "rep", label: "Replica", icon: "🐘", x: 94, y: 75, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "c", to: "be", label: "INSERT" },
          { id: "e2", from: "be", to: "sb", label: "dirty page" },
          { id: "e3", from: "be", to: "wb", label: "WAL rec" },
          { id: "e4", from: "wb", to: "wal", label: "fsync" },
          { id: "e5", from: "sb", to: "heap", label: "flush later" },
          { id: "e6", from: "ck", to: "heap" },
          { id: "e7", from: "wal", to: "rep", label: "stream" },
        ],
        steps: [
          {
            title: "Client sends INSERT",
            description: "Backend process receives & parses the statement.",
            activeNodes: ["c", "be"],
            activeEdges: ["e1"],
            packets: [{ edgeId: "e1", color: "#22d3ee" }],
          },
          {
            title: "Modify page in-memory",
            description: "Backend loads the target page into shared_buffers and writes the new tuple (xmin set).",
            activeNodes: ["be", "sb"],
            activeEdges: ["e2"],
            packets: [{ edgeId: "e2", color: "#10b981" }],
          },
          {
            title: "Append WAL record",
            description: "Before ack'ing, a redo record is written to the WAL buffer.",
            activeNodes: ["be", "wb"],
            activeEdges: ["e3"],
            packets: [{ edgeId: "e3", color: "#f59e0b" }],
          },
          {
            title: "COMMIT fsyncs WAL",
            description: "WAL buffer flushed to disk. Only now is the commit durable.",
            activeNodes: ["wb", "wal"],
            activeEdges: ["e4"],
            packets: [{ edgeId: "e4", color: "#dc2626" }],
            notes: ["synchronous_commit=on waits here", "Data page itself is still only in memory"],
          },
          {
            title: "WAL streams to replica",
            description: "walsender ships records; replica applies them to stay in sync.",
            activeNodes: ["wal", "rep"],
            activeEdges: ["e7"],
            packets: [{ edgeId: "e7", color: "#7c3aed" }],
          },
          {
            title: "Checkpoint flushes pages",
            description: "Later, the checkpointer writes dirty pages back to heap files.",
            activeNodes: ["ck", "sb", "heap"],
            activeEdges: ["e5", "e6"],
            packets: [
              { edgeId: "e5", color: "#4ade80" },
              { edgeId: "e6", color: "#4ade80" },
            ],
          },
        ],
      },
      {
        id: "pg-mvcc",
        title: "MVCC: Readers don't block writers",
        description: "How a concurrent UPDATE and SELECT see different row versions.",
        intervalMs: 2400,
        nodes: [
          { id: "rA", label: "Txn A (UPDATE)", icon: "✍️", x: 8, y: 25, kind: "client" },
          { id: "rB", label: "Txn B (SELECT)", icon: "👁️", x: 8, y: 75, kind: "client" },
          { id: "be", label: "Backend", icon: "⚙️", x: 30, y: 50, kind: "service" },
          { id: "v1", label: "Tuple v1 (xmax=A)", icon: "📄", x: 60, y: 25, kind: "storage" },
          { id: "v2", label: "Tuple v2 (xmin=A)", icon: "📄", x: 60, y: 75, kind: "storage" },
          { id: "vac", label: "Autovacuum", icon: "🧹", x: 90, y: 50, kind: "worker" },
        ],
        edges: [
          { id: "e1", from: "rA", to: "be" },
          { id: "e2", from: "rB", to: "be" },
          { id: "e3", from: "be", to: "v1", label: "mark xmax" },
          { id: "e4", from: "be", to: "v2", label: "insert" },
          { id: "e5", from: "be", to: "v1", label: "B reads v1" },
          { id: "e6", from: "vac", to: "v1", label: "reclaim" },
        ],
        steps: [
          {
            title: "Two transactions start",
            description: "A wants to UPDATE row id=42. B runs SELECT on the same row.",
            activeNodes: ["rA", "rB", "be"],
            activeEdges: ["e1", "e2"],
            packets: [
              { edgeId: "e1", color: "#22d3ee" },
              { edgeId: "e2", color: "#7c3aed" },
            ],
          },
          {
            title: "A writes a new tuple version",
            description: "UPDATE marks v1's xmax = A and inserts v2 with xmin = A.",
            activeNodes: ["be", "v1", "v2"],
            activeEdges: ["e3", "e4"],
            packets: [
              { edgeId: "e3", color: "#f59e0b" },
              { edgeId: "e4", color: "#10b981" },
            ],
          },
          {
            title: "B still sees v1",
            description: "B's snapshot was taken before A committed — visibility check hides v2.",
            activeNodes: ["rB", "be", "v1"],
            activeEdges: ["e5"],
            packets: [{ edgeId: "e5", color: "#7c3aed" }],
            notes: ["No lock, no wait", "This is why long txns delay vacuum"],
          },
          {
            title: "Autovacuum reclaims v1",
            description: "Once no running txn can see v1, vacuum frees the slot.",
            activeNodes: ["vac", "v1"],
            activeEdges: ["e6"],
            packets: [{ edgeId: "e6", color: "#dc2626" }],
          },
        ],
      },
    ],
  },

  // ============================================================
  // 2. MySQL
  // ============================================================
  {
    id: "mysql",
    slug: "mysql",
    title: "MySQL",
    icon: "🐬",
    difficulty: "medium",
    category: "Relational (SQL)",
    description:
      "The web's default database — fast reads, rich replication options, and the InnoDB storage engine.",
    realWorld: ["YouTube", "Facebook", "Uber", "Airbnb", "Shopify"],
    diagram: `graph TD
    C[Client] --> CP[Connection Pool]
    CP --> SQL[SQL Layer<br/>Parser/Optimizer]
    SQL --> BP[Buffer Pool]
    BP --> IB[(InnoDB<br/>Clustered Index)]
    SQL --> RL[Redo Log]
    SQL --> BL[Binary Log]
    BL --> REP[Replica]
    style SQL fill:#00758F,color:#fff
    style BL fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Storage engine", value: "InnoDB", hint: "Default since 5.5" },
      { label: "Max row size", value: "65 KB" },
      { label: "Max table size", value: "64 TB" },
      { label: "Replication", value: "GTID async / semi-sync" },
    ],
    tradeoffs: [
      {
        option: "InnoDB",
        pros: ["ACID + MVCC", "Clustered primary index = fast PK lookups", "Row-level locks"],
        cons: ["Secondary index needs 2 lookups", "Non-PK tables get hidden 6-byte key"],
      },
      {
        option: "Async replication",
        pros: ["Zero primary latency impact", "Easy to scale reads"],
        cons: ["Replica lag visible to users", "Data loss on failover"],
      },
      {
        option: "Group Replication",
        pros: ["Multi-writer option", "Paxos-based consensus"],
        cons: ["Complex setup", "Conflict resolution overhead"],
      },
    ],
    content: `## MySQL

### InnoDB Storage Engine

InnoDB is the default engine since 5.5. Every table is a **clustered B+tree keyed by primary key** — rows are stored inside the PK index leaves. No PK? MySQL invents a hidden one.

### Write Path

1. Modify page in the **buffer pool**.
2. Append to the **redo log** (ib_logfile) — guarantees recovery.
3. On commit, flush redo (unless \`innodb_flush_log_at_trx_commit=0/2\` is set for speed over durability).
4. **Binary log** (binlog) writes the statement/row events for replication.
5. **Doublewrite buffer** protects against torn pages on crash.

### Replication Models

- **Statement-based** — replays SQL on replicas; dangerous with non-deterministic funcs.
- **Row-based** — logs actual row changes; safer, default today.
- **Mixed** — picks per statement.
- **GTID** — global txn IDs make failover/reslaving reliable.
- **Semi-sync** — primary waits for at least one replica to ack before returning.

### Clustering (Galera / Group Replication)

- **Galera**: true multi-master, certification-based conflict detection, synchronous.
- **Group Replication**: Oracle's built-in Paxos. Single- or multi-primary.
- Both scale **reads**; writes still funnel through conflict resolution.

### Query Cache — Gone

The old query cache was removed in 8.0. Use **ProxySQL** / application cache instead.

### Modern Features (8.0)

- **Window functions**, **CTEs**, **JSON functions**.
- **Invisible indexes** — test index removal safely.
- **Descending indexes**, **functional indexes**.
- **Roles** for permission management.
- **Document store** (X Protocol) for JSON-first use cases.

### Performance Tips

- Set \`innodb_buffer_pool_size\` to ~70% of RAM on a dedicated box.
- Keep PK short (INT/BIGINT > UUIDv4) — it's copied into every secondary index.
- Use **covering indexes** (\`INDEX (a, b, c)\` where query selects a,b,c) to skip the clustered lookup.
- Avoid massive \`LIMIT 1000000, 10\` — deep offsets are slow. Paginate with "WHERE id > :last".
`,
    keyTakeaways: [
      "InnoDB clustered index stores rows inside the PK B+tree",
      "Redo log + binlog are independent — one for recovery, one for replication",
      "GTID + semi-sync replication is the modern default",
      "Short, monotonically increasing PKs dramatically improve write locality",
    ],
    animations: [
      {
        id: "mysql-repl",
        title: "Primary → Replica Replication",
        description: "Binary log events flow from writer to reader node.",
        intervalMs: 2300,
        nodes: [
          { id: "cl", label: "Client", icon: "💻", x: 6, y: 50, kind: "client" },
          { id: "pri", label: "Primary", icon: "🐬", x: 26, y: 50, kind: "db" },
          { id: "rl", label: "Redo Log", icon: "📝", x: 48, y: 25, kind: "storage" },
          { id: "bl", label: "Binlog", icon: "📔", x: 48, y: 75, kind: "storage" },
          { id: "io", label: "Replica I/O Thread", icon: "🧵", x: 70, y: 75, kind: "worker" },
          { id: "sq", label: "Relay + SQL Thread", icon: "🧵", x: 88, y: 50, kind: "worker" },
          { id: "rep", label: "Replica", icon: "🐬", x: 98, y: 25, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "cl", to: "pri" },
          { id: "e2", from: "pri", to: "rl" },
          { id: "e3", from: "pri", to: "bl" },
          { id: "e4", from: "bl", to: "io", label: "dump" },
          { id: "e5", from: "io", to: "sq" },
          { id: "e6", from: "sq", to: "rep", label: "apply" },
        ],
        steps: [
          { title: "Client writes", description: "INSERT/UPDATE arrives at primary.", activeNodes: ["cl", "pri"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Dual-log on commit", description: "Redo log ensures recovery; binlog ensures replication.", activeNodes: ["pri", "rl", "bl"], activeEdges: ["e2", "e3"], packets: [{ edgeId: "e2", color: "#10b981" }, { edgeId: "e3", color: "#f59e0b" }] },
          { title: "Replica pulls binlog", description: "I/O thread streams events into a local relay log.", activeNodes: ["bl", "io"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#7c3aed" }] },
          { title: "SQL thread applies", description: "Events re-executed; GTID advances.", activeNodes: ["io", "sq", "rep"], activeEdges: ["e5", "e6"], packets: [{ edgeId: "e5", color: "#4ade80" }, { edgeId: "e6", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 3. MongoDB
  // ============================================================
  {
    id: "mongodb",
    slug: "mongodb",
    title: "MongoDB",
    icon: "🍃",
    difficulty: "medium",
    category: "Document",
    description:
      "Document database storing BSON; flexible schemas, rich aggregation pipeline, and sharded clusters.",
    realWorld: ["Adobe", "eBay", "Forbes", "Toyota", "EA"],
    diagram: `graph TD
    C[Client / Driver] --> MR[mongos Router]
    MR --> S1[Shard 1<br/>Replica Set]
    MR --> S2[Shard 2<br/>Replica Set]
    MR --> S3[Shard 3<br/>Replica Set]
    CS[Config Servers] -.-> MR
    S1 --- S1a[Primary]
    S1 --- S1b[Secondary]
    S1 --- S1c[Secondary]
    style MR fill:#13AA52,color:#fff
    style CS fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Document size", value: "16 MB", hint: "Hard limit" },
      { label: "Collection size", value: "Unbounded" },
      { label: "Shards", value: "1000s" },
      { label: "Default read", value: "primary" },
    ],
    tradeoffs: [
      {
        option: "Embed sub-documents",
        pros: ["1 query = 1 round-trip", "Atomic per-doc updates"],
        cons: ["16MB cap", "Updates rewrite whole doc"],
      },
      {
        option: "Reference + $lookup",
        pros: ["Normalized, no duplication", "Big sub-collections possible"],
        cons: ["$lookup is slow at scale", "Loses atomicity"],
      },
      {
        option: "Sharding",
        pros: ["Horizontal scale", "Multi-region capable"],
        cons: ["Bad shard key = hot shard", "Harder ops"],
      },
    ],
    content: `## MongoDB

### Data Model

Data is **BSON** — binary JSON with extra types (ObjectId, Date, Decimal128). A collection holds documents with flexible schemas; you can still enforce with **JSON Schema** validators.

### Indexes

- **Single-field, compound, multikey** (array fields), **text**, **geospatial (2dsphere)**, **wildcard**, **hashed** (for sharding).
- ESR rule for compound indexes: **Equality → Sort → Range**.

### Aggregation Pipeline

\`\`\`js
db.orders.aggregate([
  { $match: { status: "shipped", createdAt: { $gt: lastWeek } } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
])
\`\`\`

### Replication — Replica Sets

3+ nodes. One **primary**, rest **secondaries**. Heartbeats drive elections; a majority is needed to commit. Clients choose a read preference (primary, secondary, nearest).

### Sharding

- Choose a **shard key** — determines how docs are distributed.
- \`mongos\` router fans out queries to the shards that can answer.
- The **balancer** moves chunks to keep distribution even.

### Transactions

- Multi-document ACID since 4.0 (replica sets) and 4.2 (sharded clusters).
- Keep them short — long txns stall the oplog.

### Change Streams

\`\`\`js
db.orders.watch([{ $match: { "fullDocument.status": "paid" } }])
\`\`\`

Real-time tail of oplog events; powers CDC and reactive UIs.

### When It Fits

- Rapidly evolving schemas (product catalogs, event payloads).
- Deep embedded documents (threaded comments, game state blobs).
- Geospatial + text in the same doc.
`,
    keyTakeaways: [
      "BSON documents + flexible schema, but validators + indexes still matter",
      "ESR rule: Equality → Sort → Range on compound indexes",
      "Shard key choice is a one-way door — model carefully",
      "Change streams + aggregation pipeline make it more than a document store",
    ],
    animations: [
      {
        id: "mongo-shard",
        title: "Sharded Query Fanout",
        description: "mongos routes a query to the right shards.",
        intervalMs: 2200,
        nodes: [
          { id: "cl", label: "Driver", icon: "💻", x: 6, y: 50, kind: "client" },
          { id: "mr", label: "mongos", icon: "🌿", x: 28, y: 50, kind: "lb" },
          { id: "cs", label: "Config Svr", icon: "⚙️", x: 50, y: 15, kind: "service" },
          { id: "s1", label: "Shard 1", icon: "🍃", x: 72, y: 20, kind: "db" },
          { id: "s2", label: "Shard 2", icon: "🍃", x: 72, y: 50, kind: "db" },
          { id: "s3", label: "Shard 3", icon: "🍃", x: 72, y: 80, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "cl", to: "mr" },
          { id: "e2", from: "mr", to: "cs", label: "meta" },
          { id: "e3", from: "mr", to: "s1" },
          { id: "e4", from: "mr", to: "s2" },
          { id: "e5", from: "mr", to: "s3" },
        ],
        steps: [
          { title: "Query arrives at router", description: "Driver connects to mongos.", activeNodes: ["cl", "mr"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Router checks metadata", description: "Config server says which chunks live where.", activeNodes: ["mr", "cs"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Targeted fanout", description: "Query only includes shard 1 & 2 based on shard key filter.", activeNodes: ["mr", "s1", "s2"], activeEdges: ["e3", "e4"], packets: [{ edgeId: "e3", color: "#10b981" }, { edgeId: "e4", color: "#10b981" }], notes: ["Shard 3 skipped — good shard key in action"] },
          { title: "Merge results", description: "mongos combines partial answers & streams to client.", activeNodes: ["mr", "cl"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#4ade80", reverse: true }] },
        ],
      },
    ],
  },

  // ============================================================
  // 4. Redis
  // ============================================================
  {
    id: "redis",
    slug: "redis",
    title: "Redis",
    icon: "🟥",
    difficulty: "easy",
    category: "Key-Value / Cache",
    description:
      "In-memory data structure server — strings, hashes, lists, sorted sets, streams, HyperLogLog — with sub-ms latency.",
    realWorld: ["Twitter", "GitHub", "Pinterest", "Stack Overflow"],
    diagram: `graph LR
    A[App] --> R[Redis Primary<br/>single-threaded]
    R --> AOF[AOF Log]
    R --> RDB[RDB Snapshot]
    R --> S1[Replica]
    R --> S2[Replica]
    SEN[Sentinel / Cluster] -.-> R
    SEN -.-> S1
    style R fill:#DC382D,color:#fff
    style SEN fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Ops/sec/node", value: "1M+" },
      { label: "Latency", value: "< 1 ms", hint: "p99" },
      { label: "Cluster shards", value: "16384 slots" },
      { label: "Data types", value: "12+" },
    ],
    tradeoffs: [
      {
        option: "RDB snapshots",
        pros: ["Compact", "Fast restart"],
        cons: ["Data loss window between snapshots"],
      },
      {
        option: "AOF (append-only file)",
        pros: ["Near-zero data loss with fsync=always", "Human-readable"],
        cons: ["Larger than RDB", "Slower on write-heavy"],
      },
      {
        option: "AOF + RDB",
        pros: ["Best of both", "Recommended for durability"],
        cons: ["Higher disk overhead"],
      },
    ],
    content: `## Redis

### Single-Threaded by Design

One thread executes commands serially — no locks, no races. It works because operations are **in-memory and O(1)/O(log N)**. Threads are used for I/O, persistence, and deletion only.

### Data Types

| Type | Use case |
|------|----------|
| **String** | Caching, counters (\`INCR\`) |
| **Hash** | Object fields (\`HSET user:42 name 'Ada'\`) |
| **List** | Queues, timelines (\`LPUSH\`/\`BRPOP\`) |
| **Set** | Unique tags, intersection |
| **Sorted Set** | Leaderboards, rate limits (\`ZADD\`) |
| **Stream** | Kafka-lite, consumer groups |
| **HyperLogLog** | Cardinality in 12 KB |
| **Bitmap/Bitfield** | Daily active users, feature flags |
| **Geo** | Nearby search |
| **Pub/Sub** | Fire-and-forget channels |

### Persistence

- **RDB**: point-in-time binary snapshot.
- **AOF**: every write logged; rewrite compacts periodically.

### Redis Cluster

- 16384 hash slots spread across N shards.
- Client gets a MOVED redirect on the wrong shard.
- Multi-key commands must use **hash tags** \`{user:42}:profile\` to land on the same slot.

### Sentinel (non-cluster HA)

Monitors primary + replicas, performs automatic failover, serves service discovery.

### Common Patterns

- **Cache-aside**: read → miss → fetch DB → SETEX.
- **Rate limit**: \`INCR key EX 60\`; if > N, reject.
- **Distributed lock**: \`SET key val NX PX 5000\` with unique owner token.
- **Leaderboard**: sorted set by score; \`ZREVRANGE 0 9\`.
- **Session store**: HSET with TTL.

### Beware

- Persist to disk or you lose data on restart.
- Cluster mode has no cross-slot transactions.
- Memory > dataset; set a \`maxmemory-policy\` (allkeys-lru is common).
`,
    keyTakeaways: [
      "Single-threaded execution = no locks, deterministic latency",
      "Choose data type to fit the access pattern — that's the secret sauce",
      "AOF + RDB is the default durability combo",
      "Cluster splits into 16384 slots; design keys with hash tags when needed",
    ],
    animations: [
      {
        id: "redis-cache-aside",
        title: "Cache-aside Pattern",
        description: "Read path with Redis fronting a SQL database.",
        intervalMs: 2300,
        nodes: [
          { id: "a", label: "App", icon: "💻", x: 6, y: 50, kind: "client" },
          { id: "r", label: "Redis", icon: "🟥", x: 34, y: 50, kind: "cache" },
          { id: "db", label: "SQL DB", icon: "🗄️", x: 70, y: 50, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "a", to: "r", label: "GET" },
          { id: "e2", from: "a", to: "db", label: "SELECT" },
          { id: "e3", from: "a", to: "r", label: "SETEX" },
        ],
        steps: [
          { title: "App asks Redis", description: "First checks the cache.", activeNodes: ["a", "r"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Cache miss", description: "Key not in Redis — fall back to DB.", activeNodes: ["a", "db"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#dc2626" }] },
          { title: "Populate cache with TTL", description: "Write result back as SETEX key TTL value.", activeNodes: ["a", "r"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }], notes: ["Next read hits cache in <1ms"] },
        ],
      },
    ],
  },

  // ============================================================
  // 5. Cassandra
  // ============================================================
  {
    id: "cassandra",
    slug: "cassandra",
    title: "Apache Cassandra",
    icon: "💠",
    difficulty: "hard",
    category: "Wide-Column",
    description:
      "Masterless, linearly-scalable wide-column store with tunable consistency — write-optimized for massive scale.",
    realWorld: ["Netflix", "Apple", "Instagram", "Uber"],
    diagram: `graph TD
    C[Client] --> CO[Coordinator Node]
    CO --> N1[Node 1<br/>Ring]
    CO --> N2[Node 2]
    CO --> N3[Node 3]
    N1 --- N2
    N2 --- N3
    N3 --- N1
    N1 --> ML[Memtable]
    ML --> SS[(SSTables)]
    CP[Compaction] -.-> SS
    style CO fill:#1287B1,color:#fff
    style CP fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Writes/sec/node", value: "100K+" },
      { label: "Nodes per cluster", value: "1000s" },
      { label: "RF (replication)", value: "3 typical" },
      { label: "Consistency", value: "Tunable per query" },
    ],
    tradeoffs: [
      {
        option: "CL=ONE",
        pros: ["Fastest reads/writes", "High availability"],
        cons: ["Stale reads possible"],
      },
      {
        option: "CL=QUORUM",
        pros: ["Strong consistency with R+W>N", "Survives 1 replica loss at RF=3"],
        cons: ["Higher latency", "Less available"],
      },
      {
        option: "CL=ALL",
        pros: ["Strongest consistency"],
        cons: ["One node down → query fails"],
      },
    ],
    content: `## Apache Cassandra

### Ring Architecture

Every node is equal. The **token ring** assigns each node a range of hashes; a row lives on the node owning its partition key's hash + N-1 replicas.

### Partition Key is Everything

Queries must target a partition key. Cassandra is *not* a SQL database — denormalize for every access pattern. One table per query is a common design rule.

### Write Path

1. Write to **commit log** (sequential append).
2. Write to in-memory **memtable**.
3. Ack client (after coordinator hits required consistency level).
4. Memtable flushes to immutable **SSTable** on disk.
5. **Compaction** merges SSTables, drops tombstones.

No read before write — that's the secret to extreme write throughput.

### Read Path

1. Check memtable.
2. Check row cache / key cache.
3. Bloom filter per SSTable to skip.
4. Read from relevant SSTables and merge by timestamp.

### Tunable Consistency

\`R + W > N\` (where N = replication factor) gives you strong consistency. Pick per query:

- **Banking**: W=QUORUM, R=QUORUM at RF=3.
- **Analytics**: W=ONE, R=ONE — eventual is fine.

### Gotchas

- **Tombstones**: deletes are markers; too many slow reads.
- **Wide partitions**: > 100MB per partition causes GC/latency issues.
- **Secondary indexes**: often slow at scale — prefer query-specific tables.

### When Cassandra Shines

- Globally-distributed writes (time-series, sensor data).
- Workloads that are 90%+ writes or append-heavy.
- Availability > consistency requirements.
`,
    keyTakeaways: [
      "Masterless ring — every node can coordinate any request",
      "Model one table per query; denormalize fearlessly",
      "Writes are sequential (commit log + memtable) — no read-modify-write",
      "Tunable consistency (CL=ONE…ALL) is the dial between speed and strictness",
    ],
    animations: [
      {
        id: "cass-write",
        title: "QUORUM Write (RF=3)",
        description: "Coordinator waits for 2/3 replica acks.",
        intervalMs: 2200,
        nodes: [
          { id: "cl", label: "Client", icon: "💻", x: 6, y: 50, kind: "client" },
          { id: "co", label: "Coordinator", icon: "🎯", x: 26, y: 50, kind: "service" },
          { id: "r1", label: "Replica A", icon: "💠", x: 60, y: 20, kind: "db" },
          { id: "r2", label: "Replica B", icon: "💠", x: 60, y: 50, kind: "db" },
          { id: "r3", label: "Replica C", icon: "💠", x: 60, y: 80, kind: "db" },
          { id: "log", label: "Commit Log + Memtable", icon: "📝", x: 92, y: 50, kind: "storage" },
        ],
        edges: [
          { id: "e1", from: "cl", to: "co" },
          { id: "e2", from: "co", to: "r1" },
          { id: "e3", from: "co", to: "r2" },
          { id: "e4", from: "co", to: "r3" },
          { id: "e5", from: "r1", to: "log" },
          { id: "e6", from: "r2", to: "log" },
          { id: "e7", from: "co", to: "cl", label: "ack" },
        ],
        steps: [
          { title: "Client writes", description: "Any node can be coordinator.", activeNodes: ["cl", "co"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Forward to all replicas", description: "Coordinator sends to 3 replicas in parallel.", activeNodes: ["co", "r1", "r2", "r3"], activeEdges: ["e2", "e3", "e4"], packets: [
            { edgeId: "e2", color: "#f59e0b" },
            { edgeId: "e3", color: "#f59e0b" },
            { edgeId: "e4", color: "#f59e0b" },
          ] },
          { title: "2/3 ack — QUORUM met", description: "R1 and R2 commit to log + memtable; R3 lagging.", activeNodes: ["r1", "r2", "log"], activeEdges: ["e5", "e6"], packets: [{ edgeId: "e5", color: "#10b981" }, { edgeId: "e6", color: "#10b981" }] },
          { title: "Ack client", description: "Coordinator returns success to client without waiting for R3.", activeNodes: ["co", "cl"], activeEdges: ["e7"], packets: [{ edgeId: "e7", color: "#4ade80" }], notes: ["Hinted handoff will eventually update R3"] },
        ],
      },
    ],
  },

  // ============================================================
  // 6. DynamoDB
  // ============================================================
  {
    id: "dynamodb",
    slug: "dynamodb",
    title: "Amazon DynamoDB",
    icon: "⚡",
    difficulty: "medium",
    category: "Key-Value / NoSQL",
    description:
      "Fully-managed serverless NoSQL database with single-digit ms latency at any scale. Pay per request or provisioned.",
    realWorld: ["Amazon.com", "Lyft", "Snapchat", "Disney+"],
    diagram: `graph LR
    C[Client] --> API[DynamoDB API]
    API --> R1[Partition 1]
    API --> R2[Partition 2]
    API --> R3[Partition N]
    R1 -->|stream| ST[DynamoDB Streams]
    ST --> L[Lambda]
    R1 --> GSI[(GSI)]
    style API fill:#FF9900,color:#000
    style ST fill:#7C3AED,color:#fff`,
    scaleMetrics: [
      { label: "Read latency", value: "< 10 ms", hint: "Single-digit ms" },
      { label: "Throughput", value: "Millions req/s" },
      { label: "Item size", value: "400 KB max" },
      { label: "Storage", value: "Unlimited" },
    ],
    tradeoffs: [
      {
        option: "On-Demand",
        pros: ["Zero capacity planning", "Perfect for spiky workloads"],
        cons: ["~7x more expensive at steady load"],
      },
      {
        option: "Provisioned",
        pros: ["Predictable cost", "Reserved capacity discounts"],
        cons: ["Throttling if you under-provision"],
      },
      {
        option: "Global Tables",
        pros: ["Multi-region active-active", "Automatic conflict resolution"],
        cons: ["Last-writer-wins = loss on conflict", "Cost multiplier per region"],
      },
    ],
    content: `## Amazon DynamoDB

### Data Model

Every item belongs to a **partition key (PK)**. Optionally a **sort key (SK)** gives you a range within the partition. Together: **composite key** (PK, SK).

### Single-Table Design

A single table serves many entity types, using PK/SK prefixes:

| PK | SK | Entity |
|----|----|--------|
| \`USER#42\` | \`PROFILE\` | User profile |
| \`USER#42\` | \`ORDER#2026-04-18\` | Order |
| \`ORDER#abc\` | \`ITEM#1\` | Line item |

One \`Query\` on \`PK=USER#42\` returns profile + all orders in a single round-trip.

### Indexes

- **LSI** (Local Secondary Index): alternate sort key, same PK. Up to 5 per table. Created at table creation.
- **GSI** (Global Secondary Index): totally different PK/SK. Up to 20. Eventually consistent.

### Streams & Change Data Capture

Every write emits a stream record: old + new image. Trigger Lambda for search indexing, fan-out, or audit.

### Transactions

\`TransactWriteItems\` — up to 100 items, all-or-nothing, across tables. Cost: 2x the write units.

### Consistency

- **Eventually consistent** reads (default): 0.5x cost, replica might be stale.
- **Strongly consistent** reads: full cost, always fresh.

### Common Pitfalls

- **Hot partitions**: bad PK choice (e.g., \`country=US\` for a US-only app) causes throttling.
- **Scan**: reads the whole table — almost never what you want. Use Query.
- **Large items + many GSIs** balloon write cost (GSIs replicate each write).

### When DynamoDB Fits

- Well-understood access patterns (model them upfront).
- Predictable P99 at massive scale.
- Serverless apps (Lambda + DynamoDB + API Gateway = zero infra ops).
`,
    keyTakeaways: [
      "Model access patterns first, then design PK/SK — single-table design is the norm",
      "Avoid hot partitions: PKs must be high-cardinality",
      "Streams + Lambda = built-in CDC for free",
      "Use Query (never Scan) in production paths",
    ],
    animations: [
      {
        id: "dyn-write",
        title: "Write → Stream → Lambda",
        description: "A PutItem triggers a Stream event consumed by Lambda.",
        intervalMs: 2300,
        nodes: [
          { id: "c", label: "Client", icon: "💻", x: 6, y: 50, kind: "client" },
          { id: "api", label: "DynamoDB API", icon: "⚡", x: 26, y: 50, kind: "service" },
          { id: "p", label: "Partition", icon: "🧱", x: 46, y: 50, kind: "storage" },
          { id: "s", label: "Stream", icon: "📡", x: 68, y: 50, kind: "queue" },
          { id: "l", label: "Lambda", icon: "λ", x: 86, y: 50, kind: "worker" },
          { id: "es", label: "OpenSearch", icon: "🔎", x: 98, y: 20, kind: "external" },
        ],
        edges: [
          { id: "e1", from: "c", to: "api", label: "PutItem" },
          { id: "e2", from: "api", to: "p" },
          { id: "e3", from: "p", to: "s" },
          { id: "e4", from: "s", to: "l" },
          { id: "e5", from: "l", to: "es" },
        ],
        steps: [
          { title: "Client PutItem", description: "Item hashed to a partition by PK.", activeNodes: ["c", "api"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Write to partition", description: "3 replicas committed synchronously across AZs.", activeNodes: ["api", "p"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#10b981" }] },
          { title: "Stream record emitted", description: "NEW_AND_OLD_IMAGES captures the change.", activeNodes: ["p", "s"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#f59e0b" }] },
          { title: "Lambda consumes", description: "Trigger fires; Lambda processes batch of records.", activeNodes: ["s", "l"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#7c3aed" }] },
          { title: "Index to search", description: "Lambda writes to OpenSearch for full-text queries.", activeNodes: ["l", "es"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 7. Elasticsearch
  // ============================================================
  {
    id: "elasticsearch",
    slug: "elasticsearch",
    title: "Elasticsearch",
    icon: "🔎",
    difficulty: "medium",
    category: "Search / Analytics",
    description:
      "Distributed search & analytics engine built on Lucene. Near-real-time full-text search, aggregations, and log analytics.",
    realWorld: ["Wikipedia", "GitHub", "Netflix", "Walmart", "Uber logs"],
    diagram: `graph TD
    C[Client] --> CO[Coordinating Node]
    CO --> P1[Primary Shard 1]
    CO --> P2[Primary Shard 2]
    P1 --> R1[Replica]
    P2 --> R2[Replica]
    P1 --> LU1[Lucene Segments]
    P2 --> LU2[Lucene Segments]
    style CO fill:#00BFB3,color:#000
    style LU1 fill:#F59E0B,color:#000`,
    scaleMetrics: [
      { label: "Index refresh", value: "1 s", hint: "Near real-time" },
      { label: "Docs per shard", value: "2B max" },
      { label: "Shards per index", value: "1-100s" },
      { label: "Replicas", value: "1+ typical" },
    ],
    tradeoffs: [
      {
        option: "More shards",
        pros: ["Higher parallelism", "Easier rebalance"],
        cons: ["Overhead per shard", "Too many = slow queries"],
      },
      {
        option: "Fewer, bigger shards",
        pros: ["Less overhead", "Higher throughput per node"],
        cons: ["Slow rebalance", "Recovery takes longer"],
      },
      {
        option: "ILM (hot/warm/cold)",
        pros: ["Cheap long-term storage", "Automatic tiering"],
        cons: ["Complex to set up", "Cold queries are slow"],
      },
    ],
    content: `## Elasticsearch

### The Inverted Index

For each term, Lucene stores a sorted list of doc IDs containing it. Search = intersect postings lists. Fast for "find docs with term".

Each index is split into **shards**; each shard is a Lucene index made of immutable **segments**.

### Indexing

1. Document arrives → analyzed (lowercase, tokenize, stem).
2. Terms written to in-memory buffer + translog.
3. Every **refresh_interval** (default 1s) buffer → new segment, searchable.
4. Flush: fsync + clear translog. Segments merge in the background.

### Query Execution

- Coordinator routes to one shard copy per primary (primary or replica).
- Each shard scores locally.
- Coordinator merges top-K from each shard; re-sorts.

### Text Analysis

| Component | Example |
|-----------|---------|
| **Char filter** | Strip HTML |
| **Tokenizer** | \`"The Quick brown" → ["The","Quick","brown"]\` |
| **Token filters** | Lowercase, stemming, synonyms |

\`\`\`json
POST /articles/_search
{
  "query": {
    "bool": {
      "must": [{ "match": { "title": "postgres" } }],
      "filter": [{ "term": { "status": "published" } }]
    }
  },
  "aggs": {
    "by_author": { "terms": { "field": "author.keyword" } }
  }
}
\`\`\`

### When Elasticsearch Hurts

- **It's not a source of truth** — treat it as a denormalized search mirror.
- **Joins are painful**. Denormalize.
- **Mapping explosion**: dynamic mapping with user-driven field names can create 100K+ fields.
- Heavy write workloads without careful sharding.

### Observability (ELK)

Logs → Filebeat/Logstash → Elasticsearch → Kibana. Still the canonical on-prem log stack; commonly backed by ILM for tiering.
`,
    keyTakeaways: [
      "Inverted index makes term search fast — denormalize to play to this strength",
      "refresh_interval controls search latency vs indexing throughput",
      "Mapping discipline prevents field explosion",
      "Use ILM to tier hot → warm → cold storage",
    ],
    animations: [
      {
        id: "es-index",
        title: "Document Indexing",
        description: "From PUT to searchable in ~1s.",
        intervalMs: 2200,
        nodes: [
          { id: "c", label: "Client", icon: "💻", x: 6, y: 50, kind: "client" },
          { id: "co", label: "Coordinator", icon: "🎯", x: 24, y: 50, kind: "service" },
          { id: "an", label: "Analyzer", icon: "✂️", x: 42, y: 50, kind: "service" },
          { id: "bf", label: "Buffer + Translog", icon: "📝", x: 60, y: 50, kind: "cache" },
          { id: "seg", label: "Segment", icon: "📚", x: 80, y: 50, kind: "storage" },
          { id: "rep", label: "Replica", icon: "📚", x: 96, y: 20, kind: "db" },
        ],
        edges: [
          { id: "e1", from: "c", to: "co" },
          { id: "e2", from: "co", to: "an" },
          { id: "e3", from: "an", to: "bf" },
          { id: "e4", from: "bf", to: "seg", label: "refresh" },
          { id: "e5", from: "seg", to: "rep", label: "replicate" },
        ],
        steps: [
          { title: "Doc arrives", description: "Coordinator picks a shard based on routing.", activeNodes: ["c", "co"], activeEdges: ["e1"], packets: [{ edgeId: "e1", color: "#22d3ee" }] },
          { title: "Analyze text", description: "Tokenize, lowercase, stem — produce terms.", activeNodes: ["co", "an"], activeEdges: ["e2"], packets: [{ edgeId: "e2", color: "#f59e0b" }] },
          { title: "Write buffer + translog", description: "Indexed in-memory; translog appended for recovery.", activeNodes: ["an", "bf"], activeEdges: ["e3"], packets: [{ edgeId: "e3", color: "#10b981" }] },
          { title: "Refresh → new segment", description: "After 1s, buffer flipped to an immutable Lucene segment — now searchable.", activeNodes: ["bf", "seg"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#7c3aed" }] },
          { title: "Replicate", description: "Segment replicated to replica shards.", activeNodes: ["seg", "rep"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#4ade80" }] },
        ],
      },
    ],
  },

  // ============================================================
  // 8. SQLite
  // ============================================================
  {
    id: "sqlite",
    slug: "sqlite",
    title: "SQLite",
    icon: "🪶",
    difficulty: "easy",
    category: "Embedded",
    description:
      "The most deployed database on Earth — a single-file, zero-config, serverless SQL engine embedded into the app.",
    realWorld: ["Every phone", "Chrome", "Firefox", "Skype", "Airbus A350"],
    diagram: `graph LR
    APP[Application] --> LIB[SQLite Library<br/>linked in-process]
    LIB --> VDB[Virtual DB Engine]
    VDB --> BT[B-Tree / Pager]
    BT --> F[(single .db file)]
    BT --> WAL[(WAL file)]
    style LIB fill:#0F80CC,color:#fff
    style F fill:#10B981,color:#fff`,
    scaleMetrics: [
      { label: "Max DB size", value: "281 TB", hint: "Theoretical" },
      { label: "Concurrent writers", value: "1", hint: "WAL = many readers + 1 writer" },
      { label: "Dependencies", value: "Zero" },
      { label: "Binary size", value: "< 700 KB" },
    ],
    tradeoffs: [
      {
        option: "Default journal mode",
        pros: ["Simple rollback journal", "Wide compatibility"],
        cons: ["Blocks readers during write"],
      },
      {
        option: "WAL mode",
        pros: ["Readers never block writers", "Faster commits"],
        cons: ["Requires filesystem access to two files", "Slightly more complex on network FS"],
      },
      {
        option: "Client/server DBs",
        pros: ["Multiple concurrent writers", "Remote access"],
        cons: ["Operational complexity — why SQLite exists"],
      },
    ],
    content: `## SQLite

### Why It's Everywhere

- **Zero configuration**: no server, no install — just a library.
- **Single file** = trivially copied, backed up, emailed.
- **Public domain** license.
- **Battle-tested** (phones, planes, browsers).

### Architecture

SQLite runs **in-process**: your app links \`libsqlite3\`, which opens the \`.db\` file directly. No IPC, no network. That's why it's fast for single-user apps — no context switches.

### WAL Mode

Default (rollback journal) holds an exclusive lock during writes. **WAL** mode decouples: writes append to a \`.wal\` file, readers see a snapshot. A checkpoint process periodically folds WAL into the main DB.

### What SQLite Is Good At

- **Local app data** — browsers, desktop apps, mobile.
- **Config storage** — replacing XML/INI.
- **Test databases** — in-memory (\`:memory:\`).
- **Edge/small sites** — Litestream replicates to S3 for cheap HA.
- **Data pipelines** — a single file is easy to ship across systems.

### What It's Not For

- Multiple concurrent writers — WAL supports one writer.
- Network-shared databases — locking is unreliable over NFS/SMB.
- High-write server workloads — use Postgres/MySQL.

### Cool Features

- **Full-text search** (FTS5) — built-in.
- **JSON1 extension** — JSON functions in SQL.
- **R-Tree** for spatial queries.
- **Virtual tables** — implement your own table types in C.
- **sqlite3_preupdate_hook** — change data capture.

### Litestream & rqlite

- **Litestream**: streams WAL to S3 in near-real-time. Makes SQLite a replicated HA store.
- **rqlite**: raft consensus across N SQLite nodes.

SQLite today is a practical backend for serious small-to-medium workloads.
`,
    keyTakeaways: [
      "SQLite runs in-process — no server, no network",
      "WAL mode unlocks concurrent readers with one writer",
      "FTS5, JSON1, R-Tree, virtual tables make it surprisingly capable",
      "Litestream gives you a replicated, serverless, single-file database",
    ],
    animations: [
      {
        id: "sqlite-wal",
        title: "WAL Mode — Readers + Writer",
        description: "Concurrent reads never block writes (and vice versa).",
        intervalMs: 2200,
        nodes: [
          { id: "r1", label: "Reader 1", icon: "📖", x: 8, y: 25, kind: "client" },
          { id: "r2", label: "Reader 2", icon: "📖", x: 8, y: 75, kind: "client" },
          { id: "w", label: "Writer", icon: "✍️", x: 30, y: 50, kind: "client" },
          { id: "lib", label: "SQLite Lib", icon: "🪶", x: 52, y: 50, kind: "service" },
          { id: "db", label: "Main .db", icon: "🗄️", x: 78, y: 25, kind: "storage" },
          { id: "wal", label: ".wal file", icon: "📝", x: 78, y: 75, kind: "storage" },
          { id: "ck", label: "Checkpoint", icon: "🚰", x: 96, y: 50, kind: "worker" },
        ],
        edges: [
          { id: "e1", from: "r1", to: "lib" },
          { id: "e2", from: "r2", to: "lib" },
          { id: "e3", from: "w", to: "lib" },
          { id: "e4", from: "lib", to: "db", label: "read" },
          { id: "e5", from: "lib", to: "wal", label: "append" },
          { id: "e6", from: "ck", to: "db" },
          { id: "e7", from: "wal", to: "ck" },
        ],
        steps: [
          { title: "Readers & writer connect", description: "All three open the same file through the library.", activeNodes: ["r1", "r2", "w", "lib"], activeEdges: ["e1", "e2", "e3"], packets: [{ edgeId: "e1", color: "#22d3ee" }, { edgeId: "e2", color: "#22d3ee" }, { edgeId: "e3", color: "#f59e0b" }] },
          { title: "Readers see a snapshot", description: "Both readers scan the main DB file at a fixed point.", activeNodes: ["lib", "db"], activeEdges: ["e4"], packets: [{ edgeId: "e4", color: "#10b981" }] },
          { title: "Writer appends to WAL", description: "Writes go to .wal — doesn't touch main file.", activeNodes: ["lib", "wal"], activeEdges: ["e5"], packets: [{ edgeId: "e5", color: "#dc2626" }] },
          { title: "Checkpoint folds WAL → DB", description: "Background: WAL pages copied into main DB once no reader needs them.", activeNodes: ["ck", "wal", "db"], activeEdges: ["e6", "e7"], packets: [{ edgeId: "e7", color: "#7c3aed" }, { edgeId: "e6", color: "#4ade80" }] },
        ],
      },
    ],
  },
];

export function getDatabaseBySlug(slug: string): SystemDesign | undefined {
  return databases.find((d) => d.slug === slug);
}
