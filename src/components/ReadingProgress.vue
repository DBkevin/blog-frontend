<template>
  <div class="reading-bar" :style="{ width: progress + '%' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
const progress = ref(0)
function update() {
  const d = document.documentElement
  progress.value = Math.min((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100, 100)
}
onMounted(() => window.addEventListener("scroll", update))
onUnmounted(() => window.removeEventListener("scroll", update))
</script>

<style scoped>
.reading-bar { position: fixed; top: 60px; left: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--primary-light)); z-index: 99; transition: width .1s ease; box-shadow: 0 0 6px rgba(180,83,9,0.3); }
</style>