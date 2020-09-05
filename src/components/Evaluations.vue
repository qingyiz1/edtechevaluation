<template>
  <div>
    <div class="evaluation">
      <div class="evaluation-title">
        <div class="evaluation-title1">Test Evaluation</div>
        <div class="evaluation-state">completed</div>
      </div>

      <div class="evaluation-author">Created By: Jack Handerson</div>

      <div class="evaluation-footer">
        <div class="evaluation-date">03/08/2020</div>
        <div class="evaluation-framework">Primary Edtech Framework</div>
      </div>
    </div>
    <div class="evaluation">
      <div class="evaluation-title">
        <div class="evaluation-title1">Test Evaluation</div>
        <div class="evaluation-state">completed</div>
      </div>

      <div class="evaluation-author">Created By: Jack Handerson</div>

      <div class="evaluation-footer">
        <div class="evaluation-date">03/08/2020</div>
        <div class="evaluation-framework">Primary Edtech Framework</div>
      </div>
    </div>
    <div class="evaluation">
      <div class="evaluation-title">
        <div class="evaluation-title1">Test Evaluation</div>
        <div class="evaluation-state">Active</div>
      </div>

      <div class="evaluation-author">Created By: Jack Handerson</div>

      <div class="evaluation-footer">
        <div class="evaluation-date">03/08/2020</div>
        <div class="evaluation-framework">Primary Edtech Framework</div>
      </div>
    </div>
        <div class="evaluation">
      <div class="evaluation-title">
        <div class="evaluation-title1">Test Evaluation</div>
        <div class="evaluation-state">completed</div>
      </div>

      <div class="evaluation-author">Created By: Jack Handerson</div>

      <div class="evaluation-footer">
        <div class="evaluation-date">03/08/2020</div>
        <div class="evaluation-framework">Primary Edtech Framework</div>
      </div>
    </div>
        <div class="evaluation">
      <div class="evaluation-title">
        <div class="evaluation-title1">Test Evaluation</div>
        <div class="evaluation-state">completed</div>
      </div>

      <div class="evaluation-author">Created By: Jack Handerson</div>

      <div class="evaluation-footer">
        <div class="evaluation-date">03/08/2020</div>
        <div class="evaluation-framework">Primary Edtech Framework</div>
      </div>
    </div>
  </div>

  <!-- <div id="app">

    <div v-if="state === 'synced'">
      Form is synced with Firestore
    </div>
    <div v-else-if="state === 'modified'">
      From data changed, will sync with Firebase
    </div>
    <div v-else-if="state === 'revoked'">
      From data and Firebase revoked to original data
    </div>
    <div v-else-if="state === 'error'">
      Failed to save to Firestore. {{ errorMessage }}
    </div>
    <div v-else-if="state === 'loading'">Loading...</div>


    <form @submit.prevent="updateFirebase" @input="fieldUpdate">

      <input type="text" name="name" v-model="formData.name" />
      <input type="text" name="section" v-model="formData.section" />
      <input type="text" name="question" v-model="formData.question" />

      <button type="submit" v-if="state === 'modified'">Save Changes</button>

    </form>
  </div>-->
</template>

<script>
import { db } from "@/tools/firebaseConfig";
import { debounce } from "debounce";
const frameworkPath = "framework/" + "framework1";

export default {
  name: "Evaluations",
  data() {
    return {
      state: "loading",
      firebaseData: null,
      formData: {},
      errorMessage: "",
    };
  },
  firestore() {
    return {
      firebaseData: db.doc(frameworkPath),
    };
  },
  methods: {
    async updateFirebase() {
      try {
        await db.doc(frameworkPath).set(this.formData);
        this.state = "synced";
      } catch (error) {
        this.errorMessage = JSON.stringify(error);
        this.state = "error";
      }
    },
    fieldUpdate() {
      this.state = "modified";
      this.debouncedUpdate();
    },
    debouncedUpdate: debounce(function () {
      this.updateFirebase();
    }, 1500),
  },
  created: async function () {
    const docRef = db.doc(frameworkPath);

    let data = (await docRef.get()).data();

    if (!data) {
      data = { name: "", section: "", question: "" };
      await docRef.set(data);
    }

    this.formData = data;
    this.state = "synced";
  },
};
</script>



<style scoped>
@import "../css/general.css";
@import "../css/evas.css";
</style>