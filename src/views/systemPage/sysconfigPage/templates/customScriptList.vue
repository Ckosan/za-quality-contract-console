<style lang='scss' src="../css/sysconfigList.scss" scoped></style>
<script src="../js/customScriptList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record">
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
          <el-form-item label="脚本名称" prop="script_name">
            <el-input
              v-model="searchForm.script_name"
              style="display: inline-block"
              autocomplete="off"
              placeholder="参数名称"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
          <el-form-item label="类型" prop="script_type">
            <el-select
              v-model="searchForm.script_type"
              filterable
              clearable
              placeholder="请选择类型"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in scriptTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="脚本说明" prop="script_describe">
            <el-input
              v-model="searchForm.script_describe"
              style="display: inline-block"
              autocomplete="off"
              placeholder="备注"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
        </el-form>
        <div class="tc" style="margin-top:10px;">
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column label="脚本名称" prop="script_name" min-width="150" />
        <el-table-column label="脚本说明" prop="script_describe" min-width="200" />
        <el-table-column label="脚本类型" prop="script_type" min-width="100" />
        <el-table-column label="创建时间" prop="create_time" min-width="150" />
        <el-table-column label="创建人" prop="creator" min-width="100" />
        <el-table-column label="更新时间" prop="update_time" min-width="150" />
        <el-table-column label="更新人" prop="modifier" min-width="100" />
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteItem(scope.$index,scope.row)"
            >删除
            </el-button>
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
    <el-dialog title="编辑脚本配置" :visible.sync="editFormVisible" width="50%" :show-close="false">
      <div>
        <el-form ref="editForm" :model="editForm" label-width="100px">
          <el-form-item label="脚本名称">
            <el-input v-model="editForm.script_name" />
          </el-form-item>
          <el-form-item label="脚本类型">
            <el-select
              v-model="editForm.script_type"
              filterable
              clearable
              placeholder="请选择脚本类型"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in scriptTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="脚本说明">
            <el-input v-model="editForm.script_describe" />
          </el-form-item>
        </el-form>
        <label>脚本内容</label>
        <p />
        <template>
          <MyEditor
            ref="child"
            :language="scriptType"
            :codes="editForm.script_context"
            @onMounted="htmlOnMounted"
            @onCodeChange="htmlOnCodeChange"
          />
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加脚本配置" :visible.sync="addFormVisible" width="50%" :show-close="false">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="脚本名称">
          <el-input v-model="form.script_name" />
        </el-form-item>
        <el-form-item label="脚本类型">
          <el-select
            v-model="form.script_type"
            filterable
            clearable
            placeholder="请选择脚本类型"
            auto-complete="off"
            style="width:200px;"
          >
            <el-option
              v-for="item in scriptTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="脚本说明">
          <el-input v-model="form.script_describe" />
        </el-form-item>
      </el-form>
      <label>脚本内容</label>
      <p />
      <template>
        <MyEditor
          ref="child"
          :language="scriptType"
          :codes="form.script_context"
          @onMounted="htmlOnMounted"
          @onCodeChange="htmlOnCodeChange"
        />
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
