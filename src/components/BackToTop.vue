<template>
  <Transition name="back-top">
    <button v-if="visible" class="back-top" @click="scrollToTop" title="返回顶部">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m18 15-6-6-6 6"/></svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
const visible = ref(false)
function check() { visible.value = window.scrollY > 300 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }) }
onMounted(() => window.addEventListener("scroll", check))
onUnmounted(() => window.removeEventListener("scroll", check))
</script>

<style scoped>
.back-top {
  position: fixed; bottom: 40px; right: 30px; z-index: 90;
  width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--border);
  background: var(--card-bg); color: var(--text-secondary);
  cursor: pointer; box-shadow: var(--card-shadow); display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
  &:hover { background: var(--primary); color: #fff; border-color: var(--primary); transform: translateY(-2px); }
}
.back-top-enter-active, .back-top-leave-active { transition: all 0.2s ease; }
.back-top-enter-from, .back-top-leave-to { opacity: 0; transform: translateY(10px); }
</style>