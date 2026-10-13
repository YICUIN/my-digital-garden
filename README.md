# my-digital-garden

一个面向前端开发者的个人空间，记录技术积累、兴趣内容、游戏体验和可持续整理的资源。

## 项目定位

这个项目不是传统简历页面，而是一个持续更新的个人档案：

- 记录 Vue、Nuxt、JavaScript、TypeScript 等技术积累
- 展示个人兴趣和游戏内容
- 收集技术、图片、工具等资源
- 为后续扩展工具箱详情页和内容系统预留结构

## 技术栈

- Vue 3
- Vite
- Vue Router
- Pinia
- JavaScript
- ESLint
- Prettier

## 当前功能

- 个人介绍首页
- 近期状态卡片切换
- 工具箱横向卡片浏览
- 工具箱卡片路由跳转
- 工具箱统一详情页外壳
- 资源分类筛选和收藏状态
- 返回顶部组件
- 响应式布局
- 统一的悬浮交互样式

## 工具箱路由

```text
/toolbox/vue
/toolbox/nuxt
/toolbox/javascript
/toolbox/interface
/toolbox/minecraft
```

工具箱详情页采用统一页面外壳，并按工具箱 ID 加载不同配置。后续可以继续扩展：

```text
/toolbox/:toolboxId/:sectionId
```

## 项目结构

```text
src/
├─ components/             # 可复用 Vue 组件
├─ data/                   # 首页和工具箱本地数据
├─ router/                 # Vue Router 配置
├─ stores/                 # Pinia 状态
├─ styles/                 # 按职责拆分的全局样式
├─ views/                  # 页面视图
└─ App.vue                # RouterView 根组件
```

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

格式化代码：

```bash
npm run format
```

执行代码检查：

```bash
npm run lint
```

生产构建：

```bash
npm run build
```

## 开发约定

- 新增文件统一使用 UTF-8 编码
- Vue 单文件组件使用 `<template>` 在前、`<script>` 在后的顺序
- 新增代码配套必要注释，说明设计意图、交互规则或边界处理
- 组件专属样式使用 `<style scoped>`
- 全局样式通过 `src/styles/index.css` 统一引入
- 当前内容优先使用本地数据，后续再评估内容服务或后端方案

## 开发计划

详细计划记录在 [PROJECT_PLAN.md](./PROJECT_PLAN.md) 中。当前下一步是完善 Vue 工具箱样板页面，再逐步扩展 Nuxt、JavaScript、Interface 和 Minecraft 的独立内容模块。
