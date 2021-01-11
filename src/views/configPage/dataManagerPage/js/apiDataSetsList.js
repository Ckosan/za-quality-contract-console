import { mapGetters } from 'vuex'
import { DATA_SET_REALATION_API } from '../../../../contractapi'
import { httpRequest, httpRequestWithoutLoading } from '../../../../http/interceptors'
import { convertTime } from '../../../../utils/tools'
import { ws_host } from '../../../../settings'

export default {
  data() {
    return {
      apiInfoTitle: '',
      addDataSetVisible: false,
      addDataSetForm:
        {
          name: '',
          setId: '',
          interfaceId: '',
          modifier: sessionStorage.getItem('currentUserName'),
          description: ''
        },
      serverInfo: {},
      loading: false,
      list: [], // 数据存储
      tmpApiList: [],
      ListSearch: '', // 搜索
      editFormVisible: false, // 编辑器弹出框
      editForm:
        { // 编辑需要的字段
          id: '',
          name: '',
          setId: '',
          interfaceId: '',
          modifier: sessionStorage.getItem('currentUserName'),
          description: ''
        },
      searchForm: {
        name: ''
      },
      searchTxt: '',
      rules: {
        name:
          [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
      },
      addLoading: false,
      pagesize: 15,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
    this.apiInfoTitle = localStorage.getItem('API_INFO')
    this.getPageInfo()
  },
  created() {
    if ('WebSocket' in window) {
      this.websocket = new WebSocket(ws_host + '/dataSetWebSocket/' + this.$route.params.id + '/' + this.$route.query.setId)
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
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
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage() {
    },
    setOnopenMessage() {
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      const data = JSON.parse(event.data)
      this.list = data
      this.tmpApiList = data
    },
    setOncloseMessage() {
    },
    onbeforeunload() {
      this.closeWebSocket()
    },
    closeWebSocket() {
      this.websocket.close()
    },
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
      this.searchForm.name = ''
      this.searchForm.conditions = ''
      this.vueTable()
    },
    getPageInfo() {
      this.serverInfo.project_name = localStorage.getItem('SERVER_PROJECT')
      this.serverInfo.application_name = localStorage.getItem('SERVER_APPLICATION')
      this.serverInfo.server_name = localStorage.getItem('SERVER_INFO')
      this.serverInfo.server_type = localStorage.getItem('SERVER_TYPE')
      this.vueTable()
    },
    // 获取列表
    async vueTable() {
      this.list = await httpRequest('GET', DATA_SET_REALATION_API + '?interfaceId=' +
        this.$route.params.id + '&setId=' + this.$route.query.setId)
      this.tmpApiList = this.list
    },
    // 编辑
    deleteItem(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await httpRequest('DELETE', DATA_SET_REALATION_API + '?setId=' + row.id)
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
      this.list = await httpRequest('GET', DATA_SET_REALATION_API + '?name=' +
        this.searchForm.name + '&interfaceId=' + this.$route.params.id + '&setId=' + this.$route.query.setId)
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
    gobackList() {
      this.$router.push({ path: '/dataconfigpage/apidatasetlist/' + this.$route.query.setId,
        query: { serverId: this.$route.query.serverId }})
    },
    goback() {
      this.$router.push({ path: '/configpage/serverdetail/' + this.$route.query.serverId })
    },
    convertTimeFormat(row, col) {
      return row.modifier + '\n\t' + convertTime(row.update_time)
    },
    addDataSet() {
      this.addDataSetForm.interfaceId = this.$route.params.id
      this.addDataSetForm.setId = this.$route.query.setId
      this.addDataSetVisible = true
    },
    handleDataSetEdit(row) {
      this.$router.push({
        path: '/configpage/apidatasetsdetail/' + row.id,
        query: { interfaceId: row.interface_id, setId: row.set_id, serverId: this.$route.query.serverId }
      })
    },
    handleEdit(index, row) {
      this.editForm = Object.assign({}, row)
      this.editForm.interfaceId = this.$route.params.id
      this.editForm.setId = this.$route.query.setid
      this.editFormVisible = true
    },
    addDataSetSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            name: this.addDataSetForm.name,
            set_id: this.addDataSetForm.setId,
            interface_id: this.addDataSetForm.interfaceId,
            modifier: this.addDataSetForm.modifier,
            description: this.addDataSetForm.description
          }
          await httpRequestWithoutLoading('POST', DATA_SET_REALATION_API, HandleEdit)
          this.$message.success('添加成功')
          this.vueTable()
          this.addDataSetVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    },
    editDataSetSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const HandleEdit = {
            id: this.editForm.id,
            name: this.editForm.name,
            set_id: this.editForm.setId,
            interface_id: this.editForm.interfaceId,
            modifier: this.editForm.modifier,
            description: this.editForm.description
          }
          await httpRequestWithoutLoading('PUT', DATA_SET_REALATION_API, HandleEdit)
          this.$message.success('修改成功')
          this.vueTable()
          this.editFormVisible = false
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
