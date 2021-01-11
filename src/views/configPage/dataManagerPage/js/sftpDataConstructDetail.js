import { mapGetters } from 'vuex'
import HotTable from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import { isSuccessCode } from '@/utils/tools'
import { api_url } from '../../../../settings'
import {
  API_TO_JSON,
  SERVER_DETAIL,
  SFTP_DATA_CONSTRUCT, SFTP_DATA_CONSTRUCT_NEWVERSION, SFTP_DATA_CONSTRUCT_ROLLBAKC,
  SFTP_INTERFACE_FOR_FILE,
  SFTP_INTERFACE_INFO
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
      apiUrl: api_url,
      file: '',
      fileList: [],
      versionlog_list: [],
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
      sftpTextBody: '',
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
        file_type: ''
      },
      ossInfo: {},
      sftpSereverForm: {
        server_id: '',
        interface_name: '',
        interfaceC_code: '',
        file_path: '',
        file_name: '',
        file_type: '',
        version: '',
        modifier: '',
        description: '',
        other: '',
        text: '',
        id: ''
      },
      httpRequstBody: {},
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
      return this.$refs.bodyTextHot.settings.data
    },
    // 页面数据入口
    getPageInfo() {
      this.optType = this.$route.query.type
      if (this.$route.query.type === 'watchDetail') {
        this.getInterfaceInfo()
      } else if (this.$route.query.type === 'addConstructData') {
        this.submitFlag = true
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
      this.sftpSereverForm.server = returnData[0].id
    },
    // 获取数据结构详情时调用
    async getInterfaceInfo() {
      const returnData = await httpRequest('GET', SFTP_INTERFACE_INFO + '?id=' + this.$route.params.id)
      this.ossInfo = returnData[0]
      this.serverInfo.project_name = this.ossInfo.project_name + '(' + this.ossInfo.project_code + ')'
      this.serverInfo.application_name = this.ossInfo.application_name + '(' + this.ossInfo.application_code + ')'
      this.serverInfo.server_name = this.ossInfo.server_name
      this.serverInfo.server_code = this.ossInfo.server_code
      this.serverInfo.server_type = this.ossInfo.server_type
      this.serverInfo.version = this.ossInfo.version
      this.sftpSereverForm.server = this.ossInfo.server_id
      this.sftpSereverForm.version = this.ossInfo.version
      this.sftpSereverForm.interface_name = this.ossInfo.interface_name
      this.sftpSereverForm.file_path = this.ossInfo.file_path
      this.sftpSereverForm.file_name = this.ossInfo.file_name
      this.bodyTypeFlag = this.ossInfo.file_type
      this.sftpSereverForm.interface_code = this.ossInfo.interface_code
      this.sftpSereverForm.tag = this.ossInfo.tag
      this.sftpSereverForm.id = this.ossInfo.id
      this.versionlog_list = this.ossInfo.versionlog_list
      this.getConstructDetailData(this.$route.params.id, this.ossInfo.version, this.ossInfo.file_type)
    },
    refresh() {
    },
    initFileForm() {
      const formFile = new FormData()
      formFile.append('file', this.file)
      formFile.append('id', this.sftpSereverForm.id)
      formFile.append('server_id', this.sftpSereverForm.server)
      formFile.append('interface_name', this.sftpSereverForm.interface_name)
      formFile.append('interface_code', this.sftpSereverForm.interface_code)
      formFile.append('file_name', this.sftpSereverForm.file_name)
      formFile.append('file_path', this.sftpSereverForm.file_path)
      formFile.append('file_type', this.bodyTypeFlag)
      formFile.append('version', this.sftpSereverForm.version)
      formFile.append('modifier', sessionStorage.getItem('currentUserName'))
      formFile.append('description', this.sftpSereverForm.description)
      return formFile
    },
    // 保存数据结构
    async saveDataInfo() {
      if (this.bodyTypeFlag === 'Other') {
        const returnData = await httpRequest('POST', SFTP_INTERFACE_FOR_FILE, this.initFileForm())
        if (this.$route.query.type != 'addConstructData') {
          this.sftpSereverForm.id = returnData.id
          this.getConstructDetailData(returnData.id, returnData.version, returnData.file_type)
        } else {
          this.$router.push({
            path: '/configpage/sftpdataconstructdetail/' + returnData.data.id,
            query: { type: 'watchDetail' }
          })
        }
      } else {
        const handleAddClick = {
          id: this.sftpSereverForm.id,
          server_id: this.sftpSereverForm.server,
          interface_name: this.sftpSereverForm.file_name.trim(),
          interface_code: this.sftpSereverForm.file_name.trim(),
          file_name: this.sftpSereverForm.file_name.trim(),
          file_path: this.sftpSereverForm.file_path.trim(),
          file_type: this.bodyTypeFlag,
          version: this.sftpSereverForm.version,
          modifier: sessionStorage.getItem('currentUserName'),
          description: this.sftpSereverForm.description,
          construct_data: this.createHttpConstructData(),
          text: this.sftpTextBody
        }
        const returnData = await httpRequest('POST', SFTP_INTERFACE_INFO, handleAddClick)
        if (this.$route.query.type === 'addConstructData') {
          this.$router.push({
            path: '/sftpdataconstructdetail/' + returnData.data.id,
            query: { type: 'watchDetail' }
          })
        } else {
          this.sftpSereverForm.id = returnData.id
          this.getConstructDetailData(returnData.id)
        }
      }
    },
    async getConstructDetailData(interfaceId, version, fileTpye) {
      const returnData = await httpRequest('GET', SFTP_DATA_CONSTRUCT + '?interface_id=' +
        interfaceId + '&version=' + version + '&file_type=' + fileTpye)
      if (fileTpye === 'Text') {
        this.sftpTextBody = returnData.data_default_value
      } else if (fileTpye === 'Other') {
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
      console.log(this.getRequestSourceData())
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
        this.loading = true
        this.$refs.bodyTextHot.settings.data = await httpRequest('POST', API_TO_JSON, handleAddClick)
        this.jsonImportVisible = false
        this.loading = false
        this.submitFlag = true
        this.setTableWritable()
      }
    },
    // 导出接口文档
    exportDataToExcel() {
    },
    // 构造HTTP报文数据
    createHttpConstructData() {
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
      this.getConstructDetailData(row.resource_id, row.version, null)
      this.sftpSereverForm.version = row.version
      this.showHistoryVerionDialog = false
      this.submitFlag = false
      this.setTableReadOnly()
    },
    handleRollBack(index, row) {
      this.versionRollbackDialog = true
      this.sftpSereverForm.versionId = row.id
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
        new_version: this.sftpSereverForm.version,
        old_version: this.ossInfo.version,
        tmp_version: this.tmpVersion,
        version_id: this.sftpSereverForm.versionId,
        description: this.sftpSereverForm.description,
        modifier: sessionStorage.getItem('currentUserName')
      }
      if (this.sftpSereverForm.version === this.ossInfo.version) {
        this.$confirm('此操作将覆盖原有最新版本, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await httpRequest('PUT', SFTP_DATA_CONSTRUCT_ROLLBAKC, handleAddClick)
          this.versionRollbackDialog = false
          this.showHistoryVerionDialog = false
          this.getInterfaceInfo()
          this.submitFlag = false
          this.setTableReadOnly()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        await httpRequest('PUT', SFTP_DATA_CONSTRUCT_NEWVERSION, handleAddClick)
        this.showHistoryVerionDialog = false
        this.versionRollbackDialog = false
        this.getInterfaceInfo()
      }
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
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.sftpSereverForm.server })
    }
  }
}
