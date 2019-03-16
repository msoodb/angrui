<template>
  <el-tabs type="border-card">
    <el-tab-pane label="General">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="name" prop="name">
              <el-input type="name" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="title" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="code" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="pendar" prop="pendar">
              <el-input v-model="form.pendar"></el-input>
            </el-form-item>
            <el-form-item label="mobile operator" prop="mobile_operator">
              <au-lookup handler="mobile_operators" :id="form.mobile_operator" @select="MobileOperatorLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="aggregator" prop="aggregator">
              <au-lookup handler="aggregators" :id="form.aggregator" @select="AggregatorLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="content provider" prop="content_provider">
              <au-lookup handler="content_providers" :id="form.content_provider" @select="ContentProviderLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="description">
              <el-input type="textarea" :rows=6 v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="details">
              <au-keyValue title="details" :data="form.details" @change="onChangeDetails"></au-keyValue>
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
    <el-tab-pane label="Channels">
      <el-form ref="form" :model="form" :rules="rules" label-width="0px" inline-message>
        <el-form-item>
          <au-channels-tree :service_id="record_id"></au-channels-tree>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="Playlists" class="el-tabs-no-padding">
      <au-service-playlists :service_id="record_id"></au-service-playlists>
    </el-tab-pane>
    <el-tab-pane label="Contents" class="el-tabs-no-padding">
      <au-service-contents :service_id="record_id"></au-service-contents>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {baseurl} from '../../config'
import AULookup from '../../components/AU-Lookup'
import AUKeyValue from '../../components/AU-KeyValue'
import AUTag from '../../components/AU-Tag'
import AUChannelsTree from '../channels/ChannelsTree'
import AUServicePlaylists from '../playlists/ServicePlaylists'
import AUServiceContents from '../contents/ServiceContents'



let id = 1000;
export default {
  name: 'Service',
  props: {
    record_id: {
      type: String,
      required: true
    }
  },
  watch: {
    record_id: {
      immediate: true,
      handler(newVal, oldVal) {
        this.record_id = newVal;
        if(this.record_id == '-1'){
          this.getDefaultData();
        } else{
          this.getItem();
        }
      }
    }
  },
  data: () => {
    return {
      form: {
        id: '',
        pendar:'',
        mobile_operator:'',
        aggregator:'',
        content_provider:'',
        name: '',
        title: '',
        code: '',
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
      status : null,
      rules: {
        name: [
          { required: true, message: 'Please input name', trigger: 'change' },
          { min: 3, max: 255, message: 'Length should be 3 to 255', trigger: 'change' }
        ],
        phone: [
          { required: true, message: 'Please input code', trigger: 'change' }
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'change' },
          { type: 'email', message: 'Email must be in correct format', trigger: 'change' }
        ]
      }
    }
  },
  created() {
     this.status = this.statuses[1];
  },
  components: {
    'au-lookup' : AULookup,
    'au-tag' : AUTag,
    'au-keyValue': AUKeyValue,
    'au-channels-tree': AUChannelsTree,
    'au-service-playlists': AUServicePlaylists,
    'au-service-contents': AUServiceContents
  },
  mounted(){
    if(this.record_id != "-1"){
      this.getItem();
    }
  },
  methods: {
    MobileOperatorLookupSelect(id){
      this.form.mobile_operator = id;
    },
    AggregatorLookupSelect(id){
      this.form.aggregator = id;
    },
    ContentProviderLookupSelect(id){
      this.form.content_provider = id;
    },
    onChangeDetails(val){
      this.form.details = val;
    },
    onStatusChange(selected){
      this.status = selected;
      this.form.status = this.status['value'];
    },
    getDefaultData(){
      var self = this;
      self.form.id = self.record_id;
      self.form.pendar = '';
      self.form.mobile_operator = '';
      self.form.aggregator = '';
      self.form.content_provider = '';
      self.form.name = '';
      self.form.title = '';
      self.form.code = '';
      self.form.details = '';
      self.form.status = '1',
      self.status = null;
      self.form.type = '0';
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
      this.$axios.get(baseurl() + '/services/' + id, config )
        .then(function (response) {
          if(response.status == 200){
            self.form.id = response.data.id;
            self.form.pendar = response.data.pendar;
            self.form.mobile_operator = response.data.mobile_operator;
            self.form.aggregator = response.data.aggregator;
            self.form.content_provider = response.data.content_provider;
            self.form.name = response.data.name;
            self.form.title = response.data.title;
            self.form.code = response.data.code;
            self.form.created_at = response.data.created_at;
            self.form.updated_at = response.data.updated_at;
            self.form.details = response.data.details;
            self.form.status = Number(response.data.status);
            self.status = self.statuses[response.data.status];
            self.form.situation = response.data.situation;
            self.created_by = response.data.created_by;
            self.updated_by = response.data.updated_by;
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
      this.$axios.post(baseurl() + '/services', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Record added successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
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
      this.$axios.put(baseurl() + '/services/' + id, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Record updated successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
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
};
</script>
