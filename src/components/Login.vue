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
}
</script>

<style scoped>
body {
  height: 100%;
  width: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.form-signin {
  background-color: #f5f5f5;
  width: 100%;
  max-width: 330px;
  padding: 0px 15px 15px 15px;
  margin: auto;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.btn{
  background-color: royalblue;

}
.btn:hover {
  background-color: #2c3e50;
}
.h3{
  background: #2c3e50;
  padding:10px;
  text-align: center;
  color:#fff;
  border-radius: 0px 0px 10px 10px;
}
</style>