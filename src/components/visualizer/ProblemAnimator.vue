<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import type { AnimationStep } from "@/data/types";
import AlgorithmVisualizer from "@/components/visualizer/AlgorithmVisualizer.vue";
import Button from "@/components/ui/Button.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Minus,
  Plus,
  Sparkles,
} from "lucide-vue-next";

const props = defineProps<{
  title: string;
  description?: string;
  mode: string;
  variant?: string;
  steps: AnimationStep[];
  /** Auto-play interval in ms at 1x speed. */
  intervalMs?: number;
}>();

// ── Player state ──
const index = ref(0);
const isPlaying = ref(false);
const speed = ref(1);
let timer: ReturnType<typeof setInterval> | null = null;

const total = computed(() => props.steps.length);
const current = computed<AnimationStep | null>(
  () => props.steps[index.value] ?? null,
);
const progress = computed(() =>
  total.value ? ((index.value + 1) / total.value) * 100 : 0,
);
const atStart = computed(() => index.value <= 0);
const atEnd = computed(() => index.value >= total.value - 1);

function tickInterval() {
  const base = props.intervalMs ?? 1800;
  return Math.max(180, base / speed.value);
}
function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
function scheduleTick() {
  clearTimer();
  timer = setInterval(() => {
    if (atEnd.value) {
      pause();
      return;
    }
    index.value++;
  }, tickInterval());
}
function play() {
  if (atEnd.value) index.value = 0;
  isPlaying.value = true;
  scheduleTick();
}
function pause() {
  isPlaying.value = false;
  clearTimer();
}
function stepForward() {
  if (!atEnd.value) index.value++;
  else pause();
}
function stepBackward() {
  if (!atStart.value) index.value--;
}
function reset() {
  pause();
  index.value = 0;
}
function seekTo(i: number) {
  if (i < 0) i = 0;
  if (i > total.value - 1) i = total.value - 1;
  index.value = i;
}
function setSpeed(s: number) {
  speed.value = Math.max(0.25, Math.min(4, Number(s.toFixed(2))));
  if (isPlaying.value) scheduleTick();
}

watch(
  () => props.steps,
  () => {
    reset();
  },
);

onUnmounted(clearTimer);

// ── Pointers overlay: cluster if they share an index ──
const pointerGroups = computed(() => {
  const src = current.value?.pointers;
  if (!src) return [] as Array<{ idx: number; names: string[] }>;
  const map = new Map<number, string[]>();
  for (const [name, idx] of Object.entries(src)) {
    const n = typeof idx === "number" ? idx : Number(idx);
    if (!Number.isFinite(n)) continue;
    if (!map.has(n)) map.set(n, []);
    map.get(n)!.push(name);
  }
  return [...map.entries()].map(([idx, names]) => ({ idx, names }));
});

const variableEntries = computed(() =>
  Object.entries(current.value?.variables ?? {}),
);

const speedOptions = [0.25, 0.5, 1, 1.5, 2, 3];
</script>

<template>
  <div
    class="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden"
  >
    <!-- ── Header ── -->
    <div
      class="px-4 py-3 border-b border-border/60 bg-background/40 backdrop-blur flex items-start gap-3"
    >
      <div
        class="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0"
      >
        <Sparkles class="w-4 h-4" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2 flex-wrap">
          <h3 class="font-semibold text-sm leading-tight">{{ title }}</h3>
          <span
            class="text-[10px] font-mono text-muted-foreground tabular-nums"
          >
            Step {{ Math.min(index + 1, total) }} / {{ total }}
          </span>
        </div>
        <p
          v-if="description"
          class="text-xs text-muted-foreground mt-0.5 leading-snug"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <!-- ── Step dots ── -->
    <div class="px-4 pt-3">
      <div class="flex items-center gap-1 flex-wrap">
        <button
          v-for="(_, i) in steps"
          :key="i"
          type="button"
          class="h-1.5 rounded-full transition-all"
          :class="[
            i === index
              ? 'w-5 bg-primary'
              : i < index
                ? 'w-2.5 bg-primary/60'
                : 'w-2.5 bg-muted hover:bg-muted-foreground/40',
          ]"
          :aria-label="`Go to step ${i + 1}`"
          @click="seekTo(i)"
        />
      </div>
    </div>

    <!-- ── Canvas + side panel ── -->
    <div
      class="px-4 py-3 grid gap-3"
      :class="variableEntries.length ? 'md:grid-cols-[1fr_220px]' : ''"
    >
      <div class="relative">
        <!-- Visualizer -->
        <div
          class="rounded-lg border border-border/50 bg-muted/20 px-2 py-3 relative overflow-x-auto"
        >
          <AlgorithmVisualizer
            :mode="mode"
            :variant="variant"
            :data="current?.array ?? []"
            :currentStep="current"
          />

          <!-- Pointer badges overlaid under sorting-style arrays -->
          <div
            v-if="pointerGroups.length && mode === 'sorting'"
            class="flex flex-wrap gap-1.5 justify-center mt-2"
          >
            <span
              v-for="g in pointerGroups"
              :key="g.idx"
              class="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary"
            >
              <span class="font-semibold">{{ g.names.join(", ") }}</span>
              <span class="text-muted-foreground">→</span>
              <span class="tabular-nums">{{ g.idx }}</span>
            </span>
          </div>
        </div>

        <!-- Description caption -->
        <p
          class="text-xs md:text-sm text-center text-foreground/90 mt-3 min-h-[1.5em] leading-snug px-2"
        >
          <span
            v-if="current?.title"
            class="font-semibold text-primary mr-1"
            >{{ current.title }}:</span
          >
          {{ current?.description ?? "Press play to walk through the algorithm." }}
        </p>
      </div>

      <!-- Variables watch panel -->
      <aside
        v-if="variableEntries.length"
        class="rounded-lg border border-border/50 bg-background/60 p-3 h-fit self-start"
      >
        <div
          class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2"
        >
          Watch
        </div>
        <dl class="space-y-1.5 text-xs font-mono">
          <div
            v-for="[k, v] in variableEntries"
            :key="k"
            class="flex items-center justify-between gap-2 border-b border-dashed border-border/40 pb-1 last:border-b-0 last:pb-0"
          >
            <dt class="text-muted-foreground truncate">{{ k }}</dt>
            <dd class="tabular-nums font-semibold text-primary text-right">
              {{ v }}
            </dd>
          </div>
        </dl>
      </aside>
    </div>

    <!-- ── Controls ── -->
    <div class="px-4 pb-4">
      <div class="rounded-lg border border-border/50 bg-background/60 p-2.5">
        <!-- Progress -->
        <div class="relative h-1.5 rounded-full bg-muted overflow-hidden mb-2.5">
          <div
            class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/60 to-primary rounded-full transition-[width] duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <div class="flex items-center justify-center gap-1.5 flex-wrap">
          <Tooltip content="Reset">
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              @click="reset"
            >
              <RotateCcw class="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Tooltip content="Previous step">
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              :disabled="atStart"
              @click="stepBackward"
            >
              <SkipBack class="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Button
            variant="default"
            size="icon"
            class="h-10 w-10 shadow-md shadow-primary/20"
            @click="isPlaying ? pause() : play()"
          >
            <Pause v-if="isPlaying" class="w-4 h-4" />
            <Play v-else class="w-4 h-4 ml-0.5" />
          </Button>
          <Tooltip content="Next step">
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              :disabled="atEnd"
              @click="stepForward"
            >
              <SkipForward class="w-3.5 h-3.5" />
            </Button>
          </Tooltip>

          <div
            class="flex items-center gap-1 ml-1 rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5"
          >
            <Tooltip content="Slower">
              <Button
                variant="ghost"
                size="icon"
                class="h-6 w-6"
                @click="setSpeed(Math.max(0.25, speed - 0.25))"
              >
                <Minus class="w-3 h-3" />
              </Button>
            </Tooltip>
            <select
              :value="speed"
              @change="setSpeed(Number(($event.target as HTMLSelectElement).value))"
              class="bg-transparent text-[11px] font-mono font-semibold text-primary tabular-nums outline-none cursor-pointer w-11 text-center"
            >
              <option v-for="o in speedOptions" :key="o" :value="o">
                {{ o }}x
              </option>
            </select>
            <Tooltip content="Faster">
              <Button
                variant="ghost"
                size="icon"
                class="h-6 w-6"
                @click="setSpeed(Math.min(4, speed + 0.25))"
              >
                <Plus class="w-3 h-3" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
