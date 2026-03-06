<script setup lang="ts">
import { learningPaths } from '@/data/paths'
import { languages } from '@/data/languages'
import { dsaCategories } from '@/data/dsa'
import { companies } from '@/data/interviews'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import { ArrowRight, BookOpen, Code2, Brain, Building2, Workflow, Sparkles } from 'lucide-vue-next'

const features = [
  { icon: BookOpen, title: 'Learning Paths', desc: '10 role-based learning paths from Intern to Architect', link: '/paths', color: 'text-blue-500' },
  { icon: Code2, title: 'Languages', desc: 'In-depth coverage of 7 programming languages with examples', link: '/languages', color: 'text-green-500' },
  { icon: Brain, title: 'DSA', desc: 'Data structures & algorithms with animated visualizations', link: '/dsa', color: 'text-purple-500' },
  { icon: Sparkles, title: 'Problems', desc: '15+ coding problems with built-in compiler and test cases', link: '/problems', color: 'text-amber-500' },
  { icon: Building2, title: 'Interviews', desc: 'Company-wise interview questions from top tech firms', link: '/interviews', color: 'text-rose-500' },
  { icon: Workflow, title: 'Methodology', desc: 'Agile, Scrum, Kanban, DevOps — explained with diagrams', link: '/methodology', color: 'text-teal-500' },
]

function getPathLevel(role: string): string {
  const levels: Record<string, string> = {
    'intern': 'beginner',
    'qa-engineer': 'beginner',
    'junior-developer': 'intermediate',
    'frontend-developer': 'intermediate',
    'backend-developer': 'intermediate',
    'senior-developer': 'advanced',
    'fullstack-developer': 'advanced',
    'devops-engineer': 'advanced',
    'architect': 'advanced',
    'product-owner': 'advanced',
  }
  return levels[role] || 'intermediate'
}

const stats = [
  { label: 'Learning Paths', value: learningPaths.length },
  { label: 'Languages', value: languages.length },
  { label: 'DSA Topics', value: dsaCategories.reduce((sum, c) => sum + c.topics.length, 0) },
  { label: 'Companies', value: companies.length },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 md:py-32">
      <div class="absolute inset-0 gradient-bg opacity-5"></div>
      <div class="container mx-auto max-w-6xl px-4 relative">
        <div class="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" class="mb-4 px-4 py-1.5 text-sm">
            <Sparkles class="w-3.5 h-3.5 mr-1.5" />
            Your complete developer learning platform
          </Badge>
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Level Up Your
            <span class="gradient-text"> Software Engineering</span>
            Skills
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Master programming languages, data structures, algorithms, and ace your
            technical interviews — all in one place with interactive visualizations.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RouterLink to="/paths">
              <Button size="lg" class="gap-2 text-base px-8">
                Start Learning
                <ArrowRight class="w-4 h-4" />
              </Button>
            </RouterLink>
            <RouterLink to="/playground">
              <Button variant="outline" size="lg" class="gap-2 text-base px-8">
                <Code2 class="w-4 h-4" />
                Try Playground
              </Button>
            </RouterLink>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="text-center p-4 rounded-xl bg-card border border-border">
            <div class="text-2xl md:text-3xl font-bold gradient-text">{{ stat.value }}+</div>
            <div class="text-sm text-muted-foreground mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-16 md:py-24 bg-muted/30">
      <div class="container mx-auto max-w-6xl px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Everything You Need</h2>
          <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive platform covering the entire spectrum of software engineering knowledge.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="feature in features"
            :key="feature.title"
            :to="feature.link"
            class="group"
          >
            <Card class="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
              <CardContent class="p-6">
                <component :is="feature.icon" :class="['w-10 h-10 mb-4', feature.color]" />
                <h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {{ feature.title }}
                </h3>
                <p class="text-muted-foreground text-sm leading-relaxed">{{ feature.desc }}</p>
                <div class="flex items-center gap-1 text-primary text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore
                  <ArrowRight class="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Learning Paths Preview -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto max-w-6xl px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold mb-2">Learning Paths</h2>
            <p class="text-muted-foreground">Choose your role, follow the path</p>
          </div>
          <RouterLink to="/paths">
            <Button variant="ghost" class="gap-1">
              View All <ArrowRight class="w-4 h-4" />
            </Button>
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="path in learningPaths.slice(0, 6)"
            :key="path.id"
            :to="`/paths/${path.role}`"
            class="group"
          >
            <Card class="h-full transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <CardContent class="p-5">
                <div class="flex items-start gap-3">
                  <span class="text-2xl">{{ path.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold group-hover:text-primary transition-colors truncate">
                      {{ path.title }}
                    </h3>
                    <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ path.description }}</p>
                    <div class="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" class="text-xs">{{ path.sections.length }} sections</Badge>
                      <Badge variant="outline" class="text-xs">{{ getPathLevel(path.role) }}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-muted/30">
      <div class="container mx-auto max-w-4xl px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Start Coding?</h2>
        <p class="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Jump into the interactive playground and write code in 7+ languages with instant execution.
        </p>
        <RouterLink to="/playground">
          <Button size="lg" class="gap-2 text-base px-8">
            <Code2 class="w-5 h-5" />
            Open Playground
          </Button>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
