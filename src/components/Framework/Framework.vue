<template>
  <div id="app" class="framework-list">

    <el-dialog :visible.sync="windowVisible" title="Enter Evaluation Name" width="360px">
      <el-form ref="form" :model="newEva" >
        <el-form-item>
          <el-input v-model="newEva.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="windowVisible = false">Cancel</el-button>
        <el-button type="primary" @click="startEvaluation(newEva)">Confirm</el-button>
      </span>
    </el-dialog>

    <b-alert
        id="frameworkDeleteAlert"
        :show="dismissCountDown"
        dismissible
        fade
        variant="danger"
        @dismiss-count-down="countDownChanged"
    >
      <p>Framework Successfully Deleted!</p>
    </b-alert>
    <b-overlay
    :show="show"
    opacity="0.6"
    variant="transparent"
    @hidden="onHidden">
      <b-button variant="success" @click="createNewFrameowrk">Create a New Framework</b-button>
      <b-row  v-for="(framework,index) in frameworks" :key=framework.id>
        <b-col>
          <b-card
          class="framework-card"
          header-tag="header">
            <template v-slot:header>
              <b-row align-h="between" align-v="center">
                <b-col cols="11"><h6 class="mb-0">{{framework.name}}</h6></b-col>
                <b-col cols="1">
                  <b-button  v-b-modal.preview size="sm" variant="link" @click="onPreview(framework)">
                    <b-icon icon="eye"></b-icon>
                  </b-button>
                </b-col>
              </b-row>
            </template>
            <b-row align-h="between" align-v="center"  no-gutters>
              <b-col cols="10">
                <b-card-text>
                  <b-icon
                  icon="person-circle"
                  style="margin-right:10px">
                  </b-icon>
                {{framework.author}}
                </b-card-text>
                <b-card-text>
                  <b-icon 
                  icon="calendar-date"
                  style="margin-right:10px"></b-icon>{{framework.dateEdited}}
                </b-card-text>
              </b-col>
              <b-col cols="2">
                <!-- <b-button-group size="small">
                  <b-button 
                  @click="onActive(framework)"
                  :style="{'background-color':framework.isActive ? '#28a745 !important':'' }">Active</b-button>
                  <b-button 
                  @click="onInactive(framework)"
                  :style="{'background-color':framework.isActive ? '#6c757d !important':'' }">Inactive</b-button>
                </b-button-group> -->
                <b-form-checkbox
                  v-if="$store.getters.userProfile['role']==='Senior Consultant'"
                  v-model="framework.isActive"
                  name="check-button"
                  size="lg"
                  style="margin-bottom: 0.625rem"
                  switch
                  @change="onActive(framework)">
                <b-button 
                v-if="$store.getters.userProfile['role']==='Senior Consultant'" 
                size="sm"
                style="margin-right: 1rem;margin-left:0.5rem"
                variant="primary"
                @click="editFramework(framework)"><b-icon icon="pencil"></b-icon></b-button>
                <b-button  
                v-if="$store.getters.userProfile['role']==='Senior Consultant'" 
                size="sm"
                variant="danger"
                @click="deleteFramework(framework,index)"><b-icon icon="trash"></b-icon></b-button>
                </b-form-checkbox>
                <b-button 
                :disabled="!framework.isActive"
                variant="primary"
                @click="openEvaWindow(framework)">Start Evaluation</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-overlay>

      <b-modal 
      id="preview" 
      :title="frameworkPreview.name"
      no-stacking
      ok-only 
      size="lg">
        <b-overlay
        :show="showPreview"
        opacity="0.9">
          <b-card no-body>
            <b-tabs card lazy pills vertical>
              <b-tab v-for="section in frameworkPreview.section" :key="section.id" :title="section.name" active @click="onPreviewTabChanged">
                <b-card-text v-for="question in section.question" :key="question.id">{{question.questionName}}</b-card-text>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import {db, evaluationCollection} from "@/tools/firebaseConfig"
import {updateDocument, deleteDocument, getDocument } from "@/tools/firebaseTool"
import * as firebase from "firebase";
// import {router} from "@/router/index.js"
// import {debounce} from 'debounce'
const frameworkPath = "framework/"

export default {
  name: "Framework",
  data(){
    return{
      windowVisible:false,
      newEva:{
        name:'',
        framework:null,
      },
      state: 'loading',
      firebaseData:null,
      frameworks:[],
      errorMessage:"",
      show:"",
      isActive:"",
      dismissSecs: 1.5,
      dismissCountDown: 0,
      showPreview:false,
      frameworkPreview:{},
    }
  },
  // computed:{
  //   activeStyle(isActive) { 
  //     if (isActive) {
  //       return "background-color: #28a745 !important"
  //     } else {
  //       return "background-color:#6c757d !important"
  //     }

  //   }
  // },
  // firestore(){
  //   return{
  //     firebaseData: db.doc(frameworkPath),
  //   }
  // },
  methods:{
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
  createNewFrameowrk: function () {
   this.$router.push('/framework/new_framework')
  },
  onHidden: function () {
    this.show = false;
  },
  onActive: function (framework) {
      framework.isActive = !framework.isActive;
      updateDocument("framework",framework.id, framework);
  },
    openEvaWindow(framework){
      this.windowVisible = true;
      this.newEva.framework = framework
    },
  async startEvaluation(inputData) {
    let newSections = [];
    let newSecData;
    for (const section of inputData.framework['section']) {
      await db.collection("Section").doc(section.id).get().then(function(doc) {
        if (doc.exists) {
          newSecData = doc.data()
        }else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch((error) => {
            console.log("Error getting documents: ", error);
          });
      let newSecRef = await db.collection("Section").doc()
      await newSecRef.set(newSecData)
      await newSecRef.update({id: newSecRef.id})
      newSections.push(db.doc('Section/' + newSecRef.id))
    }

    let evaRef = await evaluationCollection.doc()
    await evaRef.set({
      author: this.$store.getters.userProfile.nickname,
      dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
      dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
      frameworkId: inputData.framework.name,
      isCompleted: false,
      name: inputData.name,
      section: newSections,
      summary: "This is a summary",
    })
    await this.$router.push('editEva/' + evaRef.id)
  },

  onPreviewTabChanged: function (currentTabs) {
    console.log(currentTabs)
  },

  deleteFramework(framework,index){
    this.$bvModal.msgBoxConfirm('This action will delete the framework permanently.', {
      title: 'Warning!',
      size: 'sm',
      buttonSize: 'sm',
      headerBgVariant:'warning',
      okVariant: 'danger',
      okTitle: 'Confirm',
      cancelTitle: 'Cancel',
      footerClass: 'p-2',
      hideHeaderClose: false,
      centered: true
    })
    .then(value => {
      if(value === true){
        this.dismissCountDown = this.dismissSecs
        deleteDocument('framework',framework.id)
        if(this.frameworks[index] === framework) {
          // The template passes index as the second parameter to avoid indexOf,
          // it will be better for the performance especially for one large array
          // (because indexOf actually loop the array to do the match)
          this.frameworks.splice(index, 1)
        } else {
          let found = this.frameworks.indexOf(framework)
          this.frameworks.splice(found, 1)
        }
      }
    })
    .catch(err => {
      // An error occurred
      window.alert(err)
    })

  },

  editFramework:function (framework) {
    this.$router.push("/framework/"+framework.id)
  },

  onPreview: async function (framework) {
    // console.log(framework)
    let sections = [];
    this.showPreview = true;
    this.frameworkPreview = await getDocument("framework",framework.id);
    if (framework.section.length > 0) {
      framework.section.forEach(element => {
        element.get().then(data => {
          sections.push(data.data())
        }).then(() => {
          this.frameworkPreview.section = sections.concat()
          console.log(this.frameworkPreview)
          this.showPreview = false;
        })
      })
      }
  },

  timeConverter: function (timestamp) {
  let tempDate = new Date(timestamp);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = tempDate.getFullYear();
  let month = months[tempDate.getMonth()];
  let date = tempDate.getDate();
  let hour = tempDate.getHours();
  let min = tempDate.getMinutes();
  let sec = tempDate.getSeconds();
  let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
  },
  created: async function () {
    this.show = true;
    const docRef = db.collection(frameworkPath);

    let data = await docRef.get();
    data.forEach(element => {
      let frameworkData = element.data();
      let id = element.id;
      frameworkData.id = id;
      let date = frameworkData.dateEdited;
      if(date) {
        frameworkData.dateEdited = this.timeConverter(date);
      }
      this.frameworks.push(frameworkData)
    })
    this.onHidden();
  },
}
</script>



<style scoped>
@import "../../css/general.css";
.framework-card{
  margin: 10px 50px;
  text-align: left;
}
.framework-list {
  margin-top: 10px;
}
#frameworkDeleteAlert{
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -35px;
  margin-left: -160px;
  z-index: 10;
}
</style>