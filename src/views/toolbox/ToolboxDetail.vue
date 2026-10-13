<template>
  <main v-if="toolbox" class="toolbox-page shell">
    <header class="toolbox-header">
      <RouterLink class="toolbox-back" to="/">← 返回个人空间</RouterLink>
      <p class="eyebrow">{{ toolbox.eyebrow }}</p>
      <h1>{{ toolbox.title }}</h1>
      <p class="toolbox-description">{{ toolbox.description }}</p>
    </header>

    <div class="toolbox-body">
      <aside class="toolbox-sidebar" aria-label="工具箱分类">
        <p class="sidebar-label">SECTIONS</p>
        <nav>
          <a
            v-for="(section, index) in toolbox.sections"
            :key="section"
            href="#"
            :class="{ active: index === 0 }"
          >
            <span>{{ String(index + 1).padStart(2, '0') }}</span
            >{{ section }}
          </a>
        </nav>
      </aside>

      <section class="toolbox-content">
        <p class="section-number">{{ toolbox.title.toUpperCase() }} / OVERVIEW</p>
        <h2>把正在学习的东西，整理成可以再次使用的内容。</h2>
        <p>
          这是
          {{ toolbox.title }}
          工具箱的第一版页面。后续会根据实际积累补充子分类、文章、示例和相关资源。
        </p>
        <div class="toolbox-placeholder">
          <span>01</span>
          <p>CONTENT MODULE<br />COMING NEXT</p>
        </div>
      </section>
    </div>
  </main>

  <main v-else class="toolbox-empty shell">
    <p class="eyebrow">TOOLBOX / NOT FOUND</p>
    <h1>这个工具箱还没有建立。</h1>
    <RouterLink class="primary-button hover-lift" to="/">返回个人空间</RouterLink>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { toolboxConfig } from '../../data/toolbox/config'

const route = useRoute()

// 动态路由只负责定位工具箱，内容配置集中在数据文件中，方便未来拆分各自模块。
const toolbox = computed(() => toolboxConfig[route.params.toolboxId])
</script>

<style scoped>
/* 工具箱详情页专属样式：页面外壳和内容导航在这里保持一致。 */
.toolbox-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

.toolbox-header {
  max-width: 760px;
  padding: 42px 0 78px;
}

.toolbox-back {
  display: inline-block;
  margin-bottom: 86px;
  color: #aeb9b5;
  font-size: 14px;
}

.toolbox-back:hover {
  color: var(--color-accent);
}

.toolbox-header h1 {
  margin: 16px 0 18px;
}

.toolbox-description {
  max-width: 560px;
  color: var(--color-subtle);
  font-size: 18px;
  line-height: 1.8;
}

.toolbox-body {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 72px;
  padding-top: 32px;
  border-top: 1px solid var(--color-line);
}

.sidebar-label {
  margin: 0 0 20px;
  color: #71817d;
  font: 12px var(--font-mono);
}

.toolbox-sidebar nav {
  display: grid;
  gap: 4px;
}

.toolbox-sidebar nav a {
  display: flex;
  gap: 14px;
  padding: 11px 0;
  color: #8d9a96;
  font-size: 14px;
}

.toolbox-sidebar nav a span {
  color: #53625f;
  font: 12px var(--font-mono);
}

.toolbox-sidebar nav a.active,
.toolbox-sidebar nav a:hover {
  color: var(--color-accent);
}

.toolbox-content {
  max-width: 650px;
}

.toolbox-content h2 {
  max-width: 540px;
  margin: 25px 0 18px;
  font-size: 32px;
  line-height: 1.45;
}

.toolbox-content > p:not(.section-number) {
  color: var(--color-subtle);
  font-size: 16px;
  line-height: 1.9;
}

.toolbox-placeholder {
  display: flex;
  align-items: end;
  gap: 18px;
  margin-top: 74px;
  padding: 22px 0 0 18px;
  border-top: 1px solid #344143;
  border-left: 1px solid #344143;
}

.toolbox-placeholder span {
  color: #293638;
  font: 110px/0.8 var(--font-mono);
}

.toolbox-placeholder p {
  margin: 0 0 3px;
  color: #71817d;
  font: 11px/1.6 var(--font-mono);
  letter-spacing: 0.08em;
}

.toolbox-empty {
  min-height: 100vh;
  padding-top: 120px;
}

.toolbox-empty h1 {
  margin: 22px 0 32px;
  font-size: clamp(38px, 6vw, 70px);
}

@media (max-width: 760px) {
  .toolbox-header {
    padding: 26px 0 58px;
  }

  .toolbox-back {
    margin-bottom: 64px;
  }

  .toolbox-description {
    font-size: 16px;
  }

  .toolbox-body {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .toolbox-sidebar nav {
    display: flex;
    gap: 10px;
    overflow-x: auto;
  }

  .toolbox-sidebar nav a {
    flex: 0 0 auto;
    padding: 8px 12px;
    border: 1px solid #344143;
    border-radius: 3px;
  }

  .toolbox-content h2 {
    font-size: 27px;
  }
}
</style>
