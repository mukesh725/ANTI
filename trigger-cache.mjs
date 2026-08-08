import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs/promises";

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.appspot.com",
  messagingSenderId: "331899738096",
  appId: "1:331899738096:web:2a82d0b5e28a6f3bdfb325"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function syncAndInvalidate() {
  const docRef = doc(db, "cms", "content");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Got latest firestore data, pushing to API to invalidate cache...");
    const res = await fetch("https://airoessentials.com/api/cms/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    console.log("Invalidation result:", result);
  }
}

syncAndInvalidate().catch(console.error);
