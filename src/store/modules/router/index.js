import http from '@/http'

const Router = {
  state: {
    storeRouterInfo: {}
  },
  mutations: {
    UPDATE_ROUTER_INFO(state, data) {
      state.storeRouterInfo = data
    }
  },
  actions: {
    getRouterInfo: ({ commit }, params) => {
      http({
        url: '/config/getRouterInfo',
        data: params
      }).then(data => {
        commit('UPDATE_ROUTER_INFO', data)
      })
    }

  },
  getters: {
    storeRouterInfo: state => state.storeRouterInfo
  }
}

export default Router
