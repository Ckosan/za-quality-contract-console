<style lang='scss' src="../css/apiContractDoc.scss"></style>
<script src="../js/apiContractDoc.js"></script>
<template>
  <div v-loading="loading" class="credit-record" style="margin-top: -30px;">
    <Box class="content-box">
      <el-table
        element-loading-spinner="el-icon-loading"
        :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        class="form-table"
        :header-cell-style="{fontSize:'15px',fontWeight:'bold',background:'#394d66',color:'#fafafa'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
        />
        <el-table-column label="项目信息" prop="projectinfo" min-width="150" show-overflow-tooltip align="center" sortable>
          <template slot-scope="scope">
            <router-link
              tag="a"
              style="color:#0174DF"
              :to="'/configpage/projectdetail/'+scope.row.project_id"
            >{{ scope.row.projectinfo }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="应用信息"
          prop="applicationinfo"
          min-width="200"
          show-overflow-tooltip
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <router-link
              tag="a"
              style="color:#0174DF"
              :to="'/configpage/applicationdetail/'+scope.row.application_id"
            >{{ scope.row.applicationinfo }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="服务类型" prop="server_type" min-width="80" align="center" />
        <el-table-column label="服务编码" min-width="150px" align="center">
          <template slot-scope="scope">
            <label>{{ scope.row.server_code }}</label>
            <br>
            <el-link
              v-if="scope.row.union_server!=null"
              target="_blank"
              style="color:#0174DF"
              @click="goToDetail(scope.$index,scope.row)"
            >共用文档服务S000{{ scope.row.union_server }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="服务说明" prop="server_name" min-width="180" show-overflow-tooltip align="center" />
        <el-table-column label="文档数量" prop="document_num" min-width="80" align="center" sortable />
        <el-table-column label="更新信息" prop="document_num" :formatter="convertDataFormat" min-width="80" align="center" />
      </el-table>
    </Box>
  </div>
</template>
