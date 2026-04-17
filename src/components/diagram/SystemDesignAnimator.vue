<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from "vue";
import type {
  SystemDesignAnimation,
  SysDesignEdge,
  SysDesignNode,
  SysDesignPacket,
} from "@/data/types";
import Button from "@/components/ui/Button.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Info,
} from "lucide-vue-next";

const props = defineProps<{
  animation: SystemDesignAnimation;
}>();

const VIEW_W = 1000;
const VIEW_H = 520;
const PADDING = 40;

const stepIdx = ref(0);
const isPlaying = ref(false);
const tick = ref(0); // increments to re-trigger packet animation each step
let timer: ReturnType<typeof setInterval> | null = null;

const steps = computed(() => props.animation.steps);
const current = computed(() => steps.value[stepIdx.value]);

const kindColors: Record<string, { fill: string; stroke: string; text: string }> = {
  client: { fill: "#6366f1", stroke: "#4f46e5", text: "#fff" },
  service: { fill: "#0ea5e9", stroke: "#0284c7", text: "#fff" },
  db: { fill: "#059669", stroke: "#047857", text: "#fff" },
  cache: { fill: "#dc2626", stroke: "#b91c1c", text: "#fff" },
  queue: { fill: "#f59e0b", stroke: "#d97706", text: "#000" },
  cdn: { fill: "#a855f7", stroke: "#9333ea", text: "#fff" },
  storage: { fill: "#14b8a6", stroke: "#0d9488", text: "#fff" },
  worker: { fill: "#8b5cf6", stroke: "#7c3aed", text: "#fff" },
  lb: { fill: "#ec4899", stroke: "#db2777", text: "#fff" },
  external: { fill: "#64748b", stroke: "#475569", text: "#fff" },
};

const DEFAULT_COLOR = { fill: "#0ea5e9", stroke: "#0284c7", text: "#fff" };

function nodeColor(n: SysDesignNode): { fill: string; stroke: string; text: string } {
  if (n.color) return { fill: n.color, stroke: n.color, text: "#fff" };
  return kindColors[n.kind ?? "service"] ?? DEFAULT_COLOR;
}

function toPx(x: number, y: number) {
  const px = PADDING + (x / 100) * (VIEW_W - PADDING * 2);
  const py = PADDING + (y / 100) * (VIEW_H - PADDING * 2);
  return { px, py };
}

const nodePositions = computed(() => {
  const map = new Map<string, { x: number; y: number }>();
  for (const n of props.animation.nodes) {
    const { px, py } = toPx(n.x, n.y);
    map.set(n.id, { x: px, y: py });
  }
  return map;
});

function edgePath(e: SysDesignEdge) {
  const a = nodePositions.value.get(e.from);
  const b = nodePositions.value.get(e.to);
  if (!a || !b) return "";
  // slight curve for aesthetics
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const norm = Math.sqrt(dx * dx + dy * dy) || 1;
  const offset = 0; // keep straight for clarity
  const cx = mx + (-dy / norm) * offset;
  const cy = my + (dx / norm) * offset;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function edgeLabelPos(e: SysDesignEdge) {
  const a = nodePositions.value.get(e.from);
  const b = nodePositions.value.get(e.to);
  if (!a || !b) return { x: 0, y: 0 };
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 8 };
}

const activeNodeSet = computed(() => new Set(current.value?.activeNodes ?? []));
const activeEdgeSet = computed(() => new Set(current.value?.activeEdges ?? []));

const packets = computed<SysDesignPacket[]>(() => current.value?.packets ?? []);

const resolvedPackets = computed(() =>
  packets.value
    .map((p) => {
      const edge = props.animation.edges.find((e) => e.id === p.edgeId);
      if (!edge) return null;
      return { packet: p, path: edgePath(edge) };
    })
    .filter((x): x is { packet: SysDesignPacket; path: string } => x !== null),
);

const packetDur = computed(
  () => `${((props.animation.intervalMs ?? 2600) / 1000) * 0.8}s`,
);

function reset() {
  stop();
  stepIdx.value = 0;
  tick.value++;
}

function next() {
  if (stepIdx.value < steps.value.length - 1) {
    stepIdx.value++;
    tick.value++;
  } else {
    stop();
  }
}

function prev() {
  if (stepIdx.value > 0) {
    stepIdx.value--;
    tick.value++;
  }
}

function play() {
  if (isPlaying.value) return;
  if (stepIdx.value >= steps.value.length - 1) stepIdx.value = 0;
  isPlaying.value = true;
  const interval = props.animation.intervalMs ?? 2600;
  timer = setInterval(() => {
    if (stepIdx.value >= steps.value.length - 1) {
      stop();
      return;
    }
    next();
  }, interval);
}

function stop() {
  isPlaying.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function toggle() {
  if (isPlaying.value) stop();
  else play();
}

watch(() => props.animation.id, reset);
onBeforeUnmount(stop);

function gotoStep(i: number) {
  stop();
  stepIdx.value = Math.max(0, Math.min(steps.value.length - 1, i));
  tick.value++;
}
</script>

<template>
  <div class="rounded-lg border bg-card overflow-hidden">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 px-4 py-3 border-b bg-muted/30">
      <div>
        <div class="text-sm font-semibold">{{ animation.title }}</div>
        <div v-if="animation.description" class="text-xs text-muted-foreground mt-0.5">
          {{ animation.description }}
        </div>
      </div>
      <div class="text-xs text-muted-foreground whitespace-nowrap">
        Step {{ stepIdx + 1 }} / {{ steps.length }}
      </div>
    </div>

    <!-- SVG Canvas -->
    <div class="relative w-full bg-gradient-to-br from-background to-muted/30">
      <svg
        :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
        class="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="sda-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
          <filter id="sda-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Edges -->
        <g>
          <g
            v-for="edge in animation.edges"
            :key="edge.id"
            :class="activeEdgeSet.has(edge.id) ? 'text-primary' : 'text-muted-foreground/40'"
          >
            <path
              :d="edgePath(edge)"
              fill="none"
              stroke="currentColor"
              :stroke-width="activeEdgeSet.has(edge.id) ? 2.5 : 1.5"
              :stroke-dasharray="edge.dashed ? '6 4' : undefined"
              marker-end="url(#sda-arrow)"
              :class="['transition-all duration-300', activeEdgeSet.has(edge.id) ? 'opacity-100' : 'opacity-60']"
            />
            <text
              v-if="edge.label"
              :x="edgeLabelPos(edge).x"
              :y="edgeLabelPos(edge).y"
              text-anchor="middle"
              class="fill-muted-foreground"
              font-size="11"
              font-weight="500"
            >
              {{ edge.label }}
            </text>
          </g>
        </g>

        <!-- Packets (animated dots along active edges) -->
        <g :key="tick">
          <template
            v-for="(rp, i) in resolvedPackets"
            :key="`${rp.packet.edgeId}-${i}-${tick}`"
          >
            <g>
              <circle
                r="8"
                :fill="rp.packet.color ?? '#22d3ee'"
                filter="url(#sda-glow)"
              >
                <animateMotion
                  :dur="packetDur"
                  repeatCount="indefinite"
                  :path="rp.path"
                  :keyPoints="rp.packet.reverse ? '1;0' : '0;1'"
                  keyTimes="0;1"
                />
              </circle>
              <text
                v-if="rp.packet.label"
                font-size="10"
                font-weight="600"
                fill="#0f172a"
                class="dark:fill-white"
                text-anchor="middle"
                dy="3"
              >
                <animateMotion
                  :dur="packetDur"
                  repeatCount="indefinite"
                  :path="rp.path"
                  :keyPoints="rp.packet.reverse ? '1;0' : '0;1'"
                  keyTimes="0;1"
                />
                {{ rp.packet.label }}
              </text>
            </g>
          </template>
        </g>

        <!-- Nodes -->
        <g>
          <g
            v-for="n in animation.nodes"
            :key="n.id"
            :transform="`translate(${nodePositions.get(n.id)?.x ?? 0}, ${nodePositions.get(n.id)?.y ?? 0})`"
          >
            <!-- Pulse ring when active -->
            <circle
              v-if="activeNodeSet.has(n.id)"
              r="52"
              :fill="nodeColor(n).fill"
              opacity="0.18"
            >
              <animate
                attributeName="r"
                values="46;62;46"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.05;0.3"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
            <rect
              x="-60"
              y="-26"
              width="120"
              height="52"
              rx="12"
              :fill="nodeColor(n).fill"
              :stroke="activeNodeSet.has(n.id) ? '#fbbf24' : nodeColor(n).stroke"
              :stroke-width="activeNodeSet.has(n.id) ? 3 : 1.5"
              class="transition-all duration-300"
            />
            <text
              v-if="n.icon"
              x="-42"
              y="6"
              text-anchor="middle"
              font-size="20"
            >{{ n.icon }}</text>
            <text
              :x="n.icon ? -20 : 0"
              y="5"
              :text-anchor="n.icon ? 'start' : 'middle'"
              :fill="nodeColor(n).text"
              font-size="12"
              font-weight="600"
            >
              {{ n.label }}
            </text>
          </g>
        </g>
      </svg>
    </div>

    <!-- Step description & notes -->
    <div class="px-4 py-3 border-t bg-muted/20">
      <div class="flex items-start gap-2">
        <Info class="w-4 h-4 mt-0.5 text-primary shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold">{{ current?.title }}</div>
          <div class="text-xs text-muted-foreground mt-1 leading-relaxed">
            {{ current?.description }}
          </div>
          <ul v-if="current?.notes?.length" class="mt-2 space-y-0.5">
            <li
              v-for="(note, i) in current.notes"
              :key="i"
              class="text-[11px] text-muted-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
            >
              {{ note }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col gap-2 px-4 py-3 border-t bg-card">
      <!-- Step dots -->
      <div class="flex items-center gap-1 flex-wrap">
        <button
          v-for="(s, i) in steps"
          :key="i"
          type="button"
          @click="gotoStep(i)"
          :title="s.title"
          :class="[
            'h-1.5 rounded-full transition-all',
            i === stepIdx
              ? 'w-8 bg-primary'
              : i < stepIdx
                ? 'w-3 bg-primary/50'
                : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/60',
          ]"
        />
      </div>

      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5">
          <Tooltip content="Reset">
            <Button variant="outline" size="icon" class="h-8 w-8" @click="reset">
              <RotateCcw class="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Tooltip content="Previous step">
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              :disabled="stepIdx === 0"
              @click="prev"
            >
              <SkipBack class="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Button variant="default" size="icon" class="h-9 w-9" @click="toggle">
            <Pause v-if="isPlaying" class="w-4 h-4" />
            <Play v-else class="w-4 h-4 ml-0.5" />
          </Button>
          <Tooltip content="Next step">
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              :disabled="stepIdx >= steps.length - 1"
              @click="next"
            >
              <SkipForward class="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
        </div>
        <div class="text-xs text-muted-foreground truncate">
          {{ isPlaying ? "Playing..." : "Paused" }}
        </div>
      </div>
    </div>
  </div>
</template>
