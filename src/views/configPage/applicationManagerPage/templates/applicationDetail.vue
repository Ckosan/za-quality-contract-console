<style lang='scss' src="../css/applicationdetail.scss"></style>
<script src="../js/applicationdetail.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div v-loading="regionLoading">
        <section>
          <el-row style="text-align: left;">
            <span style="font-size: small;color: #6a686b;">
              <span>「{{ applicationDetail.creater }}」创建于「{{ applicationDetail.create_time }}」</span>
              <span v-if="applicationDetail.update_time!=applicationDetail.create_time">
                ，「{{ applicationDetail.modifier }}」最后修改于「{{ applicationDetail.update_time }}」
              </span>
            </span>
            <el-button type="info" style="float: right;margin-left: 20px" icon="el-icon-back" @click="goback">应用列表
            </el-button>
            <el-button type="warning" style="float: right;" icon="el-icon-edit" @click="editHandle">编辑应用</el-button>
          </el-row>
          <div style="margin-top: 30px"><label style="font-weight: bold;font-size: 15px">应用信息</label></div>
          <div class="app-container">
            <div style="display: inline-block">
              <div style="float:left;margin-bottom: 20px;margin-top: 10px;margin-right:10rem"><label style="font-size: 12px">所属项目：
                <router-link
                  tag="a"
                  style="color:#0174DF;font-weight: normal"
                  :to="'/configpage/projectdetail/'+applicationDetail.project_id"
                >{{ applicationDetail.project_name
                }}({{ applicationDetail.project_code }})
                </router-link>
              </label></div>
              <div style="float:left;margin-bottom: 20px;margin-top: 10px;margin-right: 10rem"><label style="font-size: 12px">应用代码：<label
                style="font-weight: normal"
              >{{
                applicationDetail.application_code
              }}</label></label></div>
              <div style="float:left;margin-bottom: 20px;margin-top: 10px;"><label style="font-size: 12px">应用状态：<label
                style="font-weight: normal"
              >{{
                applicationDetail.application_status
              }}</label></label></div>
            </div>
            <div style="margin-bottom: 20px;margin-top: 10px"><label style="font-size: 12px">应用简介：</label></div>
            <div>
              <el-input
                v-model="applicationDetail.application_describe"
                style="display: inline-block;font-size: 11px"
                autocomplete="off"
                icon="caret-top"
                readonly
              />
            </div>
          </div>
        </section>
        <section>
          <div><label style="font-weight: bold;font-size: 15px">成员信息</label></div>
          <div class="app-container">
            <div style="display: inline-block">
              <div style="float:left;margin-bottom: 20px;margin-top: 10px;margin-right: 450px"><label style="font-size: 12px">开发人员：<label
                style="font-weight: normal"
              >{{ applicationDetail.developers || "无" }}</label></label>
              </div>
              <div style="float:left;margin-bottom: 20px;margin-top: 10px"><label style="font-size: 12px">测试人员：<label
                style="font-weight: normal"
              >{{ applicationDetail.testers || "无" }}</label></label></div>
            </div>
          </div>
        </section>
        <div>
          <div style="float: left"><label style="font-weight: bold;font-size: 15px">服务列表</label></div>
          <div style="float: right;margin-right: 30px;margin-bottom: 5px"><el-button type="primary" style="float: right;" icon="el-icon-plus" size="mini" @click="addServerClick">新增服务</el-button></div>
        </div>
        <div class="eltable">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="applicationDetail.server_info"
            border
            :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
            style="font-size: 8px"
          >
            <el-table-column
              label="序号"
              type="index"
              width="80"
              align="center"
            />
            <el-table-column label="服务类型" prop="server_type" min-width="50px" align="center" />
            <el-table-column label="服务编码" prop="server_code" min-width="50px" align="center" />
            <el-table-column label="服务说明" prop="server_name" min-width="100px" align="center" />
            <el-table-column label="文档数量" prop="document_num" min-width="50px" align="center" />
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-view"
                  @click="handleDetail(scope.$index, scope.row)"
                >服务详情
                </el-button>
                <el-button
                  v-if="scope.row.document_num==0"
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDeleteServer(scope.$index, scope.row)"
                >删除服务
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog title="编辑应用" :visible.sync="editFormVisible" width="40%" :show-close="false">
          <div style="margin-top: 10px">
            <div style="text-align: center;font-size: 20px;font-weight: bold;margin-bottom: 25px"><label>应用信息</label>
            </div>
            <el-form
              ref="editForm"
              :inline="false"
              :rules="rules"
              :model="editForm"
              class="demo-form-inline"
              label-width="100px"
            >
              <el-form-item label="所属项目:" prop="project_id">
                <el-select v-model="editForm.project_info" placeholder="请选择项目名称" style="display: block;">
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-row>
                <el-col :span="14">
                  <el-form-item label="应用代码:" prop="application_code">
                    <el-input v-model="editForm.application_code" maxlength="128" placeholder="请输入应用代码" />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="应用状态:" prop="application_status">
                    <el-select v-model="editForm.application_status" placeholder="请选择应用状态" style="display: block;">
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
                  <el-input v-model="editForm.application_describe" placeholder="请输入应用简介" maxlength="512" />
                </el-form-item>
              </div>
              <div v-for="(developers,index) in editForm.developers" :key="index">
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
                    :loading="false"
                    :remote-method="remoteMethod2"
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
              <div v-for="(testers,index) in editForm.testers" :key="index">
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
                    :loading="false"
                    :remote-method="remoteMethod2"
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
            <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
            <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="新增服务"
          :visible.sync="addServerFormVisible"
          width="50%"
          :show-close="false"
          :close-on-click-modal="false"
        >
          <div v-loading="regionLoading" style="margin-top: 10px">
            <div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 25px"><label>服务信息</label>
            </div>
            <el-form
              ref="form"
              :inline="false"
              :model="serverform"
              :rules="rules"
              class="demo-form-inline"
              label-width="120px"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="服务类型:" align="center" prop="server_type">
                    <el-select v-model="serverform.server_type" placeholder="请选择服务类型" style="display: block;">
                      <el-option
                        v-for="item in server_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="服务简介:" prop="server_name">
                    <el-input
                      v-model="serverform.server_name"
                      placeholder="请输入服务简介"
                      maxlength="126"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="共用文档:" prop="union_info">
                    <el-input
                      v-model="serverform.union_info"
                      :readonly="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <div style="margin-left: 10px">
                    <el-button
                      type="success"
                      icon="el-icon-plus"
                      @click="unionDocHandle"
                    >
                      共用文档
                    </el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      @click="removeUnionHandle"
                    >
                      删除
                    </el-button>
                  </div>
                </el-col>
              </el-row>
              <div style="margin: 20px 0;" />
              <div style="text-align: center;font-size: 15px;font-weight: bold;"><label>配置信息</label>
              </div>
              <div v-if="serverform.server_type==='API'" class="panel-heading">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-plus"
                  style="float: right;margin-bottom: 5px;"
                  @click="addHttpServerForm2"
                >新增配置
                </el-button>
              </div>
              <div style="margin-top: 20px;" />
              <el-row>
                <el-col :span="24">
                  <template>
                    <div>
                      <el-table
                        v-if="serverform.server_type==='API'"
                        :data="serverform.server_env"
                        border
                        style="font-size: 6px"
                        :header-cell-style="{fontSize:'8px',fontWeight:'bold',background:'#CED8F6',color:'rgb(255, 255, 255)'}"
                      >
                        <el-table-column label="配置名称" min-width="100px" align="center">
                          <template slot-scope="scope">
                            <el-form-item
                              style="margin: 0px;"
                              label-width="0px"
                              :prop="'server_env.'+scope.$index + '.env_name'"
                              :rules="rules.server_env.env_name"
                            >
                              <el-autocomplete
                                v-model="scope.row.env_name"
                                :fetch-suggestions="querySearch"
                                maxlength="56"
                                placeholder="如test、uat"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="协议类型" min-width="100px" align="center">
                          <template slot-scope="scope">
                            <el-form-item
                              style="margin: 0px;"
                              label-width="0px"
                              :prop="'server_env.'+scope.$index + '.protocol'"
                              :rules="rules.server_env.protocol"
                            >
                              <el-select v-model="scope.row.protocol" placeholder="请选择">
                                <el-option
                                  v-for="item in protocolOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                />
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="主机地址" min-width="200px" align="center">
                          <template slot-scope="scope">
                            <el-form-item
                              style="margin: 0px;"
                              label-width="0px"
                              :prop="'server_env.'+scope.$index + '.host'"
                              :rules="rules.server_env.host"
                            >
                              <el-input
                                v-model="scope.row.host"
                                maxlength="64"
                                placeholder="如test.zhongan.com"
                                style="display: block;"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="端口" min-width="80px" align="center">
                          <template slot-scope="scope">
                            <el-form-item
                              style="margin: 0px;"
                              label-width="0px"
                              :prop="'server_env.'+scope.$index + '.port'"
                              :rules="rules.server_env.port"
                            >
                              <el-input v-model="scope.row.port" maxlength="5" placeholder="如8080" />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="150px" align="center">
                          <template slot-scope="scope">
                            <el-form-item style="margin: 0px;" label-width="0px">
                              <el-button size="mini" type="danger" @click="deleteAddHttpItem(scope.$index,scope.row)">删除配置
                              </el-button>
                            </el-form-item>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </template>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="addServerFormVisible = false">取 消</el-button>
            <el-button type="primary" :loading="addLoading" @click="addSever('form')">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="共用文档"
          :visible.sync="showUnionDoc"
          width="30%"
          :show-close="false"
          :close-on-click-modal="false"
        >
          <br>
          <div style="text-align: center;">
            <el-form ref="unionForm" label-width="100px" :model="unionForm">
              <el-form-item label="选择项目:">
                <el-select
                  v-model="unionForm.project"
                  filterable
                  clearable
                  placeholder="请选择项目"
                  style="display: block;"
                  @change="projectChangeHandle"
                >
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="选择项目:">
                <el-select
                  v-model="unionForm.application"
                  filterable
                  clearable
                  placeholder="请选择应用"
                  style="display: block;"
                  @change="applicationChangeHandle"
                >
                  <el-option
                    v-for="item in applicationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="选择服务:">
                <el-select
                  v-model="unionForm.server"
                  filterable
                  clearable
                  placeholder="请选择服务"
                  style="display: block;"
                  @change="changeEditUnionServer"
                >
                  <el-option
                    v-for="item in serverOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="showUnionDoc = false">取 消</el-button>
            <el-button type="primary" :loading="addLoading" @click="unionDocSubmit">确认</el-button>
          </div>
        </el-dialog>

      </div>
    </Box>
  </div>
</template>
<style>
  table.table-info {
    min-width: 50%;
    border-spacing: 0;
    border-collapse: collapse;
    border-radius: 3px;
    overflow: hidden;
  }

  .table-mod {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .wp-100 {
    boxs-sizing: border-box !important;
    width: 100% !important;
  }

  .w-150 {
    width: 150px !important;
  }

  .app-container {
    border-radius: 25px;
    margin: 20px;
    padding: 10px 50px;
    background-color: #fff;
  }

  td {
    display: table-cell;
    vertical-align: inherit;
  }

  table {
    border-collapse: separate;
    border-spacing: 2px;
  }

  .table-mod.table-info tr td:nth-child(odd) {
    background: #f5f5f557;
    font-weight: 700;
  }

  .table-mod td {
    color: #888;
  }

  .table-mod.table-info tr td {
    padding: 15px;
    font-size: 14px;
    line-height: 1.6;
  }
</style>
