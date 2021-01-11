export function isNum(rule, value, callback) {
  const re = /^[0-9]*$/
  if (!re.test(value)) {
    callback(new Error('只能为数字'))
  } else {
    callback()
  }
}

export function isNotNull(rule, value, callback) {
  if (value === null) {
    callback(new Error('不能为空'))
  } else {
    callback()
  }
}

export function isCode(rule, value, callback) {
  const re = /^[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]$/
  if (!re.test(value)) {
    callback(new Error('只能为字母、数字和横杠'))
  } else {
    callback()
  }
}

export function isCode2(rule, value, callback) {
  const re = /^[A-Za-z0-9][A-Za-z0-9.]*[A-Za-z0-9]$/
  if (!re.test(value)) {
    callback(new Error('只能为字母、数字和小数点'))
  } else {
    callback()
  }
}

export function isUri(rule, value, callback) {
  const re = /^[A-Za-z0-9][A-Za-z0-9-.]*[A-Za-z0-9-_%&\?\/.=]+$/
  if (!re.test(value)) {
    callback(new Error('请输入正确的地址'))
  } else {
    callback()
  }
}

export function isHost(rule, value, callback) {
  const re = /^(https?:\/\/)([0-9a-z.-]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?$/
  if (!re.test(value)) {
    callback(new Error('请输入正确的地址'))
  } else {
    callback()
  }
}
