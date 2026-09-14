"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Video, Bell, BarChart3, 
  User, LogOut, Search, Clock, Calendar, Phone, Mail, 
  CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck, 
  Sparkles, Stethoscope, Check, X, RefreshCw, Lock
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

export default function DoctorDashboardPage() {
  const router = useRouter();

  // Active Doctor Session
  const [currentDoctor, setCurrentDoctor] = useState({
    id: "doc_mukesh_21",
    doctorId: "21",
    name: "Dr. MUKESH Doctor",
    specialty: "general medicine",
    registrationNumber: "465862",
    email: "mukesh@akronpharma.com",
    phone: "(341) 336-4431"
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "patients" | "consultations" | "notifications" | "analytics" | "profile">("dashboard");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);

  // Clinical Review Modal State
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Load session from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("airo_doctor_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setCurrentDoctor(parsed);
        }
      }
    } catch (e) {}
  }, []);

  // Real-time Firestore subscription to doctor_consultations
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "doctor_consultations"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Consultation[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      setConsultations(items);
      setLoading(false);
    }, (err) => {
      console.error("Firestore real-time error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter consultations for the currently logged-in doctor
  const doctorConsultations = consultations.filter((c) => {
    const docMatch = 
      String(c.doctor?.id) === String(currentDoctor.doctorId) ||
      String(c.doctor?.id) === String(currentDoctor.id) ||
      c.doctor?.name?.toLowerCase().includes(currentDoctor.name.toLowerCase().replace("dr. ", ""));

    if (!docMatch) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = c.patient?.fullName?.toLowerCase() || "";
      const phone = c.patient?.phone || "";
      const email = c.patient?.email?.toLowerCase() || "";
      const id = c.consultationId?.toLowerCase() || "";
      return name.includes(q) || phone.includes(q) || email.includes(q) || id.includes(q);
    }

    return true;
  });

  // Consultations needing immediate attention (Awaiting Doctor or In Progress)
  const openConsultations = doctorConsultations.filter(
    (c) => c.status === "AWAITING_DOCTOR" || c.status === "IN_PROGRESS" || !c.status
  );

  const completedConsultations = doctorConsultations.filter(
    (c) => c.status === "COMPLETED"
  );

  const handleOpenReview = (c: Consultation) => {
    setSelectedConsult(c);
    setDiagnosis(c.diagnosis || c.service || "");
    setClinicalNotes(c.clinicalNotes || "");
    setPrescription(c.prescription || "");
  };

  const handleSaveNotes = async (statusToSet?: string) => {
    if (!selectedConsult) return;
    setIsUpdating(true);

    try {
      const consultRef = doc(db, "doctor_consultations", selectedConsult.id);
      const updateData: any = {
        diagnosis: diagnosis.trim(),
        clinicalNotes: clinicalNotes.trim(),
        prescription: prescription.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (statusToSet) {
        updateData.status = statusToSet;
      }

      await updateDoc(consultRef, updateData);
      setSelectedConsult(prev => prev ? { ...prev, ...updateData } : null);
    } catch (err) {
      console.error("Failed to save diagnosis:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("airo_doctor_session");
    router.push("/doctor/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans select-none">
      {/* LEFT SIDEBAR (EXACT LAYOUT FROM USER SCREENSHOT) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 shrink-0 fixed inset-y-0 z-30">
        <div>
          {/* Header & Doctor Identity */}
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
              AIRO<span className="text-teal-600 font-extrabold">eMed</span>
            </h1>
            <div className="mt-3">
              <h2 className="font-bold text-slate-900 text-sm">{currentDoctor.name}</h2>
              <p className="text-xs text-slate-500">{currentDoctor.specialty}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Reg. {currentDoctor.registrationNumber}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "dashboard"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-teal-600" : "text-slate-400"}`} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("patients")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "patients"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === "patients" ? "text-teal-600" : "text-slate-400"}`} />
              My Patients
            </button>

            <button
              onClick={() => setActiveTab("consultations")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "consultations"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Video className={`w-4 h-4 ${activeTab === "consultations" ? "text-teal-600" : "text-slate-400"}`} />
              Consultations
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "notifications"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bell className={`w-4 h-4 ${activeTab === "notifications" ? "text-teal-600" : "text-slate-400"}`} />
              Notifications
              {openConsultations.length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {openConsultations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "analytics"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === "analytics" ? "text-teal-600" : "text-slate-400"}`} />
              Analytics
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "profile"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === "profile" ? "text-teal-600" : "text-slate-400"}`} />
              My Profile
            </button>
          </nav>
        </div>

        {/* Bottom Log Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        {/* Top Breadcrumb & Notification Bell */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-slate-400 font-medium">
            &larr; <button onClick={() => setActiveTab("dashboard")} className="hover:text-slate-700">Back to Dashboard</button>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs relative">
              <Bell className="w-4 h-4" />
              {openConsultations.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* 1. DASHBOARD TAB (MATCHES USER SCREENSHOT) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
              <p className="text-xs text-slate-500 mt-0.5">Consultations requiring your attention</p>
            </div>

            {/* Search Input matching screenshot */}
            <div className="relative max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Patient name, patient ID, or consultation ID..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 shadow-2xs"
              />
            </div>

            {/* Consultations Needing Attention Card Box */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Consultations needing attention ({openConsultations.length})
                </h3>
                <p className="text-xs text-slate-500">Review consultations requiring your attention.</p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                    Checking for assigned patient consultations...
                  </div>
                ) : openConsultations.length === 0 ? (
                  /* "Nothing to show - No open consultations." matching screenshot */
                  <div className="py-16 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700 mb-1">Nothing to show</p>
                    <p className="text-xs text-slate-400">No open consultations.</p>
                  </div>
                ) : (
                  /* Active Consultation Cards */
                  <div className="space-y-4">
                    {openConsultations.map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-50/80 border border-slate-200 hover:border-teal-500/50 rounded-2xl p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                            {c.patient?.fullName?.slice(0, 2).toUpperCase() || "PT"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-bold text-sm text-slate-900">{c.patient?.fullName || "Patient"}</h4>
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                                #{c.consultationId?.slice(0, 14)}
                              </span>
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                                Awaiting Doctor
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-teal-700 mb-1">
                              Service: {c.service}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {c.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> {c.time}
                              </span>
                              {c.patient?.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.patient.phone}
                                </span>
                              )}
                              {c.patient?.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.patient.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleOpenReview(c)}
                            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition-colors flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            Review Case
                          </button>
                          <Link
                            href={c.meetingLink || `/consultations/room/${c.consultationId}`}
                            target="_blank"
                            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shadow-teal-600/20"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Join Video Room
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. CONSULTATIONS TAB */}
        {activeTab === "consultations" && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">All Consultations</h2>
              <p className="text-xs text-slate-500 mt-0.5">Full historical intake and completed patient files</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6 space-y-4">
              {doctorConsultations.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">No past consultations found.</div>
              ) : (
                <div className="space-y-3">
                  {doctorConsultations.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{c.patient?.fullName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            c.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{c.service} &bull; {c.date} at {c.time}</p>
                      </div>
                      <button
                        onClick={() => handleOpenReview(c)}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        View Details &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. MY PATIENTS TAB */}
        {activeTab === "patients" && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Patients</h2>
              <p className="text-xs text-slate-500 mt-0.5">Directory of patients evaluated under your license</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6">
              {doctorConsultations.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">No patient files registered yet.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {Array.from(new Set(doctorConsultations.map(c => c.patient?.phone))).map(phone => {
                    const patientCase = doctorConsultations.find(c => c.patient?.phone === phone);
                    if (!patientCase) return null;
                    return (
                      <div key={phone} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-slate-900">{patientCase.patient?.fullName}</p>
                          <p className="text-xs text-slate-500">{patientCase.patient?.phone} &bull; {patientCase.patient?.email}</p>
                        </div>
                        <span className="text-xs text-teal-700 font-medium">Verified Active Patient</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time alerts for case assignments and consultations</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6 space-y-3">
              {doctorConsultations.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">New consultation assigned to you</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      New appointment: {c.patient?.fullName} for {c.service} on {c.date} at {c.time} needs a consultation review. Open the case to start.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{c.createdAt?.slice(0, 19).replace('T', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Practice Analytics</h2>
              <p className="text-xs text-slate-500 mt-0.5">Telemedicine throughput and patient satisfaction metrics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Intakes</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{doctorConsultations.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400 font-semibold uppercase">Cases Completed</p>
                <p className="text-3xl font-extrabold text-teal-600 mt-2">{completedConsultations.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400 font-semibold uppercase">Patient Satisfaction</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-2">100%</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. MY PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Physician Credentials</h2>
              <p className="text-xs text-slate-500 mt-0.5">Registered medical credentials and contact info</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400">Full Name</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{currentDoctor.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Specialty</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{currentDoctor.specialty}</p>
                </div>
                <div>
                  <span className="text-slate-400">Registration Number</span>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{currentDoctor.registrationNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email</span>
                  <p className="font-medium text-slate-900 text-sm mt-0.5">{currentDoctor.email}</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Clinic Center</span>
                <p className="font-semibold text-slate-800">AIRO Health Hub &bull; Minute Clinic Telemedicine Division</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CASE REVIEW & DIAGNOSIS MODAL */}
      {selectedConsult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Case Review: {selectedConsult.patient?.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  #{selectedConsult.consultationId} &bull; {selectedConsult.date} at {selectedConsult.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedConsult(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400">Gender</span>
                  <p className="font-semibold text-slate-800">{selectedConsult.patient?.legalSex || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-slate-400">DOB</span>
                  <p className="font-semibold text-slate-800">{selectedConsult.patient?.dob || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-400">Phone</span>
                  <p className="font-semibold text-slate-800">{selectedConsult.patient?.phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-400">Service</span>
                  <p className="font-semibold text-teal-700">{selectedConsult.service}</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Rhinitis / Upper Respiratory Infection"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Examination Notes & Advice</label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Clinical observations, patient history, and recommendations..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-Prescription & Dosage</label>
                <textarea
                  rows={3}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="1. Tab Paracetamol 650mg TDS x 3 days&#10;2. Tab Cetirizine 10mg OD HS x 5 days"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                href={selectedConsult.meetingLink || `/consultations/room/${selectedConsult.consultationId}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs flex items-center gap-1.5"
              >
                <Video className="w-4 h-4 text-teal-600" />
                Open Live Video Room
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleSaveNotes("IN_PROGRESS")}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => {
                    handleSaveNotes("COMPLETED");
                    setTimeout(() => setSelectedConsult(null), 400);
                  }}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
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
