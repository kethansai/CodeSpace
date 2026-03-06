<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { marked } from "marked";
import { highlightCode } from "@/composables/useShiki";

const props = defineProps<{
  content: string;
  class?: string;
}>();

const renderedHtml = ref("");

// Custom renderer for code blocks with Shiki highlighting
const renderer = new marked.Renderer();
const originalCodeRenderer = renderer.code;

renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  // Return a placeholder that we'll replace after async highlighting
  const id = `shiki-${Math.random().toString(36).slice(2, 10)}`;
  const escapedCode = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<div class="shiki-wrapper shiki-placeholder" data-shiki-id="${id}" data-shiki-lang="${lang || ""}" data-shiki-code="${encodeURIComponent(text)}"><pre><code>${escapedCode}</code></pre></div>`;
};

async function renderMarkdown(md: string) {
  if (!md) {
    renderedHtml.value = "";
    return;
  }

  // First pass: render markdown with placeholders
  let html = await marked(md, {
    gfm: true,
    breaks: true,
    renderer,
  });

  // Second pass: replace placeholders with highlighted code
  const placeholderRegex =
    /<div class="shiki-wrapper shiki-placeholder" data-shiki-id="([^"]*)" data-shiki-lang="([^"]*)" data-shiki-code="([^"]*)">[^]*?<\/div>/g;
  const matches = [...html.matchAll(placeholderRegex)];

  for (const match of matches) {
    const fullMatch = match[0];
    const lang = match[2] || "";
    const encodedCode = match[3] || "";
    const code = decodeURIComponent(encodedCode);
    const highlighted = await highlightCode(code, lang || undefined);
    html = html.replace(
      fullMatch,
      `<div class="shiki-wrapper">${highlighted}</div>`,
    );
  }

  renderedHtml.value = html;
}

onMounted(() => renderMarkdown(props.content));
watch(() => props.content, renderMarkdown);
</script>

<template>
  <div :class="['prose max-w-none', $props.class]" v-html="renderedHtml" />
</template>
