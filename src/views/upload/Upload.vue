<template>
  <el-row :gutter="20">
    <el-col :span="4">1</el-col>
    <el-col :span="16">
    <el-card class="box-card" v-show="!show_upload">
        <el-form ref="form" :model="form" label-width="140px" inline-message>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="service" prop="service">
                <au-lookup handler="services" :id="form.service" @select="ServiceLookupSelect"></au-lookup>
              </el-form-item>
              <el-form-item label="channel" prop="channel">
                <au-channel-lookup handler="channels" :service_id="form.service" :id="form.channel" @select="ChannelLookupSelect"></au-channel-lookup>
              </el-form-item>
              <el-form-item label="playlist" prop="playlist">
                <au-playlist-select :service_id="form.service" :content_id="form.content" ></au-playlist-select>
              </el-form-item>
              <el-form-item label="publisher" prop="publisher">
                <au-lookup handler="publishers" :id="form.publisher" @select="PublisherLookupSelect"></au-lookup>
              </el-form-item>
              <el-form-item label="name" prop="name">
                <el-input type="name" v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="title" prop="title">
                <el-input type="title" v-model="form.title"></el-input>
              </el-form-item>
              <el-form-item label="tags" prop="tags">
                <au-tag ref="tags" master="contents" masterField="content" :masterId="form.content" relation="tags_contents"></au-tag>
              </el-form-item>
              <el-form-item label="description" prop="description">
                <el-input type="textarea" :rows=6 v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-form-item>
                <el-button icon="el-icon-circle-check" type="default" size="small" @click="onApplytoAll">Apply to All</el-button>
                <el-button icon="el-icon-circle-check" type="primary" size="small" @click="onSaveAll">Publish All</el-button>
              </el-form-item>
          </el-row>
        </el-form>
      </el-card>
      <component
        v-for="(selectedComponent, index) in selectedComponents"
          :is="selectedComponent" :file="files[`${index}`]"
          :service="service"
          :channel="channel"
          :publisher="publisher"
          :name="name"
          :title="title"
          :description="description"
          :publish="publish">
      </component>
      <el-upload
        action=""
        class="upload-demo"
        drag
        :multiple="true"
        ref="dragUpload"
        v-show="show_upload"
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
        v-show="!show_upload"
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
import AULookup from '../../components/AU-Lookup'
import AUChannelLookup from '../../components/AU-ChannelLookup'
import AUPlaylistSelect from '../../components/AU-PlaylistSelect'
import AUTag from '../../components/AU-Tag'


export default {
  name: 'Upload',
  data() {
     return {
       items: [],
       selectedComponents:[],
       files:[],
       show_upload: true,
       publish: false,
       form: {
         id: '',
         content: '',
         service:'',
         channel:'',
         publisher:'',
         name:'',
         title:'',
         path:'',
         size: '0',
         created_at: '',
         updated_at: '',
         details: '',
         status: '1',
         situation:'0',
         description: ''
       },
       service:'',
       channel:'',
       publisher:'',
       name:'',
       title:'',
       description: '',
       fileList: [],
       playlists: [],
       value11: []
      }
  },
  components: {
    'upload-video': UploadVideo,
    'au-lookup' : AULookup,
    'au-channel-lookup' : AUChannelLookup,
    'au-tag' : AUTag,
    'au-playlist-select' : AUPlaylistSelect
  },
  methods: {
    ServiceLookupSelect(id){
      this.form.service = id;
      this.form.channel = '';
    },
    ChannelLookupSelect(id){
      this.form.channel = id;
    },
    PublisherLookupSelect(id){
      this.form.publisher = id;
    },
    onChange(file, fileList){
      this.show_upload = false;
      this.files.push(file);
      this.selectedComponents.push('upload-video');
    },
    onApplytoAll(){
      this.service = this.form.service;
      this.channel = this.form.channel;
      this.publisher = this.form.publisher;
      this.name = this.form.name;
      this.title = this.form.title;
      this.description = this.form.description;
    },
    onSaveAll(){
      this.publish = true;
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
  .box-card {
    margin: 10px;
  }
</style>
