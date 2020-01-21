import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    // 重定向路由
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)', // 如果不加 * 号，只能匹配一层 /xxx，/xx/xx更多则匹配不到
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard', // 标签显示
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true } // affix 始终在标签栏显示
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/books',
    component: Layout,
    redirect: '/books/create',
    meta: { title: '图书管理', icon: 'documentation', roles: ['admin'] },
    children: [
      {
        path: '/books/create',
        name: '上传图书',
        component: () => import('@/views/books/create'),
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'] }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
// 调用 router.addRoutes(asyncRoutes) 添加动态路由
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
