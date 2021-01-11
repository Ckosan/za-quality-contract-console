<style lang='scss' src="../css/httpDataConstructDetail.scss"></style>
<script src="../js/apiDataSetsList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <div>
        <el-row style="margin: 10px;">
          <el-col :span="12">
            <div style="font-size: 18px;font-style: italic;color: #8d8d8d;">
              {{ serverInfo.project_name }}&nbsp;/&nbsp;{{ serverInfo.application_name }}
            </div>
            <div style="margin-top: 5px;" />
            <div style="font-size: 16px;font-style: italic;color: #8d8d8d;">
              <b>{{ serverInfo.server_name }}</b>
            </div>
            <div style="font-size: 14px;font-style: italic;color: #8d8d8d;margin-top: 5px">
              <b>{{ apiInfoTitle }}</b>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right;">
              <el-button type="info" icon="el-icon-back" @click="gobackList">用例集列表
              </el-button>
              <el-button type="warning" icon="el-icon-right" @click="goback">服务详情
              </el-button>
            </div>
          </el-col>
        </el-row>
        <hr style="background: #cecece;border: none;height: 1px; ">
      </div>
      <div>
        <SearchContainer style="text-align: center;">
          <el-form
            ref="searchForm"
            :inline="true"
            label-width="110px"
            size="medium"
            :rules="rules"
            :model="searchForm"
            class="query-form mb20"
          >
            <el-form-item label="名称" prop="name" class="rowItem">
              <el-input
                v-model="searchForm.name"
                style="display: inline-block"
                autocomplete="off"
                placeholder="名称"
                icon="caret-top"
                type="text"
                rows="2"
              />
            </el-form-item>
          </el-form>
          <div class="tc" style="text-align:center;margin-top:10px;">
            <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="warning" size="medium" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="success" size="medium" icon="el-icon-plus" @click="addDataSet">新增</el-button>
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
          :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#394d66',color:'#fafafa'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            width="60px"
            label="序号"
            align="center"
          />
          <el-table-column label="契约名称" prop="name" min-width="100px" align="center" />
          <el-table-column label="契约描述" prop="description" min-width="200px" align="center" />
          <el-table-column label="版本同步" prop="sync_status" min-width="60px" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.sync_status==='SUCCESS'">
                <label>成功</label>
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-check"
                  style="margin: 0px;"
                  circle
                />
              </div>
              <div v-if="scope.row.sync_status==='FAIL'">
                <label>失败</label>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-close"
                  style="margin: 0px;"
                  circle
                />
              </div>
              <div v-if="scope.row.sync_status==='PROCESSING'">
                <label>处理中</label>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-loading"
                  style="margin: 0px;"
                  circle
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="更新信息"
            prop="update_time"
            :formatter="convertTimeFormat"
            min-width="80px"
            align="center"
            sortable
          />
          <el-table-column label="操作" min-width="70px" align="center">
            <template slot-scope="scope">
              <el-tooltip content="编辑基本信息" placement="top">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  style="margin: 0px;"
                  circle
                  @click="handleEdit(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="查看契约数据" placement="top">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-view"
                  style="margin: 0px;"
                  circle
                  @click="handleDataSetEdit(scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="right">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  style="margin: 0px;"
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
      </div>

      <el-dialog
        v-loading="addLoading"
        title="新增用例集数据"
        :visible.sync="addDataSetVisible"
        width="50%"
        :show-close="false"
        :close-on-click-modal="false"
      >
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
      <el-dialog v-loading="addLoading" title="编辑用例集数据" :visible.sync="editFormVisible" width="50%" :show-close="false" :close-on-click-modal="false">
        <br>
        <div class="content-box">
          <el-form
            ref="editForm"
            :inline="false"
            :rules="rules"
            :model="editForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="用例集名称:" prop="name">
                  <el-input
                    v-model="editForm.name"
                    placeholder="请输入用例集名称"
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
          <el-button type="danger" @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="addLoading" @click="editDataSetSubmit('editForm')">新建</el-button>
        </div>
      </el-dialog>
    </Box>
  </div>
</template>
