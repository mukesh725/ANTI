import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export type RatingLevel = 1 | 2 | 3 | 4 | 5;
export type SentimentType = "poor" | "average" | "good" | "very_good" | "excellent";

export interface AspectRatings {
  staffHospitality?: boolean;
  storeAmbiance?: boolean;
  productAvailability?: boolean;
  checkoutSpeed?: boolean;
  healthScanExperience?: boolean;
  cleanliness?: boolean;
}

export interface StoreFeedback {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  rating: RatingLevel;
  sentiment: SentimentType;
  feedbackType?: "Idea" | "Complaint" | "Suggestion" | "Compliment";
  storeLocation: string;
  comment: string;
  aspects?: AspectRatings;
  recommendScore?: number; // 1-10 NPS optional
  isPublished: boolean; // Publish on public website
  isFeatured: boolean;
  status: "completed" | "follow_up" | "resolved" | "pending" | "published" | "archived";
  source: "in_store_kiosk" | "qr_scan" | "website" | "manual_entry";
  createdAt: string; // ISO string
  updatedAt?: string;
  managerNotes?: string;
}

export const SENTIMENT_MAP: Record<RatingLevel, { label: string; sentiment: SentimentType; color: string; bg: string; emoji: string }> = {
  1: { label: "Poor", sentiment: "poor", color: "text-rose-600", bg: "bg-rose-50 border-rose-200", emoji: "😞" },
  2: { label: "Average", sentiment: "average", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", emoji: "😐" },
  3: { label: "Good", sentiment: "good", color: "text-sky-600", bg: "bg-sky-50 border-sky-200", emoji: "🙂" },
  4: { label: "Very Good", sentiment: "very_good", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", emoji: "😊" },
  5: { label: "Excellent", sentiment: "excellent", color: "text-teal-600", bg: "bg-teal-50 border-teal-200", emoji: "🤩" },
};

export const STORE_LOCATIONS = [
  "AIRO Flagship Experience Center",
  "AIRO Health & Wellness - Indiranagar",
  "AIRO Essentials - Koramangala",
  "AIRO Minute Clinic - Whitefield",
  "AIRO Express Kiosk - MG Road",
];

const COLLECTION_NAME = "store_feedbacks";

/**
 * Submit new store feedback to Firebase Firestore
 */
export async function submitStoreFeedback(feedback: Omit<StoreFeedback, "id" | "createdAt" | "status" | "isPublished" | "isFeatured"> & {
  status?: StoreFeedback["status"];
  isPublished?: boolean;
  isFeatured?: boolean;
}): Promise<string> {
  try {
    // Auto-determine initial follow-up status based on customer experience:
    // 4-5 Stars (Good / Excellent) -> No follow-up needed ("completed")
    // 1-3 Stars (Poor / Average) or Complaints -> Action required ("follow_up")
    const isNegativeOrComplaint = feedback.rating <= 3 || feedback.feedbackType === "Complaint";
    const defaultStatus: StoreFeedback["status"] = isNegativeOrComplaint ? "follow_up" : "completed";

    const feedbackData: Omit<StoreFeedback, "id"> = {
      name: feedback.name.trim(),
      phone: feedback.phone.trim(),
      email: feedback.email?.trim() || "",
      rating: feedback.rating,
      sentiment: feedback.sentiment || SENTIMENT_MAP[feedback.rating]?.sentiment || "good",
      feedbackType: feedback.feedbackType || "Suggestion",
      storeLocation: feedback.storeLocation || "AIRO Flagship Experience Center",
      comment: feedback.comment?.trim() || "",
      aspects: feedback.aspects || {},
      recommendScore: feedback.recommendScore || (feedback.rating >= 4 ? 10 : feedback.rating * 2),
      isPublished: feedback.isPublished ?? false,
      isFeatured: feedback.isFeatured ?? false,
      status: feedback.status ?? defaultStatus,
      source: feedback.source || "in_store_kiosk",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...feedbackData,
      _timestamp: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error submitting store feedback to Firestore:", error);
    throw error;
  }
}

/**
 * Get all store feedback with optional filters
 */
export async function getAllStoreFeedbacks(): Promise<StoreFeedback[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"), limit(200));
    const snapshot = await getDocs(q);
    const results: StoreFeedback[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        name: data.name || "Anonymous",
        phone: data.phone || "",
        email: data.email || "",
        rating: (data.rating as RatingLevel) || 5,
        sentiment: data.sentiment || "excellent",
        feedbackType: data.feedbackType || "Suggestion",
        storeLocation: data.storeLocation || "AIRO Flagship Experience Center",
        comment: data.comment || "",
        aspects: data.aspects || {},
        recommendScore: data.recommendScore,
        isPublished: Boolean(data.isPublished),
        isFeatured: Boolean(data.isFeatured),
        status: data.status || "pending",
        source: data.source || "in_store_kiosk",
        createdAt: data.createdAt || new Date().toISOString(),
        managerNotes: data.managerNotes || "",
      });
    });

    return results;
  } catch (error) {
    console.error("Error loading store feedbacks from Firestore:", error);
    return [];
  }
}

/**
 * Update feedback publish status or manager notes
 */
export async function updateStoreFeedback(
  id: string,
  updates: Partial<Pick<StoreFeedback, "isPublished" | "isFeatured" | "status" | "managerNotes">>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating feedback ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a feedback record
 */
export async function deleteStoreFeedback(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting feedback ${id}:`, error);
    throw error;
  }
}

/**
 * Get published reviews for public website consumption
 */
export async function getPublishedStoreReviews(maxLimit = 10): Promise<StoreFeedback[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc"),
      limit(maxLimit)
    );
    const snapshot = await getDocs(q);
    const results: StoreFeedback[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        name: data.name || "Customer",
        phone: data.phone ? data.phone.slice(0, 3) + "****" + data.phone.slice(-3) : "", // Masked for public privacy
        email: "",
        rating: (data.rating as RatingLevel) || 5,
        sentiment: data.sentiment || "excellent",
        storeLocation: data.storeLocation || "AIRO Flagship",
        comment: data.comment || "",
        aspects: data.aspects || {},
        recommendScore: data.recommendScore,
        isPublished: true,
        isFeatured: Boolean(data.isFeatured),
        status: data.status || "published",
        source: data.source || "in_store_kiosk",
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });

    return results;
  } catch (error) {
    console.error("Error fetching published store reviews:", error);
    return [];
  }
}
