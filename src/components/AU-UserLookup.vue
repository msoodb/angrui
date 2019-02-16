<template>
    <el-row :gutter="0">
      <el-col :span="3">
        <el-button class="lookup" type="default" @click="onLookup"></el-button>
      </el-col>
      <el-col :span="21">
        <el-input readonly v-model="this.username"></el-input>
      </el-col>
      <el-dialog :visible.sync="dialogFormVisible">
        <div class="text-center" vertical-align="middle">
          <el-pagination id="paginator" class="text-center" layout="prev, pager, next"
                :page-count="page_count" @current-change="handleCurrentChange" :current-page.sync="page">
          </el-pagination>
        </div>
        <el-table ref="table" :data="items" stripe style="width:100%" height="300" border
            @selection-change="handleSelectionChange">
          <el-table-column  type="selection"  width="40">
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
          <el-button type="primary" @click="onLookupConfirm">Confirm</el-button>
        </span>
      </el-dialog>
    </el-row>
</template>

<script>
import {baseurl} from '../config'


export default {
  name: 'AU-UserLookup',
  props: {
    handler:String,
    id:String
  },
  data: function () {
    return {
       columns:[
         {
           prop:'username',
           label:'username',
           width:230
         },
         {
           prop:'email',
           label:'email',
           width:366
         }
       ],
       items: [],
       page: 1,
       offset: 20,
       page_count: 10000,
       result_count: 0,
       multipleSelection: [],
       dialogFormVisible: false,
       username:''
    }
  },
  created(){
    this.getName();
  },
  mounted(){
    //console.log("mounted");
    // if(this.id){
    //   this.username = 'mmeeee';
    // }
  },
  methods:{
    getName()
    {
      console.log(this);
      if(this.id){
        this.username = 'me';
      }
    },
    onLookup(){
      this.dialogFormVisible = true;
      this.getItems();
    },
    onLookupConfirm(){
      this.dialogFormVisible = false;
      var id = this.multipleSelection[0].id;
      this.username = this.multipleSelection[0].username;
      this.$emit('select', id);
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getItems()
    },
    handleSelectionChange(val) {
       this.multipleSelection = val;
    },
    getItems(){
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
    var url = '/' + this.handler + '?page=' + self.page;
    this.$axios.get(baseurl() + url, config )
      .then(function (response) {
        if(response.status == 200){
          self.items = response.data.items;
          self.offset = Number(response.data.info.offset);
          self.page_count = Number(response.data.info.page_count);
          self.result_count = Number(response.data.info.result_count);
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
  }
}
</script>

<style scoped>
.el-table td, .el-table th{
  padding: 0px;
}
.el-pagination {
    padding: 5px 5px;
    font-weight: 600;
    color: #88898c;
}
.lookup{
  height:40px;
}
</style>
