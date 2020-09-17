<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="8">
        <b-card
          :header="'Generated from '+report.evaluationID.name"
          :title="report.name"
          :sub-title="'Created by '+report.reportAuthor"
          border-variant="primary"
          header-bg-variant="primary"
          header-text-variant="white"
          v-for="report in reportList"
          v-bind:key="report.id"
          class="text-left mt-3"
        >
          <b-card-text>
            <b-icon icon="calendar2-event"></b-icon>
            Created Time: {{getTime(report.dateCreated)}}
            <br />
            <b-icon icon="calendar-check"></b-icon>
            Edited Time: {{getTime(report.dateEdited)}}
          </b-card-text>
          <b-card-text>
            <h4>Recommendation</h4>
            <p>{{report.recommendation}}</p>
            <p>
              Recommended by
              <em>{{report.recommendationAuthor}}</em>
            </p>
          </b-card-text>
          <b-link class="card-link" @click="deleteReport(report.id)">Delete</b-link>
          <b-link class="card-link" @click="ddd">Download</b-link>
          <b-link class="card-link" @click="xxx">Send</b-link>
        </b-card>
        <b-form-group label="Test upload:" label-for="file-default" label-cols-sm="2">
          <b-form-file id="file-default" v-model="file1"></b-form-file>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { deleteDocument } from "@/tools/firebaseTool";
import { reportCollection } from "@/tools/firebaseConfig";
import * as firebase from "firebase";
export default {
  name: "Reports",
  data() {
    return {
      reportList: [],
      file1: null,
    };
  },
  methods: {
    deleteReport(reportId) {
      deleteDocument("report", reportId);
    },
    getTime: function (rawDate) {
      let m = new Date(rawDate.seconds * 1000);
      return m.toLocaleString();
    },
    xxx: function () {
      var storageRef = firebase.storage().ref();
      console.log(this.file1);
      var mountainImagesRef = storageRef.child("image/mountains.jpg");
      mountainImagesRef.put(this.file1).then(function (snapshot) {
        console.log("Uploaded a blob or file!", snapshot);
      });
    },
    ddd: function () {
      var storageRef = firebase.storage().ref();
      storageRef
        .child("image/mountains.jpg")
        .getDownloadURL()
        .then(function (url) {
          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function (event) {event;
            var blob = xhr.response;blob;
          };
          xhr.open("GET", url);
          xhr.send();

          // Or inserted into an <img> element:
          var img = document.getElementById("myimg");
          img.src = url;
        })
        .catch(function (error) {
          // Handle any errors
          console.log(error)
        });
    },
  },
  firestore: {
    reportList: reportCollection,
  },
};
</script>



<style scoped>
</style>