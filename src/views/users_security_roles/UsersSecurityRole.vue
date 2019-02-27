<template>
  <el-container>
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="General">
          <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
            <el-row :gutter="20">
              <el-col :span="16">
                <el-form-item label="user" prop="user_lookup">
                  <au-user-lookup handler="users" :id="form._user_" @select="userLookupSelect"></au-user-lookup>
                </el-form-item>
                <el-form-item label="security role" prop="security_role">
                  <au-lookup handler="security_roles" :id="form.security_role" @select="SecurityRoleLookupSelect"></au-lookup>
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
    </el-main>
  </el-container>
</template>

<script>
import {baseurl} from '../../config'
import AULookup from '../../components/AU-Lookup'
import AUUserLookup from '../../components/AU-UserLookup'

export default {
  name: 'UsersSecurityRole',
  data: () => {
    return {
      from: null,
      form: {
        id: '',
        _user_:'',
        security_role: '',
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
    'au-lookup' : AULookup,
    'au-user-lookup' : AUUserLookup
  },
  created() {
     this.status = this.statuses[1];
  },
  mounted(){
    if(this.$route.params.id != -1){
      this.getItem();
    }
  },
  methods: {
    userLookupSelect(id){
      this.form._user_ = id;
    },
    SecurityRoleLookupSelect(id){
      this.form.security_role = id;
    },
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
          }else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
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
      var data_request = JSON.stringify(self.form);
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
          if(this.$route.params.id == -1){
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
      this.$router.go(-1);
    }
  }
}
</script>
<style scoped>
.el-form-item{
  margin-bottom:0px;
}
.card-body{
  padding: 0rem;
}
.el-table td, .el-table th{
  padding: 0px;
}
.el-form-item__content{
  line-height:0px;
}
</style>
