<template>
  <div>
    <b-overlay :show="show" rounded="lg" opacity="0.9">
    <b-card no-body>
<!--      <b-progress style="position: fixed;top:0;height: 10px;width: 100%;z-index: 1000" v-show="value < 90" :value="value" :max="max" animated></b-progress>-->
      <b-alert style="position: fixed;top:0;width: 100%;z-index: 1000"
          id="saveEvaAlert"
          :show="dismissCountDown"
          dismissible
          fade
          variant="success"
          @dismiss-count-down="countDownChanged"
      ><p>Evaluation Successfully Saved!</p></b-alert>

      <b-alert style="position: fixed;top:0;width: 100%;z-index: 1000"
               id="completeEvaAlert"
               :show="dismissCountDown2"
               dismissible
               fade
               variant="warning"
               @dismiss-count-down="countDownChanged2"
      ><p>Evaluation Marked as Completed!</p></b-alert>
      <b-tabs v-model="tabIndex" card>
        <b-tab class="row" v-for="(section,indexS) in sections" :key="indexS" :title="section.name">
          <b-card-group style="margin-bottom: 20px" v-for="(question,indexQ) in section.question" :key="indexQ" deck>
            <b-card border-variant="secondary" :header="question.questionName">
              <b-row no-gutters>
              <b-col md="6">
              <b-list-group>
                <b-list-group-item :class="{active: question.selected === 0}" button @click="select(indexS,indexQ,0)">Not Applicable</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 1}" button @click="select(indexS,indexQ,1)">Below Basic</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 2}" button @click="select(indexS,indexQ,2)">Basic</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 3}" button @click="select(indexS,indexQ,3)">Adequate</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 4}" button @click="select(indexS,indexQ,4)">Exceptional</b-list-group-item>
              </b-list-group>
              </b-col>

              <b-card class="w-100" border-variant="secondary" header="Description">
              <b-card-text>
                {{question.descriptions[question.selected]}}
              </b-card-text>
              <p style="font-weight: bold">Comment:</p>
              <textarea cols="6" v-model="question.comment" type="text" rows="2" class="form-control input-lg" name="comment" placeholder="Comment"></textarea>

              </b-card>
              </b-row>
            </b-card>
          </b-card-group>
        </b-tab>

        <b-tab v-if="countdown === 0" title="Summary">
          <b-card border-variant="dark" header="Summary">
            <textarea cols="12" v-model="summary" type="text" rows="5" class="form-control input-lg" name="summary" placeholder="Summary"></textarea>
          </b-card>
        </b-tab>
        <b-tab v-if="this.value>80" title="Evaluation saved" disabled></b-tab>
        <b-tab v-if="this.value<=80" title="Saving" disabled></b-tab>
      </b-tabs>
    </b-card>



      <!-- Control buttons-->
    <div class="text-center">
      <b-button-group class="mt-2">
        <b-button variant="success" @click="saveEvaluation">Save</b-button>
        <b-button variant="warning" @click="completeEvaluation" >Complete</b-button>
        <b-button variant="info" @click="tabIndex--">Previous</b-button>
        <b-button variant="info" @click="tabIndex++">Next</b-button>
        <b-button variant="dark" to="/evaluation" >Back</b-button>

      </b-button-group>

    </div>

    </b-overlay>


  </div>
</template>

<script>
import{debounce} from 'debounce'
import {db,evaluationCollection} from "@/tools/firebaseConfig";
import * as firebase from "firebase";
import {updateDocument} from "@/tools/firebaseTool";

export default {
  name: "EditEva",
  mounted() {
    this.loadSummary()
  },
  data() {
    return {
      value: 0,
      max: 100,
      tabIndex: 1,
      sections: [],
      summary:"",
      report: "",
      countdown:1,
      show:true,
      dismissSecs:2.5,
      dismissCountDown:0,
      dismissCountDown2:0,
      sectionsRef:"",
      isTyping: false,
    };
  },
  watch:{
    "summary":{
      handler:'debouncedUpdate'
    },
    "sections":{
      handler: 'getSomeVal',
      deep: true
    }
  },
  methods: {
    debouncedUpdate: debounce(function() {
      this.updateSummary()
    }, 3000),
    updateSummary(){
      this.getSomeVal()
    },
    getSomeVal(){
      let increment;
      this.value = 0
      increment = setInterval(()=>{
        if(this.value < this.max)this.value+=15
      },400)
      setTimeout(()=>{
        clearInterval(increment)
      },3000)

      if (this.saveInterval) clearTimeout(this.saveInterval);
      this.saveInterval = setTimeout(() => {
        // your action
        this.updateDatabase()
      }, 3000);
    },
    loadSummary(){
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // your action
        this.countdown = 0;
        this.show = false
      }, 1000);
    },
    select(indexS,indexQ,option){
      this.sections[indexS].question[indexQ].selected = option
    },
    async saveEvaluation() {
      await this.updateDatabase()
      this.dismissCountDown = this.dismissSecs
    },
    async updateDatabase(){
      for (let section of this.sections) {
        await db.collection("section").doc(section.id)
            .update({
              question:section.question,
            })
            .catch(function (error) {
              window.alert("Error updating evaluation: "+error);
            });
      }
      await evaluationCollection.doc(this.$route.params.evaId)
          .update({
            summary:this.summary,
            editor:this.$store.getters.userProfile.nickname,
            editorUid:this.$store.getters.userProfile.uid,
            dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
          })
          .catch(function (error) {
            window.alert("Error updating evaluation: "+error);
          });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    countDownChanged2(dismissCountDown){
      this.dismissCountDown2 = dismissCountDown
    },
    completeEvaluation(){
      this.dismissCountDown2 = this.dismissSecs
      updateDocument("evaluation",this.$route.params.evaId, {isCompleted:true});
    },
  },
  created: async function () {
    //Load evaluation data from database
    await evaluationCollection.doc(this.$route.params.evaId)
      .get()
      .then((doc) => {
        this.sectionsRef = doc.data().section;
        this.summary = doc.data().summary;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    for(const sectionRef of this.sectionsRef){
      db.doc(sectionRef.path).get().then((docRef)=>{
        this.sections.push(docRef.data())
      })
    }
  },

};
</script>



<style scoped>
@import "../../css/general.css";
</style>



