<template>
  <div>
    <el-row >
      <el-col :span="6">
        <div class="text-left">
          <el-button icon="el-icon-circle-plus" circle @click="onAdd"></el-button>
          <el-button icon="el-icon-edit" circle @click="onEdit"></el-button>
          <el-button icon="el-icon-delete" circle @click="onDelete"></el-button>
          <el-button icon="el-icon-search" circle></el-button>
          <el-button icon="el-icon-more" circle></el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="text-center" vertical-align="middle">
          <el-pagination id="paginator" class="text-center" layout="prev, pager, next"
                :page-count="page_count" @current-change="handleCurrentChange" :current-page.sync="page">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="text-left">
          <au-filter v-model="filter_string_64" @change="handleFilterChange"></au-filter>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {baseurl} from '../config'
import AUFilter from '../components/AU-Filter'

export default {
  name: 'AU-ListHeader',
  props: {
    handler:''
  },
  computed:{
  },
  data: function () {
    return {
      items: [],
      page: 1,
      offset: 20,
      page_count: 10000,
      result_count: 0,
      filter_string_64:'',
      multipleSelection: []
    }
  },
  components: {
    'au-filter' : AUFilter
  },
  mounted(){
    this.page = Number(this.$route.query.page);
    this.filter_string_64 = this.$route.query.filter;
    this.getItems();
  },
  watch:{
    $route (to, from){
      this.page = Number(this.$route.query.page);
      this.filter_string_64 = this.$route.query.filter;
      this.getItems();
    }
  },
  methods:{
    handleFilterChange(value){
      this.filter_string_64 = value;
      this.page = 1;
      this.getItems();
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getItems();
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
      if(self.filter_string_64 && self.filter_string_64 != "undefined" && self.filter_string_64 != ""){
        url = url + '&filter=' + self.filter_string_64;
      }
      this.$axios.get(baseurl() + url , config )
        .then(function (response) {
          if(response.status == 200){
            self.$router.push({path: url});
            self.items = response.data.items;
            self.offset = Number(response.data.info.offset);
            self.page_count = Number(response.data.info.page_count);
            self.result_count = Number(response.data.info.result_count);
            if(self.page > self.page_count){
              self.page = self.page_count;
              self.getItems();
            }
            this.$emit('change', this.items);
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
    onAdd(){
      var id = -1;
      const form_link = this.formLink(id);
      this.$router.push({path: form_link})
    },
    onEdit(){
      console.log(this.$route);
      if(this.multipleSelection.length != 1){
        this.$message.warning('Please select one record to edit.');
        return;
      }
      var id = this.multipleSelection[0].id;
      const form_link = this.formLink(id);
      this.$router.push({path: form_link})
    },
    onDelete(){
      if(this.multipleSelection.length == 0){
        this.$message.warning('There is no selected record(s) to delete.');
        return;
      }
      this.$confirm('Selected record(s) will be permanently deleted. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
      }).then(() => {
        for(var i=0; i<this.multipleSelection.length; i++){
          var id = this.multipleSelection[i].id;
          this.deleteRecord(id);
        }
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
          }else{
            self.$message.error('Unknown error.');
          }
      });
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
  padding-top: 40px;
}
.card-header{
  padding: 0rem;
  border: 0rem;
  background-color: white;
  position: fixed;
  z-index: 20;
  width: -moz-available;
  border-bottom: 1px solid #c8ced3;
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
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-pagination {
    padding: 5px 5px;
    font-weight: 600;
    color: #88898c;
}
</style>
