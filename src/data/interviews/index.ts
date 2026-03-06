import type { Company } from "@/data/types";
import { additionalCompanies } from "./additional";

const baseCompanies: Company[] = [
  {
    id: "google",
    slug: "google",
    name: "Google",
    logo: "🔍",
    description:
      "Known for algorithmic and system design questions. Focus on scalability and optimization.",
    interviewProcess:
      "Phone screen → 4-5 on-site rounds (coding, system design, behavioral)",
    questions: [
      {
        id: "g-1",
        question: "Explain how you would design a URL shortener like bit.ly.",
        category: "System Design",
        difficulty: "medium",
        answer: `### URL Shortener Design

**Requirements:**
- Shorten long URLs to short ones (e.g., bit.ly/abc123)
- Redirect short URL → original URL
- Handle billions of URLs, high read:write ratio (~100:1)

**Key Components:**

1. **Hashing/ID Generation:**
   - Use base62 encoding (a-z, A-Z, 0-9) of auto-increment ID
   - 6 characters = 62⁶ = ~56 billion unique URLs
   - Or use MD5/SHA256 hash and take first 6 chars (with collision handling)

2. **Database:**
   - Key-value store (Redis for cache, SQL/NoSQL for persistence)
   - Schema: \`{shortCode, originalUrl, createdAt, userId, clicks}\`

3. **Architecture:**
   - Load balancer → API servers → Cache (Redis) → Database
   - Read path: Check cache first → DB fallback → 301/302 redirect
   - Write path: Generate short code → Store in DB → Return short URL

4. **Scaling:**
   - Cache popular URLs (80/20 rule)
   - Database sharding by hash of short code
   - Multiple regions with CDN for redirects`,
      },
      {
        id: "g-2",
        question:
          "Given an array of integers, find all pairs that sum to a specific target. What is the optimal approach?",
        category: "Coding",
        difficulty: "easy",
        answer: `### Finding Pairs with Target Sum

**Optimal Approach: Hash Set — O(n) time, O(n) space**

\`\`\`javascript
function findPairs(nums, target) {
  const seen = new Set();
  const pairs = [];

  for (const num of nums) {
    const complement = target - num;
    if (seen.has(complement)) {
      pairs.push([complement, num]);
    }
    seen.add(num);
  }

  return pairs;
}
\`\`\`

**Why this is optimal:**
- One pass through the array → O(n)
- Set lookups are O(1) average
- Alternative: Sort + two pointers → O(n log n)`,
      },
      {
        id: "g-3",
        question:
          "What happens when you type google.com in the browser and press Enter?",
        category: "System Design",
        difficulty: "medium",
        answer: `### What Happens When You Type a URL

1. **DNS Resolution:**
   - Browser cache → OS cache → Router → ISP DNS → Root DNS → TLD DNS → Authoritative DNS
   - Returns IP address (e.g., 142.250.80.46)

2. **TCP Connection:**
   - 3-way handshake (SYN → SYN-ACK → ACK)
   - TLS handshake for HTTPS (certificate verification, key exchange)

3. **HTTP Request:**
   - Browser sends GET request with headers (User-Agent, Accept, Cookie, etc.)

4. **Server Processing:**
   - Load balancer routes to appropriate server
   - Server processes request, may query databases, caches
   - Returns HTML response with status code (200 OK)

5. **Browser Rendering:**
   - Parse HTML → Build DOM tree
   - Parse CSS → Build CSSOM tree
   - Combine → Render tree
   - Layout (calculate positions)
   - Paint (pixels on screen)
   - Load additional resources (JS, images, fonts)`,
      },
      {
        id: "g-4",
        question:
          "Describe the difference between processes and threads. When would you use each?",
        category: "CS Fundamentals",
        difficulty: "medium",
        answer: `### Processes vs Threads

| Aspect | Process | Thread |
|--------|---------|--------|
| Memory | Separate address space | Shared memory within process |
| Creation | Expensive (fork, copy) | Lightweight |
| Communication | IPC (pipes, sockets, shared memory) | Direct shared memory access |
| Isolation | Crash doesn't affect others | Crash can affect all threads |
| Context switch | Slower | Faster |

**Use Processes When:**
- Need isolation (security, fault tolerance)
- Running different programs
- Multi-core without shared state complexities

**Use Threads When:**
- Need shared memory / fast communication
- Lightweight parallelism within same application
- I/O-bound operations (web server handling requests)`,
      },
    ],
  },
  {
    id: "amazon",
    slug: "amazon",
    name: "Amazon",
    logo: "📦",
    description:
      "Focuses on Leadership Principles, system design, and coding. Behavioral questions are crucial.",
    interviewProcess:
      "Online Assessment → Phone Screen → 4-5 Loop interviews (LP + Technical)",
    questions: [
      {
        id: "a-1",
        question:
          "Tell me about a time you had to make a decision with incomplete information. (Customer Obsession)",
        category: "Behavioral (Leadership Principles)",
        difficulty: "medium",
        answer: `### STAR Method Response

**Situation:** Context — what was happening
**Task:** Your responsibility
**Action:** What YOU specifically did (use "I", not "we")
**Result:** Quantifiable outcome

**Example Framework:**
"In my role as [X], we faced [situation] where we had to [task]. Despite incomplete data, I decided to [action] because [reasoning based on customer impact]. The result was [measurable outcome]."

**Key Tips for Amazon LP Questions:**
- Always use STAR format
- Focus on YOUR actions, not the team's
- Quantify results when possible
- Tie back to the specific Leadership Principle
- Have 2-3 stories per LP, adaptable to different questions
- Show customer-centric thinking`,
      },
      {
        id: "a-2",
        question:
          "Design an e-commerce system like Amazon. Focus on the shopping cart and checkout flow.",
        category: "System Design",
        difficulty: "hard",
        answer: `### E-Commerce System Design

**Core Services (Microservices Architecture):**

1. **Product Service:** Catalog, search, recommendations
2. **Cart Service:** Add/remove items, persist cart
3. **Order Service:** Checkout, order management
4. **Payment Service:** Process payments, refunds
5. **Inventory Service:** Stock management, reservations

**Shopping Cart Design:**
- Store in Redis (session-based) + DynamoDB (persistent)
- Merge anonymous → authenticated cart on login
- Handle concurrent modifications (optimistic locking)

**Checkout Flow:**
1. Cart → Validate inventory (reserve items)
2. Calculate total (prices, tax, shipping)
3. Payment processing (Stripe/internal)
4. If payment succeeds → Create order, deduct inventory
5. If payment fails → Release inventory reservation
6. Send confirmation (email, push notification)

**Key Considerations:**
- Idempotency keys for payment retries
- Distributed transactions (Saga pattern)
- Rate limiting for flash sales
- CDN for product images`,
      },
      {
        id: "a-3",
        question: "Implement an LRU Cache with O(1) get and put operations.",
        category: "Coding",
        difficulty: "medium",
        answer: `### LRU Cache Implementation

Use **HashMap + Doubly Linked List** for O(1) operations.

\`\`\`javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    // Move to most recent (Map maintains insertion order)
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    this.map.set(key, value);

    if (this.map.size > this.capacity) {
      // Delete oldest (first inserted)
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}
\`\`\`

JavaScript's Map maintains insertion order, making this elegant. In other languages, use a doubly-linked list explicitly.`,
      },
    ],
  },
  {
    id: "microsoft",
    slug: "microsoft",
    name: "Microsoft",
    logo: "🪟",
    description:
      "Balanced interviews covering coding, system design, and behavioral questions. Values growth mindset.",
    interviewProcess:
      'Phone screen → 4-5 on-site rounds including "As Appropriate" (hiring manager)',
    questions: [
      {
        id: "ms-1",
        question: "Explain the SOLID principles with examples.",
        category: "CS Fundamentals",
        difficulty: "medium",
        answer: `### SOLID Principles

**S — Single Responsibility Principle:**
A class should have only one reason to change.
\`\`\`
❌ UserService (handles auth + email + profile)
✅ AuthService, EmailService, ProfileService
\`\`\`

**O — Open/Closed Principle:**
Open for extension, closed for modification.
\`\`\`
Use interfaces/abstract classes → Add new behavior by creating new classes
\`\`\`

**L — Liskov Substitution Principle:**
Subtypes must be substitutable for their base types.
\`\`\`
If function works with Animal, it must work with Dog and Cat
\`\`\`

**I — Interface Segregation Principle:**
Don't force implementations of unused methods.
\`\`\`
❌ IWorker { work(), eat(), sleep() }
✅ IWorkable { work() }, IFeedable { eat() }
\`\`\`

**D — Dependency Inversion Principle:**
Depend on abstractions, not concretions.
\`\`\`
class OrderService {
  constructor(private repo: IOrderRepository) {} // Interface!
}
\`\`\``,
      },
      {
        id: "ms-2",
        question:
          "Design a real-time collaborative document editor like Google Docs.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Collaborative Editor Design

**Key Challenges:**
- Real-time sync between multiple users
- Conflict resolution for concurrent edits
- Low latency

**Conflict Resolution — OT vs CRDT:**

1. **Operational Transformation (OT):**
   - Transform operations based on concurrent operations
   - Used by Google Docs
   - Requires server to order operations

2. **CRDT (Conflict-free Replicated Data Type):**
   - Data structure that automatically merges
   - No central server needed
   - Used by Figma

**Architecture:**
- WebSocket connections for real-time sync
- Document stored as operation log (event sourcing)
- Periodic snapshots for performance
- Redis Pub/Sub for multi-server broadcasting
- S3/Blob storage for persistent documents`,
      },
    ],
  },
  {
    id: "meta",
    slug: "meta",
    name: "Meta (Facebook)",
    logo: "👤",
    description:
      "Heavy focus on coding speed and efficiency. System design at scale (billions of users).",
    interviewProcess:
      "Phone screen (coding) → On-site: 2 coding + 1 system design + 1 behavioral",
    questions: [
      {
        id: "f-1",
        question: "Design the Facebook News Feed system.",
        category: "System Design",
        difficulty: "hard",
        answer: `### News Feed Design

**Two Approaches:**

1. **Pull (Fan-out on Read):**
   - When user opens feed, query all friends' posts in real-time
   - Pros: Simple write, no wasted computation
   - Cons: Slow reads, especially for users with many friends

2. **Push (Fan-out on Write):**
   - When user posts, push to all friends' feed caches
   - Pros: Fast reads (pre-computed)
   - Cons: Celebrity problem (millions of followers)

3. **Hybrid (Facebook's approach):**
   - Push for regular users
   - Pull for celebrities (lazy loading)

**Feed Ranking:**
- ML model scores each post: \`Score = f(affinity, type, recency, engagement)\`
- Affinity: How close are the users?
- Type: Photo > video > text (varies by user)
- Recency: Time decay function
- Engagement: Likes, comments, shares

**Infrastructure:**
- Feed cache (Redis/Memcached)
- Social graph service (who are friends)
- Post storage (MySQL + CDN for media)
- Ranking service (ML models)`,
      },
      {
        id: "f-2",
        question: "Given a string, find the longest palindromic substring.",
        category: "Coding",
        difficulty: "medium",
        answer: `### Longest Palindromic Substring

**Approach: Expand Around Center — O(n²)**

\`\`\`javascript
function longestPalindrome(s) {
  let start = 0, maxLen = 1;

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left + 1 > maxLen) {
        start = left;
        maxLen = right - left + 1;
      }
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // Odd length
    expand(i, i + 1); // Even length
  }

  return s.substring(start, start + maxLen);
}
\`\`\`

Each character (and each gap) is a potential center. Expand outward while characters match.`,
      },
    ],
  },
  {
    id: "apple",
    slug: "apple",
    name: "Apple",
    logo: "🍎",
    description:
      "Focus on attention to detail, user experience thinking, and deep technical knowledge.",
    interviewProcess:
      "Phone screen → On-site: 5-6 rounds with team members and managers",
    questions: [
      {
        id: "ap-1",
        question:
          "What makes a great user experience? Give a technical example.",
        category: "Behavioral",
        difficulty: "medium",
        answer: `### Great UX — Technical Perspective

**Key Principles:**
1. **Performance is UX**: Sub-100ms response, 60fps animations
2. **Consistency**: Same patterns across the entire application
3. **Offline-first**: App works without internet (progressive enhancement)
4. **Accessibility**: Screen readers, keyboard navigation, color contrast

**Technical Example — Optimistic UI:**
When a user likes a post, update the UI immediately (optimistic) and sync with server in background.

\`\`\`javascript
async function handleLike(postId) {
  // 1. Update UI immediately
  setLiked(true);
  setLikeCount(prev => prev + 1);

  try {
    // 2. Sync with server
    await api.likePost(postId);
  } catch (error) {
    // 3. Revert on failure
    setLiked(false);
    setLikeCount(prev => prev - 1);
    showToast("Failed to like post");
  }
}
\`\`\`

This pattern creates a feeling of instant response. Apple apps extensively use this approach.`,
      },
    ],
  },
  {
    id: "netflix",
    slug: "netflix",
    name: "Netflix",
    logo: "🎬",
    description:
      "Values culture fit, innovation, and deep systems expertise. Focus on distributed systems.",
    interviewProcess: "Recruiter call → Phone screen → On-site: 4-6 rounds",
    questions: [
      {
        id: "n-1",
        question: "Design a video streaming service like Netflix.",
        category: "System Design",
        difficulty: "hard",
        answer: `### Video Streaming Service Design

**Key Components:**

1. **Content Ingestion Pipeline:**
   - Upload raw video → Transcode to multiple resolutions (4K, 1080p, 720p, 480p)
   - Multiple codecs: H.264, H.265, VP9, AV1
   - Store on distributed storage (S3)

2. **CDN (Content Delivery Network):**
   - Edge servers worldwide
   - Cache popular content closer to users
   - Netflix has its own CDN: Open Connect
   - ISP partnerships for embedded servers

3. **Adaptive Bitrate Streaming:**
   - Video split into 2-4 second chunks at each quality level
   - Client measures bandwidth and switches quality dynamically
   - Protocols: HLS (Apple), DASH

4. **Recommendation Engine:**
   - Collaborative filtering (users who watched X also watched Y)
   - Content-based filtering (genre, actors, director)
   - A/B testing for thumbnails and rankings

5. **Architecture:**
   - Microservices on AWS
   - Zuul (API gateway), Eureka (service discovery)
   - Chaos Engineering (Chaos Monkey)
   - Circuit breaker pattern (Hystrix)`,
      },
    ],
  },
];

export const companies: Company[] = [...baseCompanies, ...additionalCompanies];

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}
