// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth' 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nexoraai-d945e.firebaseapp.com",
  projectId: "nexoraai-d945e",
  storageBucket: "nexoraai-d945e.firebasestorage.app",
  messagingSenderId: "328226665216",
  appId: "1:328226665216:web:0c343c734a5b7adcab79e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
