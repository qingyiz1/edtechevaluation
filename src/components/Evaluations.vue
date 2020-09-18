<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="8">
          <div v-for="eva in evaluationList" v-bind:key="eva.id" class="evaluation">
            <b-card :header="eva.frameworkId+' - '+eva.name" :title="eva.name">
              <b-card-text>
                Created by {{eva.author}} on {{getTime(eva.dateCreated)}}
                <br />
                Edited by {{eva.editor}} on {{getTime(eva.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/DisplayEva/'+eva.id">Preview</b-button>
              <b-button variant="primary" :to="'/EditEva/'+eva.id">Edit</b-button>
              <b-button variant="danger" @click="deleteEvaluation(eva.id)">Delete</b-button>
              <b-button variant="info" :to="'/Reports/'" @click="generateReport(eva.id)">Generate Report</b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import { deleteDocument} from "@/tools/firebaseTool";
import {evaluationCollection} from "@/tools/firebaseConfig";
import {reportCollection} from "@/tools/firebaseConfig";
import * as firebase from "firebase";
import {getDocument} from "@/tools/firebaseTool"


export default {
  name: "Evaluations",
  data() {
    return {
      evaluationList: [],
      evaluationInfo: {},
     
    };
  },
  methods: {
    deleteEvaluation(evaluationId){
      deleteDocument("evaluation",evaluationId)
    },
    getTime: function (rawDate) {
      let m = new Date(rawDate.seconds * 1000);
      return m.toLocaleString();
    },

    async generateReport(evaluationId){

      const Data = await getDocument("evaluation",evaluationId)
      this.evaluationInfo = Data
      let repRef = await reportCollection.doc()
      await repRef.set({
        reportauthor: this.evaluationInfo.author,
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
        evaluationId: this.evaluationInfo.name,
        isCompleted: false,
        name: this.evaluationInfo.name,
        content: this.evaluationInfo.section,
        recommendation:"test",
        recommendationAuthor:this.$store.getters.userProfile.nickname,
      })
    
    },

   

  },

   
  
  firestore:{
    evaluationList:evaluationCollection
  }
};
</script>



<style scoped>
@import "../css/general.css";
.evaluation{
  margin: 20px 0px;
}
.btn {
  margin: 0px 5px;
}
</style>