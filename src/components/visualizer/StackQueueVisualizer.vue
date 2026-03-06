<script setup lang="ts">
import { computed } from "vue";
import type { AnimationStep, AnimationAction } from "@/data/types";

const props = defineProps<{
  data: number[];
  currentStep: AnimationStep | null;
  variant?: "stack" | "queue";
}>();

function getAction(idx: number): AnimationAction | null {
  if (!props.currentStep) return null;
  const s = props.currentStep;
  if (s.actions?.length) {
    for (const a of s.actions) {
      if (a.indices?.includes(idx)) return a.type;
    }
  }
  if (s.indices?.includes(idx) && s.action) return s.action;
  return null;
}

const isStack = computed(() => props.variant !== "queue");

// For stack view: reverse so top-of-stack is visually on top
const displayData = computed(() => {
  if (isStack.value) {
    return props.data.map((v, i) => ({ value: v, origIdx: i })).reverse();
  }
  return props.data.map((v, i) => ({ value: v, origIdx: i }));
});

const bgMap: Record<string, string> = {
  compare: "bg-amber-500/20 border-amber-400 shadow-amber-400/20",
  swap: "bg-red-500/20 border-red-400 shadow-red-400/20",
  highlight: "bg-indigo-500/20 border-indigo-400 shadow-indigo-400/20",
  complete: "bg-emerald-500/20 border-emerald-400 shadow-emerald-400/20",
  pivot: "bg-purple-500/20 border-purple-400 shadow-purple-400/20",
  visit: "bg-cyan-500/20 border-cyan-400 shadow-cyan-400/20",
  insert: "bg-teal-500/20 border-teal-400 shadow-teal-400/20",
  remove: "bg-rose-500/20 border-rose-400 shadow-rose-400/20",
  set: "bg-violet-500/20 border-violet-400 shadow-violet-400/20",
};

const solidBg: Record<string, string> = {
  compare: "bg-amber-500",
  swap: "bg-red-500",
  highlight: "bg-indigo-500",
  complete: "bg-emerald-500",
  pivot: "bg-purple-500",
  visit: "bg-cyan-500",
  insert: "bg-teal-500",
  remove: "bg-rose-500",
  set: "bg-violet-500",
};
</script>

<template>
  <div class="w-full flex justify-center select-none py-3">
    <!-- ─── STACK: Vertical column ─── -->
    <div v-if="isStack" class="flex flex-col items-center">
      <!-- Top pointer -->
      <div class="flex items-center gap-1.5 mb-2">
        <div
          class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary/70"
        />
        <span class="text-[10px] font-mono font-semibold text-primary/70"
          >top</span
        >
      </div>

      <!-- Container -->
      <div
        class="relative border-l-2 border-r-2 border-b-2 border-border/50 rounded-b-xl px-1.5 pb-1.5"
        style="min-width: 90px"
      >
        <TransitionGroup
          name="stack-item"
          tag="div"
          class="flex flex-col gap-0.5"
        >
          <div
            v-for="item in displayData"
            :key="item.origIdx"
            class="flex items-center justify-center rounded-lg border-2 font-bold text-sm transition-all duration-300"
            :class="[
              getAction(item.origIdx)
                ? [
                    bgMap[getAction(item.origIdx)!] ??
                      'bg-blue-500/20 border-blue-400',
                    'scale-105 shadow-lg',
                  ]
                : 'bg-card border-border/40',
            ]"
            style="width: 76px; height: 38px"
          >
            <span
              :class="
                getAction(item.origIdx)
                  ? 'text-foreground'
                  : 'text-foreground/70'
              "
            >
              {{ item.value }}
            </span>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- ─── QUEUE: Horizontal row ─── -->
    <div v-else class="flex flex-col items-center gap-2">
      <div class="flex items-center gap-1.5">
        <!-- Front label -->
        <div class="flex flex-col items-center mr-2">
          <span class="text-[10px] font-mono font-semibold text-primary/70"
            >front</span
          >
          <div
            class="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-primary/70"
          />
        </div>

        <!-- Container -->
        <div
          class="flex items-center gap-1 border-t-2 border-b-2 border-border/50 px-2 py-1.5 rounded-lg"
          style="min-height: 54px"
        >
          <TransitionGroup
            name="queue-item"
            tag="div"
            class="flex items-center gap-1"
          >
            <div
              v-for="item in displayData"
              :key="item.origIdx"
              class="flex items-center justify-center rounded-lg border-2 font-bold text-sm transition-all duration-300"
              :class="[
                getAction(item.origIdx)
                  ? [
                      bgMap[getAction(item.origIdx)!] ??
                        'bg-blue-500/20 border-blue-400',
                      'scale-110 shadow-lg',
                    ]
                  : 'bg-card border-border/40',
              ]"
              style="width: 48px; height: 48px"
            >
              <span
                :class="
                  getAction(item.origIdx)
                    ? 'text-foreground'
                    : 'text-foreground/70'
                "
              >
                {{ item.value }}
              </span>
            </div>
          </TransitionGroup>
        </div>

        <!-- Back label -->
        <div class="flex flex-col items-center ml-2">
          <span class="text-[10px] font-mono font-semibold text-primary/70"
            >back</span
          >
          <div
            class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-t-transparent border-b-transparent border-r-primary/70"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stack-item-enter-active,
.stack-item-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stack-item-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
.stack-item-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
.stack-item-move {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.queue-item-enter-active,
.queue-item-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.queue-item-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.8);
}
.queue-item-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.8);
}
.queue-item-move {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
