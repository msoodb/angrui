<template>
  <el-tabs type="border-card">
    <el-tab-pane label="General">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" inline-message>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="security role" prop="security_role">
              <au-lookup handler="security_roles" :id="form.security_role" @select="SecurityRoleLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="entity" prop="entity">
              <au-lookup handler="entities" :id="form.entity" @select="EntityLookupSelect"></au-lookup>
            </el-form-item>
            <el-form-item label="get items">
              <el-checkbox v-model="privileges.get_items"></el-checkbox>
            </el-form-item>
            <el-form-item label="get item">
              <el-checkbox v-model="privileges.get_item"></el-checkbox>
            </el-form-item>
            <el-form-item label="add item">
              <el-checkbox v-model="privileges.add_item"></el-checkbox>
            </el-form-item>
            <el-form-item label="update item">
              <el-checkbox v-model="privileges.update_item"></el-checkbox>
            </el-form-item>
            <el-form-item label="delete item">
              <el-checkbox v-model="privileges.delete_item"></el-checkbox>
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
  name: 'Privilege',
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
        security_role:'',
        entity:'',
        privilege_string:'',
        created_at: '',
        updated_at: '',
        status: '1',
        situation:'0',
        description: ''
      },
      privileges:{
        get_items:false,
        get_item:false,
        add_item:false,
        update_item:false,
        delete_item:false
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
    parsePrivilegeString()
    {
      var splited = this.form.privilege_string.split("");
      splited[0] == '1' ? this.privileges.get_items = true : this.privileges.get_items = false;
      splited[1] == '1' ? this.privileges.get_item = true : this.privileges.get_item = false;
      splited[2] == '1' ? this.privileges.add_item = true : this.privileges.add_item = false;
      splited[3] == '1' ? this.privileges.update_item = true : this.privileges.update_item = false;
      splited[4] == '1' ? this.privileges.delete_item = true : this.privileges.delete_item = false;
    },
    joinPrivilegeString()
    {
      var zeroPrivileges = '00000000000000000000';
      var splited = zeroPrivileges.split("");
      this.privileges.get_items == true ? splited[0] = '1' : splited[0] = '0';
      this.privileges.get_item == true ? splited[1] = '1' : splited[1] = '0';
      this.privileges.add_item == true ? splited[2] = '1' : splited[2] = '0';
      this.privileges.update_item == true ? splited[3] = '1' : splited[3] = '0';
      this.privileges.delete_item == true ? splited[4] = '1' : splited[4] = '0';
      this.form.privilege_string = splited.join("");
    },
    EntityLookupSelect(id){
      this.form.entity = id;
    },
    SecurityRoleLookupSelect(id){
      this.form.security_role = id;
    },
    onStatusChange(selected){
      this.status = selected;
      this.form.status = this.status['value'];
    },
    getDefaultData(){
      var self = this;
      self.form.id = self.record_id;
      self.form.security_role = '';
      self.form.entity = '';
      self.form.privilege_string = '';
      self.form.status = '1',
      self.status = null;
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
      this.$axios.get(baseurl() + '/privileges/' + id, config )
        .then(function (response) {
          if(response.status == 200){
            self.form.id = response.data.id;
            self.form.status = Number(response.data.status);
            self.status = self.statuses[response.data.status];
            self.form.situation = response.data.situation;
            self.form.security_role = response.data.security_role;
            self.form.entity = response.data.entity;
            self.form.privilege_string = response.data.privilege_string;
            self.form.created_at = response.data.created_at;
            self.form.updated_at = response.data.updated_at;
            self.created_by = response.data.created_by;
            self.updated_by = response.data.updated_by;
            self.form.description = response.data.description;
            this.parsePrivilegeString();
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
      self.joinPrivilegeString();
      if(!self.form.details || self.form.details==''){self.form.details = "{}"}
      var data_request = JSON.stringify(self.form);
      this.$axios.post(baseurl() + '/privileges', data_request, config )
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
      this.joinPrivilegeString();
      var data_request = JSON.stringify(self.form);
      this.$axios.put(baseurl() + '/privileges/' + id, data_request, config )
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
