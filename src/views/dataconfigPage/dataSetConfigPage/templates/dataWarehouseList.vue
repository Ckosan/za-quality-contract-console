<style lang='scss' src="../css/apiDataSetsList.scss"></style>
<script src="../js/dataWarehouseList.js"></script>
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
                @change="getAPIinfo"
              >
                <el-option
                  v-for="item in serverOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="名称" prop="name" class="name">
              <el-input
                v-model="searchForm.name"
                style="display: inline-block"
                autocomplete="off"
                placeholder="名称"
                icon="caret-top"
                type="text"
              />
            </el-form-item> -->
          </el-form>
          <div class="tc" style="text-align:center;margin-top:10px;">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addDataSet">新增</el-button>
          </div>
        </SearchContainer>
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
          <el-table-column label="归属项目" prop="project_info" min-width="80px" align="center">
            <template slot-scope="scope">
              <router-link
                tag="a"
                style="color:#0174DF"
                :to="'/configpage/projectdetail/'+scope.row.project_id"
              ><span class="col-cont" v-html="showDate(scope.row.project_info)" />
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="归属应用" prop="application_info" min-width="80px" align="center">
            <template slot-scope="scope">
              <router-link
                tag="a"
                style="color:#0174DF"
                :to="'/configpage/applicationdetail/'+scope.row.application_id"
              ><span class="col-cont" v-html="showDate(scope.row.application_info)" />
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="归属服务" prop="server_info" min-width="100px" align="center">
            <template slot-scope="scope">
              <router-link
                tag="a"
                style="color:#0174DF"
                :to="'/configpage/serverdetail/'+scope.row.server_id"
              ><span class="col-cont" v-html="showDate(scope.row.server_info)" />
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="用例集名称" prop="name" min-width="100px" align="center">
            <template slot-scope="scope">
              <span class="col-cont" v-html="showDate(scope.row.name)" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="说明" prop="description" min-width="180px" align="center" /> -->
          <el-table-column
            label="更新信息"
            prop="update_time"
            :formatter="convertTimeFormat"
            min-width="120px"
            align="center"
            sortable=""
          />
          <el-table-column label="操作" min-width="100" align="center">
            <template slot-scope="scope">
              <!-- <el-tooltip content="新增契约数据" placement="top">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  style="margin: 0px;"
                  circle
                  @click="handleEdit(scope.row)"
                />
              </el-tooltip> -->
              <el-tooltip content="查看用例集" placement="top">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-view"
                  style="margin: 0px;"
                  circle
                  @click="viewDataSet(scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="修改基本信息" placement="top">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  style="margin: 0px;"
                  circle
                  @click="handleEditItem(scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="删除用例集" placement="top">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  style="margin: 0px;"
                  circle
                  @click="deleteItem(scope.row)"
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
      <el-dialog v-loading="addLoading" title="新增契约数据" :visible.sync="addDataSetVisible2" width="40%" :show-close="false" :close-on-click-modal="false">
        <br>
        <div class="content-box">
          <el-form
            ref="addDataSetForm"
            :inline="false"
            :rules="rules"
            :model="addDataSetForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="契约名称:" prop="name">
                  <el-input
                    v-model="addDataSetForm.name"
                    placeholder="请输入契约名称"
                    maxlength="256"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="契约描述:" prop="description">
                  <el-input
                    v-model="addDataSetForm.description"
                    type="textarea"
                    rows="3"
                    placeholder="请输入契约描述"
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="addDataSetVisible2 = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="addRowDataSetSubmit('addDataSetForm')">新建</el-button>
        </div>
      </el-dialog>

      <el-dialog v-loading="addLoading" title="新增数据用例集" :visible.sync="addDataSetVisible" width="50%" :show-close="false" :close-on-click-modal="false">
        <br>
        <div class="content-box">
          <el-form
            ref="addDataSetForm"
            :inline="false"
            :rules="rules"
            :model="addDataSetForm"
            label-width="130px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择服务:" prop="templateId">
                  <el-cascader
                    v-model="addDataSetForm.templateId"
                    :options="templatesOptions"
                    placeholder="选择服务"
                    clearable
                    filterable
                    separator=" > "
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
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
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="addDataSetVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="addDataSetSubmit('addDataSetForm')">新建</el-button>
        </div>
      </el-dialog>

      <el-dialog v-loading="addLoading" title="修改数据用例集" :visible.sync="editVisible" width="50%" :show-close="false" :close-on-click-modal="false">
        <br>
        <div class="content-box">
          <el-form
            ref="editForm"
            :inline="false"
            :rules="rules"
            :model="editForm"
            label-width="130px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="用例集名称:" prop="name">
                  <el-input
                    v-model="editForm.name"
                    placeholder="请输入用例集集名称"
                    maxlength="256"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用例集描述:" prop="description">
                  <el-input
                    v-model="editForm.description"
                    type="textarea"
                    rows="3"
                    placeholder="请输入用例集描述"
                    maxlength="2046"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="editVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="handleEditItemSubmit('editForm')">保存</el-button>
        </div>
      </el-dialog>
    </Box>
  </div>
</template>
