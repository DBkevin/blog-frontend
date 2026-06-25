<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { watch } from "vue"
import { useRoute } from "vue-router"
import { useSiteStore } from "./stores/site"

const route = useRoute()
const site = useSiteStore()

watch(
  () => route.path,
  (path) => {
    const name = site.config.site_name || "Blog"
    if (path.startsWith("/posts/")) return       // PostDetailPage sets its own
    if (path.startsWith("/categories/") || path.startsWith("/tags/") || path.startsWith("/series/"))
      return                                     // PostListPage handles these
    if (path === "/about") {
      document.title = "关于 - " + name
      return
    }
    document.title = name
  },
  { immediate: true }
)
</script>
