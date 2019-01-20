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
                <el-form-item label="active">
                  <el-switch v-model="productForm.active"></el-switch>
                </el-form-item>
              </el-col>
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
            </el-row>
          </el-form-item>
          <el-form-item label="created_at">
            <el-date-picker
              v-model="productForm.created_at"
              type="date"
              placeholder="Pick a day">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="updated_at">
            <el-date-picker
              v-model="productForm.updated_at"
              type="date"
              placeholder="Pick a day">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="description">
            <el-input type="textarea" v-model="productForm.description"></el-input>
          </el-form-item>
          <el-form-item label="tags" v-model="productForm.tags">
            <el-tag
              :key="tag"
              v-for="tag in productForm.tags"
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
        </el-tab-pane>
        <el-tab-pane label="Details">
          <el-form ref="productFormDetails" :model="productFormDetails" label-width="120px">
            <el-form-item label="details">
              <el-table :data="detailsKeyValue"  style="width: 100%" border>
                <el-table-column prop="key" label="key"  width="180">
                </el-table-column>
                <el-table-column prop="value" label="value" width="100">
                </el-table-column>
                <el-table-column label="Operations" width="180">
                  <template slot-scope="scope">
                    <el-button icon="el-icon-edit"
                      size="mini"
                      @click="handleEditDetails(scope.$index, scope.row)"></el-button>
                    <el-button icon="el-icon-delete"
                      size="mini"
                      type="danger"
                      @click="handleDeleteDetails(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Orders">Role</el-tab-pane>
      </el-tabs>
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
      productForm: {
        name: '',
        title: '',
        code: '',
        price: '',
        details: [],
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
          { required: true, message: 'Please input name', trigger: 'blur' },
          { min: 3, max: 255, message: 'Length should be 3 to 255', trigger: 'blur' }
        ],
        title: [
          { required: true, message: 'Please input title', trigger: 'change' }
        ],
        code: [
          { required: true, message: 'Please input code', trigger: 'change' }
        ],
        price: [
          { type: 'number', required: true, message: 'Please input price', trigger: 'change' }
        ]
      },
      detailsKeyValue: [],
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
          self.productForm.name = response.data.name;
          self.productForm.title = response.data.title;
          self.productForm.code = response.data.code;
          self.productForm.price = Number(response.data.price);
          if(response.data.details){
            self.productForm.details = JSON.parse(response.data.details);
            var det = self.productForm.details;
            const productDetails = det ? Object.entries(det) : [['id', 'Not found']]
            this.detailsKeyValue = productDetails.map(([key, value]) => {return {key: key, value: value}})
          }
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
        self.$message.error(error);
      });
    },
    getdetailsKeyValue(){
      //var details = JSON.parse("{\"id\":10, \"name\":\"minus\"}");
      console.log(this.productForm.details);
      var details = JSON.parse(this.productForm.details);
      const productDetails = details ? Object.entries(details) : [['id', 'Not found']]
      this.detailsKeyValue = productDetails.map(([key, value]) => {return {key: key, value: value}})
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
      if(this.productForm.tags){
        this.productForm.tags = JSON.stringify(this.productForm.tags);
      }
      if(this.productForm.details){
        this.productForm.details = JSON.stringify(this.productForm.details);
      }
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
          self.$message.error(error);
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
    },
    handleClose(tag) {
       this.productForm.tags.splice(this.productForm.tags.indexOf(tag), 1);
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
         this.productForm.tags.push(inputValue);
       }
       this.inputVisible = false;
       this.inputValue = '';
     },
     handleDeleteDetails(index, row){
       var key = row.key;
       delete this.productForm.details[key];
       if(this.productForm.details){
         var det = this.productForm.details;
         const productDetails = det ? Object.entries(det) : [['id', 'Not found']]
         this.detailsKeyValue = productDetails.map(([key, value]) => {return {key: key, value: value}})
       }
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
