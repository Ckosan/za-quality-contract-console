<style lang='scss' src="../css/onsDataConstructDetail.scss"></style>
<script src="../js/onsDataConstructDetail.js"></script>
<template>
  <Box v-loading="regionLoading" class="content-box" style="margin-top: -10px;">
    <div style="width: 100%">
      <div style="float: left;left: auto">
        <div>
          <label style="font-size: 22px">{{ serverInfo.project }}/{{ serverInfo.application }}</label>
        </div>
      </div>
      <br>
      <br>
      <br>
      <br>
      <div style="float: left;left: auto">
        <label style="font-size: 20px">{{ serverInfo.server_name }}</label>
        <label v-if="optType === 'watchDetail'" style="font-size: 10px"> 最新版本{{ serverInfo.version }},当前版本{{
          onsSereverForm.version }}</label>
      </div>
      <div style="float: right;">
        <el-button v-if="optType === 'watchDetail'" type="warning" icon="el-icon-search" @click="showHistoryVerion">历史版本
        </el-button>
        <el-button
          v-if="serverInfo.version===onsSereverForm.version"
          v-show="!submitFlag"
          type="success"
          icon="el-icon-printer"
          @click="changeSubmitStatus"
        >编辑
        </el-button>
        <el-button v-show="submitFlag" type="primary" icon="el-icon-printer" @click="selectVersion">提交</el-button>
        <el-button type="info" @click="goback">返回
        </el-button>
      </div>
      <br>
      <br>
      <div>
        <br>
        <hr>
        <br>
      </div>
      <div>
        <el-form :inline="true">
          <el-row>
            <el-col :span="12">
              <el-form-item label="MessageTag:">
                <el-input
                  v-model="onsSereverForm.tag"
                  :disabled="!submitFlag"
                  class="inputClass"
                  placeholder="请输入MessageTag"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理类型:">
                <el-select v-model="onsSereverForm.handleType" :disabled="!submitFlag" placeholder="请选择处理类型">
                  <el-option
                    v-for="item in handleTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="接口代码:">
                <el-input
                  v-model="onsSereverForm.interface_code"
                  class="inputClass"
                  :disabled="!submitFlag"
                  placeholder="请输入接口代码"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-form>
          <el-form-item label="消息说明">
            <el-input
              v-model="onsSereverForm.interface_name"
              style="display: inline-block"
              :disabled="!submitFlag"
              autocomplete="off"
              placeholder="请输入说明"
              icon="caret-top"
              type="textarea"
              rows="3"
            />
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="消息类型:">
            <el-select v-model="bodyTypeFlag" :disabled="!submitFlag" placeholder="请选择消息类型">
              <el-option
                v-for="item in bodyTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bodyRequest">
      <div v-if="bodyTypeFlag=='Json'">
        <div style="display: inline-block;display-inside: ruby">
          <div style="float: right">
            <el-button type="info" icon="el-icon-search" @click="searchData">搜索</el-button>
            <el-button type="primary" icon="el-icon-upload" :disabled="!submitFlag" @click="requestImportJson">JSON导入
            </el-button>
          </div>
          <div style="float: left">
            <el-input
              placeholder="请输入内容"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
        </div>
        <br>
        <div style="height: auto;overflow: hidden;">
          <HotTable ref="bodyTextHot" :root="test" :settings="hotSettings" />
          <div>
            <br>
            <hr>
            <p>
              <b>“字段默认值”支持下面几种表达式</b>
            </p>
            <p>
              <i class="fa fa-lightbulb-o"> MockJS</i>：
              以<b>“@”</b>符号开头，后面加具体占位符，如：<b>@string(5)</b>，生成一个长度为5的字符串。其他参考：
              <a target="_blank" href="http://mockjs.com/examples.html#DPD"><i class="fa fa-link"> 访问官网</i></a>
            </p>
            <p>
              <i class="fa fa-lightbulb-o"> Faker</i>：
              以<b>“$”</b>符合开头，后面加具体的方法名，如：<b>$ssn</b>，随机生成一个身份证号码。其他参考：
              <a target="_blank" href="https://faker.readthedocs.io/en/master/locales/zh_CN.html"><i
                class="fa fa-link"
              >
                访问官网</i></a>
            </p>
            <p>
              <i class="fa fa-copy"> 字段复制</i>：
              以<b>“#”</b>符号开头，后面加需要复制的字段，如“<b>#name</b>”；如果有父节点则为“<b>#父节点.字段名</b>”；“<b>#null</b>”可以设置字段值为null；“<b>#empty</b>”可以设置字段值为空字符串
            </p>
            <p>
              <i class="fa fa-delicious"> 混合格式</i>：
              如果默认值是由固定值+动态数据组成，则用<b>“&lt;&gt;”</b>将表达式括起来，支持多个表达式，如：<b>&lt;#name&gt;的身份证是&lt;$ssn&gt;！</b>
            </p>
          </div>
        </div>
        <div />
        <el-dialog title="通过JSON转换成接口文档" :visible.sync="jsonImportVisible" width="60%">
          <div style="margin-top: 20px;" />
          <el-input v-model="jsonForm.jsonDta" type="textarea" rows="30" placeholder="请输入JSON字符串" />
          <div style="margin: 20px 0;" />
          <div slot="footer" class="dialog-footer">
            <el-button @click="jsonImportVisible = false">取 消</el-button>
            <el-button type="primary" @click="importJsonSubmit">保存</el-button>
          </div>
        </el-dialog>
      </div>
      <div v-if="bodyTypeFlag=='Text'">
        <el-form label-width="500">
          <el-form-item>
            <el-input v-model="onsTextBody" type="textarea" placeholder="请输入项目介绍" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--查看历史版版-->
    <el-dialog title="版本记录" :visible.sync="showHistoryVerionDialog" width="50%" :show-close="false">
      <div style="margin-top: 20px;" />
      <el-table
        element-loading-spinner="el-icon-loading"
        :data="versionlogList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        class="form-table"
        :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="80"
          align="center"
          label="序号"
        />
        <el-table-column label="版本" prop="version" min-width="50" align="center" show-overflow-tooltip />
        <el-table-column label="说明" prop="description" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column label="修改人" prop="modifier" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.permission_type!=0"
              size="mini"
              type="success"
              @click="handleVersionDetail(scope.$index, scope.row)"
            >查看
            </el-button>
            <el-button
              v-show="scope.row.permission_type!=1"
              size="mini"
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
        :total="versionlogList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div style="margin: 20px 0;" />
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="showHistoryVerionDialog = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确认提交" :visible.sync="versionDialog" width="30%" :show-close="false">
      <div style="margin-top: 20px">
        <el-form :model="onsSereverForm">
          <el-form-item label="版本:   设置版本号为v:">
            <el-input v-model="onsSereverForm.version" placeholder="设置版本号为v" />
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="说明:">
            <el-input v-model="onsSereverForm.description" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editVersionSubmit">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="文档版本回滚" :visible.sync="versionRollbackDialog" width="30%" :show-close="false">
      <div>
        <el-form :model="onsSereverForm">
          <el-form-item label="版本:   设置版本号:">
            <el-input v-model="onsSereverForm.version" placeholder="设置版本号" />
          </el-form-item>
          <el-form-item label="说明:">
            <el-input v-model="onsSereverForm.description" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="versionRollbackDialog = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="rollbackVersionSubmit">确认</el-button>
      </div>
    </el-dialog>

  </Box>
</template>

