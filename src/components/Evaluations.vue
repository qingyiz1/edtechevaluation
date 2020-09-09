<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="7">
          <div v-on:click="clickEvaluation" v-for="eva in evaluationList" v-bind:key="eva.path" class="evaluation">
            <b-card :header="eva.name" :footer="eva.frameworkId" :title="eva.name">
              <b-card-text>
                Created by {{eva.author}} {{getTime(eva.dateCreated)}}
                <br />
                Edited {{getTime(eva.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/DisplayEva/'+eva.path">Edit</b-button>
              <b-button variant="primary">Download Report</b-button>
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
          let tmp = doc.data();
          tmp.path = doc.id;
          this.evaluationList.push(tmp);
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
.evaluation{
  margin: 20px 0px;
}
.btn {
  margin: 0px 40px;
}
</style>