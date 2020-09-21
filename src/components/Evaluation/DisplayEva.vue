<template>
  <div>
    <b-overlay :show="show" rounded="lg" opacity="0.9">
    <b-card no-body>
      <b-tabs v-model="tabIndex" card>
        <b-tab class="row" v-for="(section,indexS) in sections" :key="indexS" :title="section.name">
                 <b-list-group v-for="(question,indexQ) in section.question" :key="indexQ">
                   <b-row no-gutters>
                   <b-col md="2">
                   <p style="margin:revert">Question {{indexQ+1}}</p>
                   </b-col>
                   <b-col md="4">
                    <b-list-group-item>{{ question.questionName }}</b-list-group-item>
                   </b-col>
                     <b-col md="2">
                       <p style="margin:revert">Answer {{indexQ+1}}</p>
                     </b-col>
                     <b-col md="4">
                       <b-list-group-item v-if="question.selected === 0">Not Applicable</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 1">Below Basic</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 2">Basic</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 3">Adequate</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 4">Exceptional</b-list-group-item>
                     </b-col>
                   </b-row>
                  </b-list-group>

        </b-tab>
        <b-tab v-if="countdown === 0" title="Summary">
          <b-card border-variant="dark" header="Summary">
            <p>{{summary}}</p>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>

    <!-- Control buttons-->
    <div class="text-center">
      <b-button-group class="mt-2">
        <b-button variant="info" @click="tabIndex--">Previous</b-button>
        <b-button variant="info" @click="tabIndex++">Next</b-button>
        <b-button variant="dark" to="/evaluation" >Back</b-button>
      </b-button-group>
    </div>

    </b-overlay>
  </div>
</template>

<script>
//import * as firebase from "firebase";
import {db, evaluationCollection} from "@/tools/firebaseConfig";

export default {
  name: "EditEva",
  data() {
    return {
      show:true,
      tabIndex: 1,
      sections: [],
      report: "",
      summary:"",
      countdown:1,
    };
  },
  methods: {
    loadSummary(){
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // your action
        this.countdown = 0;
        this.show = false
      }, 1000);
    },
    toggleOverlay(){
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // your action
        this.show = !this.show
      }, 600);
    },
  },
  created: async function () {
    //Load sections of the framework from database
    let sectionsRef
    await evaluationCollection.doc(this.$route.params.evaId)
        .get()
        .then((doc) => {
          sectionsRef = doc.data().section;
          this.summary = doc.data().summary;
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

    for(const sectionRef of sectionsRef){
      db.doc(sectionRef.path).get().then((docRef)=>{
        this.sections.push(docRef.data())
      })
    }
    this.toggleOverlay()
    this.loadSummary()
  },
};
</script>



<style scoped>
@import "../../css/general.css";
.section {
  margin-bottom: 30px;
  text-align: left;
}
.btn {
  margin: 0px 40px;
}
</style>



