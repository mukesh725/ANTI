import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.firebasestorage.app",
  messagingSenderId: "1081516241235",
  appId: "1:1081516241235:web:325f6852c795a30035b1a6",
  measurementId: "G-VJYRPK5MYR"
};

// Initialize Firebase only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth, app };
