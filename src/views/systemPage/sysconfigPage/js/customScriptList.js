import { mapGetters } from 'vuex'
import MyEditor from '../templates/codeEditor'
import {
  SYS_SCRIPT_DELETE,
  SYS_SCRIPT_GET,
  SYS_SCRIPT_POST,
  SYS_SCRIPT_PUT
} from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'

export default {
  components: {
    MyEditor
  },
  data() {
    return {
      scriptType: 'java',
      scriptTypeOptions: [
        { value: 'JAVA', label: 'JAVA' }, { value: 'PYTHON', label: 'PYTHON' }, { value: 'JAVASCRIPT', label: 'JAVASCRIPT' }
      ],
      htmlCodes: '<div>This is html</div>',
      javascriptCodes: 'console.log("This is javascript")',
      cssCodes: 'body{}',
      htmlEditor: null,
      jsEditor: null,
      cssEditor: null,
      list: [], // 数据存储
      dialogFormVisible: false, // 添加弹出框
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      addFormVisible: false,
      options: [],
      form: {
        script_name: '',
        script_context: '',
        script_type: '',
        script_describe: ''
      },
      editForm: { // 编辑需要的字段
        id: '',
        script_name: '',
        script_context: '',
        script_type: '',
        script_describe: ''
      },
      projectNameOptions: [],
      searchForm: {
        script_name: '',
        script_type: '',
        script_describe: ''
      },
      rules: {},
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
      sessionStorage.setItem('customScriptData', JSON.stringify(this.list))
    },

    // 显示编辑弹出框
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.$refs.child.setValue(row.script_context)
    },
    // 编辑
    async editSubmit(row) {
      if (!this.editForm.script_name) {
        this.$message.error('名称不能为空')
      } else {
        const HandleEdit = {
          script_name: this.editForm.script_name.trim(),
          script_context: this.$refs.child.RunResult(),
          script_type: this.editForm.script_type,
          script_describe: this.editForm.script_describe,
          modifier: sessionStorage.getItem('currentUserName')
        }
        await httpRequest('PUT', SYS_SCRIPT_PUT, HandleEdit)
        this.vueTable()
        this.editFormVisible = false
      }
    },
    // 删除
    deleteItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', SYS_SCRIPT_DELETE + '/?id=' + row.id)
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
      this.list = await httpRequest('GET', SYS_SCRIPT_GET + '?script_name=' +
        this.searchForm.script_name + '&script_type=' + this.searchForm.script_type +
        '&script_describe=' + this.searchForm.script_describe)
    },

    addForm() {
      this.addFormVisible = true
    },

    // 添加数据
    async add() {
      if (!this.form.script_name) {
        this.$message.error('项目名称不能为空')
      } else {
        console.log(this.$refs.child.RunResult())
        const handleAddClick = {
          script_name: this.form.script_name,
          script_context: this.$refs.child.RunResult(),
          script_type: this.form.script_type,
          script_describe: this.form.script_describe,
          creator: sessionStorage.getItem('currentUserName')
        }
        await httpRequest('POST', SYS_SCRIPT_POST, handleAddClick)
        this.vueTable()
        this.addFormVisible = false
        this.form = {}
      }
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
