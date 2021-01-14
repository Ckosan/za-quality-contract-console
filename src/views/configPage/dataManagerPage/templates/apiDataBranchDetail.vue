<style lang='scss' src="../css/httpDataConstructDetail.scss"></style>
<script src="../js/apiDataBranchDetail.js"></script>
<template>
  <Box class="content-box" style="margin-top: -10px;">
    <div v-loading="regionLoading" style="width: 100%">
      <div>
        <div>
          <el-row style="margin: 10px;">
            <el-col :span="12">
              <div style="font-size: 12px;font-style: italic;color: #8d8d8d;">
                项目信息: {{ serverInfo.project_name }}&nbsp;/&nbsp;{{ serverInfo.application_name }}
              </div>
              <div style="margin-top: 5px;" />
              <div style="font-size: 10px;font-style: italic;color: #8d8d8d;">
                <b>服务信息: {{ serverInfo.server_name }}</b>
              </div>
              <div style="margin-top: 5px;" />
              <div style="font-size: 8px;font-style: italic;color: #8d8d8d;">
                <b>API信息: {{ apiInfoTitle }}</b>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right;">
                <el-button
                  v-show="!submitFlag"
                  v-if="permission_type == 2"
                  type="success"
                  icon="el-icon-edit"
                  @click="changeSubmit"
                >编辑
                </el-button>
                <el-button
                  v-show="submitFlag"
                  type="primary"
                  icon="el-icon-check"
                  @click="saveBranchData"
                >提交
                </el-button>
                <el-button type="info" icon="el-icon-back" @click="goback">返回
                </el-button>
                <!--          <el-button type="success" icon="el-icon-printer" @click="closeTab">提交</el-button>-->
                <!--        <el-button type="warning" icon="el-icon-share" @click="exportDataToExcel">导出到Excel</el-button>-->
              </div>
            </el-col>
          </el-row>
          <hr style="background: #cecece;border: none;height: 1px; ">
          <el-row style="margin: 10px;">
            <el-col :span="24" style="text-align: right;">
              <!-- <div style="font-size: small;color: #6a686b;">
                  当前分支：{{ branch }}<span>，最新版本：{{ httpInfo.version }}</span>
              </div> -->
            </el-col>
          </el-row>
        </div>
        <div style="display: inline-block;width: 100%;">
          <div style="float: left">
            <label style="font-weight: bold;font-size: 15px">
              文档信息<label style="font-size: 10px;color: #888888;">
                （当前分支：{{ branch }}<span style="font-size: 10px">，最新版本：{{ httpInfo.version }}</span>）
              </label>
            </label>
          </div>
          <div style="float: right;margin-left: 60px">
            <el-button
              style="background: #6269cd;color: snow"
              icon="el-icon-magic-stick"
              size="mini"
              :loading="debugButtonloading"
              @click="handleDebugging"
            >接口调试
            </el-button>
            <el-button type="success" icon="el-icon-question" size="mini" @click="searchFunc">函数助手
            </el-button>
          </div>
        </div>
        <!--        <div style="margin: 20px 20px 20px 0px;">-->
        <!--          <el-form label-width="150px">-->
        <!--            <el-form-item label="报文继承:" prop="group_code">-->
        <!--              <el-cascader-->
        <!--                v-model="publicValue"-->
        <!--                disabled-->
        <!--                :options="options.publicOptions"-->
        <!--                placeholder="选择接口，可继承请求和响应信息"-->
        <!--                clearable-->
        <!--                separator=" > "-->
        <!--                style="width: 500px;"-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--          </el-form>-->
        <!--        </div>-->
        <div v-if="serverInfo.server_type ==='API'" style="overflow:hidden;" class="bodyRequest">
          <el-tabs v-model="activeName" type="border-card" stretch>
            <el-tab-pane name="first" @click="refresh" @change="refresh">
              <span slot="label" style="font-size: 12px"><i class="el-icon-download" /> 配置请求报文</span>
              <br>
              <div><label style="font-weight: bold;font-size: 15px">请求头：</label></div>
              <div style="height: auto;overflow: hidden;">
                <br>
                <HotTable ref="headersTextHot" :disabled="!submitFlag" :root="test" :settings="headerSettings" />
              </div>
              <br>
              <div style="display: inline-block;display-inside: ruby;width: 100%">
                <div style="float: left;width: 100%;">
                  <div style="float: left;margin-right: 30px;margin-top: 10px;margin-bottom: 15px"><label
                    style="font-weight: bold;font-size: 15px"
                  >请求体：</label></div>
                  <div style="float: left;margin-left: 20px;margin-top: 5px">
                    <el-input
                      v-model="searchTxt"
                      style="display: inline-block;width: 300px;height: 15px"
                      placeholder="输入关键字"
                      @input="seachData"
                    ><i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
                    <label v-if="searchCount!='0'" style="font-weight: normal;font-size: 8px">共查到 <label style="color: #ff0f20">{{ searchCount }} </label>处</label>
                  </div>
                  <div style="float: right;margin-left: 60px">
                    <el-button type="primary" icon="el-icon-upload" size="mini" :disabled="!submitFlag" @click="requestImportJson">
                      JSON导入
                    </el-button>
                    <el-button
                      type="warning"
                      icon="el-icon-view"
                      size="mini"
                      @click="viewBody"
                    >报文预览
                    </el-button>
                  </div>
                </div>
              </div>
              <br>
              <div style="height: auto;overflow: hidden;">
                <HotTable ref="bodyTextHot" :root="test" :settings="hotSettings" />
              </div>
            </el-tab-pane>
            <el-tab-pane name="second" @click="refresh" @change="refresh">
              <span slot="label" style="font-size: 12px"><i class="el-icon-upload2" /> 配置响应报文</span>
              <div>
                <br>
                <div><label style="font-weight: bold;font-size: 15px">响应头：</label></div>
                <div style="height: auto;overflow: hidden;">
                  <br>
                  <HotTable
                    ref="rspheadersTextHot"
                    :disabled="!submitFlag"
                    :root="testRespone"
                    :settings="rspheaderSettings"
                  />
                </div>
                <br>
                <div style="display: inline-block;display-inside: ruby;width: 100%;">
                  <div style="float: left;width: 100%;">
                    <div style="float: left;margin-right: 30px;margin-top: 10px;margin-bottom: 15px"><label
                      style="font-weight: bold;font-size: 15px"
                    >响应体：</label></div>
                    <div style="float: left;margin-left: 20px;margin-top: 5px">
                      <el-input
                        v-model="searchTxt"
                        style="display: inline-block;width: 300px;height: 15px"
                        placeholder="输入关键字"
                        @input="seachBodyData"
                      ><i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
                      <label v-if="searchCount!='0'" style="font-weight: normal;font-size: 8px">搜索结果共有 <label style="color: #ff0f20">{{ searchCount }} </label>处</label>
                    </div>
                    <div style="float: right;margin-left: 60px">
                      <el-button type="primary" icon="el-icon-upload" size="mini" :disabled="!submitFlag" @click="importJson">JSON导入
                      </el-button>
                      <el-button
                        type="warning"
                        icon="el-icon-view"
                        size="small"
                        @click="viewRespBody"
                      >报文预览
                      </el-button>
                    </div>
                  </div>
                </div>
                <br>
                <div style="height: auto;overflow: hidden;">
                  <HotTable ref="httpresponseTextHot" :settings="httpResponseSettings" />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!--http区域-->

      <el-dialog title="JSON导入" :visible.sync="jsonImportVisible" width="40%" :show-close="false" :close-on-click-modal="false">
        <div style="margin-top: 20px;" />
        <el-input v-model="jsonForm.jsonDta" type="textarea" rows="20" placeholder="JSON导入" />
        <div style="margin: 20px 0;" />
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="jsonImportVisible = false">取 消</el-button>
          <el-button type="primary" @click="importJsonSubmit">提交</el-button>
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
      <el-dialog title="函数助手" :visible.sync="funcHepleDialog" width="40%" :show-close="false" :close-on-click-modal="false">
        <div style="margin-top: 20px">
          <el-form :model="funcForm">
            <el-form-item label="函数模块:">
              <el-select v-model="funcForm.funcModel" style="width: 100%;" filterable placeholder="函数模块" @change="getFuncDesc">
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
          <el-button type="danger" @click="funcHepleDialog = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-loading="debugButtonloading"
        title="接口调试"
        :visible.sync="debugDialog"
        width="50%"
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
            <div style="margin-top: 10px;;margin-bottom: 10px"><label>请求报文</label></div>
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

    </div>
  </Box>
</template>
