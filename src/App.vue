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
  .el-select-dropdown__item{
    font-size: 8px;
  }
  .el-form-item__label {
    font-size: 8px;
    font-weight: bold;
  }
  .el-submenu__title{
    font-size: 12px;
  }
  .el-menu-item{
    font-size: 12px;
  }
  .el-form-item__label{
    font-size: 10px;
  }
  .pagination{
    font-size: 10px;
  }
  .el-input--medium {
    font-size: 10px;
  }
  .el-dialog__title{
    font-size: 15px;
  }
  .el-button--mini.is-circle{
    padding: 5px;
  }
  .el-cascader-node__label{
    font-size: 8px;
  }
  .query-form{
    font-size: 8px;
  }
  .menu-wrapper {
    width: 190px;
    color: rgba(220, 58, 73, 0.66);
  }
  #app .main-container {
    min-height: 100%;
    -webkit-transition: margin-left .28s;
    transition: margin-left .28s;
    margin-left: 195px;
    position: relative;
    margin-top: -10px;
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
