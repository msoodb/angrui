<template>
  <b-card no-header>
    <template slot="header">
      <au-list
        ref="list"
        handler="users"
        :multipleSelection="multipleSelection"
        :moreCommands = "moreCommands"
        @change="itemsChanged"
        @moreCommandClick="moreCommandClick"
        @add="onAdd"
        @edit="onEdit">
      </au-list>
    </template>
    <el-table ref="table" :data="items"  stripe style="width: 100%" border
      @selection-change="handleSelectionChange">
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
    <el-dialog ref="dialog" id="dialog"
      :visible.sync="dialogVisible"
      :modalAppendToBody="false"
      :close-on-click-modal="false"
      width="80%"
      :show-close="false"
      top="1vh">
      <au-user :record_id="record_id" @close="onClose"></au-user>
    </el-dialog>
  </b-card>
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'
import AUUser from '../users/User'


export default {
  name: 'Users',
  data() {
     return {
       items: [],
       multipleSelection: [],
       newPassword:'',
       dialogChangePasswordVisible: false,
       moreCommands : [
         {
           'command' : 'ChangePassword',
           'label' : 'change password'
         },
         {
           'command' : 'SayBye',
           'label' : 'say goodbye'
         }
       ],
       record_id:'-1',
       dialogVisible: false
     }
  },
  components: {
    'au-list': AUList,
    'au-user': AUUser
  },
  methods: {
    itemsChanged(items){
      this.items = items;
    },
    handleSelectionChange(val) {
       this.multipleSelection = val;
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
    moreCommandClick(command) {
      switch (command) {
        case 'ChangePassword':
          if(this.multipleSelection.length != 1){
            this.$message.warning('Please select one record to change password.');
            break;
          }
          this.dialogChangePasswordVisible = true;
          break;
        case 'SayBye':
          alert("goodbye");
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
    onAdd(){
      var self = this;
      self.record_id = "-1";
      self.dialogVisible = true;
      setTimeout(function(){
        self.$refs["form"].getItem();
      },10)
    },
    onEdit(id){
      var self = this;
      self.record_id = id;
      self.dialogVisible = true;
      setTimeout(function(){
        self.$refs["form"].getItem();
      },10)
    },
    onClose(){
      this.dialogVisible = false;
      this.$refs.list.getItems();
    }
  }
}
</script>

<style scoped>
.card-body{
  padding: 0rem;
  padding-top: 40px;
}
</style>
