<template>
  <div id="app">
    <Topheader v-if="$store.getters.loggedIn" :key="$store.getters.loggedIn"></Topheader>
    <router-view></router-view>
  </div>
</template>


<script>
import Topheader from './components/Top-Header'
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
    Topheader
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
