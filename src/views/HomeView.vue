<template>
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="返回顶部"
        ><span class="brand-mark">/</span> personal.space</a
      >
      <nav aria-label="页面导航">
        <a href="#about">关于</a><a href="#stack">技术</a><a href="#archive">收藏</a>
      </nav>
      <button class="icon-button" title="切换显示模式" aria-label="切换显示模式">☼</button>
    </header>

    <section id="top" class="intro section-grid">
      <div class="intro-copy">
        <p class="eyebrow"><span class="status-dot"></span> AVAILABLE FOR THE NEXT BUILD</p>
        <h1>暂时离线，<br /><em>正在重新加载。</em></h1>
        <p class="lead">
          一个前端开发者的个人空间。记录值得投入的技术、让我着迷的游戏，以及以后想认真分享出去的东西。
        </p>
        <div class="intro-actions">
          <a class="primary-button hover-lift" href="#archive"
            >浏览我的收藏 <span class="button-arrow" aria-hidden="true">↓</span></a
          >
          <a class="text-link" href="#about">认识一下 <span>→</span></a>
        </div>
      </div>
      <aside class="now-card" aria-label="目前状态">
        <NowCard :cards="nowCards" :auto-update="true" />
      </aside>
    </section>

    <section id="about" class="about section-grid">
      <div class="about-meta">
        <p class="section-number">01 / ABOUT</p>
        <!-- 个人主页链接集中放在分区左侧，后续替换为真实地址。 -->
        <div class="about-links" aria-label="相关链接">
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            <span>GitHub</span><span aria-hidden="true">↗</span>
          </a>
          <a href="https://blog.csdn.net/" target="_blank" rel="noreferrer">
            <span>CSDN</span><span aria-hidden="true">↗</span>
          </a>
          <a href="mailto:hello@example.com">
            <span>Email</span><span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div class="about-content">
        <h2>做前端，也在认真地<br />体验屏幕另一边的世界。</h2>
        <div class="about-text">
          <p>
            熟悉 Vue
            生态，也喜欢把复杂的信息整理成自然、好用的界面。现在正借这个小站，把零散的兴趣与积累慢慢收回来。
          </p>
          <p>这里不是简历的复写，而是一个持续生长的个人档案。</p>
        </div>
      </div>
    </section>

    <ToolboxSection :items="stackItems" />

    <section id="archive" class="archive-section">
      <div class="archive-head">
        <div>
          <p class="section-number">03 / ARCHIVE</p>
          <h2>随手收进来的东西</h2>
        </div>
        <p>技术、灵感、游戏和未来会扩展的更多分区。</p>
      </div>
      <div class="filter-row" role="tablist" aria-label="资源分类">
        <button
          v-for="category in categories"
          :key="category"
          :class="{ active: store.activeCategory === category }"
          @click="store.selectCategory(category)"
        >
          {{ category }}
        </button>
        <span class="resource-count">{{ filteredResources.length }} items</span>
      </div>
      <div class="resource-grid">
        <article v-for="resource in visibleResources" :key="resource.title" class="resource-card">
          <div class="resource-top">
            <span class="resource-type" :style="{ color: resource.color }">{{ resource.type }}</span
            ><button
              :class="['save-button', { saved: store.savedResources.includes(resource.title) }]"
              :aria-label="`收藏 ${resource.title}`"
              @click="store.toggleSaved(resource.title)"
            >
              ⌑
            </button>
          </div>
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.note }}</p>
          <div class="tags">
            <span v-for="tag in resource.tags" :key="tag">{{ tag }}</span>
          </div>
        </article>
      </div>
      <button v-if="filteredResources.length > 4" class="more-button" @click="showAll = !showAll">
        {{ showAll ? '收起' : '查看全部' }} <span>{{ showAll ? '↑' : '↓' }}</span>
      </button>
    </section>

    <footer>
      <span>PERSONAL SPACE</span>
      <p>持续更新中</p>
    </footer>
    <ScrollToTop />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSpaceStore } from '../stores/space'
import { resources } from '../data/resources'
import { stackItems } from '../data/stackItems'
import { nowCards } from '../data/nowCards'
import NowCard from '../components/NowCard.vue'
import ScrollToTop from '../components/ScrollToTop.vue'
import ToolboxSection from '../components/ToolboxSection.vue'

const store = useSpaceStore()
const showAll = ref(false)
const categories = ['全部', '技术', '游戏', '图片', '资源']
const filteredResources = computed(() =>
  resources.filter((item) => store.activeCategory === '全部' || item.type === store.activeCategory)
)
const visibleResources = computed(() =>
  showAll.value ? filteredResources.value : filteredResources.value.slice(0, 4)
)
</script>
