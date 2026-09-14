"use client";

import { useState, useEffect } from "react";
import { 
  Stethoscope, Video, User, Phone, Mail, Clock, Calendar, 
  CheckCircle2, AlertCircle, FileText, ChevronRight, Search, 
  Sparkles, Lock, ShieldCheck, RefreshCw, Send, Activity, X
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

interface Consultation {
  id: string;
  consultationId: string;
  bookingId?: string;
  service: string;
  date: string;
  time: string;
  meetingLink: string;
  status: "AWAITING_DOCTOR" | "IN_PROGRESS" | "COMPLETED" | string;
  clinicalNotes?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: string;
  patient: {
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    dob?: string;
    legalSex?: string;
  };
  doctor: {
    id: string | number;
    name: string;
    specialty?: string;
  };
}

const DOCTOR_PROFILES = [
  { id: "21", name: "Dr. MUKESH Doctor", specialty: "General Medicine", degree: "MD general medicine", reg: "465862" },
  { id: "20", name: "Dr. Gutta Sahan", specialty: "General Medicine", degree: "MD general medicine", reg: "TSMC 20642" },
  { id: "19", name: "Dr. DR LENIN REDDY", specialty: "General Medicine", degree: "MD general medicine", reg: "53018" },
  { id: "17", name: "Dr Lokendra K Thakur", specialty: "Internal Medicine", degree: "MD", reg: "87974" },
  { id: "4", name: "Dr. Naveen Mishra", specialty: "Obesity Medicine", degree: "MBBS, MD", reg: "MCI-DL-2010-77881" },
  { id: "13", name: "Dr. Pooja Menon", specialty: "Trichology & Hair Restoration", degree: "MBBS, MD", reg: "MCI-MP-2011-77881" },
  { id: "all", name: "All Physicians (Clinic View)", specialty: "Full Telemedicine Hub", degree: "All Registered Specialists", reg: "All" },
];

export default function DoctorPortalPage() {
  const [activeDoctorId, setActiveDoctorId] = useState<string>("21");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "AWAITING_DOCTOR" | "IN_PROGRESS" | "COMPLETED">("all");
  const [selectedCase, setSelectedCase] = useState<Consultation | null>(null);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [prescriptionInput, setPrescriptionInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [newAlert, setNewAlert] = useState<string | null>(null);

  const currentDoctor = DOCTOR_PROFILES.find(d => d.id === activeDoctorId) || DOCTOR_PROFILES[0];

  // Subscribe to real-time Firestore doctor_consultations
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "doctor_consultations"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Consultation[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });

      // Check if a new consultation arrived
      if (consultations.length > 0 && items.length > consultations.length) {
        const newest = items[0];
        setNewAlert(`New patient appointment booked: ${newest.patient?.fullName || "Patient"} for ${newest.service}`);
        setTimeout(() => setNewAlert(null), 8000);
      }

      setConsultations(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter consultations by selected doctor and search query
  const filteredConsultations = consultations.filter((c) => {
    // Doctor filter
    if (activeDoctorId !== "all") {
      const matchId = String(c.doctor?.id) === String(activeDoctorId);
      const matchName = c.doctor?.name?.toLowerCase().includes(currentDoctor.name.toLowerCase().replace("dr. ", ""));
      if (!matchId && !matchName) return false;
    }

    // Status filter
    if (statusFilter !== "all" && c.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      const patientName = c.patient?.fullName?.toLowerCase() || "";
      const phone = c.patient?.phone || "";
      const email = c.patient?.email?.toLowerCase() || "";
      const consultId = c.consultationId?.toLowerCase() || "";
      const service = c.service?.toLowerCase() || "";

      return (
        patientName.includes(queryLower) ||
        phone.includes(queryLower) ||
        email.includes(queryLower) ||
        consultId.includes(queryLower) ||
        service.includes(queryLower)
      );
    }

    return true;
  });

  const handleOpenCase = (consult: Consultation) => {
    setSelectedCase(consult);
    setDiagnosisInput(consult.diagnosis || consult.service || "");
    setNotesInput(consult.clinicalNotes || "");
    setPrescriptionInput(consult.prescription || "");
  };

  const handleSaveClinicalNotes = async (newStatus?: string) => {
    if (!selectedCase) return;
    setIsUpdating(true);

    try {
      const ref = doc(db, "doctor_consultations", selectedCase.id);
      const updateData: any = {
        diagnosis: diagnosisInput.trim(),
        clinicalNotes: notesInput.trim(),
        prescription: prescriptionInput.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (newStatus) {
        updateData.status = newStatus;
      }

      await updateDoc(ref, updateData);

      setSelectedCase(prev => prev ? { ...prev, ...updateData } : null);
    } catch (err) {
      console.error("Error saving clinical notes:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const awaitingCount = consultations.filter(c => 
    (activeDoctorId === "all" || String(c.doctor?.id) === String(activeDoctorId)) &&
    (c.status === "AWAITING_DOCTOR" || !c.status)
  ).length;

  const inProgressCount = consultations.filter(c => 
    (activeDoctorId === "all" || String(c.doctor?.id) === String(activeDoctorId)) &&
    c.status === "IN_PROGRESS"
  ).length;

  const completedCount = consultations.filter(c => 
    (activeDoctorId === "all" || String(c.doctor?.id) === String(activeDoctorId)) &&
    c.status === "COMPLETED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Real-time Notification Banner */}
      {newAlert && (
        <div className="bg-emerald-600 text-white px-6 py-3 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-bounce sticky top-0 z-50">
          <Sparkles className="w-4 h-4" />
          <span>{newAlert}</span>
          <button onClick={() => setNewAlert(null)} className="ml-4 opacity-80 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white">AIRO Physician Consultation Hub</h1>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">Minute Clinic & Telemedicine Patient Review Queue</p>
            </div>
          </div>

          {/* Doctor Switcher */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{currentDoctor.name}</p>
              <p className="text-[11px] text-slate-400">{currentDoctor.specialty} &bull; Reg: {currentDoctor.reg}</p>
            </div>

            <select
              value={activeDoctorId}
              onChange={(e) => setActiveDoctorId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-medium"
            >
              {DOCTOR_PROFILES.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400 uppercase font-semibold">Awaiting Review</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-2xl font-bold text-amber-400">{awaitingCount}</p>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Requires Attention</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400 uppercase font-semibold">In Progress</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-2xl font-bold text-cyan-400">{inProgressCount}</p>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">In Call</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400 uppercase font-semibold">Completed</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Done</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Intake</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-2xl font-bold text-white">{consultations.length}</p>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">All Time</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === "all" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All ({consultations.length})
            </button>
            <button
              onClick={() => setStatusFilter("AWAITING_DOCTOR")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === "AWAITING_DOCTOR" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Awaiting ({awaitingCount})
            </button>
            <button
              onClick={() => setStatusFilter("IN_PROGRESS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === "IN_PROGRESS" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === "COMPLETED" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, phone, ID..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Consultation List */}
        {loading ? (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-3" />
            <p className="text-sm text-slate-400">Loading live consultation queue...</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-1">No Consultations Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              There are currently no appointments matching this doctor or filter. When a patient books an appointment via Minute Clinic, it will appear here immediately in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConsultations.map((consult) => (
              <div
                key={consult.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    {consult.patient?.fullName?.slice(0, 2).toUpperCase() || "PT"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-base text-white">{consult.patient?.fullName || "Patient"}</h3>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                        #{consult.consultationId?.slice(0, 14)}
                      </span>
                      {consult.status === "COMPLETED" ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                          Completed
                        </span>
                      ) : consult.status === "IN_PROGRESS" ? (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-semibold">
                          In Progress
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                          Awaiting Review
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-cyan-400 font-medium mb-1">
                      Service: {consult.service}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {consult.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {consult.time}
                      </span>
                      {consult.patient?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          {consult.patient.phone}
                        </span>
                      )}
                      {consult.patient?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {consult.patient.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleOpenCase(consult)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Review & Notes
                  </button>

                  <Link
                    href={consult.meetingLink || `/consultations/room/${consult.consultationId}`}
                    target="_blank"
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                  >
                    <Video className="w-4 h-4" />
                    Join Video Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Clinical Notes & Case Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="font-bold text-lg text-white">
                  Clinical Case: {selectedCase.patient?.fullName}
                </h2>
                <p className="text-xs text-slate-400">
                  Reference: #{selectedCase.consultationId} &bull; {selectedCase.date} at {selectedCase.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {/* Patient Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <p className="text-slate-500">Gender</p>
                  <p className="font-semibold text-slate-300">{selectedCase.patient?.legalSex || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-slate-500">DOB</p>
                  <p className="font-semibold text-slate-300">{selectedCase.patient?.dob || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-300">{selectedCase.patient?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Service</p>
                  <p className="font-semibold text-cyan-400">{selectedCase.service}</p>
                </div>
              </div>

              {/* Diagnosis Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Clinical Diagnosis
                </label>
                <input
                  type="text"
                  value={diagnosisInput}
                  onChange={(e) => setDiagnosisInput(e.target.value)}
                  placeholder="e.g. Acute Upper Respiratory Infection / Viral Rhinitis"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Clinical Notes Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Physician Examination Notes & Advice
                </label>
                <textarea
                  rows={4}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Document patient symptoms, severity, and clinical examination findings..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* E-Prescription Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-Prescription & Treatment Plan
                </label>
                <textarea
                  rows={3}
                  value={prescriptionInput}
                  onChange={(e) => setPrescriptionInput(e.target.value)}
                  placeholder="e.g. 1. Paracetamol 650mg TDS x 3 days&#10;2. Cetirizine 10mg OD HS x 5 days&#10;3. Warm saline gargles"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-slate-800 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href={selectedCase.meetingLink || `/consultations/room/${selectedCase.consultationId}`}
                target="_blank"
                className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-cyan-500/30"
              >
                <Video className="w-4 h-4" />
                Open Live Video Room
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleSaveClinicalNotes("IN_PROGRESS")}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => {
                    handleSaveClinicalNotes("COMPLETED");
                    setTimeout(() => setSelectedCase(null), 500);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
