<style lang='scss' src="../css/sysconfigList.scss"></style>
<script src="../js/cacheList.js"></script>
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
          <el-form-item label="缓存名称" prop="key_name" class="rowItem">
            <el-input
              v-model="searchForm.key_name"
              style="display: inline-block"
              autocomplete="off"
              placeholder="缓存名称"
              icon="caret-top"
              type="text"
              rows="2"
            />
          </el-form-item>
          <el-form-item label="环境类型" prop="env_type" class="rowItem">
            <el-select
              v-model="searchForm.env_type"
              filterable
              clearable
              placeholder="请选择环境类型"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in envTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
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
      <div style="float: left;">
        <el-input
          v-model="searchTxt"
          style="display: inline-block;width: 380px"
          placeholder="输入关键字"
          @input="seachList"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
      <el-table
        element-loading-spinner="el-icon-loading"
        :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
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
        <el-table-column label="环境类型" prop="env_type" min-width="80" align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.env_type)" />
          </template>
        </el-table-column>
        <el-table-column label="缓存名称" prop="key_name" min-width="200" align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.key_name)" />
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="describe" min-width="150" align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.describe)" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" min-width="150" align="center" sortable />
        <el-table-column label="创建人" prop="creator" min-width="100" align="center" />
        <el-table-column label="更新时间" prop="update_time" min-width="150" align="center" sortable />
        <el-table-column label="更新人" prop="modifier" min-width="100" align="center" />
        <el-table-column label="操作" width="150px" align="center">
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
    <el-dialog title="编辑缓存数据" :visible.sync="editFormVisible" width="50%" :show-close="false" :close-on-click-modal="false">
      <div>
        <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
          <el-form-item label="缓存名称" prop="key_name">
            <el-input v-model="editForm.key_name" />
          </el-form-item>
          <el-form-item label="环境类型" prop="env_type">
            <el-select
              v-model="editForm.env_type"
              filterable
              clearable
              placeholder="请选择环境类型"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in envTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="说明" prop="describe">
            <el-input v-model="editForm.describe" />
          </el-form-item>
          <el-form-item label="缓存内容" prop="value">
            <el-input
              v-model="editForm.value"
              style="display: inline-block"
              autocomplete="off"
              placeholder="缓存内容"
              icon="caret-top"
              type="textarea"
              rows="20"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加缓存数据" :visible.sync="addFormVisible" width="50%" :show-close="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="缓存名称" prop="key_name">
          <el-input v-model="form.key_name" />
        </el-form-item>
        <el-form-item label="环境类型" prop="env_type">
          <el-select
            v-model="form.env_type"
            filterable
            clearable
            placeholder="请选择环境类型"
            auto-complete="off"
            style="width:200px;"
          >
            <el-option
              v-for="item in envTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="describe">
          <el-input v-model="form.describe" />
        </el-form-item>
        <el-form-item label="缓存内容" prop="value">
          <el-input
            v-model="form.value"
            style="display: inline-block"
            autocomplete="off"
            placeholder="缓存内容"
            icon="caret-top"
            type="textarea"
            rows="20"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add('form')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
