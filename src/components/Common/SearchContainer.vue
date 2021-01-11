<template>
  <div class="search-container">
    <!-- 搜索框公共容器 -->
    <!-- <h3 class="seach-title">查询条件</h3> -->
    <slot />
  </div>
</template>
<script>
export default {
  data: function() {
    return {}
  }
}
</script>
<style lang='scss' >
.search-container{
  margin-bottom: 15px;
  .no-margin-top {
    .seach-title {
      margin-top: 0;
    }
  }
  .el-input{
    width: 200px !important
  }
  .el-form-item--mini.el-form-item{
    margin-bottom:8px
  }
  .el-date-editor .el-range__close-icon{
    position: absolute;
    right: 0;
  }
}

</style>
