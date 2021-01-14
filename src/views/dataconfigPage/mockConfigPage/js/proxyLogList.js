import { mapGetters } from 'vuex'
import { SERVER_PROXY_LOG } from '../../../../contractapi'
import { httpRequest } from '../../../../http/interceptors'
import { getLocalTime } from '../../../../utils/tools'

export default {
  data() {
    return {
      loading: false,
      list: [], // 数据存储
      searchTxt: '',
      tmpApiList: [],
      ListSearch: '', // 搜索
      options: [],
      searchForm: {
        search_value: 'openAccount'
      },
      rules: {
        search_value:
          [
            { required: true, message: '请输入关键字', trigger: 'blur' }
          ]
      },
      addLoading: false,
      pagesize: 20,
      currentPage: 1 // 初始页
    }
  },
  mounted() {
  },
  beforeCreate() {
  },
  created() {
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
      this.searchForm.search_value = ''
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
      if (val === null) return null
      val = val + ''
      if (val.indexOf(this.searchTxt) !== -1 && this.searchTxt !== '') {
        return val.replace(this.searchTxt, '<font color="#DF194C">' + this.searchTxt + '</font>')
      } else {
        return val
      }
    },
    // 查询
    async search(form) {
      const reqData = {
        search_value: this.searchForm.search_value
      }
      const data = await httpRequest('POST', SERVER_PROXY_LOG, reqData)
      this.list = data
      this.tmpApiList = data
    },
    convertDataFormat(data) {
      return getLocalTime(data.created_date)
    },
    getDataFormat(data) {
      return getLocalTime(data)
    }
  }
}
