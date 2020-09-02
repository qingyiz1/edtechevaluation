import './tools/firebaseConfig';
import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import {firestorePlugin } from 'vuefire'
import axios from "axios";
import firebase from "firebase";
import './tools/bootstrap-vue'
import {store} from '@/store/store'

Vue.prototype.$axios = axios;
Vue.use(firestorePlugin)
Vue.config.productionTip = false
let app

firebase.auth().onAuthStateChanged(async user => {
  if (!app) {
    //wait to get user
    user = await firebase.auth().currentUser;
    //start app
    app = new Vue({
      router,
      created() {
        //redirect if user not logged in
        if (!user) {
          this.$router.push("/Login");
        }
      },
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

