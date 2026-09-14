"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Lock, Mail, Key, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("mukesh@akronpharma.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/doctor/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save doctor session
      localStorage.setItem("airo_doctor_session", JSON.stringify(data.doctor));
      router.push("/doctor/portal");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid doctor credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 select-none font-sans">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-xl">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            AIRO<span className="text-cyan-400">eMed</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Physician Portal
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Authorized Medical Specialist Telemedicine & Clinical Review Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Doctor Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@akronpharma.com"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-3.5 py-3 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Portal Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-3.5 py-3 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Enter Physician Hub"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Doctor Profiles (Demo / Testing Convenience) */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 font-medium mb-3">Quick Doctor Sign-In:</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickLogin("mukesh@akronpharma.com")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-semibold border border-slate-700 transition-colors"
              >
                Dr. MUKESH Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("sahangutta57@gmail.com")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition-colors"
              >
                Dr. Gutta Sahan
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/minute-clinic" className="text-xs text-slate-500 hover:text-slate-400">
            &larr; Return to AIRO Health Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
