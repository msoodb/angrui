<template>
  <b-card no-header>
    <template slot="header">
      <au-list
        handler="videos"
        :multipleSelection="multipleSelection"
        @change="itemsChanged"
        @add="onAdd"
        @edit="onEdit">
      </au-list>
    </template>
    <el-table ref="table" :data="items"  stripe style="width: 100%" border
          @selection-change="handleSelectionChange">
      <el-table-column type="selection"  width="40" align="center">
      </el-table-column>
      <el-table-column  type="index"  width="40" align="center">
      </el-table-column>
      <el-table-column prop="name" label="name" width="150">
      </el-table-column>
      <el-table-column prop="path" label="path" width="180">
      </el-table-column>
      <el-table-column prop="size" label="size" width="90">
      </el-table-column>
      <el-table-column prop="service" label="service" width="150">
      </el-table-column>
      <el-table-column prop="channel" label="channel" width="150">
      </el-table-column>
      <el-table-column prop="publisher" label="publisher" width="150">
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
      <au-video :record_id="record_id" @close="onClose"></au-video>
    </el-dialog>
  </b-card>
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'
import AUVideo from '../videos/Video'


export default {
  name: 'videos',
  data() {
     return {
       items: [],
       multipleSelection: [],
       record_id:'-1',
       dialogVisible: false
     }
  },
  components: {
    'au-list': AUList,
    'au-video': AUVideo
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
      this.record_id = "-1";
      this.dialogVisible = true;
    },
    onEdit(id){
      this.record_id = id;
      this.dialogVisible = true;
    },
    onClose(){
      this.dialogVisible = false;
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
