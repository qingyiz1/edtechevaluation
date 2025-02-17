import {db} from "@/tools/firebaseConfig";

export function createDocument(collection,ID, data) {
    db.collection(collection)
        .doc(ID)
        .set(data)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export function updateDocument(collection,ID, data) {
    db.collection(collection)
        .doc(ID)
        .update(data)
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
}

export async function getDocument(collection,ID) {
    let Data;
    await db.collection(collection)
        .doc(ID).get()
        .then(function(doc) {
            if (doc.exists) {
                Data = doc.data()
            }else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    return Data;
}

export async function getDocuments(collection) {
    let Data = [];
    await db.collection(collection)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                Data.push(doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    return Data
}

export function deleteDocument(collection,ID){
    db.collection(collection)
        .doc(ID).delete()
        .then(() => {
            console.log("Document successfully deleted!");
        })
        .catch((error) => {
            console.error("Error deleting document: ", error);
        })
}

