import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { unstable_cache } from "next/cache";
import fallbackCmsData from "@/data/cms.json";

// Helper function to deep merge objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Use unstable_cache to cache the Firestore data across requests
// We will tag it with 'cms' so we can revalidate it on demand when the admin makes an edit
export const getCmsData = unstable_cache(
  async () => {
    try {
      const docRef = doc(db, "cms", "content");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const dbData = docSnap.data();
        // Deep merge Firestore data ON TOP OF local cms.json structure
        // This ensures new fields in cms.json appear in the CMS dashboard
        return deepMerge(fallbackCmsData, dbData) as typeof fallbackCmsData;
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
