<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="nav-logo">
        <span class="logo-dot"></span>
        {{ site.config.site_name || "二丫讲梵" }}
      </router-link>
      <nav class="nav-links">
        <router-link to="/" class="nav-link" exact-active-class="active">首页</router-link>
        <router-link to="/series/learning-weekly" class="nav-link" active-class="active">学习周刊</router-link>
        <router-link to="/categories/devops" class="nav-link" active-class="active">运维</router-link>
        <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn" @click="$emit('open-search')" title="搜索">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button class="icon-btn" @click="theme.toggle()" :title="theme.isDark ? '切换浅色' : '切换深色'">
          <svg v-if="theme.isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
        <button class="icon-btn mobile-menu-btn" @click="menuOpen = !menuOpen" title="菜单">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </div>
    </div>
    <Transition name="menu-slide">
      <div v-if="menuOpen" class="mobile-menu" @click="menuOpen = false">
        <router-link to="/" @click="menuOpen=false" class="mobile-link">首页</router-link>
        <router-link to="/series/learning-weekly" @click="menuOpen=false" class="mobile-link">学习周刊</router-link>
        <router-link to="/categories/devops" @click="menuOpen=false" class="mobile-link">运维</router-link>
        <router-link to="/about" @click="menuOpen=false" class="mobile-link">关于</router-link>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from "vue"
import { useThemeStore } from "../stores/theme"
import { useSiteStore } from "../stores/site"
defineEmits(["open-search"])
const theme = useThemeStore()
const site = useSiteStore()
const menuOpen = ref(false)
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--header-bg);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--header-border);
}
.navbar-inner {
  max-width: var(--max-width); margin: 0 auto; padding: 0 20px;
  display: flex; align-items: center; height: var(--navbar-height); gap: 32px;
}
.nav-logo {
  font-size: 20px; font-weight: 700; color: var(--text) !important; white-space: nowrap;
  display: flex; align-items: center; gap: 8px;
  &:hover { color: var(--primary) !important; }
}
.logo-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--primary); display: inline-block;
}
.nav-links { display: flex; gap: 4px; flex: 1; }
.nav-link {
  position: relative; padding: 8px 16px; font-size: 15px; color: var(--text-secondary);
  border-radius: var(--radius-sm); transition: all var(--transition);
  &:hover { color: var(--primary); background: var(--bg-secondary); }
  &.active { color: var(--primary); font-weight: 600; }
  &.active::after {
    content: ""; position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
    width: 20px; height: 3px; background: var(--primary); border-radius: 2px;
  }
}
.nav-actions { display: flex; gap: 4px; }
.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border: none; border-radius: 50%;
  background: transparent; color: var(--text-secondary); cursor: pointer;
  transition: all var(--transition);
  &:hover { background: var(--bg-secondary); color: var(--primary); }
}
.mobile-menu-btn { display: none; }

.mobile-menu {
  padding: 8px 0; background: var(--card-bg);
  border-bottom: 1px solid var(--border); box-shadow: var(--card-shadow);
}
.mobile-link {
  display: block; padding: 12px 24px; color: var(--text); font-size: 15px;
  border-left: 3px solid transparent; transition: all var(--transition);
  &:hover, &.active { color: var(--primary); background: var(--bg-secondary); border-left-color: var(--primary); }
}

.menu-slide-enter-active, .menu-slide-leave-active { transition: all 0.2s ease; }
.menu-slide-enter-from, .menu-slide-leave-to { opacity: 0; max-height: 0; padding: 0; }
.menu-slide-enter-to, .menu-slide-leave-from { opacity: 1; max-height: 300px; }

@media (max-width: 960px) {
  .nav-links { display: none; }
  .mobile-menu-btn { display: flex; }
}
</style>