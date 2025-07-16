import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_2MX1zGPAcmH7gkEyeg3uuIBm4nXa-lg",
  authDomain: "lab-reports-f8033.firebaseapp.com",
  projectId: "lab-reports-f8033",
  storageBucket: "lab-reports-f8033.appspot.com",  // <== fixed here
  messagingSenderId: "883860381287",
  appId: "1:883860381287:web:7adec79c9714d47f74bec2",
  measurementId: "G-GP9G5HS4QE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
import { collection, addDoc } from "firebase/firestore";

const addReport = async (report) => {
  try {
    const docRef = await addDoc(collection(db, "reports"), report);
    console.log("Report written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
