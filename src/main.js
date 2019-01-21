// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import axios from 'axios'
import qs from 'qs'
import VeeValidate from 'vee-validate'
import router from './router'

// todo
// cssVars()

Vue.use(BootstrapVue)
Vue.use(ElementUI)
Vue.use(axios)
Vue.prototype.$axios = axios
Vue.use(qs)
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
