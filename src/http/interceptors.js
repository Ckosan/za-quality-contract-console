import _axios from 'axios'
import { Notification } from 'element-ui'
import { clearLoginInfo } from 'src/utils/tools'
import store from '@/store'
import { loadingFilterUrl } from '../utils/tools'
import router from '@/router'
console.log(process.env)
const axios = _axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3000000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': localStorage.getItem('ticket')
  },
  maxContentLength: 2000,
  withCredentials: true
})

/** 请求拦截 */
axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json', // 设置很关键
      'Authorization': localStorage.getItem('ticket'),
      'Access-Control-Allow-Origin': 'https://szapp.zhonganonline.com'
    }
    return config
  },
  err => {
    Promise.reject(err)
  }
)
/** 响应拦截 */
var rejectCount = 0
axios.interceptors.response.use(
  res => {
    store.commit('UN_REGION_LOADING')
    store.commit('UNLOADING')
    if (res.data.code === '0000') {
      return res.data
    } else if (res.data.code === '0001') {
      clearLoginInfo()
    } else if (res.data.code === '5000') {
      router.push({ path: '/404' })
    } else {
      Notification.error(res.data.message)
    }
  },
  err => {
    store.commit('UN_REGION_LOADING')
    store.commit('UNLOADING')
    // 403拦截，重定向
    if (err.response.status) {
      if (err.response.status === 401 && rejectCount === 0) {
        // eslint-disable-next-line no-const-assign
        rejectCount = rejectCount + 1
        clearLoginInfo()
        return Promise.reject(err)
      } else {
        Notification.error(err.message)
      }
    }
    return Promise.reject(err)
  }
)

export default axios

export async function httpRequest(method, url, data, params) {
  try {
    if (loadingFilterUrl(url)) {
      store.commit('REGION_LOADING')
      store.commit('LOADING')
    }
    const res = await axios({
      method: method,
      url: url,
      data: data,
      params: {
        params
      }
    })
    return new Promise((resolve, reject) => {
      try {
        if (res.data.code != '0001') {
          resolve(res.data)
        } else {
          reject(res)
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
    })
  } catch (err) {
    Notification.error(err.message)
  }
}

export async function httpRequestWithoutLoading(method, url, data, params) {
  try {
    const res = await axios({
      method: method,
      url: url,
      data: data,
      params: {
        params
      }
    })
    return new Promise((resolve, reject) => {
      try {
        if (res.data.code != '0001') {
          resolve(res.data)
        } else {
          reject(res)
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
    })
  } catch (err) {
    Notification.error(err.message)
  }
}
