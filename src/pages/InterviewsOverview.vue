<script setup lang="ts">
import { companies } from '@/data/interviews'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import { ArrowRight, Building2 } from 'lucide-vue-next'
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 md:py-12">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <Building2 class="w-8 h-8 text-primary" />
        <h1 class="text-3xl font-bold">Interview Questions</h1>
      </div>
      <p class="text-muted-foreground text-lg">
        Company-specific interview questions from top tech companies.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="company in companies"
        :key="company.id"
        :to="`/interviews/${company.slug}`"
        class="group"
      >
        <Card class="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
          <CardContent class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl">{{ company.logo }}</span>
              <h3 class="text-xl font-semibold group-hover:text-primary transition-colors">
                {{ company.name }}
              </h3>
            </div>
            <p class="text-sm text-muted-foreground line-clamp-2 mb-4">{{ company.description }}</p>
            <div class="flex items-center justify-between">
              <Badge variant="secondary">{{ company.questions.length }} questions</Badge>
              <span class="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View <ArrowRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </CardContent>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
