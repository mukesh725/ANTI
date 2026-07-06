"use client";


import { Shield, Lock, Eye, AlertCircle } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#FFFFFF] text-[#1C1C1E] min-h-screen overflow-x-hidden selection:bg-[#1C1C1E] selection:text-[#FFFFFF]">
      <GlobalHeader />
      {/* Header Banner */}
      <section className="relative px-6 md:px-12 pt-40 pb-12 md:py-48 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#1C1C1E]/60 mb-4 font-semibold block">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#1C1C1E] max-w-4xl tracking-tight leading-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-[#1C1C1E]/75 text-sm md:text-base max-w-2xl leading-relaxed">
          At AIRO Health, your privacy is our priority. We strictly comply with the Digital Personal Data Protection (DPDP) Act 2023, the IT Rules 2011, and guidelines issued by the Government of India.
        </p>
      </section>

      {/* Compliance Overview Grid */}
      <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <Shield className="w-5 h-5 text-[#1C1C1E]" />
          <h4 className="font-serif text-lg font-medium">DPDP Compliant</h4>
          <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
            Data is collected only with affirmative consent. You have the absolute right to access, correct, and erase your personal data at any time.
          </p>
        </div>
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <Lock className="w-5 h-5 text-[#1C1C1E]" />
          <h4 className="font-serif text-lg font-medium">Data Localization</h4>
          <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
            100% of your personal, health, and transactional data is encrypted and securely stored on servers located within the physical borders of India.
          </p>
        </div>
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <Eye className="w-5 h-5 text-[#1C1C1E]" />
          <h4 className="font-serif text-lg font-medium">Marketing Consent</h4>
          <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
            We adhere strictly to TRAI guidelines. You will only receive promotional SMS or WhatsApp messages if you explicitly opt-in, and can opt-out anytime.
          </p>
        </div>
      </section>

      {/* Detailed Legal Text */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto font-sans text-sm leading-relaxed text-[#1C1C1E]/85 space-y-12">

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">1. Information We Collect</h2>
          <p>
            When you interact with the AIRO Health website, AIRO Essentials grocery, or Minute Clinic, we collect the following categories of information as a &quot;Data Fiduciary&quot;:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#1C1C1E]/85">
            <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and physical delivery address.</li>
            <li><strong>Clinical & Wellness Data:</strong> Self-reported health metrics, metabolic chair assessment data, and pharmacy order history.</li>
            <li><strong>Financial Data:</strong> Transaction history and masked payment details (processed securely by RBI-approved Payment Aggregators).</li>
            <li><strong>Device Telemetry:</strong> IP address, browser type, and cookies (subject to your consent).</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">2. Purpose of Processing (How We Use It)</h2>
          <p>
            Your information is strictly utilized for the following operational purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#1C1C1E]/85">
            <li>Processing and delivering grocery orders via AIRO Essentials.</li>
            <li>Scheduling Minute Clinic appointments and safely dispensing pharmacy medicines.</li>
            <li>Providing personalized wellness insights based on your AIRO Health Chair assessments.</li>
            <li>Sending transactional updates (OTP, order tracking, appointment reminders).</li>
            <li>Sending marketing communications, strictly subject to your explicit consent.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">3. Your Rights as a Data Principal</h2>
          <p>
            Under the DPDP Act 2023, you have absolute control over your digital footprint. You have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#1C1C1E]/85">
            <li><strong>Right to Access:</strong> Request a summary of the personal data we process.</li>
            <li><strong>Right to Correction:</strong> Update or correct inaccurate data.</li>
            <li><strong>Right to Erasure:</strong> Request the deletion of your data once it is no longer required for the purpose it was collected.</li>
            <li><strong>Right to Withdraw Consent:</strong> Opt-out of non-essential tracking or marketing communications at any time.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">4. Third-Party Sharing & Localization</h2>
          <p>
            We do not sell, rent, or trade your personal data. We only share data with verified &quot;Data Processors&quot; (logistics partners, payment gateways) strictly necessary to fulfill your orders.
          </p>
          <p>
            All critical personal data, especially clinical and health records, are localized and securely stored in encrypted data centers geographically located within India, in compliance with national security guidelines.
          </p>
        </div>

        <div className="space-y-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h2 className="font-serif text-xl text-emerald-900 tracking-wide flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            5. Grievance Officer
          </h2>
          <p className="text-emerald-800 text-sm">
            In accordance with the Information Technology Act 2000 and Consumer Protection (E-Commerce) Rules 2020, the name and contact details of the Grievance Officer are provided below. If you have any concerns regarding data privacy or e-commerce disputes, please contact:
          </p>
          <div className="mt-4 space-y-1 text-sm font-medium text-emerald-900">
            <p><strong>Name:</strong> Compliance & Grievance Officer</p>
            <p><strong>Email:</strong> <a href="mailto:airoessentials@gmail.com" className="underline hover:text-emerald-700">airoessentials@gmail.com</a></p>
            <p><strong>Address:</strong> #7-1-621/66, 2nd Floor, Near CMS Degree College, Sanjeev Reddy Nagar (SR Nagar), Ameerpet, Hyderabad, Telangana, India - 500038</p>
            <p><strong>Response Time:</strong> We will acknowledge your grievance within 48 hours and resolve it within 30 days.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
