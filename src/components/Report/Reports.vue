<template>
  <div class="list-container">
    <b-row class="funtional-container">
      <b-input-group size="sm" class="list-search">
        <b-form-input type="search" placeholder="Search"></b-form-input>
        <b-input-group-append is-text>
          <b-icon icon="search"></b-icon>
        </b-input-group-append>
      </b-input-group>
    </b-row>
    <b-row class="list list-header" align-content="center">
      <b-col cols="1">Author</b-col>
      <b-col cols="2">Report Name</b-col>
      <b-col cols="1">Evaluation</b-col>
      <b-col cols="2">Created Time</b-col>
      <b-col cols="2">Edited Time</b-col>
      <b-col cols="1">Finish</b-col>
      <b-col cols="1">Send</b-col>
      <b-col cols="1">Download</b-col>
      <b-col cols="1">Action</b-col>
    </b-row>
    <b-row
      v-for="rep in reportList"
      v-bind:key="rep.id"
      class="list list-content"
      align-content="center"
      align-v="center"
    >
      <b-col cols="1">{{rep.author}}</b-col>
      <b-col
        cols="2"
        @click="displayRep(rep.id)"
        to="/framework"
        class="list-content-display"
      >{{rep.name}}</b-col>
      <b-col cols="1">{{rep.evaluationId}}</b-col>
      <b-col cols="2">{{rep.dateCreated.toDate().toLocaleString('en-US')}}</b-col>
      <b-col cols="2">{{rep.dateEdited.toDate().toLocaleString('en-US')}}</b-col>
      <b-col cols="1">
        <b-icon
          v-if="rep.isCompleted === true"
          variant="success"
          icon="check-circle-fill"
          size="2.5rem"
        ></b-icon>
      </b-col>
      <b-col cols="1">
        <b-button
          variant="info"
          @click="openSendWindow(rep.id)"
          class="list-inline-btn-sm"
          :disabled="rep.isCompleted != true"
        >Send</b-button>
      </b-col>
      <b-col cols="1">
        <b-button
          variant="info"
          @click="downloadReport(rep.id)"
          class="list-inline-btn-sm"
          :disabled="rep.isCompleted != true"
        >Download</b-button>
      </b-col>
      <b-col cols="1">
        <b-button variant="link" :to="'/report_preview/'+rep.id">
          <b-avatar variant="success" icon="pencil" size="2rem"></b-avatar>
        </b-button>
        <b-button variant="link" @click="deleteReport(rep.id)">
          <b-avatar variant="danger" icon="trash" size="2rem"></b-avatar>
        </b-button>
      </b-col>
    </b-row>

    <el-dialog :visible.sync="sendWindowVisible" title="Send Report" width="360px">
      <el-form ref="form" :model="sendReport" label-width="80px">
        <el-form-item label="Email">
          <el-input v-model="sendReport.email"></el-input>
        </el-form-item>
        <el-form-item label="Note">
          <el-input v-model="sendReport.message" :rows="5" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendWindowVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sendEmail()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteDocument } from "@/tools/firebaseTool";
import { reportCollection } from "@/tools/firebaseConfig";
import { getDocument } from "@/tools/firebaseTool";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import { Email } from "@/tools/smtp";

export default {
  name: "Reports",
  data() {
    return {
      reportList: [],
      repInfoSend: {},
      sendWindowVisible: false,
      sendReport: {
        email: "",
        message: "",
      },
      Id: "",
      sections: [],
    };
  },
  methods: {
    async displayRep(id) {
      await this.$router.push({ path: "/report_view_online/" + id });
    },
    deleteReport(repId) {
      deleteDocument("report", repId);
      firebase
        .storage()
        .ref()
        .child("Report/" + repId + ".docx")
        .delete();
    },

    async downloadReport(repId) {
      const repInfo = await getDocument("report", repId);
      JSZipUtils.getBinaryContent("/ReportTemplate.docx", function (
        error,
        content
      ) {
        if (error) {
          throw error;
        }

        const zip = new PizZip(content);
        const doc = new Docxtemplater().loadZip(zip);

        doc.setData({
          repName: repInfo.name,
          dateCreated: repInfo.dateCreated.toDate().toLocaleString("en-US"),
          dateEdited: repInfo.dateEdited.toDate().toLocaleString("en-US"),
          repAuthor: repInfo.author,
          isCompleted: repInfo.isCompleted,
          content: repInfo.content.path,
          recommendation: repInfo.recommendation,
          recommendationAuthor: repInfo.recommendationAuthor,
        });
        try {
          doc.render();
        } catch (error) {
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
          };
          console.log(JSON.stringify({ error: e }));
          throw error;
        }

        const downloadReport = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        saveAs(downloadReport, repInfo.name + ".docx");

        var storageRef = firebase.storage().ref();
        var repRef = storageRef.child("Report/" + repId + ".docx");

        var file = downloadReport;
        repRef.put(file);
      });
    },
    async openSendWindow(repId) {
      this.sendWindowVisible = true;
      global.repInfoSend = await getDocument("report", repId);
      global.Id = repId;
    },
    async sendEmail() {
      var storageRef = firebase.storage().ref();
      const url = await storageRef
        .child("Report/" + global.Id + ".docx")
        .getDownloadURL();

      Email.send({
        Host: "smtp.gmail.com",
        Username: "edtech.echidna@gmail.com",
        Password: "edtechechidna",
        To: this.sendReport.email,
        From: "edtech.echidna@gmail.com",
        Subject: "Report-" + global.repInfoSend.name,
        Body: this.sendReport.message,
        Attachments: [
          {
            name: global.repInfoSend.name + ".docx",
            path: url,
          },
        ],
      }).then(
        (this.sendWindowVisible = false),
        window.alert("Report has been sent to " + this.sendReport.email),
        (this.sendReport.email = ""),
        (this.sendReport.message = ""),
        (global.repInfoSend = {}),
        (global.Id = "")
      );
    },
  },
  firestore: {
    reportList: reportCollection,
  },
};
</script>



<style scoped>
@import "../../css/general.css";
@import "../../css/list.css";
</style>