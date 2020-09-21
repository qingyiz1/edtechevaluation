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
                        if((await firebase.usersCollection.doc(form.email).get()).data() === undefined || (await firebase.usersCollection.doc(form.email).get()).data()['isActive'] === false)
                        {
                            window.alert("User not found or deactivated, please contact your senior consultant!")
                            return
                        } else if((await firebase.usersCollection.doc(form.email).get()).data()['isActive'] === true) {
                            // fetch user profile and set in state
                            dispatch('fetchUserProfile', user)
                            // change route to user profile
                            await router.push({path: "/profile/" + form.email})
                            window.alert("Welcome Back!")
                        }
                    }else{
                        window.alert("User not found or deactivated, please contact your senior consultant!")
                    }
                }).catch((_error) => {
                    window.alert("Login Failed!"+_error);
                })


        },
        async fetchUserProfile({ commit }, user) {
            // fetch user profile
            const userProfile = await firebase.usersCollection.doc(user.email).get()

            // set user profile in state
            await commit('setUserProfile', userProfile.data())
        },
    }
});
