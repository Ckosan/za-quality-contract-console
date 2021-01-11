<template>
  <div :class="{'has-logo':showLogo}" style="background: rgba(84,94,102,0)">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <div class="logo-mod" style="margin-bottom: 50px" @click="$router.push('/dashboard')">
      <img src="./../../../assets/images/za-logo.png">
      <div style="margin-top: 20px"><label style="color:rgba(58,76,99,0.82);font-weight: bolder;margin-left:10%;margin-top: 20% ;font-size: 24px;">Contract</label></div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data() {
    return {

    }
  },

  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {

  }
}
</script>
<style lang="scss">
#app .sidebar-container .el-scrollbar__view > .el-menu{
  margin-top: 60px;
  background: #4dd9d5;
}
.custom-submenu-titel{
	.el-submenu__title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #303133;
    padding: 0 20px;
    list-style: none;
    cursor: pointer;
    position: relative;
    -webkit-transition: border-color .3s, background-color .3s, color .3s;
    transition: border-color .3s, background-color .3s, color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
}
}
.logo-mod {
  position: absolute;
  left: 0;
  top: 0;
  height: 100px;
  background: rgba(84, 94, 102, 0);//#ffffff;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  margin-bottom: 10px;
}

.logo-mod:hover {
   //background: #394d66;
}

.logo-mod>img {
  width: 60%;
  margin-left: 10%;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
