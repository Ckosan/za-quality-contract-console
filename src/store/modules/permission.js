import { constantRoutes } from '@/router'
import routeMap from '../../components.js'
import { getUserInfo } from '../../utils/tools'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 获取动态路由
export function formatRoutes(routes) {
  routes.length && routes.forEach(route => {
    if (route.component) {
      route.component = routeMap[route.component]
      route.hidden = !route.show
      route.meta = { title: route.title, icon: route.icon, noCache: true, affix: true }
      if (route.children === []) {
        route.children = []
      } else {
        route.children.length && route.children.forEach(children => {
          children.component = routeMap[children.component]
          children.hidden = !children.show
          children.meta = { title: children.title, icon: children.icon, noCache: true, affix: true }
        })
      }
    }
  })
  return routes
}
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
const actions = {
  generateRoutes({ commit }, roles = 'admin') {
    return new Promise(resolve => {
      var menuData = JSON.parse(sessionStorage.getItem('menuData'))
      if (menuData == null) {
        // getUserInfo()
        getUserInfo()
        menuData = JSON.parse(sessionStorage.getItem('menuData'))
      }
      const routeData = formatRoutes(menuData)
      commit('SET_ROUTES', routeData)
      resolve(routeData)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
