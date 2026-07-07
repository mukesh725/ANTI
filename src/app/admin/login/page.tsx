"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter all credentials.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check Super Admin Fallback
      if (username === "admin" && password === "airohealthadmin2026") {
        const superAdminUser = {
          id: "super_admin",
          username: "admin",
          role: "Super Admin",
          allowedModules: ["all"] // 'all' acts as a wildcard
        };
        localStorage.setItem("airo_admin_auth", "true");
        localStorage.setItem("airo_admin_user", JSON.stringify(superAdminUser));
        router.push("/admin/dashboard");
        return;
      }

      // 2. Query Firestore for Team Members
      const q = query(
        collection(db, "admin_users"), 
        where("username", "==", username),
        where("password", "==", password)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // User found
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() };
        
        localStorage.setItem("airo_admin_auth", "true");
        localStorage.setItem("airo_admin_user", JSON.stringify({
          id: userData.id,
          username: userData.username,
          role: userData.role,
          allowedModules: userData.allowedModules || []
        }));
        
        router.push("/admin/dashboard");
      } else {
        setError("Invalid administrative credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("System error during authentication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#07120F] flex items-center justify-center px-4 font-sans selection:bg-[#FFFFFF] selection:text-[#1C1C1E]">
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-8 md:p-10 shadow-2xl relative">
        
        {/* Soft light effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFFFFF]/5 rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFFFFF]/5 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>

        {/* Logo and title */}
        <div className="flex flex-col items-center text-center mb-8 relative">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF]/10 flex items-center justify-center border border-[#FFFFFF]/20 mb-4 shadow-inner">
            <Shield className="w-6 h-6 text-[#FFFFFF]/90" />
          </div>
          <h1 className="font-serif text-2xl text-[#FFFFFF] tracking-wider mb-2">AIRO HEALTH</h1>
          <p className="text-xs text-[#FFFFFF]/60 uppercase tracking-widest font-medium">Administrative Portal</p>
        </div>

        {/* Error Badge */}
        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-800 text-red-200 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 animate-pulse">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#FFFFFF]/50 font-semibold mb-2">
              Console Username
            </label>
            <input
              type="text"
              required
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#FFFFFF]/5 border border-[#2C2C2E] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFFFFF]/40 text-[#FFFFFF] placeholder-[#FFFFFF]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#FFFFFF]/50 font-semibold mb-2">
              Console Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFFFFF]/5 border border-[#2C2C2E] rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-[#FFFFFF]/40 text-[#FFFFFF] placeholder-[#FFFFFF]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FFFFFF]/40 hover:text-[#FFFFFF]/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-[#1C1C1E] rounded-xl py-3.5 px-6 font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#1C1C1E]/20 border-t-[#1C1C1E] rounded-full animate-spin"></div>
            ) : (
              <span>Access Dashboard</span>
            )}
          </button>
        </form>

        {/* Help disclaimer */}
        <p className="text-[10px] text-center text-[#FFFFFF]/30 mt-8 leading-relaxed">
          Authorized personnel access only. Actions on this console are securely logged. For access assistance, contact DevOps.
        </p>

      </div>
    </div>
  );
}
