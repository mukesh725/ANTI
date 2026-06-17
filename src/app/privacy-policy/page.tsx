"use client";

import Link from "next/link";
import { Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* Header Banner */}
      <section className="relative px-6 md:px-12 pt-20 pb-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 mb-4 font-semibold block">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#0B2114] max-w-4xl tracking-tight leading-tight mb-6">
          Privacy Policy & Patient Rights
        </h1>
        <p className="text-[#0B2114]/75 text-sm md:text-base max-w-2xl leading-relaxed">
          At AIRO Health, patient confidentiality and data security are the cornerstones of our integrated wellness ecosystem. We enforce strict protocols in line with national healthcare privacy standards.
        </p>
      </section>

      {/* Compliance Overview Grid */}
      <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <Shield className="w-5 h-5 text-[#0B2114]" />
          <h4 className="font-serif text-lg font-medium">HIPAA Compliant</h4>
          <p className="text-xs text-[#0B2114]/70 leading-relaxed">
            All Protected Health Information (PHI) is isolated, encrypted in transit and at rest, and handled in strict compliance with HIPAA security rules.
          </p>
        </div>
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <Lock className="w-5 h-5 text-[#0B2114]" />
          <h4 className="font-serif text-lg font-medium">Encrypted Storage</h4>
          <p className="text-xs text-[#0B2114]/70 leading-relaxed">
            Personal details collected during waitlist registration (names, emails, phones) are encrypted and stored in secure, private directories.
          </p>
        </div>
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <Eye className="w-5 h-5 text-[#0B2114]" />
          <h4 className="font-serif text-lg font-medium">Zero Share Guarantee</h4>
          <p className="text-xs text-[#0B2114]/70 leading-relaxed">
            We never sell, rent, or lease your demographic or clinical details to third-party marketing networks or external entities.
          </p>
        </div>
      </section>

      {/* Detailed Legal Text */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto font-sans text-sm leading-relaxed text-[#0B2114]/85 space-y-8">
        
        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">1. Information We Collect</h2>
          <p>
            When you interact with the AIRO Health website, chatbot assistant, or clinical portals, we collect certain categories of information to coordinate your wellness programs:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#0B2114]/85">
            <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and mailing address.</li>
            <li><strong>Clinical Indicators:</strong> Self-reported health concerns, vitamin requests, weight management goals, and diagnostic chair logs.</li>
            <li><strong>Device Telemetry:</strong> Anonymized browsing history, geolocated region, and device statistics.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">2. How We Use Your Data</h2>
          <p>
            Your information is strictly utilized for the following operational and clinical purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#0B2114]/85">
            <li>Scheduling 5-Minute Health Chair assessments and clinical consultations at the Minute Clinic.</li>
            <li>Formulating and customizing personalized medicine options at our Compounding Pharmacy.</li>
            <li>Coordinating delivery parameters for premium organic grocery orders via AIRO Essentials.</li>
            <li>Monitoring site traffic patterns to optimize layout performance and load speeds.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">3. Patient Rights (HIPAA & GDPR)</h2>
          <p>
            As a patient or customer of the AIRO ecosystem, you have absolute control over your profile records. You have the right to request:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#0B2114]/85">
            <li>Full inspections and copies of all captured diagnostic lists or lead records.</li>
            <li>Immediate corrections of inaccurate demographic or clinic details.</li>
            <li>Permanent erasure of your records from our databases (the &ldquo;Right to be Forgotten&rdquo;).</li>
          </ul>
          <p className="text-xs text-[#0B2114]/70 mt-3">
            To invoke any of these rights, please draft a request to our compliance officer at <a href="mailto:concierge@airohealth.com" className="underline hover:text-[#0B2114] transition-colors">concierge@airohealth.com</a>.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">4. Security Measures</h2>
          <p>
            AIRO implements administrative, technical, and physical safeguards designed to protect the integrity of personal records. Access to backend lead logs is restricted to authenticated coordinators using encrypted portals.
          </p>
        </div>

      </section>

      {/* Global Footer */}
      <footer className="bg-[#0B2114] text-[#FAF8F5] py-16 px-6 md:px-12 border-t border-[#1A3324]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="font-serif text-2xl tracking-widest uppercase text-[#FAF8F5]">AIRO.</span>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed">
                An integrated longevity ecosystem combining nutrition, diagnostics, clinical care, and personalized pharmacy solutions.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Support & Care</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li>Concierge: <a href="mailto:concierge@airohealth.com" className="hover:text-white transition-colors">concierge@airohealth.com</a></li>
                <li>Clinical Team: <a href="mailto:clinical@airohealth.com" className="hover:text-white transition-colors">clinical@airohealth.com</a></li>
                <li>Phone: <a href="tel:+18005552476" className="hover:text-white transition-colors">+1 (800) 555-2476</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Ecosystem</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li><Link href="/grocery" className="hover:text-white transition-colors">AIRO Essentials</Link></li>
                <li><Link href="/pharmacy" className="hover:text-white transition-colors">AIRO Pharmacy</Link></li>
                <li><Link href="/minute-clinic" className="hover:text-white transition-colors">Minute Clinic</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Legal & Press</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li><Link href="/about" className="hover:text-white transition-colors">About & Leadership</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press & Investor Kit</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A3324] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-[#FAF8F5]/40">
            <span>&copy; 2026 AIRO Health. All rights reserved.</span>
            <span className="text-center max-w-lg leading-relaxed md:text-right">
              Healthcare programs and compounding therapies are subject to practitioner evaluation. All contents are informational and not medical advice.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
