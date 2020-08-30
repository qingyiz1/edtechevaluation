

<template>
<div>
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
          <b-button @click="updateFrameWork">Submit</b-button>
        </b-col>
        <b-col cols="3">
          <b-button class="btn-reset" @click="onReset">Reset</b-button>
        </b-col>
      </b-row>
  </b-card>
</b-container>

</div>

</template>
<script>
import { createDocument,createReference } from "@/tools/firebaseTool";
import "firebase/auth";
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
      version:1
    }
  },
  components: {
    SectionTemplate
  },
  methods:{
    updateFrameWork: function (){ 
      this.framework = {
        name:this.frameworkName,
        section:"",
        dateCreated: Date.parse(new Date()),
        dateEdited: Date.parse(new Date()),
        author:"",
        version:this.version
      }
      createDocument("framework",frameworkPath,this.framework);
      for (let i = 0; i < this.sections.length; i++ ) {
        createDocument("Section",sectionPath,this.sections[i]);
      }
      console.log(frameworkPath+"/section")
      createReference(frameworkPath+"/section", this.sections)
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