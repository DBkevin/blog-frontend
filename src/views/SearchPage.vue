<template>
  <DefaultLayout>
    <div class="search-page">
      <div class="search-box">
        <input
          v-model="keyword"
          @input="onInput"
          @keyup.enter="doSearch"
          placeholder="搜索文章..."
          class="search-input"
          ref="inputRef"
        />
        <button class="search-btn" @click="doSearch">搜索</button>
      </div>

      <div v-if="loading" class="search-status">搜索中...</div>
      <div v-else-if="keyword && results.length === 0" class="search-status">
        <p>未找到与 "<strong>{{ keyword }}</strong>" 相关的文章</p>
      </div>
      <template v-else-if="results.length > 0">
        <div class="result-meta">
          共找到 <strong>{{ pagination.total }}</strong> 篇与 "{{ keyword }}" 相关的文章
        </div>
        <ArticleCard v-for="post in results" :key="post.id" :post="post" />
        <Pagination v-if="pagination.total_pages > 1" :pagination="pagination" />
      </template>
      <div v-else class="search-status">
        <p>输入关键词搜索文章</p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import DefaultLayout from "../layouts/DefaultLayout.vue"
import ArticleCard from "../components/ArticleCard.vue"
import Pagination from "../components/Pagination.vue"
import { searchPosts } from "../api"

const route = useRoute()
const router = useRouter()
const keyword = ref("")
const results = ref([])
const pagination = ref({})
const loading = ref(false)
const inputRef = ref(null)

let debounceTimer = null

function onInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const q = keyword.value.trim()
    if (q.length >= 2) {
      router.replace({ query: { q } })
      doSearch()
    } else if (q.length === 0) {
      router.replace({ query: {} })
      results.value = []
      pagination.value = {}
    }
  }, 400)
}

async function doSearch() {
  const q = keyword.value.trim()
  if (q.length < 2) return
  loading.value = true
  try {
    const page = route.query.page || 1
    const res = await searchPosts(q, { page })
    results.value = res.data.data?.list || []
    pagination.value = res.data.data?.pagination || {}
    document.title = '搜索: ' + q + " - " + "Blog"
  } catch (e) {
    results.value = []
    pagination.value = {}
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.q) {
    keyword.value = route.query.q
    doSearch()
  }
  nextTick(() => inputRef.value?.focus())
})

watch(() => route.query.q, (q) => {
  if (q && q !== keyword.value) {
    keyword.value = q
    doSearch()
  }
})

watch(() => route.query.page, () => {
  if (keyword.value) doSearch()
})
</script>

<style scoped>
.search-page { padding: 24px 0; }
.search-box { display: flex; gap: 8px; margin-bottom: 24px; }
.search-input {
  flex: 1; padding: 14px 18px; font-size: 16px;
  border: 2px solid var(--border); border-radius: var(--radius-md);
  outline: none; background: var(--bg); color: var(--text);
  transition: border-color var(--transition);
  &:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(180,83,9,0.15); }
}
.search-btn {
  padding: 14px 28px; font-size: 16px; font-weight: 600;
  background: var(--primary); color: #fff; border: none;
  border-radius: var(--radius-md); cursor: pointer;
  transition: all var(--transition);
  &:hover { opacity: 0.9; transform: translateY(-1px); }
}
.search-status {
  text-align: center; padding: 60px 20px; color: var(--text-secondary); font-size: 15px;
}
.result-meta {
  font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;
  padding: 12px 0; border-bottom: 1px solid var(--border);
}
</style>