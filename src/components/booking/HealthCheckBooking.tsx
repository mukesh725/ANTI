"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, ChevronRight, ChevronLeft, CheckCircle2, Loader2, AlertCircle, Search, QrCode } from "lucide-react";

export function HealthCheckBooking() {
  const [activeTab, setActiveTab] = useState<"book" | "find">("book");
  
  // Booking State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<string[]>(["Kondapur", "Kompally"]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Kondapur");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookingReference, setBookingReference] = useState<string>("");
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10));
  const [isReserving, setIsReserving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    age: "",
    sex: "",
    height: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Verification State
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Lookup State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundBooking, setFoundBooking] = useState<any>(null);

  // We no longer pre-generate an array of 10 dates; 
  // the user selects any date from the native date picker.
  
  // Custom Calendar State
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 7, 1)); // Default to August 2026

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };
  
  const renderCustomCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    const minDate = new Date('2026-08-21T00:00:00');
    
    // Empty slots before 1st of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const current = new Date(year, month, i);
      const isPast = current < minDate;
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isSelected = selectedDate === dateString;
      
      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => {
            setSelectedDate(dateString);
            setSelectedSlot("");
          }}
          className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
            isSelected 
              ? 'bg-[#1C1C1E] text-white shadow-md transform scale-105' 
              : isPast 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-[#1C1C1E] hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    return (
      <div className="bg-white border border-[#1C1C1E]/10 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200">
            <ChevronLeft className="w-5 h-5 text-[#1C1C1E]" />
          </button>
          <div className="font-bold text-lg text-[#1C1C1E] font-serif tracking-wide">
            {monthNames[month]} {year}
          </div>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200">
            <ChevronRight className="w-5 h-5 text-[#1C1C1E]" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 justify-items-center">
          {days}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Fetch available locations
    const fetchLocations = async () => {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const locRef = doc(db, "settings", "locations");
        const locSnap = await getDoc(locRef);
        if (locSnap.exists() && locSnap.data().list?.length > 0) {
          const list = locSnap.data().list;
          setAvailableLocations(list);
          setSelectedLocation(list[0]);
        }
      } catch (err) {
        console.error("Failed to load locations", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedLocation && activeTab === "book") {
      setIsLoadingSlots(true);
      setError(null);
      fetch(`/api/bookings/available-slots?date=${selectedDate}&location=${encodeURIComponent(selectedLocation)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAvailableSlots(data.availableSlots);
          } else {
            setError(data.error || "Failed to load slots");
          }
        })
        .catch(err => {
          setError("Network error while loading slots");
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [selectedDate, selectedLocation, activeTab]);

  const fetchSlots = () => {
    if (!selectedDate || !selectedLocation) return;
    setIsLoadingSlots(true);
    fetch(`/api/bookings/available-slots?date=${selectedDate}&location=${encodeURIComponent(selectedLocation)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvailableSlots(data.availableSlots);
          if (selectedSlot && !data.availableSlots.includes(selectedSlot)) {
            setSelectedSlot("");
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingSlots(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send verification email. Please try again.");
      } else {
        setIsVerifyingEmail(true);
        setOtpCode(["", "", "", "", "", ""]);
        setOtpError("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    setIsVerifyingOtp(true);

    try {
      const otpString = otpCode.join("");
      const res = await fetch('/api/bookings/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otpString })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.error || "Invalid verification code");
        setIsVerifyingOtp(false);
      } else {
        // OTP is good, now finalize the booking
        await finalizeBooking();
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
      setIsVerifyingOtp(false);
    }
  };

  const finalizeBooking = async () => {
    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
          timeSlot: selectedSlot,
          location: selectedLocation,
          sessionId
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.isDuplicate) {
          setError("DUPLICATE_BOOKING");
        } else {
          setError(data.error || "Failed to book slot. Please try again.");
        }
        setIsVerifyingEmail(false);
      } else {
        setBookingReference(data.bookingReference);
        setStep(3); // Success step
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsVerifyingEmail(false);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSearching(true);
    setFoundBooking(null);

    try {
      const res = await fetch(`/api/bookings/lookup?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Booking not found.");
      } else {
        setFoundBooking(data.booking);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#1C1C1E]/10 flex flex-col">
      
      {/* TABS */}
      <div className="flex border-b border-[#1C1C1E]/10">
        <button 
          onClick={() => { setActiveTab("book"); setError(null); }}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "book" ? "bg-[#1C1C1E] text-white" : "bg-white text-[#1C1C1E]/50 hover:bg-gray-50"}`}
        >
          Book a Scan
        </button>
        <button 
          onClick={() => { setActiveTab("find"); setError(null); }}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "find" ? "bg-[#1C1C1E] text-white" : "bg-white text-[#1C1C1E]/50 hover:bg-gray-50"}`}
        >
          Find My Booking
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        
        {/* LEFT PANEL - INFO */}
        <div className="bg-[#1C1C1E] text-white p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-[9px] font-bold tracking-[0.25em] uppercase mb-8">
              Free Assessment
            </div>
            <h3 className="font-serif text-3xl mb-4">AIRO Health Scan</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Experience a clinical-grade health assessment in just 10 minutes. 
              Our advanced AIRO chair captures your vitals in real-time.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/50" />
                <span className="text-sm">10 Minute Session</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-white/50" />
                <span className="text-sm">Available 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-white/50" />
                <span className="text-sm">Fast QR Check-in</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Powered by AIRO Health</p>
          </div>
        </div>

        {/* RIGHT PANEL - CONTENT */}
        <div className="md:col-span-2 p-8 md:p-10 bg-[#FAFAFA]">
          <AnimatePresence mode="wait">
            
            {activeTab === "find" && (
              <motion.div
                key="find-booking"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h4 className="font-bold text-lg mb-4">Find Your Appointment</h4>
                <p className="text-[#1C1C1E]/60 text-sm mb-6">
                  Enter your mobile number, email, or Booking Reference to retrieve your QR code for in-store check-in.
                </p>

                <form onSubmit={handleSearch} className="mb-8 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1E]/40" />
                    <input 
                      required
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. SCN-XYZ123 or Mobile No."
                      className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#1C1C1E]"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="bg-[#1C1C1E] text-white px-6 rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                  </button>
                </form>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm mb-6">
                    {error}
                  </div>
                )}

                {foundBooking && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#1C1C1E]/10 rounded-2xl p-6 text-center shadow-sm"
                  >
                    <div className="mb-4">
                      <p className="text-[10px] text-[#1C1C1E]/50 uppercase tracking-widest font-bold mb-1">Booking Reference</p>
                      <p className="font-mono text-xl font-bold">{foundBooking.bookingReference}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl inline-block mb-6">
                      <img 
                        src={`/api/bookings/qr?ref=${foundBooking.bookingReference}`} 
                        alt="QR Code" 
                        className="w-48 h-48 mx-auto mix-blend-multiply" 
                      />
                      <p className="text-xs text-[#1C1C1E]/60 mt-2">Scan upon arrival</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left border-t border-[#1C1C1E]/10 pt-4">
                      <div>
                        <p className="text-[10px] text-[#1C1C1E]/50 uppercase tracking-widest font-bold">Patient</p>
                        <p className="font-medium">{foundBooking.firstName} {foundBooking.lastName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#1C1C1E]/50 uppercase tracking-widest font-bold">Status</p>
                        <p className="font-medium text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {foundBooking.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#1C1C1E]/50 uppercase tracking-widest font-bold">Date</p>
                        <p className="font-medium">{new Date(foundBooking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#1C1C1E]/50 uppercase tracking-widest font-bold">Time</p>
                        <p className="font-medium">{foundBooking.timeSlot}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 1: DATE & TIME */}
            {activeTab === "book" && step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="w-5 h-5 text-[#1C1C1E]" /> 
                    <h4 className="font-bold text-lg text-[#1C1C1E]">Select Location & Date</h4>
                  </div>
                  
                  <div className="mb-6">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50 mb-2 block">Clinic Location</label>
                    <select 
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setSelectedSlot("");
                      }}
                      className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 px-4 outline-none focus:border-[#1C1C1E] transition-colors"
                    >
                      {availableLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  
                  {renderCustomCalendar()}
                </div>

                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" /> Available Times
                    </h4>
                    
                    {isLoadingSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#1C1C1E]/50" />
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="bg-orange-50 text-orange-800 p-4 rounded-xl border border-orange-200 text-sm">
                        No slots available on this date. Please select another date.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all duration-300 ${
                              selectedSlot === slot
                                ? "border-[#1C1C1E] bg-[#1C1C1E] text-white"
                                : "border-[#1C1C1E]/20 bg-white text-[#1C1C1E] hover:border-[#1C1C1E]/50"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={async () => {
                      setIsReserving(true);
                      setError(null);
                      try {
                        const res = await fetch('/api/bookings/reserve-slot', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ date: selectedDate, timeSlot: selectedSlot, sessionId, location: selectedLocation })
                        });
                        const data = await res.json();
                        if (data.success) {
                          setStep(2);
                        } else {
                          setError(data.error || "Slot is currently reserved by someone else.");
                          fetchSlots();
                        }
                      } catch (err) {
                        setError("Network error. Please try again.");
                      } finally {
                        setIsReserving(false);
                      }
                    }}
                    disabled={!selectedDate || !selectedSlot || isReserving}
                    className="flex items-center gap-2 bg-[#1C1C1E] text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isReserving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Next Step"} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DETAILS */}
            {activeTab === "book" && step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8 flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#1C1C1E]/10">
                  <div className="w-10 h-10 bg-[#1C1C1E]/5 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#1C1C1E]/50 uppercase tracking-widest font-bold">Selected Slot</p>
                    <p className="font-serif font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })} at {selectedSlot}</p>
                    <p className="text-[10px] text-[#1C1C1E]/50 uppercase tracking-widest font-bold mt-1">Location: {selectedLocation}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setStep(1);
                      fetch('/api/bookings/release-slot', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ date: selectedDate, timeSlot: selectedSlot, sessionId, location: selectedLocation })
                      }).catch(console.error);
                    }} 
                    className="ml-auto text-xs underline text-[#1C1C1E]/50"
                  >
                    Edit
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error === "DUPLICATE_BOOKING" ? (
                    <div className="bg-[#0A84FF]/10 p-5 rounded-2xl border border-[#0A84FF]/20 text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <AlertCircle className="w-6 h-6 text-[#0A84FF]" />
                      </div>
                      <h4 className="font-serif text-lg text-gray-900 mb-2">You've already claimed your free scan!</h4>
                      <p className="text-sm text-gray-600 mb-4">Want more check-ups? Try out our membership benefits to get unlimited access.</p>
                      <a href="https://airoessentials.com/membership" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-[#0A84FF] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#0070E0] transition-colors">
                        View Membership Plans
                      </a>
                    </div>
                  ) : error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1E]/40" />
                        <input 
                          required
                          type="text"
                          value={formData.firstName}
                          onChange={e => setFormData({...formData, firstName: e.target.value})}
                          className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#1C1C1E] transition-colors"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1E]/40" />
                        <input 
                          required
                          type="text"
                          value={formData.lastName}
                          onChange={e => setFormData({...formData, lastName: e.target.value})}
                          className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#1C1C1E] transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">Date of Birth</label>
                      <input 
                        required
                        type="date"
                        value={formData.dob}
                        onChange={e => setFormData({...formData, dob: e.target.value})}
                        className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 px-4 outline-none focus:border-[#1C1C1E] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">Age</label>
                      <input 
                        required
                        type="number"
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 px-4 outline-none focus:border-[#1C1C1E] transition-colors"
                        placeholder="e.g. 65"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">Sex</label>
                      <div className="flex gap-4 pt-3">
                        {['Male', 'Female', 'Other'].map(option => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input 
                              required
                              type="radio" 
                              name="sex"
                              value={option}
                              checked={formData.sex === option}
                              onChange={e => setFormData({...formData, sex: e.target.value})}
                              className="w-4 h-4 text-[#1C1C1E] border-gray-300 focus:ring-[#1C1C1E]"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">Height</label>
                      <input 
                        required
                        type="text"
                        value={formData.height}
                        onChange={e => setFormData({...formData, height: e.target.value})}
                        className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 px-4 outline-none focus:border-[#1C1C1E] transition-colors"
                        placeholder="e.g. 5'10&quot; or 178cm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1E]/40" />
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#1C1C1E] transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1E]/40" />
                        <input 
                          required
                          type="tel"
                          value={formData.mobile}
                          onChange={e => setFormData({...formData, mobile: e.target.value})}
                          className="w-full bg-white border border-[#1C1C1E]/20 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#1C1C1E] transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  {isVerifyingEmail ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#1C1C1E]/10 space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#1C1C1E]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-6 h-6 text-[#1C1C1E]" />
                        </div>
                        <h4 className="font-serif text-xl font-bold mb-2">Check your email</h4>
                        <p className="text-sm text-[#1C1C1E]/60">
                          We've sent a 6-digit verification code to <br/>
                          <span className="font-bold text-[#1C1C1E]">{formData.email}</span>
                        </p>
                      </div>

                      {otpError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm text-center">
                          {otpError}
                        </div>
                      )}

                      <div className="flex justify-between gap-2 sm:gap-4 px-2 sm:px-8">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={otpCode[index]}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const newOtp = [...otpCode];
                              newOtp[index] = value;
                              setOtpCode(newOtp);
                              if (value && index < 5) {
                                document.getElementById(`otp-${index + 1}`)?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                                document.getElementById(`otp-${index - 1}`)?.focus();
                              }
                            }}
                            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1C1C1E] focus:bg-white outline-none transition-all"
                          />
                        ))}
                      </div>

                      <div className="pt-4 space-y-3">
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp || otpCode.some(d => !d)}
                          className="w-full flex items-center justify-center gap-2 bg-[#1C1C1E] text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isVerifyingOtp ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                          ) : (
                            "Verify & Confirm"
                          )}
                        </button>
                        
                        <div className="flex justify-between items-center px-2">
                          <button 
                            type="button"
                            onClick={() => setIsVerifyingEmail(false)}
                            className="text-xs text-[#1C1C1E]/50 hover:text-[#1C1C1E] font-bold uppercase tracking-widest underline underline-offset-4"
                          >
                            Back to Details
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => handleSubmit(e as any)}
                            className="text-xs text-[#1C1C1E]/50 hover:text-[#1C1C1E] font-bold uppercase tracking-widest underline underline-offset-4"
                          >
                            Resend Code
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-[#1C1C1E] text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Sending Verification...</>
                        ) : (
                          "Continue to Verification"
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS */}
            {activeTab === "book" && step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-4"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-serif text-2xl mb-2">Booking Confirmed!</h3>
                <p className="text-[#1C1C1E]/60 text-sm max-w-sm mb-6">
                  We've sent a confirmation email to {formData.email}. Please keep it safe.
                </p>

                <div className="bg-white border border-[#1C1C1E]/10 rounded-2xl p-6 shadow-sm w-full mb-6">
                  <p className="text-[10px] text-[#1C1C1E]/50 uppercase tracking-widest font-bold mb-1">Booking Reference</p>
                  <p className="font-mono text-xl font-bold mb-4">{bookingReference}</p>
                  
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl inline-block">
                    <img 
                      src={`/api/bookings/qr?ref=${bookingReference}`} 
                      alt="QR Code" 
                      className="w-40 h-40 mx-auto mix-blend-multiply" 
                    />
                    <p className="text-[10px] text-[#1C1C1E]/60 mt-2 uppercase tracking-widest font-bold">Scan in-store</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedSlot("");
                    setSelectedDate("");
                    setFormData({ firstName: "", lastName: "", email: "", mobile: "", dob: "", age: "", sex: "", height: "" });
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50 hover:text-[#1C1C1E] underline underline-offset-4"
                >
                  Book Another Slot
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
