import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      projectDetail: [],
      minute: '',
      hour: '',
      day_of_week: '',
      day_of_month: '',
      month_of_year: '',
      list: [], // 数据存储
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      options: [{
        value: 'days',
        label: 'days'
      }, {
        value: 'hours',
        label: 'hours'

      }, {
        value: 'minutes',
        label: 'minutes'

      }, {
        value: 'seconds',
        label: 'seconds'

      }, {
        value: 'microseconds',
        label: 'microseconds'

      }],
      value: '',

      form: { // 需要添加的字段
        name: '',
        every: '',
        period: ''

      },
      editForm: { // 编辑需要的字段
        name: '',
        every: '',
        period: '',
        id: '',
        interval_id: ''
      },
      searchForm: {
        project_code: '',
        project_name: ''
      },
      rules: {},
      addLoading: false,
      pager: {
        total: 0,
        pageIndex: 1,
        pageSize: 20,
        currentPage: 1 // 初始页
      }
    }
  },
  mounted() {
    // this.vueTable()
  },
  created() {
    this.vueTable()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {
    ListSearch(val) {
      this.list.forEach(val => {
      })
    }
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pager.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.pager.currentPage = currentPage
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },

    getDetailData() {
      this.projectDetail = this.$route.params.row
    },
    resetForm() {

    },
    // 获取列表
    vueTable() {
      this.$http({
        method: 'GET',
        url: '/resourcesmanager/projects/'
      }).then((returnData) => {
        if (returnData) {
          this.list = returnData.data
        }
      })
    },

    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 编辑
    editSubmit(row) {
      if (!this.editForm.every) { this.$message.error('频率不能为空') } else if (!this.editForm.period) { this.$message.error('期间不能为空') } else {
        const HandleEdit = {
          name: this.editForm.name,
          every: this.editForm.every,
          period: this.editForm.period,
          id: this.editForm.id,
          interval_id: this.editForm.interval_id
        }
        this.$http({
          method: 'PUT',
          url: '/resourcesmanager/projects/',
          data: {
            ...HandleEdit
          }
        }).then((returnData) => {
          if (returnData.code === '0000') {
            this.vueTable()
            this.$message.success(returnData.message)
            this.editFormVisible = false
          } else {
            this.$message.success(returnData.message)
          }
        })
      }
    },
    // 删除
    deleteItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: '/resourcesmanager/projects/?id=' + row.id
        }).then((returnData) => {
          if (returnData.code === '0000') {
            this.vueTable()
            this.$message.success(returnData.message)
          } else {
            this.$message.error(returnData.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 查询
    search() {
      this.$http({
        method: 'GET',
        url: '/tasksmanager/intervalschedele/?name=' + this.searchForm.name + '&minute=' +
          this.searchForm.minute
      }).then((returnData) => {
        if (returnData) {
          this.list = returnData.data
        }
      })
    },

    addForm() {
      this.dialogFormVisible = true
    },
    // 添加数据
    add() {
      if (!this.form.every) { this.$message.error('频率不能为空') } else if (!this.form.period) { this.$message.error('期间不能为空') } else {
        const handleAddClick = {
          name: this.form.name,
          every: this.form.every,
          period: this.form.period
        }
        this.$http({
          method: 'POST',
          url: '/resourcesmanager/projects/',
          data: {
            ...handleAddClick
          }
        }).then((returnData) => {
          if (returnData.code === '0000') {
            this.vueTable()
            this.dialogFormVisible = false
            this.$message.success(returnData.message)
            this.vueTable()
            this.form.name = ''
            this.form.every = ''
            this.form.period = ''
          } else {
            this.$message.error(returnData.message)
          }
        })
      }
    },
    handleDetail(index, row) {
      this.$router.push({ name: '/projectdetail', params: { id: '123' }})
    }
  }
}
