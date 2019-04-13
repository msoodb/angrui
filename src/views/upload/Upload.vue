<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-upload
            :action="action"
            :headers="headers"
            :limit="1"
            class="upload-demo"
            :show-file-list="true"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            :on-exceed="handleExceed">
            <el-button size="small" type="primary">Click to upload</el-button>
          </el-upload>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">hooy</el-col>
  </el-row>
</template>

<script>
import {baseurl} from '../../config'

export default {
  name: 'Upload',
  data() {
     return {
       items: []
     }
  },
  computed:{
    action: {
      get: function () {
        return baseurl() + '/files';
      }
    },
    headers: {
      get: function () {
        var token = JSON.parse(localStorage.getItem("jwtoken"));
        var headers = {
          'Authorization': token
        }
        return headers;
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      //this.deleteProductDocument(file);
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      //this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Attachment will be permanently deleted. Are you sure? ${ file.name }`);
    },
    handleBeforeUpload(file) {
      return false;
    },
    handleSuccess(response, file, fileList) {
      if(response.message == "success"){
        this.form.name = file.name;
        this.form.path = response.path;
        this.form.size = file.size;
      }
    }
  }
}
</script>
