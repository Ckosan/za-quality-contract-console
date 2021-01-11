export const headerSettings = {
  addList: [],
  modifyList: [],
  deleteList: [],
  data: [
    []
  ],
  startRows: 0, // 初始行列数
  startCols: 1,
  minRows: 5, // 最小行列
  minCols: 4,
  maxCols: 4,
  rowHeaders: true, // 行表头
  colHeaders: ['参数名', '参数值', '参数说明', '修改说明'],
  // minSpareCols: 0, // 列留白
  // minSpareRows: 2, // 行留白
  className: 'htCenter',
  // currentRowClassName: 'currentRow', // 为选中行添加类名，可以更改样式
  // currentColClassName: 'currentCol', // 为选中列添加类名
  autoWrapRow: true, // 自动换行
  language: 'zh-CN',
  contextMenu: ['row_above', 'row_below', 'remove_row'],
  colWidths: [50, 50, 100, 100],
  // 右键效果
  fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
  fixedColumnsLeft: 4, // 固定左边列数
  fixedRowsTop: 0, // 固定上边行数
  stretchH: 'all',
  readOnly: true,
  licenseKey: '68957-431ab-0cc8c-e5d24-95096',
  columns: [
    {}, {}, {}, {}
  ],
  afterChange: function(change, source) {
    if (change) {
      window.onbeforeunload = function(event) {
        return confirm('确定退出吗')
      }
    }
  }
}

export const rspheaderSettings = {
  addList: [],
  modifyList: [],
  deleteList: [],
  data: [
    ['Content-Type', 'application/json', '响应数据类型']
  ],
  startRows: 0, // 初始行列数
  startCols: 1,
  minRows: 5, // 最小行列
  minCols: 4,
  maxCols: 4,
  rowHeaders: true, // 行表头
  colHeaders: ['参数名', '参数值', '参数说明', '修改说明'],
  // minSpareCols: 0, // 列留白
  minSpareRows: 1, // 行留白
  className: 'htCenter',
  // currentRowClassName: 'currentRow', // 为选中行添加类名，可以更改样式
  // currentColClassName: 'currentCol', // 为选中列添加类名
  autoWrapRow: true, // 自动换行
  language: 'zh-CN',
  contextMenu: ['row_above', 'row_below', 'remove_row'],
  colWidths: [50, 50, 100, 100],
  // 右键效果
  fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
  fixedColumnsLeft: 4, // 固定左边列数
  fixedRowsTop: 0, // 固定上边行数
  stretchH: 'all',
  readOnly: true,
  licenseKey: '68957-431ab-0cc8c-e5d24-95096',
  columns: [
    {}, {}, {}, {}
  ],
  afterChange: function(change, source) {
    if (change) {
      window.onbeforeunload = function(event) {
        return confirm('确定退出吗')
      }
    }
  }
}

export const hotSettings = {
  addList: [],
  modifyList: [],
  deleteList: [],
  data: [
    // eslint-disable-next-line no-sparse-arrays
    ['', '', '', '', '', '', '', '', '']
  ], // 数据在这个里面,由数据填充表
  startRows: 10, // 初始行列数
  startCols: 35,
  minRows: 10, // 最小行列
  minCols: 9,
  maxCols: 9,
  rowHeaders: true, // 行表头
  colHeaders: ['父节点', '* 字段名', '* 字段类型', '字段长度', '是否必填', '描述', '字段参考值', '备注', '修改说明'], // 自定义列表头or 布尔值
  // minSpareCols: 0, // 列留白
  minSpareRows: 1,
  className: 'htCenter',
  // currentRowClassName: 'currentRow', // 为选中行添加类名，可以更改样式
  // currentColClassName: 'currentCol', // 为选中列添加类名
  autoWrapRow: true, // 自动换行
  language: 'zh-CN',
  contextMenu: ['row_above', 'row_below', 'remove_row'],
  colWidths: [50, 50, 30, 30, 30, 50, 80, 80, 100],
  // 右键效果
  fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
  fixedColumnsLeft: 9, // 固定左边列数
  fixedRowsTop: 1, // 固定上边行数
  stretchH: 'all',
  search: true,
  readOnly: true,
  licenseKey: '68957-431ab-0cc8c-e5d24-95096',
  columns: [
    {},
    {},
    {
      type: 'autocomplete',
      source: ['String', 'Integer', 'Long',
        'Decimal', 'BigDecimal', 'Double', 'Float', 'Date', 'Datetime',
        'Boolean', 'Map', 'Dto', 'List', 'Obj', 'Object', 'Char'],
      strict: false
    },
    { type: 'numeric' },
    {
      type: 'autocomplete',
      source: ['是', '否', 'True', 'False', '可选', 'Y', 'N'],
      strict: true
    },
    {},
    {},
    {},
    {
    }
  ],
  afterChange: function(change, source) {
    if (change) {
      window.onbeforeunload = function(event) {
        return confirm('确定退出吗')
      }
    }
  },
  updatePlayerList: null
}

export const httpResponseSettings = {
  addList: [],
  modifyList: [],
  deleteList: [],
  data: [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ], // 数据在这个里面,由数据填充表
  startRows: 10, // 初始行列数
  startCols: 35,
  minRows: 10, // 最小行列
  minCols: 9,
  maxCols: 9,
  rowHeaders: true, // 行表头
  colHeaders: ['父节点', '* 字段名', '* 字段类型', '字段长度', '是否必填', '描述', '字段参考值', '备注', '修改说明'], // 自定义列表头or 布尔值
  // minSpareCols: 2, // 列留白
  // minSpareRows: 2, //行留白
  className: 'htCenter',
  // currentRowClassName: 'currentRow', // 为选中行添加类名，可以更改样式
  // currentColClassName: 'currentCol', // 为选中列添加类名
  autoWrapRow: true, // 自动换行
  language: 'zh-CN',
  contextMenu: ['row_above', 'row_below', 'remove_row'],
  colWidths: [50, 50, 30, 30, 30, 50, 80, 80, 100],
  // 右键效果
  fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
  fixedColumnsLeft: 9, // 固定左边列数
  fixedRowsTop: 0, // 固定上边行数
  stretchH: 'all',
  search: true,
  readOnly: true,
  licenseKey: '68957-431ab-0cc8c-e5d24-95096',
  columns: [
    {},
    {},
    {
      type: 'autocomplete',
      source: ['String', 'Integer', 'Long',
        'Decimal', 'BigDecimal', 'Double', 'Float', 'Date', 'Datetime',
        'Bool', 'Boolean', 'Map', 'Dto', 'List', 'Obj', 'Object', 'Char'],
      strict: false
    },
    { type: 'numeric' },
    {
      type: 'autocomplete',
      source: ['是', '否', 'True', 'False', '可选', 'Y', 'N'],
      strict: true
    },
    {},
    {},
    {},
    {}
  ],
  afterChange: function(change, source) {
    if (change) {
      window.onbeforeunload = function(event) {
        return confirm('确定退出吗')
      }
    }
  },
  updatePlayerList: null
}

