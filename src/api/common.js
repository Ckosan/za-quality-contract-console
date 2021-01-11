import request from '@/http'
export function getSystemEnum() {
  return request({
    url: '/system/enum'
  })
}
export function getLogout() {
  return request({
    url: '/logout'
  })
}
export function getSystemProductList() {
  return request({
    url: '/system/productList'
  })
}

