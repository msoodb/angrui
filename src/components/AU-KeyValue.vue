<template>
  <div class="mbuttom">
    <el-table :data=itemsKeyValue  :show-header=false fit size="medium">
      <el-table-column type="index"  width="40" align="center">
      </el-table-column>
      <el-table-column prop="key" label="key"  width="180">
      </el-table-column>
      <el-table-column prop="value" label="value" width="100">
      </el-table-column>
      <el-table-column label="Operations" width="140" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini"
            @click="onEdit(scope.$index, scope.row)">
          </el-button>
          <el-button icon="el-icon-delete" size="mini"
            @click="onDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      </el-table>
      <el-button icon="el-icon-circle-plus" size="mini" @click="onAdd()">Add</el-button>
      <el-dialog ref="detailsDialog" :title=title :visible.sync="dialogVisible">
        <el-form ref="detailsFormDialog" :model="detailsFormDialog" :rules="rules" label-width="70px" inline-message>
          <el-form-item label="key" prop="key">
            <el-input type="key" v-model="detailsFormDialog.key"></el-input>
          </el-form-item>
          <el-form-item label="value" prop="value">
            <el-input type="value" v-model="detailsFormDialog.value"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button @click="onDialogConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AU-KeyValue',
  props: {
    data:{
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  watch: {
      data: function(newVal, oldVal) {
        if(this.data && this.data!="[]" && this.data!="{}"){
          this.items =JSON.parse(this.data);
          this.getItems();
        }
      }
  },
  data: function () {
    return {
      items:{},
      itemsKeyValue:[],
      detailsFormDialog:{
        key:null,
        value:null
      },
      rules: {
        key: [
          { required: true, message: 'Please input key', trigger: 'change' }
        ],
        value: [
          { required: true, message: 'Please input value', trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  methods:{
    getItems(){
      const keyValue = this.items ? Object.entries(this.items) : [['id', 'Not found']];
      this.itemsKeyValue = keyValue.map(([key, value]) => {return {key: key, value: value}});
    },
    onDelete(index, row){
      delete this.items[row.key];
      this.getItems();
      var details = JSON.stringify(this.items);
      this.$emit('change', details);
    },
    onEdit(index, row){
      this.detailsFormDialog.key = row.key;
      this.detailsFormDialog.value = this.items[row.key];
      this.dialogVisible = true;
    },
    onAdd(){
      this.detailsFormDialog.key='';
      this.detailsFormDialog.value ='';
      this.dialogVisible = true;
    },
    onDialogConfirm(){
      var self = this;
      self.$refs['detailsFormDialog'].validate((valid) => {
        if (valid) {
          var key = self.detailsFormDialog.key;
          var value = self.detailsFormDialog.value;
          self.items[key] = value;
          self.dialogVisible = false;
          this.getItems();
          var details = JSON.stringify(this.items);
          this.$emit('change', details);
        }
        else{
          self.$message.error('Please fill in the required fields.');
        }
      });
    }
  }
}
</script>

<style scoped>
.el-table td, .el-table th{
  padding: 0px;
}
.mbuttom{
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.el-button{
  background-color: transparent;
  border: none;
}
.el-button:hover{
  color: black;
  background-color: #efefef;
  border: none;
}
</style>
