<template>
  <b-card no-header>
    <template slot="header">
      <au-list
        :handler="handler"
        :multipleSelection="multipleSelection"
        @change="itemsChanged"
        @add="onAdd"
        @edit="onEdit">
      </au-list>
    </template>
    <el-table ref="table" :data="items"  stripe style="width: 100%" border
          @selection-change="handleSelectionChange">
      <el-table-column  type="selection"  width="40" align="center">
      </el-table-column>
      <el-table-column  type="index"  width="40" align="center">
      </el-table-column>
      <el-table-column prop="name" label="name" width="150">
      </el-table-column>
      <el-table-column prop="title" label="title" width="240">
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
      :append-to-body="true"
      :close-on-click-modal="false"
      width="80%"
      :show-close="false"
      top="1vh">
      <au-playlist :record_id="record_id" :service_id="service_id"></au-playlist>
    </el-dialog>
  </b-card>
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'
import AUPlaylist from '../playlists/Playlist'

export default {
  name: 'Playlists',
  props: {
    service_id: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean
    }
  },
  watch: {
    service_id: {
      immediate: true,
      handler(newVal, oldVal) {
        this.service_id = newVal;
        console.log(this.service_id);
        this.handler = 'services/' + this.service_id + '/playlists';
      }
    }
  },
  // computed:{
  //   handler: {
  //     get: function () {
  //       return 'services/' + this.service_id + '/playlists';
  //     }
  //   }
  // },
  data() {
     return {
       items: [],
       multipleSelection: [],
       record_id:'-1',
       dialogVisible: false,
       handler:''
     }
  },
  components: {
    'au-list': AUList,
    'au-playlist': AUPlaylist
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
      this.record_id = "-1";
      this.dialogVisible = true;
    },
    onEdit(id){
      this.record_id = id;
      this.dialogVisible = true;
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
