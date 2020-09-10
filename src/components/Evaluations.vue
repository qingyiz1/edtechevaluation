<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="8">
          <div v-for="eva in evaluationList" v-bind:key="eva.id" class="evaluation">
            <b-card :header="eva.frameworkId+' - '+eva.name" :title="eva.name">
              <b-card-text>
                Created by {{eva.author}} on {{getTime(eva.dateCreated)}}
                <br />
                Edited by {{eva.editor}} on {{getTime(eva.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/DisplayEva/'+eva.id">Preview</b-button>
              <b-button variant="primary" :to="'/EditEva/'+eva.id">Edit</b-button>
              <b-button variant="danger" @click="deleteEvaluation(eva.id)">Delete</b-button>
              <b-button variant="info">Download Report</b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import { deleteDocument} from "@/tools/firebaseTool";
import {evaluationCollection} from "@/tools/firebaseConfig";


export default {
  name: "Evaluations",
  data() {
    return {
      evaluationList: [],
    };
  },
  methods: {
    deleteEvaluation(evaluationId){
      deleteDocument("evaluation",evaluationId)
    },
    getTime: function (rawDate) {
      let m = new Date(rawDate.seconds * 1000);
      return m.toLocaleString();
    },
  },
  firestore:{
    evaluationList:evaluationCollection
  }
};
</script>



<style scoped>
@import "../css/general.css";
.evaluation{
  margin: 20px 0px;
}
.btn {
  margin: 0px 5px;
}
</style>