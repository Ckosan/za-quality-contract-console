import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      minute: '',
      hour: '',
      day_of_week: '',
      day_of_month: '',
      month_of_year: '',
      list: [], // 数据存储
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      options: [],
      value: '',

      form: { // 需要添加的字段
        name: '',
        minute: '*',
        hour: '*',
        day_of_week: '*',
        day_of_month: '*',
        month_of_year: '*'

      },
      editForm: { // 编辑需要的字段
        name: '',
        minute: '',
        hour: '',
        day_of_week: '',
        day_of_month: '',
        month_of_year: '',
        id: '',
        crontab_id: ''
      },
      searchForm: {
        name: '',
        minute: '',
        hour: '',
        day_of_week: '',
        day_of_month: '',
        month_of_year: ''
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
    resetForm() {

    },
    // 获取列表
    vueTable() {
      this.$http({
        method: 'GET',
        url: '/tasksmanager/crontabschedule/'
      }).then((returnData) => {
        if (returnData) {
          this.list = returnData
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
      if (!this.editForm.minute) { this.$message.error('分钟不能为空') } else if
      (!this.editForm.hour) { this.$message.error('小时不能为空') } else if
      (!this.editForm.day_of_week) { this.$message.error('周不能为空') } else if
      (!this.editForm.day_of_month) { this.$message.error('月不能为空') } else if
      (!this.editForm.month_of_year) { this.$message.error('年不能为空') } else {
        const HandleEdit = {
          name: this.editForm.name,
          id: this.editForm.id,
          minute: this.editForm.minute,
          hour: this.editForm.hour,
          day_of_week: this.editForm.day_of_week,
          day_of_month: this.editForm.day_of_month,
          month_of_year: this.editForm.month_of_year,
          crontab_id: this.editForm.crontab_id
        }
        this.$http({
          method: 'PUT',
          url: '/tasksmanager/crontabschedule/',
          data: {
            ...HandleEdit
          }
        }).then((returnData) => {
          this.vueTable()
          this.$message.success('修改成功')
          this.editFormVisible = false
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
          url: '/tasksmanager/crontabschedule/?id=' + row.id
        }).then((returnData) => {
          this.vueTable()
          this.$message.success('删除成功')
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
        url: '/tasksmanager/crontabschedule/?name=' + this.searchForm.name + '&minute=' +
          this.searchForm.minute
      }).then((returnData) => {
        if (returnData) {
          this.list = returnData
        }
      })
    },

    addForm() {
      this.dialogFormVisible = true
    },
    // 添加数据
    add() {
      if (!this.form.name) { this.$message.error('名称不能为空') } else if
      (!this.form.minute) { this.$message.error('分钟不能为空') } else if
      (!this.form.hour) { this.$message.error('小时不能为空') } else if
      (!this.form.day_of_week) { this.$message.error('周不能为空') } else if
      (!this.form.day_of_month) { this.$message.error('月不能为空') } else if
      (!this.form.month_of_year) { this.$message.error('年不能为空') } else {
        const handleAddClick = {
          name: this.form.name,
          minute: this.form.minute,
          hour: this.form.hour,
          day_of_week: this.form.day_of_week,
          day_of_month: this.form.day_of_month,
          month_of_year: this.form.month_of_year
        }
        this.$http({
          method: 'POST',
          url: '/tasksmanager/crontabschedule/',
          data: {
            ...handleAddClick
          }
        }).then((returnData) => {
          this.vueTable()
          this.dialogFormVisible = false
          this.$message.success('添加成功')
          this.form.minute = ''
          this.form.hour = ''
          this.form.day_of_week = ''
          this.form.day_of_month = ''
          this.form.month_of_year = ''
        })
      }
    }
  }
}
