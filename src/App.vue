<template>
  <div id="app">
    <top-header></top-header>
    <br>
    <div id="nav">
      <router-link to="/login">Login</router-link> |
      <router-link to="/registration">Registration</router-link> |
      <router-link to="/framework">Framework</router-link> | 
      <router-link to="/profile">Profile</router-link>
    </div>

    <router-view></router-view>

    <div><Rating :grade="0"></Rating></div>
  </div>
</template>


<script>
import TopHeader from "@/components/Top-Header"
import Rating from "@/components/Rating";
import {db} from './tools/firebaseConfig'
const documentPath = 'userInfo/test@gmail.com'

export default {
  data(){
    return{
      firebaseData: null,
    }
  },
  firestore(){
    return{
      firebaseData: db.doc(documentPath)
    }
  },
  methods:{

  },
  name: 'App',
  components: {
    TopHeader,
    Rating
  },
  mounted(){

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
.router-link{
  margin: 20px;
}
</style>
