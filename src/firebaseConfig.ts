// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Auth } from "firebase/auth";
import { Firestore, initializeFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: "AIzaSyDU6eulYeJ3OsDMW5DmrQ3ks9MgGG8vb4M",
//   authDomain: "medialert-1028f.firebaseapp.com",
//   projectId: "medialert-1028f",
//   storageBucket: "medialert-1028f.firebasestorage.app",
//   messagingSenderId: "582753835483",
//   appId: "1:582753835483:web:ad60b751638b0885832ffe",
//   measurementId: "G-PP5C8S35XD"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBZCbwOf0PvAK_PeHdLyfViwRqDDLXw6E4",
  authDomain: "medialert-35d44.firebaseapp.com",
  projectId: "medialert-35d44",
  storageBucket: "medialert-35d44.firebasestorage.app",
  messagingSenderId: "470016611040",
  appId: "1:470016611040:web:75c47d806b4d17cfe03685",
  measurementId: "G-8FVY5T5ZBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Optional for Firestore if needed for certain environments
});