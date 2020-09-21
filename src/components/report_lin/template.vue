<template></template>

<script>
import { deleteDocument } from "@/tools/firebaseTool";
import { evaluationCollection } from "@/tools/firebaseConfig";
import * as firebase from "firebase";


export default {
  name: "template",
  data() {
    return {
    };
  },
  methods: {
    methods1(){
    },
  },
  firestore:{
    evaluationList:evaluationCollection
  }
};
</script>

<style scoped>
</style>