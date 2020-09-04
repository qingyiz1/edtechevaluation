<template>
  <div id="app">
    <Topheader v-if="$store.getters.loggedIn" :key="$store.getters.loggedIn"></Topheader>
    <router-view></router-view>
  </div>
</template>


<script>
import Topheader from './components/Top-Header'
import * as firebase from "firebase";

export default {
  data(){
    return{
    }
  },
  firestore(){
    return{
      
    }
  },
  methods: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          this.$store.commit('loggedIn')
        } else {
          // No user is signed in.
          this.$store.commit('loggedOut')
        }
      });
    },
  },
  name: 'App',
  components: {
    Topheader
  },
  created(){
    this.setupFirebase();
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
  height: 100%;
  background-size: auto;
}
button{
  background-color: transparent;
}
.router-link{
  margin: 20px;
}
</style>
