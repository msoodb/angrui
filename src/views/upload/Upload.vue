<template>
  <el-row :gutter="20">
    <el-col :span="4">1</el-col>
    <el-col :span="16">
      <component
        v-for="(selectedComponent, index) in selectedComponents"
          :is="selectedComponent" :file="files[`${index}`]">
      </component>
      <el-upload
        action=""
        class="upload-demo"
        drag
        :multiple="true"
        ref="dragUpload"
        v-show="!show_mode"
        :show-file-list="false"
        :auto-upload = "false"
        :on-change = "onChange"
        :file-list="files">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </el-upload>
      <el-upload
        action=""
        ref="buttonUpload"
        v-show="show_mode"
        class="upload-demo"
        :multiple="true"
        :show-file-list="false"
        :auto-upload = "false"
        :on-change = "onChange"
        :file-list="files">
        <el-button icon="el-icon-circle-check" type="default" size="small">Add More Video</el-button>
      </el-upload>
    </el-col>
    <el-col :span="4"></el-col>
  </el-row>
</template>

<script>
import {baseurl} from '../../config'
import UploadVideo from '../videos/UploadVideo'


export default {
  name: 'Upload',
  data() {
     return {
       items: [],
       selectedComponents:[],
       files:[],
       show_mode: false
     }
  },
  components: {
    'upload-video': UploadVideo
  },
  methods: {
    onChange(file, fileList){
      this.show_mode = !this.show_mode;
      this.files.push(file);
      this.selectedComponents.push('upload-video');      
    }
  }
}
</script>

<style scoped>
  .el-button {
    margin-left: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
  }
</style>
