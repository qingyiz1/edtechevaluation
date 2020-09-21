<template>
    <b-container>
      <b-modal
          id="delete"
          ok-title="Confirm"
          header-bg-variant="warning"
          size="md"
          button-size="md"
          title="Are you sure?"
          centered
          ok-variant="danger"
          @ok="deleteEvaluation(evaId)">
         <div class="d-block text-center">
           <h4 style="color: red">This action will delete the evaluation permanently!</h4>
         </div>
      </b-modal>

      <b-row align-h="center">
        <b-col cols="10">
          <div v-for="eva in evaluationList" v-bind:key="eva.id" class="evaluation">
            <b-card :header="eva.frameworkId+' - '+eva.name" :title="eva.name">
              <b-form-checkbox
                  v-model="eva.isCompleted"
                  @change="changeCompleted(eva)"
              >
                <b-card-text v-if="eva.isCompleted === true">Completed</b-card-text>
                <b-card-text v-if="eva.isCompleted !== true">Not Completed</b-card-text>
              </b-form-checkbox>
              <b-card-text>
                Created by {{eva.author}} on {{getTime(eva.dateCreated)}}
                <br />
                Last Edited by {{eva.editor}} on {{getTime(eva.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/DisplayEva/'+eva.id">View</b-button>
              <b-button v-if="eva.isCompleted!==true" variant="primary" :to="'/EditEva/'+eva.id">Edit</b-button>
              <b-button variant="danger" v-b-modal.delete @click="setEvaId(eva.id)">Delete</b-button>
              <b-button v-if="eva.isCompleted===true" variant="info" :to="'/Reports/'" @click="generateReport(eva.id)">Generate Report</b-button>

            </b-card>
          </div>
        </b-col>
      </b-row>


    </b-container>
</template>

<script>
import {deleteDocument, updateDocument} from "@/tools/firebaseTool";
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
      evaId:"",
    };
  },
  methods: {
    changeCompleted(eva){
      eva.isCompleted = !eva.isCompleted
      updateDocument("evaluation",eva.id, {isCompleted:eva.isCompleted});
    },
    deleteEvaluation(evaluationId){
      deleteDocument("evaluation",evaluationId)
    },
    getTime: function (rawDate) {
      let m = new Date(rawDate.seconds * 1000);
      return m.toLocaleString();
    },
    setEvaId(id){
      this.evaId = id;
    },
    async generateReport(evaluationId){

      const Data = await getDocument("evaluation",evaluationId)
      this.evaluationInfo = Data
      let repRef = await reportCollection.doc()
      await repRef.set({
        author: this.evaluationInfo.author,
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
        evaluationId: evaluationId,
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
@import "../../css/general.css";
.evaluation{
  margin: 20px 0px;
}
.btn {
  margin: 0px 5px;
}
</style>