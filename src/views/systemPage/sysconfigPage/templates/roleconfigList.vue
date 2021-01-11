<style lang='scss' src="../css/sysconfigList.scss"></style>
<script src="../js/roleconfigList.js"></script>
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
          <el-form-item label="角色名称" prop="key" class="rowItem">
            <el-input
              v-model="searchForm.role_name"
              style="display: inline-block"
              autocomplete="off"
              placeholder="角色名称"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
          <el-form-item label="备注" prop="key" class="rowItem">
            <el-input
              v-model="searchForm.remark"
              style="display: inline-block"
              autocomplete="off"
              placeholder="备注"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
        </el-form>
        <div class="tc" style="text-align:center;margin-top:10px;">
          <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="medium" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="success" size="medium" icon="el-icon-plus" @click="addForm">新增</el-button>
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
        <el-table-column label="角色名称" prop="role_name" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column label="角色值" prop="role_value" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="create_time" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column label="修改时间" prop="modify_time" min-width="200" align="center" />
        <el-table-column label="备注" prop="remark" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="left">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="right">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteItem(scope.$index,scope.row)"
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
    <el-dialog title="编辑角色配置" :visible.sync="editFormVisible" width="30%" :show-close="false">
      <br>
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="editForm.role_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="角色值" prop="role_value">
          <el-input v-model="editForm.role_value" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加角色配置" :visible.sync="addFormVisible" width="30%" :show-close="false">
      <br>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" />
        </el-form-item>
        <el-form-item label="角色取值" prop="role_value">
          <el-input v-model="form.role_value" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add('form')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
