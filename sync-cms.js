const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Load environment variables directly if needed, or define the config
const config = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.firebasestorage.app",
  messagingSenderId: "1081516241235",
  appId: "1:1081516241235:web:325f6852c795a30035b1a6"
};

const app = initializeApp(config);
const db = getFirestore(app);

async function sync() {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'src/data/cms.json'));
    const cmsData = JSON.parse(rawData);
    
    await setDoc(doc(db, "cms", "content"), cmsData);
    console.log("Successfully synced local cms.json to Firebase!");
  } catch (error) {
    console.error("Error syncing:", error);
  }
}

sync();
