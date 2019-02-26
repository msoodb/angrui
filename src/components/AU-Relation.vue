<template>
  <div class="mbuttom">
    <el-table :data="items" border>
      <el-table-column type="index"  width="40" align="center">
      </el-table-column>
      <el-table-column :prop="column" :label="title"  width="180">
      </el-table-column>
      <el-table-column label="Operations" width="140" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-delete" size="mini" type="danger"
            @click="onDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button icon="el-icon-circle-plus" type="primary" size="mini" @click="onAdd()">Add</el-button>
    <el-dialog ref="detailsDialog" :title=title :visible.sync="dialogVisible">
      <el-form ref="detailsFormDialog" :model="detailsFormDialog" :rules="rules" label-width="70px" inline-message>
        <el-form-item label="key" prop="key">
          <el-input type="key" v-model="detailsFormDialog.key"></el-input>
        </el-form-item>
        <el-form-item label="value" prop="value">
          <el-input type="value" v-model="detailsFormDialog.value"></el-input>
        </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="onDialogConfirm">Confirm</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import {baseurl} from '../config'

export default {
  name: 'AU-Relation',
  props: {
    entity: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    handler: {
        type: String,
        required: true
    },
    column: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  watch: {
    id: function(newVal, oldVal) {
      this.getItems();
    }
  },
  data: function () {
    return {
      items:{},
      detailsFormDialog:{
        key:null,
        value:null
      },
      rules: {
        key: [
          { required: true, message: 'Please input key', trigger: 'change' }
        ],
        value: [
          { required: true, message: 'Please input value', trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  created() {
    this.getItems();
  },
  methods:{
    getItems(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var url = '/' + this.entity + '/' + self.id + '/' + this.handler;
      this.$axios.get(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            self.items = response.data.items;
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
    onDelete(index, row){
      this.$confirm('Selected record will be permanently deleted. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
      }).then(() => {
        this.deleteRecord(row.id);
        this.getItems();
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
      var url = '/' + this.handler + '/' + id
      this.$axios.delete(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Record successfully deleted',
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
      // this.detailsFormDialog.key='';
      // this.detailsFormDialog.value ='';
      // this.dialogVisible = true;
    },
    onDialogConfirm(){
      // var self = this;
      // self.$refs['detailsFormDialog'].validate((valid) => {
      //   if (valid) {
      //     var key = self.detailsFormDialog.key;
      //     var value = self.detailsFormDialog.value;
      //     self.items[key] = value;
      //     self.dialogVisible = false;
      //     this.getItems();
      //     var details = JSON.stringify(this.items);
      //     this.$emit('change', details);
      //   }
      //   else{
      //     self.$message.error('Please fill in the required fields.');
      //   }
      // });
    }
  }
}
</script>

<style scoped>
.el-table td, .el-table th{
  padding: 0px;
}
.mbuttom{
  margin-bottom: 10px;
}
</style>
