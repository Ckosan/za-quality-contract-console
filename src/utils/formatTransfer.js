import Moment from 'moment'

export function flagformatForm(flag) {
  if (flag === '是') {
    // eslint-disable-next-line no-redeclare
    var flag = true
    return flag
  } else {
    flag = false
    return flag
  }
}
export function intrvalcrontabformat(data) {
  if (data === '--') {
    return ''
  } else {
    return data
  }
}
export function indexadd(row, column) {
  var index_num = row[column.property]
  return Number(index_num) + Number(1)
}

export function flagFormat(row, column) {
  if (row[column.property]) {
    return '是'
  } else {
    return '否'
  }
}

export function dateFormat(row, column) {
  var date = row[column.property]
  if (date == undefined) {
    return '未填'
  }
  return Moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export function datetimetransfer(datetime) {
  if (datetime != null) {
    var date = Moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    if (date === 'Invalid date') {
      return ''
    } else {
      return date
    }
  } else {
    return ''
  }
}
