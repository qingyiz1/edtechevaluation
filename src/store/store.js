import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from "@/tools/firebaseConfig";
import router from '../router/index'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        loggedIn: false,
        userProfile:{}
    },
    getters:{
        userProfile(state){
            return state.userProfile
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
        setUserProfile(state, data) {
            state.userProfile = data
        }
    },
    actions:{
        async login({ dispatch }, form) {
            // sign user in
            await firebase.auth.signInWithEmailAndPassword(form.email, form.password)
                .then(async (user) => {
                    if(user != null){
                        // fetch user profile and set in state
                        dispatch('fetchUserProfile', user)
                    }
                }).catch((_error) => {
                    window.alert("Login Failed!"+_error);
                })



        },
        async fetchUserProfile({ commit }, user) {
            // fetch user profile
            const userProfile = await firebase.usersCollection.doc(user.email).get()

            // set user profile in state
            commit('setUserProfile', userProfile.data())
            window.alert("Welcome Back! "+userProfile.data().nickname)
            // change route to dashboard
            await router.push({path: "/profile/" + user.email})
        },
    }
});
