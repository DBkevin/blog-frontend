<template>
  <DefaultLayout>
    <div class="detail-layout">
      <div class="detail-main">
        <div class="article-card-container">
          <div v-if="loading" class="loading">加载中...</div>
          <template v-else-if="post">
            <div class="breadcrumb">
              <router-link to="/">首页</router-link>
              <span class="sep"> / </span>
              <router-link v-if="post.category" :to="'/categories/' + post.category.slug">{{ post.category.name }}</router-link>
              <span class="sep"> / </span>
              <span>{{ post.title }}</span>
            </div>

            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <span class="meta-item">{{ formatDate(post.created_at) }}</span>
              <span v-if="post.category" class="meta-item meta-category">{{ post.category.name }}</span>
              <span v-if="post.series" class="meta-item">{{ post.series.name }}</span>
              <span v-if="post.view_count" class="meta-item">{{ post.view_count }} 浏览</span>
              <span v-if="post.word_count" class="meta-item">约 {{ post.word_count }} 字</span>
            </div>

            <div class="post-tags" v-if="post.tags && post.tags.length">
              <router-link v-for="tag in post.tags" :key="tag.slug" :to="'/tags/' + tag.slug" class="tag-badge">{{ tag.name }}</router-link>
            </div>

            <div class="article-body" v-html="renderedHtml"></div>

            <div class="post-nav">
              <div v-if="post.prev" class="nav-item">
                <span class="nav-label">← 上一篇</span>
                <router-link :to="'/posts/' + post.prev.slug">{{ post.prev.title }}</router-link>
              </div>
              <div v-if="post.next" class="nav-item nav-next">
                <span class="nav-label">下一篇 →</span>
                <router-link :to="'/posts/' + post.next.slug">{{ post.next.title }}</router-link>
              </div>
            </div>

            <div class="post-copyright">
              <p>本文由 {{ post.author || site.config.site_name }} 创作，采用 CC BY-NC 4.0 协议</p>
              <p>本文链接：<a :href="postUrl" target="_blank">{{ postUrl }}</a></p>
            </div>
          </template>
          <div v-else class="loading">文章不存在</div>
        </div>
      </div>
      <TocSidebar v-if="tocItems.length" :items="tocItems" class="detail-toc" />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue"
import { useRoute } from "vue-router"
import DefaultLayout from "../layouts/DefaultLayout.vue"
import TocSidebar from "../components/TocSidebar.vue"
import { useSiteStore } from "../stores/site"
import { getPostDetail, trackVisit } from "../api"
import { marked } from "marked"
import hljs from "highlight.js"
import "highlight.js/styles/github.css"

const route = useRoute()
const site = useSiteStore()
const post = ref(null)
const renderedHtml = ref("")
const tocItems = ref([])
const loading = ref(true)

const postUrl = computed(() => {
  if (typeof window === "undefined") return ""
  return window.location.origin + "/posts/" + (post.value?.slug || "")
})

function formatDate(d) { return d ? new Date(d).toLocaleDateString("zh-CN") : "" }

async function loadPost() {
  loading.value = true
  try {
    const res = await getPostDetail(route.params.slug)
    post.value = res.data.data
    document.title = post.value.title + " - " + (site.config.site_name || "Blog")
    const body = post.value.body || ""
    renderedHtml.value = marked.parse(body)

    nextTick(() => {
      const article = document.querySelector(".detail-main .article-body")
      if (!article) return
      const headings = article.querySelectorAll("h2, h3")
      tocItems.value = Array.from(headings).map(h => ({
        depth: parseInt(h.tagName[1]), text: h.textContent.trim(), id: h.id
      }))
      article.querySelectorAll("pre code").forEach((el) => hljs.highlightElement(el))
      article.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return
        const btn = document.createElement("button")
        btn.className = "copy-btn"
        btn.textContent = "复制"
        btn.onclick = () => {
          const code = pre.querySelector("code")
          navigator.clipboard.writeText(code.textContent)
          btn.textContent = "已复制!"
          setTimeout(() => btn.textContent = "复制", 2000)
        }
        pre.appendChild(btn)
      })
    })

    try {
      const uuid = localStorage.getItem("visitor_uuid") || crypto.randomUUID()
      localStorage.setItem("visitor_uuid", uuid)
      await trackVisit({ visitor_uuid: uuid, page_url: "/posts/" + route.params.slug, page_type: "post", user_agent: navigator.userAgent })
    } catch (e) {}
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

onMounted(loadPost)
  watch(() => route.params.slug, loadPost)
</script>

<style scoped>
.detail-layout { display: flex; gap: 30px; }
.detail-main { flex: 1; min-width: 0; }
.article-card-container { background: var(--card-bg); border-radius: var(--radius-lg); padding: 36px; box-shadow: var(--card-shadow); border: 1px solid var(--border); }
.detail-toc { flex-shrink: 0; }
.loading { text-align: center; padding: 60px; color: var(--text-muted); }
.breadcrumb { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
.sep { margin: 0 6px; color: var(--text-muted); }
.post-title { font-size: 28px; font-weight: 700; margin-bottom: 16px; line-height: 1.4; }
.post-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }
.meta-item { display: flex; align-items: center; gap: 4px; }
.meta-item::before { content: ""; width: 4px; height: 4px; border-radius: 50%; background: var(--text-muted); display: inline-block; margin-right: 4px; }
.meta-item:first-child::before { display: none; }
.meta-category { font-weight: 600; color: var(--primary); }
.post-tags { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.tag-badge { font-size: 12px; padding: 4px 12px; border-radius: 6px; background: var(--tag-bg); color: var(--tag-color); }
.post-nav { display: flex; justify-content: space-between; margin: 40px 0 24px; padding: 24px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); gap: 20px; }
.nav-item { flex: 1; &:last-child { text-align: right; } }
.nav-label { font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
.nav-item a { font-size: 14px; font-weight: 500; }
.post-copyright { font-size: 13px; color: var(--text-muted); margin-bottom: 30px; line-height: 1.8; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-sm); }
.post-copyright p { margin: 4px 0; }
@media (max-width: 1200px) { .detail-toc { display: none; } }
@media (max-width: 960px) { .detail-layout { flex-direction: column; } }
@media (max-width: 720px) { .article-card-container { padding: 24px 20px; } }
</style>