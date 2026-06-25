<template>
  <DefaultLayout :showSidebar="false">
    <div class="about-page">
      <h1 class="about-title">关于</h1>
      <div class="about-content card-base">
        <div class="article-body" v-html="aboutHtml"></div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from "vue"
import DefaultLayout from "../layouts/DefaultLayout.vue"
import { useSiteStore } from "../stores/site"
import { marked } from "marked"

const site = useSiteStore()
const aboutHtml = ref("")

onMounted(() => {
  const md = site.config.about_content || "## 关于我\n\n运维工程师，热爱开源与技术分享。"
  aboutHtml.value = marked.parse(md)
})
</script>

<style scoped>
.about-page { max-width: 800px; margin: 0 auto; padding: 40px 0; }
.about-title { font-size: 28px; font-weight: 700; margin-bottom: 30px; }
.about-content { padding: 36px; }
</style>