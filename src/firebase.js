import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUqLK7AcyatcTEyPS_4H8UTzlRLx057Ss",
  authDomain: "nutriai-19cec.firebaseapp.com",
  projectId: "nutriai-19cec",
  storageBucket: "nutriai-19cec.firebasestorage.app",
  messagingSenderId: "414537310830",
  appId: "1:414537310830:web:e3f84b717a6deec4ce7c7f",
  measurementId: "G-7QNXKGR1T2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);