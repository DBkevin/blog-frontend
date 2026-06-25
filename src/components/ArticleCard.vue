<template>
  <article class="article-card" v-observe-visibility>
    <div class="card-top">
      <span class="card-date">{{ formatDate(post.created_at) }}</span>
      <span v-if="post.category" class="card-category">{{ post.category.name }}</span>
      <span class="card-views" v-if="post.view_count">{{ post.view_count }} 浏览</span>
    </div>
    <h2 class="card-title"><router-link :to="'/posts/' + post.slug">{{ post.title }}</router-link></h2>
    <p class="card-summary">{{ post.summary || truncate(post.body, 150) }}</p>
    <div class="card-bottom" v-if="post.tags && post.tags.length">
      <router-link v-for="tag in post.tags" :key="tag.slug" :to="'/tags/' + tag.slug" class="card-tag">{{ tag.name }}</router-link>
    </div>
  </article>
</template>

<script setup>
defineProps({ post: { type: Object, required: true } })
function formatDate(d) { return d ? new Date(d).toISOString().slice(0, 10) : "" }
function truncate(str, len) { if (!str) return ""; return str.replace(/<[^>]*>/g,"").length > len ? str.slice(0, len) + "..." : str.replace(/<[^>]*>/g,"") }
</script>

<style scoped>
.article-card {
  background: var(--card-bg); border-radius: var(--radius-lg); padding: 26px;
  margin-bottom: 20px; border: 1px solid var(--border);
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  animation: fadeInUp 0.4s ease-out both;
}
.article-card:nth-child(2) { animation-delay: 0.05s; }
.article-card:nth-child(3) { animation-delay: 0.1s; }
.article-card:nth-child(4) { animation-delay: 0.15s; }
.article-card:nth-child(5) { animation-delay: 0.2s; }
.article-card:nth-child(6) { animation-delay: 0.25s; }
.article-card:nth-child(7) { animation-delay: 0.3s; }
.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover);
  border-color: var(--primary);
}
.card-top {
  display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  font-size: 13px; color: var(--text-muted);
}
.card-category {
  padding: 2px 12px; border-radius: 20px;
  background: var(--tag-bg); color: var(--tag-color);
  font-size: 12px; font-weight: 500;
}
.card-views { margin-left: auto; font-size: 13px; }
.card-title { font-size: 19px; margin: 0 0 8px; line-height: 1.45; font-weight: 700; }
.card-title a { color: var(--text); &:hover { color: var(--primary); } }
.card-summary {
  font-size: 14px; color: var(--text-secondary); line-height: 1.7;
  margin-bottom: 12px;
}
.card-bottom { display: flex; gap: 8px; flex-wrap: wrap; }
.card-tag {
  font-size: 13px; padding: 2px 10px; border-radius: var(--radius-sm);
  background: var(--bg-secondary); color: var(--text-secondary);
  transition: all var(--transition);
  &:hover { background: var(--tag-bg); color: var(--tag-color); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>