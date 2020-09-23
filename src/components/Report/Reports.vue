<template>
  <div>
    <b-modal
        id="delete"
        button-size="md"
        centered
        header-bg-variant="warning"
        ok-title="Confirm"
        ok-variant="danger"
        size="md"
        title="Are you sure?"
        body-text-variant="danger"
        @ok="deleteReport(repID)">
      <div class="d-block text-center">
        <h4>This action will delete the evaluation permanently!</h4>
      </div>
    </b-modal>
    <div class="list-container">
      <b-row no-gutters class="functional-container">
        <b-input-group size="sm" class="list-search">
          <b-form-input type="search" placeholder="Search"></b-form-input>
          <b-input-group-append is-text>
            <b-icon icon="search"></b-icon>
          </b-input-group-append>
        </b-input-group>
      </b-row>
      <b-row no-gutters class="list list-header" align-content="center">
        <b-col cols="1">Author</b-col>
        <b-col cols="3">Report Name</b-col>
        <b-col cols="2">Created Time</b-col>
        <b-col cols="2">Edited Time</b-col>
        <b-col cols="1">Complete</b-col>
        <b-col cols="3">Action</b-col>
      </b-row>
      <b-row
          no-gutters
          v-for="rep in reportList" v-bind:key="rep.id"
          class="list list-content"
          align-content="center"
          align-v="center">
        <b-col cols="1">{{rep.author}}</b-col>
        <b-col cols="3" @click="displayRep(rep.id)" class="list-content-display">{{rep.name}}</b-col>
        <b-col cols="2">{{rep.dateCreated.toDate().toLocaleString('en-US')}}</b-col>
        <b-col cols="2">{{rep.dateEdited.toDate().toLocaleString('en-US')}}</b-col>
        <b-col cols="1">
          <b-form-checkbox
              v-model="rep.isCompleted"
              name="check-button"
              class="action_btn"
              size="lg"
              switch
              @change="toggleIsComplete(rep)">
          </b-form-checkbox>
        </b-col>
        <b-col cols="3">
          <b-button
              v-if="rep.isCompleted"
              @click="openSendWindow(rep.id)"
              size="sm"
              variant="link"
              style="padding:0"
              class="action_btn"><b-avatar
              variant="primary"
              icon="share" size="2rem"></b-avatar></b-button>
          <b-button
              v-if="rep.isCompleted"
              @click="downloadReport(rep.id)"
              size="sm"
              variant="link"
              style="padding:0"
              class="action_btn"><b-avatar
              variant="dark"
              icon="file-earmark-arrow-down" size="2rem"></b-avatar></b-button>
          <b-button
              variant="link"
              @click="displayRep(rep.id)"
              class="action_btn"
              size="sm"
              style="padding:0"
              >
            <b-avatar
                variant="success"
                icon="pencil" size="2rem"></b-avatar>
          </b-button>
          <b-button
              variant="link"
              v-b-modal.delete
              @click="setRepId(rep.id)"
              class="action_btn"
              size="sm"
              style="padding:0"
              ><b-avatar variant="danger" icon="trash" size="2rem"></b-avatar></b-button>
        </b-col>
      </b-row>
    </div>
    <!-- <b-row>
      <b-col>
        <div v-for="rep in reportList" v-bind:key="rep.id" class="report" >
          <b-card
          :header="rep.name"
          class="text-left mt-3">
          <template v-slot:header>
            <b-row align-h="between" align-v="center">
              <b-col cols="9"><h6 class="mb-0">{{rep.name}}</h6></b-col>
                <b-col cols="1">
                <b-button  size="sm" variant="link" @click="Edit(rep.id)" >
                  <b-icon icon="pencil"></b-icon>
                </b-button>
              </b-col>
              <b-col cols="2">
              <b-form-checkbox
                v-model="rep.isCompleted"
                name="check-button"
                size="sm"
                style="margin-bottom: 0.625rem"
                switch
                @change="toggleIsComplete(rep)">{{rep.isCompleted?'completed':'uncompleted'}}</b-form-checkbox>
            </b-col>
            </b-row>
          </template>
          <b-row align-h="between" align-v="center" b-row  no-gutters>
          <b-col cols="8">
            <b-card-text>
                <b-icon
                icon="person-circle"
                style="margin-right:10px">
                </b-icon>
                {{rep.recommendationAuthor}}
            </b-card-text>
            <b-card-text>
                <b-icon
                icon="calendar-date"
                style="margin-right:10px"></b-icon>
                {{rep.dateCreated.toDate().toLocaleString('en-US')}}
            </b-card-text>
            </b-col>
          <b-col cols="4">
            <b-button
              :to="'/report_preview/'+rep.id"
              size="sm"
              style="margin-right: 1rem;margin-left:0.5rem"
              variant="primary"><b-icon icon="eye"></b-icon></b-button>

            <b-button
              size="sm"
              style="margin-right: 1rem;margin-left:0.5rem"
              variant="danger"
              @click="deleteReport(rep.id)"><b-icon icon="trash"></b-icon></b-button>

            <b-button
              size="sm"
              style="margin-right: 1rem;margin-left:0.5rem"
              variant="info"
              @click="downloadReport(rep.id)"><b-icon icon="download"></b-icon></b-button>

              <b-button
              size="sm"
              style="margin-right: 1rem;margin-left:0.5rem"
              variant="info"
              @click="openSendWindow(rep.id)"><b-icon icon="envelope"></b-icon></b-button>

          </b-col>
            </b-row>
          </b-card>
        </div>
      </b-col>
    </b-row> -->
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
import {deleteDocument, updateDocument} from "@/tools/firebaseTool";
import {reportCollection} from "@/tools/firebaseConfig";
import {getDocument} from "@/tools/firebaseTool";
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'
import {Email} from "@/tools/smtp"

export default {
  name: "Reports",
  data() {
    return {
      reportList: [],
      repInfoSend: {},
      sendWindowVisible: false,
      sendReport:{
        email:"",
        message:"",
      },
      Id:"",
      repID:""
    };
  },
  methods: {
    deleteReport(repId){
      deleteDocument("report",repId)
      firebase.storage().ref().child('Report/'+repId+ '.docx').delete()
    },
    toggleIsComplete(rep) {
      rep.isCompleted = !rep.isCompleted
      updateDocument("report", rep.id, {"isCompleted": rep.isCompleted})
    },
    displayRep: function (repID) {
      this.$router.push("/report_preview/" + repID)
    },

    setRepId(id){
      this.repID = id;
    },

    async downloadReport(repId){
      const repInfo = await getDocument("report",repId)
      await JSZipUtils.getBinaryContent('/Template.docx', function(error, content) {

        if (error) {
          throw error
        }

        const zip = new PizZip(content)
        const doc = new Docxtemplater().loadZip(zip)

        doc.setData({
          repName: repInfo.name,
          dateCreated: repInfo.dateCreated.toDate().toLocaleString('en-US'),
          dateEdited: repInfo.dateEdited.toDate().toLocaleString('en-US'),
          repAuthor: repInfo.author,
          isCompleted: repInfo.isCompleted,
          content: repInfo.content.path,
          recommendation: repInfo.recommendation,
          recommendationAuthor: repInfo.recommendationAuthor,
        })
        try {
          doc.render();
        } catch (error) {
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          };
          console.log(JSON.stringify({ error: e }));
          throw error;
        }

        const downloadReport = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        saveAs(downloadReport, repInfo.name + '.docx')

        let storageRef = firebase.storage().ref()
        let repRef = storageRef.child('Report/'+repId+ '.docx')

        let file = downloadReport
        repRef.put(file)
      });
    },
    async openSendWindow(repId){
      this.sendWindowVisible = true;
      global.repInfoSend = await getDocument("report",repId)
      global.Id = repId

    },
    async sendEmail() {
      let storageRef = firebase.storage().ref()
      const url = await storageRef.child('Report/'+global.Id+ '.docx').getDownloadURL()

      Email.send({
        Host: "smtp.gmail.com",
        Username : "edtech.echidna@gmail.com",
        Password : "edtechechidna",
        To : this.sendReport.email,
        From : "edtech.echidna@gmail.com",
        Subject : "Report-" + global.repInfoSend.name,
        Body :this.sendReport.message,
        Attachments : [
          {
            name : global.repInfoSend.name + ".docx",
            path : url
          }]
      }).then(()=>{
        this.sendWindowVisible = false
        window.alert("Report has been sent to "+ this.sendReport.email)
        this.sendReport.email=""
        this.sendReport.message=""
        global.repInfoSend = {}
        global.Id = ""}
      )
    }
  },
  firestore:{
    reportList:reportCollection
  }
};
</script>



<style scoped>
@import "../../css/general.css";
@import "../../css/list.css";

</style>