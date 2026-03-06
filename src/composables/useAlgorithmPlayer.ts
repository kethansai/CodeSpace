import { ref, computed, onUnmounted, type Ref } from 'vue'
import type { AnimationStep } from '@/data/types'

export function useAlgorithmPlayer(stepsRef: Ref<AnimationStep[]>) {
  const currentStepIndex = ref(-1)
  const isPlaying = ref(false)
  const speed = ref(1) // multiplier
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null)

  const totalSteps = computed(() => stepsRef.value.length)
  const currentStep = computed(() => {
    if (currentStepIndex.value < 0 || currentStepIndex.value >= stepsRef.value.length) return null
    return stepsRef.value[currentStepIndex.value]
  })
  const progress = computed(() => {
    if (totalSteps.value === 0) return 0
    return ((currentStepIndex.value + 1) / totalSteps.value) * 100
  })
  const isAtStart = computed(() => currentStepIndex.value <= 0)
  const isAtEnd = computed(() => currentStepIndex.value >= totalSteps.value - 1)

  function play() {
    if (isAtEnd.value) {
      currentStepIndex.value = -1
    }
    isPlaying.value = true
    tick()
  }

  function pause() {
    isPlaying.value = false
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  function stepForward() {
    if (currentStepIndex.value < totalSteps.value - 1) {
      currentStepIndex.value++
    } else {
      pause()
    }
  }

  function stepBackward() {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--
    }
  }

  function reset() {
    pause()
    currentStepIndex.value = -1
  }

  function seekTo(index: number) {
    currentStepIndex.value = Math.max(-1, Math.min(index, totalSteps.value - 1))
  }

  function setSpeed(s: number) {
    speed.value = Math.max(0.25, Math.min(4, s))
    if (isPlaying.value) {
      pause()
      play()
    }
  }

  function tick() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
    intervalId.value = setInterval(() => {
      if (currentStepIndex.value < totalSteps.value - 1) {
        currentStepIndex.value++
      } else {
        pause()
      }
    }, 800 / speed.value)
  }

  onUnmounted(() => {
    if (intervalId.value) clearInterval(intervalId.value)
  })

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    progress,
    isAtStart,
    isAtEnd,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    seekTo,
    setSpeed,
  }
}
