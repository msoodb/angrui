<template>
  <div class="border" :disabled="disabled">
    <el-button icon="el-icon-circle-plus" size="mini" @click="onAddRootchannel()" :disabled="disabled">Add</el-button>
    <div class="custom-tree-container">
      <el-tree
        :data="channels"
        :disabled="disabled"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        @node-click="handleChannelClick"
        :expand-on-click-node="true">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => addChannel(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => editChannel(data)">
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
      <el-form ref="channelDialog" :model="channelDialog" :rules="rules" label-width="100px" inline-message>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="name" prop="name">
              <el-input type="name" v-model="channelDialog.name"></el-input>
            </el-form-item>
            <el-form-item label="title" prop="title">
              <el-input type="title" v-model="channelDialog.title"></el-input>
            </el-form-item>
            <el-form-item label="tags">
              <au-tag ref="tags" master="channels" masterField="channel" :masterId="channel_id" relation="tags_channels"></au-tag>
            </el-form-item>
            <el-form-item label="details">
              <au-keyValue title="details" :data="channelDialog.details" @change="onChangeDetails"></au-keyValue>
            </el-form-item>
            <el-form-item label="description">
              <el-input type="textarea" :rows=3 v-model="channelDialog.description"></el-input>
            </el-form-item>
          </el-col>
         </el-row>
         <hr/>
         <el-row :gutter="20">
            <el-form-item>
              <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSaveChannelDialog">Save</el-button>
              <el-button icon="el-icon-circle-close" type="default" size="small" @click="onCloseChannelDialog">Close</el-button>
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
      channel:'',
      channel_id:'',
      channelDialog:{
        id: '',
        name: '',
        title: '',
        service: '',
        parent: '',
        created_at: '',
        updated_at: '',
        details: '',
        status: '1',
        situation:'0',
        description: ''
      },
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
      this.channelDialog.details = val;
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
      var parent='';
      if(data != '')
      {
        parent = data.id;
      }
      this.$axios.get(baseurl() + '/services/' + this.service_id + '/channels' + '?parent=' + parent, config )
        .then(function (response) {
          if(response.status == 200){
            if(parent == ''){
              self.channels = [];
              for (var i = 0; i < response.data.items.length; i++) {
                var channel = {
                  'id': response.data.items[i].id,
                  'name': response.data.items[i].name,
                  'title': response.data.items[i].title,
                  'details': response.data.items[i].details,
                  'description': response.data.items[i].description,
                  'children': []
                }
                self.channels.push(channel);
              }
            } else{
              //self.channels.find(x => x.id === parent).children = [];
              this.$set(data, 'children', []);
              for (var i = 0; i < response.data.items.length; i++) {
                var channel = {
                  'id': response.data.items[i].id,
                  'name': response.data.items[i].name,
                  'title': response.data.items[i].title,
                  'details': response.data.items[i].details,
                  'description': response.data.items[i].description,
                  'children': []
                }
                data.children.push(channel);
                //self.channels.find(x => x.id === parent).children.push(channel);
              }
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
      this.channelDialog.name = '';
      this.channelDialog.title = '';
      this.channelDialog.details = '';
      this.channelDialog.description = '';
      this.channel_id = "-1";
      this.channel = null;
      this.dialogChannelVisible = true;
    },
    handleChannelClick(data) {
      this.getChannels(data);
    },
    addChannel(data){
      this.channel = data;
      this.channel_id = "-1";
      this.channelDialog.name = '';
      this.channelDialog.title = '';
      this.channelDialog.details = '';
      this.channelDialog.description = '';
      this.dialogChannelVisible = true;
    },
    editChannel(data){
      // console.log(JSON.stringify(data));
      this.channel = data;
      this.channel_id = data.id;
      this.channelDialog.name = data.name;
      this.channelDialog.title = data.title;
      this.channelDialog.details = data.details;
      this.channelDialog.description = data.description;
      this.dialogChannelVisible = true;
    },
    onCloseChannelDialog(){
      this.dialogChannelVisible = false;
    },
    onSaveChannelDialog(){
      this.dialogChannelVisible = false;
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var parent='';
      if(this.channel){
        parent = this.channel.id;
      }
      var channel = {
        'service': this.service_id,
        'parent': parent,
        'name' : this.channelDialog.name,
        'title' : this.channelDialog.title,
        'details' : this.channelDialog.details,
        'status' : 1,
        'situation' : 0,
        'description': this.channelDialog.description
      }
      var data_request = JSON.stringify(channel);
      this.$axios.post(baseurl() + '/services/' + this.service_id + '/channels', data_request, config )
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
