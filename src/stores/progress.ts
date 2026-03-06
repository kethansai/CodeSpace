import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProgressStore = defineStore(
  'progress',
  () => {
    const completedTopics = ref<Set<string>>(new Set())
    const bookmarkedItems = ref<Set<string>>(new Set())

    const completedCount = computed(() => completedTopics.value.size)
    const bookmarkedCount = computed(() => bookmarkedItems.value.size)

    function toggleTopic(topicId: string) {
      if (completedTopics.value.has(topicId)) {
        completedTopics.value.delete(topicId)
      } else {
        completedTopics.value.add(topicId)
      }
    }

    function isTopicCompleted(topicId: string) {
      return completedTopics.value.has(topicId)
    }

    function toggleBookmark(itemId: string) {
      if (bookmarkedItems.value.has(itemId)) {
        bookmarkedItems.value.delete(itemId)
      } else {
        bookmarkedItems.value.add(itemId)
      }
    }

    function isBookmarked(itemId: string) {
      return bookmarkedItems.value.has(itemId)
    }

    function getCompletionPercentage(topicIds: string[]) {
      if (topicIds.length === 0) return 0
      const completed = topicIds.filter((id) => completedTopics.value.has(id)).length
      return Math.round((completed / topicIds.length) * 100)
    }

    return {
      completedTopics,
      bookmarkedItems,
      completedCount,
      bookmarkedCount,
      toggleTopic,
      isTopicCompleted,
      toggleBookmark,
      isBookmarked,
      getCompletionPercentage,
    }
  },
  {
    persist: {
      serializer: {
        serialize: (state) => {
          return JSON.stringify({
            completedTopics: [...state.completedTopics],
            bookmarkedItems: [...state.bookmarkedItems],
          })
        },
        deserialize: (value) => {
          const parsed = JSON.parse(value)
          return {
            completedTopics: new Set(parsed.completedTopics || []),
            bookmarkedItems: new Set(parsed.bookmarkedItems || []),
          }
        },
      },
    },
  },
)
