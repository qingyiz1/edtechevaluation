<template>
    <b-container>
      <b-modal
          id="delete"
          button-size="md"
          centered
          header-bg-variant="warning"
          ok-title="Confirm"
          ok-variant="danger"
          size="md"
          title="Are you sure?"
          body-text-variant="danger"
          @ok="deleteEvaluation(evaId)">
         <div class="d-block text-center">
           <h4>This action will delete the evaluation permanently!</h4>
         </div>
      </b-modal>

      <b-row align-h="center">
        <b-col cols="10">
          <div v-for="eva in evaluationList" v-bind:key="eva.id" class="evaluation">
            <b-card v-if="eva.authorUid === $store.getters.userProfile.uid || $store.getters.userProfile.role === 'Senior Consultant'" :header="eva.frameworkId+' - '+eva.name" :title="eva.name">
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
              <b-button :to="'/DisplayEva/'+eva.id" variant="primary">View</b-button>
              <b-button v-if="eva.isCompleted!==true" :to="'/EditEva/'+eva.id" variant="primary">Edit</b-button>
              <b-button v-b-modal.delete variant="danger" @click="setEvaId(eva.id)">Delete</b-button>
              <b-button v-if="eva.isCompleted===true" :to="'/Reports/'" variant="info" @click="generateReport(eva.id)">Generate Report</b-button>

            </b-card>
          </div>
        </b-col>
      </b-row>


    </b-container>
</template>

<script>
import {deleteDocument, updateDocument} from "@/tools/firebaseTool";
import {db, evaluationCollection} from "@/tools/firebaseConfig";
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
    async deleteEvaluation(evaluationId){
      let sectionsRef;
      await evaluationCollection.doc(evaluationId)
          .get()
          .then((doc) => {
            sectionsRef = doc.data().section;
            for(const sectionRef of sectionsRef){
              db.doc(sectionRef.path).delete()
            }
            deleteDocument("evaluation",evaluationId)
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
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
@import "../../css/general.css";
.evaluation{
  margin: 20px 0px;
}
.btn {
  margin: 0px 5px;
}
</style>