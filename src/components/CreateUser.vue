<template>
  <body class="align-content-center">
    <form id="form-signup" class="form-signup" @submit.prevent="CreateUser">
      <h1 class="h3 mb-3 font-weight-normal">Create User</h1>
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
      <button class="btn btn-lg btn-primary btn-block" type="submit">Create User</button>
      <p style="margin-top:5px;margin-bottom:0px;font-weight:bold;text-align: center;font-size: 20px">Or</p>
      <button class="btn btn-lg btn-primary btn-block" @click.prevent="openSendWindow()">Send Invitation Code</button>
    </form>

    <el-dialog title="Send Invitation Code" :visible.sync="sendWindowVisible" width="360px">
      <el-form ref="form" :model="inviteUser" label-width="80px">
        <el-form-item label="Email">
          <el-input v-model="inviteUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendWindowVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sendEmail">Confirm</el-button>
      </span>
    </el-dialog>
  </body>
</template>

<script>
import {createDocument} from "@/tools/firebaseTool"
import "firebase/auth"
import $ from 'jquery'
import {Email} from "@/tools/smtp"
import {adminApp} from "@/tools/firebaseConfig";


export default {
  name: "CreateUser",
  mounted(){
    $(function() { 
        $("input[type='tel']").on('input', function() { 
            $(this).val($(this).val().replace(/[^0-9+]/g, ''));
        }); 
    });
  },
  data(){
    return{
      sendWindowVisible: false,
      inviteUser:{
        email:"",
      },
      userInfo:{
        email:'',
        password:'',
        role: null,
        nickname:'',
        isActive: true,
        employer:'',
        phoneNumber:''
      },
      options: [
        { value: null, text: 'Please select a User Type' },
        { value: 'Consultant', text: 'Consultant' },
        { value: 'Educational Leader', text: 'Educational Leader' }],
    }
  },
  methods:{
    createUser(){
      if(this.role === null){
        window.alert("Please choose user role!")
      }else{
        adminApp.auth().createUserWithEmailAndPassword(this.userInfo['email'],this.userInfo['password'])
          .then(async () => {
            createDocument("userInfo",this.userInfo['email'],this.userInfo)
            window.alert(this.userInfo['email']+" created")
            document.getElementById('form-signup').reset();
          }).catch((_error) => {
            window.alert("Registration Failed!"+_error);
          })
      }
    },
    openSendWindow(){
      this.sendWindowVisible = true
    },
    sendEmail() {
      Email.send({
        Host: "smtp.gmail.com",
        Username : "edtech.echidna@gmail.com",
        Password : "edtechechidna",
        To : this.inviteUser.email,
        From : "edtech.echidna@gmail.com",
        Subject : "Invitation code",
        Body : "Welcome to EdTech, Your invitation code is 730283",
      }).then(
        this.sendWindowVisible = false,
        window.alert("Invitation code sent to "+this.inviteUser.email),
        this.inviteUser.email="",
    )
    }
  }
}
</script>

<style scoped>
@import "../css/general.css";

#roleselect{
  margin-bottom: 10px;
}



#phonenumber{
  margin-bottom: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>