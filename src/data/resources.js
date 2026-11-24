import { evernightArchive } from './archive/evernight'

/**
 * 归档卡片数据。
 * - 普通条目只有展示字段，卡片保持纯展示；
 * - 带 to 的条目会整块变成可点击链接，进入对应详情页；
 * - 游戏卡片复用档案里的 card 摘要，避免首页与详情页各写一套介绍。
 */
export const resources = [
  {
    id: evernightArchive.id,
    ...evernightArchive.card,
    to: `/archive/${evernightArchive.id}`,
    detailLabel: '查看游戏档案'
  },
  {
    title: 'Vue 3 Composition API',
    type: '技术',
    note: '重新梳理状态、组合式函数和组件边界。',
    tags: ['Vue', '工程化'],
    color: '#7dd3a7'
  },
  {
    title: 'Nuxt Content',
    type: '技术',
    note: '把 Markdown 变成可维护的个人内容库。',
    tags: ['Nuxt', '内容'],
    color: '#8fb7ff'
  },
  {
    title: '设计灵感收集',
    type: '图片',
    note: '界面、排版和交互细节的私人参考板。',
    tags: ['视觉', '收藏'],
    color: '#f5b66f'
  },
  {
    title: '独立游戏清单',
    type: '游戏',
    note: '玩过、想玩，以及值得回味的作品。',
    tags: ['游戏', '记录'],
    color: '#e6a5c8'
  },
  {
    title: 'TypeScript 进阶',
    type: '技术',
    note: '泛型、类型体操与真实项目里的类型设计。',
    tags: ['TypeScript', '工程化'],
    color: '#bca6f4'
  },
  {
    title: '开发者工具箱',
    type: '资源',
    note: '日常使用的插件、工具、命令与模板。',
    tags: ['效率', '工具'],
    color: '#73d1cc'
  }
]
