// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU6eulYeJ3OsDMW5DmrQ3ks9MgGG8vb4M",
  authDomain: "medialert-1028f.firebaseapp.com",
  projectId: "medialert-1028f",
  storageBucket: "medialert-1028f.firebasestorage.app",
  messagingSenderId: "582753835483",
  appId: "1:582753835483:web:ad60b751638b0885832ffe",
  measurementId: "G-PP5C8S35XD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);