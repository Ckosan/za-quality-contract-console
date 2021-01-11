import { mapGetters } from 'vuex'
import { APPLICATION, DEPT_GET, PROJECT, PROJECT_DETAIL } from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { isCode } from '../../../../utils/validata_rules'

export default {
  data() {
    var checkRole = (rule, value, callback) => {
      console.log('value')
      console.log(value)
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
    }
    return {
      data: [
        { name: '1', data: '2' }
      ],
      addLoading: false,
      projectId: '',
      projectDetail: [],
      loading: false,
      resourceList: [],
      editVisible: false,
      editForm: {
        id: '',
        project_name: '',
        project_code: '',
        parent_dept: '',
        sub_dept: '',
        creater: '',
        project_describe: '',
        resource_list: []
      },
      resource_list: [],
      staffOptionsList: [],
      departmentList: [],
      subDeptOPtions: [],
      deptInfoMap: [],
      userInfoMap: [],
      staffOptions: [],
      rules: {
        project_code: [
          { required: true, message: '项目编码不能为空', trigger: 'blur' },
          { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: 'blur' },
          { validator: isCode, trigger: 'blur' }
        ],
        project_name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: 'blur' }
        ],
        parent_dept: [
          { required: true, message: '一级部门不能为空', trigger: 'blur' }
        ],
        sub_dept: [
          { required: true, message: '二级部门不能为空', trigger: 'blur' }
        ],
        project_describe: [
          { required: true, message: '项目介绍不能为空', trigger: 'blur' },
          { min: 1, max: 2048, message: '长度在 1 到 2048 个字符', trigger: 'blur' }
        ],
        role_name: [{ validator: checkRole, trigger: 'blur' }]
      }
    }
  },
  mounted() {
  },
  created() {
    this.getDetailData()
    this.getDepartments()
    this.getStaffOptions()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  watch: {},
  methods: {
    // 获取路由参数
    async getDetailData() {
      const returnData = await httpRequest('GET', PROJECT_DETAIL + '?id=' + this.$route.params.id)
      this.projectDetail = returnData[0]
      this.resourceList = this.getResourceList(this.projectDetail.resource_list)
    },
    handleDetail(index, row) {
      this.$router.push({ path: '/configpage/applicationdetail/' + row.id })
    },
    getResourceList(resourcelist) {
      if (resourcelist) {
        // eslint-disable-next-line no-unused-vars
        const roleName = new Set()
        for (var i = 0; i < resourcelist.length; i++) {
          roleName.add(resourcelist[i].role_name)
        }
        const roleNameList = Array.from(roleName)
        const userResourceList = []
        for (var j = 0; j < roleNameList.length; j++) {
          const roleInfo = {}
          var userInfo = ''
          roleInfo.role_name = roleNameList[j]
          for (var k = 0; k < resourcelist.length; k++) {
            if (resourcelist[k].role_name === roleNameList[j]) {
              // eslint-disable-next-line no-const-assign
              if (userInfo === '') {
                userInfo = resourcelist[k].user_name
              } else {
                userInfo = userInfo + ',' + resourcelist[k].user_name
              }
            } else {
              continue
            }
            roleInfo.userInfo = userInfo
          }
          userResourceList.push(roleInfo)
        }
        return userResourceList
      }
    },
    goback() {
      this.$router.push({ path: '/configpage/project' })
    },
    getStaffOptions() {
      this.staffOptionsList = this.$store.getters.staffOptionsLists
    },
    async editHandle() {
      this.editVisible = true
      const resourcelist = this.projectDetail.resource_list
      const resource_list = []
      const roleName = new Set()
      for (var j = 0; j < resourcelist.length; j++) {
        roleName.add(resourcelist[j].role_name)
      }
      console.log('1')
      const roleNameList = Array.from(roleName)
      for (let i = 0; i < roleNameList.length; i++) {
        const users = []
        var rdict = {
          role_name: roleNameList[i]
        }
        for (var k = 0; k < resourcelist.length; k++) {
          if (resourcelist[k].role_name === roleNameList[i]) {
            rdict.permission_type = Number(resourcelist[k].permission_type)
            users.push(resourcelist[k].user_name)
            this.userInfoMap.push({
              userId: resourcelist[k].user_id,
              username: resourcelist[k].user_name
            })
          } else {
            continue
          }
        }
        rdict.user_ids = users
        resource_list.push(rdict)
      }
      this.editForm.project_name = this.projectDetail.project_name
      this.editForm.project_code = this.projectDetail.project_code
      this.editForm.project_describe = this.projectDetail.project_describe
      this.editForm.id = this.projectDetail.id
      this.editForm.resource_list = resource_list
      this.editForm.parent_dept = this.projectDetail.parentdept_name
      this.editForm.sub_dept = this.projectDetail.subdept_name
      const returnData = await httpRequestWithoutLoading('GET', DEPT_GET + '?parentId=' + this.projectDetail.parent_dept)
      this.subDeptOPtions.length = 0
      returnData.forEach((value) => {
        this.subDeptOPtions.push({
          label: value.department_name,
          value: value.department_id
        })
      })
      this.deptInfoMap.push({
        label: this.projectDetail.parentdept_name,
        value: this.projectDetail.parent_dept
      })
      this.deptInfoMap.push({
        label: this.projectDetail.subdept_name,
        value: this.projectDetail.sub_dept
      })
    },
    async getDepartments() {
      const returnData = await httpRequestWithoutLoading('GET', DEPT_GET)
      returnData.forEach((value) => {
        this.departmentList.push({
          label: value.department_name,
          value: value.department_id
        })
      })
    },
    async getEditSubDept() {
      const returnData = await httpRequestWithoutLoading('GET', DEPT_GET + '?parentId=' + this.editForm.parent_dept)
      this.subDeptOPtions.length = 0
      returnData.forEach((value) => {
        this.subDeptOPtions.push({
          label: value.department_name,
          value: value.department_id
        })
      })
    },
    remoteMethod(query) {
      if (query !== '' && query.length >= 2) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.staffOptions = this.staffOptionsList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
              item.email.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 600)
      } else {
        this.staffOptions = []
      }
    },
    deleteEditMemberList(index) {
      const tmplist = []
      for (var i = 0; i < this.editForm.resource_list.length; i++) {
        if (index === i) {
          continue
        }
        tmplist.push(this.editForm.resource_list[i])
      }
      this.editForm.resource_list = tmplist
    },
    editSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            project_name: this.editForm.project_name,
            project_code: this.editForm.project_code.trim(),
            modifier: sessionStorage.getItem('currentUserName'),
            project_describe: this.editForm.project_describe,
            parent_dept: this.getDeptId(this.editForm.parent_dept),
            sub_dept: this.getDeptId(this.editForm.sub_dept),
            resource_list: this.flagFormat(this.editForm.resource_list)
          }
          await httpRequestWithoutLoading('PUT', PROJECT, HandleEdit)
          this.editVisible = false
          this.getDetailData()
        }
      })
    },
    flagFormat(resource_list) {
      // const resourceList = []
      for (var i = 0; i < resource_list.length; i++) {
        const useriDs = resource_list[i].user_ids
        if (useriDs.length != 0) {
          for (var j = 0; j < useriDs.length; j++) {
            if (isNaN(useriDs[j])) {
              resource_list[i].user_ids[j] = this.getUserId(useriDs[j], this.userInfoMap)
            }
          }
        }
      }
      return resource_list
    },
    getUserId(username, userInfoMap) {
      for (var i = 0; i < userInfoMap.length; i++) {
        if (username === userInfoMap[i].username) {
          return userInfoMap[i].userId
        }
      }
    },
    getDeptId(dept) {
      if (!isNaN(dept)) {
        return dept
      } else {
        for (var i = 0; i < this.deptInfoMap.length; i++) {
          if (dept === this.deptInfoMap[i].label) {
            return this.deptInfoMap[i].value
          }
        }
        return 0
      }
    },
    editMemberList() {
      const memberDict = {
        role_name: '',
        user_id: '',
        permission_type: 0
      }
      this.editForm.resource_list.push(memberDict)
    },
    handleDeleteApplication(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', APPLICATION + '?id=' + row.id)
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
