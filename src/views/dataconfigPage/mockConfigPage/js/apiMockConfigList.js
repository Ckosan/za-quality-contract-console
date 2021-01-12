import { mapGetters } from 'vuex'
import {
  API_EXT_INFO,
  BRNACH_API,
  DATA_SET_REAPTION_INFO,
  INTERFACE_PROXY,
  MOCK_CONFIG,
  MOCK_CONFIG_UPDATE_ALL_STATUS,
  MOCK_CONFIG_UPDATE_REQ_CHECK, MOCK_CONFIG_UPDATE_RESP_CHECK,
  MOCK_CONFIG_UPDATE_SINGLE_STATUS,
  SERVER_ENV_LIST,
  SERVER_INTERFACE_API
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isNum } from '../../../../utils/validata_rules'
import { convertTime } from '../../../../utils/tools'

export default {
  data() {
    return {
      project_info: '',
      application_info: '',
      server_Info: '',
      proxyTitle: '',
      templatesOptions: [],
      projectOptions: [],
      appOptions: [],
      serverOptions: [],
      apiOptions: [],
      templateId: '',
      mockVisible: false,
      mockAddForm:
        {
          interfaceId: '',
          modifier: sessionStorage.getItem('currentUserName')
        },
      mockSwitch: '',
      serverInfo: {},
      loading: false,
      list: [],
      tmpApiList: [],
      allList: [],
      ListSearch: '', // 搜索
      rules: {
        name:
          [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        conditions:
          [
            { required: true, message: '请输入条件', trigger: 'blur' }
          ],
        /* branch:
          [
            { required: true, message: '请选择分支', trigger: 'blur' }
          ],
        version:
          [
            { required: true, message: '请选择版本', trigger: 'blur' }
          ],
        dataset:
          [
            { required: true, message: '请选择数据集', trigger: 'blur' }
          ],*/
        interfaceId:
          [
            { required: true, message: '请选择API', trigger: 'blur' },
            { validator: isNum, trigger: 'blur' }
          ],
        priority:
          [
            { required: true, message: '请输入优先级', trigger: 'blur' },
            { validator: isNum, trigger: 'blur' }
          ]
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1, // 初始页
      pagesize2: 15,
      currentPage2: 1,
      env_info: [],
      searchTxt: '',
      searchexpandTxt: '',
      expands: [],
      expandTable: [],
      tmpExpanList: [],
      branchOptions: [],
      apimockVisible: false,
      datasetOptions: [],
      versionDebugOptions: [],
      dataType: '',
      apimockAddForm:
        {
          row: '',
          branch: '',
          dataset: [],
          version: '',
          name: '',
          interfaceId: '',
          conditions: '',
          description: '',
          priority: '',
          route_env: '',
          modifier: sessionStorage.getItem('currentUserName'),
          proxyModel: 'mock',
          proxyModelFlag: 1,
          dataType: 'default',
          delay: 0
        },
      APImockSwitch: '',
      editFormRow: '',
      tempTableList: [],
      editForm:
        { // 编辑需要的字段
          id: '',
          name: '',
          branch: '',
          row: '',
          dataset: [],
          conditions: '',
          description: '',
          priority: '',
          is_open: '',
          modifier: sessionStorage.getItem('currentUserName'),
          proxyModel: '',
          delay: 0,
          route_env: '',
          proxyModelFlag: '',
          dataType: 'default'
        },
      editApiFormVisible: false,
      proxyModelOptions: [
        { value: 'mock', label: '挡板' }, { value: 'route', label: '路由' }
      ],
      dataTypeOptions: [
        { value: 'default', label: '默认最新版本' }, { value: 'version', label: '版本' }, { value: 'branch', label: '分支' }, { value: 'dataset', label: '用例集' }
      ]
    }
  },
  mounted() {
    this.initTitle()
    this.vueTable()
    this.getHttpTemplates()
    this.getEnvInfo()
  },
  beforeCreate() {
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
    handleSizeChange2: function(size) {
      this.pagesize2 = size
    },
    handleCurrentChange2: function(currentPage) {
      this.currentPage2 = currentPage
    },
    handleSelectionChange2(selection) {
      this.selection = selection
    },
    showData(val) {
      val = val + ''
      if (val.indexOf(this.searchexpandTxt) !== -1 && this.searchexpandTxt !== '') {
        return val.replace(this.searchexpandTxt, '<font color="#DF194C">' + this.searchexpandTxt + '</font>')
      } else {
        return val
      }
    },
    resetForm() {
      this.searchForm.project_info = ''
      this.searchForm.application_info = ''
      this.searchForm.server_info = ''
      this.searchForm.interface_info = ''
      this.searchForm.name = ''
      this.list = this.allList
      this.tmpApiList = this.allList
    },
    initTitle() {
      this.project_info = localStorage.getItem('SERVER_PROJECT')
      this.application_info = localStorage.getItem('SERVER_APPLICATION')
      this.server_Info = localStorage.getItem('SERVER_INFO')
      this.proxyTitle = localStorage.getItem('PROXY_INFO')
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', INTERFACE_PROXY + '?proxyId=' + this.$route.params.id + '&serverId=' + this.$route.query.serverId)
      this.tmpApiList = this.list
      this.allList = this.list
    },
    getRowKeys(row) {
      return row.id
    },
    getFacilityList(row, expandedRows) {
      if (expandedRows.length == 0) {
        this.expands = []
      }
      if (expandedRows.length !== 0) {
        this.expands = []
        this.getReceiver(row)
        this.expands.push(row.id)
      }
    },
    async getReceiver(row) {
      this.getBranchList(row)
      this.expandTable = await httpRequestWithoutLoading('GET', MOCK_CONFIG + '?interface_id=' +
        row.interface_id + '&server_type=API&proxy_id=' + row.proxy_id)
      this.tmpExpanList = this.expandTable
    },
    addApiMockConfig(row) {
      this.initExtOptions(row)
      this.getBranchList(row)
      this.apimockAddForm.interfaceId = row.interface_id
      this.apimockAddForm.row = row
      this.apimockVisible = true
    },
    getBranchValue(dataType) {
      if (dataType === 'version') return this.apimockAddForm.version
      if (dataType === 'default') return ''
      if (dataType === 'branch') return this.apimockAddForm.branch
      return ''
    },
    addApiMockSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.apimockAddForm.id,
            branch: this.getBranchValue(this.apimockAddForm.dataType),
            conditions: this.apimockAddForm.conditions,
            name: this.apimockAddForm.name,
            priority: this.apimockAddForm.priority,
            route_env: this.apimockAddForm.route_env,
            server_type: 'API',
            interface_id: this.apimockAddForm.interfaceId,
            modifier: sessionStorage.getItem('currentUserName'),
            event_type: this.apimockAddForm.proxyModel,
            delay: this.apimockAddForm.delay,
            proxy_id: this.$route.params.id,
            data_type: this.apimockAddForm.dataType,
            data_set_list: this.apimockAddForm.dataType === 'dataset' ? this.apimockAddForm.dataset : []
          }
          await httpRequest('POST', MOCK_CONFIG, HandleEdit)
          this.getReceiver(this.apimockAddForm.row)
          this.apimockVisible = false
          this.clearAddForm()
        } else {
          console.log('error submit!!')
        }
      })
    },
    clearAddForm() {
      this.apimockAddForm.version = ''
      this.apimockAddForm.branch = ''
      this.apimockAddForm.priority = ''
      this.apimockAddForm.name = ''
      this.apimockAddForm.conditions = ''
      this.apimockAddForm.dataset = ''
    },
    deleteInterfaceProxy(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', INTERFACE_PROXY + '/?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getHttpTemplates() {
      const returnData = await httpRequestWithoutLoading('GET', SERVER_INTERFACE_API +
        '?server_id=' + this.$route.query.serverId + '&server_type=API')
      for (let i = 0; i < returnData.length; i++) {
        this.templatesOptions.push({
          value: returnData[i].id,
          label: returnData[i].interface_name + '(' + returnData[i].path + ')'
        })
      }
    },
    addMockConfig() {
      this.expands = []
      this.mockVisible = true
    },
    addMockSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.mockAddForm.id,
            proxy_id: this.$route.params.id,
            is_open: 0,
            interface_id: this.mockAddForm.interfaceId,
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('POST', INTERFACE_PROXY, HandleEdit)
          this.vueTable()
          this.mockVisible = false
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
        await httpRequest('DELETE', MOCK_CONFIG + '?id=' + row.id)
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 查询
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
    getExpandFilterApiList() {
      const search = this.searchexpandTxt
      if (search) {
        return this.tmpExpanList.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key]).indexOf(search) > -1
          })
        })
      }
      return this.tmpExpanList
    },
    seachexpandTableList() {
      this.expandTable = this.getExpandFilterApiList()
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.query.serverId })
    },
    gobackList() {
      this.$router.push({ path: '/dataconfigpage/proxyconfiglist/' })
    },
    // 总开关
    async changeAllStatus(row) {
      const data = await httpRequestWithoutLoading('POST', MOCK_CONFIG_UPDATE_ALL_STATUS + '?interface_id=' +
        row.interface_id + '&server_type=API&' + 'is_open=' + row.is_open + '&proxy_id=' + this.$route.params.id + '&modifier=' +
        sessionStorage.getItem('currentUserName'))
      this.mockSwitch = data.is_open
    },
    preViewMockData(data) {
      console.log('预览数据')
      this.$message.error('未开发完成！')
    },
    convertTimeFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    },
    getEnvHost(env) {
      for (let i = 0; i < this.env_info.length; i++) {
        if (env === this.env_info[i].value) {
          return this.env_info[i].host
        }
      }
      return ''
    },
    getBranchName(branch) {
      for (let i = 0; i < this.branchOptions.length; i++) {
        if (branch === this.branchOptions[i].value) {
          return this.branchOptions[i].name
        }
      }
      return ''
    },
    async getBranchList(row) {
      this.branchOptions = []
      const branches = await httpRequestWithoutLoading('GET', BRNACH_API + '?interface_id=' +
        row.interface_id + '&server_id=' + this.$route.query.serverId + '&server_type=API')
      branches.forEach((value) => {
        this.branchOptions.push({
          value: value.branch,
          lable: value.branch,
          name: value.description,
          key: value.brnach
        })
      })
      if (this.branchOptions.length === 0) {
        const list = this.dataTypeOptions
        this.dataTypeOptions = []
        list.forEach((value) => {
          if (value.value != 'branch') { this.dataTypeOptions.push(value) }
        })
      }
    },
    async getEnvInfo() {
      this.env_info = []
      const data = await httpRequestWithoutLoading('GET', SERVER_ENV_LIST + '?server_id=' + this.$route.query.serverId + '&server_type=API')
      data.forEach((value) => {
        this.env_info.push({
          value: value.env_type,
          label: value.env_type,
          host: value.host
        })
      })
    },
    goToBranchDetail(row) {
      this.$router.push({
        path: '/configpage/apidatabranchdetail/' + row.interface_id + '/' + row.branch,
        query: { serverId: this.$route.query.serverId }
      })
    },
    goToVersionDetail(row) {
      this.$router.push({
        path: '/configpage/apidataversiondetail/' + row.interface_id,
        query: { type: 'watchDetail', serverId: this.$route.query.serverId, version: row.branch }
      })
    },
    async goToDataSetDetail(row) {
      const returnData = await httpRequestWithoutLoading('GET', DATA_SET_REAPTION_INFO + '?serverId=' +
        this.$route.query.serverId + '&interfaceId=' + row.interface_id + '&setName=' + row.data_set_list[0] + '&name=' +
        row.data_set_list[1])
      this.$router.push({
        path: '/configpage/apidatasetsdetail/' + returnData.id,
        query: { serverId: this.$route.query.serverId, interfaceId: row.interface_id, setId: returnData.set_id }
      })
    },
    async changeStatus(data) {
      await httpRequestWithoutLoading('POST', MOCK_CONFIG_UPDATE_SINGLE_STATUS + '?id=' + data.id + '&is_open=' +
        data.is_open + '&modifier=' + sessionStorage.getItem('currentUserName'))
      this.getReceiver(data)
    },
    async changeReqCheck(data) {
      await httpRequestWithoutLoading('POST', MOCK_CONFIG_UPDATE_REQ_CHECK + '?id=' + data.id + '&check_req=' +
        data.check_req + '&modifier=' + sessionStorage.getItem('currentUserName'))
      this.getReceiver(data)
    },
    async changeRespCheck(data) {
      await httpRequestWithoutLoading('POST', MOCK_CONFIG_UPDATE_RESP_CHECK + '?id=' + data.id + '&check_resp=' +
        data.check_resp + '&modifier=' + sessionStorage.getItem('currentUserName'))
      this.getReceiver(data)
    },
    changeDataSource() {
      this.dataType = this.editForm.dataType
    },
    changeModel(editForm) {
      this.editForm = Object.assign({}, editForm)
      if (this.editForm.proxyModel === 'mock') {
        this.editForm.proxyModelFlag = 1
        this.dataType = 'default'
        this.editForm.dataType = 'default'
      } else {
        this.editForm.proxyModelFlag = 2
        this.dataType = ''
        this.editForm.dataType = ''
      }
    },
    async initExtOptions(row) {
      const returnData = await httpRequestWithoutLoading('GET', API_EXT_INFO + '?interfaceId=' + row.interface_id)
      this.datasetOptions = returnData.dataSetList
      if (this.datasetOptions.length === 0) {
        const list = this.dataTypeOptions
        this.dataTypeOptions = []
        list.forEach((value) => {
          if (value.value != 'dataset') { this.dataTypeOptions.push(value) }
        })
      }
      this.versionDebugOptions = returnData.versionList
    },
    changeAdd() {
      if (this.apimockAddForm.proxyModel === 'mock') {
        this.apimockAddForm.proxyModelFlag = 1
      } else {
        this.apimockAddForm.proxyModelFlag = 2
        this.apimockAddForm.dataType = ''
      }
    },
    handleEdit(index, row) {
      this.editFormRow = row
      this.initExtOptions(row)
      this.editApiFormVisible = true
      this.editForm = Object.assign({}, row)
      this.editForm.dataType = row.data_type
      this.editForm.interfaceId = row.interface_id
      this.dataType = row.data_type
      this.editForm.proxyModel = row.event_type
      this.editForm.dataset = row.data_set_list
      this.editForm.version = row.branch
      this.editForm.proxyModelFlag = 1
    },
    getEditBranchValue(dataType) {
      if (dataType === 'version') return this.editForm.version
      if (dataType === 'default') return ''
      if (dataType === 'branch') return this.editForm.branch
      return ''
    },
    async editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            branch: this.getEditBranchValue(this.editForm.dataType),
            conditions: this.editForm.conditions,
            name: this.editForm.name,
            is_open: this.editForm.is_open,
            interface_id: this.editForm.interfaceId,
            server_type: 'API',
            priority: this.editForm.priority,
            route_env: this.editForm.route_env,
            modifier: sessionStorage.getItem('currentUserName'),
            event_type: this.editForm.proxyModel,
            delay: this.editForm.delay,
            proxy_id: this.$route.params.id,
            data_type: this.editForm.dataType,
            data_set_list: this.editForm.dataType === 'dataset' ? this.editForm.dataset : []
          }
          await httpRequest('PUT', MOCK_CONFIG, HandleEdit)
          console.log(this.editFormRow)
          this.getReceiver(this.editFormRow)
          this.editApiFormVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    async deleteConfigItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', MOCK_CONFIG + '?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
        this.getReceiver(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
