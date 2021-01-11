import { mapGetters } from 'vuex'
import {
  DATA_SET_CONSTRUCT,
  DATA_SET_REALATION_DETAIL, HTTP_DEBUG, HTTP_SERVER_INFO, LSIT_TO_JSON, SCRIPT_GET
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { convertTime, isSuccessCode } from '../../../../utils/tools'
import { isHost } from '../../../../utils/validata_rules'

export default {
  data() {
    return {
      apiInfoTitle: '',
      selecttable: true,
      activeName: 'first',
      serverInfo: {},
      loading: false,
      initReqHFlag: false,
      initReqFlag: false,
      initRespHFlag: false,
      initRespFlag: false,
      list: [], // 数据存储
      editForm: {
        modifier: sessionStorage.getItem('currentUserName'),
        relationId: '',
        req_headers: [],
        resp_headers: [],
        request: [],
        response: []
      },
      tempForm: {
        req_headers: [],
        resp_headers: [],
        request: [],
        response: []
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1, // 初始页
      funcHeplerDialog: false,
      funcDict: [],
      funcModelOptions: [],
      funcForm: {
        funcModel: '',
        script_describe: '',
        script_sample: ''
      },
      listToJSON: '',
      jsonPraseVisible: false,
      debugButtonloading: false,
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
      envInfoOptions: [],
      methodOptions: [{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }, {
        value: 'PUT',
        label: 'PUT'
      }, { value: 'DELETE', label: 'DELETE' }],
      rspdebugloading: false,
      debugloading: false,
      debugDialog: false,
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
      }
    }
  },
  mounted() {
    this.apiInfoTitle = localStorage.getItem('API_INFO')
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
    changeReqHSelect() {
      this.initReqHFlag = false
    },
    changeReqSelect() {
      this.initReqFlag = false
    },
    changeRespHSelect() {
      this.initRespHFlag = false
    },
    changeRespSelect() {
      this.initRespFlag = false
    },
    reqheadersChange(selection) {
      if (!this.initReqHFlag) {
        this.updateSelectData(this.editForm.req_headers, selection)
      }
    },
    requestChange(selection) {
      if (!this.initReqFlag) {
        this.updateSelectData(this.editForm.request, selection)
      }
    },
    respHeadersChange(selection) {
      if (!this.initRespHFlag) {
        this.updateSelectData(this.editForm.resp_headers, selection)
      }
    },
    responseChange(selection) {
      if (!this.initRespFlag) {
        this.updateSelectData(this.editForm.response, selection)
      }
    },
    updateSelectData(formData, selection) {
      for (let i = 0; i < formData.length; i++) {
        formData[i].is_select = 1
        for (let j = 0; j < selection.length; j++) {
          if (formData[i].id === selection[j].id) {
            formData[i].is_select = 2
            continue
          }
        }
      }
      return formData
    },
    getPageInfo() {
      this.serverInfo.project_name = localStorage.getItem('SERVER_PROJECT')
      this.serverInfo.application_name = localStorage.getItem('SERVER_APPLICATION')
      this.serverInfo.server_name = localStorage.getItem('SERVER_INFO')
      this.serverInfo.server_type = localStorage.getItem('SERVER_TYPE')
      this.vueTable()
    },
    // 获取列表
    async vueTable() {
      this.initReqHFlag = true
      this.initReqFlag = true
      this.initRespHFlag = true
      this.initRespFlag = true
      this.list = await httpRequest('GET', DATA_SET_REALATION_DETAIL + '?interfaceId=' +
        this.$route.query.interfaceId + '&setId=' + this.$route.params.id)
      this.editForm.req_headers = this.list.req_headers
      this.editForm.resp_headers = this.list.resp_headers
      this.editForm.request = this.list.request
      this.editForm.response = this.list.response
      this.$nextTick(function() {
        this.editForm.request.forEach(row => {
          if (row.is_select === 2) {
            this.$refs.requestTable.toggleRowSelection(row, true)
          }
        })
      })
      this.$nextTick(function() {
        this.editForm.response.forEach(row => {
          if (row.is_select === 2) {
            this.$refs.responsTable.toggleRowSelection(row, true)
          }
        })
      })
      this.$nextTick(function() {
        this.editForm.resp_headers.forEach(row => {
          if (row.is_select === 2) {
            this.$refs.respHeaderTable.toggleRowSelection(row, true)
          }
        })
      })
      this.$nextTick(function() {
        this.editForm.req_headers.forEach(row => {
          if (row.is_select === 2) {
            this.$refs.reqHeaderTable.toggleRowSelection(row, true)
          }
        })
      })
    },
    // 编辑
    goback() {
      this.$router.push({ path: '/dataconfigpage/apidatasetlist/' + this.$route.query.setId,
        query: { serverId: this.$route.query.serverId }})
    },
    convertTimeFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    },
    async saveDataSetValue() {
      this.editForm.relationId = this.$route.params.id
      await httpRequestWithoutLoading('PUT', DATA_SET_CONSTRUCT, this.editForm)
      this.$message.success('修改成功')
      this.vueTable()
    },
    searchFunc() {
      this.getFuncList()
      this.funcHeplerDialog = true
    },
    async getFuncList() {
      const funcList = await httpRequestWithoutLoading('GET', SCRIPT_GET)
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
    //  ["requestStr", "requestTime", "String", null, "是", "请求时间", "$now(yyyy-MM-dd HH:mm:ss)", ""]
    convertToList(data) {
      console.log(data)
      if (data === null || data === undefined) return []
      var newList = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].is_select === 2) {
          var tmpList = []
          tmpList.push(data[i].parent_key)
          tmpList.push(data[i].data_key)
          tmpList.push(data[i].data_type)
          tmpList.push(data[i].data_length)
          tmpList.push(data[i].is_null)
          tmpList.push(data[i].data_describe)
          tmpList.push(data[i].data_value)
          tmpList.push('')
          newList.push(tmpList)
        }
      }
      return newList
    },
    viewBody() {
      this.getJSONBody(this.convertToList(this.editForm.request))
    },
    viewResponseBody() {
      this.getJSONBody(this.convertToList(this.editForm.response))
    },
    async getJSONBody(data) {
      const handleAddClick = {
        datalist: data
      }
      const returnData = await httpRequestWithoutLoading('POST', LSIT_TO_JSON, handleAddClick)
      if (JSON.stringify(returnData) == '{}') {
        this.listToJSON = '{}'
      } else {
        this.listToJSON = returnData
      }
      this.jsonPraseVisible = true
    },
    async handleDebugging() {
      this.debugButtonloading = true
      const data = await httpRequest('GET', HTTP_SERVER_INFO + '?interfaceId=' + this.$route.query.interfaceId)
      const interfaceInfo = data.interfaceInfo
      this.httpDebugForm.method_type = interfaceInfo.method
      this.httpDebugForm.method = interfaceInfo.method
      this.httpDebugForm.path = interfaceInfo.path.substring(1, interfaceInfo.path.length)
      this.httpDebugForm.api_path = interfaceInfo.path
      this.httpDebugForm.body = ''
      this.httpDebugForm.response = ''
      this.debugDialog = true
      this.envInfoOptions = []
      data.envList.forEach((value) => {
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
    async getDebugRequestheaders() {
      this.httpDebugForm.reqheaders = ''
      const reqData = {
        datalist: this.convertToList(this.editForm.reqheaders)
      }
      const data = await httpRequestWithoutLoading('POST', LSIT_TO_JSON, reqData)
      this.httpDebugForm.reqheaders = JSON.stringify(data)
    },
    async getDebugBody() {
      this.httpDebugForm.response = ''
      this.httpDebugForm.respHeaders = ''
      this.httpDebugForm.check_result = ''
      const reqData = {
        datalist: this.convertToList(this.editForm.request)
      }
      const data = await httpRequestWithoutLoading('POST', LSIT_TO_JSON, reqData)
      this.httpDebugForm.body = data
      this.getDebugRequestheaders()
      this.debugloading = false
    },
    setDefaultEnv() {
      if (this.envInfoOptions.length != 0) {
        this.httpDebugForm.env_type = this.envInfoOptions[0].value
        this.httpDebugForm.host = this.envInfoOptions[0].host
      }
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
            server_code: 'S000' + this.$route.query.serverId,
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
    }
  }
}
