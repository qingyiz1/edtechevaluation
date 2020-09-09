<template>
    <b-container class="bv-example-row">
      <b-row align-h="center">
        <b-col cols="7">
          <div v-on:click="createEva" v-for="eva in evaluationList" v-bind:key="eva.id">
            <b-card :header="eva.name" :footer="eva.frameworkId" :title="eva.name">
              <b-card-text>
                Created by {{eva.author}} {{getTime(eva.dateCreated)}}
                <br />
                Edited {{getTime(eva.dateEdited)}}
              </b-card-text>
              <b-button href="#" variant="primary">Edit</b-button>
              <b-button href="#" variant="primary">Download Report</b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import {createDocument} from "@/tools/firebaseTool";
import * as firebase from "firebase";
import {db} from "@/tools/firebaseConfig";
const evaluationPath = "evaluation/";

export default {
  name: "Evaluations",
  data() {
    return {
      state: "loading",
      firebaseData: null,
      formData: {},
      errorMessage: "",

      evaluationList: [],
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
    getTime: function (rawDate) {
      let m = new Date(rawDate.seconds * 1000);

      return m.toLocaleString();
    },
  },
  created: async function () {

    db.collection(evaluationPath)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          this.evaluationList.push(doc.data());
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  },
  firestore(){
    return{
      evaluationList:db.collection(evaluationPath)
    }
  }
};
</script>



<style scoped>
@import "../css/general.css";
@import "../css/evas.css";
</style>