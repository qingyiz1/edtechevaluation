<template>
  <div>
    <b-card no-body>
      <b-tabs card>
        <b-tab v-for="(section,indexS) in sections" :key="indexS" :title="section.name">
          <b-card-group  deck>
            <b-card v-for="(question,indexQ) in section.question" :key="indexQ" :header="question.questionName">
              <b-list-group>
                <b-list-group-item :class="{active: question.selected === 0}" button @click="select(indexS,indexQ,0)">1</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 1}" button @click="select(indexS,indexQ,1)">2</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 2}" button @click="select(indexS,indexQ,2)">3</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 3}" button @click="select(indexS,indexQ,3)">4</b-list-group-item>
                <b-list-group-item :class="{active: question.selected === 4}" button @click="select(indexS,indexQ,4)">5</b-list-group-item>
              </b-list-group>

              <p class="card-text mt-2">
                {{question.descriptions[question.selected]}}
              </p>
            </b-card>
          </b-card-group>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
// import * as firebase from "firebase";
import {db, evaluationCollection} from "@/tools/firebaseConfig";
import * as firebase from "firebase";
import $ from 'jquery'

export default {
  name: "EditEva",
  data() {
    return {
      sections: [],
      questions: {
        selected:0,
        name:"",
        description:"",
        answer:""
      },
      report: "",
    };
  },
  methods: {

    select(indexS,indexQ,option){
      this.sections[indexS].question[indexQ].selected = option

    },
    save: async function () {
      for (let section in this.sections) {
        await db.collection("Section")
          .doc(section)
          .set({
            question: this.questions[section],

          })
          .then(function () {})
          .catch(function (error) {
            console.error("Error updating document: ", error);
          });
      }
      let evaData = {
        author: "Admin",
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
        frameworkId: "framework1",
        id: "evaluation2",
        isCompleted: true,
        name: "Edtech Evaluation",
        section: this.sections,
        summary: "This is a summary",
      };
      await db
        .collection("evaluation")
        .add(evaData)
        .then(function (docRef) {
          console.log(docRef)
        });
      window.alert("Evaluation successfully updated!");
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

    $('.list-group-item').on('click', function() {
      $('.active').removeClass('active');
      $(this).addClass('active');

      // Pass clicked link element to another function
    })
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



