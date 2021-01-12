import { mapGetters } from 'vuex'
import HotTable from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import {
  API_TO_JSON, GET_PUBLIC_DATA, HTTP_DATA_CONSTRCUT_NEEWVERSION,
  HTTP_DATA_CONSTRUCT, HTTP_DATA_CONSTRUCT_ROLLBACK, HTTP_DEBUG,
  HTTP_INTERFACE_INFO,
  HTTP_TEMPLATES, LSIT_TO_JSON,
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
import { isCode2, isHost } from '../../../../utils/validata_rules'
import {
  getCount,
  initCount,
  isEmptyObject,
  isSuccessCode,
  mapContructData,
  mapHeadersData,
  myrenderer
} from '../../../../utils/tools'
import { console } from 'vuedraggable/src/util/helper'

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
      permission_type: '',
      type: '',
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
      versionlist: [
        {
          version: '1.0.0',
          description: '2019-11-12 11:11:11 凌云 \n' +
            '新增XXX字段\n' +
            '修改XXX字段'
        }
      ],
      showHistoryVerionDialog: false,
      versionDialog: false,
      // 版本回滚标志
      currentVersionId: 0,
      versionRollbackDialog: false,
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
      versionlog_list: [],
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
      httpDebugRequest: '',
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
        ],
        new_version: [
          { required: true, message: '版本号不能为空', trigger: 'blur' },
          { validator: isCode2, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '修订记录不能为空', trigger: 'blur' }
        ]
      },
      httpRequstHeaders: {},
      httpRequstBody: {},
      httpResponse: {},
      options: {
        publicOptions: [],
        groupCodeOptions: [],
        templatesOptions: [],
        methodOptions: [{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }, {
          value: 'PUT',
          label: 'PUT'
        }, { value: 'DELETE', label: 'DELETE' }]
      },
      test: 'test-hot',
      headerSettings: headerSettings,
      rspheaderSettings: rspheaderSettings,
      hotSettings: hotSettings,
      testRespone: 'testRespone',
      httpResponseSettings: httpResponseSettings
    }
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'zoom:0.8')
  },
  create() {
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {
    showDate() {
      var val = this.searchData + ''
      if (val.indexOf(this.search) !== -1 && this.search !== '') {
        val.replace(this.search, '<font color="#409EFF">' + this.search + '</font>')
      }
    },
    changeVerison() {
      this.changeVerison()
    },
    changeRollBackVersion() {
      this.changeRollBackVersion()
    }
  },
  created() {
    this.getServerInfo()
  },
  beforeDestroy() {
    console.log('销毁')
  },
  mounted() {
    this.setTableReadOnly()
    this.getPageInfo()
    this.getFuncList()
    this.getGroupCodeOptions()
    this.getPublicOptions()
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
    rollBackChangeVerison() {
      this.httpSereverForm.sub_version = 0
      for (var i = 0; i < this.versionMap.length; i++) {
        if (this.versionMap[i].key === this.httpSereverForm.new_version) {
          this.httpSereverForm.sub_version = Number(this.versionMap[i].value) + 1
          break
        }
      }
    },
    changeVerison() {
      this.submitForm.sub_version = 0
      for (var i = 0; i < this.versionMap.length; i++) {
        if (this.versionMap[i].key === this.submitForm.new_version) {
          this.submitForm.sub_version = Number(this.versionMap[i].value) + 1
          break
        }
      }
    },
    showDate(val) {
      val = val + ''
      if (val.indexOf(this.search) !== -1 && this.search !== '') {
        val.replace(this.search, '<font color="#409EFF">' + this.search + '</font>')
      }
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
    getPublicOptions() {
      this.options.publicOptions = JSON.parse(localStorage.getItem('PUBLIC_OPTIONS'))
    },
    getGroupCodeOptions() {
      this.options.groupCodeOptions = JSON.parse(localStorage.getItem('GROUP_OPTIONS'))
    },
    async getHttpTemplates() {
      const returnData = await httpRequest('GET', HTTP_TEMPLATES)
      const nameListArray = []
      for (const key in returnData) {
        returnData[key].index = key
        nameListArray.push({
          value: returnData[key].id,
          label: returnData[key].template
        })
      }
      this.options.templatesOptions = nameListArray
    },
    // 页面数据入口
    getPageInfo() {
      this.optType = this.$route.query.type
      if (this.$route.query.type === 'watchDetail' || this.$route.query.type === 'addVersion') {
        this.getHttpInterfaceInfo()
      } else if (this.$route.query.type === 'addConstructData') {
        this.apiInfoTitle = localStorage.getItem('CP_API_NAME') + '(/' + localStorage.getItem('CP_API_PATH') + ')'
        this.hotSettings.data = [[]]
        this.httpResponseSettings.data = [[]]
        this.headerSettings.data = [['Content-Type', 'application/json', '请求数据类型']]
        this.rspheaderSettings.data = [['Content-Type', 'application/json', '响应数据类型']]
        this.submitFlag = true
        this.setTableWritable()
        if (this.$route.query.templateId != null) {
          this.getTemplate(this.$route.query.templateId)
        }
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
      this.permission_type = Number(localStorage.getItem('PERMISSION'))
      this.serverId = this.$route.query.serverId
    },
    // 获取HTTP数据结构详情时调用
    async getHttpInterfaceInfo() {
      const returnData = await httpRequest('GET', HTTP_INTERFACE_INFO + '?id=' + this.$route.params.id + '&version=' + this.$route.query.version)
      this.httpInfo = returnData[0]
      this.httpSereverForm.interface_name = this.httpInfo.interface_name
      this.httpSereverForm.group_code = this.httpInfo.group_code
      this.httpSereverForm.method = this.httpInfo.method
      this.httpSereverForm.path = this.httpInfo.path.slice(1)
      this.httpSereverForm.id = this.httpInfo.id
      this.httpSereverForm.version = this.$route.query.version
      this.submitForm.new_version = this.httpInfo.version
      this.versionlog_list = this.httpInfo.versionlog_list
      this.publicValue = this.httpInfo.public_ext
      this.apiInfoTitle = this.httpInfo.interface_name + '(/' + this.httpInfo.path.slice(1) + ')'
      if (this.$route.query.type === 'addVersion') {
        this.initAddVersionData()
      } else {
        this.getHttpConstructDetailData(this.httpInfo.id, this.$route.query.version)
      }
      this.initVersionLog()
    },
    initAddVersionData() {
      this.$refs.bodyTextHot.settings.data = bodyRender([])
      this.$refs.httpresponseTextHot.settings.data = bodyRender([])
    },
    initVersionLog() {
      this.versionMap = []
      this.versionlog_list.forEach((value) => {
        const vList = value.version.split('.')
        const subVerison = vList.pop()
        const key = vList.join('.')
        if (this.versionMap.length != 0) {
          for (var i = 0; i < this.versionMap.length; i++) {
            if (key === this.versionMap[i].key && subVerison >= this.versionMap[i].value) {
              this.versionMap[i].value = subVerison
            } else if (key != this.versionMap[i].key && i === this.versionMap.length - 1) {
              this.versionMap.push({ key: key, value: subVerison })
            } else {
              continue
            }
          }
        } else {
          this.versionMap.push({ key: key, value: subVerison })
        }
      })
    },
    refresh() {
    },
    // 保存HTTP数据结构
    selectVersion() {
      if (this.$route.query.type === 'addConstructData') {
        this.submitForm.new_version = '1.0'
        this.submitForm.sub_version = 0
      } else {
        if (this.httpInfo.version != null && this.httpInfo.version != '' && this.httpInfo.version === this.httpSereverForm.version) {
          const vList = this.httpInfo.version.split('.')
          this.submitForm.sub_version = parseInt(vList[vList.length - 1]) + 1
          this.submitForm.new_version = ''
          for (var i = 0; i < vList.length - 1; i++) {
            if (this.submitForm.new_version === '') {
              this.submitForm.new_version = vList[i]
            } else {
              this.submitForm.new_version = this.submitForm.new_version + '.' + vList[i]
            }
          }
          this.submitForm.new_version = this.submitForm.new_version.trim()
        }
      }
      this.versionDialog = true
    },
    changeversion() {
      if (this.httpInfo.version != this.submitForm.new_version) {
        this.submitForm.sub_version = 1
      }
    },
    editVersionSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.versionDialog = false
          this.saveHttpDataInfo()
        }
      })
    },
    async saveHttpDataInfo() {
      var handleAddClick = {}
      if (this.$route.query.type === 'addConstructData') {
        handleAddClick = {
          server: this.serverId,
          interface_name: localStorage.getItem('CP_API_NAME'),
          group_code: localStorage.getItem('CP_API_GROUP'),
          version: this.submitForm.new_version + '.' + this.submitForm.sub_version,
          description: this.submitForm.description,
          modifier: sessionStorage.getItem('currentUserName'),
          path: localStorage.getItem('CP_API_PATH'),
          method: localStorage.getItem('CP_API_METHOD'),
          construct_data: this.createHttpConstructData(),
          public_ext: this.publicValue === '' ? null : this.publicValue
        }
      } else {
        handleAddClick = {
          id: this.httpSereverForm.id,
          server: this.serverId,
          interface_name: this.httpSereverForm.interface_name.trim(),
          group_code: this.httpSereverForm.group_code.trim(),
          version: this.submitForm.new_version + '.' + this.submitForm.sub_version,
          description: this.submitForm.description,
          modifier: sessionStorage.getItem('currentUserName'),
          path: '/' + this.httpSereverForm.path.trim(),
          method: this.httpSereverForm.method,
          construct_data: this.createHttpConstructData(),
          public_ext: this.publicValue === '' ? null : this.publicValue
        }
      }
      const returnData = await httpRequest('POST', HTTP_INTERFACE_INFO, handleAddClick)
      this.versionDialog = false
      this.submitFlag = false
      this.setTableReadOnly()
      this.$router.push({
        path: '/configpage/apidataversiondetail/' + returnData.id,
        query: { type: 'watchDetail', serverId: this.$route.query.serverId, version: returnData.version }
      })
    },
    addConstructInitData() {
      this.submitFlag = true
      this.setTableWritable()
      this.loading = false
      this.httpSereverForm.id = ''
      this.httpSereverForm.path = ''
      this.httpSereverForm.interface_name = ''
      this.httpSereverForm.group_code = ''
      this.httpSereverForm.version = '1.0.0'
      this.submitForm.new_version = '1.0.0'
      this.submitForm.description = ''
      this.hotSettings.data = [[]]
      this.httpResponseSettings.data = [[]]
      this.headerSettings.data = [[]]
      this.rspheaderSettings.data = [[]]
    },
    async getHttpConstructDetailData(interfaceId, version) {
      const returnData = await httpRequest('GET', HTTP_DATA_CONSTRUCT + '?interface_id=' + interfaceId + '&version=' + version)
      this.$refs.headersTextHot.settings.data = headerRender(returnData.reqheaders)
      this.$refs.rspheadersTextHot.settings.data = headerRender(returnData.rspheaders)
      this.$refs.bodyTextHot.settings.data = bodyRender(returnData.request)
      this.$refs.httpresponseTextHot.settings.data = bodyRender(returnData.response)
    },
    // 搜索
    searchFunc() {
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
    // 导出接口文档
    exportDataToExcel() {
    },
    // 构造HTTP报文数据
    createHttpConstructData() {
      const constructData = {
        reqheaders: deleteNullData(this.getHeadersSourceData()),
        rspheaders: deleteNullData(this.getRspHeadersSourceData()),
        request: deleteHttpNullData(this.getRequestSourceData(), 'request'),
        response: deleteHttpNullData(this.getHttpResponseSourceData(), 'response')
      }
      return constructData
    },
    // 取出null的行
    showHistoryVerion() {
      this.showHistoryVerionDialog = true
    },
    changeSubmitStatus() {
      this.submitFlag = true
      this.setTableWritable()
    },
    cancelSubmit() {
      this.versionDialog = false
      // this.submitFlag = false
      // const vList = this.httpInfo.version.split('.')
      // this.submitForm.sub_version = vList.pop()
      // this.submitForm.new_version = vList.join('.')
      // this.submitForm.sub_version = ''
      // if (this.$route.query.type === 'addConstructData') {
      //   this.setTableWritable()
      //   this.submitFlag = true
      // } else {
      //   this.setTableReadOnly()
      // }
    },
    handleVersionDetail(index, row) {
      this.currentVersionId = index
      this.getHttpConstructDetailData(row.resource_id, row.version)
      this.httpSereverForm.version = row.version
      this.showHistoryVerionDialog = false
      this.submitFlag = false
      this.setTableReadOnly()
    },
    handleRollBack(index, row) {
      this.versionRollbackDialog = true
      this.httpSereverForm.versionId = row.id
      this.tmpVersion = row.version
      const vList = this.httpInfo.version.split('.')
      this.httpSereverForm.sub_version = Number(vList.pop()) + 1
      this.httpSereverForm.new_version = vList.join('.')
    },
    async rollbackVersionSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            interface_id: this.httpInfo.id,
            new_version: this.httpSereverForm.new_version + '.' + this.httpSereverForm.sub_version,
            old_version: this.httpInfo.version,
            tmp_version: this.tmpVersion,
            version_id: this.httpSereverForm.versionId,
            description: this.httpSereverForm.description,
            modifier: sessionStorage.getItem('currentUserName')
          }
          if ((this.httpSereverForm.new_version + '.' + this.httpSereverForm.sub_version) === this.httpInfo.version) {
            this.$confirm('此操作将覆盖原有最新版本, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              await httpRequest('PUT', HTTP_DATA_CONSTRUCT_ROLLBACK, handleAddClick)
              this.versionRollbackDialog = false
              this.showHistoryVerionDialog = false
              this.getHttpInterfaceInfo()
              this.httpSereverForm.description = ''
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          } else {
            await httpRequest('PUT', HTTP_DATA_CONSTRCUT_NEEWVERSION, handleAddClick)
            this.showHistoryVerionDialog = false
            this.versionRollbackDialog = false
            this.getHttpInterfaceInfo()
            this.httpSereverForm.description = ''
          }
        }
      })
    },
    closeTab() {
      window.lo
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.query.serverId })
    },
    async initData(interfaceId, version) {
      const returnData = await httpRequest('GET', HTTP_DATA_CONSTRUCT + '?interface_id=' +
        interfaceId + '&version=' + version)
      this.headerSettings.data = headerRender(returnData.reqheaders)
      this.rspheaderSettings.data = headerRender(returnData.rspheaders)
      this.hotSettings.data = bodyRender(returnData.request)
      this.httpResponseSettings.data = bodyRender(returnData.response)
    },
    getTemplate(templateId) {
      this.initData(templateId, '')
    },
    async viewBody() {
      const publicData = await httpRequestWithoutLoading('GET', GET_PUBLIC_DATA + '?serverId=' +
        this.serverId + '&publicExt=' + this.publicValue + '&contructType=request')
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
      this.httpDebugForm.method_type = this.httpSereverForm.method
      this.httpDebugForm.path = this.httpSereverForm.path
      this.httpDebugForm.server_code = localStorage.getItem('SERVER_CODE')
      this.httpDebugForm.group_code = this.httpInfo.group_code
      this.httpDebugForm.method = this.httpInfo.method
      this.httpDebugForm.api_path = this.httpInfo.api_path
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
            // url: this.httpDebugForm.method_type === 'GET' || this.httpDebugForm.method_type === 'DELETE' ? this.httpDebugForm.host + '/' +
            //   this.httpDebugForm.path + '?' + this.httpDebugForm.body : this.httpDebugForm.host + '/' + this.httpDebugForm.path,
            url: this.httpDebugForm.host + '/' + this.httpDebugForm.path,
            method_type: this.httpDebugForm.method_type,
            content_type: this.httpDebugForm.content_type,
            // data: this.httpDebugForm.method_type === 'GET' || this.httpDebugForm.method_type === 'DELETE' ? '' : this.httpDebugForm.body,
            data: this.httpDebugForm.body,
            head: this.httpDebugForm.reqheaders,
            server_code: this.httpDebugForm.server_code,
            group_code: this.httpDebugForm.method,
            api_path: '/' + this.httpDebugForm.path,
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
                if (returnData.body === undefined) {
                  this.httpDebugForm.response = returnData
                } else {
                  this.httpDebugForm.response = returnData.body
                }
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
      this.httpDebugForm.response = ''
      this.httpDebugForm.respHeaders = ''
      this.httpDebugForm.reqheaders = ''
      this.httpDebugForm.check_result = ''
      const publicHeaderData = await httpRequestWithoutLoading('GET', GET_PUBLIC_DATA + '?serverId=' +
        this.serverId + '&publicExt=' + this.publicValue + '&contructType=reqheaders')
      var headersList = mapHeadersData(publicHeaderData, deleteNullData(this.getHeadersSourceData()))
      if (headersList.length != 0) {
        var reqHeadersDict = {}
        headersList.forEach((value) => {
          reqHeadersDict[value[0]] = value[1]
        })
        this.httpDebugForm.reqheaders = JSON.stringify(reqHeadersDict, null, 4)
      }
      const publicData = await httpRequestWithoutLoading('GET', GET_PUBLIC_DATA + '?serverId=' +
        this.serverId + '&publicExt=' + this.publicValue + '&contructType=request')
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
        if (isSuccessCode(returnData)) {
          if (isEmptyObject(returnData.data)) {
            this.httpDebugForm.body = '{}'
            this.httpDebugRequest = '{}'
          } else {
            this.httpDebugRequest = returnData.data
            this.httpDebugForm.body = returnData.data
          }
          // if (this.httpDebugForm.method_type === 'GET' || this.httpDebugForm.method_type === 'DELETE') {
          //   console.log(this.httpDebugForm.body)
          //   const tmpBody = JSON.parse(this.httpDebugForm.body)
          //   this.httpDebugForm.body = ''
          //   for (var key in tmpBody) {
          //     if (this.httpDebugForm.body != '') {
          //       this.httpDebugForm.body = this.httpDebugForm.body + '&' + key + '=' + encodeURI(tmpBody[key])
          //     } else {
          //       this.httpDebugForm.body = key + '=' + encodeURI(tmpBody[key])
          //     }
          //   }
          // }
        }
      })
      this.debugloading = false
    },
    cancleDebug() {
      this.httpDebugForm.env_type = ''
      this.httpDebugForm.url = ''
      this.httpDebugForm.host = ''
      this.httpDebugForm.reqheaders = ''
      this.httpDebugForm.respHeaders = ''
      this.httpDebugForm.status_code = ''
      this.httpDebugForm.check_result = ''
      this.debugDialog = false
    },
    handlePublicChange() {
    },
    addUpdateParamForm() {
      this.httpDebugForm.updateList.push({
        key: '',
        value: ''
      })
    },
    deleteUpdateParamItem(index, row) {
      this.httpDebugForm.updateList.splice(index, 1)
    },
    getUpdateParam(updateList) {
      const updateJson = {}
      this.httpDebugForm.updateList.forEach(data => {
        updateJson[data.key] = data.value
      })
      return updateJson
    },
    updateSearchCount() {
      this.searchCount = 0
    },
    changeBody() {
      if (this.httpDebugForm.method_type === 'GET' || this.httpDebugForm.method_type === 'DELETE') {
        const tmpBody = JSON.parse(this.httpDebugRequest)
        this.httpDebugForm.body = ''
        for (var key in tmpBody) {
          if (this.httpDebugForm.body != '') {
            this.httpDebugForm.body = this.httpDebugForm.body + '&' + key + '=' + encodeURI(JSON.stringify(tmpBody[key]).replaceAll('"', ''))
          } else {
            this.httpDebugForm.body = key + '=' + encodeURI(JSON.stringify(tmpBody[key]).replaceAll('"', ''))
          }
        }
      } else {
        this.httpDebugForm.body = this.httpDebugRequest
      }
    }
  }
}
