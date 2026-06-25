import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api/v1",
  timeout: 15000,
})

export function getSiteConfig() { return api.get("/site/config") }
export function getSidebar() { return api.get("/sidebar") }
export function getSiteStats() { return api.get("/stats/site") }
export function getPostList(params) { return api.get("/posts", { params }) }
export function getPostDetail(slug) { return api.get("/posts/" + slug) }
export function searchPosts(q, { page } = {}) { return api.get("/search", { params: { q, page } }) }
export function getCategories() { return api.get("/categories") }
export function getTags() { return api.get("/tags") }
export function getSeries() { return api.get("/series") }
export function trackVisit(data) { return api.post("/track", data) }
export default api
