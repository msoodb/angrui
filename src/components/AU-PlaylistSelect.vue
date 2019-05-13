<template>
  <el-row :gutter="0">
    <el-select
      v-model="content_playlists"
      multiple
      style="margin-left: 20px;"
      placeholder="Select">
      <el-option
        v-for="item in playlists"
        :key="item.id"
        :label="item.name"
        :value="item.id">
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
    content_id: {
        type: String,
        required: true
    },
    contentPlaylists: {
      type: Array
    }
  },
  watch: {
      service_id: function(newVal, oldVal) {
        this.getPlaylists();
        this.content_playlists = [];
      },
      content_id: function(newVal, oldVal) {
        if(this.content_id && this.content_id!="-1"){
          this.getContentPlaylist();
        }
        else{
          this.content_playlists = [];
        }
      },
      contentPlaylists: {
        immediate: true,
        handler(newVal, oldVal) {
          var self = this;
          self.content_playlists = [];
          self.content_playlists = newVal;
        }
      }
  },
  data: function () {
    return {
       playlists: [],
       defaultProps: {
         children: 'children',
         label: 'name'
       },
       content_playlists: []
    }
  },
  methods:{
    getSelectedPlaylists()
    {
      //this.$emit('getSelectedPlaylists', this.content_playlists);
      return this.content_playlists;
    },
    getPlaylists(){
      var self = this;
      if(!self.service_id || self.service_id=="-1" || self.service_id==""){
        self.playlists = [];
        self.content_playlists = [];
        return;
      }
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      };
      self.playlists = [];
      self.content_playlists = [];
      this.$axios.get(baseurl() + '/services/' + this.service_id + '/playlists' , config )
        .then(function (response) {
          if(response.status == 200){
            for (var i = 0; i < response.data.items.length; i++) {
              var playlist = {
                'id': response.data.items[i].id,
                'name': response.data.items[i].name
                // 'title': response.data.items[i].title,
                // 'service': response.data.items[i].service,
                // 'details': response.data.items[i].details,
                // 'status': response.data.items[i].status,
                // 'situation': response.data.items[i].situation,
                // 'description': response.data.items[i].description
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
      if(!self.content_id || self.content_id=="-1" || self.content_id==""){
        self.content_playlists = [];
        return;
      }
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      self.content_playlists = [];
      var url = '/contents/' + this.content_id + '/playlists_contents';
      this.$axios.get(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            for (var i = 0; i < response.data.items.length; i++) {
              // var content_playlist = {
              //   'id': response.data.items[i].id,
              //   'name': response.data.items[i].playlist_name,
              //   'title': response.data.items[i].playlist_title,
              //   'details': response.data.items[i].details,
              //   'status': response.data.items[i].status,
              //   'situation': response.data.items[i].situation,
              //   'description': response.data.items[i].description
              // }
              // var content_playlist = {
              //   'name': response.data.items[i].playlist_name
              // }
              //console.log(content_playlist);
              self.content_playlists.push(response.data.items[i].playlist_name);
            }
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
    saveItem()
    {
      for (var i = 0; i < this.content_playlists.length; i++) {
        this.addContentPlaylist(this.content_playlists[i]);
      }
    },
    addContentPlaylist(id){
      var self = this;
      if(!self.content_id || self.content_id=="-1" || self.content_id==""){
        self.content_playlists = [];
        return;
      }
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var relationsData = {
        'playlist' : id,
        'content' : self.content_id,
        'details' : '{}',
        'status' : 1,
        'situation' : 0,
        'description': ''
      }
      var data_request = JSON.stringify(relationsData);
      var url = '/contents/' + self.content_id + '/playlists_contents';
      this.$axios.post(baseurl() + url, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            setTimeout(function () {
            }, 1);
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
