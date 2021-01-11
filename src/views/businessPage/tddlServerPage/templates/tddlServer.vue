<style lang='scss' src="../css/tddlServer.scss" scoped></style>
<script src="../js/tddlServer.js"></script>
<template>
  <div class="credit-record">
    <Box class="content-box">
      <SearchContainer>
        <el-form
          ref="searchForm"
          :inline="true"
          label-width="110px"
          size="mini"
          :rules="rules"
          :model="searchForm"
          class="query-form mb20"
        >
          <el-form-item label="环境类型" prop="env_type">
            <el-select v-model="searchForm.env_type" filterable placeholder="请输入环境类型" @change="getApps">
              <el-option
                v-for="item in options.envOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="app名称" prop="app_name">
            <el-select v-model="searchForm.app_name" filterable placeholder="请输入环境类型" @change="getTables">
              <el-option
                v-for="item in options.appnameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="数据库表" prop="describe">
            <el-select v-model="searchForm.table_name" filterable placeholder="请输入环境类型">
              <el-option
                v-for="item in options.tableOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div><label>SQL语句</label></div>
        <br>
        <div>
          <el-input
            v-model="form.sqlstmt"
            style="display: inline-block"
            autocomplete="off"
            placeholder="sql语句"
            icon="caret-top"
            type="textarea"
            rows="2"
          />
        </div>
        <div class="tc" style="margin-top:10px;">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="update">更新</el-button>
          <el-button type="success" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="info" size="mini" icon="el-icon-zoom-in" @click="queryTableDDL">查询表结构</el-button>
        </div>

      </SearchContainer>
      <br>
      <div v-show="queryFlag">
        <div><label>查询结果</label></div>
        <el-table class="tb-edit" highlight-current-row :data="tableData" style="width: 100%">
          <div v-for="col in cols" :key="col.key">
            <el-table-column :prop="col.prop" :label="col.label" min-width="200" max-width="200" show-overflow-tooltip />
          </div>
        </el-table>
      </div>
    </Box>
  </div>
</template>
