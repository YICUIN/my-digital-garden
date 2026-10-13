<template>
  <!-- 顶部区域不渲染按钮，避免它占用键盘焦点和视觉空间。 -->
  <Transition name="scroll-top-fade">
    <button
      v-if="isVisible"
      type="button"
      class="scroll-top-button"
      aria-label="返回页面顶部"
      title="返回顶部"
      @click="scrollToTop"
    >
      <span aria-hidden="true">↑</span>
      <span>TOP</span>
    </button>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 滚动超过这个距离后才显示，避免刚离开顶部就出现悬浮按钮。
const visibleDistance = 360
const isVisible = ref(false)

function updateVisibility() {
  isVisible.value = globalThis.scrollY > visibleDistance
}

function scrollToTop() {
  // smooth 只影响点击返回顶部，不会改变用户正常滚动的行为。
  globalThis.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // passive 监听不会阻塞页面滚动，适合只读取滚动位置的场景。
  globalThis.addEventListener('scroll', updateVisibility, { passive: true })
  updateVisibility()
})

onBeforeUnmount(() => {
  // 页面切换或组件销毁时移除监听，避免留下无效回调。
  globalThis.removeEventListener('scroll', updateVisibility)
})
</script>

<style scoped>
.scroll-top-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 70px;
  min-height: 36px;
  padding: 8px 11px;
  border: 1px solid #3a4647;
  border-radius: 4px;
  background: #172022;
  color: #c8d0cc;
  font:
    11px 'DM Mono',
    monospace;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.scroll-top-button span:first-child {
  color: #9de5aa;
  font-size: 16px;
  line-height: 1;
}

.scroll-top-button:hover {
  border-color: #9de5aa;
  color: #9de5aa;
  transform: translateY(-2px);
}

.scroll-top-button:focus-visible {
  outline: 2px solid #9de5aa;
  outline-offset: 3px;
}

.scroll-top-fade-enter-active,
.scroll-top-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.scroll-top-fade-enter-from,
.scroll-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 760px) {
  .scroll-top-button {
    right: 16px;
    bottom: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top-button,
  .scroll-top-fade-enter-active,
  .scroll-top-fade-leave-active {
    transition-duration: 1ms;
  }
}
</style>
