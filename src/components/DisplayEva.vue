<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="8">
        <div v-for="(section, indexS) in questions" v-bind:key="'section'+indexS">
          <b-button v-b-toggle="'collapse'+indexS" variant="primary">Section {{indexS+1}}</b-button>
          <b-collapse visible v-bind:id="'collapse'+indexS" class="mt-2">
            <b-card
              v-bind:header="'Section '+(indexS+1)+' Question '+(indexQ+1)"
              :title="question.questionName"
              v-for="(question, indexQ) in section"
              v-bind:key="indexQ"
              class="section"
            >
              <b-card-text>
                <b-list-group>
                  <b-list-group-item>
                    <input
                      type="radio"
                      v-bind:id="'Poor_'+indexS+'_'+indexQ"
                      value="Poor"
                      v-model="question.answer"
                    />
                    <label v-bind:for="'Poor_'+indexS+'_'+indexQ">Poor</label>
                  </b-list-group-item>
                  <b-list-group-item>
                    <input
                      type="radio"
                      v-bind:id="'NG_'+indexS+'_'+indexQ"
                      value="Not Good"
                      v-model="question.answer"
                    />
                    <label v-bind:for="'NG_'+indexS+'_'+indexQ" value="Not Good">Not Good</label>
                  </b-list-group-item>
                  <b-list-group-item>
                    <input
                      type="radio"
                      v-bind:id="'Normal_'+indexS+'_'+indexQ"
                      value="Normal"
                      v-model="question.answer"
                    />
                    <label v-bind:for="'Normal_'+indexS+'_'+indexQ">Normal</label>
                  </b-list-group-item>
                  <b-list-group-item>
                    <input
                      type="radio"
                      v-bind:id="'Good_'+indexS+'_'+indexQ"
                      value="Good"
                      v-model="question.answer"
                    />
                    <label v-bind:for="'Good_'+indexS+'_'+indexQ">Good</label>
                  </b-list-group-item>
                  <b-list-group-item>
                    <input
                      type="radio"
                      v-bind:id="'Exceptional_'+indexS+'_'+indexQ"
                      value="Exceptional"
                      v-model="question.answer"
                    />
                    <label v-bind:for="'Exceptional_'+indexS+'_'+indexQ">Exceptional</label>
                  </b-list-group-item>
                </b-list-group>
              </b-card-text>
            </b-card>
          </b-collapse>
        </div>

        <div>
          <b-button v-on:click="save" class="btn">Save</b-button>
          <b-button v-b-modal.modal-tall v-on:click="generateReport">Generate report</b-button>

          <b-modal id="modal-tall" title="Evaluation Outcome">
            <p>
              <span v-html="report"></span>
            </p>
          </b-modal>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import * as firebase from "firebase";
import { db } from "@/tools/firebaseConfig";
import * as firebase from "firebase";
export default {
  name: "DisplayEva",
  data() {
    return {
      sections: [],
      questions: [],
      report: "",
    };
  },
  methods: {
    save: async function () {
      for (let sectionIndex in this.sections) {
        await db
          .doc(this.sections[sectionIndex].path)
          .update({
            question: this.questions[sectionIndex],
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
        .doc(this.$route.params.evaId)
        .set(evaData)
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
    delete: function () {
      db.collection("evaluation")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.id.substr(0, 2) != "ev") {
              db.collection("evaluation")
                .doc(doc.id)
                .delete()
                .catch(function (error) {
                  console.error("Error removing document: ", error);
                });
            }
          });
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    },
  },
  created: async function () {
    //get sections of the framework
    //e.g. this.sections = [sectionRef1, sectionRef2]
    let _this = this;
    await db
      .collection("evaluation/")
      .doc(this.$route.params.evaId)
      .get()
      .then((doc) => {
        this.sections = doc.data().section;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    //generate questions list
    // e.g. this.questions=[[{questionName: q1, answer: a}, {questionName: q2, answer: a}], [{questionName: q2, answer: a}]];
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

    //create a session duplication with same questions
    //change this.session into the new sessions created just before
    for (let sectionIndex in this.sections) {
      await db
        .collection("Section")
        .add({
          name: this.sections[sectionIndex].id + "Duplication",
          question: this.questions[sectionIndex],
        })
        .then(function (docRef) {
          _this.sections[sectionIndex] = docRef;
        });
    }

    // this.delete();
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



