<template>
  <div id="app">
    
    <!-- <div v-if="state === 'synced'">
      Form is synced with Firestore
    </div>
    <div v-else-if="state === 'modified'">
      From data changed, will sync with Firebase
    </div>
    <div v-else-if="state === 'revoked'">
      From data and Firebase revoked to original data
    </div>
    <div v-else-if="state === 'error'">
      Failed to save to Firestore. {{ errorMessage }}
    </div>
    <div v-else-if="state === 'loading'">Loading...</div> -->
  <div>
    <b-button variant="success" @click="createNewFrameowrk">Create a New Framework</b-button>
  </div>
  </div>

</template>

<script>
import {db} from "@/tools/firebaseConfig"
// import {router} from "@/router/index.js"
// import {debounce} from 'debounce'
const frameworkPath = "framework/"+"framework1"

export default {
  name: "Framework",
  data(){
    return{
      state: 'loading',
      firebaseData:null,
      formData:{},
      errorMessage:''
    }
  },
  firestore(){
    return{
      firebaseData: db.doc(frameworkPath),
    }
  },
  methods:{
  //   async updateFirebase(){
  //     try{
  //       await db.doc(frameworkPath).set(this.formData)
  //       this.state = 'synced'
  //     }catch(error){
  //       this.errorMessage = JSON.stringify(error)
  //       this.state = 'error'
  //     }
  //   },
  //   fieldUpdate() {
  //     this.state = 'modified';
  //     this.debouncedUpdate();
  //   },
  //   debouncedUpdate: debounce(function() {
  //     this.updateFirebase()
  //   }, 1500)
  // },
  // created: async function () {
  //   const docRef = db.doc(frameworkPath);

  //   let data = (await docRef.get() ).data();

  //   if (!data) {
  //     data = { name: '', section: '', question: '' }
  //     await docRef.set(data)
  //   }

  //   this.formData = data;
  //   this.state = 'synced'
  // },
  createNewFrameowrk: function () {
   this.$router.push('/framework/new_framework')
  },
  }
}
</script>



<style scoped>
@import "../css/general.css";
</style>