import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig ={
    apiKey: "AIzaSyAnhJtV8YpQFS2y24bCnqGdchZABlZPWuo",
    authDomain: "ee---echidna---2020.firebaseapp.com",
    databaseURL: "https://ee---echidna---2020.firebaseio.com",
    projectId: "ee---echidna---2020",
    storageBucket: "ee---echidna---2020.appspot.com",
    messagingSenderId: "1014382104388",
    appId: "1:1014382104388:web:4ea4d821e3e4a017edd111",
    measurementId: "G-HQX493R878"
}

const adminApp = firebase.initializeApp(firebaseConfig,"CreateUser.vue")

export default firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('userInfo')
const frameworkCollection = db.collection('framework')
const evaluationCollection = db.collection('evaluation')
const reportCollection = db.collection('report')

// export utils/refs
export {
    db,
    auth,
    usersCollection,
    frameworkCollection,
    evaluationCollection,
    adminApp,
    reportCollection
}