<style lang='scss' src="../css/crontab.scss" scoped></style>
<script src="../js/crontab.js"></script>
<template>
  <div class="credit-record">
    <Box class="content-box">
      <SearchContainer>
        <el-form ref="searchForm" :inline="true" label-width="110px" size="mini" :rules="rules" :model="searchForm" class="query-form mb20">
          <el-form-item label="合作机构名称" prop="partnerId">
            <el-select v-model="searchForm.partnerId" filterable clearable placeholder="请选择" @change="onParterChange" @clear="onClearPartener">
              <el-option
                v-for="item in dropDownOj.partnerInfo"
                :key="item.partnerName"
                :label="item.partnerName"
                :value="item.partnerName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="营销活动名称" prop="marketId">
            <el-select v-model="searchForm.marketId" filterable clearable placeholder="请选择" @change="onMarketChange" @clear="onClearMarket">
              <el-option
                v-for="item in dropDownOj.marketInfo"
                :key="item.marketId"
                :label="item.marketName"
                :value="item.marketId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="信贷产品名称" prop="productCodes">
            <el-select v-model="searchForm.productCodes" clearable style="height:30px !important;" filterable multiple placeholder="请选择">
              <el-option
                v-for="(item,index) in fileredProducts"
                :key="index+'-'+item.productCode"
                :label="item.productName"
                :value="item.productCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="投保申请号" prop="creditApplyNo">
            <el-input v-model="searchForm.creditApplyNo" clearable placeholder="请输入名称" auto-complete="off" style="width:200px;" />
          </el-form-item>
          <el-form-item label="身份证号" prop="certNo">
            <el-input v-model="searchForm.certNo" clearable placeholder="请输入名称" auto-complete="off" style="width:200px;" />
          </el-form-item>

          <el-form-item label="核保结果" prop="applyStatus">
            <el-select v-model="searchForm.applyStatus" clearable placeholder="请选择">
              <el-option
                v-for="item in SELECT_DATA.applyStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="投保申请时间">
            <el-date-picker v-model="searchForm.applyTime" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" style="width:200px;" />

            <!-- <el-date-picker
              v-model="searchForm.applyBeginTime"
              type="date"
              style="width:200px;"
              placeholder="选择开始日期"
            /><span style="margin-left:20px;margin-right:20px;">至</span>
            <el-date-picker
              v-model="searchForm.applyEndTime"
              type="date"
              style="width:265px;"
              placeholder="选择结束日期"
            /> -->
            <!-- <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker> -->
          </el-form-item>
          <div class="tc" style="margin-top:10px;">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSearch()">查询</el-button>
            <el-button type="warning" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <!--            <el-button v-if="pageRoles.export" :loading="downloadLoading" type="success" size="mini" icon="el-icon-download" @click="excelDownload">导出</el-button>-->
          </div>
        </el-form>
      </SearchContainer>
      <el-table
        v-loading="regionLoading"
        element-loading-spinner="el-icon-loading"
        :data="creditRecordList"
        border
        class="form-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column label="合作机构名称" prop="partnerName" min-width="200" />
        <el-table-column label="营销活动名称" prop="marketName" min-width="200" />
        <el-table-column label="信贷产品编码" prop="productCode" min-width="200" />
        <el-table-column label="信贷产品名称" prop="productName" min-width="200" />
        <el-table-column label="投保申请时间" prop="applyDate" min-width="200">
          <template slot-scope="scope">{{ scope.row.applyDate |parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="投保申请号" prop="creditApplyNo" min-width="200" />
        <el-table-column label="申请人姓名" prop="userName" min-width="200" />
        <el-table-column label="身份证号码" prop="certNo" min-width="200" />
        <el-table-column label="申请人手机号" prop="userMobile" min-width="200" />
        <el-table-column label="核保审核时间" prop="effectDate" min-width="200">
          <template slot-scope="scope">{{ scope.row.effectDate |parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="授信额度" prop="creditAmount" min-width="200" />
        <el-table-column label="授信有效期" prop="expireDate" min-width="200">
          <template slot-scope="scope">{{ scope.row.expireDate |parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="核保结果" prop="applyStatus" min-width="200" />
      </el-table>
      <el-pagination
        v-if="pager.total > 0 "
        :page-sizes="pagination.pageSizes"
        :page-size="pager.pageSize"
        :layout="pagination.layout"
        :total="pager.total"
        :current-page="pager.pageIndex"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </Box>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
