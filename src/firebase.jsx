// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFezLwoVokwENiU-P_QhO4M0Ko3hTJ_8E",
  authDomain: "chess-080124.firebaseapp.com",
  projectId: "chess-080124",
  storageBucket: "chess-080124.appspot.com",
  messagingSenderId: "146292410496",
  appId: "1:146292410496:web:191c8a1b85212cd8c6be65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };