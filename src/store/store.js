import Vue from 'vue'
import Vuex from 'vuex'
//import {db} from "@/tools/firebaseConfig";
//import * as firebase from "firebase";

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        loggedIn: false,
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
        loggedIn(state){
            return state.loggedIn
        },
    },
    mutations: {
        loggedIn (state) {
            state.loggedIn = true
        },
        loggedOut (state) {
            state.loggedIn = false
        },
        setStoreToken(state, accessToken) {
            state.accessToken = accessToken
        },
    },
    actions:{

    }
});
