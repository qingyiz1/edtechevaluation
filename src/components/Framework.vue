<template>
  <div id="app" class="framework-list">
    <b-overlay
    :show="show"
    opacity="0.6"
    variant="transparent"
    @hidden="onHidden">
      <b-button variant="success" @click="createNewFrameowrk">Create a New Framework</b-button>
      <b-row v-for="framework in frameworks" :key=framework.id>
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
                v-model="framework.isActive" 
                name="check-button" 
                size="lg"
                @change="onActive(framework)"
                style="margin-bottom: 10px"
                switch
                ></b-form-checkbox>
                <b-button 
                variant="primary" 
                :disabled="!framework.isActive"
                :to="'/editEva/'+framework.id">Start Evaluation</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import {db} from "@/tools/firebaseConfig"
import {updateDocument} from "@/tools/firebaseTool"
// import {router} from "@/router/index.js"
// import {debounce} from 'debounce'
const frameworkPath = "framework/"

export default {
  name: "Framework",
  data(){
    return{
      state: 'loading',
      firebaseData:null,
      frameworks:[],
      errorMessage:"",
      show:"",
      isActive:""
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
  onStartEvaluation: function() {
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

</style>