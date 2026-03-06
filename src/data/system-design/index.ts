import type { SystemDesign } from "@/data/types";

export const systemDesigns: SystemDesign[] = [
  {
    id: "url-shortener",
    slug: "url-shortener",
    title: "URL Shortener",
    icon: "🔗",
    difficulty: "medium",
    category: "Web Services",
    description:
      "Design a service like bit.ly that shortens URLs and handles billions of redirects.",
    diagram: `graph TD
    A[Client] -->|POST /shorten| B[API Gateway]
    B --> C[App Server]
    C -->|Generate short code| D[ID Generator]
    C -->|Store mapping| E[(Database)]
    C -->|Cache hot URLs| F[(Redis Cache)]
    A -->|GET /abc123| B
    B --> C
    C -->|Check cache| F
    F -->|Cache miss| E
    C -->|301 Redirect| A
    style A fill:#4F46E5,color:#fff
    style F fill:#DC2626,color:#fff
    style E fill:#059669,color:#fff`,
    content: `## URL Shortener Design

### Requirements

**Functional:**
- Given a long URL, generate a short unique URL
- Redirect short URL to original URL
- Custom short URLs (optional)
- Link expiration

**Non-Functional:**
- High availability (99.99%)
- Low latency redirects (< 50ms)
- 100:1 read-to-write ratio
- 100M new URLs/month

### Capacity Estimation

| Metric | Value |
|--------|-------|
| New URLs/month | 100M |
| Reads/month | 10B |
| Writes/second | ~40 |
| Reads/second | ~4,000 |
| Storage/5 years | ~15 TB |

### Short URL Generation

**Base62 Encoding** (a-z, A-Z, 0-9):
- 6 characters = 62^6 ≈ 56.8 billion unique URLs
- 7 characters = 62^7 ≈ 3.5 trillion unique URLs

**Approaches:**
1. **Counter-based:** Auto-increment ID → base62. Simple but predictable.
2. **Hash-based:** MD5/SHA256 of URL → take first 6-7 chars. Risk of collision.
3. **Pre-generated keys:** Generate keys offline, assign on request. No collision, fast.

### Database Schema

\`\`\`sql
CREATE TABLE urls (
  id BIGINT PRIMARY KEY,
  short_code VARCHAR(7) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  user_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  click_count BIGINT DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);
\`\`\`

### Architecture

**Write Path:**
Client → API Server → Generate short code → Store in DB → Return short URL

**Read Path:**
Client → CDN/Cache → API Server → Redis → DB (fallback) → 301 Redirect

### Key Design Decisions

1. **301 vs 302 Redirect:** 301 (permanent) is cached by browser; 302 (temporary) allows analytics tracking on every request.
2. **Cache Strategy:** LRU cache in Redis. Top 20% of URLs serve 80% of traffic.
3. **Database:** NoSQL (DynamoDB/Cassandra) for high write throughput, or sharded MySQL.
4. **Rate Limiting:** Prevent abuse — max 100 URLs/hour per user.`,
    keyTakeaways: [
      "Base62 encoding for short URL generation",
      "Caching is critical for read-heavy workload (100:1 ratio)",
      "301 vs 302 redirect depends on analytics needs",
      "Pre-generated key service eliminates collision handling",
    ],
  },
  {
    id: "chat-system",
    slug: "chat-system",
    title: "Real-Time Chat System",
    icon: "💬",
    difficulty: "hard",
    category: "Real-Time",
    description:
      "Design a messaging platform like WhatsApp or Slack supporting 1:1 and group chats.",
    diagram: `graph TD
    A[Client A] -->|WebSocket| B[Chat Server 1]
    C[Client B] -->|WebSocket| D[Chat Server 2]
    B --> E[Message Queue / Kafka]
    D --> E
    E --> F[Message Service]
    F --> G[(Message DB)]
    F --> H[Push Notification]
    B <-->|Pub/Sub| I[(Redis Pub/Sub)]
    D <-->|Pub/Sub| I
    style A fill:#4F46E5,color:#fff
    style C fill:#7C3AED,color:#fff
    style E fill:#DC2626,color:#fff
    style G fill:#059669,color:#fff`,
    content: `## Real-Time Chat System

### Requirements

**Functional:**
- 1:1 messaging
- Group chats (up to 500 members)
- Online/offline status
- Read receipts
- Media sharing (images, files)

**Non-Functional:**
- Real-time delivery (< 200ms)
- Message ordering guarantee
- Offline message delivery
- End-to-end encryption

### Connection Management

**WebSocket** is the primary protocol for real-time bidirectional communication:
- Client establishes WebSocket connection on app open
- Heartbeat every 30 seconds to detect disconnection
- Reconnect with exponential backoff on disconnect
- Fallback: Long polling for restricted networks

### Message Flow

**Online recipient:**
1. Sender → WebSocket → Chat Server → Kafka
2. Kafka → Recipient's Chat Server → WebSocket → Recipient
3. Store in DB asynchronously

**Offline recipient:**
1. Sender → Chat Server → Kafka → Store in DB
2. When recipient comes online → fetch undelivered messages
3. Send push notification immediately

### Message Storage

\`\`\`
Messages Table (Cassandra — write-optimized):
- partition_key: chat_id
- clustering_key: message_id (time-based UUID)
- sender_id, content, type, created_at

Benefits:
- Messages for a chat are co-located
- Time-ordered within partition
- Efficient range queries (load last N messages)
\`\`\`

### Group Chat Optimization

Small groups (< 50): Fan-out on write — push to all members
Large groups (> 50): Fan-out on read — members pull on open

### Key Design Decisions

1. **Ordering:** Use Snowflake IDs (timestamp-based) for global ordering
2. **E2E Encryption:** Signal Protocol (used by WhatsApp)
3. **Media:** Upload to S3/CDN, send URL in message
4. **Presence:** Publish online status via Redis Pub/Sub with TTL`,
    keyTakeaways: [
      "WebSocket for real-time bidirectional communication",
      "Kafka for reliable message delivery and ordering",
      "Cassandra for write-heavy message storage",
      "Fan-out strategy depends on group size",
    ],
  },
  {
    id: "news-feed",
    slug: "news-feed",
    title: "Social Media News Feed",
    icon: "📰",
    difficulty: "hard",
    category: "Social",
    description:
      "Design a news feed system like Facebook or Twitter that serves personalized content.",
    diagram: `graph TD
    A[User Posts] -->|Write| B[Post Service]
    B --> C[Message Queue]
    C --> D[Fan-out Service]
    D --> E[(Feed Cache / Redis)]
    D --> F[(Post DB)]
    G[User Opens Feed] --> H[Feed Service]
    H --> E
    H --> I[Ranking Service]
    I -->|ML Model| J[Ranked Feed]
    J --> G
    style A fill:#4F46E5,color:#fff
    style E fill:#DC2626,color:#fff
    style I fill:#7C3AED,color:#fff`,
    content: `## News Feed System Design

### The Core Problem

When a user opens their feed, we need to show the most relevant posts from their network, ranked and personalized — in under 200ms.

### Fan-out Strategies

**Fan-out on Write (Push Model):**
- When user creates a post, push to all followers' feed caches
- ✅ Fast reads — feed is pre-computed
- ❌ Celebrity problem: User with 10M followers = 10M writes

**Fan-out on Read (Pull Model):**
- When user opens feed, fetch posts from all followed users
- ✅ No wasted computation
- ❌ Slow reads, especially for users following many people

**Hybrid Approach (Best Practice):**
- Push for users with < 5,000 followers
- Pull for celebrities at read time
- Merge results and rank

### Feed Ranking

\`\`\`
score = affinity_weight × affinity_score
      + type_weight × content_type_score
      + recency_weight × time_decay(post_age)
      + engagement_weight × engagement_score
\`\`\`

**Signals:**
- **Affinity:** How often user interacts with the poster
- **Content Type:** Photos typically rank higher than text
- **Recency:** Exponential decay function
- **Engagement:** Likes, comments, shares volume

### Architecture

**Write Path:**
Post created → Store in DB → Push to Kafka → Fan-out service → Update feed caches

**Read Path:**
User opens app → Fetch from feed cache → Merge with celebrity posts → Rank → Return

### Storage

| Data | Store | Reason |
|------|-------|--------|
| Posts | MySQL + Sharding | Structured, needs strong consistency |
| Feed cache | Redis Sorted Set | Fast reads, sorted by score |
| Media | S3 + CDN | Large files, global access |
| Social graph | Graph DB | Efficient friend queries |`,
    keyTakeaways: [
      "Hybrid fan-out: push for regular users, pull for celebrities",
      "ML-based ranking determines feed order",
      "Redis sorted sets for pre-computed feed caches",
      "Separate storage systems optimized for each data type",
    ],
  },
  {
    id: "rate-limiter",
    slug: "rate-limiter",
    title: "Distributed Rate Limiter",
    icon: "🚦",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Design a rate limiting service to protect APIs from abuse and ensure fair usage.",
    diagram: `graph LR
    A[Client] --> B[API Gateway]
    B --> C{Rate Limiter}
    C -->|Allowed| D[Backend Service]
    C -->|Blocked| E[429 Too Many Requests]
    C <--> F[(Redis Counter)]
    style C fill:#F59E0B,color:#000
    style E fill:#DC2626,color:#fff
    style F fill:#059669,color:#fff`,
    content: `## Distributed Rate Limiter

### Why Rate Limiting?

- Prevent DoS/DDoS attacks
- Ensure fair resource allocation
- Control costs (prevent runaway API usage)
- Comply with agreements (SLA/tiered pricing)

### Common Algorithms

**1. Token Bucket:**
\`\`\`
Bucket has max N tokens, refills at R tokens/second.
Each request consumes 1 token.
If bucket empty → reject request.
\`\`\`
✅ Allows bursts up to bucket size | ✅ Simple | ✅ Memory efficient

**2. Sliding Window Counter:**
\`\`\`
Combine fixed window counters with weighted overlap.
current_count = prev_window × overlap_percentage + current_window
\`\`\`
✅ Smooth rate limiting | ✅ No burst spikes

**3. Sliding Window Log:**
\`\`\`
Store timestamp of each request in sorted set.
Remove entries outside the window.
Count remaining entries.
\`\`\`
✅ Most accurate | ❌ High memory usage

### Distributed Implementation

\`\`\`javascript
// Redis + Lua for atomic rate limiting
const luaScript = \\\`
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local current = redis.call('INCR', key)
  if current == 1 then
    redis.call('EXPIRE', key, window)
  end
  if current > limit then
    return 0  -- Rejected
  end
  return 1    -- Allowed
\\\`
\`\`\`

### Multi-tier Rate Limiting

| Tier | Scope | Example |
|------|-------|---------|
| Global | All users | 10,000 req/s total |
| Per-user | By API key | 100 req/min |
| Per-endpoint | By API + path | 20 req/min for POST |
| Per-IP | By source IP | 50 req/min |

### Headers

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1678901234
Retry-After: 30
\`\`\``,
    keyTakeaways: [
      "Token bucket is most widely used (AWS, Stripe)",
      "Redis + Lua script for atomic distributed counting",
      "Multi-tier approach for defense in depth",
      "Return rate limit headers so clients can self-throttle",
    ],
  },
  {
    id: "notification-system",
    slug: "notification-system",
    title: "Notification System",
    icon: "🔔",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Design a scalable notification system supporting push, email, SMS, and in-app channels.",
    diagram: `graph TD
    A[Event Source] --> B[Notification Service]
    B --> C{Channel Router}
    C --> D[Push Service / APNs / FCM]
    C --> E[Email Service / SES]
    C --> F[SMS Service / Twilio]
    C --> G[In-App WebSocket]
    B --> H[(Notification DB)]
    B --> I[User Preferences]
    style B fill:#4F46E5,color:#fff
    style C fill:#F59E0B,color:#000
    style H fill:#059669,color:#fff`,
    content: `## Notification System Design

### Requirements

- Support multiple channels: Push, Email, SMS, In-App
- User preferences (opt-in/out per channel per notification type)
- Rate limiting (max N notifications per user per hour)
- Template-based messages
- Delivery tracking and analytics

### Architecture

**Event-driven pipeline:**
1. Service emits event ("order_shipped", {orderId, userId})
2. Notification service receives event
3. Looks up user preferences → which channels?
4. Rate limit check per user
5. Render template with event data
6. Route to channel-specific service
7. Track delivery status

### User Preferences

\`\`\`json
{
  "userId": "user-123",
  "preferences": {
    "order_updates": { "push": true, "email": true, "sms": false },
    "promotions": { "push": false, "email": true, "sms": false },
    "security_alerts": { "push": true, "email": true, "sms": true }
  },
  "quiet_hours": { "start": "22:00", "end": "08:00", "timezone": "America/New_York" }
}
\`\`\`

### Reliability

**At-least-once delivery:**
- Message queue (Kafka/SQS) between notification service and channel services
- Each channel service acknowledges after successful delivery
- Retry with exponential backoff on failure
- Dead letter queue after max retries

**Deduplication:**
- Idempotency key per notification
- Check before sending: "Did we already send this?"

### Template Engine

\`\`\`
Template: "Hi {{user.name}}, your order #{{order.id}} has shipped!"

Rendered: "Hi John, your order #12345 has shipped!"
\`\`\`

Templates support:
- Variable substitution
- Conditional blocks
- Localization (i18n)
- Channel-specific formatting (HTML for email, plain text for SMS)`,
    keyTakeaways: [
      "Event-driven architecture with message queue",
      "User preference system controls channel routing",
      "Idempotency keys prevent duplicate notifications",
      "Rate limiting per user prevents notification fatigue",
    ],
  },
  {
    id: "distributed-cache",
    slug: "distributed-cache",
    title: "Distributed Cache",
    icon: "⚡",
    difficulty: "hard",
    category: "Infrastructure",
    description:
      "Design a distributed caching system like Redis or Memcached for high-throughput workloads.",
    diagram: `graph TD
    A[App Server 1] --> B[Cache Proxy]
    C[App Server 2] --> B
    B -->|Consistent Hashing| D[Cache Node 1]
    B -->|Consistent Hashing| E[Cache Node 2]
    B -->|Consistent Hashing| F[Cache Node 3]
    D <-->|Replication| E
    E <-->|Replication| F
    style B fill:#F59E0B,color:#000
    style D fill:#DC2626,color:#fff
    style E fill:#DC2626,color:#fff
    style F fill:#DC2626,color:#fff`,
    content: `## Distributed Cache Design

### Why Distributed Cache?

- Reduce database load (90%+ cache hit rate)
- Sub-millisecond read latency
- Handle millions of operations per second
- Survive individual node failures

### Consistent Hashing

**Problem:** Simple modular hashing (key % N) requires remapping all keys when nodes change.

**Solution:** Consistent hashing ring
- Each node is placed at multiple points (virtual nodes) on a hash ring
- Keys are assigned to the next clockwise node
- Adding/removing a node only affects ~1/N of the keys

### Eviction Policies

| Policy | Description | Use Case |
|--------|-------------|----------|
| LRU | Remove least recently used | General purpose |
| LFU | Remove least frequently used | Hot/cold data |
| TTL | Remove expired entries | Session data |
| Random | Remove random entry | When all keys are equally important |

### Cache Patterns

**1. Cache-Aside (Lazy Loading):**
\`\`\`
read: check cache → miss → read DB → write to cache → return
write: write DB → invalidate cache
\`\`\`

**2. Write-Through:**
\`\`\`
write: write cache + DB simultaneously
read: always from cache
\`\`\`

**3. Write-Behind (Write-Back):**
\`\`\`
write: write cache → async write DB (batched)
read: always from cache
Ultra-fast writes but risk of data loss
\`\`\`

### Cache Invalidation

The "two hardest problems in CS" — cache invalidation:

1. **TTL-based:** Set expiry on every key. Simple but stale data during TTL.
2. **Event-based:** DB change → publish event → invalidate cache. Near real-time.
3. **Version-based:** Cache key includes version number. New version = new key.

### Replication & Availability

- Primary-replica setup for each partition
- Async replication for speed, sync for consistency
- Automatic failover: replica promoted to primary on failure
- Gossip protocol for node health monitoring`,
    keyTakeaways: [
      "Consistent hashing for even distribution and minimal remapping",
      "Cache-aside is the most common pattern",
      "TTL + event-based invalidation for freshness",
      "Virtual nodes help with load balancing",
    ],
  },
  {
    id: "search-engine",
    slug: "search-engine",
    title: "Search Engine",
    icon: "🔍",
    difficulty: "hard",
    category: "Data Systems",
    description:
      "Design a web-scale search engine with crawling, indexing, and query serving components.",
    diagram: `graph TD
    A[Web Crawler] -->|Fetch pages| B[URL Frontier]
    A --> C[Document Store]
    C --> D[Indexer]
    D --> E[(Inverted Index)]
    F[User Query] --> G[Query Service]
    G --> E
    G --> H[Ranker]
    H -->|PageRank + ML| I[Search Results]
    style A fill:#4F46E5,color:#fff
    style E fill:#059669,color:#fff
    style H fill:#7C3AED,color:#fff`,
    content: `## Search Engine Design

### Core Components

**1. Web Crawler:**
- Start with seed URLs
- BFS traversal of the web
- Politeness: robots.txt, crawl rate limits per domain
- Deduplication: URL normalization + content hashing
- Priority queue: More important pages crawled first

**2. Inverted Index:**
\`\`\`
Word → [(doc1, positions), (doc2, positions), ...]

"distributed": [(doc42, [5, 23]), (doc87, [1, 15, 44])]
"systems":     [(doc42, [6, 24]), (doc99, [3])]
\`\`\`
- Allows O(1) lookup by term
- Intersection of posting lists for multi-word queries

**3. Ranking:**

**PageRank** (Link Analysis):
\`\`\`
PR(page) = (1-d)/N + d × Σ(PR(linking_page) / outlinks(linking_page))
d = damping factor (0.85)
\`\`\`

**TF-IDF** (Term Relevance):
\`\`\`
TF = frequency of term in document / total terms in document
IDF = log(total documents / documents containing term)
Score = TF × IDF
\`\`\`

**Modern: Learning to Rank (ML)**
- Features: TF-IDF, PageRank, freshness, click-through rate
- Trained on user click data
- BERT/Transformer models for semantic understanding

### Query Processing

1. Parse query → tokenize, stem, remove stop words
2. Look up terms in inverted index
3. Intersect/union posting lists based on boolean logic
4. Score documents using ranking function
5. Return top-k results with snippets

### Scale: Google processes 8.5 billion searches/day

- Distributed index across thousands of servers
- Sharded by document range or term range
- Multiple replicas per shard for availability
- < 200ms end-to-end latency target`,
    keyTakeaways: [
      "Inverted index is the core data structure",
      "PageRank + TF-IDF + ML for relevance ranking",
      "Crawl politeness and deduplication are essential",
      "Shard the index across many servers for scale",
    ],
  },
  {
    id: "video-streaming",
    slug: "video-streaming",
    title: "Video Streaming Platform",
    icon: "🎥",
    difficulty: "hard",
    category: "Media",
    description:
      "Design a video streaming service like YouTube or Netflix with adaptive bitrate streaming.",
    diagram: `graph TD
    A[Content Creator] -->|Upload| B[Upload Service]
    B --> C[Transcoding Pipeline]
    C -->|Multiple resolutions| D[(Object Storage / S3)]
    D --> E[CDN Edge Servers]
    F[Viewer] -->|Request video| E
    E -->|Adaptive streaming| F
    G[Recommendation Engine] -->|Personalized feed| F
    style C fill:#7C3AED,color:#fff
    style E fill:#DC2626,color:#fff
    style G fill:#F59E0B,color:#000`,
    content: `## Video Streaming Platform

### Upload & Processing Pipeline

1. **Upload:** Chunked upload (resumable) to object storage
2. **Transcoding:** Convert to multiple formats and resolutions
   - Resolutions: 240p, 360p, 480p, 720p, 1080p, 4K
   - Codecs: H.264 (compatibility), H.265 (efficiency), VP9, AV1
   - Container: MP4, WebM
3. **Chunking:** Split video into 2-4 second segments per quality level
4. **Thumbnail Generation:** Extract frames, generate preview sprites
5. **Metadata:** Duration, resolution, subtitles, content tags

### Adaptive Bitrate Streaming (ABR)

**How it works:**
- Video chunked into small segments at each quality level
- Client monitors available bandwidth
- Switches quality per-segment based on conditions
- Protocols: HLS (Apple), DASH (open standard)

**Manifest file (.m3u8 for HLS):**
\`\`\`
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
\`\`\`

### CDN Strategy

- Cache popular content at edge servers globally
- Netflix Open Connect: ISP-embedded cache appliances
- Predictive pre-positioning of content based on trends
- 80/20 rule: Top 20% of videos serve 80% of traffic

### Recommendation System

Three pillars for content recommendations:
1. **Collaborative filtering:** Users who watched X also watched Y
2. **Content-based:** Match by genre, director, actors, mood
3. **Contextual:** Time of day, device type, watch history

### Scale Numbers (YouTube-scale)

| Metric | Value |
|--------|-------|
| Videos uploaded/minute | 500+ hours |
| Daily views | 1 billion+ |
| Storage | Exabytes |
| CDN bandwidth | Petabits/second |`,
    keyTakeaways: [
      "Adaptive bitrate streaming adjusts quality in real-time",
      "CDN is critical — serve content from edge locations",
      "Transcoding pipeline converts to multiple resolutions/codecs",
      "Chunked segments allow seamless quality switching",
    ],
  },
  {
    id: "key-value-store",
    slug: "key-value-store",
    title: "Distributed Key-Value Store",
    icon: "🗃️",
    difficulty: "hard",
    category: "Data Systems",
    description:
      "Design a distributed key-value database like DynamoDB or etcd with high availability.",
    diagram: `graph TD
    A[Client] --> B[Coordinator Node]
    B -->|Write W=2| C[Node 1 - Primary]
    B -->|Write W=2| D[Node 2 - Replica]
    B -->|Async| E[Node 3 - Replica]
    C --> F[(SSTables)]
    D --> G[(SSTables)]
    style B fill:#F59E0B,color:#000
    style C fill:#059669,color:#fff
    style D fill:#059669,color:#fff`,
    content: `## Distributed Key-Value Store

### Design Goals

- **Partition tolerance** — system works despite network partitions
- **High availability** — always accept reads and writes
- **Tunable consistency** — choose between strong and eventual
- **Horizontal scaling** — add nodes to increase capacity

### Data Partitioning

**Consistent Hashing** with virtual nodes:
- Each physical node owns multiple virtual nodes on the ring
- Key is hashed and assigned to the next clockwise virtual node
- Adding a node only re-distributes ~1/N of keys
- Virtual nodes ensure balanced load even with heterogeneous hardware

### Replication

- Each key is replicated to N nodes (typically N=3)
- Coordinator forwards writes to all N replicas
- **Quorum:** W + R > N for strong consistency
  - W=2, R=2, N=3 → strong consistency
  - W=1, R=1, N=3 → eventual consistency (fast)

### Write Path (LSM Tree)

1. Write to WAL (Write-Ahead Log) for durability
2. Write to in-memory MemTable (sorted — Red-Black Tree)
3. When MemTable is full → flush to disk as SSTable
4. Background compaction merges SSTables

### Read Path

1. Check MemTable (in-memory)
2. Check Bloom filter (probabilistic — is key possibly in this SSTable?)
3. Search SSTables from newest to oldest
4. Return first match

### Conflict Resolution

**Vector Clocks** to detect concurrent writes:
\`\`\`
Node A writes: {A:1}
Node B writes concurrently: {B:1}
Conflict detected: {A:1} and {B:1} are concurrent
Resolution: Application-level (e.g., last-writer-wins, merge)
\`\`\`

### Failure Detection

**Gossip Protocol:**
- Each node periodically pings random nodes
- Share membership list + heartbeat counters
- If a node's heartbeat doesn't increment → suspected failure
- After timeout → marked as dead, data re-replicated`,
    keyTakeaways: [
      "LSM Tree: MemTable → SSTable → Compaction for write optimization",
      "Quorum reads/writes for tunable consistency",
      "Consistent hashing for data partitioning",
      "Gossip protocol for decentralized failure detection",
    ],
  },
  {
    id: "payment-system",
    slug: "payment-system",
    title: "Payment System",
    icon: "💰",
    difficulty: "hard",
    category: "Financial",
    description:
      "Design a payment processing system handling authorization, capture, and settlement.",
    diagram: `graph LR
    A[Merchant] -->|Charge request| B[Payment Gateway]
    B --> C{Fraud Detection}
    C -->|Safe| D[Payment Processor]
    C -->|Suspicious| E[Review Queue]
    D --> F[Card Network / Visa]
    F --> G[Issuing Bank]
    G -->|Approved| F
    F -->|Approved| D
    D -->|Result| B
    B -->|Result| A
    style C fill:#F59E0B,color:#000
    style F fill:#4F46E5,color:#fff`,
    content: `## Payment System Design

### Payment Flow

**Authorization → Capture → Settlement**

1. **Authorization:** "Can this card pay $50?" → Reserve funds
2. **Capture:** "Actually charge the $50" → Move from reserved to pending
3. **Settlement:** Batch process — move funds between banks (usually T+1 or T+2)

### Idempotency — The Most Critical Requirement

\`\`\`
Problem: Network timeout during payment. Did it go through?
Solution: Idempotency key on every request.

Client sends: POST /charge { amount: 50, idempotency_key: "abc-123" }

Server checks:
  If "abc-123" already processed → return cached result
  If "abc-123" in progress → return 409 Conflict
  If new → process and store result keyed by "abc-123"
\`\`\`

### Double-Entry Bookkeeping

Every transaction creates two entries:
\`\`\`
Debit:  Customer account  -$50.00
Credit: Merchant account   +$50.00
\`\`\`
Sum of all entries must always be zero. This is the fundamental integrity check.

### Fraud Detection

**Rule-based:**
- Velocity checks (too many transactions in short time)
- Geographic anomaly (transaction far from usual location)
- Amount thresholds

**ML-based:**
- Features: transaction amount, merchant category, time, device, location
- Model: Gradient boosted trees or neural network
- Decision in < 100ms to not slow down checkout

### Reconciliation

Daily process to ensure consistency:
1. Compare internal transaction log with bank statements
2. Flag discrepancies (missing transactions, amount mismatches)
3. Auto-resolve known patterns, escalate unknowns
4. Generate settlement reports

### Security

- **PCI DSS compliance:** 12 requirements for handling card data
- **Tokenization:** Replace card number with token immediately
- **Encryption:** TLS in transit, AES-256 at rest
- **3D Secure:** Additional authentication (OTP) for high-risk transactions`,
    keyTakeaways: [
      "Idempotency keys prevent duplicate charges",
      "Double-entry bookkeeping ensures accounting integrity",
      "Authorization and capture are separate steps",
      "Fraud detection must be real-time (< 100ms)",
    ],
  },
  {
    id: "load-balancer",
    slug: "load-balancer",
    title: "Load Balancer",
    icon: "⚖️",
    difficulty: "medium",
    category: "Infrastructure",
    description:
      "Design a load balancer that distributes traffic across servers with health checking.",
    diagram: `graph TD
    A[Clients] --> B[DNS]
    B --> C[L4 Load Balancer]
    C --> D[L7 Load Balancer 1]
    C --> E[L7 Load Balancer 2]
    D --> F[Server Pool A]
    D --> G[Server Pool B]
    E --> F
    E --> G
    style C fill:#F59E0B,color:#000
    style D fill:#4F46E5,color:#fff
    style E fill:#4F46E5,color:#fff`,
    content: `## Load Balancer Design

### L4 vs L7 Load Balancing

**Layer 4 (Transport):**
- Routes based on IP address and TCP port
- Very fast (no packet inspection)
- Cannot route based on content
- Examples: AWS NLB, HAProxy (TCP mode)

**Layer 7 (Application):**
- Routes based on HTTP headers, URL path, cookies
- Can do content-based routing
- SSL termination, compression, caching
- Examples: Nginx, AWS ALB, Envoy

### Load Balancing Algorithms

| Algorithm | Description | Best For |
|-----------|-------------|----------|
| Round Robin | Rotate through servers | Equal capacity servers |
| Weighted Round Robin | Proportional to server capacity | Mixed hardware |
| Least Connections | Route to server with fewest active connections | Long-lived connections |
| IP Hash | Hash client IP to consistent server | Session affinity |
| Random | Pick random server | Simple, surprisingly effective |

### Health Checking

\`\`\`
Active Health Checks:
  - HTTP GET /health every 10 seconds
  - Healthy: 3 consecutive 200 responses
  - Unhealthy: 2 consecutive failures
  - Remove unhealthy servers from rotation

Passive Health Checks:
  - Monitor actual request responses
  - Track error rates per server
  - Slow response time → reduce traffic weight
\`\`\`

### Session Affinity (Sticky Sessions)

**Problem:** User's session data is on Server A, but next request goes to Server B.

**Solutions:**
1. Cookie-based: LB sets cookie with server ID
2. IP hash: Same client IP → same server
3. Better: Externalize session to Redis (no affinity needed)

### High Availability

- Active-Passive: Standby LB takes over on failure
- Active-Active: Multiple LBs share traffic (DNS round-robin)
- Virtual IP (VIP) with heartbeat between LB pairs
- BGP anycast for global load balancing`,
    keyTakeaways: [
      "L4 is faster; L7 enables content-based routing",
      "Least connections is best for heterogeneous workloads",
      "Health checks remove failed servers automatically",
      "Externalize session state to avoid sticky session problems",
    ],
  },
  {
    id: "api-design",
    slug: "api-design",
    title: "API Gateway & Design",
    icon: "🌐",
    difficulty: "medium",
    category: "Web Services",
    description:
      "Design best practices for REST/GraphQL APIs with authentication, versioning, and gateway patterns.",
    diagram: `graph TD
    A[Mobile App] --> D[API Gateway]
    B[Web App] --> D
    C[3rd Party] --> D
    D --> E{Auth / Rate Limit}
    E --> F[User Service]
    E --> G[Order Service]
    E --> H[Payment Service]
    D --> I[Analytics]
    style D fill:#4F46E5,color:#fff
    style E fill:#F59E0B,color:#000`,
    content: `## API Gateway & Design

### REST API Best Practices

**URL Design:**
\`\`\`
GET    /api/v1/users          → List users
GET    /api/v1/users/123      → Get user 123
POST   /api/v1/users          → Create user
PUT    /api/v1/users/123      → Update user 123
PATCH  /api/v1/users/123      → Partial update
DELETE /api/v1/users/123      → Delete user 123

Nested: GET /api/v1/users/123/orders → User's orders
Filter: GET /api/v1/users?role=admin&limit=20
\`\`\`

**Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (client error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

### API Gateway Functions

1. **Authentication:** Validate JWT/API key before routing
2. **Rate Limiting:** Per-user, per-endpoint limits
3. **Request Routing:** Route to appropriate microservice
4. **Protocol Translation:** REST → gRPC, etc.
5. **Request/Response Transformation:** Add headers, shape responses
6. **Caching:** Cache GET responses at gateway level
7. **Analytics:** Log all requests for monitoring

### REST vs GraphQL

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Multiple | Single (/graphql) |
| Over-fetching | Common | Client specifies fields |
| Under-fetching | Multiple roundtrips | Single query |
| Caching | HTTP caching easy | Harder to cache |
| Learning curve | Low | Medium |
| Best for | CRUD APIs | Complex nested data |

### API Versioning

1. **URL path:** /api/v1/users (most common)
2. **Header:** Accept: application/vnd.api.v1+json
3. **Query param:** /api/users?version=1

### Pagination

\`\`\`json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true,
    "totalCount": 1523
  }
}
\`\`\`
Cursor-based pagination is preferred over offset — it's stable when data changes.`,
    keyTakeaways: [
      "Use nouns for resources, HTTP verbs for actions",
      "API Gateway centralizes cross-cutting concerns",
      "Cursor-based pagination over offset-based",
      "Version APIs in URL path for simplicity",
    ],
  },
];

export function getSystemDesignBySlug(slug: string): SystemDesign | undefined {
  return systemDesigns.find((sd) => sd.slug === slug);
}
