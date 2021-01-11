import http from '@/http'
import defaultHttp from '@/http/defaultHttp'
export default {
  install(Vue) {
    Vue.prototype.$http = http
    Vue.prototype.$defaultHttp = defaultHttp
  }
}

