<template>
  <div v-loading="regionLoading" class="dashboard-editor-container div-zoom">
    <div style="margin-top: 30px;height: auto">
      <div style="display: inline-block;width: 100%;margin-bottom: 50px">
        <div class="div-card-left">
          <el-card class="el-card-index" :body-style="{ padding: '0px',width:'200px' }">
            <div class="div-card-wrap">
              <span class="span-title">我的项目({{ projectCount.tatolProject }})</span>
              <div class="bottom clearfix div-table-inside">
                <div class="div-card-margin" style="margin-top: 40px">
                  <li style="color:#20a0ff;"><label style="font-size:20px">我负责的 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ projectCount.leaderList }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #4dd9d5;"><label style="font-size:20px">我参与的 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ projectCount.participantList }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #8d9407"><label style="font-size:20px">可编辑的 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ projectCount.editAbleList }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #8ca0ff"><label style="font-size:20px">只读的 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ projectCount.readOnlyList }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #ff0000"><label style="font-size:20px">不可见的 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ projectCount.nonViewList }}</label></li>
                </div>
              </div>
            </div>
            <div class="dev-link">
              <router-link
                tag="a"
                style="color:#0174DF;font-weight: bold;font-size:15px"
                :to="'/configpage/project'"
              >前往项目列表
              </router-link>
            </div>
          </el-card>
        </div>
        <div class="div-card-right">
          <el-card class="el-card-index" :body-style="{ padding: '0px',width:'200px' }">
            <div class="div-card-wrap">
              <span class="span-title">我的应用({{ appCount.tatol }})</span>
              <div class="bottom clearfix div-table-inside">
                <div class="div-card-margin" style="margin-top: 40px">
                  <li style="color:#20a0ff;"><label style="font-size:20px">已上线的 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ appCount.realseList }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #ff0000"><label style="font-size:20px">未上线的</label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ appCount.unRealseList }}</label></li>
                </div>
              </div>
            </div>
            <div class="dev-link">
              <router-link
                tag="a"
                style="color:#0174DF;font-weight: bold;font-size:15px"
                :to="'/configpage/application'"
              >前往应用列表
              </router-link>
            </div>
          </el-card>
        </div>
      </div>
      <div style="display: inline-block;width: 100%">
        <div class="div-card-left" style="margin-bottom: 70px">
          <el-card class="el-card-index" :body-style="{ padding: '0px',width:'200px' }">
            <div class="div-card-wrap">
              <span class="span-title">我的服务({{ serverCount.tatol }})</span>
              <div class="bottom clearfix div-table-inside">
                <div class="div-card-margin" style="margin-top: 40px">
                  <li style="color:#20a0ff;"><label style="font-size:20px">API类型服务 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.api }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #4dd9d5;"><label style="font-size:20px">ONS类型服务 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.ons }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #8cbda4"><label style="font-size:20px">OSS类型服务 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.oss }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #8a6d3b"><label style="font-size:20px">SFTP类型服务 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.sftp }}</label></li>
                </div>
              </div>
            </div>
            <div class="dev-link">
              <router-link
                tag="a"
                style="color:#0174DF;font-weight: bold;font-size:15px"
                :to="'/configpage/servermanager'"
              >前往服务列表
              </router-link>
            </div>
          </el-card>
        </div>
        <div class="div-card-right">
          <el-card class="el-card-index" :body-style="{ padding: '0px',width:'200px' }">
            <div class="div-card-wrap">
              <span class="span-title">我的文档({{ serverCount.tatolDoc }})</span>
              <div class="bottom clearfix div-table-inside">
                <div class="div-card-margin" style="margin-top: 40px">
                  <li style="color:#20a0ff;"><label style="font-size:20px">API文档总数 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.apiDoctNun }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #4dd9d5;"><label style="font-size:20px">ONS文档总数 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.onsDocNum }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #8cbda4"><label style="font-size:20px">OSS文档总数 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.ossDocNum }}</label></li>
                </div>
                <div class="div-card-margin">
                  <li style="color: #8a6d3b"><label style="font-size:20px">SFTP文档总数 </label><label style="font-size:20px;margin-right:10px;float: right;font-family: 'Times New Roman'">{{ serverCount.sftpDocNum }}</label></li>
                </div>
              </div>
            </div>
            <div class="dev-link">
              <router-link
                tag="a"
                style="color:#0174DF;font-weight: bold;font-size:15px"
                :to="'/configpage/servermanager'"
              >前往服务列表
              </router-link>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { httpRequest } from '../../../http/interceptors'
import { PROJECT_COUNT } from '../../../contractapi'

export default {
  name: 'DashboardEditor',
  data() {
    return {
      projectCount: {
        tatolProject: 0,
        leaderList: 0,
        participantList: 0,
        editAbleList: 0,
        nonViewList: 0,
        readOnlyList: 0
      },
      appCount: {
        tatol: 0,
        realseList: 0,
        unRealseList: 0
      },
      serverCount: {
        tatol: 0,
        api: 0,
        ons: 0,
        oss: 0,
        sftp: 0,
        tatolDoc: 0,
        apiDoctNun: 0,
        onsDocNum: 0,
        ossDocNum: 0,
        sftpDocNum: 0
      },
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      currentDate: new Date()
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles', 'regionLoading'])
  },
  created() {
    this.getProjectCount()
  },
  mounted() {
    this.refreshCount()
  },
  methods: {
    async getProjectCount() {
      this.projectCount = JSON.parse(sessionStorage.getItem('projectCount'))
      this.appCount = JSON.parse(sessionStorage.getItem('appCount'))
      this.serverCount = JSON.parse(sessionStorage.getItem('serverCount'))
    },
    async refreshCount() {
      if (sessionStorage.getItem('currentUserId')) {
        const returnData = await httpRequest('GET', PROJECT_COUNT + '?userId=' + sessionStorage.getItem('currentUserId'))
        this.appCount = returnData.project
        this.appCount = returnData.application
        this.serverCount = returnData.server
      }
    }
  }
}
</script>

<style lang="scss">
  /*li{ list-style:none}*/
  .div-zoom{
    zoom: 0.8;
  }
  .span-title{
    font-weight: bolder;
    font-size: 26px;
    font-family: 'Times New Roman'
  }
  .el-card{
    border-radius: 20px;
    border: 20px solid #EBEEF5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }
  .div-card-margin{
    margin-top: 20px;
    margin-bottom: 20px
  }
  .div-card-wrap{
    padding: 14px;
    width: 200px;
    height: 280px
  }
  .div-table-inside{
    width:200px;
    text-align: left;
    margin-left: 60px;
    margin-top: 20px
  }
  .div-card-left {
    float: left;
    width: 35%;
    display: inline-block;
    padding: 5px;
    margin-left: 150px;
    margin-right: -150px;
    text-align: center
  }

  .div-card-right {
    float: right;
    width: 35%;
    display: inline-block;
    padding: 5px;
    margin-right: 120px;
    margin-left: -200px;
    text-align: center
  }

  .dev-link {
    margin-top: 20px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .el-card__body {
    width: 40%;
    height: 40%;
  }

  .emptyGif {
    display: block;
    width: 100%;
    margin: 0 auto;
  }

  #container {
    width: 100%;
    display: grid;
    grid: repeat(2, 60px) / auto-flow 80px;
  }

  #container > div {
    background-color: #8ca0ff;
    width: 50px;
    height: 50px;
  }

  .dashboard-editor-container {
    border-radius: 25px;
    background-color: #fff;
    height: 100%;
    padding: 30px 60px 0px;
    margin-top: -15px;
    margin-left: 20px;
    margin-right: 20px;

    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }

    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;

      .display_name {
        font-size: 40px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
