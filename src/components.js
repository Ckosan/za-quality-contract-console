// components.js 所有的页面资源
// 布局排版
const Layout = () => import('@/layout/index')
// 业务类
const index = () => import('@/views/dashboard/index')
const tddlServer = () => import('@/views/businessPage/tddlServerPage/templates/tddlServer')
const onsServer = () => import('@/views/businessPage/onsServerPage/templates/onsServer')
const tableDetail = () => import('@/views/businessPage/tddlServerPage/templates/tableDetail')

// 配置类
const projectList = () => import('@/views/configPage/projectManagerPage/templates/projectList')
const projectDetail = () => import('@/views/configPage/projectManagerPage/templates/projectDetail')
const applicationList = () => import('@/views/configPage/applicationManagerPage/templates/applicationList')
const applicationDetail = () => import('@/views/configPage/applicationManagerPage/templates/applicationDetail')
const serverList = () => import('@/views/configPage/serverManagerPage/templates/serverList')
const serverDetail = () => import('@/views/configPage/serverManagerPage/templates/serverDetail')
const apidataversiondetail = () => import('@/views/configPage/dataManagerPage/templates/httpDataConstructDetail')
const onsDataConstructDetail = () => import('@/views/configPage/dataManagerPage/templates/onsDataConstructDetail')
const ossDataConstructDetail = () => import('@/views/configPage/dataManagerPage/templates/ossDataConstructDetail')
const sftpDataConstructDetail = () => import('@/views/configPage/dataManagerPage/templates/sftpDataConstructDetail')
const apidatabranchdetail = () => import('@/views/configPage/dataManagerPage/templates/apiDataBranchDetail')
const apidatabranchmerge = () => import('@/views/configPage/dataManagerPage/templates/apiDataBranchMerge')
const apimockconfiglist = () => import('@/views/configPage/dataManagerPage/templates/apiMockConfigList')
const apicontractdoc = () => import('@/views/configPage/dataManagerPage/templates/apiMockConfigList')
const apidatadetslist = () => import('@/views/configPage/dataManagerPage/templates/apiDataSetsList')
const apidatasetsdetail = () => import('@/views/configPage/dataManagerPage/templates/apiDataSetsDetail')

// 统计类
const statistics1 = () => import('@/views/statisticsPage/statistics1')
const statistics2 = () => import('@/views/statisticsPage/statistics2')
// 任务类
const crontabschedule = () => import('@/views/tasksPages/templates/crontabschedule')
const intervalschedule = () => import('@/views/tasksPages/templates/intervalschedule')
const periodictask = () => import('@/views/tasksPages/templates/periodictask')
// 契约中心
const contract = () => import('@/views/contractPage/contractManagerPage/contract')
const monitor = () => import('@/views/contractPage/monitorManagerPage/monitor')

const proxyloglist = () => import('@/views/dataconfigPage/mockConfigPage/templates/proxyLogList')
const proxyconfiglist = () => import('@/views/dataconfigPage/mockConfigPage/templates/serverProxyConfigList')
const mockconfiglist = () => import('@/views/dataconfigPage/mockConfigPage/templates/apiMockConfigList')
const apidatasetlist = () => import('@/views/dataconfigPage/dataSetConfigPage/templates/apiDataSetList')
const datawarehouselist = () => import('@/views/dataconfigPage/dataSetConfigPage/templates/dataWarehouseList')

// 默认
const sysconfigList = () => import('@/views/systemPage/sysconfigPage/templates/sysconfigList')
const tddlconfigList = () => import('@/views/systemPage/sysconfigPage/templates/tddlconfigList')
const permissionconfigList = () => import('@/views/systemPage/sysconfigPage/templates/permissionconfigList')
const menuconfigList = () => import('@/views/systemPage/sysconfigPage/templates/menuconfigList')
const rolesconfigList = () => import('@/views/systemPage/sysconfigPage/templates/roleconfigList')
// 工具类
const customScriptList = () => import('@/views/toolsPage/templates/customScriptList')
const cacheList = () => import('@/views/toolsPage/templates/cacheList')

export default {
  Layout,
  index,
  tddlServer,
  onsServer,
  tableDetail,

  projectList,
  projectDetail,
  applicationList,
  applicationDetail,
  serverList,
  serverDetail,
  apidataversiondetail,
  onsDataConstructDetail,
  ossDataConstructDetail,
  sftpDataConstructDetail,
  apidatabranchdetail,
  apidatabranchmerge,
  apimockconfiglist,
  apicontractdoc,
  apidatadetslist,
  apidatasetsdetail,
  // 统计类
  statistics1,
  statistics2,
  // 任务类
  crontabschedule,
  intervalschedule,
  periodictask,
  // 契约中心
  contract,
  monitor,
  proxyloglist,
  proxyconfiglist,
  mockconfiglist,
  apidatasetlist,
  datawarehouselist,

  sysconfigList,
  tddlconfigList,
  permissionconfigList,
  menuconfigList,
  rolesconfigList,

  customScriptList,
  cacheList
}
