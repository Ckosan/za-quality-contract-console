import { mapGetters } from 'vuex'
import { api_url, ws_host } from '../../../../settings'
import {
  API_CONTRACT_DEBUG,
  API_CONTRACT_DOC, API_EXT_INFO, DATA_SET_API,
  DELETE_INTERFACE,
  GET_SWAGGER_INTERFACE,
  HTTP_DEBUG,
  HTTP_INTERFACE_ADD_BRANCH,
  HTTP_INTERFACE_DELETE_BRANCH,
  HTTP_INTERFACE_INFO,
  HTTP_SERVER_API,
  HTTP_SERVER_ENVLIST,
  HTTP_TEMPLATES,
  SERVER_DETAIL, SERVER_INTERFACE_API,
  SERVER_PARASE_POSTMAN,
  SWAGGER_IMPORT_ALL,
  SWAGGER_IMPORT_SINGLE
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isUri } from '../../../../utils/validata_rules'
import { convertTime, isSuccessCode } from '../../../../utils/tools'
import { console } from 'vuedraggable/src/util/helper'

export default {
  data() {
    return {
      uploadPostman: '',
      postmanImportVisible: false,
      file: '',
      fileList: [],
      branchForm: {
        branch: '',
        version: '',
        apiId: '',
        server: '',
        describe: ''
      },
      addBranchVisible: false,
      docForm: {
        group_code: '',
        method: '',
        path: '',
        interface_name: '',
        publicValue: null,
        interface_description: ''
      },
      editDocForm: {
        id: '',
        group_code: '',
        method: '',
        path: '',
        interface_name: '',
        publicValue: null,
        version: '',
        interface_description: ''
      },
      protocolOptions: [{ value: 'HTTP', label: 'HTTP' }, { value: 'HTTPS', label: 'HTTPS' }],
      versionOptions: [],
      groupCodeOptions: [],
      publicOptions: [],
      newDocVisible: false,
      editDocVisible: false,
      swaggerImportVisible: false,
      swaggerForm: {},
      radio: '1',
      swaggerApiOptions: [],
      swaggerMethodOptions: [{ value: 'get', label: 'GET' }, { value: 'post', label: 'POST' }, {
        value: 'put',
        label: 'PUT'
      }, { value: 'delete', label: 'DELETE' }],
      templateId: '',
      templateVisible: false,
      searchTxt: '',
      searchexpandTxt: '',
      expands: [],
      expandTable: [],
      tmpExpanList: [],
      apiUrl: '',
      httpApi: '',
      apiOptions: [],
      addLoading: false,
      debugDialog: false,
      serverDetail: [],
      projectinfo: [],
      application_info: [],
      editEnvVisible: false,
      editEnvForm: {
        id: '',
        env_name: '',
        protocol: '',
        host: '',
        port: '',
        server_id: ''
      },
      // http接口请求体
      interfaceRequestBody: '',
      debugloading: false,
      rspdebugloading: false,
      versionDebugOptions: [],
      branchOptions: [],
      datasetOptions: [],
      dataSourceOptions: [{ value: '版本', lable: '版本' }, { value: '分支', lable: '分支' }, { value: '用例集', lable: '用例集' }],
      httpDebugForm: {
        method: '',
        dataSource: '版本',
        api: '',
        interfaceId: '',
        branch: '',
        dataset: [],
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
      httpDataTemplate: {
        reqheaders: [],
        rspheaders: [],
        request: [],
        response: []
      },
      templatesOptions: [],
      methodOptions: [{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }, {
        value: 'PUT',
        label: 'PUT'
      }, { value: 'DELETE', label: 'DELETE' }],
      envInfoOptions: [],
      contentTypeOptions: [
        { label: 'application/json', value: 'application/json' },
        { label: 'application/form', value: 'application/form' }
      ],
      pagesize: 10,
      pagesize2: 10,
      currentPage: 1, // 初始页
      currentPage2: 1,
      apiList: [],
      tmpApiList: [],
      addDataSetVisible: false,
      addDataSetForm: {
        name: '',
        serverType: '',
        serverId: '',
        interfaceId: '',
        modifier: sessionStorage.getItem('currentUserName'),
        description: ''
      },
      debugButtonloading: false,

      rules: {
        interface_name: [
          { required: true, message: '接口说明不能为空', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请求方式不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '接口地址不能为空', trigger: 'blur' },
          { validator: isUri, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '修订记录不能为空', trigger: 'blur' }
        ],
        branch: [
          { required: true, message: '分支不能为空', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '分支说明不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '用例集名称不能为空', trigger: 'blur' }
        ],
        // env_type: [
        //   { required: true, message: '环境不能为空', trigger: 'blur' }
        // ],
        host: [
          { required: true, message: '主机地址不能为空', trigger: 'blur' }
        ],
        api: [
          { required: true, message: '接口不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  beforeCreate() {
  },
  created() {
    this.getDetailData()
    this.apiUrl = api_url
    this.getHttpTemplates()
    if ('WebSocket' in window) {
      this.websocket = new WebSocket(ws_host + '/hostCheckWebsocket/' + this.$route.params.id)
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])
  },
  watch: {
    seachApiList() {
      this.apiList = this.seachApiList()
    }
  },
  methods: {
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage() {
    },
    setOnopenMessage() {
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      const data = JSON.parse(event.data)
      this.serverDetail.server_env = data
    },
    setOncloseMessage() {
    },
    onbeforeunload() {
      this.closeWebSocket()
    },
    closeWebSocket() {
      this.websocket.close()
    },
    seachApiList() {
      this.apiList = this.getFilterApiList()
    },
    seachBranchList() {
      this.apiList = this.getFilterApiList()
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
    handleSizeChange: function(size) {
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    handleSizeChange2: function(size) {
      this.pagesize2 = size
    },
    handleCurrentChange2: function(currentPage) {
      this.currentPage2 = currentPage
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    getPublicOptions() {
      var publicOptions = []
      this.apiList.forEach((value) => {
        let addFlag = true
        publicOptions.forEach((value1) => {
          if (value.method === value1.value) {
            value1.children.push({ label: value.path, value: value.path })
            addFlag = false
          }
        })
        if (addFlag) {
          publicOptions.push({
            label: value.method, value: value.method,
            children: [{ label: value.path, value: value.path }]
          })
        }
      })
      localStorage.setItem('PUBLIC_OPTIONS', JSON.stringify(publicOptions))
      this.publicOptions = publicOptions
    },
    getGroupData(apiList) {
      var groupCodeOptions = []
      this.apiList.forEach((value) => {
        if (groupCodeOptions.indexOf(value.method) === -1) {
          groupCodeOptions.push(value.method)
        }
      })
      var newGroupCodeOptions = [{
        value: 'base',
        key: 'base',
        lable: 'base'
      }]
      groupCodeOptions.forEach((value) => {
        if (value != 'base') {
          newGroupCodeOptions.push({ value: value, key: value, lable: value })
        }
      })
      localStorage.setItem('GROUP_OPTIONS', JSON.stringify(newGroupCodeOptions))
      this.groupCodeOptions = newGroupCodeOptions
    },
    // 获取路由参数
    async getDetailData() {
      this.loading = true
      const returnData = await httpRequest('GET', SERVER_DETAIL + '?id=' + this.$route.params.id)
      this.serverDetail = returnData[0]
      this.apiList = []
      this.tmpApiList = []
      this.getEnvListByServer()
      this.getInterfaceListByServer()
      this.projectinfo = this.serverDetail.project_name + '(' + this.serverDetail.project_code + ')'
      this.application_info = this.serverDetail.application_name + '(' + this.serverDetail.application_code + ')'
      this.loading = false
      localStorage.setItem('SERVER_PROJECT', this.projectinfo)
      localStorage.setItem('SERVER_APPLICATION', this.application_info)
      localStorage.setItem('SERVER_INFO', this.serverDetail.server_name + '(' + this.serverDetail.server_code + ')')
      localStorage.setItem('SERVER_CODE', this.serverDetail.server_code)
      localStorage.setItem('SERVER_TYPE', this.serverDetail.server_type)
      localStorage.setItem('PERMISSION', this.serverDetail.permission_type)
    },
    getEnvOptions(envInfo) {
      if (envInfo != null) {
        for (var i = 0; i < envInfo.length; i++) {
          this.envInfoOptions.push({
            key: i + 1,
            label: envInfo[i].env_name,
            value: envInfo[i].protocol.toLowerCase() + '://' + envInfo[i].host + this.httpApi
          })
        }
      }
    },
    initEnv(envInfo, api) {
      if (envInfo != null) {
        for (var i = 0; i < envInfo.length; i++) {
          if (envInfo[i].env_name === this.httpDebugForm.env_type) {
            this.httpDebugForm.url = envInfo[i].protocol.toLowerCase() + '://' + envInfo[i].host + api
          }
        }
      }
    },
    setEnvInfo() {
      this.httpDebugForm.host = this.httpDebugForm.env_type
    },
    changeBody() {
      if (this.httpDebugForm.method_type === 'GET' || this.httpDebugForm.method_type === 'DELETE') {
        const tmpBody = this.httpDebugRequest
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
    },
    // 新增分支
    handleAddBranch(index, row) {
      this.initVersionOptions(row.versions)
      this.branchForm.version = row.version
      this.branchForm.apiId = row.id
      this.addBranchVisible = true
    },
    // 初始化版本列表
    initVersionOptions(versionList) {
      this.versionOptions = []
      if (versionList != null) {
        versionList.forEach((value) => {
          this.versionOptions.push({
            value: value.version,
            label: value.version,
            index: value.version
          })
        })
      }
    },
    handleViewBranch(index, row) {
      if (this.serverDetail.server_type === 'API') {
        this.$router.push({
          path: '/configpage/apidatabranchdetail/' + row.interface_id + '/' + row.branch,
          query: { serverId: this.serverDetail.id }
        })
      } else {
        return
      }
    },
    handleInterfaceEdit(index, row) {
      this.editDocVisible = true
      this.editDocForm = Object.assign({}, row)
      this.editDocForm.publicValue = row.public_ext
      this.editDocForm.path = row.path.substring(1, row.path.length)
    },
    handleViewDoc(index, row) {
      if (this.serverDetail.server_type === 'API') {
        this.$router.push({
          path: '/configpage/apidataversiondetail/' + row.id,
          query: { type: 'watchDetail', serverId: this.serverDetail.id, version: row.version }
        })
      } else if (this.serverDetail.server_type === 'ONS') {
        this.$router.push({
          path: '/configpage/onsdataconstructdetail/' + row.id,
          query: { type: 'watchDetail', serverId: this.serverDetail.id, version: row.version }
        })
      } else if (this.serverDetail.server_type === 'OSS') {
        this.$router.push({
          path: '/configpage/ossdataconstructdetail/' + row.id,
          query: { type: 'watchDetail', serverId: this.serverDetail.id, version: row.version }
        })
      } else if (this.serverDetail.server_type === 'SFTP') {
        this.$router.push({
          path: '/configpage/sftpdataconstructdetail/' + row.id,
          query: { type: 'watchDetail', serverId: this.serverDetail.id, version: row.version }
        })
      } else {
        this.$router.push({
          path: '/configpage/sftpdataconstructdetail/' + row.id,
          query: { type: 'watchDetail', serverId: this.serverDetail.id, version: row.version }
        })
      }
    },
    // 接口预览
    handleViews(index, row) {
      // 打开新窗口
      window.open(row.interface_url, '_blank')
    },
    addDataConstruct() {
      this.addLoading = false
      this.newDocVisible = true
    },
    goApplicationDetail(id) {
      console.log(id)
    },
    downloadDocument() {
      window.open(api_url + '/download/getserverdoc?serverId=' + this.$route.params.id, '_blank')
    },
    handleDebugging() {
      this.initApiOptions(this.apiList)
      this.getEnvOptions(this.serverDetail.server_env)
      this.debugDialog = true
    },
    initApiOptions(apiList) {
      for (let i = 0; i < apiList.length; i++) {
        this.apiOptions.push({
          key: apiList[i].id,
          value: apiList[i].path,
          label: apiList[i].interface_name + '(' + apiList[i].path + ')',
          method: apiList[i].method,
          version: apiList[i].version
        })
      }
    },
    changeApi() {
      console.log('选择API')
      for (let i = 0; i < this.apiOptions.length; i++) {
        if (this.apiOptions[i].value === this.httpDebugForm.api) {
          this.httpDebugForm.method_type = this.apiOptions[i].method
          this.httpDebugForm.interfaceId = this.apiOptions[i].key
          this.httpDebugForm.version = this.apiOptions[i].version
          this.httpDebugForm.method = this.apiOptions[i].method
        }
      }
      this.httpDebugForm.path = this.httpDebugForm.api.substring(1, this.httpDebugForm.api.length)
      this.getDebugBody()
      this.initExtOptions()
    },
    changeDataSourceForVersion() {
      this.httpDebugForm.branch = ''
      this.httpDebugForm.dataset = []
      this.getDebugBody()
    },
    changeDataSourceForBranch() {
      this.httpDebugForm.version = ''
      this.httpDebugForm.dataset = []
      this.getDebugBody()
    },
    changeDataSourceForDataSet() {
      this.httpDebugForm.version = ''
      this.httpDebugForm.branch = ''
      this.getDebugBody()
    },
    async initExtOptions() {
      const returnData = await httpRequestWithoutLoading('GET', API_EXT_INFO + '?interfaceId=' + this.httpDebugForm.interfaceId)
      this.branchOptions = returnData.branchList
      this.datasetOptions = returnData.dataSetList
      this.versionDebugOptions = returnData.versionList
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
            server_code: this.serverDetail.server_code,
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
    goback() {
      this.$router.push({ path: '/configpage/servermanager' })
    },
    deleteBranch(index, row) {
      console.log(row)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequestWithoutLoading('DELETE', HTTP_INTERFACE_DELETE_BRANCH + '?id=' + row.id)
        this.getInterfaceListByServer()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteInterface(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequestWithoutLoading('DELETE', DELETE_INTERFACE + '?interface_id=' + row.id + '&server_type=' +
          this.serverDetail.server_type + '&modifier=' + sessionStorage.getItem('currentUserName'))
        this.getInterfaceListByServer()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    useTemplate() {
      this.templateVisible = true
    },
    async getHttpTemplates() {
      const returnData = await httpRequestWithoutLoading('GET', HTTP_TEMPLATES)
      this.templatesOptions = returnData
    },
    copyTemplate(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          localStorage.setItem('CP_API_NAME', this.docForm.interface_name.trim())
          localStorage.setItem('CP_API_GROUP', this.docForm.group_code.trim())
          localStorage.setItem('CP_API_PATH', '/' + this.docForm.path.trim())
          localStorage.setItem('CP_API_METHOD', this.docForm.method)
          this.$router.push({
            path: '/configpage/apidataversiondetail/' + this.serverDetail.id,
            query: { type: 'addConstructData', templateId: this.templateId[3], serverId: this.serverDetail.id }
          })
        }
      })
    },
    getVersionResponse(props, index, row) {
      var url = api_url + '/api/mocktool/' + this.serverDetail.server_code + '/' + props.method + props.path + '?branch=' + row.branch
      window.open(url, '_blank')
    },
    getResponse(inde, row) {
      var url = api_url + '/api/mocktool/' + this.serverDetail.server_code + '/' + row.method + '/' + row.version + row.path
      window.open(url, '_blank')
    },
    getBranchDoc(prow, index, row) {
      var url = api_url + API_CONTRACT_DOC + '?id=' + row.interface_id + '&version=&branch=' + row.branch
      window.open(url, '_blank')
    },
    getVersionRequest(props, index, row) {
      var url = api_url + '/api/datatool/' + this.serverDetail.server_code + '/' + props.method + props.path + '?branch=' + row.branch
      window.open(url, '_blank')
    },
    getContractDoc(index, row) {
      // 跳转到文档界面
      var url = api_url + API_CONTRACT_DOC + '?id=' + row.id + '&version=&branch='
      window.open(url, '_blank')
    },
    getRequest(index, row) {
      var url = api_url + '/api/datatool/' + this.serverDetail.server_code + '/' + row.method + row.path
      window.open(url, '_blank')
    },
    importSwagger() {
      this.swaggerImportVisible = true
    },
    async syncSwaggerApi() {
      this.addLoading = true
      try {
        this.swaggerApiOptions = await httpRequestWithoutLoading('GET', GET_SWAGGER_INTERFACE + '?swagger_url=' + this.swaggerForm.swagger_url)
      } finally {
        this.addLoading = false
      }
    },
    async importSwaggerSubmit() {
      var data = {
        server: this.serverDetail.id,
        swagger_url: this.swaggerForm.swagger_url,
        group_code: this.swaggerForm.method,
        modifier: sessionStorage.getItem('currentUserName')
      }
      if (this.radio === '1') {
        data.api_name = this.swaggerForm.api_name
        data.method = this.swaggerForm.method
        await httpRequest('POST', SWAGGER_IMPORT_SINGLE, data)
      } else {
        await httpRequest('POST', SWAGGER_IMPORT_ALL, data)
      }
      this.swaggerImportVisible = false
      this.getInterfaceListByServer()
      this.swaggerForm.swagger_url = ''
      this.swaggerForm.api_name = ''
      this.swaggerForm.method = ''
      this.radio = '1'
    },
    // 新增文档
    addApiDoc(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            server: this.serverDetail.id,
            interface_name: this.docForm.interface_name.trim(),
            group_code: this.docForm.group_code.trim(),
            interface_description: this.docForm.interface_description,
            version: 'v1.0.0',
            modifier: sessionStorage.getItem('currentUserName'),
            path: '/' + this.docForm.path.trim(),
            method: this.docForm.method,
            construct_data: {
              reqheaders: [],
              rspheaders: [],
              request: [],
              response: []
            },
            public_ext: this.docForm.publicValue === '' ? null : this.docForm.publicValue
          }
          await httpRequestWithoutLoading('POST', HTTP_INTERFACE_INFO, handleAddClick)
          this.addLoading = false
          this.newDocVisible = false
          this.docForm.interface_name = ''
          this.docForm.group_code = ''
          this.docForm.path = ''
          this.docForm.method = ''
          this.docForm.publicValue = ''
          this.getInterfaceListByServer()
        }
      })
    },
    handlePublicChange() {
    },
    editApiDoc(index, row) {
      this.editDocForm.id = row.id
      this.editDocVisible = true
      console.log(row.path)
      this.editDocForm = Object.assign({}, row)
      this.editDocForm.path = row.path.substring(1, row.path.length)
      this.editDocForm.publicValue = row.public_ext
    },
    // 编辑文档
    editApiDocSubmit(editDocForm) {
      this.$refs[editDocForm].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            id: this.editDocForm.id,
            server_id: this.serverDetail.id,
            version: this.editDocForm.version,
            interface_description: this.editDocForm.interface_description,
            interface_name: this.editDocForm.interface_name.trim(),
            group_code: '',
            modifier: sessionStorage.getItem('currentUserName'),
            path: '/' + this.editDocForm.path.trim(),
            method: this.editDocForm.method,
            public_ext: this.editDocForm.publicValue
          }
          await httpRequestWithoutLoading('PUT', HTTP_INTERFACE_INFO, handleAddClick)
          this.editDocVisible = false
          this.getInterfaceListByServer()
        }
      })
    },
    // 新增分支提交
    addBranchSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            interface_id: this.branchForm.apiId,
            server_type: this.serverDetail.server_type,
            server_id: this.serverDetail.id,
            version: this.branchForm.version,
            branch: this.branchForm.branch.trim(),
            modifier: sessionStorage.getItem('currentUserName'),
            description: this.branchForm.describe
          }
          try {
            await httpRequestWithoutLoading('POST', HTTP_INTERFACE_ADD_BRANCH, handleAddClick)
          } catch (e) {
            console.log(e)
          } finally {
            this.addBranchVisible = false
          }
          this.branchForm.version = ''
          this.branchForm.branch = ''
          this.branchForm.describe = ''
          this.getInterfaceListByServer()
        }
      })
    },
    // 合并
    handleMergeBranch(props, row) {
      this.$router.push({
        path: '/configpage/apidatabranchmerge/' + this.serverDetail.id + '/' + row.branch,
        query: { version: props.version, interfaceId: row.interface_id }
      })
    },
    importPostman() {
      this.postmanImportVisible = true
      console.log('postman')
    },
    changeFile(file) {
      this.file = file.raw
    },
    // 初始化文件参数
    initFileForm() {
      const formFile = new FormData()
      formFile.append('file', this.file)
      formFile.append('server_id', this.serverDetail.id)
      formFile.append('version', 'v1.0.0')
      formFile.append('modifier', sessionStorage.getItem('currentUserName'))
      return formFile
    },
    // 上传postman文件
    async importPostSubmit() {
      this.addLoading = true
      try {
        await httpRequestWithoutLoading('POST', SERVER_PARASE_POSTMAN, this.initFileForm())
      } finally {
        this.addLoading = false
      }
      this.postmanImportVisible = false
      this.getInterfaceListByServer()
    },
    // 查看mock列表
    viewMockConfig(index, row) {
      console.log(row)
      if (row.branchs == null) {
        this.$message.error('未创建分支，请先创建分支')
        return
      }
      this.$router.push({
        path: '/configpage/apimockconfiglist/' + row.id,
        query: { serverId: this.serverDetail.id }
      })
    },
    createDataSet(row) {
      this.addDataSetForm.interfaceId = row.id
      this.addDataSetForm.serverId = this.serverDetail.id
      this.addDataSetForm.serverType = this.serverDetail.server_type
      this.addDataSetVisible = true
    },
    addDataSetSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            name: this.addDataSetForm.name,
            server_type: this.addDataSetForm.serverType,
            server_id: this.addDataSetForm.serverId,
            interface_id: this.addDataSetForm.interfaceId,
            modifier: this.addDataSetForm.modifier,
            description: this.addDataSetForm.description
          }
          await httpRequestWithoutLoading('POST', DATA_SET_API, HandleEdit)
          this.addDataSetVisible = false
          this.$message.success('添加成功')
        } else {
          console.log('error submit!!')
        }
      })
    },
    viewDataSet(row) {
      localStorage.setItem('API_INFO', row.interface_name + '(' + row.path + ')')
      this.$router.push({
        path: '/dataconfigpage/datasetslist',
        query: { interfaceId: row.id }
      })
    },
    handleEnvEdit(index, row) {
      this.editEnvVisible = true
      this.editEnvForm = Object.assign({}, row)
    },
    editEnvSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editEnvForm.id,
            env_name: this.editEnvForm.env_name,
            protocol: this.editEnvForm.protocol,
            host: this.editEnvForm.host,
            port: this.editEnvForm.port,
            server_id: this.editEnvForm.server_id,
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequestWithoutLoading('PUT', HTTP_SERVER_API, HandleEdit)
          this.getEnvListByServer()
          this.editEnvVisible = false
          this.$message.success('修改成功')
        } else {
          console.log('error submit!!')
        }
      })
    },
    handleEnvDelete(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: HTTP_SERVER_API + '?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName')
        }).then((returnData) => {
          this.getEnvListByServer()
          this.$message.success('删除成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getEnvListByServer() {
      const returnData = await httpRequestWithoutLoading('GET', HTTP_SERVER_ENVLIST + '?server_id=' + this.$route.params.id)
      this.serverDetail.server_env = returnData
      localStorage.setItem('HTTP_DEBUG_ENV', JSON.stringify(this.serverDetail.server_env))
    },
    async getInterfaceListByServer() {
      const returnData = await httpRequestWithoutLoading('GET', SERVER_INTERFACE_API + '?server_id=' +
        this.$route.params.id + '&server_type=' + this.serverDetail.server_type)
      this.apiList = returnData
      this.tmpApiList = returnData
      this.getGroupData(this.apiList)
      this.getPublicOptions()
    },
    isShowIcon(row, index) {
      try {
        if (row.row.branchs.length > 0) {
          return ''
        } else {
          return 'hiderow'
        }
      } catch (e) {
        return 'hiderow'
      }
    },
    convertTimeFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    },
    goToVersionDetail(row) {
      console.log(row)
      if (row.server_type === 'API') {
        this.$router.push({
          path: '/configpage/apidataversiondetail/' + row.interface_id,
          query: { type: 'watchDetail', serverId: row.server_id, version: row.version }
        })
      } else {
        return
      }
    },
    goToDocVersionDetail(row) {
      if (this.serverDetail.server_type === 'API') {
        this.$router.push({
          path: '/configpage/apidataversiondetail/' + row.id,
          query: { type: 'watchDetail', serverId: this.serverDetail.id, version: row.version }
        })
      } else {
        return
      }
    },
    async getDebugBody() {
      this.httpDebugForm.response = ''
      this.httpDebugForm.respHeaders = ''
      this.httpDebugForm.reqheaders = ''
      this.httpDebugForm.check_result = ''
      this.httpDebugForm.body = ''
      this.debugloading = false
      if (this.httpDebugForm.interfaceId === '') return
      const handleAddClick = {
        interface_id: this.httpDebugForm.interfaceId,
        version: this.httpDebugForm.version,
        branch: this.httpDebugForm.branch,
        data_set: this.httpDebugForm.dataset
      }
      const returnData = await httpRequestWithoutLoading('POST', API_CONTRACT_DEBUG, handleAddClick)
      this.httpDebugForm.reqheaders = JSON.stringify(returnData.reqHeaders, null, 4)
      this.httpDebugRequest = returnData.requestBody
      // if (this.httpDebugForm.method_type === 'GET' || this.httpDebugForm.method_type === 'DELETE') {
      //   const tmpBody = returnData.requestBody
      //   this.httpDebugForm.body = ''
      //   for (var key in tmpBody) {
      //     if (this.httpDebugForm.body != '') {
      //       this.httpDebugForm.body = this.httpDebugForm.body + '&' + key + '=' + encodeURI(JSON.stringify(tmpBody[key]).replaceAll('"', ''))
      //     } else {
      //       this.httpDebugForm.body = key + '=' + encodeURI(JSON.stringify(tmpBody[key]).replaceAll('"', ''))
      //     }
      //   }
      // } else {
      //   this.httpDebugForm.body = JSON.stringify(returnData.requestBody, null, 4)
      // }
      this.httpDebugForm.body = JSON.stringify(returnData.requestBody, null, 4)
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
      this.expandTable = row.branchs
      this.tmpExpanList = this.expandTable
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
    showData(val) {
      val = val + ''
      if (val.indexOf(this.searchexpandTxt) !== -1 && this.searchexpandTxt !== '') {
        return val.replace(this.searchexpandTxt, '<font color="#DF194C">' + this.searchexpandTxt + '</font>')
      } else {
        return val
      }
    },
    showData2(val) {
      val = val + ''
      if (val.indexOf(this.searchTxt) !== -1 && this.searchTxt !== '') {
        return val.replace(this.searchTxt, '<font color="#DF194C">' + this.searchTxt + '</font>')
      } else {
        return val
      }
    }

  }
}
