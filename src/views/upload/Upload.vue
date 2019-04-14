<template>
  <el-row :gutter="20">
    <el-col :span="4">1</el-col>
    <el-col :span="16">
      <el-card class="box-card">
        <el-button icon="el-icon-circle-check" type="success" size="small" @click="onAddVideo">Add More Video</el-button>
      </el-card>
      <component
        v-for="(selectedComponent, index) in selectedComponents"
          :is="selectedComponent"
      ></component>
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
       selectedComponents:[]
     }
  },
  components: {
    'upload-video': UploadVideo
  },
  methods: {
    onAddVideo(){
      this.selectedComponents.push('upload-video');
    }
  }
}
</script>
