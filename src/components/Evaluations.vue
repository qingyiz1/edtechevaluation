<template>
  <div>
    <div class="evaluation" v-on:click="createEva" v-for="eva in evaluationList" v-bind:key="eva.id">
      <div class="evaluation-title">
        <div class="evaluation-title1">{{eva.name}}</div>
        <div class="evaluation-state" v-if="eva.isCompleted">completed</div>
      </div>

      <div class="evaluation-author">Created By: {{eva.author}}</div>

      <div class="evaluation-footer">
        <div class="evaluation-date">Start From: {{getDate(eva.dateCreated)}}</div>
        <div class="evaluation-framework">{{eva.frameworkId}}</div>
      </div>
    </div>
  </div>
  <!-- <div id="app">

    <div v-if="state === 'synced'">
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
    <div v-else-if="state === 'loading'">Loading...</div>


    <form @submit.prevent="updateFirebase" @input="fieldUpdate">

      <input type="text" name="name" v-model="formData.name" />
      <input type="text" name="section" v-model="formData.section" />
      <input type="text" name="question" v-model="formData.question" />

      <button type="submit" v-if="state === 'modified'">Save Changes</button>

    </form>
  </div>-->
</template>

<script>
// import {getDocuments} from "@/tools/firebaseTool";
import { createDocument } from "@/tools/firebaseTool";
import { db } from "@/tools/firebaseConfig";
import * as firebase from "firebase";
const evaluationPath = "evaluation/";
export default {
  name: "Evaluations",
  data() {
    return {
      state: "loading",
      firebaseData: null,
      formData: {},
      errorMessage: "",

      evaluationList: []
    };
  },
  methods: {
    createEva: async function () {
      let evaData = {
        author: "Admin",
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
        frameworkId: "framework1",
        id: "evaluation2",
        isCompleted: true,
        name: "Edtech Evaluation2",
        section: "",
        summary: "This is a summary",
      };
      createDocument(evaluationPath, "evaluation2", evaData);
    },
    getDate: function(rawDate){
      let m = new Date(rawDate.seconds*1000)

      return m.toDateString();
    }
  },
  created: async function () {
    //How can I use firebaseTool.js/getDocuments() ?????
    db.collection(evaluationPath)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          this.evaluationList.push(doc.data())
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  },
};
</script>



<style scoped>
@import "../css/general.css";
@import "../css/evas.css";
</style>