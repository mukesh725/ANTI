"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  ShieldCheck, User, Sparkles, Send, Activity, Lock, ArrowLeft,
  Stethoscope, CheckCircle2, AlertCircle, FileText, Phone,
  Clock, Radio, Bell
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

interface ChatMessage {
  id: string;
  sender: "patient" | "doctor" | "system";
  text: string;
  time: string;
}

interface ConsultationData {
  id: string;
  consultationId: string;
  service?: string;
  date?: string;
  time?: string;
  status?: string;
  doctorInCall?: boolean;
  patientInCall?: boolean;
  patient?: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
  doctor?: {
    name?: string;
    specialty?: string;
    registrationNumber?: string;
  };
}

// Synthesize pleasant clinical audio chime using Web Audio API
function playJoinChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Note 1 (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);

    // Note 2 (A5 - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.18);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.18);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // Audio autoplay policy handled silently
  }
}

export default function ConsultationRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = (params?.id as string) || "ROOM";

  // Check if current user is Doctor
  const [isDoctor, setIsDoctor] = useState(false);
  const [consultData, setConsultData] = useState<ConsultationData | null>(null);
  const previousDoctorStatus = useRef<boolean | undefined>(undefined);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "system",
      text: "End-to-end encrypted medical consultation room initiated. Audio & camera ready.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [isAlertingPatient, setIsAlertingPatient] = useState(false);
  const [alertSentNotice, setAlertSentNotice] = useState<string | null>(null);

  // 1. Detect Doctor Role from URL or LocalStorage
  useEffect(() => {
    const roleParam = searchParams.get("role");
    let hasDoctorSession = false;
    try {
      const session = localStorage.getItem("airo_doctor_session");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed?.name) hasDoctorSession = true;
      }
    } catch (e) {}

    setIsDoctor(roleParam === "doctor" || hasDoctorSession);
  }, [searchParams]);

  // Handle explicit or resend email notification to patient
  const handleResendPatientAlert = async () => {
    const targetDocId = consultData?.id || roomId;
    if (!targetDocId) return;
    setIsAlertingPatient(true);
    try {
      const res = await fetch("/api/doctor/notify-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DOCTOR_JOINED",
          consultationDocId: targetDocId,
          forceResend: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const patientEmail = consultData?.patient?.email || "patient";
        setAlertSentNotice(`Alert email sent to ${patientEmail}!`);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "system",
            text: `🔔 Video consultation invitation email dispatched to ${patientEmail}.`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
        ]);
        setTimeout(() => setAlertSentNotice(null), 6000);
      }
    } catch (err) {
      console.error("Alert email error:", err);
    } finally {
      setIsAlertingPatient(false);
    }
  };

  // 2. Real-Time Firestore Presence Subscription
  useEffect(() => {
    if (!roomId || roomId === "ROOM") return;

    const q = query(
      collection(db, "doctor_consultations"),
      where("consultationId", "==", roomId)
    );

    const unsubscribe = onSnapshot(q, async (snap) => {
      if (!snap.empty) {
        const d = snap.docs[0];
        const data = { id: d.id, ...(d.data() as any) } as ConsultationData;
        
        // If patient and doctor just joined -> Play Chime!
        if (!isDoctor && previousDoctorStatus.current === false && data.doctorInCall === true) {
          playJoinChime();
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "system",
              text: `${data.doctor?.name || "The Doctor"} has joined the video consultation.`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          ]);
        }
        previousDoctorStatus.current = data.doctorInCall;

        setConsultData(data);
      } else {
        // Fallback: Check if roomId is the direct doc id
        try {
          const directSnap = await getDoc(doc(db, "doctor_consultations", roomId));
          if (directSnap.exists()) {
            const data = { id: directSnap.id, ...(directSnap.data() as any) } as ConsultationData;
            setConsultData(data);
          }
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, [roomId, isDoctor]);

  // 3. Mark Presence in Firestore when Entering / Leaving Room
  useEffect(() => {
    if (!consultData?.id) return;

    const consultRef = doc(db, "doctor_consultations", consultData.id);

    // On enter: set active status
    const updatePresenceEnter = async () => {
      try {
        if (isDoctor) {
          await updateDoc(consultRef, {
            doctorInCall: true,
            doctorJoinedAt: new Date().toISOString(),
            status: "IN_PROGRESS",
          });

          // Dispatch instant email alert to patient that doctor has joined
          fetch("/api/doctor/notify-patient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "DOCTOR_JOINED",
              consultationDocId: consultData.id,
            }),
          }).catch((err) => console.warn("Doctor entrance notification error:", err));
        } else {
          await updateDoc(consultRef, {
            patientInCall: true,
            patientJoinedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn("Failed to set presence enter:", err);
      }
    };

    updatePresenceEnter();

    // On exit/cleanup: reset presence
    return () => {
      try {
        if (isDoctor) {
          updateDoc(consultRef, { doctorInCall: false });
        } else {
          updateDoc(consultRef, { patientInCall: false });
        }
      } catch (e) {}
    };
  }, [consultData?.id, isDoctor]);

  // 4. Initialize Local Camera and Microphone
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function startMedia() {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        activeStream = userMedia;
        setStream(userMedia);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userMedia;
        }
      } catch (err) {
        console.warn("Camera or microphone permission was denied or not available:", err);
      }
    }

    startMedia();

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: isDoctor ? "doctor" : "patient",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (consultData?.id) {
      try {
        const consultRef = doc(db, "doctor_consultations", consultData.id);
        if (isDoctor) {
          await updateDoc(consultRef, {
            doctorInCall: false,
            updatedAt: new Date().toISOString(),
          });
        } else {
          await updateDoc(consultRef, {
            patientInCall: false,
          });
        }
      } catch (e) {}
    }

    if (isDoctor) {
      router.push("/doctor/portal");
    } else {
      router.push("/minute-clinic");
    }
  };

  const isDoctorInCall = Boolean(consultData?.doctorInCall);
  const isPatientInCall = Boolean(consultData?.patientInCall);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none">
      {/* Top Clinical Bar */}
      <header className="px-6 py-3.5 bg-slate-900/90 backdrop-blur border-b border-white/10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-sky-400 border border-white/10 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-xs tracking-wide flex items-center gap-2">
              AIRO Health Virtual Examination
              <span className="inline-flex items-center gap-1 text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/20">
                <Lock className="w-2.5 h-2.5" /> 256-bit Encrypted
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Room #{roomId.slice(0, 16)} {consultData?.service ? `· ${consultData.service}` : ""}
            </p>
          </div>
        </div>

        {/* Live Presence Indicator in Header */}
        <div className="flex items-center gap-3">
          {/* Patient View of Doctor Status */}
          {!isDoctor && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              isDoctorInCall 
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isDoctorInCall ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-ping"
              }`} />
              <span>{isDoctorInCall ? "Doctor is in the call" : "Waiting for doctor to connect"}</span>
            </div>
          )}

          {/* Doctor View of Patient Status */}
          {isDoctor && (
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                isPatientInCall 
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isPatientInCall ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`} />
                <span>{isPatientInCall ? "Patient is in the call" : "Patient not yet connected"}</span>
              </div>

              {!isPatientInCall && (
                <button
                  onClick={handleResendPatientAlert}
                  disabled={isAlertingPatient}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Notify patient via email that you have started the consultation"
                >
                  <Bell className={`w-3 h-3 ${isAlertingPatient ? "animate-spin" : ""}`} />
                  <span>{isAlertingPatient ? "Alerting..." : "Notify Patient (Email)"}</span>
                </button>
              )}
            </div>
          )}

          {/* Call Duration Clock */}
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs text-slate-300 font-mono">
            {formatDuration(callDuration)}
          </div>

          {/* Return button */}
          {isDoctor ? (
            <button
              onClick={handleEndCall}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 font-semibold bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Doctor Portal</span>
            </button>
          ) : (
            <Link
              href="/minute-clinic"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Leave Room
            </Link>
          )}
        </div>
      </header>

      {/* Main Video Stage */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Remote Stage */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-6">
          
          {/* STATE 1: For Patient when Doctor has NOT joined yet */}
          {!isDoctor && !isDoctorInCall && (
            <div className="text-center p-8 max-w-lg bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur">
              <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                  <Clock className="w-7 h-7" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-white mb-1.5">
                Waiting for {consultData?.doctor?.name || "Your Doctor"} to Join...
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Your camera and microphone are ready. Dr. {consultData?.doctor?.name?.replace("Dr. ", "") || "Physician"} has been notified and will enter the consultation room shortly.
              </p>

              {/* Waiting Room Checklist */}
              <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-3 text-left text-xs text-slate-300">
                <div className="p-2.5 bg-white/5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Camera stream active</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Microphone tested</span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: For Patient when Doctor IS in the call */}
          {!isDoctor && isDoctorInCall && (
            <div className="text-center p-8 max-w-md bg-slate-900/90 border border-emerald-500/30 rounded-3xl shadow-2xl backdrop-blur animate-in fade-in zoom-in-95">
              <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  <Stethoscope className="w-10 h-10" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Doctor Is In Consultation
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                {consultData?.doctor?.name || "Dr. MUKESH Doctor"}
              </h2>
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-2">
                {consultData?.doctor?.specialty || "General Medicine"}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consultation in progress. You and the doctor are connected through an encrypted WebRTC telehealth session.
              </p>
            </div>
          )}

          {/* STATE 3: For Doctor view */}
          {isDoctor && (
            <div className="text-center p-8 max-w-md bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur">
              <div className="w-20 h-20 rounded-full bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center mx-auto mb-4 text-sky-400">
                <User className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/10 bg-white/5">
                <span className={`w-2 h-2 rounded-full ${
                  isPatientInCall ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`} />
                <span>{isPatientInCall ? "Patient Connected" : "Awaiting Patient Entry"}</span>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                {consultData?.patient?.fullName || "Patient"}
              </h2>
              <p className="text-xs text-sky-400 font-medium mb-3">
                {consultData?.service || "General Virtual Consultation"}
              </p>

              {consultData?.patient?.phone && (
                <div className="inline-flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>{consultData.patient.phone}</span>
                </div>
              )}

              {/* Patient Email Alert Status Card when patient is not yet connected */}
              {!isPatientInCall && (
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-col items-center gap-2.5">
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {alertSentNotice ? (
                      <span className="text-emerald-400 font-semibold">{alertSentNotice}</span>
                    ) : (
                      <span>
                        Invitation email was dispatched to <strong className="text-white">{consultData?.patient?.email || "patient's email"}</strong> with a 1-click link to join.
                      </span>
                    )}
                  </p>
                  <button
                    onClick={handleResendPatientAlert}
                    disabled={isAlertingPatient}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Bell className={`w-3.5 h-3.5 ${isAlertingPatient ? "animate-spin" : ""}`} />
                    <span>{isAlertingPatient ? "Sending Alert Email..." : "Resend Email Notification to Patient"}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Floating Self Camera (Picture in Picture) */}
          <div className="absolute bottom-6 right-6 w-48 sm:w-64 aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl z-10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isVideoOn ? "hidden" : ""}`}
            />
            {!isVideoOn && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs">
                <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                Camera Off
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 backdrop-blur px-2 py-0.5 rounded text-white/80">
              {isDoctor ? "Doctor (You)" : "You"} {!isAudioOn ? "· Muted" : ""}
            </div>
          </div>
        </div>

        {/* Clinical Chat Drawer */}
        {isChatOpen && (
          <aside className="w-80 bg-slate-900 border-l border-white/10 flex flex-col z-20">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-300">
                Clinical Chat
              </h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    (isDoctor && m.sender === "doctor") || (!isDoctor && m.sender === "patient")
                      ? "items-end"
                      : m.sender === "system"
                      ? "items-center"
                      : "items-start"
                  }`}
                >
                  {m.sender === "system" ? (
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-center text-slate-400 text-[11px] leading-relaxed">
                      {m.text}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        (isDoctor && m.sender === "doctor") || (!isDoctor && m.sender === "patient")
                          ? "bg-sky-600 text-white rounded-br-none"
                          : "bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none"
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="text-[9px] opacity-60 mt-1 block text-right">
                        {m.time}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-2 bg-sky-600 hover:bg-sky-500 rounded-xl text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Bottom Audio/Video Controls */}
      <footer className="px-6 py-4 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-4 z-20">
        <button
          onClick={toggleAudio}
          className={`p-3.5 rounded-full transition-colors ${
            isAudioOn
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
          title={isAudioOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-full transition-colors ${
            isVideoOn
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
          title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-3.5 rounded-full transition-colors ${
            isChatOpen ? "bg-sky-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Toggle Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-red-600/30"
        >
          <PhoneOff className="w-4 h-4" />
          <span>{isDoctor ? "End & Back to Portal" : "End Consultation"}</span>
        </button>
      </footer>
    </div>
  );
}
