<template>
  <div class="page-back-cont">
    <a v-if="!notShowBackBtn" class="back-text" @click="$router.go(-1)"><i class="el-icon-back" />返回</a>
    <slot />
  </div>
</template>
<script>

export default {
  props: ['notShowBackBtn'],
  data: function() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>
<style lang='scss' scoped>
@import "~element-ui/packages/theme-chalk/src/Common/var";
.page-back-cont{
	margin-top:10px;
}
.back-text {
  color:$--color-primary;
  margin-right:10px;
  cursor:pointer;
}
</style>
