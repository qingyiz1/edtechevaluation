<template>
  <div>
    <ul>
      <li>{{userdata['email']}}</li>
      <li>{{userdata['usertype']}}</li>
    </ul>
  </div>
</template>

<script>
import {db} from "@/tools/firebaseConfig"
//import * as firebase from "firebase/app"
import "firebase/auth"
import * as firebase from "firebase";
//let email

export default {
  name:"Profile",
  mounted() {
    this.setupFirebase();
  },
  methods: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          console.log("signed in");
          this.loggedIn = true;
        } else {
          // No user is signed in.
          this.loggedIn = false;
          console.log("signed out", this.loggedIn);
        }
      });
    }
  },
  data(){
    return {
      userdata:''
    }
  },
  firestore(){
    return{
      userdata: db.collection("userInfo").doc(firebase.auth().currentUser.email)
    }
  },

}

</script>



<style scoped>

</style>