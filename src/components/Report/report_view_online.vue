<template>
  <b-container class="text-left mt-4">
    <b-row align-h="center" v-if="reportData">
      <b-col cols="9">
        <b-row>
          <b-col cols="3">
            <b-img :src="logo" fluid alt="Edtech Logo"></b-img>
          </b-col>
          <b-col cols="9">
            <h2 class="mt-4">EdTech Product Evaluation Report</h2>
            <h2>[product name]</h2>
            <p>
              Completed by {{reportData.author}}
              <br />
              EdTech Evaluation Consulting, Pty Ltd. {{getTime(this.reportData.dateCreated)}}
            </p>
          </b-col>
        </b-row>
          <h5>Background</h5>
          <p>This report is based on the application of the EdTech Product Evaluation Framework developed by EdTech Evaluation Consulting. The Framework evaluates how well an educational technology fits to the needs of an educational institution. It evaluates the EdTech product against seven areas that are relevant to education. It is intended to be used in conjunction with other software evaluation frameworks, which usually look at more technical criteria.</p>
          <h5>Evaluation Method</h5>
          <p>
            1. The needs of the educational institution were compiled to provide a baseline to judge the appropriateness of the EdTech product.
            2. The reviewer gathered all available information on the EdTech product. This included general information supplied by the Vendor as well as any independent reviews or research, etc.
            3. The reviewer logged in as all types of users (teachers, learners, administrators, parents or other stakeholders).
            4. The reviewer worked systematically through the product information and the product, filling in the question ratings as relevant evidence was found..
          </p>
          <h5>Report</h5>
          <p>
            The report contains two sections.
            1. A SUMMARY that shows the ratings assigned per category and the overall comments and recommendations
            2. A DETAILED REPORT that shows the descriptor and review comments per rating
          </p>

          <b-table striped hover :items="tableitems"></b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import logo from "@/assets/Logo.png";
import { updateDocument } from "@/tools/firebaseTool";
import * as firebase from "firebase";
import { db } from "@/tools/firebaseConfig";
const selectedConvertToText = [
  "NotApplicable",
  "BelowBasic",
  "Basic",
  "Adequet",
  "Exceptional",
];

export default {
  name: "report_preview_online",
  data() {
    return {
      logo: logo,
      reportRef: {},
      reportData: {},
      sections: [],
      recommendation: "",
      tableitems: [],
    };
  },
  methods: {
    save() {
      updateDocument("report", this.reportRef.id, {
        recommendation: this.recommendation,
        isCompleted: true,
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
      });
      window.alert("Successfully uploaded");
    },
    getTime: function (rawDate) {
      if (rawDate) {
        let m = new Date(rawDate.seconds * 1000);
        return m.toLocaleString();
      }
    },
  },
  created: async function () {
    console.log(this.$route.params.reportId)
    let report_ref = db.collection("report").doc(this.$route.params.reportId);
    this.reportRef = await report_ref.get();
    this.reportData = this.reportRef.data();
    for (let sectionRef of this.reportData.content) {
      let sectionPath = sectionRef.path;
      let section = await db.doc(sectionPath).get();
      this.sections.push(section.data());
    }
    this.recommendation = this.reportData.recommendation;
    console.log(this.reportData);
    console.log(this.sections);

    this.sections.forEach((section, Sindex) => {
      section.question.forEach((question, Qindex) => {
        let tableRow = {
          No: Sindex + 1 + "." + (Qindex + 1),
          summary: question.questionName,
          NotApplicable: "□",
          BelowBasic: "□",
          Basic: "□",
          Adequet: "□",
          Exceptional: "□",
        };
        tableRow[selectedConvertToText[question.selected]] = "■";
        this.tableitems.push(tableRow);
      });
    });
  },
};
</script>

<style scoped>
* {
  color: #000;
  margin: 0;
}
</style>