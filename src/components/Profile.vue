<template>
  <body class="text-center">
    <form class="form-signin">
      <h1 class="h3 mb-3 font-weight-normal">User Profile</h1>
      <h5>Nickename: </h5>
      <div v-if="!editable">{{userdata['nickname']}}</div>     
      <input v-if="editable" type="nickname" v-model="userdata['nickname']" id="nickname" class="form-control" placeholder="Nickname" >
      <h5>User type: </h5> 
      <div v-if="editable">
         <input type="radio" name="usertype" v-model="userdata['usertype']" value="Consultant">
         <label style="padding-left:2px;padding-right:5px"> Consultant</label>
         <input type="radio" name="usertype" v-model="userdata['usertype']" value="Educational Leader">       
         <label style="padding-left:2px;padding-right:5px">Educational Leader</label><br> 
      </div>
      <div v-if="!editable">{{userdata['usertype']}}</div><br> 
      <button class="btn btn-lg btn-primary btn-block" v-if="!editable" @click.prevent="Edit()">Edit</button>
      <button class="btn btn-lg btn-primary btn-block" v-if="editable" @click.prevent="updateProfile()">Save</button>
    </form>
  </body>

      

  
</template>

<script>
import {db} from "@/tools/firebaseConfig"
//import * as firebase from "firebase/app"
import "firebase/auth"
import * as firebase from "firebase";
import {updateDocument} from "@/tools/firebaseTool"
//let email

export default {
  name:"Profile",
  mounted() {
    this.setupFirebase();
  },
  methods: {
    Edit(){
      this.editable = true
    },
    updateProfile(){
      this.editable = false
      updateDocument("userInfo",firebase.auth().currentUser.email,{"nickname":this.userdata['nickname'],"usertype":this.userdata['usertype']})
    },
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
      userdata:'',
      editable:false
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
body {
  height: 100%;
  width: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.form-signin {
  background-color: #f5f5f5;
  width: 100%;
  max-width: 330px;
  padding: 0px 15px 15px 15px;
  margin: auto;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.btn{
  background-color: royalblue;

}
.btn:hover {
  background-color: #2c3e50;
}
.h3{
  background: #2c3e50;
  padding:10px;
  text-align: center;
  color:#fff;
  border-radius: 0px 0px 10px 10px;
}
</style>