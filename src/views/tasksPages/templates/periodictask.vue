<style lang='scss' src="../css/periodictask.scss" scoped></style>
<script src="../js/periodictask.js"></script>
<template>
  <div class="credit-record">
    <Box class="content-box">
      <SearchContainer>
        <el-form ref="searchForm" :inline="true" label-width="110px" size="mini" :rules="rules" :model="searchForm" class="query-form mb20">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="searchForm.name" clearable placeholder="请输入名称" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="任务" prop="task">
            <el-select v-model="searchForm.task" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in taskoptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="间隔类型" prop="interval">
            <el-select v-model="searchForm.interval" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in intervaloptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="定时类型" prop="crontab">
            <el-select v-model="searchForm.crontab" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in crontaboptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生效" prop="enabled">
            <el-select v-model="searchForm.enabled" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in enabledoptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <div class="tc" style="margin-top:10px;">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="warning" size="mini" icon="el-icon-plus" @click="addForm">新增</el-button>
          </div>
        </el-form>
      </SearchContainer>
      <el-table
        v-loading="loading"
        :data="list.slice((pager.currentPage-1)*pager.pageSize,pager.currentPage*pager.pageSize)"
        element-loading-spinner="el-icon-loading"
        border
        class="form-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column label="任务名称" prop="name" min-width="200" />
        <el-table-column label="任务" prop="task" min-width="200" />
        <!--        <el-table-column label="参数" prop="args" min-width="200" />-->
        <el-table-column label="key参数" prop="kwargs" min-width="200" />
        <el-table-column label="定时类型" prop="crontab" min-width="150" />
        <el-table-column label="间隔类型" prop="interval" min-width="150" />
        <el-table-column label="失效时间" prop="expires" min-width="200" :formatter="dateFormat" />
        <el-table-column label="生效" prop="enabled" min-width="50" :formatter="flagFormat" />
        <el-table-column label="最后执时间" prop="last_run_at" min-width="200" :formatter="dateFormat" />
        <el-table-column label="执行总数" prop="total_run_count" min-width="150" />
        <el-table-column label="操作" width="150px">
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
    <el-dialog title="添加定时任务配置" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="任务">
          <el-select v-model="form.task" placeholder="请选择">
            <el-option
              v-for="item in taskoptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="key参数">
          <el-input v-model="form.kwargs" type="textarea" />
        </el-form-item>
        <el-form-item label="失效时间">
          <el-date-picker
            v-model="form.expires"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="是否生效">
          <el-radio v-model="form.enabled" label="true">是</el-radio>
          <el-radio v-model="form.enabled" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="类型" prop="args">
          <el-select v-model="form.crontabtype" placeholder="请选择">
            <el-option
              v-for="item in crontabtypeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.crontabtype === '频率'" label="间隔类型" prop="args">
          <el-select v-model="form.interval" placeholder="请选择">
            <el-option
              v-for="item in intervaloptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.crontabtype === '时间段'" label="定时类型" prop="args">
          <el-select v-model="form.crontab" placeholder="请选择">
            <el-option
              v-for="item in crontaboptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addPriodictTask">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑弹出框-->
    <el-dialog title="编辑定时任务配置" :visible.sync="editFormVisible" width="30%">
      <el-form ref="addForm" :model="editForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="任务">
          <el-select v-model="editForm.task" placeholder="请选择">
            <el-option
              v-for="item in taskoptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="key参数">
          <el-input v-model="editForm.kwargs" type="textarea" />
        </el-form-item>
        <el-form-item label="失效时间">
          <el-date-picker
            v-model="editForm.expires"
            :formatter="dateFormat"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="生效">
          <el-select v-model="editForm.enabled">
            <el-option
              v-for="item in enabledoptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="间隔类型">
          <el-select v-model="editForm.interval" placeholder="请选择">
            <el-option
              v-for="item in intervaloptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="定时类型">
          <el-select v-model="editForm.crontab" placeholder="请选择">
            <el-option
              v-for="item in crontaboptions"
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
  </div>
</template>
