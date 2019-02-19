<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
      <el-tabs type="border-card">
        <el-tab-pane label="General">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" inline-message>
          <el-row>
            <el-col :span="6">
              <el-form-item label="id" prop="id">
                <el-input v-model="form.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="status" prop="status">
                <el-select v-model="value" value-key="value" placeholder="Select" @change="onStatusChange">
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
          <el-row>
            <el-col :span="6">
              <el-form-item label="name" prop="name">
                <el-input type="name" v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="title" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="code" prop="code">
                <el-input v-model="form.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="phone" prop="phone">
                <el-input type="phone" v-model="form.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="email" prop="email">
                <el-input type="email" v-model.number="form.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="user" prop="user_lookup">
            <au-user-lookup handler="users" :id="form.admin" @select="userLookupSelect"></au-user-lookup>
          </el-form-item>
          <el-form-item label="created_at">
            <el-date-picker v-model="form.created_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="updated_at">
            <el-date-picker v-model="form.updated_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="details">
            <au-keyValue title="details" :data="form.details" @change="onChangeDetails"></au-keyValue>
          </el-form-item>
          <hr/>
          <el-form-item>
            <el-button icon="el-icon-circle-check" type="success" size="small" @click="onSaveClose">Save</el-button>
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
import AUKeyValue from '../../components/AU-KeyValue'
import AUUserLookup from '../../components/AU-UserLookup'


export default {
  name: 'ContentProvider',
  computed:{
    content_provider_id: {
      get: function () {
        return this.$route.params.id;
      }
    }
  },
  data: () => {
    return {
      form: {
        id: '',
        admin:'',
        name: '',
        title: '',
        code: '',
        phone: '',
        email: '',
        created_at: '',
        updated_at: '',
        details: '',
        status: '1',
        description: ''
      },
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
      value : null,
      rules: {
        name: [
          { required: true, message: 'Please input name', trigger: 'change' },
          { min: 3, max: 255, message: 'Length should be 3 to 255', trigger: 'change' }
        ],
        phone: [
          { required: true, message: 'Please input code', trigger: 'change' }
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'change' },
          { type: 'email', message: 'Email must be in correct format', trigger: 'change' }
        ]
      }
    }
  },
  created() {
     this.value = this.statuses[1];
  },
  components: {
    'au-keyValue':AUKeyValue,
    'au-user-lookup' : AUUserLookup
  },
  mounted(){
    if(this.$route.params.id != -1){
      this.getContentProvider();
    }
  },
  methods: {
    userLookupSelect(id){
      this.form.admin = id;
    },
    onChangeDetails(val){
      this.form.details = val;
    },
    onStatusChange(selected){
      this.value = selected;
      this.form.status = this.value['value'];
    },
    getContentProvider(){
    var self = this;
    var id = self.$route.params.id;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    this.$axios.get(baseurl() + '/content_providers/' + id, config )
      .then(function (response) {
        if(response.status == 200){
          self.form.id = response.data.id;
          self.form.admin = response.data.admin;
          self.form.name = response.data.name;
          self.form.title = response.data.title;
          self.form.code = response.data.code;
          self.form.phone = response.data.phone;
          self.form.email = response.data.email;
          self.form.created_at = response.data.created_at;
          self.form.updated_at = response.data.updated_at;
          self.form.details = response.data.details;
          self.form.status = Number(response.data.status);
          self.value = self.statuses[response.data.status];
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
    addContentProvider(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var data_request = JSON.stringify(this.form);
      this.$axios.post(baseurl() + '/content_providers', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'ContentProvider added successfully',
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
    updateContentProvider(){
      var self = this;
      var id = self.$route.params.id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var data_request = JSON.stringify(this.form);
      this.$axios.put(baseurl() + '/content_providers/' + id, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'ContentProvider updated successfully',
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
    onSaveClose() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addContentProvider();
            this.onCancel();
          }
          else{
            this.updateContentProvider();
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
            this.addContentProvider();
          }
          else{
            this.updateContentProvider();
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
