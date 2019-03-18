<template>
  <el-card class="box-card">
  <div class="upload_wrapper">
    <div class="left-side">left</div>
    <div class="right-content">right</div>

  </div>

  </el-card>
</template>

<script>
import {baseurl} from '../../config'

export default {
  name: 'Upload',
  data() {
     return {
       items: []
     }
  },
  methods: {
  }
}
</script>

<style scoped>
.card-body{
  padding: 0rem;
  padding-top: 40px;
}
.upload_wrapper{
  display: flex;
  justify-content: space-between;
}
.left-side{
  flex:1;
}
.right-content{
  flex:6;
}

</style>
