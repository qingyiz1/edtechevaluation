<template>
  <div>
    <div class="section" v-for="(section, indexS) in questions" v-bind:key="indexS">
      <h1>Section {{indexS+1}}</h1>
      <div class="question" v-for="(question, indexQ) in section" v-bind:key="indexQ">
        <div class="question-number">Section {{indexS+1}} Question {{indexQ+1}}</div>
        <div class="question-body">{{question}}</div>
        <div class="answers">
          <div class="answer-item">
            <input type="radio" name="rating" value="1" /> Poor
            <br />
          </div>
          <div class="answer-item">
            <input type="radio" name="rating" value="2" /> Not good
            <br />
          </div>
          <div class="answer-item">
            <input type="radio" name="rating" value="3" /> Normal
            <br />
          </div>
          <div class="answer-item">
            <input type="radio" name="rating" value="4" /> Good
            <br />
          </div>
          <div class="answer-item">
            <input type="radio" name="rating" value="5" /> Exceptional
            <br />
          </div>
        </div>
      </div>
    </div>
    <b-button variant="outline-primary">Generate report</b-button>
  </div>
</template>

<script>
// import * as firebase from "firebase";
import { db } from "@/tools/firebaseConfig";
export default {
  name: "EditEva",
  data() {
    return {
      sections: [],
      questions: [],
      answers: []
    };
  },
  methods: {},

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
            section.push(q.questionName);
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
@import "../css/editeva.css";
</style>