<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-tabs type="border-card">
          <el-tab-pane label="General">
            <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="created by" prop="created_by">
                    <el-input v-model="created_by" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="updated by" prop="updated_by">
                    <el-input v-model="updated_by" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="created_at">
                    <el-date-picker v-model="form.created_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
                  </el-form-item>
                  <el-form-item label="updated_at">
                    <el-date-picker v-model="form.updated_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="id" prop="id">
                    <el-input v-model="form.id" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <hr/>
              <el-row :gutter="20">
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
                </el-col>
              </el-row>
              <hr/>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="user" prop="user">
                    <el-input type="user" v-model="form._user_"></el-input>
                  </el-form-item>
                  <el-form-item label="security role" prop="security_role">
                    <el-input type="security_role" v-model="form.security_role"></el-input>
                  </el-form-item>
                  <el-form-item label="description">
                    <el-input type="textarea" v-model="form.description"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <hr/>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item>
                    <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSaveClose">Save and Close</el-button>
                    <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSave">Save</el-button>
                    <el-button icon="el-icon-circle-close" type="default" size="small" @click="onCancel">Cancel</el-button>
                 </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {baseurl} from '../../config'

export default {
  name: 'UsersSecurityRole',
  computed:{
    aggrigator_id: {
      get: function () {
        return this.$route.params.id;
      }
    }
  },
  data: () => {
    return {
      from: null,
      form: {
        id: '',
        _user_:'',
        security_role: '',
        created_at: '',
        updated_at: '',
        details: {},
        status: '1',
        type: '0',
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
        vm.from = from;
    });
  },
  // beforeRouteUpdate (to, from, next) {
  //   this.from = from.fullpath;
  //   console.log(this.from);
  //   next()
  // },
  created() {
     this.status = this.statuses[1];
  },
  mounted(){
    if(this.$route.params.id != -1){
      this.getItem();
    }
  },
  methods: {
    onStatusChange(selected){
      this.status = selected;
      this.form.status = this.status['value'];
    },
    getItem(){
    var self = this;
    var id = self.$route.params.id;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    this.$axios.get(baseurl() + '/users_security_roles/' + id, config )
      .then(function (response) {
        if(response.status == 200){
          self.form.id = response.data.id;
          self.form._user_ = response.data._user_;
          self.form.security_role = response.data.security_role;
          self.form.status = Number(response.data.status);
          self.status = self.statuses[response.data.status];
          self.form.type = response.data.type;
          self.form.situation = response.data.situation;
          self.form.description = response.data.description;
          self.form.created_at = response.data.created_at;
          self.form.updated_at = response.data.updated_at;
          self.form.description = response.data.description;
          //----------------------------------------------------
          self.created_by = response.data.created_by;
          self.updated_by = response.data.updated_by;
        }
      }.bind(this))
      .catch(function (error) {
        if(error.response && error.response.status == 401){
          self.$router.push('/pages/login');
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
      this.form.details = JSON.stringify(this.form.details);
      var data_request = JSON.stringify(this.form);
      this.$axios.post(baseurl() + '/users_security_roles', data_request, config )
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
          }else{
            self.$message.error('Unknown error.');
          }
      });
    },
    updateItem(){
      var self = this;
      var id = self.$route.params.id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.form.details = JSON.stringify(this.form.details);
      var data_request = JSON.stringify(this.form);
      this.$axios.put(baseurl() + '/users_security_roles/' + id, data_request, config )
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
          }else{
            self.$message.error('Unknown error.');
          }
      });
    },
    onSaveClose() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addItem();
            this.onCancel();
          }
          else{
            this.updateItem();
            this.onCancel();
          }
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onSave() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addItem();
          }
          else{
            this.updateItem();
          }
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onCancel() {
      this.$router.push({path: this.from.fullPath})
    }
  }
}
</script>
<style Scope>
.el-form-item{
  margin-bottom:0px;
}
.card-body{
  padding: 0rem;
}
.el-table td, .el-table th{
  padding: 0px;
}
</style>
