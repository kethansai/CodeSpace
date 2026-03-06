import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const preferredLanguage = ref<string>('javascript')
    const editorFontSize = ref(14)
    const animationSpeed = ref(1) // 0.5x to 3x
    const sidebarCollapsed = ref(false)

    function setPreferredLanguage(lang: string) {
      preferredLanguage.value = lang
    }

    function setEditorFontSize(size: number) {
      editorFontSize.value = Math.max(10, Math.min(24, size))
    }

    function setAnimationSpeed(speed: number) {
      animationSpeed.value = Math.max(0.25, Math.min(3, speed))
    }

    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    return {
      preferredLanguage,
      editorFontSize,
      animationSpeed,
      sidebarCollapsed,
      setPreferredLanguage,
      setEditorFontSize,
      setAnimationSpeed,
      toggleSidebar,
    }
  },
  {
    persist: true,
  },
)
