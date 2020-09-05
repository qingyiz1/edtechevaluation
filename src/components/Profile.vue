<template>
   <div class="">
    <el-table :data="users">
      <el-table-column type="index" label="#" width="40" align="center" />
      <el-table-column label="Email" align="center" prop="email" />
      <el-table-column label="Nickname" align="center" prop="nickname" />
      <el-table-column label="Phone Number" align="center" prop="phonenumber"  />
      <el-table-column label="Role" align="center" prop="role"  />
      <el-table-column label="Employer" align="center" prop="employer" width="120" />
      <el-table-column label="isActive" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isActive" @change="isActiveChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Operation">
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

    <el-button type="primary" @click = "showAddDialog()">Add user</el-button>

    <el-dialog title="Edit information" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="form" :model="editForm" label-width="120px">
        <el-form-item label="Email">
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="Phone Number">
          <el-input v-model="editForm.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="Role">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
        <el-form-item label="Employer">
          <el-input v-model="editForm.employer"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="editDialogVisible = false">Confirm</el-button>
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
          <el-input v-model="editForm.phonenumber"></el-input>
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
import * as firebase from "firebase";
import {updateDocument} from "@/tools/firebaseTool"
import {getDocument} from "@/tools/firebaseTool"
import {deleteDocument} from "@/tools/firebaseTool"


//let email

export default {
  name:"Profile",
  components: {
    
  },
  methods: {

    showAddDialog(){
      this.addDialogVisible = true

    },

    async showEditDialog(id){


      this.editDialogVisible = true
      const {data: res} = await getDocument("userInfo",id)
      this.editForm = res.data
      console.log(this.editForm)
 
    },

    async Delete(msg) {
      const confirmResult = await this.$confirm('This operation will delete this user information, are you sure?', 'Alert', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
        ).catch(err => err)

        if(confirmResult !== 'confirm') {
          return this.$message.info('Operation cancelled')
        }

      deleteDocument("userInfo", msg)


        
    },

    isActiveChange(msg){
      updateDocument("userInfo", msg.email, {"isActive": msg.isActive})
    },
    
  

    updateProfile(){
      this.editable = false
      updateDocument("userInfo",firebase.auth().currentUser.email,{"nickname":this.userdata['nickname'],"usertype":this.userdata['usertype']})
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