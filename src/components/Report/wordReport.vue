<template>
  <div class="word-report" style="font-family:Tw Cen MT">
    <table
      class="header"
      style="border: 1px solid #000; border-left:none;border-right: none;height:201px;width:100%;"
    >
      <tbody style="width:100%;">
        <tr>
          <td>
            <img
              :src="logo"
              style="width:150px;height:150px;  "
            />
          </td>
          <td width="80%">
            <h1 class="title" style="color: #355085;text-align: left;margin-left:10px;">EdTech Product Evaluation Report</h1>
            <h5 style="color: #355085;text-align: left;margin-left:10px;">{{repInfo.name}}</h5>
            <h5 style="color: #355085;text-align: left;margin-left:10px;">Completed by {{repInfo.author}}</h5>
            <h5 style="color: #355085;text-align: left;margin-left:10px;">EdTech Evaluation Consulting, Pty Ltd. {{repInfo.editedDate}}</h5>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="background">
      <h3 style="color: #355085;">Background</h3>
      <p
        class="content"
      >This report is based on the application of the EdTech Product Evaluation Framework developed by EdTech Evaluation Consulting. The Framework evaluates how well an educational technology fits to the needs of an educational institution. It evaluates the EdTech product against seven areas that are relevant to education. It is intended to be used in conjunction with other software evaluation frameworks, which usually look at more technical criteria.</p>
    </div>
    <ul class="evaluation-method" style="color: #355085;list-style: none;">
      <li>1.The needs of the educational institution were compiled to provide a baseline to judge the appropriateness of the EdTech product.</li>
      <li>2.The reviewer gathered all available information on the EdTech product. This included general information supplied by the Vendor as well as any independent reviews or research, etc.</li>
      <li>3.The reviewer logged in as all types of users (teachers, learners, administrators, parents or other stakeholders).</li>
      <li>4.The reviewer worked systematically through the product information and the product, filling in the question ratings as relevant evidence was found..</li>
    </ul>
    <div class="report">
      <h3 style="color: #355085;">Report</h3>
      <h6>The report contains two sections.</h6>
      <ul style="list-style:none;">
        <li>1. A SUMMARY that shows the ratings assigned per category and the overall comments and recommendations</li>
        <li>2. A DETAILED REPORT that shows the descriptor and review comments per rating</li>
      </ul>
    </div>
    <div class="summer-report">
      <h3 style="color: #355085;">Summary Report</h3>
      <b-table
        hover
        :fields="summaryTableFields"
        :items="summaryTableItems"
        head-variant="light"
        class="mb-0"
        style="border-collapse:collapse;border-spacing:0;width:100%;"
      >
        <template v-slot:cell(No)="data">
          <p style="color: #355085">{{data.item.No}}</p>
        </template>
        <template v-slot:cell(Summary)="data">
          <p style="color: #355085">{{data.item.Summary}}</p>
        </template>
      </b-table>
    </div>
    <div class="border p-2">
          Recommendations:<br>
          {{repInfo.recommendation}}
    </div>
    <div class="detailed-report">
      <h3 style="color: #355085;">Detailed Report</h3>
      <b-table
        hover
        :fields="detailedTableFields"
        :items="detailedTableItems"
        head-variant="light"
        class="mb-0"
      >
        <template v-slot:cell(DetailedReport)="data">
          <p style="color: #355085">{{data.item.DetailedReport}}</p>
        </template>
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
    </div>
  </div>
</template>
<script>
export default {
  props: {
    repInfo: Object,
    logo: String,
    summaryTableFields: Array,
    summaryTableItems: Array,
    detailedTableFields: Array,
    detailedTableItems: Array,
  },
}
</script>
<style >
  .word-report{
    position: absolute;
    top: -9999px;
    visibility: hidden;
  }
</style>