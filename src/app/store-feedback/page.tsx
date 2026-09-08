"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Store,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  HeartHandshake,
  Clock,
  ThumbsUp,
  MapPin,
  ShieldCheck,
  Star,
  Send,
  Loader2,
} from "lucide-react";
import { STORE_LOCATIONS, SENTIMENT_MAP, RatingLevel, SentimentType } from "@/lib/feedback";

const RATINGS_OPTIONS: {
  level: RatingLevel;
  label: string;
  sublabel: string;
  sentiment: SentimentType;
  emoji: string;
  color: string;
  activeBg: string;
  borderActive: string;
  glow: string;
}[] = [
  {
    level: 1,
    label: "Poor",
    sublabel: "Needs Attention",
    sentiment: "poor",
    emoji: "😞",
    color: "text-rose-500",
    activeBg: "bg-rose-500/10",
    borderActive: "border-rose-500 ring-4 ring-rose-500/20",
    glow: "rgba(244, 63, 94, 0.2)",
  },
  {
    level: 2,
    label: "Average",
    sublabel: "Could Be Better",
    sentiment: "average",
    emoji: "😐",
    color: "text-amber-500",
    activeBg: "bg-amber-500/10",
    borderActive: "border-amber-500 ring-4 ring-amber-500/20",
    glow: "rgba(245, 158, 11, 0.2)",
  },
  {
    level: 3,
    label: "Good",
    sublabel: "Met Expectations",
    sentiment: "good",
    emoji: "🙂",
    color: "text-sky-500",
    activeBg: "bg-sky-500/10",
    borderActive: "border-sky-500 ring-4 ring-sky-500/20",
    glow: "rgba(14, 165, 233, 0.2)",
  },
  {
    level: 4,
    label: "Very Good",
    sublabel: "Pleasant Visit",
    sentiment: "very_good",
    emoji: "😊",
    color: "text-emerald-500",
    activeBg: "bg-emerald-500/10",
    borderActive: "border-emerald-500 ring-4 ring-emerald-500/20",
    glow: "rgba(16, 185, 129, 0.2)",
  },
  {
    level: 5,
    label: "Excellent",
    sublabel: "Exceptional Service",
    sentiment: "excellent",
    emoji: "🤩",
    color: "text-[#00c988]",
    activeBg: "bg-[#00c988]/10",
    borderActive: "border-[#00c988] ring-4 ring-[#00c988]/20",
    glow: "rgba(0, 201, 136, 0.25)",
  },
];

const STORE_ASPECTS = [
  { id: "staffHospitality", label: "Staff Hospitality & Care", icon: HeartHandshake },
  { id: "storeAmbiance", label: "Store Ambiance & Cleanliness", icon: Sparkles },
  { id: "productAvailability", label: "Product Range & Display", icon: Store },
  { id: "checkoutSpeed", label: "Fast & Smooth Billing", icon: Clock },
  { id: "healthScanExperience", label: "Health Check / Clinic Care", icon: ThumbsUp },
];

export default function StoreFeedbackPage() {
  const [selectedRating, setSelectedRating] = useState<RatingLevel | null>(5);
  const [selectedAspects, setSelectedAspects] = useState<Record<string, boolean>>({
    staffHospitality: true,
    storeAmbiance: true,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [storeLocation, setStoreLocation] = useState(STORE_LOCATIONS[0]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleAspect = (id: string) => {
    setSelectedAspects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRatingSelect = (level: RatingLevel) => {
    setSelectedRating(level);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedRating) {
      setErrorMsg("Please select an overall rating for your store experience.");
      return;
    }

    if (!name.trim()) {
      setErrorMsg("Please provide your name.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg("Please provide a valid contact number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          rating: selectedRating,
          sentiment: SENTIMENT_MAP[selectedRating].sentiment,
          storeLocation,
          comment: comment.trim(),
          aspects: selectedAspects,
          source: "in_store_kiosk",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Feedback submit error:", err);
      setErrorMsg(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedRating(5);
    setSelectedAspects({
      staffHospitality: true,
      storeAmbiance: true,
    });
    setName("");
    setPhone("");
    setComment("");
    setIsSubmitted(false);
    setErrorMsg("");
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden selection:bg-[#00c988]/30">
      {/* Dynamic Apple-Style Ambient Backdrops */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Brand Header */}
        <header className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md mb-3">
            <Store className="w-3.5 h-3.5 text-[#00c988]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-300">
              In-Store Experience
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white">
            How was your visit to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-emerald-400">AIRO</span>?
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 max-w-md mx-auto">
            Your instant review takes less than 30 seconds and helps us tailor an unmatched physical store experience.
          </p>
        </header>

        {/* Form Card or Thank-You Screen */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="feedback-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.09] rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Store Location Selector */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                    Store Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={storeLocation}
                      onChange={(e) => setStoreLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer appearance-none"
                    >
                      {STORE_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-[#0e1628] text-white">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 1: 5-Tier Apple-Style Rating Selector */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                      Overall Experience Rating
                    </label>
                    <span className="text-[11px] font-medium text-emerald-400/90">
                      {selectedRating ? `${SENTIMENT_MAP[selectedRating].label} (${selectedRating} / 5)` : "Select one"}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {RATINGS_OPTIONS.map((opt) => {
                      const isSelected = selectedRating === opt.level;
                      return (
                        <motion.button
                          key={opt.level}
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 450, damping: 25 }}
                          onClick={() => handleRatingSelect(opt.level)}
                          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-200 relative group ${
                            isSelected
                              ? `${opt.activeBg} ${opt.borderActive}`
                              : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                          }`}
                          style={{
                            boxShadow: isSelected ? `0 0 20px ${opt.glow}` : "none",
                          }}
                        >
                          <span className="text-2xl sm:text-3xl mb-1.5 transform group-hover:scale-110 transition-transform">
                            {opt.emoji}
                          </span>
                          <span className={`text-[11px] sm:text-xs font-semibold ${isSelected ? "text-white" : "text-gray-400"}`}>
                            {opt.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Store Aspects Badges (1-Tap Fast Check) */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2.5">
                    What did you appreciate most? (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STORE_ASPECTS.map((aspect) => {
                      const isChecked = Boolean(selectedAspects[aspect.id]);
                      const Icon = aspect.icon;
                      return (
                        <button
                          key={aspect.id}
                          type="button"
                          onClick={() => toggleAspect(aspect.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                            isChecked
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                              : "bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15 hover:text-gray-200"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isChecked ? "text-emerald-400" : "text-gray-500"}`} />
                          {aspect.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Customer Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                      Your Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mukesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                      Contact Number <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4: Comment Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                      Comments or Suggestions
                    </label>
                    <span className="text-[10px] text-gray-500">Optional</span>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={3}
                      placeholder="Share compliments for the team or suggestions on how we can improve your next visit..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2"
                  >
                    <span>⚠️</span> {errorMsg}
                  </motion.div>
                )}

                {/* Submit Action */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#00c988] to-teal-500 hover:from-[#00b277] hover:to-teal-600 text-[#070B14] font-semibold text-sm tracking-wide shadow-[0_10px_25px_-5px_rgba(0,201,136,0.4)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#070B14]" />
                      <span>Saving Securely...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Experience Review</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            /* Apple-Style Confirmation Delight Screen */
            <motion.div
              key="thank-you-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.09] rounded-3xl p-8 sm:p-12 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] text-center relative overflow-hidden"
            >
              {/* Apple-style pop-in checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-[#00c988] flex items-center justify-center shadow-[0_0_35px_rgba(0,201,136,0.5)] mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-[#070B14] stroke-[2.5]" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                Thank You, {name.split(" ")[0]}!
              </h2>
              <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
                Your feedback has been securely transmitted to our store leadership. It helps us continually redefine holistic care & customer excellence.
              </p>

              {/* Review Snapshot Card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 max-w-sm mx-auto mb-8 text-left">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Rating Given</span>
                  <span className="text-emerald-400 font-semibold">{selectedRating} / 5 Stars ({SENTIMENT_MAP[selectedRating || 5].label})</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Store</span>
                  <span className="text-white font-medium truncate max-w-[180px]">{storeLocation}</span>
                </div>
              </div>

              {/* Action to reset for next customer */}
              <motion.button
                type="button"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider uppercase border border-white/10 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Submit Another Review</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security & Private Server Footnote */}
        <footer className="mt-8 text-center flex items-center justify-center gap-2 text-gray-500 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Store Experience Terminal • Powered by AIRO Core</span>
        </footer>
      </div>
    </main>
  );
}
