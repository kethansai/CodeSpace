<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { APP_CONFIG } from '@/config/app'

useHead({
  titleTemplate: (title) => title ? `${title} | ${APP_CONFIG.name}` : `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
  meta: [
    { name: 'description', content: APP_CONFIG.description },
    { property: 'og:site_name', content: APP_CONFIG.name },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<template>
  <RouterView />
</template>

<style>
/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
