<template>
    <b-container>
      <b-row>
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
    </b-container>
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
    };
  },
  methods: {
    deleteReport(repId){
      deleteDocument("report",repId)
      firebase.storage().ref().child('Report/'+repId+ '.docx').delete()
    },
    toggleIsComplete(rep) {
      updateDocument("report", rep.id, {"isCompleted": rep.isCompleted})
    },
    async downloadReport(repId){
      const repInfo = await getDocument("report",repId)
      JSZipUtils.getBinaryContent('/Template.docx', function(error, content) {

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

      var storageRef = firebase.storage().ref()
      var repRef = storageRef.child('Report/'+repId+ '.docx')

      var file = downloadReport
      repRef.put(file)
      });
    },
    async openSendWindow(repId){
        this.sendWindowVisible = true;
        global.repInfoSend = await getDocument("report",repId)
        global.Id = repId

    },
    async sendEmail() {
      var storageRef = firebase.storage().ref()
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
      }).then(
        this.sendWindowVisible = false,
        window.alert("Report has been sent to "+ this.sendReport.email),
        this.sendReport.email="",
        this.sendReport.message="",
        global.repInfoSend = {},
        global.Id = "",
      )
    }
  },
  firestore:{
    reportList:reportCollection
  }
};
</script>



<style scoped>


</style>