<template>
  <b-row>
    <b-col cols="12" lg="6">
      <b-card no-header>
      <template slot="header">
        <el-row>
          <el-button icon="el-icon-circle-check" type="success" circle size="small" @click="onCheck"></el-button>
          <el-button icon="el-icon-circle-close" type="warning" circle size="small" @click="onClose"></el-button>
        </el-row>
      </template>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="tags" v-model="form.tags">
          <el-tag
            :key="tag"
            v-for="tag in form.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
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
        </el-form-item>
      </el-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {baseurl} from '../../config'
export default {
  name: 'Product',
  props: {
    caption: {
      type: String,
      default: 'Product id'
    },
  },
  data: () => {
    return {
      form: {
          title: '',
          price: '',
          tags: []
      },
      fields: [
        {key: 'key'},
        {key: 'value'},
      ],
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
  },
  mounted(){
    if(this.$route.params.id != -1){
      this.getProduct();
    }
  },
  methods: {
    getProduct(){
    var self = this;
    var id = self.$route.params.id;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    this.$axios.get(baseurl() + '/products/' + id, config )
      .then(function (response) {
        if(response.status == 200){
          self.form.title = response.data.title;
          self.form.price = response.data.price;
          self.form.tags = JSON.parse(response.data.tags);
        }
      }.bind(this))
      .catch(function (error) {
        self.$message.error(error);
      });
    },
    addProduct(){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.form.tags = JSON.stringify(this.form.tags);
      var data_request = JSON.stringify(this.form);
      this.$axios.post(baseurl() + '/products', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Product added successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
              currentMsg.close();
            }, 1000);
          }
        }.bind(this))
        .catch(function (error) {
          self.$message.error(error);
      });
      this.onClose();
    },
    updateProduct(){
      var self = this;
      var id = self.$route.params.id;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.form.tags = JSON.stringify(this.form.tags);
      var data_request = JSON.stringify(this.form);
      this.$axios.put(baseurl() + '/products/' + id, data_request, config )
        .then(function (response) {
          if(response.status == 200){
            let currentMsg =  self.$message  ({
              message : 'Product updated successfully',
              duration:0,
              type:'success'
            })
            setTimeout(function () {
              currentMsg.close();
            }, 1000);
          }
        }.bind(this))
        .catch(function (error) {
          self.$message.error(error);
      });
      this.onClose();
    },
    onCheck() {
      if(this.$route.params.id == -1){
        this.addProduct();
      }else{
        this.updateProduct();
      }
    },
    onClose() {
      this.$router.go(-1)
    },
    handleClose(tag) {
       this.form.tags.splice(this.form.tags.indexOf(tag), 1);
     },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
         this.$refs.saveTagInput.$refs.input.focus();
       });
     },
     handleInputConfirm() {
       let inputValue = this.inputValue;
       if (inputValue) {
         this.form.tags.push(inputValue);
       }
       this.inputVisible = false;
       this.inputValue = '';
     }
  }
}
</script>
<style Scope>
.el-form-item{
  margin-bottom:0px;
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
</style>
