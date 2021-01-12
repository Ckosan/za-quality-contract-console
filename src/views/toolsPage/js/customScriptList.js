import { mapGetters } from 'vuex'
import MyEditor from '../templates/codeEditor'
import { SYS_SCRIPT_DELETE, SYS_SCRIPT_GET, SYS_SCRIPT_POST, SYS_SCRIPT_PUT } from '../../../contractapi'
import { httpRequest } from '../../../http/interceptors'

export default {
  components: {
    MyEditor
  },
  data() {
    return {
      scriptType: 'java',
      scriptTypeOptions: [
        { value: 'JAVA', label: 'JAVA' }, { value: 'PYTHON', label: 'PYTHON' }, { value: 'GROOVY', label: 'GROOVY' }
      ],
      htmlCodes: '<div>This is html</div>',
      javascriptCodes: 'console.log("This is javascript")',
      cssCodes: 'body{}',
      htmlEditor: null,
      jsEditor: null,
      cssEditor: null,
      list: [], // 数据存储
      tmpApiList: [],
      searchTxt: '',
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: [],
      form: {
        script_name: '',
        script_context: '',
        script_type: '',
        script_describe: '',
        script_path: '',
        script_sample: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        script_name: '',
        script_context: '',
        script_type: '',
        script_describe: '',
        script_path: '',
        script_sample: ''
      },
      projectNameOptions: [],
      searchForm: {
        script_name: '',
        script_type: '',
        script_describe: ''
      },
      rules: {
        script_name: [
          { required: true, message: '请输入脚本名称', trigger: 'blur' }
        ],
        script_type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        script_describe: [
          { required: true, message: '请输入脚本说明', trigger: 'blur' }
        ],
        script_path: [
          { required: true, message: '请输入脚本路径', trigger: 'blur' }
        ]
      },
      addLoading: false,
      pagesize: 20,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    // this.vueTable()
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
    resetForm() {
      this.searchForm.script_name = ''
      this.searchForm.script_describe = ''
      this.searchForm.script_type = ''
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', SYS_SCRIPT_GET)
      this.tmpApiList = this.list
      sessionStorage.setItem('customScriptData', JSON.stringify(this.list))
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
    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      try {
        this.$refs.child.setValue(row.script_context)
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑
    async editSubmit(editForm) {
      this.$refs[editForm].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            script_name: this.editForm.script_name.trim(),
            script_path: this.editForm.script_path.trim(),
            script_context: this.$refs.child.RunResult(),
            script_type: this.editForm.script_type,
            script_describe: this.editForm.script_describe,
            script_sample: this.editForm.script_sample,
            modifier: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('PUT', SYS_SCRIPT_PUT, HandleEdit)
          this.vueTable()
          this.$refs.child.setValue('')
          this.editFormVisible = false
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
        await httpRequest('DELETE', SYS_SCRIPT_DELETE + '?id=' + row.id)
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
      this.list = await httpRequest('GET', SYS_SCRIPT_GET + '?script_name=' + this.searchForm.script_name + '&script_type=' + this.searchForm.script_type +
        '&script_describe=' + this.searchForm.script_describe)
    },

    addForm() {
      this.addFormVisible = true
    },

    // 添加数据
    async add(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const handleAddClick = {
            script_name: this.form.script_name.trim(),
            script_path: this.form.script_path.trim(),
            script_context: this.$refs.child.RunResult(),
            script_type: this.form.script_type,
            script_describe: this.form.script_describe,
            script_sample: this.form.script_sample,
            creator: sessionStorage.getItem('currentUserName')
          }
          await httpRequest('POST', SYS_SCRIPT_POST, handleAddClick)
          this.vueTable()
          this.addFormVisible = false
          this.form = {}
          try {
            this.$refs.child.setValue('')
          } catch (e) {
            console.log(e)
          }
        } else {
          console.log('error submit!!')
        }
      })
    },
    htmlOnMounted(edit) {
      this.htmlEditor = edit
    },
    javascriptOnMounted(edit) {
      this.jsEditor = edit
    },
    cssOnMounted(edit) {
      this.cssEditor = edit
    },
    htmlOnCodeChange(value, event) {
    },
    javascriptOnCodeChange(value, event) {
    },
    cssOnCodeChange(value, event) {
    }
  }
}
