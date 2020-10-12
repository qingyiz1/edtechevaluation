<template>
  <b-overlay :show="show" opacity="0.9" @hidden="onHidden">
    <div :class="isMobile? 'mobile': 'desktop'">
      <b-modal
        id="delete"
        button-size="md"
        centered
        header-bg-variant="warning"
        ok-title="Confirm"
        ok-variant="danger"
        size="md"
        title="Are you sure?"
        body-text-variant="danger"
        @ok="deleteReport(repID)"
      >
        <div class="d-block text-center">
          <h4>This action will delete the report permanently!</h4>
        </div>
      </b-modal>

      <div class="list-container">
        <b-row no-gutters class="functional-container">
          <h4 class="list-title" v-if="isMobile">Reports</h4>
          <b-input-group size="sm" class="list-search">
            <b-form-input type="search" placeholder="Search"></b-form-input>
            <b-input-group-append is-text>
              <b-icon icon="search"></b-icon>
            </b-input-group-append>
          </b-input-group>
        </b-row>
        <b-row no-gutters class="list list-header" v-if="!isMobile" align-content="center">
          <b-col cols="1">Complete</b-col>
          <b-col cols="2">Report Name</b-col>
          <b-col cols="1">Evaluation</b-col>
          <b-col cols="1">Author</b-col>
          <b-col cols="2">Created Time</b-col>
          <b-col cols="1">Recommender</b-col>
          <b-col cols="2">Edited Time</b-col>
          <b-col cols="2">Action</b-col>
        </b-row>
        <h3
          v-if="this.ownReports.length === 0"
        >You may not have generated any report yet or the connection to database is lost, try to reload this page!</h3>
        <!-- layout for desktop -->
        <b-row
          :hidden="isMobile"
          no-gutters
          v-for="rep in ownReports"
          v-bind:key="rep.id"
          class="list list-content"
          align-content="center"
          align-h="center"
          align-v="center"
        >
          <b-col>
            <b-form-checkbox
              v-model="rep.isCompleted"
              name="check-button"
              class="action_btn"
              size="lg"
              switch
              @change="toggleIsComplete(rep)"
            ></b-form-checkbox>
          </b-col>
          <b-col
            cols="2"
            @click="displayRep(rep.id)"
            class="list-content-display"
            v-b-tooltip.hover
            title="View Report"
          >{{rep.name}}</b-col>
          <b-col cols="1">{{rep.evaluationName}}</b-col>
          <b-col cols="1">{{rep.author}}</b-col>
          <b-col cols="2">{{rep.dateCreated.toDate().toLocaleString('en-US')}}</b-col>
          <b-col cols="1">{{rep.author}}</b-col>
          <b-col cols="2">{{rep.dateEdited.toDate().toLocaleString('en-US')}}</b-col>
          <b-col cols="2">
            <b-button
              :disabled="!rep.isCompleted"
              @click="openSendWindow(rep.id)"
              size="sm"
              variant="link"
              style="padding:0"
              class="action_btn"
              v-b-tooltip.hover
              title="Share Report"
            >
              <b-avatar style="background:#006eb6;color: white" icon="share" size="2rem"></b-avatar>
            </b-button>
            <b-button
              :disabled="!rep.isCompleted"
              @click="downloadReport(rep.id, rep.name, rep.author,rep.dateEdited.toDate().toLocaleString('en-US'),rep.recommendation)"
              size="sm"
              variant="link"
              style="padding:0"
              class="action_btn"
              v-b-tooltip.hover
              title="Download Report"
            >
              <b-avatar variant="dark" icon="file-earmark-arrow-down" size="2rem"></b-avatar>
            </b-button>
            <b-button
              variant="link"
              @click="editRep(rep.id)"
              class="action_btn"
              size="sm"
              style="padding:0"
              v-b-tooltip.hover
              title="Edit Report"
            >
              <b-avatar variant="success" icon="pencil" size="2rem"></b-avatar>
            </b-button>
            <b-button
              variant="link"
              v-b-modal.delete
              @click="setRepId(rep.id)"
              class="action_btn"
              size="sm"
              style="padding:0"
              v-b-tooltip.hover
              title="Delete Report"
            >
              <b-avatar variant="danger" icon="trash" size="2rem"></b-avatar>
            </b-button>
          </b-col>
        </b-row>
        <!-- layout for mobile -->

        <b-row
          :hidden="!isMobile"
          no-gutters
          v-for="rep in ownReports"
          v-bind:key="rep.id"
          class="list list-content"
          align-content="center"
          align-h="center"
          align-v="center"
        >
          <b-col cols="9">
            <b-col class="item-title" @click="displayRep(rep.id)">{{rep.name}}</b-col>
            <b-col class="item-content">
              <b-icon icon="person-fill" style="margin-right:10px;font-size:12px"></b-icon>
              {{rep.author}}
            </b-col>
            <b-col class="item-content">
              <b-icon icon="calendar3" style="margin-right:10px;font-size:12px"></b-icon>
              {{rep.dateEdited.toDate().toLocaleString('en-US')}}
            </b-col>
            <b-col class="item-content">
              <b-icon icon="file-earmark-check" style="margin-right:10px;font-size:12px"></b-icon>
              {{rep.evaluationName}}
            </b-col>
          </b-col>
          <b-col cols="3" style="text-align:right">
            <b-dropdown class="action-menu" variant="link" no-caret>
              <template v-slot:button-content>
                <b-icon icon="three-dots"></b-icon>
              </template>
              <b-dropdown-item
                :disabled="!rep.isCompleted"
                @click="openSendWindow(rep.id)"
                v-b-tooltip.hover
                title="Share Report"
              >Share Report</b-dropdown-item>
              <b-dropdown-item
                :disabled="!rep.isCompleted"
                @click="downloadReport(rep.id)"
              >Download Report</b-dropdown-item>
              <b-dropdown-item @click="editReport(rep.id)">Edit</b-dropdown-item>
              <b-dropdown-item v-b-modal.delete @click="setRepId(rep.id)">Delete</b-dropdown-item>
            </b-dropdown>
            <b-form-checkbox
              v-model="rep.isCompleted"
              name="check-button"
              class="action_btn"
              switch
              @change="toggleIsComplete(rep)"
            ></b-form-checkbox>
          </b-col>
        </b-row>
      </div>
    </div>
    <el-dialog :visible.sync="sendWindowVisible" title="Send Report" width="360px">
      <el-form ref="form" :model="sendReport" label-width="80px">
        <el-form-item label="Email">
          <el-input v-model="sendReport.email"></el-input>
        </el-form-item>
        <el-form-item label="Note">
          <el-input v-model="sendReport.message" :rows="5" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendWindowVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sendEmail()">Confirm</el-button>
      </span>
    </el-dialog>
    <word-report
      :logo="logo"
      :repInfo="repInfo"
      :summaryTableFields="summaryTableFields"
      :summaryTableItems="summaryTableItems"
      :detailedTableItems="detailedTableItems"
      :detailedTableFields="detailedTableFields"
    ></word-report>
  </b-overlay>
</template>

<script>
import { deleteDocument, updateDocument } from '@/tools/firebaseTool'
import { reportCollection } from '@/tools/firebaseConfig'
import { getDocument } from '@/tools/firebaseTool'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
// import Docxtemplater from 'docxtemplater'
// import PizZip from 'pizzip'
// import JSZipUtils from 'jszip-utils'
// import { saveAs } from 'file-saver'
import { Email } from '@/tools/smtp'
import logo from '@/assets/Logo.png'
import wordReport from './wordReport'
import { db } from '@/tools/firebaseConfig'
import $ from 'jquery'
import wordExport from '@/tools/jquery.wordexport'
const selectedConvertToText = [
  'NotApplicable',
  'BelowBasic',
  'Basic',
  'Adequet',
  'Exceptional',
]
export default {
  name: 'Reports',
  components: {
    wordReport,
  },
  data() {
    return {
      repInfo: {},
      sections: [],
      detailedTableItems: [],
      detailedTableFields: [
        'DetailedReport',
        'NotApplicable',
        'BelowBasic',
        'Basic',
        'Adequet',
        'Exceptional',
        'Comments',
      ],
      reportRef: [],
      reportData: [],
      summaryTableItems: [],
      summaryTableFields: [
        {
          key: 'No',
          label: 'No.',
        },
        'Summary',
        'NotApplicable',
        'BelowBasic',
        'Basic',
        'Adequet',
        'Exceptional',
      ],
      logo: logo,
      reportList: [],
      repInfoSend: {},
      sendWindowVisible: false,
      sendReport: {
        email: '',
        message: '',
      },
      Id: '',
      repID: '',
      show: '',
      isMobile: false,
    }
  },
  async created() {},
  mounted() {
    this.onHidden()
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.isMobile = true
    }
  },
  computed: {
    ownReports() {
      if (this.$store.getters.userProfile.role === 'Senior Consultant') {
        return this.reportList
      } else {
        return this.reportList.filter(
          report => report.authorUid === this.$store.getters.userProfile.uid,
        )
      }
    },
  },
  methods: {
    deleteReport(repId) {
      deleteDocument('report', repId)
      firebase
        .storage()
        .ref()
        .child('Report/' + repId + '.docx')
        .delete()
    },
    toggleIsComplete(rep) {
      rep.isCompleted = !rep.isCompleted
      updateDocument('report', rep.id, { isCompleted: rep.isCompleted })
    },
    displayRep: function(repID) {
      this.$router.push('/report_view_online/' + repID)
    },
    editRep: function(repID) {
      this.$router.push('/report_preview/' + repID)
    },
    onHidden() {
      setTimeout(() => {
        this.show = false
      }, 600)
    },
    setRepId(id) {
      this.repID = id
    },

    async downloadReport(repId, name, author, editedDate,recommendation) {
      this.repInfo = {
        name,
        author,
        editedDate,
        recommendation,
      }
      let report_ref = db.collection('report').doc(repId)
      this.reportRef = await report_ref.get()
      this.reportData = this.reportRef.data()
      for (let sectionRef of this.reportData.content) {
        let sectionPath = sectionRef.path
        let section = await db.doc(sectionPath).get()
        this.sections.push(section.data())
      }
      this.sections.forEach((section, Sindex) => {
        section.question.forEach((question, Qindex) => {
          let tableRow = {
            No: Sindex + 1 + '.' + (Qindex + 1),
            Summary: question.questionName,
            NotApplicable: '□',
            BelowBasic: '□',
            Basic: '□',
            Adequet: '□',
            Exceptional: '□',
          }
          tableRow[selectedConvertToText[question.selected]] = '■'
          this.summaryTableItems.push(tableRow)
        })
      })
      this.sections.forEach((section, Sindex) => {
        this.detailedTableItems.push({
          DetailedReport: Sindex + 1 + '. ' + section.name,
          _rowVariant: 'primary',
        })
        section.question.forEach((question, Qindex) => {
          let tableRow = {
            DetailedReport:
              Sindex + 1 + '.' + (Qindex + 1) + ' ' + question.questionName,
            NotApplicable: [
              question.descriptions[0],
              question.selected == 0 ? '■' : '□',
            ],
            BelowBasic: [
              question.descriptions[1],
              question.selected == 1 ? '■' : '□',
            ],
            Basic: [
              question.descriptions[2],
              question.selected == 2 ? '■' : '□',
            ],
            Adequet: [
              question.descriptions[3],
              question.selected == 3 ? '■' : '□',
            ],
            Exceptional: [
              question.descriptions[4],
              question.selected == 4 ? '■' : '□',
            ],
            Comments: question.comment,
          }
          this.detailedTableItems.push(tableRow)
        })
      })
      this.$nextTick(() => {
        let styles =
          'table{border-collapse:collapse;border-spacing:0;border:1px solid;}td{border:1px solid;}th{background:#355085;color:#fff;}td{text-align: center;}'
        wordExport($('.word-report'), 'report', styles,repId)
      })
    },
    async openSendWindow(repId) {
      this.sendWindowVisible = true
      global.repInfoSend = await getDocument('report', repId)
      global.Id = repId
    },
    async sendEmail() {
      let storageRef = firebase.storage().ref()
      const url = await storageRef
        .child('Report/' + global.Id + '.doc')
        .getDownloadURL()

      Email.send({
        Host: 'smtp.gmail.com',
        Username: 'edtech.echidna@gmail.com',
        Password: 'edtechechidna',
        To: this.sendReport.email,
        From: 'edtech.echidna@gmail.com',
        Subject: 'Report-' + global.repInfoSend.name,
        Body: this.sendReport.message,
        Attachments: [
          {
            name: global.repInfoSend.name + '.doc',
            path: url,
          },
        ],
      }).then(() => {
        this.sendWindowVisible = false
        window.alert('Report has been sent to ' + this.sendReport.email)
        this.sendReport.email = ''
        this.sendReport.message = ''
        global.repInfoSend = {}
        global.Id = ''
      })
    },
  },
  firestore: {
    reportList: reportCollection,
  },
}
</script>



<style scoped>
@import '../../css/general.css';
@import '../../css/list.css';
</style>