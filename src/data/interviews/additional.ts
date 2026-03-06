import type { Company } from "@/data/types";

export const additionalCompanies: Company[] = [
  {
    id: "uber",
    slug: "uber",
    name: "Uber",
    logo: "🚗",
    description:
      "Strong focus on system design at scale, real-time systems, and geospatial algorithms.",
    interviewProcess:
      "Recruiter call → Phone screen (coding) → On-site: 2 coding + 1 system design + 1 behavioral",
    questions: [
      {
        id: "ub-1",
        question: "Design a ride-sharing service like Uber.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Ride-Sharing System Design

**Core Services:**

1. **Matching Service:**
   - Match riders with nearby drivers in real-time
   - Use geospatial index (Geohash / S2 cells / QuadTree)
   - Optimize for ETA, not straight-line distance
   - Handle surge pricing based on supply/demand ratio

2. **Location Service:**
   - Drivers send GPS updates every 3-4 seconds
   - Store in-memory (Redis) for real-time queries
   - Use WebSocket for live tracking

3. **Trip Service:**
   - State machine: Requested → Matched → En-route → In-trip → Completed
   - Calculate fare: base + (rate × distance) + (rate × time) + surge multiplier

4. **ETA Service:**
   - Road network graph + Dijkstra/A*
   - Historical traffic data for time-of-day adjustments
   - ML model trained on actual trip durations

5. **Scaling:**
   - Partition by city/region
   - Kafka for async event processing
   - CQRS pattern (separate read/write paths)
   - ~1M concurrent drivers, billions of location updates/day`,
      },
      {
        id: "ub-2",
        question:
          "How would you find the nearest k drivers to a given rider location?",
        category: "Coding",
        difficulty: "medium",
        answer: `### Nearest K Drivers

**Approach: Geospatial Index + Priority Queue**

\`\`\`javascript
// Using a max-heap of size k
function findNearestDrivers(riderLat, riderLng, drivers, k) {
  // Min-heap based on distance
  const distances = drivers.map(d => ({
    driver: d,
    dist: haversine(riderLat, riderLng, d.lat, d.lng)
  }));

  // Sort and take k smallest
  distances.sort((a, b) => a.dist - b.dist);
  return distances.slice(0, k).map(d => d.driver);
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
\`\`\`

**At Scale:**
- Use Geohash to narrow search area first
- Only check drivers in nearby geohash cells
- Redis GEOSEARCH command for built-in geo queries`,
      },
      {
        id: "ub-3",
        question: "Explain how you would implement surge pricing.",
        category: "System Design",
        difficulty: "medium",
        answer: `### Surge Pricing Design

**Concept:** Dynamic pricing based on supply/demand in a geographic area.

**Algorithm:**
1. Divide city into hexagonal zones (H3 by Uber)
2. Every 1-2 minutes, calculate per zone:
   - \`demand = open_requests / time_window\`
   - \`supply = available_drivers / time_window\`
   - \`surge_multiplier = f(demand / supply)\`

**Implementation:**
\`\`\`javascript
function calculateSurge(zone) {
  const demand = getOpenRequests(zone, WINDOW_MS);
  const supply = getAvailableDrivers(zone);

  const ratio = demand / Math.max(supply, 1);

  if (ratio < 1.0) return 1.0;       // No surge
  if (ratio < 1.5) return 1.25;      // Light surge
  if (ratio < 2.0) return 1.5;       // Moderate
  if (ratio < 3.0) return 2.0;       // High
  return Math.min(ratio, 5.0);       // Cap at 5x
}
\`\`\`

**Smoothing:**
- Use exponential moving average to avoid sudden jumps
- Display surge warning to riders before they confirm
- Gradually decrease surge as more drivers enter the zone`,
      },
    ],
  },
  {
    id: "stripe",
    slug: "stripe",
    name: "Stripe",
    logo: "💳",
    description:
      "Focus on API design, distributed systems, and payment processing. Values clean code and testing.",
    interviewProcess:
      "Recruiter → Phone coding → On-site: 2 coding + 1 system design + 1 integration",
    questions: [
      {
        id: "st-1",
        question: "Design a payment processing system.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Payment Processing System

**Core Flow:**
1. Client → API Gateway → Payment Service
2. Validate request (amount, currency, card token)
3. Fraud detection check (ML model)
4. Route to payment processor (Visa/Mastercard network)
5. Process authorization
6. Return result, store transaction

**Key Design Decisions:**

1. **Idempotency:**
   - Every request has an idempotency key
   - Prevents duplicate charges on retry
   - Store key → result mapping in Redis (24h TTL)

2. **Two-Phase Processing:**
   - Authorization: Reserve funds on card
   - Capture: Actually move the money (can be delayed)
   - Allows for order cancellation before capture

3. **Reconciliation:**
   - Compare internal records with bank statements daily
   - Handle discrepancies (reversals, chargebacks)

4. **Security:**
   - PCI DSS compliance
   - Tokenize card numbers (never store raw)
   - Encrypt sensitive data at rest and in transit

5. **Reliability:**
   - At-least-once processing + idempotency = exactly-once semantics
   - Dead letter queue for failed transactions
   - Multi-region active-active for 99.999% uptime`,
      },
      {
        id: "st-2",
        question: "Implement a rate limiter from scratch.",
        category: "Coding",
        difficulty: "medium",
        answer: `### Rate Limiter Implementation

**Token Bucket Algorithm:**

\`\`\`javascript
class RateLimiter {
  constructor(maxTokens, refillRate) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  tryConsume() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true; // Request allowed
    }
    return false;   // Rate limited
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.maxTokens,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }
}

// Example: 10 requests per second
const limiter = new RateLimiter(10, 10);
console.log(limiter.tryConsume()); // true
\`\`\`

**Distributed Rate Limiting:**
- Use Redis with Lua script for atomic operations
- Sliding window counter or sorted set approach
- Consistent hashing for per-user limits across servers`,
      },
      {
        id: "st-3",
        question:
          "How would you design an API that handles webhook delivery reliably?",
        category: "System Design",
        difficulty: "medium",
        answer: `### Reliable Webhook Delivery

**Requirements:**
- At-least-once delivery guarantee
- Retry with exponential backoff
- Handle endpoint failures gracefully

**Architecture:**
1. Event occurs → publish to message queue (Kafka/SQS)
2. Webhook worker consumes event
3. Send HTTP POST to customer endpoint
4. If 2xx → mark delivered
5. If failure → retry with exponential backoff

**Retry Strategy:**
\`\`\`
Attempt 1: Immediately
Attempt 2: After 1 minute
Attempt 3: After 5 minutes
Attempt 4: After 30 minutes
Attempt 5: After 2 hours
Attempt 6: After 8 hours
Attempt 7: After 24 hours
\`\`\`

**Key Features:**
- **Idempotency**: Include event ID so receivers can deduplicate
- **Signing**: HMAC-SHA256 signature for authenticity
- **Monitoring**: Dashboard showing delivery rates, failures
- **Dead letter queue**: After max retries, alert customer
- **Replay**: Allow customers to replay missed webhooks`,
      },
    ],
  },
  {
    id: "airbnb",
    slug: "airbnb",
    name: "Airbnb",
    logo: "🏠",
    description:
      "Emphasizes cross-functional thinking, product sense, and scalable architecture.",
    interviewProcess:
      "Recruiter → Phone screen → On-site: 2 coding + 1 system design + 2 cross-functional",
    questions: [
      {
        id: "ab-1",
        question: "Design a hotel/property booking system like Airbnb.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Property Booking System Design

**Core Services:**

1. **Search Service:**
   - Full-text search (Elasticsearch) with filters
   - Geospatial queries (search by map area)
   - Availability calendar check
   - Price range, amenities, property type filters

2. **Booking Service:**
   - Check availability → Reserve → Confirm → Payment
   - Prevent double-booking with optimistic locking
   - Handle timezone-aware date ranges

3. **Availability Calendar:**
   - Bitmap per property per month (1 = available, 0 = booked)
   - Or date-range based: store booked date ranges
   - Cache hot properties in Redis

4. **Pricing Service:**
   - Base price set by host
   - Dynamic pricing based on demand, season, events
   - Cleaning fees, service fees, taxes

5. **Preventing Double Booking:**
\`\`\`sql
-- Atomic check-and-book with row locking
BEGIN TRANSACTION;
SELECT * FROM bookings
  WHERE property_id = ? AND dates overlap ?
  FOR UPDATE;
-- If no conflicts:
INSERT INTO bookings (...) VALUES (...);
COMMIT;
\`\`\`

**Scale:** 7M+ listings, 150M+ users, multi-region deployment`,
      },
      {
        id: "ab-2",
        question:
          "Implement a function to determine if a booking's dates overlap with existing bookings.",
        category: "Coding",
        difficulty: "medium",
        answer: `### Date Overlap Detection

\`\`\`javascript
function hasOverlap(newCheckIn, newCheckOut, existingBookings) {
  for (const booking of existingBookings) {
    // Two ranges overlap if one starts before the other ends
    if (newCheckIn < booking.checkOut &&
        newCheckOut > booking.checkIn) {
      return true;
    }
  }
  return false;
}

// Optimized: sorted bookings + binary search
function hasOverlapOptimized(checkIn, checkOut, sortedBookings) {
  let lo = 0, hi = sortedBookings.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const b = sortedBookings[mid];
    if (checkOut <= b.checkIn) {
      hi = mid - 1;
    } else if (checkIn >= b.checkOut) {
      lo = mid + 1;
    } else {
      return true; // Overlap found
    }
  }
  return false;
}
\`\`\`

**Two ranges [A, B) and [C, D) overlap iff:** A < D and C < B`,
      },
    ],
  },
  {
    id: "linkedin",
    slug: "linkedin",
    name: "LinkedIn",
    logo: "💼",
    description:
      "Focus on graph algorithms, feed ranking, and scalable social network infrastructure.",
    interviewProcess:
      "Phone screen → On-site: 2 coding + 1 system design + 1 behavioral",
    questions: [
      {
        id: "li-1",
        question:
          "Design the LinkedIn connection recommendation system (People You May Know).",
        category: "System Design",
        difficulty: "hard",
        answer: `### People You May Know (PYMK)

**Approach: Multi-signal Graph-based Ranking**

1. **2nd Degree Connections:**
   - Find friends-of-friends not yet connected
   - Rank by number of mutual connections
   - Most impactful signal

2. **Additional Signals:**
   - Same company (current or past)
   - Same school/university
   - Same industry/skills
   - Geographic proximity
   - Profile viewers (who viewed your profile)
   - Imported contacts overlap

3. **Scoring Function:**
\`\`\`
score = w1 * mutual_connections +
        w2 * same_company +
        w3 * same_school +
        w4 * profile_view_recency +
        w5 * shared_skills_count
\`\`\`

4. **Architecture:**
   - Social graph stored in dedicated graph database
   - Precompute PYMK candidates offline (Spark/Hadoop)
   - Cache top-k suggestions per user in Redis
   - Real-time updates for new connections via Kafka

5. **Scale:** 900M+ members, billions of edges in social graph`,
      },
      {
        id: "li-2",
        question:
          "Given a social graph, find the shortest path between two users (degrees of separation).",
        category: "Coding",
        difficulty: "medium",
        answer: `### Shortest Path in Social Graph

**Bidirectional BFS — most efficient for this use case**

\`\`\`javascript
function degreesOfSeparation(graph, userA, userB) {
  if (userA === userB) return 0;

  const visitedA = new Map([[userA, 0]]);
  const visitedB = new Map([[userB, 0]]);
  const queueA = [userA];
  const queueB = [userB];

  while (queueA.length > 0 || queueB.length > 0) {
    // Expand from A side
    const resultA = expandLevel(graph, queueA, visitedA, visitedB);
    if (resultA !== -1) return resultA;

    // Expand from B side
    const resultB = expandLevel(graph, queueB, visitedB, visitedA);
    if (resultB !== -1) return resultB;
  }
  return -1; // Not connected
}

function expandLevel(graph, queue, visited, otherVisited) {
  const size = queue.length;
  for (let i = 0; i < size; i++) {
    const node = queue.shift();
    for (const neighbor of graph[node] || []) {
      if (otherVisited.has(neighbor)) {
        return visited.get(node) + 1 + otherVisited.get(neighbor);
      }
      if (!visited.has(neighbor)) {
        visited.set(neighbor, visited.get(node) + 1);
        queue.push(neighbor);
      }
    }
  }
  return -1;
}
\`\`\`

**Why Bidirectional BFS?**
- Regular BFS: O(b^d) where b=branching factor, d=depth
- Bidirectional: O(b^(d/2)) — exponentially faster
- Average LinkedIn user has ~500 connections
- 6 degrees: 500^6 vs 500^3 = enormous difference`,
      },
    ],
  },
  {
    id: "twitter",
    slug: "twitter",
    name: "X (Twitter)",
    logo: "🐦",
    description:
      "Focus on real-time systems, high-throughput data pipelines, and distributed caching.",
    interviewProcess:
      "Phone screen → On-site: 2 coding + 1 system design + 1 behavioral",
    questions: [
      {
        id: "tw-1",
        question: "Design a Twitter-like social media timeline.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Twitter Timeline Design

**The Fan-out Problem:**

Two approaches for generating a user's home timeline:

1. **Fan-out on Write (Push):**
   - When user tweets, push to all followers' timelines
   - Pre-computed, fast reads
   - Problem: Celebrity with 50M followers → 50M writes per tweet

2. **Fan-out on Read (Pull):**
   - When user opens timeline, fetch tweets from all followees
   - No wasted computation
   - Slow reads for users following many accounts

3. **Hybrid (Twitter's approach):**
   - Push for users with < 5000 followers
   - Pull for celebrities at read time
   - Merge push + pull results for final timeline

**Tweet Storage:**
- Tweet table: id, user_id, text, media_urls, timestamp
- Timeline cache: Redis sorted set per user (tweet_id, timestamp)
- Keep last 800 tweets per user in cache

**Architecture:**
- Write path: Tweet → Kafka → Fan-out service → Redis timelines
- Read path: API → Merge(cached timeline + celebrity tweets) → Rank → Return
- ~500M tweets/day, 200K+ tweets/second peak`,
      },
      {
        id: "tw-2",
        question: "Design a trending topics system.",
        category: "System Design",
        difficulty: "medium",
        answer: `### Trending Topics System

**Goal:** Identify rapidly rising topics in real-time.

**Key Insight:** Trending ≠ popular. A topic with sudden spike matters more than a consistently popular one.

**Algorithm:**
\`\`\`
trend_score = (current_volume / historical_average) × recency_weight
\`\`\`

**Pipeline:**
1. **Ingestion:** Stream all tweets through Kafka
2. **Extraction:** Extract hashtags, entities, n-grams
3. **Counting:** Sliding window counter per topic
   - 1-minute, 5-minute, 1-hour, 24-hour windows
4. **Scoring:** Compare current rate vs expected rate
5. **Filtering:** Remove spam, NSFW, low quality
6. **Localization:** Separate trends per country/city

**Implementation:**
- Apache Storm/Flink for stream processing
- Redis for real-time counters
- Count-Min Sketch for approximate counting at scale
- Bloom filter for deduplication

**Refresh:** Update trending list every 30-60 seconds`,
      },
    ],
  },
  {
    id: "spotify",
    slug: "spotify",
    name: "Spotify",
    logo: "🎵",
    description:
      "Emphasis on recommendation systems, audio streaming, and data-intensive applications.",
    interviewProcess:
      "Recruiter → Phone screen → On-site: 2 coding + 1 system design + 1 values",
    questions: [
      {
        id: "sp-1",
        question: "Design a music recommendation system.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Music Recommendation System

**Three Main Approaches:**

1. **Collaborative Filtering:**
   - Users who listen to similar music get similar recommendations
   - Matrix factorization: User-Song matrix → latent features
   - "Users like you also liked..."

2. **Content-Based:**
   - Analyze audio features (tempo, key, energy, danceability)
   - Genre/artist similarity graphs
   - NLP on lyrics and metadata

3. **Contextual:**
   - Time of day (upbeat mornings, calm evenings)
   - Activity (workout, study, sleep)
   - Device (car = longer tracks, phone = playlists)

**Discover Weekly Pipeline:**
1. Collect 1 week of listening data
2. Find "taste clusters" via collaborative filtering
3. Select songs from clusters user hasn't heard
4. Rank by predicted listen probability
5. Generate 30-song playlist per user
6. Batch job (Spark) runs Sunday night

**Architecture:**
- Event streaming: Kafka (play events, skips, saves)
- Batch processing: Spark for model training
- Feature store: Cassandra
- Serving: Low-latency prediction service
- A/B testing: Every recommendation change is tested`,
      },
      {
        id: "sp-2",
        question:
          "How would you design an audio streaming service that minimizes buffering?",
        category: "System Design",
        difficulty: "medium",
        answer: `### Low-Latency Audio Streaming

**Key Strategies:**

1. **Progressive Download + Buffer:**
   - Download 5-10 seconds ahead of playback
   - Adaptive quality based on bandwidth
   - Pre-buffer next song in queue

2. **CDN Strategy:**
   - Cache popular songs at edge locations
   - 80/20 rule: Top 20% of songs = 80% of plays
   - Warm cache before new release drops

3. **Audio Encoding:**
   - Multiple quality levels: 96kbps, 160kbps, 320kbps
   - Ogg Vorbis format (better quality/size ratio than MP3)
   - Normalize loudness across tracks

4. **Crossfade & Gapless:**
   - Pre-load next track while current plays
   - Analyze track endings/beginnings for crossfade timing
   - Buffer queue of upcoming 2-3 tracks

5. **Offline Mode:**
   - Encrypted download to device storage
   - DRM protection
   - Periodic license check (every 30 days)

**Bandwidth:** ~1MB per minute at 160kbps. 100M concurrent users = massive CDN infrastructure.`,
      },
    ],
  },
  {
    id: "adobe",
    slug: "adobe",
    name: "Adobe",
    logo: "🎨",
    description:
      "Values creativity, design thinking, and building tools for creators. Strong CS fundamentals.",
    interviewProcess:
      "Phone screen → On-site: 3 coding + 1 system design + 1 hiring manager",
    questions: [
      {
        id: "ad-1",
        question:
          "Design a real-time collaborative drawing/whiteboard application.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Collaborative Whiteboard Design

**Core Challenges:**
- Real-time sync (< 50ms latency feel)
- Concurrent drawing by multiple users
- Undo/redo per user

**Data Model:**
Each stroke = sequence of points with metadata:
\`\`\`json
{
  "id": "stroke-123",
  "userId": "user-1",
  "tool": "pen",
  "color": "#ff0000",
  "width": 3,
  "points": [[10,20], [11,22], [13,25]],
  "timestamp": 1678901234
}
\`\`\`

**Sync Strategy: CRDT-based**
- Each operation has a unique ID (userId + lamport timestamp)
- Operations are commutative (order doesn't matter)
- No conflicts possible for non-overlapping strokes

**Architecture:**
1. Client draws → sends stroke data via WebSocket
2. Server broadcasts to all other clients in the room
3. Persist to database (event log of all strokes)
4. Periodic snapshot for fast loading

**Optimizations:**
- Batch point updates (send every 16ms = 60fps)
- Simplify paths (Douglas-Peucker algorithm)
- Spatial partitioning for undo (QuadTree)
- Canvas layers for different users`,
      },
      {
        id: "ad-2",
        question: "Implement an undo/redo system.",
        category: "Coding",
        difficulty: "medium",
        answer: `### Undo/Redo with Command Pattern

\`\`\`javascript
class UndoRedoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  execute(command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo on new action
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const command = this.undoStack.pop();
    command.undo();
    this.redoStack.push(command);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const command = this.redoStack.pop();
    command.execute();
    this.undoStack.push(command);
  }
}

// Example command
class DrawStrokeCommand {
  constructor(canvas, stroke) {
    this.canvas = canvas;
    this.stroke = stroke;
  }
  execute() { this.canvas.addStroke(this.stroke); }
  undo() { this.canvas.removeStroke(this.stroke.id); }
}
\`\`\`

**Key Principles:**
- Command pattern: Each action encapsulates execute + undo
- New action clears redo stack
- Can limit stack size for memory management`,
      },
    ],
  },
  {
    id: "oracle",
    slug: "oracle",
    name: "Oracle",
    logo: "🗄️",
    description:
      "Deep focus on databases, SQL optimization, and enterprise-grade system design.",
    interviewProcess:
      "Phone screen → On-site: 3 technical rounds + 1 managerial",
    questions: [
      {
        id: "or-1",
        question: "Explain database indexing. When would you NOT use an index?",
        category: "CS Fundamentals",
        difficulty: "medium",
        answer: `### Database Indexing

**What is an Index?**
A data structure (typically B+ Tree) that speeds up data retrieval at the cost of extra storage and slower writes.

**Types:**
- **B+ Tree Index:** Default, good for range queries. O(log n) lookup.
- **Hash Index:** O(1) for exact match, bad for ranges.
- **Composite Index:** Multiple columns. Order matters! \`(a, b, c)\` helps queries on \`a\`, \`(a,b)\`, or \`(a,b,c)\` but NOT \`(b,c)\`.
- **Covering Index:** Contains all columns needed by the query (no table lookup needed).

**When NOT to Use:**
1. **Small tables** — full scan is faster than index lookup
2. **High write-to-read ratio** — every INSERT/UPDATE must update index
3. **Low cardinality columns** — e.g., boolean (male/female). Index doesn't help much.
4. **Frequently updated columns** — constant index rebuilding
5. **Columns rarely used in WHERE/JOIN/ORDER BY**

**Query Optimization:**
\`\`\`sql
-- EXPLAIN to check if index is used
EXPLAIN ANALYZE SELECT * FROM orders
  WHERE user_id = 123 AND status = 'active'
  ORDER BY created_at DESC;
\`\`\``,
      },
      {
        id: "or-2",
        question:
          "What is the difference between ACID and BASE? When would you choose each?",
        category: "CS Fundamentals",
        difficulty: "medium",
        answer: `### ACID vs BASE

**ACID (Traditional RDBMS):**
- **Atomicity:** All or nothing — transaction fully completes or fully rolls back
- **Consistency:** Database moves from one valid state to another
- **Isolation:** Concurrent transactions don't interfere
- **Durability:** Committed data survives crashes

**BASE (NoSQL / Distributed):**
- **Basically Available:** System always responds (possibly stale data)
- **Soft state:** State may change over time (without input)
- **Eventually consistent:** Data will converge to consistent state

**When to Choose:**

| Use Case | Choose |
|----------|--------|
| Banking/payments | ACID |
| Social media likes | BASE |
| Inventory management | ACID |
| User session data | BASE |
| Medical records | ACID |
| Content recommendations | BASE |

**CAP Theorem context:**
- ACID prioritizes Consistency
- BASE prioritizes Availability
- In distributed systems, you can't have both (network partitions are inevitable)`,
      },
    ],
  },
  {
    id: "salesforce",
    slug: "salesforce",
    name: "Salesforce",
    logo: "☁️",
    description:
      "Cloud-first company focused on multi-tenant architecture, APIs, and enterprise SaaS design.",
    interviewProcess:
      "Phone screen → Virtual/on-site: 3 coding/design rounds + 1 behavioral",
    questions: [
      {
        id: "sf-1",
        question: "Design a multi-tenant SaaS application architecture.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Multi-Tenant SaaS Architecture

**Multi-Tenancy Models:**

1. **Database per Tenant:**
   - Complete isolation
   - Easy backup/restore per tenant
   - Expensive, hard to scale beyond ~1000 tenants

2. **Schema per Tenant:**
   - Shared database, separate schemas
   - Good balance of isolation and efficiency
   - Medium cost

3. **Shared Schema (Salesforce's approach):**
   - All tenants in same tables with \`tenant_id\` column
   - Most cost-efficient, hardest to implement
   - Requires careful query isolation

**Key Design Elements:**

1. **Tenant Isolation:**
   - Every query MUST include \`WHERE tenant_id = ?\`
   - Row-level security policies
   - Rate limiting per tenant

2. **Customization:**
   - Metadata-driven: Store custom fields/objects as metadata
   - Dynamic schema: EAV (Entity-Attribute-Value) pattern
   - Salesforce uses "Universal Data Dictionary" for this

3. **Scaling:**
   - Pod architecture: group tenants into pods
   - Large tenants get dedicated resources
   - Horizontal scaling via sharding by tenant_id

4. **Data Access:**
   - REST/GraphQL APIs with tenant-scoped auth
   - OAuth 2.0 per tenant organization`,
      },
      {
        id: "sf-2",
        question:
          "How do you ensure fair resource allocation across tenants (noisy neighbor problem)?",
        category: "System Design",
        difficulty: "medium",
        answer: `### Noisy Neighbor Problem

**Problem:** One tenant consuming excessive resources degrades performance for others.

**Solutions:**

1. **Rate Limiting per Tenant:**
   - API calls: 15,000/hour per org (Salesforce)
   - Concurrent requests: max 25
   - Database rows returned: max 50,000 per query

2. **Resource Quotas:**
   - Storage: Max GB per tenant
   - Compute: Max CPU seconds per transaction
   - Memory: Heap size limits

3. **Queue-based Isolation:**
\`\`\`
Tenant requests → per-tenant queue → shared worker pool
\`\`\`
   - Weighted fair queuing: premium tenants get more throughput
   - Circuit breaker: pause a tenant if it exceeds limits

4. **Monitoring:**
   - Track per-tenant resource usage
   - Alert on anomalies
   - Auto-scale pods that serve heavy tenants

5. **Billing Incentive:**
   - Charge for resource usage beyond baseline
   - Helps self-regulate tenant behavior`,
      },
    ],
  },
  {
    id: "goldman-sachs",
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    logo: "🏦",
    description:
      "Strong emphasis on data structures, algorithms, and low-latency system design for financial systems.",
    interviewProcess:
      "HackerRank test → Phone interview → Superday: 4-5 rounds (technical + fit)",
    questions: [
      {
        id: "gs-1",
        question: "Design a real-time stock trading system.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Stock Trading System Design

**Core Components:**

1. **Order Book:**
   - Buy orders (bids) sorted descending by price
   - Sell orders (asks) sorted ascending by price
   - Match when highest bid ≥ lowest ask
   - Data structure: Two priority queues (heaps)

2. **Matching Engine:**
   - Price-Time priority: Same price → first come first served
   - Must be deterministic and auditable
   - Single-threaded to avoid race conditions
   - Latency target: < 1 microsecond per match

3. **Order Types:**
   - Market order: Execute at best available price
   - Limit order: Execute only at specified price or better
   - Stop order: Triggered when price reaches threshold

4. **Architecture:**
   - Gateway → Order validation → Matching engine → Execution
   - Event sourcing: Every order/trade is an immutable event
   - Sequencer: Assign global sequence numbers

5. **Reliability:**
   - Primary-backup replication (hot standby)
   - Deterministic replay from event log
   - Market data feed: Multicast UDP for speed
   - Regulatory: Full audit trail, MiFID II compliance`,
      },
      {
        id: "gs-2",
        question:
          "Implement an efficient algorithm for finding the median of a data stream.",
        category: "Coding",
        difficulty: "hard",
        answer: `### Median of Data Stream

**Two-Heap Approach: O(log n) insert, O(1) median**

\`\`\`javascript
class MedianFinder {
  constructor() {
    this.maxHeap = []; // Lower half (negated for max-heap behavior)
    this.minHeap = []; // Upper half
  }

  addNum(num) {
    // Add to appropriate heap
    if (this.maxHeap.length === 0 || num <= -this.maxHeap[0]) {
      this.heapPush(this.maxHeap, -num);
    } else {
      this.heapPush(this.minHeap, num);
    }

    // Balance: maxHeap can have at most 1 more element
    if (this.maxHeap.length > this.minHeap.length + 1) {
      this.heapPush(this.minHeap, -this.heapPop(this.maxHeap));
    } else if (this.minHeap.length > this.maxHeap.length) {
      this.heapPush(this.maxHeap, -this.heapPop(this.minHeap));
    }
  }

  findMedian() {
    if (this.maxHeap.length > this.minHeap.length) {
      return -this.maxHeap[0];
    }
    return (-this.maxHeap[0] + this.minHeap[0]) / 2;
  }

  // Min-heap operations
  heapPush(heap, val) {
    heap.push(val);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent] <= heap[i]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }

  heapPop(heap) {
    const val = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let min = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < heap.length && heap[l] < heap[min]) min = l;
        if (r < heap.length && heap[r] < heap[min]) min = r;
        if (min === i) break;
        [heap[i], heap[min]] = [heap[min], heap[i]];
        i = min;
      }
    }
    return val;
  }
}
\`\`\`

**Key Idea:** Keep two heaps balanced. Max-heap holds smaller half, min-heap holds larger half. Median is always at the top(s).`,
      },
    ],
  },
];
