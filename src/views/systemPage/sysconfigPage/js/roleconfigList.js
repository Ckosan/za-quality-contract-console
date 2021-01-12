import { mapGetters } from 'vuex'
import { ROLE_API } from '../../../../contractapi'
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
      options: [],
      form: {
        role_value: '',
        role_name: '',
        remark: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        role_value: '',
        role_name: '',
        remark: ''
      },
      searchForm: {
        role_name: '',
        remark: ''
      },
      rules: {
        role_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        role_value: [
          { required: true, message: '请输入值', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
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
      this.list = await httpRequest('GET', ROLE_API)
    },

    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 编辑
    editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            role_value: this.editForm.role_value,
            role_name: this.editForm.role_name.trim(),
            remark: this.editForm.remark
          }
          await httpRequest('PUT', ROLE_API, HandleEdit)
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
        await httpRequest('DELETE', ROLE_API + '?id=' + row.id)
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
      this.list = await httpRequest('GET', ROLE_API + '?role_name=' + this.searchForm.role_name +
        '&remark=' + this.searchForm.remark)
    },

    addForm() {
      this.addFormVisible = true
    },

    // 添加数据
    add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            role_value: this.form.role_value,
            role_name: this.form.role_name,
            remark: this.form.remark
          }
          await httpRequest('POST', ROLE_API, handleAddClick)
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
