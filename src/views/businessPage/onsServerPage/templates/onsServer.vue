<style lang='scss' src="../css/onsServer.scss" scoped></style>
<script src="../js/onsServer.js"></script>
<template>
  <div style="display: inline" class="credit-record">
    <Box class="content-box">
      <SearchContainer>
        <el-form
          ref="searchForm"
          :inline="true"
          label-width="110px"
          size="mini"
          :rules="rules"
          :model="searchForm"
          class="query-form mb20"
        >
          <el-form-item label="项目信息" prop="project">
            <el-select v-model="searchForm.project" filterable placeholder="请输入项目信息" @change="getApplications">
              <el-option
                v-for="item in options.projectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用信息" prop="application">
            <el-select v-model="searchForm.application" filterable placeholder="请输入应用信息" @change="getOnsServer">
              <el-option
                v-for="item in options.applicationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="ONS服务" prop="server">
            <el-select v-model="searchForm.server" filterable placeholder="请输入ONS服务" @change="getOnsInterface">
              <el-option
                v-for="item in options.serverOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="ONS接口" prop="interface">
            <el-select v-model="searchForm.interface" filterable placeholder="请输入ONS接口" @change="getONSRequest">
              <el-option
                v-for="item in options.interfaceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </SearchContainer>
      <div style="width: 80%">
        <div style="margin:0 auto;text-align:center">
          <el-radio-group v-model="env_type" @change="getEnv">
            <el-radio-button label="测试" />
            <el-radio-button label="预发" />
            <el-radio-button label="生产" />
          </el-radio-group>
        </div>
        <br>
        <br>
        <el-form :model="form" label-width="200px">
          <el-form-item label="ONS服务地址:">
            <el-input v-model="form.ons_url" placeholder="请输入ONS服务地址" />
          </el-form-item>
          <el-form-item label="AccessKey:">
            <el-input v-model="form.access_key" placeholder="请输入AccessKey" />
          </el-form-item>
          <el-form-item label="SecretKey:">
            <el-input v-model="form.secret_key" placeholder="请输入SecretKey" />
          </el-form-item>
          <el-form-item label="Topic:">
            <el-input v-model="form.topic" placeholder="请输入Topic" />
          </el-form-item>
          <el-form-item label="ProducerId:">
            <el-input v-model="form.producer_id" placeholder="请输入ProducerId" />
          </el-form-item>
          <el-form-item label="Tag:">
            <el-input v-model="form.tag" placeholder="请输入Tag" />
          </el-form-item>
        </el-form>
      </div>
      <div style="display:inline-block;width: 100%;height: 100%">
        <div style="width: 45%;float: left;margin-left: 20px">
          <div><label>请求数据</label></div>
          <br>
          <el-input
            v-model="form.reqmsg"
            style="display: inline-block"
            autocomplete="off"
            placeholder="消息内容"
            icon="caret-top"
            type="textarea"
            rows="20"
          />
          <div class="tc" style="margin-top:10px;">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="send">发送</el-button>
            <el-button type="success" size="mini" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </div>
        </div>
        <div style="width: 45%;float: right;margin-right: 20px">
          <div><label>响应结果</label></div>
          <br>
          <el-input
            v-model="form.response"
            style="display: inline-block"
            autocomplete="off"
            placeholder="消息内容"
            icon="caret-top"
            type="textarea"
            rows="20"
            readonly
          />
        </div>
      </div>
    </Box>
  </div>
</template>
