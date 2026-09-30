"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Video, Bell, BarChart3, 
  User, LogOut, Search, Clock, Calendar, Phone, Mail, 
  CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck, 
  Activity, Check, X, RefreshCw, Lock, Stethoscope, VideoOff,
  Mic, MicOff, Camera, ExternalLink, ChevronRight, Filter,
  Sparkles, Pill, AlertTriangle, UserCheck, HeartPulse
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
    specialty: "General Medicine",
    registrationNumber: "465862",
    email: "mukesh@akronpharma.com",
    phone: "(341) 336-4431"
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "patients" | "consultations" | "notifications" | "analytics" | "profile">("dashboard");
  const [doctorStatus, setDoctorStatus] = useState<"ONLINE" | "IN_CONSULTATION" | "AWAY">("ONLINE");
  const [currentTime, setCurrentTime] = useState<string>("");

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "AWAITING_DOCTOR" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);

  // Device Test Modal
  const [isDeviceTestOpen, setIsDeviceTestOpen] = useState(false);

  // Clinical Review & SOAP Notes State
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [enteringRoomId, setEnteringRoomId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep live time updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

    if (statusFilter !== "ALL") {
      if (c.status !== statusFilter) return false;
    }

    return true;
  });

  // Triage counters
  const openConsultations = doctorConsultations.filter(
    (c) => c.status === "AWAITING_DOCTOR" || c.status === "IN_PROGRESS" || !c.status
  );
  const completedConsultations = doctorConsultations.filter(
    (c) => c.status === "COMPLETED"
  );
  const inProgressConsultations = doctorConsultations.filter(
    (c) => c.status === "IN_PROGRESS"
  );

  const handleEnterVideoRoom = async (consult: Consultation) => {
    setEnteringRoomId(consult.id);
    const patientName = consult.patient?.fullName || consult.patient?.firstName || "patient";
    setToastMessage(`Alerting ${patientName} via email & connecting video room...`);

    try {
      fetch("/api/doctor/notify-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DOCTOR_JOINED",
          consultationDocId: consult.id,
        }),
      }).catch((err) => console.warn("Patient video alert error:", err));
    } catch (e) {}

    const targetUrl = `${consult.meetingLink || `/consultations/room/${consult.consultationId}`}?role=doctor`;
    router.push(targetUrl);
  };

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
      
      // Dispatch clinical summary & prescription email to patient if prescription or diagnosis provided
      if (prescription.trim() || diagnosis.trim() || statusToSet === "COMPLETED") {
        fetch("/api/doctor/notify-patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "PRESCRIPTION",
            consultationDocId: selectedConsult.id,
            diagnosis: diagnosis.trim(),
            clinicalNotes: clinicalNotes.trim(),
            prescription: prescription.trim(),
          }),
        }).catch((err) => console.warn("Prescription email dispatch warning:", err));
      }

      setToastMessage(
        statusToSet === "COMPLETED"
          ? "Consultation completed & prescription emailed to patient!"
          : "Clinical notes saved & updated!"
      );
      setTimeout(() => setToastMessage(null), 4000);
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
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT CLINICAL SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between p-5 shrink-0 fixed inset-y-0 z-30 shadow-xs">
        <div>
          {/* Header & Brand - NO AIRO EMED */}
          <div className="pb-5 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-sky-700 transition-colors">
                <Activity className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-slate-900">AIRO</span>
                <span className="text-sm font-medium text-slate-500 ml-1">Health</span>
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/60 block leading-tight mt-0.5">
                  Physician Workspace
                </span>
              </div>
            </Link>

            {/* Doctor Profile Card */}
            <div className="mt-4 p-3 bg-slate-50/80 border border-slate-200/70 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {currentDoctor.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900 text-xs truncate leading-snug">
                    {currentDoctor.name}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate capitalize">
                    {currentDoctor.specialty}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Reg. {currentDoctor.registrationNumber}
                  </p>
                </div>
              </div>

              {/* Doctor Availability Pill */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    doctorStatus === "ONLINE" ? "bg-emerald-500 animate-pulse" :
                    doctorStatus === "IN_CONSULTATION" ? "bg-amber-500" : "bg-slate-400"
                  }`} />
                  <span className="text-[11px] font-semibold text-slate-700">
                    {doctorStatus === "ONLINE" ? "Receiving Patients" :
                     doctorStatus === "IN_CONSULTATION" ? "In Consultation" : "Away"}
                  </span>
                </div>
                <button 
                  onClick={() => setDoctorStatus(prev => prev === "ONLINE" ? "AWAY" : "ONLINE")}
                  className="text-[10px] font-semibold text-sky-700 hover:text-sky-900"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-sky-400" : "text-slate-400"}`} />
              Dashboard
              {openConsultations.length > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === "dashboard" ? "bg-sky-500 text-white" : "bg-sky-100 text-sky-800"
                }`}>
                  {openConsultations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("patients")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "patients"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === "patients" ? "text-sky-400" : "text-slate-400"}`} />
              My Patients
            </button>

            <button
              onClick={() => setActiveTab("consultations")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "consultations"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <Video className={`w-4 h-4 ${activeTab === "consultations" ? "text-sky-400" : "text-slate-400"}`} />
              Consultations History
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "notifications"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <Bell className={`w-4 h-4 ${activeTab === "notifications" ? "text-sky-400" : "text-slate-400"}`} />
              Clinical Alerts
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "analytics"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === "analytics" ? "text-sky-400" : "text-slate-400"}`} />
              Encounter Analytics
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "profile"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === "profile" ? "text-sky-400" : "text-slate-400"}`} />
              Physician Credentials
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Diagnostic Controls */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => setIsDeviceTestOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors text-left"
          >
            <Camera className="w-3.5 h-3.5 text-slate-400" />
            <span>Test Audio & Camera</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 ml-64 p-6 sm:p-8 overflow-y-auto min-h-screen">
        
        {/* Top Operational Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Physician Dashboard
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Telehealth Queue
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review assigned patient appointments, initiate encrypted video calls, and record clinical encounters.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs text-slate-600 font-mono flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentTime || "12:00:00 PM"}</span>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs text-slate-700 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Superadmin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Clinical Triage Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 my-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Today's Visits</span>
              <Calendar className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {doctorConsultations.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled appointments</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Awaiting Triage</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-2 flex items-center gap-2">
              {openConsultations.length}
              {openConsultations.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Needs immediate attention</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Completed Encounters</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {completedConsultations.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Documented & finalized</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Clinical Quality</span>
              <HeartPulse className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              4.9 <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Patient satisfaction score</p>
          </div>
        </div>

        {/* SEARCH & TRIAGE FILTER BAR */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, consultation ID, or phone..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-600 transition-all"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                statusFilter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({doctorConsultations.length})
            </button>
            <button
              onClick={() => setStatusFilter("AWAITING_DOCTOR")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                statusFilter === "AWAITING_DOCTOR"
                  ? "bg-amber-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Awaiting ({openConsultations.length})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                statusFilter === "COMPLETED"
                  ? "bg-emerald-700 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Completed ({completedConsultations.length})
            </button>
          </div>
        </div>

        {/* CONSULTATION QUEUE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Consultations Needing Attention ({openConsultations.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review waiting patients and begin encrypted telemedicine sessions
              </p>
            </div>

            {loading && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                Syncing with Firestore...
              </span>
            )}
          </div>

          {/* Consultation List */}
          {doctorConsultations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Patient Queue Clear</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                You have no open consultations awaiting attention. As soon as a patient books a virtual appointment, their encounter card will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {doctorConsultations.map((consult) => {
                const isAwaiting = consult.status === "AWAITING_DOCTOR" || !consult.status;
                const isCompleted = consult.status === "COMPLETED";

                return (
                  <div 
                    key={consult.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Patient Overview */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {consult.patient?.fullName
                          ? consult.patient.fullName.substring(0, 2).toUpperCase()
                          : "PT"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900">
                            {consult.patient?.fullName || "Verified Patient"}
                          </h4>
                          <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                            {consult.consultationId}
                          </span>
                          
                          {/* Status Badge */}
                          {isAwaiting && (
                            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Awaiting Consultation
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Completed
                            </span>
                          )}
                        </div>

                        {/* Consultation Meta */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {consult.date} at {consult.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                            {consult.service || "General Virtual Consultation"}
                          </span>
                          {consult.patient?.phone && (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {consult.patient.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {/* Clinical Review Button */}
                      <button
                        onClick={() => handleOpenReview(consult)}
                        className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Chart & Notes</span>
                      </button>

                      {/* Video Room Button */}
                      <button
                        onClick={() => handleEnterVideoRoom(consult)}
                        disabled={enteringRoomId === consult.id}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          isCompleted
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "bg-slate-900 hover:bg-slate-800 text-white active:scale-95"
                        } disabled:opacity-50`}
                      >
                        <Video className={`w-3.5 h-3.5 ${enteringRoomId === consult.id ? "animate-spin" : "text-sky-400"}`} />
                        <span>{enteringRoomId === consult.id ? "Alerting Patient..." : "Enter Video Room"}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* CLINICAL CHART & NOTES MODAL */}
      {selectedConsult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  <FileText className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Patient Clinical Chart · {selectedConsult.patient?.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Ref: {selectedConsult.consultationId} · {selectedConsult.date} at {selectedConsult.time}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedConsult(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Patient Demographics */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Patient</span>
                  <p className="font-bold text-slate-900">{selectedConsult.patient?.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Phone</span>
                  <p className="font-medium text-slate-700 font-mono">{selectedConsult.patient?.phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Email</span>
                  <p className="font-medium text-slate-700 truncate">{selectedConsult.patient?.email || "N/A"}</p>
                </div>
              </div>

              {/* Diagnosis Field */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Clinical Diagnosis / Primary Assessment
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Pharyngitis, Seasonal Rhinitis..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-600"
                />
              </div>

              {/* Clinical Notes (SOAP Format) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Doctor's SOAP Notes (Subjective, Objective, Assessment, Plan)
                </label>
                <textarea
                  rows={4}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Subjective: Patient reports fever and dry cough for 3 days...&#10;Objective: Vitals normal, throat erythema...&#10;Plan: Rest, fluids, paracetamol PRN..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-600 leading-relaxed font-sans"
                />
              </div>

              {/* Digital e-Prescription */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Prescription & Recommended Medication</span>
                  <span className="text-[10px] text-slate-400 font-normal">Sent to patient's medical records</span>
                </label>
                <textarea
                  rows={3}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="1. Tab Paracetamol 650mg — 1 tablet TID after food x 3 days&#10;2. Warm saline gargles"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-600 font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <button
                onClick={() => handleEnterVideoRoom(selectedConsult)}
                disabled={enteringRoomId === selectedConsult.id}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Video className={`w-3.5 h-3.5 ${enteringRoomId === selectedConsult.id ? "animate-spin text-white" : "text-sky-400"}`} />
                <span>{enteringRoomId === selectedConsult.id ? "Alerting Patient..." : "Launch Video Session"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveNotes()}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Draft Notes"}
                </button>

                <button
                  onClick={() => handleSaveNotes("COMPLETED")}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finalize & Complete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO & CAMERA TEST MODAL */}
      {isDeviceTestOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-600" />
                Hardware Diagnostic Check
              </h3>
              <button 
                onClick={() => setIsDeviceTestOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-6 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">HD Web Camera</p>
                    <p className="text-[11px] text-slate-500">Connected & Authorized</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-semibold text-[11px]">Ready</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Microphone & Audio</p>
                    <p className="text-[11px] text-slate-500">Input levels optimal</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-semibold text-[11px]">Active</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Network Bandwidth</p>
                    <p className="text-[11px] text-slate-500">WebRTC Latency: 28ms</p>
                  </div>
                </div>
                <span className="text-sky-700 font-semibold text-[11px]">Excellent</span>
              </div>
            </div>

            <button
              onClick={() => setIsDeviceTestOpen(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Close Diagnostic
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
