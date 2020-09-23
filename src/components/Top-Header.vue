<template>
  <div style="width: 100%">
    <div id="navContainer">
      <b-navbar toggleable="lg" class="header" >
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-navbar-brand style="margin: auto;padding-top: 15px;padding-bottom: 15px;padding-right: 25px" to="/"><img src="../assets/EdTech.png" height="30px" width="100px"></b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="navbar">
            <b-nav-item v-if="userdata['role']==='Senior Consultant'" to="/createuser">Create User</b-nav-item>
            <b-nav-item to="/framework" >Framework</b-nav-item>
            <b-nav-item to="/evaluation" >Evaluation</b-nav-item>
            <b-nav-item to="/reports" >Report</b-nav-item>
            <b-nav-item :to=" '/profile/' + this.userdata['email']" >Profile</b-nav-item>
            <b-nav-item v-if="$store.getters.userProfile['role']==='Senior Consultant'" to="/userlist" >User List</b-nav-item>
            <b-nav-item @click="signOut" >Sign out</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
        <b-avatar class="avatar" variant="info" :text="Role"></b-avatar>

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
import {db, auth} from "@/tools/firebaseConfig";

export default {
  name: "top-header",
  mounted() {
    this.$store.dispatch('fetchUserProfile',auth.currentUser)
  },
  computed:{
    Role () {
      switch (this.userdata['role']) {
        case "Senior Consultant":
          return "SC"
        case "Contultant":
          return "CO"
        default:
          return "EL"
      }
    },
  },
  methods: {
    signOut() {
      auth.signOut()
          .then(() => {
            this.$router.replace({ name: "Login" });
            this.$store.commit('loggedOut')
          });
    }
  },
  data() {
    return {
      isAdmin: false,
      userdata:'',
    };
  },
  firestore(){
    return{
      userdata: db.collection("userInfo").doc(auth.currentUser.email)
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-image: linear-gradient(45deg,#37B6EE,#2187F0);
  font-weight: 500;
  font-size: 1.25rem;
  box-shadow: 0 8px 10px 0 #C3C2C2;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  min-height: 60px;
  padding-top: 0;
  padding-bottom: 0;
}
#navContainer{
  height: 66px;

}

.avatar {
  margin-right: 2rem;
  position: fixed;
  top:6px;
  right: 0;
}

.navbar-light .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.66);
}

.navbar-light .navbar-nav .nav-link:hover, .navbar-light .navbar-nav .nav-link:focus {
  color: rgb(255, 255, 255);
}

[aria-current]:not([aria-current="false"]) {
  font-weight: bold;
  color: white !important;
}
</style>