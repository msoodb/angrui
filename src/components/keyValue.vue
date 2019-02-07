<template>
  <div>
    <el-table :data=dataInKeyValue border>
      <el-table-column prop="key" label="key"  width="180">
      </el-table-column>
      <el-table-column prop="value" label="value" width="100">
      </el-table-column>
      <el-table-column label="Operations" width="140" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini"
            @click="onEdit(scope.$index, scope.row)">
          </el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger"
            @click="onDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      </el-table>
      <el-button icon="el-icon-circle-plus" type="default" size="mini" @click="onAdd()">Add</el-button>
      <el-dialog :title=title :visible.sync="dialogVisible">
        <el-form ref="detailsFormDialog" :model="detailsFormDialog" :rules="rules" label-width="120px" inline-message>
          <el-form-item label="key" porp="key">
            <el-input type="key" v-model="detailsFormDialog.key" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="value" porp="value">
            <el-input type="value" v-model="detailsFormDialog.value" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onDialogConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'KeyValue',
  props: {
    value:{},
    title: {
      type: String,
      required: true
    }
  },
  computed:{
    dataInKeyValue: {
      get: function () {
        if(this.updated == true){
          this.updated = false;
        }
        const keyValue = this.value ? Object.entries(this.value) : [['id', 'Not found']];
        return keyValue.map(([key, value]) => {return {key: key, value: value}});
      }
    }
  },
  data: function () {
    return {
      updated:true,
      detailsFormDialog:{
        key:'',
        value:''
      },
      rules: {
        key: [
          { required: true, message: 'Please input key', trigger: 'blur' },
        ],
        value: [
          { required: true, message: 'Please input value', trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  methods:{
    onDelete(index, row){
      delete this.value[row.key];
      this.updated = true;
    },
    onEdit(index, row){
      this.detailsFormDialog.key = row.key;
      this.detailsFormDialog.value = this.value[row.key];
      this.dialogVisible = true;
      this.updated = true;
    },
    onAdd(){
      this.detailsFormDialog.key='';
      this.detailsFormDialog.value ='';
      this.dialogVisible = true;
      this.updated = true;
    },
    onDialogConfirm(){
      var key = this.detailsFormDialog.key;
      var value = this.detailsFormDialog.value;
      this.value[key] = value;
      this.dialogVisible = false;
      this.updated = true;
    }
  }
}
</script>

<style>
.el-table td, .el-table th{
  padding: 0px;
}
</style>
