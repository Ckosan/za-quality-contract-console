import { mapGetters } from 'vuex'
import HotTable from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import { isSuccessCode } from '@/utils/tools'
import { api_url } from '../../../../settings'
import {
  API_TO_JSON,
  OSS_DATA_CONSTRUCT, OSS_DATA_CONSTRUCT_NEWVERSION, OSS_DATA_CONSTRUCT_ROLLBAKC,
  OSS_INTERFACE_FOR_FILE,
  OSS_INTERFACE_INFO,
  SERVER_DETAIL
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
      labelPosition: 'left',
      headers: { 'Authorization': localStorage.getItem('ticket') },
      apiPostUrl: 'http://127.0.0.1:8080/resourcesmanager/ossinterfaceinfoForFile/',
      formData: { 'a': 1, 'b': 2 },
      fileList: [],
      filePath: '',
      versionRollbackDialog: false,
      versionlog_list: [],
      formFile: new FormData(),
      fileToUpload: new FormData(),
      el: '#app',
      file: '',
      filename: '',
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
          label: 'Csv',
          value: 'Csv'
        },
        {
          label: 'Excel',
          value: 'Excel'
        },
        {
          label: 'Text',
          value: 'Text'
        },
        {
          label: 'Other',
          value: 'Other'
        },
        {
          label: 'Json',
          value: 'Json'
        }
      ],
      bodyTypeFlag: 'Json',
      ossTextBody: '',
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
        obj_type: ''
      },
      ossInfo: {},
      ossSereverForm: {
        server_id: '',
        obj_code: '',
        obj_path: '',
        obj_name: '',
        obj_type: '',
        modifier: '',
        description: '',
        other: '',
        text: '',
        id: '',
        version: 'v1.0.0'
      },
      httpRequstBody: {},
      test: 'test-hot',
      hotSettings: hotSettings
    }
  },
  create() {
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  mounted() {
    this.getPageInfo()
    var dropbox = document.querySelector('div#app')
    dropbox.addEventListener('dragenter', this.onDrag, false)
    dropbox.addEventListener('dragover', this.onDrag, false)
    dropbox.addEventListener('drop', this.onDrop, false)
  },
  methods: {
    handleSizeChange: function(size) {
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    setTableReadOnly() {
      this.hotSettings.readOnly = true
    },
    setTableWritable() {
      this.hotSettings.readOnly = false
    },
    // 获取请求体数据
    getRequestSourceData() {
      try {
        return this.$refs.bodyTextHot.settings.data
      } catch (e) {
        return [
          []
        ]
      }
    },
    // 页面数据入口
    getPageInfo() {
      this.optType = this.$route.query.type
      if (this.$route.query.type === 'watchDetail') {
        this.setTableReadOnly()
        this.getInterfaceInfo()
      } else if (this.$route.query.type === 'addConstructData') {
        this.submitFlag = true
        this.setTableWritable()
        this.getServerInfo()
      } else {
        console.log('暂时无数据')
      }
    },
    // 新增数据结构时获取服务信息
    async getServerInfo() {
      const returnData = await httpRequest('GET', SERVER_DETAIL + '?id=' + this.$route.params.id)
      this.serverInfo = returnData[0]
      this.serverInfo.project_name = returnData[0].project_name + '(' + returnData[0].project_code + ')'
      this.serverInfo.application_name = returnData[0].application_name + '(' + returnData[0].application_code + ')'
      this.serverInfo.server_name = returnData[0].server_name
      this.serverInfo.server_code = returnData[0].server_code
      this.serverInfo.server_type = returnData[0].server_type
      this.serverInfo.project_code = returnData[0].project_code
      this.serverInfo.application_code = returnData[0].application_code
      this.ossSereverForm.server = returnData[0].id
    },
    // 获取数据结构详情时调用
    async getInterfaceInfo() {
      const returnData = await httpRequest('GET', OSS_INTERFACE_INFO + '?id=' + this.$route.params.id)
      if (returnData) {
        this.ossInfo = returnData[0]
        this.serverInfo.project_name = this.ossInfo.project_name + '(' + this.ossInfo.project_code + ')'
        this.serverInfo.application_name = this.ossInfo.application_name + '(' + this.ossInfo.application_code + ')'
        this.serverInfo.server_name = this.ossInfo.server_name
        this.serverInfo.server_code = this.ossInfo.server_code
        this.serverInfo.server_type = this.ossInfo.server_type
        this.serverInfo.version = this.ossInfo.version
        this.ossSereverForm.server = this.ossInfo.server_id
        this.ossSereverForm.obj_path = this.ossInfo.obj_path
        this.ossSereverForm.obj_code = this.ossInfo.obj_code
        this.ossSereverForm.obj_name = this.ossInfo.obj_name
        this.ossSereverForm.version = this.ossInfo.version
        this.versionlog_list = this.ossInfo.versionlog_list
        this.bodyTypeFlag = this.ossInfo.obj_type
        this.ossSereverForm.id = this.ossInfo.id
        this.getConstructDetailData(this.$route.params.id, this.ossInfo.version, this.ossInfo.obj_type)
      }
    },
    refresh() {
    },
    postFile() {
      console.log('上传文件')
    },
    initFileForm() {
      const formFile = new FormData()
      formFile.append('file', this.file)
      formFile.append('id', this.ossSereverForm.id)
      formFile.append('server_id', this.ossSereverForm.server)
      formFile.append('obj_code', this.ossSereverForm.obj_code)
      formFile.append('obj_path', this.ossSereverForm.obj_path)
      formFile.append('obj_name', this.ossSereverForm.obj_name)
      formFile.append('obj_type', this.bodyTypeFlag)
      formFile.append('version', this.ossSereverForm.version)
      formFile.append('modifier', sessionStorage.getItem('currentUserName'))
      formFile.append('description', this.ossSereverForm.description)
      return formFile
    },
    // 保存数据结构
    async saveDataInfo() {
      // 获取文件
      if (this.bodyTypeFlag === 'Other') {
        const returnData = await httpRequest('POST', OSS_INTERFACE_FOR_FILE, this.initFileForm())
        if (this.$route.query.type != 'addConstructData') {
          this.ossSereverForm.id = returnData.id
          this.getConstructDetailData(returnData.id, returnData.version, returnData.obj_type)
        } else {
          this.$router.push({
            path: '/configpage/ossdataconstructdetail/' + returnData.data.id,
            query: { type: 'watchDetail' }
          })
        }
      } else {
        const handleData = {
          id: this.ossSereverForm.id,
          server_id: this.ossSereverForm.server,
          obj_code: this.ossSereverForm.obj_code.trim(),
          obj_path: this.ossSereverForm.obj_path.trim(),
          obj_name: this.ossSereverForm.obj_name.trim(),
          obj_type: this.bodyTypeFlag,
          version: this.ossSereverForm.version,
          modifier: sessionStorage.getItem('currentUserName'),
          description: this.ossSereverForm.description,
          construct_data: this.createHttpConstructData(),
          text: this.ossSereverForm.text
        }
        const returnData = await httpRequest('POST', OSS_INTERFACE_INFO, handleData)
        if (this.$route.query.type != 'addConstructData') {
          this.ossSereverForm.id = returnData.id
          this.getConstructDetailData(returnData.id, returnData.version, returnData.obj_type)
        } else {
          this.$router.push({ path: '/ossdataconstructdetail/' + returnData.data.id, query: { type: 'watchDetail' }})
        }
      }
    },
    async getConstructDetailData(interfaceId, version, objTyppe) {
      this.fileList = []
      const returnData = await httpRequest('GET', OSS_DATA_CONSTRUCT + '?interface_id=' + interfaceId + '&version=' + version + '&obj_type=' + objTyppe)
      if (objTyppe === 'Text') {
        this.ossTextBody = returnData.data_default_value
      } else if (objTyppe === 'Other') {
        if (returnData.data_default_value === null) {
          this.fileList = []
        } else {
          this.fileList.push({
            name: returnData.data_default_value,
            status: 'finished',
            url: api_url + '/file/download?fileName=' + returnData.data_default_value
          })
        }
      } else {
        this.$refs.bodyTextHot.settings.data = bodyRender(returnData.request)
      }
    },
    // 搜索
    searchData() {
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
        this.$refs.bodyTextHot.settings.data = await httpRequest('POST', API_TO_JSON, handleAddClick)
        this.jsonImportVisible = false
      }
    },
    // 导出接口文档
    exportDataToExcel() {
    },
    // 构造HTTP报文数据
    createHttpConstructData() {
      return deleteNullData(this.getRequestSourceData())
    },
    // 取出null的行
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
      this.setTableReadOnly()
    },
    handleVersionDetail(index, row) {
      this.getConstructDetailData(row.resource_id, row.version, null)
      this.ossSereverForm.version = row.version
      this.showHistoryVerionDialog = false
      this.submitFlag = false
      this.setTableReadOnly()
    },
    handleRollBack(index, row) {
      this.versionRollbackDialog = true
      this.ossSereverForm.versionId = row.id
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
        interface_id: this.ossInfo.id,
        new_version: this.ossSereverForm.version,
        old_version: this.ossInfo.version,
        tmp_version: this.tmpVersion,
        version_id: this.ossSereverForm.versionId,
        description: this.ossSereverForm.description,
        modifier: sessionStorage.getItem('currentUserName')
      }
      if (this.ossSereverForm.version === this.ossInfo.version) {
        this.$confirm('此操作将覆盖原有最新版本, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await httpRequest('PUT', OSS_DATA_CONSTRUCT_ROLLBAKC, handleAddClick)
          this.versionRollbackDialog = false
          this.showHistoryVerionDialog = false
          this.getInterfaceInfo()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        await httpRequest('PUT', OSS_DATA_CONSTRUCT_NEWVERSION, handleAddClick)
        this.showHistoryVerionDialog = false
        this.versionRollbackDialog = false
        this.getInterfaceInfo()
      }
    },
    uploadSuccess(returnData, file, fileList) {
      if (isSuccessCode(returnData)) {
        this.$message.success(returnData.message)
        returnData = returnData.data
        this.ossSereverForm.id = returnData.id
      } else {
        this.$message.error(returnData.message)
      }
    },
    // eslint-disable-next-line handle-callback-err
    uploadError(err, file, fileList) {
      console.log('进入失败方法')
    },
    changeFile(file) {
      this.file = file.raw
    },
    handleRemove(file, fileList) {
      this.file = ''
      const newList = []
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uid != file.uid) {
          newList.push(this.fileList[i])
        }
      }
      this.fileList = newList
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.ossSereverForm.server })
    }
  }
}
