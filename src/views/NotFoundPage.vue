<template>
  <DefaultLayout :showSidebar="false">
    <div class="not-found">
      <h1 class="nf-code">404</h1>
      <p class="nf-text">页面未找到</p>
      <router-link to="/" class="nf-link">← 返回首页</router-link>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "../layouts/DefaultLayout.vue"
</script>

<style scoped>
.not-found { text-align: center; padding: 80px 20px; }
.nf-code { font-size: 80px; font-weight: 900; color: var(--primary); margin: 0; line-height: 1; }
.nf-text { font-size: 20px; color: var(--text-secondary); margin: 16px 0 24px; }
.nf-link { color: var(--primary); font-size: 16px; }
</style>