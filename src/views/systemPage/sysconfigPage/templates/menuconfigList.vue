<style lang='scss' src="../css/sysconfigList.scss"></style>
<script src="../js/menuConfig.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
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
          <el-form-item label="标题" prop="key" class="rowItem">
            <el-input
              v-model="searchForm.title"
              style="display: inline-block"
              autocomplete="off"
              placeholder="参数名称"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
          <el-form-item label="父菜单" prop="key" class="rowItem">
            <el-input
              v-model="searchForm.pid"
              style="display: inline-block"
              autocomplete="off"
              placeholder="类型"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
          <el-form-item label="角色" prop="describe" class="rowItem">
            <el-input
              v-model="searchForm.role"
              style="display: inline-block"
              autocomplete="off"
              placeholder="备注"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
          <el-form-item label="是否显示" prop="describe" class="rowItem">
            <el-input
              v-model="searchForm.show"
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
        row-key
        class="form-table"
        style="font-size: 8px"
        :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="80"
          label="序号"
          align="center"
        />
        <el-table-column label="index" prop="index" min-width="100" align="center" show-overflow-tooltip sortable />
        <el-table-column label="标题" prop="title" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column label="图标" prop="icon" min-width="80" align="center" show-overflow-tooltip />
        <el-table-column label="路径" prop="path" min-width="100" align="center" />
        <el-table-column label="组件" prop="component" min-width="100" align="center" />
        <el-table-column label="父菜单" prop="parent_menu_name" min-width="100" align="center" />
        <el-table-column label="角色" prop="role_name" min-width="80" align="center" />
        <el-table-column label="显示" prop="is_show" min-width="50" align="center" />
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
    <el-dialog title="编辑菜单配置" :visible.sync="editFormVisible" width="40%" :show-close="false">
      <br>
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="index" prop="index">
          <el-input v-model="editForm.index" :disabled="true" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="editForm.path" />
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="editForm.component" />
        </el-form-item>
        <el-form-item label="父菜单" prop="pid">
          <el-select v-model="editForm.pid" placeholder="请选择父菜单" @change="changeParent">
            <el-option
              v-for="item in menuOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色" @change="changeRole">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显示" prop="show">
          <el-select v-model="editForm.show" placeholder="请选择是否显示" @change="changeShow">
            <el-option
              v-for="item in showOptions"
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
    <el-dialog title="添加菜单配置" :visible.sync="addFormVisible" width="40%" :show-close="false">
      <br>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="index" prop="index">
          <el-input v-model="form.index" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="form.component" />
        </el-form-item>
        <el-form-item label="父菜单" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择父菜单">
            <el-option
              v-for="item in menuOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显示" prop="show">
          <el-select v-model="form.show" placeholder="请选择是否显示">
            <el-option
              v-for="item in showOptions"
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
