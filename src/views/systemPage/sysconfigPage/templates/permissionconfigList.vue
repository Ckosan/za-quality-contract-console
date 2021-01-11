<style lang='scss' src="../css/sysconfigList.scss"></style>
<script src="../js/permissionList.js"></script>
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
          <el-form-item label="用户信息" prop="key" class="rowItem">
            <el-select
              v-model="searchForm.user_id"
              style="width: 200px"
              filterable
              remote
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in staffOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="角色类型" prop="key" class="rowItem">
            <el-select v-model="searchForm.role_id" placeholder="请输入角色类型">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <el-table-column label="用户名" prop="user_name" min-width="100" align="center" show-overflow-tooltip sortable />
        <el-table-column label="邮箱" prop="email" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column label="用户ID" prop="user_id" min-width="80" align="center" show-overflow-tooltip />
        <el-table-column label="角色" prop="role_name" min-width="80" align="center" />
        <el-table-column label="创建时间" prop="create_time" min-width="150" align="center" />
        <el-table-column label="修改时间" prop="modify_time" min-width="150" align="center" />
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
    <el-dialog title="编辑用用户角色" :visible.sync="editFormVisible" width="30%" :show-close="false">
      <br>
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="用户信息">
          <el-select
            v-model="editForm.user_id"
            style="width: 200px"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="userChange"
          >
            <el-option
              v-for="item in staffOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select v-model="editForm.role_id" placeholder="请输入角色类型">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加用户角色" :visible.sync="addFormVisible" width="30%" :show-close="false">
      <br>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="用户信息">
          <el-select
            v-model="form.user_id"
            style="width: 200px"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in staffOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select v-model="form.role_id" placeholder="请输入角色类型">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add('form')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
