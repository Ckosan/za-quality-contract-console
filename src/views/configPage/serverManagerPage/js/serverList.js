import { mapGetters } from 'vuex'
import { lastDuplicateRemoval, duplicateRemoval, duplicateRemoval2 } from '@/utils/tools'
import {
  APPLICATION,
  APPLICATION_PROJECT,
  ONS_SERVER,
  OSS_SERVER,
  PROJECT_APPLICATION,
  SERVER, SERVER_ENV_LIST, SERVER_NOT_UNION_SERVERS, SERVER_PROJECT_APPLICATION,
  SFTP_SERVER
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isCode, isNum, isUri } from '../../../../utils/validata_rules'
import { convertTime } from '../../../../utils/tools'

export default {
  data: function() {
    return {
      radio: 1,
      searchTxt: '',
      unionDoc: {
        showUnionDoc: false,
        projectOptions: [],
        applicationOptions: [],
        serverOptions: []
      },
      unionForm: {
        project: '',
        application: '',
        server: ''
      },
      loading: false,
      list: [], // 数据存储
      tmpApiList: [],
      head: [{ id: 2, name: 'HOST' }, { id: 1, name: '环境名称' }, { id: 3, name: 'PORT' }, { id: 4, name: '协议' }],
      rows: [],
      rowtemplate: { id: 0, env_name: '', host: '', port: '', protocol: '' },
      headitem: '',
      row: '',
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      restaurants: [],
      options: {
        projectOptions: [],
        applicationOptions: [],
        envOptions: [],
        serverTypeOptions: [],
        serverStatusOptions: [],
        serverNameOptions: [],
        addProjectOptions: [],
        addApplictionOptions: [],
        editApplictionOptions: [],
        server_type: [
          { value: 'API', label: 'API' }
          // { value: 'SFTP', label: 'SFTP' },
          // { value: 'ONS', label: 'ONS' },
          // { value: 'OSS', label: 'OSS' }
        ],
        server_status: [
          { value: '可用', label: '可用' },
          { value: '不可用', label: '不可用' }
        ],
        envNameOptions: [
          { value: 'PRE', label: 'PRE' }, { value: 'TEST', label: 'TEST' }, { value: 'PRD', label: 'PRD' }, {
            value: 'PUB',
            label: 'PUB'
          }
        ],
        protocolOptions: [{ value: 'HTTP', label: 'HTTP' }, { value: 'HTTPS', label: 'HTTPS' }]
      },
      value: '',

      form: { // 需要添加的字段
        projectinfo: '',
        applicationinfo: '',
        server_name: '',
        server_code: '',
        server_status: '',
        server_type: 'API',
        server_env: [],
        union_info: ''
      },
      addhttpFormVisible: false,
      httpserverlist: [],
      httpserverForm: {
        env_name: '',
        host: '',
        port: '',
        protocol: ''
      },
      addhttpServerEditFormVisible: false,
      addhttpServerEditForm: {
        env_name: '',
        env_type: '',
        host: '',
        port: '',
        protocol: '',
        server: ''
      },
      // ONS
      addOnsFormVisible: false,
      onsserverForm: {
        env_name: '',
        access_key: '',
        secret_key: '',
        topic: '',
        producer_id: ''
      },
      addOnsServerEditFormVisible: false,
      addoOnsServerEditForm: {
        env_name: '',
        access_key: '',
        secret_key: '',
        topic: '',
        producer_id: '',
        server: ''
      },
      addonsServerEditFormVisible: false,
      httpServerEditFormVisible: false,
      edithttpServerForm: {
        index: '',
        id: '',
        env_name: '',
        env_type: '',
        host: '',
        port: '',
        protocol: '',
        server: ''
      },
      onsServerEditFormVisible: false,
      editOnsServerForm: {
        index: '',
        id: '',
        env_name: '',
        access_key: '',
        secret_key: '',
        topic: '',
        producer_id: '',
        server: ''
      },
      addEditOnsServerForm: {
        index: '',
        id: '',
        env_name: '',
        access_key: '',
        secret_key: '',
        topic: '',
        producer_id: ''
      },
      addEdithttpServerForm: {
        index: '',
        id: '',
        env_name: '',
        env_type: '',
        host: '',
        port: '',
        protocol: ''
      },
      AddhttpServerEditFormVisible: false,
      editForm: { // 编辑需要的字段
        id: '',
        projectinfo: '',
        applicationinfo: '',
        server_name: '',
        server_code: '',
        server_status: '',
        server_type: '',
        server_env: [],
        union_info: ''
      },
      searchForm: {
        server_name: '',
        projectinfo: '',
        applicationsinfo: '',
        env: '',
        server_type: '',
        server_status: ''
      },
      rules: {
        projectinfo: [
          { required: true, message: '项目信息不能为空', trigger: 'blur' }
        ],
        application_code: [
          { required: true, message: '服务编码不能为空', trigger: 'blur' }
        ],
        server_type: [
          { required: true, message: '服务类型不能为空', trigger: 'blur' }
        ],
        server_name: [
          { required: true, message: '服务说明不能为空', trigger: 'blur' }
        ],
        server_env: {
          env_name: [
            { required: true, message: '配置名称不能为空', trigger: 'blur' },
            { validator: isCode, trigger: 'blur' }
          ],
          protocol: [
            { required: true, message: '协议类型不能为空', trigger: 'blur' }
          ],
          host: [
            { required: true, message: '主机地址不能为空', trigger: 'blur' },
            { validator: isUri, trigger: 'blur' }
          ],
          port: [
            { required: true, message: '端口号不能为空', trigger: 'blur' },
            { validator: isNum, trigger: 'blur' }
          ]
        }
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    // this.vueTable()
    this.getAddProjectOptions()
    this.restaurants = this.loadAll()
  },
  beforeCreate() {
  },
  created() {
    this.vueTable()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {
    ListSearch(val) {
      this.list.forEach(val => {
      })
    },
    seachList() {
      this.list = this.seachList()
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
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': 'test' },
        { 'value': 'pre' },
        { 'value': 'pub' }
      ]
    },
    seachList() {
      this.list = this.getFilterApiList()
    },
    showDate(val) {
      val = val + ''
      if (val.indexOf(this.searchTxt) !== -1 && this.searchTxt !== '') {
        return val.replace(this.searchTxt, '<font color="#DF194C">' + this.searchTxt + '</font>')
      } else {
        return val
      }
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
    resetForm() {
      this.searchForm.server_name = ''
      this.searchForm.projectinfo = ''
      this.searchForm.applicationsinfo = ''
      this.searchForm.env = ''
      this.searchForm.server_type = ''
      this.searchForm.server_status = ''
      this.options.serverNameOptions = []
      this.options.serverNameOptions = JSON.parse(sessionStorage.getItem('serverNameOptions'))
      this.options.applicationOptions = []
      this.options.applicationOptions = JSON.parse(sessionStorage.getItem('applicationOptions'))
    },
    // 获取列表
    async vueTable() {
      this.loading = true
      this.options.applicationOptions = []
      var returnData = await httpRequest('GET', SERVER)
      // 屏蔽除HTPP外的类型
      returnData = returnData.filter((item, index, arr) => item.server_type === 'API')
      const tmplist = []
      returnData.forEach((value) => {
        value.projectinfo = value.project_name + '(' + value.project_code + ')'
        value.applicationinfo = value.application_name + '(' + value.application_code + ')'
        tmplist.push(value)
      })
      this.list = tmplist
      this.tmpApiList = tmplist
      sessionStorage.setItem('serversData', JSON.stringify(returnData))
      this.getSearchProjectOptions(returnData)
      this.loading = false
    },
    getSearchProjectOptions(returnData) {
      this.options.projectOptions = []
      this.options.envOptions = []
      this.options.serverStatusOptions = []
      this.options.applicationOptions = []
      this.options.serverTypeOptions = []
      this.options.serverNameOptions = []
      if (returnData) {
        // eslint-disable-next-line no-empty
        for (const key in returnData) {
          returnData[key].index = key
          this.options.serverTypeOptions.push(returnData[key].server_type)
          this.options.projectOptions.push(returnData[key].project_name + '(' +
            returnData[key].project_code + ')' + '-' + returnData[key].project_id)
          this.options.applicationOptions.push(returnData[key].application_name + '(' +
            returnData[key].application_code + ')' + '-' + returnData[key].application_id)
        }
      }
      // 去重，切分
      this.options.serverTypeOptions = duplicateRemoval2(this.options.serverTypeOptions)
      this.options.projectOptions = lastDuplicateRemoval(this.options.projectOptions, '-')
      this.options.applicationOptions = lastDuplicateRemoval(this.options.applicationOptions, '-')
      sessionStorage.setItem('applicationOptions', JSON.stringify(this.options.applicationOptions))
      sessionStorage.setItem('serverPageProjectOptions', JSON.stringify(this.options.projectOptions))
      sessionStorage.setItem('serverNameOptions', JSON.stringify(this.options.serverNameOptions))
    },
    async getApplicationsOptions() {
      if (this.searchForm.projectinfo) {
        this.searchForm.applicationsinfo = ''
        this.options.applicationOptions = []
        this.$http({
          method: 'GET',
          url: APPLICATION + '?project_id=' + this.searchForm.projectinfo
        }).then((returnData) => {
          if (returnData) {
            returnData = returnData.data
            for (const key in returnData) {
              returnData[key].index = key
              this.options.applicationOptions.push(returnData[key].application_name +
                '(' + returnData[key].application_code + ')*' + returnData[key].id)
            }
            this.options.applicationOptions = duplicateRemoval(this.options.applicationOptions, '*')
          }
        })
      }
    },
    async getAddProjectOptions() {
      const returnData = await httpRequestWithoutLoading('GET', PROJECT_APPLICATION)
      sessionStorage.setItem('serverPageProjectData', JSON.stringify(returnData))
      const ListArray = []
      for (const key in returnData) {
        returnData[key].index = key
        ListArray.push({
          value: returnData[key].id,
          label: returnData[key].project_name + '(' + returnData[key].project_code + ')'
        })
      }
      this.options.addProjectOptions = ListArray
      sessionStorage.setItem('addProjectOptions', JSON.stringify(this.options.addProjectOptions))
    },
    async getAddApplictionOptions() {
      this.options.addApplictionOptions = []
      this.editForm.applicationinfo = ''
      const returnData = await httpRequestWithoutLoading('GET', APPLICATION_PROJECT + '?project_id=' + this.form.projectinfo)
      for (const key in returnData) {
        returnData[key].index = key
        this.options.addApplictionOptions.push(returnData[key].application_name +
          '(' + returnData[key].application_code + ')*' + returnData[key].id)
      }
      this.options.addApplictionOptions = duplicateRemoval(this.options.addApplictionOptions, '*')
    },
    async getEditApplictionOptions() {
      this.editForm.applicationinfo = ''
      this.options.editApplictionOptions = []
      const returnData = await httpRequestWithoutLoading('GET', APPLICATION_PROJECT + '?project_id=' + this.editForm.projectinfo)
      for (const key in returnData) {
        returnData[key].index = key
        this.options.editApplictionOptions.push(returnData[key].application_name +
          '(' + returnData[key].application_code + ')*' + returnData[key].id)
      }
      this.options.editApplictionOptions = duplicateRemoval(this.options.editApplictionOptions, '*')
    },
    getApplicationId() {
      this.editForm.applicationid = this.editForm.applicationinfo
    },
    // 显示编辑弹出框
    handleEdit(index, row) {
      if (row.union_server != null) {
        this.initUionServer(row.union_server)
      }
      this.getAddProjectOptions()
      row.projectinfo = row.project_name + '(' + row.project_code + ')'
      row.applicationinfo = row.application_name + '(' + row.application_code + ')'
      this.editForm = Object.assign({}, row)
      this.getServerEnvList(row)
      this.editForm.applicationid = row.application_id
    },
    async getServerEnvList(row) {
      const returnData = await httpRequestWithoutLoading('GET', SERVER_ENV_LIST + '?server_id=' + row.id + '&server_type=' + row.server_type)
      this.editForm.server_env = returnData
      this.editFormVisible = true
    },
    changeEditUnionServer() {
      this.editForm.union_server = this.unionForm.server
    },
    // 编辑
    async editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            application_id: this.editForm.applicationid,
            server_name: this.editForm.server_name,
            server_code: this.editForm.server_code,
            server_type: this.editForm.server_type,
            server_status: this.editForm.server_status,
            union_server: this.editForm.union_server,
            env: this.form.env,
            modifier: sessionStorage.getItem('currentUserName'),
            server_env: this.editForm.server_env
          }
          await httpRequest('PUT', SERVER, HandleEdit)
          this.editFormVisible = false
          this.vueTable()
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
        await httpRequest('DELETE', SERVER + '?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
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
      const returnData = await httpRequest('GET', SERVER + '?application_id=' + this.searchForm.applicationsinfo + '&project_id=' +
        this.searchForm.projectinfo + '&server_type=' + this.searchForm.server_type)
      const tmplist = []
      returnData.forEach((value) => {
        value.projectinfo = value.project_name + '(' + value.project_code + ')'
        value.applicationinfo = value.application_name + '(' + value.application_code + ')'
        tmplist.push(value)
      })
      this.list = tmplist
    },

    addForm() {
      this.editForm.id = null
      this.addFormVisible = true
    },
    // 添加数据
    async add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            application_id: Number(this.form.application_code),
            server_name: this.form.server_name,
            server_code: this.form.server_code,
            server_type: this.form.server_type,
            server_status: this.form.server_status,
            union_server: this.unionForm.server,
            creater: sessionStorage.getItem('currentUserName'),
            server_env: this.form.server_env
          }
          const data = await httpRequest('POST', SERVER, handleAddClick)
          this.addFormVisible = false
          // this.vueTable()
          this.form = {}
          this.form.server_env = []
          this.rows = []
          this.goToServerDetail(data.id)
        }
      })
    },
    goToServerDetail(id) {
      this.$router.push({ path: '/configpage/serverdetail/' + id })
    },
    handleDetail(index, row) {
      this.$router.push({ path: '/configpage/serverdetail/' + row.id })
    },
    addServerForm() {
      this.editForm.server_env.push({
        env_name: '',
        host: '',
        port: '80',
        protocol: 'HTTP',
        id: ''
      })
    },
    addOnsServerForm() {
      this.editForm.server_env.push({
        env_name: '',
        service_address: '',
        access_key: '',
        accesskey_secretkey: '',
        topic: '',
        group_id: '',
        producer_id: '',
        id: ''
      })
    },
    addSFTPServerForm() {
      this.editForm.server_env.push({
        env_name: '',
        host: '',
        user: '',
        password: '',
        id: ''
      })
    },
    addOSSServerForm() {
      this.editForm.server_env.push({
        env_name: '',
        endpoint: '',
        accesskey_id: '',
        accesskey_secret: '',
        bucket: '',
        id: ''
      })
    },
    // 增加HTTP服务
    deleteHttpItem(index, row) {
      if (row.id === '') {
        this.editForm.server_env.pop()
        return
      }
      const newList = []
      for (var i = 0; i < this.editForm.server_env.length; i++) {
        if (this.editForm.server_env[i].id === row.id) {
          continue
        }
        newList.push(this.editForm.server_env[i])
      }
      this.editForm.server_env = newList
    },
    // 编辑HTTP服务
    deleteAddHttpItem(index, row) {
      this.form.server_env.splice(index, 1)
    },
    addHttpServerForm2() {
      // this.addhttpFormVisible = true
      this.form.server_env.push({
        env_name: '',
        host: '',
        port: '80',
        protocol: 'HTTP'
      })
    },
    // 编辑ons服务
    deleteOnsItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (row.id === '') {
          this.editForm.server_env.pop()
          return
        }
        await httpRequest('DELETE', ONS_SERVER + '?id=' + row.id)
        const newList = []
        for (var i = 0; i < this.editForm.server_env.length; i++) {
          if (this.editForm.server_env[i].id === row.id) {
            continue
          }
          newList.push(this.editForm.server_env[i])
        }
        this.editForm.server_env = newList
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    deleteSftpItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (row.id === '') {
          this.editForm.server_env.pop()
          return
        }
        await httpRequest('DELETE', SFTP_SERVER + '?id=' + row.id)
        const newList = []
        for (var i = 0; i < this.editForm.server_env.length; i++) {
          if (this.editForm.server_env[i].id === row.id) {
            continue
          }
          newList.push(this.editForm.server_env[i])
        }
        this.editForm.server_env = newList
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteOssItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (row.id === '') {
          this.editForm.server_env.pop()
          return
        }
        await httpRequest('DELETE', OSS_SERVER + '?id=' + row.id)
        const newList = []
        for (var i = 0; i < this.editForm.server_env.length; i++) {
          if (this.editForm.server_env[i].id === row.id) {
            continue
          }
          newList.push(this.editForm.server_env[i])
        }
        this.editForm.server_env = newList
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增ONS服务
    addOnsServerForm2() {
      this.form.server_env.push({
        env_name: '',
        service_address: '',
        access_key: '',
        secret_key: '',
        topic: '',
        group_id: '',
        producer_id: ''
      })
    },
    addSFTPServerForm2() {
      this.form.server_env.push({
        env_name: '',
        host: '',
        user: '',
        password: ''
      })
    },
    addOSSServerForm2() {
      this.form.server_env.push({
        env_name: '',
        endpoint: '',
        accesskey_id: '',
        accesskey_secret: '',
        bucket: ''
      })
    },
    async initUionServer(unionServerId) {
      const unionServerInfo = await httpRequestWithoutLoading('GET', SERVER_PROJECT_APPLICATION + '?union_server=' + unionServerId)
      this.unionForm.server = unionServerInfo.server_name + '(' + unionServerInfo.server_code + ')'
      this.unionForm.project = unionServerInfo.project_name + '(' + unionServerInfo.project_code + ')'
      this.unionForm.application = unionServerInfo.application_name + '(' + unionServerInfo.application_code + ')'
      this.form.union_info = unionServerInfo.server_name + '(' + unionServerInfo.server_code + ')'
      this.editForm.union_server = unionServerId
    },
    async getAddUnionProjectOptions() {
      const returnData = await httpRequestWithoutLoading('GET', PROJECT_APPLICATION)
      const ListArray = []
      for (const key in returnData) {
        returnData[key].index = key
        ListArray.push({
          value: returnData[key].id,
          label: returnData[key].project_name + '(' + returnData[key].project_code + ')'
        })
      }
      this.unionDoc.projectOptions = ListArray
    },
    async projectChangeHandle() {
      this.unionDoc.applicationOptions = []
      this.unionForm.application = ''
      this.unionForm.server = ''
      const returnData = await httpRequestWithoutLoading('GET', APPLICATION_PROJECT + '?project_id=' + this.unionForm.project)
      for (const key in returnData) {
        returnData[key].index = key
        this.unionDoc.applicationOptions.push(returnData[key].application_name +
          '(' + returnData[key].application_code + ')*' + returnData[key].id)
      }
      this.unionDoc.applicationOptions = duplicateRemoval(this.unionDoc.applicationOptions, '*')
    },
    async applicationChangeHandle() {
      let id = -1
      if (this.editForm.id != null) {
        id = this.editForm.id
      }
      this.unionDoc.serverOptions = []
      this.unionForm.server = ''
      const returnData = await httpRequestWithoutLoading('GET', SERVER_NOT_UNION_SERVERS + '?id=' + id + '&application_id=' + this.unionForm.application + '&server_type=API')
      for (const key in returnData) {
        returnData[key].index = key
        this.unionDoc.serverOptions.push({
          value: returnData[key].id,
          label: returnData[key].server_name + '(' + returnData[key].server_code + ')',
          key: returnData[key].id
        })
      }
    },
    unionDocHandle() {
      this.getAddUnionProjectOptions()
      if (this.editForm.union_server != null) {
        this.initUionServer(this.editForm.union_server)
      }
      this.unionDoc.showUnionDoc = true
    },
    removeUnionHandle() {
      this.unionForm.server = ''
      this.form.union_info = ''
    },
    async unionDocSubmit() {
      this.unionDoc.showUnionDoc = false
      const unionServerInfo = await httpRequestWithoutLoading('GET', SERVER_PROJECT_APPLICATION + '?union_server=' + this.unionForm.server)
      this.form.union_info = unionServerInfo.server_name + '(' + unionServerInfo.server_code + ')'
    },
    goToDetail(index, row) {
      this.$router.push({ path: '/configpage/serverdetail/' + row.union_server })
    },
    convertDataFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    }
  }
}
