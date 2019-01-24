<template>
  <el-form label-width="120px">
    <el-form-item :label=title v-model=value>
      <el-tag
        :key="tag"
        v-for="tag in value"
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
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    value:{},
    title: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      inputVisible: false,
      inputValue: '',
    }
  },
  methods:{
    handleClose(tag) {
       this.value.splice(this.value.indexOf(tag), 1);
     },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
         this.$refs.saveTagInput.$refs.input.focus();
       });
     },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.value.indexOf(inputValue) < 0) {
        this.value.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
     }
  }
}
</script>

<style Scope>
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
