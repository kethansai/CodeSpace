import { ref, computed } from 'vue'
import MiniSearch from 'minisearch'

interface SearchItem {
  id: string
  title: string
  description: string
  category: string
  path: string
  tags?: string[]
}

let searchIndex: MiniSearch<SearchItem> | null = null

export function useSearch() {
  const query = ref('')
  const results = ref<SearchItem[]>([])
  const isSearching = ref(false)

  function initIndex(items: SearchItem[]) {
    searchIndex = new MiniSearch({
      fields: ['title', 'description', 'tags', 'category'],
      storeFields: ['title', 'description', 'category', 'path', 'tags'],
      searchOptions: {
        boost: { title: 3, tags: 2, description: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    })
    searchIndex.addAll(items)
  }

  function search(q: string) {
    query.value = q
    if (!q.trim() || !searchIndex) {
      results.value = []
      return
    }
    isSearching.value = true
    const rawResults = searchIndex.search(q)
    results.value = rawResults.slice(0, 20) as unknown as SearchItem[]
    isSearching.value = false
  }

  function clearSearch() {
    query.value = ''
    results.value = []
  }

  return { query, results, isSearching, search, clearSearch, initIndex }
}
