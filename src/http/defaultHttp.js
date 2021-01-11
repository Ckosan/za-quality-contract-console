import _axios from 'axios'

const axios = _axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  maxContentLength: 2000,
  withCredentials: true
})

export default (options) => {
  if (!options.method) {
    options.method = 'post'
  } else {
    options.method = options.method.toLocaleLowerCase()
  }
  return axios({
    ...options
  })
}
