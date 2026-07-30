require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadString, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.firebasestorage.app",
  appId: "1:1081516241235:web:325f6852c795a30035b1a6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const testRef = ref(storage, 'test/test.txt');

uploadString(testRef, 'Hello World')
  .then(() => getDownloadURL(testRef))
  .then(url => console.log('Success!', url))
  .catch(err => console.error('Failed:', err.code, err.message));
