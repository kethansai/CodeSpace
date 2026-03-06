<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { getDSACategoryBySlug, getDSATopic } from "@/data/dsa";
import {
  generateBubbleSortSteps,
  generateQuickSortSteps,
  generateMergeSortSteps,
  generateBinarySearchSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateHeapSortSteps,
  generateCountingSortSteps,
  generateLinearSearchSteps,
  generateTwoPointersSteps,
  generateSlidingWindowSteps,
  generateDFSSteps,
  generateBFSSteps,
  generateStackSteps,
  generateLinkedListReversalSteps,
  generateHashMapSteps,
  generateFibonacciSteps,
} from "@/utils/algorithms/sorting";
import {
  generateRadixSortSteps,
  generateShellSortSteps,
  generateQueueSteps,
  generateKnapsackSteps,
  generateLCSSteps,
  generateCoinChangeSteps,
  generateLISSteps,
  generateSubsetSteps,
  generateUnionFindSteps,
  generateDijkstraSteps,
  generateTopologicalSortSteps,
  generateBitManipSteps,
} from "@/utils/algorithms/advanced";
import MarkdownRenderer from "@/components/content/MarkdownRenderer.vue";
import LanguageTabs from "@/components/content/LanguageTabs.vue";
import DifficultyBadge from "@/components/content/DifficultyBadge.vue";
import AlgorithmVisualizer from "@/components/visualizer/AlgorithmVisualizer.vue";
import StepController from "@/components/visualizer/StepController.vue";
import Badge from "@/components/ui/Badge.vue";
import Card from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import { ArrowLeft, ArrowRight, Clock, HardDrive, Play } from "lucide-vue-next";
import { useAlgorithmPlayer } from "@/composables/useAlgorithmPlayer";

const route = useRoute();

const category = computed(() =>
  getDSACategoryBySlug(route.params.category as string),
);
const topic = computed(() =>
  getDSATopic(route.params.category as string, route.params.topic as string),
);

// Comprehensive slug → step generator mapping
const visualizationSteps = computed(() => {
  if (!topic.value?.visualizationConfig) return [];

  const input = topic.value.visualizationConfig.defaultInput;
  const target = topic.value.visualizationConfig.target;
  const slug = topic.value.slug;

  // Sorting algorithms
  if (slug === "bubble-sort") return generateBubbleSortSteps(input);
  if (slug === "selection-sort") return generateSelectionSortSteps(input);
  if (slug === "insertion-sort") return generateInsertionSortSteps(input);
  if (slug === "merge-sort") return generateMergeSortSteps(input);
  if (slug === "quick-sort") return generateQuickSortSteps(input);
  if (slug === "heap-sort") return generateHeapSortSteps(input);
  if (slug === "counting-sort") return generateCountingSortSteps(input);
  if (slug === "radix-sort") return generateRadixSortSteps(input);
  if (slug === "shell-sort") return generateShellSortSteps(input);

  // Searching algorithms
  if (slug === "linear-search")
    return generateLinearSearchSteps(input, target ?? 7);
  if (slug === "binary-search")
    return generateBinarySearchSteps(input, target ?? 7);

  // Array techniques
  if (slug === "two-pointers")
    return generateTwoPointersSteps(input, target ?? 9);
  if (slug === "sliding-window") return generateSlidingWindowSteps(input, 3);
  if (slug === "prefix-sum") return generateSlidingWindowSteps(input, 2);
  if (slug === "kadanes-algorithm") return generateSlidingWindowSteps(input, 3);

  // Trees
  if (slug === "binary-tree-traversal") return generateDFSSteps(input);
  if (slug === "binary-search-tree")
    return generateBinarySearchSteps([1, 3, 5, 7, 9, 11, 13], 7);

  // Graphs
  if (slug === "bfs-dfs") return generateBFSSteps(input);
  if (slug === "dijkstra") return generateDijkstraSteps();
  if (slug === "topological-sort") return generateTopologicalSortSteps();
  if (slug === "union-find")
    return generateUnionFindSteps(6, [
      [0, 1],
      [1, 2],
      [3, 4],
      [4, 5],
      [2, 4],
    ]);
  if (slug === "minimum-spanning-tree")
    return generateUnionFindSteps(5, [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ]);

  // Stacks & Queues
  if (slug === "stack-implementation") return generateStackSteps(input);
  if (slug === "queue-implementation") return generateQueueSteps(input);
  if (slug === "monotonic-stack")
    return generateStackSteps([3, 1, 4, 1, 5, 9, 2, 6]);
  if (slug === "priority-queue")
    return generateHeapSortSteps([4, 1, 7, 3, 9, 2]);

  // Linked Lists
  if (slug === "singly-linked-list")
    return generateLinkedListReversalSteps(input);
  if (slug === "doubly-linked-list")
    return generateLinkedListReversalSteps([1, 2, 3, 4, 5]);
  if (slug === "fast-slow-pointers")
    return generateLinkedListReversalSteps([1, 2, 3, 4, 5, 6]);

  // Hashing
  if (slug === "hash-map") return generateHashMapSteps(input, target ?? 9);
  if (slug === "hash-set") return generateHashMapSteps([1, 3, 5, 7, 2, 4], 9);

  // Dynamic Programming
  if (slug === "introduction") return generateFibonacciSteps(8);
  if (slug === "knapsack")
    return generateKnapsackSteps([2, 3, 4, 5], [3, 4, 5, 6], 8);
  if (slug === "longest-common-subsequence") return generateLCSSteps();
  if (slug === "coin-change") return generateCoinChangeSteps([1, 3, 4], 6);
  if (slug === "longest-increasing-subsequence")
    return generateLISSteps([10, 9, 2, 5, 3, 7, 101, 18]);

  // Greedy
  if (slug === "activity-selection")
    return generateSlidingWindowSteps([1, 3, 2, 5, 4, 6], 2);

  // Backtracking
  if (slug === "permutations-combinations")
    return generateSubsetSteps([1, 2, 3]);

  // Bit Manipulation
  if (slug === "bit-basics") return generateBitManipSteps(29);

  // Fallback: try to pick a sensible default
  if (input.length > 0) return generateBubbleSortSteps(input);
  return [];
});

const player = useAlgorithmPlayer(visualizationSteps);

const currentStep = computed(
  () => visualizationSteps.value[player.currentStepIndex.value] ?? null,
);

// ── Visualization mode routing ──
const vizMode = computed(() => {
  const slug = topic.value?.slug || "";
  if (
    ["singly-linked-list", "doubly-linked-list", "fast-slow-pointers"].includes(
      slug,
    )
  )
    return "linked-list";
  if (["binary-tree-traversal", "binary-search-tree"].includes(slug))
    return "tree";
  if (
    [
      "bfs-dfs",
      "dijkstra",
      "topological-sort",
      "union-find",
      "minimum-spanning-tree",
    ].includes(slug)
  )
    return "graph";
  if (
    [
      "stack-implementation",
      "monotonic-stack",
      "queue-implementation",
      "priority-queue",
    ].includes(slug)
  )
    return "stack-queue";
  return "sorting";
});

const vizVariant = computed(() => {
  const slug = topic.value?.slug || "";
  if (slug === "doubly-linked-list") return "doubly";
  if (["queue-implementation", "priority-queue"].includes(slug)) return "queue";
  return undefined;
});

const currentIndex = computed(
  () =>
    category.value?.topics.findIndex((t) => t.slug === route.params.topic) ??
    -1,
);
const prevTopic = computed(() =>
  currentIndex.value > 0
    ? category.value?.topics[currentIndex.value - 1]
    : null,
);
const nextTopic = computed(() =>
  currentIndex.value >= 0 &&
  currentIndex.value < (category.value?.topics.length ?? 0) - 1
    ? category.value?.topics[currentIndex.value + 1]
    : null,
);
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
    <RouterLink
      v-if="category"
      :to="`/dsa/${category.slug}`"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      {{ category.name }}
    </RouterLink>

    <template v-if="topic && category">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold">{{ topic.title }}</h1>
          <DifficultyBadge :difficulty="topic.difficulty" />
        </div>
        <p class="text-muted-foreground text-lg">{{ topic.description }}</p>
        <div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <Clock class="w-4 h-4" />
            Time: {{ topic.timeComplexity }}
          </span>
          <span class="flex items-center gap-1.5">
            <HardDrive class="w-4 h-4" />
            Space: {{ topic.spaceComplexity }}
          </span>
        </div>
      </div>

      <!-- Visualization -->
      <Card v-if="visualizationSteps.length > 0" class="mb-8 overflow-hidden">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Play class="w-5 h-5 text-primary" />
            Interactive Visualization
          </h2>

          <AlgorithmVisualizer
            v-if="currentStep"
            :mode="vizMode"
            :variant="vizVariant"
            :data="currentStep.array || []"
            :currentStep="currentStep"
          />

          <p
            class="text-sm text-muted-foreground text-center mt-4 min-h-[1.5em]"
          >
            {{ currentStep?.description }}
          </p>

          <StepController
            :is-playing="player.isPlaying.value"
            :current-step-index="player.currentStepIndex.value"
            :total-steps="visualizationSteps.length"
            :speed="player.speed.value"
            :is-at-start="player.isAtStart.value"
            :is-at-end="player.isAtEnd.value"
            :progress="player.progress.value"
            @play="player.play"
            @pause="player.pause"
            @step-forward="player.stepForward"
            @step-backward="player.stepBackward"
            @reset="player.reset"
            @seek-to="player.seekTo"
            @set-speed="player.setSpeed"
          />
        </CardContent>
      </Card>

      <!-- Content -->
      <div class="prose-content mb-8">
        <MarkdownRenderer :content="topic.content" />
      </div>

      <!-- Code Examples -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Implementation</h2>
        <LanguageTabs :examples="topic.codeExamples" />
      </div>

      <!-- Navigation -->
      <div
        class="flex items-center justify-between border-t border-border pt-6"
      >
        <RouterLink
          v-if="prevTopic"
          :to="`/dsa/${category.slug}/${prevTopic.slug}`"
          class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <div class="text-left">
            <div class="text-xs text-muted-foreground">Previous</div>
            <div class="font-medium">{{ prevTopic.title }}</div>
          </div>
        </RouterLink>
        <div v-else></div>

        <RouterLink
          v-if="nextTopic"
          :to="`/dsa/${category.slug}/${nextTopic.slug}`"
          class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <div class="text-right">
            <div class="text-xs text-muted-foreground">Next</div>
            <div class="font-medium">{{ nextTopic.title }}</div>
          </div>
          <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold mb-2">Topic Not Found</h2>
      <p class="text-muted-foreground mb-4">This DSA topic doesn't exist.</p>
      <RouterLink to="/dsa" class="text-primary hover:underline"
        >View All DSA Topics</RouterLink
      >
    </div>
  </div>
</template>
