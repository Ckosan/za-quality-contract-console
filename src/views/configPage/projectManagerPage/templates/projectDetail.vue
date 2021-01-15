<style lang='scss' src="../css/projectdetail.scss"></style>
<script src="../js/projectdetail.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <el-row style="text-align: left;">
        <span style="font-size: 4px;color: #6a686b;">
          <span>「{{ projectDetail.creater }}」创建于「{{ projectDetail.create_time }}」</span>
          <span v-if="projectDetail.update_time!=projectDetail.create_time">
            ，「{{ projectDetail.modifier }}」最后修改于「{{ projectDetail.update_time }}」
          </span>
        </span>
        <el-button type="info" style="float: right;margin-left: 20px" icon="el-icon-back" @click="goback">项目列表
        </el-button>
        <el-button type="warning" style="float: right;" icon="el-icon-edit" @click="editHandle">编辑项目</el-button>
      </el-row>
      <section>
        <div style="margin-top: 30px;display: inline-block">
          <div style="float: left"><label style="font-weight: bold;font-size: 15px">项目信息</label></div>
        </div>
        <div class="app-container">
          <div style="display: inline-block">
            <div style="float:left;margin-bottom: 20px;margin-top: 10px;margin-right: 5rem"><label
              style="font-size: 12px"
            >项目名称：<label
              style="font-weight: normal"
            >{{ projectDetail.project_name }}({{
              projectDetail.project_code }})</label></label></div>
            <div style="float:right;margin-bottom: 20px;margin-top: 10px"><label style="font-size: 12px">项目归属：<label
              style="font-weight: normal"
            >{{ projectDetail.parentdept_name
            }}/{{
              projectDetail.subdept_name }}</label></label></div>
          </div>
          <div style="margin-bottom: 20px;margin-top: 20px"><label style="font-size: 12px">项目介绍：</label></div>
          <div>
            <el-input
              v-model="projectDetail.project_describe"
              style="display: inline-block;font-weight: normal;font-size: 11px"
              autocomplete="off"
              icon="caret-top"
              type="textarea"
              rows="5"
              readonly
            />
          </div>
        </div>
      </section>
      <section>
        <div><label style="font-weight: bold;font-size: 15px;">成员信息</label></div>
        <div class="app-container">
          <el-table
            :data="resourceList"
            border
            :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266','text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            prop="role_name"
            style="width: 50%;font-weight: normal;text-align: center;font-size: 8px"
          >
            <el-table-column
              prop="role_name"
              label="用户组名"
              min-width="50"
            />

            <el-table-column
              prop="userInfo"
              label="关联用户"
              min-width="200"
            />
          </el-table>
        </div>
      </section>
      <div>
        <div style="float: left"><label style="font-weight: bold;font-size: 15px">应用列表</label></div>
        <div style="float: right;margin-right: 30px;margin-bottom: 5px">
          <el-button type="success" style="float: right;" icon="el-icon-plus" size="mini" @click="addAppClick">新增应用
          </el-button>
        </div>
      </div>
      <div style="text-align: center" class="eltable">
        <el-table
          element-loading-spinner="el-icon-loading"
          :data="projectDetail.applications"
          border
          :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
          class="form-table"
          style="font-size: 8px"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column label="应用名称" prop="application_name" min-width="70px" align="center" />
          <el-table-column label="应用代码" prop="application_code" min-width="70px" align="center" />
          <el-table-column
            label="应用描述"
            prop="application_describe"
            min-width="130px"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column label="状态" prop="application_status" min-width="50px" align="center" />
          <el-table-column label="操作" width="160" align="center">
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
              <el-tooltip content="删除应用" placement="left">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handleDeleteApplication(scope.$index, scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog title="编辑项目" :visible.sync="editVisible" width="60%" class="elDiaLog" :show-close="false">
        <div style="margin: 10px">
          <div style="text-align: center;font-size: 20px;font-weight: bold;margin-bottom: 25px"><label>项目信息</label>
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
            <div style="text-align: center;font-size: 20px;font-weight: bold;margin-bottom: 25px">
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
                      ><span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
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
          <el-button type="danger" @click="editVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="添加应用"
        :visible.sync="addAppClickVisible"
        width="40%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div style="margin-top: 10px">
          <div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 25px"><label>应用信息</label>
          </div>
          <el-form
            ref="appform"
            :inline="false"
            :rules="rules"
            :model="appform"
            class="demo-form-inline"
            label-width="100px"
          >
            <el-row>
              <el-col :span="14">
                <el-form-item label="应用代码:" prop="application_code">
                  <el-input v-model="appform.application_code" maxlength="128" placeholder="请输入应用代码" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="应用状态:" prop="application_status">
                  <el-select v-model="appform.application_status" placeholder="请选择" style="display: block;">
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
                <el-input v-model="appform.application_describe" placeholder="请输入应用简介" maxlength="512" />
              </el-form-item>
            </div>
            <div v-for="(developers,index) in appform.developers" :key="index">
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
            <div v-for="(testers,index) in appform.testers" :key="index">
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
          <el-button type="danger" @click="addAppClickVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="addApp('appform')">保存</el-button>
        </div>
      </el-dialog>
    </Box>
  </div>
</template>
