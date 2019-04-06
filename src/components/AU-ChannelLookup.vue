<template>
  <el-row :gutter="0">
    <el-col :span="3">
      <el-button class="lookup-button" type="default" size="mini" @click="onLookup">+</el-button>
    </el-col>
    <el-col :span="21">
      <el-input readonly v-model="this.name"></el-input>
    </el-col>
    <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true"
          :show-close="false">
       <div class="lookup-list">
       </div>
       <div class="lookup-list">
         <div class="channel-tree">
            <div class="custom-tree-container">
              <el-tree
                :data="channels"
                node-key="id"
                :props="defaultProps"
                @node-click="handleChannelClick"
                :expand-on-click-node="true">
              </el-tree>
            </div>
          </div>
       </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onLookupConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import {baseurl} from '../config'


export default {
  name: 'AU-ChannelLookup',
  props: {
    service_id: {
        type: String,
        required: true
    },
    handler: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean
    }
  },
  watch: {
      // service_id: function(newVal, oldVal) {
      //   if(!this.disabled && this.service_id!="-1"){
      //     this.getChannels('');
      //   }
      //   else{
      //     this.channels = [];
      //   }
      // },
      id: function(newVal, oldVal) {
        this.getChannel();
      }
  },
  data: function () {
    return {
       channels: [],
       defaultProps: {
         children: 'children',
         label: 'name'
       },
       currentRow: null,
       dialogFormVisible: false,
       name:''
    }
  },
  methods:{
    onLookup(){
      this.dialogFormVisible = true;
      this.getChannels('');
    },
    onLookupConfirm(){
      this.dialogFormVisible = false;
      var id = this.currentRow.id;
      this.name = this.currentRow.name;
      this.$emit('select', id);
    },
    handleCurrentRowChange(val) {
       this.currentRow = val;
    },
    getChannels(data){
      var self = this;
      console.log(self.service_id);
      if(!self.service_id || self.service_id=='' || self.service_id=='-1'){
        return;
      }
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      };
      var parent;
      if(!data || data == ''){
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
    handleChannelClick(data) {
      this.currentRow = data;
      this.getChannels(data);
    },
    getChannel(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var url = '/services/' + this.service_id + '/channels/' + self.id;
      this.$axios.get(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            self.name = response.data.name;
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
.el-table td, .el-table th{
  padding: 0px;
}
.el-pagination {
    padding: 5px 5px;
    font-weight: 600;
    color: #88898c;
}
</style>
