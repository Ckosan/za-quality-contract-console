import { mapGetters } from 'vuex'
import {
  API_EXT_INFO, DATA_SET_BY_ID,
  DATA_SET_REALATION_API, HTTP_INTERFACE_INFO_BY_ID,
  INTERFACE_DATA_SET_API,
  MOCK_CONFIG_UPDATE_ALL_STATUS, SERVER_INTERFACE_API
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isNum } from '../../../../utils/validata_rules'
import { convertTime } from '../../../../utils/tools'

export default {
  data() {
    return {
      editContractFormVisible: false,
      editContractForm:
    { // 编辑需要的字段
      id: '',
      name: '',
      setId: '',
      interfaceId: '',
      modifier: sessionStorage.getItem('currentUserName'),
      description: '',
      row: '',
      sourceType: 'default',
      sourceValue: ''
    },
      contractVisible: false,
      addContractForm:
        {
          row: '',
          name: '',
          setId: '',
          sourceType: 'default',
          interfaceId: '',
          modifier: sessionStorage.getItem('currentUserName'),
          description: '',
          sourceValue: ''
        },
      project_info: '',
      application_info: '',
      server_Info: '',
      wareHouseTitle: '',
      templatesOptions: [],
      projectOptions: [],
      appOptions: [],
      serverOptions: [],
      branchOptions: [],
      versionDebugOptions: [],
      apiOptions: [],
      sourceTypeOptions: [{ value: 'default', label: '默认最新版本' }, { value: 'version', label: '版本' }, { value: 'branch', label: '分支' }],
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
        priority:
          [
            { required: true, message: '请输入优先级', trigger: 'blur' },
            { validator: isNum, trigger: 'blur' }
          ],
        sourceType:
          [
            { required: true, message: '请选择数据来源', trigger: 'blur' }
          ],
        sourceValue:
          [
            { required: true, message: '请选择editContractForm', trigger: 'blur' }
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
      tmpExpanList: []
    }
  },
  mounted() {
    this.initTitle()
    this.vueTable()
    this.getHttpTemplates()
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
        return val.replace(this.searchexpandTxt, '<font color="#DF111A">' + this.searchexpandTxt + '</font>')
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
    async initTitle() {
      this.wareHouseTitle = localStorage.getItem('SET_INFO')
      const data = await httpRequest('GET', DATA_SET_BY_ID + '?id=' + this.$route.params.id)
      this.project_info = data.project_info
      this.application_info = data.application_info
      this.server_Info = data.server_info
      this.wareHouseTitle = data.name
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', INTERFACE_DATA_SET_API + '?setId=' + this.$route.params.id)
      this.tmpApiList = this.list
      this.allList = this.list
    },
    async initExtOptions(row) {
      const returnData = await httpRequestWithoutLoading('GET', API_EXT_INFO + '?interfaceId=' + row.interface_id)
      this.branchOptions = returnData.branchList
      if (this.branchOptions.length === 0) {
        this.sourceTypeOptions = [{ value: 'default', label: '默认最新版本' }, { value: 'version', label: '版本' }]
      }
      this.versionDebugOptions = returnData.versionList
    },
    getRowKeys(row) {
      return row.id
    },
    getFacilityList(row, expandedRows) {
      this.expandTable = []
      if (expandedRows.length == 0) {
        this.expands = []
      }
      if (expandedRows.length !== 0) {
        this.expands = []
        this.expandTable = []
        this.getReceiver(row)
        this.expands.push(row.id)
      }
    },
    async getReceiver(row) {
      const data = await httpRequestWithoutLoading('GET', DATA_SET_REALATION_API + '?interfaceId=' +
        row.interface_id + '&setId=' + row.set_id)
      this.expandTable = data
      this.tmpExpanList = data
    },
    viewApiDataSets(row) {
      this.addContractForm.interfaceId = row.interface_id
      this.addContractForm.setId = row.set_id
      this.addContractForm.row = row
      this.initExtOptions(row)
      this.contractVisible = true
    },
    deleteInterfaceProxy(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', INTERFACE_DATA_SET_API + '/?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
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
      this.mockVisible = true
    },
    addMockSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            set_id: this.$route.params.id,
            interface_id: this.mockAddForm.interfaceId,
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('POST', INTERFACE_DATA_SET_API, HandleEdit)
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
        await httpRequestWithoutLoading('DELETE', DATA_SET_REALATION_API + '?Id=' + row.id +
          '&modifier=' + sessionStorage.getItem('currentUserName'))
        this.getReceiver(row)
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
      this.$router.push({ path: '/dataconfigpage/datawarehouselist/' })
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
    handleEditContract() {},
    handleDataSetEdit(row) {
      this.$router.push({
        path: '/configpage/apidatasetsdetail/' + row.id,
        query: { interfaceId: row.interface_id, setId: row.set_id, serverId: this.$route.query.serverId }
      })
    },
    async goToDocDetial(row) {
      if (row.source_type === 'branch') {
        this.$router.push({
          path: '/configpage/apidatabranchdetail/' + row.interface_id + '/' + row.source_value,
          query: { serverId: this.$route.query.serverId }
        })
      }
      if (row.source_type === 'version') {
        this.$router.push({
          path: '/configpage/apidataversiondetail/' + row.interface_id,
          query: { type: 'watchDetail', serverId: this.$route.query.serverId, version: row.source_value }
        })
      }
      if (row.source_type === 'default') {
        const data = await httpRequestWithoutLoading('GET', HTTP_INTERFACE_INFO_BY_ID + '?interfaceId=' + row.interface_id)
        this.$router.push({
          path: '/configpage/apidataversiondetail/' + row.interface_id,
          query: { type: 'watchDetail', serverId: this.$route.query.serverId, version: data.version }
        })
      }
    },
    convertSourceData(data) {
      if (data === 'version') return '版本'
      if (data === 'branch') return '分支'
      if (data === 'default') return '默认最新版本'
      return ''
    },
    addContractSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            name: this.addContractForm.name,
            set_id: this.addContractForm.setId,
            interface_id: this.addContractForm.interfaceId,
            modifier: this.addContractForm.modifier,
            description: this.addContractForm.description,
            source_type: this.addContractForm.sourceType,
            source_value: this.addContractForm.sourceValue
          }
          await httpRequestWithoutLoading('POST', DATA_SET_REALATION_API, HandleEdit)
          this.$message.success('添加成功')
          this.vueTable()
          this.getReceiver(this.addContractForm.row)
          this.contractVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    handleContractEdit(index, row) {
      this.editContractForm = Object.assign({}, row)
      this.editContractForm.interfaceId = row.interface_id
      this.editContractForm.setId = row.set_id
      this.editContractForm.row = row
      this.editContractForm.sourceType = row.source_type
      this.editContractForm.sourceValue = row.source_value
      this.initExtOptions(row)
      this.editContractFormVisible = true
    },
    editContractSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editContractForm.id,
            name: this.editContractForm.name,
            set_id: this.editContractForm.setId,
            interface_id: this.editContractForm.interfaceId,
            modifier: this.editContractForm.modifier,
            description: this.editContractForm.description,
            source_type: this.editContractForm.sourceType,
            source_value: this.editContractForm.sourceValue
          }
          await httpRequestWithoutLoading('PUT', DATA_SET_REALATION_API, HandleEdit)
          this.$message.success('修改成功')
          this.getReceiver(this.editContractForm.row)
          this.editContractFormVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
