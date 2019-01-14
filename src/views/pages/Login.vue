<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="email" name="email" id="email" class="form-control" placeholder="email"
                      autocomplete="username email" v-model="formData.email"
                      v-validate="'required|email'" required="required"/>
                  </b-input-group>
                  <div class="msg_holder mb-3" v-if="errors">
                    <span v-show="errors.has('email')"><i  class="fa fa-warning"></i>{{ errors.first('email') }}</span>
                  </div>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="password" name="password" id="Password" class="form-control" placeholder="password"
                      autocomplete="current-password" v-model="formData.password"
                      v-validate="'required|min:4'" required="required"/>
                  </b-input-group>
                  <div class="msg_holder mb-3" v-if="errors">
                    <span v-show="errors.has('password')"><i  class="fa fa-warning"></i>{{ errors.first('password') }}</span>
                  </div>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" @click="login">Login</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="link" class="px-0">Forgot password?</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <b-button variant="primary" class="active mt-3" to="/pages/register">Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
var qs = require('qs');
var uuid = require('uuid');
var njwt = require('njwt');
export default {
  name: 'login',
  data(){
    return{
      formData:{},
      disableClick : false
    }
  },
  mounted(){
  },
    beforeRouteUpdate (to, from, next) {
      console.log(to, from);
  },
  name: 'Login',
  methods:{
    login(){
      var self = this;
      self.disableClick = true;
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      this.$validator.validateAll().then((result) => {
        if (result) {
          var data_request = JSON.stringify(this.formData);
          this.$axios.post('http://127.0.0.1:9080/login', data_request, config )
            .then(function (response) {
              self.disableClick = false;
              if(response.status == 200){
                alert(localStorage.getItem("jwtoken"));
                localStorage.setItem("jwtoken", JSON.stringify(response.data));
                alert(localStorage.getItem("jwtoken"));
                // let currentMsg =  self.$message  ({
                //   message : 'شما با موفقیت وارد سامانه شدید.',
                //   duration:0,
                //   type:'success'
                // })
                setTimeout(function () {
                  // currentMsg.close();
                  self.$router.push('/dashboard');
                }, 1000);
              }
            })
            .catch(function (error) {
              self.disableClick = false;
              self.$message.error('خطایی در فرایند ورود رخ داده است.');
            });
            return;
          }
          else{
            self.$message.error('اطلاعات اجباری برای ورود را وارد کنید.');
          }
        });
      },
    }
  }
</script>
