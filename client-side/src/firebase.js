// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogify-a8eb1.firebaseapp.com",
  projectId: "blogify-a8eb1",
  storageBucket: "blogify-a8eb1.firebasestorage.app",
  messagingSenderId: "6205045299",
  appId: "1:6205045299:web:35fc7726def3c0b21e8146",
  measurementId: "G-D895YTSHFQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

