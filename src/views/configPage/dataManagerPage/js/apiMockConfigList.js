import { mapGetters } from 'vuex'
import {
  API_EXT_INFO,
  BRNACH_API, DATA_SET_REAPTION_INFO, INTERFACE_PROXY_STATUS,
  MOCK_CONFIG,
  MOCK_CONFIG_UPDATE_ALL_STATUS,
  MOCK_CONFIG_UPDATE_SINGLE_STATUS,
  MOCK_ROUTE_ENV_CHANGE, SERVER_ENV_LIST
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isNum } from '../../../../utils/validata_rules'
import { convertTime } from '../../../../utils/tools'

export default {
  data() {
    return {
      mockVisible: false,
      apiInfoTitle: '',
      datasetOptions: [],
      dataType: '',
      mockAddForm:
        {
          branch: '',
          dataset: [],
          name: '',
          interfaceId: '',
          conditions: '',
          description: '',
          priority: '',
          route_env: '',
          modifier: sessionStorage.getItem('currentUserName'),
          proxyModel: 'mock',
          proxyModelFlag: 1,
          dataType: 'dataset',
          delay: 0
        },
      mockSwitch: '',
      serverInfo: {},
      branchOptions: [],
      loading: false,
      list: [], // 数据存储
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      proxyModelOptions: [
        { value: 'mock', label: '挡板' }, { value: 'route', label: '路由' }
      ],
      dataTypeOptions: [
        { value: 'branch', label: '分支' }, { value: 'dataset', label: '用例集' }
      ],
      editForm:
        { // 编辑需要的字段
          id: '',
          name: '',
          branch: '',
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
          dataType: 'dataset'
        },
      searchForm: {
        name: '',
        conditions: ''
      },
      rules: {
        name:
          [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        conditions:
          [
            { required: true, message: '请输入条件', trigger: 'blur' }
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
      env_info: []
    }
  },
  mounted() {
    this.getInterfaceStatus()
    this.getPageInfo()
  },
  created() {
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
      this.searchForm.name = ''
      this.searchForm.conditions = ''
      this.vueTable()
    },
    getPageInfo() {
      this.serverInfo.project_name = localStorage.getItem('SERVER_PROJECT')
      this.serverInfo.application_name = localStorage.getItem('SERVER_APPLICATION')
      this.serverInfo.server_name = localStorage.getItem('SERVER_INFO')
      this.serverInfo.server_type = localStorage.getItem('SERVER_TYPE')
      this.apiInfoTitle = localStorage.getItem('API_INFO')
      this.vueTable()
      this.getEnvInfo()
      this.getBranchList()
      this.initExtOptions()
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', MOCK_CONFIG + '?interface_id=' +
        this.$route.params.id + '&server_type=' + this.serverInfo.server_type + '&proxy_id=' + this.$route.query.proxyId)
    },
    async vueTableWithoutLoading() {
      this.list = await httpRequestWithoutLoading('GET', MOCK_CONFIG + '?interface_id=' +
        this.$route.params.id + '&server_type=' + this.serverInfo.server_type + '&proxy_id=' + this.$route.query.proxyId)
    },
    getDataSetInfo(data) {
      if (data != null) {
        const list = JSON.parse(data)
        return list[0] + '/' + list[1]
      }
      return ''
    },
    async getBranchList() {
      this.branchOptions = []
      const branches = await httpRequestWithoutLoading('GET', BRNACH_API + '?interface_id=' +
        this.$route.params.id + '&server_id=' + this.$route.query.serverId + '&server_type=' + this.serverInfo.server_type)
      branches.forEach((value) => {
        this.branchOptions.push({
          value: value.branch,
          lable: value.branch,
          name: value.description,
          key: value.brnach
        })
      })
    },
    async initExtOptions() {
      const returnData = await httpRequestWithoutLoading('GET', API_EXT_INFO + '?interfaceId=' + this.$route.params.id)
      this.datasetOptions = returnData.dataSetList
    },
    addMockConfig() {
      this.mockVisible = true
    },
    addMockSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.mockAddForm.id,
            branch: this.mockAddForm.branch,
            conditions: this.mockAddForm.conditions,
            name: this.mockAddForm.name,
            priority: this.mockAddForm.priority,
            route_env: this.mockAddForm.route_env,
            server_type: this.serverInfo.server_type,
            interface_id: this.$route.params.id,
            modifier: sessionStorage.getItem('currentUserName'),
            event_type: this.mockAddForm.proxyModel,
            delay: this.mockAddForm.delay,
            proxy_id: this.$route.query.proxyId,
            data_type: this.mockAddForm.dataType,
            data_set_list: this.mockAddForm.dataset
          }
          await httpRequest('POST', MOCK_CONFIG, HandleEdit)
          this.vueTable()
          this.mockVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.editForm.dataType = row.data_type
      this.dataType = row.data_type
      this.editForm.proxyModel = row.event_type
      if (row.data_set != null) {
        const data = JSON.parse(row.data_set)
        this.editForm.dataset = data
      }
      if (this.editForm.proxyModel === 'mock') {
        this.editForm.proxyModelFlag = 1
      } else {
        this.editForm.proxyModelFlag = 2
      }
    },
    // 编辑
    async editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            branch: this.mockAddForm.dataType === 'branch' ? this.editForm.branch : '',
            conditions: this.editForm.conditions,
            name: this.editForm.name,
            is_open: this.editForm.is_open,
            interface_id: this.$route.params.id,
            server_type: this.serverInfo.server_type,
            priority: this.editForm.priority,
            route_env: this.editForm.route_env,
            modifier: sessionStorage.getItem('currentUserName'),
            event_type: this.editForm.proxyModel,
            delay: this.editForm.delay,
            proxy_id: this.$route.query.proxyId,
            data_type: this.mockAddForm.dataType,
            data_set_list: this.mockAddForm.dataType === 'dataset' ? this.editForm.dataset : []
          }
          await httpRequest('PUT', MOCK_CONFIG, HandleEdit)
          this.vueTable()
          this.editFormVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    changeAdd() {
      if (this.mockAddForm.proxyModel === 'mock') {
        this.mockAddForm.proxyModelFlag = 1
      } else {
        this.mockAddForm.proxyModelFlag = 2
        this.mockAddForm.dataType = ''
      }
    },
    changeModel(editForm) {
      this.editForm = Object.assign({}, editForm)
      if (this.editForm.proxyModel === 'mock') {
        this.editForm.proxyModelFlag = 1
      } else {
        this.editForm.proxyModelFlag = 2
      }
    },
    changeDataSource() {
      this.dataType = this.editForm.dataType
    },
    // 删除
    deleteItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', MOCK_CONFIG + '?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
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
      this.list = await httpRequest('GET', MOCK_CONFIG + '?interface_id=' +
        this.$route.params.id + '&server_type=' + this.serverInfo.server_type + '&name=' + this.searchForm.name +
        '&conditions=' + this.searchForm.conditions + '&proxy_id=' + this.$route.query.proxyId)
    },
    gobackList() {
      this.$router.push({ path: '/dataconfigpage/mockconfiglist/' + this.$route.query.proxyId,
        query: { serverId: this.$route.query.serverId }})
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.query.serverId })
    },
    // 子开关
    async changeStatus(data) {
      await httpRequestWithoutLoading('POST', MOCK_CONFIG_UPDATE_SINGLE_STATUS + '?id=' + data.id + '&is_open=' + data.is_open + '&modifier=' + sessionStorage.getItem('currentUserName'))
      this.vueTableWithoutLoading()
    },
    async getInterfaceStatus() {
      const data = await httpRequestWithoutLoading('POST', INTERFACE_PROXY_STATUS + '?interface_id=' +
        this.$route.params.id + '&server_type=API&proxy_id=' + this.$route.query.proxyId)
      this.mockSwitch = data.is_open
    },
    // 总开关
    async changeAllStatus() {
      const data = await httpRequestWithoutLoading('POST', MOCK_CONFIG_UPDATE_ALL_STATUS + '?interface_id=' +
        this.$route.params.id + '&server_type=' + this.serverInfo.server_type + '&' + 'is_open=' + this.mockSwitch +
        '&proxy_id=' + this.$route.query.proxyId + '&modifier=' +
      sessionStorage.getItem('currentUserName'))
      this.mockSwitch = data.is_open
    },
    preViewMockData(data) {
      console.log('预览数据')
      this.$message.error('未开发完成！')
    },
    goToBranchDetail(branch) {
      if (this.serverInfo.server_type === 'API') {
        this.$router.push({
          path: '/configpage/apidatabranchdetail/' + this.$route.params.id + '/' + branch,
          query: { serverId: this.$route.query.serverId }
        })
      } else {
        return
      }
    },
    async goToDataSetDetail(data) {
      const returnData = await httpRequestWithoutLoading('GET', DATA_SET_REAPTION_INFO + '?serverId=' +
        this.$route.query.serverId + '&interfaceId=' + this.$route.params.id + '&setName=' + data[0] + '&name=' +
      data[1])
      this.$router.push({
        path: '/configpage/apidatasetsdetail/' + returnData.id,
        query: { serverId: this.$route.query.serverId, interfaceId: this.$route.params.id, setId: returnData.set_id }
      })
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
    async changeEnv(data, row) {
      await httpRequestWithoutLoading('GET', MOCK_ROUTE_ENV_CHANGE + '?id=' + row.id + '&env=' + data)
      this.vueTableWithoutLoading()
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
    convertTimeFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    }
  }
}
