"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, Lock, Mail, ShieldCheck, ArrowRight, 
  Activity, CheckCircle2, Video, FileCheck, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("mukesh@akronpharma.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error(data.message || "Login failed. Please verify credentials.");
      }

      // Save doctor session to localStorage
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/70 text-slate-800 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Top Clinic Utility Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-sky-700 transition-colors">
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">AIRO</span>
            <span className="text-base font-medium text-slate-500 ml-1">Health</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/60 px-2 py-0.5 rounded-md ml-2">
              Clinical Hub
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Telehealth Network Online
          </span>
          <span className="text-slate-300">|</span>
          <Link href="/minute-clinic" className="hover:text-slate-900 transition-colors font-medium">
            Patient Minute Clinic
          </Link>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 sm:py-12">
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left / Clinical Trust Pane (Visible on medium+ screens) */}
          <div className="hidden md:flex md:col-span-5 bg-slate-900 text-white p-8 flex-col justify-between relative overflow-hidden">
            {/* Soft Ambient Background Pattern */}
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 text-sky-300 text-xs font-semibold backdrop-blur-sm mb-6 border border-white/10">
                <Stethoscope className="w-3.5 h-3.5" />
                Physician Workspace
              </div>

              <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white leading-snug">
                Dedicated clinical command center for doctors.
              </h2>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Review scheduled patient queues, conduct encrypted HD video consultations, and issue verifiable digital prescriptions.
              </p>

              {/* Core Feature List */}
              <div className="mt-8 space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Video className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Low-latency WebRTC virtual examination room</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real-time vitals integration from AIRO Health Chairs</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Integrated SOAP charting & digital e-prescriptions</span>
                </div>
              </div>
            </div>

            {/* Compliance Footer */}
            <div className="relative z-10 pt-8 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>256-bit encrypted healthcare session</span>
            </div>
          </div>

          {/* Right / Secure Doctor Authentication Form */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Physician Sign-In
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Access your active patient appointments and clinical documentation
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Medical Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@akronpharma.com"
                      className="w-full bg-slate-50/70 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-3.5 py-2.5 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Portal Security Password
                    </label>
                    <span className="text-[11px] text-slate-400">Default: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50/70 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-10 py-2.5 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Physician Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Doctor Preset Selector */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Quick Physician Sign-In
                  </span>
                  <span className="text-[10px] text-slate-400">1-click test access</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("mukesh@akronpharma.com")}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      email === "mukesh@akronpharma.com"
                        ? "border-sky-600 bg-sky-50/60 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      DM
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">Dr. MUKESH Doctor</p>
                      <p className="text-[10px] text-slate-500 truncate">General Medicine</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("sahangutta57@gmail.com")}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      email === "sahangutta57@gmail.com"
                        ? "border-sky-600 bg-sky-50/60 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      GS
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">Dr. Gutta Sahan</p>
                      <p className="text-[10px] text-slate-500 truncate">Cardiology</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Portal Footer Notice */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <Link href="/admin/dashboard" className="hover:text-slate-700 transition-colors">
                Superadmin Doctors Hub
              </Link>
              <span>AIRO Health Provider Network</span>
            </div>
          </div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} AIRO Health. All clinical rights reserved. Secure Telehealth Services.
      </footer>
    </div>
  );
}
