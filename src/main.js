// import routeMap from '../src/components.js'
import Vue from 'vue'

import Cookies from 'js-cookie'

import Moment from 'moment'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './utils/error-log' // error log
import 'lib-flexible/flexible'
import * as filters from './filters' // global filters
import global from './global'
// import routeMap from './components'
// 绑定 moment 进行时间格式化
Vue.prototype.$moment = Moment// 赋值使用
Vue.use(global)

/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import Box from 'src/components/Common/Box'
import SearchContainer from 'src/components/Common/SearchContainer'
import { getQueryTicket } from 'src/utils/tools'

Vue.component('Box', Box)
Vue.component('SearchContainer', SearchContainer)

if (!localStorage.getItem('ticket')) {
  if (!getQueryTicket('ticket')) {
    window.location.href = 'https://nsso.zhonganonline.com/login.html?service=za-sztest&target=' +
      encodeURIComponent(location.origin + location.pathname + '#/dashboard')
  }
}

import 'src/directive/directive'
// 导入过滤器
import 'src/filters/filter'

import 'src/utils/useElement'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  async created() {
    const accessRoutes = await store.dispatch('permission/generateRoutes')
    router.addRoutes(accessRoutes)
  },
  methods: {
  },
  render: h => h(App)
})
