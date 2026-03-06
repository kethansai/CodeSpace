<script setup lang="ts">
import { APP_CONFIG } from '@/config/app'
import { Code2, Github, Twitter, MessageCircle } from 'lucide-vue-next'
import Separator from '@/components/ui/Separator.vue'
</script>

<template>
  <footer class="border-t bg-background">
    <div class="container mx-auto px-4 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-1">
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Code2 class="w-4 h-4 text-white" />
            </div>
            <span class="text-lg font-bold">
              <span class="gradient-text">Code</span><span>Space</span>
            </span>
          </RouterLink>
          <p class="text-sm text-muted-foreground leading-relaxed">
            {{ APP_CONFIG.description }}
          </p>
        </div>

        <!-- Learn -->
        <div>
          <h4 class="font-semibold mb-3">Learn</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><RouterLink to="/paths" class="hover:text-foreground transition-colors">Learning Paths</RouterLink></li>
            <li><RouterLink to="/languages" class="hover:text-foreground transition-colors">Languages</RouterLink></li>
            <li><RouterLink to="/dsa" class="hover:text-foreground transition-colors">DSA & Algorithms</RouterLink></li>
            <li><RouterLink to="/methodology" class="hover:text-foreground transition-colors">Methodologies</RouterLink></li>
          </ul>
        </div>

        <!-- Practice -->
        <div>
          <h4 class="font-semibold mb-3">Practice</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><RouterLink to="/problems" class="hover:text-foreground transition-colors">Coding Problems</RouterLink></li>
            <li><RouterLink to="/playground" class="hover:text-foreground transition-colors">Code Playground</RouterLink></li>
            <li><RouterLink to="/interviews" class="hover:text-foreground transition-colors">Interview Prep</RouterLink></li>
          </ul>
        </div>

        <!-- Connect -->
        <div>
          <h4 class="font-semibold mb-3">Connect</h4>
          <div class="flex gap-3">
            <a :href="APP_CONFIG.github" target="_blank" rel="noopener" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
              <Github class="w-5 h-5" />
            </a>
            <a :href="APP_CONFIG.social.twitter" target="_blank" rel="noopener" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
              <Twitter class="w-5 h-5" />
            </a>
            <a :href="APP_CONFIG.social.discord" target="_blank" rel="noopener" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
              <MessageCircle class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <Separator class="my-8" />

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {{ new Date().getFullYear() }} {{ APP_CONFIG.name }}. Built for developers, by developers.</p>
        <p>Free & Open Source</p>
      </div>
    </div>
  </footer>
</template>
