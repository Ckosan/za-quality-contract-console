<style lang='scss' src="../css/crontabschedule.scss" scoped></style>
<script src="../js/crontabschedule.js"></script>
<template>
  <div class="credit-record">
    <Box class="content-box">
      <SearchContainer>
        <el-form ref="searchForm" :inline="true" label-width="110px" size="mini" :rules="rules" :model="searchForm" class="query-form mb20">
          <el-form-item label="名称" prop="name">
            <el-input v-model="searchForm.name" clearable placeholder="请输入名称" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="分" prop="minute">
            <el-input v-model="searchForm.minute" clearable placeholder="请输入分钟" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="时" prop="hour">
            <el-input v-model="searchForm.hour" clearable placeholder="请输入时" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="星期中某天" prop="day_of_week">
            <el-input v-model="searchForm.day_of_week" clearable placeholder="请输入星期中某天" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="月中某天" prop="day_of_month">
            <el-input v-model="searchForm.day_of_month" clearable placeholder="请输入月中某天" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="年中某月" prop="month_of_year">
            <el-input v-model="searchForm.month_of_year" clearable placeholder="请输入年中某月" auto-complete="off" style="width:200px;" />
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
        <el-table-column label="分" prop="minute" min-width="200" />
        <el-table-column label="时" prop="hour" min-width="200" />
        <el-table-column label="星期中某天" prop="day_of_week" min-width="200" />
        <el-table-column label="月中某天" prop="day_of_month" min-width="200" />
        <el-table-column label="年中某月" prop="month_of_year" min-width="200" />
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

    <!-- 添加弹出框 -->
    <el-dialog title="添加定时器配置" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分钟">
          <el-input v-model="form.minute" />
        </el-form-item>
        <el-form-item label="小时">
          <el-input v-model="form.hour" />
        </el-form-item>
        <el-form-item label="星期中某天">
          <el-input v-model="form.day_of_week" />
        </el-form-item>
        <el-form-item label="月中某天">
          <el-input v-model="form.day_of_month" />
        </el-form-item>
        <el-form-item label="年中某月">
          <el-input v-model="form.month_of_year" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑弹出框-->
    <el-dialog title="编辑定时器配置" :visible.sync="editFormVisible" width="30%">
      <el-form ref="addForm" :model="editForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="分钟">
          <el-input v-model="editForm.minute" />
        </el-form-item>
        <el-form-item label="小时">
          <el-input v-model="editForm.hour" />
        </el-form-item>
        <el-form-item label="星期中某天">
          <el-input v-model="editForm.day_of_week" />
        </el-form-item>
        <el-form-item label="月中某天">
          <el-input v-model="editForm.day_of_month" />
        </el-form-item>
        <el-form-item label="年中某月">
          <el-input v-model="editForm.month_of_year" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
