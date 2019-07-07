<template>
  <b-card no-header>
    <template slot="header">
      <au-list
        ref="list"
        handler="playlists"
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
      <el-table-column prop="name" label="name" width="150">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="onEdit(scope.row.id)"
            type="text"
            size="small">
            {{scope.row.name}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="title" width="240">
      </el-table-column>
      <el-table-column prop="service" label="service" width="150">
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
      <au-playlist ref="form" id="form" :record_id="record_id" @close="onClose"></au-playlist>
    </el-dialog>
  </b-card>
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'
import AUPlaylist from '../playlists/Playlist'

export default {
  name: 'Playlists',
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
