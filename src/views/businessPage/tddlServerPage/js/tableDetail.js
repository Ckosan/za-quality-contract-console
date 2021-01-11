import { TDDL_SERVER } from '../../../../contractapi'

export default {
  data() {
    return {
      loading: false,
      tableddl: '',
      tablename: this.$route.query.appname + '->' + this.$route.query.tablename
    }
  },
  mounted() {
    this.search()
  },
  created() {
  },
  computed: {},
  watch: {},
  methods: {
    // 获取表结构
    search() {
      this.loading = true
      this.tableddl = ''
      const handleAddClick = {
        appname: this.$route.query.appname,
        opt_type: 'showtable',
        table_name: this.$route.query.tablename,
        env_type: this.$route.query.env_type
      }
      this.$http({
        method: 'POST',
        url: TDDL_SERVER,
        data: {
          ...handleAddClick
        }
      }).then((returnData) => {
        this.tableddl = returnData
        this.$message.success('查询成功')
        this.loading = false
      })
    }
  }
}
