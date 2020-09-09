<template>
  <body class="text-center">
    <div id="cloud-container"></div>
    <div id="Logo-container"></div>
    <form class="form-signin" @submit.prevent="login">
      <h1 class="h3 mb-3 font-weight-normal">Please Log in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" v-model="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" v-model="password" id="inputPassword" class="form-control" placeholder="Password" autocomplete="current-password" required><br>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
      <p style="margin-top:5px;margin-bottom:0px;font-weight:bold;text-align: center;font-size: 20px">Or</p>
      <router-link class="btn btn-lg btn-success btn-block" to="/registration">Sign up</router-link>
    </form>
  </body>
</template>

<script>
import * as firebase from "firebase";
//import {createDocument} from "@/firebaseTool";

export default {
  name: "Login",
  data(){
    return{
      email:"",
      password:'',
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
    }
  },
  mounted(){
    if(firebase.auth().currentUser !== null){
      this.$router.push({path: "/profile/" + this.email})
    }
  }
}
</script>

<style scoped>
@import "../css/general.css";
</style>