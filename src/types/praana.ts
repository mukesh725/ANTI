export type PatientJourneyStatus =
  | 'BOOKED'
  | 'CHECKED_IN'
  | 'QUESTIONNAIRE_IN_PROGRESS'
  | 'QUESTIONNAIRE_COMPLETED'
  | 'CHAIR_SCAN_COMPLETED'
  | 'READY_FOR_CLINICAL_REVIEW'
  | 'IN_CLINICAL_REVIEW'
  | 'LABS_ORDERED'
  | 'DOCTOR_CONSULT_PENDING'
  | 'CARE_PLAN_ISSUED'
  | 'COMPLETED';

export type ClinicalReviewBranch = 
  | 'BRANCH_A_GUIDANCE'   // No additional testing required -> Health Guidance & Care Plan
  | 'BRANCH_B_LABS'       // Blood / Lab testing required -> Order lab test
  | 'BRANCH_C_DOCTOR';    // Doctor evaluation required -> MBBS / MD consult

export interface ChronicDiseaseQuestionnaireData {
  personalInfo: {
    fullName: string;
    dob: string;
    age: number | string;
    sex: 'Male' | 'Female' | 'Other' | string;
    countryCode: string;
    mobileNumber: string;
    email: string;
    occupation: string;
    heightFeet: number | string;
    heightInches: number | string;
    weightLbs?: number | string;
    comment?: string;
  };
  medicalConditions: string[];
  medicalConditionsComment?: string;
  familyHistory: string[];
  familyHistoryComment?: string;
  symptoms: string[];
  symptomsComment?: string;
  medications: string[];
  medicationsComment?: string;
  lifestyle: {
    tobacco: string;
    tobaccoComment?: string;
    alcohol: string;
    alcoholComment?: string;
    physicalActivity: string;
    physicalActivityComment?: string;
    dailyActivity: string;
    dailyActivityComment?: string;
    usualDiet: string;
    usualDietComment?: string;
    sugaryDrinks: string;
    sugaryDrinksComment?: string;
    waterIntake: string;
    waterIntakeComment?: string;
    stressLevel: string;
    stressLevelComment?: string;
  };
  healthGoals: string[];
  healthGoalsComment?: string;
  completedAt?: string;
  verifiedByPharmD?: string;
}

export interface PraanaVitalRecord {
  id: string;
  sessionId: string;
  patientId: string;
  accountId: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  timestamp: string;

  // 9 Essential Metrics
  respiratoryRate: number;        // breaths/min (12-24)
  spo2: number;                   // % (95-100)
  bloodPressureSystolic: number;  // mmHg (90-120)
  bloodPressureDiastolic: number; // mmHg (60-80)
  heartRate: number;              // bpm (60-100)
  pulseRate: number;              // bpm (60-100)
  weightLbs: number;              // lbs
  temperatureF: number;           // °F (97.8-99.1)
  ecgStatus: string;              // e.g. "Normal Sinus Rhythm"
  chairSignalQuality: number;     // e.g. 0.99
  stressScore?: number;           // 1-100
  praanaScore?: number;           // 1-100 health composite score
  notes?: string;
  doctorNotes?: string;           // Doctor's clinical observation & recommendation
  doctorReviewed?: boolean;       // Reviewed by clinic doctor/cardiologist
  reviewedByDoctorName?: string;  // e.g. "Dr. Ananya Sharma, MD"
  reviewedAt?: string;            // Timestamp when doctor reviewed
  membershipId?: string;          // e.g. "AIRO-1000007"
  recordedBy: string;             // Clinic Staff / Praana Station ID
  createdAt: string;
}

export interface LabOrder {
  id: string;
  tests: string[];
  orderedAt: string;
  status: 'ORDERED' | 'SAMPLE_COLLECTED' | 'RESULTS_READY';
  resultsSummary?: string;
  resultDate?: string;
}

export interface DoctorConsultationNote {
  consultId: string;
  doctorName: string;
  doctorRole: 'MBBS' | 'MD' | 'Specialist';
  consultType: 'IN_PERSON' | 'TELECONSULT';
  notes: string;
  prescribedAt: string;
}

export interface CarePlan {
  id: string;
  summary: string;
  lifestyleGuidance: string[];
  preventiveCare: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  followUpWeeks: number;
  followUpDate: string;
  issuedBy: string;
  issuedAt: string;
  fulfillmentType: 'STORE_PICKUP' | 'HOME_DELIVERY';
}

export interface PraanaPatientRecord {
  id: string;                      // Internal record ID
  patientId: string;               // Assigned display ID: AIRO-XXXXX
  flowType: 'ONLINE_BOOKING' | 'DIRECT_WALK_IN';
  status: PatientJourneyStatus;
  
  // 1. Patient Information
  patientInfo: {
    fullName: string;
    dob: string;
    age: number;
    sex: string;
    mobileNumber: string;
    email: string;
    address?: string;
    emergencyContact?: string;
  };

  // 2. Appointment Details
  appointment?: {
    bookingId: string;
    clinicLocation: string;
    date: string;
    timeSlot: string;
    source: 'AD_QR' | 'ONLINE_WEB' | 'WALK_IN_DESK';
  };

  // 3. Health Questionnaire (from Pharm.D)
  questionnaire?: ChronicDiseaseQuestionnaireData;

  // 4. Praana Vitals (from Smart Chair)
  vitals?: PraanaVitalRecord;

  // 5. Clinical Review
  clinicalReview?: {
    branch: ClinicalReviewBranch;
    clinicianName: string;
    clinicianRole: 'MBBS' | 'PHARM_D' | 'MD';
    reviewedAt: string;
    assessmentNotes: string;
  };

  // 6. Lab Results (Branch B)
  labOrder?: LabOrder;

  // 7. Doctor Consult (Branch C)
  doctorConsult?: DoctorConsultationNote;

  // 8. Care Plan & Pharmacy (Steps 9-13)
  carePlan?: CarePlan;

  createdAt: string;
  updatedAt: string;
}

export interface PatientSearchResult {
  id: string;             // Patient ID or Member ID
  name: string;
  phone: string;
  email: string;
  role: 'primary' | 'dependent';
  accountId: string;      // Mobile number
  membershipPlan?: string;
}

