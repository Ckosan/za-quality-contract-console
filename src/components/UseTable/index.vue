<template>
  <div class="use-table">
    <el-table :data="gridData" border class="dialog-table">
      <el-table-column property="nodeName" label="节点名称" />
      <el-table-column property="productCode" label="产品编码" width="150" />
      <el-table-column property="type" label="类型" width="150" />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    gridData: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>
<style lang="scss">
.use-table{
  .dialog-table{
    .cell{
      padding: 5px 8px
    }
  }
}

</style>

