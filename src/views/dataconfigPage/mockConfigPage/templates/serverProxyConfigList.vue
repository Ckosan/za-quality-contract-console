<style lang='scss' src="../css/apiMockConfigList.scss"></style>
<script src="../js/serverProxyConfigList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div>
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
            <el-form-item label="归属项目" prop="name" class="rowItem">
              <el-select
                v-model="searchForm.project_info"
                filterable
                clearable
                placeholder="请选择归属项目"
                auto-complete="off"
                style="width:200px;"
                @change="getAppinfo"
              >
                <el-option
                  v-for="item in projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="归属应用" prop="application_info" class="rowItem">
              <el-select
                v-model="searchForm.application_info"
                filterable
                clearable
                placeholder="请选择归属应用"
                auto-complete="off"
                style="width:200px;"
                @change="getServerinfo"
              >
                <el-option
                  v-for="item in appOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="归属服务" prop="server_info" class="rowItem">
              <el-select
                v-model="searchForm.server_info"
                filterable
                clearable
                placeholder="请选择归属服务"
                auto-complete="off"
                style="width:200px;"
              >
                <el-option
                  v-for="item in serverOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="名称" prop="describe" class="rowItem">
              <el-input
                v-model="searchForm.name"
                style="display: inline-block"
                autocomplete="off"
                placeholder="名称"
                icon="caret-top"
                type="text"
                rows="2"
              />
            </el-form-item> -->
          </el-form>
          <div class="tc" style="text-align:center;margin-top:10px;">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addMockConfig">新增</el-button>
          </div>
        </SearchContainer>
        <div style="float: left;">
          <el-input
            v-model="searchTxt"
            style="display: inline-block;width: 300px"
            placeholder="输入关键字"
            @input="seachList"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
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
            type="index"
            width="60px"
            label="序号"
            align="center"
          />
          <el-table-column label="归属项目" prop="project_info" min-width="70px" align="center">
            <template slot-scope="scope">
              <router-link
                tag="a"
                style="color:#0174DF"
                :to="'/configpage/projectdetail/'+scope.row.project_id"
              ><span class="col-cont" v-html="showDate(scope.row.project_info)" />
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="归属应用" prop="application_info" min-width="70px" align="center">
            <template slot-scope="scope">
              <router-link
                tag="a"
                style="color:#0174DF"
                :to="'/configpage/applicationdetail/'+scope.row.application_id"
              ><span class="col-cont" v-html="showDate(scope.row.application_info)" />
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="归属服务" prop="server_info" min-width="70px" align="center">
            <template slot-scope="scope">
              <router-link
                tag="a"
                style="color:#0174DF"
                :to="'/configpage/serverdetail/'+scope.row.server_id"
              ><span class="col-cont" v-html="showDate(scope.row.server_info)" />
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="代理编码" prop="code" min-width="70px" align="center">
            <template slot-scope="scope">
              <span class="col-cont" style="font-size: 8px" v-html="showDate(scope.row.code)" />
            </template>
          </el-table-column>
          <el-table-column label="代理说明" prop="name" min-width="70px" align="center">
            <template slot-scope="scope">
              <span class="col-cont" style="font-size: 8px" v-html="showDate(scope.row.name)" />
            </template>
          </el-table-column>
          <el-table-column label="代理地址" prop="name" min-width="150px" align="center">
            <template slot-scope="scope">
              <label style="color: #1e6abc;font-size: 8px">{{ mockApi+scope.row.server_id }}/{{ scope.row.code }}</label>
            </template>
          </el-table-column>
          <el-table-column label="默认路由" prop="default_router" min-width="50px" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.default_router!=null&&scope.row.default_router!=''">
                <label style="font-size: 8px">{{ scope.row.default_router }}</label>
                <el-tooltip
                  class="item env-item"
                  effect="light"
                  :content="scope.row.router_host"
                  placement="right-start"
                >
                  <i class="el-icon-warning" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="更新信息"
            prop="update_time"
            :formatter="convertTimeFormat"
            min-width="70px"
            align="center"
            sortable
          />
          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-tooltip content="查看代理" placement="top">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-view"
                  style="margin: 0px;"
                  circle
                  @click="viewMockConfig(scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="修改代理" placement="top">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  style="margin: 0px;"
                  circle
                  @click="handleEdit(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="删除代理" placement="top">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  style="margin: 0px;"
                  circle
                  @click="deleteProxy(scope.$index,scope.row)"
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
    <el-dialog title="新增代理" :visible.sync="mockVisible" width="40%" :show-close="false" :close-on-click-modal="false">
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
              <el-form-item label="选择服务:" prop="templateId">
                <el-cascader
                  v-model="mockAddForm.templateId"
                  :options="templatesOptions"
                  placeholder="选择服务"
                  clearable
                  filterable
                  separator=" > "
                  style="width: 100%;"
                  @change="initSelectData"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="代理名称:" prop="name">
                <el-input
                  v-model="mockAddForm.name"
                  placeholder="请输入代理名称"
                  maxlength="1024"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="代理编码:" prop="code">
                <el-input
                  v-model="mockAddForm.code"
                  placeholder="请输入代理编码"
                  maxlength="1024"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="默认路由:" prop="defaultRouter">
                <el-select
                  v-model="mockAddForm.defaultRouter"
                  placeholder="请选择代理模式"
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
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button type="success" :loading="addLoading" @click="addBranchSubmit('docForm')">新增分支</el-button>-->
        <el-button type="danger" @click="mockVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addMockSubmit('docForm')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑代理"
      :visible.sync="editFormVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <br>
      <div v-loading="addLoading" class="acontent-box">
        <el-form
          ref="editForm"
          :inline="false"
          :rules="rules"
          :model="editForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="选择服务:" prop="templateId">
                <el-cascader
                  v-model="editForm.templateId"
                  :options="templatesOptions"
                  placeholder="选择服务"
                  clearable
                  filterable
                  separator=" > "
                  style="width: 100%;"
                  @change="initSelectData"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="代理名称:" prop="name">
                <el-input
                  v-model="editForm.name"
                  placeholder="请输入代理名称"
                  maxlength="1024"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="代理编码:" prop="code">
                <el-input
                  v-model="editForm.code"
                  placeholder="请输入代理编码"
                  maxlength="1024"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="默认路由:" prop="defaultRouter">
                <el-select
                  v-model="defaultRouter"
                  placeholder="默认路由"
                  style="display: block;"
                >
                  <el-option
                    v-for="item in env_info"
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
        <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
