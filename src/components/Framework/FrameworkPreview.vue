<template>
    <div class="section-template">
      <b-row 
      no-gutters 
      v-for="section in framework.section" :key="section.id" class="section-card">
        <b-col sm="3" cols="3" class="section">{{section.name}}</b-col>
        <b-col sm="9" cols="9" class="question">
          <b-row v-for="question in section.question" :key="question.id">
            <b-col sm="12" style="margin-bottom:5px"><b-icon icon="file-earmark-text" style="margin-right:10px"></b-icon>{{question.questionName}}</b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
</template>

<script>


export default {
  props: {
      framework: {
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
      
  },
}
</script>



<style scoped>
@import "../../css/general.css";
.section-card{
  border: 1px solid #ECF0FB;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 5px 0 #c3c2c29e;

}
.section-card .section{
  padding: 1.5rem 1rem;
  background-image: linear-gradient(45deg,#37B6EE,#2187F0);
  color: #ffffff;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  text-align: center;

}
.section-card .question {
  padding: 1.5rem 1rem;
  color: #6A757E;;

}
</style>