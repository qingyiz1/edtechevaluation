<template>
    <div class="section-template">
    <b-row class="framework-row">
        <b-col>
                <b-row align-h="between">
                    <b-col cols="11" style="padding-right:0">
                        <b-button  @click="onCollapse" variant="primary" class="section-btn">Section</b-button>
                    </b-col>
                    <b-col cols="1" style="padding-left:0">
                        <b-button class="section-btn" variant="danger" @click="onDeleteSection(section.id)">
                            <b-icon icon="trash"></b-icon>
                        </b-button>
                    </b-col>
                </b-row>
            <b-card v-if="visible" class="section-card">
                <b-row align-h="between">
                    <b-col cols="1">
                    <label>Name</label>
                    </b-col>
                    <b-col cols="9">
                    <b-form-input id="sectionName" v-model="section.name"></b-form-input>
                    </b-col>
                    <b-col cols="2">
                    <b-button variant="primary" @click="onCreateNewQuestion()">Question</b-button>
                    </b-col>
                </b-row>
                <b-card v-for="question in questions" :key="question.id" class="questionCard">
                    <b-row align-h="between">
                    <b-col cols="3">
                      <label>Question Name</label>
                    </b-col>
                    <b-col cols="8">
                        <b-form-input id="questionName" v-model="question.questionName"></b-form-input>
                    </b-col>
                    <b-col cols="1">
                        <b-button variant="danger" @click="onDeleteQuestion(question.id)">
                        <b-icon icon="trash"></b-icon>
                        </b-button>
                    </b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="3"></b-col>
                      <b-col cols="9">
                        <label>Description</label>
                      </b-col>
                      <b-col cols="3"><label>Not Applicable</label></b-col>
                      <b-col cols="9"><b-form-input id="questionName" v-model="question.descriptions[0]"></b-form-input></b-col>
                      <b-col cols="3"><label>Below Basic</label></b-col>
                      <b-col cols="9"><b-form-input id="questionName" v-model="question.descriptions[1]"></b-form-input></b-col>
                      <b-col cols="3"><label>Basic</label></b-col>
                      <b-col cols="9"><b-form-input id="questionName" v-model="question.descriptions[2]"></b-form-input></b-col>
                      <b-col cols="3"><label>Adequate</label></b-col>
                      <b-col cols="9"><b-form-input id="questionName" v-model="question.descriptions[3]"></b-form-input></b-col>
                      <b-col cols="3"><label>Exceptional</label></b-col>
                      <b-col cols="9"><b-form-input id="questionName" v-model="question.descriptions[4]"></b-form-input></b-col>
                    </b-row>
                </b-card>
            </b-card>
        </b-col>
    </b-row>
    </div>

</template>

<script>


export default {
  props: {
      section: {
          type: Object
      }
  },
  data(){
    return{
        questions:[],
        visible:false
    }
  },
  computed: {

  },
  methods:{
    onCreateNewQuestion: function () {
        let id = this.questions.length;
        console.log(id)
        let emptyQuestion = {
            id:id,
            questionName:"",
            descriptions:[],
            answer:"",
            selected:0
        };
        this.section.question.push(emptyQuestion);
        this.questions.push(emptyQuestion);
    },
    onDeleteQuestion: function (questionID) {
        console.log(questionID)
        this.section.question.splice(questionID,1);
        this.questions.splice(questionID,1);
    },
    onCollapse: function () {
        this.visible = !this.visible
    },
    onDeleteSection: function (sectionID) {
        this.$parent.$parent.sections.splice(sectionID,1);
    }
  }
}
</script>



<style scoped>
@import "../css/general.css";
.section-template{
    width: 100%;
    margin: 0 20px;
}
.questionCard{
    margin: 10px 0;
}
.framework-label{
    text-align: left;
}
.section-btn {
    width: 100%;
}
.section-card {
    margin-top: 10px;
}
</style>