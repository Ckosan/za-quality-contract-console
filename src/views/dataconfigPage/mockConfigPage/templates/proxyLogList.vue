<style lang='scss' src="../css/apiMockConfigList.scss"></style>
<script src="../js/proxyLogList.js"></script>
<template>
  <div v-loading="regionLoading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <SearchContainer>
        <div class="tc" style="text-align:center;margin-top:10px;display: inline-block;margin-left: 30%">
          <div style="display: inline-block;margin-right: 5px">
            <label style="font-size: 12px">关键字</label>
            <el-input
              v-model="searchForm.search_value"
              style="display: inline-block;font-size: 12px"
              autocomplete="off"
              placeholder="关键字"
              icon="caret-top"
              type="text"
              rows="2"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
          <div style="display: inline-block;margin-left: 2px;margin-right: 5px">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          </div>
          <div style="display: inline-block;margin-left: 5px">
            <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </div>
        </div>
      </SearchContainer>
      <div style="float: left;">
        <el-input
          v-model="searchTxt"
          style="display: inline-block;width: 280px"
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
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column label="服务信息" prop="project_name" min-width="60px" align="center">
          <template slot-scope="scope">
            <span
              class="col-cont"
              v-html="showDate(scope.row.project_name+'/'+scope.row.application_name+'/'+scope.row.server_name)"
            />
          </template>
        </el-table-column>
        <el-table-column label="代理地址" prop="url" min-width="80px" align="center">
          <template slot-scope="scope">
            <span class="col-cont" v-html="showDate(scope.row.url)" />
          </template>
        </el-table-column>
        <el-table-column label="请求信息" prop="request_body" min-width="120px" align="center">
          <template slot-scope="scope">
            <div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">请求时间:</span>
                <span
                  class="col-cont"
                  v-html="showDate(getDataFormat(scope.row.entrance_engine_time))"
                />
              </div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">请求方式:</span>
                <span
                  class="col-cont"
                  v-html="showDate(scope.row.method_enum)"
                />
              </div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">请求校验:</span>
                <span
                  class="col-cont"
                  v-html="showDate(scope.row.req_check!=false?'开启':'未开启')"
                />
              </div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">请求头:</span>
                <span
                  class="col-cont"
                  v-html="showDate(JSON.stringify(scope.row.request_headers!=null?scope.row.request_headers:{}))"
                />
              </div>
              <div>
                <span style="font-weight: bold;font-size: 8px;float: left">请求体:</span>
                <span class="col-cont" v-html="showDate(scope.row.request_body)" />
              </div>
              <div>
                <span style="font-weight: bold;font-size: 8px;float: left">请求校验:</span>
                <span class="col-cont" v-html="showDate(scope.row.req_check_false_message!=null?scope.row.req_check_false_message.reason:null)" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="响应信息" prop="response_body" min-width="120px" align="center">
          <template slot-scope="scope">
            <div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">响应时间:</span>
                <span
                  class="col-cont"
                  v-html="showDate(getDataFormat(scope.row.proxy_resp_time))"
                />
              </div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">响应模式:</span>
                <span
                  class="col-cont"
                  v-html="showDate(scope.row.response_type_enum)"
                />
              </div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">响应校验:</span>
                <span
                  class="col-cont"
                  v-html="showDate(scope.row.resp_check!=false?'开启':'未开启')"
                />
              </div>
              <div style="margin-bottom: 2px">
                <span style="font-weight: bold;font-size: 8px;float: left">响应头:</span>
                <span
                  class="col-cont"
                  v-html="showDate(JSON.stringify(scope.row.response_headers==null?{}:scope.row.response_headers))"
                />
              </div>
              <div>
                <span style="font-weight: bold;font-size: 8px;float: left">响应体:</span>
                <span class="col-cont" v-html="showDate(scope.row.response_body)" />
              </div>
              <div>
                <span style="font-weight: bold;font-size: 8px;float: left">响应校验:</span>
                <span class="col-cont" v-html="showDate(scope.row.resp_check_false_message!=null?scope.row.resp_check_false_message.reason:null)" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="created_date"
          :formatter="convertDataFormat"
          min-width="70"
          align="center"
          sortable
        />
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </Box>

  </div>
</template>
