<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep } from "@/data/types";

/**
 * DP Visualizer.
 *
 * Consumes `auxiliaryData.dp`:
 * ```
 * {
 *   title?: string,
 *   rowLabels?: string[],   // left axis
 *   colLabels?: string[],   // top axis
 *   table: (number|string|null)[][],   // 2D matrix; for 1D use a single row
 *   highlights?: {
 *     r: number, c: number,
 *     kind: 'current' | 'dependency' | 'result' | 'done'
 *   }[],
 *   axisRowLabel?: string,  // e.g. "item"
 *   axisColLabel?: string,  // e.g. "capacity"
 * }
 * ```
 *
 * Extras:
 *  - `auxiliaryData.resultList` — rendered under the table.
 *  - `currentStep.variables` — small key/value strip above the table.
 */

interface Highlight {
  r: number;
  c: number;
  kind: "current" | "dependency" | "result" | "done";
}
interface DPData {
  title?: string;
  rowLabels?: string[];
  colLabels?: string[];
  table: (number | string | null)[][];
  highlights?: Highlight[];
  axisRowLabel?: string;
  axisColLabel?: string;
}

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

const aux = computed<any>(() => props.currentStep?.auxiliaryData ?? {});
const dp = computed<DPData | null>(() => aux.value.dp ?? null);

const rows = computed(() => dp.value?.table ?? []);
const rowLabels = computed(() => dp.value?.rowLabels ?? []);
const colLabels = computed(() => {
  if (dp.value?.colLabels) return dp.value.colLabels;
  const r0 = rows.value[0];
  return r0 ? r0.map((_, i) => String(i)) : [];
});

const highlightMap = computed(() => {
  const m = new Map<string, Highlight["kind"]>();
  for (const h of dp.value?.highlights ?? []) m.set(`${h.r}-${h.c}`, h.kind);
  return m;
});

function cellKind(r: number, c: number) {
  return highlightMap.value.get(`${r}-${c}`);
}

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

const kindStyle: Record<Highlight["kind"], string> = {
  current: "bg-amber-400 text-slate-900 border-amber-500 shadow-md",
  dependency: "bg-indigo-400/70 text-white border-indigo-500",
  result: "bg-green-400 text-slate-900 border-green-500 shadow-md",
  done: "bg-green-500/25 text-green-300 border-green-500/40",
};

function cellDisplay(v: number | string | null) {
  if (v == null) return "·";
  if (typeof v === "number") {
    if (!Number.isFinite(v)) return "∞";
    return String(v);
  }
  return v;
}

const is1D = computed(() => rows.value.length === 1 && !dp.value?.rowLabels);
</script>

<template>
  <div class="w-full select-none py-2">
    <div
      v-if="dp"
      class="flex flex-col gap-3 items-center"
    >
      <div
        v-if="dp.title"
        class="text-sm font-semibold text-foreground"
      >
        {{ dp.title }}
      </div>

      <!-- Variables strip -->
      <div
        v-if="variableEntries.length"
        class="flex flex-wrap gap-2 text-xs"
      >
        <div
          v-for="[k, v] in variableEntries"
          :key="k"
          class="px-2 py-1 rounded border border-border bg-muted/30"
        >
          <span class="text-muted-foreground">{{ k }}</span>
          <span class="mx-1 text-border">=</span>
          <span class="font-mono text-foreground">{{ v }}</span>
        </div>
      </div>

      <!-- Column axis label -->
      <div
        v-if="dp.axisColLabel"
        class="text-xs uppercase tracking-wider text-muted-foreground"
      >
        {{ dp.axisColLabel }} →
      </div>

      <div class="flex items-start gap-2 overflow-x-auto max-w-full pb-2">
        <!-- Row axis label -->
        <div
          v-if="dp.axisRowLabel"
          class="flex flex-col justify-center text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap"
          :style="{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }"
        >
          {{ dp.axisRowLabel }} ↓
        </div>

        <table class="border-collapse text-xs font-mono">
          <thead v-if="colLabels.length && !is1D">
            <tr>
              <th
                v-if="rowLabels.length"
                class="w-10 h-8"
              ></th>
              <th
                v-for="(cl, j) in colLabels"
                :key="`col-${j}`"
                class="px-1 py-1 font-semibold text-muted-foreground min-w-[32px]"
              >
                {{ cl }}
              </th>
            </tr>
          </thead>
          <thead v-else-if="is1D">
            <tr>
              <th
                v-for="(cl, j) in colLabels"
                :key="`c1d-${j}`"
                class="px-1 py-1 font-semibold text-muted-foreground min-w-[32px]"
              >
                {{ cl }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="`row-${i}`">
              <td
                v-if="!is1D"
                class="pr-2 text-right font-semibold text-muted-foreground"
              >
                {{ rowLabels[i] ?? i }}
              </td>
              <td
                v-for="(val, j) in row"
                :key="`cell-${i}-${j}`"
                class="border text-center align-middle transition-all duration-200"
                :class="[
                  cellKind(i, j)
                    ? kindStyle[cellKind(i, j)!]
                    : 'bg-card border-border text-foreground',
                ]"
                style="min-width: 34px; height: 32px; padding: 0 6px;"
              >
                {{ cellDisplay(val) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="resultList"
        class="mt-1 font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-1"
      >
        {{ resultList }}
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        <span class="inline-flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded bg-amber-400 border border-amber-500"></span>
          current
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded bg-indigo-400/70 border border-indigo-500"></span>
          dependency
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded bg-green-400 border border-green-500"></span>
          result
        </span>
      </div>
    </div>

    <div
      v-else
      class="text-center text-sm text-muted-foreground py-6"
    >
      No DP table for this step.
    </div>
  </div>
</template>
