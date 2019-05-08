<template>
  <el-tabs type="border-card">
    <el-tab-pane label="General">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
        <el-row :gutter="20">
          <el-col :span="16">
          <el-form-item>
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
              :on-exceed="handleExceed"
              :file-list="files">
              <el-button size="small" type="primary">Click to upload</el-button>
            </el-upload>
          </el-form-item>
            <el-form-item label="service" prop="service">
              <au-lookup handler="services" :id="form.service" @select="ServiceLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="channel" prop="channel">
              <au-channel-lookup handler="channels" :service_id="form.service" :id="form.channel" @select="ChannelLookupSelect"></au-channel-lookup>
            </el-form-item>
            <el-form-item label="playlists" prop="playlist">
              <au-playlist-select ref="auplaylists" :service_id="form.service" :content_id="form.content" ></au-playlist-select>
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
        <hr/>
        <el-row :gutter="20">
            <el-form-item>
              <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSave">Save</el-button>
              <el-button icon="el-icon-circle-close" type="default" size="small" @click="onClose">Close</el-button>
            </el-form-item>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {baseurl} from '../../config'
import AULookup from '../../components/AU-Lookup'
import AUChannelLookup from '../../components/AU-ChannelLookup'
import AUPlaylistSelect from '../../components/AU-PlaylistSelect'
import AUTag from '../../components/AU-Tag'


export default {
  name: 'Content',
  props: {
    record_id: {
      type: String,
      required: true
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
  data: () => {
    return {
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
      created_by:'',
      updated_by:'',
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
      files:[],
      status : null,
      playlists: [],
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
    getItem(){
      var self = this;
      var id = self.record_id;
      if(id == '-1'){
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
        self.files = [];
        self.$refs["form"].resetFields();
        return;
      }
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
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
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
      this.$emit('close');
    }
  }
}
</script>
