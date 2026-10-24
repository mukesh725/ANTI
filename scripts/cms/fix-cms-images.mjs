import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
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

async function fixCms() {
  const docRef = doc(db, "cms", "content");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Fixing CMS in Firestore...");
    
    // Update Home page hero image and revert Grocery hero image
    await updateDoc(docRef, {
      "pages.home.heroImage": "/uploads/hero-grocery.jpg",
      "pages.grocery.sections.hero.image": "https://plus.unsplash.com/premium_photo-1663039978847-63f7484bf701?q=80&w=1600"
    });
    console.log("Updated Firestore.");

    // Fetch the updated document
    const updatedSnap = await getDoc(docRef);
    const updatedData = updatedSnap.data();

    // Call API to bust Next.js cache
    console.log("Invalidating cache...");
    const res = await fetch("https://airoessentials.com/api/cms/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    const result = await res.json();
    console.log("Invalidation result:", result);

  } else {
    console.log("No CMS doc found");
  }
}

fixCms().catch(console.error);
