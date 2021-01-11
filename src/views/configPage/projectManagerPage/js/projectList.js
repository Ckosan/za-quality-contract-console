import { mapGetters } from 'vuex'
import { DEPT_GET, PROJECT } from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'
import { isCode } from '../../../../utils/validata_rules'
import { convertTime, getStaffData, isSuccessCode } from '../../../../utils/tools'

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
      loading: false,
      list: [], // 数据存储
      tmpApiList: [],
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: [],
      parentDeptOPtions: [
      ],
      subDeptOPtions: [
      ],
      userInfoMap: [],
      deptInfoMap: [],
      staffOptions: [],
      staffOptionsList: [],
      editStaffOptions: [],
      editForm: {
        project_name: '',
        project_code: '',
        parent_dept: '',
        sub_dept: '',
        creater: '',
        project_describe: '',
        resource_list: []
      },
      resource_dict: {
        user_ids: '',
        role_name: '',
        permission_type: ''
      },
      searchTxt: '',
      // 部门信息
      departmentList: [],
      searchDepartmentList: [],
      searchSubDeptOPtions: [],
      form: {
        project_name: '',
        project_code: '',
        parent_dept: '',
        sub_dept: '',
        creater: '',
        project_describe: '',
        resource_list: [
          {
            user_ids: [sessionStorage.getItem('currentUserName')],
            role_name: '负责人',
            permission_type: 2
          }
        ]
      },
      projectNameOptions: [],
      searchForm: {
        project_code: '',
        project_name: '',
        parent_dept: '',
        sub_dept: ''
      },
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
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    // this.vueTable()
  },
  created() {
    this.vueTable()
    this.getProjectOptions()
    this.getDepartments()
    this.editForm.resource_list.push({
      label: '',
      value: ''
    })
    getStaffData()
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading', 'staffOptionsLists'])

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
    seachList() {
      this.list = this.getFilterApiList()
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
      this.searchForm.parent_dept = ''
      this.searchForm.sub_dept = ''
      this.searchForm.project_name = ''
    },
    getStaffOptions() {
      this.staffOptionsList = this.$store.getters.staffOptionsLists
    },
    // 获取列表
    async vueTable() {
      this.loloading = true
      const returnData = await httpRequest('GET', PROJECT)
      const tmplist = []
      const depetList = new Set()
      const subDeptList = new Set()
      for (var i = 0; i < returnData.length; i++) {
        returnData[i].deptinfo = returnData[i].parentdept_name + '/' + returnData[i].subdept_name
        returnData[i].projectinfo = returnData[i].project_name + '(' + returnData[i].project_code + ')'
        // eslint-disable-next-line no-self-assign,no-undef
        returnData[i].resource_list = this.getResourceList(returnData[i].resource_list)
        // 设置部门信息
        depetList.add(returnData[i].parentdept_name + '-' + returnData[i].parent_dept)
        subDeptList.add(returnData[i].subdept_name + '-' + returnData[i].sub_dept)
        tmplist.push(returnData[i])
      }
      this.list = tmplist
      this.tmpApiList = tmplist
      sessionStorage.setItem('projectData', JSON.stringify(this.list))
      this.getProjectOptions()
      //  部门信息去重
      this.searchDepartmentList = this.deptSplit(Array.from(depetList))
      this.searchSubDeptOPtions = this.deptSplit(Array.from(subDeptList))
      this.loloading = false
    },
    deptSplit(depetList) {
      const list = []
      for (var i = 0; i < depetList.length; i++) {
        list.push({
          label: depetList[i].split('-')[0],
          value: Number(depetList[i].split('-')[1])
        })
      }
      return list
    },
    async getDepartments() {
      const returnData = await httpRequest('GET', DEPT_GET)
      returnData.forEach((value) => {
        this.departmentList.push({
          label: value.department_name,
          value: value.department_id
        })
      })
    },
    getSubDept() {
      this.$http({
        method: 'GET',
        url: DEPT_GET + '?parentId=' + this.form.parent_dept
      }).then((returnData) => {
        if (isSuccessCode(returnData)) {
          returnData = returnData.data
          this.form.sub_dept = ''
          this.subDeptOPtions.length = 0
          returnData.forEach((value) => {
            this.subDeptOPtions.push({
              label: value.department_name,
              value: value.department_id
            })
          })
        }
      })
    },
    async getEditSubDept() {
      const returnData = await httpRequest('GET', DEPT_GET + '?parentId=' + this.editForm.parent_dept)
      this.subDeptOPtions.length = 0
      returnData.forEach((value) => {
        this.subDeptOPtions.push({
          label: value.department_name,
          value: value.department_id
        })
      })
    },
    async getSearchSubDept() {
      const returnData = await httpRequest('GET', DEPT_GET + '?deptName=' + this.searchForm.parent_dept)
      returnData.forEach((value) => {
        this.subDeptOPtions.push({
          label: value.department_name,
          value: value.department_name
        })
      })
    },
    getResourceList(resourcelist) {
      if (resourcelist) {
        // eslint-disable-next-line no-unused-vars
        const roleName = new Set()
        for (var i = 0; i < resourcelist.length; i++) {
          roleName.add(resourcelist[i].role_name + '-' + resourcelist[i].permission_type)
        }
        const roleNameList = Array.from(roleName)
        const userResourceList = []
        for (var j = 0; j < roleNameList.length; j++) {
          const roleInfo = {}
          const userInfo = []
          roleInfo.role_name = roleNameList[j]
          for (var k = 0; k < resourcelist.length; k++) {
            if (resourcelist[k].role_name === roleNameList[j].split('-')[0]) {
              userInfo.push({
                userId: resourcelist[k].user_id,
                userName: resourcelist[k].user_name,
                email: resourcelist[k].email
              })
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

    // 获取拉下列表数据
    getProjectOptions() {
      const returnData = JSON.parse(sessionStorage.getItem('projectData'))
      if (returnData) {
        const nameListArray = []
        for (const key in returnData) {
          returnData[key].index = key
          nameListArray.push({
            value: returnData[key].id,
            label: returnData[key].project_name + '(' + returnData[key].project_code + ')'
          })
        }
        this.projectNameOptions = nameListArray
      }
    },

    // 显示编辑弹出框
    async handleEdit(index, row) {
      this.getStaffOptions()
      this.editFormVisible = true
      const resourcelist = row.resource_list
      const resource_list = []
      for (var i = 0; i < resourcelist.length; i++) {
        const rdict = {
          role_name: resourcelist[i].role_name.split('-')[0],
          permission_type: Number(resourcelist[i].role_name.split('-')[1])
        }
        const users = []
        const userInfo = resourcelist[i].userInfo
        for (var j = 0; j < userInfo.length; j++) {
          users.push(userInfo[j].userName)
          this.userInfoMap.push({
            userId: userInfo[j].userId,
            username: userInfo[j].userName
          })
        }
        rdict.user_ids = users
        resource_list.push(rdict)
      }
      this.editForm = Object.assign({}, row)
      this.editForm.resource_list = resource_list
      this.editForm.parent_dept = row.parentdept_name
      this.editForm.sub_dept = row.subdept_name
      const returnData = await httpRequest('GET', DEPT_GET + '?parentId=' + row.parent_dept)
      this.subDeptOPtions.length = 0
      returnData.forEach((value) => {
        this.subDeptOPtions.push({
          label: value.department_name,
          value: value.department_id
        })
      })
      this.deptInfoMap.push({
        label: row.parentdept_name,
        value: row.parent_dept
      })
      this.deptInfoMap.push({
        label: row.subdept_name,
        value: row.sub_dept
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
    // 编辑
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
          await httpRequest('PUT', PROJECT, HandleEdit)
          this.vueTable()
          this.editFormVisible = false
        }
      })
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
    // 删除
    deleteItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', PROJECT + '?id=' + row.id + '&modifier=' + sessionStorage.getItem('currentUserName'))
        this.vueTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showDate(val) {
      val = val + ''
      if (val.indexOf(this.searchTxt) !== -1 && this.searchTxt !== '') {
        return val.replace(this.searchTxt, '<font color="#DF194C">' + this.searchTxt + '</font>')
      } else {
        return val
      }
    },
    // 查询
    async search() {
      this.loloading = true
      const returnData = await httpRequest('GET', PROJECT + '?id=' + this.searchForm.project_name + '&parent_depet=' +
        this.searchForm.parent_dept + '&sub_dept=' + this.searchForm.sub_dept)
      const tmplist = []
      returnData.forEach((value) => {
        value.deptinfo = value.parentdept_name + '/' + value.subdept_name
        value.projectinfo = value.project_name + '(' + value.project_code + ')'
        // eslint-disable-next-line no-self-assign,no-undef
        value.resource_list = this.getResourceList(value.resource_list)
        tmplist.push(value)
      })
      this.list = tmplist
      this.loloading = false
    },

    addForm() {
      this.getStaffOptions()
      this.initResourceList()
      this.addFormVisible = true
      // this.$router.push({ path: '/projectadd/' })
    },
    initResourceList() {
      this.form.resource_list.user_ids = [sessionStorage.getItem('currentUserName') + '(' + sessionStorage.getItem('email') + ')']
    },

    // 添加数据
    add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            project_name: this.form.project_name,
            project_code: this.form.project_code.trim(),
            creater: sessionStorage.getItem('currentUserName'),
            project_describe: this.form.project_describe,
            parent_dept: this.form.parent_dept,
            sub_dept: this.form.sub_dept,
            resource_list: this.getDefultUser(this.form.resource_list)
          }
          await httpRequest('POST', PROJECT, handleAddClick)
          this.vueTable()
          this.addFormVisible = false
          this.form = {}
          this.form.resource_list = [
            {
              user_ids: [sessionStorage.getItem('currentUserName')],
              role_name: '负责人',
              permission_type: 2
            }
          ]
        }
      })
    },
    getDefultUser(resource_list) {
      // const resourceList = []
      for (var i = 0; i < resource_list.length; i++) {
        const useriDs = resource_list[i].user_ids
        if (useriDs.length != 0) {
          for (var j = 0; j < useriDs.length; j++) {
            if (isNaN(useriDs[j])) {
              resource_list[i].user_ids[j] = Number(sessionStorage.getItem('currentUserId'))
            }
          }
        }
      }
      return resource_list
    },

    handleDetail(index, row) {
      this.$router.push({ path: '/configpage/projectdetail/' + row.id })
    },

    deleteMemberList(index) {
      const tmplist = []
      for (var i = 0; i < this.form.resource_list.length; i++) {
        if (index === i) {
          continue
        }
        tmplist.push(this.form.resource_list[i])
      }
      this.form.resource_list = tmplist
    },
    deleteEditMemberList(index) {
      console.log(index)
      const tmplist = []
      for (var i = 0; i < this.editForm.resource_list.length; i++) {
        if (index === i) {
          continue
        }
        tmplist.push(this.editForm.resource_list[i])
      }
      this.editForm.resource_list = tmplist
    },
    addMemberList() {
      const memberDict = {
        role_name: '',
        user_id: '',
        permission_type: 0
      }
      this.form.resource_list.push(memberDict)
    },
    editMemberList() {
      const memberDict = {
        role_name: '',
        user_id: '',
        permission_type: 0
      }
      this.editForm.resource_list.push(memberDict)
    },
    convertDataFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    }
  }
}
