<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="8">
          <div v-for="rep in reportList" v-bind:key="rep.id" class="report">
            <b-card :header="rep.evaluationID+' - '+rep.name" :title="rep.name">
              <b-card-text>
                Created by {{rep.author}} on {{getTime(rep.dateCreated)}}
                <br/>
                Edited by {{rep.editor}} on {{getTime(rep.dateEdited)}}
              </b-card-text>
              <b-button variant="primary" :to="'/report_preview/'+rep.id">Preview</b-button>  
              <b-button variant="danger" @click="deleteReport(rep.id)">Delete</b-button>
              <b-button variant="info"
                  class="card-link"
                  href="https://firebasestorage.googleapis.com/v0/b/ee---echidna---2020.appspot.com/o/image%2F1111.docx?alt=media&token=85460805-33d1-4f1f-9bea-3f0f7471cdff"
                  download="filename"
                >Download</b-button>
              <b-button variant="info" @click="sendEmail()">Send Email</b-button>

            
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import {deleteDocument} from "@/tools/firebaseTool";
import {reportCollection} from "@/tools/firebaseConfig";
import {Email} from "@/tools/smtp"


export default {
  name: "Reports",
  data() {
    return {
      reportList: [],
     
    };
  },
  methods: {
    deleteReport(repId){
      deleteDocument("report",repId)
    },
    getTime: function (rawDate) {
      let m = new Date(rawDate.seconds * 1000);
      return m.toLocaleString();
    },
   sendEmail() {
      Email.send({
        Host: "smtp.gmail.com",
        Username : "edtech.echidna@gmail.com",
        Password : "edtechechidna",
        To : "admin@gmail.com",
        From : "edtech.echidna@gmail.com",
        Subject : "Final Report",
        Body : "",
      })
   
    }

    
 
  },
 
   
  
  firestore:{
    reportList:reportCollection
  }
};
</script>



<style scoped>

</style>