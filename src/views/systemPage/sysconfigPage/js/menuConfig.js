import { mapGetters } from 'vuex'
import { ROLE_API, SYS_MENU } from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'

export default {
  data() {
    return {
      menuOptionList: [],
      roleOptions: [],
      showOptions: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      list: [], // 数据存储
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: [],
      form: {
        index: '',
        title: '',
        icon: '',
        path: '',
        component: '',
        pid: '',
        role: '',
        show: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        index: '',
        title: '',
        icon: '',
        path: '',
        component: '',
        pid: '',
        role: '',
        show: ''
      },
      searchForm: {
        role: '',
        title: '',
        pid: '',
        show: ''
      },
      rules: {
        path: [
          { required: true, message: '请输入路径', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件', trigger: 'blur' }
        ]
      },
      addLoading: false,
      pagesize: 10,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    // this.vueTable()
    this.getRolesOptions()
  },
  created() {
    this.vueTable()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {
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
    async getRolesOptions() {
      if (sessionStorage.getItem('roleOptions') != null) {
        this.roleOptions = JSON.parse(sessionStorage.getItem('roleOptions'))
      } else {
        const returnData = await httpRequest('GET', ROLE_API)
        returnData.forEach((value) => {
          this.roleOptions.push({
            label: value.role_name,
            value: value.id
          })
        })
        sessionStorage.setItem('roleOptions', JSON.stringify(this.roleOptions))
      }
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', SYS_MENU)
      this.convertMenuData(this.list)
    },

    convertMenuData(menuData) {
      menuData.forEach((value) => {
        value.children = ''
        if (value.show === true) {
          value.is_show = '是'
        } else {
          value.is_show = '否'
        }
        this.menuOptionList.push({
          label: value.title,
          value: value.id
        })
      })
    },

    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.editForm.submitRole = this.editForm.role
      this.editForm.role = this.editForm.role_name
      this.editForm.submitPid = this.editForm.pid
      this.editForm.pid = this.editForm.parent_menu_name
      this.editForm.submitShwo = this.editForm.show
      this.editForm.show = this.editForm.is_show
    },
    changeParent() {
      this.editForm.submitPid = this.editForm.pid
    },
    changeRole() {
      this.editForm.submitRole = this.editForm.role
    },
    changeShow() {
      this.editForm.subShow = this.editForm.show
    },
    // 编辑
    editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            index: this.editForm.index,
            title: this.editForm.title,
            icon: this.editForm.icon,
            path: this.editForm.path,
            component: this.editForm.component,
            pid: this.editForm.submitPid,
            role: this.editForm.submitRole,
            show: this.editForm.submitShwo
          }
          this.list = await httpRequest('PUT', SYS_MENU, HandleEdit)
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
        await httpRequest('DELETE', SYS_MENU + '?id=' + row.id)
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
      this.list = await httpRequest('GET', SYS_MENU + '?title=' + this.searchForm.title + '&role=' + this.searchForm.role +
        '&pid=' + this.searchForm.pid + '&show=' + this.searchForm.show)
      this.convertMenuData(this.list)
    },

    addForm() {
      this.addFormVisible = true
    },

    // 添加数据
    add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            index: this.form.index,
            title: this.form.title,
            icon: this.form.icon,
            path: this.form.path,
            component: this.form.component,
            pid: this.form.pid,
            role: this.form.role,
            show: this.form.show
          }
          await httpRequest('POST', SYS_MENU, handleAddClick)
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
