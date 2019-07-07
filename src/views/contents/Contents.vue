<template>
  <b-card no-header>
    <template slot="header">
      <au-list
        ref="list"
        handler="contents"
        :multipleSelection="multipleSelection"
        @change="itemsChanged"
        @add="onAdd"
        @edit="onEdit">
      </au-list>
    </template>
    <el-table v-loading="loading" ref="table" :data="items"  stripe style="width: 100%" border
          @selection-change="handleSelectionChange">
      <el-table-column type="selection"  width="40" align="center">
      </el-table-column>
      <el-table-column  type="index"  width="40" align="center">
      </el-table-column>
      <el-table-column prop="service" label="service" width="150">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="onEdit(scope.row.id)"
            type="text"
            size="small">
            {{scope.row.service}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="channel" width="150">
      </el-table-column>
      <el-table-column prop="publisher" label="publisher" width="180">
      </el-table-column>
      <el-table-column prop="type" label="type" width="300" align="center" :formatter="formatType">
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
      <au-content ref="form" id="form" :record_id="record_id" @close="onClose"></au-content>
    </el-dialog>
  </b-card>
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'
import AUContent from '../contents/Content'


export default {
  name: 'Contents',
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
    'au-content': AUContent
  },
  methods: {
    formatType(row, column, cellValue){
      var type = cellValue;
      switch (type) {
        case '0':
          return 'video';
          break;
        default:
          return 'unknown';
      }
      return date[0];
    },
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
