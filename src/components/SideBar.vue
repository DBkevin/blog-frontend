<template>
  <aside class="sidebar">
    <div v-if="loading" class="sidebar-loading">加载中...</div>
    <template v-else>
      <div class="sidebar-card blogger-card">
        <div class="avatar-ring"><img :src="site.config.avatar_url || '/avatar-placeholder.svg'" alt="avatar" class="avatar" /></div>
        <h3 class="blogger-name">{{ site.config.site_name }}</h3>
        <p class="blogger-bio">{{ site.config.bio }}</p>
        <div class="site-stats">
          <div class="stat-item"><span class="stat-num">{{ stats.total_posts || sidebar.stats?.total_posts || 0 }}</span><span class="stat-label">文章</span></div>
          <div class="stat-item"><span class="stat-num">{{ stats.total_categories || sidebar.stats?.total_categories || 0 }}</span><span class="stat-label">分类</span></div>
          <div class="stat-item"><span class="stat-num">{{ stats.total_tags || sidebar.stats?.total_tags || 0 }}</span><span class="stat-label">标签</span></div>
        </div>
      </div>

      <div class="sidebar-card" v-if="sidebar.recent?.length">
        <h4 class="sidebar-title">最近更新</h4>
        <ul class="sidebar-list">
          <li v-for="p in sidebar.recent" :key="p.slug">
            <router-link :to="'/posts/' + p.slug" class="sidebar-link">{{ p.title }}</router-link>
          </li>
        </ul>
      </div>

      <div class="sidebar-card" v-if="sidebar.categories?.length">
        <h4 class="sidebar-title">分类</h4>
        <ul class="sidebar-list">
          <li v-for="cat in sidebar.categories" :key="cat.slug">
            <router-link :to="'/categories/' + cat.slug" class="sidebar-link cat-link">
              <span>{{ cat.name }}</span>
              <span class="count-badge">{{ cat.posts_count }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="sidebar-card" v-if="sidebar.tags?.length">
        <h4 class="sidebar-title">标签</h4>
        <div class="tag-cloud">
          <router-link v-for="tag in sidebar.tags" :key="tag.slug"
            :to="'/tags/' + tag.slug" class="tag-item"
            :style="{ fontSize: getTagSize(tag.posts_count) + 'px' }">
            {{ tag.name }}
          </router-link>
        </div>
      </div>

      <div class="sidebar-card" v-if="sidebar.links?.length">
        <h4 class="sidebar-title">友情链接</h4>
        <ul class="sidebar-list">
          <li v-for="link in sidebar.links" :key="link.name">
            <a :href="link.url" target="_blank" rel="noopener" class="sidebar-link">{{ link.name }}</a>
          </li>
        </ul>
      </div>

      <div class="sidebar-card">
        <h4 class="sidebar-title">订阅</h4>
        <div class="rss-links">
          <a :href="rssUrl + '/feed.xml'" target="_blank" class="rss-link">RSS</a>
          <a :href="rssUrl + '/feed.atom'" target="_blank" class="rss-link">Atom</a>
          <a :href="rssUrl + '/feed.json'" target="_blank" class="rss-link">JSON</a>
        </div>
      </div>
    </template>
  </aside>
</template>

<script setup>
import { computed } from "vue"
import { useSiteStore } from "../stores/site"
const site = useSiteStore()
const loading = computed(() => site.loading)
const sidebar = computed(() => site.sidebar)
const stats = computed(() => site.stats)
const rssUrl = computed(() => import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace("/api/v1","") : "")
function getTagSize(count) {
  const tags = sidebar.value.tags || []
  if (!tags.length) return 14
  const counts = tags.map(t => t.posts_count)
  const min = Math.min(...counts), max = Math.max(...counts)
  if (max === min) return 14
  return 12 + ((count - min) / (max - min)) * 10
}
</script>

<style scoped>
.sidebar { width: var(--sidebar-width); padding: 24px 0 20px 0; }
.sidebar-loading { text-align: center; color: var(--text-muted); padding: 40px 0; }
.sidebar-card {
  background: var(--card-bg); border-radius: var(--radius-lg);
  padding: 20px; margin-bottom: 16px;
  border: 1px solid var(--border); box-shadow: var(--card-shadow);
}
.sidebar-title {
  font-size: 14px; font-weight: 600; color: var(--text-secondary);
  margin-bottom: 14px; padding-bottom: 10px;
  border-bottom: 2px solid var(--border-light);
  position: relative;
}
.sidebar-title::after {
  content: ""; position: absolute; bottom: -2px; left: 0;
  width: 30px; height: 2px; background: var(--primary); border-radius: 1px;
}
.blogger-card { text-align: center; padding: 24px 20px; }
.avatar-ring {
  width: 80px; height: 80px; margin: 0 auto 14px; border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light), var(--accent));
  box-shadow: 0 0 20px rgba(180,83,9,0.15);
}
.avatar { width: 100%; height: 100%; border-radius: 50%; border: 3px solid var(--card-bg); object-fit: cover; background: var(--bg-secondary); }
.blogger-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.blogger-bio { font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.5; }
.site-stats { display: flex; justify-content: center; gap: 20px; }
.stat-item { text-align: center; }
.stat-num { display: block; font-size: 20px; font-weight: 700; color: var(--primary); line-height: 1.2; }
.stat-label { font-size: 12px; color: var(--text-muted); }

.sidebar-list { list-style: none; padding: 0; margin: 0; }
.sidebar-list li { padding: 0; }
.sidebar-link {
  display: block; padding: 8px 0; font-size: 14px; color: var(--text-secondary);
  border-bottom: 1px dashed var(--border-light); transition: color var(--transition);
  &:hover { color: var(--primary); }
}
.cat-link { display: flex; justify-content: space-between; align-items: center; }
.count-badge {
  font-size: 12px; padding: 1px 8px; border-radius: 20px;
  background: var(--tag-bg); color: var(--tag-color);
}
.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-item {
  color: var(--tag-color); background: var(--tag-bg);
  padding: 3px 12px; border-radius: var(--radius-sm);
  line-height: 1.6; transition: all var(--transition);
  &:hover { background: var(--primary); color: #fff; transform: translateY(-1px); }
}
.rss-links { display: flex; gap: 8px; }
.rss-link {
  font-size: 13px; padding: 4px 14px; border-radius: var(--radius-sm);
  border: 1px solid var(--border); color: var(--text-secondary);
  transition: all var(--transition);
  &:hover { border-color: var(--primary); color: var(--primary); }
}
@media (max-width: 960px) { .sidebar { width: 100%; padding: 0 16px 24px; } }
</style>