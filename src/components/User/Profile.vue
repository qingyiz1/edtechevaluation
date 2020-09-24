<template>
  <div class="profile">
    <h2 class="profile-title">User Profile</h2>
    <b-card class="profile-body">
      <b-row no-gutters>
        <b-col cols="3">
        <b-avatar class="avatar" variant="info" size="9rem"></b-avatar>
        </b-col>
        <b-col cols="8" offset="" class="profile-form"> 
          <b-row>
            <b-col cols="5">
              <label>Email</label>
              <b-form-input :disabled="!editable" v-model="userdata['email']" id="email" trim></b-form-input>
            </b-col>
            <b-col cols="5" offset="1">
              <label>Password</label>
              <b-form-input :disabled="!editable" v-model="userdata['password']" id="password" type="password" trim></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="5">
              <label>Nickname</label>
              <b-form-input :disabled="!editable" v-model="userdata['nickname']" id="nickname" trim></b-form-input>
            </b-col>
            <b-col cols="5" offset="1">
              <label>Role</label>
              <b-form-select :disabled="!editable" v-model="userdata['role']" :options="options"></b-form-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="5">
              <label>Employer</label>
              <b-form-input :disabled="!editable" v-model="userdata['employer']" id="employer" trim></b-form-input>
            </b-col>
            <b-col cols="5" offset="1">
              <label>Phone Number</label>
              <b-form-input :disabled="!editable" v-model="userdata['phoneNumber']" id="phoneNum" trim></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row align-h="end" class="save-btn-group">
        <b-button variant="info" class="btn" v-if="!editable" @click="Edit()">Edit</b-button>
        <b-button variant="info" class="btn" v-if="editable" @click="updateProfile">Save</b-button>
        <b-button variant="outline-info" @click="Cancel" class="btn-cancel">Cancel</b-button>
      </b-row>
    </b-card>
    <!-- <div style="font-size:50px;text-align: center" v-if="userdata === null">Error getting user profile!</div> -->
  <!-- <form v-if="userdata !== null" class="form-profile">
    <h1 class="h3 mb-3 font-weight-normal">User Profile</h1>
    <div class="user-attribute">
      <h5>Email: </h5>
      <p>{{userdata['email']}}</p>
    </div>
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
  </form> -->
  <!-- </body> -->
  </div>
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
  computed: {
    isEdit () {
      if (this.editable) {
        return "Save"
      } else {
        return "Edit"
      }
    }
  },
  methods: {
    Edit(){
      this.editable = true
      this.profileStore = JSON.parse(JSON.stringify(this.userdata));
      // if (this.editable) {
      //   this.updateProfile()
      // }
    },
    Cancel:  function () {
      this.editable = false
      this.userdata = JSON.parse(JSON.stringify(this.profileStore));
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
      options: [
          { value: "Senior Consultant", text: "Senior Consultant" },
          { value: "Consultant", text: "Consultant" },
          { value: "Educational leader", text: "Educational leader" },
        ],
        profileStore:""
    }
  },
  firestore(){
    return{
      userdata: db.collection("userInfo").doc(this.$route.params.nickname)
    }
  },

}

</script>



<style scoped>
@import "../../css/general.css";
/* .form-profile {
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
} */ 
.profile {
    margin: 1.5rem 2rem;
}
.profile .profile-title {
  text-align: left;
  color: #6A757E;
  margin-bottom: 1.5rem;
}

.profile .profile-body {
  width: 100%;
  background: transparent;
  border-radius: 1rem;
}

.profile .profile-form {
  text-align: left;
  margin-left: 2rem;
}
.profile-form .row {
  margin-bottom: 1.5rem;
}
label {
  color:  #6C757D;
  margin-bottom: 0.25rem;
  font-size: .875rem;
}
.save-btn-group {
padding-right: 9.25rem;
}

.save-btn-group .btn {
  border-radius: .5rem;;
}
.save-btn-group .btn-cancel {
  margin-left: 1rem;
  border: 2px solid #17a2b8
}

</style>