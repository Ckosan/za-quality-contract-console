<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-menu
        mode="horizontal"
      >
        <el-menu-item>
          <el-dropdown trigger="click">
            <el-tooltip content="友情链接" placement="top">
              <el-button style="border: none;margin-top: -15px">
                <img class="imgstyle" src="../../assets/imgs/link.png">
                <a target="_blank" href="https://wiki.zhonganonline.com/pages/viewpage.action?pageId=40306763" />
              </el-button>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a target="_blank" href="https://ship.zhonganinfo.com/">
                <el-dropdown-item>Ship部署平台</el-dropdown-item>
              </a></el-dropdown-item>
              <el-dropdown-item><a target="_blank" href="https://ft-test.zhonganonline.com/">
                <el-dropdown-item>金融测试平台(测试)</el-dropdown-item>
              </a></el-dropdown-item>
              <el-dropdown-item><a target="_blank" href="https://ft-uat.zhonganonline.com/">
                <el-dropdown-item>金融测试平台(预发)</el-dropdown-item>
              </a></el-dropdown-item>
              <el-dropdown-item><a target="_blank" href="https://wiki.zhonganonline.com/">
                <el-dropdown-item>前往Wiki</el-dropdown-item>
              </a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <el-menu-item>
          <el-tooltip content="帮助中心" placement="top">
            <el-button style="border: none;margin-top: -15px">
              <img class="imgstyle" src="../../assets/imgs/help.png">
            </el-button>
          </el-tooltip>
        </el-menu-item>
        <el-menu-item>
          <el-tooltip content="我的消息" placement="top">
            <el-popover
              placement="bottom"
              width="350"
              trigger="click"
            >
              <template>
                <!--                <ul v-if="currentCount!=0" class="infinite-list" style="overflow:auto">-->
                <!--                  <li v-for="message in loadMessageList" :key="message.id" class="infinite-list-item">-->
                <!--                    【{{-->
                <!--                      message.createTime }}】{{ message.message }}-->
                <!--                  </li>-->
                <!--                </ul>-->
                <div style="margin-left: 180px;margin-bottom: 10px">
                  <el-button style="background: #45c9cd;color: snow" size="mini" @click="updateMessage">全部标记为已读
                  </el-button>
                </div>
                <div>
                  <ul v-if="currentCount!=0" class="infinite-list" style="overflow:auto">
                    <el-timeline style="margin-top: 2px;margin-right: 2px;margin-left: -15px">
                      <el-timeline-item
                        v-for="(message, index) in loadMessageList"
                        :key="index"
                        type="primary"
                        color="#0bbd87"
                        icon="el-icon-chat-dot-round"
                        size="normal"
                        :timestamp="message.createTime"
                      >
                        <el-link
                          target="_blank"
                          style="color:#35b2ed"
                          @click="updateMessageByOne(message)"
                        ><label style="font-size: 6px">{{ message.message }}</label>
                        </el-link>
                      </el-timeline-item>
                    </el-timeline>
                  </ul>
                </div>
              </template>
              <el-button slot="reference" style="border: none" icon="el-icon-message-solid" size="mini">
                <el-badge :value="messageCount" :max="maxCount" class="badge-item" />
              </el-button>
            </el-popover>
          </el-tooltip>
        </el-menu-item>
        <el-menu-item>
          <template>
            <el-dropdown class="avatar-container right-menu-item hover-effect" style="margin-top: -8px" trigger="click">
              <div class="avatar-wrapper" style="margin-top: 0px">
                <img class="imgstyle" src="../../assets/imgs/bussiness-man-fill.png">
                <span style="font-size: 10px;font-weight: bold">{{ currentUserName }}</span>
                <span style="font-size: 8px">{{ departmentName }}</span>
                <i class="el-icon-caret-bottom" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>
                  <span style="display:block;" @click="logout">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-menu-item>
      </el-menu>
      <img src="../../assets/imgs/link.png">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

import { clearLoginInfo } from '@/utils/tools'
import { setTimeout } from 'timers'
import { httpRequestWithoutLoading } from '../../http/interceptors'
import { MESSAGE_API_GET, MESSAGE_API_UPDATE } from '../../contractapi'
import { ws_host } from '../../settings'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      currentCount: 0,
      messageCount: 0,
      maxCount: 20,
      messageList: [],
      loadMessageList: [],
      messageVisible: false,
      websocket: '',
      currentUserName: '',
      departmentName: '',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      memberUrl: '../../assets/imgs/bussiness-man-fill.png',
      helpUrl: '../../assets/imgs/help.png',
      linkUrl: '../../assets/imgs/link.png'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  watch: {},
  mounted() {
  },
  created() {
    setTimeout(() => {
      this.currentUserName = sessionStorage.getItem('currentUserName')
      this.departmentName = sessionStorage.getItem('departmentName')
    }, 1000)
    if ('WebSocket' in window) {
      if (sessionStorage.getItem('currentUserId')) {
        this.websocket = new WebSocket(ws_host + '/websocket/' + sessionStorage.getItem('currentUserId'))
        this.initWebSocket()
      }
    } else {
      alert('当前浏览器 Not support websocket')
    }
    this.initMessageData()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('确认退出吗?', '提示')
        .then(() => {
          clearLoginInfo()
        })
        .catch(() => {

        })
    },
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
      this.messageList = data.messageList
      this.messageCount = data.unReadNum
      this.currentCount = data.total
      this.loadMessageList = this.messageList
    },
    setOncloseMessage() {
    },
    onbeforeunload() {
      this.closeWebSocket()
    },
    closeWebSocket() {
      this.websocket.close()
    },
    showMessage() {
      this.messageVisible = true
    },
    async initMessageData() {
      if (sessionStorage.getItem('currentUserId')) {
        await httpRequestWithoutLoading('GET', MESSAGE_API_GET + '?userId=' + sessionStorage.getItem('currentUserId'))
      }
    },
    async updateMessage() {
      await httpRequestWithoutLoading('POST', MESSAGE_API_UPDATE + '?userId=' + sessionStorage.getItem('currentUserId'))
    },
    updateMessageByOne(message) {
      var temMessage = message
      if (message.optType != '删除') {
        if (temMessage.resourceType === 0) {
          this.$router.push({ path: '/configpage/projectdetail/' + temMessage.resourceId })
        } else if (temMessage.resourceType === 101) {
          this.$router.push({ path: '/configpage/applicationdetail/' + temMessage.resourceId })
        } else if (temMessage.resourceType === 105) {
          this.$router.push({ path: '/configpage/serverdetail/' + temMessage.resourceId })
        } else if (temMessage.resourceType === 1) {
          this.$router.push({
            path: '/configpage/apidataversiondetail/' + temMessage.resourceId,
            query: { type: 'watchDetail', serverId: temMessage.server, version: temMessage.version }
          })
        } else if (temMessage.resourceType === 108) {
          this.$router.push({
            path: '/configpage/apidatabranchdetail/' + temMessage.resourceId + '/' + temMessage.version,
            query: { serverId: temMessage.server }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .el-popover__reference{
    margin-top: -15px;
  }
  .infinite-list {
    height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    overflow: auto;
    background: rgba(232, 243, 254, 0.01);
    color: #7dbcfc;
    font-size: 8px;
  }

  .badge-item {
    margin-top: 10px;
    margin-right: 5px;
    margin-left: -14px;
    margin-bottom: 15px;
  }

  /*.el-button {*/
  /*  margin-right: 5px;*/
  /*  margin-left: 5px;*/
  /*  border: none;*/
  /*  padding: 5px;*/
  /*}*/

  .imgstyle {
    width: 23px;
    height: 23px;
  }

  .ulName {
    display: inline;
    white-space: nowrap;
  }

  .liName {
    height: 30px;
    list-style: none;
    display: inline-block;
    margin: 0px;
    margin-left: 10px;
    text-align: center;

    float: left;
  }

  .divClass {
    float: right;
    height: 30px;
    display: inline-block;
  }

  .spanClass {
    font-size: 12px;
    font-weight: bold;
    margin-top: 0px;

  }

  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    /*border: 1px solid rgba(146, 128, 205, 0.24);*/
    /*background: rgba(190, 255, 248, 0);*/
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .product-tag {
      display: inline-block;
      height: 100%;
      vertical-align: text-bottom;
    }

    .hamburger-container {
      line-height: 50px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      background: #ffffff;
      float: left;
    }
    .el-breadcrumb__item {
      font-size: 12px;
    }
      .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 30px;
      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 2px;
        height: 100%;
        font-size: 10px;
        color: #197fcd;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
