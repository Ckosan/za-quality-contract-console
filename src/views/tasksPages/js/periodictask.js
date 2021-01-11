import { mapGetters } from 'vuex'

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import BackToTop from '@/components/BackToTop'
// eslint-disable-next-line no-unused-vars
import elDragDialog from '@/directive/el-drag-dialog'
// eslint-disable-next-line no-unused-vars
import SELECT_DATA, { getConfigItem, DateFormat } from '@/utils/selectData'
// eslint-disable-next-line no-unused-vars,no-unused-vars
import { Notification } from 'element-ui'
// eslint-disable-next-line no-unused-vars
import { parseTime } from '@/utils'
import { datetimetransfer, flagformatForm, dateFormat, flagFormat } from '@/utils/formatTransfer'

export default {
  data() {
    return {
      flagFormat: flagFormat,
      dateFormat: dateFormat,
      isenable: '',
      task: '',
      name: '',
      relation_flag: '',
      list: [], // 数据存储
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      loading: false,
      taskoptions: [{
        value: 'api.tasks.runtestcase_task',
        label: 'api.tasks.runtestcase_task'
      }, {
        value: 'api.tasks.celery_test',
        label: 'api.tasks.celery_test'

      }],
      crontabtypeoptions: [
        {
          value: '频率',
          label: '频率'
        }, {
          value: '时间段',
          label: '时间段'

        }
      ],
      enabledoptions: [
        {
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否' }
      ],
      intervaloptions: [],
      crontaboptions: [],
      options: [],
      value: '',

      form: { // 需要添加的字段
        name: '',
        task: '',
        args: '',
        kwargs: '',
        queue: '',
        exchange: '',
        routing_key: '',
        expires: '',
        enabled: '',
        interval: '',
        crontab: '',
        crontabtype: ''
      },
      editForm: { // 编辑需要的字段
        name: '',
        task: '',
        args: '',
        kwargs: '',
        queue: '',
        exchange: '',
        routing_key: '',
        expires: '',
        enabled: '',
        interval: '',
        crontab: '',
        id: '',
        crontabtype: ''
      },
      searchForm: {
        name: '',
        task: '',
        interval: '',
        crontab: '',
        enabled: ''
      },
      addLoading: false,
      currentPage: 1, // 初始页
      pagesize: 5, //	每页的数据
      pager: {
        total: 0,
        pageIndex: 1,
        pageSize: 20,
        currentPage: 1 // 初始页
      },
      rules: {

      }
    }
  },
  mounted() {
    this.getintervaloptions()
    this.getcrontaboptions()
    // this.gettaskoptions()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  created() {
    this.getintervaloptions()
    this.getcrontaboptions()
    this.vueTable()
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
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },

    handleSelectionChange(selection) {
      this.selection = selection
    },
    // 获取列表
    vueTable() {
      this.loading = true
      this.$http({
        method: 'GET',
        url: '/tasksmanager/periodictask/'
      }).then((returnData) => {
        if (returnData) {
          this.list = returnData
          this.loading = false
        }
      })
    },
    getintervaloptions() {
      this.intervaloptions = []
      this.$http({
        method: 'GET',
        url: 'tasksmanager/intervalschedele/'
      }).then((returnData) => {
        if (returnData) {
          this.data = returnData
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({ value: key, label: returnData[key].name })
          }
          ListArray.push({ value: false, label: '--' })
          this.intervaloptions = ListArray
        }
      })
    },
    getcrontaboptions() {
      this.crontaboptions = []
      this.$http({
        method: 'GET',
        url: 'tasksmanager/crontabschedule/'
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({ value: key, label: returnData[key].name })
          }
          ListArray.push({ value: false, label: '--' })
          this.crontaboptions = ListArray
        }
      })
    },
    gettaskoptions() {
      this.taskoptions = []
      this.$http({
        method: 'GET',
        url: 'tasksmanager/crontabschedule/'
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({ value: key, label: returnData[key].id })
          }
          this.crontaboptions = ListArray
        }
      })
    },
    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      if (this.editForm.enabled) {
        this.editForm.enabled = '是'
      } else {
        this.editForm.enabled = '否'
      }
    },
    // 编辑
    editSubmit(row) {
      if (!this.editForm.name) { this.$message.error('名称不能为空') } else if (!this.editForm.task) { this.$message.error('任务不能为空') } else if
      (this.editForm.interval && this.editForm.crontab && this.editForm.interval != '--' && this.editForm.crontab != '--') {
        this.$message.error('间隔类型和定时类型只能二选一')
      } else {
        console.log(this.editForm.expires)
        const HandleEdit = {
          id: this.editForm.id,
          name: this.editForm.name,
          task: this.editForm.task,
          args: this.editForm.args,
          kwargs: this.editForm.kwargs,
          queue: this.editForm.queue,
          exchange: this.editForm.exchange,
          routing_key: this.editForm.routing_key,
          expires: datetimetransfer(this.editForm.expires),
          enabled: flagformatForm(this.editForm.enabled),
          interval: this.intrvalcrontabformat(this.editForm.interval),
          crontab: this.intrvalcrontabformat(this.editForm.crontab)
        }
        this.$http({
          method: 'PUT',
          url: '/tasksmanager/periodictask/',
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
          url: '/tasksmanager/periodictask/?id=' + row.id
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
        url: '/tasksmanager/periodictask/?name=' + this.searchForm.name + '&task=' +
          this.searchForm.task + '&enable=' + flagformatForm(this.searchForm.isenable)
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
    addPriodictTask() {
      if (!this.form.name) { this.$message.error('名称不能为空') } else {
        const handleAddClick = {
          name: this.form.name,
          task: this.form.task,
          args: this.form.args,
          kwargs: this.form.kwargs,
          queue: this.form.queue,
          exchange: this.form.exchange,
          routing_key: this.form.routing_key,
          expires: datetimetransfer(this.form.expires),
          enabled: this.form.enabled,
          interval: this.intrvalcrontabformat(this.form.interval),
          crontab: this.intrvalcrontabformat(this.form.crontab)
        }
        this.$http({
          method: 'POST',
          url: '/tasksmanager/periodictask/',
          data: {
            ...handleAddClick
          }
        }).then((returnData) => {
          this.vueTable()
          this.dialogFormVisible = false
          this.$message.success('添加成功')
          this.vueTable()
          this.form.name = ''
          this.form.task = ''
          this.form.args = ''
          this.form.kwargs = ''
          this.form.queue = ''
          this.form.exchange = ''
          this.form.routing_key = ''
          this.form.expires = ''
          this.form.enabled = ''
          this.form.interval = ''
          this.form.crontab = ''
        })
      }
    },
    // --格式化
    intrvalcrontabformat(data) {
      if (data === '--') {
        return ''
      } else {
        return data
      }
    },
    indexadd(row, column) {
      var index_num = row[column.property]
      return Number(index_num) + Number(1)
    },
    // 重置搜索框
    resetForm() {
      this.searchForm.name = ''
    }
  }
}
