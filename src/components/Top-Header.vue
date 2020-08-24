<template>
  <div>
    <div v-if="loggedIn">Logged in: Yes</div>
    <div v-else>Logged in: No</div>
    <button v-if="loggedIn" @click="signOut">Sign out</button>
  </div>
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
div {
  color: inherit;
}
</style>