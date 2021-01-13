import { mapGetters } from 'vuex'
import { CACHE_DELETE_DATA, CACHE_GET_DATA, CACHE_SET_DATA } from '../../../contractapi'
import { httpRequest } from '../../../http/interceptors'
import { convertTime } from '../../../utils/tools'

export default {
  data() {
    return {
      envTypeOptions: [
        { value: 'pre', label: 'pre' }, { value: 'test', label: 'test' }, { value: 'prd', label: 'prd' },
        { value: 'pub', label: 'pub' }
      ],
      loading: false,
      list: [], // 数据存储
      tmpApiList: [],
      searchTxt: '',
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: [],
      form: {
        env_type: '',
        key_name: '',
        describe: '',
        value: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        env_type: '',
        key_name: '',
        describe: '',
        value: ''
      },
      searchForm: {
        env_type: '',
        key_name: ''
      },
      rules: {
        key_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        env_type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入说明', trigger: 'blur' }
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
      this.searchForm.env_type = ''
      this.searchForm.key_name = ''
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', CACHE_GET_DATA)
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
      try {
        this.editForm.value = JSON.stringify(JSON.parse(row.value), null, 2)
      } catch (err) {
        this.editForm.value = row.value
      }
    },
    // 编辑
    async editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            env_type: this.editForm.env_type,
            key_name: this.editForm.key_name.trim(),
            describe: this.editForm.describe,
            value: this.editForm.value,
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('POST', CACHE_SET_DATA, HandleEdit)
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
        await httpRequest('DELETE', CACHE_DELETE_DATA + '?id=' + row.id)
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    convertDataFormat(row, col) {
      if (row.modifier != null) return row.modifier + '\n\t' + convertTime(row.update_time)
      return row.creator + '\n\t' + convertTime(row.create_time)
    },

    // 查询
    async search() {
      this.list = await httpRequest('GET', CACHE_GET_DATA + '?envType=' + this.searchForm.env_type + '&keyName=' + this.searchForm.key_name)
    },

    addForm() {
      this.addFormVisible = true
    },

    // 添加数据
    async add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            env_type: this.form.env_type,
            key_name: this.form.key_name,
            describe: this.form.describe,
            value: this.form.value,
            creator: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('POST', CACHE_SET_DATA, handleAddClick)
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
