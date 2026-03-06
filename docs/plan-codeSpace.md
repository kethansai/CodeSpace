# CodeSpace — Educational Platform for Developers

## Plan Overview

Build "CodeSpace" as a **Vue 3 + Vite SPA** using **Tailwind CSS v4 + shadcn-vue** for UI, **Piston API** for code execution, **GSAP + D3.js** for algorithm animations, **Monaco Editor** for the coding playground, and **Pinia** for state management. Content (DSA topics, problems, interview questions, learning paths) is stored as structured TypeScript data files with Markdown strings rendered at runtime via `marked` + `shiki`. Deployed to **Cloudflare Pages** with optional Cloudflare Functions as an API proxy. No auth required — progress tracking uses `localStorage` via Pinia persisted stores.

---

## Phase 1 — Project Scaffolding & Core Setup

### 1. Initialize Vue 3 + Vite + TypeScript project

- Run `npm create vite@latest codespace -- --template vue-ts`
- Install core dependencies: `vue-router`, `pinia`, `@unhead/vue`, `@vueuse/core`
- Install dev tooling: `unplugin-auto-import`, `unplugin-vue-components`, `vite-plugin-vue-devtools`
- Configure `vite.config.ts` with auto-imports for Vue/VueRouter/Pinia composables and auto-component resolution

### 2. Setup Tailwind CSS v4 + shadcn-vue

- Install `tailwindcss @tailwindcss/vite` (Tailwind v4 uses the Vite plugin directly)
- Run `npx shadcn-vue@latest init` — select Vite framework, configure path aliases, choose default theme
- This installs: `radix-vue`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-vue-next`
- Add base shadcn-vue components: Button, Card, Badge, Tabs, Sheet, Dialog, Command, Accordion, ScrollArea, Tooltip, DropdownMenu, Separator, Input, Select
- Configure CSS variables for CodeSpace brand colors (in `src/assets/css/main.css`)

### 3. Setup dark/light theme system

- Use `@vueuse/core`'s `useColorMode` composable
- Configure Tailwind's `darkMode: 'class'`
- Create `src/composables/useTheme.ts`

### 4. Setup environment files

- `.env` → `VITE_PISTON_API_URL=https://emkc.org/api/v2/piston/execute`
- `.env.example` → documented template
- `src/config/app.ts` → app-level constants (site name, description, socials, etc.)

### 5. Create the CodeSpace logo

- SVG logo: Stylized `</>` code brackets integrated with a rocket/space motif
- Design a monogram icon (CS) for favicon and small displays
- Place in `public/logo.svg`, `public/favicon.svg`

---

## Phase 2 — Routing & Layouts

### 6. Configure Vue Router with lazy-loaded routes

- `src/router/index.ts` — main router setup with scroll behavior
- Route structure:
  ```
  /                           → Home/Dashboard
  /paths                      → All learning paths
  /paths/:role                → Specific path (intern, senior-dev, etc.)
  /languages                  → All languages overview
  /languages/:lang            → Language landing
  /languages/:lang/:topic     → Specific concept
  /dsa                        → DSA overview
  /dsa/:category              → Category (sorting, trees, etc.)
  /dsa/:category/:topic       → Specific topic with visualization
  /problems                   → Problem list
  /problems/:slug             → Problem with editor
  /interviews                 → Company list
  /interviews/:company        → Company question list
  /methodology                → Agile/Scrum/Kanban overview
  /methodology/:topic         → Specific methodology
  /playground                 → Free-form code playground
  ```
- All page components use `defineAsyncComponent` / dynamic `import()` for code-splitting

### 7. Create layout system

- `src/layouts/DefaultLayout.vue` — header + main content + footer
- `src/layouts/DocsLayout.vue` — sidebar + content + table of contents (for reading)
- `src/layouts/ProblemLayout.vue` — split pane: problem description | code editor
- Use a `<RouterView>` with layout meta field pattern

---

## Phase 3 — Shared Components & Composables

### 8. Build layout components (`src/components/layout/`)

- `AppHeader.vue` — logo, navigation links, search trigger (Command+K), theme toggle, mobile hamburger
- `AppFooter.vue` — links, copyright, social
- `AppSidebar.vue` — collapsible sidebar with topic tree for docs layout
- `MobileNav.vue` — slide-out sheet navigation using shadcn Sheet
- `BreadCrumb.vue` — dynamic breadcrumbs from route meta

### 9. Build content display components (`src/components/content/`)

- `MarkdownRenderer.vue` — renders Markdown string to HTML using `marked` + `shiki` for syntax highlighting
- `TopicCard.vue` — card displaying a topic with icon, title, difficulty, progress
- `DifficultyBadge.vue` — color-coded Easy/Medium/Hard badge
- `CompanyTag.vue` — company logo + name chip
- `LanguageTabs.vue` — tabbed code examples switching between JS/Python/C++/Java/C#
- `TableOfContents.vue` — auto-generated from headings
- `SearchDialog.vue` — Command palette (shadcn Command) for global search across all content
- `ProgressBar.vue` — topic/section completion indicator

### 10. Build editor components (`src/components/editor/`)

- `CodeEditor.vue` — Monaco Editor wrapper (lazy-loaded), supports multiple languages, themes
- `CodeRunner.vue` — execute button + output/error panel, integrates with Piston API
- `CodeSnippet.vue` — read-only syntax highlighted code block with copy button (uses `shiki`)
- `LanguageSelector.vue` — dropdown to pick execution language
- `TestCasePanel.vue` — displays input/expected output/actual output for problems

### 11. Build visualization components (`src/components/visualizer/`)

- `ArrayVisualizer.vue` — animated bar chart for sorting algorithms (GSAP timeline)
- `TreeVisualizer.vue` — SVG tree rendering with D3 hierarchy layout + GSAP animations
- `GraphVisualizer.vue` — D3 force-directed graph with node/edge animations
- `LinkedListVisualizer.vue` — horizontal node chain with pointer arrows
- `StepController.vue` — play / pause / step forward / step back / speed slider / reset controls
- `CodeTracer.vue` — highlights current line of algorithm code in sync with visualization
- `ComplexityChart.vue` — O(n) comparison chart (D3)

### 12. Build diagram components (`src/components/diagram/`)

- `MermaidDiagram.vue` — renders Mermaid.js diagrams from text DSL (flowcharts, sequence diagrams)
- `ConceptMap.vue` — interactive concept relationship diagram
- `FlowChart.vue` — process flow for methodologies

### 13. Create composables (`src/composables/`)

- `useCodeExecution.ts` — Piston API integration (POST to execute, handle responses, loading/error states)
- `useAlgorithmPlayer.ts` — GSAP timeline controller: generates steps from algorithm, provides play/pause/step/seek
- `useProgress.ts` — read/write topic completion to localStorage
- `useSearch.ts` — MiniSearch-based full-text search across all content data
- `useBreakpoints.ts` — responsive breakpoint detection (re-export from @vueuse)
- `useTableOfContents.ts` — extract headings from rendered Markdown for TOC
- `useClipboard.ts` — copy code to clipboard

---

## Phase 4 — Content Data Layer

### 14. Design the content data structure (`src/data/types.ts`)

- TypeScript interfaces for all content types:
  - `LearningPath`, `PathSection`, `PathTopic`
  - `Language`, `LanguageTopic`
  - `DSACategory`, `DSATopic` (with complexity, visualizer type, multi-language code)
  - `Problem` (with test cases, hints, solutions, companies)
  - `Company`, `InterviewQuestion`
  - `Methodology`

### 15. Populate learning paths (`src/data/paths/`)

- `intern.ts`, `junior-developer.ts`, `senior-developer.ts`, `frontend-developer.ts`, `backend-developer.ts`, `fullstack-developer.ts`, `devops-engineer.ts`, `architect.ts`, `product-owner.ts`, `qa-engineer.ts`
- Each file exports a `LearningPath` object with ordered sections → topics with cross-references to language concepts and DSA topics

### 16. Populate programming language content (`src/data/languages/`)

- `javascript/index.ts` (variables, functions, closures, promises, async-await, event loop, prototypes, ES6+ features, DOM API, error handling)
- `python/index.ts` (basics, data structures, OOP, decorators, generators, comprehensions, file I/O, virtual environments)
- `dotnet/index.ts` (C# basics, LINQ, async/await, dependency injection, Entity Framework, ASP.NET basics)
- `java/index.ts`, `cpp/index.ts`, `typescript/index.ts`, `go/index.ts`
- Each topic has: title, description, markdown content, code examples in the target language, key takeaways, prerequisites

### 17. Populate DSA content (`src/data/dsa/`)

- Categories: arrays, strings, linked-lists, stacks-queues, trees, graphs, sorting, searching, dynamic-programming, greedy, backtracking, bit-manipulation, hashing
- Each topic (e.g., `merge-sort.ts`) contains:
  - Explanation (Markdown with embedded concept diagrams)
  - Time/space complexity
  - Step-by-step algorithm description (used by visualizer)
  - Code implementations in JS, Python, C++, Java, C#
  - Related problems
  - Visualization config (type: array/tree/graph, steps generator function)

### 18. Populate coding problems (`src/data/problems/`)

- Organized by difficulty and topic tags
- Each problem: title, description (Markdown), difficulty, companies, tags, hints, starter code per language, test cases, solution code per language, solution explanation (Markdown with diagrams)
- Start with 50+ curated problems covering key DSA patterns

### 19. Populate interview questions (`src/data/interviews/`)

- Companies: Google, Amazon, Microsoft, Meta, Apple, Netflix, Uber, Adobe, Salesforce, and a "Startups" category
- Each company has questions grouped by topic (arrays, trees, system design, behavioral)
- Each question: title, difficulty, topic, detailed answer (Markdown), related problems, code examples

### 20. Populate methodology content (`src/data/methodology/`)

- Agile (manifesto, principles, ceremonies, roles), Scrum (sprints, artifacts, events), Kanban (board, WIP limits, flow), SAFe overview, DevOps culture
- Each with Mermaid diagrams for process flows

---

## Phase 5 — Page Implementation

### 21. Home page (`src/pages/HomePage.vue`)

- Hero section with animated logo, tagline ("Learn. Code. Crack Interviews."), and search CTA
- Quick-access cards: Learning Paths, DSA & Algorithms, Coding Problems, Interview Prep
- Featured/trending topics section
- Stats ribbon (topics count, problems count, companies count, languages count)
- "Start your journey" CTA leading to path selection

### 22. Learning Paths pages

- `PathsOverview.vue` — grid of role cards with icons, descriptions, estimated hours
- `PathDetail.vue` — sequential curriculum view with sections, topics linked to actual content, progress checkboxes (localStorage)

### 23. Programming Languages pages

- `LanguagesOverview.vue` — card grid of supported languages
- `LanguageLanding.vue` — overview + topic list for a specific language
- `LanguageTopic.vue` — full concept explanation with code examples, Markdown content, diagrams

### 24. DSA pages

- `DSAOverview.vue` — categorized card grid (Sorting, Trees, Graphs, DP, etc.) with topic counts
- `DSACategoryPage.vue` — list of topics in a category with difficulty and complexity info
- `DSATopicPage.vue` — **the centerpiece page**: explanation + interactive animated visualization + multi-language code + step-by-step walkthrough + related problems

### 25. Problems pages

- `ProblemsListPage.vue` — filterable table/list of all problems (filter by difficulty, company, topic, language). Uses shadcn Table + filters
- `ProblemDetailPage.vue` — split-pane layout: left = problem description + hints + test cases | right = Monaco Editor + language selector + run button + output panel + solution reveal

### 26. Interview pages

- `InterviewsOverview.vue` — company card grid with logos
- `CompanyQuestionsPage.vue` — filterable list of questions for a company, grouped by topic
- Each question expands or links to a detailed answer page

### 27. Methodology pages

- `MethodologyOverview.vue` — cards for Agile, Scrum, Kanban, DevOps
- `MethodologyDetail.vue` — detailed explanation with Mermaid process diagrams and role descriptions

### 28. Playground page (`PlaygroundPage.vue`)

- Full-screen Monaco Editor with language selector, execute button, input panel, output panel
- Save snippets to localStorage
- Share via URL-encoded state (optional)

---

## Phase 6 — Algorithm Visualization Engine

### 29. Build the visualization engine (`src/utils/algorithms/`)

- `sorting.ts` — Step generators for bubble sort, selection sort, insertion sort, merge sort, quick sort, heap sort, radix sort
- `searching.ts` — Binary search, linear search step generators
- `trees.ts` — BST insert/delete/search, AVL rotation, tree traversals (in/pre/post-order, level-order)
- `graphs.ts` — BFS, DFS, Dijkstra, topological sort step generators
- `dp.ts` — Table-filling animations for fibonacci, knapsack, LCS
- Each step generator returns an array of `AnimationStep` objects: `{ elementIndices, action: 'compare'|'swap'|'highlight'|'insert'|'remove', values, description }`
- `StepController` feeds these to `ArrayVisualizer`/`TreeVisualizer`/`GraphVisualizer` via GSAP timelines

---

## Phase 7 — Polish & Responsiveness

### 30. Mobile-first responsive design

- All pages responsive from 320px to 2560px+
- Problem split-pane stacks vertically on mobile (description above, editor below)
- Sidebar collapses to hamburger on tablet/mobile
- Touch-friendly step controller for visualizations
- Monaco Editor adjusts to available height

### 31. Animations & micro-interactions

- Page transitions with Vue `<Transition>` + `@vueuse/motion`
- Card hover effects, button feedback
- Smooth scroll for table of contents
- Loading skeletons for lazy-loaded components
- Animated counters on the home page stats

### 32. Accessibility

- Radix Vue (via shadcn-vue) provides ARIA-compliant primitives
- Keyboard navigation for sidebar, problem list, visualizer controls
- Color contrast compliance for both themes
- Reduced motion support (`prefers-reduced-motion` media query)

### 33. SEO & Meta

- Install `@unhead/vue` for dynamic `<title>`, `<meta>`, Open Graph tags per page
- Generate a `sitemap.xml` at build time (script or Vite plugin)
- Consider `vite-ssg` for static pre-rendering key content pages (optional enhancement)

---

## Phase 8 — Deployment

### 34. Cloudflare Pages setup

- Build command: `npm run build`
- Output directory: `dist`
- Add `public/_redirects` file: `/* /index.html 200` for SPA fallback
- Optional: Add `functions/api/execute.ts` as Cloudflare Function to proxy Piston API if CORS issues arise
- Environment variables configured in Cloudflare dashboard

---

## Verification

- Run `npm run dev` and verify all routes render, navigation works, theme toggle functions
- Test code execution: write JS/Python/C++ code in the playground, verify Piston API returns correct output
- Test DSA visualizations: open a sorting algorithm topic, play the animation, verify step-by-step is accurate
- Test responsive: resize browser from 320px to 1920px+, verify all pages adapt properly
- Test on mobile device (or Chrome DevTools mobile emulation)
- Run `npm run build` and verify no build errors
- Deploy to Cloudflare Pages and verify SPA routing works (direct URL access to `/dsa/sorting/merge-sort` should work)
- Lighthouse audit: target 90+ on Performance, Accessibility, Best Practices

---

## Key Decisions

- **Vue 3 SPA over Nuxt 3**: User preference — simpler setup, no SSR complexity. Trade-off: SEO is weaker, no `@nuxt/content`. Mitigated by `@unhead/vue` meta tags and optional `vite-ssg` prerendering later.
- **TypeScript data files over Markdown files**: Without `@nuxt/content`, structured TS data files give type safety, easy imports, and IDE autocomplete. Markdown strings within TS objects rendered via `marked` + `shiki` at runtime.
- **Piston API over Judge0**: Free hosted, no API key, generous limits, 70+ languages. No CORS issues from browser. Fallback: Cloudflare Function proxy.
- **GSAP over anime.js/Motion One**: GSAP's timeline API with seek/reverse/pause is essential for step-by-step algorithm visualization. Superior for complex sequenced animations.
- **Pinia over plain composables**: For a large app with progress tracking, search state, and theme state, Pinia's devtools integration, persistence plugin (`pinia-plugin-persistedstate`), and organized store pattern is worth the minimal overhead.
- **Monaco Editor lazy-loaded only on problem/playground pages**: At ~2.5MB, it must not affect initial bundle size. All other code display uses `shiki` (static highlighting).

---

## Key Package List

| Package | Purpose |
|---|---|
| `vue` `^3.5`, `vue-router` `^4.4`, `pinia` `^2.2` | Core framework |
| `typescript` `^5.5` | Type safety |
| `vite` `^6` | Build tool |
| `tailwindcss` `^4`, `@tailwindcss/vite` | Styling |
| `radix-vue`, `class-variance-authority`, `clsx`, `tailwind-merge` | shadcn-vue deps |
| `lucide-vue-next` | Icons |
| `monaco-editor`, `@monaco-editor/loader` | Code editor |
| `shiki` | Syntax highlighting |
| `marked` | Markdown → HTML |
| `gsap` | Algorithm animations |
| `d3-hierarchy`, `d3-force`, `d3-selection`, `d3-scale` | Tree/graph visualization |
| `mermaid` | Flowchart diagrams |
| `@vueuse/core` | Vue utility composables |
| `@vueuse/motion` | UI animations |
| `@unhead/vue` | SEO meta tags |
| `minisearch` | Client-side full-text search |
| `pinia-plugin-persistedstate` | localStorage persistence |
| `unplugin-auto-import`, `unplugin-vue-components` | DX auto-imports |

---

## Folder Structure

```
src/
├── assets/css/main.css
├── components/
│   ├── ui/              → shadcn-vue base (Button, Card, Tabs, etc.)
│   ├── layout/          → AppHeader, AppFooter, AppSidebar, MobileNav, BreadCrumb
│   ├── content/         → MarkdownRenderer, TopicCard, DifficultyBadge, LanguageTabs, SearchDialog
│   ├── editor/          → CodeEditor, CodeRunner, CodeSnippet, LanguageSelector, TestCasePanel
│   ├── visualizer/      → ArrayVisualizer, TreeVisualizer, GraphVisualizer, StepController, CodeTracer
│   └── diagram/         → MermaidDiagram, ConceptMap, FlowChart
├── composables/         → useCodeExecution, useAlgorithmPlayer, useProgress, useSearch, useTheme
├── config/              → app.ts (constants), env validation
├── data/
│   ├── types.ts         → All TypeScript interfaces
│   ├── paths/           → Learning path data per role
│   ├── languages/       → Language concept content
│   ├── dsa/             → DSA topics + algorithm step generators
│   ├── problems/        → Coding problems + solutions
│   ├── interviews/      → Company-wise Q&A
│   └── methodology/     → Agile, Scrum, Kanban content
├── layouts/             → DefaultLayout, DocsLayout, ProblemLayout
├── pages/               → All page components (lazy-loaded)
├── plugins/             → Pinia, head, motion plugin registrations
├── router/              → Route definitions
├── stores/              → Pinia stores (progress, preferences)
├── utils/
│   ├── algorithms/      → Step generators for visualizations
│   └── helpers.ts       → Utility functions
├── App.vue
└── main.ts
```
