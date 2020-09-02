<template>
  <body class="align-content-center">
    <form class="form-signup" @submit.prevent="createUser">
      <h1 class="h3 mb-3 font-weight-normal">Create User</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" v-model="userInfo['email']" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" v-model="userInfo['password']" id="inputPassword" class="form-control" placeholder="Password" required>
      <label for="inputNickname" class="sr-only">Nickname</label>
      <input type="nickname" v-model="userInfo['nickname']" id="inputNickname" class="form-control" placeholder="Nickname" required>
      <label for="inputEmployer" class="sr-only">Employer</label>
      <input type="employer" v-model="userInfo['employer']" id="inputEmployer" class="form-control" placeholder="Employer" required>
      <label for="inputPhonenumber" class="sr-only">Phonenumber</label>
      <input type="tel" v-model="userInfo['phonenumber']" id="inputPhonenumber" class="form-control" placeholder="Phone Number" required>
      <b-form-select id="roleselect" v-model="userInfo['role']" :options="options" required></b-form-select>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Create User</button>
    </form>
  </body>
</template>

<script>
import {createDocument} from "@/tools/firebaseTool"
import * as firebase from "firebase/app"
import "firebase/auth"
import $ from 'jquery'




export default {
  name: "Registration",
  mounted(){
    $(function() { 
        $("input[type='tel']").on('input', function() { 
            $(this).val($(this).val().replace(/[^0-9]/g, '')); 
        }); 
    });
  },
  data(){
    return{
      userInfo:{
        email:'',
        password:'',
        role: null,
        nickname:'',
        isActive: true,
        empployer:'',
        phonenumber:''
      },
      options: [
        { value: null, text: 'Please select a User Type' },
        { value: 'Consultant', text: 'Consultant' },
        { value: 'Educational Leader', text: 'Educational Leader' }],
    }
  },
  methods:{
    async createUser(){
        if(this.role === null){
          window.alert("Please choose user role!")
        }else{
          firebase.auth().createUserWithEmailAndPassword(this.userInfo['email'],this.userInfo['password'])
            .then(async (user) => {
              user = firebase.auth().currentUser;
              createDocument("userInfo",this.userInfo['email'],this.userInfo)
              window.alert(this.userInfo['email']+" created")
              await this.$router.push("Profile")   
              console.log(user); 
            }).catch((_error) => {
              window.alert("Registration Failed!"+_error);
            })
        }
    },
  }
}
</script>

<style scoped>
@import "../css/general.css";
#roleselect{
  margin-bottom: 10px;
}
.form-signin input[type="nickname"] {
margin-bottom: -1px;
border-top-left-radius: 0;
border-top-right-radius: 0;
}
.form-signin input[type="employer"] {
margin-bottom: -1px;
border-top-left-radius: 0;
border-top-right-radius: 0;
}
#phonenumber{
  margin-bottom: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>