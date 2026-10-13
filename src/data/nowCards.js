/**
 * 近期状态卡片的数据源。
 *
 * `date` 使用 YYYY-MM-DD 格式，保证组件可以按字符串直接进行时间倒序排序。
 * 新增卡片时只需要补充一条完整对象，无须修改 NowCard 组件中的交互逻辑。
 */
export const nowCards = [
  {
    id: 'reboot-2026',
    date: '2026-08-01',
    label: 'CURRENT FOCUS',
    title: '重新安排技术、生活与好奇心的优先级。',
    description: '从工作模式抽离一个月后，开始重新整理自己的节奏。',
    focus: 'Vue / Nuxt / TypeScript',
    accent: '#9de5aa'
  },
  {
    id: 'vue-revisit',
    date: '2026-07-01',
    label: 'LEARNING',
    title: '重新梳理 Vue 生态。',
    description: '从 Vue 3、Pinia 和 Nuxt 开始恢复手感。',
    focus: 'Composition API / State',
    accent: '#8fb7ff'
  }
]
