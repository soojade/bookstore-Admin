import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 使用 meta.roles 判断当前角色是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role)) // 用户的角色和路由中获取的角色是否匹配
  } else {
    // 没有设置权限，则具有所有权限
    return true
  }
}

/**
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    // 对路由进行浅拷贝，注意 children 不会拷贝，因为不需要对 children 进行判断，所以可以使用浅拷贝
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) { // 有权限后才会判断子路由
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes // addRoutes 用来保存 routes
    state.routes = constantRoutes.concat(routes) // 侧边栏菜单根据此 routes 生成
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 如果角色中包含 admin，则直接跳过判断，直接将 asyncRoutes 全部返回
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 如果角色中没有包含 admin，则调用 filterAsyncRoutes 过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 将路由保存到 vuex 中
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
