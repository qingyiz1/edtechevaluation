<template>
  <body style="margin-top: 20px">
  <div style="font-size:50px;text-align: center" v-if="userdata === null">Error getting user profile!</div>
  <form v-if="userdata !== null" class="form-profile">
    <h1 class="h3 mb-3 font-weight-normal">User Profile</h1>
    <div class="user-attribute">
      <h5>Email: </h5>
      <p>{{userdata['email']}}</p>
    </div>
    <div class="user-attribute">
      <h5>Role: </h5>
      <!--        <div v-if="editable">-->
      <!--           <input type="radio" name="role" v-model="userdata['role']" value="Consultant">-->
      <!--           <label style="padding-left:2px;padding-right:5px"> Consultant</label>-->
      <!--           <input type="radio" name="role" v-model="userdata['role']" value="Educational Leader">-->
      <!--           <label style="padding-left:2px;padding-right:5px">Educational Leader</label>-->
      <!--        </div>-->
      <p>{{userdata['role']}}</p>
    </div>
    <div class="user-attribute">
      <h5>Nickname: </h5>
      <p v-if="!editable">{{userdata['nickname']}}</p>
      <input v-if="editable" type="nickname" v-model="userdata['nickname']" id="nickname" class="form-control" placeholder="Nickname" >
    </div>
    <div class="user-attribute">
      <h5>Employer: </h5>
      <p v-if="!editable">{{userdata['employer']}}</p>
      <input v-if="editable" type="employer" v-model="userdata['employer']" id="employer" class="form-control" placeholder="Employer" required>
    </div>
    <div class="user-attribute">
      <h5>Phone Number: </h5>
      <p v-if="!editable">{{userdata['phoneNumber']}}</p>
      <label for="inputPhoneNumber" class="sr-only">Phone Number</label>
      <input v-if="editable" type="tel" v-model="userdata['phoneNumber']" id="inputPhoneNumber" class="form-control" placeholder="Phone Number" required>
    </div>

    <br>
    <button class="btn btn-lg btn-primary btn-block" v-if="!editable" @click.prevent="Edit()">Edit</button>
    <button class="btn btn-lg btn-primary btn-block" v-if="editable" @click.prevent="updateProfile()">Save</button>
  </form>
  </body>




</template>

<script>
import {db} from "@/tools/firebaseConfig"
//import * as firebase from "firebase/app"
import "firebase/auth"
//import * as firebase from "firebase";
import {updateDocument} from "@/tools/firebaseTool"
import $ from "jquery";

//let email

export default {
  name:"Profile",
  mounted(){
    $(function() {
      $("input[type='tel']").on('input', function() {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
      });
    });
  },
  methods: {
    Edit(){
      this.editable = true
    },
    updateProfile(){
      this.editable = false
      updateDocument("userInfo",this.$route.params.nickname,this.userdata)
    },
  },
  data(){
    return {
      userdata:'',
      editable:false,
    }
  },
  firestore(){
    return{
      userdata: db.collection("userInfo").doc(this.$store.getters.userProfile.email)
    }
  },

}

</script>



<style scoped>
@import "../css/general.css";
.form-profile {
  background-color: #f5f5f5;
  width: 100%;
  max-width: 330px;
  padding: 0px 15px 15px 15px;
  margin: auto;
  border-radius: 10px 10px 10px 10px;
}
.form-profile .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
h5, p {
  display: inline;
}
.user-attribute{
  margin-bottom: 5px;
}

</style>