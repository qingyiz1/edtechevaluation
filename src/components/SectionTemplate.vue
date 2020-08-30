<template>
    <div class="section-template">
    <b-row class="framework-row">
        <b-col>
                <b-row align-h="between">
                    <b-col cols="10">
                        <b-button  @click="onCollapse" class="section-btn">Section</b-button>
                    </b-col>
                    <b-col cols="1">
                        <b-button class="section-btn" @click="onDeleteSection(section.id)">
                            <b-icon icon="trash"></b-icon>
                        </b-button>
                    </b-col>
                </b-row>
            <b-card v-if="visible" class="section-card">
                <b-row align-h="between">
                    <b-col cols="2" class="framework-label">
                    <label for="sectionName">Name</label>
                    </b-col>
                    <b-col cols="8">
                    <b-form-input id="sectionName" v-model="section.name"></b-form-input>
                    </b-col>
                    <b-col cols="2">
                    <b-button @click="onCreateNewQuestion()">Question</b-button>
                    </b-col>
                </b-row>
                <b-card v-for="question in questions" :key="question.id" class="questionCard">
                    <b-row align-h="between">
                    <b-col cols="3" class="framework-label">
                        <label for="questionName">Question Name</label>
                    </b-col>
                    <b-col cols="8">
                        <b-form-input id="questionName" v-model="question.questionName"></b-form-input>
                    </b-col>
                    <b-col cols="1">
                        <b-button @click="onDeleteQuestion(question.id)">
                        <b-icon icon="trash"></b-icon>
                        </b-button>
                    </b-col>
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
            answer:""
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
        this.$parent.sections.splice(sectionID,1);
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