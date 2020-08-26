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
  },
  methods: {
    Edit(){
      this.editable = true
    },
    updateProfile(){
      this.editable = false
      updateDocument("userInfo",firebase.auth().currentUser.email,{"nickname":this.userdata['nickname'],"usertype":this.userdata['usertype']})
    },
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
@import "../css/general.css";
</style>