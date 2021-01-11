/**
 * 获取配置单个条目
 * @Author   邬天美
 * @DateTime 2017-12-09
 * @param    {[type]}   obj [description]
 * @param    {[type]}   val [description]
 * @return   {[type]}       [description]
 */
export const getConfigItem = (obj, val) => {
  if (!obj) return {}

  return obj.filter(item => item.value == val)[0] || { label: val }
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
const SELECT_DATA = {
  // 申请状态
  applyStatus: [
    {
      value: 'PROCESSING',
      label: '处理中'
    },
    {
      value: 'SUCCESS',
      label: '成功'
    },
    {
      value: 'FAIL',
      label: '拒绝'
    }
  ],
  // 还款计划状态
  repayPlayStatus: [
    {
      value: 'NOT_EFFECTED',
      label: '未生效'
    },
    {
      value: 'WAIT_REPAY',
      label: '未还款'
    },
    {
      value: 'REPAYED',
      label: '已还款'
    }
  ],
  // 默认结果
  local_expressReturnValue: [
    {
      value: 'Y',
      label: '通过'
    },
    {
      value: 'N',
      label: '不通过'
    },
    {
      value: 'M',
      label: '转人工'
    }
  ], // 代扣类型(1对公 0对私)
  withholdPublicFlag: [
    {
      value: 0,
      label: '对私'
    },
    {
      value: 1,
      label: '对公'
    }
  ],
  withholdStatus: [
    {
      value: 'INIT',
      label: '初始化'
    },
    {
      value: 'PROCESSING',
      label: '处理中'
    },
    {
      value: 'SUCCESS',
      label: '成功'
    },
    {
      value: 'FAILURE',
      label: '失败'
    }
  ],
  repayStatus: [

    {
      value: 'PROCESSING',
      label: '处理中'
    },
    {
      value: 'SUCCESS',
      label: '处理成功'
    },
    {
      value: 'FAIL',
      label: '处理失败'
    }
  ], // 归集类型：
  batchType: [
    {
      value: 'OFFLINE_REPAY',
      label: '线下还款'
    },
    {
      value: 'PLAFORM_COMPEMSATE',
      label: '平台代偿'
    },
    {
      value: 'OVERDUE_REPAY',
      label: '逾期还款'
    },
    {
      value: 'BUY_BACK',
      label: '回购'
    }
  ],
  batchState: [
    {
      value: 'CREATED',
      label: '创建任务初始状态'
    },
    {
      value: 'ANALYSIS_SUCCESS',
      label: '获取并解析数据成功'
    },
    {
      value: 'ALL_REQ_SUCCESS',
      label: '全部请求成功'
    },
    {
      value: 'PART_REQ_SUCCESS',
      label: '部分请求成功'
    },
    {
      value: 'ALL_REQ_FAIL',
      label: '全部请求失败'
    },
    {
      value: 'ALL_REPAY_SUCCESS',
      label: '全部成功'
    },
    {
      value: 'PART_REPAY_SUCCESS',
      label: '部分成功'
    },
    {
      value: 'ALL_REPAY_FAIL',
      label: '全部还款失败'
    }, {
      value: ' WRITE_BACK_CACHE',
      label: '-批次化中心回写'
    }
  ],
  roleStatus: [
    {
      value: 0,
      label: '冻结'
    },
    {
      value: 1,
      label: '正常'
    }
  ],
  repayWay: [
    {
      value: 'MONTH_INTEREST',
      label: '先息后本(月付利息) '
    },
    {
      value: 'FULL_PAYMENT',
      label: '利随本清(趸交)'
    },
    {
      value: 'EQUAL_INSTALLMENT',
      label: '等额本息'
    },
    {
      value: 'EQUAL_PRINCIPAL',
      label: '等额本金'
    },
    {
      value: 'EQUAL_INTEREST',
      label: '等本等息'
    },
    {
      value: 'QUARTERLY_INTEREST',
      label: '先息后本(季付利息) '
    },
    {
      value: 'DAILY_INTEREST',
      label: '按日计息'
    }
  ], // 还款类型
  repayType: [
    {
      value: 'NORMAL_REPAY',
      label: '正常还款'
    },
    {
      value: 'EARLY_REPAY',
      label: '提前还款'
    },
    {
      value: 'EARLY_SETTLE',
      label: '提前结清'
    },
    {
      value: 'OVERDUE_REPAY',
      label: '逾期还款'
    }
  ],

  fileType: [
    {
      value: 'LOAN_AGREEMENT',
      label: '借款协议'
    },
    {
      value: 'ELECTRONIC_POLICY',
      label: '电子保单'
    },
    {
      value: 'INSURANCE_AGREEMENT',
      label: '投保协议 '
    },
    {
      value: 'CREDIT_AUTH_AGREEMENT',
      label: '人行征信授权'
    },
    {
      value: 'IMAGE_VIDEO_AGREEMENT',
      label: '影像文件'
    }
  ]
}
export default SELECT_DATA
