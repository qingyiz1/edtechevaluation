<template>
  <div id="app" class="framework-list">

    <el-dialog title="Enter Evaluation Name" :visible.sync="windowVisible" width="360px">
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
      <b-row v-for="(framework,index) in frameworks" :key=framework.id>
        <b-col>
          <b-card
          :header="framework.name"
          header-tag="header"
          class="framework-card">
            <b-row no-gutters>
              <b-col md="10">
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
              <b-col md="2">
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
                  @change="onActive(framework)"
                  style="margin-bottom: 10px"
                  switch>
                <b-button v-if="framework.isActive === false&&$store.getters.userProfile['role']==='Senior Consultant'" variant="danger" size="sm" @click="deleteFramework(framework,index)">Delete</b-button></b-form-checkbox>
                <b-button 
                variant="primary" 
                :disabled="!framework.isActive"
                @click="openEvaWindow(framework)">Start Evaluation</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import {db, evaluationCollection} from "@/tools/firebaseConfig"
import {updateDocument, deleteDocument, } from "@/tools/firebaseTool"
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
      let newSecRef = await db.collection("Section").add(newSecData)
      newSections.push("/Section/"+newSecRef.id)
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
@import "../css/general.css";
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