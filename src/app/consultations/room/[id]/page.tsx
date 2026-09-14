"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  ShieldCheck, User, Sparkles, Send, Activity, Lock, ArrowLeft,
  Stethoscope, CheckCircle2, AlertCircle, FileText
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

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

export default function ConsultationRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = (params?.id as string) || "ROOM";

  // Check if current user is Doctor
  const [isDoctor, setIsDoctor] = useState(false);
  const [consultData, setConsultData] = useState<ConsultationData | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "system",
      text: "End-to-end encrypted medical consultation room initiated. Camera and audio streams ready.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [callDuration, setCallDuration] = useState(0);

  // Detect Doctor Role from URL or LocalStorage
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

  // Fetch consultation details from Firestore
  useEffect(() => {
    async function fetchConsultation() {
      try {
        const q = query(
          collection(db, "doctor_consultations"),
          where("consultationId", "==", roomId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0];
          setConsultData({ id: d.id, ...(d.data() as any) });
        }
      } catch (err) {
        console.warn("Could not fetch consultation metadata:", err);
      }
    }

    if (roomId && roomId !== "ROOM") {
      fetchConsultation();
    }
  }, [roomId]);

  // Initialize camera and microphone
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
    // 1. Stop local hardware media tracks
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // 2. Mark consultation in progress if doctor
    if (consultData?.id && isDoctor) {
      try {
        const consultRef = doc(db, "doctor_consultations", consultData.id);
        await updateDoc(consultRef, {
          updatedAt: new Date().toISOString(),
          status: "IN_PROGRESS",
        });
      } catch (e) {}
    }

    // 3. Route user based on role
    if (isDoctor) {
      // Doctor MUST stay in their portal
      router.push("/doctor/portal");
    } else {
      // Patient goes back to minute clinic
      router.push("/minute-clinic");
    }
  };

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

        {/* Status & Exit Navigation */}
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {formatDuration(callDuration)}
          </div>

          {isDoctor ? (
            <button
              onClick={handleEndCall}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 font-semibold bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Doctor Portal</span>
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
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4">
          <div className="text-center p-8 max-w-md">
            <div className="w-24 h-24 rounded-full bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center mx-auto mb-4 text-sky-400">
              <User className="w-12 h-12" />
            </div>

            {isDoctor ? (
              <>
                <h2 className="text-xl font-bold text-white mb-1">
                  {consultData?.patient?.fullName || "Patient Connected"}
                </h2>
                <p className="text-xs text-sky-400 uppercase tracking-widest font-semibold mb-2">
                  Patient Consultation Encounter
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Patient audio and video channel is active. Conduct the examination and record clinical notes.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-1">
                  {consultData?.doctor?.name || "Dr. MUKESH Doctor"}
                </h2>
                <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-2">
                  {consultData?.doctor?.specialty || "General Medicine"}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Doctor is connected to the examination session. Your camera and audio are streaming securely.
                </p>
              </>
            )}

            <div className="mt-6 inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Secure Channel Active
            </div>
          </div>

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

        {/* Chat Drawer */}
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
                placeholder="Type clinical note or message..."
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

      {/* Bottom Controls */}
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
