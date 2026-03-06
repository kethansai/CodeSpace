<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CodeExample } from '@/data/types'
import Tabs from '@/components/ui/Tabs.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import CodeSnippet from '@/components/editor/CodeSnippet.vue'

const props = defineProps<{
  examples: CodeExample[]
  defaultLanguage?: string
}>()

const activeTab = ref(props.defaultLanguage || props.examples[0]?.language || 'javascript')
</script>

<template>
  <Tabs v-model="activeTab" class="w-full">
    <TabsList class="flex-wrap">
      <TabsTrigger
        v-for="example in examples"
        :key="example.language"
        :value="example.language"
        class="capitalize"
      >
        {{ example.label || example.language }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="example in examples" :key="example.language" :value="example.language">
      <CodeSnippet :code="example.code" :language="example.language" />
    </TabsContent>
  </Tabs>
</template>
