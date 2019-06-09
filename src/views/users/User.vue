<template>
  <el-tabs type="border-card">
    <el-tab-pane label="General">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
        <el-row :gutter="20">
          <el-col :span="16">
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
            <el-form-item label="avatar">
              <el-upload
                class="avatar-uploader"
                ref="avatar_upload"
                :action="avatar_action"
                :auto-upload="false"
                :headers="avatar_headers"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                :before-upload="beforeAvatarUpload">
                <img v-if="avatarUrl" :src="avatarUrl" class="avatar"></img>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="first name" prop="first_name">
              <el-input type="first_name" v-model="form.first_name"></el-input>
            </el-form-item>
            <el-form-item label="middle name" prop="middle_name">
              <el-input type="middle_name" v-model="form.middle_name"></el-input>
            </el-form-item>
            <el-form-item label="last name" prop="last_name">
              <el-input type="last_name" v-model="form.last_name"></el-input>
            </el-form-item>
            <el-form-item label="username" prop="username">
              <el-input type="username" v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input type="email" v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="password" prop="password" :hidden="hidePassword">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="confirm" prop="confirm" :hidden="hidePassword">
              <el-input type="password" v-model="confirm"></el-input>
            </el-form-item>
            <el-form-item label="description">
              <el-input type="textarea" :rows=6 v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="details">
              <au-keyValue title="details" :data="form.details" @change="onChangeDetails"></au-keyValue>
            </el-form-item>
            <el-form-item label="security roles">
              <au-relation
                    :id="record_id"
                    master="users"
                    masterId="_user_"
                    relation="users_security_roles"
                    detail="security_roles"
                    detailId="security_role"
                    column="security_role"
                    title="security role"></au-relation>
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
import AUKeyValue from '../../components/AU-KeyValue'
import AURelation from '../../components/AU-Relation'


export default {
  name: 'User',
  props: {
    record_id: {
      type: String,
      required: true
    }
  },
  // watch: {
  //   record_id: {
  //     immediate: true,
  //     handler(newVal, oldVal) {
  //       this.record_id = newVal;
  //       if(this.record_id == '-1'){
  //         this.getDefaultData();
  //       } else{
  //         this.getItem();
  //       }
  //     }
  //   }
  // },
  computed:{
    hidePassword:{
      get: function () {
        if(this.record_id == "-1"){
          return false;
        }
        else{
          return true;
        }
      }
    }
  },
  data: () => {
    return {
      form: {
        id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        password:'',
        type: '2',
        details: '',
        status:'1',
        situation:'0',
        created_at: '',
        updated_at: '',
        description:''
      },
      confirm:'',
      created_by:'',
      updated_by:'',
      avatarUrl: '',
      avatar_action:'',
      avatar_headers:{},
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
        },
        {
          value: '2',
          label: 'suspend'
        },
        {
          value: '3',
          label: 'locked'
        }
      ],
      situation : null,
      rules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'change' },
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'change' },
          { type: 'email', message: 'Email must be in correct format', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    'au-keyValue':AUKeyValue,
    'au-relation':AURelation
  },
  created() {
     this.status = this.statuses[1];
     this.type = this.types[1];
     this.situation = this.situations[0];
  },
  // mounted(){
  //   if(this.record_id != -1){
  //     this.getItem();
  //     this.getAvatar();
  //   }
  // },
  methods: {
    onChangeDetails(val){
      this.form.details = val;
    },
    onStatusChange(selected){
      this.status = selected;
      this.form.status = this.status['value'];
    },
    onTypeChange(selected){
      this.type = selected;
      this.form.type = this.type['value'];
    },
    onSituationChange(selected){
      this.situation = selected;
      this.form.situation = this.situation['value'];
    },
    getItem(){
      var self = this;
      var id = self.record_id;
      if(id == '-1'){
        self.form.id = self.record_id;
        self.form.first_name = '';
        self.form.middle_name = '';
        self.form.last_name = '';
        self.form.username = '';
        self.form.email = '';
        self.form.status = '1',
        self.status = null;
        self.form.type = '0';
        self.form.situation = '0';
        self.form.created_at = '';
        self.form.updated_at = '';
        self.form.description = '';
        self.$refs["form"].resetFields();
        return;
      }
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
            self.form.id = response.data.id;
            self.form.first_name = response.data.first_name;
            self.form.middle_name = response.data.middle_name;
            self.form.last_name = response.data.last_name;
            self.form.username = response.data.username;
            self.form.email = response.data.email;
            self.form.type = Number(response.data.type);
            self.type = self.types[response.data.type-1];
            self.form.details =response.data.details;
            self.form.status = Number(response.data.status);
            self.status = self.statuses[response.data.status];
            self.form.situation = Number(response.data.situation);
            self.situation = self.situations[response.data.situation];
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
      this.$axios.post(baseurl() + '/users', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            self.form.id = response.id;
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
      this.$axios.put(baseurl() + '/users/' + id, data_request, config )
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
          this.uploadAvatar();
          this.onClose();
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onClose() {
      this.$emit('close');
    },
    getAvatar(){
      var self = this;
      var id = self.record_id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      this.$axios.get(baseurl() + '/users/' + id + '/avatars' )
        .then(function (response) {
          if(response.status == 200){
            this.avatarUrl = baseurl() + '/users/' + id + '/avatars';
          }
        }.bind(this))
        .catch(function (error) {
          if(error.response && error.response.status == 401){
            self.$router.push('/pages/login');
          }else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
          }else{
            self.$message.error('Unknown error.' + ': ' + error);
          }
      });
    },
    handleAvatarChange(file, fileList){
      this.avatar_action = baseurl() + '/users/' + this.form.id + '/avatars';
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      this.avatar_headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
      this.avatarUrl = URL.createObjectURL(file.raw);
    },
    // handleAvatarSuccess(res, file) {
    //   this.avatarUrl = URL.createObjectURL(file.raw);
    // },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!');
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
      }
      return isJPG && isLt2M;
      //return false;
    },
    uploadAvatar(){
      this.$refs.avatar_upload.submit();
    }
  }
}
</script>
