import { mapGetters } from 'vuex'
import {
  DATA_SET_API, DATA_SET_INFO, DATA_SET_REALATION_API, SERVER_OPTIONS_LIST
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { convertTime } from '../../../../utils/tools'

export default {
  data() {
    return {
      templatesOptions: [],
      projectOptions: [],
      appOptions: [],
      serverOptions: [],
      apiOptions: [],
      apiInfoTitle: '',
      addDataSetVisible: false,
      addDataSetVisible2: false,
      editVisible: false,
      editForm:
        {
          id: '',
          name: '',
          serverId: '',
          modifier: sessionStorage.getItem('currentUserName'),
          description: ''
        },
      addDataSetForm:
        {
          templateId: '',
          name: '',
          setId: '',
          serverType: 'API',
          serverId: '',
          interfaceId: '',
          modifier: sessionStorage.getItem('currentUserName'),
          description: ''
        },
      serverInfo: {},
      loading: false,
      list: [], // 数据存储
      tmpApiList: [],
      allList: [],
      ListSearch: '', // 搜索
      searchForm: {
        project_info: '',
        application_info: '',
        server_info: '',
        interface_info: '',
        name: ''
      },
      searchTxt: '',
      rules: {
        templateId:
          [
            { required: true, message: '请选择', trigger: 'blur' }
          ],
        name:
          [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        description:
          [
            { required: true, message: '请输入说明', trigger: 'blur' }
          ]
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    this.vueTable()
    this.getHttpTemplates()
  },
  created() {
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {
    seachList() {
      this.list = this.seachList()
    },
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
      this.searchForm.project_info = ''
      this.searchForm.application_info = ''
      this.searchForm.server_info = ''
      this.searchForm.interface_info = ''
      this.searchForm.name = ''
      this.vueTable()
      this.initProjectOptions()
      this.list = this.allList
      this.tmpApiList = this.list
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', DATA_SET_INFO)
      this.tmpApiList = this.list
      this.initProjectOptions()
    },
    async getHttpTemplates() {
      const returnData = await httpRequestWithoutLoading('GET', SERVER_OPTIONS_LIST)
      this.templatesOptions = returnData
    },
    initProjectOptions() {
      this.projectOptions = []
      this.appOptions = []
      this.serverOptions = []
      const project = new Set()
      for (var i = 0; i < this.tmpApiList.length; i++) {
        project.add(this.tmpApiList[i].project_info)
      }
      const projectList = Array.from(project)
      for (var j = 0; j < projectList.length; j++) {
        this.projectOptions.push({
          value: projectList[j],
          label: projectList[j]
        })
      }
    },
    viewDataSet(row) {
      console.log(row)
      localStorage.setItem('SERVER_PROJECT', row.project_info)
      localStorage.setItem('SERVER_APPLICATION', row.application_info)
      localStorage.setItem('SERVER_INFO', row.server_info)
      localStorage.setItem('SET_INFO', row.name)
      this.$router.push({
        path: '/dataconfigpage/apidatasetlist/' + row.id,
        query: { serverId: row.server_id }
      })
    },
    // 查询
    async search() {
      this.list = await httpRequest('GET', DATA_SET_INFO + '?name=' + this.searchForm.name + '&project_info=' +
        this.searchForm.project_info + '&application_info=' + this.searchForm.application_info + '&' +
        'server_info=' + this.searchForm.server_info)
      this.tmpApiList = this.list
    },
    getAppinfo() {
      const appList = this.getFilterApiListByInput(this.searchForm.project_info)
      const applications = new Set()
      for (var i = 0; i < appList.length; i++) {
        applications.add(appList[i].application_info)
      }
      const applicationsList = Array.from(applications)
      for (var j = 0; j < applicationsList.length; j++) {
        this.appOptions.push({
          value: applicationsList[j],
          label: applicationsList[j]
        })
      }
    },
    getServerinfo() {
      const appList = this.getFilterApiListByInput(this.searchForm.application_info)
      const applications = new Set()
      for (var i = 0; i < appList.length; i++) {
        applications.add(appList[i].server_info)
      }
      const applicationsList = Array.from(applications)
      for (var j = 0; j < applicationsList.length; j++) {
        this.serverOptions.push({
          value: applicationsList[j],
          label: applicationsList[j]
        })
      }
    },
    getAPIinfo() {
      const appList = this.getFilterApiListByInput(this.searchForm.server_info)
      const applications = new Set()
      for (var i = 0; i < appList.length; i++) {
        applications.add(appList[i].interface_info)
      }
      const applicationsList = Array.from(applications)
      for (var j = 0; j < applicationsList.length; j++) {
        this.apiOptions.push({
          value: applicationsList[j],
          label: applicationsList[j]
        })
      }
    },
    getFilterApiListByInput(search) {
      if (search) {
        return this.tmpApiList.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key]).indexOf(search) > -1
          })
        })
      }
      return this.tmpApiList
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
    showDate(val) {
      val = val + ''
      if (val.indexOf(this.searchTxt) !== -1 && this.searchTxt !== '') {
        return val.replace(this.searchTxt, '<font color="#DF194C">' + this.searchTxt + '</font>')
      } else {
        return val
      }
    },
    seachList() {
      this.list = this.getFilterApiList()
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.query.serverId })
    },
    convertTimeFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    },
    addDataSet() {
      this.addDataSetVisible = true
    },
    handleDataSetEdit(row) {
      this.$router.push({
        path: '/dataconfigpage/apidatasetslist/' + row.id,
        query: { serverId: row.server_id }
      })
    },
    addDataSetSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            name: this.addDataSetForm.name,
            server_id: this.addDataSetForm.templateId[2],
            modifier: this.addDataSetForm.modifier,
            description: this.addDataSetForm.description
          }
          await httpRequestWithoutLoading('POST', DATA_SET_API, HandleEdit)
          this.$message.success('添加成功')
          this.vueTable()
          this.addDataSetForm.name = ''
          this.addDataSetForm.templateId = ''
          this.addDataSetForm.description = ''
          this.addDataSetVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    handleEditItem(row) {
      this.editForm = Object.assign({}, row)
      this.editForm.id = row.id
      this.editForm.serverId = row.server_id
      this.editVisible = true
    },
    handleEditItemSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            server_id: this.editForm.serverId,
            name: this.editForm.name,
            modifier: this.editForm.modifier,
            description: this.editForm.description
          }
          await httpRequestWithoutLoading('PUT', DATA_SET_API, HandleEdit)
          this.$message.success('修改成功')
          this.vueTable()
          this.editVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    handleEdit(row) {
      this.addDataSetForm.interfaceId = row.id
      this.addDataSetForm.setId = row.set_id
      this.addDataSetVisible2 = true
    },
    addRowDataSetSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            name: this.addDataSetForm.name,
            set_id: this.addDataSetForm.setId,
            interface_id: this.addDataSetForm.interfaceId,
            modifier: this.addDataSetForm.modifier,
            description: this.addDataSetForm.description
          }
          await httpRequestWithoutLoading('POST', DATA_SET_REALATION_API, HandleEdit)
          this.$message.success('添加成功')
          this.vueTable()
          this.addDataSetVisible2 = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    deleteItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', DATA_SET_API + '?setId=' + row.id)
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
