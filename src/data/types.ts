// ============================================
// codespace — Core Data Type Definitions
// ============================================

// ---------- Learning Paths ----------

export interface PathTopic {
  id: string;
  title: string;
  ref: string; // route path, e.g., '/languages/javascript/closures'
}

export interface PathSection {
  title: string;
  description?: string;
  topics: PathTopic[];
}

export interface LearningPath {
  id: string;
  title: string;
  role: string;
  icon: string;
  description: string;
  color: string;
  estimatedHours: number;
  level?: "beginner" | "intermediate" | "advanced";
  sections: PathSection[];
}

// ---------- Programming Languages ----------

export interface CodeExample {
  language: string;
  code: string;
  label?: string;
}

export interface LanguageTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // markdown
  codeExamples: CodeExample[];
  keyTakeaways: string[];
  prerequisites?: string[];
  order: number;
}

export interface Language {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  topics: LanguageTopic[];
}

// ---------- DSA ----------

export type VisualizerType =
  | "array"
  | "tree"
  | "graph"
  | "linked-list"
  | "matrix"
  | "stack-queue";

export interface VisualizationConfig {
  type: string;
  defaultInput: number[];
  /**
   * Optional tree-shaped input (LeetCode-style level-order with `null` for
   * missing children). Takes precedence over `defaultInput` for tree
   * visualizations.
   */
  defaultTreeInput?: (number | null)[];
  target?: number;
}

export interface DSATopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // markdown
  timeComplexity: string;
  spaceComplexity: string;
  difficulty: "easy" | "medium" | "hard";
  visualizerType?: VisualizerType;
  visualizationConfig?: VisualizationConfig;
  codeExamples: CodeExample[];
  relatedProblems?: string[]; // problem slugs
  tags?: string[];
  order?: number;
}

export interface DSACategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color?: string;
  topics: DSATopic[];
}

// ---------- Algorithm Visualization ----------

export type AnimationAction =
  | "compare"
  | "swap"
  | "highlight"
  | "insert"
  | "remove"
  | "visit"
  | "set"
  | "complete"
  | "pivot";

export interface AnimationStepAction {
  type: AnimationAction;
  indices: number[];
}

export interface AnimationStep {
  description: string;
  array?: number[];
  actions?: AnimationStepAction[];
  indices?: number[];
  action?: AnimationAction;
  values?: number[];
  highlightLine?: number; // line of code to highlight
  auxiliaryData?: Record<string, any>; // extra data for complex visualizations
  /** Named pointers pointing at array indices (e.g. { l: 0, r: 5, mid: 2 }) */
  pointers?: Record<string, number>;
  /** Watch-panel variables displayed alongside the animation */
  variables?: Record<string, string | number | boolean>;
  /** Short title for step dots / mini-nav */
  title?: string;
}

// ---------- Coding Problems ----------

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  description: string; // markdown
  difficulty: "easy" | "medium" | "hard";
  category: string;
  companies?: string[];
  tags: string[];
  hints: string[];
  starterCode: Record<string, string>; // language -> code
  solution: Record<string, string>; // language -> code
  testCases: TestCase[];
  solutionExplanation?: string; // markdown
  timeComplexity?: string;
  spaceComplexity?: string;
}

// ---------- Interviews ----------

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  answer: string; // markdown
  codeExamples?: CodeExample[];
  relatedProblems?: string[];
  tags?: string[];
}

export interface InterviewRound {
  id: string;
  slug: string;
  name: string; // e.g., "Phone Screen", "System Design"
  description: string; // markdown
  duration?: string; // "45 min", "1 hour", etc.
  format?: string; // "Virtual", "Onsite", "Take-home"
  topics?: string[];
  questions: InterviewQuestion[];
}

export interface CompanyRole {
  id: string;
  slug: string;
  title: string; // "Software Engineer", "Frontend Engineer"
  level?: string; // "L3 / SDE 1", "Senior", "Staff"
  description: string;
  focus: string[]; // skills/areas emphasized
  interviewLoop?: string; // overview markdown
  rounds: InterviewRound[];
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  interviewProcess: string;
  questions: InterviewQuestion[];
  roles?: CompanyRole[];
}

// ---------- Methodology ----------

export interface Methodology {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  content: string; // markdown
  diagram?: string; // mermaid DSL
  principles?: string[];
  color?: string;
  keyPrinciples?: string[];
}

// ---------- System Design ----------

export interface SysDesignNode {
  id: string;
  label: string;
  icon?: string; // emoji or lucide key (rendered as emoji if string)
  /** Normalized grid position 0-100 */
  x: number;
  y: number;
  /** Tailwind color key or custom css color */
  color?: string;
  group?: string;
  kind?: "client" | "service" | "db" | "cache" | "queue" | "cdn" | "storage" | "worker" | "lb" | "external";
}

export interface SysDesignEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  bidirectional?: boolean;
}

export interface SysDesignPacket {
  edgeId: string;
  label?: string;
  color?: string; // tailwind class like 'bg-emerald-500'
  reverse?: boolean; // travel from `to` → `from`
}

export interface SysDesignStep {
  title: string;
  description: string;
  activeNodes?: string[];
  activeEdges?: string[];
  packets?: SysDesignPacket[];
  highlightColor?: string; // override accent
  notes?: string[];
}

export interface SystemDesignAnimation {
  id: string;
  title: string;
  description?: string;
  nodes: SysDesignNode[];
  edges: SysDesignEdge[];
  steps: SysDesignStep[];
  /** Auto-advance interval in ms when playing */
  intervalMs?: number;
}

export interface SystemDesignScaleMetric {
  label: string;
  value: string;
  hint?: string;
}

export interface SystemDesignTradeoff {
  option: string;
  pros: string[];
  cons: string[];
}

export interface SystemDesign {
  id: string;
  slug: string;
  title: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  diagram?: string; // mermaid DSL
  content: string; // markdown
  keyTakeaways: string[];
  /** Optional animated walkthroughs for visual learners */
  animations?: SystemDesignAnimation[];
  /** Optional quick-scan scale metrics shown as stat cards */
  scaleMetrics?: SystemDesignScaleMetric[];
  /** Optional tradeoff comparison shown as side-by-side cards */
  tradeoffs?: SystemDesignTradeoff[];
  /** Companies that use this architecture */
  realWorld?: string[];
}

// ---------- Search ----------

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  tags?: string[];
}
