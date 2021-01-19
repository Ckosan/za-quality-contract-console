<style lang='scss' src="../css/apiDataSetList.scss"></style>
<script src="../js/apiDataSetList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div>
        <el-row style="margin: 10px;">
          <el-col :span="12">
            <div style="font-size: 12px;font-style: italic;color: #8d8d8d;">
              项目信息: {{ project_info }}&nbsp;/&nbsp;{{ application_info }}
            </div>
            <div style="margin-top: 5px;" />
            <div style="font-size: 10px;font-style: italic;color: #8d8d8d;margin-bottom: 5px">
              <b>服务信息: {{ server_Info }}</b>
            </div>
            <div style="font-size: 8px;font-style: italic;color: #8d8d8d;">
              <b>数据集名称: {{ wareHouseTitle }}</b>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right;">
              <el-button type="success" size="mini" icon="el-icon-plus" @click="addMockConfig">添加接口</el-button>
              <el-button type="info" icon="el-icon-back" @click="gobackList">用例集列表
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
            label="用例"
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
                <el-table-column label="用例名称" prop="name" min-width="100px" align="center">
                  <template slot-scope="scope">
                    <span class="col-cont" v-html="showData(scope.row.name)" />
                  </template>
                </el-table-column>
                <el-table-column label="用例描述" prop="description" min-width="200px" align="center">
                  <template slot-scope="scope">
                    <span class="col-cont" v-html="showData(scope.row.description)" />
                  </template>
                </el-table-column>
                <el-table-column label="文档来源" prop="source_type" min-width="80px" align="center">
                  <template slot-scope="scope">
                    <el-link
                      v-if="scope.row.source_type!='default'"
                      target="_blank"
                      style="color:#0174DF"
                      @click="goToDocDetial(scope.row)"
                    ><span
                       class="col-cont"
                       style="font-size: 8px"
                       v-html="showData(convertSourceData(scope.row.source_type))"
                     />
                      <span>&nbsp;|&nbsp;</span>
                      <span class="col-cont" v-html="showData(scope.row.source_value)" />
                    </el-link>
                    <el-link
                      v-if="scope.row.source_type==='default'"
                      target="_blank"
                      style="color:#0174DF"
                      @click="goToDocDetial(scope.row)"
                    ><span
                      class="col-cont"
                      style="font-size: 8px"
                      v-html="showData(convertSourceData(scope.row.source_type))"
                    />
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="契约服务" min-width="60px" align="center">
                  <template slot-scope="scope">
                    <el-popover
                      placement="left"
                      width="80"
                      trigger="hover"
                    >
                      <template>
                        <div>
                          <div class="get-body-item">
                            <el-button
                              size="mini"
                              type="primary"
                              style="background: #6269cd;color: snow;font-size: 8px;width: 80px"
                              icon="el-icon-folder"
                              @click="getDocAll(scope.row)"
                            >全部
                            </el-button>
                          </div>
                          <div class="get-body-item">
                            <el-button
                              size="mini"
                              type="primary"
                              style="background: #6269cd;color: snow;font-size: 8px;width: 80px"
                              icon="el-icon-folder"
                              @click="getDocRequestHeader(scope.row)"
                            >请求头
                            </el-button>
                          </div>
                          <div class="get-body-item">
                            <el-button
                              size="mini"
                              style="background: #cdcb2c;color: snow;font-size: 8px;width: 80px"
                              type="primary"
                              icon="el-icon-tickets"
                              @click="getDocRequestBody(scope.row)"
                            >请求体
                            </el-button>
                          </div>
                          <div class="get-body-item">
                            <el-button
                              size="mini"
                              style="background: #49b6cd;color: snow;font-size: 8px;width: 80px"
                              type="primary"
                              icon="el-icon-document"
                              @click="getDocResponseHeaders(scope.row)"
                            >响应头
                            </el-button>
                          </div>
                          <div class="get-body-item">
                            <el-button
                              size="mini"
                              style="background: #37cd4e;color: snow;font-size: 8px;width: 80px"
                              type="primary"
                              icon="el-icon-date"
                              @click="getDocResponseBody(scope.row)"
                            >响应体
                            </el-button>
                          </div>
                        </div>
                      </template>
                      <el-button slot="reference" style="border: none;margin-left: -7px">
                        <span style="font-size: 8px;color:#0174DF">报文</span>
                      </el-button>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="更新信息"
                  prop="update_time"
                  :formatter="convertTimeFormat"
                  min-width="100px"
                  align="center"
                  sortable
                />
                <el-table-column label="操作" min-width="135" align="center">
                  <template slot-scope="scope">
                    <div style="margin-right: 7px;margin-left: -7px">
                      <el-tooltip content="查看用例" placement="top">
                        <el-button
                          size="mini"
                          type="primary"
                          icon="el-icon-view"
                          style="margin: 0px;"
                          circle
                          @click="handleDataSetEdit(scope.row)"
                        />
                      </el-tooltip>
                      <el-tooltip content="编辑信息" placement="top">
                        <el-button
                          size="mini"
                          type="warning"
                          icon="el-icon-edit"
                          style="margin: 0px;"
                          circle
                          @click="handleContractEdit(scope.$index, scope.row)"
                        />
                      </el-tooltip>
                      <el-tooltip content="删除用例" placement="right">
                        <el-button
                          size="mini"
                          type="danger"
                          icon="el-icon-delete"
                          style="margin: 0px;"
                          circle
                          @click="deleteItem(scope.$index,scope.row)"
                        />
                      </el-tooltip>
                    </div>
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
          <el-table-column label="用例数量" prop="num" min-width="80px" align="center" />
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
              <el-tooltip content="新增用例" placement="top">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  style="margin: 0px;"
                  circle
                  @click="viewApiDataSets(scope.row)"
                />
              </el-tooltip>
              <el-tooltip v-if="scope.row.num === 0" content="删除" placement="top">
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
      title="添加接口"
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
              <el-form-item label="选择接口:" prop="interfaceId">
                <el-select
                  v-model="mockAddForm.interfaceId"
                  allow-create
                  filterable
                  placeholder="请选择接口"
                  style="display: block;width: 60%"
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
      v-loading="addLoading"
      title="新增用例"
      :visible.sync="contractVisible"
      width="35%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <br>
      <div class="content-box">
        <el-form
          ref="addContractForm"
          :inline="false"
          :rules="rules"
          :model="addContractForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="用例名称:" prop="name">
                <el-input
                  v-model="addContractForm.name"
                  placeholder="请输入用例名称"
                  maxlength="256"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="文档来源:" prop="sourceType">
                <el-select
                  v-model="addContractForm.sourceType"
                  placeholder="请选择文档来源"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in sourceTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="addContractForm.sourceType==='branch'" :span="12">
              <el-form-item label="分支:" prop="sourceValue">
                <el-select
                  v-model="addContractForm.sourceValue"
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
            <el-col v-if="addContractForm.sourceType==='version'" :span="24">
              <el-form-item label="版本:" prop="sourceValue">
                <el-select
                  v-model="addContractForm.sourceValue"
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
            <el-col :span="24">
              <el-form-item label="用例描述:" prop="description">
                <el-input
                  v-model="addContractForm.description"
                  type="textarea"
                  rows="3"
                  placeholder="请输入用例描述"
                  maxlength="2046"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="contractVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addContractSubmit('addContractForm')">新建</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-loading="addLoading"
      title="编辑用例"
      :visible.sync="editContractFormVisible"
      width="35%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <br>
      <div class="content-box">
        <el-form
          ref="editContractForm"
          :inline="false"
          :rules="rules"
          :model="editContractForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="用例名称:" prop="name">
                <el-input
                  v-model="editContractForm.name"
                  placeholder="请输入用例名称"
                  maxlength="256"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="文档来源:" prop="sourceType">
                <el-select
                  v-model="editContractForm.sourceType"
                  placeholder="请选择文档来源"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in sourceTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="editContractForm.sourceType==='branch'" :span="24">
              <el-form-item label="分支:" prop="sourceValue">
                <el-select
                  v-model="editContractForm.sourceValue"
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
            <el-col v-if="editContractForm.sourceType==='version'" :span="24">
              <el-form-item label="版本:" prop="sourceValue">
                <el-select
                  v-model="editContractForm.sourceValue"
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
            <el-col :span="24">
              <el-form-item label="用例描述:" prop="description">
                <el-input
                  v-model="editContractForm.description"
                  type="textarea"
                  rows="3"
                  placeholder="请输入用例描述"
                  maxlength="2046"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editContractFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editContractSubmit('editContractForm')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
