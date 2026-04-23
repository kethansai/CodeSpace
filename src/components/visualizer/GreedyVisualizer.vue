<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep } from "@/data/types";

/**
 * Greedy visualizer.
 *
 * Two rendering modes, driven by `auxiliaryData.greedy`:
 *
 *   interval mode:
 *   {
 *     mode: 'intervals',
 *     timelineStart?: number,
 *     timelineEnd?: number,
 *     intervals: {
 *       label?: string,
 *       start: number, end: number,
 *       kind: 'candidate' | 'current' | 'picked' | 'skipped' | 'conflict',
 *     }[],
 *   }
 *
 *   item mode (for jump game, gas station, task scheduler, huffman nodes, etc):
 *   {
 *     mode: 'items',
 *     items: {
 *       label: string,
 *       value?: number | string,
 *       kind: 'idle' | 'current' | 'picked' | 'skipped' | 'done',
 *     }[],
 *   }
 *
 * Shared extras:
 *  - `auxiliaryData.resultList` — rendered under the chart.
 *  - `currentStep.variables` — small key/value strip above the chart.
 */

type IntervalKind = "candidate" | "current" | "picked" | "skipped" | "conflict";
type ItemKind = "idle" | "current" | "picked" | "skipped" | "done";

interface IntervalEntry {
  label?: string;
  start: number;
  end: number;
  kind: IntervalKind;
}
interface ItemEntry {
  label: string;
  value?: number | string;
  kind: ItemKind;
}
interface GreedyData {
  mode: "intervals" | "items";
  title?: string;
  timelineStart?: number;
  timelineEnd?: number;
  intervals?: IntervalEntry[];
  items?: ItemEntry[];
}

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

const aux = computed<any>(() => props.currentStep?.auxiliaryData ?? {});
const greedy = computed<GreedyData | null>(() => aux.value.greedy ?? null);

const variables = computed<Record<string, any>>(
  () => props.currentStep?.variables ?? {},
);
const variableEntries = computed(() => Object.entries(variables.value));

const resultList = computed<string | null>(() => {
  const r = aux.value.resultList;
  if (r == null) return null;
  if (Array.isArray(r)) return r.join(" ");
  return String(r);
});

// ── Interval mode layout ──
const intervals = computed(() => greedy.value?.intervals ?? []);
const timelineBounds = computed(() => {
  const data = greedy.value;
  if (!data) return { lo: 0, hi: 1 };
  const ivs = data.intervals ?? [];
  const lo =
    data.timelineStart ??
    (ivs.length ? Math.min(...ivs.map((i) => i.start)) : 0);
  const hi =
    data.timelineEnd ?? (ivs.length ? Math.max(...ivs.map((i) => i.end)) : 1);
  return { lo, hi: hi > lo ? hi : lo + 1 };
});

function intervalLeft(start: number) {
  const { lo, hi } = timelineBounds.value;
  return `${((start - lo) / (hi - lo)) * 100}%`;
}
function intervalWidth(start: number, end: number) {
  const { lo, hi } = timelineBounds.value;
  return `${((end - start) / (hi - lo)) * 100}%`;
}

const intervalKindStyle: Record<IntervalKind, string> = {
  candidate: "bg-slate-200 text-slate-700 border-slate-300",
  current: "bg-amber-200 text-amber-900 border-amber-400 ring-2 ring-amber-400",
  picked: "bg-emerald-200 text-emerald-900 border-emerald-400",
  skipped: "bg-slate-100 text-slate-400 border-slate-200 line-through",
  conflict: "bg-rose-200 text-rose-900 border-rose-400",
};

const timelineTicks = computed(() => {
  const { lo, hi } = timelineBounds.value;
  const span = hi - lo;
  const stepRaw = span / 10;
  const step = Math.max(1, Math.round(stepRaw));
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v += step) ticks.push(v);
  return ticks;
});

// ── Item mode ──
const items = computed(() => greedy.value?.items ?? []);

const itemKindStyle: Record<ItemKind, string> = {
  idle: "bg-slate-100 text-slate-700 border-slate-300",
  current: "bg-amber-200 text-amber-900 border-amber-400 ring-2 ring-amber-400",
  picked: "bg-emerald-200 text-emerald-900 border-emerald-400",
  skipped: "bg-slate-100 text-slate-400 border-slate-200 line-through",
  done: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

const mode = computed(() => greedy.value?.mode ?? null);
</script>

<template>
  <div class="space-y-4">
    <div v-if="greedy?.title" class="text-sm font-medium text-slate-700">
      {{ greedy.title }}
    </div>

    <div
      v-if="variableEntries.length"
      class="flex flex-wrap gap-2 rounded-md border bg-slate-50 p-2 text-xs"
    >
      <span
        v-for="[k, v] in variableEntries"
        :key="k"
        class="rounded bg-white px-2 py-1 shadow-sm"
      >
        <span class="font-semibold text-slate-600">{{ k }}</span>
        <span class="ml-1 text-slate-800">{{ v }}</span>
      </span>
    </div>

    <!-- Interval mode -->
    <div v-if="mode === 'intervals'" class="space-y-2">
      <div class="relative h-6 border-b border-slate-300 text-[10px] text-slate-500">
        <span
          v-for="t in timelineTicks"
          :key="t"
          class="absolute -translate-x-1/2"
          :style="{ left: intervalLeft(t) }"
        >
          {{ t }}
        </span>
      </div>
      <div class="space-y-1.5">
        <div
          v-for="(iv, i) in intervals"
          :key="i"
          class="relative h-7"
        >
          <div
            class="absolute top-0 flex h-7 items-center justify-center rounded border px-2 text-xs font-medium transition-all"
            :class="intervalKindStyle[iv.kind]"
            :style="{ left: intervalLeft(iv.start), width: intervalWidth(iv.start, iv.end) }"
          >
            {{ iv.label ?? `[${iv.start}, ${iv.end})` }}
          </div>
        </div>
      </div>
    </div>

    <!-- Item mode -->
    <div v-else-if="mode === 'items'" class="flex flex-wrap gap-2">
      <div
        v-for="(it, i) in items"
        :key="i"
        class="flex min-w-[48px] flex-col items-center gap-0.5 rounded border px-2 py-1 text-xs font-medium transition-all"
        :class="itemKindStyle[it.kind]"
      >
        <span class="font-semibold">{{ it.label }}</span>
        <span v-if="it.value !== undefined" class="text-[10px] opacity-70">
          {{ it.value }}
        </span>
      </div>
    </div>

    <div
      v-else
      class="rounded border border-dashed p-6 text-center text-sm text-slate-500"
    >
      No greedy step data available.
    </div>

    <div
      v-if="resultList"
      class="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-900"
    >
      <span class="font-semibold">Result:</span> {{ resultList }}
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-3 text-[10px] text-slate-600">
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-amber-400 bg-amber-200" />
        current
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-emerald-400 bg-emerald-200" />
        picked
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-slate-200 bg-slate-100" />
        skipped
      </span>
      <span v-if="mode === 'intervals'" class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-rose-400 bg-rose-200" />
        conflict
      </span>
    </div>
  </div>
</template>
