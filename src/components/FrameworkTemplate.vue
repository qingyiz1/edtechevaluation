

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
                  <label>Name</label>
                </b-col>
                <b-col cols="8">
                  <b-form-input id="frameworkName" v-model="frameworkName"></b-form-input>
                </b-col>
                <b-col cols="2">
                  <b-button @click="onCreateNewSecion" variant="primary">New Section</b-button>
                </b-col>
              </b-row>
              <!-- </b-form-group> -->
              <b-row v-for="section in sections" :key="section.id" class="framework-row">
                <section-template :section=section></section-template>
              </b-row>
          </b-form>
          <b-row align-h="center">
            <b-col cols="3">
              <b-button v-b-modal="'submit'" variant="primary" >Submit</b-button>
            </b-col>
            <b-col cols="3">
              <b-button class="btn-reset" v-b-modal="'reset'" variant="danger">Reset</b-button>
            </b-col>
            <b-col cols="3">
              <b-button class="btn-reset" v-b-modal="'cancel'">Cancel</b-button>
            </b-col>
          </b-row>
      </b-card>
      <b-modal 
      id="submit" 
      size="sm" 
      button-size="sm"
      title="Alert"
      @ok="updateFrameWork">Submit framework?</b-modal>
      <b-modal 
      id="reset" 
      size="sm" 
      button-size="sm"
      title="Alert"
      @ok="onReset">Reset all?</b-modal>
      <b-modal 
      id="cancel" 
      size="sm" 
      button-size="sm"
      title="Alert"
      @ok="onCancel">Discard changes?</b-modal>
    </b-container>
  </b-overlay>
</div>

</template>
<script>
import { createDocument, getDocument } from "@/tools/firebaseTool";
import "firebase/auth";
import {db} from "@/tools/firebaseConfig";
import * as firebase from "firebase";
import SectionTemplate from "@/components/SectionTemplate";
var frameworkPath = "/framework" + Math.ceil(Math.random()*100);
export default {
  name: "Framework_Template",
  data(){
    return{
      frameworkName:"",
      framework:{},
      sections:[],
      key:0,
      version:1,
      showOverlay:false,
      showWarning:false,
      warningType:"",
      author:"",
      isEdit:false,
    }
  },
  components: {
    SectionTemplate
  },
  methods:{
    updateFrameWork: async function (){
      this.showOverlay = true;
      if (this.frameworkName.length !== 0) {
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
            if (this.sections[i].name.length === 0) {
              this.showOverlay = false;
              this.showWarning = true;
              this.warningType = "section name";
              checkSection = false
              break;
            } else {
              for (let j = 0; j < this.sections[i].question.length; j++) {
                if(this.sections[i].question[j].questionName.length === 0) {
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
          let sectionArray = [];
          for (let i = 0; i < this.sections.length; i++ ) {
            let sectionRef = db.collection("Section").doc()
            await sectionRef.set(this.sections[i])
            sectionArray.push(db.doc('Section/' + sectionRef.id));
          }
          this.framework = {
          name:this.frameworkName,
          section:sectionArray,
          dateCreated: Date.parse(new Date()),
          dateEdited: Date.parse(new Date()),
          author:this.author,
          version:this.version,
          isActive:true
        }
          createDocument("framework",frameworkPath,this.framework);
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
    onCreateNewSecion() {
      let emptySection = {
          name:"",
          question:[],
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
    onCancel:function () {
      this.$router.push("/framework")
    }
  },
  created: async function () {
    this.showOverlay = true;
    let usrInfo = await db.collection("userInfo").doc(firebase.auth().currentUser.email).get();
    this.author = usrInfo.data()['nickname'];
    if (this.$route.params.id) {
      this.isEdit = true;
      frameworkPath = "/" + this.$route.params.id;
      let framework = await getDocument("framework",this.$route.params.id);
      this.framework = framework;
      this.frameworkName = framework.name;
      if (framework.section.length > 0) {
        framework.section.forEach(element => {
          element.get().then(data => {
            this.sections.push(data.data())
            this.showOverlay = false;
          })
        })
      }
      // this.showOverlay = false;
    } 
    this.showOverlay = false;
    
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
.framework-container {
  margin-top: 0.625rem;
}
.framework-row {
  margin-bottom: 1.25rem;
}
.framework-label {
  text-align: left;
}


</style>