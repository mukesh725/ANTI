"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, Heart, Thermometer, Wind, Scale, CheckCircle2, 
  Calendar, Clock, MapPin, User, Phone, Mail, FileText, 
  ArrowRight, ShieldCheck, Stethoscope, AlertTriangle, 
  ChevronRight, RefreshCw, Printer, Download, Sparkles, 
  Pill, Truck, Store, QrCode, Check, HelpCircle, Eye,
  FlaskConical, UserCheck, Smartphone, Info, Share2
} from "lucide-react";
import { 
  PraanaPatientRecord, 
  ChronicDiseaseQuestionnaireData, 
  PraanaVitalRecord,
  ClinicalReviewBranch,
  CarePlan
} from "@/types/praana";
import { PharmDQuestionnaire } from "./PharmDQuestionnaire";

const CLINIC_LOCATIONS = [
  { id: "indiranagar", name: "AIRO Flagship Clinic & Minute Station — Indiranagar, 100ft Rd" },
  { id: "koramangala", name: "AIRO Minute Clinic & Health Lounge — Koramangala, 80ft Rd" },
  { id: "hsr", name: "AIRO Minute Station — HSR Layout, Sector 4" },
  { id: "whitefield", name: "AIRO Health Hub — Whitefield, Main Road" },
];

export function PraanaPatientJourney() {
  // Navigation / Step state: 1 to 13 (supports ?step= query param)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"journey" | "queue" | "patient_view">("journey");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step");
      if (stepParam) {
        const num = parseInt(stepParam);
        if (num >= 1 && num <= 13) {
          setActiveStep(num);
        }
      }
    }
  }, []);

  // Selected or Active Patient Record
  const [patientRecord, setPatientRecord] = useState<PraanaPatientRecord>({
    id: "rec_initial_01",
    patientId: "AIRO-48921",
    flowType: "ONLINE_BOOKING",
    status: "BOOKED",
    patientInfo: {
      fullName: "Rohan Verma",
      dob: "12/06/1988",
      age: 38,
      sex: "Male",
      mobileNumber: "9876543210",
      email: "rohan.verma@example.com",
      address: "Indiranagar 1st Stage, Bangalore"
    },
    appointment: {
      bookingId: "BKG-99210",
      clinicLocation: "AIRO Flagship Clinic & Minute Station — Indiranagar, 100ft Rd",
      date: "Tomorrow, 10:30 AM",
      timeSlot: "10:30 AM – 10:45 AM",
      source: "ONLINE_WEB"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Flow 1 Online Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: "Rohan Verma",
    dob: "12/06/1988",
    age: "38",
    sex: "Male",
    mobileNumber: "9876543210",
    email: "rohan.verma@example.com",
    clinicLocation: CLINIC_LOCATIONS[0].name,
    date: "2026-09-22",
    timeSlot: "10:30 AM"
  });

  // Flow 2 Walk-In Form State
  const [walkInForm, setWalkInForm] = useState({
    fullName: "",
    dob: "",
    age: "",
    sex: "Male",
    mobileNumber: "",
    email: "",
    clinicLocation: CLINIC_LOCATIONS[0].name,
    reason: "Routine Health Scan & Vitals Check"
  });

  // Check-In Search query
  const [checkInSearch, setCheckInSearch] = useState("9876543210");
  const [isCheckInSuccess, setIsCheckInSuccess] = useState(false);

  // Praana Chair Scanning State (Step 5)
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedVitalsPreset, setSelectedVitalsPreset] = useState<"optimal" | "elevated" | "borderline">("optimal");

  // Step 8 Clinical Review State
  const [selectedBranch, setSelectedBranch] = useState<ClinicalReviewBranch | null>(null);
  const [clinicianRole, setClinicianRole] = useState<"MBBS" | "PHARM_D" | "MD">("MBBS");
  const [clinicianName, setClinicianName] = useState("Dr. Ananya Sharma, MBBS, MD");
  const [clinicalAssessmentNotes, setClinicalAssessmentNotes] = useState(
    "Patient exhibits stable baseline vitals. Blood pressure is well managed. Advised ongoing lifestyle adherence and annual screening."
  );

  // Branch B Lab Tests State
  const [orderedLabTests, setOrderedLabTests] = useState<string[]>([
    "Fasting Blood Glucose", "HbA1c", "Complete Lipid Profile"
  ]);
  const [labResultsReady, setLabResultsReady] = useState(false);

  // Branch C Doctor Consult State
  const [doctorConsultNotes, setDoctorConsultNotes] = useState(
    "Physician review completed. Prescribed metabolic maintenance protocol with follow-up in 60 days."
  );

  // Care Plan Form State
  const [carePlanFulfillment, setCarePlanFulfillment] = useState<"STORE_PICKUP" | "HOME_DELIVERY">("HOME_DELIVERY");
  const [followUpWeeks, setFollowUpWeeks] = useState(8);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // Step 1: Submit Online Booking
  const handleConfirmOnlineBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `AIRO-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord: PraanaPatientRecord = {
      id: `rec_${Date.now()}`,
      patientId: newId,
      flowType: "ONLINE_BOOKING",
      status: "BOOKED",
      patientInfo: {
        fullName: bookingForm.fullName,
        dob: bookingForm.dob,
        age: parseInt(bookingForm.age) || 35,
        sex: bookingForm.sex,
        mobileNumber: bookingForm.mobileNumber,
        email: bookingForm.email
      },
      appointment: {
        bookingId: `BKG-${Math.floor(10000 + Math.random() * 90000)}`,
        clinicLocation: bookingForm.clinicLocation,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        source: "ONLINE_WEB"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPatientRecord(newRecord);
    setActiveStep(3); // Advance to Check-In Desk
  };

  // Step 2: Submit Direct Walk-In
  const handleConfirmWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.fullName || !walkInForm.mobileNumber) {
      alert("Please provide patient name and mobile number.");
      return;
    }
    const newId = `AIRO-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord: PraanaPatientRecord = {
      id: `rec_${Date.now()}`,
      patientId: newId,
      flowType: "DIRECT_WALK_IN",
      status: "CHECKED_IN",
      patientInfo: {
        fullName: walkInForm.fullName,
        dob: walkInForm.dob || "01/01/1990",
        age: parseInt(walkInForm.age) || 34,
        sex: walkInForm.sex,
        mobileNumber: walkInForm.mobileNumber,
        email: walkInForm.email
      },
      appointment: {
        bookingId: `WLK-${Math.floor(10000 + Math.random() * 90000)}`,
        clinicLocation: walkInForm.clinicLocation,
        date: "Today (Walk-In)",
        timeSlot: "Immediate",
        source: "WALK_IN_DESK"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPatientRecord(newRecord);
    setIsCheckInSuccess(true);
    setActiveStep(4); // Advance directly to Pharm.D Questionnaire
  };

  // Step 3: Check-In Confirmation
  const handlePerformCheckIn = () => {
    setPatientRecord(prev => ({
      ...prev,
      status: "CHECKED_IN",
      updatedAt: new Date().toISOString()
    }));
    setIsCheckInSuccess(true);
    setTimeout(() => {
      setActiveStep(4); // Advance to Pharm.D Questionnaire
    }, 800);
  };

  // Step 4: Pharm.D Questionnaire Complete
  const handleQuestionnaireComplete = (data: ChronicDiseaseQuestionnaireData) => {
    setPatientRecord(prev => ({
      ...prev,
      status: "QUESTIONNAIRE_COMPLETED",
      questionnaire: data,
      updatedAt: new Date().toISOString()
    }));
    setActiveStep(5); // Advance to Praana Chair Vital Scan
  };

  // Step 5: Start Simulated Chair Scan
  const handleStartChairScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Generate vitals based on preset
          let vitalsPayload: PraanaVitalRecord;
          if (selectedVitalsPreset === "optimal") {
            vitalsPayload = {
              id: `vtl_${Date.now()}`,
              sessionId: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
              patientId: patientRecord.patientId,
              accountId: patientRecord.patientInfo.mobileNumber,
              patientName: patientRecord.patientInfo.fullName,
              timestamp: new Date().toISOString(),
              bloodPressureSystolic: 118,
              bloodPressureDiastolic: 76,
              heartRate: 72,
              pulseRate: 72,
              spo2: 99,
              respiratoryRate: 15,
              temperatureF: 98.4,
              weightLbs: 154,
              ecgStatus: "Normal Sinus Rhythm",
              chairSignalQuality: 0.99,
              stressScore: 18,
              praanaScore: 92,
              recordedBy: "Praana Smart Chair Station #01",
              createdAt: new Date().toISOString()
            };
          } else if (selectedVitalsPreset === "elevated") {
            vitalsPayload = {
              id: `vtl_${Date.now()}`,
              sessionId: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
              patientId: patientRecord.patientId,
              accountId: patientRecord.patientInfo.mobileNumber,
              patientName: patientRecord.patientInfo.fullName,
              timestamp: new Date().toISOString(),
              bloodPressureSystolic: 138,
              bloodPressureDiastolic: 88,
              heartRate: 84,
              pulseRate: 84,
              spo2: 97,
              respiratoryRate: 18,
              temperatureF: 98.8,
              weightLbs: 168,
              ecgStatus: "Sinus Tachycardia (Mild)",
              chairSignalQuality: 0.98,
              stressScore: 62,
              praanaScore: 74,
              recordedBy: "Praana Smart Chair Station #01",
              createdAt: new Date().toISOString()
            };
          } else {
            vitalsPayload = {
              id: `vtl_${Date.now()}`,
              sessionId: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
              patientId: patientRecord.patientId,
              accountId: patientRecord.patientInfo.mobileNumber,
              patientName: patientRecord.patientInfo.fullName,
              timestamp: new Date().toISOString(),
              bloodPressureSystolic: 126,
              bloodPressureDiastolic: 82,
              heartRate: 78,
              pulseRate: 78,
              spo2: 98,
              respiratoryRate: 16,
              temperatureF: 98.6,
              weightLbs: 160,
              ecgStatus: "Normal Sinus Rhythm",
              chairSignalQuality: 0.99,
              stressScore: 35,
              praanaScore: 84,
              recordedBy: "Praana Smart Chair Station #01",
              createdAt: new Date().toISOString()
            };
          }

          setPatientRecord(prev => ({
            ...prev,
            status: "CHAIR_SCAN_COMPLETED",
            vitals: vitalsPayload,
            updatedAt: new Date().toISOString()
          }));

          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Step 6 & 7: Transition to Clinical Review Queue
  const handleMarkReadyForReview = () => {
    setPatientRecord(prev => ({
      ...prev,
      status: "READY_FOR_CLINICAL_REVIEW",
      updatedAt: new Date().toISOString()
    }));
    setActiveStep(8); // Advance to Step 8 Clinical Review Hub
  };

  // Step 8: Finalize Clinical Review Decision
  const handleFinalizeClinicalReview = () => {
    if (!selectedBranch) {
      alert("Please select a clinical decision branch (Branch A, B, or C).");
      return;
    }

    const carePlanPayload: CarePlan = {
      id: `CP-${Math.floor(10000 + Math.random() * 90000)}`,
      summary: clinicalAssessmentNotes,
      lifestyleGuidance: [
        "Maintain 30 mins of moderate aerobic exercise 4x weekly",
        "Adopt low-glycemic, anti-inflammatory Mediterranean dietary principles",
        "Target hydration of 2.5L filtered water daily",
        "Daily 10-minute mindfulness breathing to regulate cortisol"
      ],
      preventiveCare: [
        "Daily morning blood pressure tracking via AIRO App",
        "Routine lipid and HbA1c screening at 6-month interval",
        "Complimentary dietitian consultation scheduled"
      ],
      medications: selectedBranch === "BRANCH_C_DOCTOR" ? [
        {
          name: "Telmisartan Tablets IP",
          dosage: "40 mg",
          frequency: "Once Daily (Morning)",
          duration: "30 Days",
          instructions: "Take after breakfast with water."
        },
        {
          name: "CoQ10 + Omega-3 Bio-Cardio Complex",
          dosage: "1 Capsule",
          frequency: "Once Daily (Evening)",
          duration: "60 Days",
          instructions: "Take with main meal."
        }
      ] : [
        {
          name: "AIRO Essentials Daily Vitality Multi-Nutrient",
          dosage: "1 Tablet",
          frequency: "Once Daily",
          duration: "60 Days",
          instructions: "Take after breakfast."
        }
      ],
      followUpWeeks: followUpWeeks,
      followUpDate: new Date(Date.now() + followUpWeeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      issuedBy: clinicianName,
      issuedAt: new Date().toISOString(),
      fulfillmentType: carePlanFulfillment
    };

    setPatientRecord(prev => ({
      ...prev,
      status: "CARE_PLAN_ISSUED",
      clinicalReview: {
        branch: selectedBranch,
        clinicianName,
        clinicianRole,
        reviewedAt: new Date().toISOString(),
        assessmentNotes: clinicalAssessmentNotes
      },
      carePlan: carePlanPayload,
      updatedAt: new Date().toISOString()
    }));

    setActiveStep(9); // Advance to Final Care Plan & Fulfillment
  };

  // Steps indicator data
  const stepsList = [
    { num: 1, label: "Booking", sub: "Online Flow" },
    { num: 2, label: "Walk-In", sub: "In-Store Help" },
    { num: 3, label: "Check-In", sub: "Assign ID" },
    { num: 4, label: "Pharm.D", sub: "Questionnaire" },
    { num: 5, label: "Praana Chair", sub: "Vital Scan" },
    { num: 6, label: "Record", sub: "Unified Chart" },
    { num: 7, label: "Queue", sub: "Clinical Review" },
    { num: 8, label: "Review", sub: "MBBS / Pharm.D" },
    { num: 9, label: "Care Plan", sub: "Final Rx" },
    { num: 10, label: "Pharmacy", sub: "Dispense" },
    { num: 11, label: "Fulfill", sub: "Pickup/Delivery" },
    { num: 12, label: "Follow-Up", sub: "Reminders" },
    { num: 13, label: "Patient App", sub: "Digital Hub" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-['Plus_Jakarta_Sans']">
      {/* Top Hero Banner */}
      <div className="bg-[#0b132b] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-sky-500 text-white text-xs font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
                AIRO Praana™
              </span>
              <span className="text-teal-400 text-xs font-bold tracking-wide">
                Two ways to start. One patient record. A healthier tomorrow.
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-['Outfit'] text-white">
              Praana Health Scan — Full Patient Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Integrated clinical workflow from advertisement or walk-in, through Pharm.D questionnaire and Praana Chair telemetry, to physician review and personalized care plan delivery.
            </p>
          </div>

          {/* Active Patient Identifier Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Patient ID</p>
              <p className="font-mono text-lg font-black text-emerald-300">{patientRecord.patientId}</p>
              <p className="text-xs font-semibold text-white">{patientRecord.patientInfo.fullName} • Status: <span className="text-emerald-400">{patientRecord.status}</span></p>
            </div>
          </div>
        </div>

        {/* 13-Step Visual Progress Stepper */}
        <div className="mt-8 pt-6 border-t border-white/10 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[850px] gap-2">
            {stepsList.map((st) => {
              const isDone = activeStep > st.num;
              const isCurrent = activeStep === st.num;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setActiveStep(st.num)}
                  className={`flex flex-col items-center gap-1 group transition-all text-center flex-1 ${
                    isCurrent ? "opacity-100 scale-105" : isDone ? "opacity-90" : "opacity-40 hover:opacity-75"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCurrent 
                      ? "bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30 shadow-lg"
                      : isDone 
                        ? "bg-emerald-600/80 text-white" 
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}>
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                  </div>
                  <span className={`text-[11px] font-bold whitespace-nowrap ${isCurrent ? "text-emerald-300" : "text-slate-300"}`}>
                    {st.label}
                  </span>
                  <span className="text-[9px] text-slate-400 hidden sm:inline">
                    {st.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Journey Content Stage */}
      <div className="space-y-8">
        {/* =========================================================================
            STEP 1: ONLINE BOOKING FLOW
        ========================================================================= */}
        {activeStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Stage 1: Online Booking
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Book Your Praana Health Scan Online</h2>
                <p className="text-xs text-slate-500 mt-1">
                  For customers discovering AIRO via outdoor ads, metro signs, social media, or web.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1.5"
              >
                Switch to Direct Walk-In Flow <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* CRITICAL NOTE FROM DIAGRAM */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Important Clinical Notice:</strong> The health questionnaire is <strong>NOT</strong> completed online. It will be conducted in person with an AIRO Pharm.D specialist after your check-in at the clinic.
              </div>
            </div>

            <form onSubmit={handleConfirmOnlineBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Clinic Location *
                  </label>
                  <select
                    value={bookingForm.clinicLocation}
                    onChange={(e) => setBookingForm(b => ({ ...b, clinicLocation: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white"
                  >
                    {CLINIC_LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm(b => ({ ...b, date: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm(b => ({ ...b, timeSlot: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white"
                  >
                    {["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    value={bookingForm.fullName}
                    onChange={(e) => setBookingForm(b => ({ ...b, fullName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number (for SMS confirmation) *
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.mobileNumber}
                    onChange={(e) => setBookingForm(b => ({ ...b, mobileNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(b => ({ ...b, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Instant SMS & WhatsApp confirmation will be sent upon booking.
                </p>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Booking & Proceed to Check-In Desk
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            STEP 2: DIRECT WALK-IN FLOW
        ========================================================================= */}
        {activeStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  Stage 2: Direct Walk-In Flow
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">In-Store Help Desk Registration</h2>
                <p className="text-xs text-slate-500 mt-1">
                  For customers walking directly into an AIRO store expressing interest in a health scan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1.5"
              >
                Switch to Online Booking <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmWalkIn} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInForm.fullName}
                    onChange={(e) => setWalkInForm(w => ({ ...w, fullName: e.target.value }))}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={walkInForm.mobileNumber}
                    onChange={(e) => setWalkInForm(w => ({ ...w, mobileNumber: e.target.value }))}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Age & Sex
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={walkInForm.age}
                      onChange={(e) => setWalkInForm(w => ({ ...w, age: e.target.value }))}
                      placeholder="Age"
                      className="w-24 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900"
                    />
                    <select
                      value={walkInForm.sex}
                      onChange={(e) => setWalkInForm(w => ({ ...w, sex: e.target.value }))}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Help Desk staff: Create patient record and proceed directly to check-in.
                </p>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/20"
                >
                  <UserCheck className="w-4 h-4" />
                  Create Record, Check-In & Start Questionnaire
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            STEP 3: PATIENT CHECK-IN (COMMON FOR BOTH FLOWS)
        ========================================================================= */}
        {activeStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                Stage 3: Patient Check-In Desk
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Identity Verification & Patient ID Assignment</h2>
              <p className="text-xs text-slate-500 mt-1">
                Common check-in point for both online booking appointments and walk-in patients.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase font-bold text-slate-500">Scheduled Booking Found</p>
                <h3 className="text-xl font-bold text-slate-900">{patientRecord.patientInfo.fullName}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
                  <span>📱 {patientRecord.patientInfo.mobileNumber}</span>
                  <span>📍 {patientRecord.appointment?.clinicLocation}</span>
                  <span>🗓️ {patientRecord.appointment?.date} ({patientRecord.appointment?.timeSlot})</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shrink-0 w-full md:w-64">
                <p className="text-[10px] uppercase font-bold text-slate-400">Assigned Patient ID</p>
                <p className="font-mono text-xl font-black text-emerald-600">{patientRecord.patientId}</p>
                <div className="mt-2">
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    patientRecord.status === "CHECKED_IN"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {patientRecord.status === "CHECKED_IN" ? "✓ Marked as Checked In" : "Pending Check-In"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Booking Details
              </button>

              <button
                type="button"
                onClick={handlePerformCheckIn}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Check-In & Proceed to Pharm.D Questionnaire
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: PHARM.D - HEALTH QUESTIONNAIRE
        ========================================================================= */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <PharmDQuestionnaire
              patientName={patientRecord.patientInfo.fullName}
              patientId={patientRecord.patientId}
              initialData={patientRecord.questionnaire}
              onComplete={handleQuestionnaireComplete}
              onCancel={() => setActiveStep(3)}
            />
          </div>
        )}

        {/* =========================================================================
            STEP 5: PRAANA CHAIR - VITAL SCAN
        ========================================================================= */}
        {activeStep === 5 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  Stage 5: Praana Chair Vital Scan
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Automated Multi-Parameter Health Telemetry</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Patient relaxes in the Praana Smart Chair. Sensors capture 9 essential vitals automatically.
                </p>
              </div>

              {/* Preset Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Simulate Profile:</span>
                <select
                  value={selectedVitalsPreset}
                  onChange={(e) => setSelectedVitalsPreset(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="optimal">Optimal (Normal Sinus)</option>
                  <option value="elevated">Elevated (Mild HTN/Tachycardia)</option>
                  <option value="borderline">Borderline / Prehypertensive</option>
                </select>
              </div>
            </div>

            {/* Live Scan Telemetry Display */}
            {patientRecord.vitals ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">Vitals Successfully Captured & Saved</h4>
                      <p className="text-xs text-emerald-700">Linked to Patient ID: {patientRecord.patientId} • Recorded by: {patientRecord.vitals.recordedBy}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartChairScan}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-Scan
                  </button>
                </div>

                {/* 9 Vitals Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-bold uppercase">Blood Pressure</span>
                      <Activity className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {patientRecord.vitals.bloodPressureSystolic} / {patientRecord.vitals.bloodPressureDiastolic}
                      <span className="text-xs font-medium text-slate-500 ml-1">mmHg</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Normal Range (120/80)</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-bold uppercase">Heart Rate</span>
                      <Heart className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {patientRecord.vitals.heartRate}
                      <span className="text-xs font-medium text-slate-500 ml-1">bpm</span>
                    </p>
                    <p className="text-[11px] text-slate-600 font-semibold mt-1">{patientRecord.vitals.ecgStatus}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-bold uppercase">SpO₂ Oxygen</span>
                      <Wind className="w-4 h-4 text-sky-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {patientRecord.vitals.spo2}
                      <span className="text-xs font-medium text-slate-500 ml-1">%</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Optimal Saturation</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-bold uppercase">Respiratory Rate</span>
                      <Activity className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {patientRecord.vitals.respiratoryRate}
                      <span className="text-xs font-medium text-slate-500 ml-1">/min</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Eupneic Rhythm</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-bold uppercase">Body Temperature</span>
                      <Thermometer className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {patientRecord.vitals.temperatureF}
                      <span className="text-xs font-medium text-slate-500 ml-1">°F</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Normothermic</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-bold uppercase">Weight & BMI</span>
                      <Scale className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {patientRecord.vitals.weightLbs}
                      <span className="text-xs font-medium text-slate-500 ml-1">lbs</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">BMI: 22.8 (Healthy)</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-bold uppercase">Signal Quality</span>
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {Math.round((patientRecord.vitals.chairSignalQuality || 0.99) * 100)}
                      <span className="text-xs font-medium text-slate-500 ml-1">%</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Clinical Grade Capture</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
                    <div className="flex items-center justify-between text-emerald-200 mb-1">
                      <span className="text-xs font-bold uppercase">Praana Health Score</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    </div>
                    <p className="text-3xl font-black text-white">
                      {patientRecord.vitals.praanaScore || 88}
                      <span className="text-xs font-medium text-emerald-200 ml-1">/ 100</span>
                    </p>
                    <p className="text-[11px] text-emerald-200 font-semibold mt-1">Comprehensive Vital Index</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    ← Review Questionnaire
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(6)}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    View Updated Unified Patient Record (Step 6) <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-5">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm">
                  <Activity className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Praana Chair Ready for Telemetry Scan</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Connect patient <strong>{patientRecord.patientInfo.fullName}</strong> ({patientRecord.patientId}) to begin automated 9-point vitals telemetry.
                  </p>
                </div>

                {isScanning ? (
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Scanning vitals...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartChairScan}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-teal-600/20 inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Activate Praana Chair Scan
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            STEP 6 & 7: UNIFIED PATIENT RECORD & CLINICAL REVIEW QUEUE
        ========================================================================= */}
        {(activeStep === 6 || activeStep === 7) && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Stage 6 & 7: Unified Patient Record
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">One Patient. One Record. Ready for Review.</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Questionnaire responses + Praana Chair vitals are now consolidated into a single authorized clinical record.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Status: Ready for Clinical Review
                </span>
              </div>
            </div>

            {/* Patient Record 8-Component Breakdown Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">1. Patient Information</p>
                <p className="font-bold text-sm text-slate-900">{patientRecord.patientInfo.fullName}</p>
                <p className="text-xs text-slate-600">ID: {patientRecord.patientId} • Age: {patientRecord.patientInfo.age}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">2. Appointment Source</p>
                <p className="font-bold text-sm text-slate-900">{patientRecord.flowType === "ONLINE_BOOKING" ? "Online Web Booking" : "Direct Walk-In"}</p>
                <p className="text-xs text-slate-600">{patientRecord.appointment?.clinicLocation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">3. Health Questionnaire</p>
                <p className="font-bold text-sm text-emerald-700">✓ 7 Sections Completed</p>
                <p className="text-xs text-slate-600">Verified by: {patientRecord.questionnaire?.verifiedByPharmD || "Dr. Sharma, Pharm.D"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">4. Praana Chair Vitals</p>
                <p className="font-bold text-sm text-emerald-700">
                  {patientRecord.vitals ? `BP ${patientRecord.vitals.bloodPressureSystolic}/${patientRecord.vitals.bloodPressureDiastolic} • HR ${patientRecord.vitals.heartRate}` : "Pending Scan"}
                </p>
                <p className="text-xs text-slate-600">Score: {patientRecord.vitals?.praanaScore || 88}/100</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Clinical Queue Status</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The intake and diagnostic telemetry phases are complete. The patient has been added to the authorized MBBS / Pharm.D clinician queue for triage and clinical guidance.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Chair Vitals
              </button>

              <button
                type="button"
                onClick={handleMarkReadyForReview}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Stethoscope className="w-4 h-4" />
                Launch Clinical Review Workspace (Step 8)
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 8: CLINICAL REVIEW (MBBS / PHARM.D) — 3 ACTION BRANCHES
        ========================================================================= */}
        {activeStep === 8 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  Stage 8: Clinical Review (MBBS / Pharm.D)
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Physician Assessment & Decision Tree</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Doctor reviews complete patient record (Demographics, Questionnaire, Praana Vitals) and determines the clinical pathway.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={clinicianName}
                  onChange={(e) => setClinicianName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                />
                <select
                  value={clinicianRole}
                  onChange={(e) => setClinicianRole(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="MBBS">MBBS</option>
                  <option value="PHARM_D">Pharm.D</option>
                  <option value="MD">MD Specialist</option>
                </select>
              </div>
            </div>

            {/* THREE CLINICAL BRANCHES FROM DIAGRAM */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Select Clinical Pathway Based on Assessment:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* BRANCH A: NO ADDITIONAL TESTING REQUIRED */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBranch("BRANCH_A_GUIDANCE");
                    setClinicalAssessmentNotes("No additional testing required. Patient has optimal hemodynamic stability. Prescribe Health Guidance & Preventive Care Plan.");
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    selectedBranch === "BRANCH_A_GUIDANCE"
                      ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500 shadow-md"
                      : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        A
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        Low Risk
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">
                      No Additional Testing Required
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Provide Health Guidance & Care Plan (Lifestyle advice, dietary guidance, preventive care, routine follow-up).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-200/50 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    {selectedBranch === "BRANCH_A_GUIDANCE" ? "✓ Selected Branch" : "Select Branch A"}
                  </div>
                </button>

                {/* BRANCH B: BLOOD / LAB TESTING REQUIRED */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBranch("BRANCH_B_LABS");
                    setClinicalAssessmentNotes("Blood & diagnostic lab investigations required for further metabolic profiling. Order diagnostic panels.");
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    selectedBranch === "BRANCH_B_LABS"
                      ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500 shadow-md"
                      : "bg-slate-50 border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        B
                      </span>
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                        Labs Needed
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">
                      Blood / Lab Testing Required
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Order Diagnostic Lab Tests (Blood, KFT, LFT, Lipid, HbA1c). Results added to single patient record.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200/50 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                    {selectedBranch === "BRANCH_B_LABS" ? "✓ Selected Branch" : "Select Branch B"}
                  </div>
                </button>

                {/* BRANCH C: DOCTOR EVALUATION REQUIRED */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBranch("BRANCH_C_DOCTOR");
                    setClinicalAssessmentNotes("Doctor evaluation required for clinical findings. In-person/teleconsultation conducted with MBBS/MD physician.");
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    selectedBranch === "BRANCH_C_DOCTOR"
                      ? "bg-rose-50/80 border-rose-500 ring-2 ring-rose-500 shadow-md"
                      : "bg-slate-50 border-slate-200 hover:border-rose-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        C
                      </span>
                      <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                        Physician Consult
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">
                      Doctor Evaluation Required
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Immediate consultation with MBBS / MD Doctor. In-depth clinical assessment and prescription compounding.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rose-200/50 flex items-center gap-1.5 text-xs font-bold text-rose-700">
                    {selectedBranch === "BRANCH_C_DOCTOR" ? "✓ Selected Branch" : "Select Branch C"}
                  </div>
                </button>
              </div>
            </div>

            {/* Branch Details Expanded Sections */}
            {selectedBranch === "BRANCH_B_LABS" && (
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-amber-700" />
                    Branch B: Diagnostic Lab Test Order Form
                  </h4>
                  <button
                    type="button"
                    onClick={() => setLabResultsReady(true)}
                    className="text-xs font-bold text-amber-800 underline"
                  >
                    Simulate Sample Collection & Lab Results
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Fasting Blood Glucose", "HbA1c Glycated Hemoglobin", "Lipid Profile Panel", 
                    "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid TSH",
                    "Complete Blood Count (CBC)", "Urine Routine & Micro"
                  ].map(test => {
                    const isChecked = orderedLabTests.includes(test);
                    return (
                      <button
                        key={test}
                        type="button"
                        onClick={() => {
                          setOrderedLabTests(prev => 
                            prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
                          );
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold ${
                          isChecked ? "bg-amber-600 text-white border-amber-600" : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {isChecked ? "✓ " : "+ "}{test}
                      </button>
                    );
                  })}
                </div>

                {labResultsReady && (
                  <div className="p-3 bg-white rounded-xl border border-amber-300 text-xs text-amber-900 font-medium">
                    ✓ Lab Results Added to Patient Record: Fasting Glucose: 98 mg/dL (Normal) • HbA1c: 5.6% (Optimal) • Total Cholesterol: 182 mg/dL.
                  </div>
                )}
              </div>
            )}

            {selectedBranch === "BRANCH_C_DOCTOR" && (
              <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-4">
                <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-rose-700" />
                  Branch C: MBBS / MD Doctor Clinical Assessment & Consultation
                </h4>
                <textarea
                  value={doctorConsultNotes}
                  onChange={(e) => setDoctorConsultNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  placeholder="Clinical consultation notes, differential diagnosis, and prescription details..."
                />
              </div>
            )}

            {/* Assessment Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical Review Notes & Treatment Guidance *
              </label>
              <textarea
                value={clinicalAssessmentNotes}
                onChange={(e) => setClinicalAssessmentNotes(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(6)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Unified Chart
              </button>

              <button
                type="button"
                onClick={handleFinalizeClinicalReview}
                disabled={!selectedBranch}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                Issue Final Care Plan (Steps 9–13)
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 9 – 13: FINAL CARE PLAN, PHARMACY & ONGOING APP HUB
        ========================================================================= */}
        {activeStep >= 9 && (
          <div className="space-y-8">
            {/* Final Care Plan Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Steps 9 – 13: Patient Completion & Fulfillment
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">AIRO Final Care Plan & Prescription</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Documented in patient record: Treatment, medications, lifestyle guidance, and ongoing care.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Care plan PDF exported to AIRO Patient App.")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                </div>
              </div>

              {/* Care Plan Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Physician Notes */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-emerald-700">Clinical Summary</p>
                    <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                      {patientRecord.carePlan?.summary || clinicalAssessmentNotes}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-emerald-200/50">
                      Authorized by: {patientRecord.carePlan?.issuedBy || clinicianName}
                    </p>
                  </div>

                  {/* Prescribed Medications (Step 10) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-emerald-600" />
                      Step 10: AIRO Pharmacy Prescription / Compounding
                    </h4>
                    <div className="space-y-2">
                      {patientRecord.carePlan?.medications.map((med, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{med.name} ({med.dosage})</p>
                            <p className="text-xs text-slate-500">{med.frequency} • Duration: {med.duration}</p>
                            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{med.instructions}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">
                            Rx: PRN-{9900 + idx}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lifestyle & Guidance */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Lifestyle Guidance & Habits
                    </h4>
                    <ul className="space-y-2">
                      {patientRecord.carePlan?.lifestyleGuidance.map((guide, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{guide}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Side: Step 11, 12, 13 details */}
                <div className="space-y-5">
                  {/* Step 11 Fulfillment */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-600" />
                      Step 11: Medication Fulfillment
                    </h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCarePlanFulfillment("HOME_DELIVERY")}
                        className={`flex-1 p-3 rounded-xl border text-xs font-bold text-center ${
                          carePlanFulfillment === "HOME_DELIVERY"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        🚚 Home Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarePlanFulfillment("STORE_PICKUP")}
                        className={`flex-1 p-3 rounded-xl border text-xs font-bold text-center ${
                          carePlanFulfillment === "STORE_PICKUP"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        🏪 Store Pickup
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {carePlanFulfillment === "HOME_DELIVERY" 
                        ? "Delivery to Indiranagar within 2 hours via AIRO Express."
                        : "Ready for pickup at AIRO Indiranagar Pharmacy counter."}
                    </p>
                  </div>

                  {/* Step 12 Follow-Up */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      Step 12: Next Follow-Up
                    </h4>
                    <p className="text-sm font-bold text-slate-900">
                      {patientRecord.carePlan?.followUpDate}
                    </p>
                    <p className="text-xs text-slate-500">
                      Next check-in scheduled in {patientRecord.carePlan?.followUpWeeks || 8} weeks. Automated SMS & App reminder queued.
                    </p>
                  </div>

                  {/* Step 13 Patient App Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Step 13: AIRO / Praana App
                    </h4>
                    <p className="text-xs text-slate-300">
                      Patient can access all reports, vitals trends, prescriptions, and order refills directly in the mobile app.
                    </p>
                    <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-300">ID: {patientRecord.patientId}</span>
                      <span className="text-[11px] text-white font-bold">App Sync: Active ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(8)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Modify Clinical Review
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert("Patient journey completed successfully! New patient record saved.");
                    setActiveStep(1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Start New Patient Journey
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
