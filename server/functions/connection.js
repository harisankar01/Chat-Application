// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsV2p4JYIQuollA9HvHMTaxo9tr80qO1I",
  authDomain: "chat-app-a1d1b.firebaseapp.com",
  projectId: "chat-app-a1d1b",
  storageBucket: "chat-app-a1d1b.appspot.com",
  messagingSenderId: "347593511179",
  appId: "1:347593511179:web:9d533fbc415ab6d1c7520e",
  measurementId: "G-8TYPCWKHNY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
