import { mapGetters } from 'vuex'
import { APPLICATION, PROJECT, SERVER } from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isCode } from '../../../../utils/validata_rules'

export default {
  data() {
    return {
      appStatusOptions: [{ key: 1, label: '已上线', value: '已上线' }, { key: 2, label: '未上线', value: '未上线' }],
      loading: false,
      addLoading: false,
      applicationDetail: [],
      project_info: [],
      editFormVisible: false,
      staffOptionsList: [],
      staffOptions: [],
      projectOptions: [],
      editForm: { // 编辑需要的字段
        application_name: '',
        application_code: '',
        developers: [],
        testers: [],
        application_describe: '',
        application_status: '',
        project_id: ''
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
        ]
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
    }
  }
}
