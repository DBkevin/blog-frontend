<template>
  <DefaultLayout>
    <div class="list-header">
      <h1 class="list-title">{{ pageTitle }}</h1>
      <p class="list-count" v-if="pagination.total">共 {{ pagination.total }} 篇文章</p>
    </div>
    <ArticleCard v-for="post in posts" :key="post.id" :post="post" />
    <Pagination v-if="pagination.total_pages > 1" :pagination="pagination" />
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import DefaultLayout from "../layouts/DefaultLayout.vue"
import ArticleCard from "../components/ArticleCard.vue"
import Pagination from "../components/Pagination.vue"
import { getPostList, getCategories, getTags, getSeries } from "../api"

const route = useRoute()
const posts = ref([])
const pagination = ref({})
const meta = ref({})

const pageTitle = computed(() => {
  if (route.name === "category") return meta.value[route.params.slug] || route.params.slug
  if (route.name === "tag") return "# " + (meta.value[route.params.slug] || route.params.slug)
  if (route.name === "series") return meta.value[route.params.slug] || route.params.slug
  return ""
})

async function loadPosts() {
  try {
    const slug = route.params.slug, params = { page: route.query.page || 1 }
    if (route.name === "category") params.category = slug
    else if (route.name === "tag") params.tag = slug
    else if (route.name === "series") params.series = slug
    const res = await getPostList(params)
    posts.value = res.data.data.list
    pagination.value = res.data.data.pagination
  } catch (e) { console.error(e) }
}

async function loadMeta() {
  try {
    const api = route.name === "category" ? getCategories : route.name === "tag" ? getTags : getSeries
    const res = await api()
    const map = {}
    ;(res.data.data || []).forEach((item) => { map[item.slug] = item.name })
    meta.value = map
  } catch (e) { meta.value = {} }
}

onMounted(async () => { await loadMeta(); loadPosts() })
watch(() => [route.params.slug, route.query.page], async () => { await loadMeta(); loadPosts() })
</script>

<style scoped>
.list-header { padding: 20px 0; }
.list-title { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.list-count { font-size: 14px; color: var(--text-muted); }
</style>