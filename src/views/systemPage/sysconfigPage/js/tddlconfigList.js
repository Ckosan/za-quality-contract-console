import { mapGetters } from 'vuex'
import { SYS_CONFIG, TDDL_CONFIG } from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'

export default {
  data() {
    return {
      loading: false,
      list: [], // 数据存储
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: {
        envOptions: []
      },
      form: {
        app_name: '',
        env_type: '',
        describe: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        app_name: '',
        env_type: '',
        describe: ''
      },
      projectNameOptions: [],
      searchForm: {
        app_name: '',
        env_type: '',
        describe: ''
      },
      rules: {
        app_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        env_type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '清输入描述', trigger: 'blur' }
        ]
      },
      addLoading: false,
      pagesize: 10,
      currentPage: 1 // 初始页
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
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', TDDL_CONFIG)
      this.getEnvOptions()
    },
    // 获取TDDL环境拉下列表数据
    async getEnvOptions() {
      this.options.envOptions = []
      const returnData = await httpRequest('GET', SYS_CONFIG + '?type=' + 'tddl')
      const listArray = []
      returnData.forEach((value) => {
        listArray.push({
          value: value.key,
          label: value.key + '(' + value.describe + ')'
        })
      })
      this.options.envOptions = listArray
    },

    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 编辑
    async editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            app_name: this.editForm.app_name.trim(),
            env_type: this.editForm.env_type,
            describe: this.editForm.describe
          }
          await httpRequest('PUT', TDDL_CONFIG, HandleEdit)
          this.vueTable()
          this.editFormVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    // 删除
    deleteItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', TDDL_CONFIG + '?id=' + row.id)
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 查询
    async search() {
      this.list = await httpRequest('GET', TDDL_CONFIG + '?app_name=' + this.searchForm.app_name + '&describe=' +
        this.searchForm.describe + '&env_type=' + this.searchForm.env_type)
    },

    addForm() {
      this.addFormVisible = true
    },

    // 添加数据
    async add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            app_name: this.form.app_name,
            env_type: this.form.env_type,
            describe: this.form.describe
          }
          await httpRequest('POST', TDDL_CONFIG, handleAddClick)
          this.vueTable()
          this.addFormVisible = false
          this.form = {}
        } else {
          console.log('error submit!!')
        }
      })
    },
    // 数据库同步
    async syncDB(index, row) {
      this.loading = true
      const HandleEdit = {
        id: row.id,
        appname: row.app_name,
        sqlstmt: 'SHOW TABLES',
        opt_type: 'synctable',
        env_type: row.env_type
      }
      await httpRequest('POST', '/resourcesmanager/tddlserver', HandleEdit)
    }

  }
}
