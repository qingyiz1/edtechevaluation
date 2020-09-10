<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="7">
          <div v-for="eva in evaluationList" v-bind:key="eva.id" class="evaluation">
            <b-card :header="eva.frameworkId+' - '+eva.name" :title="eva.name">
              <b-card-text>
                Created by {{eva.author}} on {{getTime(eva.dateCreated)}}
                <br />
                Edited on {{getTime(eva.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/EditEva/'+eva.id">Edit</b-button>
              <b-button variant="danger" @click="deleteEvaluation(eva.id)">Delete</b-button>
              <b-button variant="primary">Download Report</b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import {createDocument, deleteDocument} from "@/tools/firebaseTool";
import * as firebase from "firebase";
import {db} from "@/tools/firebaseConfig";
const evaluationPath = "evaluation/";

export default {
  name: "Evaluations",
  data() {
    return {
      evaluationList: [],
    };
  },
  methods: {
    clickEvaluation: async function () {
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
    deleteEvaluation(evaluationId){
      deleteDocument("evaluation",evaluationId)
    },
    getTime: function (rawDate) {
      let m = new Date(rawDate.seconds * 1000);
      return m.toLocaleString();
    },
  },
  firestore:{
    evaluationList:db.collection(evaluationPath)
  }
};
</script>



<style scoped>
@import "../css/general.css";
.evaluation{
  margin: 20px 0px;
}
.btn {
  margin: 0px 40px;
}
</style>