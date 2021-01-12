import { mapGetters } from 'vuex'
import {
  SERVER_ENV_LIST, SERVER_OPTIONS_LIST, SERVER_PROXY
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { convertTime } from '../../../../utils/tools'
import { engine_host } from '../../../../settings'

export default {
  data() {
    return {
      mockApi: '',
      templatesOptions: [],
      projectOptions: [],
      appOptions: [],
      serverOptions: [],
      apiOptions: [],
      templateId: '',
      mockVisible: false,
      mockAddForm:
        {
          name: '',
          code: '',
          templateId: [],
          defaultRouter: '',
          routerHost: '',
          modifier: sessionStorage.getItem('currentUserName'),
          server_id: ''
        },
      mockSwitch: '',
      serverInfo: {},
      loading: false,
      list: [],
      tmpApiList: [],
      allList: [],
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      proxyRouterOptions: [],
      defaultRouter: '',
      editForm:
        { // 编辑需要的字段
          id: '',
          name: '',
          code: '',
          defaultRouter: '',
          routerHost: '',
          modifier: sessionStorage.getItem('currentUserName'),
          server_id: '',
          templateId: []
        },
      searchForm: {
        project_info: '',
        application_info: '',
        server_info: '',
        name: ''
      },
      rules: {
        templateId:
          [
            { required: true, message: '请选择服务', trigger: 'blur' }
          ],
        name:
          [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        code:
          [
            { required: true, message: '请输入编码', trigger: 'blur' }
          ]
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1, // 初始页
      env_info: [{ value: '无', label: '无', host: '' }],
      searchTxt: ''
    }
  },
  mounted() {
    this.vueTable()
    this.getHttpTemplates()
  },
  beforeCreate() {
  },
  created() {
    this.mockApi = engine_host + '/S000'
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
      this.initProjectOptions()
      this.list = this.allList
      this.tmpApiList = this.allList
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', SERVER_PROXY)
      this.tmpApiList = this.list
      this.allList = this.list
      this.initProjectOptions()
    },
    initProjectOptions() {
      this.projectOptions = []
      this.appOptions = []
      this.serverOptions = []
      this.apiOptions = []
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
    viewMockConfig(row) {
      console.log(row)
      localStorage.setItem('SERVER_PROJECT', row.project_info)
      localStorage.setItem('SERVER_APPLICATION', row.application_info)
      localStorage.setItem('SERVER_INFO', row.server_info)
      localStorage.setItem('SERVER_TYPE', 'API')
      localStorage.setItem('PROXY_INFO', row.name + '(' + row.code + ')')
      this.$router.push({
        path: '/dataconfigpage/mockconfiglist/' + row.id,
        query: { serverId: row.server_id }
      })
    },
    async getHttpTemplates() {
      const returnData = await httpRequestWithoutLoading('GET', SERVER_OPTIONS_LIST)
      this.templatesOptions = returnData
    },
    async initSelectData() {
      this.env_info = []
      this.env_info.push({
        key: -1,
        value: '',
        label: '无',
        host: ''
      })
      const data = await httpRequestWithoutLoading('GET', SERVER_ENV_LIST + '?server_id=' + this.mockAddForm.templateId[2] + '&server_type=API')
      data.forEach((value) => {
        this.env_info.push({
          key: value.id,
          value: value.env_type,
          label: value.env_type,
          host: value.host
        })
      })
    },
    addMockConfig() {
      this.templateId = []
      this.mockVisible = true
    },
    addMockSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            name: this.mockAddForm.name,
            code: this.mockAddForm.code,
            default_router: this.mockAddForm.defaultRouter,
            router_host: this.getEnvHost(this.mockAddForm.defaultRouter),
            server_type: 'API',
            server_id: this.mockAddForm.templateId[2],
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('POST', SERVER_PROXY, HandleEdit)
          this.vueTable()
          this.mockVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    // 显示编辑弹出框
    async handleEdit(index, row) {
      this.editForm = Object.assign({}, row)
      this.defaultRouter = row.default_router
      this.templateId = []
      this.templateId.push(row.project_info)
      this.templateId.push(row.application_info)
      this.templateId.push(row.server_id)
      this.editForm.templateId = this.templateId
      this.mockAddForm.templateId = this.templateId
      this.initSelectData()
      this.editFormVisible = true
    },
    // 编辑
    async editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            name: this.editForm.name,
            code: this.editForm.code,
            default_router: this.defaultRouter,
            router_host: this.getEnvHost(this.defaultRouter),
            server_type: 'API',
            server_id: this.editForm.templateId[2],
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('PUT', SERVER_PROXY, HandleEdit)
          this.vueTable()
          this.editFormVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    changeModel(editForm) {
      this.editForm = Object.assign({}, editForm)
      if (this.editForm.proxyModel === 'mock') {
        this.editForm.proxyModelFlag = 1
      } else {
        this.editForm.proxyModelFlag = 2
      }
    },
    // 删除
    deleteProxy(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', SERVER_PROXY + '?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
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
      this.list = await httpRequest('GET', SERVER_PROXY + '?name=' + this.searchForm.name + '&project_info=' +
        this.searchForm.project_info + '&application_info=' + this.searchForm.application_info + '&' +
        'server_info=' + this.searchForm.server_info)
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
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.query.serverId })
    },
    getEnvHost(env) {
      for (let i = 0; i < this.env_info.length; i++) {
        if (env === this.env_info[i].value) {
          return this.env_info[i].host
        }
      }
      return ''
    },
    convertTimeFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    }
  }
}
