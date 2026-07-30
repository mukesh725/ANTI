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
