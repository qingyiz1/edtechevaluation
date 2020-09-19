<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="10">
          <div v-for="eva in evaluationList" v-bind:key="eva.id" class="evaluation">
            <b-card :header="eva.frameworkId+' - '+eva.name" :title="eva.name">
              <b-form-checkbox
                  v-model="eva.isCompleted"
                  @change="changeCompleted(eva)"
              >
                <b-card-text v-if="eva.isCompleted === true">Completed</b-card-text>
                <b-card-text v-if="eva.isCompleted !== true">Not Completed</b-card-text>
              </b-form-checkbox>
              <b-card-text>
                Created by {{eva.author}} on {{getTime(eva.dateCreated)}}
                <br />
                Last Edited by {{eva.editor}} on {{getTime(eva.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/DisplayEva/'+eva.id">Preview</b-button>
              <b-button variant="primary" :to="'/EditEva/'+eva.id">Edit</b-button>
              <b-button variant="danger" @click="deleteEvaluation(eva.id)">Delete</b-button>
              <b-button variant="info" :to="'/Reports/'" @click="generateReport(eva.id)">Generate Report</b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import {deleteDocument, updateDocument} from "@/tools/firebaseTool";
import {evaluationCollection} from "@/tools/firebaseConfig";


export default {
  name: "Evaluations",
  data() {
    return {
      evaluationList: [],
    };
  },
  methods: {
    changeCompleted(eva){
      eva.isCompleted = !eva.isCompleted
      updateDocument("evaluation",eva.id, {isCompleted:eva.isCompleted});
    },
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