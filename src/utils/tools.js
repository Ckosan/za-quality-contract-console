import moment from 'moment'
import axios, { httpRequest } from '../http/interceptors'
import { PROJECT_COUNT, SERVER_CHECK, STAFF_GET } from '../contractapi'
import Handsontable from 'handsontable'

export function loadJs(src, callback) {
  const script = document.createElement('script')
  const head = document.getElementsByTagName('head')[0]
  let loaded
  script.src = src
  if (typeof callback === 'function') {
    script.onload = script.onreadystatechange = function() {
      if (!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))) {
        script.onload = script.onreadystatechange = null
        loaded = true
        callback()
        setTimeout(() => {
          script.parentNode.removeChild(script)
        }, 200)
      }
    }
  }
  head.appendChild(script)
}

// 获取用户信息
export function getUserInfo() {
  store.commit('REGION_LOADING')
  store.commit('LOADING')
  const ticket = getQueryTicket('ticket') || localStorage.getItem('ticket')
  if (ticket) {
    localStorage.setItem('ticket', ticket)
    axios({
      method: 'POST',
      url: '/usermanager/userinfo/',
      data: {},
      async: false,
      params: {
        ticket
      }
    }
    ).then((returnData) => {
      if (isSuccessCode(returnData)) {
        window.CONTEXT = this
        returnData = returnData.data
        if (returnData && returnData.name) {
          sessionStorage.setItem('currentUserName', returnData.name)
          sessionStorage.setItem('currentUserId', returnData.user_id)
          sessionStorage.setItem('departmentName', returnData.dept)
          sessionStorage.setItem('email', returnData.email)
          sessionStorage.setItem('menuData', JSON.stringify(returnData.menu_data_vo_list))
          sessionStorage.setItem('projectCount', JSON.stringify(returnData.project_count))
          sessionStorage.setItem('appCount', JSON.stringify(returnData.app_count))
          sessionStorage.setItem('serverCount', JSON.stringify(returnData.server_count))
          removeTicket()
        }
      } else {
        this.$message.error(returnData.message)
      }
    })
  }
}

export function getProjectCount() {
  store.commit('REGION_LOADING')
  store.commit('LOADING')
  const ticket = getQueryTicket('ticket') || localStorage.getItem('ticket')
  if (ticket) {
    localStorage.setItem('ticket', ticket)
    axios({
      method: 'GET',
      url: PROJECT_COUNT,
      data: {},
      header: { Authorization: ticket },
      async: true,
      params: {
      }
    }
    ).then((returnData) => {
      if (isSuccessCode(returnData)) {
        returnData = returnData.data
        if (returnData) {
          localStorage.setItem('projectCont', returnData)
          console.log(localStorage.getItem('projectCont'))
        }
      } else {
        this.$message.error(returnData.message)
      }
    })
  }
}

export function clearLoginInfo() {
  cookie.clear()
  sessionStorage.clear()
  localStorage.clear()
  location.href = 'http://nsso.zhonganonline.com/logout?service=za-sztest&target=' + encodeURIComponent(location.origin + location.pathname + location.hash)
}

export const cookie = {
  set: function(key, val, time) {
    // 设置cookie方法
    var date = new Date() // 获取当前时间
    var expiresDays = time // 将date设置为n天以后的时间
    date.setTime(date.getTime() + expiresDays * 3600 * 1000) // 格式化为cookie识别的时间
    document.cookie = key + '=' + val + ';expires=' + date.toGMTString() // 设置cookie
  },
  get: function(key) {
    // 获取cookie方法
    /* 获取cookie参数*/
    var getCookie = document.cookie.replace(/[ ]/g, '') // 获取cookie，并且将获得的cookie格式化，去掉空格字符
    var arrCookie = getCookie.split(';') // 将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    var tips // 声明变量tips
    for (var i = 0; i < arrCookie.length; i++) {
      // 使用for循环查找cookie中的tips变量
      var arr = arrCookie[i].split('=') // 将单条cookie用"等号"为标识，将单条cookie保存为arr数组
      if (key === arr[0]) {
        // 匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
        tips = arr[1] // 将cookie的值赋给变量tips
        break // 终止for循环遍历
      }
    }

    return tips
  },
  del: function(key) {
    // 删除cookie方法
    var date = new Date() // 获取当前时间
    date.setTime(date.getTime() - 10000) // 将date设置为过去的时间
    document.cookie = key + '=v; expires =' + date.toGMTString() // 设置cookie
  },
  clear: function() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
      for (var i = keys.length; i--;) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
  }
}

export function copyJSONObj(obj) {
  return isJSON(obj, true) ? JSON.parse(JSON.stringify(obj)) : obj
}

export function jsonPretty(obj) {
  return isJSON(obj.data, obj.isHideWarning) ? JSON.stringify(obj.data, '{}', 4) : obj.data
}

export function isJSON(str, isHideDialog) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        isHideDialog === undefined && Notification.error({
          title: '提示',
          message: '不是标准的JSON格式数据,程序无法解析!'
        })
        return false
      }
    } catch (e) {
      // console.log('error：'+str+'!!!'+e);
      isHideDialog === undefined && Notification.error({
        title: '提示',
        message: '不是标准的JSON格式数据,程序无法解析!'
      })
      return false
    }
  }

  return true
  // console.log('It is not a string!')
}

export function DateFormat(gmt, fmt) {
  if (gmt) {
    var d = new Date(gmt)
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var day = d.getDate()
    var hour = d.getHours()
    var minute = d.getMinutes()
    var second = d.getSeconds()

    return year + '-' + Appendzero(month) + '-' + Appendzero(day) + ' ' + Appendzero(hour) + ':' + Appendzero(minute) + ':' + Appendzero(second)
  } else {
    return gmt
  }

  function Appendzero(num) {
    return num < 10 ? '0' + num : num
  }
}

/**
 * 将HTML Table数据导出成Excel文档
 *   string  tableId 表格ID
 *   string  downloadFileName 导出文档名
 */

export function tableExportExcel(data) {
  var blobObj = new Blob([data.fileContent])
  // var blobObj = new Blob([data.fileContent], { type: "'text/csv';charset=utf-8" });

  if (window.navigator.msSaveBlob) {
    // IE 10+
    window.navigator.msSaveOrOpenBlob(blobObj, data.fileName)
    // $scope.DataNullEventDetails = true;
  } else {
    var link = document.createElement('a') // create link download file
    link.href = window.URL.createObjectURL(blobObj) // set url for link download
    link.setAttribute('download', data.fileName) // set attribute for link created
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * 检测json是否为null
 * @Author   邬天美
 * @DateTime 2018-04-13
 * @param    {[type]}   json    [description]
 * @param    {[type]}   delArry [description]
 * @return   {[type]}           [description]
 */
export function checkJSONNull(json) {
  if (!json || !Object.keys(json).length) return true
  for (var j in json) {
    if (json[j] !== undefined && json[j] !== '') {
      return false
    }
  }
  return true
}

/**
 * 把查询参数设置到浏览器地址上
 *
 * @Author   邬天美
 * @DateTime 2018-01-11
 * @param    {[this.$router]}   router    router对像
 * @param    {[string]}   path      路径
 * @param    {[type]}   params    要加到浏览器上的参数
 */
export function setRouter(router, path, params) {
  router.push({
    path,
    query: {
      ...params,
      times: Date.now()
    }
  })
}

/**
 * @description 格式化之后的数据
 * @author   曹清华
 * @DateTime 2018-01-17
 * @param formatSource 自定义来源
 * @param targetSource 格式化目标
 * @returns 格式化之后的数据
 */
export function format(formatSource, targetSource) {
  return formatSource[targetSource] ? formatSource[targetSource] : targetSource
}

/**
 * @author 曹清华
 * @description 格式化为dateFormat时间格式
 * @param params 目标对象
 */

export function format_yyy_mm_dd(params, format) {
  const type = format || 'YYYY-MM-DD'
  return params ? moment(params).format(type) : params
}

/**
 * 下载保存的二进制文件流
 * @Author   邬天美
 * @DateTime 2018-03-20
 * @param    {[type]}   binary   [description]
 * @param    {[type]}   fileName [description]
 * @return   {[type]}            [description]
 */
export function downloadBinaryExcelFile(binary, fileName) {
  var data = new Blob([binary], { type: 'application/msexcel,charset=utf-8;' })
  var downloadUrl = window.URL.createObjectURL(data)
  var anchor = document.createElement('a')
  anchor.href = downloadUrl
  anchor.download = (fileName || '导出文件') + '.xls'
  anchor.click()
  window.URL.revokeObjectURL(data)
}

export function isEmptyObject(obj) {
  var name
  for (name in obj) {
    return false
  }
  return true
}

export function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  let str = null
  if (r != null) {
    const s = unescape(r[2])
    if (s.substring(s.length - 1, s.length) === '/') {
      str = s.substring(0, s.length - 1)
    } else {
      str = s
    }
  }
  return str
}

export function duplicateRemoval(list, splitFomrmat) {
  const _tempOptions = []
  var newListArray = Array.from(new Set(list))
  if (newListArray.length > 0) {
    for (var i = 0; i < newListArray.length; i++) {
      if (newListArray[i] === '' || newListArray[i] === null) {
        continue
      }
      _tempOptions.push({ value: newListArray[i].split(splitFomrmat)[1], label: newListArray[i].split(splitFomrmat)[0] })
    }
    return _tempOptions
  }
  return _tempOptions
}

export function lastDuplicateRemoval(list, splitFomrmat) {
  const _tempOptions = []
  var newListArray = Array.from(new Set(list))
  if (newListArray.length > 0) {
    for (var i = 0; i < newListArray.length; i++) {
      const lastSplitIndex = newListArray[i].lastIndexOf(splitFomrmat)
      _tempOptions.push({
        value: newListArray[i].substring(lastSplitIndex + 1, newListArray[i].length),
        label: newListArray[i].substring(0, lastSplitIndex)
      })
    }
    return _tempOptions
  }
  return _tempOptions
}

export function duplicateRemoval2(list) {
  const _tempOptions = []
  var newListArray = Array.from(new Set(list))
  if (newListArray.length > 0) {
    for (var i = 0; i < newListArray.length; i++) {
      if (newListArray[i]) {
        _tempOptions.push({ value: i, label: newListArray[i] })
      }
    }
    return _tempOptions
  }
  return _tempOptions
}

export function isSuccessCode(returnData) {
  if (returnData.code === '0000') {
    return true
  }
  return false
}

export function removeTicket() {
  location.href = location.origin + location.pathname + location.hash
}

/**
 * cqh
 * 获取浏览器地址ticket
 */
export function getQueryTicket(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

// 获取员工信息
import store from '@/store'

export async function getStaffData() {
  if (store.getters.staffOptionsLists.length != 0) {
    return
  }
  var staffOptionsList = []
  const returnData = await httpRequest('GET', STAFF_GET)
  returnData.forEach((value) => {
    staffOptionsList.push({
      label: value.name,
      value: value.user_id,
      key: value.email,
      email: value.email
    })
    store.commit('PROJECT_STFF_INFO', staffOptionsList)
  })
  var applicationStaffOptionsList = []
  returnData.forEach((value) => {
    applicationStaffOptionsList.push({
      key: value.email,
      label: value.name,
      value: value.name,
      email: value.email
    })
    store.commit('APPLICATION_STFF_INFO', applicationStaffOptionsList)
  })
}

// 不适用全局加载url
const noLoadingUrl = [SERVER_CHECK]

export function loadingFilterUrl(url) {
  let flag = true
  noLoadingUrl.forEach((value) => {
    if (url.indexOf(value) != -1) {
      flag = false
    }
  })
  return flag
}

// 选项去重
export function removeDuplicateOptions(data, list) {
  var flag = false
  list.forEach((value) => {
    if (value.key === '') {
      flag = true
    }
    if (value.key === data.key) {
      flag = true
    }
  })
  if (flag) {
    return list
  }
  list.push(data)
  return list
}

export function mapContructData(publicData, resourceData) {
  if (publicData instanceof Array) {
    if (publicData.length == 0) {
      return resourceData
    }
    let addFlag = true
    for (let i = 0; i < resourceData.length; i++) {
      for (let j = 0; j < publicData.length; j++) {
        if (publicData[j][0] == resourceData[i][0] && publicData[j][1] == resourceData[i][1]) {
          publicData[j] = resourceData[i]
          addFlag = false
          break
        }
      }
      if (addFlag) {
        publicData.push(resourceData[i])
      }
      addFlag = true
    }
  }
  return publicData
}

export function mapHeadersData(publicData, resourceData) {
  if (publicData instanceof Array) {
    if (publicData.length == 0) {
      return resourceData
    }
    let addFlag = true
    for (let i = 0; i < resourceData.length; i++) {
      for (let j = 0; j < publicData.length; j++) {
        if (publicData[j][0] === resourceData[i][0]) {
          publicData[j] = resourceData[i]
          addFlag = false
          break
        }
      }
      if (addFlag) {
        publicData.push(resourceData[i])
      }
      addFlag = true
    }
  }
  return publicData
}

export function convertTime(stringTime) {
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var week = day * 7
  var month = day * 30
  var time1 = new Date().getTime()// 当前的时间戳
  var time2 = Date.parse(new Date(stringTime))// 指定时间的时间戳
  var time = time1 - time2

  var result = null
  if (time < 0) {
    alert('设置的时间不能早于当前时间！')
  } else if (time / month >= 1) {
    result = '于' + parseInt(time / month) + '月前'
  } else if (time / week >= 1) {
    result = '于' + parseInt(time / week) + '周前'
  } else if (time / day >= 1) {
    result = '于' + parseInt(time / day) + '天前'
  } else if (time / hour >= 1) {
    result = '于' + parseInt(time / hour) + '小时前'
  } else if (time / minute >= 1) {
    result = '于' + parseInt(time / minute) + '分钟前'
  } else {
    result = '刚刚更新！'
  }
  return result
}

export function myrenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)
  if (instance.searchTxt == null || instance.searchTxt == '') return td
  if (value != null) {
    if (value.indexOf(instance.searchTxt) >= 0) { // 修改字体颜色
      td.style.backgroundColor = 'yellow'
      if (instance.rowCol.indexOf(row + '-' + col) < 0) {
        instance.rowCol.push(row + '-' + col)
        increCount()
      }
    }
  }
  return td
}

export function branchMergeRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)
  if (value == null) {
    value = ''
  }
  if (instance.getSettings().addList.indexOf(row) >= 0) { // 修改字体颜色
    td.style.backgroundColor = '#32CD32'
  } else if (instance.getSettings().modifyList.indexOf(row) >= 0) {
    td.style.backgroundColor = '#cdcb39'
  } else if (instance.getSettings().deleteList.indexOf(row) >= 0) {
    td.style.backgroundColor = '#ff0f20'
  } else {
    return td
  }
  return td
}

export function increCount() {
  var count = parseInt(localStorage.getItem('SEARCH_COUNT'))
  count = count + 1
  localStorage.setItem('SEARCH_COUNT', count)
}

export function initCount() {
  localStorage.setItem('SEARCH_COUNT', '0')
}

export function getCount() {
  return localStorage.getItem('SEARCH_COUNT')
}

export function aesEncrypt(data) {
  var CryptoJS = require('crypto-js')
  var key = CryptoJS.enc.Utf8.parse('qwertyuiqwertyui')
  var cipher = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return cipher.ciphertext.toString(CryptoJS.enc.Base64)
}

import CryptoJS from 'crypto-js'

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse('1234567890123456')
const IV = CryptoJS.enc.Utf8.parse('1234567890123456')
/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(word) {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

export function getLocalTime(time) {
  var date = new Date(time)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}
