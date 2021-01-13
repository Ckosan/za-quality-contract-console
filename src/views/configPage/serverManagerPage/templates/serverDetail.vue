<style lang='scss' src="../css/serverDetail.scss"></style>
<script src="../js/serverDetail.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div>
        <el-row style="text-align: left;">
          <span style="font-size: small;color: #6a686b;">
            <span>「{{ serverDetail.creater }}」创建于「{{ serverDetail.create_time }}」</span>
            <span v-if="serverDetail.update_time!=serverDetail.create_time">
              ，「{{ serverDetail.modifier }}」最后修改于「{{ serverDetail.update_time }}」
            </span>
          </span>
          <el-button type="info" style="float: right;" icon="el-icon-back" @click="goback">服务列表</el-button>
        </el-row>
        <div style="margin-top: 30px;display: inline-block">
          <div style="float: left"><label style="font-weight: bold;font-size: 15px">服务信息({{ serverDetail.server_code
          }})</label></div>
        </div>
        <section>
          <div class="app-container">
            <div style="display: inline-block">
              <div style="float:left;margin-bottom: 20px;margin-top: 10px;margin-right: 8rem"><label
                style="font-size: 12px"
              >项目名称：
                <router-link
                  tag="a"
                  style="color:#0174DF;font-weight: normal"
                  :to="'/configpage/projectdetail/'+serverDetail.project_id"
                >{{ projectinfo }}
                </router-link>
              </label></div>
              <div style="float:left;margin-bottom: 20px;margin-top: 10px;margin-right: 8rem"><label
                style="font-size: 12px"
              >应用名称：
                <router-link
                  tag="a"
                  style="color:#0174DF;font-weight: normal"
                  :to="'/configpage/applicationdetail/'+serverDetail.application_id"
                >{{ application_info }}
                </router-link>
              </label></div>
              <div style="float:left;margin-bottom: 20px;margin-top: 10px"><label style="font-size: 12px">服务类型：<label
                style="font-weight: normal"
              >{{ serverDetail.server_type }}</label></label></div>
            </div>
            <div style="margin-bottom: 20px;margin-top: 10px"><label style="font-size: 12px">服务简介：</label></div>
            <div>
              <el-input
                v-model="serverDetail.server_name"
                style="display: inline-block;font-weight: normal;font-size: 11px"
                autocomplete="off"
                icon="caret-top"
                readonly
              />
            </div>
            <div v-if="serverDetail.union_server!=serverDetail.id" style="margin-bottom: 20px;margin-top: 10px">
              <label>共用文档：
                <router-link
                  tag="a"
                  style="color:#0174DF;font-weight: normal"
                  :to="'/configpage/serverdetail/'+serverDetail.union_server"
                >S000{{ serverDetail.union_server }}
                </router-link>
              </label></div>
          </div>

        </section>
        <br>
        <div><label style="font-weight: bold;font-size: 15px">配置信息</label></div>
        <br>
        <div v-show="serverDetail.server_type ==='API'" class="eltable">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="serverDetail.server_env"
            border
            style="font-size: 8px"
            :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
          >
            <el-table-column
              type="index"
              width="60"
              label="序号"
              align="center"
            />
            <el-table-column label="配置名" prop="env_name" min-width="120" align="center" />
            <el-table-column label="协议类型" prop="protocol" min-width="100" align="center" />
            <el-table-column label="主机地址" prop="host" min-width="200" align="center" />
            <el-table-column label="端口" prop="port" min-width="100" align="center" />
            <el-table-column label="服务状态" prop="status" min-width="120" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.status==='服务可用'">
                  <i class="el-icon-success" style="color:#2bb40c" />
                  <label style="color:#2bb40c;font-size: 8px">可访问</label>
                </div>
                <div v-if="scope.row.status==='服务不可用'">
                  <i class="el-icon-error" style="color:#FF0000" />
                  <label style="color:#FF0000;font-size: 8px">无法访问</label>
                </div>
                <div v-if="scope.row.status==='正在检测...'">
                  <i class="el-icon-loading" style="color:#0404B4" />
                  <label style="color:#0404B4;font-size: 8px">正在检测...</label>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="status" min-width="100" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <el-tooltip content="编辑" placement="left">
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-edit"
                    style="margin: 1px;"
                    circle
                    @click="handleEnvEdit(scope.$index, scope.row)"
                  />
                </el-tooltip>
                <el-tooltip content="删除" placement="right">
                  <el-button
                    v-show="scope.row.permission_type!=1"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    style="margin: 1px;"
                    circle
                    @click="handleEnvDelete(scope.$index, scope.row)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--ons-->
        <div v-show="serverDetail.server_type ==='ONS'" class="eltable">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="serverDetail.server_env"
            border
            style="font-size: 10px"
            :header-cell-style="{fontSize:'12px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
          >
            <el-table-column
              type="index"
              width="80"
              label="序号"
              align="center"
            />
            <el-table-column label="环境名称" prop="env_name" min-width="60" align="center" />
            <el-table-column label="ServiceAddress" prop="service_address" min-width="200" align="center" />
            <el-table-column label="AccessKey" prop="access_key" min-width="100" align="center" />
            <el-table-column label="SecretKey" prop="accesskey_secretkey" min-width="200" align="center" />
            <el-table-column label="Topic" prop="topic" min-width="100" align="center" />
            <el-table-column label="GroupId" prop="group_id" min-width="100" align="center" />
            <el-table-column label="ProducerId" prop="producer_id" min-width="100" align="center" />
          </el-table>
        </div>

        <!--        OSS-->
        <div v-show="serverDetail.server_type ==='OSS'" class="eltable">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="serverDetail.server_env"
            border
            style="font-size: 10px"
            class="form-table"
          >
            <el-table-column
              type="index"
              width="80"
              label="序号"
              align="center"
            />
            <el-table-column label="环境名称" prop="env_name" min-width="60" align="center" />
            <el-table-column label="Endpoint" prop="endpoint" min-width="200" align="center" />
            <el-table-column label="AccessKeyId" prop="accesskey_id" min-width="100" align="center" />
            <el-table-column label="AccessKeySecret" prop="accesskey_secret" min-width="200" align="center" />
            <el-table-column label="bucket" prop="bucket" min-width="100" />
          </el-table>
        </div>
        <!--        sftp-->
        <div v-show="serverDetail.server_type ==='SFTP'" class="eltable">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="serverDetail.server_env"
            border
            style="font-size: 14px"
            :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
          >
            <el-table-column
              type="index"
              width="80"
              label="序号"
              align="center"
            />
            <el-table-column label="环境名称" prop="env_name" min-width="60" align="center" />
            <el-table-column label="主机地址" prop="host" min-width="200" align="center" />
            <el-table-column label="用户名" prop="user" min-width="100" align="center" />
            <el-table-column label="密码" prop="password" min-width="200" align="center" />
          </el-table>
        </div>
        <br>
        <div style="margin-bottom: 20px"><label style="font-weight: bold;font-size: 15px">文档信息</label></div>
        <div style="float: right;margin: 5px;margin-right: 0px">
          <el-button
            v-if="serverDetail.server_type==='API'"
            style="background: #2290cd;color: snow;font-size: 12px"
            icon="el-icon-magic-stick"
            size="mini"
            :loading="debugButtonloading"
            @click="handleDebugging"
          >接口调试
          </el-button>
          <el-button
            style="font-size: 10px"
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="downloadDocument"
          >导出文档
          </el-button>
          <el-button
            v-if="serverDetail.server_type==='API'"
            style="font-size: 12px"
            type="info"
            icon="el-icon-s-promotion"
            size="mini"
            @click="importPostman"
          >
            Postman导入
          </el-button>
          <el-button
            v-if="serverDetail.server_type==='API'"
            style="background: #6269cd;color: snow;font-size: 12px"
            icon="el-icon-top"
            size="mini"
            @click="importSwagger"
          >
            Swagger导入
          </el-button>
          <el-button
            v-if="serverDetail.permission_type === 2"
            type="success"
            style="font-size: 12px"
            icon="el-icon-document-copy"
            size="mini"
            @click="useTemplate"
          >复制文档
          </el-button>
          <el-button
            v-if="serverDetail.permission_type === 2"
            style="font-size: 12px"
            type="primary"
            icon="el-icon-document-add"
            size="mini"
            @click="addDataConstruct"
          >新增接口
          </el-button>
        </div>
        <div style="display: inline-block">
          <div style="float: left;margin-right: 10px;margin-top: 5px" />
          <div style="float: right;">
            <el-input
              v-model="searchTxt"
              style="display: inline-block;width: 280px"
              placeholder="输入关键字"
              @input="seachApiList"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
        </div>
        <br>
        <div v-show="serverDetail.server_type ==='API'">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="apiList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            border
            :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
            style="font-size: 8px"
            :row-class-name="isShowIcon"
            @expand-change="getFacilityList"
          >
            >
            <el-table-column
              label="分支"
              width="60"
              align="center"
              type="expand"
              disabled="false"
            >
              <template slot-scope="props">
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
                  v-if="expandTable"
                  element-loading-spinner="el-icon-loading"
                  :data="expandTable.slice((currentPage2-1)*pagesize2,currentPage2*pagesize2)"
                  class="form-table"
                  border
                  style="font-size: 8px"
                  :header-cell-style="{fontSize:'10px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column label="分支名称" prop="branch" min-width="50px" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="col-cont" v-html="showData(scope.row.branch)" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="分支描述"
                    prop="description"
                    min-width="80px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="col-cont" style="font-size: 8px" v-html="showData(scope.row.description)" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="版本来源"
                    prop="version"
                    min-width="20px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-link
                        target="_blank"
                        style="color:#0174DF"
                        @click="goToVersionDetail(scope.row)"
                      ><span class="col-cont" style="font-size: 8px" v-html="showData(scope.row.version)" />
                      </el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="更新信息"
                    prop="update_time"
                    min-width="30px"
                    align="center"
                    :formatter="convertTimeFormat"
                    show-overflow-tooltip
                  />
                  <el-table-column label="契约服务" min-width="40px" align="center">
                    <template slot-scope="scope">
                      <el-link
                        target="_blank"
                        style="color:#0174DF"
                        @click="getBranchDoc(props.row,scope.$index,scope.row)"
                      ><span style="font-size: 8px">文档</span>
                      </el-link>
                      <span>&nbsp;|&nbsp;</span>
                      <el-popover
                        placement="right"
                        width="80"
                        trigger="hover"
                      >
                        <template>
                          <div>
                            <div class="get-body-item">
                              <el-button
                                size="mini"
                                type="primary"
                                style="background: #6269cd;color: snow;font-size: 8px"
                                icon="el-icon-folder"
                                @click="getDocRequestHeader(props.row,scope.$index, scope.row)"
                              >请求头
                              </el-button>
                            </div>
                            <div class="get-body-item">
                              <el-button
                                size="mini"
                                style="background: #cdcb2c;color: snow;font-size: 8px"
                                type="primary"
                                icon="el-icon-tickets"
                                @click="getDocRequestBody(props.row,scope.$index, scope.row)"
                              >请求体
                              </el-button>
                            </div>
                            <div class="get-body-item">
                              <el-button
                                size="mini"
                                style="background: #49b6cd;color: snow;font-size: 8px"
                                type="primary"
                                icon="el-icon-document"
                                @click="getDocResponseHeaders(props.row,scope.$index, scope.row)"
                              >响应头
                              </el-button>
                            </div>
                            <div class="get-body-item">
                              <el-button
                                size="mini"
                                style="background: #37cd4e;color: snow;font-size: 8px"
                                type="primary"
                                icon="el-icon-date"
                                @click="getDocResponseBody(props.row,scope.$index, scope.row)"
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
                  <el-table-column label="操作" width="120px" align="center">
                    <template slot-scope="scope">
                      <el-tooltip content="查看文档" placement="left">
                        <el-button
                          v-if="serverDetail.permission_type === 2"
                          size="mini"
                          type="primary"
                          icon="el-icon-view"
                          style="margin: 0px;"
                          circle
                          @click="handleViewBranch(scope.$index, scope.row)"
                        />
                      </el-tooltip>
                      <el-tooltip content="合并文档" placement="top">
                        <el-button
                          v-if="serverDetail.permission_type === 2"
                          size="mini"
                          type="success"
                          icon="el-icon-s-operation"
                          style="margin: 0px;"
                          circle
                          @click="handleMergeBranch(props.row, scope.row)"
                        />
                      </el-tooltip>
                      <el-tooltip content="删除分支" placement="right">
                        <el-button
                          v-if="serverDetail.permission_type === 2"
                          size="mini"
                          type="danger"
                          icon="el-icon-delete"
                          style="margin: 0px;"
                          circle
                          @click="deleteBranch(scope.$index, scope.row)"
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
                  :total="props.row.branchs.length"
                  @size-change="handleSizeChange2"
                  @current-change="handleCurrentChange2"
                />
              </template>
            </el-table-column>
            <el-table-column label="接口名称" prop="interface_name" min-width="120px" align="center">
              <template slot-scope="scope">
                <span class="col-cont" v-html="showData2(scope.row.interface_name)" />
              </template>
            </el-table-column>
            <el-table-column label="接口地址" prop="path" min-width="150px" align="left" show-overflow-tooltip>
              <template slot-scope="scope">
                <label
                  v-if="scope.row.method === 'POST'"
                  style="font-weight: bolder;background: #48cece;padding: 5px;color: white;font-size: x-small;border-radius:25px;"
                >{{
                  scope.row.method }}</label>
                <label
                  v-if="scope.row.method === 'GET'"
                  style="font-weight: bolder;background: #00df1c;padding: 5px;color: white;font-size: x-small;border-radius:25px;"
                >{{
                  scope.row.method }}</label>
                <label
                  v-if="scope.row.method === 'DELETE'"
                  style="font-weight: bolder;background: #d95155;padding: 5px;color: white;font-size: x-small;border-radius:25px;"
                >{{
                  scope.row.method }}</label>
                <label
                  v-if="scope.row.method === 'PUT'"
                  style="font-weight: bolder;background: #fd8008;padding: 5px;color: white;font-size: x-small;border-radius:25px;"
                >{{
                  scope.row.method }}</label>
                <span class="col-cont" v-html="showData2(scope.row.path)" />
              </template>
            </el-table-column>
            <el-table-column label="最新版本" min-width="80px" align="center">
              <template slot-scope="scope">
                <!--                <el-popover-->
                <!--                  placement="top"-->
                <!--                  width="400"-->
                <!--                  trigger="hover"-->
                <!--                  popper-class="popper-class"-->
                <!--                >-->
                <!--                  <template>-->
                <!--                    <ul class="infinite-server-list" style="overflow:auto">-->
                <!--                      <el-timeline style="margin-top: 10px;margin-right: 15px;margin-bottom: -10px;font-size: 10px">-->
                <!--                        <el-timeline-item-->
                <!--                          v-for="(version, index) in scope.row.versions"-->
                <!--                          :key="index"-->
                <!--                          type="primary"-->
                <!--                          color="#0bbd87"-->
                <!--                          icon="el-icon-chat-dot-round"-->
                <!--                          size="normal"-->
                <!--                          :timestamp="version.update_time"-->
                <!--                        >-->
                <!--                          <span style="font-size: 8px">修改人【{{ version.modifier }}】 更新信息【{{ version.description }}</span>-->
                <!--                        </el-timeline-item>-->
                <!--                      </el-timeline>-->
                <!--                    </ul>-->
                <!--                  </template>-->
                <!--                  <el-button slot="reference" style="border: none;margin-right: -5px">-->
                <!--                    <el-link-->
                <!--                      target="_blank"-->
                <!--                      style="color:#0174DF"-->
                <!--                      @click="goToDocVersionDetail(scope.row)"-->
                <!--                    ><span class="col-cont" v-html="showData2(scope.row.version)" />-->
                <!--                    </el-link>-->
                <!--                  </el-button>-->
                <!--                </el-popover>-->
                <el-tooltip
                  v-if="scope.row.description!=null"
                  effect="light"
                  :content="scope.row.description"
                  placement="top-start"
                >
                  <el-link
                    target="_blank"
                    style="color:#0174DF"
                    @click="goToDocVersionDetail(scope.row)"
                  ><label style="font-size: 8px">{{ scope.row.version }}</label>
                  </el-link>
                </el-tooltip>
                <el-tooltip content="创建分支" placement="right">
                  <el-button
                    v-if="serverDetail.permission_type === 2"
                    size="mini"
                    type="success"
                    icon="el-icon-document-copy"
                    style="margin: 0;"
                    circle
                    @click="handleAddBranch(scope.$index, scope.row)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="更新信息"
              prop="update_time"
              min-width="80px"
              :formatter="convertTimeFormat"
              align="center"
              show-overflow-tooltip
              sortable
            />
            <el-table-column label="契约服务" width="120px" align="center">
              <template slot-scope="scope">
                <el-link
                  target="_blank"
                  style="color:#0174DF"
                  @click="getContractDoc(scope.$index,scope.row)"
                ><span style="font-size: 8px;margin-right: 5px">文档</span>
                </el-link>
                <span>&nbsp;|&nbsp;</span>
                <el-popover
                  placement="right"
                  width="80"
                  trigger="hover"
                >
                  <template>
                    <div>
                      <div class="get-body-item">
                        <el-button
                          size="mini"
                          type="primary"
                          style="background: #6269cd;color: snow;font-size: 12px"
                          icon="el-icon-folder"
                          @click="getRequestHeader(scope.$index, scope.row)"
                        >请求头
                        </el-button>
                      </div>
                      <div class="get-body-item">
                        <el-button
                          size="mini"
                          style="background: #cdcb2c;color: snow;font-size: 12px"
                          type="primary"
                          icon="el-icon-tickets"
                          @click="getRequestBody(scope.$index, scope.row)"
                        >请求体
                        </el-button>
                      </div>
                      <div class="get-body-item">
                        <el-button
                          size="mini"
                          style="background: #49b6cd;color: snow;font-size: 12px"
                          type="primary"
                          icon="el-icon-document"
                          @click="getResponseHeaders(scope.$index, scope.row)"
                        >响应头
                        </el-button>
                      </div>
                      <div class="get-body-item">
                        <el-button
                          size="mini"
                          style="background: #37cd4e;color: snow;font-size: 12px"
                          type="primary"
                          icon="el-icon-date"
                          @click="getResponseBody(scope.$index, scope.row)"
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
            <el-table-column label="操作" min-width="100" align="center">
              <template slot-scope="scope">
                <el-tooltip content="查看文档" placement="left">
                  <el-button
                    v-if="serverDetail.permission_type === 2"
                    type="primary"
                    icon="el-icon-view"
                    style="margin: 0"
                    circle
                    @click="handleViewDoc(scope.$index, scope.row)"
                  />
                </el-tooltip>
                <el-tooltip content="编辑信息" placement="top">
                  <el-button
                    v-if="serverDetail.permission_type === 2"
                    size="mini"
                    type="warning"
                    icon="el-icon-edit"
                    style="margin: 0;"
                    circle
                    @click="handleInterfaceEdit(scope.$index, scope.row)"
                  />
                </el-tooltip>
                <!--                <el-tooltip content="创建分支" placement="bottom">-->
                <!--                  <el-button-->
                <!--                    v-if="serverDetail.permission_type === 2"-->
                <!--                    size="mini"-->
                <!--                    type="success"-->
                <!--                    icon="el-icon-document-copy"-->
                <!--                    style="margin: 0;"-->
                <!--                    circle-->
                <!--                    @click="handleAddBranch(scope.$index, scope.row)"-->
                <!--                  />-->
                <el-tooltip content="删除文档" placement="top">
                  <el-button
                    v-if="serverDetail.permission_type === 2&&scope.row.branchs==null"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    style="margin: 0;"
                    circle
                    @click="deleteInterface(scope.row)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="apiList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <!--ONS-->
        <div v-show="serverDetail.server_type ==='ONS'">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="apiList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            border
            style="font-size: 14px"
            :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
          >
            <el-table-column
              type="index"
              width="80"
              label="序号"
              align="center"
            />
            <el-table-column label="MessageTag" prop="tag" min-width="150" align="center" />
            <el-table-column label="处理类型" prop="handle_type" min-width="100" align="center" />
            <el-table-column label="说明" prop="interface_name" min-width="150" align="center" />
            <el-table-column label="文档版本" prop="version" min-width="100" align="center" />
            <el-table-column label="更新时间" prop="update_time" min-width="200" align="center" />
            <el-table-column label="数据模板" width="200" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <a :href="scope.row.request_url" target="_blank" style="color:#0000FF" class="buttonText">数据模板</a>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="handleDetail(scope.$index, scope.row)"
                >查看文档
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="apiList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <!--        oss-->
        <div v-show="serverDetail.server_type ==='OSS'">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="apiList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            border
            style="font-size: 14px"
            :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
          >
            <el-table-column
              type="index"
              width="80"
              label="序号"
              align="center"
            />
            <el-table-column label="对象路径" prop="obj_path" min-width="200" align="center" />
            <el-table-column label="对象名" prop="obj_code" min-width="150" align="center" />
            <el-table-column label="对象类型" prop="obj_type" min-width="100" align="center" />
            <el-table-column label="说明" prop="obj_name" min-width="200" align="center" />
            <el-table-column label="文档版本" prop="version" min-width="100" align="center" />
            <el-table-column label="更新时间" prop="update_time" min-width="200" align="center" />
            <el-table-column label="数据模板" width="200" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <a :href="apiUrl+scope.row.obj_path" target="_blank" style="color:#0174DF" class="buttonText">模板文件</a>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="handleDetail(scope.$index, scope.row)"
                >查看文档
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="apiList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!--        SFTP-->
        <div v-show="serverDetail.server_type ==='SFTP'">
          <el-table
            element-loading-spinner="el-icon-loading"
            :data="apiList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            border
            style="font-size: 14px"
            :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#CED8F6',color:'#606266'}"
            class="form-table"
          >
            <el-table-column
              type="index"
              width="80"
              label="序号"
              align="center"
            />
            <el-table-column label="文件路径" prop="file_path" min-width="150" align="center" />
            <el-table-column label="文件名" prop="file_name" min-width="100" align="center" />
            <el-table-column label="文件类型" prop="file_type" min-width="150" align="center" />
            <el-table-column label="说明" prop="interface_name" min-width="200" align="center" />
            <el-table-column label="文档版本" prop="version" min-width="100" align="center" />
            <el-table-column label="更新时间" prop="update_time" min-width="150" align="center" />
            <el-table-column label="数据模板" width="200" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <a
                  :href="apiUrl+scope.row.file_path+scope.row.file_name"
                  target="_blank"
                  style="color:#0174DF"
                  class="buttonText"
                >模板文件</a>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="handleDetail(scope.$index, scope.row)"
                >查看文档
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="apiList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <el-dialog
        title="复制文档"
        :visible.sync="templateVisible"
        width="45%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <br>
        <div v-loading="addLoading" class="content-box">
          <el-form
            ref="docForm"
            :inline="false"
            :rules="rules"
            :model="docForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="请求方式:" prop="method">
                  <el-select
                    v-model="docForm.method"
                    placeholder="请选择请求方式"
                    style="display: block;"
                  >
                    <el-option
                      v-for="item in methodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="接口地址:" prop="path">
                  <el-input
                    v-model="docForm.path"
                    placeholder="请输入接口地址"
                    maxlength="256"
                  >
                    <template slot="prepend">/</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="接口名称:" prop="interface_name">
                  <el-input
                    v-model="docForm.interface_name"
                    placeholder="请输入接口名称"
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="接口说明:" prop="interface_description">
                  <el-input
                    v-model="docForm.interface_description"
                    type="textarea"
                    placeholder="请输入接口说明"
                    rows="5"
                    show-word-limit
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="选择文档:">
                  <el-cascader
                    v-model="templateId"
                    :options="templatesOptions"
                    placeholder="选择文档，可复制请求和响应信息"
                    clearable
                    filterable
                    separator=" > "
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="templateVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="copyTemplate('docForm')">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="新增接口"
        :visible.sync="newDocVisible"
        width="50%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <br>
        <div v-loading="addLoading" class="content-box">
          <el-form
            ref="docForm"
            :inline="false"
            :rules="rules"
            :model="docForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="请求方式:" prop="method">
                  <el-select
                    v-model="docForm.method"
                    placeholder="请选择请求方式"
                    style="display: block;"
                  >
                    <el-option
                      v-for="item in methodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="接口地址:" prop="path">
                  <el-input
                    v-model="docForm.path"
                    placeholder="请输入接口地址"
                    maxlength="256"
                  >
                    <template slot="prepend">/</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="接口名称:" prop="interface_name">
                  <el-input
                    v-model="docForm.interface_name"
                    placeholder="请输入接口名称"
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="接口说明:" prop="interface_description">
                  <el-input
                    v-model="docForm.interface_description"
                    type="textarea"
                    placeholder="请输入接口说明"
                    rows="5"
                    show-word-limit
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="报文继承:" prop="publicValue">
                  <el-cascader
                    v-model="docForm.publicValue"
                    :options="publicOptions"
                    placeholder="选择接口，可继承请求和响应信息"
                    clearable
                    separator=" > "
                    style="width: 100%;"
                    @change="handlePublicChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="newDocVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="addApiDoc('docForm')">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="编辑信息"
        :visible.sync="editDocVisible"
        width="50%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <br>
        <div v-loading="addLoading" class="content-box">
          <el-form
            ref="editDocForm"
            :inline="false"
            :rules="rules"
            :model="editDocForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item label="请求方式:" prop="method">
                  <el-select
                    v-model="editDocForm.method"
                    placeholder="请选择请求方式"
                    style="display: block;"
                  >
                    <el-option
                      v-for="item in methodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="接口地址:" prop="path">
                  <el-input
                    v-model="editDocForm.path"
                    placeholder="请输入接口地址"
                    maxlength="256"
                  >
                    <template slot="prepend">/</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="接口名称:" prop="interface_name">
                  <el-input
                    v-model="editDocForm.interface_name"
                    placeholder="请输入接口名称"
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="接口说明:" prop="interface_description">
                  <el-input
                    v-model="editDocForm.interface_description"
                    type="textarea"
                    placeholder="请输入接口说明"
                    rows="5"
                    show-word-limit
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="报文继承:" prop="publicValue">
                  <el-cascader
                    v-model="editDocForm.publicValue"
                    :options="publicOptions"
                    placeholder="选择接口，可继承请求和响应信息"
                    clearable
                    separator=" > "
                    style="width: 100%;"
                    @change="handlePublicChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="editDocVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="editApiDocSubmit('editDocForm')">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-loading="addLoading"
        title="创建分支"
        :visible.sync="addBranchVisible"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <br>
        <div class="content-box">
          <el-form
            ref="branchForm"
            :inline="false"
            :rules="rules"
            :model="branchForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="分支名称:" prop="branch">
                  <el-input
                    v-model="branchForm.branch"
                    placeholder="请输入分支名称"
                    maxlength="256"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="版本来源:" prop="version">
                  <el-select
                    v-model="branchForm.version"
                    placeholder="选择版本来源"
                    clearable
                    filterable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in versionOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="分支描述:" prop="describe">
                  <el-input
                    v-model="branchForm.describe"
                    placeholder="请输入分支描述"
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="addBranchVisible = false">取 消</el-button>
          <el-button type="primary" @click="addBranchSubmit('branchForm')">新建</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-loading="addLoading"
        title="创建用例集"
        :visible.sync="addDataSetVisible"
        width="40%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <br>
        <div class="content-box">
          <el-form
            ref="branchForm"
            :inline="false"
            :rules="rules"
            :model="addDataSetForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="用例集名称:" prop="name">
                  <el-input
                    v-model="addDataSetForm.name"
                    placeholder="请输入用例集名称"
                    maxlength="256"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用例集描述:" prop="description">
                  <el-input
                    v-model="addDataSetForm.description"
                    type="textarea"
                    rows="3"
                    placeholder="请输入用例集描述"
                    show-word-limit
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="addDataSetVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDataSetSubmit('branchForm')">新建</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="通过Swagger转换成接口文档"
        :visible.sync="swaggerImportVisible"
        width="40%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <Box v-loading="addLoading">
          <div>
            <div style="margin-bottom: 20px">
              <template>
                <label>导入方式：</label>
                <el-radio v-model="radio" label="1">单个接口导入</el-radio>
                <el-radio v-model="radio" label="2">批量导入</el-radio>
              </template>
            </div>
            <el-form :model="swaggerForm" class="demo-form-inline" label-width="120px">
              <el-row>
                <el-col>
                  <el-form-item label="Swagger地址:">
                    <el-input v-model="swaggerForm.swagger_url" placeholder="请输入Swagger地址" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item v-if="radio==='1'" label="API地址:">
                    <el-select v-model="swaggerForm.api_name" filterable placeholder="请输入API地址">
                      <el-option
                        v-for="item in swaggerApiOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item v-if="radio==='1'" label="API请求方式:">
                    <el-select v-model="swaggerForm.method" placeholder="请选择API请求方式">
                      <el-option
                        v-for="item in swaggerMethodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="margin: 20px 0;" />
            <div slot="footer" class="dialog-footer">
              <el-button type="danger" @click="swaggerImportVisible = false">取 消</el-button>
              <el-button v-if="radio==='1'" type="success" @click="syncSwaggerApi">同步API</el-button>
              <el-button type="primary" :loading="regionLoading" @click="importSwaggerSubmit">导入</el-button>
            </div>
          </div>
        </Box>
      </el-dialog>
      <el-dialog
        title="通过PostMan转换成接口文档"
        :visible.sync="postmanImportVisible"
        width="25%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <Box v-loading="addLoading">
          <div>
            <el-upload
              v-if="serverDetail.server_type==='API'"
              ref="upload"
              class="upload-demo"
              :action="uploadPostman"
              :auto-upload="false"
              :show-file-list="true"
              :file-list="fileList"
              :on-change="changeFile"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传json文件，且不超过2M</div>
            </el-upload>
            <div style="margin: 20px 0;" />
            <div slot="footer" class="dialog-footer">
              <el-button type="danger" @click="postmanImportVisible = false">取 消</el-button>
              <el-button type="primary" @click="importPostSubmit">导入</el-button>
            </div>
          </div>
        </Box>
      </el-dialog>
      <el-dialog
        title="修改配置"
        :visible.sync="editEnvVisible"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <br>
        <el-form ref="editEnvForm" :model="editEnvForm" :show-message="false" label-width="100px">
          <el-form-item label="配置名称" prop="env_name" required>
            <el-input v-model="editEnvForm.env_name" />
          </el-form-item>
          <el-form-item label="协议类型" prop="protocol" required>
            <el-select v-model="editEnvForm.protocol" placeholder="请选择">
              <el-option
                v-for="item in protocolOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主机地址" prop="host" required>
            <el-input v-model="editEnvForm.host" />
          </el-form-item>
          <el-form-item label="端口" prop="port" required>
            <el-input v-model="editEnvForm.port" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="editEnvVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="editEnvSubmit('editEnvForm')">保存</el-button>
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
                      :key="item.key"
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
              <el-col :span="24">
                <el-form-item label="接口选择:" prop="api">
                  <el-select v-model="httpDebugForm.api" style="width: 50%" placeholder="请选接口" @change="changeApi">
                    <el-option
                      v-for="item in apiOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
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
              <el-col :span="12">
                <el-form-item label="数据来源:" prop="branch1">
                  <el-select v-model="httpDebugForm.dataSource" placeholder="请选数据来源">
                    <el-option
                      v-for="item in dataSourceOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="httpDebugForm.dataSource==='版本'" label="版本:" prop="branch1">
                  <el-select v-model="httpDebugForm.version" placeholder="请选择版本" @change="changeDataSourceForVersion">
                    <el-option
                      v-for="item in versionDebugOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="httpDebugForm.dataSource==='分支'" label="分支:" prop="branch1">
                  <el-select v-model="httpDebugForm.branch" placeholder="请选择分支" @change="changeDataSourceForBranch">
                    <el-option
                      v-for="item in branchOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="httpDebugForm.dataSource==='用例集'" label="用例集:" prop="dataset">
                  <el-cascader
                    v-model="httpDebugForm.dataset"
                    :options="datasetOptions"
                    placeholder="请选用例集..."
                    clearable
                    filterable
                    separator=" > "
                    style="width: 100%;"
                    @change="changeDataSourceForDataSet"
                  />
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
