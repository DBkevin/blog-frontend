<template>
  <div>
    <ReadingProgress />
    <NavBar @open-search="showSearch = true" />
    <div class="app-layout" :class="{ 'no-sidebar': !showSidebar }">
      <main class="main-content"><slot /></main>
      <SideBar v-if="showSidebar" />
    </div>
    <FooterBar />
    <BackToTop />
    <SearchModal v-if="showSearch" @close="showSearch = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import NavBar from "../components/NavBar.vue"
import SideBar from "../components/SideBar.vue"
import SearchModal from "../components/SearchModal.vue"
import FooterBar from "../components/FooterBar.vue"
import BackToTop from "../components/BackToTop.vue"
import ReadingProgress from "../components/ReadingProgress.vue"
import { useSiteStore } from "../stores/site"

const props = defineProps({ showSidebar: { type: Boolean, default: true } })
const showSearch = ref(false)
const site = useSiteStore()

onMounted(() => { site.fetchAll() })
</script>
