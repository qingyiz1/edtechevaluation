<template>
  <body class="text-center">
    <form class="form-signin" @submit.prevent="login">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" v-model="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" v-model="password" id="inputPassword" class="form-control" placeholder="Password" required>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
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
    async login() {
      try {
        await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        console.log(firebase.auth().currentUser)
        window.alert(this.email + " logged in")
        //redirect to user profile page after login
        await this.$router.replace({name: "Profile"})
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted(){
    if(firebase.auth().currentUser !== null){
      this.$router.replace({name:"Profile"})
    }
  }
}
</script>

<style scoped>
@import "../css/general.css";
</style>