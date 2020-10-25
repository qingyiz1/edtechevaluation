// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteUserByEmail = functions.https.onRequest(async (request, response) =>{
    const userEmail = request.body.userEmail;

    await admin.auth().getUserByEmail(userEmail)
        .then(userRecord =>{
            const uid = userRecord.uid
            return admin.auth().deleteUser(uid)
        })
        .then(()=>{
            console.log("Successfully deleted user")
            response.status(200).send("Deleted User")
            return
        })
        .catch(err =>{
            console.log("Error deleting user:",err)
            response.status(500).send("Delete Failed")
        })

})