import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {firestorePlugin } from 'vuefire'
import {auth} from "@/tools/firebaseConfig";
import './tools/bootstrap-vue'
import {store} from '@/store/store'
import {BootstrapVue,BootstrapVueIcons} from "bootstrap-vue";

Vue.use(firestorePlugin)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(ElementUI)
Vue.config.productionTip = false
let app


auth.onAuthStateChanged(async user => {
  if (!app) {
    //wait to get user
    user = await auth .currentUser;
    //start app
    app = new Vue({
      router,
      created() {
        //redirect if user not logged in
        if (!user) {
          //this.$router.push("/Login");
        }
      },
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

