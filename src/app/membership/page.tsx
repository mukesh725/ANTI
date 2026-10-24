"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  HeartHandshake, 
  Clock, 
  Check,
  ShoppingBag,
  Shield,
  Stethoscope,
  HeartPulse,
  Gift,
  Search,
  X,
  CreditCard,
  Download,
  Store
} from 'lucide-react';
import { MembershipPlanType, PendingRegistrationInput, MemberRecord } from '@/types/membership';

export default function MembershipPage() {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0); // 0 = Landing View, 1 = Personal Info, 2 = Plan Select, 3 = Confirmation
  const [isHealthDomain, setIsHealthDomain] = useState(false);
  const [isOneDomain, setIsOneDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Membership Lookup State (Self-service card retrieval for customers)
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<MemberRecord | null>(null);
  const [lookupError, setLookupError] = useState('');
  
  // Detect domain (AIRO Essentials vs AIRO Health vs AIRO ONE)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const port = window.location.port;
      if (host.includes("airohealth") || host.includes("health.airo") || port === "3001") {
        setIsHealthDomain(true);
      } else if (host.includes("airoone")) {
        setIsOneDomain(true);
      }
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState<PendingRegistrationInput>({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    dob: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    membershipPlan: 'AIRO ONE Select',
    billingCycle: 'Quarterly',
  });

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (profile || user) {
      setFormData(prev => ({
        ...prev,
        firstName: profile?.firstName || profile?.name?.split(' ')[0] || prev.firstName,
        lastName: profile?.lastName || profile?.name?.split(' ').slice(1).join(' ') || prev.lastName,
        email: profile?.email || user?.email || prev.email,
        mobile: profile?.mobile || prev.mobile,
      }));
    }
  }, [profile, user]);

  // Step 3 Result State
  const [registrationResult, setRegistrationResult] = useState<{
    registrationId: string;
    member: any;
  } | null>(null);

  const handleInputChange = (field: keyof PendingRegistrationInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const startRegistration = (planName?: MembershipPlanType, cycle?: 'Annual' | 'Quarterly') => {
    if (planName) {
      setFormData(prev => ({ 
        ...prev, 
        membershipPlan: planName,
        billingCycle: cycle || prev.billingCycle || 'Quarterly'
      }));
    } else if (cycle) {
      setFormData(prev => ({ ...prev, billingCycle: cycle }));
    }
    setCurrentStep(1);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) {
      setLookupError('Please enter your Mobile Number, Email, or Member ID');
      return;
    }

    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const res = await fetch(`/api/membership/list?q=${encodeURIComponent(lookupQuery.trim())}`);
      const data = await res.json();
      
      if (data.success && data.members && data.members.length > 0) {
        // Match exact or primary search candidate
        const found = data.members[0];
        setLookupResult(found);
      } else {
        setLookupError('No membership found matching your details. Please check your Mobile Number, Email, or Member ID.');
      }
    } catch (err) {
      console.error('Lookup Error:', err);
      setLookupError('Failed to lookup membership. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) return 'Please enter your First Name';
    if (!formData.lastName.trim()) return 'Please enter your Last Name';
    if (!formData.mobile.trim() || formData.mobile.trim().length < 10) return 'Please enter a valid 10-digit Mobile Number';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid Email Address';
    if (!formData.dob) return 'Please select your Date of Birth';
    if (!formData.address.trim()) return 'Please enter your Full Address';
    return null;
  };

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep1();
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg('');
    setCurrentStep(2);
  };

  const handleSubmitRegistration = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/membership/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setRegistrationResult({
        registrationId: data.registrationId,
        member: data.member,
      });
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Submission Error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Domain-Aware Header Logo */}
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-3 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-lg mb-4">
            <img 
              src="/airo-1-logo.png" 
              alt="AIRO 1" 
              className="h-10 md:h-14 mx-auto object-contain"
            />
          </div>

          {/* Lookup Membership Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => {
                setShowLookupModal(true);
                setLookupResult(null);
                setLookupError('');
                setLookupQuery(profile?.email || user?.email || '');
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold shadow-sm transition-all hover:scale-105"
            >
              <Search className="w-3.5 h-3.5 text-[#006537]" /> Already a Member? Check Status &amp; View Digital Card
            </button>
          </div>
        </div>

        {/* LANDING SECTION */}
        {currentStep === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-24 mb-16"
          >
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto">
              <span className="bg-[#006537] text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-widest uppercase mb-6 inline-block shadow-sm">
                AIRO ONE™
              </span>
              <h1 className="text-4xl md:text-6xl font-semibold text-[#006537] mb-6 tracking-tight leading-tight">
                One Membership. Complete Health. Everyday Savings.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                AIRO ONE™ is an integrated healthcare membership that brings together healthy shopping, pharmacy savings, doctor consultations, telemedicine, diagnostics, preventive health screenings, and digital healthcare—all under one membership.
              </p>
              
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => startRegistration()}
                  className="bg-[#006537] text-white px-10 py-5 rounded-full text-xl font-medium hover:bg-[#004e2a] transition-all flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View Plans &amp; Join <ArrowRight size={24} />
                </button>
              </div>
            </div>

            {/* Membership Comparison Table Section */}
            <div>
              <div className="text-center mb-10">
                <span className="bg-emerald-100 text-[#006537] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                  🏪 In-Store Membership &amp; Flexible Payments
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#006537] mb-3">Membership Comparison</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                  Choose between annual or quarterly payments. Memberships are enrolled and paid in-store (Cash, UPI, or Card) at any AIRO Clinic or Pharmacy.
                </p>
              </div>

              {/* AIRO ONE™ AT A GLANCE */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                  { tier: "SELECT", price: "₹1,999", quarterly: "₹590", desc: "Only 1 Member", border: "border-gray-200" },
                  { tier: "PREFERRED", price: "₹3,999", quarterly: "₹1,180", desc: "You + 1 Member", border: "border-[#006537]/40 bg-green-50/50" },
                  { tier: "SIGNATURE", price: "₹6,999", quarterly: "₹2,065", desc: "You + 3 Members", border: "border-amber-200" },
                  { tier: "INFINITE", price: "₹8,999", quarterly: "₹2,655", desc: "You + 5 Members", border: "border-emerald-300 bg-emerald-50/30" }
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl bg-white border ${item.border} shadow-sm text-center relative`}>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.tier}</span>
                    <div className="text-2xl font-extrabold text-[#006537] mb-0.5">{item.quarterly} <span className="text-xs font-semibold text-gray-500">/ qtr</span></div>
                    <span className="inline-block text-[10px] font-bold text-[#006537] bg-green-50 border border-[#006537]/20 px-2 py-0.5 rounded-full mb-1">
                      INCL. 18% GST
                    </span>
                    <div className="text-[11px] text-gray-500 font-medium">or {item.price}/yr (+ GST)</div>
                    <div className="text-xs text-gray-600 font-medium mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Mobile View - Cards */}
              <div className="lg:hidden space-y-6 mb-8">
                {[
                  {
                    name: "AIRO ONE™ Select", price: "₹1,999", quarterly: "₹590 / quarter (INCL. 18% GST)", members: "Only One (1 Member)",
                    freeMeds: "—", pharmacy: "Up to 60%+*", doc: "3 / Year",
                    tele: "3 / Year", screen: "4 / Year", checkup: "—",
                    diet: "—", delivery: "Free Above ₹1,000", ambulance: "—", care365: "—", senior: "✔ Included", 
                    app: "✔ Included", payment: "🏪 In-Store Only (Cash, UPI, Card)",
                    bg: "bg-white", highlight: false
                  },
                  {
                    name: "AIRO ONE™ Preferred", price: "₹3,999", quarterly: "₹1,180 / quarter (INCL. 18% GST)", members: "You + 1 (2 Members)",
                    freeMeds: "1 Member Covered (350+ Meds)", pharmacy: "Up to 60%+*", doc: "6 / Year",
                    tele: "6 / Year", screen: "10 / Year", checkup: "You (1 Member / Year)",
                    diet: "3 / Year", delivery: "Free Above ₹1,000", ambulance: "—", care365: "—", senior: "✔ Included", 
                    app: "✔ Included", payment: "🏪 In-Store Only (Cash, UPI, Card)",
                    bg: "bg-green-50 border-[#006537]/20", highlight: true
                  },
                  {
                    name: "AIRO ONE™ Signature", price: "₹6,999", quarterly: "₹2,065 / quarter (INCL. 18% GST)", members: "You + 3 (4 Members)",
                    freeMeds: "2 Members Covered (350+ Meds)", pharmacy: "Up to 60%+*", doc: "10 / Year",
                    tele: "10 / Year", screen: "Unlimited", checkup: "You + 1 (2 Members / Year)",
                    diet: "6 / Year", delivery: "Unlimited Free", ambulance: "Included", care365: "Included", senior: "✔ Included", 
                    app: "✔ Included", payment: "🏪 In-Store Only (Cash, UPI, Card)",
                    bg: "bg-white", highlight: false
                  },
                  {
                    name: "AIRO ONE™ Infinite", price: "₹8,999", quarterly: "₹2,655 / quarter (INCL. 18% GST)", members: "You + 5 (6 Members)",
                    freeMeds: "4 Members Covered (350+ Meds)", pharmacy: "Up to 60%+*", doc: "12 / Year",
                    tele: "Unlimited", screen: "Unlimited", checkup: "You + 3 (4 Members / Year)",
                    diet: "10 / Year", delivery: "Unlimited Free", ambulance: "Included", care365: "Included", senior: "✔ Included", 
                    app: "✔ Included", payment: "🏪 In-Store Only (Cash, UPI, Card)",
                    bg: "bg-emerald-50/60 border-emerald-500/30", highlight: false
                  }
                ].map((plan, idx) => (
                  <div key={idx} className={`${plan.bg} rounded-3xl shadow-md border ${plan.highlight ? 'border-[#006537]/30 border-2' : 'border-gray-100'} p-6 relative`}>
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006537] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        ⭐ Most Popular
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-center mb-1 text-[#006537]">{plan.name}</h3>
                    <div className="text-center mb-1">
                      <span className="text-2xl font-extrabold text-gray-900">{plan.quarterly.split(' ')[0]}</span>
                      <span className="text-xs text-gray-500 font-medium"> / quarter</span>
                      <div className="text-[10px] font-bold text-[#006537] mt-0.5">★ INCL. 18% GST</div>
                    </div>
                    <div className="text-center text-xs text-gray-500 font-medium mb-6">or {plan.price} / year (+ GST)</div>
                    
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Payment Mode", val: plan.payment },
                        { label: "Members Covered", val: plan.members },
                        { label: "*Free Medication", val: plan.freeMeds },
                        { label: "Pharmacy Discount*", val: plan.pharmacy },
                        { label: "In-Store Doctor Consults", val: plan.doc },
                        { label: "Telemedicine Consults", val: plan.tele },
                        { label: "Praana Screenings", val: plan.screen },
                        { label: "Preventive Health Check", val: plan.checkup },
                        { label: "Dietitian Consults", val: plan.diet },
                        { label: "Medicine Home Delivery", val: plan.delivery },
                        { label: "Ambulance Assistance", val: plan.ambulance },
                        { label: "AIRO Care365™", val: plan.care365 },
                        { label: "Senior Citizens Care", val: plan.senior },
                        { label: "App & Reminders", val: plan.app },
                      ].map((feature, i) => (
                        <div key={i} className={`flex flex-col py-2.5 border-b border-black/5 last:border-0 ${feature.label.includes('Care365') ? 'bg-[#D02029]/5 px-4 -mx-4 rounded-xl border-y border-[#D02029]/20 my-1' : feature.label.includes('Senior') ? 'bg-[#006537]/5 px-4 -mx-4 rounded-xl border-y border-[#006537]/20 my-1' : feature.label.includes('Free Medication') ? 'bg-amber-50/70 px-4 -mx-4 rounded-xl border-y border-amber-200/60 my-1' : ''}`}>
                          <div className="flex justify-between items-center w-full">
                            {feature.label.includes('Care365') || feature.label.includes('Senior') ? (
                              <a href={feature.label.includes('Care365') ? '#airo-care365' : '#senior-citizens-care'} className={`pr-4 font-bold ${feature.label.includes('Care365') ? 'text-[#D02029]' : 'text-[#006537]'} hover:underline block`}>
                                {feature.label}
                              </a>
                            ) : (
                              <span className={`pr-4 ${feature.label.includes('Free Medication') ? 'font-bold text-amber-900' : 'text-gray-600'}`}>{feature.label}</span>
                            )}
                            <span className={`font-semibold text-right ${feature.val.includes('✔') || feature.val.includes('Unlimited') || feature.val.includes('Included') || feature.val.includes('Covered') ? 'text-[#006537]' : ''} ${feature.val === '—' ? 'text-gray-400' : ''}`}>
                              {feature.val === '✔ Included' ? <Check className="inline text-[#006537]" size={18}/> : feature.val}
                            </span>
                          </div>
                          {(feature.label.includes('Care365') || feature.label.includes('Senior')) && (
                            <a href={feature.label.includes('Care365') ? '#airo-care365' : '#senior-citizens-care'} className={`text-xs mt-1 font-medium hover:underline ${feature.label.includes('Care365') ? 'text-[#D02029]/80' : 'text-[#006537]/80'}`}>
                              Scroll down to view more details ↓
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-2">
                      <button 
                        onClick={() => startRegistration(plan.name.replace('™', '') as MembershipPlanType, 'Quarterly')} 
                        className="w-full bg-[#006537] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#004e2a] transition-all shadow-md"
                      >
                        Join {plan.name.split(' ')[2]} (Quarterly: {plan.quarterly.split(' ')[0]})
                      </button>
                      <button 
                        onClick={() => startRegistration(plan.name.replace('™', '') as MembershipPlanType, 'Annual')} 
                        className="w-full bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-200 transition-all"
                      >
                        Join Annual ({plan.price}/yr)
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-5 font-semibold text-gray-700 w-1/4">Benefits</th>
                      <th className="p-5 font-semibold text-center text-[#006537]">AIRO ONE™ Select</th>
                      <th className="p-5 font-semibold text-center text-[#006537] bg-green-50">AIRO ONE™ Preferred</th>
                      <th className="p-5 font-semibold text-center text-[#006537]">AIRO ONE™ Signature</th>
                      <th className="p-5 font-semibold text-center text-[#006537] bg-emerald-50">AIRO ONE™ Infinite</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {/* Quarterly Payment Row */}
                    <tr className="bg-emerald-50/40">
                      <td className="p-5 font-bold text-gray-900">
                        Quarterly Payment Option
                        <span className="block text-xs font-semibold text-[#006537] mt-0.5">Pay every 3 months • All taxes included</span>
                      </td>
                      <td className="p-5 text-center font-extrabold text-lg text-[#006537]">
                        ₹590 <span className="text-xs font-normal text-gray-500">/ qtr</span>
                        <div className="text-[10px] font-bold text-[#006537] mt-0.5 bg-green-100/70 inline-block px-2 py-0.5 rounded-full">INCL. 18% GST</div>
                      </td>
                      <td className="p-5 text-center font-extrabold text-lg text-[#006537] bg-green-100/30">
                        ₹1,180 <span className="text-xs font-normal text-gray-500">/ qtr</span>
                        <div className="text-[10px] font-bold text-[#006537] mt-0.5 bg-green-100/70 inline-block px-2 py-0.5 rounded-full">INCL. 18% GST</div>
                      </td>
                      <td className="p-5 text-center font-extrabold text-lg text-[#006537]">
                        ₹2,065 <span className="text-xs font-normal text-gray-500">/ qtr</span>
                        <div className="text-[10px] font-bold text-[#006537] mt-0.5 bg-green-100/70 inline-block px-2 py-0.5 rounded-full">INCL. 18% GST</div>
                      </td>
                      <td className="p-5 text-center font-extrabold text-lg text-[#006537] bg-emerald-50">
                        ₹2,655 <span className="text-xs font-normal text-gray-500">/ qtr</span>
                        <div className="text-[10px] font-bold text-[#006537] mt-0.5 bg-green-100/70 inline-block px-2 py-0.5 rounded-full">INCL. 18% GST</div>
                      </td>
                    </tr>

                    {/* Annual Fee Row */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 font-medium text-gray-700">
                        Annual Membership Fee
                        <span className="block text-xs font-normal text-gray-500 mt-0.5">(+ GST applicable for all plans)</span>
                      </td>
                      <td className="p-5 text-center font-bold text-lg">
                        ₹1,999
                        <div className="text-[11px] font-normal text-gray-500 mt-0.5">+ GST applicable</div>
                      </td>
                      <td className="p-5 text-center font-bold text-lg bg-green-50 text-[#006537]">
                        ₹3,999
                        <div className="text-[11px] font-normal text-gray-500 mt-0.5">+ GST applicable</div>
                      </td>
                      <td className="p-5 text-center font-bold text-lg">
                        ₹6,999
                        <div className="text-[11px] font-normal text-gray-500 mt-0.5">+ GST applicable</div>
                      </td>
                      <td className="p-5 text-center font-bold text-lg bg-emerald-50 text-[#006537]">
                        ₹8,999
                        <div className="text-[11px] font-normal text-gray-500 mt-0.5">+ GST applicable</div>
                      </td>
                    </tr>

                    {/* In-Store Payment Mode Row */}
                    <tr className="bg-amber-50/50">
                      <td className="p-5 font-semibold text-amber-950 flex items-center gap-2">
                        <Store className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Payment &amp; Activation</span>
                      </td>
                      <td className="p-5 text-center text-xs font-bold text-amber-900">🏪 In-Store Only<div className="font-normal text-[10px] text-gray-500">Cash / UPI / Card</div></td>
                      <td className="p-5 text-center text-xs font-bold text-amber-900 bg-green-50">🏪 In-Store Only<div className="font-normal text-[10px] text-gray-500">Cash / UPI / Card</div></td>
                      <td className="p-5 text-center text-xs font-bold text-amber-900">🏪 In-Store Only<div className="font-normal text-[10px] text-gray-500">Cash / UPI / Card</div></td>
                      <td className="p-5 text-center text-xs font-bold text-amber-900 bg-emerald-50">🏪 In-Store Only<div className="font-normal text-[10px] text-gray-500">Cash / UPI / Card</div></td>
                    </tr>

                    {/* Members Covered */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">Members Covered</td>
                      <td className="p-5 text-center font-semibold">Only One<div className="text-xs text-gray-400 font-normal">For Individuals</div></td>
                      <td className="p-5 text-center bg-green-50 font-semibold text-[#006537]">You + 1<div className="text-xs text-gray-400 font-normal">2 Members Total</div></td>
                      <td className="p-5 text-center font-semibold text-[#006537]">You + 3<div className="text-xs text-gray-400 font-normal">4 Members Total</div></td>
                      <td className="p-5 text-center bg-emerald-50 font-semibold text-[#006537]">You + 5<div className="text-xs text-gray-400 font-normal">6 Members Total</div></td>
                    </tr>

                    {/* Free Medication Row */}
                    <tr className="hover:bg-gray-50 bg-amber-50/40">
                      <td className="p-5 font-bold text-amber-950">
                        *Free Medication for Members
                        <span className="block text-xs font-normal text-amber-800 mt-0.5">350+ chronic disease medicines 100% free</span>
                      </td>
                      <td className="p-5 text-center text-gray-400">—</td>
                      <td className="p-5 text-center bg-green-50 font-bold text-[#006537]">1 Member Covered</td>
                      <td className="p-5 text-center font-bold text-[#006537]">2 Members Covered</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">4 Members Covered</td>
                    </tr>

                    {/* Pharmacy Discount */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">*AIRO Pharmacy Discount</td>
                      <td className="p-5 text-center font-semibold text-[#006537]">Up to 60%+</td>
                      <td className="p-5 text-center font-semibold bg-green-50 text-[#006537]">Up to 60%+</td>
                      <td className="p-5 text-center font-semibold text-[#006537]">Up to 60%+</td>
                      <td className="p-5 text-center font-semibold bg-emerald-50 text-[#006537]">Up to 60%+</td>
                    </tr>

                    {/* Doctor Consultations */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">Free In-Store Doctor Consultations</td>
                      <td className="p-5 text-center font-medium">3 / Year</td>
                      <td className="p-5 text-center bg-green-50 font-medium text-[#006537]">6 / Year</td>
                      <td className="p-5 text-center font-bold text-[#006537]">10 / Year</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">12 / Year</td>
                    </tr>

                    {/* Telemedicine */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">Free Telemedicine Consultations</td>
                      <td className="p-5 text-center font-medium">3 / Year</td>
                      <td className="p-5 text-center bg-green-50 font-medium text-[#006537]">6 / Year</td>
                      <td className="p-5 text-center font-bold text-[#006537]">10 / Year</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">Unlimited</td>
                    </tr>

                    {/* Praana Screenings */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">AIRO Praana™ Health Screenings</td>
                      <td className="p-5 text-center font-medium">4 / Year</td>
                      <td className="p-5 text-center bg-green-50 font-medium text-[#006537]">10 / Year</td>
                      <td className="p-5 text-center font-bold text-[#006537]">Unlimited</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">Unlimited</td>
                    </tr>

                    {/* Health Checkup */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">Annual Preventive Health Check-up</td>
                      <td className="p-5 text-center text-gray-400">—</td>
                      <td className="p-5 text-center bg-green-50 font-semibold text-[#006537]">You (1 Member / Yr)</td>
                      <td className="p-5 text-center font-semibold text-[#006537]">You + 1 (2 Members / Yr)</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">You + 3 (4 Members / Yr)</td>
                    </tr>

                    {/* Dietitian */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">Dietitian Consultations</td>
                      <td className="p-5 text-center text-gray-400">—</td>
                      <td className="p-5 text-center bg-green-50 font-semibold text-[#006537]">3 / Year</td>
                      <td className="p-5 text-center font-semibold text-[#006537]">6 / Year</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">10 / Year</td>
                    </tr>

                    {/* Home Delivery */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">Medicine Home Delivery</td>
                      <td className="p-5 text-center">Free Above ₹1,000</td>
                      <td className="p-5 text-center bg-green-50">Free Above ₹1,000</td>
                      <td className="p-5 text-center font-semibold text-[#006537]">Unlimited Free</td>
                      <td className="p-5 text-center bg-emerald-50 font-semibold text-[#006537]">Unlimited Free</td>
                    </tr>

                    {/* Ambulance Assistance */}
                    <tr className="hover:bg-gray-50">
                      <td className="p-5 text-gray-600">Ambulance Assistance</td>
                      <td className="p-5 text-center text-gray-400">—</td>
                      <td className="p-5 text-center text-gray-400 bg-green-50">—</td>
                      <td className="p-5 text-center font-bold text-[#006537]">Included</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">Included</td>
                    </tr>

                    {/* Emergency Support Care365 */}
                    <tr className="hover:bg-gray-50 bg-[#D02029]/5 border-y border-[#D02029]/20">
                      <td className="p-5">
                        <a href="#airo-care365" className="block hover:opacity-80">
                          <div className="font-bold text-[#D02029] hover:underline">AIRO Care365™ (24/7 Emergency Support)</div>
                          <div className="text-xs text-[#D02029]/80 mt-1.5 font-medium hover:underline">Scroll down to view more details ↓</div>
                        </a>
                      </td>
                      <td className="p-5 text-center text-gray-400">—</td>
                      <td className="p-5 text-center text-gray-400 bg-green-50">—</td>
                      <td className="p-5 text-center font-bold text-[#D02029]">Included</td>
                      <td className="p-5 text-center bg-emerald-50 font-bold text-[#D02029]">Included</td>
                    </tr>

                    {/* Senior Citizens Care */}
                    <tr className="hover:bg-gray-50 bg-[#006537]/5 border-y border-[#006537]/20">
                      <td className="p-5">
                        <a href="#senior-citizens-care" className="block hover:opacity-80">
                          <div className="font-bold text-[#006537] hover:underline">Senior Citizens Care (60+ Years)</div>
                          <div className="text-xs text-[#006537]/80 mt-1.5 font-medium hover:underline">Scroll down to view more details ↓</div>
                        </a>
                      </td>
                      <td className="p-5 text-center font-semibold text-[#006537]">✔ Included</td>
                      <td className="p-5 text-center font-semibold bg-green-50 text-[#006537]">✔ Included</td>
                      <td className="p-5 text-center font-semibold text-[#006537]">✔ Included</td>
                      <td className="p-5 text-center font-semibold bg-emerald-50 text-[#006537]">✔ Included</td>
                    </tr>

                    {[
                      "AIRO App (Digital Health Records)",
                      "Health & Medication Reminders"
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-5 text-gray-600">{item}</td>
                        <td className="p-5 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                        <td className="p-5 text-center bg-green-50"><Check className="inline text-[#006537]" size={20}/></td>
                        <td className="p-5 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                        <td className="p-5 text-center bg-emerald-50"><Check className="inline text-[#006537]" size={20}/></td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="p-5"></td>
                      <td className="p-5 text-center">
                        <button 
                          onClick={() => startRegistration('AIRO ONE Select', 'Quarterly')} 
                          className="bg-[#006537] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#004e2a] transition-all"
                        >
                          Join Select (₹590/qtr)
                        </button>
                      </td>
                      <td className="p-5 text-center bg-green-50">
                        <button 
                          onClick={() => startRegistration('AIRO ONE Preferred', 'Quarterly')} 
                          className="bg-[#006537] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#004e2a] transition-all shadow-md"
                        >
                          Join Preferred (₹1,180/qtr)
                        </button>
                      </td>
                      <td className="p-5 text-center">
                        <button 
                          onClick={() => startRegistration('AIRO ONE Signature', 'Quarterly')} 
                          className="bg-[#006537] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#004e2a] transition-all"
                        >
                          Join Signature (₹2,065/qtr)
                        </button>
                      </td>
                      <td className="p-5 text-center bg-emerald-50">
                        <button 
                          onClick={() => startRegistration('AIRO ONE Infinite', 'Quarterly')} 
                          className="bg-[#006537] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#004e2a] transition-all shadow-md"
                        >
                          Join Infinite (₹2,655/qtr)
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pharmacy Discount Disclaimer */}
              <div className="mt-4 text-xs text-gray-500 max-w-4xl mx-auto px-4">
                <p><strong>* AIRO Pharmacy Discount:</strong> Members receive up to 60%+ savings on eligible generic medicines and selected AIRO Pharmacy products. Discounts vary based on product category, prescription requirements, manufacturer pricing, applicable government regulations, promotional offers, and availability.</p>
              </div>
            </div>

            {/* Senior Citizens Care */}
            <div id="senior-citizens-care" className="bg-[#004e2a] text-white p-8 md:p-12 rounded-3xl shadow-xl scroll-mt-24">
              <h2 className="text-3xl font-semibold mb-6">Senior Citizens Care (Age 60+)</h2>
              <p className="text-lg opacity-90 mb-10 max-w-4xl">
                Every AIRO ONE™ Membership includes exclusive healthcare benefits for senior citizens aged 60 years and above.
              </p>
              
              <div className="bg-white/10 p-6 rounded-2xl">
                <h3 className="font-semibold text-xl mb-4 text-green-200">Included Benefits</h3>
                <ul className="space-y-4 opacity-95">
                  <li className="flex gap-3">
                    <span className="mt-1">✅</span>
                    <div>
                      <strong className="block text-lg">75% OFF routine diagnostic tests including:</strong>
                      <ul className="list-disc ml-5 mt-2 space-y-1 opacity-90 text-sm">
                        <li>Blood Glucose</li>
                        <li>HbA1c</li>
                        <li>Kidney Function Tests (KFT)</li>
                        <li>Thyroid Function Tests (TSH)</li>
                        <li>Urine Routine Examination</li>
                        <li>Other routine preventive blood investigations</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1">✅</span>
                    <strong className="text-lg">50% OFF in-store doctor consultations.</strong>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1">✅</span>
                    <span className="text-base">Benefits are available alongside the member's AIRO Pharmacy Discount and other eligible AIRO ONE™ membership benefits.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* AIRO Praana™ Health Screening */}
            <div className="bg-gradient-to-r from-emerald-900 to-[#006537] text-white p-8 md:p-12 rounded-3xl shadow-xl">
              <div className="max-w-3xl mb-8">
                <span className="bg-white/20 text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                  AIRO PRAANA™ HEALTH SCREENING
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Quick. Easy. Essential.</h2>
                <p className="text-emerald-100 text-lg">Know Your Numbers. Take Charge.</p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                  'Blood Pressure',
                  'Heart Rate & ECG',
                  'SpO₂ / Oxygen Saturation',
                  'Respiratory Rate',
                  'Temperature',
                  'Weight & BMI',
                  'Diabetes Risk Assessment',
                  'Cardiovascular Risk Assessment',
                  'AIRO Praana™ Health Score'
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
                    <Check className="text-emerald-300 w-4 h-4 shrink-0" />
                    <span className="font-medium text-white">{check}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AIRO HEALTH™ Comprehensive Preventive Health Assessment */}
            <div className="bg-[#004e2a] text-white p-8 md:p-12 rounded-3xl shadow-xl">
              <span className="bg-white/20 text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                AIRO HEALTH™
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Comprehensive Preventive Health Assessment</h2>
              <p className="text-green-200 text-lg mb-4">Screen Early. Know Your Health. Prevent Better.</p>
              <p className="text-sm md:text-base opacity-90 mb-10 max-w-4xl leading-relaxed">
                A complete preventive health evaluation combining advanced body composition analysis, vital health measurements, and essential laboratory testing to provide a detailed picture of your health.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">1. Health &amp; Lifestyle</h3>
                  <p className="opacity-90 leading-relaxed text-xs">Comprehensive review of health, lifestyle and preventive-care factors.</p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">2. Vital Signs &amp; BMI</h3>
                  <ul className="space-y-1.5 opacity-90 text-xs">
                    <li>• Blood Pressure &amp; Heart Rate</li>
                    <li>• Respiratory Rate &amp; SpO₂</li>
                    <li>• Temperature, Height, Weight &amp; BMI</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">3. Blood &amp; Urine Tests</h3>
                  <ul className="space-y-1.5 opacity-90 text-xs">
                    <li>• CBC / Hemogram</li>
                    <li>• Complete Urinalysis</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">4. Diabetes &amp; Cardio</h3>
                  <ul className="space-y-1.5 opacity-90 text-xs">
                    <li>• Fasting Blood Glucose</li>
                    <li>• HbA1c</li>
                    <li>• Complete Lipid Profile</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">5. Organ Health</h3>
                  <ul className="space-y-1.5 opacity-90 text-xs">
                    <li>• Liver Function Tests (LFT)</li>
                    <li>• Kidney Function Tests (KFT)</li>
                    <li>• Electrolytes &amp; TSH (Thyroid)</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">6. Vitamins &amp; Nutrition</h3>
                  <ul className="space-y-1.5 opacity-90 text-xs">
                    <li>• Vitamin D &amp; Vitamin B12</li>
                    <li>• Folate, Iron &amp; Ferritin</li>
                    <li>• Calcium &amp; Magnesium</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">7. Physical Examination</h3>
                  <p className="opacity-90 leading-relaxed text-xs">Comprehensive physical assessment as part of the preventive evaluation.</p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">8. Age &amp; Risk Screening</h3>
                  <p className="opacity-90 leading-relaxed text-xs">Additional preventive screening based on age and individual risk factors.</p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-bold mb-3 text-green-200">9. Doctor Review</h3>
                  <p className="opacity-90 leading-relaxed text-xs">Professional doctor review with a personalized health summary report.</p>
                </div>
              </div>
            </div>

            {/* AIRO Care365 - Exclusive to Signature & Infinite */}
            <div id="airo-care365" className="bg-[#D02029] text-white p-8 md:p-12 rounded-3xl shadow-xl mt-12 scroll-mt-24">
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block">
                Exclusive to AIRO ONE™ Signature &amp; Infinite
              </span>
              <h2 className="text-3xl font-bold mb-2">AIRO Care365™</h2>
              <p className="text-xl font-semibold mb-2">24/7 Emergency Support Membership</p>
              <p className="text-lg opacity-90 mb-10 max-w-4xl">
                Care Every Day. Support When You Need It Most.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 text-sm">
                <div className="bg-white/10 p-6 rounded-2xl">
                  <div className="text-4xl mb-4">🚨</div>
                  <h3 className="text-xl font-bold mb-4">24/7 Response Coordination</h3>
                  <ul className="space-y-3 opacity-90">
                    <li>• Dedicated AIRO Emergency Support Line</li>
                    <li>• Immediate assistance during medical emergencies</li>
                    <li>• Rapid coordination with emergency services, hospitals, and designated family members</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/30">
                  <div className="text-4xl mb-4">🚑</div>
                  <h3 className="text-xl font-bold mb-4">Ambulance Assistance</h3>
                  <ul className="space-y-3 opacity-90">
                    <li>• Priority ambulance coordination</li>
                    <li>• Assistance in arranging transportation to the nearest appropriate hospital</li>
                    <li>• Real-time support from the moment you call until you reach medical care</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl">
                  <div className="text-4xl mb-4">👨‍⚕️</div>
                  <h3 className="text-xl font-bold mb-4">AIRO Doctor Emergency Support</h3>
                  <ul className="space-y-3 opacity-90">
                    <li>• Immediate access to an AIRO doctor via teleconsultation during emergencies</li>
                    <li>• Medical guidance for patients and caregivers</li>
                    <li>• Coordination with hospital teams using your AIRO Health Profile, when available</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 bg-black/20 p-6 rounded-2xl text-center">
                <p className="text-base font-medium opacity-100">
                  Because AIRO knows your health history, medications, allergies, and medical conditions, we can help coordinate your care faster when every minute matters.
                </p>
              </div>
            </div>

            {/* Every Membership Includes Grid */}
            <div>
              <h2 className="text-3xl font-semibold text-center mb-10 text-[#006537]">Every AIRO ONE™ Membership Includes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: <ShoppingBag />, text: 'Savings at AIRO Essentials Grocery' },
                  { icon: <Shield />, text: 'Exclusive Pharmacy Benefits' },
                  { icon: <Stethoscope />, text: 'Doctor & Telemedicine Access' },
                  { icon: <HeartPulse />, text: 'AIRO Praana™ Screenings' },
                  { icon: <CheckCircle2 />, text: 'AIRO App & Digital Records' },
                  { icon: <Gift />, text: 'Birthday & Exclusive Rewards' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                    <div className="text-[#006537] bg-green-50 p-3 rounded-full">{item.icon}</div>
                    <span className="font-semibold text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>


          </motion.div>
        )}

        {/* REGISTRATION FORM & STEPPER CONTAINER */}
        <div ref={formSectionRef}>
          {currentStep > 0 && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-[#006537] -translate-y-1/2 z-0 transition-all duration-500" 
                  style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                />

                <div className={`relative z-10 flex flex-col items-center cursor-pointer`} onClick={() => setCurrentStep(1)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep >= 1 ? 'bg-[#006537] text-white ring-4 ring-[#006537]/20' : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <span className="mt-2 text-xs font-semibold text-gray-700">Personal Details</span>
                </div>

                <div className={`relative z-10 flex flex-col items-center cursor-pointer`} onClick={() => setCurrentStep(2)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep >= 2 ? 'bg-[#006537] text-white ring-4 ring-[#006537]/20' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className="mt-2 text-xs font-semibold text-gray-700">Plan Confirmation</span>
                </div>

                <div className={`relative z-10 flex flex-col items-center`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep === 3 ? 'bg-[#006537] text-white ring-4 ring-[#006537]/20' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                  <span className="mt-2 text-xs font-semibold text-gray-700">Application Submitted</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Personal Details Form */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 max-w-3xl mx-auto"
            >
              <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Step 1: Customer Details</h2>
                  <p className="text-sm text-gray-500">Please provide accurate information for AIRO ONE membership registration.</p>
                </div>
                <button 
                  onClick={() => setCurrentStep(0)}
                  className="text-xs text-[#006537] font-semibold hover:underline"
                >
                  ← Back to Plans Overview
                </button>
              </div>

              <form onSubmit={handleNextToStep2} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        required
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Street, City, Pincode"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Emergency Contact <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <HeartHandshake className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Contact Name & Mobile"
                      value={typeof formData.emergencyContact === 'string' ? formData.emergencyContact : ''}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3.5 bg-[#006537] hover:bg-[#004e2a] text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    Proceed to Select Plan <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Plan Selection Confirmation */}
          {currentStep === 2 && (() => {
            const isQuarterly = (formData.billingCycle || 'Quarterly') === 'Quarterly';
            const plansList = [
              {
                name: 'AIRO ONE Select' as MembershipPlanType,
                quarterlyPrice: '₹590',
                annualPrice: '₹1,999',
                desc: 'Only 1 Member Covered • 3 Consultations • 4 Praana Screenings',
              },
              {
                name: 'AIRO ONE Preferred' as MembershipPlanType,
                quarterlyPrice: '₹1,180',
                annualPrice: '₹3,999',
                desc: 'You + 1 Member • 1 Member Free Medication (350+ Meds)',
                popular: true,
              },
              {
                name: 'AIRO ONE Signature' as MembershipPlanType,
                quarterlyPrice: '₹2,065',
                annualPrice: '₹6,999',
                desc: 'You + 3 Members • 2 Members Free Medication • Care365™ & Ambulance',
              },
              {
                name: 'AIRO ONE Infinite' as MembershipPlanType,
                quarterlyPrice: '₹2,655',
                annualPrice: '₹8,999',
                desc: 'You + 5 Members • 4 Members Free Medication • Care365™ & Ambulance',
              },
            ];

            const currentSelectedPlan = plansList.find(p => p.name === formData.membershipPlan) || plansList[0];

            return (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 max-w-4xl mx-auto space-y-6"
              >
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">Step 2: Confirm Membership Plan &amp; Billing Cycle</h2>
                  <p className="text-sm text-gray-500">Select your preferred AIRO ONE plan duration &amp; tier.</p>
                </div>

                {/* In-Store Payment Alert Notice */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                  <Store className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-amber-900">In-Store Enrollment &amp; Payment</p>
                    <p className="text-amber-800 mt-0.5 leading-relaxed">
                      AIRO ONE memberships and payments are processed exclusively in-store. No online payment is collected now. 
                      Submitting this form books your registration for quick in-store payment (Cash, UPI, or Card) and instant activation at your nearest AIRO Clinic / Pharmacy.
                    </p>
                  </div>
                </div>

                {/* Billing Frequency Selector: Quarterly vs Annual */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-700 px-2">Select Payment Frequency:</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleInputChange('billingCycle' as any, 'Quarterly')}
                      className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isQuarterly
                          ? 'bg-[#006537] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span>Quarterly (Every 3 Months)</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isQuarterly ? 'bg-white/20 text-white' : 'bg-green-100 text-[#006537]'}`}>
                        Incl. 18% GST
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInputChange('billingCycle' as any, 'Annual')}
                      className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        !isQuarterly
                          ? 'bg-[#006537] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span>Annual (1 Year)</span>
                      <span className="text-[10px] text-gray-400 font-normal">+ GST</span>
                    </button>
                  </div>
                </div>

                {/* 4 Plan Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plansList.map((plan) => {
                    const isSelected = formData.membershipPlan === plan.name;
                    return (
                      <div
                        key={plan.name}
                        onClick={() => handleInputChange('membershipPlan', plan.name)}
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-left relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#006537] bg-emerald-50/50 shadow-md ring-2 ring-[#006537]/20'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 bg-[#006537] text-white p-0.5 rounded-full shadow-sm">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {plan.popular && !isSelected && (
                          <span className="absolute top-2.5 right-2.5 bg-emerald-100 text-[#006537] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-tight pr-6">{plan.name}</h4>
                          <div className="mt-2">
                            <p className="text-2xl font-extrabold text-[#006537]">
                              {isQuarterly ? plan.quarterlyPrice : plan.annualPrice}
                              <span className="text-[11px] text-gray-500 font-normal">
                                {isQuarterly ? ' / qtr' : ' / yr'}
                              </span>
                            </p>
                            {isQuarterly ? (
                              <div className="text-[10px] font-bold text-[#006537] bg-green-100/70 inline-block px-2 py-0.5 rounded-full mt-1">
                                ✓ INCL. 18% GST
                              </div>
                            ) : (
                              <p className="text-[10px] text-gray-500 font-medium mt-0.5">+ GST applicable</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-1">
                              {isQuarterly ? `or ${plan.annualPrice}/yr (+ GST)` : `or ${plan.quarterlyPrice}/qtr (Incl. GST)`}
                            </p>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-3 pt-2 border-t border-gray-100 leading-snug">
                          {plan.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Application Overview Box */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-2.5">
                  <p className="font-bold text-gray-900 text-sm mb-1 flex items-center justify-between">
                    <span>Application Overview:</span>
                    <span className="text-[11px] font-normal text-gray-500">In-Store Completion</span>
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    <p><strong>Applicant Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Mobile:</strong> {formData.mobile} | <strong>Email:</strong> {formData.email}</p>
                    <p><strong>Selected Plan:</strong> <span className="font-bold text-[#006537]">{formData.membershipPlan}</span></p>
                    <p>
                      <strong>Billing Cycle:</strong>{' '}
                      <span className="font-bold text-gray-900">
                        {isQuarterly ? 'Quarterly (Every 3 Months)' : 'Annual (1 Year)'}
                      </span>
                    </p>
                    <p>
                      <strong>Membership Fee:</strong>{' '}
                      <span className="font-bold text-[#006537]">
                        {isQuarterly 
                          ? `${currentSelectedPlan.quarterlyPrice} / quarter (INCL. 18% GST)` 
                          : `${currentSelectedPlan.annualPrice} / year (+ GST)`}
                      </span>
                    </p>
                    <p><strong>Payment Method:</strong> 🏪 In-Store (Cash / UPI / Card)</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex items-center gap-2 text-[11px] text-amber-900 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span><strong>Payment Status:</strong> Pending In-Store Collection by AIRO Staff</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit Personal Info
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmitRegistration}
                    className="flex items-center gap-2 px-8 py-3.5 bg-[#006537] hover:bg-[#004e2a] text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Submit Application (In-Store) <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })()}

          {/* STEP 3: Submission Confirmation */}
          {currentStep === 3 && registrationResult && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 max-w-2xl mx-auto text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-[#006537] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                Pending In-Store Payment
              </span>

              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Application Submitted Successfully!
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Your AIRO ONE membership application has been received. Please visit your nearest AIRO Clinic / Pharmacy to complete payment and activate your membership card.
              </p>

              <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-200 inline-block text-left w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Registration ID</span>
                  <span className="font-mono font-bold text-gray-900 text-base">{registrationResult.registrationId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Applicant Name</span>
                  <span className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Selected Plan</span>
                  <span className="font-bold text-[#006537]">{formData.membershipPlan}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Billing Frequency</span>
                  <span className="font-bold text-gray-800">
                    {formData.billingCycle === 'Quarterly' ? 'Quarterly (Every 3 Months)' : 'Annual (1 Year)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Membership Status</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Pending In-Store Activation
                  </span>
                </div>
              </div>

              <div className="mt-6 text-left p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-950 text-xs leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1.5 text-sm text-[#006537]">
                  <Store className="w-4 h-4 text-[#006537]" /> How to Complete Your Activation In-Store:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Visit your nearest <strong>AIRO Clinic &amp; Pharmacy</strong>.</li>
                  <li>Show your <strong>Registration ID ({registrationResult.registrationId})</strong> or registered mobile number ({formData.mobile}) to the front desk.</li>
                  <li>Make your payment via <strong>Cash, UPI, or Card</strong> for either the Quarterly or Annual rate.</li>
                  <li>Receive your activated <strong>AIRO ONE Member ID</strong>, physical card, and unlock digital benefits in the AIRO App!</li>
                </ol>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setRegistrationResult(null);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      mobile: '',
                      email: '',
                      dob: '',
                      gender: 'Male',
                      address: '',
                      emergencyContact: '',
                      membershipPlan: 'AIRO ONE Select',
                      billingCycle: 'Quarterly',
                    });
                  }}
                  className="px-8 py-3 bg-[#006537] text-white font-bold rounded-xl hover:bg-[#004e2a] transition-all text-sm shadow-md"
                >
                  Return to Membership Overview
                </button>
              </div>
            </motion.div>
          )}

        </div>

        {/* Terms & Conditions Footer */}
        <div className="mt-16 text-xs text-gray-500 max-w-4xl mx-auto space-y-2 opacity-75 border-t border-gray-200 pt-6">
          <p className="font-semibold mb-2 text-gray-700">Terms &amp; Conditions:</p>
          <p>1. Pharmacy discounts apply only to eligible products and are subject to applicable laws, regulations, and company policies.</p>
          <p>2. Membership benefits are available at participating AIRO locations and through the AIRO App.</p>
          <p>3. Complimentary consultations, screenings, and health assessments must be used within the membership year.</p>
          <p>4. The AIRO ONE™ Signature Comprehensive Health Assessment is a preventive health screening designed to help identify potential health risks. It is not intended to diagnose, treat, cure, or prevent any disease.</p>
          <p>5. The products shown are for representation only, so what you get may look different.</p>
          <p>6. Airo can change the offer: It reserves the right to terminate, modify, or extend the offer at its sole discretion, without prior notice and without liability.</p>
          <p>7. The offer is valid at select stores only and while stocks last.</p>
          <p>8. All offers are applied as discounts on the customer’s invoice.</p>
        </div>

      </div>

      {/* LOOKUP MEMBERSHIP MODAL FOR CUSTOMERS */}
      <AnimatePresence>
        {showLookupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#006537]" /> Look Up Active Membership
                </h3>
                <button 
                  onClick={() => setShowLookupModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleLookupSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Mobile Number, Email, or ONE ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210, john@example.com, or AIRO-1000001"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006537] focus:bg-white transition-all"
                  />
                </div>

                {lookupError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                    {lookupError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-3 bg-[#006537] hover:bg-[#004e2a] text-white font-bold rounded-xl shadow-md text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {lookupLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Find My Digital Membership Card
                    </>
                  )}
                </button>
              </form>

              {/* Lookup Result View */}
              {lookupResult && (
                <div className="border-t border-gray-100 pt-4 space-y-4 text-xs">
                  
                  {/* Status Banner */}
                  <div className={`p-3 rounded-2xl flex justify-between items-center ${
                    lookupResult.membershipStatus === 'Active' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    <div>
                      <span className="font-extrabold uppercase block tracking-wider">{lookupResult.membershipStatus}</span>
                      <span className="text-[11px] opacity-80">{lookupResult.firstName} {lookupResult.lastName} • {lookupResult.membershipPlan}</span>
                    </div>
                    {lookupResult.memberId && (
                      <span className="font-mono font-bold text-sm bg-white px-2.5 py-1 rounded-lg shadow-sm border border-emerald-300">
                        {lookupResult.memberId}
                      </span>
                    )}
                  </div>

                  {/* Digital Card Preview */}
                  {lookupResult.digitalCardUrl ? (
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-slate-900 p-1">
                      <img src={lookupResult.digitalCardUrl} alt="Digital Card" className="w-full h-auto object-contain rounded-lg" />
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-gray-600">
                      Application Registration ID: <strong>{lookupResult.registrationId}</strong><br/>
                      <span className="text-[11px] text-gray-500 mt-1 block">Payment status is currently pending. Your Member ID and Digital Card will be activated once payment is verified.</span>
                    </div>
                  )}

                  {/* Verification URL Button */}
                  {lookupResult.memberId && (
                    <div className="flex gap-2">
                      <a
                        href={`/member/${lookupResult.memberId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 bg-gray-900 text-[#D4AF37] font-bold rounded-xl text-center hover:bg-black transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Open Verified Card Page
                      </a>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
