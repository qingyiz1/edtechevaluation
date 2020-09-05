<template>
  <div>
    <div>
      <b-navbar style="color:white" toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/">EdTech</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
           <b-navbar-nav>
             <b-nav-item v-if="!$store.getters.loggedIn" to="/login">Login</b-nav-item>
             <b-nav-item v-if="userdata['role']==='Senior Consultant'" to="/registration">Registration</b-nav-item>
             <b-nav-item v-if="$store.getters.loggedIn" to="/framework">Framework</b-nav-item>
             <b-nav-item-dropdown v-if="$store.getters.loggedIn" variant="outline-primary" text="User">
                 <b-dropdown-item v-if="$store.getters.loggedIn" :to=" '/profile/' + this.userdata['email']" >Profile</b-dropdown-item>
                 <b-dropdown-item to="/userlist">User List</b-dropdown-item>
             </b-nav-item-dropdown>
             <b-nav-item v-if="$store.getters.loggedIn" @click="signOut">Sign out</b-nav-item>
              
           </b-navbar-nav>
        </b-collapse>


            <!-- Right aligned nav items -->
<!--            <b-navbar-nav class="ml-auto">-->
<!--              <b-nav-form>-->
<!--                <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>-->
<!--                <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>-->
<!--              </b-nav-form>-->
<!--            </b-navbar-nav>-->

        
        
      </b-navbar>
    </div></div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import {db} from "@/tools/firebaseConfig";

export default {
  name: "top-header",
  mounted() {

  },
  methods: {
    signOut() {
      firebase.auth().signOut()
          .then(() => {
            this.$router.replace({ name: "Login" });
            this.$store.commit('loggedOut')
          });
    }
  },
  data() {
    return {
      isAdmin: false,
      userdata:''
    };
  },
  firestore(){
    return{
      userdata: db.collection("userInfo").doc(firebase.auth().currentUser.email)
    }
  },
};
</script>

<style lang="scss" scoped>

</style>