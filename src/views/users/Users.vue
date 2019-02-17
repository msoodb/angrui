<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
        <template slot="header">
          <el-row >
            <el-col :span="6">
              <div class="text-left">
                <el-button icon="el-icon-circle-plus" circle @click="onAdd"></el-button>
                <el-button icon="el-icon-edit" circle @click="onEdit"></el-button>
                <el-button icon="el-icon-delete" circle @click="onDelete"></el-button>
                <el-button icon="el-icon-search" circle></el-button>
                <el-dropdown @command="handleMoreCommand" trigger="click">
                  <el-button icon="el-icon-more" circle>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="ChangePassword">change password</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="text-center">
                <el-pagination id="users_paginator" class="text-center" layout="prev, pager, next"
                      :page-count="page_count" @current-change="handleCurrentChange" :current-page.sync="page">
                </el-pagination>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="text-right">
                <el-button icon="el-icon-question" circle></el-button>
                <el-button icon="el-icon-setting" circle></el-button>
              </div>
            </el-col>
          </el-row>
        </template>
        <el-table ref="usersTable" :data="items"  stripe style="width: 100%" border
              @selection-change="handleSelectionChange" >
          <el-table-column  type="selection"  width="40" align="center">
          </el-table-column>
          <el-table-column  type="index"  width="40" align="center">
          </el-table-column>
          <el-table-column  prop="username"  label="username"  width="160">
          </el-table-column>
          <el-table-column prop="email" label="email" width="200">
          </el-table-column>
          <el-table-column prop="first_name" label="first name" width="160">
          </el-table-column>
          <el-table-column prop="last_name" label="last name" width="160">
          </el-table-column>
          <el-table-column prop="created_at" label="created_at" width="120" :formatter="formatDateOnly">
          </el-table-column>
          <el-table-column prop="updated_at" label="updated_at" width="120" :formatter="formatDateOnly">
          </el-table-column>
          <el-table-column prop="type" label="type" width="100" align="center" :formatter="formatType">
          </el-table-column>
          <el-table-column prop="situation" label="situation" width="100" align="center" :formatter="formatSituation">
          </el-table-column>
          <el-table-column prop="status" label="status" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.status == 0 ? 'disable' : 'enable' }}
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="change password" :visible.sync="dialogChangePasswordVisible">
          <el-form>
            <el-form-item label="password" prop="password">
              <el-input type="password" v-model="newPassword"></el-input>
            </el-form-item>
            <el-form-item label="repeat password" prop="repassword">
              <el-input type="password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogChangePasswordVisible = false">Cancel</el-button>
            <el-button type="primary" @click="onChangePasswordConfirm">Confirm</el-button>
          </span>
        </el-dialog>
      </b-card>
    </b-col>
  </b-row>
</template>



<script>
import {baseurl} from '../../config'
export default {
  name: 'Users',
  data() {
     return {
       items: [],
       page: 1,
       offset: 20,
       page_count: 10000,
       result_count: 0,
       multipleSelection: [],
       newPassword:'',
       dialogChangePasswordVisible: false
     }
  },
  mounted(){
    this.page = Number(this.$route.query.page);
    this.getUsers();
  },
  watch:{
    $route (to, from){
      this.page = Number(this.$route.query.page);
      this.getUsers();
    }
  },
  computed: {
  },
  methods: {
    getUsers(){
    var self = this;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    if(!self.page || self.page == "undefined" || self.page < 1){
      self.page = 1;
    }
    this.$axios.get(baseurl() + '/users?page=' + self.page, config )
      .then(function (response) {
        if(response.status == 200){
          self.$router.push({path: 'users?page=' + self.page});
          self.items = response.data.items;
          self.offset = Number(response.data.info.offset);
          self.page_count = Number(response.data.info.page_count);
          self.result_count = Number(response.data.info.result_count);
          if(self.page > self.page_count){
            self.page = self.page_count;
            self.getUsers();
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
    handleCurrentChange (val) {
      this.page = val;
      this.getUsers();
    },
    userLink (id) {
      return `users/${id.toString()}`
    },
    rowClicked (item) {
      const userLink = this.userLink(item.id)
      this.$router.push({path: userLink})
    },
    handleSelectionChange(val) {
       this.multipleSelection = val;
    },
    onChart(){
      this.$router.push('/charts/user');
    },
    onAdd(){
      var id = -1;
      const userLink = this.userLink(id);
      this.$router.push({path: userLink})
    },
    onEdit(){
      if(this.multipleSelection.length != 1){
        this.$message.warning('Please select one record to edit.');
        return;
      }
      var id = this.multipleSelection[0].id;
      const userLink = this.userLink(id);
      this.$router.push({path: userLink})
    },
    onDelete(){
      if(this.multipleSelection.length == 0){
        this.$message.warning('There is no selected record(s) to delete.');
        return;
      }
      this.$confirm('Selected user(s) will be permanently deleted. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
      }).then(() => {
        for(var i=0; i<this.multipleSelection.length; i++){
          var id = this.multipleSelection[i].id;
          this.deleteRecord(id);
        }
        this.getUsers();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        });
      });
    },
    deleteRecord(id){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.$axios.delete(baseurl() + '/users/' + id, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'User successfully deleted',
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
    formatType(row, column, cellValue){
      var type = cellValue;
      switch (type) {
        case '0':
          return 'zeus';
          break;
        case '1':
          return 'god';
          break;
        case '2':
          return 'human';
          break;
        default:
          return 'unknown';
      }
      return date[0];
    },
    formatSituation(row, column, cellValue){
      var type = cellValue;
      switch (type) {
        case '0':
          return 'waiting';
          break;
        case '1':
          return 'active';
          break;
        case '2':
          return 'suspend';
          break;
        case '3':
          return 'locked';
          break;
        default:
          return 'unknown';
      }
      return date[0];
    },
    formatDateOnly(row, column, cellValue){
      var date = cellValue.split(' ');
      return date[0];
    },
    handleExpirableCheckbox(scope){
      var value = scope.row.expirable == 't' ? true : false;
      console.log(scope.row.id + " " + scope.row.expirable);
      return value;
    },
    handleMoreCommand(command) {
      switch (command) {
        case 'ChangePassword':
          if(this.multipleSelection.length != 1){
            this.$message.warning('Please select one record to change password.');
            break;
          }
          this.dialogChangePasswordVisible = true;
          break;
        default:
          break;
      }
    },
    onChangePasswordConfirm(){
      this.dialogChangePasswordVisible = false;
      var id = this.multipleSelection[0].id;
      this.changePassword(id);

    },
    changePassword(id){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      let password = {
        'password' : this.newPassword
      }
      var data_request = JSON.stringify(password);
      this.$axios.put(baseurl() + '/users/' + id + '/password', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'User successfully deleted',
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
  }
}
</script>

<style scoped>
.card-body >>> table > tbody > tr > td {
  cursor: pointer;
  padding: 0px;
}
.card-body >>> table > tbody > tr > th {
  padding: 0px;
}
.card{
  margin-bottom: 0rem;
}
.card-body{
  padding: 0rem;
}
.card-header{
  padding: 0rem;
  border: 0rem;
  background-color: white;
}
.el-button{
  background-color: transparent;
  border: none;
}
.el-button:hover{
  color: black;
  background-color: #f5f5f5;
  border: none;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

</style>
