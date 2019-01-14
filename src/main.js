// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import axios from 'axios'
import qs from 'qs'
import VeeValidate from 'vee-validate'
import router from './router'

// todo
// cssVars()

Vue.use(BootstrapVue)
Vue.use(axios)
Vue.prototype.$axios = axios
Vue.use(qs)
Vue.use(VeeValidate,
  {
    dictionary: {
      en: {
        messages:{
          required: () => 'فیلد فوق اجباری می‌باشد.',
          digits: () => 'فیلد فوق شامل اعداد می‌باشد و شامل ۱۱ عدد می‌باشد.'
        },
        custom: {
          Email: {
            required: 'فیلد ایمیل اجباری می‌باشد' ,
            email: 'ایمیل وارد شده معتبر نمی‌باشد.'
          },
          Password: {
            required: 'رمز عبور اجباری می‌باشد' ,
            min: 'رمز عبور باید بیشتر از ۴ کاراکتر باشد.'
          },
          NationalCode: {
            required: 'کد ملی اجباری می‌باشد' ,
            max: 'کد ملی بیشتر از ۱۰ کاراکتر مجاز نمی‌باشد.',
            min: 'کد ملی کمتر از ۱۰ کاراکتر مجاز نمی‌باشد.',
            numeric: 'کد ملی شامل حروف ٬ کاما یا خط فاصله نمی‌باشد.'
          },
          mobile: {
            required: 'شماره موبایل اجباری می‌باشد' ,
            numeric: 'شماره موبایل شامل حروف ٬ کاما یا خط فاصله نمی‌باشد.' ,
            max: 'شماره موبایل نباید بیشتر از ۱۱ رقم باشد' ,
            min: 'شماره موبایل باید ۱۱ رقم باشد' ,
          },
          ValidationCode: {
            required: 'کد فعال‌سازی اجباری می‌باشد' ,
            numeric: 'کد فعال‌سازی شامل حروف ٬ کاما یا خط فاصله نمی‌باشد.' ,
            max: 'کد فعال‌سازی نباید بیشتر از ۶ رقم باشد' ,
            min: 'کد فعال‌سازی باید ۶ رقم باشد' ,
          },
          first_name  : {
            required: 'فیلد نام اجباری می‌باشد' ,
          },
          last_name  : {
            required: 'فیلد نام‌خانوادگی اجباری می‌باشد' ,
          },
        }
      }
    }
  })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
