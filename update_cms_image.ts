import { db } from './src/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

async function update() {
  const docRef = doc(db, "cms", "content");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.minuteClinic?.sections?.hero?.image) {
      await updateDoc(docRef, {
        "minuteClinic.sections.hero.image": "/minute-clinic-hero.png"
      });
      console.log("Updated Firestore CMS");
    } else {
      console.log("No hero image in Firestore CMS, local cms.json is sufficient");
    }
  } else {
    console.log("No CMS document in Firestore");
  }
}
update().catch(console.error).then(() => process.exit(0));
