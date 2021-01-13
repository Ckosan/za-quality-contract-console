<style lang='scss' src="../css/httpDataConstructDetail.scss"></style>
<script src="../js/apiDataBranchMerge.js"></script>
<template>
  <Box class="content-box" style="margin-top: -10px;">
    <div v-loading="regionLoading" style="width: 100%">
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
            </el-col>
            <el-col :span="12">
              <div style="text-align: right;">
                <!--                <el-button-->
                <!--                  v-show="!submitFlag"-->
                <!--                  type="warning"-->
                <!--                  icon="el-icon-edit"-->
                <!--                  @click="changeSubmit"-->
                <!--                >编辑-->
                <!--                </el-button>-->
                <el-button
                  v-show="submitFlag"
                  type="primary"
                  icon="el-icon-connection"
                  @click="mergeBranch"
                >合并
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
              <div style="font-size: xx-small;color: #888888;">
                当前分支：{{ branch }}<span>，最新版本：{{ httpInfo.version }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="display: inline-block">
          <div style="float: left"><label style="font-weight: bold;font-size: 15px">分支对比结果</label></div>
        </div>
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
              <br>
              <div style="margin-bottom: 5px"><label style="font-weight: bold;font-size: 15px">请求体：</label></div>
              <div style="height: auto;overflow: hidden;">
                <HotTable ref="bodyTextHot" :disabled="!submitFlag" :root="test" :settings="hotSettings" />
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
                <br>
                <div style="margin-bottom: 5px"><label style="font-weight: bold;font-size: 15px">响应体：</label></div>
                <div style="height: auto;overflow: hidden;">
                  <HotTable ref="httpresponseTextHot" :disabled="!submitFlag" :settings="httpResponseSettings" />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
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
                  style="font-size: large;text-align: center;width: 200px"
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
  </Box>
</template>

