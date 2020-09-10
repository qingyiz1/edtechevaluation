<template>
  <div>
    <b-card no-body>
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
      </b-tabs>
    </b-card>

    <!-- Control buttons-->
    <div class="text-center">
      <b-button-group class="mt-2">
        <b-button variant="success" @click="saveEvaluation">Save</b-button>
        <b-button @click="tabIndex--">Previous</b-button>
        <b-button @click="tabIndex++">Next</b-button>
      </b-button-group>
    </div>


  </div>
</template>

<script>
//import * as firebase from "firebase";
import {db, evaluationCollection} from "@/tools/firebaseConfig";

export default {
  name: "EditEva",
  data() {
    return {
      tabIndex: 1,
      sections: [],
      report: "",
    };
  },
  methods: {

    select(indexS,indexQ,option){
      this.sections[indexS].question[indexQ].selected = option
    },
    async saveEvaluation() {

      for (let section of this.sections) {
        console.log(section.id)
          await db.collection("Section").doc(section.id)
              .update({
                question:section.question
              })
              .catch(function (error) {
                console.error("Error updating document: ", error);
              });
      }
    },
    generateReport: function () {
      this.report = "";
      for (let section of this.questions) {
        for (let question of section) {
          this.report =
            this.report +
            question.questionName +
            "<br>" +
            question.answer +
            "<br>";
        }
        this.report = this.report + "<br><br>";
        console.log(this.report);
      }
    },
  },
  created: async function () {
    //get sections of the framework
    //e.g. this.sections = [sectionRef1, sectionRef2]
    let sectionsRef
    await evaluationCollection.doc(this.$route.params.evaId)
      .get()
      .then((doc) => {
        sectionsRef = doc.data().section;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    for(const sectionRef of sectionsRef){
      db.doc(sectionRef).get().then((docRef)=>{
        this.sections.push(docRef.data())
      })
    }
  },
};
</script>



<style scoped>
@import "../css/general.css";
.section {
  margin-bottom: 30px;
  text-align: left;
}
.btn {
  margin: 0px 40px;
}
</style>



