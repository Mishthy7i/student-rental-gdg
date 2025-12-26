// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQDMBKHvYF1HNvraBPgJv4m8NxbCfPCM8",
  authDomain: "student-rental-gdg.firebaseapp.com",
  projectId: "student-rental-gdg",
  storageBucket: "student-rental-gdg.firebasestorage.app",
  messagingSenderId: "553246990180",
  appId: "1:553246990180:web:aadd0dd3eb2f385f7de471",
  measurementId: "G-LQ5041S5RZ"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);