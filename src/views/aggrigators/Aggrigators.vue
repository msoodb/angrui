<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
        <template slot="header">
          <au-listheader handler="aggrigators" @change="itemschanged"></au-listheader>
        </template>
        <el-table ref="table" :data="items"  stripe style="width: 100%" border>
          <el-table-column  type="selection"  width="45">
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
import AUListHeader from '../../components/AU-ListHeader'


export default {
  name: 'Aggrigators',
  data() {
     return {
       items: [],
       multipleSelection: []
     }
  },
  components: {
    'au-listheader': AUListHeader
  },
  methods: {    
    itemschanged(items){
      this.items = items;
    },
    formatDateOnly(row, column, cellValue){
      var date = cellValue.split(' ');
      return date[0];
    }
  }
}
</script>

<style scoped>
.card-body >>> table > tbody > tr > td {
  cursor: pointer;
  padding: 0px;
}
.card-body >>> table > tbody > tr > th {
  padding: 0px;
}
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
.el-button{
  background-color: transparent;
  border: none;
}
.el-button:hover{
  color: black;
  background-color: #f5f5f5;
  border: none;
}
.el-dropdown {
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-pagination {
    padding: 5px 5px;
    font-weight: 600;
    color: #88898c;
}

</style>
