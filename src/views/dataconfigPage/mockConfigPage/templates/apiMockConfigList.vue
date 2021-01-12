<style lang='scss' src="../css/apiMockConfigList.scss"></style>
<script src="../js/apiMockConfigList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div>
        <el-row style="margin: 10px;">
          <el-col :span="12">
            <div style="font-size: 18px;font-style: italic;color: #8d8d8d;">
              {{ project_info }}&nbsp;/&nbsp;{{ application_info }}
            </div>
            <div style="margin-top: 5px;" />
            <div style="font-size: 16px;font-style: italic;color: #8d8d8d;margin-bottom: 5px">
              <b>{{ server_Info }}</b>
            </div>
            <div style="font-size: 14px;font-style: italic;color: #8d8d8d;">
              <b>{{ proxyTitle }}</b>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right;">
              <el-button type="success" size="medium" icon="el-icon-plus" @click="addMockConfig">添加接口</el-button>
              <el-button type="info" icon="el-icon-back" @click="gobackList">代理列表
              </el-button>
              <el-button type="warning" icon="el-icon-right" @click="goback">服务详情
              </el-button>
            </div>
          </el-col>
        </el-row>
        <hr style="background: #cecece;border: none;height: 1px; ">
      </div>
      <div style="margin-top: 20px">
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
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          border
          class="form-table"
          style="font-size: 8px"
          :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
          @expand-change="getFacilityList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="规则"
            width="60"
            align="center"
            type="expand"
            disabled="false"
          >
            <template>
              <div style="display: inline-block;margin-bottom: 20px">
                <div style="float: right;">
                  <el-input
                    v-model="searchexpandTxt"
                    style="display: inline-block;width: 400px;height: 15px"
                    placeholder="输入关键字"
                    @input="seachexpandTableList"
                  ><i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
                </div>
              </div>
              <el-table
                element-loading-spinner="el-icon-loading"
                :data="expandTable"
                class="form-table"
                border
                style="font-size: 8px"
                :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="index"
                  width="60px"
                  label="序号"
                  align="center"
                />
                <el-table-column label="规则名称" prop="name" min-width="100px" align="center">
                  <template slot-scope="scope">
                    <span class="col-cont" v-html="showData(scope.row.name)" />
                  </template>
                </el-table-column>
                <el-table-column label="规则内容" prop="conditions" min-width="180px" align="center">
                  <template slot-scope="scope">
                    <span class="col-cont" v-html="showData(scope.row.conditions)" />
                  </template>
                </el-table-column>
                <el-table-column label="权重" prop="priority" min-width="80px" align="center" sortable />
                <el-table-column label="代理文档" min-width="80px" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.event_type==='mock'&&scope.row.data_type==='version'">
                      <el-link
                        target="_blank"
                        style="color:#0174DF"
                        @click="goToVersionDetail(scope.row)"
                      >{{ scope.row.branch }}
                      </el-link>
                    </div>
                    <div v-if="scope.row.event_type==='mock'&&scope.row.data_type==='branch'">
                      <el-link
                        target="_blank"
                        style="color:#0174DF"
                        @click="goToBranchDetail(scope.row)"
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
                    <div
                      v-if="scope.row.event_type==='mock'&&scope.row.data_type==='dataset'&&scope.row.data_set_list!=null"
                    >
                      <el-link
                        target="_blank"
                        style="color:#0174DF"
                        @click="goToDataSetDetail(scope.row)"
                      >{{ scope.row.data_set_list[0] }}/{{ scope.row.data_set_list[1] }}
                      </el-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="延时(s)" prop="delay" min-width="80px" align="center" />
                <el-table-column label="mock开关" min-width="100px" align="center">
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
                <el-table-column label="请求校验" min-width="100px" align="center">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.check_req"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="开"
                      inactive-text="关"
                      @change="changeReqCheck(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="响应校验" min-width="100px" align="center">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.check_resp"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="开"
                      inactive-text="关"
                      @change="changeRespCheck(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="更新信息"
                  prop="update_time"
                  :formatter="convertTimeFormat"
                  min-width="80px"
                  align="center"
                  sortable
                />
                <el-table-column label="操作" min-width="100px" align="center">
                  <template slot-scope="scope">
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
                        @click="deleteConfigItem(scope.$index,scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                :current-page="currentPage2"
                :page-sizes="[15, 20, 40]"
                :page-size="pagesize2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="expandTable.length"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
              />
            </template>
          </el-table-column>
          <el-table-column label="接口信息" prop="interface_info" min-width="200px" align="center" />
          <el-table-column label="规则数量" prop="num" min-width="80px" align="center" />
          <el-table-column label="开关" prop="is_open" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_open"
                :active-value="1"
                :inactive-value="0"
                active-text="开"
                inactive-text="关"
                @change="changeAllStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="更新信息"
            prop="update_time"
            :formatter="convertTimeFormat"
            min-width="80px"
            align="center"
            sortable
          />
          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-tooltip content="新增规则" placement="top">
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-plus"
                  style="margin: 0px;"
                  circle
                  @click="addApiMockConfig(scope.row)"
                />
              </el-tooltip>
              <el-tooltip v-if="scope.row.num === 0" content="删除配置" placement="top">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  style="margin: 0px;"
                  circle
                  @click="deleteInterfaceProxy(scope.row)"
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
    <!--编辑弹出框-->
    <el-dialog
      title="新增API代理"
      :visible.sync="mockVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
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
              <el-form-item label="选择文档:" prop="interfaceId">
                <el-select
                  v-model="mockAddForm.interfaceId"
                  allow-create
                  filterable
                  placeholder="选择选择文档"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in templatesOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="mockVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addMockSubmit('docForm')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增代理规则"
      :visible.sync="apimockVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <br>
      <div v-loading="addLoading" class="acontent-box">
        <el-form
          ref="docForm"
          :inline="false"
          :rules="rules"
          :model="apimockAddForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="apimockAddForm.name"
                  placeholder="请输入规则名称"
                  maxlength="1024"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内容:" prop="conditions">
                <el-input
                  v-model="apimockAddForm.conditions"
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
                  v-model="apimockAddForm.priority"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入数字，越大越先匹配"
                />
              </el-form-item>
            </el-col>
            <!--            <el-col :span="10">-->
            <!--              <el-form-item label="代理模式:" prop="method">-->
            <!--                <el-select-->
            <!--                  v-model="apimockAddForm.proxyModel"-->
            <!--                  placeholder="请选择代理模式"-->
            <!--                  style="display: block;"-->
            <!--                  @change="changeAdd"-->
            <!--                >-->
            <!--                  <el-option-->
            <!--                    v-for="item in proxyModelOptions"-->
            <!--                    :key="item.value"-->
            <!--                    :label="item.label"-->
            <!--                    :value="item.value"-->
            <!--                  />-->
            <!--                </el-select>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col v-show="apimockAddForm.proxyModelFlag===1" :span="10">
              <el-form-item label="文档来源:" prop="dataType">
                <el-select
                  v-model="apimockAddForm.dataType"
                  placeholder="请选择文档来源"
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
            <el-col v-if="apimockAddForm.dataType==='branch'" :span="24">
              <el-form-item label="分支:" prop="branch">
                <el-select
                  v-model="apimockAddForm.branch"
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
            <el-col v-if="apimockAddForm.dataType==='version'" :span="24">
              <el-form-item label="版本:" prop="version">
                <el-select
                  v-model="apimockAddForm.version"
                  allow-create
                  filterable
                  placeholder="选择已有版本"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in versionDebugOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="apimockAddForm.dataType==='dataset'" :span="24">
              <el-form-item label="用例集:" prop="dataset">
                <el-cascader
                  v-model="apimockAddForm.dataset"
                  :options="datasetOptions"
                  placeholder="请选用例集..."
                  clearable
                  filterable
                  separator=" > "
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <!--            <el-col v-if="apimockAddForm.proxyModel==='route'" :span="24">-->
            <!--              <el-form-item label="环境:" prop="env">-->
            <!--                <el-select-->
            <!--                  v-model="apimockAddForm.route_env"-->
            <!--                  allow-create-->
            <!--                  filterable-->
            <!--                  placeholder="选择环境"-->
            <!--                  style="display: block;"-->
            <!--                >-->
            <!--                  <el-option-->
            <!--                    v-for="item in env_info"-->
            <!--                    :key="item.value"-->
            <!--                    :label="item.label"-->
            <!--                    :value="item.value"-->
            <!--                  />-->
            <!--                </el-select>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="延时:" prop="path">
                <el-input
                  v-model="apimockAddForm.delay"
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
        <el-button type="danger" @click="apimockVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addApiMockSubmit('docForm')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑代理规则"
      :visible.sync="editApiFormVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
    >
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
            <!--<el-col :span="10">
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
            </el-col>-->
            <el-col v-show="editForm.proxyModelFlag===1" :span="10">
              <el-form-item label="文档来源:" prop="dataType">
                <el-select
                  v-model="editForm.dataType"
                  placeholder="请选择文档来源"
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
            <el-col v-show="dataType==='version'" :span="24">
              <el-form-item label="版本:" prop="version">
                <el-select
                  v-model="editForm.version"
                  allow-create
                  filterable
                  placeholder="选择已有版本"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in versionDebugOptions"
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
            <!--<el-col v-show="editForm.proxyModelFlag===2" :span="24">
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
            </el-col>-->
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
        <el-button type="danger" @click="editApiFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('docForm')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
