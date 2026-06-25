<template>
  <DefaultLayout>
    <section class="hero">
      <div class="hero-accent-line"></div>
      <h1 class="hero-title">{{ site.config.site_name || "二丫讲梵" }}</h1>
      <p class="hero-subtitle">{{ site.config.slogan || "" }}</p>
      <div class="hero-decoration">
        <span class="hero-dot"></span>
        <span class="hero-dot"></span>
        <span class="hero-dot"></span>
      </div>
    </section>
    <ArticleCard v-for="post in posts" :key="post.id" :post="post" />
    <Pagination v-if="pagination.total_pages > 1" :pagination="pagination" />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import DefaultLayout from "../layouts/DefaultLayout.vue"
import ArticleCard from "../components/ArticleCard.vue"
import Pagination from "../components/Pagination.vue"
import { useSiteStore } from "../stores/site"
import { getPostList } from "../api"

const route = useRoute()
const site = useSiteStore()
const posts = ref([])
const pagination = ref({})

async function loadPosts() {
  try {
    const res = await getPostList({ page: route.query.page || 1 })
    posts.value = res.data.data.list
    pagination.value = res.data.data.pagination
  } catch (e) { console.error(e) }
}
onMounted(loadPosts)
watch(() => route.query.page, loadPosts)
</script>

<style scoped>
.hero {
  text-align: center; padding: 56px 0 48px; position: relative;
  margin-bottom: 8px;
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, var(--bg-secondary) 0%, transparent 100%);
}
.hero-accent-line {
  width: 56px; height: 4px; margin: 0 auto 22px;
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  border-radius: 2px;
}
.hero-title {
  font-size: 2.4em; font-weight: 800; color: var(--text);
  margin: 0 0 12px; letter-spacing: -0.02em;
}
.hero-subtitle {
  font-size: 16px; color: var(--text-secondary);
  max-width: 520px; margin: 0 auto; line-height: 1.7;
}
.hero-decoration {
  display: flex; justify-content: center; gap: 8px; margin-top: 24px;
}
.hero-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--text-muted); opacity: 0.3;
}
.hero-dot:nth-child(2) { opacity: 0.5; }
.hero-dot:nth-child(3) { opacity: 0.3; }
</style>