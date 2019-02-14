<template>
  <div>
    <el-button :type="filterButtonPrimary ? 'primary' : 'default'" size="medium" @click="onFilter">☘</el-button>
    <el-dialog title="Quick Filter" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Raw query" :label-width="formLabelWidth">
          <el-input v-model="form.filter_string" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onFilterConfirm">Confirm</el-button>
      </span>
    </el-dialog>
    <el-select v-model="value2" value-key="key" placeholder="Select" @change="onStatusChange">
      <el-option-group
        v-for="group in filters"
        :key="group.label"
        :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.key"
          :label="item.label"
          :value="item"
          :disabled="item.disabled">
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'AU-Filter',
  // props: {
  //   value:null
  // },
  computed:{
    // dataInKeyValue: {
    //   get: function () {
    //     if(this.updated == true){
    //       this.updated = false;
    //     }
    //     const keyValue = this.value ? Object.entries(this.value) : [['id', 'Not found']];
    //     return keyValue.map(([key, value]) => {return {key: key, value: value}});
    //   }
    // }
  },
  data: function () {
    return {
      mutedvalue:'',
      filters: [
       {
         label: 'System filters',
         options: [
           {
             key: 'enable',
             value: 'status=1',
             label: 'enable'
           },
           {
             key:'disable',
             value: 'status=0',
             label: 'disable'
           },
           {
             key:'all',
             value: '',
             label: 'all'
           }]
       },
       {
         label: 'Custom filters',
         options: [
           {
             key:'Adhoc',
             value: 'nothing',
             label: 'Ad hoc',
             disabled: true
           }]
       }],
       value2 : null,
       dialogFormVisible: false,
       form: {
         filter_string: ''
       },
       formLabelWidth: '120px',
       filterButtonPrimary: false
    }
  },
  created() {
    this.value2 = this.filters[0].options['2'];
    // console.log(this.value);
    var simple_filter = atob(this.value);
    //console.log(simple_filter);
    //this.filters[1].options[0]['value'] = simple_filter;
    // this.value2 = this.filters[1].options[0];
    // this.mutedvalue = this.value;
  },
  methods:{
    onStatusChange(selected){
      this.value2 = selected;
      var simple_filter = this.value2['value'];
      this.mutedvalue = btoa(simple_filter);
      this.filterButtonPrimary = false;
      this.$emit('change', this.mutedvalue);
    },
    onFilter(){
      this.form.filter_string = "id < 20 and id > 8";
      this.dialogFormVisible = true;
    },
    onFilterConfirm(){
      this.dialogFormVisible = false;
      var simple_filter = this.form.filter_string;
      this.filters[1].options[0]['value'] = simple_filter;
      this.value2 = this.filters[1].options[0];
      this.mutedvalue = btoa(simple_filter);
      this.filterButtonPrimary = true;
      this.$emit('change', this.mutedvalue);
    }
  }
}
</script>

<style scoped>
.el-table td, .el-table th{
  padding: 0px;
}
.el-button{
  background-color: transparent;
  border: none;
}
</style>
