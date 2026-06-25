import { defineStore } from "pinia"
import { ref } from "vue"
import { getSiteConfig, getSidebar, getSiteStats } from "../api"

export const useSiteStore = defineStore("site", () => {
  const config = ref({})
  const sidebar = ref({})
  const stats = ref({})
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const [c, s, st] = await Promise.all([
        getSiteConfig(), getSidebar(), getSiteStats()
      ])
      config.value = c.data.data || {}
      sidebar.value = s.data.data || {}
      stats.value = st.data.data || {}
    } catch (e) { console.error("Site data fetch failed", e) }
    finally { loading.value = false }
  }

  return { config, sidebar, stats, loading, fetchAll }
})
