import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.firebasestorage.app",
  messagingSenderId: "1081516241235",
  appId: "1:1081516241235:web:325f6852c795a30035b1a6",
  measurementId: "G-VJYRPK5MYR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  try {
    const cmsPath = path.join(__dirname, '../data/cms.json');
    const rawData = fs.readFileSync(cmsPath, 'utf8');
    const cmsData = JSON.parse(rawData);

    // Save under collection 'cms', document 'content'
    await setDoc(doc(db, "cms", "content"), cmsData);
    console.log("Successfully seeded CMS data to Firestore!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding CMS data:", error);
    process.exit(1);
  }
}

seed();
