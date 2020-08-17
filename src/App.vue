<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div id="nav">
      <router-link to="/login">Login</router-link>
      <router-link to="/Registration">Registration</router-link>
    </div>
    <router-view></router-view>
    <div><Rating :grade="0"></Rating></div>
  </div>
</template>


<script>
import Rating from './components/Rating.vue'


export default {
  data(){
    return{

    }
  },
  methods:{

  },
  name: 'App',
  components: {
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
</style>
