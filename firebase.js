// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmtgiFTEsqyHVaZG1TYgPnDZYGn67odqI",
  authDomain: "crud-next-firebase-ingles.firebaseapp.com",
  projectId: "crud-next-firebase-ingles",
  storageBucket: "crud-next-firebase-ingles.appspot.com",
  messagingSenderId: "230433321402",
  appId: "1:230433321402:web:1863375bed113edd5ead83",
  measurementId: "G-2EEYHX9LF9"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebaseApp);
export default firebaseApp;