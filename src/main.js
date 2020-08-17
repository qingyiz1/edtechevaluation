import './firebaseConfig';
import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import {firestorePlugin } from 'vuefire'
import axios from "axios";

Vue.prototype.$axios = axios;
Vue.use(firestorePlugin)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
