<template>
    <!-- <b-container> -->
      <div>
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
        <div class="list-container">
          <b-row no-gutters class="functional-container">
            <b-input-group size="sm" class="list-search">
              <b-form-input type="search" placeholder="Search"></b-form-input>
              <b-input-group-append is-text>
                <b-icon icon="search"></b-icon>
              </b-input-group-append>
            </b-input-group>
          </b-row>
          <b-row no-gutters class="list list-header" align-content="center">
            <b-col cols="1">Author</b-col>
            <b-col cols="2">Evaluation Name</b-col>
            <b-col cols="2">Framework</b-col>
            <b-col cols="2">Created Time</b-col>
            <b-col cols="2">Edited Time</b-col>
            <b-col cols="1">Complete</b-col>
            <b-col cols="2">Action</b-col>
          </b-row>
          <b-row 
          no-gutters
          v-for="eva in evaluationList" v-bind:key="eva.id"
          class="list list-content" 
          align-content="center" 
          align-v="center">
            <b-col cols="1">{{eva.author}}</b-col>
            <b-col cols="2" @click="displayEva(eva.id)" class="list-content-display">{{eva.name}}</b-col>
            <b-col cols="2">{{eva.frameworkId}}</b-col>
            <b-col cols="2">{{getTime(eva.dateCreated)}}</b-col>
            <b-col cols="2">{{getTime(eva.dateEdited)}}</b-col>
            <b-col cols="1" >
              <b-form-checkbox
              v-model="eva.isCompleted"
              name="check-button"
              size="lg"
              switch
              @change="changeCompleted(eva)">
              </b-form-checkbox>
            </b-col>
            
            <b-col cols="2">
              <b-button 
              :to="'/Reports/'" variant="info" 
              @click="generateReport(eva.id)"
              class="list-inline-btn-sm"
              size="sm"
              :disabled="eva.isCompleted != true">Generate</b-button>
              <b-button
              variant="link"
              style="padding:0"
              :to="'/EditEva/'+eva.id"><b-avatar 
              variant="success"
              icon="pencil" size="2rem"></b-avatar></b-button>
              <b-button 
              v-b-modal.delete 
              variant="link" 
              style="padding:0"
              @click="setEvaId(eva.id)"><b-avatar variant="danger" icon="trash" size="2rem"></b-avatar></b-button>
            </b-col>
          </b-row>
        </div>
      </div>

      <!-- <b-row align-h="center">
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
      </b-row> -->


    <!-- </b-container> -->
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
      show:"",
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
      return m.toLocaleString('en-US');
    },
    setEvaId(id){
      this.evaId = id;
    },
    displayEva: function (evaID) {
      this.$router.push("/DisplayEva/" + evaID)
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
        content: this.evaluationInfo.section.path,
        recommendation:"",
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
@import "../../css/list.css";

/* .evaluation{
  margin: 20px 0px;
} */
/* .btn {
  margin: 0px 5px;
} */
</style>