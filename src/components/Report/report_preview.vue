<template>
  <div>
    <b-overlay :show="show" rounded="lg" opacity="0.9">
    <b-card no-body>
      <b-tabs >
        <b-tab class="row" v-for="(section,indexS) in sections" :key="indexS" :title="section.name">
      
          <b-card-group v-for="(question,indexQ) in section.question" :key="indexQ">
            <b-card border-variant="secondary" :header="question.questionName">
                   <b-row>
                     <b-col md="6">
                       <p style="font-weight: bold">Answer:</p>
                       <b-list-group-item v-if="question.selected === 0">Not Applicable</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 1">Below Basic</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 2">Basic</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 3">Adequate</b-list-group-item>
                       <b-list-group-item v-if="question.selected === 4">Exceptional</b-list-group-item>
                     </b-col>
                     <b-col md="6">
                     <p style="font-weight: bold">Comment:</p>
                     <textarea cols="6" v-model="question.comment" type="text" rows="2" class="form-control input-lg" name="comment" placeholder="Comment" disabled></textarea>
                     </b-col>
                   </b-row>
              </b-card>
          </b-card-group>
         
    </b-tab>
    <b-tab title= 'Recommendation'>
           <b-card border-variant="dark" header="Recommendation">
            <b-form-textarea
              id="textarea"
              v-model="recommendation"
              placeholder="Write your recommendation here"
              rows="5"
              max-rows="6"
            ></b-form-textarea>
          </b-card>
    </b-tab>
    
    </b-tabs>
    </b-card>

          <div>
            <div class="text-center">
              <b-button-group>
                <b-button variant="info" @click="save">Save</b-button>
                <b-button variant="dark" to="/Reports">Back</b-button>
              </b-button-group>
            </div>
          </div>
     
   </b-overlay>
  </div>
</template>

<script>
import { updateDocument } from "@/tools/firebaseTool";
import * as firebase from "firebase";
import { db } from "@/tools/firebaseConfig";

export default {
  name: "Report_preview",
  data() {
    return {
      report: {},
      reportData: {},
      sections: [],
      recommendation: "",
    };
  },
  

  methods: {
    save() {
      console.log(this.report.id);
      updateDocument("report", this.report.id, {
        recommendation: this.recommendation,
        isCompleted: true,
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
      });
      window.alert("Successfully saved");
    },
  },
  created: async function () {
    let report_ref = db.collection("report").doc(this.$route.params.reportId);
    this.report = await report_ref.get();
    this.reportData = this.report.data();

    for (let sectionRef of this.reportData.content) {
      let sectionPath = sectionRef.path;
      let section = await db.doc(sectionPath).get();
      this.sections.push(section.data());
    }
    this.recommendation = this.reportData.recommendation;
 
  },
  
};
</script>

<style scoped>
@import "../../css/general.css";
</style>