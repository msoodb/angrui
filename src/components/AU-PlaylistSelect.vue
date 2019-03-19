<template>
  <el-row :gutter="0">
    <el-select
      v-model="content_playlists"
      multiple
      collapse-tags
      style="margin-left: 20px;"
      placeholder="Select">
      <el-option
        v-for="item in playlists"
        :key="item.id"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
  </el-row>
</template>

<script>
import {baseurl} from '../config'


export default {
  name: 'AU-PlaylistSelect',
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
      service_id: function(newVal, oldVal) {
        if(!this.disabled && this.service_id!="-1"){
          this.getPlaylists();
        }
        else{
          this.playlists = [];
        }
      }
      // id: function(newVal, oldVal) {
      //   this.getPlaylist();
      // }
  },
  data: function () {
    return {
       playlists: [],
       defaultProps: {
         children: 'children',
         label: 'name'
       },
       content_playlists: [],
    }
  },
  created(){
    //this.getPlaylists();
  },
  methods:{
    getPlaylists(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      };
      self.playlists = [];
      this.$axios.get(baseurl() + '/services/' + this.service_id + '/playlists' , config )
        .then(function (response) {
          if(response.status == 200){
            for (var i = 0; i < response.data.items.length; i++) {
              var playlist = {
                'id': response.data.items[i].id,
                'name': response.data.items[i].name,
                'title': response.data.items[i].title,
                'service': response.data.items[i].service,
                'details': response.data.items[i].details,
                'status': response.data.items[i].status,
                'situation': response.data.items[i].situation,
                'description': response.data.items[i].description
              }
              self.playlists.push(playlist);
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
    getContentPlaylist(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var url = '/services/' + this.service_id + '/playlists/' + self.id;
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
