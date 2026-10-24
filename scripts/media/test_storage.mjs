import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, 'test.txt');

uploadString(storageRef, 'Hello World').then(() => {
  console.log("Success");
  process.exit(0);
}).catch((e) => {
  console.error("Error", e.message);
  process.exit(1);
});
