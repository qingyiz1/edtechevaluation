import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import {firestorePlugin } from 'vuefire'
import './tools/bootstrap-vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import {auth} from "@/tools/firebaseConfig";

Vue.use(firestorePlugin)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false
let app

auth.onAuthStateChanged(async user => {
  if (!app) {
    //wait to get user
    user = await auth.currentUser;

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

