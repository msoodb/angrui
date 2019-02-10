<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
      <el-tabs type="border-card">
        <el-tab-pane label="General">
          <el-form ref="userForm" :model="userForm" :rules="rules" label-width="120px" inline-message>
            <el-form-item label="id" prop="id">
              <el-input v-model="userForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="created by" prop="created_by">
              <el-input v-model="created_by" disabled></el-input>
            </el-form-item>
            <el-form-item label="updated by" prop="updated_by">
              <el-input v-model="updated_by" disabled></el-input>
            </el-form-item>
            <el-form-item label="created_at">
              <el-date-picker v-model="userForm.created_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="updated_at">
              <el-date-picker v-model="userForm.updated_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
            </el-form-item>
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
              <el-form-item label="type" prop="type">
                <el-select v-model="type" value-key="value" placeholder="Select" @change="onTypeChange">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="situation" prop="situation">
                <el-select v-model="situation" value-key="value" placeholder="Select" @change="onSituationChange">
                  <el-option
                    v-for="item in situations"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="first name" prop="first_name">
                <el-input type="first_name" v-model="userForm.first_name"></el-input>
              </el-form-item>
              <el-form-item label="middle name" prop="middle_name">
                <el-input type="middle_name" v-model="userForm.middle_name"></el-input>
              </el-form-item>
              <el-form-item label="last name" prop="last_name">
                <el-input type="last_name" v-model="userForm.last_name"></el-input>
              </el-form-item>
              <el-form-item label="username" prop="username">
                <el-input type="username" v-model="userForm.username"></el-input>
              </el-form-item>
              <el-form-item label="email" prop="email">
                  <el-input type="email" v-model="userForm.email"></el-input>
                </el-form-item>
              <el-form-item label="password" prop="password">
                <el-input type="password" v-model="userForm.password"></el-input>
              </el-form-item>
              <el-form-item label="repeat password" prop="repassword">
                <el-input type="password"></el-input>
              </el-form-item>
              <el-form-item label="description">
                <el-input type="textarea" v-model="userForm.description"></el-input>
              </el-form-item>
              <el-form-item label="details">
                <keyValue title="user details" v-model="userForm.details"></keyValue>
              </el-form-item>
              <hr/>
              <el-form-item>
                <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSaveClose">Save and Close</el-button>
                <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSave">Save</el-button>
                <el-button icon="el-icon-circle-close" type="default" size="small" @click="onCancel">Cancel</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
         </el-tabs>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {baseurl} from '../../config'
import keyValue from '../../components/keyValue'

export default {
  name: 'User',
  computed:{
    user_id: {
      get: function () {
        return this.$route.params.id;
      }
    }
  },
  data: () => {
    return {
      userForm: {
        id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        password:'',
        type: '2',
        details: {},
        status:'1',
        situation:'0',
        created_at: '',
        updated_at: '',
        description:''
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
      types: [
        {
          value: '1',
          label: 'god'
        },
        {
          value: '2',
          label: 'human'
        }
      ],
      type : null,
      situations: [
        {
          value: '0',
          label: 'waiting'
        },
        {
          value: '1',
          label: 'active'
        }
      ],
      situation : null,
      rules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'change' },
          { type: 'email', message: 'Email must be in correct format', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    keyValue
  },
  created() {
     this.status = this.statuses[1];
     this.type = this.types[1];
     this.situation = this.situations[0];
  },
  mounted(){
    if(this.$route.params.id != -1){
      this.getUser();
    }
  },
  methods: {
    onStatusChange(selected){
      this.status = selected;
      this.userForm.status = this.status['value'];
    },
    onTypeChange(selected){
      this.type = selected;
      this.userForm.type = this.type['value'];
    },
    onSituationChange(selected){
      this.situation = selected;
      this.userForm.situation = this.situation['value'];
    },
    getUser(){
    var self = this;
    console.log(self.$route.params.id);
    var id = self.$route.params.id;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    this.$axios.get(baseurl() + '/users/' + id, config )
      .then(function (response) {
        if(response.status == 200){
          self.userForm.id = response.data.id;
          self.userForm.first_name = response.data.first_name;
          self.userForm.middle_name = response.data.middle_name;
          self.userForm.last_name = response.data.last_name;
          self.userForm.username = response.data.username;
          self.userForm.email = response.data.email;
          self.userForm.type = Number(response.data.type);
          self.type = self.types[response.data.type-1];
          if(response.data.details){
            self.userForm.details = JSON.parse(response.data.details);
          }
          self.userForm.status = Number(response.data.status);
          self.status = self.statuses[response.data.status];
          self.userForm.situation = Number(response.data.situation);
          self.situation = self.situations[response.data.situation];
          self.userForm.created_at = response.data.created_at;
          self.userForm.updated_at = response.data.updated_at;
          self.userForm.description = response.data.description;
          //----------------------------------------------------
          self.created_by = response.data.created_by;
          self.updated_by = response.data.updated_by;
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
    addUser(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.userForm.details = JSON.stringify(this.userForm.details);
      var data_request = JSON.stringify(this.userForm);
      this.$axios.post(baseurl() + '/users', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'User added successfully',
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
    updateUser(){
      var self = this;
      var id = self.$route.params.id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.userForm.details = JSON.stringify(this.userForm.details);
      var data_request = JSON.stringify(this.userForm);
      this.$axios.put(baseurl() + '/users/' + id, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'User updated successfully',
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
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addUser();
            this.onCancel();
          }
          else{
            this.updateUser();
            this.onCancel();
          }
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onSave() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addUser();
          }
          else{
            this.updateUser();
          }
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onCancel() {
      this.$router.go(-1)
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
