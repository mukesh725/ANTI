const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

const firebaseConfig = {
  // need to get this from .env
};
// I can just read it from the local JSON to compare... wait, better to just query the API if I can.
