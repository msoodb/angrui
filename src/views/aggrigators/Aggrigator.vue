<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
      <el-tabs type="border-card">
        <el-tab-pane label="General">
        <el-form ref="aggrigatorForm" :model="aggrigatorForm" :rules="rules" label-width="120px" inline-message>
          <el-row>
            <el-col :span="6">
              <el-form-item label="id" prop="id">
                <el-input v-model="aggrigatorForm.id" disabled></el-input>
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
                <el-input type="name" v-model="aggrigatorForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="title" prop="title">
                <el-input v-model="aggrigatorForm.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="code" prop="code">
                <el-input v-model="aggrigatorForm.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="phone" prop="phone">
                <el-input type="phone" v-model="aggrigatorForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="email" prop="email">
                <el-input type="email" v-model.number="aggrigatorForm.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="created_at">
            <el-date-picker v-model="aggrigatorForm.created_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="updated_at">
            <el-date-picker v-model="aggrigatorForm.updated_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="description">
            <el-input type="textarea" v-model="aggrigatorForm.description"></el-input>
          </el-form-item>
          <el-form-item label="details">
            <keyValue title="aggrigator details" v-model="aggrigatorForm.details"></keyValue>
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
  name: 'Aggrigator',
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
      aggrigatorForm: {
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
     this.value = this.statuses[1];
  },
  components: {
    keyValue
  },
  mounted(){
    if(this.$route.params.id != -1){
      this.getAggrigator();
    }
  },
  methods: {
    onStatusChange(selected){
      this.value = selected;
      this.aggrigatorForm.status = this.value['value'];
    },
    getAggrigator(){
    var self = this;
    var id = self.$route.params.id;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    this.$axios.get(baseurl() + '/aggrigators/' + id, config )
      .then(function (response) {
        if(response.status == 200){
          self.aggrigatorForm.id = response.data.id;
          self.aggrigatorForm.name = response.data.name;
          self.aggrigatorForm.title = response.data.title;
          self.aggrigatorForm.code = response.data.code;
          self.aggrigatorForm.phone = response.data.phone;
          self.aggrigatorForm.email = response.data.email;
          self.aggrigatorForm.created_at = response.data.created_at;
          self.aggrigatorForm.updated_at = response.data.updated_at;
          if(response.data.details){
            self.aggrigatorForm.details = JSON.parse(response.data.details);
          }
          self.aggrigatorForm.status = Number(response.data.status);
          self.value = self.statuses[response.data.status];
          self.aggrigatorForm.description = response.data.description;
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
    addAggrigator(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.aggrigatorForm.details = JSON.stringify(this.aggrigatorForm.details);
      var data_request = JSON.stringify(this.aggrigatorForm);
      this.$axios.post(baseurl() + '/aggrigators', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Aggrigator added successfully',
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
    updateAggrigator(){
      var self = this;
      var id = self.$route.params.id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.aggrigatorForm.details = JSON.stringify(this.aggrigatorForm.details);
      var data_request = JSON.stringify(this.aggrigatorForm);
      this.$axios.put(baseurl() + '/aggrigators/' + id, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Aggrigator updated successfully',
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
      this.$refs["aggrigatorForm"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addAggrigator();
            this.onCancel();
          }
          else{
            this.updateAggrigator();
            this.onCancel();
          }
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onSave() {
      this.$refs["aggrigatorForm"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addAggrigator();
          }
          else{
            this.updateAggrigator();
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
