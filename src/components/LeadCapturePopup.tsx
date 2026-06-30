"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function LeadCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    // Check if the user has already seen or dismissed the popup
    const hasSeenPopup = localStorage.getItem("airo_lead_captured");
    
    if (!hasSeenPopup) {
      // Show the popup after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Mark as seen so it doesn't pop up again for 7 days, or forever
    localStorage.setItem("airo_lead_captured", "dismissed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email && !formData.phone) return;

    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "waitlist_leads"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: "global_popup",
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      localStorage.setItem("airo_lead_captured", "submitted");
      
      // Auto close after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#0B2114]/60 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-[#0B2114] border border-[#1A3324] rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Subtle glow effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FAF8F5]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-10 p-2 text-[#FAF8F5]/40 hover:text-[#FAF8F5] transition-colors rounded-full hover:bg-white/5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 p-8 sm:p-10 text-center">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center py-8"
                >
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#FAF8F5] mb-2 tracking-wide">Welcome to the Collective</h3>
                  <p className="text-sm text-[#FAF8F5]/60 leading-relaxed">
                    You have successfully joined the waitlist. Keep an eye out for our exclusive invitations.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  
                  <h3 className="font-serif text-2xl text-[#FAF8F5] mb-3 tracking-wide">
                    Join the AIRO Collective
                  </h3>
                  <p className="text-sm text-[#FAF8F5]/60 leading-relaxed mb-8">
                    Enter your details to receive early access to the Minute Clinic, exclusive organic grocery drops, and personalized wellness insights.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF8F5]/5 border border-[#1A3324] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37]/50 text-[#FAF8F5] placeholder-[#FAF8F5]/30 transition-all"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF8F5]/5 border border-[#1A3324] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37]/50 text-[#FAF8F5] placeholder-[#FAF8F5]/30 transition-all"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF8F5]/5 border border-[#1A3324] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37]/50 text-[#FAF8F5] placeholder-[#FAF8F5]/30 transition-all"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 bg-[#FAF8F5] text-[#0B2114] hover:bg-white rounded-xl py-3.5 px-6 font-bold text-[10px] tracking-widest uppercase flex items-center justify-center space-x-2 transition-all shadow-lg shadow-white/5 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-[#0B2114]/20 border-t-[#0B2114] rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Request Access</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                  
                  <p className="text-[9px] text-[#FAF8F5]/30 mt-6 tracking-wide">
                    By submitting, you agree to our Privacy Policy & Terms of Service.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
