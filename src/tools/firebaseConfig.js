import firebase from "firebase";

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

export default firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const database = firebase.database();