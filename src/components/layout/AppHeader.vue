<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_ITEMS } from '@/config/app'
import {
  Sun, Moon, Menu, X, Search, Code2,
  Home, Route, Code, Brain, Puzzle, Database, Server,
  Building2, Kanban, Play,
} from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import { useColorMode } from '@vueuse/core'
import Button from '@/components/ui/Button.vue'

defineEmits<{ (e: 'openSearch'): void }>()

const route = useRoute()
const isMobileMenuOpen = ref(false)
const { store: colorMode } = useColorMode({ emitAuto: true })

const iconMap: Record<string, FunctionalComponent> = {
  home: Home as unknown as FunctionalComponent,
  route: Route as unknown as FunctionalComponent,
  code: Code as unknown as FunctionalComponent,
  brain: Brain as unknown as FunctionalComponent,
  puzzle: Puzzle as unknown as FunctionalComponent,
  database: Database as unknown as FunctionalComponent,
  server: Server as unknown as FunctionalComponent,
  'building-2': Building2 as unknown as FunctionalComponent,
  kanban: Kanban as unknown as FunctionalComponent,
  play: Play as unknown as FunctionalComponent,
}

function iconFor(name: string): FunctionalComponent {
  return iconMap[name] ?? (Code2 as unknown as FunctionalComponent)
}

function toggleTheme() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const orderedItems = computed(() => NAV_ITEMS)
</script>

<template>
  <!-- Mobile top bar -->
  <header
    class="lg:hidden sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg"
  >
    <div class="flex h-14 items-center justify-between px-4">
      <RouterLink to="/" class="flex items-center gap-2" @click="closeMobileMenu">
        <div
          class="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md shadow-primary/25"
        >
          <Code2 class="w-4 h-4 text-white" />
        </div>
        <span class="text-lg font-bold tracking-tight">
          <span class="gradient-text">Code</span><span>Space</span>
        </span>
      </RouterLink>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Search" @click="$emit('openSearch')">
          <Search class="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" @click="toggleTheme">
          <Sun class="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Menu" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="isMobileMenuOpen"
        class="border-t bg-background px-3 py-3 flex flex-col gap-0.5 max-h-[80vh] overflow-y-auto"
      >
        <RouterLink
          v-for="item in orderedItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-accent"
          :class="isActive(item.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
          @click="closeMobileMenu"
        >
          <component :is="iconFor(item.icon)" class="h-4 w-4" />
          {{ item.label }}
        </RouterLink>
      </nav>
    </Transition>
  </header>

  <!-- Desktop vertical sidebar -->
  <aside
    class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r lg:bg-background/95 lg:backdrop-blur-lg z-40"
  >
    <RouterLink to="/" class="flex items-center gap-2.5 px-6 h-16 border-b group">
      <div class="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
        <Code2 class="w-5 h-5 text-white" />
      </div>
      <span class="text-xl font-bold tracking-tight">
        <span class="gradient-text">Code</span><span class="text-foreground">Space</span>
      </span>
    </RouterLink>

    <div class="px-3 pt-4">
      <Button
        variant="outline"
        size="sm"
        class="w-full justify-start gap-2 text-muted-foreground"
        @click="$emit('openSearch')"
      >
        <Search class="w-4 h-4" />
        <span class="text-sm">Search...</span>
        <kbd class="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span class="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
      <RouterLink
        v-for="item in orderedItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
        :class="
          isActive(item.to)
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        "
      >
        <component :is="iconFor(item.icon)" class="h-4 w-4 shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t px-3 py-3 flex items-center justify-between">
      <span class="text-xs text-muted-foreground px-2">Theme</span>
      <Button variant="ghost" size="icon" aria-label="Toggle theme" @click="toggleTheme">
        <Sun class="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  </aside>
</template>
