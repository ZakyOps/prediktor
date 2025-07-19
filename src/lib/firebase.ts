import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADuo3tlBr-3cURkUrJaAa2d7eKY9Ljgxk",
  authDomain: "predictor-ai.firebaseapp.com",
  projectId: "predictor-ai",
  storageBucket: "predictor-ai.firebasestorage.app",
  messagingSenderId: "647823429368",
  appId: "1:647823429368:web:66789dc836b690013bb50d",
  measurementId: "G-MZSKL0E76Y",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
