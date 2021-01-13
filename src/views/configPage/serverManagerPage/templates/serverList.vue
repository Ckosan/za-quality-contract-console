<style lang='scss' src="../css/serverList.scss"></style>
<script src="../js/serverList.js"></script>
<template>
  <div v-loading="loading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <SearchContainer style="text-align: center;">
        <el-form
          ref="searchForm"
          :inline="true"
          label-width="110px"
          size="mini"
          :rules="rules"
          :model="searchForm"
          class="query-form mb20"
        >
          <el-form-item label="项目信息" prop="projectinfo" class="rowItem">
            <el-select
              v-model="searchForm.projectinfo"
              filterable
              clearable
              placeholder="请输入项目信息"
              auto-complete="off"
              style="width:200px;"
              @change="getApplicationsOptions"
            >
              <el-option
                v-for="item in options.projectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用信息" prop="applicationsinfo" class="rowItem">
            <el-select
              v-model="searchForm.applicationsinfo"
              filterable
              clearable
              placeholder="请输入应用信息"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in options.applicationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务类型" prop="server_type" class="rowItem">
            <el-select
              v-model="searchForm.server_type"
              filterable
              clearable
              placeholder="请选择服务类型"
              auto-complete="off"
              style="width:200px;"
            >
              <el-option
                v-for="item in options.serverTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="tc" style="margin-top:10px;">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="success" size="mini" icon="el-icon-plus" @click="addForm">新增</el-button>
        </div>
      </SearchContainer>
      <div style="display: inline-block;margin-bottom: 20px">
        <div style="float: right;">
          <el-input
            v-model="searchTxt"
            style="display: inline-block;width: 400px;height: 15px"
            placeholder="输入关键字"
            @input="seachList"
          ><i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
        </div>
      </div>
      <el-table
        element-loading-spinner="el-icon-loading"
        :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        class="form-table"
        style="font-size: 8px"
        :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        />
        <el-table-column label="项目信息" prop="projectinfo" min-width="150" show-overflow-tooltip align="center" sortable>
          <template slot-scope="scope">
            <router-link
              tag="a"
              style="color:#0174DF"
              :to="'/configpage/projectdetail/'+scope.row.project_id"
            ><span class="col-cont" v-html="showDate(scope.row.projectinfo)" />
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="应用信息"
          prop="applicationinfo"
          min-width="150"
          show-overflow-tooltip
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <router-link
              tag="a"
              style="color:#0174DF"
              :to="'/configpage/applicationdetail/'+scope.row.application_id"
            ><span class="col-cont" v-html="showDate(scope.row.applicationinfo)" />
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="服务编码" min-width="125px" align="center">
          <template slot-scope="scope">
            {{ scope.row.server_type }}:
            <label style="font-size: 8px">{{ scope.row.server_code }}</label>
            <br>
            <el-link
              v-if="scope.row.union_server!=null"
              target="_blank"
              style="color:#0174DF;font-size: 8px"
              @click="goToDetail(scope.$index,scope.row)"
            >共用文档S000<span class="col-cont" style="font-size: 8px" v-html="showDate(scope.row.union_server)" />
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="服务简介" prop="server_name" min-width="160" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.server_name)" />
          </template>
        </el-table-column>
        <el-table-column label="文档数量" prop="document_num" min-width="90" align="center" />
        <el-table-column
          label="更新信息"
          prop="document_num"
          :formatter="convertDataFormat"
          min-width="120"
          align="center"
          sortable
        />
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-tooltip content="服务详情" placement="left">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-view"
                circle
                @click="handleDetail(scope.$index, scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="编辑服务" placement="right">
              <el-button
                v-show="scope.row.permission_type!=1"
                size="mini"
                type="warning"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除服务" placement="right">
              <el-button
                v-show="scope.row.document_num===0&&scope.row.permission_type===2"
                size="mini"
                type="danger"
                icon="el-icon-delete"
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
    </Box>

    <el-dialog
      title="共用文档"
      :visible.sync="unionDoc.showUnionDoc"
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
                v-for="item in unionDoc.projectOptions"
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
                v-for="item in unionDoc.applicationOptions"
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
                v-for="item in unionDoc.serverOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="unionDoc.showUnionDoc = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="unionDocSubmit">确认</el-button>
      </div>
    </el-dialog>

    <!--编辑弹出框-->
    <el-dialog
      title="编辑服务"
      :visible.sync="editFormVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div v-loading="regionLoading" style="margin-top: 10px">
        <div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 25px"><label>服务信息</label>
        </div>
        <el-form
          ref="editForm"
          :inline="false"
          :model="editForm"
          :rules="rules"
          class="demo-form-inline"
          label-width="120px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目信息:" prop="projectinfo">
                <el-select
                  v-model="editForm.projectinfo"
                  placeholder="请输入项目信息"
                  style="display: block;"
                  @change="getEditApplictionOptions"
                >
                  <el-option
                    v-for="item in options.addProjectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用信息:" prop="applicationinfo">
                <el-select v-model="editForm.applicationinfo" placeholder="请输入应用信息" style="display: block;">
                  <el-option
                    v-for="item in options.editApplictionOptions"
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
              <el-form-item label="服务类型:" prop="server_type">
                <el-select v-model="editForm.server_type" placeholder="请选择服务类型" style="display: block;">
                  <el-option
                    v-for="item in options.server_type"
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
                  v-model="editForm.server_name"
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
                  v-model="form.union_info"
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
          <div v-if="editForm.server_type==='API'" class="panel-heading" style="margin-bottom: 20px">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-plus"
              style="float: right;margin-bottom: 5px;"
              @click="addServerForm"
            >新增配置
            </el-button>
          </div>
          <el-row>
            <el-col :span="24">
              <template>
                <div>
                  <el-table
                    v-if="editForm.server_type==='API'"
                    :data="editForm.server_env"
                    border
                    style="font-size: 6px"
                    :header-cell-style="{fontSize:'8px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
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
                              v-for="item in options.protocolOptions"
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
                          <el-input v-model="scope.row.host" maxlength="64" placeholder="如test.zhongan.com" />
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
                          <el-button size="mini" type="danger" @click="deleteHttpItem(scope.$index,scope.row)">删除配置
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

        <div v-if="editForm.server_type==='ONS'" class="panel-heading" style="margin-bottom: 20px">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            style="float: right;margin-bottom: 5px;"
            @click="addOnsServerForm"
          >新增配置
          </el-button>
        </div>
        <template>
          <div>
            <el-table
              v-if="editForm.server_type==='ONS'"
              :data="editForm.server_env"
              border
              :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            >
              <el-table-column label="配置名称" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'server_env.'+scope.$index + '.env_name'"
                    :rules="rules.server_env"
                  >
                    <el-autocomplete
                      v-model="scope.row.env_name"
                      :fetch-suggestions="querySearch"
                      maxlength="32"
                      placeholder="字母、数字和横杠，如test、uat"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="ServiceAddress" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.service_address" placeholder="请输入ServiceAddress" />
                </template>
              </el-table-column>
              <el-table-column label="AccessKey" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.access_key" placeholder="请输入AccessKey" />
                </template>
              </el-table-column>
              <el-table-column label="SecretKey" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.accesskey_secretkey" placeholder="请输入SecretKey" />
                </template>
              </el-table-column>
              <el-table-column label="Topic" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.topic" placeholder="请输入Topic" />
                </template>
              </el-table-column>
              <el-table-column label="GroupId" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.group_id" placeholder="请输入GroupId" />
                </template>
              </el-table-column>
              <el-table-column label="ProducerId" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.producer_id" placeholder="请输入ProducerId" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="deleteOnsItem(scope.$index,scope.row)">删除配置</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <div v-if="editForm.server_type==='SFTP'" class="panel-heading" style="margin-bottom: 20px">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            style="float: right;margin-bottom: 5px;"
            @click="addSFTPServerForm"
          >新增配置
          </el-button>
        </div>
        <template>
          <div>
            <el-table
              v-if="editForm.server_type==='SFTP'"
              :data="editForm.server_env"
              border
              style="font-size: 8px"
              :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            >
              <el-table-column label="配置名称" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'server_env.'+scope.$index + '.env_name'"
                    :rules="rules.server_env"
                  >
                    <el-autocomplete
                      v-model="scope.row.env_name"
                      :fetch-suggestions="querySearch"
                      maxlength="32"
                      placeholder="字母、数字和横杠，如test、uat"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="主机地址" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.host" placeholder="请输入主机地址" />
                </template>
              </el-table-column>
              <el-table-column label="用户名" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.user" placeholder="请输入用户名" />
                </template>
              </el-table-column>
              <el-table-column label="密码" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.password" placeholder="请输入密码" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="deleteSftpItem(scope.$index,scope.row)">删除配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <div v-if="editForm.server_type==='OSS'" class="panel-heading" style="margin-bottom: 20px">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            style="float: right;margin-bottom: 5px;"
            @click="addOSSServerForm"
          >新增配置
          </el-button>
        </div>
        <template>
          <div>
            <el-table
              v-if="editForm.server_type==='OSS'"
              :data="editForm.server_env"
              border
              :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            >
              <el-table-column label="配置名称" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'server_env.'+scope.$index + '.env_name'"
                    :rules="rules.server_env"
                  >
                    <el-autocomplete
                      v-model="scope.row.env_name"
                      :fetch-suggestions="querySearch"
                      maxlength="32"
                      placeholder="字母、数字和横杠，如test、uat"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="Endpoint" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.endpoint" placeholder="请输入Endpoint" />
                </template>
              </el-table-column>
              <el-table-column label="AccessKeyId" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.accesskey_id" placeholder="请输入AccessKeyId" />
                </template>
              </el-table-column>
              <el-table-column label="AccessKeySecret" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.accesskey_secret" placeholder="请输入AccessKeySecret" />
                </template>
              </el-table-column>
              <el-table-column label="bucket" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.bucket" placeholder="请输入bucket" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="deleteOssItem(scope.$index,scope.row)">删除配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog
      title="新增服务"
      :visible.sync="addFormVisible"
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
          :model="form"
          :rules="rules"
          class="demo-form-inline"
          label-width="120px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目信息:" prop="projectinfo">
                <el-select
                  v-model="form.projectinfo"
                  placeholder="请输入项目信息"
                  style="display: block;"
                  @change="getAddApplictionOptions"
                >
                  <el-option
                    v-for="item in options.addProjectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用信息:" prop="application_code">
                <el-select v-model="form.application_code" placeholder="请输入应用信息" style="display: block;">
                  <el-option
                    v-for="item in options.addApplictionOptions"
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
              <el-form-item label="服务类型:" align="center" prop="server_type">
                <el-select v-model="form.server_type" placeholder="请选择服务类型" style="display: block;">
                  <el-option
                    v-for="item in options.server_type"
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
                  v-model="form.server_name"
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
                  v-model="form.union_info"
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
          <div v-if="form.server_type==='API'" class="panel-heading">
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
                    v-if="form.server_type==='API'"
                    :data="form.server_env"
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
                              v-for="item in options.protocolOptions"
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
        <!--ons-->
        <div v-if="form.server_type==='ONS'" class="panel-heading" style="margin-bottom: 20px">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            style="float: right;margin-bottom: 5px;"
            @click="addOnsServerForm2"
          >新增配置
          </el-button>
        </div>
        <template>
          <div>
            <el-table
              v-if="form.server_type==='ONS'"
              :data="form.server_env"
              border
              :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            >
              <el-table-column label="配置名称" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'server_env.'+scope.$index + '.env_name'"
                    :rules="rules.server_env"
                  >
                    <el-autocomplete
                      v-model="scope.row.env_name"
                      :fetch-suggestions="querySearch"
                      maxlength="32"
                      placeholder="字母、数字和横杠，如test、uat"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="ServiceAddress" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.service_address" placeholder="请输入ServiceAddress" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="AccessKey" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.access_key" placeholder="请输入AccessKey" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="SecretKey" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.secret_key" placeholder="请输入SecretKey" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="Topic" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.topic" placeholder="请输入Topic" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="GroupId" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.group_id" placeholder="请输入GroupId" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="ProducerId" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.producer_id" placeholder="请输入ProducerId" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="deleteAddHttpItem(scope.$index,scope.row)">删除配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <!-- sftp-->
        <div v-if="form.server_type==='SFTP'" class="panel-heading" style="margin-bottom: 20px">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            style="float: right;margin-bottom: 5px;"
            @click="addSFTPServerForm2"
          >新增配置
          </el-button>
        </div>
        <template>
          <div>
            <el-table
              v-if="form.server_type==='SFTP'"
              :data="form.server_env"
              border
              :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            >
              <el-table-column label="配置名称" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'server_env.'+scope.$index + '.env_name'"
                    :rules="rules.server_env"
                  >
                    <el-autocomplete
                      v-model="scope.row.env_name"
                      :fetch-suggestions="querySearch"
                      maxlength="32"
                      placeholder="字母、数字和横杠，如test、uat"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="主机地址" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.host" placeholder="请输入主机地址" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="用户名" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.user" placeholder="请输入用户名" />
                </template>
              </el-table-column>
              <el-table-column label="密码" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.password" placeholder="请输入密码" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="deleteAddHttpItem(scope.$index,scope.row)">删除配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <!-- oss-->
        <div v-if="form.server_type==='OSS'" class="panel-heading" style="margin-bottom: 20px">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            style="float: right;margin-bottom: 5px;"
            @click="addOSSServerForm2"
          >新增配置
          </el-button>
        </div>
        <template>
          <div>
            <el-table
              v-if="form.server_type==='OSS'"
              :data="form.server_env"
              border
              :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266',wordBreak:'keep-all'}"
            >
              <el-table-column label="配置名称" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'server_env.'+scope.$index + '.env_name'"
                    :rules="rules.server_env"
                  >
                    <el-autocomplete
                      v-model="scope.row.env_name"
                      :fetch-suggestions="querySearch"
                      maxlength="32"
                      placeholder="字母、数字和横杠，如test、uat"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="Endpoint" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.endpoint" placeholder="请输入Endpoint" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="AccessKeyId" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.accesskey_id" placeholder="请输入AccessKeyId" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="AccessKeySecret" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.accesskey_secret" placeholder="请输入AccessKeySecret" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="bucket" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.bucket" placeholder="请输入bucket" align="center" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="deleteAddHttpItem(scope.$index,scope.row)">删除配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="add('form')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
