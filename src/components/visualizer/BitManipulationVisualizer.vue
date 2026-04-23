<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep } from "@/data/types";

interface BitRow {
  label: string;
  value: number;
  bits: (0 | 1)[];
}

interface BitData {
  title?: string;
  width: number;
  rows: BitRow[];
  highlight?: number[];
  changed?: number[];
}

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
}>();

const aux = computed<any>(() => props.currentStep?.auxiliaryData ?? {});
const bit = computed<BitData | null>(() => aux.value.bit ?? null);

const variables = computed<Record<string, string | number>>(
  () => (props.currentStep?.variables as Record<string, string | number>) ?? {},
);
const variableEntries = computed(() => Object.entries(variables.value));

function cellClass(bitIdx: number, value: 0 | 1) {
  const highlight = bit.value?.highlight ?? [];
  const changed = bit.value?.changed ?? [];
  const base =
    value === 1
      ? "bg-sky-500 text-white border-sky-600"
      : "bg-white text-slate-500 border-slate-300";
  if (changed.includes(bitIdx)) return "bg-amber-300 text-amber-900 border-amber-500";
  if (highlight.includes(bitIdx)) return "bg-emerald-200 text-emerald-900 border-emerald-500";
  return base;
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="bit?.title" class="text-sm font-medium text-slate-700">
      {{ bit.title }}
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
        <span class="ml-1 font-mono text-slate-800">{{ v }}</span>
      </span>
    </div>

    <div v-if="bit" class="space-y-3 overflow-x-auto">
      <div
        v-for="(row, ri) in bit.rows"
        :key="ri"
        class="flex items-center gap-3"
      >
        <div class="min-w-[96px] text-right font-mono text-xs text-slate-600">
          {{ row.label }}
        </div>
        <!-- MSB on the left: iterate bits from index (width-1) down to 0 -->
        <div class="flex gap-1">
          <div
            v-for="i in bit.width"
            :key="i"
            class="flex h-8 w-8 items-center justify-center border font-mono text-sm transition-colors"
            :class="cellClass(bit.width - i, row.bits[bit.width - i] ?? 0)"
          >
            {{ row.bits[bit.width - i] ?? 0 }}
          </div>
        </div>
        <div class="font-mono text-xs text-slate-500">= {{ row.value }}</div>
      </div>
    </div>

    <div v-else class="rounded border border-dashed p-6 text-center text-sm text-slate-500">
      No bit step data available.
    </div>

    <div class="flex flex-wrap gap-3 text-[10px] text-slate-600">
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-sky-600 bg-sky-500" />
        1 bit
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-slate-300 bg-white" />
        0 bit
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-amber-500 bg-amber-300" />
        changed
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded border border-emerald-500 bg-emerald-200" />
        highlighted
      </span>
    </div>
  </div>
</template>
