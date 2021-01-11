// 头部渲染
export function headerRender(headers) {
  const list = []
  if (headers.length == 0) {
    list.push(['', '', ''])
  }
  for (var i = 0; i < headers.length; i++) {
    const tmplist = []
    tmplist.push(headers[i].data_key)
    tmplist.push(headers[i].data_default_value)
    tmplist.push(headers[i].data_describe)
    list.push(tmplist)
  }
  return list
}

export function headerMergeRender(headers) {
  const list = []
  if (headers.length == 0) {
    list.push(['', '', '', '', ''])
  }
  for (var i = 0; i < headers.length; i++) {
    const tmplist = []
    tmplist.push(headers[i][1])
    tmplist.push(headers[i][6])
    tmplist.push(headers[i][5])
    tmplist.push(headers[i][8])
    tmplist.push(headers[i][9])
    list.push(tmplist)
  }
  return list
}

// boyd渲染
export function bodyRender(body) {
  const list = []
  for (var i = 0; i < body.length; i++) {
    const tmplist = []
    tmplist.push(body[i].parent_key)
    tmplist.push(body[i].data_key)
    tmplist.push(body[i].data_type)
    tmplist.push(body[i].data_length)
    tmplist.push(body[i].is_null)
    tmplist.push(body[i].data_describe)
    tmplist.push(body[i].data_default_value)
    tmplist.push(body[i].backup)
    list.push(tmplist)
  }
  if (body.length === 0) {
    const tmplist = []
    tmplist.push('')
    tmplist.push('')
    tmplist.push('')
    tmplist.push('')
    tmplist.push('')
    tmplist.push('')
    tmplist.push('')
    tmplist.push('')
    list.push(tmplist)
  }
  return list
}

// 去除null的行
export function deleteNullData(list) {
  var newlist = []
  for (var i = 0; i < list.length; i++) {
    if (list[i][0] == null && list[i][1] == null || list[i][0] === '' && list[i][1] === '' ||
      list[i][0] == null && list[i][1] === '' || list[i][0] === '' && list[i][1] == null) {
      continue
    }
    // eslint-disable-next-line no-undef
    if (Object.keys(list[i]).length === 0) {
      continue
    }
    newlist.push(list[i])
  }
  return convertData(newlist)
}

export function deleteHttpNullData(list, type) {
  var newlist = []
  for (var i = 0; i < list.length; i++) {
    if (list[i].length === 3 && type != 'headers') {
      continue
    }
    for (var j = 0; j < list[i].length; j++) {
      if (list[i][j] == null || list[i][j] === 'null') {
        list[i][j] = ''
      }
    }
    if (list[i][0] == null && list[i][1] == null || list[i][0] === '' && list[i][1] === '' ||
      list[i][0] == null && list[i][1] === '' || list[i][0] === '' && list[i][1] == null) {
      continue
    }
    // eslint-disable-next-line no-undef
    if (Object.keys(list[i]).length === 0) {
      continue
    }
    newlist.push(list[i])
  }
  return convertData(newlist)
}

// 转换null
export function convertData(list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][0] == null) {
      list[i][0] = ''
    }
    if (list[i][1] == null) {
      list[i][0] = ''
    }
  }
  return list
}
