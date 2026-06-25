import { createApp } from "vue"
import { createPinia } from "pinia"
import { useSiteStore } from "./stores/site"
import App from "./App.vue"
import router from "./router"
import "./styles/variables.css"
import "./styles/global.scss"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount("#app")

// Initialize site config and set document title
const site = useSiteStore()
site.fetchAll().then(() => {
  if (site.config.site_name) {
    document.title = site.config.site_name
  }
})