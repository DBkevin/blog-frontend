<template>
  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-copy">{{ site.config.footer_copyright || "© 2026 二丫讲梵" }}</p>
      <p v-if="site.config.beian" class="footer-beian"><a :href="site.config.beian_url || 'https://beian.miit.gov.cn/'" target="_blank" rel="noopener">{{ site.config.beian }}</a></p>
      <p class="footer-tech">Powered by Laravel · Vue 3</p>
    </div>
  </footer>
</template>

<script setup>
import { useSiteStore } from "../stores/site"
const site = useSiteStore()
</script>

<style scoped>
.footer { text-align: center; padding: 36px 20px; font-size: 13px; color: var(--text-muted); border-top: 1px solid var(--border); grid-column: 1 / -1; margin-top: 48px; }
.footer-inner { max-width: var(--max-width); margin: 0 auto; }
.footer p { margin: 4px 0; }
.footer-copy { font-weight: 500; }
.footer-tech { font-size: 12px; opacity: 0.7; }
</style>