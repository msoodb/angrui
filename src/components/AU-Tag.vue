<template>
  <div class="border">
    <el-tag
      :key="tag.id"
      v-for="tag in dynamicTags"
      closable
      :disable-transitions="true"
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
  watch: {
    masterId: function(newVal, oldVal) {
      console.log(newVal);
      this.masterId = newVal;
      this.getItems();
    }
  },
  data: function () {
    return {
      dynamicTags: [],
      deletedTags: [],
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
      self.dynamicTags = [];
      if(!self.masterId || self.masterId=='' || self.masterId=='-1'){
        return;
      }
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var url = '/' + self.master + '/' + self.masterId + '/' + self.relation;
      this.$axios.get(baseurl() + url , config )
        .then(function (response) {
          if(response.status == 200){
            for (var i = 0; i < response.data.items.length; i++) {
              var tag = {
                'id': response.data.items[i].id,
                'name': response.data.items[i].tag,
                'status': 'exist'
              }
              self.dynamicTags.push(tag);
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
       this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
       var deletedTag = {
         'id': tag.id,
         'name': tag.tag,
         'status': 'deleted'
       }
       this.deletedTags.push(deletedTag);
     },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
         this.$refs.saveTagInput.$refs.input.focus();
       });
     },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.dynamicTags.indexOf(inputValue) < 0) {
        var tag = {
          'id': null,
          'name': inputValue,
          'status': 'new'
        }
        this.dynamicTags.push(tag);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    saveItem()
    {
      for (var i = 0; i < this.dynamicTags.length; i++) {
        if(this.dynamicTags[i].status == 'new'){
          this.addItem(this.dynamicTags[i].name);
          this.dynamicTags[i].status = 'exist';
        }
      }
      for (var i = 0; i < this.deletedTags.length; i++) {
        if(this.deletedTags[i].id){
          this.deleteItem(this.deletedTags[i].id);
        }
      }
      this.deletedTags = [];
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
      this.$axios.post(baseurl() + url, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            setTimeout(function () {
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
