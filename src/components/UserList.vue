<template>
   <div class="">
    <el-table :data="users">
      <el-table-column type="index" label="#" width="30px" align="center" />
      <el-table-column label="Email" align="center" prop="email" min-width="120px"/>
      <el-table-column label="Nickname" align="center" prop="nickname" min-width="100px" />
      <el-table-column label="Phone Number" align="center" prop="phoneNumber" width="120xpx"  />
      <el-table-column label="Role" align="center" prop="role" width="142px" />
      <el-table-column label="Employer" align="center" prop="employer" min-width="100px" />
      <el-table-column label="isActive" align="center" width="80px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isActive" @change="isActiveChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" min-width="150px" >
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.email)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="Delete" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" @click="Delete(scope.row.email)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

     <b-btn variant="primary" to="/createuser" >Create user</b-btn>


    <el-dialog title="Edit information" :visible.sync="editDialogVisible" width="360px">
      <el-form ref="form" :model="editForm" label-width="75px">
        <el-form-item label="Email">
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="editForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="Role">
          <el-radio-group v-model="editForm.role">
            <el-radio label="Senior Consultant" border size="medium">Senior Consultant</el-radio>
            <el-radio label="Consultant" border size="medium">Consultant</el-radio>
            <el-radio label="Ed Leader" border size="medium">Ed Leader</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Employer">
          <el-input v-model="editForm.employer"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="updateProfile(editForm.email)">Confirm</el-button>
        </span>
    </el-dialog>

    <el-dialog title="Add user" :visible.sync="addDialogVisible" width="50%">
      <el-form ref="form" :model="editForm" label-width="120px">
        <el-form-item label="Email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="Phone Number">
          <el-input v-model="editForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="Role">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
        <el-form-item label="Employer">
          <el-input v-model="editForm.employer"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="addDialogVisible = false">Confirm</el-button>
        </span>
    </el-dialog>

   </div>
</template>
      

<script>
import {db} from "@/tools/firebaseConfig"
//import * as firebase from "firebase/app"
import "firebase/auth"
import {updateDocument} from "@/tools/firebaseTool"
import {getDocument} from "@/tools/firebaseTool"
import {deleteDocument} from "@/tools/firebaseTool"
import $ from 'jquery'

//let email

export default {
  name:"Userlist",
  components: {
    
  },
  methods: {
    redirect(){

    },
    async showEditDialog(id){
      const Data = await getDocument("userInfo",id)
      this.editDialogVisible = true;
      this.editForm = Data
    },

    async Delete(msg) {
      const confirmResult = await this.$confirm('This operation will delete this user information, are you sure?', 'Alert', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
        }
        ).catch(err => console.log(err))

        if(confirmResult !== 'confirm') {
          return this.$message.info('Operation cancelled')
        }else{
          deleteDocument("userInfo", msg)
          const Url='https://us-central1-ee---echidna---2020.cloudfunctions.net/deleteUserByEmail'
          const data={userEmail:msg}
          $.post(Url,data,()=>{
            console.log(data)
          })
        }
    },
    isActiveChange(msg){
      updateDocument("userInfo", msg.email, {"isActive": msg.isActive})
    },
    updateProfile(id){
      updateDocument("userInfo",id,this.editForm)
      this.editDialogVisible = false
    },
  },

  data(){
    return {
     
      users:'',
      editDialogVisible: false,
      addDialogVisible: false,
      editForm: {}

    }
  },
  firestore(){
    return{
      users: db.collection("userInfo")
    }
  },

}

</script>



<style scoped>
@import "../css/general.css";
</style>