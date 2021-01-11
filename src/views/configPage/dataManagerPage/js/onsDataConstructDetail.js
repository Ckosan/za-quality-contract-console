import { mapGetters } from 'vuex'
import HotTable from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import {
  API_TO_JSON,
  ONS_DATA_CONSTRUCT, ONS_DATA_CONSTRUCT_NEWVERSION,
  ONS_DATA_CONSTRUCT_ROLLBAKC,
  ONS_INTERFACE_INFO
} from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'
import { hotSettings } from '../../../../utils/dataConstrictSetting'
import { bodyRender, deleteNullData } from '../../../../utils/dataconstrcut'

export default {
  name: 'SampleApp',
  components: {
    HotTable
  },
  data: function() {
    return {
      tmpVersion: '',
      versionRollbackDialog: false,
      showHistoryVerionDialog: false,
      versionlogList: [],
      addLoading: false,
      pagesize: 15,
      currentPage: 1, // 初始页
      versionDialog: false,
      optType: '',
      submitFlag: false,
      handleTypeOptions: [
        {
          label: '生产',
          value: '生产'
        },
        {
          label: '消费',
          value: '消费'
        }
      ],
      bodyTypeOptions: [
        {
          label: 'Text',
          value: 'Text'
        },
        {
          label: 'Json',
          value: 'Json'
        }
      ],
      bodyTypeFlag: 'Json',
      onsTextBody: '',
      loading: false,
      jsonImportVisible: false,
      jsonForm: {
        jsonDta: '',
        type: ''
      },
      serverInfo: {
        project_name: '',
        project_code: '',
        application_name: '',
        application_code: '',
        server_name: '',
        server_code: '',
        server_type: '',
        describe: '',
        handleType: ''
      },
      onsSereverForm: {
        server: '',
        interface_name: '',
        interface_code: '',
        tag: '',
        id: '',
        handleType: '',
        version: '',
        description: ''
      },
      test: 'test-hot',
      hotSettings: hotSettings
    }
  },
  create() {
  },
  mounted() {
    this.getPageInfo()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  methods: {
    setTableReadOnly() {
      this.hotSettings.readOnly = true
    },
    setTableWritable() {
      this.hotSettings.readOnly = false
    },
    handleSizeChange: function(size) {
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    // 获取请求体数据
    getRequestSourceData() {
      if (this.bodyTypeFlag === 'Json') {
        return this.$refs.bodyTextHot.settings.data
      }
      return []
    },
    // 页面数据入口
    getPageInfo() {
      this.optType = this.$route.query.type
      if (this.$route.query.type === 'watchDetail') {
        this.getHttpInterfaceInfo()
      } else if (this.$route.query.type === 'addConstructData') {
        this.submitFlag = true
        this.getServerInfo()
      } else {
        console.log('暂时无数据')
      }
    },
    // 新增数据结构时获取服务信息
    getServerInfo() {
      this.serverInfo.project_name = localStorage.getItem('SERVER_PROJECT')
      this.serverInfo.application_name = localStorage.getItem('SERVER_APPLICATION')
      this.serverInfo.server_name = localStorage.getItem('SERVER_INFO')
      this.serverInfo.server_type = localStorage.getItem('SERVER_TYPE')
      this.serverId = this.$route.query.serverId
      this.onsSereverForm.server = this.$route.query.serverId
    },
    // 获取HTTP数据结构详情时调用
    async getHttpInterfaceInfo() {
      const returnData = await httpRequest('GET', ONS_INTERFACE_INFO + '?id=' + this.$route.params.id)
      this.serverInfo = returnData[0]
      this.serverInfo.project = this.serverInfo.project_name + '(' + this.serverInfo.project_code + ')'
      this.serverInfo.application = this.serverInfo.application_name + '(' + this.serverInfo.application_code + ')'
      this.onsSereverForm.interface_name = this.serverInfo.interface_name
      this.onsSereverForm.interface_code = this.serverInfo.interface_code
      this.onsSereverForm.tag = this.serverInfo.tag
      this.onsSereverForm.id = this.serverInfo.id
      this.onsSereverForm.version = this.serverInfo.version
      this.versionlogList = this.serverInfo.versionlog_list
      this.onsSereverForm.handleType = this.serverInfo.handle_type
      this.onsSereverForm.server = this.serverInfo.server_id
      this.getOnsConstructDetailData(this.$route.params.id, this.serverInfo.version, this.serverInfo.message_type)
    },
    refresh() {
    },
    // 保存数据结构
    async saveDataInfo() {
      const handleAddClick = {
        id: this.onsSereverForm.id,
        server_id: this.onsSereverForm.server,
        interface_name: this.onsSereverForm.interface_name.trim(),
        interface_code: this.onsSereverForm.interface_code.trim(),
        interface_url: '/api/res/getRequestBody?apiType=' + this.serverInfo.server_type + '&structType=request&projectCode=' + this.serverInfo.project_code + '&applicationCode=' +
            this.serverInfo.application_code + '&apiCode=' + this.onsSereverForm.interface_code,
        tag: this.onsSereverForm.tag,
        construct_data: this.createHttpConstructData(),
        text_body: this.onsTextBody,
        version: this.onsSereverForm.version,
        description: this.onsSereverForm.description,
        handle_type: this.onsSereverForm.handleType,
        message_type: this.bodyTypeFlag,
        modifier: sessionStorage.getItem('currentUserName')
      }
      const returnData = await httpRequest('POST', ONS_INTERFACE_INFO, handleAddClick)
      if (this.$route.query.type === 'addConstructData') {
        this.$router.push({
          path: '/configpage/onsdataconstructdetail/' + returnData.data.id,
          query: { type: 'watchDetail' }
        })
      } else {
        this.onsSereverForm.id = returnData.id
        this.getOnsConstructDetailData(returnData.id, returnData.version, returnData.message_type)
      }
    },
    async getOnsConstructDetailData(interfaceId, version, messageType) {
      const returnData = await httpRequest('GET', ONS_DATA_CONSTRUCT + '?interface_id=' + interfaceId +
        '&version=' + version + '&message_type=' + messageType)
      if (returnData && messageType === 'Json') {
        this.bodyTypeFlag = messageType
        this.$refs.bodyTextHot.settings.data = bodyRender(returnData.request)
        this.loading = false
      } else if (returnData && messageType === 'Text') {
        this.onsTextBody = returnData[0].data_default_value
        this.bodyTypeFlag = returnData[0].construct_type
        this.loading = false
      }
    },
    // 搜索
    searchData() {
      console.log(this.getRequestSourceData())
    },
    // 导入JSON
    requestImportJson() {
      this.jsonForm.type = 'Json'
      this.jsonImportVisible = true
    },
    async importJsonSubmit() {
      console.log(this.jsonForm.jsonDta)
      if (!this.jsonForm.jsonDta) {
        this.$message.error('JSON字符串不能为空')
      } else {
        const handleAddClick = {
          data: this.jsonForm.jsonDta
        }
        this.$refs.bodyTextHot.settings.data = await httpRequest('POST', API_TO_JSON, handleAddClick)
        this.jsonImportVisible = false
        this.loading = false
        this.loading = true
      }
    },
    // 导出接口文档
    exportDataToExcel() {
    },
    // 构造HTTP报文数据
    createHttpConstructData() {
      if (this.bodyTypeFlag != 'Json') {
        return {
          request: []
        }
      }
      const constructData = {
        request: deleteNullData(this.getRequestSourceData())
      }
      return constructData
    },
    showHistoryVerion() {
      this.showHistoryVerionDialog = true
    },
    selectVersion() {
      this.versionDialog = true
    },
    changeSubmitStatus() {
      this.submitFlag = true
      this.setTableWritable()
    },
    editVersionSubmit() {
      this.saveDataInfo()
      this.versionDialog = false
    },
    handleVersionDetail(index, row) {
      console.log('查看详情')
      this.getOnsConstructDetailData(row.resource_id, row.version, null)
      this.onsSereverForm.version = row.version
      this.showHistoryVerionDialog = false
      this.submitFlag = false
      this.setTableReadOnly()
    },
    handleRollBack(index, row) {
      this.versionRollbackDialog = true
      this.onsserverForm.versionId = row.id
      this.tmpVersion = row.version
    },
    cancelSubmit() {
      this.versionDialog = false
      this.submitFlag = false
      if (this.$route.query.type === 'addConstructData') {
        this.setTableWritable()
        this.submitFlag = true
      } else {
        this.setTableReadOnly()
      }
    },
    async rollbackVersionSubmit() {
      const handleAddClick = {
        interface_id: this.serverInfo.id,
        new_version: this.onsSereverForm.version,
        old_version: this.serverInfo.version,
        tmp_version: this.tmpVersion,
        version_id: this.onsSereverForm.versionId,
        description: this.onsSereverForm.description,
        modifier: sessionStorage.getItem('currentUserName')
      }
      if (this.onsSereverForm.version === this.serverInfo.version) {
        this.$confirm('此操作将覆盖原有最新版本, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await httpRequest('PUT', ONS_DATA_CONSTRUCT_ROLLBAKC, handleAddClick)
          this.versionRollbackDialog = false
          this.showHistoryVerionDialog = false
          this.getHttpInterfaceInfo()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        await httpRequest('PUT', ONS_DATA_CONSTRUCT_NEWVERSION, handleAddClick)
        this.showHistoryVerionDialog = false
        this.versionRollbackDialog = false
        this.getHttpInterfaceInfo()
      }
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.onsSereverForm.server })
    }
  }
}
