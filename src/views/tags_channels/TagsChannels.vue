<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
        <template slot="header">
          <au-list
            ref="list"
            handler="tags_channels"
            :multipleSelection="multipleSelection"
            @change="itemsChanged">
          </au-list>
        </template>
        <el-table v-loading="loading" ref="table" :data="items"  stripe style="width: 100%" border
              @selection-change="handleSelectionChange">
          <el-table-column  type="selection"  width="40" align="center">
          </el-table-column>
          <el-table-column  type="index"  width="40" align="center">
          </el-table-column>
          <el-table-column prop="tag" label="tag" width="180">
          </el-table-column>
          <el-table-column prop="channel" label="channel" width="180">
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
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'


export default {
  name: 'TagsChannels',
  data() {
     return {
       items: [],
       multipleSelection: []
     }
  },
  components: {
    'au-list': AUList
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
    }
  }
}
</script>

<style scoped>
.card{
  margin-bottom: 0rem;
}
.card-body{
  padding: 0rem;
  padding-top: 40px;
}
.card-header{
  padding: 0rem;
  border: 0rem;
  background-color: white;
  position: fixed;
  z-index: 20;
  width: -moz-available;
  border-bottom: 1px solid #c8ced3;
}
.card-body >>> table > tbody > tr > td {
  cursor: pointer;
  padding: 0px;
}
.card-body >>> table > tbody > tr > th {
  padding: 0px;
}
</style>
