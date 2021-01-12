<style lang='scss' src="../css/applicationList.scss"></style>
<script src="../js/applicationList.js"></script>
<template>
  <div class="credit-record" style="margin-top: -30px;">
    <Box v-loading="loading" class="content-box">
      <SearchContainer style="text-align: center;">
        <el-form ref="searchForm" :inline="true" label-width="110px" size="medium" :rules="rules" :model="searchForm" class="query-form mb20">
          <el-form-item label="项目信息" prop="project_code" class="rowItem">
            <el-select
              v-model="searchForm.projectinfo"
              filterable
              clearable
              placeholder="请选择项目信息"
              auto-complete="off"
              style="width:200px;"
              @change="getApplicationOptions"
            >
              <el-option
                v-for="item in projectNameOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用代码" prop="project_code" class="rowItem">
            <el-select
              v-model="searchForm.applicationinfo"
              filterable
              clearable
              placeholder="请选择应用代码"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in applicationNameOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="tc" style="margin-top:10px;">
          <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="medium" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="success" size="medium" icon="el-icon-plus" @click="addForm">新增</el-button>
        </div>
      </SearchContainer>
      <div style="display: inline-block;margin-bottom: 20px">
        <div style="float: right;">
          <el-input
            v-model="searchTxt"
            style="display: inline-block;width: 400px;height: 15px"
            placeholder="输入关键字"
            @input="seachList"
          ><i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
        </div>
      </div>
      <el-table
        border
        element-loading-spinner="el-icon-loading"
        :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        class="form-table"
        style="font-size: 8px"
        :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          type="index"
          width="60px"
          align="center"
        />
        <el-table-column label="项目信息" prop="project_info" min-width="150px" align="center" sortable>
          <template slot-scope="scope">
            <router-link
              tag="a"
              style="color:#0174DF"
              :to="'/configpage/projectdetail/'+scope.row.project_id"
            ><span class="col-cont" v-html="showDate(scope.row.project_info)" />
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="应用代码"
          prop="application_code"
          min-width="150px"
          align="center"
          show-overflow-tooltip
          sortable
        />
        <el-table-column label="应用简介" prop="application_describe" min-width="250px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.application_describe)" />
          </template>
        </el-table-column>
        <el-table-column label="应用状态" prop="application_status" min-width="100px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.application_status)" />
          </template>
        </el-table-column>
        <el-table-column label="更新信息" prop="application_status" :formatter="convertDataFormat" min-width="110px" align="center" show-overflow-tooltip sortable />
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-tooltip content="应用详情" placement="left">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-view"
                circle
                @click="handleDetail(scope.$index, scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="编辑应用" placement="right">
              <el-button
                v-show="scope.row.permission_type!=1"
                size="mini"
                type="warning"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除应用" placement="right">
              <el-button
                v-show="scope.row.server_info===''&&scope.row.permission_type===2"
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
        :page-sizes="[15, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </Box>

    <!--编辑弹出框-->
    <el-dialog title="修改应用" :visible.sync="editFormVisible" width="40%" :show-close="false" :close-on-click-modal="false">
      <div style="margin-top: 10px">
        <div style="text-align: center;font-size: 20px;font-weight: bold;margin-bottom: 25px"><label>应用信息</label>
        </div>
        <el-form
          ref="editForm"
          :inline="false"
          :rules="rules"
          :model="editForm"
          class="demo-form-inline"
          label-width="100px"
        >
          <el-form-item label="所属项目:" prop="project_id">
            <el-select v-model="editForm.project_info" placeholder="请选择项目名称" style="display: block;">
              <el-option
                v-for="item in projectOptions"
                :key="item.key"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="14">
              <el-form-item label="应用代码:" prop="application_code">
                <el-input v-model="editForm.application_code" maxlength="128" placeholder="请输入应用代码" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="应用状态:" prop="application_status">
                <el-select v-model="editForm.application_status" placeholder="请选择应用状态" style="display: block;">
                  <el-option
                    v-for="item in appStatusOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-form-item label="应用简介:" prop="application_describe">
              <el-input v-model="editForm.application_describe" placeholder="请输入应用简介" maxlength="512" />
            </el-form-item>
          </div>
          <div v-for="(developers,index) in editForm.developers" :key="index">
            <el-form-item label="开发人员:">
              <el-select
                v-model="developers.names"
                multiple
                filterable
                remote
                :allow-create="false"
                default-first-option
                no-match-text="未找到用户"
                no-data-text="未找到用户"
                placeholder="用户关键字进行搜索"
                style="display: block;"
                :loading="loading"
                :remote-method="remoteMethod"
              >
                <el-option
                  v-for="item in staffOptions"
                  :key="item.email"
                  :label="item.label"
                  :value="item.label"
                ><span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-for="(testers,index) in editForm.testers" :key="index">
            <el-form-item label="测试人员:">
              <el-select
                v-model="testers.names"
                multiple
                filterable
                remote
                :allow-create="false"
                default-first-option
                no-match-text="未找到用户"
                no-data-text="未找到用户"
                placeholder="用户关键字进行搜索"
                style="display: block;"
                :loading="loading"
                :remote-method="remoteMethod"
              >
                <el-option
                  v-for="item in staffOptions"
                  :key="item.email"
                  :label="item.label"
                  :value="item.label"
                ><span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div style="margin: 20px 0;" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加应用" :visible.sync="addFormVisible" width="40%" :show-close="false" :close-on-click-modal="false">
      <div style="margin-top: 10px">
        <div style="text-align: center;font-size: 20px;font-weight: bold;margin-bottom: 25px"><label>应用信息</label>
        </div>
        <el-form
          ref="form"
          :inline="false"
          :rules="rules"
          :model="form"
          class="demo-form-inline"
          label-width="100px"
        >
          <el-form-item label="所属项目:" prop="project_id">
            <el-select v-model="form.project_id" placeholder="请选择项目名称" style="display: block;">
              <el-option
                v-for="item in projectOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="14">
              <el-form-item label="应用代码:" prop="application_code">
                <el-input v-model="form.application_code" maxlength="128" placeholder="请输入应用代码" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="应用状态:" prop="application_status">
                <el-select v-model="form.application_status" placeholder="请选择" style="display: block;">
                  <el-option
                    v-for="item in appStatusOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-form-item label="应用简介:" prop="application_describe">
              <el-input v-model="form.application_describe" placeholder="请输入应用简介" maxlength="512" />
            </el-form-item>
          </div>
          <div v-for="(developers,index) in form.developers" :key="index">
            <el-form-item label="开发人员:">
              <el-select
                v-model="developers.names"
                multiple
                filterable
                remote
                :allow-create="false"
                default-first-option
                no-match-text="未找到用户"
                no-data-text="未找到用户"
                placeholder="用户关键字进行搜索"
                style="display: block;"
                :loading="loading"
                :remote-method="remoteMethod"
              >
                <el-option
                  v-for="item in staffOptions"
                  :key="item.email"
                  :label="item.label"
                  :value="item.label"
                ><span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-for="(testers,index) in form.testers" :key="index">
            <el-form-item label="测试人员:">
              <el-select
                v-model="testers.names"
                multiple
                filterable
                remote
                :allow-create="false"
                default-first-option
                no-match-text="未找到用户"
                no-data-text="未找到用户"
                placeholder="用户关键字进行搜索"
                style="display: block;"
                :loading="loading"
                :remote-method="remoteMethod"
              >
                <el-option
                  v-for="item in staffOptions"
                  :key="item.email"
                  :label="item.label"
                  :value="item.label"
                ><span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div style="margin: 20px 0;" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add('form')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
