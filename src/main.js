import './tools/firebaseConfig';
import Vue from 'vue'
import ElementUI, { MessageBox, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from "./router"
import {firestorePlugin } from 'vuefire'
import axios from "axios";
import firebase from "firebase";
import './tools/bootstrap-vue'


Vue.prototype.$axios = axios;
Vue.use(firestorePlugin)
Vue.use(ElementUI)
Vue.config.productionTip = false
let app
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

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
      render: h => h(App)
    }).$mount("#app");
  }
});