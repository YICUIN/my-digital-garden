<template>
  <Transition :name="transitionName" mode="out-in">
    <div
      v-if="currentCard"
      :key="currentCard.id"
      class="now-card-content"
      tabindex="0"
      :style="{ '--card-accent': currentCard.accent }"
      @keydown="handleKeydown"
      @mouseenter="stopAutoUpdate"
      @mouseleave="startAutoUpdate"
      @focusin="stopAutoUpdate"
      @focusout="handleFocusOut"
    >
      <div class="card-heading">
        <span>{{ currentCard.label }} / {{ displayDate }}</span>
        <span class="pulse" aria-hidden="true">●</span>
      </div>

      <div class="now-main">
        <span class="giant-index" aria-hidden="true">{{ displayIndex }}</span>
        <div class="now-copy">
          <h2>{{ currentCard.title }}</h2>
          <p>{{ currentCard.description }}</p>
        </div>
      </div>

      <div class="now-footer">
        <div class="now-focus">
          <span>FOCUS</span>
          <strong>{{ currentCard.focus }}</strong>
        </div>

        <div
          v-if="hasMultipleCards"
          class="now-controls"
          :aria-label="`第 ${displayIndex} 张，共 ${totalCards} 张`"
        >
          <button
            type="button"
            class="now-control"
            :disabled="activeIndex === 0"
            aria-label="查看上一张状态卡片"
            title="上一张"
            @click="switchCard(-1)"
          >
            ←
          </button>
          <span aria-hidden="true">{{ displayIndex }} / {{ totalCards }}</span>
          <button
            type="button"
            class="now-control"
            :disabled="activeIndex === orderedCards.length - 1"
            aria-label="查看下一张状态卡片"
            title="下一张"
            @click="switchCard(1)"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <!-- 数据尚未加载或为空时不渲染内容，避免出现不完整的空卡片。 -->
    <p v-else class="now-empty">暂无近期状态</p>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

// 接收父组件传入的 props 数据
const props = defineProps({
  // 组件只接收数据，不把文案写死在模板里，方便后续替换成 CMS 或 API 数据。
  cards: {
    type: Array,
    default: () => []
  },
  // 自动切换默认关闭。个人状态卡片偏阅读内容，不应在用户阅读时自行跳走。
  autoUpdate: {
    type: Boolean,
    default: false
  },
  // 仅当 autoUpdate 为 true 时生效，单位为毫秒。
  autoUpdateInterval: {
    type: Number,
    default: 8000
  }
})

const activeIndex = ref(0)
const transitionName = ref('now-card-next')
let autoUpdateTimer

// 复制后排序，避免直接修改父组件传入的 props。最新日期的卡片始终排在第一位。
const orderedCards = computed(() => [...props.cards].sort((a, b) => b.date.localeCompare(a.date)))
const currentCard = computed(() => orderedCards.value[activeIndex.value])
const hasMultipleCards = computed(() => orderedCards.value.length > 1)
const displayIndex = computed(() => String(activeIndex.value + 1).padStart(2, '0'))
const totalCards = computed(() => String(orderedCards.value.length).padStart(2, '0'))

// YYYY-MM-DD 仅用于数据排序；展示时转成更适合界面的 YYYY.MM。
const displayDate = computed(() => currentCard.value?.date.slice(0, 7).replace('-', '.') ?? '')

function switchCard(direction) {
  const nextIndex = activeIndex.value + direction

  // 到达首尾时禁用切换，而非循环跳转，避免用户失去当前内容的位置感。
  if (nextIndex < 0 || nextIndex >= orderedCards.value.length) return

  // 记录切换方向，让动画方向与用户点击的左右按钮保持一致。
  transitionName.value = direction > 0 ? 'now-card-next' : 'now-card-prev'
  activeIndex.value = nextIndex
}

function handleKeydown(event) {
  if (!hasMultipleCards.value) return

  if (event.key === 'ArrowLeft') switchCard(-1)
  if (event.key === 'ArrowRight') switchCard(1)
}

function stopAutoUpdate() {
  globalThis.clearInterval(autoUpdateTimer)
  autoUpdateTimer = undefined
}

function startAutoUpdate() {
  stopAutoUpdate()

  if (!props.autoUpdate || !hasMultipleCards.value) return

  autoUpdateTimer = globalThis.setInterval(() => {
    // 自动切换可以循环，手动按钮仍保持明确的首尾边界。
    transitionName.value = 'now-card-next'
    activeIndex.value = (activeIndex.value + 1) % orderedCards.value.length
  }, props.autoUpdateInterval)
}

function handleFocusOut(event) {
  // 焦点从组件内部的按钮移动到另一个内部控件时，不应重新启动计时器。
  if (event.currentTarget.contains(event.relatedTarget)) return
  startAutoUpdate()
}

// 数据或配置变动时重建计时器，并确保当前索引仍然在有效范围内。
watch(
  [orderedCards, () => props.autoUpdate, () => props.autoUpdateInterval],
  () => {
    if (activeIndex.value >= orderedCards.value.length) activeIndex.value = 0
    startAutoUpdate()
  },
  { immediate: true }
)

// 组件卸载时清理计时器，避免页面离开后仍保留无效任务。
onBeforeUnmount(stopAutoUpdate)
</script>

<style scoped>
/* 卡片内部样式只属于 NowCard，避免继续堆积到全局 styles.css。 */
.now-card-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  outline: none;
}

.now-card-content:focus-visible {
  outline: 2px solid var(--card-accent);
  outline-offset: 4px;
}

.card-heading {
  display: flex;
  justify-content: space-between;
  color: #9aa6a5;
  font:
    12px 'DM Mono',
    monospace;
}

.pulse {
  color: var(--card-accent, #9de5aa);
}

.now-main {
  display: flex;
  flex: 1;
  align-items: center;
}

.giant-index {
  color: #293638;
  font:
    100px/1 'DM Mono',
    monospace;
}

.now-copy {
  position: relative;
  margin: 25px 0 0 -15px;
}

.now-copy h2 {
  margin: 0 0 8px;
  color: #e1e8e3;
  /* 卡片标题承担主要信息识别，避免在深色面板中显得过轻。 */
  font-size: 17px;
  font-weight: 600;
  line-height: 1.55;
}

.now-copy p {
  max-width: 185px;
  margin: 0;
  color: #c8d0cc;
  font-size: 14px;
  line-height: 1.85;
}

.now-footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid #344143;
  color: #81908c;
}

.now-focus {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font:
    11px 'DM Mono',
    monospace;
}

.now-footer strong {
  color: #e1e8e3;
  font-weight: normal;
}

.now-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #899692;
  font:
    11px 'DM Mono',
    monospace;
}

.now-control {
  width: 24px;
  height: 24px;
  border: 1px solid #3a4647;
  border-radius: 3px;
  background: transparent;
  color: #dce4df;
  line-height: 1;
}

.now-control:hover:not(:disabled) {
  border-color: var(--card-accent, #9de5aa);
  color: var(--card-accent, #9de5aa);
}

.now-control:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.now-empty {
  margin: auto;
  color: #8d9a96;
  font-size: 13px;
}

/* next 表示向左离开、从右侧进入；prev 则反过来。 */
.now-card-next-enter-active,
.now-card-next-leave-active,
.now-card-prev-enter-active,
.now-card-prev-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.now-card-next-enter-from {
  opacity: 0;
  transform: translateX(14px);
}

.now-card-next-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}

.now-card-prev-enter-from {
  opacity: 0;
  transform: translateX(-14px);
}

.now-card-prev-leave-to {
  opacity: 0;
  transform: translateX(14px);
}

@media (prefers-reduced-motion: reduce) {
  .now-card-next-enter-active,
  .now-card-next-leave-active,
  .now-card-prev-enter-active,
  .now-card-prev-leave-active {
    transition-duration: 1ms;
  }
}
</style>
