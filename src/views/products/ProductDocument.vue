<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      :action="action"
      :headers="headers"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      multiple
      :on-exceed="handleExceed"
      :file-list="documents">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
    </el-upload>
  </div>
</template>


<script>
import {baseurl} from '../../config'

export default {
  name: 'ProductDocument',
  props: {
    product_id: {
      type: String,
      required: true
    }
  },
  computed:{
    action: {
      get: function () {
        if(!this.product_id || this.product_id == "undefined" || this.product_id == "-1"){
          //this.$message.error('Save products befor upload attachments.');
          return;
        }
        return baseurl() + '/files';
      }
    },
    headers: {
      get: function () {
        var token = JSON.parse(localStorage.getItem("jwtoken"));
        var headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
        return headers;
      }
    }
  },
  data: () => {
    return {
      documents: []
    }
  },
  mounted(){
    if(this.product_id){
      this.getProductDocuments();
    }
  },
  methods: {
    getProductDocuments(){
    var self = this;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    this.$axios.get(baseurl() + '/products/' + this.product_id + '/documents', config )
      .then(function (response) {
        if(response.status == 200){
          self.documents= response.data.product_documents;
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
    deleteProductDocument(file){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      this.$axios.delete(baseurl() + '/products/' + this.product_id + '/documents/' + file.id, config )
        .then(function (response) {
          if(response.status == 200){
              let currentMsg =  self.$message  ({
              message : 'document successfully deleted',
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
    addProductDocument(response, file){
      var self = this;
      var token = JSON.parse(localStorage.getItem("jwtoken"));
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      };
      let filet = {
          'product_id': this.product_id,
          'name': file.name,
          'title': '',
          'path': response.path,
          'size': file.size,
          'tags': '[]',
          'details': '{}',
          'status': 1,
          'description': ''
      };
      var data_request = JSON.stringify(filet);
      this.$axios.post(baseurl() + '/products/' + this.product_id +'/documents', data_request, config )
        .then(function (response) {
          if(response.status == 200){
            file.id = response.data.id;
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
          if(error.response && error.response.status == 401){
            self.$router.push('/pages/login');
          }else{
            self.$message.error('Unknown error.');
          }
      });
    },
    handleRemove(file, fileList) {
      this.deleteProductDocument(file);
    },
    handlePreview(file) {
      //console.log(JSON.stringify(file));
    },
    handleExceed(files, fileList) {
      //this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Attachment will be permanently deleted. Are you sure? ${ file.name }`);
    },
    handleBeforeUpload(file) {
      return false;
    },
    handleSuccess(response, file, fileList) {
      if(response.message == "success"){
        this.addProductDocument(response, file);
      }
    }
  }
}
</script>

<style Scope>
.el-form-item{
  margin-bottom:0px;
}
.card-body{
  padding: 0rem;
}
</style>
