<style lang='scss' src="../css/tddlconfigList.scss"></style>
<script src="../js/tddlconfigList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <SearchContainer>
        <el-form
          ref="searchForm"
          :inline="true"
          label-width="110px"
          size="medium"
          :rules="rules"
          :model="searchForm"
          class="query-form mb20"
        >
          <el-form-item label="名称" prop="app_name" class="rowItem">
            <el-input
              v-model="searchForm.app_name"
              style="display: inline-block"
              autocomplete="off"
              placeholder="名称"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
          <el-form-item label="环境类型" prop="env_type" class="rowItem">
            <el-select v-model="searchForm.env_type" filterable placeholder="请输入环境类型">
              <el-option
                v-for="item in options.envOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="describe" class="rowItem">
            <el-input
              v-model="searchForm.describe"
              style="display: inline-block"
              autocomplete="off"
              placeholder="描述"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
        </el-form>
        <div class="tc" style="text-align:center;margin-top:10px;">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="success" size="mini" icon="el-icon-plus" @click="addForm">新增</el-button>
        </div>
      </SearchContainer>
      <el-table
        element-loading-spinner="el-icon-loading"
        :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        class="form-table"
        :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="80"
          label="序号"
          align="center"
        />
        <el-table-column label="名称" prop="app_name" min-width="200" align="center" show-overflow-tooltip sortable />
        <el-table-column label="环境类型" prop="env_type" min-width="200" align="center" show-overflow-tooltip sortable />
        <el-table-column label="描述" prop="describe" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteItem(scope.$index,scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="数据库同步" placement="top">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-star-off"
                circle
                @click="syncDB(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </Box>

    <!--编辑弹出框-->
    <el-dialog title="编辑TDDL配置信息" :visible.sync="editFormVisible" width="30%" :show-close="false">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="app名称" prop="app_name">
          <el-input v-model="editForm.app_name" />
        </el-form-item>
        <el-form-item label="环境类型" prop="env_type">
          <el-select v-model="editForm.env_type" filterable placeholder="请输入环境类型">
            <el-option
              v-for="item in options.envOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="editForm.describe" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加TDDL配置信息" :visible.sync="addFormVisible" width="30%" :show-close="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="app名称" prop="app_name">
          <el-input v-model="form.app_name" />
        </el-form-item>
        <el-form-item label="环境类型" prop="env_type">
          <el-select v-model="form.env_type" filterable placeholder="请输入环境类型">
            <el-option
              v-for="item in options.envOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="form.describe" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add('form')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
