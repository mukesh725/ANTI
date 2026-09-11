"use client";

import { useState } from "react";
import { 
  X, Check, ChevronRight, Lock, MapPin, Clock, Calendar, 
  CreditCard, FileText, CheckCircle2, AlertCircle, ExternalLink,
  ShieldCheck, User, ArrowRight
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface VisitChecklistData {
  id: string;
  type?: 'minute_clinic' | 'telemed' | 'health_scan';
  careOption?: 'virtual' | 'in-person' | 'scan';
  service: string;
  date: string;
  time: string;
  location?: string;
  status: string;
  patientName?: string;
  bookingReference?: string;
  meetingLink?: string;
  consentsCompleted?: boolean;
  paymentStatus?: 'paid' | 'pay_at_clinic' | 'member_covered';
}

interface VisitChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: VisitChecklistData | null;
  onCheckInSuccess?: (visitId: string) => void;
}

export default function VisitChecklistModal({
  isOpen,
  onClose,
  visit,
  onCheckInSuccess
}: VisitChecklistModalProps) {
  const [consentsSigned, setConsentsSigned] = useState(true);
  const [paymentOption, setPaymentOption] = useState<'clinic' | 'online' | 'member'>('member');
  const [isCheckedIn, setIsCheckedIn] = useState(
    visit?.status?.toLowerCase().includes("check") || false
  );
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'main' | 'consents' | 'payment'>('main');
  const [isCancelled, setIsCancelled] = useState(false);

  if (!isOpen || !visit) return null;

  const patientInitials = (visit.patientName || "Patient")
    .split(" ")
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      // 1. Update in Firestore
      const collectionName = visit.type === 'health_scan' ? 'healthBookings' : 'minute_clinic_bookings';
      const docRef = doc(db, collectionName, visit.id);
      await updateDoc(docRef, {
        status: "Checked In",
        checkedInAt: new Date().toISOString()
      });

      setIsCheckedIn(true);
      if (onCheckInSuccess) onCheckInSuccess(visit.id);
    } catch (err) {
      console.warn("Check-in local state fallback:", err);
      setIsCheckedIn(true);
      if (onCheckInSuccess) onCheckInSuccess(visit.id);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const collectionName = visit.type === 'health_scan' ? 'healthBookings' : 'minute_clinic_bookings';
      const docRef = doc(db, collectionName, visit.id);
      await updateDoc(docRef, {
        status: "Cancelled",
        cancelledAt: new Date().toISOString()
      });
      setIsCancelled(true);
      alert("Appointment has been cancelled.");
      onClose();
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      setIsCancelled(true);
      onClose();
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.location || "AIRO Minute Clinic")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Top Sticky Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">AIRO Minute Clinic Pre-Checklist</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto font-sans space-y-8">
          
          {/* Main SubView */}
          {activeSubView === 'main' && (
            <>
              {/* Header Hero */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-2">
                  Just a few more steps
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Complete your visit checklist before you arrive. When you get to the clinic, use the check-in button to let us know you're here.
                </p>

                {!isCheckedIn ? (
                  <button
                    onClick={() => {
                      const el = document.getElementById("checklist-items");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-[#006537] hover:bg-[#004e2a] text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    Start your visit checklist
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>You are checked in! Please have a seat in the waiting lounge.</span>
                  </div>
                )}
              </div>

              {/* Visit Checklist Section */}
              <div id="checklist-items" className="space-y-3 pt-2">
                <h2 className="text-base font-bold text-gray-900">Visit checklist</h2>

                {/* 1. Consents & Privacy Card */}
                <div 
                  onClick={() => setActiveSubView('consents')}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer bg-white flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
                        Consents & privacy <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="mt-1">
                        {consentsSigned ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Action needed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Consultation Payment (NO INSURANCE) Card */}
                <div 
                  onClick={() => setActiveSubView('payment')}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer bg-white flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
                        Consultation fee & payment <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="mt-1">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> {paymentOption === 'member' ? 'Covered by AIRO ONE' : paymentOption === 'clinic' ? 'Pay at Clinic' : 'Paid Online'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Check-In Card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isCheckedIn 
                    ? 'border-emerald-300 bg-emerald-50/50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCheckedIn ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCheckedIn ? <Check className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">Check in</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {isCheckedIn 
                            ? "You are checked in! The on-duty team is notified."
                            : "Let us know when you have arrived at the clinic."}
                        </p>
                      </div>
                    </div>

                    <div>
                      {!isCheckedIn ? (
                        <button
                          onClick={handleCheckIn}
                          disabled={isCheckingIn || !consentsSigned}
                          className="bg-[#006537] hover:bg-[#004e2a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 whitespace-nowrap active:scale-95"
                        >
                          {isCheckingIn ? "Checking in..." : "I'm Here — Check In"}
                        </button>
                      ) : (
                        <span className="bg-emerald-200/80 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          Checked In ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Details Section */}
              <div className="pt-2 border-t border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-4">Visit details</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-sm">
                      {patientInitials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{visit.patientName || "Valued Patient"}</p>
                      <p className="text-xs text-gray-500">{visit.service}</p>
                      {visit.bookingReference && (
                        <p className="text-[11px] font-mono text-gray-400">Ref: #{visit.bookingReference}</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleCancelAppointment}
                    className="text-xs text-gray-500 hover:text-red-600 font-medium underline flex items-center gap-1 transition-colors"
                  >
                    Cancel visit
                  </button>
                </div>
              </div>

              {/* Date and Location Section */}
              <div className="pt-2 border-t border-gray-100 space-y-4">
                <h2 className="text-base font-bold text-gray-900 mb-2">Date and location</h2>
                
                {/* When */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">When</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{visit.date} at {visit.time}</p>
                  </div>
                </div>

                {/* Where */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Where</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{visit.location || "AIRO Minute Clinic"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Walk-in consultation staffed by our on-duty clinical team.</p>
                    <a 
                      href={mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#006537] hover:underline mt-2"
                    >
                      Get directions <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SubView: Consents & Privacy */}
          {activeSubView === 'consents' && (
            <div className="space-y-6">
              <button 
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                &larr; Back to checklist
              </button>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consents & Privacy</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Please review the clinic treatment consents and patient privacy acknowledgments.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-3 leading-relaxed">
                <p>
                  <strong>1. General Consent for Treatment:</strong> You authorize the licensed healthcare professionals and duty physicians at AIRO Minute Clinic to perform clinical evaluations, diagnostic assessments, rapid point-of-care tests, and recommend treatments.
                </p>
                <p>
                  <strong>2. Digital Personal Data Protection (DPDP Act):</strong> Your health records, vital telemetry, and booking notes are stored under strict AES-256 encryption. They will never be shared or monetized.
                </p>
                <p>
                  <strong>3. On-Duty Clinical Care:</strong> You understand that in-person Minute Clinic care is rendered by our licensed medical officer or nurse practitioner on shift.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                <input 
                  type="checkbox" 
                  id="consentCheckbox"
                  checked={consentsSigned} 
                  onChange={e => setConsentsSigned(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="consentCheckbox" className="text-xs font-medium text-gray-800 cursor-pointer select-none">
                  I have read and agree to the Clinical Treatment Consent and Privacy Policy.
                </label>
              </div>

              <button
                onClick={() => setActiveSubView('main')}
                className="w-full bg-[#006537] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#004e2a] transition-colors"
              >
                Save & Return to Checklist
              </button>
            </div>
          )}

          {/* SubView: Payment (NO INSURANCE) */}
          {activeSubView === 'payment' && (
            <div className="space-y-6">
              <button 
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                &larr; Back to checklist
              </button>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consultation Payment</h2>
                <p className="text-xs text-gray-500 mt-1">
                  AIRO operates on transparent pricing with direct billing. No insurance paperwork required.
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: AIRO ONE Member */}
                <div 
                  onClick={() => setPaymentOption('member')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentOption === 'member' 
                      ? 'border-[#006537] bg-emerald-50/50 ring-1 ring-[#006537]' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">AIRO ONE Membership Benefit</p>
                      <p className="text-xs text-gray-500">Free unlimited Minute Clinic consultations included.</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700">₹0 / Covered</span>
                </div>

                {/* Option 2: Pay at Clinic */}
                <div 
                  onClick={() => setPaymentOption('clinic')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentOption === 'clinic' 
                      ? 'border-[#006537] bg-emerald-50/50 ring-1 ring-[#006537]' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">Pay at Clinic</p>
                      <p className="text-xs text-gray-500">Pay upon arrival via UPI (GPay/PhonePe), Card, or Cash.</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-900">₹299</span>
                </div>

                {/* Option 3: Pre-pay Online */}
                <div 
                  onClick={() => setPaymentOption('online')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentOption === 'online' 
                      ? 'border-[#006537] bg-emerald-50/50 ring-1 ring-[#006537]' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">Pre-paid Online</p>
                      <p className="text-xs text-gray-500">Consultation fee settled online during booking.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Settled</span>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Direct Transparency:</strong> We do not accept or bill US-style insurance. All prices are flat-rate, without hidden facility or out-of-pocket surprise fees.
                </p>
              </div>

              <button
                onClick={() => setActiveSubView('main')}
                className="w-full bg-[#006537] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#004e2a] transition-colors"
              >
                Confirm Payment Choice
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
