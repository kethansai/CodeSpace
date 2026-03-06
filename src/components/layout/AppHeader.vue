<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { APP_CONFIG, NAV_ITEMS } from '@/config/app'
import { Sun, Moon, Menu, X, Search, Code2 } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const { store: colorMode, system } = useColorMode({ emitAuto: true })

function toggleTheme() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group" @click="closeMobileMenu">
        <div class="relative">
          <div class="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
            <Code2 class="w-5 h-5 text-white" />
          </div>
        </div>
        <span class="text-xl font-bold tracking-tight hidden sm:block">
          <span class="gradient-text">Code</span><span class="text-foreground">Space</span>
        </span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-1">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
          :class="route.path.startsWith(item.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Search (desktop) -->
        <Button variant="outline" size="sm" class="hidden md:flex items-center gap-2 text-muted-foreground w-56 justify-start" @click="$emit('openSearch')">
          <Search class="w-4 h-4" />
          <span class="text-sm">Search...</span>
          <kbd class="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span class="text-xs">⌘</span>K
          </kbd>
        </Button>

        <!-- Theme toggle -->
        <Button variant="ghost" size="icon" @click="toggleTheme" aria-label="Toggle theme">
          <Sun class="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        <!-- Mobile menu toggle -->
        <Button variant="ghost" size="icon" class="lg:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="lg:hidden border-t bg-background">
        <nav class="container mx-auto px-4 py-4 flex flex-col gap-1">
          <RouterLink
            v-for="item in NAV_ITEMS"
            :key="item.to"
            :to="item.to"
            class="px-4 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-accent"
            :class="route.path.startsWith(item.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
