import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // Insira suas credenciais do console do Firebase aqui
  apiKey: "AIzaSyAQWjnVV6iOmWAEROyXF4mzlRe3PpJxvvg",
  authDomain: "realstate-walter.firebaseapp.com",
  projectId: "realstate-walter",
  storageBucket: "realstate-walter.firebasestorage.app",
  messagingSenderId: "1035348912513",
  appId: "1:1035348912513:web:01e06d2b0ba69691626080"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);