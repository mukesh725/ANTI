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
  Download
} from 'lucide-react';
import { MembershipPlanType, PendingRegistrationInput, MemberRecord } from '@/types/membership';

export default function MembershipPage() {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0); // 0 = Landing View, 1 = Personal Info, 2 = Plan Select, 3 = Confirmation
  const [isHealthDomain, setIsHealthDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Membership Lookup State (Self-service card retrieval for customers)
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<MemberRecord | null>(null);
  const [lookupError, setLookupError] = useState('');
  
  // Detect domain (AIRO Essentials vs AIRO Health)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const port = window.location.port;
      if (host.includes("airohealth") || host.includes("health.airo") || port === "3001") {
        setIsHealthDomain(true);
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

  const startRegistration = (planName?: MembershipPlanType) => {
    if (planName) {
      setFormData(prev => ({ ...prev, membershipPlan: planName }));
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
          <img 
            src={isHealthDomain ? "/airo-health-logo.png" : "/airo-essentials-logo.png"} 
            alt={isHealthDomain ? "AIRO Health" : "AIRO Essentials"} 
            className="h-12 md:h-16 mx-auto object-contain mb-4 drop-shadow-sm"
          />

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
              <h2 className="text-3xl font-semibold text-center mb-10 text-[#006537]">Membership Comparison</h2>
              <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-6 font-semibold text-gray-700 w-1/3">Benefits</th>
                      <th className="p-6 font-semibold text-center text-[#006537]">AIRO ONE™ Select</th>
                      <th className="p-6 font-semibold text-center text-[#006537] bg-green-50">AIRO ONE™ Preferred</th>
                      <th className="p-6 font-semibold text-center text-[#006537]">AIRO ONE™ Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 font-medium text-gray-700">Annual Membership Fee</td>
                      <td className="p-6 text-center font-bold text-lg">₹999</td>
                      <td className="p-6 text-center font-bold text-lg bg-green-50 text-[#006537]">₹2,999</td>
                      <td className="p-6 text-center font-bold text-lg">₹4,999</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Members Covered</td>
                      <td className="p-6 text-center">1 Member</td>
                      <td className="p-6 text-center bg-green-50 font-semibold">Up to 3 Members</td>
                      <td className="p-6 text-center font-semibold">Up to 5 Members</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">AIRO Essentials Grocery Discount</td>
                      <td className="p-6 text-center font-semibold">2%</td>
                      <td className="p-6 text-center font-semibold bg-green-50">4%</td>
                      <td className="p-6 text-center font-semibold">6%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Pharmacy Discount*</td>
                      <td className="p-6 text-center font-semibold">15%</td>
                      <td className="p-6 text-center font-semibold bg-green-50 text-[#006537]">18%</td>
                      <td className="p-6 text-center font-semibold text-[#006537]">22%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">AIRO Branded Products Discount</td>
                      <td className="p-6 text-center font-semibold">4%</td>
                      <td className="p-6 text-center font-semibold bg-green-50">6%</td>
                      <td className="p-6 text-center font-semibold">8%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Free Doctor Consultations</td>
                      <td className="p-6 text-center">2 / Year</td>
                      <td className="p-6 text-center bg-green-50">6 / Year</td>
                      <td className="p-6 text-center font-bold">10 / Year</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Free Telemedicine Consultations</td>
                      <td className="p-6 text-center">2 / Year</td>
                      <td className="p-6 text-center bg-green-50">6 / Year</td>
                      <td className="p-6 text-center font-bold">10 / Year</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">AIRO Praana™ Health Screenings</td>
                      <td className="p-6 text-center">4 Basic Screenings</td>
                      <td className="p-6 text-center bg-green-50">10 Basic Screenings</td>
                      <td className="p-6 text-center font-bold text-[#006537]">Unlimited</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Annual Preventive Health Check-up</td>
                      <td className="p-6 text-center text-gray-400">—</td>
                      <td className="p-6 text-center bg-green-50 font-semibold">1 Complimentary</td>
                      <td className="p-6 text-center font-semibold">2 Complimentary</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Dietitian Consultations</td>
                      <td className="p-6 text-center text-gray-400">—</td>
                      <td className="p-6 text-center bg-green-50">2 / Year</td>
                      <td className="p-6 text-center font-semibold">6 / Year</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Medicine Home Delivery</td>
                      <td className="p-6 text-center">Free Above ₹1,500</td>
                      <td className="p-6 text-center bg-green-50">Free Above ₹1,500</td>
                      <td className="p-6 text-center font-semibold text-[#006537]">Unlimited Free Delivery</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-6 text-gray-600">Priority Service</td>
                      <td className="p-6 text-center text-gray-400">—</td>
                      <td className="p-6 text-center text-gray-400 bg-green-50">—</td>
                      <td className="p-6 text-center font-bold text-[#D02029]">VIP Priority</td>
                    </tr>
                    {[
                      "AIRO App (Digital Health Records)",
                      "Health & Medication Reminders",
                      "Birthday Rewards"
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-6 text-gray-600">{item}</td>
                        <td className="p-6 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                        <td className="p-6 text-center bg-green-50"><Check className="inline text-[#006537]" size={20}/></td>
                        <td className="p-6 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="p-6"></td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => startRegistration('AIRO ONE Select')} 
                          className="bg-[#006537] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#004e2a] transition-all"
                        >
                          Join Select (₹999)
                        </button>
                      </td>
                      <td className="p-6 text-center bg-green-50">
                        <button 
                          onClick={() => startRegistration('AIRO ONE Preferred')} 
                          className="bg-[#006537] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#004e2a] transition-all shadow-md"
                        >
                          Join Preferred (₹2,999)
                        </button>
                      </td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => startRegistration('AIRO ONE Signature')} 
                          className="bg-[#006537] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#004e2a] transition-all"
                        >
                          Join Signature (₹4,999)
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature Health Assessment */}
            <div className="bg-[#006537] text-white p-8 md:p-12 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-semibold mb-6">AIRO ONE™ Signature Comprehensive Health Assessment</h2>
              <p className="text-lg opacity-90 mb-10 max-w-4xl">
                A Complete Preventive Health Evaluation combining advanced body composition analysis, vital health measurements, and essential laboratory testing to provide a detailed picture of your health.
              </p>
              
              <div className="grid md:grid-cols-2 gap-12 text-sm">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-200">1. Vital Signs &amp; Body Composition</h3>
                  <ul className="space-y-3 opacity-90">
                    <li>• Blood Pressure (BP)</li>
                    <li>• Heart Rate &amp; Oxygen (SpO₂)</li>
                    <li>• BMI &amp; Body Fat Percentage</li>
                    <li>• Visceral Fat Score</li>
                    <li>• Skeletal Muscle Mass</li>
                    <li>• Metabolic Age &amp; Hydration Level</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-200">2. Comprehensive Laboratory Panel</h3>
                  <ul className="space-y-3 opacity-90">
                    <li>• HbA1c &amp; Blood Glucose</li>
                    <li>• Complete Lipid Profile</li>
                    <li>• Liver &amp; Kidney Function (LFT/KFT)</li>
                    <li>• Thyroid Function (T3, T4, TSH)</li>
                    <li>• Vitamin D &amp; Complete Blood Count</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 bg-white/10 p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-4">Your Personalized Report Includes:</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  {['AIRO Health Score', 'Body Composition', 'Cardiometabolic Risk', 'Dietitian Recommendations', 'Health Trend Tracking'].map((item, i) => (
                    <span key={i} className="bg-white/20 px-4 py-2 rounded-full font-medium">{item}</span>
                  ))}
                </div>
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

            {/* Founding Member Offer */}
            <div className="bg-gradient-to-r from-[#D02029] to-[#a81a21] text-white p-10 rounded-3xl shadow-xl text-center">
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block">
                Exclusive for the First 10,000 Members
              </span>
              <h2 className="text-4xl font-bold mb-10">Founding Member Offer</h2>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                <div className="bg-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-2">Select - ₹999</h3>
                  <ul className="space-y-2 opacity-90 text-sm">
                    <li>🎁 ₹500 Welcome Coupons</li>
                    <li>🛍️ AIRO Reusable Shopping Bag</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/30">
                  <h3 className="text-xl font-bold mb-2">Preferred - ₹2,999</h3>
                  <ul className="space-y-2 opacity-90 text-sm">
                    <li>🎁 ₹1,500 Welcome Coupons</li>
                    <li>⚕️ Complimentary AIRO Wellness Kit</li>
                    <li>💧 AIRO Premium Water Bottle</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-2">Signature - ₹4,999</h3>
                  <ul className="space-y-2 opacity-90 text-sm">
                    <li>🎁 ₹2,500 Welcome Coupons</li>
                    <li>⚕️ Premium AIRO Wellness Kit</li>
                    <li>💧 Premium Stainless Steel Water Bottle</li>
                  </ul>
                </div>
              </div>
              
              <button 
                onClick={() => startRegistration()}
                className="mt-10 bg-white text-[#D02029] px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
              >
                Claim Offer Now
              </button>
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
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 max-w-3xl mx-auto space-y-6"
            >
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Step 2: Confirm Membership Plan</h2>
                <p className="text-sm text-gray-500">Select your preferred AIRO ONE plan duration &amp; tier.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'AIRO ONE Select', price: '₹999', desc: '1 Member Covered' },
                  { name: 'AIRO ONE Preferred', price: '₹2,999', desc: 'Up to 3 Members Covered' },
                  { name: 'AIRO ONE Signature', price: '₹4,999', desc: 'Up to 5 Members Covered' },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    onClick={() => handleInputChange('membershipPlan', plan.name as MembershipPlanType)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all text-left relative ${
                      formData.membershipPlan === plan.name
                        ? 'border-[#006537] bg-emerald-50/50 shadow-md ring-2 ring-[#006537]/20'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {formData.membershipPlan === plan.name && (
                      <div className="absolute top-3 right-3 bg-[#006537] text-white p-0.5 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <h4 className="font-bold text-gray-900 text-sm">{plan.name}</h4>
                    <p className="text-2xl font-extrabold text-[#006537] mt-1">{plan.price} <span className="text-xs text-gray-500 font-normal">/ year</span></p>
                    <p className="text-xs text-gray-500 mt-2">{plan.desc}</p>
                  </div>
                ))}
              </div>

              {/* Application Summary Box */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1.5">
                <p className="font-bold text-gray-900 text-sm mb-2">Application Overview:</p>
                <p><strong>Applicant Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Mobile:</strong> {formData.mobile} | <strong>Email:</strong> {formData.email}</p>
                <p><strong>Selected Plan:</strong> <span className="font-bold text-[#006537]">{formData.membershipPlan}</span></p>
                <p><strong>Payment Status:</strong> Pending (Manual collection by AIRO executive)</p>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm"
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
                      Submit Application <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

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
                Payment Status: Pending
              </span>

              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Application Submitted Successfully!
              </h2>

              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 inline-block text-left w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Registration ID</span>
                  <span className="font-mono font-bold text-gray-900">{registrationResult.registrationId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Applicant Name</span>
                  <span className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Selected Plan</span>
                  <span className="font-bold text-[#006537]">{formData.membershipPlan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Membership Status</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Pending Activation</span>
                </div>
              </div>

              <div className="mt-6 text-left p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 text-xs leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" /> Next Step: Payment Collection
                </p>
                <p>
                  Our representative will collect your membership payment via Cash, UPI, Card, or approved payment method. 
                  Once payment is confirmed, your official <strong>Member ID</strong>, <strong>QR Code</strong>, and <strong>Digital Membership Card</strong> will be issued.
                </p>
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
                    });
                  }}
                  className="px-6 py-3 bg-[#006537] text-white font-bold rounded-xl hover:bg-[#004e2a] transition-all text-sm shadow-md"
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
