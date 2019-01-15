<template>
  <b-row>
    <b-col cols="12" lg="6">
      <b-card no-header>
        <template slot="header">
          Product id:  {{ $route.params.id }}
        </template>
        <b-table striped small fixed responsive="sm" :items="items($route.params.id)" :fields="fields">
          <template slot="value" slot-scope="data">
            <strong>{{data.item.value}}</strong>
          </template>
        </b-table>
        <template slot="footer">
          <b-button @click="goBack">Back</b-button>
        </template>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import usersData from '../users/UsersData'
export default {
  name: 'Product',
  props: {
    caption: {
      type: String,
      default: 'Product id'
    },
  },
  data: () => {
    return {
      items: function(id) {
        alert("1");
        const product = this.getProduct();
        alert("4");
        console.log(product);
        const productDetails = product ? Object.entries(product) : [['id', 'Not found']]
        return productDetails.map(([key, value]) => {return {key: key, value: value}})
      },
      fields: [
        {key: 'key'},
        {key: 'value'},
      ],
    }
  },
  computed: {
  },
  mounted(){
    //this.getProduct();
  },
  methods: {
    getProduct(){
    var self = this;
    var token = JSON.parse(localStorage.getItem("jwtoken"));
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
    this.$axios.get('http://127.0.0.1:9080/products/2', config )
      .then(function (response) {
        if(response.status == 200){
          alert("2");
          console.log(response.data);
          return response.data;
          alert("3");
        }
      }.bind(this))
      .catch(function (error) {
        self.$message.error(error);
      });
    },
    goBack() {
      this.$router.go(-1)
      // this.$router.replace({path: '/products'})
    }
  }
}
</script>
