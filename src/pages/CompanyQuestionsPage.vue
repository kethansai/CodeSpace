<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCompanyBySlug } from '@/data/interviews'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import { ArrowLeft, Building2, ArrowRight, Users } from 'lucide-vue-next'

const route = useRoute()
const company = computed(() => getCompanyBySlug(route.params.company as string))
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-8 md:py-12">
    <RouterLink
      to="/interviews"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      All Companies
    </RouterLink>

    <template v-if="company">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-4xl">{{ company.logo }}</span>
          <div>
            <h1 class="text-3xl font-bold">{{ company.name }}</h1>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <Badge v-if="company.roles?.length" variant="secondary">
                {{ company.roles.length }} roles
              </Badge>
              <Badge variant="outline">
                {{ company.questions.length }} sample questions
              </Badge>
            </div>
          </div>
        </div>
        <p class="text-muted-foreground text-lg mt-2">{{ company.description }}</p>

        <Card class="mt-4 bg-muted/50">
          <CardContent class="p-4">
            <h3 class="font-semibold text-sm mb-1.5">Interview Process</h3>
            <p class="text-sm text-muted-foreground">{{ company.interviewProcess }}</p>
          </CardContent>
        </Card>
      </div>

      <template v-if="company.roles?.length">
        <div class="flex items-center gap-2 mb-4">
          <Users class="w-5 h-5 text-muted-foreground" />
          <h2 class="text-xl font-semibold">Select a role</h2>
        </div>
        <p class="text-sm text-muted-foreground mb-6">
          Each role has its own interview loop with multiple rounds. Click a role to see the rounds, topics, and sample questions with answers.
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <RouterLink
            v-for="role in company.roles"
            :key="role.id"
            :to="`/interviews/${company.slug}/${role.slug}`"
            class="group"
          >
            <Card class="h-full transition-all hover:shadow-md hover:border-primary/40">
              <CardContent class="p-5">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 class="font-semibold text-lg">{{ role.title }}</h3>
                    <p v-if="role.level" class="text-xs text-muted-foreground mt-0.5">
                      {{ role.level }}
                    </p>
                  </div>
                  <ArrowRight class="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
                <p class="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {{ role.description }}
                </p>
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <Badge
                    v-for="f in role.focus.slice(0, 4)"
                    :key="f"
                    variant="outline"
                    class="text-xs font-normal"
                  >
                    {{ f }}
                  </Badge>
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ role.rounds.length }} rounds ·
                  {{ role.rounds.reduce((n, r) => n + r.questions.length, 0) }} questions
                </div>
              </CardContent>
            </Card>
          </RouterLink>
        </div>
      </template>

      <template v-else>
        <Card class="p-6 text-center text-muted-foreground">
          No roles configured for this company yet.
        </Card>
      </template>
    </template>

    <div v-else class="text-center py-20">
      <Building2 class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-2xl font-bold mb-2">Company Not Found</h2>
      <p class="text-muted-foreground mb-4">This company page doesn't exist.</p>
      <RouterLink to="/interviews" class="text-primary hover:underline">View All Companies</RouterLink>
    </div>
  </div>
</template>
