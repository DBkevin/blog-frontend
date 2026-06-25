<template>
  <div class="search-mask" @click.self="$emit('close')">
    <div class="search-panel" @keyup.esc="$emit('close')">
      <input ref="inputRef" v-model="keyword" @input="doSearch" placeholder="搜索文章..." class="search-input" />
      <div v-if="loading" class="search-status">搜索中...</div>
      <div v-else-if="keyword && results.length === 0" class="search-status">未找到结果</div>
      <div v-else class="search-results">
        <div v-for="item in results" :key="item.slug" class="search-item" @click="go(item.slug)">
          <div class="search-title" v-html="highlight(item.title)"></div>
          <div class="search-summary" v-if="item.summary" v-html="highlight(item.summary)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { searchPosts } from "../api"

const emit = defineEmits(["close"])
const router = useRouter()
const keyword = ref("")
const results = ref([])
const loading = ref(false)
const inputRef = ref(null)

let debounceTimer = null
function doSearch() {
  clearTimeout(debounceTimer)
  if (!keyword.value || keyword.value.length < 2) { results.value = []; return }
  debounceTimer = setTimeout(async () => {
    loading.value = true
    try {
      const res = await searchPosts(keyword.value)
      results.value = res.data.data?.list || []
    } catch (e) { results.value = [] }
    finally { loading.value = false }
  }, 300)
}

function highlight(text) {
  if (!keyword.value || !text) return text
  const lower = text.toLowerCase()
  const kw = keyword.value.toLowerCase()
  const idx = lower.indexOf(kw)
  if (idx === -1) return text
  const before = text.slice(0, idx)
  const matched = text.slice(idx, idx + keyword.value.length)
  const after = text.slice(idx + keyword.value.length)
  return before + '<em style="color:var(--primary);font-style:normal">' + matched + '</em>' + after
}

function go(slug) { router.push("/posts/" + slug); emit("close") }

const handleKeydown = (e) => { if (e.key === "Escape") emit("close") }
onMounted(() => {
  inputRef.value?.focus()
  document.addEventListener("keydown", handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown)
})
</script>

<style scoped>
.search-mask { position: fixed; inset: 0; z-index: 200; background: var(--mask-bg); display: flex; justify-content: center; padding-top: 15vh; backdrop-filter: blur(4px); }
.search-panel { width: 90%; max-width: 600px; max-height: 70vh; overflow-y: auto; background: var(--card-bg); border-radius: var(--radius-lg); box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 24px; animation: panelIn 0.2s ease; }
@keyframes panelIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.search-input { width: 100%; padding: 14px 18px; font-size: 18px; border: 2px solid var(--primary); border-radius: var(--radius-md); outline: none; background: var(--bg); color: var(--text); &:focus { box-shadow: 0 0 0 3px rgba(180,83,9,0.15); } }
.search-status { text-align: center; color: var(--text-muted); padding: 24px; }
.search-results { margin-top: 16px; }
.search-item { padding: 14px; border-bottom: 1px solid var(--border); cursor: pointer; border-radius: var(--radius-sm); transition: background var(--transition); &:hover { background: var(--bg-secondary); } &:last-child { border-bottom: none; } }
.search-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; color: var(--text); }
.search-summary { font-size: 13px; color: var(--text-secondary); }
</style>