import { mapGetters } from 'vuex'
import { SYS_CONFIG, TDDL_CONFIG, TDDL_SERVER } from '../../../../contractapi'

export default {
  data() {
    return {
      loading: false,
      list: [], // 数据存储
      cols: [],
      tableData: [],
      queryFlag: false,
      options: {
        envOptions: [],
        appnameOptions: [],
        tableOptions: []
      },
      form: {
        sqlstmt: ''
      },
      searchForm: {
        app_name: '',
        env_type: '',
        table_name: ''
      },
      rules: {},
      addLoading: false,
      pagesize: 15,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    this.getEnvOptions()
  },
  created() {
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
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    resetForm() {
      this.searchForm.app_name = ''
      this.searchForm.describe = ''
      this.searchForm.env_type = ''
    },
    // 获取TDDL环境拉下列表数据
    getEnvOptions() {
      this.options.envOptions = []
      this.$http({
        method: 'GET',
        url: SYS_CONFIG + '?type=' + 'tddl'
      }).then((returnData) => {
        if (returnData) {
          const listArray = []
          for (const key in returnData) {
            returnData[key].index = key
            listArray.push({
              value: returnData[key].key,
              label: returnData[key].key + '(' + returnData[key].describe + ')'
            })
          }
          this.options.envOptions = listArray
        }
      })
    },
    // 查询
    search() {
      if (!this.form.sqlstmt) {
        this.$message.error('SQL语句不能为空')
      } else {
        const handleAddClick = {
          appname: this.searchForm.app_name,
          sqlstmt: this.form.sqlstmt,
          opt_type: 'query',
          env_type: this.searchForm.env_type
        }
        this.$http({
          method: 'POST',
          url: TDDL_SERVER,
          data: {
            ...handleAddClick
          }
        }).then((returnData) => {
          this.tableData = []
          this.cols = []
          // 调整表格lable
          if (returnData) {
            const cololist = returnData[0]
            console.log(cololist)
            const templist = []
            for (var key in cololist) {
              templist.push(key)
            }
            for (var i = 0; i < templist.length; i++) {
              this.cols.push({ key: i, label: templist[i], prop: templist[i] })
            }
            this.tableData = returnData
          }
          this.queryFlag = true
          this.$message.success('查询成功')
        })
      }
    },
    // 数据库更新
    update() {
      if (!this.form.sqlstmt) {
        this.$message.error('SQL语句不能为空')
      } else {
        const handleAddClick = {
          appname: this.searchForm.app_name,
          sqlstmt: this.form.sqlstmt,
          opt_type: 'update',
          env_type: this.searchForm.env_type
        }
        this.$http({
          method: 'POST',
          url: TDDL_SERVER,
          data: {
            ...handleAddClick
          }
        }).then((returnData) => {
          if (returnData >= 1) {
            this.$message.success('修改成功')
          } else {
            this.$message.success('修改失败')
          }
        })
      }
    },
    // 查询表结构
    queryTableDDL() {
      if (!this.searchForm.env_type) {
        this.$message.error('请选择环境类型')
      } else if (!this.searchForm.app_name) {
        this.$message.error('请选择app名称')
      } else if (!this.searchForm.table_name) {
        this.$message.error('请选择数据库表')
      } else {
        this.$router.push({
          path: '/tabledetail/', query: {
            appname: this.searchForm.app_name,
            tablename: this.searchForm.table_name, env_type: this.searchForm.env_type
          }
        })
      }
    },
    getApps() {
      this.searchForm.app_name = ''
      this.options.appnameOptions = []
      this.$http({
        method: 'GET',
        url: TDDL_CONFIG + '?env_type=' + this.searchForm.env_type
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({
              value: returnData[key].id,
              label: returnData[key].app_name
            })
          }
          this.options.appnameOptions = ListArray
        }
      })
    },
    getTables() {
      this.searchForm.table_name = ''
      this.options.tableOptions = []
      this.$http({
        method: 'GET',
        url: TDDL_SERVER + '?appname=' + this.searchForm.app_name
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({
              value: returnData[key].id,
              label: returnData[key].table_name
            })
          }
          this.options.tableOptions = ListArray
        }
      })
    }
  }
}
