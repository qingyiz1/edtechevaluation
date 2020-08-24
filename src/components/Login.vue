<template>
  <div>
    <form @submit.prevent="login">
      Log in
      <div class="email">
        <input type="email" v-model="email" placeholder="email">
      </div>
      <div class="password">
        <input type="password" v-model="password" placeholder="password">
      </div>
      <button type="submit">Log in</button>
    </form>

  </div>
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

</style>