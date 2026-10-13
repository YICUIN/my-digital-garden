<template>
  <section id="stack" class="stack-section">
    <div class="section-title">
      <p class="section-number">02 / STACK</p>
      <h2>我的工具箱</h2>
      <p>足够熟悉，仍然在向下挖。</p>
    </div>

    <div class="stack-toolbar">
      <p class="stack-hint">
        <span aria-hidden="true">←</span> 左右滑动浏览 <span aria-hidden="true">→</span>
      </p>
      <div class="stack-controls" aria-label="工具箱卡片切换">
        <button
          type="button"
          class="stack-control"
          :disabled="isAtStart"
          aria-label="查看上一张工具箱卡片"
          title="上一张"
          @click="scrollCards(-1)"
        >
          ←
        </button>
        <button
          type="button"
          class="stack-control"
          :disabled="isAtEnd"
          aria-label="查看下一张工具箱卡片"
          title="下一张"
          @click="scrollCards(1)"
        >
          →
        </button>
      </div>
    </div>

    <!-- 两侧渐隐提示轨道仍可继续滚动，配合按钮让横向交互更容易被发现。 -->
    <div
      class="stack-track-wrap"
      :class="{ 'can-scroll-left': !isAtStart, 'can-scroll-right': !isAtEnd }"
    >
      <div
        ref="track"
        class="stack-track"
        tabindex="0"
        aria-label="可横向浏览的工具箱卡片"
        @scroll="updateScrollState"
      >
        <RouterLink
          v-for="item in props.items"
          :key="item.id"
          class="stack-card"
          :to="`/toolbox/${item.id}`"
        >
          <span class="stack-card-index">{{ item.index }}</span>
          <h3>{{ item.title }}</h3>
          <p v-for="line in item.lines" :key="line">{{ line }}</p>
          <span class="stack-card-link" aria-hidden="true">进入工具箱 ↗</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  // 卡片内容由父级数据文件传入，组件只负责展示和横向交互。
  items: {
    type: Array,
    default: () => []
  }
})

const track = ref(null)
const scrollLeft = ref(0)
const maxScrollLeft = ref(0)

const isAtStart = computed(() => scrollLeft.value <= 1)
const isAtEnd = computed(
  () => maxScrollLeft.value <= 1 || scrollLeft.value >= maxScrollLeft.value - 1
)

function updateScrollState() {
  if (!track.value) return
  scrollLeft.value = track.value.scrollLeft
  maxScrollLeft.value = track.value.scrollWidth - track.value.clientWidth
}

function scrollCards(direction) {
  if (!track.value) return

  const cards = [...track.value.querySelectorAll('.stack-card')]
  const currentPosition = track.value.scrollLeft
  const pageWidth = track.value.clientWidth
  const desiredPosition = currentPosition + direction * pageWidth
  const targetCard =
    direction > 0
      ? cards.find((card) => card.offsetLeft >= desiredPosition - 2)
      : [...cards].reverse().find((card) => card.offsetLeft <= desiredPosition + 2)

  // 以一屏为分页步长，再吸附到真实卡片边界，避免卡片被切成半张。
  const rawTargetPosition = targetCard?.offsetLeft ?? (direction > 0 ? maxScrollLeft.value : 0)
  const remainingDistance = maxScrollLeft.value - rawTargetPosition
  // 最后一页不足一屏时直接到达末端，避免多点击一次才能看完整最后一张。
  const targetPosition =
    direction > 0 && remainingDistance < pageWidth * 0.75
      ? maxScrollLeft.value
      : Math.max(0, Math.min(rawTargetPosition, maxScrollLeft.value))
  track.value.scrollTo({ left: targetPosition, behavior: 'smooth' })
}

function handleResize() {
  updateScrollState()
}

onMounted(async () => {
  await nextTick()
  updateScrollState()
  globalThis.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  globalThis.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 工具箱组件专属样式：全局文件只保留页面分区的外层间距。 */
.stack-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
}

.stack-hint {
  margin: 0;
  color: #9aa6a5;
  font: 13px var(--font-mono);
}

.stack-hint span {
  color: var(--color-accent);
}

.stack-controls {
  display: flex;
  gap: 8px;
}

.stack-control {
  width: 34px;
  height: 30px;
  border: 1px solid #3a4647;
  border-radius: 3px;
  background: transparent;
  color: #dce4df;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    background-color 180ms ease;
}

.stack-control:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(157, 229, 170, 0.08);
  color: var(--color-accent);
}

.stack-control:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.stack-track-wrap {
  position: relative;
  overflow: hidden;
  margin-top: 14px;
}

/* 轨道边缘的渐隐是视觉线索，表示内容在边界外仍有卡片。 */
.stack-track-wrap::before,
.stack-track-wrap::after {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 42px;
  pointer-events: none;
  content: '';
  opacity: 0;
  transition: opacity 180ms ease;
}

.stack-track-wrap::before {
  left: 0;
  background: linear-gradient(90deg, var(--color-page), transparent);
}

.stack-track-wrap::after {
  right: 0;
  background: linear-gradient(270deg, var(--color-page), transparent);
}

.stack-track-wrap.can-scroll-left::before,
.stack-track-wrap.can-scroll-right::after {
  opacity: 1;
}

.stack-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  /* 首尾只保留轨道自身的微小内边距，不额外制造滚动占位区域。 */
  padding: 2px 2px 18px;
  /* 不使用 scroll-snap，手动拖拽应停在用户松手的位置；分页只由按钮触发。 */
  scroll-behavior: smooth;
  scroll-padding-inline: 2px;
  scrollbar-color: #536460 transparent;
  scrollbar-width: thin;
}

.stack-track:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

.stack-card {
  /* 卡片随容器缩放，在常见宽度下保持当前卡片完整并露出下一张边框。 */
  flex: 0 0 clamp(240px, 23vw, 300px);
  min-height: 230px;
  padding: 22px;
  border: 1px solid #344143;
  border-radius: 5px;
  background: #151c1e;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 180ms ease,
    transform 180ms ease;
}

.stack-card:hover {
  border-color: #647b75;
  transform: translateY(-3px);
}

.stack-card-link {
  display: block;
  margin-top: 24px;
  color: #71817d;
  font: 11px var(--font-mono);
  transition: color 180ms ease;
}

.stack-card:hover .stack-card-link {
  color: var(--color-accent);
}

.stack-card-index {
  color: #71817d;
  font: 12px var(--font-mono);
}

.stack-card h3 {
  margin: 48px 0 13px;
  font-size: 23px;
}

.stack-card p {
  margin: 0 0 4px;
  color: #a0ada8;
  font: 14px/1.75 var(--font-mono);
}

@media (max-width: 760px) {
  .stack-toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .stack-card {
    flex-basis: min(78vw, 300px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stack-control,
  .stack-track,
  .stack-card,
  .stack-track-wrap::before,
  .stack-track-wrap::after {
    scroll-behavior: auto;
    transition-duration: 1ms;
  }
}
</style>
