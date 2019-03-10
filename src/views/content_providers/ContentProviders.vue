<template>
  <b-card no-header>
    <template slot="header">
      <au-list
        handler="content_providers"
        :multipleSelection="multipleSelection"
        @change="itemsChanged">
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
      <el-table-column prop="title" label="title" width="180">
      </el-table-column>
      <el-table-column prop="code" label="code" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="phone" width="180">
      </el-table-column>
      <el-table-column prop="email" label="email" width="180">
      </el-table-column>
      <el-table-column prop="admin" label="admin" width="150">
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
</template>

<script>
import {baseurl} from '../../config'
import AUList from '../../components/AU-List'

export default {
  name: 'ContentProviders',
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
.card-body{
  padding: 0rem;
  padding-top: 40px;
}
</style>
