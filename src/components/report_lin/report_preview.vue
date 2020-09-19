<template>
    <div>nihao</div>
</template>

<script>
// import { deleteDocument } from "@/tools/firebaseTool";
import { evaluationCollection } from "@/tools/firebaseConfig";
// import * as firebase from "firebase";


export default {
  name: "Report_preview",
  data() {
    return {
    };
  },
  methods: {
    methods1(){
    },
  },
  created: function(){
      console.log('nihao')
  },
  firestore:{
    evaluationList:evaluationCollection
  }
};
</script>

<style scoped>

</style>