import { mapGetters } from 'vuex'
import {
  APPLICATION, APPLICATION_PROJECT,
  PROJECT,
  PROJECT_APPLICATION,
  SERVER,
  SERVER_NOT_UNION_SERVERS,
  SERVER_PROJECT_APPLICATION
} from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isCode, isNum, isUri } from '../../../../utils/validata_rules'
import { duplicateRemoval } from '../../../../utils/tools'

export default {
  data() {
    return {
      restaurants: [],
      appStatusOptions: [{ key: 1, label: '已上线', value: '已上线' }, { key: 2, label: '未上线', value: '未上线' }],
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
      protocolOptions: [{ value: 'HTTP', label: 'HTTP' }, { value: 'HTTPS', label: 'HTTPS' }],
      loading: false,
      addLoading: false,
      applicationDetail: [],
      project_info: [],
      editFormVisible: false,
      staffOptionsList: [],
      staffOptions: [],
      serverOptions: [],
      projectOptions: [],
      applicationOptions: [],
      editForm: { // 编辑需要的字段
        application_name: '',
        application_code: '',
        developers: [],
        testers: [],
        application_describe: '',
        application_status: '',
        project_id: ''
      },
      addServerFormVisible: false,
      showUnionDoc: false,
      unionForm: {
        project: '',
        application: '',
        server: ''
      },
      serverform: { // 需要添加的字段
        projectinfo: '',
        applicationinfo: '',
        server_name: '',
        server_code: '',
        server_status: '',
        server_type: 'API',
        server_env: [],
        union_info: ''
      },
      rules: {
        project_id: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
        ],
        application_status: [
          { required: true, message: '应用状态不能为空', trigger: 'blur' }
        ],
        application_describe: [
          { required: true, message: '应用说明不能为空', trigger: 'blur' }
        ],
        application_code: [
          { required: true, message: '应用代码不能为空', trigger: 'blur' },
          { validator: isCode, trigger: 'blur' }
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
      }
    }
  },
  mounted() {
  },
  beforeCreate() {
  },
  created() {
    this.getDetailData()
    this.getProjectOptions()
    this.getStaffOptions()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {
  },
  methods: {
    async getProjectOptions() {
      this.$http({
        method: 'GET',
        url: PROJECT
      }).then((returnData) => {
        if (returnData) {
          returnData = returnData.data
          const nameListArray = []
          returnData.forEach((value) => {
            nameListArray.push({
              key: value.project_name + '(' + value.project_code + ')',
              value: value.id,
              label: value.project_name + '(' + value.project_code + ')'
            })
          })
          this.projectOptions = nameListArray
          sessionStorage.setItem('editFormOptions', JSON.stringify(nameListArray))
        }
      })
    },
    // 获取路由参数
    async getDetailData() {
      const returnData = await httpRequest('GET', APPLICATION + '?id=' + this.$route.params.id)
      this.applicationDetail = returnData[0]
      this.applicationDetail.developers = this.getNameStr(returnData[0].developers)
      this.applicationDetail.testers = this.getNameStr(returnData[0].testers)
      this.loading = true
    },
    handleDetail(index, row) {
      this.$router.push({ path: '/configpage/serverdetail/' + row.id })
    },
    getNameStr(list) {
      if (list.length === 0) {
        return
      }
      var name = ''
      for (var i = 0; i < list.length; i++) {
        if (name === '') {
          name = list[i]
        } else {
          name = name + ',' + list[i]
        }
      }
      return name
    },
    goback() {
      this.$router.push({ path: '/configpage/application' })
    },
    editHandle() {
      this.editFormVisible = true
      this.editForm.project_id = this.applicationDetail.project_id
      this.editForm.project_info = this.applicationDetail.project_name + '(' + this.applicationDetail.project_code + ')'
      this.editForm.application_name = this.applicationDetail.developers
      this.editForm.application_code = this.applicationDetail.application_code
      this.editForm.application_status = this.applicationDetail.application_status
      this.editForm.application_describe = this.applicationDetail.application_describe
      this.editForm.developers = []
      this.editForm.testers = []
      if (this.applicationDetail.developers != '') {
        this.editForm.developers.push({ names: [this.applicationDetail.developers] })
      } else {
        this.editForm.developers.push({ names: [] })
      }
      if (this.applicationDetail.testers != '') {
        this.editForm.testers.push({ names: [this.applicationDetail.testers] })
      } else {
        this.editForm.testers.push({ names: [] })
      }
    },
    getStaffOptions() {
      this.staffOptionsList = this.$store.getters.staffOptionsListForApplication
    },
    remoteMethod2(query) {
      console.log('remoteMethod2')
      if (query !== '') {
        setTimeout(() => {
          this.staffOptions = this.staffOptionsList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
              item.email.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 600)
      } else {
        this.staffOptions = []
      }
    },
    editSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.applicationDetail.id,
            project_id: this.getProjectId(this.editForm.project_info),
            application_name: this.editForm.application_describe,
            application_code: this.editForm.application_code.trim(),
            developers: this.editForm.developers[0].names,
            testers: this.editForm.testers[0].names,
            modifier: sessionStorage.getItem('currentUserName'),
            application_describe: this.editForm.application_describe,
            application_status: this.editForm.application_status
          }
          await httpRequestWithoutLoading('PUT', APPLICATION, HandleEdit)
          this.editFormVisible = false
          this.getDetailData()
        }
      })
    },
    getProjectId(projectinfo) {
      const editFormOptions = JSON.parse(sessionStorage.getItem('editFormOptions'))
      var projectId = ''
      for (var i = 0; i < editFormOptions.length; i++) {
        if (editFormOptions[i].label === projectinfo) {
          projectId = editFormOptions[i].value
          return projectId
        }
      }
      return projectId
    },
    handleDeleteServer(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', SERVER + '?id=' + row.id)
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addServerClick() {
      this.addServerFormVisible = true
    },
    addHttpServerForm2() {
      // this.addhttpFormVisible = true
      this.serverform.server_env.push({
        env_name: '',
        host: '',
        port: '80',
        protocol: 'HTTP'
      })
    },
    deleteAddHttpItem(index, row) {
      this.serverform.server_env.splice(index, 1)
    },
    unionDocHandle() {
      this.getAddUnionProjectOptions()
      if (this.serverform.union_server != null) {
        this.initUionServer(this.serverform.union_server)
      }
      this.showUnionDoc = true
    },
    removeUnionHandle() {
      this.unionForm.server = ''
      this.serverform.union_info = ''
    },
    async initUionServer(unionServerId) {
      const unionServerInfo = await httpRequestWithoutLoading('GET', SERVER_PROJECT_APPLICATION + '?union_server=' + unionServerId)
      this.unionForm.server = unionServerInfo.server_name + '(' + unionServerInfo.server_code + ')'
      this.unionForm.project = unionServerInfo.project_name + '(' + unionServerInfo.project_code + ')'
      this.unionForm.application = unionServerInfo.application_name + '(' + unionServerInfo.application_code + ')'
      this.serverform.union_info = unionServerInfo.server_name + '(' + unionServerInfo.server_code + ')'
      this.serverform.union_server = unionServerId
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
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
      this.projectOptions = ListArray
    },
    async applicationChangeHandle() {
      let id = -1
      if (this.serverform.id != null) {
        id = this.serverform.id
      }
      this.serverOptions = []
      this.unionForm.server = ''
      const returnData = await httpRequestWithoutLoading('GET', SERVER_NOT_UNION_SERVERS + '?id=' + id + '&application_id=' + this.unionForm.application + '&server_type=API')
      for (const key in returnData) {
        returnData[key].index = key
        this.serverOptions.push({
          value: returnData[key].id,
          label: returnData[key].server_name + '(' + returnData[key].server_code + ')',
          key: returnData[key].id
        })
      }
    },
    changeEditUnionServer() {
      this.serverform.union_server = this.unionForm.server
    },
    async unionDocSubmit() {
      this.showUnionDoc = false
      const unionServerInfo = await httpRequestWithoutLoading('GET', SERVER_PROJECT_APPLICATION + '?union_server=' + this.unionForm.server)
      this.serverform.union_info = unionServerInfo.server_name + '(' + unionServerInfo.server_code + ')'
    },
    async projectChangeHandle() {
      this.applicationOptions = []
      this.unionForm.application = ''
      this.unionForm.server = ''
      const returnData = await httpRequestWithoutLoading('GET', APPLICATION_PROJECT + '?project_id=' + this.unionForm.project)
      for (const key in returnData) {
        returnData[key].index = key
        this.applicationOptions.push(returnData[key].application_name +
          '(' + returnData[key].application_code + ')*' + returnData[key].id)
      }
      this.applicationOptions = duplicateRemoval(this.applicationOptions, '*')
    },
    async addSever(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            application_id: this.$route.params.id,
            server_name: this.serverform.server_name,
            server_code: this.serverform.server_code,
            server_type: this.serverform.server_type,
            server_status: this.serverform.server_status,
            union_server: this.unionForm.server,
            creater: sessionStorage.getItem('currentUserName'),
            server_env: this.serverform.server_env
          }
          const data = await httpRequest('POST', SERVER, handleAddClick)
          this.addFormVisible = false
          // this.vueTable()
          this.serverform = {}
          this.serverform.server_env = []
          this.serverform = []
          this.goToServerDetail(data.id)
        }
      })
    },
    goToServerDetail(id) {
      this.$router.push({ path: '/configpage/serverdetail/' + id })
    }
  }
}
