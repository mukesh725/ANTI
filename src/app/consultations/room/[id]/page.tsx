"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  ShieldCheck, User, Sparkles, Send, Activity, Lock, ArrowLeft,
  Stethoscope, CheckCircle2, AlertCircle, FileText, Phone,
  Clock, Radio, Bell, RefreshCw, Volume2
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { 
  collection, query, where, onSnapshot, doc, updateDoc, 
  getDoc, addDoc, orderBy, setDoc 
} from "firebase/firestore";

interface ChatMessage {
  id: string;
  sender: "patient" | "doctor" | "system";
  senderName?: string;
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
  offer?: any;
  answer?: any;
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

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 10,
};

// Synthesize pleasant clinical audio chime using Web Audio API
function playJoinChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
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
  } catch (e) {}
}

export default function ConsultationRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = (params?.id as string) || "ROOM";

  // Role detection
  const [isDoctor, setIsDoctor] = useState(false);
  const [consultData, setConsultData] = useState<ConsultationData | null>(null);
  const previousDoctorStatus = useRef<boolean | undefined>(undefined);

  // Video and Audio Media
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "disconnected">("idle");
  const [isSyncing, setIsSyncing] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Doctor Patient Alert State
  const [callDuration, setCallDuration] = useState(0);
  const [isAlertingPatient, setIsAlertingPatient] = useState(false);
  const [alertSentNotice, setAlertSentNotice] = useState<string | null>(null);

  const consultDocId = consultData?.id || (roomId !== "ROOM" ? roomId : "");

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

  // 3. Mark Presence in Firestore
  useEffect(() => {
    if (!consultDocId) return;
    const consultRef = doc(db, "doctor_consultations", consultDocId);

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
              consultationDocId: consultDocId,
            }),
          }).then(res => res.json()).then(data => {
            if (data?.success && !data?.skipped) {
              setAlertSentNotice(`Notification email dispatched to patient!`);
              setTimeout(() => setAlertSentNotice(null), 5000);
            }
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

    return () => {
      try {
        if (isDoctor) {
          updateDoc(consultRef, { doctorInCall: false });
        } else {
          updateDoc(consultRef, { patientInCall: false });
        }
      } catch (e) {}
    };
  }, [consultDocId, isDoctor]);

  // 4. Initialize Local Camera and Microphone
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startMedia() {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
        });
        activeStream = userMedia;
        setLocalStream(userMedia);
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

  // Bind localStream to localVideoRef whenever it updates
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  // 5. WebRTC Peer-to-Peer Signaling via Firestore
  useEffect(() => {
    if (!consultDocId || !localStream) return;

    let isMounted = true;
    const consultRef = doc(db, "doctor_consultations", consultDocId);

    // Initialize RTCPeerConnection
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;
    setConnectionStatus("connecting");

    // Add local tracks to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle remote tracks arrival
    pc.ontrack = (event) => {
      if (!isMounted) return;
      console.log("[WebRTC] Remote track received:", event.track.kind);
      
      const remoteStream = remoteStreamRef.current;
      event.streams[0].getTracks().forEach((track) => {
        // Prevent duplicate tracks
        if (!remoteStream.getTracks().find((t) => t.id === track.id)) {
          remoteStream.addTrack(track);
        }
      });

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch((e) => console.warn("Remote play err:", e));
      }

      setHasRemoteStream(true);
      setConnectionStatus("connected");
    };

    pc.onconnectionstatechange = () => {
      if (!isMounted) return;
      console.log("[WebRTC] Connection state:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setConnectionStatus("connected");
        setHasRemoteStream(true);
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        setConnectionStatus("disconnected");
      }
    };

    // Candidate collections
    const myCandidateCol = isDoctor ? "doctorCandidates" : "patientCandidates";
    const remoteCandidateCol = isDoctor ? "patientCandidates" : "doctorCandidates";

    // Send local ICE candidates to Firestore
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(
          collection(db, "doctor_consultations", consultDocId, myCandidateCol),
          event.candidate.toJSON()
        ).catch((err) => console.warn("Candidate write err:", err));
      }
    };

    // Listen for remote ICE candidates from Firestore
    const unsubCandidates = onSnapshot(
      collection(db, "doctor_consultations", consultDocId, remoteCandidateCol),
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added" && pc.remoteDescription) {
            try {
              const candidateData = change.doc.data();
              await pc.addIceCandidate(new RTCIceCandidate(candidateData));
            } catch (err) {
              console.warn("Failed to add remote candidate:", err);
            }
          }
        });
      }
    );

    // Signaling Offer / Answer
    let unsubSignaling = () => {};

    if (isDoctor) {
      // DOCTOR acts as Caller: creates Offer
      const initiateCall = async () => {
        try {
          const offerDesc = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await pc.setLocalDescription(offerDesc);

          await updateDoc(consultRef, {
            offer: { sdp: offerDesc.sdp, type: offerDesc.type },
            webrtcUpdatedAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error("[WebRTC] Doctor offer creation err:", err);
        }
      };

      initiateCall();

      // Listen for Patient's Answer
      unsubSignaling = onSnapshot(consultRef, async (snap) => {
        const data = snap.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          try {
            console.log("[WebRTC] Doctor setting remote description from patient answer");
            const answerDesc = new RTCSessionDescription(data.answer);
            await pc.setRemoteDescription(answerDesc);
          } catch (err) {
            console.error("[WebRTC] Doctor remote desc err:", err);
          }
        }
      });
    } else {
      // PATIENT acts as Callee: listens for Doctor's Offer, generates Answer
      unsubSignaling = onSnapshot(consultRef, async (snap) => {
        const data = snap.data();
        if (!pc.currentRemoteDescription && data?.offer) {
          try {
            console.log("[WebRTC] Patient setting remote description from doctor offer");
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            
            const answerDesc = await pc.createAnswer();
            await pc.setLocalDescription(answerDesc);

            await updateDoc(consultRef, {
              answer: { sdp: answerDesc.sdp, type: answerDesc.type },
              webrtcAnsweredAt: new Date().toISOString(),
            });
          } catch (err) {
            console.error("[WebRTC] Patient answer err:", err);
          }
        }
      });
    }

    return () => {
      isMounted = false;
      unsubSignaling();
      unsubCandidates();
      pc.close();
      peerConnectionRef.current = null;
    };
  }, [consultDocId, localStream, isDoctor, isSyncing]);

  // 6. Real-Time Shared Firestore Chat
  useEffect(() => {
    if (!consultDocId) return;

    const q = query(
      collection(db, "doctor_consultations", consultDocId, "chat_messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          sender: d.sender || "patient",
          senderName: d.senderName || "",
          text: d.text || "",
          time: d.createdAt 
            ? new Date(d.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "",
        });
      });

      setMessages(items);

      // If chat is closed and new message arrived from peer, bump unread count
      if (!isChatOpen && items.length > 0) {
        const lastMsg = items[items.length - 1];
        const isFromOther = isDoctor ? lastMsg.sender === "patient" : lastMsg.sender === "doctor";
        if (isFromOther) {
          setUnreadCount((prev) => prev + 1);
        }
      }

      // Auto scroll chat
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [consultDocId, isDoctor, isChatOpen]);

  // Clear unread badge when chat is opened
  const toggleChat = () => {
    if (!isChatOpen) {
      setUnreadCount(0);
    }
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !consultDocId) return;

    const textToSend = inputText.trim();
    setInputText("");

    try {
      await addDoc(collection(db, "doctor_consultations", consultDocId, "chat_messages"), {
        text: textToSend,
        sender: isDoctor ? "doctor" : "patient",
        senderName: isDoctor 
          ? (consultData?.doctor?.name || "Dr. MUKESH Doctor") 
          : (consultData?.patient?.fullName || "Patient"),
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to send message to Firestore:", err);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  // Re-sync WebRTC connection on demand
  const handleRestartWebRTC = () => {
    setIsSyncing((prev) => !prev);
  };

  // Alert patient via email from doctor view
  const handleResendPatientAlert = async () => {
    if (!consultDocId) return;
    setIsAlertingPatient(true);
    try {
      const res = await fetch("/api/doctor/notify-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DOCTOR_JOINED",
          consultationDocId: consultDocId,
          forceResend: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const patientEmail = consultData?.patient?.email || "patient";
        setAlertSentNotice(`Alert email sent to ${patientEmail}!`);
        setTimeout(() => setAlertSentNotice(null), 6000);
      }
    } catch (err) {
      console.error("Alert email error:", err);
    } finally {
      setIsAlertingPatient(false);
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (consultDocId) {
      try {
        const consultRef = doc(db, "doctor_consultations", consultDocId);
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
  const bothParticipantsInCall = isDoctorInCall && isPatientInCall;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Top Clinical Bar */}
      <header className="px-6 py-3 bg-slate-900/90 backdrop-blur border-b border-white/10 flex items-center justify-between z-20 shrink-0">
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Patient View of Doctor Status */}
          {!isDoctor && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              isDoctorInCall 
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs shadow-emerald-500/10"
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

          {/* Reconnect / Sync Call Button */}
          <button
            onClick={handleRestartWebRTC}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reconnect Video & Audio Stream"
          >
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Sync Video</span>
          </button>

          {/* Call Duration Clock */}
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs text-slate-300 font-mono">
            {formatDuration(callDuration)}
          </div>

          {/* Return button */}
          {isDoctor ? (
            <button
              onClick={handleEndCall}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 font-semibold bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20 cursor-pointer"
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

      {/* Main Examination Viewport */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Remote Stage Area */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center p-0 overflow-hidden">
          
          {/* REAL REMOTE VIDEO STREAM (Full HD Audio/Video) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              hasRemoteStream ? "opacity-100 block" : "opacity-0 hidden"
            }`}
          />

          {/* Active Consultation Overlay when remote video is streaming */}
          {hasRemoteStream && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">
                {isDoctor 
                  ? (consultData?.patient?.fullName || "Patient") 
                  : (consultData?.doctor?.name || "Doctor")}
              </span>
              <span className="text-[10px] text-emerald-400 border-l border-white/10 pl-2">
                HD Audio & Video
              </span>
            </div>
          )}

          {/* WAITING / CONNECTING OVERLAY (Rendered when remote stream is not yet streaming) */}
          {!hasRemoteStream && (
            <div className="text-center p-8 max-w-lg bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur m-4 animate-in fade-in zoom-in-95">
              
              {/* STATE 1: Patient Waiting for Doctor */}
              {!isDoctor && !isDoctorInCall && (
                <>
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
                </>
              )}

              {/* STATE 2: Patient and Doctor Both In Room, Connecting Stream */}
              {bothParticipantsInCall && (
                <>
                  <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
                    <div className="w-20 h-20 rounded-full bg-sky-500/20 border-2 border-sky-500/40 flex items-center justify-center text-sky-400 text-xl font-bold">
                      <Activity className="w-10 h-10 animate-pulse" />
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 mb-3">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    Establishing Encrypted Peer-to-Peer Stream
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Connecting with {isDoctor ? (consultData?.patient?.fullName || "Patient") : (consultData?.doctor?.name || "Doctor")}...
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Exchanging WebRTC security tokens and audio/video channels. The consultation will begin in seconds.
                  </p>
                  <button
                    onClick={handleRestartWebRTC}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Stream Now</span>
                  </button>
                </>
              )}

              {/* STATE 3: Doctor Waiting for Patient to Join */}
              {isDoctor && !isPatientInCall && (
                <>
                  <div className="w-20 h-20 rounded-full bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center mx-auto mb-4 text-sky-400">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-amber-500/30 bg-amber-500/15 text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Awaiting Patient Entry</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {consultData?.patient?.fullName || "Patient"}
                  </h2>
                  <p className="text-xs text-sky-400 font-medium mb-3">
                    {consultData?.service || "General Virtual Consultation"}
                  </p>
                  {consultData?.patient?.phone && (
                    <div className="inline-flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 font-mono mb-2">
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      <span>{consultData.patient.phone}</span>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-2.5">
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {alertSentNotice ? (
                        <span className="text-emerald-400 font-semibold">{alertSentNotice}</span>
                      ) : (
                        <span>
                          Invitation email dispatched to <strong className="text-white">{consultData?.patient?.email || "patient's email"}</strong> with a 1-click link to join.
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
                </>
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
            <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 backdrop-blur px-2 py-0.5 rounded text-white/80 flex items-center gap-1.5">
              <span>{isDoctor ? "Doctor (You)" : "You"}</span>
              {!isAudioOn && <span className="text-red-400 font-bold">· Muted</span>}
            </div>
          </div>
        </div>

        {/* Real-time Shared Clinical Chat Drawer */}
        {isChatOpen && (
          <aside className="w-80 bg-slate-900 border-l border-white/10 flex flex-col z-20 shrink-0">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/90 backdrop-blur">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-200">
                  Clinical Chat
                </h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer font-semibold"
              >
                Close
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs">
                  No messages yet. Messages sent here are synced in real-time between doctor and patient.
                </div>
              ) : (
                messages.map((m) => {
                  const isMyMessage = (isDoctor && m.sender === "doctor") || (!isDoctor && m.sender === "patient");

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isMyMessage
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
                        <div className="max-w-[85%]">
                          <span className={`text-[10px] block mb-1 font-semibold ${
                            isMyMessage ? "text-sky-400 text-right" : "text-emerald-400 text-left"
                          }`}>
                            {m.senderName || (m.sender === "doctor" ? "Physician" : "Patient")}
                          </span>
                          <div
                            className={`p-3 rounded-2xl ${
                              isMyMessage
                                ? "bg-sky-600 text-white rounded-br-none"
                                : "bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none"
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                            <span className="text-[9px] opacity-60 mt-1 block text-right font-mono">
                              {m.time}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat input box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2 bg-slate-950/60">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type message to consultation..."
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-sky-600 hover:bg-sky-500 rounded-xl text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Bottom Audio/Video Controls */}
      <footer className="px-6 py-3.5 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-4 z-20 shrink-0">
        {/* Toggle Audio */}
        <button
          onClick={toggleAudio}
          className={`p-3.5 rounded-full transition-colors cursor-pointer ${
            isAudioOn
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
          title={isAudioOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Toggle Video */}
        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-full transition-colors cursor-pointer ${
            isVideoOn
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
          title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Toggle Shared Chat */}
        <button
          onClick={toggleChat}
          className={`relative p-3.5 rounded-full transition-colors cursor-pointer ${
            isChatOpen ? "bg-sky-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Open Clinical Chat"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && !isChatOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900 animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
        >
          <PhoneOff className="w-4 h-4" />
          <span>{isDoctor ? "End & Back to Portal" : "End Consultation"}</span>
        </button>
      </footer>
    </div>
  );
}
