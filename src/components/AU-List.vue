<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="text-left">
          <el-button icon="el-icon-circle-plus" circle @click="onAdd"></el-button>
          <el-button icon="el-icon-edit" circle @click="onEdit"></el-button>
          <el-button icon="el-icon-delete" circle @click="onDelete"></el-button>
          <el-dropdown @command="handleMoreCommand" trigger="click">
            <el-button icon="el-icon-more" circle>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="{ command, label } in moreCommands"
                :command="command">
                {{label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="text-center" vertical-align="middle">
          <el-pagination id="paginator" class="text-center" layout="prev, pager, next, sizes"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="25"
                @size-change="handleSizeChange"
                :page-count="page_count" @current-change="handleCurrentChange" :current-page.sync="page">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="text-left">
          <au-filter class="filter" v-model="filter_string_64" @change="handleFilterChange"></au-filter>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {baseurl} from '../config'
import AUFilter from '../components/AU-Filter'

export default {
  name: 'AU-List',
  props: {
    handler: {
      type: String,
      required: true
    },
    multipleSelection: {
      type: Array,
      required: true
    },
    moreCommands: {
      type: Array
    }
  },
  watch: {
    $route (to, from){
      this.page = Number(this.$route.query.page);
      this.limit = Number(this.$route.query.limit);
      this.filter_string_64 = this.$route.query.filter;
      this.getItems();
    },
    handler: {
      immediate: true,
      handler(newVal, oldVal) {
        this.handler = newVal;
        if(!localStorage.getItem("jwtoken") || localStorage.getItem("jwtoken") == "undefined" || localStorage.getItem("jwtoken") == ""){
          var self = this;
          self.$router.push('/pages/login');
          return;
        }
        this.getItems();
      }
    }
  },
  data: function () {
    return {
      items: [],
      page: 1,
      limit: 25,
      page_count: 10000,
      result_count: 0,
      filter_string_64:'',
      order_string_64:''
    }
  },
  components: {
    'au-filter' : AUFilter
  },
  mounted(){
    this.page = Number(this.$route.query.page);
    this.limit = Number(this.$route.query.limit);
    this.filter_string_64 = this.$route.query.filter;
    this.getItems();
  },
  methods:{
    handleFilterChange(filter, order){
      this.filter_string_64 = filter;
      this.order_string_64 = order;
      this.page = 1;
      var url = this.createUrl();
      this.$router.push({path: url});
    },
    handleCurrentChange (val) {
      var url = this.createUrl();
      this.$router.push({path: url});
    },
    handleSizeChange(val){
      this.limit = val;
      var url = this.createUrl();
      this.$router.push({path: url});
    },
    createUrl(){
      var self = this;
      if(!self.page || self.page == "undefined" || self.page < 1){
        self.page = 1;
      }
      if(self.page > self.page_count){
        self.page = self.page_count;
      }
      var url = '/' + this.handler + '?page=' + self.page;
      if(!self.limit || self.limit == "undefined" || self.limit < 1){
        self.limit = 25;
      }
      url = url + '&limit=' + self.limit;
      if(self.filter_string_64 && self.filter_string_64 != "undefined" && self.filter_string_64 != ""){
        url = url + '&filter=' + self.filter_string_64;
      }
      if(self.order_string_64 && self.order_string_64 != "undefined" && self.order_string_64 != ""){
        url = url + '&order=' + self.order_string_64;
      }
      return url;
    },
    validateUrl(url){
      var array = url.split('/');
      for (var i = 0; i < array.length; i++) {
        if(array[i] == "-1"){
          return false;
        }
      }
      return true;
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
      var url = this.createUrl();
      if(!this.validateUrl(url)){
        self.items = [];
        self.limit = 25;
        self.page_count = 1000;
        self.result_count = 0;
        self.$emit('change', this.items);
        return;
      }
      this.$axios.get(baseurl() + url , config )
        .then(function (response) {
          if(response.status == 200){
            self.items = response.data.items;
            if(self.items == ""){
              self.items = [];
            }
            self.limit = Number(response.data.info.limit);
            self.page_count = Number(response.data.info.page_count);
            self.result_count = Number(response.data.info.result_count);
            self.$emit('change', this.items);
          }
        }.bind(this))
        .catch(function (error) {
          if(error.response && error.response.status == 401){
            self.$router.push('/pages/login');
          }
          else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
          }
          else{
            self.$message.error('Unknown error.');
          }
      });
    },
    onAdd(){
      this.$emit('add');
    },
    onEdit(){
      if(this.multipleSelection.length != 1){
        this.$message.warning('Please select one record to edit.');
        return;
      }
      var id = this.multipleSelection[0].id;
      this.$emit('edit', id);
    },
    formLink (id) {
      return this.handler + `/${id.toString()}`
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
          }else if(error.response && error.response.status == 403){
            self.$message.warning('Forbidden request.');
          }else{
            self.$message.error('Unknown error.');
          }
      });
    },
    handleMoreCommand(command) {
      this.$emit('moreCommandClick', command);
    },
  }
}
</script>

<style scoped>
.el-button{
  background-color: transparent;
  border: none;
}
.el-button:hover{
  color: black;
  background-color: #efefef;
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
.filter{
  padding-top: 5px;
}
</style>
