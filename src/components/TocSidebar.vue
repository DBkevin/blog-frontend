<template>
  <aside class="toc-sidebar" v-if="items.length">
    <h4 class="toc-title">目录</h4>
    <ul class="toc-list">
      <li v-for="item in items" :key="item.id" :class="['toc-item', 'toc-h' + item.depth, { active: activeId === item.id }]">
        <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)">{{ item.text }}</a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const props = defineProps({ items: { type: Array, default: () => [] } })
const activeId = ref("")
let observer = null

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activeId.value = e.target.id })
  }, { rootMargin: "-80px 0px -70% 0px" })
  setTimeout(() => {
    document.querySelectorAll(".article-body h2, .article-body h3").forEach(el => observer.observe(el))
  }, 200)
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.toc-sidebar { position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; width: 220px; padding: 10px 0; }
.toc-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--text-secondary); }
.toc-list { list-style: none; padding: 0; }
.toc-item { padding: 4px 0; font-size: 13px; line-height: 1.5; }
.toc-item a { color: var(--text-secondary); }
.toc-item.active a { color: var(--toc-active); font-weight: 600; }
.toc-h3 { padding-left: 16px; font-size: 12px; }
</style>
