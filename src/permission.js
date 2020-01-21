import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 禁止右侧加载时转圈的动画

const whiteList = ['/login', '/auth-redirect'] // 白名单

router.beforeEach(async (to, from, next) => {
  // 启动进度条
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // 从 Cookie 获取 Token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果当前路径为 login 则直接重定向至首页即/dashboard
      next({ path: '/' }) // 再次触发 beforeEach，to.path===/dashboard，执行下面的else
      NProgress.done()
    } else {
      // 判断用户的角色是否存在
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) { // 如果用户角色存在，则直接访问
        next()
      } else { // 第一次登陆，角色是不存在的，必须执行下面获取角色
        try {
          // 异步获取用户的角色
          // 角色是一个对象中的数组，如:
          // 'xxtoken': { roles: ['admin','editor']}
          // 所以通过 { roles } 获取角色
          const { roles } = await store.dispatch('user/getInfo')

          // 根据用户角色，动态生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 调用 router.addRoutes 动态添加路由，把不符合条件的路由清除，最后和原来的路由合并形成新的路由表
          router.addRoutes(accessRoutes)

          // 使用 replace 访问路由，不会在 history 中留下记录，
          // 这样回退不会回到 login 页面
          next({ ...to, replace: true })
        } catch (error) {
          // 错误处理
          // 清除 Token 数据，回到登录页重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || '出错啦')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token的情况
    if (whiteList.indexOf(to.path) !== -1) { // 如果访问的 URL 在白名单中，则直接访问
      next()
    } else {
      // 如果访问的 URL 不在白名单中，则直接重定向到登录页面，并将访问的 URL 添加到 redirect 参数中
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 设置进度条动画完成
  NProgress.done()
})
