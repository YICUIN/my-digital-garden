/**
 * 工具箱页面的基础配置。页面外壳只依赖这些通用字段，具体内容可以在各自模块中继续扩展。
 */
export const toolboxConfig = {
  vue: {
    id: 'vue',
    title: 'Vue',
    eyebrow: 'TOOLBOX / FRONTEND',
    description: '记录 Vue 生态中的实践、理解和重新捡起来的知识。',
    sections: ['概览', 'Composition API', 'Pinia']
  },
  nuxt: {
    id: 'nuxt',
    title: 'Nuxt',
    eyebrow: 'TOOLBOX / FRAMEWORK',
    description: '关于 SSR、内容驱动和 Nuxt 工程实践的整理。',
    sections: ['概览', '路由与渲染', 'Nuxt Content']
  },
  javascript: {
    id: 'javascript',
    title: 'JavaScript',
    eyebrow: 'TOOLBOX / LANGUAGE',
    description: 'JavaScript 与 TypeScript 的日常积累和工程记录。',
    sections: ['概览', 'TypeScript', '工程化']
  },
  interface: {
    id: 'interface',
    title: 'Interface',
    eyebrow: 'TOOLBOX / DESIGN',
    description: '界面、交互和组件细节的观察与实践。',
    sections: ['概览', '布局', '交互']
  },
  minecraft: {
    id: 'minecraft',
    title: '我的世界',
    eyebrow: 'TOOLBOX / GAME',
    description: '记录建造、探索、生存和那些值得回看的世界。',
    sections: ['概览', '生存指南', '建筑记录']
  },
  python: {
    id: 'python',
    title: 'Python',
    eyebrow: 'TOOLBOX / LANGUAGE',
    description: '基础语法、数据结构与脚本实践的实验区。',
    sections: ['概览', '基础语法', '脚本']
  },
  shell: {
    id: 'shell',
    title: 'Shell',
    eyebrow: 'TOOLBOX / TOOLING',
    description: 'Linux、Bash 和命令行工具的使用记录。',
    sections: ['概览', 'Bash', '命令行工具']
  }
}
