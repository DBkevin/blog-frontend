<template>
  <div class="pagination" v-if="pagination.total_pages > 1">
    <button :disabled="!pagination.has_prev" @click="go(pagination.page - 1)" class="page-btn prev-btn">← 上一页</button>
    <div class="page-numbers">
      <span v-for="p in pageNumbers" :key="p" @click="go(p)" :class="['page-num', { active: p === pagination.page }]">{{ p }}</span>
    </div>
    <button :disabled="!pagination.has_next" @click="go(pagination.page + 1)" class="page-btn next-btn">下一页 →</button>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRouter, useRoute } from "vue-router"
const props = defineProps({ pagination: { type: Object, required: true } })
const router = useRouter()
const route = useRoute()

const pageNumbers = computed(() => {
  const total = props.pagination.total_pages
  const current = props.pagination.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total]
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
  return [1, "...", current - 1, current, current + 1, "...", total]
})

function go(page) {
  if (page === "..." || page < 1 || page > props.pagination.total_pages) return
  const q = { ...route.query, page }
  router.push({ query: q })
}
</script>

<style scoped>
.pagination { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 36px 0; }
.page-btn { padding: 8px 20px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--card-bg); color: var(--text-secondary); cursor: pointer; font-size: 14px; transition: all var(--transition); &:disabled { opacity: .35; cursor: not-allowed; } &:hover:not(:disabled) { background: var(--primary); color: #fff; border-color: var(--primary); } }
.page-numbers { display: flex; gap: 4px; align-items: center; }
.page-num { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); font-size: 14px; color: var(--text-secondary); cursor: pointer; transition: all var(--transition); &:hover { background: var(--bg-secondary); color: var(--primary); } &.active { background: var(--primary); color: #fff; font-weight: 600; } }
</style>