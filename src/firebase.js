
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUXvlhlNzvYPky_VLepFCWul5hSimzK1c",
  authDomain: "ecommerce-store-8b70a.firebaseapp.com",
  projectId: "ecommerce-store-8b70a",
  storageBucket: "ecommerce-store-8b70a.firebasestorage.app",
  messagingSenderId: "932092732370",
  appId: "1:932092732370:web:dd81d259f0502b86bdde0b",
  measurementId: "G-BP5QCDW4ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);