<template>
  <div>
    <b-overlay :show="show" rounded="lg" opacity="0.9">
    <b-card no-body>
      <b-tabs v-model="tabIndex" card>
        <b-tab class="row" v-for="(section,indexS) in sections" :key="indexS" :title="section.name">
                 <b-card-group style="margin-bottom: 20px" v-for="(question,indexQ) in section.question" :key="indexQ">
                   <b-card border-variant="secondary" :header="question.questionName">
                   <b-row>
                     <b-col md="4">
                       <p style="font-weight: bold">Answer:</p>
                       <b-list-group-item v-if="question.selected === 0">Not Applicable</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 1">Below Basic</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 2">Basic</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 3">Adequate</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 4">Exceptional</b-list-group-item>
                     </b-col>
                     <b-col md="8">
                     <p style="font-weight: bold">Comment:</p>
                     <textarea cols="6" v-model="question.comment" type="text" rows="2" class="form-control input-lg" name="comment" placeholder="Comment" disabled></textarea>
                     </b-col>
                   </b-row>
                   </b-card>
                  </b-card-group>

        </b-tab>
        <b-tab v-if="countdown === 0" title="Summary">
          <b-card border-variant="dark" header="Summary">
            <p>{{summary}}</p>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>

    <!-- Control buttons-->
    <div class="text-center" style="margin-bottom: 2rem">
      <b-button-group class="mt-2">
        <b-button id="previousBtn" variant="info" @click="previousPage">Previous</b-button>
        <b-button id="nextBtn" variant="info" @click="nextPage">Next</b-button>
        <b-button id="backBtn" variant="dark" to="/evaluation" >Back</b-button>
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
      summary:"",
      countdown:1,
    };
  },
  methods: {
    nextPage(){
      this.tabIndex++;
      window.scrollTo(0,0)
    },
    previousPage(){
      this.tabIndex--;
      window.scrollTo(0,0)
    },
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
  mounted: async function () {
    //Load sections of the framework from database
    let sectionsRef
    await evaluationCollection.doc(this.$route.params.evaId)
        .get()
        .then((doc) => {
          sectionsRef = doc.data().section;
          this.summary = doc.data().summary;
          for(const sectionRef of sectionsRef){
            db.doc(sectionRef.path).get().then((docRef)=>{
              this.sections.push(docRef.data())
            }).catch((error) => {
              console.log("Error getting documents: ", error);
            });
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

    this.toggleOverlay()
    this.loadSummary()
  },
};
</script>



<style scoped>
@import "../../css/general.css";
</style>



