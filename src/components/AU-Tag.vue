<template>
  <div class="border">
    <el-tag
      :key="tag.id"
      v-for="tag in items"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag.name}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
import {baseurl} from '../config'

export default {
  name: 'AU-Tag',
  props: {
    master: {
      type: String,
      required: true
    },
    masterField: {
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
    }
  },
  // watch: {
  //     data: function(newVal, oldVal) {
  //       if(this.data && this.data!="[]" && this.data!="{}"){
  //         this.items =JSON.parse(this.data);
  //       }
  //     }
  // },
  data: function () {
    return {
      items: [],
      tag:{
        id:'',
        tag:''
      },
      inputVisible: false,
      inputValue: ''
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
      var url = '/' + this.master + '/' + this.masterId + '/' + this.relation;
      this.$axios.get(baseurl() + url , config )
        .then(function (response) {
          if(response.status == 200){
            for (var i = 0; i < response.data.items.length; i++) {
              var tag = {
                'id': response.data.items[i].id,
                'name': response.data.items[i].tag
              }
              self.items.push(tag);
            }
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
    handleClose(tag) {
       this.deleteItem(tag.id);
     },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
         this.$refs.saveTagInput.$refs.input.focus();
       });
     },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.items.indexOf(inputValue) < 0) {
        this.addItem(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    addItem(tag){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var relationsData = {
        [this.masterField] : this.masterId,
        'tag' : tag,
        'status' : 1,
        'situation' : 0,
        'description': ''
      }
      var data_request = JSON.stringify(relationsData);
      var url = '/' + this.master + '/' + this.masterId + '/' + this.relation;
      console.log(url);
      this.$axios.post(baseurl() + url, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            setTimeout(function () {
              self.items.length = 0;
              self.getItems();
            }, 1);
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
    deleteItem(id){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var url = '/' + this.master + '/' + this.masterId + '/' + this.relation + '/' + id;
      this.$axios.delete(baseurl() + url, config )
        .then(function (response) {
          if(response.status == 200){
            setTimeout(function () {
              self.items.length = 0;
              self.getItems();
            }, 1);
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
.el-tag{
  margin-right: 10px;
}
.el-tag + .el-tag {
    margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}
.border{
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 120px;
  padding-left: 5px;
}
</style>
