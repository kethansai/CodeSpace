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

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  interviewProcess: string;
  questions: InterviewQuestion[];
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
