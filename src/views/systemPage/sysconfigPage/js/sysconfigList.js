import { mapGetters } from 'vuex'
import { SYS_CONFIG } from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'

export default {
  data() {
    return {
      loading: false,
      list: [], // 数据存储
      searchTxt: '',
      tmpApiList: [],
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: [],
      form: {
        key: '',
        value: '',
        describe: '',
        type: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        key: '',
        value: '',
        describe: '',
        type: ''
      },
      searchForm: {
        key: '',
        describe: '',
        type: ''
      },
      rules: {
        key: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入取值', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      },
      addLoading: false,
      pagesize: 20,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    // this.vueTable()
  },
  beforeCreate() {
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
      this.searchForm.key = ''
      this.searchForm.describe = ''
      this.searchForm.type = ''
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', SYS_CONFIG)
      this.tmpApiList = this.list
    },
    getFilterApiList() {
      const search = this.searchTxt
      if (search) {
        return this.tmpApiList.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key]).indexOf(search) > -1
          })
        })
      }
      return this.tmpApiList
    },
    seachList() {
      this.list = this.getFilterApiList()
    },
    showDate(val) {
      val = val + ''
      if (val.indexOf(this.searchTxt) !== -1 && this.searchTxt !== '') {
        return val.replace(this.searchTxt, '<font color="#DF194C">' + this.searchTxt + '</font>')
      } else {
        return val
      }
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
            key: this.editForm.key.trim(),
            value: this.editForm.value.trim(),
            type: this.editForm.type,
            describe: this.editForm.describe,
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('PUT', SYS_CONFIG, HandleEdit)
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
        await httpRequest('DELETE', SYS_CONFIG + '?id=' + row.id)
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
      this.list = await httpRequest('GET', SYS_CONFIG + '?key=' +
        this.searchForm.key + '&describe=' + this.searchForm.describe +
        '&type=' + this.searchForm.type)
    },

    addForm() {
      this.addFormVisible = true
    },

    // 添加数据
    add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            key: this.form.key,
            value: this.form.value.trim(),
            type: this.form.type.trim(),
            describe: this.form.describe,
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('POST', SYS_CONFIG, handleAddClick)
          this.vueTable()
          this.addFormVisible = false
          this.form = {}
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
