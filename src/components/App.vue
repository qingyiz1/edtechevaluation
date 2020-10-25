<template>
  <div id="app">
    <topHeader v-if="$store.getters.loggedIn" :key="$store.getters.loggedIn"></topHeader>
    <router-view></router-view>
  </div>
</template>


<script>
import topHeader from './Top-Header'
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
    topHeader
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
  width: 100%;
  background-size: auto;
}
button{
  background-color: transparent;
}
.router-link{
  margin: 20px;
}
</style>