"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  ShieldCheck, User, Sparkles, Send, Activity, Lock
} from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  sender: "patient" | "doctor" | "system";
  text: string;
  time: string;
}

export default function ConsultationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.id as string) || "ROOM";

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "system",
      text: "End-to-end encrypted medical consultation room initiated. Doctor has been alerted and is connecting.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [callDuration, setCallDuration] = useState(0);

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
      sender: "patient",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulated doctor response after 3 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "doctor",
          text: "Hello, I can see you clearly. Let's begin your evaluation.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 3000);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    router.push("/minute-clinic");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none">
      {/* Top Bar */}
      <header className="px-6 py-4 bg-slate-900/80 backdrop-blur border-b border-white/10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide flex items-center gap-2">
              AIRO E-Med Virtual Consultation
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Lock className="w-2.5 h-2.5" /> 256-bit Encrypted
              </span>
            </h1>
            <p className="text-xs text-slate-400">Room Reference: #{roomId.slice(0, 14)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs text-emerald-400 font-mono">
            {formatDuration(callDuration)}
          </div>
          <Link
            href="/minute-clinic"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Leave Room
          </Link>
        </div>
      </header>

      {/* Main Video Stage */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Remote Doctor Stage */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4">
          <div className="text-center p-8 max-w-md">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Dr. Gutta Sahan</h2>
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-2">
              General Medicine · TSMC 20642
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Doctor is alerted and connected to the consultation session. Your camera and audio are streaming securely.
            </p>

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
              You {!isAudioOn ? "(Muted)" : ""}
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
                    m.sender === "patient"
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
                        m.sender === "patient"
                          ? "bg-emerald-600 text-white rounded-br-none"
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
                placeholder="Type your message..."
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white transition-colors"
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
            isChatOpen ? "bg-emerald-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Toggle Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button
          onClick={handleEndCall}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-red-600/30"
        >
          <PhoneOff className="w-4 h-4" />
          End Consultation
        </button>
      </footer>
    </div>
  );
}
