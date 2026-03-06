<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Copy, Check } from "lucide-vue-next";
import Button from "@/components/ui/Button.vue";
import { highlightCode } from "@/composables/useShiki";

const props = defineProps<{
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}>();

const copied = ref(false);
const highlightedHtml = ref("");

async function highlight() {
  if (!props.code) {
    highlightedHtml.value = "";
    return;
  }
  highlightedHtml.value = await highlightCode(props.code, props.language);
}

onMounted(highlight);
watch(() => [props.code, props.language], highlight);

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // fallback
    const textarea = document.createElement("textarea");
    textarea.value = props.code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}
</script>

<template>
  <div class="relative group rounded-lg border bg-muted/50 overflow-hidden">
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-2 border-b bg-muted/80"
    >
      <div class="flex items-center gap-2">
        <div class="flex gap-1.5">
          <span class="w-3 h-3 rounded-full bg-red-500/60" />
          <span class="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span class="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span
          v-if="filename || language"
          class="text-xs text-muted-foreground font-mono ml-2"
        >
          {{ filename || language }}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        @click="copyCode"
      >
        <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-500" />
        <Copy v-else class="w-3.5 h-3.5" />
      </Button>
    </div>

    <!-- Code -->
    <div
      class="shiki-wrapper overflow-x-auto p-4 text-sm font-mono leading-relaxed"
      v-if="highlightedHtml"
      v-html="highlightedHtml"
    />
    <div class="overflow-x-auto" v-else>
      <pre
        class="p-4 text-sm font-mono leading-relaxed"
      ><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
