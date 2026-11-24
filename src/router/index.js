import { createRouter, createWebHistory } from 'vue-router'

const homeScrollPosition = { top: 0 }

// 目前有两类详情页，返回首页时都需要恢复或定位，统一放在这里判断。
const detailPrefixes = ['/toolbox/', '/archive/']

function isDetailPath(path) {
  return detailPrefixes.some((prefix) => path.startsWith(prefix))
}

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
      path: '/archive/:archiveId',
      component: () => import('../views/archive/ArchiveDetail.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from) {
    if (to.path === '/' && isDetailPath(from.path)) {
      return new Promise((resolve) => {
        // 等首页 DOM 完成挂载后恢复位置，否则滚动高度可能还未准备好。
        globalThis.setTimeout(() => {
          resolve(
            to.hash
              ? { el: to.hash, behavior: 'auto' }
              : { ...homeScrollPosition, behavior: 'auto' }
          )
        }, 0)
      })
    }

    // 带锚点的跳转（例如从详情页返回收藏分区）优先定位到目标位置。
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from) => {
  // 在路由切换真正开始前读取位置，避免组件卸载或浏览器滚动重置影响记录结果。
  if (from.path === '/' && isDetailPath(to.path)) {
    homeScrollPosition.top = globalThis.scrollY
  }
})

export default router
