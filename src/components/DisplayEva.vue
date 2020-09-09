<template>
  <div>
    <div class="section" v-for="(section, indexS) in questions" v-bind:key="indexS">
      <h1>Section {{indexS+1}}</h1>
      <div class="question" v-for="(question, indexQ) in section" v-bind:key="indexQ">
        <div class="question-number">Section {{indexS+1}} Question {{indexQ+1}}</div>
        <div class="question-body">{{question.questionName}}</div>
        <div class="answers">
          <div class="answer-item">
            <input
              type="radio"
              v-bind:id="'Poor_'+indexS+'_'+indexQ"
              value="Poor"
              v-model="question.answer"
            />
            <label v-bind:for="'Poor_'+indexS+'_'+indexQ">Poor</label>
          </div>
          <div class="answer-item">
            <input
              type="radio"
              v-bind:id="'NG_'+indexS+'_'+indexQ"
              value="Not Good"
              v-model="question.answer"
            />
            <label v-bind:for="'NG_'+indexS+'_'+indexQ" value="Not Good">Not Good</label>
          </div>
          <div class="answer-item">
            <input
              type="radio"
              v-bind:id="'Normal_'+indexS+'_'+indexQ"
              value="Normal"
              v-model="question.answer"
            />
            <label v-bind:for="'Normal_'+indexS+'_'+indexQ">Normal</label>
          </div>
          <div class="answer-item">
            <input
              type="radio"
              v-bind:id="'Good_'+indexS+'_'+indexQ"
              value="Good"
              v-model="question.answer"
            />
            <label v-bind:for="'Good_'+indexS+'_'+indexQ">Good</label>
          </div>
          <div class="answer-item">
            <input
              type="radio"
              v-bind:id="'Exceptional_'+indexS+'_'+indexQ"
              value="Exceptional"
              v-model="question.answer"
            />
            <label v-bind:for="'Exceptional_'+indexS+'_'+indexQ">Exceptional</label>
          </div>
        </div>
      </div>
    </div>
    <b-button variant="outline-primary">Generate report</b-button>

    <div>
      <b-button v-b-modal.modal-tall v-on:click="generateReport">Generate report</b-button>

      <b-modal id="modal-tall" title="Evaluation Outcome">
        <p>
          <span v-html="text"></span>
        </p>
      </b-modal>
    </div>
  </div>
</template>

<script>
// import * as firebase from "firebase";
import { db } from "@/tools/firebaseConfig";
export default {
  name: "DisplayEva",
  data() {
    return {
      sections: [],
      questions: [],
      text: "",
    };
  },
  methods: {
    generateReport: function () {
      this.text = "";
      for (let section of this.questions) {
        for (let question of section) {
          this.text =
            this.text +
            question.questionName +
            "<br>" +
            question.answer +
            "<br>";
        }
        this.text = this.text + "<br><br>";
        console.log(this.text)
      }
    },
  },
  created: async function () {
    await db
      .collection("framework/")
      .doc("framework93")
      .get()
      .then((doc) => {
        this.sections = doc.data().section;
        console.log(this.sections);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    for (let section of this.sections) {
      await db
        .doc(section.path)
        .get()
        .then((doc) => {
          let section = [];
          for (let q of doc.data().question) {
            section.push({
              questionName: q.questionName,
              answer: "unselected",
            });
          }
          this.questions.push(section);
        });
    }

    console.log(this.questions);
  },
};
</script>



<style scoped>
@import "../css/general.css";
</style>