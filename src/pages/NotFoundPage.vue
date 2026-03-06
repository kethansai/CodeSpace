<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import { Home, ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <div class="container mx-auto max-w-2xl px-4 py-20 text-center">
    <div class="text-8xl mb-6">🚀</div>
    <h1 class="text-5xl font-bold mb-3">404</h1>
    <h2 class="text-xl text-muted-foreground mb-6">Page not found</h2>
    <p class="text-muted-foreground mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div class="flex justify-center gap-3">
      <RouterLink to="/">
        <Button>
          <Home class="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </RouterLink>
      <Button variant="outline" @click="$router.back()">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Go Back
      </Button>
    </div>
  </div>
</template>
