<style lang='scss' src="../css/intervalschedule.scss" scoped></style>
<script src="../js/intervalschedule.js"></script>
<template>
  <div class="credit-record">
    <Box class="content-box">
      <SearchContainer>
        <el-form ref="searchForm" :inline="true" label-width="110px" size="mini" :rules="rules" :model="searchForm" class="query-form mb20">
          <el-form-item label="名称" prop="name">
            <el-input v-model="searchForm.name" clearable placeholder="请输入名称" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="每" prop="every">
            <el-input v-model="searchForm.every" clearable placeholder="请输入每" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="周期" prop="period">
            <el-input v-model="searchForm.period" clearable placeholder="请输入周期" auto-complete="off" style="width:200px;" />
          </el-form-item>
        </el-form>
        <div class="tc" style="margin-top:10px;">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="warning" size="mini" icon="el-icon-plus" @click="addForm">新增</el-button>
        </div>
      </SearchContainer>
      <el-table
        v-loading="regionLoading"
        element-loading-spinner="el-icon-loading"
        :data="list.slice((pager.currentPage-1)*pager.pageSize,pager.currentPage*pager.pageSize)"
        border
        class="form-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column label="名称" prop="name" min-width="200" />
        <el-table-column label="每" prop="every" min-width="200" />
        <el-table-column label="周期" prop="period" min-width="200" />
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteItem(scope.$index,scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pager.currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </Box>

    <!--编辑弹出框-->
    <el-dialog title="编辑定时频率配置" :visible.sync="editFormVisible" width="30%">
      <el-form ref="addForm" :model="editForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="频率">
          <el-input v-model="editForm.every" />
        </el-form-item>
        <el-form-item label="周期">
          <el-select v-model="editForm.period" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加定时频率配置" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="频率">
          <el-input v-model="form.every" />
        </el-form-item>
        <el-form-item label="周期">
          <el-select v-model="form.period" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
