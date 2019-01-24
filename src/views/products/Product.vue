<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
      <template slot="header">
        <el-row>
          <el-button icon="el-icon-circle-check" type="success" circle size="small" @click="onCheck"></el-button>
          <el-button icon="el-icon-circle-close" type="warning" circle size="small" @click="onClose"></el-button>
        </el-row>
      </template>
      <el-tabs type="border-card">
        <el-tab-pane label="General">
        <el-form ref="productForm" :model="productForm" :rules="rules" label-width="120px" inline-message>
          <el-row>
            <el-col :span="12">
              <el-form-item label="id" prop="id">
                <el-input v-model="productForm.id" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="name" prop="name">
                <el-input type="name" v-model="productForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="title" prop="title">
                <el-input v-model="productForm.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="code" prop="code">
                <el-input v-model="productForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="price" prop="price">
                <el-input type="price" v-model.number="productForm.price"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-row>
              <el-col :span="6">
                <el-form-item label="expirable">
                  <el-checkbox v-model="productForm.expirable"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="taxable">
                  <el-checkbox v-model="productForm.taxable"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="active">
                  <el-switch v-model="productForm.active"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="created_at">
            <el-date-picker v-model="productForm.created_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="updated_at">
            <el-date-picker v-model="productForm.updated_at" type="date" placeholder="Pick a day" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="description">
            <el-input type="textarea" v-model="productForm.description"></el-input>
          </el-form-item>
          <el-form-item label="tags">
            <Tag title="product tags" v-model="productForm.tags"></Tag>
          </el-form-item>
          <el-form-item label="details">
            <keyValue title="product details" v-model="productForm.details"></keyValue>
          </el-form-item>
        </el-form>
        </el-tab-pane>
      </el-tabs>
      </b-card>
    </b-col>
  </b-row>
  </template>


<script>
import {baseurl} from '../../config'
import keyValue from '../../components/keyValue'
import Tag from '../../components/Tag'

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
      productForm: {
        id: '',
        name: '',
        title: '',
        code: '',
        price: '',
        details: {},
        expirable: true,
        taxable: true,
        active: true,
        description: '',
        created_at: '',
        updated_at: '',
        tags: []
      },
      rules: {
        name: [
          { required: true, message: 'Please input name', trigger: 'change' },
          { min: 3, max: 255, message: 'Length should be 3 to 255', trigger: 'change' }
        ],
        title: [
          { required: true, message: 'Please input title', trigger: 'change' }
        ],
        code: [
          { required: true, message: 'Please input code', trigger: 'change' }
        ],
        price: [
          { required: true, message: 'Please input price', trigger: 'change' },
          { type: 'number', message: 'Price must be a number', trigger: 'change' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  components: {
    keyValue,
    Tag
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
          self.productForm.id = response.data.id;
          self.productForm.name = response.data.name;
          self.productForm.title = response.data.title;
          self.productForm.code = response.data.code;
          self.productForm.price = Number(response.data.price);
          self.productForm.details = JSON.parse(response.data.details);
          if(response.data.expirable == 't'){
            self.productForm.expirable = true;
          }
          else{
            self.productForm.expirable = false;
          }
          if(response.data.taxable == 't'){
            self.productForm.taxable = true;
          }
          else{
            self.productForm.taxable = false;
          }
          if(response.data.active == 't'){
            self.productForm.active = true;
          }
          else{
            self.productForm.active = false;
          }
          self.productForm.description = response.data.description;
          self.productForm.created_at = response.data.created_at;
          self.productForm.updated_at = response.data.updated_at;
          if(response.data.tags){
            self.productForm.tags = JSON.parse(response.data.tags);
          }
        }
      }.bind(this))
      .catch(function (error) {
        if(error.response.status == 401){
          self.$router.push('/pages/login');
        }else{
          self.$message.error('Unknown error.');
        }
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
      this.productForm.tags = JSON.stringify(this.productForm.tags);
      this.productForm.details = JSON.stringify(this.productForm.details);
      var data_request = JSON.stringify(this.productForm);
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
          if(error.response.status == 401){
            self.$router.push('/pages/login');
          }else{
            self.$message.error('Unknown error.');
          }
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
      if(this.productForm.tags){
        this.productForm.tags = JSON.stringify(this.productForm.tags);
      }
      this.productForm.details = JSON.stringify(this.productForm.details);
      var data_request = JSON.stringify(this.productForm);
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
          if(error.response.status == 401){
            self.$router.push('/pages/login');
          }else{
            self.$message.error('Unknown error.');
          }
      });
      this.onClose();
    },
    onCheck() {
      this.$refs["productForm"].validate((valid) => {
        if (valid) {
          if(this.$route.params.id == -1){
            this.addProduct();
          }
          else{
            this.updateProduct();
          }
        }
        else{
          this.$message.error('Please fill in the required fields.');
        }
      });
    },
    onClose() {
      this.$router.go(-1)
    }
  }
}
</script>
<style Scope>
.el-form-item{
  margin-bottom:0px;
}
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
.card-body{
  padding: 0rem;
}
.el-table td, .el-table th{
  padding: 0px;
}
</style>
