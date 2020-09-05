<template>
  <body class="text-center">
    <form class="form-signin">
          <b-form-select v-model="selected" :options="options"></b-form-select>
          <b-form-select v-model="selected" :options="options" size="sm" class="mt-3"></b-form-select>

    <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
    </form>
  </body>
</template>

//test
<script>
import {db} from "@/tools/firebaseConfig"
//import * as firebase from "firebase/app"
import "firebase/auth"

export default {
  name:"Profile",
  mounted() {
  },
  methods: {
  },
  data(){
    return {
      selected: null,
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: 'This is First option' },
          { value: 'b', text: 'Selected Option' },
          { value: { C: '3PO' }, text: 'This is an option with object value' },
          { value: 'd', text: 'This one is disabled', disabled: true }],
      users:'',
    }
  },
  firestore(){
    return{
      users: db.collection("userInfo")
    }
  },

}

</script>



<style scoped>
@import "../css/general.css";
</style>