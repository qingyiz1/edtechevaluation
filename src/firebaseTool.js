import {db} from "@/firebaseConfig";

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

export function getDocument(collection,ID) {
    let Data = [];
    db.collection(collection)
        .get(ID)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                Data.push({
                    id: doc.id,
                    name: doc.data().name,
                    email: doc.data().email,
                });
                console.log(doc.id, " => ", doc.data());
            });
            return Data
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

export function getDocuments(collection) {
    let Data = [];
    db.collection(collection)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                Data.push({
                    id: doc.id,
                    name: doc.data().name,
                    email: doc.data().email,
                });
                console.log(doc.id, " => ", doc.data());
            });
            return Data
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
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

