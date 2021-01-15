<style lang='scss' src="../css/projectList.scss"></style>
<script src="../js/projectList.js"></script>
<template>
  <div v-loading="loloading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <SearchContainer style="text-align: center;">
        <el-form
          ref="searchForm"
          :inline="true"
          label-width="110px"
          size="mini"
          :model="searchForm"
          class="query-form mb20"
        >
          <el-form-item label="一级部门" prop="parent_dept" class="rowItem">
            <el-select
              v-model="searchForm.parent_dept"
              filterable
              clearable
              placeholder="请选择一级部门"
              auto-complete="off"
              style="width:200px;font-size: 8px"
              @change="getSubDept"
            >
              <el-option
                v-for="item in searchDepartmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二级部门" prop="sub_dept" class="rowItem">
            <el-select
              v-model="searchForm.sub_dept"
              filterable
              clearable
              placeholder="请选择二级部门"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in searchSubDeptOPtions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称" prop="project_name" class="rowItem">
            <el-select
              v-model="searchForm.project_name"
              filterable
              clearable
              placeholder="请选择项目名称"
              auto-complete="off"
              style="width:200px;"
              @change="getProjectOptions"
            >
              <el-option
                v-for="item in projectNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="tc" style="margin-top:10px;">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="success" size="mini" icon="el-icon-plus" @click="addForm">新增</el-button>
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
        element-loading-spinner="el-icon-loading"
        :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        class="form-table"
        :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
        style="font-size: 8px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
          sortable
        />
        <el-table-column label="项目归属" prop="deptinfo" min-width="100px" align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.deptinfo)" />
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="projectinfo" min-width="100px" align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.projectinfo)" />
          </template>
        </el-table-column>
        <el-table-column label="项目负责人" prop="owners" min-width="100px" align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.owners)" />
          </template>
        </el-table-column>
        <el-table-column label="关联应用数" prop="application_num" min-width="60px" align="center" />
        <el-table-column
          label="更新信息"
          prop="update_time"
          :formatter="convertDataFormat"
          min-width="80px"
          align="center"
          sortable
        />
        <el-table-column label="操作" width="135" align="center">
          <template slot-scope="scope">
            <div style="margin-right: 7px;margin-left: -7px">
              <el-tooltip content="项目详情" placement="left">
                <el-button
                  v-show="scope.row.permission_type!=0"
                  size="mini"
                  type="primary"
                  icon="el-icon-view"
                  circle
                  @click="handleDetail(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="编辑项目" placement="right">
                <el-button
                  v-show="scope.row.permission_type!=1"
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  circle
                  @click="handleEdit(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="删除项目" placement="bottom">
                <el-button
                  v-show="scope.row.application_num===0&&scope.row.permission_type===2"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteItem(scope.$index,scope.row)"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
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
    <el-dialog
      title="编辑项目"
      :visible.sync="editFormVisible"
      width="60%"
      class="elDiaLog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div style="margin: 10px">
        <div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 25px"><label>项目信息</label>
        </div>
        <el-form
          ref="editForm"
          :inline="false"
          :rules="rules"
          :model="editForm"
          class="demo-form-inline"
          label-width="100px"
          label-position="right"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称:" prop="project_name">
                <el-input v-model="editForm.project_name" maxlength="128" placeholder="请输入项目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目代码:" prop="project_code">
                <el-input v-model="editForm.project_code" maxlength="128" placeholder="请输入项目代码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="一级部门:" prop="parent_dept">
                <el-select
                  v-model="editForm.parent_dept"
                  filterable
                  placeholder="请输入一级部门"
                  style="display: block;"
                  @change="getEditSubDept"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二级部门:" prop="sub_dept">
                <el-select v-model="editForm.sub_dept" filterable placeholder="请输入二级部门" style="display: block;">
                  <el-option
                    v-for="item in subDeptOPtions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目介绍:" prop="project_describe">
            <el-input
              v-model="editForm.project_describe"
              type="textarea"
              placeholder="请输入项目介绍"
              rows="5"
              show-word-limit
              maxlength="2046"
            />
          </el-form-item>
          <div style="margin: 20px 0;" />
          <div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 25px">
            <label>成员信息</label>
          </div>
          <div v-for="(resource_list,index) in editForm.resource_list" :key="index">
            <el-row>
              <el-col :span="4" style="padding: 5px;">
                <el-form-item
                  label-width="0px"
                  :prop="'resource_list.' + index + '.role_name'"
                  :rules="{
                    required: true, message: '组名不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-if="resource_list.role_name=='负责人'"
                    v-model="resource_list.role_name"
                    placeholder="用户组名"
                    auto-complete="off"
                    maxlength="128"
                    disabled
                  />
                  <el-input
                    v-else
                    v-model="resource_list.role_name"
                    placeholder="用户组名"
                    auto-complete="off"
                    maxlength="128"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11" style="padding: 5px;">
                <el-form-item
                  label-width="0px"
                  :prop="'resource_list.' + index + '.user_ids'"
                  :rules="{
                    required: true, message: '用户不能为空', trigger: 'blur'
                  }"
                >
                  <el-select
                    v-model="resource_list.user_ids"
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
                      :value="item.value"
                    ><span style="float: left;font-size: 8px">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 8px">{{ item.email }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" style="padding: 5px;">
                <el-form-item label-width="0px">
                  <template v-if="resource_list.role_name=='负责人'">
                    <el-radio-group v-model="resource_list.permission_type">
                      <el-radio :label="0" disabled>隐藏</el-radio>
                      <el-radio :label="1" disabled>只读</el-radio>
                      <el-radio :label="2">编辑</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-else>
                    <el-radio-group v-model="resource_list.permission_type">
                      <el-radio :label="0">隐藏</el-radio>
                      <el-radio :label="1">只读</el-radio>
                      <el-radio :label="2">编辑</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="padding: 10px;text-align: right;">
                <el-button
                  v-if="resource_list.role_name!='负责人'"
                  type="danger"
                  :loading="addLoading"
                  size="mini"
                  icon="el-icon-close"
                  circle
                  @click="deleteEditMemberList(index)"
                />
                <el-button
                  v-else
                  type="danger"
                  :loading="addLoading"
                  size="mini"
                  icon="el-icon-close"
                  circle
                  style="visibility: hidden;"
                  @click="deleteEditMemberList(index)"
                />
              </el-col>
            </el-row>
          </div>
          <div style="text-align: center;">
            <el-button
              type="success"
              :loading="addLoading"
              icon="el-icon-plus"
              size="mini"
              style="width:10%"
              @click="editMemberList"
            />
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog
      title="添加项目"
      :visible.sync="addFormVisible"
      width="60%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div style="margin: 10px">
        <div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 25px"><label>项目信息</label>
        </div>
        <el-form
          ref="form"
          :inline="false"
          :rules="rules"
          :model="form"
          class="demo-form-inline"
          label-width="100px"
          label-position="right"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称:" prop="project_name">
                <el-input v-model="form.project_name" maxlength="128" placeholder="请输入项目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目代码:" prop="project_code">
                <el-input v-model="form.project_code" maxlength="128" placeholder="请输入项目代码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="一级部门:" prop="parent_dept">
                <el-select
                  v-model="form.parent_dept"
                  filterable
                  placeholder="请输入一级部门"
                  style="display: block;font-size: 8px"
                  @change="getSubDept"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二级部门:" prop="sub_dept">
                <el-select v-model="form.sub_dept" filterable placeholder="请输入二级部门" style="display: block;">
                  <el-option
                    v-for="item in subDeptOPtions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目介绍:" prop="project_describe">
            <el-input
              v-model="form.project_describe"
              type="textarea"
              placeholder="请输入项目介绍"
              rows="5"
              show-word-limit
              maxlength="2046"
            />
          </el-form-item>
          <div style="margin: 20px 0;" />
          <div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 25px">
            <label>成员信息</label>
          </div>
          <div v-for="(resource_list,index) in form.resource_list" :key="index">
            <el-row>
              <el-col :span="4" style="padding: 5px;font-size: 12px">
                <el-form-item
                  label-width="0px"
                  :prop="'resource_list.' + index + '.role_name'"
                  :rules="{
                    required: true, message: '组名不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-if="resource_list.role_name=='负责人'"
                    v-model="resource_list.role_name"
                    placeholder="用户组名"
                    auto-complete="off"
                    maxlength="128"
                    disabled
                  />
                  <el-input
                    v-else
                    v-model="resource_list.role_name"
                    placeholder="用户组名"
                    auto-complete="off"
                    maxlength="128"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11" style="padding: 5px;">
                <el-form-item
                  label-width="0px"
                  :prop="'resource_list.' + index + '.user_ids'"
                  :rules="{
                    required: true, message: '用户不能为空', trigger: 'blur'
                  }"
                >
                  <el-select
                    v-model="resource_list.user_ids"
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
                      :value="item.value"
                    ><span style="float: left;font-size: 8px">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 8px">{{ item.email }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" style="padding: 5px;">
                <el-form-item label-width="0px">
                  <template v-if="resource_list.role_name=='负责人'">
                    <el-radio-group v-model="resource_list.permission_type">
                      <el-radio :label="0" disabled>隐藏</el-radio>
                      <el-radio :label="1" disabled>只读</el-radio>
                      <el-radio :label="2">编辑</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-else>
                    <el-radio-group v-model="resource_list.permission_type">
                      <el-radio :label="0">隐藏</el-radio>
                      <el-radio :label="1">只读</el-radio>
                      <el-radio :label="2">编辑</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="padding: 10px;text-align: right;">
                <el-button
                  v-if="resource_list.role_name!='负责人'"
                  type="danger"
                  :loading="addLoading"
                  size="mini"
                  icon="el-icon-close"
                  circle
                  @click="deleteMemberList(index)"
                />
                <el-button
                  v-else
                  type="danger"
                  :loading="addLoading"
                  size="mini"
                  icon="el-icon-close"
                  circle
                  style="visibility: hidden;"
                  @click="deleteMemberList(index)"
                />
              </el-col>
            </el-row>
          </div>
          <div style="text-align: center;">
            <el-button
              type="success"
              :loading="addLoading"
              icon="el-icon-plus"
              size="mini"
              style="width:10%"
              @click="addMemberList"
            />
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add('form')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
