import Vue from 'vue'
import Vuex from 'vuex'
//import {db} from "@/tools/firebaseConfig";
//import * as firebase from "firebase";

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        isLogged: false,
        user:{
            id:'',
            email:'',
            role:'',
        }
        //userdata: db.collection("userInfo").doc(firebase.auth().currentUser.email)
    },
    getters:{
        UserData(state){
            return state.userdata
        },
    },
    mutations:{

    },
    actions:{

    }
});
