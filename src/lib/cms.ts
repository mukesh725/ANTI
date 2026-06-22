import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { unstable_cache } from "next/cache";
import fallbackCmsData from "@/data/cms.json";

// Use unstable_cache to cache the Firestore data across requests
// We will tag it with 'cms' so we can revalidate it on demand when the admin makes an edit
export const getCmsData = unstable_cache(
  async () => {
    try {
      const docRef = doc(db, "cms", "content");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as typeof fallbackCmsData;
      }
    } catch (error) {
      console.error("Failed to fetch CMS data from Firebase, using fallback", error);
    }
    
    // Fallback to local json if DB fails or document doesn't exist
    return fallbackCmsData;
  },
  ['cms-data-cache'],
  {
    revalidate: 3600, // Revalidate every hour just in case
    tags: ['cms']     // Allows us to do revalidateTag('cms') after an admin saves
  }
);
