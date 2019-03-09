<template>
  <div class="border" :disabled="disabled">
    <el-button icon="el-icon-circle-plus" size="mini" @click="onAddRootchannel()" :disabled="disabled">Add</el-button>
    <div class="custom-tree-container">
      <el-tree
        :data="channels"
        :disabled="disabled"
        node-key="id"
        :props="defaultProps"
        @node-click="handleChannelClick"
        :expand-on-click-node="true">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => onAddChannel(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => onEditChannel(data)">
              Edit
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => onDeleteChannel(node, data)">
              Delete
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog :visible.sync="dialogChannelVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" inline-message>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="name" prop="name">
              <el-input type="name" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="title" prop="title">
              <el-input type="title" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="tags">
              <au-tag ref="tags" master="channels" masterField="channel" :masterId="form.id" relation="tags_channels" :refresh="tags_refresh"></au-tag>
            </el-form-item>
            <el-form-item label="details">
              <au-keyValue title="details" :data="form.details" @change="onChangeDetails"></au-keyValue>
            </el-form-item>
            <el-form-item label="description">
              <el-input type="textarea" :rows=3 v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <hr/>
         <el-row :gutter="20">
            <el-form-item>
              <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSaveform">Save</el-button>
              <el-button icon="el-icon-circle-close" type="default" size="small" @click="onCloseform">Close</el-button>
            </el-form-item>
          </el-row>
       </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {baseurl} from '../../config'
import AUTag from '../../components/AU-Tag'
import AUKeyValue from '../../components/AU-KeyValue'

export default {
  name: 'ChannelsTree',
  props: {
    service_id: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true
    }
  },
  watch: {
      service_id: function(newVal, oldVal) {
        this.getChannels('');
      }
  },
  data: function () {
    return {
      channels: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form:{
        id: '',
        name: '',
        title: '',
        service: '',
        parent: '',
        details: '',
        status: '1',
        situation:'0',
        description: ''
      },
      tags_refresh: true,
      dialogChannelVisible: false,
      rules: {
        name: [
          { required: true, message: 'Please input name', trigger: 'change' },
          { min: 3, max: 255, message: 'Length should be 3 to 255', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    'au-tag' : AUTag,
    'au-keyValue':AUKeyValue
  },
  created() {
     this.getChannels('');
  },
  methods:{
    onChangeDetails(val){
      this.form.details = val;
    },
    getChannels(data){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      };
      var parent;
      if(data == ''){
        parent = '';
        self.channels = [];
      }else{
        parent = data.id;
        this.$set(data, 'children', []);
      }
      this.$axios.get(baseurl() + '/services/' + this.service_id + '/channels' +
       '?parent=' + parent, config )
        .then(function (response) {
          if(response.status == 200){
            for (var i = 0; i < response.data.items.length; i++) {
              var channel = {
                'id': response.data.items[i].id,
                'name': response.data.items[i].name,
                'title': response.data.items[i].title,
                'service': response.data.items[i].service,
                'parent': response.data.items[i].parent,
                'details': response.data.items[i].details,
                'status': response.data.items[i].status,
                'situation': response.data.items[i].situation,
                'description': response.data.items[i].description,
                'children': []
              }
              if(parent == ''){
                self.channels.push(channel);
              }else{
                data.children.push(channel);
              }
              self.getChannels(channel);
            }
          }
        }.bind(this))
        .catch(function (error) {
          if(error.response && error.response.status == 401){
            self.$router.push('/pages/login');
          }
          else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
          }
          else{
            self.$message.error('Unknown error.');
          }
      });
    },
    onAddRootchannel(){
      this.form.id = "-1";
      this.form.name = '';
      this.form.title = '';
      this.form.service = this.service_id;
      this.form.parent = '';
      this.form.details = '';
      this.form.status = 1;
      this.form.situation = 0;
      this.form.description = '';
      this.tags_refresh = !this.tags_refresh;
      this.dialogChannelVisible = true;
    },
    handleChannelClick(data) {
      this.getChannels(data);
    },
    onAddChannel(data){
      this.form.id = "-1";
      this.form.name = '';
      this.form.title = '';
      this.form.service = this.service_id;
      this.form.parent = data.id;
      this.form.details = '';
      this.form.status = 1;
      this.form.situation = 0;
      this.form.description = '';
      this.tags_refresh = !this.tags_refresh;
      this.dialogChannelVisible = true;
    },
    onEditChannel(data){
      this.form.id = data.id;
      this.form.name = data.name;
      this.form.title = data.title;
      this.form.service = this.service_id;
      this.form.parent = data.parent;
      this.form.details = data.details;
      this.form.status = 1;
      this.form.situation = 0;
      this.form.description = data.description;
      this.tags_refresh = !this.tags_refresh;
      this.dialogChannelVisible = true;
    },
    onCloseform(){
      this.dialogChannelVisible = false;
    },
    onSaveform() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.form.id == "-1"){
            this.AddChannel();
          }
          else{
            this.UpdateChannel();
          }
          //this.onClose();
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    AddChannel(){
      this.dialogChannelVisible = false;
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      if(!self.form.details || self.form.details==''){self.form.details = "{}"}
      var data_request = JSON.stringify(this.form);
      this.$axios.post(baseurl() + '/services/' + this.service_id + '/channels',
       data_request, config )
        .then(function (response) {
          if(response.status == 200){
            self.form.id = response.data.id;
            let currentMsg =  self.$message  ({
              message : 'Record added successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
              self.$refs.tags.saveItem();
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
    UpdateChannel(){
      this.dialogChannelVisible = false;
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      if(!self.form.details || self.form.details==''){self.form.details = "{}"}
      var data_request = JSON.stringify(this.form);
      this.$axios.put(baseurl() + '/services/' + this.service_id + '/channels/'
      + this.form.id , data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Record added successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
              self.$refs.tags.saveItem();
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
    onDeleteChannel(node, data){
      this.$confirm('Selected record(s) will be permanently deleted. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
      }).then(() => {
        this.deleteChannel(node, data);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        });
      });
    },
    deleteChannel(node, data){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var url = '/services/' + this.service_id + '/channels/' + data.id;
      this.$axios.delete(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Record successfully deleted',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
              self.getChannels('');
              currentMsg.close();
            }, 100);
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
    }
  }
}
</script>

<style scoped>
.border{
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
