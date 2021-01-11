export default {
  state: {
    branchTypeOpts: [
      { label: 'ADD', value: 'ADD' },
      { label: 'ADD_PIPELINE', value: 'ADD_PIPELINE' },
      { label: 'EXITWITH', value: 'EXITWITH' },
      { label: 'GOTO', value: 'GOTO' },
      { label: 'GOTO_LAST', value: 'GOTO_LAST' },
      { label: 'TERMINATED', value: 'TERMINATED' }
    ],
    valveOpts: [{ label: 'on', value: 'on' }, { label: 'off', value: 'off' }],
    asyncOpts: [{ label: '是', value: 'true' }, { label: '否', value: 'false' }]
  },
  mutations: {
    Set_ProductCode(state, productCode) {
      state.productCode = productCode
    }
  },
  getters: {
    branchTypeOpts: state => state.branchTypeOpts,
    valveOpts: state => state.valveOpts,
    asyncOpts: state => state.asyncOpts,
    productCode: state => state.productCode
  }
}
