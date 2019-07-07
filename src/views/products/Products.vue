<template>
  <b-row>
    <b-col cols="12" lg="12">
      <b-card no-header>
        <template slot="header">
          <au-list
            handler="products"
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
          <el-table-column prop="attachments" label="" width="35" align="center">
            <template slot-scope="scope">
              {{scope.row.attachments == 0 ? '&nbsp' : '&#x1f4ce' }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="name" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="onEdit(scope.row.id)"
                type="text"
                size="small">
                {{scope.row.name}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="title" width="180">
          </el-table-column>
          <el-table-column prop="code" label="code" width="120">
          </el-table-column>
          <el-table-column prop="price" label="price" width="120">
          </el-table-column>
          <el-table-column  prop="expirable" label="expirable" width="90" align="center">
            <template slot-scope="scope">
              <el-tag type="info" size="mini" disable-transitions>{{scope.row.expirable === 't' ? '✔' : "&nbsp&nbsp&nbsp" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column  prop="taxable" label="taxable" width="90" align="center">
            <template slot-scope="scope">
              <el-tag type="info" size="mini" disable-transitions>{{scope.row.taxable === 't' ? '✔' : "&nbsp&nbsp&nbsp" }}</el-tag>
            </template>
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
  name: 'Products',
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
    },
    handleExpirableCheckbox(scope){
      var value = scope.row.expirable == 't' ? true : false;
      return value;
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
