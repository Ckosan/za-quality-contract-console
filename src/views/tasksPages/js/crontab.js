import { mapGetters } from 'vuex'

import BackToTop from '@/components/BackToTop'
import elDragDialog from '@/directive/el-drag-dialog'
import SELECT_DATA, { getConfigItem, DateFormat } from '@/utils/selectData'
import { Notification } from 'element-ui'
import { parseTime } from '@/utils'
// Handler编排
export default {
  components: {
    BackToTop
  },
  directives: { elDragDialog },
  data() {
    return {
      SELECT_DATA,
      fileredProducts: [],
      bookType: 'xlsx',
      downloadLoading: false,
      searchForm: {},
      zkConfigTypeEnum: '',
      type: 'edit',
      maxHeight: document.documentElement.clientHeight - 90 - 110 - 75,
      pager: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },
      creditRecordList: [],
      myBackToTopStyle: {
        right: '50px',
        bottom: '18px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1', // 按钮的背景颜色 The background color of the button
        'z-index': 99
      },
      rules: {
        productCodes: [{ required: true, trigger: 'click' }],
        certNo: [{ required: true, trigger: 'click' }]
      },
      dropDownOj: {}
    }
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])

  },
  created() {
    // this.$store.dispatch('common/queryRoleInvoke')
    this.getDropDownList()
    this.getProductDropDownList()
  },
  mounted() {
    // this.onSearch()
    // console.log(this.pageRoles)
  },
  methods: {
    getConfigItem,
    DateFormat,
    resetForm() {
      this.searchForm = {}
      this.$set(this.searchForm, 'productCodes', [])
    },
    onParterChange(value) {
      this.fileredProducts = []
      const _this = this
      this.dropDownOj.productInfo.forEach(function(item) {
        if (item.partnerName == value) {
          _this.fileredProducts = item.productList
        }
      })
      this.searchForm.marketId = null
      this.searchForm.productCodes = []
    },
    onClearPartener() {
      this.searchForm.productCodes = []
      this.getProductDropDownList()
    },
    onClearMarket() {
      this.searchForm.productCodes = []
      this.getProductDropDownList()
    },
    getProductDropDownList() {
      this.$http({
        method: 'GET',
        url: '/tasksmanager/crontablist'
      }).then((returnData) => {
        if (returnData) {
          this.fileredProducts = returnData
        }
      })
    },
    onMarketChange(value) {
      this.fileredProducts = []
      const _this = this
      this.dropDownOj.productInfo.forEach(function(item) {
        if (item.marketid == value) {
          _this.fileredProducts = item.productList
        }
      })
      this.searchForm.partnerId = null
      this.searchForm.productCodes = []
    },

    getDropDownList() {
      this.$http({
        method: 'GET',
        url: '/tasksmanager/crontablist'
      }).then((returnData) => {
        if (returnData) {
          this.dropDownOj = returnData
        }
      })
    },
    onSearch() {
      const pages = {
        pageNum: this.pager.pageIndex,
        pageSize: this.pager.pageSize
      }
      if (this.searchForm.productCodes.length == 0) {
        Notification.warning('产品不能为空!')
        return
      }
      if (!this.searchForm.certNo) {
        Notification.warning('身份证不能为空!')
        return
      }
      if (this.searchForm.applyTime && this.searchForm.applyTime.length == 2) {
        this.searchForm.applyBeginTime = this.searchForm.applyTime[0]
        this.searchForm.applyEndTime = this.searchForm.applyTime[1]
      }
      const obj = JSON.parse(JSON.stringify(this.searchForm))
      delete obj.applyTime
      //  this.$refs['searchForm'].validate((valid) => {
      //   if (valid) {
      this.$http({
        url: '/creditApply/query',
        data: {
          ...obj,
          ...pages
        }
      }).then((returnData) => {
        if (returnData && returnData.results) {
          this.creditRecordList = returnData.results
          this.pager.total = returnData.total
        } else {
          this.creditRecordList = []
        }
      })
      //   }
      // })
    },
    excelDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['合作机构名称', '营销活动名称', '信贷产品编码',
          '信贷产品名称', '投保申请时间', '投保申请号', '申请人姓名', '身份证号码',
          '申请人手机号', '核保审核时间', '授信额度', '授信有效期', '核保结果']
        const filterVal = ['partnerName', 'marketName', 'productCode', 'productName', 'applyDate', 'creditApplyNo', 'userName',
          'certNo', 'userMobile', 'effectDate', 'creditAmount', 'expireDate',
          'applyStatus']
        const list = this.creditRecordList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'applyDate' || j === 'effectDate' || j === 'expireDate') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    handleSizeChange(pageSize) {
      this.pager.pageSize = pageSize
      this.onSearch()
    },
    handleCurrentChange(pageIndex) {
      this.pager.pageIndex = pageIndex
      this.onSearch()
    }
  }
}
