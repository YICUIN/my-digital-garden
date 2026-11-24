<template>
  <main v-if="entry" class="archive-page shell">
    <header class="archive-hero">
      <div class="hero-top">
        <RouterLink class="archive-back" :to="{ path: '/', hash: '#archive' }">
          ← 返回 03 / ARCHIVE
        </RouterLink>
        <span class="hero-version">BUILD {{ entry.version }}</span>
      </div>

      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">{{ entry.eyebrow }}</p>
          <h1>{{ entry.title }}</h1>
          <p class="hero-subtitle">{{ entry.subtitle }}</p>
          <p class="hero-description">{{ entry.description }}</p>
          <div class="hero-tags">
            <span v-for="tag in entry.tags" :key="tag">{{ tag }}</span>
          </div>
          <div class="hero-actions">
            <a class="primary-button hover-lift" href="#overview">
              开始阅读 <span class="button-arrow" aria-hidden="true">↓</span>
            </a>
            <RouterLink class="text-link" :to="{ path: '/', hash: '#archive' }">
              更多收藏 <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>

        <!-- 纯 CSS 的夜色视觉：不依赖游戏截图，避免档案页额外引入大图。 -->
        <div class="hero-visual" aria-hidden="true">
          <div class="night-sky">
            <span class="night-word">NO<br />DAWN</span>
            <span class="night-horizon"></span>
            <span class="night-glow"></span>
            <span class="night-light"></span>
          </div>
          <p class="night-caption">{{ entry.subtitle }} / GODOT 4.7.2</p>
        </div>
      </div>

      <dl class="meta-grid">
        <div v-for="item in entry.meta" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
    </header>

    <div class="archive-body">
      <aside class="archive-sidebar" aria-label="档案章节">
        <p class="sidebar-label">CONTENTS</p>
        <nav>
          <a
            v-for="section in entry.sections"
            :key="section.id"
            :href="`#${section.id}`"
            :class="{ active: activeSection === section.id }"
            :aria-current="activeSection === section.id ? 'location' : undefined"
          >
            <span>{{ section.kicker }}</span
            >{{ section.title }}
          </a>
        </nav>
        <p class="sidebar-foot">{{ entry.subtitle }}</p>
      </aside>

      <section class="archive-content">
        <article
          v-for="section in entry.sections"
          :id="section.id"
          :key="section.id"
          class="archive-entry"
        >
          <header class="entry-head">
            <span class="entry-index">{{ section.kicker }}</span>
            <h2>{{ section.title }}</h2>
          </header>

          <p v-if="section.lead" class="entry-lead">{{ section.lead }}</p>
          <p v-for="(paragraph, index) in section.paragraphs" :key="`p-${index}`">
            {{ paragraph }}
          </p>

          <blockquote v-if="section.quote" class="entry-quote">{{ section.quote }}</blockquote>

          <ol v-if="section.steps" class="entry-steps">
            <li v-for="(step, index) in section.steps" :key="`step-${index}`">
              <p v-if="isTextStep(step)">{{ step }}</p>
              <template v-else>
                <h3>{{ step.title }}</h3>
                <p>{{ step.text }}</p>
              </template>
            </li>
          </ol>

          <div v-if="section.points" class="entry-points">
            <div v-for="point in section.points" :key="point.title">
              <h3>{{ point.title }}</h3>
              <p>{{ point.text }}</p>
            </div>
          </div>

          <div v-if="section.controls" class="entry-controls">
            <table>
              <thead>
                <tr>
                  <th v-for="column in section.controls.columns" :key="column">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in section.controls.rows" :key="row[0]">
                  <td v-for="(cell, index) in row" :key="`cell-${index}`">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ol v-if="section.timeline" class="entry-timeline">
            <li v-for="item in section.timeline" :key="`${item.version}-${item.title}`">
              <span class="timeline-version">{{ item.version }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </li>
          </ol>

          <div v-if="section.note" class="entry-note" role="note">
            <strong>{{ section.note.title }}</strong>
            <p>{{ section.note.text }}</p>
          </div>
        </article>

        <footer class="archive-foot">
          <div>
            <p class="section-number">END / {{ entry.title }}</p>
            <p>档案会随版本继续补。想找别的收藏，回到 03 / ARCHIVE。</p>
          </div>
          <RouterLink class="primary-button hover-lift" :to="{ path: '/', hash: '#archive' }">
            返回收藏 <span aria-hidden="true">→</span>
          </RouterLink>
        </footer>
      </section>
    </div>
  </main>

  <main v-else class="archive-empty shell">
    <p class="eyebrow">ARCHIVE / NOT FOUND</p>
    <h1>这份档案还没有建立。</h1>
    <RouterLink class="primary-button hover-lift" :to="{ path: '/', hash: '#archive' }">
      返回收藏
    </RouterLink>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { archiveEntries } from '../../data/archive'

const route = useRoute()

// 动态路由只负责定位档案，内容全部来自数据文件，模板不关心具体游戏。
const entry = computed(() => archiveEntries[route.params.archiveId])

const activeSection = ref('')
let frameId = 0

// 下载步骤是纯文本，其他章节步骤带标题；模板里用这个小判断区分两种渲染。
function isTextStep(step) {
  return typeof step === 'string'
}

function syncActiveSection() {
  const sections = entry.value?.sections ?? []
  let current = sections[0]?.id ?? ''

  for (const section of sections) {
    const target = document.getElementById(section.id)
    // 以视口上方 150px 为基准线：章节标题越过基准线，就认为阅读进入该章节。
    if (target && target.getBoundingClientRect().top <= 150) current = section.id
  }

  activeSection.value = current
}

// 滚动事件只触发一次重排，避免长列表滚动时反复计算每个章节的位置。
function handleScroll() {
  if (frameId) return

  frameId = globalThis.requestAnimationFrame(() => {
    frameId = 0
    syncActiveSection()
  })
}

onMounted(() => {
  syncActiveSection()
  globalThis.addEventListener('scroll', handleScroll, { passive: true })
  globalThis.addEventListener('resize', handleScroll)
})

onBeforeUnmount(() => {
  globalThis.removeEventListener('scroll', handleScroll)
  globalThis.removeEventListener('resize', handleScroll)
  if (frameId) globalThis.cancelAnimationFrame(frameId)
})

// 在档案之间跳转时会复用当前组件，需要等新内容挂载后重新计算当前章节。
watch(
  () => route.params.archiveId,
  async () => {
    await nextTick()
    syncActiveSection()
  }
)
</script>

<style scoped>
/* 档案页样式：沿用首页的深色排版，同时用夜色视觉区分游戏档案。 */
.archive-page {
  min-height: 100vh;
  padding-bottom: 72px;
}

.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 32px;
  margin-bottom: 72px;
}

.archive-back {
  color: #aeb9b5;
  font-size: 14px;
  transition: color 180ms ease;
}

.archive-back:hover {
  color: var(--color-accent);
}

.hero-version {
  color: #71817d;
  font: 11px var(--font-mono);
  letter-spacing: 0.12em;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 56px;
  align-items: stretch;
}

.hero-copy h1 {
  margin: 12px 0 10px;
  font-size: clamp(46px, 6.4vw, 82px);
  line-height: 1.08;
}

.hero-subtitle {
  margin: 0 0 26px;
  color: #7f8f8a;
  font: 12px var(--font-mono);
  letter-spacing: 0.18em;
}

.hero-description {
  max-width: 520px;
  color: var(--color-subtle);
  font-size: 18px;
  line-height: 1.9;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 26px;
}

.hero-tags span {
  padding: 4px 9px;
  border: 1px solid #344143;
  border-radius: 2px;
  color: #9aa8a3;
  font: 11px var(--font-mono);
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
}

.hero-visual {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
}

.night-sky {
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 320px;
  border: 1px solid #33413f;
  border-radius: 4px;
  background: linear-gradient(180deg, #0c1214 0%, #101a1c 58%, #1a2527 100%);
}

/* 星点用重复径向渐变铺出来，避免额外请求图片资源。 */
.night-sky::before {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#cfdad4 0.7px, transparent 0.7px);
  background-size: 53px 47px;
  content: '';
  opacity: 0.26;
}

.night-sky::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(16, 20, 24, 0.55),
    transparent 35%,
    transparent 72%,
    rgba(16, 20, 24, 0.6)
  );
  content: '';
}

.night-word {
  position: absolute;
  top: 22px;
  left: 22px;
  z-index: 1;
  color: #e7ece9;
  font: 600 40px/1 var(--font-mono);
  letter-spacing: 0.14em;
  opacity: 0.07;
}

.night-horizon {
  position: absolute;
  right: 0;
  bottom: 34%;
  left: 0;
  z-index: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #61736c, transparent);
}

.night-glow {
  position: absolute;
  bottom: -46%;
  left: 50%;
  z-index: 1;
  width: 82%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(240, 202, 112, 0.5) 0%,
    rgba(240, 202, 112, 0.14) 42%,
    transparent 66%
  );
  filter: blur(8px);
  transform: translateX(-50%);
  animation: lantern-breathe 7s ease-in-out infinite;
}

.night-light {
  position: absolute;
  bottom: calc(34% - 3px);
  left: 50%;
  z-index: 2;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f7dda0;
  box-shadow:
    0 0 22px 6px rgba(240, 202, 112, 0.45),
    0 0 60px 18px rgba(240, 202, 112, 0.18);
}

.night-caption {
  margin: 0;
  color: #7f8f8a;
  font: 11px var(--font-mono);
  letter-spacing: 0.14em;
}

@keyframes lantern-breathe {
  0%,
  100% {
    opacity: 0.72;
  }

  50% {
    opacity: 1;
  }
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 18px;
  padding-top: 24px;
  margin: 56px 0 0;
  border-top: 1px solid var(--color-line);
}

.meta-grid dt {
  margin-bottom: 6px;
  color: #71817d;
  font: 11px var(--font-mono);
  letter-spacing: 0.08em;
}

.meta-grid dd {
  margin: 0;
  color: #dbe4df;
  font-size: 15px;
}

.archive-body {
  display: grid;
  grid-template-columns: 214px minmax(0, 1fr);
  gap: 64px;
  padding-top: 44px;
  border-top: 1px solid var(--color-line);
}

.archive-sidebar {
  position: sticky;
  top: 32px;
  align-self: start;
}

.sidebar-label {
  margin: 0 0 18px;
  color: #71817d;
  font: 11px var(--font-mono);
  letter-spacing: 0.1em;
}

.archive-sidebar nav {
  display: grid;
  gap: 2px;
}

.archive-sidebar nav a {
  display: flex;
  gap: 12px;
  padding: 9px 0;
  color: #8d9a96;
  font-size: 14px;
  transition: color 180ms ease;
}

.archive-sidebar nav a span {
  padding-top: 2px;
  color: #53625f;
  font: 11px var(--font-mono);
}

.archive-sidebar nav a:hover,
.archive-sidebar nav a.active {
  color: var(--color-accent);
}

.archive-sidebar nav a.active span {
  color: var(--color-accent);
}

.sidebar-foot {
  padding-top: 16px;
  margin: 28px 0 0;
  border-top: 1px solid #263032;
  color: #5c6a67;
  font: 10px var(--font-mono);
  letter-spacing: 0.1em;
}

.archive-content {
  min-width: 0;
  max-width: 720px;
}

.archive-entry {
  padding: 8px 0 52px;
  scroll-margin-top: 28px;
}

.archive-entry + .archive-entry {
  padding-top: 44px;
  border-top: 1px solid var(--color-line);
}

.entry-head {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 22px;
}

.entry-index {
  color: var(--color-accent);
  font: 12px var(--font-mono);
}

.entry-head h2 {
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.4;
}

.archive-entry > p {
  max-width: 660px;
  color: var(--color-subtle);
  font-size: 16px;
  line-height: 1.95;
}

.archive-entry > p.entry-lead {
  max-width: 600px;
  padding-left: 18px;
  border-left: 2px solid var(--color-accent);
  color: #dde6e1;
  font-size: 22px;
  line-height: 1.65;
}

.entry-quote {
  max-width: 600px;
  padding: 24px 0 0;
  margin: 30px 0 0;
  border-top: 1px solid #344143;
  color: #d6e0db;
  font-size: 20px;
  line-height: 1.8;
}

.entry-steps,
.entry-timeline {
  padding: 0;
  margin: 26px 0 0;
  list-style: none;
}

.entry-steps {
  counter-reset: step;
}

.entry-steps li {
  position: relative;
  padding: 16px 0 16px 58px;
  border-top: 1px solid #2b3436;
  counter-increment: step;
}

.entry-steps li::before {
  position: absolute;
  top: 18px;
  left: 0;
  color: var(--color-accent);
  content: '0' counter(step);
  font: 12px var(--font-mono);
}

.entry-steps h3,
.entry-timeline h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.entry-steps p,
.entry-timeline p {
  margin: 0;
  color: #93a19c;
  font-size: 14px;
  line-height: 1.8;
}

.entry-points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 26px;
}

.entry-points > div {
  padding: 16px 18px;
  border: 1px solid #2f3d3f;
  border-radius: 4px;
  background: #141c1e;
}

.entry-points h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

.entry-points p {
  margin: 0;
  color: #93a19c;
  font-size: 14px;
  line-height: 1.8;
}

.entry-controls {
  margin-top: 26px;
}

.entry-controls table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.entry-controls th {
  padding: 10px 12px;
  border-bottom: 1px solid #3a4647;
  color: #8d9a96;
  font: 11px var(--font-mono);
  letter-spacing: 0.08em;
  text-align: left;
}

.entry-controls td {
  padding: 11px 12px;
  border-bottom: 1px solid #232d2e;
  color: #b9c4bf;
}

.entry-controls td:first-child {
  width: 44%;
  color: #e3eae6;
  font: 13px var(--font-mono);
}

.entry-controls tbody tr:hover td {
  background: #161f21;
}

.entry-timeline li {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 18px;
  padding: 16px 0;
  border-top: 1px solid #2b3436;
}

.timeline-version {
  padding-top: 3px;
  color: var(--color-accent);
  font: 12px var(--font-mono);
}

.entry-note {
  padding: 14px 18px;
  margin-top: 24px;
  border-left: 2px solid #f0ca70;
  background: rgba(240, 202, 112, 0.06);
}

.entry-note strong {
  display: block;
  margin-bottom: 6px;
  color: #f0ca70;
  font: 11px var(--font-mono);
  letter-spacing: 0.08em;
}

.entry-note p {
  margin: 0;
  color: #b7c2bd;
  font-size: 14px;
  line-height: 1.8;
}

.archive-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding-top: 34px;
  border-top: 1px solid var(--color-line);
}

.archive-foot > div p:last-child {
  max-width: 380px;
  margin: 0;
  color: #8e9b97;
  font-size: 14px;
  line-height: 1.8;
}

.archive-foot .primary-button {
  flex: 0 0 auto;
}

.archive-empty {
  min-height: 100vh;
  padding-top: 120px;
}

.archive-empty h1 {
  margin: 22px 0 32px;
  font-size: clamp(38px, 6vw, 70px);
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .night-sky {
    min-height: 260px;
  }

  .hero-visual {
    order: 2;
  }
}

@media (max-width: 760px) {
  .hero-top {
    margin-bottom: 54px;
  }

  .hero-description {
    font-size: 16px;
  }

  .meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 40px;
  }

  .archive-body {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .archive-sidebar {
    position: static;
  }

  .archive-sidebar nav {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 6px;
  }

  .archive-sidebar nav a {
    flex: 0 0 auto;
    padding: 8px 12px;
    border: 1px solid #344143;
    border-radius: 3px;
  }

  .sidebar-foot {
    display: none;
  }

  .archive-entry + .archive-entry {
    padding-top: 36px;
  }

  .entry-head h2 {
    font-size: 25px;
  }

  .archive-entry > p.entry-lead {
    font-size: 19px;
  }

  .entry-points {
    grid-template-columns: 1fr;
  }

  .entry-timeline li {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .archive-foot {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .night-glow {
    animation: none;
  }

  .archive-back,
  .archive-sidebar nav a {
    transition-duration: 1ms;
  }
}
</style>
