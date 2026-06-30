"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem("airo_compliance_consent");
    if (!consent) {
      // Small delay to not block initial render LCP
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("airo_compliance_consent", "all");
    setIsVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("airo_compliance_consent", "essential");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[100] md:max-w-sm bg-white border border-[#E6DFD5] shadow-2xl rounded-2xl overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif text-lg font-medium text-[#1C1C1E]">Consent Preferences</h3>
              </div>
              <button 
                onClick={acceptEssential}
                className="text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-[#1C1C1E]/70 leading-relaxed mb-4">
              To comply with the DPDP Act 2023, we use tracking technologies for site performance, FSSAI-compliant grocery personalization, and marketing. By clicking &quot;Accept All&quot;, you agree to our <Link href="/privacy-policy" className="underline font-medium hover:text-emerald-700">Privacy Policy</Link> and <Link href="/terms" className="underline font-medium hover:text-emerald-700">Terms of Service</Link>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={acceptEssential}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-[#1C1C1E] bg-[#F4F7F6] border border-[#E6DFD5] hover:bg-[#E6DFD5]/50 transition-colors"
              >
                Essential Only
              </button>
              <button 
                onClick={acceptAll}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-[#FFFFFF] bg-[#1C1C1E] hover:bg-[#1C1C1E]/90 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
