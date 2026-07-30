import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.firebasestorage.app",
  messagingSenderId: "1081516241235",
  appId: "1:1081516241235:web:325f6852c795a30035b1a6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testAuth() {
  try {
    await signInWithEmailAndPassword(auth, "admin@airo.dev", "airohealthadmin2026");
    console.log("Auth success!");
  } catch (error) {
    console.error("Auth error:", error.code, error.message);
  }
}

testAuth();
