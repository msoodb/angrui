<template>
  <div>
    <el-tag
      :key="tag"
      v-for="tag in items"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
export default {
  name: 'AU-Tag',
  props: {
    data:{
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  watch: {
      data: function(newVal, oldVal) {
        if(this.data && this.data!="[]" && this.data!="{}"){
          this.items =JSON.parse(this.data);
        }
      }
  },
  data: function () {
    return {
      items: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods:{
    handleClose(tag) {
       this.items.splice(this.items.indexOf(tag), 1);
       var details = JSON.stringify(this.items);
       this.$emit('change', details);
     },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
         this.$refs.saveTagInput.$refs.input.focus();
       });
     },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.items.indexOf(inputValue) < 0) {
        this.items.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
      var details = JSON.stringify(this.items);
      this.$emit('change', details);
     }
  }
}
</script>

<style scoped>
.el-tag{
  margin-right: 10px;
}
.el-tag + .el-tag {
    margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}
</style>
