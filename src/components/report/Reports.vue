<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="8">
          <div v-for="rep in reportList" v-bind:key="rep.id" class="report">
            <b-card :header="rep.evaluationID+' - '+rep.name" :title="rep.name">
              <b-card-text>
                Created by {{rep.reportAuthor}} on {{getTime(rep.dateCreated)}}
                <br/>
                Edited by {{rep.recommendationAuthor}} on {{getTime(rep.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/DisplayRep/'+rep.id">Preview</b-button>  
              <b-button variant="danger" @click="deleteReport(rep.id)">Delete</b-button>
              <b-button variant="info" @click="downloadReport(rep.id)">Download</b-button>
              <b-button variant="info" @click.prevent="openSendWindow(rep.id)">Send Email</b-button>
              </b-card>
          </div>
        </b-col>
      </b-row>
      <el-dialog title="Send Report" :visible.sync="sendWindowVisible" width="360px">
      <el-form ref="form" :model="sendReport" label-width="80px">
        <el-form-item label="Email">
          <el-input v-model="sendReport.email"></el-input>
        </el-form-item>
        <el-form-item label="Note">
          <el-input type="textarea" :rows="5" v-model="sendReport.message"></el-input>
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
import {deleteDocument} from "@/tools/firebaseTool";
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
     

    };
  },
  methods: {
    deleteReport(repId){
      deleteDocument("report",repId)
    },
    getTime(rawDate) {
      let date = new Date(rawDate.seconds * 1000);
      var month = date.getMonth() + 1
      var finalDate = date.getFullYear() + "-" + month  + "-" + date.getDate()+ "  " + date.getHours() + ":" + date.getMinutes();
      return finalDate;
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
          dateCreated: repInfo.dateCreated,
          dateEdited: repInfo.dateEdited,
          repAuthor: repInfo.reportAuthor,
          isCompleted: repInfo.isCompleted,
          content: repInfo.content,
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
      let repName = repInfo.name.toString()
      var repRef = storageRef.child(repName+ '.docx')
      console.log(repRef.fullPath)
      var file = downloadReport
      repRef.put(file).then(function() {
          console.log('Uploaded a blob or file!');
      })
      });
    },

  async openSendWindow(repId){
      this.sendWindowVisible = true;
      global.repInfoSend = await getDocument("report",repId)
    
    },



    async sendEmail() {


      var storageRef = firebase.storage().ref()
      const url = await storageRef.child(global.repInfoSend.name + '.docx').getDownloadURL()

  
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
        global.repInfoSend = {}
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