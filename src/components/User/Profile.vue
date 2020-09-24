<template>
  <div class="profile">
    <h2 class="profile-title">User Profile</h2>
    <b-overlay
        :show="show"
        spinner-variant="success"
        spinner-type="grow"
        spinner-large
        rounded="sm"
    >
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
              <label v-if="editable">Password</label>
              <b-form-input v-if="editable" v-model="userdata['password']" id="password" type="text" trim></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="5">
              <label>Nickname</label>
              <b-form-input :disabled="!editable" v-model="userdata['nickname']" id="nickname" trim></b-form-input>
            </b-col>
            <b-col cols="5" offset="1">
              <label>Role</label>
              <b-form-input disabled v-model="userdata['role']"></b-form-input>
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
        <b-button v-if="editable" variant="outline-info" @click="Cancel" class="btn-cancel">Cancel</b-button>
      </b-row>
    </b-card>
    </b-overlay>

  </div>
</template>

<script>
import {db, auth} from "@/tools/firebaseConfig"
import {updateDocument} from "@/tools/firebaseTool"
import $ from "jquery";

//let email

export default {
  name:"Profile",
  data(){
    return {
      userdata:'',
      editable:false,
      profileStore:"",
      show:false
    }
  },
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
    async updateProfile(){
      this.show = true
      this.editable = false
      let user = auth.currentUser;

      await auth.signInWithEmailAndPassword(this.$store.getters.userProfile.email, this.$store.getters.userProfile.password)
      await user.updateEmail(this.userdata.email).catch((err)=>{window.alert(err)})
      await auth.signInWithEmailAndPassword(this.userdata.email,this.$store.getters.userProfile.password)
      await user.updatePassword(this.userdata.password).then(()=>{
        updateDocument("userInfo",user.uid,this.userdata)
        this.$store.dispatch("fetchUserProfile",user)
        this.$bvModal.msgBoxOk('Profile updated successfully', {
          title: 'Success',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
        this.show = false
      }).catch((err)=>{window.alert(err)})
    },
  },
  firestore(){
    return{
      userdata: db.collection("userInfo").doc(this.$route.params.uid)
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