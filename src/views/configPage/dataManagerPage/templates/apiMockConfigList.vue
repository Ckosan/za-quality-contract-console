<style lang='scss' src="../css/httpDataConstructDetail.scss"></style>
<script src="../js/apiMockConfigList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div>
        <el-row style="margin: 10px;">
          <el-col :span="12">
            <div style="font-size: 18px;font-style: italic;color: #8d8d8d;">
              {{ serverInfo.project_name }}&nbsp;/&nbsp;{{ serverInfo.application_name }}
            </div>
            <div style="margin-top: 5px;" />
            <div style="font-size: 16px;font-style: italic;color: #8d8d8d;margin-bottom: 5px">
              <b>{{ serverInfo.server_name }}</b>
            </div>
            <div style="font-size: 14px;font-style: italic;color: #8d8d8d;">
              <b>{{ apiInfoTitle }}</b>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right;">
              <el-switch
                v-model="mockSwitch"
                :active-value="1"
                :inactive-value="0"
                active-text="全开"
                inactive-text="全关"
                style="margin-right: 20px"
                @change="changeAllStatus"
              />
              <el-button type="info" icon="el-icon-back" @click="gobackList">mock列表
              </el-button>
              <el-button type="warning" icon="el-icon-right" @click="goback">服务详情
              </el-button>
            </div>
          </el-col>
        </el-row>
        <hr style="background: #cecece;border: none;height: 1px; ">
      </div>
      <div>
        <SearchContainer style="text-align: center;">
          <el-form
            ref="searchForm"
            :inline="true"
            label-width="110px"
            size="medium"
            :rules="rules"
            :model="searchForm"
            class="query-form mb20"
          >
            <el-form-item label="规则名称" prop="describe" class="rowItem">
              <el-input
                v-model="searchForm.name"
                style="display: inline-block"
                autocomplete="off"
                placeholder="名称"
                icon="caret-top"
                type="text"
                rows="2"
              />
            </el-form-item>
            <el-form-item label="规则内容" prop="env_type" class="rowItem">
              <el-input
                v-model="searchForm.conditions"
                style="display: inline-block"
                autocomplete="off"
                placeholder="规则"
                icon="caret-top"
                type="text"
                rows="2"
              />
            </el-form-item>
          </el-form>
          <div class="tc" style="text-align:center;margin-top:10px;">
            <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="warning" size="medium" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="success" size="medium" icon="el-icon-plus" @click="addMockConfig">新增</el-button>
          </div>
        </SearchContainer>
        <el-table
          element-loading-spinner="el-icon-loading"
          :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          border
          class="form-table"
          :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#394d66',color:'#fafafa'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            width="60px"
            label="序号"
            align="center"
          />
          <el-table-column label="规则名称" prop="name" min-width="100px" align="center" />
          <el-table-column label="规则内容" prop="conditions" min-width="180px" align="center" />
          <el-table-column label="权重" prop="priority" min-width="80px" align="center" sortable />
          <el-table-column label="代理模式" prop="event_type" min-width="80px" align="center" />
          <el-table-column label="代理结果" min-width="80px" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.event_type==='route'">
                <label>{{ scope.row.route_env }}</label>
                <el-tooltip
                  class="item env-item"
                  effect="light"
                  :content="getEnvHost(scope.row.route_env)"
                  placement="right-start"
                >
                  <i class="el-icon-warning" />
                </el-tooltip>
              </div>
              <div v-if="scope.row.event_type==='mock'&&scope.row.data_type==='branch'">
                <el-link
                  target="_blank"
                  style="color:#0174DF"
                  @click="goToBranchDetail(scope.row.branch)"
                >{{ scope.row.branch }}
                </el-link>
                <el-tooltip
                  class="item env-item"
                  effect="light"
                  :content="getBranchName(scope.row.branch)"
                  placement="right-start"
                >
                  <i class="el-icon-warning" />
                </el-tooltip>
              </div>
              <div v-if="scope.row.event_type==='mock'&&scope.row.data_type==='dataset'">
                <el-link
                  target="_blank"
                  style="color:#0174DF"
                  @click="goToDataSetDetail(scope.row.data_set_list)"
                >{{ scope.row.data_set_list[0] }}/{{ scope.row.data_set_list[1] }}
                </el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="延时(s)" prop="delay" min-width="80px" align="center" />
          <el-table-column label="更新信息" prop="update_time" :formatter="convertTimeFormat" min-width="80px" align="center" sortable />
          <el-table-column label="规则开关" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_open"
                :active-value="1"
                :inactive-value="0"
                active-text="开"
                inactive-text="关"
                @change="changeStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100px" align="center">
            <template slot-scope="scope">
              <!-- <el-tooltip content="预览" placement="left">
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-view"
                  style="margin: 0px;"
                  circle
                  @click="preViewMockData(scope.$index, scope.row)"
                />
              </el-tooltip> -->
              <el-tooltip content="编辑" placement="top">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  style="margin: 0px;"
                  circle
                  @click="handleEdit(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="right">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  style="margin: 0px;"
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
      </div>
    </Box>
    <el-dialog title="编辑代理规则" :visible.sync="editFormVisible" width="40%" :show-close="false" :close-on-click-modal="false">
      <br>
      <div v-loading="addLoading" class="content-box">
        <el-form
          ref="docForm"
          :inline="false"
          :rules="rules"
          :model="editForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="editForm.name"
                  placeholder="请输入规则名称"
                  maxlength="2046"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内容:" prop="conditions">
                <el-input
                  v-model="editForm.conditions"
                  type="textarea"
                  placeholder="请输入规则内容"
                  rows="5"
                  show-word-limit
                  maxlength="2046"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="权重:" prop="priority">
                <el-input
                  v-model="editForm.priority"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入数字，越大越先匹配"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="代理模式:" prop="proxyModel">
                <el-select
                  v-model="editForm.proxyModel"
                  placeholder="请选择代理模式"
                  style="display: block;"
                  @change="changeModel(editForm)"
                >
                  <el-option
                    v-for="item in proxyModelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="editForm.proxyModelFlag===1" :span="10">
              <el-form-item label="数据来源:" prop="dataType">
                <el-select
                  v-model="editForm.dataType"
                  placeholder="请选择数据来源"
                  style="display: block;"
                  @change="changeDataSource"
                >
                  <el-option
                    v-for="item in dataTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="dataType==='branch'" :span="24">
              <el-form-item label="分支:" prop="branch">
                <el-select
                  v-model="editForm.branch"
                  allow-create
                  filterable
                  placeholder="选择已有分支"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in branchOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="dataType==='dataset'" :span="24">
              <el-form-item label="用例集:" prop="dataset">
                <el-cascader
                  v-model="editForm.dataset"
                  :options="datasetOptions"
                  placeholder="请选用例集..."
                  clearable
                  filterable
                  separator=" > "
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col v-show="editForm.proxyModelFlag===2" :span="24">
              <el-form-item label="环境:" prop="env">
                <el-select
                  v-model="editForm.route_env"
                  filterable
                  placeholder="选择环境"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in env_info"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="延时:" prop="path">
                <el-input
                  v-model="editForm.delay"
                  placeholder="请输入延时"
                  oninput="value=value.replace(/[^\d]/g,'')"
                >
                  <template slot="append">秒(s)</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('docForm')">保存</el-button>
      </div>
    </el-dialog>
    <!--编辑弹出框-->
    <el-dialog title="新增代理规则" :visible.sync="mockVisible" width="40%" :show-close="false" :close-on-click-modal="false">
      <br>
      <div v-loading="addLoading" class="acontent-box">
        <el-form
          ref="docForm"
          :inline="false"
          :rules="rules"
          :model="mockAddForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="mockAddForm.name"
                  placeholder="请输入规则名称"
                  maxlength="1024"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内容:" prop="conditions">
                <el-input
                  v-model="mockAddForm.conditions"
                  type="textarea"
                  placeholder="请输入规则内容"
                  rows="3"
                  maxlength="1024"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="权重:" prop="priority">
                <el-input
                  v-model="mockAddForm.priority"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入数字，越大越先匹配"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="代理模式:" prop="method">
                <el-select
                  v-model="mockAddForm.proxyModel"
                  placeholder="请选择代理模式"
                  style="display: block;"
                  @change="changeAdd"
                >
                  <el-option
                    v-for="item in proxyModelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="mockAddForm.proxyModelFlag===1" :span="10">
              <el-form-item label="数据来源:" prop="dataType">
                <el-select
                  v-model="mockAddForm.dataType"
                  placeholder="请选择数据来源"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in dataTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="mockAddForm.dataType==='branch'" :span="24">
              <el-form-item label="分支:" prop="branch">
                <el-select
                  v-model="mockAddForm.branch"
                  allow-create
                  filterable
                  placeholder="选择已有分支"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in branchOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="mockAddForm.dataType==='dataset'" :span="24">
              <el-form-item label="用例集:" prop="dataset">
                <el-cascader
                  v-model="mockAddForm.dataset"
                  :options="datasetOptions"
                  placeholder="请选用例集..."
                  clearable
                  filterable
                  separator=" > "
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="mockAddForm.proxyModel==='route'" :span="24">
              <el-form-item label="环境:" prop="env">
                <el-select
                  v-model="mockAddForm.route_env"
                  allow-create
                  filterable
                  placeholder="选择环境"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in env_info"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="延时:" prop="path">
                <el-input
                  v-model="mockAddForm.delay"
                  placeholder="请输入延时"
                  oninput="value=value.replace(/[^\d]/g,'')"
                >
                  <template slot="append">秒(s)</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button type="success" :loading="addLoading" @click="addBranchSubmit('docForm')">新增分支</el-button>-->
        <el-button type="danger" @click="mockVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addMockSubmit('docForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
