
const Main = {
  state: {
    loading: false,
    regionLoading: false,
    // 每个页面的权限菜单
    pagePermissionsMenu: {},
    // 登录用户菜单
    loginUserMenus: [],
    // 项目员工
    staffOptionsList: [],
    // 应用员工
    staffOptionsListForApplication: [],
    // http
    httpDebugEnvList: []
  },
  mutations: {
    // 开启全局遮罩
    LOADING(state) {
      state.loading = true
    },
    // 关闭全局遮罩
    UNLOADING(state) {
      state.loading = false
    },
    // 开启列表局部遮罩
    REGION_LOADING(state) {
      state.regionLoading = true
    },
    // 关闭列表局部遮罩
    UN_REGION_LOADING(state) {
      state.regionLoading = false
    },
    QUERY_ShowMy_MENUS(state, value) {
      state.loginUserMenus = value
    },
    PROJECT_STFF_INFO(state, value) {
      state.staffOptionsList = value
    },
    APPLICATION_STFF_INFO(state, value) {
      state.staffOptionsListForApplication = value
    },
    HTTP_DEBUG_ENV(state, value) {
      state.httpDebugEnvList = value
    }
  },
  getters: {
    regionLoading(state, rootState) {
      return state.regionLoading
    },
    pagePermissionsMenu(state, rootState) {
      return state.pagePermissionsMenu
    },

    loginUserMenus(state, rootState) {
      return state.loginUserMenus
    },

    loading(state, rootState) {
      return state.loading
    },
    staffOptionsLists(state, rootState) {
      return state.staffOptionsList
    },
    staffOptionsListForApplication(state, rootState) {
      return state.staffOptionsListForApplication
    },
    httpDebugEnvList(state, rootState) {
      return state.httpDebugEnvList
    }
  }
}

export default Main

