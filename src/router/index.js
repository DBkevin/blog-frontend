import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", name: "home", component: () => import("../views/HomePage.vue") },
  { path: "/categories/:slug", name: "category", component: () => import("../views/PostListPage.vue") },
  { path: "/tags/:slug", name: "tag", component: () => import("../views/PostListPage.vue") },
  { path: "/series/:slug", name: "series", component: () => import("../views/PostListPage.vue") },
  { path: "/posts/:slug", name: "post", component: () => import("../views/PostDetailPage.vue") },
  { path: "/search", name: "search", component: () => import("../views/SearchPage.vue") },
  { path: "/about", name: "about", component: () => import("../views/AboutPage.vue") },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("../views/NotFoundPage.vue") },
]

export default createRouter({ history: createWebHistory(), routes })
