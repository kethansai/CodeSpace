import type { Methodology } from '@/data/types'

export const methodologies: Methodology[] = [
  {
    id: 'agile',
    slug: 'agile',
    title: 'Agile Methodology',
    icon: '🔄',
    description: 'An iterative approach to software delivery that emphasizes flexibility, collaboration, and customer feedback.',
    content: `## What is Agile?

**Agile** is an iterative approach to project management and software development that helps teams deliver value faster with fewer headaches.

### The Agile Manifesto (2001)

| We Value | Over |
|----------|------|
| **Individuals and interactions** | Processes and tools |
| **Working software** | Comprehensive documentation |
| **Customer collaboration** | Contract negotiation |
| **Responding to change** | Following a plan |

> "That is, while there is value in the items on the right, we value the items on the left more."

### 12 Agile Principles

1. Highest priority: satisfy the customer through early and continuous delivery
2. Welcome changing requirements, even late in development
3. Deliver working software frequently (weeks, not months)
4. Business people and developers must work together daily
5. Build projects around motivated individuals
6. Face-to-face conversation is the best form of communication
7. Working software is the primary measure of progress
8. Sustainable development pace
9. Continuous attention to technical excellence
10. Simplicity — "maximize the amount of work not done"
11. Self-organizing teams produce the best results
12. Regular reflection and adjustment

### Agile vs Waterfall

| Aspect | Agile | Waterfall |
|--------|-------|-----------|
| Approach | Iterative, incremental | Sequential, linear |
| Requirements | Evolving | Fixed upfront |
| Delivery | Continuous | End of project |
| Testing | Throughout | After development |
| Feedback | Continuous | Late |
| Risk | Early identification | Late discovery |
| Flexibility | High | Low |

### Common Agile Frameworks
- **Scrum**: Most popular, sprint-based
- **Kanban**: Flow-based, WIP limits
- **XP (Extreme Programming)**: Engineering practices
- **SAFe**: Scaled Agile for enterprises`,
    diagram: `graph TD
    A[Product Backlog] --> B[Sprint Planning]
    B --> C[Sprint Backlog]
    C --> D[Daily Standup]
    D --> E[Development]
    E --> D
    E --> F[Sprint Review]
    F --> G[Sprint Retrospective]
    G --> B
    F --> H[Potentially Shippable<br/>Product Increment]

    style A fill:#6366f1,color:#fff
    style B fill:#8b5cf6,color:#fff
    style C fill:#a78bfa,color:#fff
    style D fill:#f59e0b,color:#000
    style E fill:#10b981,color:#fff
    style F fill:#3b82f6,color:#fff
    style G fill:#ef4444,color:#fff
    style H fill:#22c55e,color:#fff`,
  },
  {
    id: 'scrum',
    slug: 'scrum',
    title: 'Scrum Framework',
    icon: '🏃',
    description: 'A Scrum framework implementation with sprints, roles, ceremonies, and artifacts.',
    content: `## Scrum Framework

**Scrum** is the most popular Agile framework. It organizes work into fixed-length iterations called **Sprints** (typically 2 weeks).

### Scrum Roles (The Scrum Team)

| Role | Responsibility |
|------|---------------|
| **Product Owner** | Defines WHAT to build. Manages product backlog, prioritizes features, represents stakeholders |
| **Scrum Master** | Ensures HOW to work. Facilitates ceremonies, removes impediments, coaches the team |
| **Development Team** | Builds the product. Self-organizing, cross-functional, 3-9 members |

### Scrum Events (Ceremonies)

#### 1. Sprint Planning (2-4 hours)
- Team selects items from product backlog
- Creates sprint backlog with tasks
- Defines Sprint Goal

#### 2. Daily Standup (15 min, same time daily)
Each member answers:
- What did I do yesterday?
- What will I do today?
- Any blockers?

#### 3. Sprint Review (1-2 hours)
- Demo completed work to stakeholders
- Gather feedback
- Update product backlog

#### 4. Sprint Retrospective (1-1.5 hours)
- What went well?
- What could be improved?
- Action items for next sprint

### Scrum Artifacts

1. **Product Backlog**: Ordered list of everything needed (owned by PO)
2. **Sprint Backlog**: Items selected for current sprint + plan
3. **Increment**: Sum of all completed backlog items (potentially releasable)

### User Stories
Format: "As a [user], I want [feature], so that [benefit]"

**Acceptance Criteria** define when a story is done.

### Story Points & Estimation
- Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21
- Relative sizing (not hours)
- Planning Poker for team consensus`,
    diagram: `graph LR
    subgraph "Sprint Cycle (2 weeks)"
        A[Sprint<br/>Planning] --> B[Sprint<br/>Execution]
        B --> C[Daily<br/>Standup]
        C --> B
        B --> D[Sprint<br/>Review]
        D --> E[Sprint<br/>Retro]
    end

    F[Product<br/>Backlog] --> A
    D --> G[Increment]
    E --> A

    style A fill:#6366f1,color:#fff
    style B fill:#10b981,color:#fff
    style C fill:#f59e0b,color:#000
    style D fill:#3b82f6,color:#fff
    style E fill:#ef4444,color:#fff
    style F fill:#8b5cf6,color:#fff
    style G fill:#22c55e,color:#fff`,
  },
  {
    id: 'kanban',
    slug: 'kanban',
    title: 'Kanban Method',
    icon: '📋',
    description: 'A visual workflow management method that emphasizes continuous delivery and limiting work in progress.',
    content: `## Kanban Method

**Kanban** (meaning "visual card" in Japanese) is a method for managing workflow by visualizing work and limiting Work In Progress (WIP).

### Core Principles

1. **Visualize the workflow** — Kanban board with columns
2. **Limit Work In Progress (WIP)** — Don't start more than you can finish
3. **Manage flow** — Optimize the flow of work items
4. **Make policies explicit** — Clear rules for each stage
5. **Implement feedback loops** — Regular reviews
6. **Improve collaboratively** — Continuous improvement

### Kanban Board

| Backlog | To Do (3) | In Progress (2) | Review (2) | Done |
|---------|-----------|-----------------|------------|------|
| Task E  | Task D    | Task B          | Task A     | ✅ Task X |
| Task F  |           | Task C          |            | ✅ Task Y |
| Task G  |           |                 |            | ✅ Task Z |

*Numbers in parentheses are WIP limits*

### WIP Limits
**Why?** Little's Law: Lead Time = WIP ÷ Throughput

Reducing WIP:
- Reduces lead time (faster delivery)
- Exposes bottlenecks
- Improves quality (less context switching)
- Increases focus

### Kanban vs Scrum

| Aspect | Kanban | Scrum |
|--------|--------|-------|
| Iterations | Continuous flow | Fixed sprints |
| Roles | No prescribed roles | PO, SM, Dev Team |
| Planning | On-demand | Sprint planning |
| Changes | Anytime | Between sprints |
| Metrics | Lead time, throughput | Velocity |
| WIP | Explicit limits | Sprint scope |
| Board | Persistent | Reset each sprint |

### Key Metrics
- **Lead Time**: Time from request to delivery
- **Cycle Time**: Time from start to finish of work
- **Throughput**: Items completed per time period
- **Cumulative Flow Diagram**: Visual representation of work stages over time`,
    diagram: `graph LR
    subgraph "Kanban Board"
        A["📋 Backlog"] --> B["📝 To Do<br/>(WIP: 3)"]
        B --> C["🔨 In Progress<br/>(WIP: 2)"]
        C --> D["🔍 Review<br/>(WIP: 2)"]
        D --> E["✅ Done"]
    end

    style A fill:#94a3b8,color:#fff
    style B fill:#6366f1,color:#fff
    style C fill:#f59e0b,color:#000
    style D fill:#3b82f6,color:#fff
    style E fill:#22c55e,color:#fff`,
  },
  {
    id: 'devops',
    slug: 'devops',
    title: 'DevOps Practices',
    icon: '⚙️',
    description: 'A set of practices combining development and operations for faster, more reliable software delivery.',
    content: `## DevOps

**DevOps** is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and provide continuous delivery.

### Core Practices

#### 1. Continuous Integration (CI)
- Developers merge code changes frequently (multiple times/day)
- Each merge triggers automated build + tests
- Catch issues early, reduce integration problems

#### 2. Continuous Delivery (CD)
- Code is always in a deployable state
- Automated deployment pipeline  
- One-click deployment to production

#### 3. Infrastructure as Code (IaC)
- Define infrastructure in code (Terraform, CloudFormation)
- Version controlled, reproducible, auditable
- Treat servers as cattle, not pets

#### 4. Monitoring & Observability
- **Metrics**: CPU, memory, request latency, error rates
- **Logs**: Centralized logging (ELK stack, Datadog)
- **Traces**: Distributed tracing (Jaeger, Zipkin)
- **Alerts**: PagerDuty, Opsgenie

#### 5. Microservices Architecture
- Small, independent services
- Each service has its own database
- Communicate via APIs/events
- Deploy independently

### CI/CD Pipeline

\`\`\`
Code → Build → Unit Tests → Integration Tests → Stage → Production
         ↓                                          ↓
     Lint/SAST                              Smoke Tests
                                            Canary Deploy
                                            Blue/Green
\`\`\`

### Deployment Strategies

| Strategy | Description | Risk |
|----------|-------------|------|
| **Rolling** | Gradually replace instances | Medium |
| **Blue/Green** | Two identical environments, switch traffic | Low |
| **Canary** | Route small % of traffic to new version | Low |
| **Feature Flags** | Toggle features without deployment | Very Low |

### Popular Tools

| Category | Tools |
|----------|-------|
| CI/CD | GitHub Actions, Jenkins, GitLab CI |
| Containers | Docker, Kubernetes, Helm |
| IaC | Terraform, Pulumi, Ansible |
| Monitoring | Prometheus, Grafana, Datadog |
| Logging | ELK Stack, Loki, Splunk |
| Cloud | AWS, Azure, GCP |`,
    diagram: `graph LR
    A[Code] --> B[Build]
    B --> C[Test]
    C --> D[Release]
    D --> E[Deploy]
    E --> F[Operate]
    F --> G[Monitor]
    G --> A

    subgraph "Dev"
        A
        B
        C
    end

    subgraph "Ops"
        D
        E
        F
        G
    end

    style A fill:#6366f1,color:#fff
    style B fill:#8b5cf6,color:#fff
    style C fill:#a78bfa,color:#fff
    style D fill:#f59e0b,color:#000
    style E fill:#10b981,color:#fff
    style F fill:#3b82f6,color:#fff
    style G fill:#ef4444,color:#fff`,
  },
]

export function getMethodologyBySlug(slug: string): Methodology | undefined {
  return methodologies.find((m) => m.slug === slug)
}
