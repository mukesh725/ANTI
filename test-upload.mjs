import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.appspot.com",
  messagingSenderId: "1081516241235",
  appId: "1:1081516241235:web:325f6852c795a30035b1a6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, "cms-uploads/test-image.txt");

const content = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"

console.log("Attempting upload...");
uploadBytes(storageRef, content).then((snapshot) => {
  console.log("Uploaded successfully!", snapshot.metadata);
  process.exit(0);
}).catch((err) => {
  console.error("Upload failed!", err);
  process.exit(1);
});
