import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

// Configuración del proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBBCcvjIIRrou34QCbJ8EqD05aMyijUp_8",
    authDomain: "vue-banco-ce047.firebaseapp.com",
    projectId: "vue-banco-ce047",
    storageBucket: "vue-banco-ce047.appspot.com",
    messagingSenderId: "1032324183534",
    appId: "1:1032324183534:web:93dfa2494f8c358c238aff"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db =  firebase.firestore();

// Funcion para escuchar los cambios del usuario actual 
auth.getCurrentUser = () => {

    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })

};

// Función para mandar a llamar los datos de una colleccion de Firebase agregando un formato de fecha estandar
db.getCollData = async (coll) => {
    
    let data = [];
    try {
        const querySnapshot = await db.collection(coll).get()
        querySnapshot.forEach((doc) => {
            let date = doc.data().fecha ? new Date(doc.data().fecha.seconds * 1000).toLocaleDateString() : null; 
            data.push({
                ...doc.data(),
                fecha: date,
                id: doc.id
            });
        });
        return data

    } catch(error) {
        console.error("Error al pedir documentos: ", error);
        return null
    }

}

// Función para mandar a llamar los datos de un documento de Firebase
db.getDocData = async (coll, doc) => {
    
    try {
        const docSnapshot = await db.collection(coll).doc(doc).get()
        return {
            ...docSnapshot.data(),
            id: docSnapshot.id
        }

    } catch(error) {
        console.error("Error al pedir el documento: ", error);
        return null
    }

}

// Función para crear un documento nuevo en una colleccion de Firebase
db.uploadData = (coll, data, doc) => {
    if (doc) {
        return db.collection(coll)
            .doc(doc)
            .set(data)  
    } else {
        return db.collection(coll)
            .add(data)  
    }
      
}

// Funcion para actualizar valores de un documento especifico 
db.updateData = (coll, doc, data) => {
    return db.collection(coll)
        .doc(doc)
        .update(data)
}

// Funcion para eliminar un documento de una coleccion
db.deleteData = (coll, doc) => {
    return db.collection(coll)
        .doc(doc)
        .delete()
}

export { auth, db }