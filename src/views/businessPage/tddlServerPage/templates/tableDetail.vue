<style lang='scss' src="../css/tableDetail.scss" scoped></style>
<script src="../js/tableDetail.js"></script>
<template>
  <div class="credit-record">
    <Box class="content-box">
      <SearchContainer>
        <div v-loading="loading"><label style="align-content: center">{{ tablename }}的表结构-DDL</label></div>
        <br>
        <div>
          <el-input
            v-model="tableddl"
            readonly
            style="display: inline-block;height: auto"
            autocomplete="off"
            placeholder="表结构"
            icon="caret-top"
            type="textarea"
            rows="30"
          />
        </div>
      </SearchContainer>
      <br>
    </Box>
  </div>
</template>
