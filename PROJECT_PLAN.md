# Personal Space 工程计划

## 项目定位

这是一个面向个人介绍、兴趣记录、技术积累和资源分享的个人空间。第一阶段使用 Vue 3、Pinia 和本地数据完成前端体验，后续再评估 Nuxt Content、Supabase 或自建 API。

## 工具箱页面设计

工具箱采用“统一入口 + 动态路由 + 按 ID 分离内容”的设计：

```text
/toolbox/vue
/toolbox/nuxt
/toolbox/javascript
/toolbox/interface
/toolbox/minecraft
```

统一页面外壳负责返回入口、工具箱标题、简介、面包屑、子分类导航和内容区域。不同工具箱可以拥有不同的数据结构和内容组件，避免把所有差异堆进一个巨大页面。

未来的子页面结构：

```text
/toolbox/:toolboxId/:sectionId
```

示例：

```text
/toolbox/vue/composition-api
/toolbox/vue/pinia
/toolbox/minecraft/survival
/toolbox/minecraft/redstone
```

推荐代码边界：

```text
src/
├─ components/toolbox/
│  ├─ ToolboxHeader.vue
│  ├─ ToolboxSidebar.vue
│  ├─ ToolboxSectionList.vue
│  └─ ToolboxContent.vue
├─ data/toolbox/
│  ├─ toolbox.config.js
│  ├─ vue/
│  ├─ nuxt/
│  └─ minecraft/
└─ views/toolbox/
   └─ ToolboxDetail.vue
```

当前先以 Vue 工具箱作为样板，验证统一页面外壳、动态路由、子分类导航和内容展示，再扩展 Nuxt、JavaScript、Interface 和 Minecraft。

## 工程计划表

状态说明：`待开始`、`进行中`、`已完成`、`暂缓`。

| 编号 | 阶段       | 任务                    | 产出                         | 状态   | 备注                                               |
| ---- | ---------- | ----------------------- | ---------------------------- | ------ | -------------------------------------------------- |
| 01   | 基础工程   | Vue 3 + Vite 项目初始化 | 可运行的前端项目             | 已完成 | 已有基础页面与 Pinia                               |
| 02   | 基础工程   | 接入 Prettier 与 ESLint | 统一格式和代码检查           | 已完成 | 已配置保存格式化                                   |
| 03   | 基础工程   | 全局 CSS 按职责拆分     | `src/styles/` 样式体系       | 已完成 | 入口、基础、布局、交互、响应式已拆分               |
| 04   | 首页体验   | 个人介绍首屏            | 首屏介绍与状态卡片           | 已完成 | 支持状态卡片切换                                   |
| 05   | 首页体验   | 工具箱横向卡片          | 可横向浏览的工具箱           | 已完成 | 已加入 Vue、Nuxt、JavaScript、Interface、Minecraft |
| 06   | 首页体验   | 工具箱卡片跳转          | 卡片进入对应工具箱页面       | 待开始 | 等待路由与页面外壳                                 |
| 07   | 工具箱架构 | 配置工具箱基础信息      | `toolbox.config.js`          | 待开始 | 包含标题、简介、图标或主题色                       |
| 08   | 工具箱架构 | Vue 动态详情页          | `/toolbox/vue`               | 待开始 | 作为第一个样板页面                                 |
| 09   | 工具箱架构 | 工具箱统一页面外壳      | 标题、返回、面包屑、内容布局 | 待开始 | 允许不同工具箱复用                                 |
| 10   | 工具箱架构 | Vue 子分类页面          | `/toolbox/vue/:sectionId`    | 待开始 | Composition API、Pinia 等                          |
| 11   | 工具箱架构 | Nuxt 内容模块           | Nuxt 页面与数据              | 待开始 | 复用外壳，允许内容差异                             |
| 12   | 工具箱架构 | Minecraft 内容模块      | 生存、红石、建筑等内容       | 待开始 | 评估是否需要独立内容组件                           |
| 13   | 内容系统   | Markdown 或本地内容层   | 可维护的内容数据             | 暂缓   | 页面结构稳定后再决定                               |
| 14   | 内容系统   | 后端或内容服务          | 内容管理和持久化             | 暂缓   | 当前不作为前置条件                                 |
| 15   | 发布部署   | 生产构建与部署          | 可访问的线上站点             | 待开始 | 需要用户明确要求后执行构建                         |

## 当前开发顺序

1. 增加 Vue Router 和工具箱动态路由。
2. 创建工具箱配置数据和统一详情页外壳。
3. 让工具箱卡片跳转到 `/toolbox/:toolboxId`。
4. 先完成 Vue 工具箱样板和一个子分类页面。
5. 根据样板使用反馈，再扩展 Nuxt 和 Minecraft。

## 进度维护规则

- 每完成一个阶段，更新对应表格的状态和备注。
- 发生设计调整时，先更新“工具箱页面设计”，再修改代码。
- 未经确认的想法记录为“待开始”或“暂缓”，不直接视为已确定需求。
