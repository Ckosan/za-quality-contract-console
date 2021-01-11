module.exports = {
  // 资源
  PROJECT: '/resourcesmanager/projects',
  PROJECT_APPLICATION: '/resourcesmanager/projects/getapplicationsproject',
  PROJECT_DETAIL: '/resourcesmanager/projects/getdetail',
  PROJECT_COUNT: '/resourcesmanager/projects/getcountData',
  APPLICATION: '/resourcesmanager/applications',
  APPLICATION_PROJECT: '/resourcesmanager/applications/getaddserverapplications',
  APPLICATION_COUNT: '/resourcesmanager/applications/getcountData',
  SERVER: '/resourcesmanager/servers',
  SERVER_DETAIL: '/resourcesmanager/servers/getdetail',
  SERVER_NOT_UNION_SERVERS: '/resourcesmanager/servers/getnotunionserver',
  SERVER_UNION_DOC: '/resourcesmanager/servers/uniondoc',
  SERVER_COPY_DOC: '/resourcesmanager/servers/copydoc',
  SERVER_COUNT: '/resourcesmanager/servers/getcountData',
  SERVER_BRANCH_ENV: '/resourcesmanager/servers/getBranchAndEnvList',
  SERVER_PROJECT_APPLICATION: '/resourcesmanager/servers/projectandapplication',
  SERVER_OPTIONS_LIST: '/resourcesmanager/servers/getServerOptionsList',
  SERVER_PARASE_POSTMAN: '/resourcesmanager/servers/parasepostman',
  SERVER_INTERFACE_API: '/resourcesmanager/servers/getInterfaceDataList',
  SERVER_CHECK: '/resourcesmanager/servers/checkstatus',
  SERVER_ENV_LIST: '/resourcesmanager/servers/getServerEnvList',
  DELETE_INTERFACE: '/resourcesmanager/deleteInterface',
  DELETE_INTERFACE_BYVERSION: '/resourcesmanager/deleteIVersion',
  HTTP_TEMPLATES: '/resourcesmanager/httpinterfaceinfo/gethttptemplates',
  HTTP_SERVER_INFO: '/resourcesmanager/httpservers/getEnvListByInterface',
  HTTP_INTERFACE_INFO: '/resourcesmanager/httpinterfaceinfo',
  HTTP_INTERFACE_INFO_BY_ID: '/resourcesmanager/httpinterfaceinfo/getInterfaceById',
  HTTP_INTERFACE_ADD_BRANCH: '/resourcesmanager/httpinterfaceinfo/newbranch',
  HTTP_INTERFACE_DELETE_BRANCH: '/resourcesmanager/httpinterfaceinfo/deletebranch',
  HTTP_DATA_CONSTRUCT: '/resourcesmanager/httpdataconstruct',
  HTTP_DATA_CONSTRUCT_ROLLBACK: '/resourcesmanager/httpdataconstruct/rollback',
  HTTP_DATA_CONSTRUCT_PRE_MERGE: '/resourcesmanager/httpdataconstruct/premerge',
  HTTP_DATA_CONSTRUCT_MERGE: '/resourcesmanager/httpdataconstruct/domerge',
  HTTP_SERVER_API: '/resourcesmanager/httpservers',
  HTTP_SERVER_ENVLIST: '/resourcesmanager/httpservers/getEnvListByServer',
  HTTP_DATA_CONSTRCUT_NEEWVERSION: '/resourcesmanager/httpdataconstruct/newversion',
  API_BRANCH_CONSTRUCT: '/resourcesmanager/httpdataconstructbranch',
  API_CONTRACT_DOC: '/api/res/getContractDoc',
  API_CONTRACT_DEBUG: '/contractdebug/httpapi/getDebugData',
  API_EXT_INFO: '/resourcesmanager/httpinterfaceinfo/getExtInfo',
  BRNACH_API: '/resourcesmanager/branch',
  BRNACH_LIST: '/resourcesmanager/branch/getBranchList',
  ONS_INTERFACE_SERVER: '/resourcesmanager/onsinterfaceinfo',
  ONS_INTERFACE_INFO: '/resourcesmanager/onsinterfaceinfo',
  ONS_DATA_CONSTRUCT: '/resourcesmanager/onsdataconstruct',
  ONS_DATA_CONSTRUCT_ROLLBAKC: '/resourcesmanager/onsdataconstruct/rollback',
  ONS_DATA_CONSTRUCT_NEWVERSION: '/resourcesmanager/onsdataconstruct/newversion',
  OSS_INTERFACE_INFO: '/resourcesmanager/ossinterfaceinfo',
  OSS_INTERFACE_FOR_FILE: '/resourcesmanager/ossinterfaceinfoForFile',
  OSS_DATA_CONSTRUCT: '/resourcesmanager/ossdataconstruct',
  OSS_DATA_CONSTRUCT_ROLLBAKC: '/resourcesmanager/ossdataconstruct/rollback',
  OSS_DATA_CONSTRUCT_NEWVERSION: '/resourcesmanager/ossdataconstruct/newversion',
  SFTP_INTERFACE_INFO: '/resourcesmanager/sftpinterfaceinfo',
  SFTP_INTERFACE_FOR_FILE: '/resourcesmanager/sftpinterfaceinfoForFile',
  SFTP_DATA_CONSTRUCT: '/resourcesmanager/sftpdataconstruct',
  SFTP_DATA_CONSTRUCT_ROLLBAKC: '/resourcesmanager/sftpdataconstruct/rollback',
  SFTP_DATA_CONSTRUCT_NEWVERSION: '/resourcesmanager/sftpdataconstruct/newversion',
  ONS_DATA_SERVER: '/resourcesmanager/onsdataserver',
  // 用例集
  DATA_SET_API: '/resourcesmanager/datasets',
  DATA_SET_REAPTION_INFO: '/resourcesmanager/datasetsRelation/getSet',
  DATA_SET_INFO: '/resourcesmanager/datasets/getDatasetsInfo',
  DATA_SET_DETAIL: '/resourcesmanager/datasets/getdetail',
  DATA_SET_CONSTRUCT: '/resourcesmanager/dataSetConstruct',

  SERVER_PROXY: '/resourcesmanager/serverproxy',
  INTERFACE_PROXY: '/resourcesmanager/interfaceproxy',

  DATA_SET_REALATION_API: '/resourcesmanager/datasetsRelation',
  INTERFACE_DATA_SET_API: '/resourcesmanager/interfacedataset',
  DATA_SET_REALATION_DETAIL: '/resourcesmanager/datasetsRelation/getdetail',
  // 系统
  SYS_MENU: '/systemmanager/menudata',
  SYS_SCRIPT_GET: '/script/getScript',
  SYS_SCRIPT_PUT: '/script/updateScript',
  SYS_SCRIPT_POST: '/script/addScript',
  SYS_SCRIPT_DELETE: '/script/deleteScript',

  SYS_CONFIG: '/resourcesmanager/sysconfig',
  TDDL_CONFIG: '/resourcesmanager/tddlconfig',
  ONS_SERVER: '/resourcesmanager/onsserver',
  SFTP_SERVER: '/resourcesmanager/sftpserver',
  OSS_SERVER: '/resourcesmanager/ossserver',
  HTTP_SERVER: '/resourcesmanager/httpservers',
  TDDL_SERVER: '/resourcesmanager/tddlserver',
  DEPT_GET: '/department/getDepartmentInfo',
  STAFF_GET: '/usermanager/getstaff',
  ROLE_API: '/usermanager/roles',
  USER_ROLE_API: '/usermanager/userrole',

  // 工具类
  HTTP_DEBUG: '/contractdebug/httpapi',
  SCRIPT_GET: '/script/getScript',
  API_TO_JSON: '/api/res/jsontolist',
  LSIT_TO_JSON: '/api/res/listtojson',
  GET_SWAGGER_INTERFACE: '/resourcesmanager/swagger',
  // 导入单个接口
  SWAGGER_IMPORT_SINGLE: '/api/res/swagger/importSingle',
  // 全量导入接口
  SWAGGER_IMPORT_ALL: '/api/res/swagger/importAll',
  SWAGGER_API: '/api/res/swagger',
  HTTP_SWAGGER: '/resourcesmanager/httpdataconstruct/swagger',
  CACHE_GET_DATA: '/api/cache/getData',
  CACHE_SET_DATA: '/api/cache/setData',
  CACHE_DELETE_DATA: '/api/cache/deleteData',
  GET_REQUEST_BODY: '/api/res/getRequestBody',
  GET_PUBLIC_DATA: '/api/getpublicdata',

  // mock
  MOCK_CONFIG: '/resourcesmanager/mockconfig',
  MOCK_CONFIG_INFO: '/resourcesmanager/mockconfig/getMocksInfo',
  MOCK_CONFIG_FILETRS: '/resourcesmanager/mockconfig/getbyfilters',
  MOCK_CONFIG_UPDATE_SINGLE_STATUS: '/resourcesmanager/mockconfig/updatestatus',
  MOCK_CONFIG_UPDATE_REQ_CHECK: '/resourcesmanager/mockconfig/updateReqCheck',
  MOCK_CONFIG_UPDATE_RESP_CHECK: '/resourcesmanager/mockconfig/updateRespCheck',
  MOCK_CONFIG_UPDATE_ALL_STATUS: '/resourcesmanager/mockconfig/updateallstatus',
  INTERFACE_PROXY_STATUS: '/resourcesmanager/interfaceproxy/getStatus',
  MOCK_ROUTE_ENV_CHANGE: '/resourcesmanager/mockconfig/changeRouteEnv',

  MESSAGE_API_GET: '/message/getUnReadMessage',
  MESSAGE_API_UPDATE: '/message/updateMessage',
  MESSAGE_API_UPDATE_ONE: '/message/updateMessageById'
}
