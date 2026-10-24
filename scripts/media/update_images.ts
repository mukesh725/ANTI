import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const docRef = doc(db, 'cms', 'content');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    let updates = {};
    if (data.health) {
        updates['health.heroImage'] = '/clinic-connected.jpg';
    }
    if (data.healthChair) {
        updates['healthChair.heroImage'] = '/airo-praana-hero.png';
    }
    
    if (Object.keys(updates).length > 0) {
        await updateDoc(docRef, updates);
        console.log("Updated CMS images in Firestore!", updates);
    } else {
        console.log("No health or healthChair nodes found in Firestore. cms.json will be used.");
    }
  } else {
    console.log("No CMS document in Firestore. cms.json will be used.");
  }
}
main().catch(console.error).then(() => process.exit(0));
