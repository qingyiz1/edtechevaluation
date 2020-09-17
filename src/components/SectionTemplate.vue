<template>
    <div class="section-template">
    <b-row class="framework-row">
        <b-col>
            <b-card> 
                    <b-row align-h="between">
                        <b-col cols="11" style="padding-right:0">
                            <b-button  @click="onCollapse" variant="primary" class="section-btn">Section</b-button>
                        </b-col>
                        <b-col cols="1" style="padding-left:0">
                            <b-button class="delete-btn" variant="primary" @click="onDeleteSection(section.id)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </b-col>
                    </b-row>
                    <div class="section-body" v-if="visible">
                    <b-row align-h="between"  >
                        <b-col cols="1">
                        <label>Name</label>
                        </b-col>
                        <b-col cols="9">
                        <b-form-input id="sectionName" v-model="section.name" required></b-form-input>
                        </b-col>
                        <b-col cols="2">
                        <b-button variant="primary" @click="onCreateNewQuestion()">New Question</b-button>
                        </b-col>
                    </b-row>
                    <b-card no-body v-if="section.question.length > 0" class="question-body">
                        <b-tabs card>
                            <!-- Render Tabs, supply a unique `key` to each tab -->
                            <b-tab v-for="question in section.question" :key="'dyn-tab-' + question.id">
                                <template v-slot:title>
                                    Question
                                    <b-button size="sm" variant="link" @click="onDeleteQuestion(question.id)">
                                        <b-icon icon="x" ></b-icon>
                                    </b-button>
                                </template>
                                <div class="question-body">
                                    <b-row>
                                    <b-col cols="3">
                                    <label>Question Name</label>
                                    </b-col>
                                    <b-col cols="8">
                                        <b-form-input id="questionName" v-model="question.questionName" ></b-form-input>
                                    </b-col>
                                    <!-- <b-col cols="3"><label>Description</label></b-col>
                                    <b-col cols="9"></b-col> -->
                                    
                                    <b-col cols="3"><label>Not Applicable</label></b-col>
                                    <b-col cols="8"><b-form-input id="questionName" v-model="question.descriptions[0]"></b-form-input></b-col>
                                    <b-col cols="3"><label>Below Basic</label></b-col>
                                    <b-col cols="8"><b-form-input id="questionName" v-model="question.descriptions[1]"></b-form-input></b-col>
                                    <b-col cols="3"><label>Basic</label></b-col>
                                    <b-col cols="8"><b-form-input id="questionName" v-model="question.descriptions[2]"></b-form-input></b-col>
                                    <b-col cols="3"><label>Adequate</label></b-col>
                                    <b-col cols="8"><b-form-input id="questionName" v-model="question.descriptions[3]"></b-form-input></b-col>
                                    <b-col cols="3"><label>Exceptional</label></b-col>
                                    <b-col cols="8"><b-form-input id="questionName" v-model="question.descriptions[4]"></b-form-input></b-col>
                                    </b-row>
                                </div>
                            </b-tab>
                            </b-tabs>
                    </b-card>
                </div>
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
      },
  },
  data(){
    return{
        visible:true,
    }
  },
  computed: {

  },
  methods:{
    onCreateNewQuestion: function () {
        let id = this.section.question.length;
        let emptyQuestion = {
            id:id,
            questionName:"",
            descriptions:[],
            answer:"",
            selected:0
        };
        this.section.question.push(emptyQuestion);
    },
    onDeleteQuestion: function (questionID) {
        let deleteID = 0
        for (let i = 0; i < this.section.question.length; i++) {
            if(this.section.question[i].id === questionID) {
                deleteID = i;
            }
        }
        this.section.question.splice(deleteID,1);
    },
    onCollapse: function () {
        this.visible = !this.visible
    },
    onDeleteSection: function (sectionID) {
        this.$parent.$parent.sections.splice(sectionID,1);
    },
  },
}
</script>



<style scoped>
@import "../css/general.css";
.section-template{
    width: 100%;
    margin: 0 1.25rem;
}
.question-body{
    margin: 1rem 0;
}
.framework-label{
    text-align: left;
}
.section-btn {
    width: 100%;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.delete-btn {
    width: 100%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.section-body {
    margin-top: 0.625rem;
    padding: 0.625rem;
}
.card-body {
    padding: 0;
}
</style>