<template>
  <body>
    <div v-if="error" class="error">{{error.message}}</div>
    <form class="form-signin" @submit.prevent="pressed">
      <h1 class="h3 mb-3 font-weight-normal">Create User</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" v-model="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" v-model="password" id="inputPassword" class="form-control" placeholder="Password" required>
      <label>User type: </label><br>
      <input type="radio" name="usertype" v-model="usertype" value="consultant">
      <label style="padding-left:2px;padding-right:5px"> Consultant</label>
      <input type="radio" name="usertype" v-model="usertype" value="ELeader">
      <label style="padding-left:2px;padding-right:5px">Educational Leader</label><br>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Create User</button>
    </form>
  </body>
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
      usertype:'consultant',
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