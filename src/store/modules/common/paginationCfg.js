export default {
  state: {
    pageSize: 20, // 每页显示条目个数
    pageSizes: [20, 50, 100], // 每页显示个数选择器的选项设置
    layout: 'total, sizes, prev, pager, next' //, jumper组件布局，子组件名用逗号分隔
  },
  getters: {
    pagination(state) {
      return state
    }
  }
}
