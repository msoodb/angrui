<template>
  <el-tabs type="border-card">
    <el-tab-pane label="General">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="tag" prop="tag">
              <au-lookup handler="tags" :id="form.tag" @select="TagLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="playlist" prop="playlist">
              <au-lookup handler="playlists" :id="form.playlist" @select="PlaylistLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="description">
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

export default {
  name: 'TagsPlaylist',
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
        tag:'',
        playlist: '',
        created_at: '',
        updated_at: '',
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
      }
    }
  },
  components: {
    'au-lookup' : AULookup
  },
  created() {
     this.status = this.statuses[1];
  },
  mounted(){
    if(this.record_id != "-1"){
      this.getItem();
    }
  },
  methods: {
    TagLookupSelect(id){
      this.form.tag = id;
    },
    PlaylistLookupSelect(id){
      this.form.playlist = id;
    },
    onStatusChange(selected){
      this.status = selected;
      this.form.status = this.status['value'];
    },
    getDefaultData(){
      var self = this;
      self.form.id = self.record_id;
      self.form.tag = '';
      self.form.playlist = '';
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
      this.$axios.get(baseurl() + '/tags_playlists/' + id, config )
        .then(function (response) {
          if(response.status == 200){
            self.form.id = response.data.id;
            self.form.tag = response.data.tag;
            self.form.playlist = response.data.playlist;
            self.form.status = Number(response.data.status);
            self.status = self.statuses[response.data.status];
            self.form.situation = response.data.situation;
            self.form.created_at = response.data.created_at;
            self.form.updated_at = response.data.updated_at;
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
            self.$message.error('Unknown error.' + error);
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
      var data_request = JSON.stringify(self.form);
      this.$axios.post(baseurl() + '/tags_playlists', data_request, config )
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
      var data_request = JSON.stringify(self.form);
      this.$axios.put(baseurl() + '/tags_playlists/' + id, data_request, config )
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
}
</script>
