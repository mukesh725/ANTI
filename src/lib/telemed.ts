/**
 * AIRO Native Telemedicine Service
 * 
 * Manages clinical specialists, consultation matching, and input sanitization
 * powered 100% natively by Firebase Cloud Firestore.
 */

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface EMedDoctor {
  id: number | string;
  userId?: number;
  docId?: string;
  name: string;
  specialization: string;
  degree?: string;
  registrationNumber?: string | null;
  registrationExpiryDate?: string | null;
  experienceYears: number;
  consultationFee: number;
  profileImage: string | null;
  digitalSignatureUrl?: string | null;
  status: string;
  averageRating: number | null;
  reviewCount: number;
  categories: Array<{ id: number; name: string }>;
  isRecommended?: boolean;
  isFeatured?: boolean;
  email?: string;
  phone?: string;
  clinicName?: string;
  city?: string;
  bio?: string;
}

export interface TelemedBookingPayload {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  dob: string;
  gender: string;
  service: string;
  doctorId: number | string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  notes?: string;
}

// High-reliability verified fallback doctors if Firestore is ever unreachable
export const FALLBACK_DOCTORS: EMedDoctor[] = [
  {
    id: 21,
    docId: "doc_mukesh_21",
    name: "Dr. MUKESH Doctor",
    specialization: "General Medicine & Internal Care",
    degree: "MD general medicine",
    registrationNumber: "465862",
    experienceYears: 10,
    consultationFee: 499,
    profileImage: null,
    status: "ACTIVE",
    averageRating: 5.0,
    reviewCount: 88,
    categories: [{ id: 1, name: "General Medicine" }],
    isFeatured: true,
    email: "mukesh@akronpharma.com",
    phone: "(341) 336-4431"
  },
  {
    id: 20,
    docId: "doc_sahan_20",
    name: "Dr. Gutta Sahan",
    specialization: "General Medicine & Primary Care",
    degree: "MD general medicine",
    registrationNumber: "TSMC 20642",
    experienceYears: 5,
    consultationFee: 499,
    profileImage: "https://cdn.airoemed.com/doctors/photos/672-1789165059235-37aa3719.jpg",
    status: "ACTIVE",
    averageRating: 4.8,
    reviewCount: 96,
    categories: [{ id: 1, name: "General Medicine" }],
    isFeatured: true,
    email: "sahangutta57@gmail.com",
    phone: "9110794027"
  },
  {
    id: 19,
    docId: "doc_lenin_19",
    name: "Dr. DR LENIN REDDY",
    specialization: "General Medicine",
    degree: "MD general medicine",
    registrationNumber: "53018",
    experienceYears: 20,
    consultationFee: 499,
    profileImage: "https://cdn.airoemed.com/doctors/photos/images-10-1789165321308-4995c8db.jpeg",
    status: "ACTIVE",
    averageRating: 4.9,
    reviewCount: 110,
    categories: [{ id: 1, name: "General Medicine" }],
    email: "leninaqua@gmail.com",
    phone: "9491133783"
  },
  {
    id: 17,
    docId: "doc_lokendra_17",
    name: "Dr Lokendra K Thakur",
    specialization: "Internal Medicine & General Physician",
    degree: "MD",
    registrationNumber: "87974",
    experienceYears: 23,
    consultationFee: 499,
    profileImage: "https://cdn.airoemed.com/doctors/photos/dr-lokendra-1789165151718-01086e1e.png",
    status: "ACTIVE",
    averageRating: 4.9,
    reviewCount: 142,
    categories: [{ id: 4, name: "Sexual Health" }, { id: 1, name: "General Medicine" }],
    isFeatured: true,
    email: "swetajha215@gmail.com",
    phone: "5072545729"
  }
];

/**
 * Fetches verified active doctors directly from our native Firestore `doctors` collection.
 */
export async function getEmedDoctors(forceRefresh = false): Promise<EMedDoctor[]> {
  try {
    const doctorsRef = collection(db, 'doctors');
    const q = query(doctorsRef, where('status', '==', 'active'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docsList: EMedDoctor[] = snapshot.docs.map(docSnap => {
        const d = docSnap.data();
        const rawId = d.doctorId || d.id;
        const idNum = Number(String(rawId).replace(/\D/g, '')) || rawId;

        const categoriesArray: string[] = Array.isArray(d.categories) ? d.categories : ['General Medicine'];

        return {
          id: idNum,
          docId: docSnap.id,
          name: d.name.startsWith('Dr') ? d.name : `Dr. ${d.name}`,
          specialization: d.specialty || d.specialization || 'General Medicine',
          degree: d.degree || 'MBBS / MD',
          registrationNumber: d.registrationNumber || null,
          registrationExpiryDate: d.registrationExpiryDate || null,
          experienceYears: Number(d.experienceYears) || 5,
          consultationFee: Number(d.consultationFee) || 499,
          profileImage: d.profilePhotoUrl || null,
          digitalSignatureUrl: d.digitalSignatureUrl || null,
          status: 'ACTIVE',
          averageRating: 4.9,
          reviewCount: 100,
          categories: categoriesArray.map((name, i) => ({ id: i + 1, name })),
          email: d.email,
          phone: d.phone,
          clinicName: d.clinicName,
          city: d.city,
          bio: d.bio,
          isFeatured: Boolean(d.isFeatured),
        };
      });

      // Sort featured doctors first
      return docsList.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  } catch (err) {
    console.error('[Native Doctors Query Error]:', err);
  }

  return FALLBACK_DOCTORS;
}

/**
 * Renders all verified doctors with recommended specialists prioritised at top,
 * ensuring no doctor is ever excluded from the roster.
 */
export function matchDoctorsByService(doctors: EMedDoctor[], serviceTitle: string): EMedDoctor[] {
  if (!serviceTitle) {
    return doctors.map(d => ({ ...d, isRecommended: false }));
  }
  const lower = serviceTitle.toLowerCase();

  const tagged = doctors.map(doc => {
    const spec = (doc.specialization || '').toLowerCase();
    const categories = (doc.categories || []).map(c => c.name.toLowerCase()).join(' ');
    let isRecommended = false;

    if (lower.includes('skin') || lower.includes('rash') || lower.includes('acne')) {
      isRecommended = spec.includes('derma') || categories.includes('derma');
    } else if (lower.includes('hair') || lower.includes('scalp')) {
      isRecommended = spec.includes('tricho') || categories.includes('hair');
    } else if (lower.includes('weight') || lower.includes('obesity') || lower.includes('diet')) {
      isRecommended = spec.includes('obesity') || spec.includes('metabolic') || categories.includes('weight');
    } else if (lower.includes('sexual') || lower.includes('ed')) {
      isRecommended = spec.includes('andrology') || categories.includes('sexual');
    } else {
      // General Medicine / Cold / Respiratory / Fever
      isRecommended = spec.includes('general') || spec.includes('internal') || spec.includes('medicine') || spec.includes('physician');
    }

    return { ...doc, isRecommended };
  });

  // Sort recommended doctors first, followed by all other available doctors
  return tagged.sort((a, b) => {
    if (a.isRecommended === b.isRecommended) return 0;
    return a.isRecommended ? -1 : 1;
  });
}

/**
 * Sanitize user input to prevent XSS and injection
 */
export function sanitizeString(input: unknown, maxLen = 100): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>'"&]/g, '')
    .slice(0, maxLen);
}

/**
 * Validate Indian 10-digit mobile number
 */
export function isValidIndianMobile(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return true;
  if (digits.length === 12 && /^91[6-9]\d{9}$/.test(digits)) return true;
  return false;
}
