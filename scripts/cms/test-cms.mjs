import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

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

async function checkCms() {
  const docRef = doc(db, "cms", "content");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Current Grocery Hero Image:", data?.pages?.grocery?.sections?.hero?.image);
    
    // Force update to the local one just to fix it for them
    await updateDoc(docRef, {
      "pages.grocery.sections.hero.image": "/uploads/hero-grocery.jpg"
    });
    console.log("Updated to /uploads/hero-grocery.jpg in Firestore!");
  } else {
    console.log("No CMS doc found");
  }
}

checkCms().catch(console.error);
