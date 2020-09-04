<template>
  <body class="text-center">
    <div id="cloud-container"></div>
    <div id="Logo-container"></div>
    <form class="form-signin" @submit.prevent="login">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" v-model="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" v-model="password" id="inputPassword" class="form-control" placeholder="Password" autocomplete="current-password" required><br>
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
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
          if (user) {
            // User is signed in.
            this.$store.commit('loggedIn')
            window.alert(this.email + " logged in")
            //redirect to user profile page after login
            this.$router.push({path: "/profile/" + this.email})
            //this.$router.go(0)
            //location.reload()
          } else {
            // No user is signed in.
            this.$store.commit('loggedOut ')
          }
        });


      } catch (err) {
        console.log(err)
      }
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