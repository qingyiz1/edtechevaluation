<template>
  <div class="text-center">
  <div id="cloud-container"></div>
  <div class="align-content-center">
    <form  style="margin-top: -250px" id="form-registration" class="form-signin" @submit.prevent="createUser">
      <h1 class="h3 mb-3 font-weight-normal">Please Sign up</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" v-model="userInfo['email']" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" v-model="userInfo['password']" id="inputPassword" class="form-control" placeholder="Password" required>
      <label for="inputNickname" class="sr-only">Nickname</label>
      <input type="nickname" v-model="userInfo['nickname']" id="inputNickname" class="form-control" placeholder="Nickname" required>
      <label for="inputEmployer" class="sr-only">Employer</label>
      <input type="employer" v-model="userInfo['employer']" id="inputEmployer" class="form-control" placeholder="Employer" required>
      <label for="inputPhoneNumber" class="sr-only">Phone Number</label>
      <input type="tel" v-model="userInfo['phoneNumber']" id="inputPhoneNumber" class="form-control" placeholder="Phone Number" required>
      <b-form-select id="roleselect" v-model="userInfo['role']" :options="options" required></b-form-select>
      <label for="inputInvitationCode" class="sr-only">Invitation Code</label>
      <input type="invitationCode" v-model="userInfo['invitationCode']" id="inputInvitationCode" style="margin-top: 5px" class="form-control" placeholder="Invitation Code" required>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
      <p style="margin-top:5px;margin-bottom:0px;font-weight:bold;text-align: center;font-size: 20px">Or</p>
      <router-link class="btn btn-lg btn-success btn-block" to="/login">Log in</router-link>
    </form>
  </div>
  </div>
</template>

<script>
import * as firebase from "firebase";
import $ from "jquery";
import {auth, db} from "@/tools/firebaseConfig";
import {createDocument} from "@/tools/firebaseTool";

export default {
  name: "Registration",
  data(){
    return{
      userInfo:{
        email:'',
        password:'',
        role: null,
        nickname:'',
        isActive: true,
        employer:'',
        phoneNumber:'',
        invitationCode:'',
      },
      options: [
        { value: null, text: 'Please select a User Type' },
        { value: 'Consultant', text: 'Consultant' },
        { value: 'Educational Leader', text: 'Educational Leader' }],
    }
  },
  methods: {
    async createUser(){
      await db.collection('invitationCode').doc(this.userInfo['invitationCode']).get()
      .then(function(doc) {
        if (doc.exists) {
          auth.createUserWithEmailAndPassword(this.userInfo['email'],this.userInfo['password'])
              .then(async () => {
                createDocument("userInfo",this.userInfo['email'],this.userInfo)
                window.alert(this.userInfo['email']+" created")
                this.$store.commit("loggedIn")
                await this.$router.push({path: "/profile/" + this.userInfo['email']})
              }).catch((_error) => {
            window.alert("Registration Failed!"+_error);
          })
        } else {
          // doc.data() will be undefined in this case
          window.alert("Your invitation code is invalid!")
        }
      }).catch(function(error) {
            console.log("Error getting document:", error);
      });
    }
  },
  mounted(){
    if(firebase.auth().currentUser !== null){
      this.$router.push({path: "/profile/" + this.email})
    }
    $(function() {
      $("input[type='tel']").on('input', function() {
        $(this).val($(this).val().replace(/[^0-9+]/g, ''));
      });
    });
    $(function() {
      $("input[type='invitationCode']").on('input', function() {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
      });
    });
  }
}
</script>

<style scoped>
@import "../css/general.css";
</style>