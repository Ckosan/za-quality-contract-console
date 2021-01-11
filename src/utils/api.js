var innerHost = ''

// if (__CONFIGMODE__ == 'uat') {
//     innerHost = 'szapp-uat.zhonganonline.com';
// } else if (__CONFIGMODE__ == 'prd') {
//     innerHost = 'szapp.zhonganonline.com';
// } else if (__CONFIGMODE__ == 'test') {
//     innerHost = '/internet-financial-monitor/';
// }

export default {
  DOMAIN: 'test',
  UPLOAD_URL: 'test',
  NSSOLoginURL: 'http://nsso.zhonganonline.com/login?service=za-sztest&target=' + encodeURIComponent(location.origin + location.pathname),
  NSSOLogoutURL: 'http://nsso.zhonganonline.com/logout?service=za-sztest&target=' +
        encodeURIComponent(location.origin + location.pathname + location.hash),
  innerHost: innerHost,
  CONTEXT: '', // 上下文
  sessionKey: {
    searchParams: '__SEARCH_PARAMS__' // 搜索参数
  },
  batch: {

    jobAddInfo: '/job/addInfo',
    jobUpdateInfo: '/job/updateInfo',
    jobDeletedInfo: '/job/deletedInfo',
    jobList: '/job/queryInfo',

    stepOperateInfo: '/step/operateInfo',
    stepList: '/step/queryInfo',
    stepDeletedInfo: '/step/deletedInfo',

    handlerOperateInfo: '/handler/operateInfo',
    handlerList: '/handler/queryInfo',
    handlerDeletedInfo: '/handler/deletedInfo',
    handlerListHandlerName: '/handler/listHandlerName',

    queryConfAddInfo: '/queryConf/addInfo',
    queryConfUpdateInfo: '/queryConf/updateInfo',
    queryConfDeletedInfo: '/queryConf/deletedInfo',
    queryConfList: '/queryConf/queryInfo',

    productList: '/product/queryInfo',
    productAddInfo: '/product/addInfo',
    productUpdateInfo: '/product/updateInfo',
    productDeletedInfo: '/product/deletedInfo',

    configGetHandlers: '/config/getHandlers',

    // 新增路由信息
    configAddConfig: '/config/addConfig',

    // 编辑路由信息
    configUpdateConfig: '/config/updateConfig',
    // 获取key-content列表
    configGetAllLeafValue: '/config/getAllLeafValue',

    configQueryInfo: '/config/queryInfo',
    configDeletedConfig: '/config/deletedConfig',
    configShowValue: '/config/showValue',
    configBatchDeletedConfig: '/config/deletedBatchEndNode'

  },

  login: {
    innerLogin: '/innerLogin',
    innerLogout: '/innerLogout',
    outerLogin: '/login',
    outerLogout: '/logout',
    resetPwd: '/user/updatePassword',
    captchaImage: '/captchaImage'
  }
}
