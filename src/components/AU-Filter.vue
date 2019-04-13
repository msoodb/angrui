<template>
  <div>
    <el-button class="filter-button" :type="filterButtonPrimary ? 'primary' : 'default'" icon="el-icon-search" size="mini" @click="onFilter"></el-button>
    <el-dialog title="Quick Filter" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form :model="form">
        <el-form-item label="filter" :label-width="formLabelWidth">
          <el-input v-model="form.filter_string" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="order" :label-width="formLabelWidth">
          <el-input v-model="form.order_string" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onFilterConfirm">Confirm</el-button>
      </span>
    </el-dialog>
    <el-select v-model="filter" value-key="key" placeholder="Select" size="mini" @change="onStatusChange">
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
  props: {
    value:null
  },
  data: function () {
    return {
      filter_string64:'',
      order_string64:'',
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
       filter : null,
       dialogFormVisible: false,
       form: {
         filter_string: '',
         order_string: ''
       },
       formLabelWidth: '140px',
       filterButtonPrimary: false
    }
  },
  created() {
    if(this.vale){
      var simple_filter = atob(this.value);
      this.filters[1].options[0]['value'] = simple_filter;
    }
  },
  methods:{
    onStatusChange(selected){
      this.filter = selected;
      var simple_filter = this.filter['value'];
      this.filter_string64 = btoa(simple_filter);
      this.filterButtonPrimary = false;
      this.$emit('change', this.filter_string64);
    },
    onFilter(){
      this.form.filter_string = "status=1";
      this.dialogFormVisible = true;
    },
    onFilterConfirm(){
      this.dialogFormVisible = false;
      var simple_filter = this.form.filter_string;
      this.filters[1].options[0]['value'] = simple_filter;
      this.filter = this.filters[1].options[0];
      this.mutedvalue = btoa(simple_filter);
      this.filterButtonPrimary = true;

      var simple_order = this.form.order_string;
      this.order_string64 = btoa(simple_order);
      this.filterButtonPrimary = true;



      this.$emit('change', this.mutedvalue, this.order_string64);
    }
  }
}
</script>
