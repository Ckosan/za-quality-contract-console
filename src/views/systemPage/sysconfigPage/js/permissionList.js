import { mapGetters } from 'vuex'
import { ROLE_API, STAFF_GET, USER_ROLE_API } from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'
import { getStaffData } from '../../../../utils/tools'

export default {
  data() {
    return {
      staffOptions: [],
      staffOptionsList: [],
      roleOptions: [],
      loading: false,
      list: [], // 数据存储
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: [],
      form: {
        user_id: '',
        role_id: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        user_id: '',
        role_id: ''
      },
      searchForm: {
        user_id: '',
        role_id: ''
      },
      rules: {
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
  beforeCreate() {
  },
  created() {
    this.vueTable()
    getStaffData()
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
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.staffOptions = this.staffOptionsList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.staffOptions = []
      }
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
    async getStaffOptions() {
      if (sessionStorage.getItem('staffOptionsList') != null) {
        this.staffOptionsList = JSON.parse(sessionStorage.getItem('staffOptionsList'))
      } else {
        const returnData = await httpRequest('GET', STAFF_GET)
        returnData.forEach((value) => {
          this.staffOptionsList.push({
            label: value.name + '(' + value.email + ')',
            value: value.user_id,
            email: value.email
          })
        })
        sessionStorage.setItem('staffOptionsList', JSON.stringify(this.staffOptionsList))
      }
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', USER_ROLE_API)
    },

    // 显示编辑弹出框
    handleEdit(index, row) {
      this.getStaffOptions()
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.editForm.subUserid = this.editForm.user_id
      this.editForm.user_id = this.editForm.user_name + '(' + this.editForm.email + ')'
    },
    userChange() {
      this.editForm.subUserid = this.editForm.user_id
    },
    // 编辑
    editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            user_id: this.editForm.subUserid,
            role_id: this.editForm.role_id
          }
          await httpRequest('PUT', USER_ROLE_API, HandleEdit)
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
        await httpRequest('DELETE', USER_ROLE_API + '?id=' + row.id)
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
      this.list = await httpRequest('GET', USER_ROLE_API + '?user_id=' +
        this.searchForm.user_id + '&role_id=' + this.searchForm.role_id)
    },

    addForm() {
      this.getStaffOptions()
      this.addFormVisible = true
    },

    // 添加数据
    add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            user_id: this.form.user_id,
            role_id: this.form.role_id
          }
          await httpRequest('POST', USER_ROLE_API, handleAddClick)
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
