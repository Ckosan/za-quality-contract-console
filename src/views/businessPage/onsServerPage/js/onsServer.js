import { mapGetters } from 'vuex'
import {
  APPLICATION,
  ONS_DATA_SERVER,
  ONS_INTERFACE_SERVER,
  ONS_SERVER,
  PROJECT,
  SERVER,
  SYS_CONFIG
} from '../../../../contractapi'

export default {
  data() {
    return {
      loading: false,
      list: [], // 数据存储
      cols: [],
      tableData: [],
      env_type: '测试',
      env: 'TST',
      rules: {},
      queryFlag: false,
      options: {
        projectOptions: [],
        applicationOptions: [],
        serverOptions: [],
        interfaceOptions: []
      },
      form: {
        ons_url: 'http://jbponsaddr-internal.aliyun.com:8080/rocketmq/nsaddr4client-internal',
        access_key: 'LTAIBeYcDxyWHJyc',
        secret_key: 'zaec_test_d799717fc60f85208718c491e91991fb7452969cf5986e669544020e9075cef6a38d700d0f2ed78d3fd3be8800cd159856a971da7e294ffc8bfe50b905278063a7ec735ffefa244cfecc53fbaaee281501',
        topic: 'D-PRELOAN-BBP-180813',
        producer_id: 'PDI-D-PRELOAN-BBP-180813',
        tag: '*',
        reqmsg: '',
        response: ''
      },
      searchForm: {
        project: '',
        application: '',
        server: '',
        interface: ''
      }
    }
  },
  mounted() {
    this.getProjects()
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
    resetForm() {
      this.searchForm.app_name = ''
      this.searchForm.describe = ''
      this.searchForm.env_type = ''
    },
    // 获取TDDL环境拉下列表数据
    getEnvOptions() {
      this.options.envOptions = []
      this.$http({
        method: 'GET',
        url: SYS_CONFIG + '?type=' + 'tddl'
      }).then((returnData) => {
        if (returnData) {
          const listArray = []
          for (const key in returnData) {
            returnData[key].index = key
            listArray.push({
              value: returnData[key].key,
              label: returnData[key].key + '(' + returnData[key].describe + ')'
            })
          }
          this.options.envOptions = listArray
        }
      })
    },
    // 发送ONS
    send() {
      if (!this.form.access_key) {
        this.$message.error('AccessKey不能为空')
      } else {
        const handleAddClick = {
          access_key: this.form.access_key,
          secret_key: this.form.secret_key,
          ons_url: this.form.ons_url,
          producer_id: this.form.producer_id,
          topic: this.form.topic,
          tag: this.form.tag,
          opt_type: 'sendons',
          reqmsg: this.form.reqmsg
        }
        this.$http({
          method: 'POST',
          url: ONS_SERVER,
          data: {
            ...handleAddClick
          }
        }).then((returnData) => {
          this.form.response = returnData
        })
      }
    },
    getProjects() {
      this.searchForm.project = ''
      this.options.projectOptions = []
      this.$http({
        method: 'GET',
        url: PROJECT
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({
              value: returnData[key].id,
              label: returnData[key].project_name + '(' + returnData[key].project_code + ')'
            })
          }
          this.options.projectOptions = ListArray
          sessionStorage.setItem('projects', JSON.stringify(this.options.projectOptions))
        }
      })
    },
    getApplications() {
      this.$http({
        method: 'GET',
        url: APPLICATION + '/?project_id=' + this.searchForm.project
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({
              value: returnData[key].id,
              label: returnData[key].application_name + '(' + returnData[key].application_code + ')'
            })
          }
          this.options.applicationOptions = ListArray
        }
      })
    },
    getOnsServer() {
      this.searchForm.server = ''
      this.options.serverOptions = []
      this.$http({
        method: 'GET',
        url: SERVER + '/?application_id=' + this.searchForm.application + '&server_type=' + 'ONS'
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({
              value: returnData[key].id,
              label: returnData[key].server_name + '(' + returnData[key].server_code + ')'
            })
          }
          this.options.serverOptions = ListArray
        }
      })
    },
    getOnsInterface() {
      this.searchForm.interface = ''
      this.options.interfaceOptions = []
      this.$http({
        method: 'GET',
        url: ONS_INTERFACE_SERVER + '/?server_id=' + this.searchForm.server
      }).then((returnData) => {
        if (returnData) {
          const ListArray = []
          for (const key in returnData) {
            returnData[key].index = key
            ListArray.push({
              value: returnData[key].id,
              label: returnData[key].interface_name + '(' + returnData[key].interface_code + ')'
            })
          }
          this.options.interfaceOptions = ListArray
        }
      })
    },
    // 获取ONS请求报文
    getONSRequest() {
      // 渲染请求消息
      this.$http({
        method: 'GET',
        url: ONS_DATA_SERVER + '/?interface_id=' + this.searchForm.interface
      }).then((returnData) => {
        if (returnData) {
          this.form.reqmsg = returnData
        }
      })
      // 渲染tag
      this.$http({
        method: 'GET',
        url: ONS_INTERFACE_SERVER + '?id=' + this.searchForm.interface
      }).then((returnData) => {
        if (returnData) {
          this.form.tag = returnData[0].tag
        }
      })
    },
    getEnv() {
      if (this.env_type === '测试') {
        this.env = 'TST'
      } else if (this.env_type === '预发') {
        this.env = 'PRE'
      } else if (this.env_type === '生产') {
        this.env = 'PRD'
      } else {
        this.env = ''
      }
      if (this.searchForm.server) {
        this.getONSInfo()
      }
    },
    // 渲染ons信息
    getONSInfo() {
      // 渲染请求消息
      this.$http({
        method: 'GET',
        url: ONS_SERVER + '/?server_id=' + this.searchForm.server + '&env_type=' + this.env
      }).then((returnData) => {
        if (returnData) {
          this.form.access_key = returnData[0].access_key
          this.form.secret_key = returnData[0].secret_key
          this.form.topic = returnData[0].topic
          this.form.producer_id = returnData[0].producer_id
        }
      })
    }
  }
}
