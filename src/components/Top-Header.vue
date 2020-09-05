<template>
  <div>
    <div>
      <b-navbar style="color:white" toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/">EdTech</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
           <b-navbar-nav>
             <b-nav-item to="/login">Login</b-nav-item>
             <b-nav-item to="/registration">Registration</b-nav-item>
             <b-nav-item to="/framework">Framework</b-nav-item>
             <b-nav-item-dropdown variant="outline-primary" text="User" right>
                 <b-dropdown-item to="/profile">Profile</b-dropdown-item>
                 <b-dropdown-item to="/userlist">User List</b-dropdown-item>
             </b-nav-item-dropdown>
             <b-nav-item v-if="loggedIn" @click="signOut">Sign out</b-nav-item>
              <div style="margin-top:8px">
               <div style="color:white" v-if="loggedIn">Logged in: Yes</div>
               <div style="color:white" v-else>Logged in: No</div>     
              </div>
           </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <b-nav-form>
                <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
              </b-nav-form>
            </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </div></div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "top-header",
  mounted() {
    this.setupFirebase();
  },
  methods: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          this.loggedIn = true;
        } else {
          // No user is signed in.
          this.loggedIn = false;
        }
      });
    },
    signOut() {
      firebase.auth().signOut()
          .then(() => {
            this.$router.replace({ name: "Login" });
          });
    }
  },
  data() {
    return {
      loggedIn: false
    };
  }
};
</script>

<style lang="scss" scoped>

</style>