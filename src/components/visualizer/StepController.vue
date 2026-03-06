<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Minus, Plus } from 'lucide-vue-next'

const props = defineProps<{
  isPlaying: boolean
  isAtStart: boolean
  isAtEnd: boolean
  progress: number
  currentStepIndex: number
  totalSteps: number
  speed: number
}>()

const emit = defineEmits<{
  play: []
  pause: []
  stepForward: []
  stepBackward: []
  reset: []
  setSpeed: [speed: number]
  seekTo: [index: number]
}>()

const speedOptions = [0.25, 0.5, 1, 1.5, 2, 3]
</script>

<template>
  <div class="flex flex-col gap-3 p-4 rounded-lg border bg-card">
    <!-- Progress bar -->
    <div class="w-full">
      <input
        type="range"
        class="w-full h-1.5 accent-primary cursor-pointer"
        :min="-1"
        :max="totalSteps - 1"
        :value="currentStepIndex"
        @input="emit('seekTo', Number(($event.target as HTMLInputElement).value))"
      />
      <div class="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Step {{ Math.max(0, currentStepIndex + 1) }}</span>
        <span>{{ totalSteps }} total</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-2">
      <Tooltip content="Reset">
        <Button variant="outline" size="icon" class="h-8 w-8" @click="emit('reset')">
          <RotateCcw class="w-3.5 h-3.5" />
        </Button>
      </Tooltip>

      <Tooltip content="Previous step">
        <Button variant="outline" size="icon" class="h-8 w-8" :disabled="isAtStart" @click="emit('stepBackward')">
          <SkipBack class="w-3.5 h-3.5" />
        </Button>
      </Tooltip>

      <Button
        variant="default"
        size="icon"
        class="h-10 w-10"
        @click="isPlaying ? emit('pause') : emit('play')"
      >
        <Pause v-if="isPlaying" class="w-4 h-4" />
        <Play v-else class="w-4 h-4 ml-0.5" />
      </Button>

      <Tooltip content="Next step">
        <Button variant="outline" size="icon" class="h-8 w-8" :disabled="isAtEnd" @click="emit('stepForward')">
          <SkipForward class="w-3.5 h-3.5" />
        </Button>
      </Tooltip>

      <!-- Speed control -->
      <div class="flex items-center gap-1 ml-2">
        <Button variant="ghost" size="icon" class="h-7 w-7" @click="emit('setSpeed', Math.max(0.25, speed - 0.25))">
          <Minus class="w-3 h-3" />
        </Button>
        <span class="text-xs font-mono w-10 text-center text-muted-foreground">{{ speed }}x</span>
        <Button variant="ghost" size="icon" class="h-7 w-7" @click="emit('setSpeed', Math.min(4, speed + 0.25))">
          <Plus class="w-3 h-3" />
        </Button>
      </div>
    </div>
  </div>
</template>
