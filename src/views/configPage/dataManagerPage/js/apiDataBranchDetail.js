import { mapGetters } from 'vuex'
import HotTable from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import {
  API_BRANCH_CONSTRUCT,
  API_TO_JSON, GET_PUBLIC_DATA,
  HTTP_DEBUG,
  HTTP_INTERFACE_INFO,
  LSIT_TO_JSON,
  SCRIPT_GET
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { bodyRender, deleteHttpNullData, deleteNullData, headerRender } from '../../../../utils/dataconstrcut'
import {
  headerSettings,
  hotSettings,
  httpResponseSettings,
  rspheaderSettings
} from '../../../../utils/dataConstrictSetting'
import {
  getCount, initCount,
  isEmptyObject,
  isSuccessCode,
  mapContructData,
  mapHeadersData,
  myrenderer
} from '../../../../utils/tools'
import { console } from 'vuedraggable/src/util/helper'
import { isHost } from '../../../../utils/validata_rules'

export default {
  name: 'SampleApp',
  components: {
    HotTable
  },
  data: function() {
    return {
      apiInfoTitle: '',
      searchCount: 0,
      searchTxt: '',
      branch: '',
      publicValue: [],
      versionMap: [],
      debugButtonloading: false,
      debugloading: false,
      rspdebugloading: false,
      envInfoOptions: [],
      debugDialog: false,
      jsonPraseVisible: false,
      listToJSON: '',
      templateId: '',
      funcDict: [],
      funcModelOptions: [],
      funcForm: {
        funcModel: '',
        script_describe: '',
        script_sample: ''
      },
      funcHepleDialog: false,
      searchData: '',
      activeName: 'first',
      tmpVersion: '',
      serverId: '',
      optType: '',
      permission_type: '',
      submitFlag: false,
      addLoading: false,
      pagesize: 10,
      currentPage: 1, // 初始页
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
        server_type: ''
      },
      httpInfo: {},
      httpSereverForm: {
        server: '',
        interface_name: '',
        group_code: '',
        method: 'POST',
        path: '',
        id: '',
        new_version: '1.0.0',
        sub_version: 0
      },
      submitForm: {
        new_version: '1.0',
        sub_version: 0,
        description: ''
      },
      httpDebugForm: {
        method: '',
        headerslist: [],
        env_type: '',
        host: '',
        path: '',
        url: '',
        content_type: 'application/json',
        method_type: '',
        body: '',
        response: '',
        reqheaders: '',
        status_code: '',
        respHeaders: '',
        check_value: false,
        check_type: false,
        check_length: false,
        check_not_null: false,
        server_code: '',
        group_code: '',
        api_path: '',
        check_result: '',
        updateList: [],
        param: {
          update: { value: '', key: '' }
        }
      },
      methodOptions: [{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }, {
        value: 'PUT',
        label: 'PUT'
      }, { value: 'DELETE', label: 'DELETE' }],
      rules: {
        host: [
          { required: true, message: '主机地址不能为空', trigger: 'blur' },
          { validator: isHost, trigger: 'blur' }
        ],
        method_type: [
          { required: true, message: '请求方式不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        env_type: [
          { required: true, message: '环境不能为空', trigger: 'blur' }
        ]
      },
      httpRequstHeaders: {},
      httpRequstBody: {},
      httpResponse: {},
      options: {},
      test: 'test-hot',
      headerSettings: headerSettings,
      rspheaderSettings: rspheaderSettings,
      hotSettings: hotSettings,
      testRespone: 'testRespone',
      httpResponseSettings: httpResponseSettings
    }
  },
  created() {
    this.serverInfo.project_name = localStorage.getItem('SERVER_PROJECT')
    this.serverInfo.application_name = localStorage.getItem('SERVER_APPLICATION')
    this.serverInfo.server_name = localStorage.getItem('SERVER_INFO')
    this.serverInfo.server_type = localStorage.getItem('SERVER_TYPE')
    this.permission_type = Number(localStorage.getItem('PERMISSION'))
    this.serverId = this.$route.query.serverId
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {},
  mounted() {
    this.setTableReadOnly()
    this.getPageInfo()
    this.getFuncList()
  },
  methods: {
    seachData() {
      initCount()
      const self = this
      const hot = self.$refs.bodyTextHot.hotInstance
      hot.searchTxt = this.searchTxt
      hot.rowCol = []
      hot.updateSettings({
        cells: function(row, col, prop) {
          this.renderer = myrenderer
        }
      })
      this.searchCount = getCount()
    },
    seachBodyData() {
      initCount()
      const self = this
      const hot = self.$refs.httpresponseTextHot.hotInstance
      hot.searchTxt = this.searchTxt
      hot.rowCol = []
      hot.updateSettings({
        cells: function(row, col, prop) {
          this.renderer = myrenderer
        }
      })
      this.searchCount = getCount()
    },
    setTableReadOnly() {
      this.hotSettings.readOnly = true
      this.headerSettings.readOnly = true
      this.rspheaderSettings.readOnly = true
      this.httpResponseSettings.readOnly = true
    },
    setTableWritable() {
      this.headerSettings.readOnly = false
      this.hotSettings.readOnly = false
      this.rspheaderSettings.readOnly = false
      this.httpResponseSettings.readOnly = false
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
    // 获取请求头数据
    getHeadersSourceData() {
      return this.$refs.headersTextHot.settings.data
    },
    getRspHeadersSourceData() {
      return this.$refs.rspheadersTextHot.settings.data
    },
    // 获取请求体数据
    getRequestSourceData() {
      return this.$refs.bodyTextHot.settings.data
    },
    // 获取响应体数据
    getHttpResponseSourceData() {
      return this.$refs.httpresponseTextHot.settings.data
    },
    // 页面数据入口
    getPageInfo() {
      // 获取接口信息
      this.getHttpInterfaceInfo()
    },
    // 获取HTTP数据结构详情时调用
    async getHttpInterfaceInfo() {
      this.branch = this.$route.params.branch
      const returnData = await httpRequestWithoutLoading('GET', HTTP_INTERFACE_INFO + '?id=' + this.$route.params.id)
      this.httpInfo = returnData[0]
      this.apiInfoTitle = this.httpInfo.interface_name + '(/' + this.httpInfo.path.slice(1) + ')'
      this.publicValue = this.httpInfo.public_ext
      this.getAConstructDetailData(this.httpInfo.id, this.$route.params.branch)
    },
    async getAConstructDetailData(interfaceId, branch) {
      const returnData = await httpRequest('GET', API_BRANCH_CONSTRUCT + '?interface_id=' + interfaceId + '&branch=' + branch)
      this.$refs.headersTextHot.settings.data = headerRender(returnData.reqheaders)
      this.$refs.rspheadersTextHot.settings.data = headerRender(returnData.rspheaders)
      this.$refs.bodyTextHot.settings.data = bodyRender(returnData.request)
      this.$refs.httpresponseTextHot.settings.data = bodyRender(returnData.response)
    },
    // 搜索
    searchFunc() {
      console.log('函数助手')
      this.funcHepleDialog = true
    },
    async getFuncList() {
      const funcList = await httpRequest('GET', SCRIPT_GET)
      funcList.forEach((value) => {
        this.funcModelOptions.push({
          label: value.script_name + '（' + value.script_describe + '）',
          value: value.script_name
        })
        this.funcDict[value.script_name] = { script_describe: value.script_describe, script_sample: value.script_sample }
      })
    },
    getFuncDesc() {
      this.funcForm.script_describe = this.funcDict[this.funcForm.funcModel].script_describe
      this.funcForm.script_sample = this.funcDict[this.funcForm.funcModel].script_sample
    },
    // 导入JSON
    requestImportJson() {
      this.jsonForm.type = 'request'
      this.jsonImportVisible = true
    },
    importJson() {
      this.jsonForm.type = 'response'
      this.jsonImportVisible = true
    },
    async importJsonSubmit() {
      if (!this.jsonForm.jsonDta) {
        this.$message.error('JSON字符串不能为空')
      } else {
        const handleAddClick = {
          data: this.jsonForm.jsonDta
        }
        const returnData = await httpRequest('POST', API_TO_JSON, handleAddClick)
        if (this.jsonForm.type === 'request') {
          this.$refs.bodyTextHot.settings.data = returnData
        } else if (this.jsonForm.type === 'response') {
          this.$refs.httpresponseTextHot.settings.data = returnData
        }
        this.submitFlag = true
        this.setTableWritable()
        this.jsonImportVisible = false
      }
    },
    async saveBranchData() {
      const handleAddClick = {
        server_type: this.httpInfo.server_type,
        interface_id: this.httpInfo.id,
        branch: this.$route.params.branch,
        modifier: sessionStorage.getItem('currentUserName'),
        reqheaders: deleteNullData(this.getHeadersSourceData()),
        rspheaders: deleteNullData(this.getRspHeadersSourceData()),
        request: deleteHttpNullData(this.getRequestSourceData(), 'request'),
        response: deleteHttpNullData(this.getHttpResponseSourceData(), 'response')
      }
      const returnData = await httpRequest('POST', API_BRANCH_CONSTRUCT, handleAddClick)
      this.submitFlag = false
      this.versionDialog = false
      this.submitFlag = false
      this.setTableReadOnly()
      this.getHttpInterfaceInfo()
      this.httpSereverForm.id = returnData.id
    },
    changeSubmit() {
      this.submitFlag = true
      this.setTableWritable()
    },
    // eslint-disable-next-line no-dupe-keys
    cancelSubmit() {
      this.versionDialog = false
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.query.serverId })
    },
    async viewBody() {
      let publicData = []
      if (this.publicValue != null) {
        publicData = await httpRequestWithoutLoading('GET', GET_PUBLIC_DATA + '?serverId=' +
          this.serverId + '&publicExt=' + this.publicValue + '&contructType=request')
      }
      const handleAddClick = {
        datalist: mapContructData(publicData, deleteNullData(this.getRequestSourceData()))
      }
      const returnData = await httpRequestWithoutLoading('POST', LSIT_TO_JSON, handleAddClick)
      if (JSON.stringify(returnData) == '{}') {
        this.listToJSON = '{}'
      } else {
        this.listToJSON = returnData
      }
      this.jsonPraseVisible = true
    },
    async viewRespBody() {
      const handleAddClick = {
        datalist: deleteNullData(this.getHttpResponseSourceData())
      }
      const returnData = await httpRequestWithoutLoading('POST', LSIT_TO_JSON, handleAddClick)
      if (JSON.stringify(returnData) == '{}') {
        this.listToJSON = '{}'
      } else {
        this.listToJSON = returnData
      }
      this.jsonPraseVisible = true
    },
    handleDebugging() {
      this.debugButtonloading = true
      this.httpDebugForm.method_type = this.httpInfo.method
      this.httpDebugForm.method = this.httpInfo.method
      this.httpDebugForm.api_path = this.httpInfo.path
      this.httpDebugForm.path = this.httpInfo.path.substring(1, this.httpInfo.path.length)
      this.httpDebugForm.server_code = localStorage.getItem('SERVER_CODE')
      this.httpDebugForm.group_code = this.httpInfo.group_code
      this.httpDebugForm.body = ''
      this.httpDebugForm.response = ''
      this.debugDialog = true
      this.envInfoOptions = []
      JSON.parse(localStorage.getItem('HTTP_DEBUG_ENV')).forEach((value) => {
        this.envInfoOptions.push({
          value: value.env_name,
          label: value.env_name,
          key: value.env_name,
          host: value.protocol.toLowerCase() + '://' + value.host + ((value.port == '80') ? '' : (':' + value.port))
        })
      })
      // 获取请求体
      this.getDebugBody()
      // 设置默认的环境
      this.setDefaultEnv()
      this.debugButtonloading = false
    },
    async httpDebugSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.httpDebugForm.respHeaders = ''
          this.httpDebugForm.response = ''
          this.rspdebugloading = true
          const HandleEdit = {
            url: this.httpDebugForm.host + '/' + this.httpDebugForm.path,
            method_type: this.httpDebugForm.method_type,
            content_type: this.httpDebugForm.content_type,
            data: this.httpDebugForm.body,
            head: this.httpDebugForm.reqheaders,
            server_code: this.httpDebugForm.server_code,
            group_code: this.httpDebugForm.method,
            api_path: this.httpInfo.path,
            check_not_null: this.httpDebugForm.check_not_null,
            check_type: this.httpDebugForm.check_type,
            check_value: this.httpDebugForm.check_value,
            check_length: this.httpDebugForm.check_length,
            param: {
              'update': {},
              'check': false,
              'modify': {},
              'delete': [],
              'custom': {}
            }
          }
          this.$http({
            method: 'POST',
            url: HTTP_DEBUG,
            data: {
              ...HandleEdit
            }
          }).then((returnData) => {
            if (isSuccessCode(returnData)) {
              returnData = returnData.data
              this.httpDebugForm.status_code = returnData.status_code
              this.httpDebugForm.check_result = returnData.check_result
              var rspHeaderData = returnData.headers
              var headersList = []
              for (const key in rspHeaderData) {
                headersList.push([key, rspHeaderData[key][0]])
              }
              if (headersList.length != 0) {
                headersList.forEach((value) => {
                  this.httpDebugForm.respHeaders = this.httpDebugForm.respHeaders + value[0] + ' : ' + value[1] + '\n'
                })
              }
              try {
                this.httpDebugForm.response = JSON.stringify(JSON.parse(returnData.body), null, 4)
              } catch (e) {
                this.httpDebugForm.response = returnData.body
              }
            }
          }).catch((err) => {
            this.httpDebugForm.status_code = err.status_code
          })
          this.rspdebugloading = false
        } else {
          return false
        }
      })
    },
    setDefaultEnv() {
      if (this.envInfoOptions.length != 0) {
        this.httpDebugForm.env_type = this.envInfoOptions[0].value
        this.httpDebugForm.host = this.envInfoOptions[0].host
      }
    },
    setEnvInfo() {
      this.httpDebugForm.host = ''
      this.httpDebugForm.respHeaders = ''
      this.httpDebugForm.response = ''
      const search = this.httpDebugForm.env_type
      for (var i = 0; i < this.envInfoOptions.length; i++) {
        if (search === this.envInfoOptions[i].value) {
          this.httpDebugForm.host = this.envInfoOptions[i].host
        }
      }
      this.httpDebugForm.url = this.httpDebugForm.host + this.httpDebugForm.path
    },
    async getDebugBody() {
      this.httpDebugForm.respHeaders = ''
      this.httpDebugForm.response = ''
      this.httpDebugForm.reqheaders = ''
      var publicHeaderData = []
      if (this.publicValue != null) {
        publicHeaderData = await httpRequestWithoutLoading('GET', GET_PUBLIC_DATA + '?serverId=' +
          this.serverId + '&publicExt=' + this.publicValue + '&contructType=reqheaders')
      }
      var headersList = mapHeadersData(publicHeaderData, deleteNullData(this.getHeadersSourceData()))
      if (headersList.length != 0) {
        var reqHeadersDict = {}
        headersList.forEach((value) => {
          reqHeadersDict[value[0]] = value[1]
        })
        this.httpDebugForm.reqheaders = JSON.stringify(reqHeadersDict, null, 4)
      }
      let publicData = []
      if (this.publicValue != null) {
        publicData = await httpRequestWithoutLoading('GET', GET_PUBLIC_DATA + '?serverId=' +
          this.serverId + '&publicExt=' + this.publicValue + '&contructType=request')
      }
      const handleAddClick = {
        datalist: mapContructData(publicData, deleteNullData(this.getRequestSourceData()))
      }
      this.$http({
        method: 'POST',
        url: LSIT_TO_JSON,
        data: {
          ...handleAddClick
        }
      }).then((returnData) => {
        if (isEmptyObject(returnData.data)) {
          this.httpDebugForm.body = '{}'
        } else {
          this.httpDebugForm.body = returnData.data
        }
      })
      this.debugloading = false
    },
    cancleDebug() {
      this.httpDebugForm.env_type = ''
      this.httpDebugForm.url = ''
      this.httpDebugForm.host = ''
      this.httpDebugForm.path = ''
      this.httpDebugForm.reqheaders = ''
      this.httpDebugForm.respHeaders = ''
      this.httpDebugForm.status_code = ''
      this.debugDialog = false
    },
    refresh() {}
  }
}
