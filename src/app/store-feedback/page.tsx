"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Paperclip,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Sparkles,
  MapPin,
  HeartHandshake,
  Store,
  Clock,
  ThumbsUp,
  X,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { STORE_LOCATIONS, SENTIMENT_MAP, RatingLevel, SentimentType } from "@/lib/feedback";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const FEEDBACK_TYPES: ("Idea" | "Complaint" | "Suggestion" | "Compliment")[] = [
  "Idea",
  "Complaint",
  "Suggestion",
  "Compliment",
];

const STORE_ASPECTS = [
  { id: "staffHospitality", label: "Staff Hospitality", icon: HeartHandshake },
  { id: "storeAmbiance", label: "Store Ambiance", icon: Sparkles },
  { id: "productAvailability", label: "Product Range", icon: Store },
  { id: "checkoutSpeed", label: "Billing Speed", icon: Clock },
];

const RATING_LEVELS: {
  level: RatingLevel;
  label: string;
  emoji: string;
  color: string;
  fillHex: string;
  bgLight: string;
  borderClass: string;
  glowShadow: string;
  sentiment: SentimentType;
}[] = [
  {
    level: 1,
    label: "Poor",
    emoji: "😡",
    color: "text-red-500",
    fillHex: "#EF4444",
    bgLight: "bg-red-50",
    borderClass: "border-red-200",
    glowShadow: "drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)]",
    sentiment: "poor",
  },
  {
    level: 2,
    label: "Average",
    emoji: "🙁",
    color: "text-orange-500",
    fillHex: "#F97316",
    bgLight: "bg-orange-50",
    borderClass: "border-orange-200",
    glowShadow: "drop-shadow-[0_2px_8px_rgba(249,115,22,0.4)]",
    sentiment: "average",
  },
  {
    level: 3,
    label: "Good",
    emoji: "🙂",
    color: "text-amber-500",
    fillHex: "#F59E0B",
    bgLight: "bg-amber-50",
    borderClass: "border-amber-200",
    glowShadow: "drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]",
    sentiment: "good",
  },
  {
    level: 4,
    label: "Very Good",
    emoji: "😊",
    color: "text-lime-600",
    fillHex: "#84CC16",
    bgLight: "bg-lime-50",
    borderClass: "border-lime-200",
    glowShadow: "drop-shadow-[0_2px_8px_rgba(132,204,22,0.4)]",
    sentiment: "very_good",
  },
  {
    level: 5,
    label: "Excellent",
    emoji: "🤩",
    color: "text-emerald-500",
    fillHex: "#10B981",
    bgLight: "bg-emerald-50",
    borderClass: "border-emerald-200",
    glowShadow: "drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]",
    sentiment: "excellent",
  },
];

// Helper to compress customer photos for instant Firestore storage
const compressPhoto = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function StoreFeedbackContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [availableStores, setAvailableStores] = useState<string[]>(STORE_LOCATIONS);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<"Idea" | "Complaint" | "Suggestion" | "Compliment">("Suggestion");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [storeLocation, setStoreLocation] = useState(STORE_LOCATIONS[0]);
  const [showAspects, setShowAspects] = useState(false);
  const [selectedAspects, setSelectedAspects] = useState<Record<string, boolean>>({
    staffHospitality: true,
    storeAmbiance: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch real-time available stores from Firestore/API
  useEffect(() => {
    async function loadStores() {
      try {
        const docRef = doc(db, "settings", "locations");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().list && Array.isArray(docSnap.data().list) && docSnap.data().list.length > 0) {
          const list = docSnap.data().list as string[];
          setAvailableStores(list);
          if (locationParam && list.includes(locationParam)) {
            setStoreLocation(locationParam);
          } else {
            setStoreLocation(list[0]);
          }
        } else {
          // Fallback to /api/locations
          const res = await fetch("/api/locations");
          const data = await res.json();
          if (data.locations && data.locations.length > 0) {
            setAvailableStores(data.locations);
            if (locationParam && data.locations.includes(locationParam)) {
              setStoreLocation(locationParam);
            } else {
              setStoreLocation(data.locations[0]);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic store locations, using defaults", err);
      }
    }

    loadStores();
  }, [locationParam]);

  const toggleAspect = (id: string) => {
    setSelectedAspects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 4) {
      setErrorMsg("You can attach up to 4 photos.");
      return;
    }

    setIsProcessingPhoto(true);
    setErrorMsg("");

    try {
      const newPhotos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const compressed = await compressPhoto(file);
          newPhotos.push(compressed);
        }
      }
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
      setShowAspects(true); // Open drawer so customer sees their photos
    } catch (err) {
      console.error("Failed to process photo:", err);
      setErrorMsg("Could not process image. Please try a different photo.");
    } finally {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!rating || rating === 0) {
      setErrorMsg("Please select your experience rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      const activeLevel = RATING_LEVELS[rating - 1];
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Guest Customer",
          phone: phone.trim() || "",
          rating,
          sentiment: activeLevel?.sentiment || "good",
          feedbackType,
          storeLocation,
          comment: comment.trim(),
          aspects: selectedAspects,
          photos: photos,
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
    setRating(0);
    setHoverRating(null);
    setFeedbackType("Suggestion");
    setComment("");
    setName("");
    setPhone("");
    setPhotos([]);
    setShowAspects(false);
    setSelectedAspects({
      staffHospitality: true,
      storeAmbiance: true,
    });
    setIsSubmitted(false);
    setErrorMsg("");
  };

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;
  const activeLevelConfig = currentDisplayRating > 0 ? RATING_LEVELS[currentDisplayRating - 1] : null;

  return (
    <div className="w-full max-w-[420px] relative z-10">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="feedback-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-white rounded-[32px] shadow-2xl border border-white/20 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="pt-6 pb-4 px-6 text-center border-b border-slate-100">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F] tracking-tight">
                Give us your feedback
              </h1>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {/* Store Rating Prompt, Emojis & Stars */}
              <div className="text-center space-y-2.5">
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  How would you rate our service?
                </p>

                {/* Interactive Star Row */}
                <div className="flex items-center justify-center gap-2">
                  {RATING_LEVELS.map((item) => {
                    const isFilled = item.level <= currentDisplayRating;
                    const fillHex = activeLevelConfig ? activeLevelConfig.fillHex : "#F59E0B";

                    return (
                      <motion.button
                        key={item.level}
                        type="button"
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.85 }}
                        onMouseEnter={() => setHoverRating(item.level)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(item.level)}
                        className="p-1 focus:outline-none transition-transform"
                      >
                        <Star
                          style={{
                            fill: isFilled ? fillHex : "transparent",
                            color: isFilled ? fillHex : "#CBD5E1",
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${
                            isFilled
                              ? (activeLevelConfig?.glowShadow || "drop-shadow-sm")
                              : "stroke-[1.5]"
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Red-to-Green Emoji Reaction Faces */}
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  {RATING_LEVELS.map((item) => {
                    const isSelected = item.level === currentDisplayRating;
                    return (
                      <motion.button
                        key={item.level}
                        type="button"
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(item.level)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(item.level)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all ${
                          isSelected
                            ? `${item.bgLight} scale-110 ring-2 ring-offset-1 ring-current ${item.color} shadow-xs`
                            : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100 bg-slate-50"
                        }`}
                        title={item.label}
                      >
                        <span>{item.emoji}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Active Sentiment Label Banner */}
                <div className="h-5 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeLevelConfig ? (
                      <motion.div
                        key={activeLevelConfig.level}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${activeLevelConfig.bgLight} ${activeLevelConfig.color} border ${activeLevelConfig.borderClass}`}
                      >
                        <span>{activeLevelConfig.emoji}</span>
                        <span>{activeLevelConfig.label}</span>
                      </motion.div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        Tap a star or emoji to rate
                      </span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Segmented Pill Selector (Idea | Complaint | Suggestion | Compliment) */}
              <div className="bg-[#DCE4EC] p-1 rounded-2xl flex items-center gap-1">
                {FEEDBACK_TYPES.map((type) => {
                  const isSelected = feedbackType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFeedbackType(type)}
                      className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 text-center ${
                        isSelected
                          ? "bg-[#1E3A5F] text-white shadow-sm"
                          : "bg-transparent text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>

              {/* Experience Text Prompt & Area */}
              <div className="space-y-1.5 text-center">
                <label className="block text-xs sm:text-sm font-medium text-slate-600">
                  Describe your experience
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your thoughts about your visit today..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all resize-none shadow-xs"
                  />
                </div>
              </div>
              {/* Hidden File Input for Photos */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* Quick Attachments & Tags Drawer (Toggleable via paperclip) */}
              {showAspects && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                >
                  {/* Photos Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#1E3A5F]" />
                        Attach Photos ({photos.length}/4)
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAspects(false)}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Photo Thumbnails & Upload Button */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {photos.map((imgSrc, idx) => (
                        <div
                          key={idx}
                          className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0 group shadow-2xs"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={`Attachment ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}

                      {photos.length < 4 && (
                        <button
                          type="button"
                          disabled={isProcessingPhoto}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1E3A5F] bg-white flex flex-col items-center justify-center text-slate-400 hover:text-[#1E3A5F] transition-all flex-shrink-0"
                        >
                          {isProcessingPhoto ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#1E3A5F]" />
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span className="text-[9px] font-medium mt-0.5">Photo</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Experience Tags Section */}
                  <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                      Store Experience Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {STORE_ASPECTS.map((aspect) => {
                        const isChecked = Boolean(selectedAspects[aspect.id]);
                        return (
                          <button
                            key={aspect.id}
                            type="button"
                            onClick={() => toggleAspect(aspect.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                              isChecked
                                ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {aspect.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Customer Details Inputs */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                  />
                </div>

                {/* Available Stores Selector */}
                <div className="relative">
                  <select
                    value={storeLocation}
                    onChange={(e) => setStoreLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] cursor-pointer appearance-none"
                  >
                    {availableStores.map((loc) => (
                      <option key={loc} value={loc}>
                        📍 {loc}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Photos Attached Indicator Preview if Drawer is Closed */}
              {!showAspects && photos.length > 0 && (
                <div className="flex items-center justify-between p-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Camera className="w-3.5 h-3.5 text-[#1E3A5F]" />
                    {photos.length} photo{photos.length > 1 ? "s" : ""} attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAspects(true)}
                    className="text-[11px] font-semibold text-[#1E3A5F] hover:underline"
                  >
                    View / Edit
                  </button>
                </div>
              )}

              {/* Error message */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium"
                >
                  {errorMsg}
                </motion.div>
              )}

              {/* Action Row: Paperclip Aspect Toggle + Submit Button */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAspects((prev) => !prev)}
                  title="Attach Photos & Store Tags"
                  className={`relative p-3 rounded-2xl border transition-all ${
                    showAspects || photos.length > 0
                      ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Paperclip className="w-5 h-5" />
                  {photos.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                      {photos.length}
                    </span>
                  )}
                </button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 rounded-2xl bg-[#1E3A5F] hover:bg-[#162C47] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Card Footer */}
            <div className="pb-4 pt-1 text-center">
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                By AIRO
              </span>
            </div>
          </motion.div>
        ) : (
          /* Thank-You Delight Screen */
          <motion.div
            key="thank-you-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-white rounded-[32px] shadow-2xl border border-white/20 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </motion.div>

            <h2 className="text-xl font-bold text-[#1E3A5F] mb-1">
              Thank You, {name.split(" ")[0]}!
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-6">
              Your review has been logged to AIRO Core. We appreciate your valuable feedback!
            </p>

            <div className="bg-slate-50 rounded-2xl p-3 text-left text-xs text-slate-600 space-y-1 mb-6 border border-slate-100">
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="font-semibold text-amber-500">{"★".repeat(rating)}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-semibold text-slate-800">{feedbackType}</span>
              </div>
              <div className="flex justify-between">
                <span>Store:</span>
                <span className="font-medium text-slate-700 truncate max-w-[170px]">{storeLocation}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1E3A5F] text-white text-xs font-semibold hover:bg-[#162C47] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Submit Another Feedback</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StoreFeedbackPage() {
  return (
    <main className="min-h-screen bg-[#1E3A5F] flex flex-col items-center justify-center p-3 sm:p-6 font-sans relative overflow-hidden selection:bg-[#1E3A5F]/20">
      {/* Soft Ambient Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <Suspense fallback={
        <div className="bg-white rounded-[32px] p-8 text-center text-slate-400 shadow-2xl">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1E3A5F]" />
        </div>
      }>
        <StoreFeedbackContent />
      </Suspense>
    </main>
  );
}
