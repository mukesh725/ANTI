export interface PraanaVitalRecord {
  id: string;
  sessionId: string;
  patientId: string;
  accountId: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  timestamp: string;

  // Metrics
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
  notes?: string;
  doctorNotes?: string;           // Doctor's clinical observation & recommendation
  doctorReviewed?: boolean;       // Reviewed by clinic doctor/cardiologist
  reviewedByDoctorName?: string;  // e.g. "Dr. Ananya Sharma, MD"
  reviewedAt?: string;            // Timestamp when doctor reviewed
  membershipId?: string;          // e.g. "AIRO-1000007"
  recordedBy: string;             // Clinic Staff / Praana Station ID
  createdAt: string;
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
