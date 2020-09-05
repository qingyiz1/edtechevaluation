

<template>
<div>
  <b-alert
      variant="danger"
      dismissible
      fade
      :show="showWarning"
      @dismissed="showWarning=false"
    >
      Please fill {{warningType}} !
  </b-alert>
  <b-overlay
  :show="showOverlay"
  opacity="0.6"
  variant="light">
    <b-container class="framework-container">
      <b-card class="framework-card">
        <b-card-title>Framework</b-card-title>
          <b-form>
              <b-row class="framework-row">
                <b-col cols="2" class="framework-label">
                  <label for="frameworkName">Name</label>
                </b-col>
                <b-col cols="8">
                  <b-form-input id="frameworkName" v-model="frameworkName"></b-form-input>
                </b-col>
                <b-col cols="2">
                  <b-button @click="onCreateNewSecion">New Section</b-button>
                </b-col>
              </b-row>
              <!-- </b-form-group> -->
              <b-row v-for="section in sections" :key="section.id" class="framework-row">
                <section-template :section=section></section-template>
              </b-row>
          </b-form>
          <b-row align-h="center">
            <b-col cols="3">
              <b-button v-b-modal="'submit'" >Submit</b-button>
            </b-col>
            <b-col cols="3">
              <b-button class="btn-reset" v-b-modal="'reset'">Reset</b-button>
            </b-col>
          </b-row>
      </b-card>
      <b-modal 
      id="submit" 
      size="sm" 
      button-size="sm"
      modal-header="Alert"
      @ok="updateFrameWork">Submit framework?</b-modal>
      <b-modal 
      id="reset" 
      size="sm" 
      button-size="sm"
      modal-header="Alert"
      @ok="onReset">Reset all?</b-modal>
    </b-container>
  </b-overlay>
</div>

</template>
<script>
import { createDocument,createReference } from "@/tools/firebaseTool";
import "firebase/auth";
import {db} from "@/tools/firebaseConfig";
import * as firebase from "firebase";
import SectionTemplate from "@/components/SectionTemplate";
const frameworkPath = "/framework" + Math.ceil(Math.random()*100);
const sectionPath = "/section" + Math.ceil(Math.random()*100);
export default {
  name: "Framework_Template",
  data(){
    return{
      frameworkName:"",
      framework:{},
      sections:[],
      questions:[],
      key:0,
      version:1,
      showOverlay:false,
      showWarning:false,
      warningType:"",
      author:"",
    }
  },
  components: {
    SectionTemplate
  },
  methods:{
    updateFrameWork: async function (){
      this.showOverlay = true;
      if (!this.frameworkName.length == 0) {
        this.framework = {
          name:this.frameworkName,
          section:"",
          dateCreated: Date.parse(new Date()),
          dateEdited: Date.parse(new Date()),
          author:this.author,
          version:this.version,
          isActive:true
        }
        let checkSection = true;
        let checkQuestion = true;
        if (this.sections.length > 0 ) {
          for (let i = 0; i < this.sections.length; i++) {
            if (this.sections[i].name.length == 0) {
              this.showOverlay = false;
              this.showWarning = true;
              this.warningType = "section name";
              checkSection = false
              break;
            } else {
              for (let j = 0; j < this.sections[i].question.length; j++) {
                if(this.sections[i].question[j].questionName.length == 0) {
                  this.showOverlay = false;
                  this.showWarning = true;
                  this.warningType = "question name";
                  checkQuestion = false;
                  break;
                }
              }
            }
          }
        }
        if (checkSection && checkQuestion) {
          createDocument("framework",frameworkPath,this.framework);
          for (let i = 0; i < this.sections.length; i++ ) {
            createDocument("Section",sectionPath,this.sections[i]);
          }
          await createReference(frameworkPath+"/section", this.sections);
          this.showOverlay = false;
          this.$router.push('/framework')
        }
      } else {
        this.showOverlay = false;
        this.showWarning = true;
        this.warningType = "framework name";
      }
    },
  // created: async function () {
  //   const docRef = db.doc(frameworkPath);

  //   let data = (await docRef.get() ).data();

  //   if (!data) {
  //     data = { name: '', section: '', question: '' }
  //     await docRef.set(data)
  //   }

  //   this.formData = data;
  //   this.state = 'synced'
  // },
    onCreateNewSecion: function () {
      let id = this.sections.length;
      let emptySection = {
          id:id,
          name:"",
          question:[]
      }
      this.sections.push(emptySection);
    },
    onDeleteQuestion: function (section) {
      this.sections.splice(section.id,1);
    },
    onReset: function () {
      this.frameworkName = "";
      this.framework = {};
      this.sections = [];
    },
  },
  created: async function () {
    this.showOverlay = true;
    let usrInfo = await db.collection("userInfo").doc(firebase.auth().currentUser.email).get();
    this.showOverlay = false;
    this.author = usrInfo.data()['nickname'];
  //   let data = (await docRef.get() ).data();

  //   if (!data) {
  //     data = { name: '', section: '', question: '' }
  //     await docRef.set(data)
  //   }

  //   this.formData = data;
  //   this.state = 'synced'
  }
}
</script>

<style scoped>
@import "../css/general.css";
.btn-reset {
  background-color:#dc3545 !important;
}
.framework-row {
  margin-bottom: 20px;
}
.framework-label {
  text-align: left;
}


</style>