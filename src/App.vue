<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}

</script>
<style>
  .menu-wrapper{
    color: rgba(220, 58, 73, 0.66);
  }
  #app .main-container {
    min-height: 100%;
    -webkit-transition: margin-left .28s;
    transition: margin-left .28s;
    margin-left: 195px;
    position: relative;
    background: rgba(241, 235, 230, 0.66);
  }
  .app-container{
    position:relative;
  }
  .el-button--info {
    color: #fff;
    background-color: #2a4a44;
    border-color: #909399;
  }
  .el-table--border,
  .el-table--group {
    border-radius:10px;
    border-color: rgba(62, 78, 255, 0.29);
  }
</style>
