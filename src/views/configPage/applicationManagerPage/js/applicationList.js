import { mapGetters } from 'vuex'
import { APPLICATION, PROJECT } from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'
import { convertTime, getStaffData, removeDuplicateOptions } from '../../../../utils/tools'
import { isCode } from '../../../../utils/validata_rules'

export default {
  data() {
    return {
      searchTxt: '',
      appStatusOptions: [{ key: 1, label: '已上线', value: '已上线' }, { key: 2, label: '未上线', value: '未上线' }],
      loading: false,
      list: [], // 数据存储
      tmpApiList: [],
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      addFormVisible: false,
      editFormVisible: false, // 编辑器弹出框
      options: [],
      projectNameOptions: [],
      projectCodeOptions: [],
      applicationNameOptions: [],
      applicationCodeOptions: [],
      projectOptions: [],
      editFormOptions: [],
      projectcode: '',
      value: '',
      form: { // 需要添加的字段
        application_name: '',
        application_code: '',
        developers: [{
        }],
        testers: [{
        }],
        application_describe: '',
        application_status: '',
        project_id: ''
      },
      staffOptionsList: [],
      staffOptions: [],
      editForm: { // 编辑需要的字段
        application_name: '',
        application_code: '',
        developers: [],
        testers: [],
        application_describe: '',
        application_status: '',
        project_id: ''
      },
      searchForm: {
        projectinfo: '',
        applicationinfo: '',
        application_name: '',
        application_code: ''
      },
      rules: {
        project_id: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
        ],
        application_status: [
          { required: true, message: '应用状态不能为空', trigger: 'blur' }
        ],
        application_describe: [
          { required: true, message: '应用说明不能为空', trigger: 'blur' }
        ],
        application_code: [
          { required: true, message: '应用代码不能为空', trigger: 'blur' },
          { validator: isCode, trigger: 'blur' }
        ]
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1 // 初始页

    }
  },
  mounted() {
    // this.vueTable()
  },
  created() {
    this.vueTable()
    this.getProjectOptions()
    getStaffData()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {
    ListSearch(val) {
      this.list.forEach(val => {
      })
    },
    seachList() {
      this.list = this.seachList()
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
    seachList() {
      this.list = this.getFilterApiList()
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
    resetForm() {
      this.searchForm.projectinfo = ''
      this.searchForm.applicationinfo = ''
      this.projectNameOptions = JSON.parse(sessionStorage.getItem('allProjects'))
      this.applicationNameOptions = JSON.parse(sessionStorage.getItem('allApplications'))
    },
    // 获取列表
    async vueTable() {
      this.loading = true
      const returnData = await httpRequest('GET', APPLICATION)
      var tmplist = []
      returnData.forEach((value) => {
        value.project_info = value.project_name + '(' + value.project_code + ')'
        this.projectNameOptions = removeDuplicateOptions({
          key: value.project_info,
          label: value.project_info,
          value: value.project_id
        }, this.projectNameOptions)
        this.applicationNameOptions = removeDuplicateOptions({
          key: value.application_name + '(' + value.application_code + ')',
          label: value.application_name + '(' + value.application_code + ')',
          value: value.id
        }, this.applicationNameOptions)
        const serverList = value.server_info
        var serverinfo = ''
        const servers = []
        if (serverList.length === 0) {
          value.server_info = ''
        } else {
          for (var j = 0; j < serverList.length; j++) {
            servers.push(serverList[j].server_type)
          }
        }
        var serverListArray = Array.from(new Set(servers))
        for (var k = 0; k < serverListArray.length; k++) {
          if (serverinfo === '') {
            serverinfo = serverListArray[k]
          } else {
            serverinfo = serverinfo + ',' + serverListArray[k]
          }
        }
        value.server_info = serverinfo
        tmplist.push(value)
      })
      sessionStorage.setItem('allProjects', JSON.stringify(this.projectNameOptions))
      sessionStorage.setItem('allApplications', JSON.stringify(this.applicationNameOptions))
      this.list = tmplist
      this.tmpApiList = tmplist
      this.loading = false
    },
    async getApplicationOptions() {
      if (this.searchForm.projectinfo) {
        this.applicationNameOptions = []
        this.$http({
          method: 'GET',
          url: APPLICATION + '?project_id=' + this.searchForm.projectinfo
        }).then((returnData) => {
          if (returnData) {
            returnData = returnData.data
            const nameListArray = []
            returnData.forEach((value) => {
              nameListArray.push({
                key: value.application_code,
                value: value.id,
                label: value.application_code
              })
            })
            this.applicationNameOptions = nameListArray
          }
        })
      }
    },
    async getProjectOptions() {
      this.$http({
        method: 'GET',
        url: PROJECT
      }).then((returnData) => {
        if (returnData) {
          returnData = returnData.data
          const nameListArray = []
          returnData.forEach((value) => {
            nameListArray.push({
              key: value.project_name + '(' + value.project_code + ')',
              value: value.id,
              label: value.project_name + '(' + value.project_code + ')'
            })
          })
          this.projectOptions = nameListArray
          sessionStorage.setItem('editFormOptions', JSON.stringify(nameListArray))
        }
      })
    },
    geteditFormOptions() {
      this.editFormOptions = sessionStorage.getItem('editFormOptions')
      for (var i = 0; i < this.projectOptions.length; i++) {
        if (this.projectOptions[i].label === this.editForm.project_name) {
          this.editForm.project_code = this.projectOptions[i].code
          this.editForm.project = this.projectOptions[i].project
        }
      }
    },
    getCode() {
      for (var i = 0; i < this.projectOptions.length; i++) {
        if (this.projectOptions[i].label === this.form.project_name) {
          this.form.project_code = this.projectOptions[i].code
          this.form.project = this.projectOptions[i].project
        }
      }
    },
    // 显示编辑弹出框
    handleEdit(index, row) {
      this.getStaffOptions()
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.editForm.developers = []
      this.editForm.testers = []
      if (row.developers != '') {
        this.editForm.developers.push({ names: row.developers })
      } else {
        this.editForm.developers.push({ names: [] })
      }
      if (row.testers != '') {
        this.editForm.testers.push({ names: row.testers })
      } else {
        this.editForm.testers.push({ names: [] })
      }
    },

    getProjectId(projectinfo) {
      const editFormOptions = JSON.parse(sessionStorage.getItem('editFormOptions'))
      var projectId = ''
      for (var i = 0; i < editFormOptions.length; i++) {
        if (editFormOptions[i].label === projectinfo) {
          projectId = editFormOptions[i].value
          return projectId
        }
      }
      return projectId
    },
    // 删除
    deleteItem: function(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', APPLICATION + '?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showDate(val) {
      val = val + ''
      if (val.indexOf(this.searchTxt) !== -1 && this.searchTxt !== '') {
        return val.replace(this.searchTxt, '<font color="#DF194C">' + this.searchTxt + '</font>')
      } else {
        return val
      }
    },
    // 查询
    async search() {
      const returnData = await httpRequest('GET', APPLICATION + '?project_id=' + this.searchForm.projectinfo + '&id=' +
        this.searchForm.applicationinfo)
      const tmplist = []
      returnData.forEach((value) => {
        value.project_info = value.project_name + '(' + value.project_code + ')'
        const serverList = value.server_info
        var serverinfo = ''
        const servers = []
        if (serverList.length === 0) {
          value.server_info = ''
        } else {
          for (var j = 0; j < serverList.length; j++) {
            servers.push(serverList[j].server_type)
          }
        }
        var serverListArray = Array.from(new Set(servers))
        for (var k = 0; k < serverListArray.length; k++) {
          if (serverinfo === '') {
            serverinfo = serverListArray[k]
          } else {
            serverinfo = serverinfo + ',' + serverListArray[k]
          }
        }
        value.server_info = serverinfo
        tmplist.push(value)
      })
      this.list = tmplist
    },

    addForm() {
      this.getStaffOptions()
      // this.getProjectOptions()
      this.addFormVisible = true
    },
    // 添加数据
    add: function(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            project_id: this.form.project_id,
            application_name: this.form.application_describe,
            application_code: this.form.application_code.trim(),
            developers: this.form.developers[0].names,
            testers: this.form.testers[0].names,
            creator: sessionStorage.getItem('currentUserName'),
            application_describe: this.form.application_describe,
            application_status: this.form.application_status
          }
          const data = await httpRequest('POST', APPLICATION, handleAddClick)
          // this.vueTable()
          this.addFormVisible = false
          this.form = {}
          this.form.developers = [{ names: [] }]
          this.form.testers = [{ names: [] }]
          this.goToAppDetail(data.id)
        }
      })
    },
    goToAppDetail(id) {
      this.$router.push({ path: '/configpage/applicationdetail/' + id })
    },
    // 编辑
    editSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            project_id: this.getProjectId(this.editForm.project_info),
            application_name: this.editForm.application_describe,
            application_code: this.editForm.application_code.trim(),
            developers: this.editForm.developers[0].names,
            testers: this.editForm.testers[0].names,
            modifier: sessionStorage.getItem('currentUserName'),
            application_describe: this.editForm.application_describe,
            application_status: this.editForm.application_status
          }
          await httpRequest('PUT', APPLICATION, HandleEdit)
          this.vueTable()
          this.editFormVisible = false
        }
      })
    },
    handleDetail(index, row) {
      this.$router.push({ path: '/configpage/applicationdetail/' + row.id })
    },
    getStaffOptions() {
      this.staffOptionsList = this.$store.getters.staffOptionsListForApplication
    },
    remoteMethod(query) {
      if (query !== '') {
        setTimeout(() => {
          this.staffOptions = this.staffOptionsList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
              item.email.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 600)
      } else {
        this.staffOptions = []
      }
    },
    convertDataFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    }
  }
}
