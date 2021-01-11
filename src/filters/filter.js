import Vue from 'vue'
import moment from 'moment'

Vue.mixin({
  methods: {
    getLabel(objs, val) {
      for (var i = 0, len = objs.length; i < len; ++i) {
        if (objs[i].value === val) {
          return objs[i].label
        }
      }
      return ''
    }
  }
})

// menu截取
Vue.filter('FORMATMENU', function(str) {
  var result = ''
  var num = 3
  var count = str.match(/\//g).length
  if (count >= num) {
    str.split('/').map((item, index) => {
      if (index < num) {
        result += item + '/'
      }
    })
    return result.substring(0, result.length - 1)
  }
  return str
})

// 格式化金额
/*
    * 参数说明：
    * number：要格式化的数字
    * */
Vue.filter('FORMAT_ACCOUNT', function(number) {
  const decimals = 2// 两位小数
  const sep = ',' // 千分位符号
  const roundtag = 'ceil'// 向上取

  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  var s = ''
  var toFixedFix = function(n, prec) {
    var k = Math.pow(10, prec)
    return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  var re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join('.')
})
/**
 * @description 格式化时间
 * @author cqh
 */
Vue.filter('FORMAT_DATE', function(value, formatString) {
  if (!value) return ''
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss'
  return moment(value).format(formatString)
})
/**
 * @description 整个弹窗的宽度
 * @author cqh
 */
Vue.filter('DIALOG_WIDTH', function(value) {
  return value || value !== '' ? value : '1100px'
})
/**
 * @description 整个label的宽度
 * @author cqh
 */
Vue.filter('LABEL_WIDTH', function(value) {
  return value || value !== '' ? value : '140px'
})
/**
 * @description 整个label内文字的对齐方式
 * @author cqh
 */
Vue.filter('LABEL_POSITION', function(value) {
  return value || value !== '' ? value : 'right'
})
/**
 * @description 整个项目列表时间的宽度
 * @author cqh
 */
Vue.filter('LIST_TIME_WIDTH', function(value) {
  return value || value !== '' ? value : '140px'
})
/**
 * @description 通过value获得label
 * @author cqh
 */
Vue.filter('GET_LABEL_THROUGH_VALUE', function(value, localArray) {
  if (!localArray) return value
  const temp = localArray.filter(item => item.value === value)
  return temp && temp[0] ? temp[0].label : value
})
