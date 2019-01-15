<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form>
                <h1>Register</h1>
                <p class="text-muted">Create your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="text" class="form-control" placeholder="Username" autocomplete="username" />
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>@</b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="email" name="email" id="email" class="form-control" placeholder="email"
                    autocomplete="username email" v-model="formData.email"
                    v-validate="'required|email'" required="required"/>
                </b-input-group>
                <div class="msg_holder mb-3" v-if="errors">
                  <span v-show="errors.has('email')"><i  class="fa fa-warning"></i>{{ errors.first('email') }}</span>
                </div>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="password" name="password" id="Password" class="form-control" placeholder="password"
                    autocomplete="current-password" v-model="formData.password"
                    v-validate="'required|min:4'" required="required"/>
                </b-input-group>
                <div class="msg_holder mb-3" v-if="errors">
                  <span v-show="errors.has('password')"><i  class="fa fa-warning"></i>{{ errors.first('password') }}</span>
                </div>
                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="password" name="repeatPassword" id="repeatPassword" class="form-control" placeholder="Repeat password"
                          autocomplete="new-password" v-model="formData.repeatPassword" v-validate="'required|min:4'" required="required"/>
                </b-input-group>
                <div class="msg_holder mb-3" v-if="errors">
                  <span v-show="errors.has('repeatPassword')"><i  class="fa fa-warning"></i>{{ errors.first('repeatPassword') }}</span>
                </div>
                <b-button variant="success" block @click="register">Create Account</b-button>
              </b-form>
            </b-card-body>
            <b-card-footer class="p-4">
              <b-row>
                <b-col cols="6">
                  <b-button block class="btn btn-facebook"><span>facebook</span></b-button>
                </b-col>
                <b-col cols="6">
                  <b-button block class="btn btn-twitter" type="button"><span>twitter</span></b-button>
                </b-col>
              </b-row>
            </b-card-footer>
          </b-card>
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
  name: 'Register',
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
  methods:{
    register(){
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
          this.$axios.post('http://127.0.0.1:9080/users', data_request, config )
            .then(function (response) {
              self.disableClick = false;
              if(response.status == 200){
                let currentMsg =  self.$message  ({
                  message : 'You have successfully registered.',
                  duration:0,
                  type:'success'
                })
                setTimeout(function () {
                  currentMsg.close();
                  self.$router.push('/pages/login');
                }, 1000);
              }
            })
            .catch(function (error) {
              self.disableClick = false;
              self.$message.error('Failed to Register.');
            });
            return;
          }
          else{
            self.$message.error('Please fill in the required fields.');
          }
        });
      },
    }
  }
</script>
