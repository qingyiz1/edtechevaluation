<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>
      <label>Username: </label>
      <input type="text" v-model="username">
      <br>
      <label>Password: </label>
      <input type="password" v-model="password">
      <br>
      <label>User type: </label>
      <input type="radio" v-model="usertype" value="consultant">
      <label> Consultant</label>
      <input type="radio" v-model="usertype" value="ELeader">
      <label>Educational Leader</label><br>
      <br>
      <button @click="updateInfo()">Create User</button>
    </div>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import {db} from "./firebaseConfig";

export default {
  data(){
    return{
      username:"Username",
      password:"",
      usertype:""
    }
  },
  methods:{
    updateInfo(){
      db.collection("userInfo").doc(this.username).set({username:this.username,password:this.password,usertype:this.usertype})
    }
  },
  name: 'App',
  components: {
    //HelloWorld
  }
}



</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button{
  background-color: transparent;
}
</style>
