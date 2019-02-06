<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
      <el-tabs type="border-card">
        <el-tab-pane label="General">
        <el-form ref="content_providerForm" :model="content_providerForm" :rules="rules" label-width="120px" inline-message>
          <el-row>
            <el-col :span="6">
              <el-form-item label="id" prop="id">
                <el-input v-model="content_providerForm.id" disabled></el-input>
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
                <el-input type="name" v-model="content_providerForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="title" prop="title">
                <el-input v-model="content_providerForm.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="code" prop="code">
                <el-input v-model="content_providerForm.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="phone" prop="phone">
                <el-input type="phone" v-model="content_providerForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="email" prop="email">
                <el-input type="email" v-model.number="content_providerForm.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="created_at">
            <el-date-picker v-model="content_providerForm.created_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="updated_at">
            <el-date-picker v-model="content_providerForm.updated_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="description">
            <el-input type="textarea" v-model="content_providerForm.description"></el-input>
          </el-form-item>
          <el-form-item label="details">
            <keyValue title="content_provider details" v-model="content_providerForm.details"></keyValue>
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
      content_providerForm: {
        id: '',
        name: '',
        title: '',
        code: '',
        phone: '',
        email: '',
        created_at: '',
        updated_at: '',
        details: {},
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
    keyValue
  },
  mounted(){
    if(this.$route.params.id != -1){
      this.getContentProvider();
    }
  },
  methods: {
    onStatusChange(selected){
      this.value = selected;
      this.content_providerForm.status = this.value['value'];
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
          self.content_providerForm.id = response.data.id;
          self.content_providerForm.name = response.data.name;
          self.content_providerForm.title = response.data.title;
          self.content_providerForm.code = response.data.code;
          self.content_providerForm.phone = response.data.phone;
          self.content_providerForm.email = response.data.email;
          self.content_providerForm.created_at = response.data.created_at;
          self.content_providerForm.updated_at = response.data.updated_at;
          if(response.data.details){
            self.content_providerForm.details = JSON.parse(response.data.details);
          }
          self.content_providerForm.status = Number(response.data.status);
          self.value = self.statuses[response.data.status];
          self.content_providerForm.description = response.data.description;
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
    addContentProvider(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.content_providerForm.details = JSON.stringify(this.content_providerForm.details);
      var data_request = JSON.stringify(this.content_providerForm);
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
      this.content_providerForm.details = JSON.stringify(this.content_providerForm.details);
      var data_request = JSON.stringify(this.content_providerForm);
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
          }else{
            self.$message.error('Unknown error.');
          }
      });
    },
    onSaveClose() {
      this.$refs["content_providerForm"].validate((valid) => {
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
      this.$refs["content_providerForm"].validate((valid) => {
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
