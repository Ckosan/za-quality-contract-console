<style lang='scss' src="../css/httpDataConstructDetail.scss"></style>
<script src="../js/httpDataConstructDetail.js"></script>
<template>
  <Box v-loading="regionLoading" class="content-box" style="margin-top: -10px;">
    <div style="width: 100%">
      <div>
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
              <div style="margin-top: 5px;" />
              <div style="font-size: 8px;font-style: italic;color: #8d8d8d;">
                <b>{{ apiInfoTitle }}</b>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right;">
                <el-button
                  v-if="optType === 'watchDetail'"
                  type="text"
                  icon="el-icon-receiving"
                  @click="showHistoryVerion"
                >
                  修订记录
                </el-button>
                <el-button
                  v-show="!submitFlag"
                  v-if="permission_type == 2 && httpSereverForm.version === httpInfo.version"
                  type="success"
                  icon="el-icon-printer"
                  @click="changeSubmitStatus"
                >编辑
                </el-button>
                <el-button
                  v-show="submitFlag"
                  type="primary"
                  icon="el-icon-printer"
                  @click="selectVersion"
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
              <!-- <div v-if="optType === 'watchDetail'" style="font-size: xx-small;color: #888888;">
                当前版本：{{ httpSereverForm.version }}<span>，最新版本：{{ httpInfo.version }}</span>
              </div> -->
            </el-col>
          </el-row>
        </div>
        <div style="display: inline-block;width: 100%;">
          <div style="float: left">
            <label style="font-weight: bold;font-size: 15px">
              文档信息<label v-if="optType === 'watchDetail'" style="font-size: 10px;color: #888888;">（当前版本：{{
                httpSereverForm.version }}<span style="font-size: 10px">，最新版本：{{ httpInfo.version }}</span>）
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
        <div v-if="serverInfo.server_type ==='API'" style="overflow:hidden;" class="bodyRequest">
          <el-tabs v-model="activeName" type="border-card" stretch>
            <el-tab-pane name="first" @click="updateSearchCount" @change="updateSearchCount">
              <span slot="label" style="font-size: 12px"><i class="el-icon-download" /> 配置请求报文</span>
              <br>
              <div><label style="font-weight: bold;font-size: 15px">请求头：</label></div>
              <div style="height: auto;overflow: hidden;">
                <br>
                <HotTable ref="headersTextHot" :disabled="!submitFlag" :root="test" :settings="headerSettings" />
              </div>
              <br>
              <div style="display: inline-block;display-inside: ruby;width: 100%;">
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
                    <label v-if="searchCount!='0'" style="font-weight: normal;font-size: 8px">共查到 <label
                      style="color: #ff0f20"
                    >{{ searchCount }} </label>处</label>
                  </div>
                  <div style="float: right;margin-left: 60px;margin-top: 5px">
                    <el-button
                      type="primary"
                      icon="el-icon-upload"
                      size="mini"
                      :disabled="!submitFlag"
                      @click="requestImportJson"
                    >
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
            <el-tab-pane name="second" @click="updateSearchCount" @change="updateSearchCount">
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
                      <label v-if="searchCount!='0'" style="font-weight: normal;font-size: 8px">搜索结果共有 <label
                        style="color: #ff0f20"
                      >{{ searchCount }}</label> 处</label>
                    </div>
                    <div style="float: right;margin-left: 60px;;margin-top: 5px">
                      <el-button
                        type="primary"
                        icon="el-icon-upload"
                        size="mini"
                        :disabled="!submitFlag"
                        @click="importJson"
                      >
                        JSON导入
                      </el-button>
                      <el-button
                        type="warning"
                        icon="el-icon-view"
                        size="mini"
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
        <el-dialog title="确认提交" :visible.sync="versionDialog" width="30%" :show-close="false" :close-on-click-modal="false">
          <div v-loading="regionLoading" style="margin-top: 30px">
            <el-form
              ref="submitForm"
              :rules="rules"
              :model="submitForm"
              label-width="100px"
            >
              <el-row>
                <el-col :span="14">
                  <el-form-item
                    prop="new_version"
                    label="版本号:"
                  >
                    <el-input
                      v-model="submitForm.new_version"
                      placeholder="设置版本号"
                      maxlength="12"
                      style="font-size: 8px;text-align: center;width: 200px"
                      @input="changeVerison"
                    >
                      <template slot="append">{{ '.'+submitForm.sub_version }}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  &nbsp;
                </el-col>
              </el-row>
              <el-form-item
                prop="description"
                label="修订说明:"
              >
                <el-input
                  v-model="submitForm.description"
                  type="textarea"
                  rows="5"
                  placeholder="请对本次提交进行说明"
                  maxlength="512"
                />
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="cancelSubmit">取 消</el-button>
            <el-button type="primary" :loading="addLoading" @click="editVersionSubmit('submitForm')">提交</el-button>
          </div>
        </el-dialog>
      </div>
      <!--http区域-->

      <el-dialog title="JSON导入" :visible.sync="jsonImportVisible" width="40%" :show-close="false" :close-on-click-modal="false">
        <div style="margin-top: 20px;" />
        <el-input v-model="jsonForm.jsonDta" type="textarea" rows="20" placeholder="请输入JSON字符串" />
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
      <!--查看历史版版-->
      <el-dialog title="修订记录" :visible.sync="showHistoryVerionDialog" width="60%" :show-close="false" :close-on-click-modal="false">
        <div style="margin-top: 20px;" />
        <el-table
          element-loading-spinner="el-icon-loading"
          :data="versionlog_list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          border
          class="form-table"
          :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'rgb(122, 130, 128)',color:'rgb(255, 255, 255)'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column label="版本" prop="version" min-width="80" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{ scope.row.version == httpSereverForm.version ? scope.row.version + '（当前）' : scope.row.version }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="说明" prop="description" min-width="120" align="left" show-overflow-tooltip />
          <el-table-column label="更新人" prop="modifier" min-width="60" align="center" show-overflow-tooltip />
          <el-table-column label="更新时间" prop="update_time" min-width="100" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="160px" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.permission_type!=0 && scope.$index != currentVersionId"
                size="small"
                type="primary"
                @click="handleVersionDetail(scope.$index, scope.row)"
              >查看
              </el-button>
              <el-button
                v-if="permission_type === 2 && scope.$index != 0"
                size="small"
                type="danger"
                @click="handleRollBack(scope.$index, scope.row)"
              >回滚
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="versionlog_list.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <div style="margin: 20px 0;" />
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="showHistoryVerionDialog = false">关闭</el-button>
        </div>
      </el-dialog>
      <!--选择banben-->

      <el-dialog title="文档版本回滚" :visible.sync="versionRollbackDialog" width="30%" :show-close="false" :close-on-click-modal="false">
        <div style="margin-top: 20px">
          <el-form
            ref="httpSereverForm"
            :rules="rules"
            :model="httpSereverForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="14">
                <el-form-item
                  prop="new_version"
                  label="版本号:"
                >
                  <el-input
                    v-model="httpSereverForm.new_version"
                    placeholder="设置版本号"
                    maxlength="12"
                    style="font-size: large;text-align: center;width: 200px"
                    @input="rollBackChangeVerison"
                  >
                    <template slot="append">{{ '.'+httpSereverForm.sub_version }}</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                &nbsp;
              </el-col>
            </el-row>
            <el-form-item
              prop="description"
              label="修订说明:"
            >
              <el-input
                v-model="httpSereverForm.description"
                type="textarea"
                rows="5"
                placeholder="请对本次提交进行说明"
                maxlength="512"
              />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="versionRollbackDialog = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="rollbackVersionSubmit('httpSereverForm')">确认
          </el-button>
        </div>
      </el-dialog>

      <el-dialog title="函数助手" :visible.sync="funcHepleDialog" width="35%" :show-close="false" :close-on-click-modal="false">
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
          <el-button type="danger" @click="funcHepleDialog = false">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog
        v-loading="debugButtonloading"
        title="接口调试"
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
                      v-for="item in options.methodOptions"
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
    </div>
  </Box>
</template>
