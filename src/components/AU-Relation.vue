<template>
  <div class="mbuttom">
    <el-row :gutter="0">
      <el-table :data="relations" :show-header=false fit size="medium">
        <el-table-column type="index"  width="40" align="center"></el-table-column>
        <el-table-column :prop="column" :label="title"  width="280"></el-table-column>
        <el-table-column label="" width="80" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" size="mini"
              @click="onDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-row>
    <el-row :gutter="0">
      <el-button icon="el-icon-circle-plus" size="mini" @click="onAdd()">Add</el-button>
      <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true">
        <div class="text-center" vertical-align="middle">
          <el-pagination id="paginator" class="text-center" layout="prev, pager, next"
                :page-count="page_count" @current-change="handleCurrentChange" :current-page.sync="page">
          </el-pagination>
        </div>
        <el-table ref="table" :data="details" style="width:100%" height="300" border
            highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection"  width="40" align="center">
          </el-table-column>
          <el-table-column
            v-for="{ prop, label } in columns"
            :key="prop"
            :prop="prop"
            :label="label">
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button @click="onDialogConfirm">Confirm</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import {baseurl} from '../config'

export default {
  name: 'AU-Relation',
  props: {
    master: {
      type: String,
      required: true
    },
    masterId: {
      type: String,
      required: true
    },
    relation: {
        type: String,
        required: true
    },
    detail: {
      type: String,
      required: true
    },
    detailId: {
      type: String,
      required: true
    },
    id: {
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
      this.getRelations();
    }
  },
  data: function () {
    return {
      details:[],
      relations:[],
      columns:[
        {
          prop:'name',
          label:'name',
          width:230
        },
        {
          prop:'title',
          label:'title',
          width:366
        }
      ],
      page: 1,
      limit: 20,
      page_count: 10000,
      result_count: 0,
      multipleSelection:[],
      dialogFormVisible: false
    }
  },
  created() {
    this.getRelations();
  },
  methods:{
    handleSelectionChange(val) {
       this.multipleSelection = val;
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getDetails()
    },
    getRelations(){
      var self = this;
      if(self.id == -1){
        return;
      }
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var url = '/' + this.master + '/' + self.id + '/' + this.relation;
      this.$axios.get(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            self.relations = response.data.items;
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
      var url = '/' + this.relation + '/' + id
      this.$axios.delete(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Record successfully deleted',
              duration:0,
              type:'success'
            })
            this.getRelations();
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
      this.dialogFormVisible = true;
      this.getDetails();
    },
    getDetails(){
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
      var url = '/' + this.detail + '?page=' + self.page;
      this.$axios.get(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            self.details = response.data.items;
            self.limit = Number(response.data.info.limit);
            self.page_count = Number(response.data.info.page_count);
            self.result_count = Number(response.data.info.result_count);
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
    onDialogConfirm(){
      var self = this;
      for(var i=0; i<self.multipleSelection.length; i++){
        var id = this.multipleSelection[i].id;
        self.addRelation(id);
      }
      setTimeout(function () {
        self.getRelations();
        self.dialogFormVisible = false;
      }, 1000);
    },
    addRelation(detail){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var relationsData = {
        [this.masterId] : this.id,
        [this.detailId] : detail,
        'status' : 1,
        'situation' : 0,
        'description': ''
      }
      var data_request = JSON.stringify(relationsData);
      var url = '/' + this.relation;
      this.$axios.post(baseurl() + url, data_request, config )
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
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.el-pagination {
    padding: 5px 5px;
    font-weight: 600;
    color: #88898c;
}
.el-button{
  background-color: transparent;
  border: none;
}
.el-button:hover{
  color: black;
  background-color: #efefef;
  border: none;
}
</style>
