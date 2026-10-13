import { createRouter, createWebHistory } from 'vue-router'

const homeScrollPosition = { top: 0 }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/toolbox/:toolboxId',
      component: () => import('../views/toolbox/ToolboxDetail.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from) {
    if (to.path === '/' && from.path.startsWith('/toolbox/')) {
      return new Promise((resolve) => {
        // 等首页 DOM 完成挂载后恢复位置，否则滚动高度可能还未准备好。
        globalThis.setTimeout(() => resolve({ ...homeScrollPosition, behavior: 'auto' }), 0)
      })
    }

    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from) => {
  // 在路由切换真正开始前读取位置，避免组件卸载或浏览器滚动重置影响记录结果。
  if (from.path === '/' && to.path.startsWith('/toolbox/')) {
    homeScrollPosition.top = globalThis.scrollY
  }
})

export default router
