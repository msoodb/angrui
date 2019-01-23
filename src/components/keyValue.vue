<template>
  <el-form label-width="120px">
    <el-form-item label="details">
      <el-table style="width: 100%" border>
        <el-table-column prop="key" label="key"  width="180">
        </el-table-column>
        <el-table-column prop="value" label="value" width="100">
        </el-table-column>
        <el-table-column label="Operations" width="120" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini">
            </el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="el-icon-circle-plus" type="primary"
        size="mini">Add</el-button>
        <el-dialog title="Product details">
          <el-form ref="productDetailsFormDialog" :model="productDetailsFormDialog" label-width="120px" inline-message>
            <el-form-item label="key" porp="key">
              <el-input type="key" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="value" porp="value">
              <el-input typr="value" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button>Cancel</el-button>
          <el-button type="primary">Confirm</el-button>
        </span>
      </el-dialog>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'KeyValue',
  data: function () {
    return {
      count: 0
    }
  },
}
</script>
