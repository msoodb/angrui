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
        <el-form-item label="created_at">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="Pick a date" v-model="form.created_at" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line text-center" :span="2">- </el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="Pick a time" v-model="form.created_at_time" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="tags">
          <el-input type="textarea" v-model="form.tags"></el-input>
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
          created_at: '',
          created_at_time: '',
          tags: ''
      },
      fields: [
        {key: 'key'},
        {key: 'value'},
      ],
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
          self.form = response.data;
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
      var myObj = {title: "John", price: 31.2, tags:"{book}"};
      var data_request = JSON.stringify(myObj);
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
      var myObj = {title: "Johnupdate", price: 31.2, tags:"{book}"};
      var data_request = JSON.stringify(myObj);
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
    }
  }
}
</script>
<style Scope>
.el-form-item{
  margin-bottom:0px;
}
</style>
