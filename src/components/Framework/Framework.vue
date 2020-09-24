<template>
  <div>
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
    opacity="0.9"
    @hidden="onHidden">
    <div class="list-container">
      <b-row no-gutters class="functional-container">
        <b-input-group size="sm" class="list-search">
          <b-form-input type="search" placeholder="Search"></b-form-input>
          <b-input-group-append is-text>
            <b-icon icon="search"></b-icon>
          </b-input-group-append>
        </b-input-group>
        <b-button @click="createNewFramework" class="list-create-btn">New</b-button>
      </b-row>
      <b-row 
      no-gutters
      class="list list-header" 
      align-content="center">
        <b-col cols="1">Status</b-col>
        <b-col cols="2">Framework Name</b-col>
        <b-col cols="1">Author</b-col>
        <b-col cols="2">Created Time</b-col>
        <b-col cols="1">Editor</b-col>
        <b-col cols="2">Edited Time</b-col>
        <b-col cols="1">Version</b-col>
        <b-col cols="2">Action</b-col>
      </b-row>
      <h3 v-if="this.visibleFramework.length === 0">No active framework present or the connection to database is lost, try to reload this page!</h3>
      <b-row 
      v-for="(framework,index) in visibleFramework" :key=framework.id
      no-gutters
      class="list list-content" 
      align-content="center" 
      align-h="center"
      align-v="center">
        <b-col cols="1">
          <b-form-checkbox
              class="action_btn"
              v-if="$store.getters.userProfile['role'] ==='Senior Consultant'"
              v-model="framework.isActive"
              name="check-button"
              size="lg"
              switch
              @change="onActive(framework)">
          </b-form-checkbox>
          <b-icon
              v-if="$store.getters.userProfile['role'] !=='Senior Consultant'"
              variant="success"
              icon="check-circle-fill"
              size="2.5rem"
          ></b-icon>
        </b-col>
        <b-col cols="2">{{framework.name}}</b-col>
        <b-col cols="1">{{framework.author}}</b-col>
        <b-col cols="2">{{framework.dateCreated.toDate().toLocaleString('en-US')}}</b-col>
        <b-col cols="1">{{framework.author}}</b-col>
        <b-col cols="2">{{framework.dateEdited.toDate().toLocaleString('en-US')}}</b-col>
        <b-col cols="1">{{framework.version}}</b-col>
        <b-col cols="2">
          <b-button
              class="action_btn"
              v-if="$store.getters.userProfile['role']==='Senior Consultant'"
              :disabled="!framework.isActive"
              variant="link"
              style="padding:0"
              @click="openEvaWindow(framework)"
              v-b-tooltip.hover title="Start Evaluation"><b-avatar style="background:#006eb6;color: white" icon="file-earmark-plus" size="2rem"></b-avatar></b-button>
          <b-button
              class="action_btn"
            variant="link" 
            style="padding:0"
            v-if="$store.getters.userProfile['role']==='Senior Consultant'" 
            @click="editFramework(framework)"
              v-b-tooltip.hover title="Edit Framework"><b-avatar variant="success" icon="pencil" size="2rem"></b-avatar></b-button>
          <b-button
            class="action_btn"
            variant="link"
            style="padding:0"
            v-if="$store.getters.userProfile['role']==='Senior Consultant'"
            @click="deleteFramework(framework,index)"
            v-b-tooltip.hover title="Delete Framework"><b-avatar variant="danger" icon="trash" size="2rem"></b-avatar></b-button>
          <b-button
              v-if="$store.getters.userProfile['role']!=='Senior Consultant'"
            variant="primary"
            class="list-inline-btn-lg action_btn"
              @click="openEvaWindow(framework)"
          >Start Evaluation</b-button>
        </b-col>
      </b-row>
    </div>
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
import {db, evaluationCollection, frameworkCollection} from "@/tools/firebaseConfig"
import {updateDocument, deleteDocument, getDocument } from "@/tools/firebaseTool"
import * as firebase from "firebase";

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
  computed:{
    visibleFramework() {
      if(this.$store.getters.userProfile.role === "Senior Consultant"){
        return this.frameworks;
      }else{
        let visibleFrameworks = this.frameworks.filter(frameworks=> frameworks.isActive === true)
        console.log(visibleFrameworks)
        return visibleFrameworks
      }
    }
  },
  firestore(){
    return{
      frameworks: db.collection("framework")
    }
  },
  methods:{
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    createNewFramework: function () {
     this.$router.push('/framework/new_framework')
    },
    onHidden(){
      setTimeout(()=>{
        this.show = false
      },600)
    },
    onActive: function (framework) {
        framework.isActive = !framework.isActive;
        updateDocument("framework",framework.id, {isActive:framework.isActive});
    },
      openEvaWindow(framework){
        this.windowVisible = true;
        this.newEva.framework = framework
      },
    async startEvaluation(inputData) {
      let newSections = [];
      let newSecData;
      for (const section of inputData.framework['section']) {
        await db.collection("section").doc(section.id).get().then(function(doc) {
          if (doc.exists) {
            newSecData = doc.data()
          }else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }).catch((error) => {
              console.log("Error getting documents: ", error);
            });
        let newSecRef = await db.collection("section").doc()
        await newSecRef.set(newSecData)
        await newSecRef.update({id: newSecRef.id})
        newSections.push(db.doc('section/' + newSecRef.id))
      }

      let evaRef = await evaluationCollection.doc()
      await evaRef.set({
        id: evaRef.id,
        author: this.$store.getters.userProfile.nickname,
        authorUid: this.$store.getters.userProfile.uid,
        editor:this.$store.getters.userProfile.nickname,
        editorUid: this.$store.getters.userProfile.uid,
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
        frameworkId: inputData.framework.id,
        frameworkName: inputData.framework.name,
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
    deleteFramework(framework){
      const h = this.$createElement
      const messageVNode = h('div', { class: ['d-block','text-center'] }, [
        h('h4', [
          'This action will delete the evaluation permanently!'
        ]),
      ])
      this.$bvModal.msgBoxConfirm([messageVNode], {
        bodyTextVariant: "danger",
        title: "Are you sure?",
        size: 'md',
        buttonSize: 'md',
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
          let sectionsRef;
          frameworkCollection.doc(framework.id)
              .get()
              .then((doc) => {
                sectionsRef = doc.data().section;
                for(const sectionRef of sectionsRef){
                  db.doc(sectionRef.path).delete()
                }
                deleteDocument('framework',framework.id)
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
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
      //console.log(framework)
      let sections = [];
      this.showPreview = true;
      this.frameworkPreview = await getDocument("framework",framework.id);
      if (framework.section.length > 0) {
        framework.section.forEach(element => {
          sections.push(element)
          this.frameworkPreview.section = sections.concat()
          console.log(this.frameworkPreview)
          this.showPreview = false;
        })
        }
    },
  },
  created: async function () {
    this.show = true;
    this.onHidden();
  },
}
</script>



<style scoped>
@import "../../css/general.css";
@import "../../css/list.css";
#frameworkDeleteAlert{
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -35px;
  margin-left: -160px;
  z-index: 10;
}
</style>