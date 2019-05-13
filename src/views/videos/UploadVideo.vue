<template>
  <el-card ref="box" class="box-card" :hidden="hidebox">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
        <el-row :gutter="20">
          <el-col :span="16">
          <el-form-item>
            <el-upload
              :action="action"
              :headers="headers"
              :limit="1"
              disabled
              class="upload-demo"
              ref="upload"
              :show-file-list="true"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :auto-upload = "false"
              :before-remove="beforeRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              :on-exceed="handleExceed">
            </el-upload>
          </el-form-item>
            <el-form-item label="service" prop="service">
              <au-lookup handler="services" :id="form.service" @select="ServiceLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="channel" prop="channel">
              <au-channel-lookup handler="channels" :service_id="form.service" :id="form.channel" @select="ChannelLookupSelect"></au-channel-lookup>
            </el-form-item>
            <el-form-item label="playlists" prop="playlist">
              <au-playlist-select ref="auplaylists" :contentPlaylists="content_playlists"
                :service_id="form.service" :content_id="form.content" ></au-playlist-select>
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
            <el-form-item label="path" prop="path" hidden>
              <el-input type="path" v-model="form.path"></el-input>
            </el-form-item>
            <el-form-item label="size" prop="size">
              <el-input type="size" v-model="form.size"></el-input>
            </el-form-item>
            <el-form-item label="tags" prop="tags">
              <au-tag ref="tags" master="contents" masterField="content" :masterId="form.content" relation="tags_contents"></au-tag>
            </el-form-item>
            <el-form-item label="description" prop="description">
              <el-input type="textarea" :rows=6 v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="status" prop="status">
              <el-select v-model="status" value-key="value" placeholder="Select" @change="onStatusChange">
                <el-option
                  v-for="item in statuses"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="id" prop="id">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="created by" prop="created_by">
              <el-input v-model="created_by" disabled></el-input>
            </el-form-item>
            <el-form-item label="updated by" prop="updated_by">
              <el-input v-model="updated_by" disabled></el-input>
            </el-form-item>
            <el-form-item label="created_at">
              <el-date-picker v-model="form.created_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="updated_at">
              <el-date-picker v-model="form.updated_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-form-item>
            <el-button icon="el-icon-circle-check" type="primary" size="small" @click="onSave">Publish</el-button>
            <el-button icon="el-icon-circle-close" type="default" size="small" @click="onClose">Cancel</el-button>
            </el-form-item>
        </el-row>
      </el-form>
    </el-card>
</template>

<script>
import {baseurl} from '../../config'
import AULookup from '../../components/AU-Lookup'
import AUChannelLookup from '../../components/AU-ChannelLookup'
import AUPlaylistSelect from '../../components/AU-PlaylistSelect'
import AUTag from '../../components/AU-Tag'


export default {
  name: 'UploadVideo',
  computed:{
    record_id: {
      get: function () {
        return -1;
      }
    },
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
  props: {
    file: {
      type: Object,
      required: true
    },
    service:{
      type: String
    },
    channel:{
      type: String
    },
    contentPlaylists:{
      type: Array
    },
    publisher:{
      type: String
    },
    name:{
      type: String
    },
    title:{
      type: String
    },
    description:{
      type: String
    },
    publish: {
      type: Boolean,
      required: true
    },
  },
  watch: {
    file: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.fileList.push(newVal);
        setTimeout(function(){
          self.$refs["upload"].submit();
        }, 1000)
      }
    },
    service: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.form.service = newVal;
      }
    },
    channel: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.form.channel = newVal;
      }
    },
    contentPlaylists: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.content_playlists = newVal;
      }
    },
    publisher: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.form.publisher = newVal;
      }
    },
    name: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.form.name = newVal;
      }
    },
    title: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.form.title = newVal;
      }
    },
    description: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        self.form.description = newVal;
      }
    },
    publish: {
      immediate: true,
      handler(newVal, oldVal) {
        var self = this;
        if(newVal == true){
          self.onSave();
        }
      }
    }
  },
  data: () => {
    return {
      hidebox:false,
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
      content_playlists:[],
      created_by:'',
      updated_by:'',
      fileList: [],
      statuses: [
        {
          value: '0',
          label: 'disable'
        },
        {
          value: '1',
          label: 'enable'
        }
      ],
      status : null,
      rules: {
        name: [
          { required: true, message: 'Please input name', trigger: 'change' },
          { min: 3, max: 255, message: 'Length should be 3 to 255', trigger: 'change' }
        ],
        path: [
          { required: true, message: 'Please input path', trigger: 'change' }
        ]
      }
    }
  },
  created() {
     this.status = this.statuses[1];
  },
  components: {
    'au-lookup' : AULookup,
    'au-channel-lookup' : AUChannelLookup,
    'au-tag' : AUTag,
    'au-playlist-select' : AUPlaylistSelect
  },
  mounted(){
    if(this.record_id != "-1"){
      this.getItem();
    }
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
    onStatusChange(selected){
      this.status = selected;
      this.form.status = this.status['value'];
    },
    getDefaultData(){
      var self = this;
      self.form.id = self.record_id;
      self.form.content = '';
      self.form.service = '';
      self.form.channel = '';
      self.form.publisher = '';
      self.form.name = '';
      self.form.title = '';
      self.form.path = '';
      self.form.size = '0',
      self.form.status = '1',
      self.status = null;
      self.form.situation = '0';
      self.form.created_at = '';
      self.form.updated_at = '';
      self.form.description = '';
    },
    getItem(){
      var self = this;
      var id = self.record_id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.$axios.get(baseurl() + '/videos/' + id, config )
        .then(function (response) {
          if(response.status == 200){
            self.form.id = response.data.id;
            self.form.content = response.data.content;
            self.form.service = response.data.service;
            self.form.channel = response.data.channel;
            self.form.publisher = response.data.publisher;
            self.form.name = response.data.name;
            self.form.title = response.data.title;
            self.form.path = response.data.path;
            self.form.size = Number(response.data.size);
            self.form.created_at = response.data.created_at;
            self.form.updated_at = response.data.updated_at;
            self.form.details = response.data.details;
            self.form.status = Number(response.data.status);
            self.status = self.statuses[response.data.status];
            self.form.situation = response.data.situation;
            self.form.description = response.data.description;
          }
        }.bind(this))
        .catch(function (error) {
          if(error.response && error.response.status == 401){
            self.$router.push('/pages/login');
          }else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
          }else{
            self.$message.error('Unknown error.');
        }
      });
    },
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
    },
    addItem(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      if(!self.form.details || self.form.details==''){self.form.details = "{}"}
      var data_request = JSON.stringify(self.form);
      this.$axios.post(baseurl() + '/videos', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            self.form.id = response.data.id;
            self.form.content = response.data.content;
            let currentMsg =  self.$message  ({
              message : 'Record added successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
              self.$refs.tags.saveItem();
              self.$refs.auplaylists.saveItem();
              currentMsg.close();
            }, 1000);
          }
        }.bind(this))
        .catch(function (error) {
          if(error.response && error.response.status == 401){
            self.$router.push('/pages/login');
          }else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
          }else{
            self.$message.error('Unknown error.');
          }
      });
    },
    updateItem(){
      var self = this;
      var id = self.record_id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      if(!self.form.details || self.form.details==''){self.form.details = "{}"}
      var data_request = JSON.stringify(self.form);
      this.$axios.put(baseurl() + '/videos/' + id, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Record updated successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
              self.$refs.tags.saveItem();
              self.$refs.auplaylists.saveItem();
              currentMsg.close();
            }, 1000);
          }
        }.bind(this))
        .catch(function (error) {
          if(error.response && error.response.status == 401){
            self.$router.push('/pages/login');
          }else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
          }else{
            self.$message.error('Unknown error.');
          }
      });
    },
    onSave() {
      if(this.hidebox == true){
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.record_id == -1){
            this.addItem();
          }
          else{
            this.updateItem();
          }
          this.onClose();
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onClose() {
      this.hidebox = true;
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin: 10px;
  }
</style>
