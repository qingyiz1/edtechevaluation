<template>
    <!-- <b-container> -->
  <b-overlay
      :show="show"
      opacity="0.9"
      @hidden="onHidden">
      <div :class="isMobile? 'mobile': 'desktop'">
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
            <h4 class="list-title" v-if="isMobile">Evaluations</h4>
            <b-input-group size="sm" class="list-search">
              <b-form-input type="search" placeholder="Search"></b-form-input>
              <b-input-group-append is-text>
                <b-icon icon="search"></b-icon>
              </b-input-group-append>
            </b-input-group>
          </b-row>
          <b-row no-gutters class="list list-header" align-content="center" v-if="!isMobile">
            <b-col cols="1">Complete</b-col>
            <b-col cols="2">Evaluation Name</b-col>
            <b-col cols="2">Framework</b-col>
            <b-col cols="1">Author</b-col>
            <b-col cols="2">Created Time</b-col>
            <b-col cols="1">Editor</b-col>
            <b-col cols="2">Edited Time</b-col>
            <b-col cols="1">Action</b-col>
          </b-row>
          <h3 v-if="this.ownEvaluations.length === 0">You may not have started any evaluation yet or the connection to database is lost, try to reload this page!</h3>
          <!-- layout for desktop -->
          <b-row 
          :hidden="isMobile"
          no-gutters
          v-for="eva in ownEvaluations" v-bind:key="eva.id"
          class="list list-content" 
          align-content="center" 
          align-v="center">
            <b-col cols="1" >
              <b-form-checkbox
                  v-model="eva.isCompleted"
                  class="action_btn"
                  name="check-button"
                  size="lg"
                  switch
                  @change="changeCompleted(eva)">
              </b-form-checkbox>
            </b-col>
            <b-col cols="2" @click="displayEva(eva.id)" class="list-content-display" v-b-tooltip.hover title="View Evaluation">{{eva.name}}</b-col>
            <b-col cols="2">{{eva.frameworkName}}</b-col>
            <b-col cols="1">{{eva.author}}</b-col>
            <b-col cols="2">{{getTime(eva.dateCreated)}}</b-col>
            <b-col cols="1">{{eva.editor}}</b-col>
            <b-col cols="2">{{getTime(eva.dateEdited)}}</b-col>
            <b-col cols="1">
              <b-button
              variant="link"
              @click="generateReport(eva.id)"
              class="action_btn"
              style="padding:0"
              size="sm"
              :disabled="eva.isCompleted !== true"
              v-b-tooltip.hover title="Generate Report"><b-avatar
                  style="background:#006eb6;color: white"
                  icon="clipboard-data" size="1.5rem"></b-avatar></b-button>
              <b-button
                  class="action_btn"
              variant="link"
              style="padding:0"
              :to="'/EditEva/'+eva.id"
                  v-b-tooltip.hover title="Edit Evaluation">
                <b-avatar
              variant="success"
              icon="pencil" size="1.5rem"></b-avatar></b-button>
              <b-button
                  class="action_btn"
              v-b-modal.delete 
              variant="link" 
              style="padding:0"
              @click="setEvaId(eva.id)"
                  v-b-tooltip.hover title="Delete Evaluation"><b-avatar variant="danger" icon="trash" size="1.5rem"></b-avatar></b-button>
            </b-col>
          </b-row>

          <!-- layout for mobile -->
          <b-row 
          :hidden="!isMobile"
          no-gutters
          v-for="eva in ownEvaluations" v-bind:key="eva.id"
          class="list list-content" 
          align-content="center" 
          align-v="center">
              <b-col cols="9">
                <b-col class="item-title" @click="displayEva(eva.id)">{{eva.name}}</b-col>
                <b-col class="item-content"><b-icon icon="person-fill" style="margin-right:10px;font-size:12px"></b-icon>{{eva.author}}</b-col>
                <b-col class="item-content"><b-icon icon="calendar3" style="margin-right:10px;font-size:12px"></b-icon>{{getTime(eva.dateCreated)}}</b-col>
                <b-col class="item-content"><b-icon icon="file-earmark-medical" style="margin-right:10px;font-size:12px"></b-icon>{{eva.frameworkName}}</b-col>
              </b-col>
              <b-col cols="3" style="text-align:right">
                <b-dropdown class="action-menu" variant="link" no-caret>
                  <template v-slot:button-content>
                    <b-icon icon="three-dots"></b-icon>
                  </template>
                  <b-dropdown-item
                  @click="generateReport(eva.id)"
                  :disabled="eva.isCompleted !== true">Generate Report</b-dropdown-item>
                  <b-dropdown-item
                  :to="'/EditEva/'+eva.id">Edit</b-dropdown-item>
                  <b-dropdown-item
                  v-b-modal.delete 
                  @click="setEvaId(eva.id)"
                  >Delete</b-dropdown-item>
                </b-dropdown>
                <b-form-checkbox
                    class="action_btn"
                    v-model="eva.isCompleted"
                    name="check-button"
                    switch
                    @change="changeCompleted(eva)">
                </b-form-checkbox>
              </b-col>
            </b-row>
        </div>
      </div>
  </b-overlay>
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
      isMobile:false
    };
  },
  computed:{
    ownEvaluations(){
      if(this.$store.getters.userProfile.role === "Senior Consultant"){
        return this.evaluationList;
      }else{
        return this.evaluationList.filter(eva=> eva.authorUid === this.$store.getters.userProfile.uid)
      }
    }
  },
  methods: {
    onHidden(){
      setTimeout(()=>{
        this.show = false
      },600)
    },
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
        author: this.$store.getters.userProfile.nickname,
        authorUid: this.$store.getters.userProfile.uid,
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
        evaluationId: this.evaluationInfo.id,
        evaluationName: this.evaluationInfo.name,
        isCompleted: false,
        name: this.evaluationInfo.name,
        content: this.evaluationInfo.section,
        recommendation:"",
        recommendationAuthor:this.$store.getters.userProfile.nickname,
      })
      await this.$router.push("/report_view_online/" + repRef.id)
    },
  },
  firestore:{
    evaluationList:evaluationCollection
  },
  mounted() {
    this.onHidden()
    if( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ) {
      this.isMobile = true
    }
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