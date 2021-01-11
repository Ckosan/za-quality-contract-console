import { getSystemEnum, getSystemProductList } from '@/api/common'

const state = {
  systemMap: {},
  productList: [],
  userInfo: {}
}

const mutations = {
  QUERY_SYSTEM_ENUM: (state, val) => {
    state.systemMap = val
  },
  QUERY_PRODUCT_LIST: (state, val) => {
    state.productList = val
  },

  QUERY_USER_INFO: (state, val) => {
    state.userInfo = val
  }
}

const actions = {
  querySystemEnum({ commit }) {
    getSystemEnum().then(res => {
      commit('QUERY_SYSTEM_ENUM', res)
    })
  },
  queryProductList({ commit }) {
    getSystemProductList().then(res => {
      commit('QUERY_PRODUCT_LIST', res)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
