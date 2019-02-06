<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
        <template slot="header">
          <el-row >
            <el-col :span="6">
              <div class="text-left">
                <el-button type="primary" icon="el-icon-circle-plus" circle size="medium" @click="onAdd"></el-button>
                <el-button icon="el-icon-edit" circle size="medium" @click="onEdit"></el-button>
                <el-button icon="el-icon-delete" circle size="medium" @click="onDelete" ></el-button>
                <el-button icon="el-icon-picture" circle size="medium" @click="onChart"></el-button>
                <el-button icon="el-icon-search" circle size="medium"></el-button>
                <el-button icon="el-icon-more" circle size="medium"></el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="text-center">
                <el-pagination id="aggrigators_paginator" class="text-center" background layout="prev, pager, next"
                      :page-count="page_count" @current-change="handleCurrentChange" :current-page.sync="page">
                </el-pagination>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="text-right">
                <el-button icon="el-icon-question" circle size="medium"></el-button>
                <el-button icon="el-icon-setting" circle size="medium"></el-button>
              </div>
            </el-col>
          </el-row>
        </template>
        <el-table ref="aggrigatorsTable" :data="items"  stripe style="width: 100%" border
              @selection-change="handleSelectionChange" >
          <el-table-column  type="selection"  width="45">
          </el-table-column>
          <el-table-column  prop="id"  label="id"  width="80">
          </el-table-column>
          <el-table-column prop="name" label="name" width="120">
          </el-table-column>
          <el-table-column prop="title" label="title" width="180">
          </el-table-column>
          <el-table-column prop="phone" label="phone" width="180">
          </el-table-column>
          <el-table-column prop="email" label="email" width="180">
          </el-table-column>
          <el-table-column prop="created_at" label="created_at" width="120" :formatter="formatDateOnly">
          </el-table-column>
          <el-table-column prop="updated_at" label="updated_at" width="120" :formatter="formatDateOnly">
          </el-table-column>
        </el-table>
      </b-card>
    </b-col>
  </b-row>
</template>



<script>
import {baseurl} from '../../config'
export default {
  name: 'Aggrigators',
  data() {
     return {
       items: [],
       page: 1,
       offset: 20,
       page_count: 10000,
       result_count: 0,
       multipleSelection: []
     }
  },
  mounted(){
    this.page = Number(this.$route.query.page);
    this.getAggrigators();
  },
  watch:{
    $route (to, from){
      this.page = Number(this.$route.query.page);
      this.getAggrigators();
    }
  },
  computed: {
  },
  methods: {
    getAggrigators(){
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
    this.$axios.get(baseurl() + '/aggrigators?page=' + self.page, config )
      .then(function (response) {
        if(response.status == 200){
          self.$router.push({path: 'aggrigators?page=' + self.page});
          self.items = response.data.aggrigators;
          self.offset = Number(response.data.info.offset);
          self.page_count = Number(response.data.info.page_count);
          self.result_count = Number(response.data.info.result_count);
          if(self.page > self.page_count){
            self.page = self.page_count;
            self.getAggrigators();
          }
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
    handleCurrentChange (val) {
      this.page = val;
      this.getAggrigators();
    },
    aggrigatorLink (id) {
      return `aggrigators/${id.toString()}`
    },
    rowClicked (item) {
      const aggrigatorLink = this.aggrigatorLink(item.id)
      this.$router.push({path: aggrigatorLink})
    },
    handleSelectionChange(val) {
       this.multipleSelection = val;
    },
    onChart(){
      this.$router.push('/charts/aggrigator');
    },
    onAdd(){
      var id = -1;
      const aggrigatorLink = this.aggrigatorLink(id);
      this.$router.push({path: aggrigatorLink})
    },
    onEdit(){
      if(this.multipleSelection.length != 1){
        this.$message.warning('Please select one record to edit.');
        return;
      }
      var id = this.multipleSelection[0].id;
      const aggrigatorLink = this.aggrigatorLink(id);
      this.$router.push({path: aggrigatorLink})
    },
    onDelete(){
      if(this.multipleSelection.length == 0){
        this.$message.warning('There is no selected record(s) to delete.');
        return;
      }
      this.$confirm('Selected aggrigator(s) will be permanently deleted. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
      }).then(() => {
        for(var i=0; i<this.multipleSelection.length; i++){
          var id = this.multipleSelection[i].id;
          this.deleteRecord(id);
        }
        this.getAggrigators();
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
      this.$axios.delete(baseurl() + '/aggrigators/' + id, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Aggrigator successfully deleted',
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
    formatDateOnly(row, column, cellValue){
      var date = cellValue.split(' ');
      return date[0];
    },
    handleExpirableCheckbox(scope){
      var value = scope.row.expirable == 't' ? true : false;
      console.log(scope.row.id + " " + scope.row.expirable);
      return value;
    }
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
  padding: 0.25rem 1.25rem;
}
</style>
