import { mapGetters } from 'vuex'
import HotTable from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import {
  HTTP_DATA_CONSTRUCT_MERGE,
  HTTP_DATA_CONSTRUCT_PRE_MERGE,
  HTTP_INTERFACE_INFO
} from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'
import {
  deleteHttpNullData,
  deleteNullData,
  headerMergeRender
} from '../../../../utils/dataconstrcut'
import {
  headerSettings,
  hotSettings,
  httpResponseSettings,
  rspheaderSettings
} from '../../../../utils/dataMergeSetting'
import { console } from 'vuedraggable/src/util/helper'
import { branchMergeRenderer } from '../../../../utils/tools'

export default {
  name: 'SampleApp',
  components: {
    HotTable
  },
  data: function() {
    return {
      versionDialog: false,
      submitForm: {
        new_version: '',
        sub_version: 0,
        description: ''
      },
      branch: '',
      activeName: 'first',
      new_version: '',
      tmpVersion: '',
      serverId: '',
      optType: '',
      submitFlag: false,
      addLoading: false,
      pagesize: 10,
      currentPage: 1, // 初始页
      loading: false,
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
      rules: {},
      httpRequstHeaders: {},
      httpRequstBody: {},
      httpResponse: {},
      options: {},
      test: 'test-hot',
      headerSettings: headerSettings,
      rspheaderSettings: rspheaderSettings,
      hotSettings: hotSettings,
      testRespone: 'testRespone',
      httpResponseSettings: httpResponseSettings,
      headerSettingsAdd: [],
      headerSettingsDelete: [],
      headerSettingsUpdate: [],
      rspheaderSettingsAdd: [],
      rspheaderSettingsDelete: [],
      rspheaderSettingsUpdate: [],
      httpResponseSettingsAdd: [],
      httpResponseSettingsDelete: [],
      httpResponseSettingsUpdate: []
    }
  },
  create() {
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {},
  mounted() {
    this.submitFlag = true
    this.setTableReadOnly()
    this.getHttpInterfaceInfo()
  },
  methods: {
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
    changeVerison() {
      this.submitForm.sub_version = 0
      for (var i = 0; i < this.versionMap.length; i++) {
        if (this.versionMap[i].key === this.submitForm.new_version) {
          this.submitForm.sub_version = Number(this.versionMap[i].value) + 1
          break
        }
      }
    },
    // 获取HTTP数据结构详情时调用
    async getHttpInterfaceInfo() {
      this.serverInfo.project_name = localStorage.getItem('SERVER_PROJECT')
      this.serverInfo.application_name = localStorage.getItem('SERVER_APPLICATION')
      this.serverInfo.server_name = localStorage.getItem('SERVER_INFO')
      this.serverInfo.server_type = localStorage.getItem('SERVER_TYPE')
      this.serverId = this.$route.query.serverId
      this.branch = this.$route.params.branch
      const returnData = await httpRequest('GET', HTTP_INTERFACE_INFO + '?id=' +
        this.$route.query.interfaceId)
      this.httpInfo = returnData[0]
      this.versionlog_list = this.httpInfo.versionlog_list
      this.getAConstructDetailData(this.httpInfo.id, this.$route.params.branch, this.httpInfo.version)
      this.initVersionLog()
    },
    async getAConstructDetailData(interfaceId, branch, version) {
      const returnData = await httpRequest('GET', HTTP_DATA_CONSTRUCT_PRE_MERGE +
        '?interface_id=' + interfaceId + '&branch=' + branch + '&version=' + version)
      this.$refs.headersTextHot.settings.data = headerMergeRender(returnData.reqheaders)
      this.$refs.rspheadersTextHot.settings.data = headerMergeRender(returnData.rspheaders)
      this.$refs.bodyTextHot.settings.data = returnData.request
      this.$refs.httpresponseTextHot.settings.data = returnData.response
      const bodyList = this.$refs.bodyTextHot.settings.data
      const responseList = this.$refs.httpresponseTextHot.settings.data
      const headersList = this.$refs.headersTextHot.settings.data
      const rspheaderList = this.$refs.rspheadersTextHot.settings.data
      for (let i = 0; i < bodyList.length; i++) {
        if (bodyList[i][8] === '新增') {
          this.$refs.bodyTextHot.settings.addList.push(i)
        }
        if (bodyList[i][8] === '修改') {
          this.$refs.bodyTextHot.settings.modifyList.push(i)
        }
        if (bodyList[i][8] === '删除') {
          this.$refs.bodyTextHot.settings.deleteList.push(i)
        }
      }
      for (let i = 0; i < responseList.length; i++) {
        if (responseList[i][8] === '新增') {
          this.$refs.httpresponseTextHot.settings.addList.push(i)
        }
        if (responseList[i][8] === '修改') {
          this.$refs.httpresponseTextHot.settings.modifyList.push(i)
        }
        if (responseList[i][8] === '删除') {
          this.$refs.httpresponseTextHot.settings.deleteList.push(i)
        }
      }
      for (let i = 0; i < headersList.length; i++) {
        if (headersList[i][3] === '新增') {
          this.$refs.headersTextHot.settings.addList.push(i)
        }
        if (headersList[i][3] === '修改') {
          this.$refs.headersTextHot.settings.modifyList.push(i)
        }
        if (headersList[i][3] === '删除') {
          this.$refs.headersTextHot.settings.deleteList.push(i)
        }
      }
      for (let i = 0; i < rspheaderList.length; i++) {
        if (rspheaderList[i][3] === '新增') {
          this.$refs.rspheadersTextHot.settings.addList.push(i)
        }
        if (rspheaderList[i][3] === '修改') {
          this.$refs.rspheadersTextHot.settings.modifyList.push(i)
        }
        if (rspheaderList[i][3] === '删除') {
          this.$refs.rspheadersTextHot.settings.deleteList.push(i)
        }
      }
      const headersHot = this.$refs.headersTextHot.hotInstance
      headersHot.updateSettings({
        cells: function(row, col, prop) {
          this.renderer = branchMergeRenderer
        }
      })
      const hot = this.$refs.bodyTextHot.hotInstance
      hot.updateSettings({
        cells: function(row, col, prop) {
          this.renderer = branchMergeRenderer
        }
      })
      const rspheadHot = this.$refs.rspheadersTextHot.hotInstance
      rspheadHot.updateSettings({
        cells: function(row, col, prop) {
          this.renderer = branchMergeRenderer
        }
      })
      const respHot = this.$refs.httpresponseTextHot.hotInstance
      respHot.updateSettings({
        cells: function(row, col, prop) {
          this.renderer = branchMergeRenderer
        }
      })
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
    editVersionSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.versionDialog = false
          this.saveBranchData()
        }
      })
    },
    mergeBranch() {
      this.versionDialog = true
      const vList = this.httpInfo.version.split('.')
      const subVerison = vList.pop()
      const key = vList.join('.')
      this.submitForm.new_version = key
      this.submitForm.sub_version = Number(subVerison) + 1
    },
    async saveBranchData() {
      const handleAddClick = {
        interface_id: this.httpInfo.id,
        version: this.submitForm.new_version + '.' + this.submitForm.sub_version,
        modifier: sessionStorage.getItem('currentUserName'),
        description: this.submitForm.description,
        reqheaders: deleteNullData(this.getHeadersSourceData()),
        rspheaders: deleteNullData(this.getRspHeadersSourceData()),
        request: deleteHttpNullData(this.getRequestSourceData(), 'request'),
        response: deleteHttpNullData(this.getHttpResponseSourceData(), 'response')
      }
      await httpRequest('POST', HTTP_DATA_CONSTRUCT_MERGE, handleAddClick)
      this.submitFlag = false
      this.versionDialog = false
      this.submitFlag = false
      this.$router.push({
        path: '/configpage/apidataversiondetail/' + this.httpInfo.id,
        query: { type: 'watchDetail', serverId: this.$route.params.id, version: this.submitForm.new_version + '.' + this.submitForm.sub_version }
      })
    },
    changeSubmit() {
      console.log('ceshi')
      this.submitFlag = true
      this.setTableWritable()
    },
    // eslint-disable-next-line no-dupe-keys
    cancelSubmit() {
      this.versionDialog = false
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.params.id })
    },
    refresh() {
    }
  }
}
