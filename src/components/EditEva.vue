<template>
  <div>
    <div class="question" v-on:click="loadMessages">
      <div class="question-number">Question 1</div>
      <div class="question-body">Rate the Usability of the Edtech Project</div>
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
    <div class="question">
      <div class="question-number">Question 1</div>
      <div class="question-body">Rate the Usability of the Edtech Project</div>
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
    <div class="question">
      <div class="question-number">Question 1</div>
      <div class="question-body">Rate the Usability of the Edtech Project</div>
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
    <div class="question">
      <div class="question-number">Question 1</div>
      <div class="question-body">Rate the Usability of the Edtech Project</div>
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
    <div class="question">
      <div class="question-number">Question 1</div>
      <div class="question-body">Rate the Usability of the Edtech Project</div>
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
    <div class="question">
      <div class="question-number">Question 1</div>
      <div class="question-body">Rate the Usability of the Edtech Project</div>
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
    <div class="question">
      <div class="question-number">Question 1</div>
      <div class="question-body">Rate the Usability of the Edtech Project</div>
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

    <button>Generate Report</button>
  </div>
</template>

<script>
import * as firebase from "firebase";

export default {
  name: "EditEva",
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    saveEvaluation() {
      // Add a new message entry to the database.
      return firebase
        .firestore()
        .collection("evaluation")
        .add({
          documentId: "evaluation2",
          author: "nihao",
          dateCreated: "dddd",
          dateEdited: firebase.firestore.FieldValue.serverTimestamp(),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .catch(function (error) {
          console.error("Error writing new message to database", error);
        });
    },

    loadMessages() {
      var query = firebase.firestore().collection("evaluation");

      query.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          var message = change.doc.data();
          console.log(message);
        });
      });
    },
  },
};
</script>



<style scoped>
@import "../css/general.css";
@import "../css/editeva.css";
</style>