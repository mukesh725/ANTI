/**
 * AIRO E-Med Telemedicine Bridge Service
 * 
 * Provides secure, server-side communication with https://api.airoemed.com
 * Features in-memory TTL caching, doctor matching, and strict sanitization.
 */

export interface EMedDoctor {
  id: number;
  userId: number;
  name: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  profileImage: string | null;
  status: string;
  averageRating: number | null;
  reviewCount: number;
  categories: Array<{ id: number; name: string }>;
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

const AIRO_EMED_BASE_URL = process.env.AIRO_EMED_API_URL || 'https://api.airoemed.com';

// In-memory cache for doctor listings (5 minutes TTL)
let cachedDoctors: EMedDoctor[] | null = null;
let cacheExpiry = 0;

// High-reliability verified fallback doctors if upstream is ever temporarily unreachable
export const FALLBACK_DOCTORS: EMedDoctor[] = [
  {
    id: 17,
    userId: 46,
    name: "Dr. Lokendra K Thakur",
    specialization: "Internal Medicine & General Physician",
    experienceYears: 23,
    consultationFee: 499,
    profileImage: null,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewCount: 142,
    categories: [{ id: 4, name: "Sexual Health" }, { id: 1, name: "General Medicine" }]
  },
  {
    id: 18,
    userId: 49,
    name: "Dr. Gutta Sahan",
    specialization: "General Medicine & Primary Care",
    experienceYears: 5,
    consultationFee: 499,
    profileImage: "https://cdn.airoemed.com/doctors/photos/672-1788472489010-dc8564e1.jpg",
    status: "ACTIVE",
    averageRating: 4.8,
    reviewCount: 96,
    categories: [{ id: 1, name: "General Medicine" }]
  },
  {
    id: 1,
    userId: 3,
    name: "Dr. Ananya Rao",
    specialization: "Dermatology & Skin Care",
    experienceYears: 9,
    consultationFee: 499,
    profileImage: "https://d3aa3s3yhl0emm.cloudfront.net/telemed/doctors/photos/doc-image-3.webp",
    status: "ACTIVE",
    averageRating: 4.9,
    reviewCount: 218,
    categories: [{ id: 2, name: "Hair" }, { id: 5, name: "Dermatology" }]
  },
  {
    id: 4,
    userId: 34,
    name: "Dr. Naveen Mishra",
    specialization: "Obesity & Metabolic Medicine",
    experienceYears: 14,
    consultationFee: 699,
    profileImage: "https://d3aa3s3yhl0emm.cloudfront.net/telemed/doctors/photos/doc-image-2.webp",
    status: "ACTIVE",
    averageRating: 4.9,
    reviewCount: 184,
    categories: [{ id: 3, name: "Weight Management" }]
  },
  {
    id: 13,
    userId: 29,
    name: "Dr. Pooja Menon",
    specialization: "Trichology & Hair Restoration",
    experienceYears: 13,
    consultationFee: 699,
    profileImage: "https://d3aa3s3yhl0emm.cloudfront.net/telemed/doctors/photos/doc-image-1.webp",
    status: "ACTIVE",
    averageRating: 4.8,
    reviewCount: 156,
    categories: [{ id: 2, name: "Hair" }]
  }
];

/**
 * Fetches verified active doctors from AIRO E-Med with in-memory caching and fallback protection.
 */
export async function getEmedDoctors(): Promise<EMedDoctor[]> {
  const now = Date.now();
  if (cachedDoctors && now < cacheExpiry) {
    return cachedDoctors;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(`${AIRO_EMED_BASE_URL}/v1/catalog/doctors`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AIRO-Health-Hub/1.0',
      },
      signal: controller.signal,
      next: { revalidate: 300 }, // Next.js ISR 5 min
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        cachedDoctors = data.items.filter((doc: EMedDoctor) => doc.status === 'ACTIVE');
        cacheExpiry = now + 5 * 60 * 1000;
        return cachedDoctors;
      }
    }
    console.warn('[AIRO E-Med] Upstream returned non-200, serving verified fallback roster');
  } catch (err) {
    console.error('[AIRO E-Med] Failed to fetch live doctors:', err);
  }

  return FALLBACK_DOCTORS;
}

/**
 * Filter doctors by service/symptom category
 */
export function matchDoctorsByService(doctors: EMedDoctor[], serviceTitle: string): EMedDoctor[] {
  if (!serviceTitle) return doctors;
  const lower = serviceTitle.toLowerCase();

  const matches = doctors.filter(doc => {
    const spec = (doc.specialization || '').toLowerCase();
    const categories = (doc.categories || []).map(c => c.name.toLowerCase()).join(' ');

    if (lower.includes('skin') || lower.includes('rash') || lower.includes('acne')) {
      return spec.includes('derma') || categories.includes('derma');
    }
    if (lower.includes('hair') || lower.includes('scalp')) {
      return spec.includes('tricho') || categories.includes('hair');
    }
    if (lower.includes('weight') || lower.includes('obesity') || lower.includes('diet')) {
      return spec.includes('obesity') || spec.includes('metabolic') || categories.includes('weight');
    }
    if (lower.includes('sexual') || lower.includes('ed')) {
      return spec.includes('andrology') || categories.includes('sexual');
    }
    // Default to general medicine / internal medicine
    return spec.includes('general') || spec.includes('internal') || spec.includes('medicine') || spec.includes('physician');
  });

  return matches.length > 0 ? matches : doctors;
}

/**
 * Sanitize user input to prevent XSS and injection
 */
export function sanitizeString(input: unknown, maxLen = 100): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>'"&]/g, '') // strip dangerous html chars
    .slice(0, maxLen);
}

/**
 * Validate Indian 10-digit mobile number
 */
export function isValidIndianMobile(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  // Format: 10 digits starting with 6-9, or 12 digits starting with 91 followed by 6-9
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return true;
  if (digits.length === 12 && /^91[6-9]\d{9}$/.test(digits)) return true;
  return false;
}
