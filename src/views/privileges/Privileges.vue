<template>
  <b-card no-header>
    <template slot="header">
      <au-list
        ref="list"
        handler="privileges"
        :multipleSelection="multipleSelection"
        @change="itemsChanged"
        @add="onAdd"
        @edit="onEdit">
      </au-list>
    </template>
    <el-table v-loading="loading" ref="table" :data="items"  stripe style="width: 100%" border
          @selection-change="handleSelectionChange">
      <el-table-column  type="selection"  width="40" align="center">
      </el-table-column>
      <el-table-column  type="index"  width="40" align="center">
      </el-table-column>
      <el-table-column prop="security_role" label="security role" width="180">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="onEdit(scope.row.id)"
            type="text"
            size="small">
            {{scope.row.security_role}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="entity" label="entity" width="180">
      </el-table-column>
      <el-table-column prop="privilege_string" label="privilege string" width="220">
      </el-table-column>
      <el-table-column prop="created_at" label="created_at" width="120" :formatter="formatDateOnly">
      </el-table-column>
      <el-table-column prop="updated_at" label="updated_at" width="120" :formatter="formatDateOnly">
      </el-table-column>
      <el-table-column prop="status" label="status" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.status == 0 ? 'disable' : 'enable' }}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog ref="dialog" id="dialog"
      :visible.sync="dialogVisible"
      :modalAppendToBody="false"
      :close-on-click-modal="false"
      width="80%"
      :show-close="false"
      top="1vh">
      <au-privilege ref="form" id="form" :record_id="record_id" @close="onClose"></au-privilege>
    </el-dialog>
  </b-card>
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'
import AUPrivilege from '../privileges/Privilege'


export default {
  name: 'Privileges',
  data() {
     return {
       items: [],
       multipleSelection: [],
       record_id:'-1',
       dialogVisible: false,
       loading: true
     }
  },
  components: {
    'au-list': AUList,
    'au-privilege': AUPrivilege
  },
  methods: {
    itemsChanged(items){
      this.items = items;
    },
    handleSelectionChange(val) {
       this.multipleSelection = val;
    },
    formatDateOnly(row, column, cellValue){
      var date = cellValue.split(' ');
      return date[0];
    },
    onAdd(){
      var self = this;
      self.record_id = "-1";
      self.dialogVisible = true;
      setTimeout(function(){
        self.$refs["form"].getItem();
      },10)
    },
    onEdit(id){
      var self = this;
      self.record_id = id;
      self.dialogVisible = true;
      setTimeout(function(){
        self.$refs["form"].getItem();
      },10)
    },
    onClose(){
      this.dialogVisible = false;
      this.$refs.list.getItems();
    }
  }
}
</script>

<style scoped>
.card-body{
  padding: 0rem;
  padding-top: 40px;
}
</style>
