<template>
  <div>
    <div v-if="error" class="error">{{error.message}}</div>
    <form @submit.prevent="pressed">
      Registration
      <div class="email">
        <input type="email" v-model="email" placeholder="email">
      </div>
      <div class="password">
        <input type="password" v-model="password" placeholder="password">
      </div>
      <label>User type: </label>
      <input type="radio" v-model="usertype" value="consultant">
      <label> Consultant</label>
      <input type="radio" v-model="usertype" value="ELeader">
      <label>Educational Leader</label><br>
      <button type="submit">Create User</button>
    </form>

  </div>
</template>

<script>
import {createDocument} from "@/tools/firebaseTool"
import * as firebase from "firebase/app"
import "firebase/auth"

export default {
  name: "Registration",
  data(){
    return{
      email:'',
      password:'',
      usertype:'',
      error:''
    }
  },
  methods:{
    async pressed(){
      try{
        const user = firebase.auth().createUserWithEmailAndPassword(this.email,this.password)
        //redirect to user management page
        //this.$router.replace({name:"admin"});
        createDocument("userInfo",this.email,this.$data)
        console.log(user)
        window.alert(this.email+" created").then(console.log("clicked"))
        await this.$router.push("Profile")
      }catch(err){
        console.log(err)
      }


    },
  }
}
</script>

<style scoped>

</style>