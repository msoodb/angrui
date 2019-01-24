<template>
  <div>
    <keyValue title="chart details" v-model=items></keyValue>
    <Tag title="chart tags" v-model=tags></Tag>
  </div>
</template>

<script>
  import keyValue from '../../components/keyValue'
  import Tag from '../../components/Tag'

  export default{
    name : 'ProductChart',
    data: () => {
      return {
        items:{
          "a":20,
          "id": 120,
          "color":"red"
        },
        tags:[
          "a",
          "id",
          "color"
        ]
      }
    },
    components: {
      keyValue,
      Tag
    }
  }
</script>
