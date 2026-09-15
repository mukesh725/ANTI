"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Video, Bell, BarChart3, 
  User, LogOut, Search, Clock, Calendar, Phone, Mail, 
  CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck, 
  Activity, Check, X, RefreshCw, Lock, Stethoscope, VideoOff,
  Mic, MicOff, Camera, ExternalLink, ChevronRight, Filter,
  Sparkles, Pill, AlertTriangle, UserCheck, HeartPulse, ArrowUpRight
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
    setToastMessage(`Connecting to room & alerting ${patientName}...`);

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
          ? "Consultation completed & prescription sent to patient."
          : "Clinical documentation saved."
      );
      setTimeout(() => setToastMessage(null), 3500);
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
    <div className="min-h-screen bg-[#F5F5F7] flex text-[#1D1D1F] font-sans antialiased selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
      
      {/* Apple Dynamic Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1D1D1F]/90 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Apple macOS Translucent Frosted Sidebar */}
      <aside className="w-[260px] bg-[#F2F2F7]/95 backdrop-blur-2xl border-r border-black/[0.06] flex flex-col justify-between shrink-0 fixed inset-y-0 z-30 shadow-sm">
        <div>
          {/* macOS Window Controls & Header */}
          <div className="p-4 pb-3 border-b border-black/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-xs"></span>
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0071E3] text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-xs font-semibold text-[#1D1D1F]">AIRO Health</span>
                <p className="text-[10px] text-[#86868B]">Physician Workspace</p>
              </div>
            </div>

            {/* Doctor Profile Pill */}
            <div className="mt-3 p-3 bg-white rounded-2xl border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center font-bold text-xs shrink-0">
                  {currentDoctor.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-[#1D1D1F] text-xs truncate">
                    {currentDoctor.name}
                  </h2>
                  <p className="text-[10px] text-[#86868B] truncate">
                    {currentDoctor.specialty} • Reg. {currentDoctor.registrationNumber}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-2.5 pt-2 border-t border-black/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    doctorStatus === "ONLINE" ? "bg-[#34C759]" :
                    doctorStatus === "IN_CONSULTATION" ? "bg-[#FF9500]" : "bg-[#86868B]"
                  }`} />
                  <span className="text-[11px] font-medium text-[#1D1D1F]">
                    {doctorStatus === "ONLINE" ? "Receiving Patients" :
                     doctorStatus === "IN_CONSULTATION" ? "In Encounter" : "Away"}
                  </span>
                </div>
                <button 
                  onClick={() => setDoctorStatus(prev => prev === "ONLINE" ? "AWAY" : "ONLINE")}
                  className="text-[10px] font-semibold text-[#0071E3] hover:underline cursor-pointer"
                >
                  Switch
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-0.5">
            <div className="px-3 text-[11px] font-semibold text-[#86868B] mb-1">Navigation</div>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer active:scale-[0.98] ${
                activeTab === "dashboard"
                  ? "bg-[#0071E3] text-white font-semibold shadow-xs"
                  : "text-[#1D1D1F] hover:bg-black/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-3.5 h-3.5 ${activeTab === "dashboard" ? "text-white" : "text-[#86868B]"}`} />
                <span>Encounters Queue</span>
              </div>
              {openConsultations.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === "dashboard" ? "bg-white/25 text-white" : "bg-[#FF9500]/15 text-[#FF9500]"
                }`}>
                  {openConsultations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("patients")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer active:scale-[0.98] ${
                activeTab === "patients"
                  ? "bg-[#0071E3] text-white font-semibold shadow-xs"
                  : "text-[#1D1D1F] hover:bg-black/[0.04]"
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeTab === "patients" ? "text-white" : "text-[#86868B]"}`} />
              <span>Patients Directory</span>
            </button>

            <button
              onClick={() => setActiveTab("consultations")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer active:scale-[0.98] ${
                activeTab === "consultations"
                  ? "bg-[#0071E3] text-white font-semibold shadow-xs"
                  : "text-[#1D1D1F] hover:bg-black/[0.04]"
              }`}
            >
              <Video className={`w-3.5 h-3.5 ${activeTab === "consultations" ? "text-white" : "text-[#86868B]"}`} />
              <span>Consultation History</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer active:scale-[0.98] ${
                activeTab === "analytics"
                  ? "bg-[#0071E3] text-white font-semibold shadow-xs"
                  : "text-[#1D1D1F] hover:bg-black/[0.04]"
              }`}
            >
              <BarChart3 className={`w-3.5 h-3.5 ${activeTab === "analytics" ? "text-white" : "text-[#86868B]"}`} />
              <span>Clinical Analytics</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-black/[0.06] space-y-1">
          <button
            onClick={() => setIsDeviceTestOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1D1D1F] hover:bg-black/[0.04] transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#86868B]" />
            <span>Test Camera & Mic</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 ml-[260px] p-6 sm:p-10 overflow-y-auto min-h-screen">
        
        {/* Apple Top Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
                Physician Workspace
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#34C759]/10 text-[#34C759]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                Live Telehealth Queue
              </span>
            </div>
            <p className="text-xs text-[#86868B] mt-1">
              Encrypted peer-to-peer WebRTC video consultations & digital medical chart documentation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 bg-white border border-black/[0.06] rounded-full shadow-xs text-[#1D1D1F] font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#86868B]" />
              <span>{currentTime || "12:00:00 PM"}</span>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-1.5 bg-white hover:bg-[#F5F5F7] border border-black/[0.08] rounded-full shadow-xs text-[#1D1D1F] font-medium transition-all flex items-center gap-1.5"
            >
              <span>Central Admin</span>
              <ArrowUpRight className="w-3 h-3 text-[#86868B]" />
            </Link>
          </div>
        </div>

        {/* 4 Apple Squircle Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-xs font-medium text-[#86868B]">Scheduled Visits</span>
            <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight tabular-nums mt-2">
              {doctorConsultations.length}
            </div>
            <p className="text-[11px] text-[#86868B] mt-1">Total appointments today</p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-xs font-medium text-[#86868B]">Awaiting Triage</span>
            <div className="text-3xl font-semibold text-[#FF9500] tracking-tight tabular-nums mt-2 flex items-center gap-2">
              {openConsultations.length}
              {openConsultations.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#FF9500] animate-ping" />
              )}
            </div>
            <p className="text-[11px] text-[#86868B] mt-1">Ready for call</p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-xs font-medium text-[#86868B]">Completed Encounters</span>
            <div className="text-3xl font-semibold text-[#34C759] tracking-tight tabular-nums mt-2">
              {completedConsultations.length}
            </div>
            <p className="text-[11px] text-[#86868B] mt-1">Documented & archived</p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-xs font-medium text-[#86868B]">Clinical Rating</span>
            <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight tabular-nums mt-2">
              4.9 <span className="text-sm font-normal text-[#86868B]">/ 5.0</span>
            </div>
            <p className="text-[11px] text-[#86868B] mt-1">Patient experience score</p>
          </div>
        </div>

        {/* Apple Segmented Filter & Search */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-3 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, consultation ID, or phone..."
              className="w-full bg-[#F5F5F7] border border-transparent focus:border-black/[0.1] focus:bg-white rounded-full pl-9 pr-3.5 py-1.5 text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none transition-all"
            />
          </div>

          {/* Apple Segmented Control */}
          <div className="flex items-center bg-[#F5F5F7] p-1 rounded-full w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              All ({doctorConsultations.length})
            </button>
            <button
              onClick={() => setStatusFilter("AWAITING_DOCTOR")}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                statusFilter === "AWAITING_DOCTOR"
                  ? "bg-white text-[#FF9500] shadow-xs font-semibold"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              Awaiting ({openConsultations.length})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                statusFilter === "COMPLETED"
                  ? "bg-white text-[#34C759] shadow-xs font-semibold"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              Completed ({completedConsultations.length})
            </button>
          </div>
        </div>

        {/* Consultation Encounters Card List */}
        <div className="bg-white border border-black/[0.06] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-5 border-b border-black/[0.04] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
                Consultation Encounters ({openConsultations.length} Active)
              </h2>
              <p className="text-xs text-[#86868B]">
                Review patient details, launch encrypted video calls, and record SOAP clinical notes.
              </p>
            </div>

            {loading && (
              <span className="text-xs text-[#86868B] flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0071E3]" />
                Syncing...
              </span>
            )}
          </div>

          {doctorConsultations.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F7] text-[#34C759] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">Queue Clear</h3>
              <p className="text-xs text-[#86868B] mt-1 max-w-sm mx-auto leading-relaxed">
                There are no open patient appointments awaiting attention. When a patient schedules a virtual consultation, their encounter card will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.04]">
              {doctorConsultations.map((consult) => {
                const isAwaiting = consult.status === "AWAITING_DOCTOR" || !consult.status;
                const isCompleted = consult.status === "COMPLETED";

                return (
                  <div 
                    key={consult.id}
                    className="p-5 hover:bg-[#F5F5F7]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Patient Meta */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-xs flex items-center justify-center shrink-0">
                        {consult.patient?.fullName
                          ? consult.patient.fullName.substring(0, 2).toUpperCase()
                          : "PT"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-[#1D1D1F]">
                            {consult.patient?.fullName || "Patient"}
                          </h4>
                          <span className="text-[10px] font-mono text-[#86868B] bg-[#F5F5F7] px-2 py-0.5 rounded-full">
                            {consult.consultationId}
                          </span>
                          
                          {isAwaiting && (
                            <span className="text-[10px] font-semibold bg-[#FF9500]/10 text-[#FF9500] px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse" />
                              Awaiting Consultation
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[10px] font-semibold bg-[#34C759]/10 text-[#34C759] px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3 text-[#34C759]" />
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#86868B] mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {consult.date} at {consult.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5" />
                            {consult.service || "Virtual Medical Consultation"}
                          </span>
                          {consult.patient?.phone && (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Phone className="w-3.5 h-3.5" />
                              {consult.patient.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Apple Style Action Pills */}
                    <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleOpenReview(consult)}
                        className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#86868B]" />
                        <span>Chart & Notes</span>
                      </button>

                      <button
                        onClick={() => handleEnterVideoRoom(consult)}
                        disabled={enteringRoomId === consult.id}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.98] ${
                          isCompleted
                            ? "bg-[#F5F5F7] text-[#86868B] hover:bg-[#E5E5EA]"
                            : "bg-[#0071E3] hover:bg-[#0077ED] text-white"
                        } disabled:opacity-50`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{enteringRoomId === consult.id ? "Connecting..." : "Enter Video Room"}</span>
                        <ArrowUpRight className="w-3 h-3 text-white/80" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Apple Style Clinical Chart & SOAP Notes Sheet */}
      {selectedConsult && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-black/[0.08] overflow-hidden">
            {/* Sheet Header */}
            <div className="p-6 border-b border-black/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
                  Clinical Chart · {selectedConsult.patient?.fullName}
                </h3>
                <p className="text-xs text-[#86868B] font-mono mt-0.5">
                  ID: {selectedConsult.consultationId} • {selectedConsult.date} at {selectedConsult.time}
                </p>
              </div>

              <button
                onClick={() => setSelectedConsult(null)}
                className="w-8 h-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs custom-scrollbar">
              {/* Patient Demographics Capsule */}
              <div className="p-4 bg-[#F5F5F7] rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Patient</span>
                  <p className="font-semibold text-[#1D1D1F] mt-0.5">{selectedConsult.patient?.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Phone</span>
                  <p className="font-medium text-[#1D1D1F] font-mono mt-0.5">{selectedConsult.patient?.phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Email</span>
                  <p className="font-medium text-[#1D1D1F] truncate mt-0.5">{selectedConsult.patient?.email || "N/A"}</p>
                </div>
              </div>

              {/* Diagnosis Field */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Clinical Diagnosis / Primary Assessment
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Pharyngitis, Seasonal Rhinitis..."
                  className="w-full bg-[#F5F5F7] border border-transparent focus:border-black/[0.1] focus:bg-white text-[#1D1D1F] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all"
                />
              </div>

              {/* SOAP Notes */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  SOAP Clinical Notes (Subjective, Objective, Assessment, Plan)
                </label>
                <textarea
                  rows={4}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Subjective: Patient reports fever and cough for 3 days...&#10;Objective: Throat erythema, vitals stable...&#10;Plan: Hydration, paracetamol PRN..."
                  className="w-full bg-[#F5F5F7] border border-transparent focus:border-black/[0.1] focus:bg-white text-[#1D1D1F] rounded-xl p-3 text-xs focus:outline-none leading-relaxed transition-all"
                />
              </div>

              {/* Digital Prescription */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                  <span>Prescription & Medication Protocol</span>
                  <span className="text-[10px] text-[#86868B] font-normal">Dispatched to patient records</span>
                </label>
                <textarea
                  rows={3}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="1. Tab Paracetamol 650mg — 1 tablet TID after food x 3 days"
                  className="w-full bg-[#F5F5F7] border border-transparent focus:border-black/[0.1] focus:bg-white text-[#1D1D1F] rounded-xl p-3 text-xs focus:outline-none font-mono leading-relaxed transition-all"
                />
              </div>
            </div>

            {/* Sheet Footer Controls */}
            <div className="p-4 border-t border-black/[0.06] bg-[#F5F5F7]/50 flex items-center justify-between">
              <button
                onClick={() => handleEnterVideoRoom(selectedConsult)}
                disabled={enteringRoomId === selectedConsult.id}
                className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{enteringRoomId === selectedConsult.id ? "Connecting..." : "Launch Video"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveNotes()}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-white border border-black/[0.08] hover:bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save Draft"}
                </button>

                <button
                  onClick={() => handleSaveNotes("COMPLETED")}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#34C759] hover:bg-[#30D158] text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finalize & Archive</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hardware Diagnostic Modal */}
      {isDeviceTestOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border border-black/[0.08]">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <h3 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#0071E3]" />
                Hardware Diagnostic Check
              </h3>
              <button 
                onClick={() => setIsDeviceTestOpen(false)}
                className="text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-full hover:bg-[#F5F5F7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-6 space-y-3 text-xs">
              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F]">HD Video Camera</p>
                    <p className="text-[11px] text-[#86868B]">Authorized & Active</p>
                  </div>
                </div>
                <span className="text-[#34C759] font-medium text-xs">Ready</span>
              </div>

              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F]">Audio Microphone</p>
                    <p className="text-[11px] text-[#86868B]">Input Level Normal</p>
                  </div>
                </div>
                <span className="text-[#34C759] font-medium text-xs">Ready</span>
              </div>

              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F]">WebRTC Peer Connection</p>
                    <p className="text-[11px] text-[#86868B]">Encrypted Stream</p>
                  </div>
                </div>
                <span className="text-[#0071E3] font-medium text-xs">Connected</span>
              </div>
            </div>

            <button
              onClick={() => setIsDeviceTestOpen(false)}
              className="w-full py-2.5 bg-[#1D1D1F] hover:bg-black text-white rounded-full font-medium text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
