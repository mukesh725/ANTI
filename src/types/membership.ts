export type MembershipPlanType = 
  | 'AIRO ONE Select' 
  | 'AIRO ONE Preferred' 
  | 'AIRO ONE Signature';

export type PaymentStatusType = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export type MembershipStatusType = 'Pending Activation' | 'Active' | 'Expired' | 'Cancelled';

export type PaymentMethodType = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Other';

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relation?: string;
}

export interface MemberRecord {
  id?: string; // Firestore Document ID
  registrationId: string; // Unique application ID e.g. REG-1722192000-A1B2
  memberId: string | null; // Null initially, ONE ID (AIRO-1000001) upon activation
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  emergencyContact?: string | EmergencyContact | null;
  membershipPlan: MembershipPlanType;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType | null;
  membershipStatus: MembershipStatusType;
  registrationDate: string; // ISO string
  activationDate: string | null; // ISO string
  expiryDate: string | null; // ISO string
  qrCodeUrl: string | null; // Data URL or URL
  digitalCardUrl: string | null; // Data URL or metadata
  createdBy: string;
  lastUpdated: string;
}

export interface PendingRegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  emergencyContact?: string;
  membershipPlan: MembershipPlanType;
}

export interface ActivateMemberInput {
  registrationIdOrDocId: string;
  paymentMethod?: PaymentMethodType;
  adminNotes?: string;
}

// ==========================================
// NEW ARCHITECTURE: MULTI-MEMBER HIERARCHY
// ==========================================

export type PatientStatusType = 'active' | 'managed' | 'invited';
export type PatientRoleType = 'primary' | 'dependent';

/**
 * Represents the unified billing and plan details for a household/membership.
 * Firestore Document ID should be the Primary's Mobile Number (e.g. +1234567890)
 */
export interface AccountRecord {
  id?: string; // Firestore Doc ID (Primary Mobile)
  primaryPatientId: string; // Refers to a PatientRecord ID
  membershipPlan: MembershipPlanType;
  membershipStatus: MembershipStatusType;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType | null;
  maxMembers: number; // e.g., 1 (Select), 3 (Preferred), 5 (Signature)
  registrationDate: string;
  activationDate: string | null;
  expiryDate: string | null;
  lastUpdated: string;
  email: string; // Account level email for billing/notices
}

/**
 * Represents an individual person (primary or dependent) on an account.
 * Firestore Document ID should be the Patient ID (e.g. PT-100001)
 */
export interface PatientRecord {
  id?: string; // Patient ID
  accountId: string; // Refers to the AccountRecord ID (Primary Mobile)
  role: PatientRoleType;
  status: PatientStatusType;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone?: string; // Optional: If provided, this user can log in independently
  qrCodeUrl?: string | null;
  digitalCardUrl?: string | null;
  lastUpdated: string;
  createdAt: string;
}

/**
 * Input for inviting a new dependent to an existing account.
 */
export interface InviteDependentInput {
  accountId: string; // Primary's mobile
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone?: string; // If provided -> invited. If null -> managed.
}
