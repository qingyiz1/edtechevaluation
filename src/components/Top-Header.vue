<template>
  <div style="width: 100%">
    <div>
      <b-navbar style="color:white" toggleable="lg"  type="dark" class="header" >
        <b-navbar-brand to="/"><img src="../assets/EdTech.png" height="30px" width="100px"></b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="navbar">
            <b-nav-item v-if="!$store.getters.loggedIn" to="/login">Login</b-nav-item>
            <b-nav-item v-if="userdata['role']==='Senior Consultant'" to="/createuser"><div :style="CreateUser">Create User</div></b-nav-item>
            <b-nav-item v-if="$store.getters.loggedIn" to="/framework" ><div :style="Framework">Framework</div></b-nav-item>
            <b-nav-item v-if="$store.getters.loggedIn" to="/evaluation" ><div :style="Evaluation">Evaluation</div></b-nav-item>
            <b-nav-item v-if="$store.getters.loggedIn" to="/reports" ><div :style="Report">Report</div></b-nav-item>
            <b-nav-item v-if="$store.getters.loggedIn" :to=" '/profile/' + this.userdata['email']" ><div :style="Profile">Profile</div></b-nav-item>
            <b-nav-item v-if="$store.getters.loggedIn&&$store.getters.userProfile['role']==='Senior Consultant'" to="/userlist" ><div :style="UserList">User List</div></b-nav-item>
            <b-nav-item v-if="$store.getters.loggedIn" @click="signOut" ><div :style="SignOut">Sign out</div></b-nav-item>
            <b-nav-text v-if="$store.getters.loggedIn"></b-nav-text>
          </b-navbar-nav>
        </b-collapse>


        <!-- Right aligned nav items -->
        <!--            <b-navbar-nav class="ml-auto">-->
        <!--              <b-nav-form>-->
        <!--                <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>-->
        <!--                <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>-->
        <!--              </b-nav-form>-->
        <!--            </b-navbar-nav>-->
        <b-avatar :hidden="isMobile" class="avatar" variant="info" :text="Role"></b-avatar>
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
    CreateUser () {
      let style = "color:rgba(255, 255, 255, 0.7)";
      if (this.$route.name === "CreateUser") {
        style = "color:rgba(255, 255, 255, 1)"
      }
      return style
    },
    Framework () {
      let style = "color:rgba(255, 255, 255, 0.7)";
      if (this.$route.name === "Framework") {
        style = "color:rgba(255, 255, 255, 1)"
      }
      return style
    },
    Evaluation () {
      let style = "color:rgba(255, 255, 255, 0.7)";
      if (this.$route.name === "Evaluation") {
        style = "color:rgba(255, 255, 255, 1)"
      }
      return style
    },
    Report () {
      let style = "color:rgba(255, 255, 255, 0.7)";
      if (this.$route.name === "reports") {
        style = "color:rgba(255, 255, 255, 1)"
      }
      return style
    },
    Profile () {
      let style = "color:rgba(255, 255, 255, 0.7)";
      if (this.$route.name === "Profile") {
        style = "color:rgba(255, 255, 255, 1)"
      }
      return style
    },
    UserList () {
      let style = "color:rgba(255, 255, 255, 0.7)";
      if (this.$route.name === "Userlist") {
        style = "color:rgba(255, 255, 255, 1)"
      }
      return style
    },
    SignOut () {
      let style = "color:rgba(255, 255, 255, 0.7)";
      return style
    },
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
    isMobile () {
      if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    }

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
}

.avatar {
  margin-right: 2rem;
}

</style>