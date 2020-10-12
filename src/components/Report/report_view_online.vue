<template>


  <section class="text-left mt-4">
    <div class="export" id="export">
    <b-row
      align-h="center"
      v-if="reportData"
    >
      <b-col lg="9" col="12">
        <b-row class="border-bottom border-top" id="row">
          <b-col cols="3" id="col3">
            <b-img
              :src="logo"
              fluid
              alt="Edtech Logo"
            ></b-img>
          </b-col>
          <b-col cols="9" id="col9">
            <h2 class="title mt-4 bt">EdTech Product Evaluation Report</h2>
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
        <ul>
          <li>1. The needs of the educational institution were compiled to provide a baseline to judge the appropriateness of the EdTech product.</li>
          <li>2. The reviewer gathered all available information on the EdTech product. This included general information supplied by the Vendor as well as any independent reviews or research, etc.</li>
          <li>3. The reviewer logged in as all types of users (teachers, learners, administrators, parents or other stakeholders).</li>
          <li>4. The reviewer worked systematically through the product information and the product, filling in the question ratings as relevant evidence was found..</li>
        </ul>
        <h5>Report</h5>
        <p>
          The report contains two sections.
        <ul>
          <li>1. A SUMMARY that shows the ratings assigned per category and the overall comments and recommendations</li>
          <li>2. A DETAILED REPORT that shows the descriptor and review comments per rating</li>
        </ul>

        </p>
        <h5>Summary Report</h5>
        <b-table
          hover
          :fields="summaryTableFields"
          :items="summaryTableItems"
          head-variant="light"
          class="mb-0"
        ></b-table>
        <div class="border p-2">
          Recommendations:<br>
          {{recommendation}}
        </div>
        <h5>Detailed Report</h5>
        <b-table
          hover
          :fields="detailedTableFields"
          :items="detailedTableItems"
          head-variant="light"
          class="detailedReport"
        >
          <template v-slot:cell(NotApplicable)="data">
            {{data.value[0]}}
            <p class="text-center">{{data.value[1]}}</p>
          </template>
          <template v-slot:cell(BelowBasic)="data">
            {{data.value[0]}}
            <p class="text-center">{{data.value[1]}}</p>
          </template>
          <template v-slot:cell(Basic)="data">
            {{data.value[0]}}
            <p class="text-center">{{data.value[1]}}</p>
          </template>
          <template v-slot:cell(Adequet)="data">
            {{data.value[0]}}
            <p class="text-center">{{data.value[1]}}</p>
          </template>
          <template v-slot:cell(Exceptional)="data">
            {{data.value[0]}}
            <p class="text-center">{{data.value[1]}}</p>
          </template>
        </b-table>
      </b-col>
    </b-row>
 
</div>
    <div>
            <div class="text-center">
              <b-button-group>
                <b-button variant="info" @click="download()">Download</b-button>
                <b-button variant="dark" to="/Reports">Back</b-button>
              </b-button-group>
            </div>
          </div>
      <word-report
        :repInfo="repInfo"
        :logo="logo"
        :summaryTableFields="summaryTableFields"
        :summaryTableItems="summaryTableItems"
        :detailedTableItems="detailedTableItems"
        :detailedTableFields="detailedTableFields"
      >
      </word-report>
  </section>
  

</template>

<script src="https://cdn.bootcss.com/jquery/2.2.4/jquery.js"></script>

<script>
import logo from "@/assets/Logo.png";
import { updateDocument } from "@/tools/firebaseTool";
import * as firebase from "firebase";
import { db } from "@/tools/firebaseConfig";
import $ from 'jquery';
//import saveAs from 'file-saver'
import wordExport from '@/tools/jquery.wordexport';
import wordReport from './wordReport'
const selectedConvertToText = [
  "NotApplicable",
  "BelowBasic",
  "Basic",
  "Adequet",
  "Exceptional",
];

export default {
  name: "report_preview_online",
  components: {
    wordReport
  },
  data() {
    return {
      repInfo: {},
      logo: logo,
      reportRef: {},
      reportData: {},
      sections: [],
      recommendation: "",
      summaryTableItems: [],
      summaryTableFields: [
        {
          key: "No",
          label: "No.",
        },
        "Summary",
        "NotApplicable",
        "BelowBasic",
        "Basic",
        "Adequet",
        "Exceptional",
      ],
      detailedTableItems: [],
      detailedTableFields: [
        "DetailedReport",
        "NotApplicable",
        "BelowBasic",
        "Basic",
        "Adequet",
        "Exceptional",
        "Comments",
      ],
    };
  },
  methods: {
    save() {
      updateDocument("report", this.reportRef.id, {
        recommendation: this.recommendation,
        isCompleted: true,
        dateEdited: firebase.firestore.Timestamp.fromDate(new Date()),
      });
      window.alert("Successfully saved");
    },
    download(){
      let styles = "table{border-collapse:collapse;border-spacing:0;border:1px solid;}td{border:1px solid;}th{background:#355085;color:#fff;}td{text-align: center;}";
      wordExport($(".word-report"), "report", styles,this.$route.params.reportId);
    },
    getTime: function (rawDate) {
      if (rawDate) {
        let m = new Date(rawDate.seconds * 1000);
        return m.toLocaleString();
      }
    },
  },

  created: async function () {
    let report_ref = db.collection("report").doc(this.$route.params.reportId);
    this.reportRef = await report_ref.get();
    this.reportData = this.reportRef.data();
    for (let sectionRef of this.reportData.content) {
      let sectionPath = sectionRef.path;
      let section = await db.doc(sectionPath).get();
      this.sections.push(section.data());
    }
    this.recommendation = this.reportData.recommendation;

    this.sections.forEach((section, Sindex) => {
      section.question.forEach((question, Qindex) => {
        let tableRow = {
          No: Sindex + 1 + "." + (Qindex + 1),
          Summary: question.questionName,
          NotApplicable: "□",
          BelowBasic: "□",
          Basic: "□",
          Adequet: "□",
          Exceptional: "□",
        };
        tableRow[selectedConvertToText[question.selected]] = "■";
        this.summaryTableItems.push(tableRow);
      });
    });
    this.repInfo = {
      name: this.reportData.name,
      author: this.reportData.author,
      editedDate: this.reportData.dateEdited.toDate().toLocaleString('en-US'),
      recommendation: this.reportData.recommendation
    }
    this.sections.forEach((section, Sindex) => {
      this.detailedTableItems.push({
        DetailedReport: Sindex+1+". "+section.name,
        _rowVariant: 'primary'
      });
      section.question.forEach((question, Qindex) => {
        console.log(question.selected == 1 ? "■" : "□");
        let tableRow = {
          DetailedReport:
            Sindex + 1 + "." + (Qindex + 1) + " " + question.questionName,
          NotApplicable: [
            question.descriptions[0],
            question.selected == 0 ? "■" : "□",
          ],
          BelowBasic: [
            question.descriptions[1],
            question.selected == 1 ? "■" : "□",
          ],
          Basic: [question.descriptions[2], question.selected == 2 ? "■" : "□"],
          Adequet: [
            question.descriptions[3],
            question.selected == 3 ? "■" : "□",
          ],
          Exceptional: [
            question.descriptions[4],
            question.selected == 4 ? "■" : "□",
          ],
          Comments: question.comment,
        };
        this.detailedTableItems.push(tableRow);
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

h5 {
  margin: 35px 0 15px;
}

ul {
  list-style: none;
}

.detailedReport {
  font-size: 0.6em;
}
.detailedReport p {
  font-size: 1rem;
}
</style>