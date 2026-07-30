import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  projectId: "airo-e3f94",
  storageBucket: "airo-e3f94.appspot.com",
  messagingSenderId: "305141517596",
  appId: "1:305141517596:web:b1d8e1215b13689441113b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    try {
        await deleteDoc(doc(db, 'Settings', 'Templates'));
        console.log("Deleted CMS Templates setting to force fallback to the optimized local images.");
    } catch(e) {
        console.error(e);
    }
}
run();
