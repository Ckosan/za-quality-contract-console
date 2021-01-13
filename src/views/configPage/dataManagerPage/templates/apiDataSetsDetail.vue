<style lang='scss' src="../css/apiDataSetConstructDetail.scss"></style>
<script src="../js/apiDataSetsDetail.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div>
        <el-row style="margin: 10px;">
          <el-col :span="12">
            <div style="font-size: 12px;font-style: italic;color: #8d8d8d;">
              {{ serverInfo.project_name }}&nbsp;/&nbsp;{{ serverInfo.application_name }}
            </div>
            <div style="margin-top: 5px;" />
            <div style="font-size: 10px;font-style: italic;color: #8d8d8d;">
              <b>{{ serverInfo.server_name }}</b>
            </div>
            <div style="font-size: 8px;font-style: italic;color: #8d8d8d;margin-top: 5px">
              <b>{{ apiInfoTitle }}</b>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right;">
              <el-button
                style="background: #6269cd;color: snow"
                icon="el-icon-magic-stick"
                :loading="debugButtonloading"
                @click="handleDebugging"
              >接口调试
              </el-button>
              <el-button type="warning" icon="el-icon-printer" @click="saveDataSetValue">保存
              </el-button>
              <el-button type="info" icon="el-icon-back" @click="goback">用例集列表
              </el-button>
            </div>
          </el-col>
        </el-row>
        <hr style="background: #cecece;border: none;height: 1px; ">
      </div>
      <div style="overflow:hidden;" class="bodyRequest">
        <el-tabs v-model="activeName" type="border-card" stretch>
          <el-tab-pane name="first">
            <span slot="label" style="font-size: 12px"><i class="el-icon-download" /> 配置请求报文</span>
            <br>
            <div style="margin-bottom: 10px"><label style="font-weight: bold;font-size: 15px">请求头：</label></div>
            <el-table
              ref="reqHeaderTable"
              element-loading-spinner="el-icon-loading"
              :data="editForm.req_headers"
              border
              class="form-table"
              style="font-size: 8px"
              row-key="id"
              :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#394d66',color:'#fafafa'}"
              @selection-change="reqheadersChange"
              @select="changeReqHSelect"
            >
              <el-table-column
                type="selection"
                width="55"
                :reserve-selection="selecttable"
              />
              <el-table-column label="字段名" prop="data_key" min-width="100px" align="center" />
              <el-table-column label="参考值" prop="data_value" min-width="300px" align="center">
                <template slot-scope="scope">
                  <div style="display: inline-block">
                    <div style="float: left">
                      <el-input
                        v-model="scope.row.data_value"
                        class="my_input__inner"
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="字段描述" prop="data_describe" min-width="100px" align="center" />
            </el-table>
            <div style="display: inline-block;display-inside: ruby;width: 100%;">
              <div style="float: left;width: 100%;">
                <div style="float: left;margin-right: 30px;margin-top: 20px;margin-bottom: 20px"><label
                  style="font-weight: bold;font-size: 15px"
                >请求体：</label></div>
                <div style="float: right;margin-right: 30px;margin-top: 20px">
                  <el-button
                    type="warning"
                    icon="el-icon-view"
                    size="mini"
                    @click="viewBody"
                  >报文预览
                  </el-button>
                  <el-button type="success" icon="el-icon-question" size="small" @click="searchFunc">函数助手
                  </el-button>
                </div>
                <el-table
                  ref="requestTable"
                  element-loading-spinner="el-icon-loading"
                  :data="editForm.request"
                  border
                  class="form-table"
                  style="font-size: 8px"
                  row-key="id"
                  :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#394d66',color:'#fafafa'}"
                  @selection-change="requestChange"
                  @select="changeReqSelect"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                    :reserve-selection="selecttable"
                  />
                  <el-table-column label="父节点" prop="parent_key" min-width="80px" align="center" />
                  <el-table-column label="字段名" prop="data_key" min-width="80px" align="center" />
                  <el-table-column label="字段类型" prop="data_type" min-width="40px" align="center" />
                  <el-table-column label="字段长度" prop="data_length" min-width="40px" align="center" />
                  <el-table-column label="是否必填" prop="is_null" min-width="40px" align="center" />
                  <el-table-column label="字段描述" prop="data_describe" min-width="100px" align="center" />
                  <el-table-column label="参考值" prop="data_value" min-width="300px" align="center">
                    <template slot-scope="scope">
                      <div style="display: inline-block">
                        <div style="float: left">
                          <el-input
                            v-model="scope.row.data_value"
                            class="my_input__inner"
                          />
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" prop="backup" min-width="100px" align="center" />
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label" style="font-size: 12px"><i class="el-icon-upload2" /> 配置响应报文</span>
            <div>
              <br>
              <div style="margin-bottom: 10px"><label style="font-weight: bold;font-size: 15px">响应头：</label></div>
              <el-table
                ref="respHeaderTable"
                element-loading-spinner="el-icon-loading"
                :data="editForm.resp_headers"
                border
                class="form-table"
                style="font-size: 8px"
                row-key="id"
                :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#394d66',color:'#fafafa'}"
                @selection-change="respHeadersChange"
                @select="changeRespHSelect"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  :reserve-selection="selecttable"
                />
                <el-table-column label="字段名" prop="data_key" min-width="100px" align="center" />
                <el-table-column label="参考值" prop="data_value" min-width="300px" align="center">
                  <template slot-scope="scope">
                    <div style="display: inline-block">
                      <div style="float: left">
                        <el-input
                          v-model="scope.row.data_value"
                          class="my_input__inner"
                        />
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="字段描述" prop="description" min-width="100px" align="center" />
              </el-table>
              <div style="display: inline-block;display-inside: ruby;width: 100%;">
                <div style="float: left;width: 100%;">
                  <div style="float: left;margin-right: 30px;margin-top: 20px;margin-bottom: 20px"><label
                    style="font-weight: bold;font-size: 15px"
                  >响应体：</label></div>
                  <div style="float: right;margin-right: 30px;margin-top: 20px">
                    <el-button
                      type="warning"
                      icon="el-icon-view"
                      size="mini"
                      @click="viewResponseBody"
                    >报文预览
                    </el-button>
                    <el-button type="success" icon="el-icon-question" size="small" @click="searchFunc">函数助手
                    </el-button>
                  </div>
                  <el-table
                    ref="responsTable"
                    element-loading-spinner="el-icon-loading"
                    :data="editForm.response"
                    border
                    class="form-table"
                    style="font-size: 8px"
                    row-key="id"
                    :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#394d66',color:'#fafafa'}"
                    @selection-change="responseChange"
                    @select="changeRespSelect"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                      :reserve-selection="selecttable"
                    />
                    <el-table-column label="父节点" prop="parent_key" min-width="80px" align="center" />
                    <el-table-column label="字段名" prop="data_key" min-width="80px" align="center" />
                    <el-table-column label="字段类型" prop="data_type" min-width="40px" align="center" />
                    <el-table-column label="字段长度" prop="data_length" min-width="40px" align="center" />
                    <el-table-column label="是否必填" prop="is_null" min-width="40px" align="center" />
                    <el-table-column label="字段描述" prop="data_describe" min-width="100px" align="center" />
                    <el-table-column label="参考值" prop="data_value" min-width="300px" align="center">
                      <template slot-scope="scope">
                        <div style="display: inline-block">
                          <div style="float: left">
                            <el-input
                              v-model="scope.row.data_value"
                              class="my_input__inner"
                            />
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="backup" min-width="100px" align="center" />
                  </el-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="函数助手" :visible.sync="funcHeplerDialog" width="35%" :show-close="false" :close-on-click-modal="false">
        <div style="margin-top: 20px">
          <el-form :model="funcForm">
            <el-form-item label="函数模块:">
              <el-select
                v-model="funcForm.funcModel"
                style="width:50%"
                filterable
                placeholder="请选择函数模块"
                @change="getFuncDesc"
              >
                <el-option
                  v-for="item in funcModelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="函数说明:">
              <el-input
                v-model="funcForm.script_sample"
                type="textarea"
                placeholder="无内容"
                readonly="true"
                rows="8"
              />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="funcHeplerDialog = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="报文预览" :visible.sync="jsonPraseVisible" width="40%" :show-close="false" :close-on-click-modal="false">
        <div style="margin-top: 20px;" />
        <el-input v-model="listToJSON" type="textarea" rows="20" placeholder="请输入JSON字符串" />
        <div style="margin: 20px 0;" />
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="jsonPraseVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-loading="debugButtonloading"
        title="HTTP接口调试"
        :visible.sync="debugDialog"
        width="45%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div style="margin-top: 20px">
          <el-form
            ref="httpDebugForm"
            :model="httpDebugForm"
            class="demo-form-inline"
            label-width="100px"
            :rules="rules"
          >
            <el-row>
              <el-col :span="7">
                <el-form-item label="环境选择:" prop="env_type">
                  <el-select v-model="httpDebugForm.env_type" placeholder="请选环境选择" @change="setEnvInfo">
                    <el-option
                      v-for="item in envInfoOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="17">
                <el-form-item label="主机地址:" prop="host">
                  <el-input
                    v-model="httpDebugForm.host"
                    placeholder="请输入主机地址"
                    maxlength="128"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="请求方式:" prop="method_type">
                  <el-select v-model="httpDebugForm.method_type" placeholder="设置请求方式">
                    <el-option
                      v-for="item in methodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="17">
                <el-form-item label="接口地址:" prop="path">
                  <el-input
                    v-model="httpDebugForm.path"
                    placeholder="请输入接口地址"
                    maxlength="256"
                  >
                    <template slot="prepend">/</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="校验开关:">
                  <el-checkbox v-model="httpDebugForm.check_not_null">校验必填</el-checkbox>
                  <el-checkbox v-model="httpDebugForm.check_type">校验类型</el-checkbox>
                  <el-checkbox v-model="httpDebugForm.check_length">校验长度</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-row style="padding: 5px;">
          <el-col :span="12" style="padding: 5px;">
            <div style="margin-bottom: 10px;margin-top: 10px"><label>请求头</label></div>
            <div v-loading="debugloading">
              <el-input
                v-model="httpDebugForm.reqheaders"
                style="display: inline-block"
                autocomplete="off"
                placeholder="请求头"
                icon="caret-top"
                type="textarea"
                rows="5"
              />
            </div>
          </el-col>
          <el-col :span="12" style="padding: 5px;">
            <div style="margin-bottom: 10px;margin-top: 10px"><label>响应头</label></div>
            <div v-loading="rspdebugloading">
              <el-input
                v-model="httpDebugForm.respHeaders"
                style="display: inline-block"
                autocomplete="off"
                placeholder="响应头"
                icon="caret-top"
                type="textarea"
                rows="5"
                readonly
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" style="padding: 5px;">
            <div v-if="httpDebugForm.method_type==='POST'||httpDebugForm.method_type==='PUT'">
              <div
                style="margin-top: 10px;;margin-bottom: 10px"
              ><label>请求报文</label></div>
              <div v-loading="debugloading">
                <el-input
                  v-model="httpDebugForm.body"
                  style="display: inline-block"
                  autocomplete="off"
                  placeholder="请求体"
                  icon="caret-top"
                  type="textarea"
                  rows="10"
                />
              </div>
            </div>
            <div v-if="httpDebugForm.method_type==='GET'||httpDebugForm.method_type==='DELETE'">
              <div
                style="margin-top: 10px;;margin-bottom: 10px"
              ><label>请求参数</label></div>
              <div v-loading="debugloading">
                <el-input
                  v-model="httpDebugForm.body"
                  style="display: inline-block"
                  autocomplete="off"
                  placeholder="请求体"
                  icon="caret-top"
                  type="textarea"
                  rows="10"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="12" style="padding: 5px;">
            <div style="margin-top: 10px;;margin-bottom: 10px"><label>响应结果</label>
              <lable style="float: right;margin-right: 20px;">{{ httpDebugForm.status_code }}</lable>
            </div>
            <div v-loading="rspdebugloading">
              <el-input
                v-model="httpDebugForm.response"
                style="display: inline-block"
                autocomplete="off"
                placeholder="响应结果"
                icon="caret-top"
                type="textarea"
                rows="10"
                readonly
              />
            </div>
          </el-col>
          <el-col :span="24" style="padding: 5px;">
            <div style="margin-top: 10px;margin-bottom: 10px"><label>校验结果</label>
            </div>
            <div v-loading="rspdebugloading">
              <el-input
                v-model="httpDebugForm.check_result"
                style="display: inline-block"
                autocomplete="off"
                placeholder="校验结果"
                icon="caret-top"
                type="textarea"
                rows="2"
                readonly
              />
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button style="float: left" type="warning" @click="getDebugBody">刷新</el-button>
          <el-button type="danger" @click="cancleDebug">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="httpDebugSubmit('httpDebugForm')">调试</el-button>
        </div>
      </el-dialog>
    </Box>
  </div>
</template>
