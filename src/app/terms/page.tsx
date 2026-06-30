"use client";

import Link from "next/link";
import { FileText, Scale, AlertTriangle, ShieldCheck } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

export default function TermsPage() {
  return (
    <div className="w-full bg-[#FFFFFF] text-[#1C1C1E] min-h-screen overflow-x-hidden selection:bg-[#1C1C1E] selection:text-[#FFFFFF]">
      <GlobalHeader />
      
      {/* Header Banner */}
      <section className="relative px-6 md:px-12 pt-40 pb-12 md:py-48 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#1C1C1E]/60 mb-4 font-semibold block">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#1C1C1E] max-w-4xl tracking-tight leading-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-[#1C1C1E]/75 text-sm md:text-base max-w-2xl leading-relaxed">
          These Terms of Service govern your use of AIRO Health, AIRO Essentials, and the Minute Clinic. By accessing our platform, you agree to comply with these terms, governed by the laws of India.
        </p>
      </section>

      {/* Compliance Overview Grid */}
      <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <Scale className="w-5 h-5 text-[#1C1C1E]" />
          <h4 className="font-serif text-lg font-medium">Indian Jurisdiction</h4>
          <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
            All services, transactions, and disputes are strictly governed by the laws of India, subject exclusively to the courts in Hyderabad, Telangana.
          </p>
        </div>
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <ShieldCheck className="w-5 h-5 text-[#1C1C1E]" />
          <h4 className="font-serif text-lg font-medium">E-Commerce Compliance</h4>
          <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
            We fully comply with the Consumer Protection (E-Commerce) Rules 2020, ensuring transparent pricing, authentic products, and robust grievance redressal.
          </p>
        </div>
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm space-y-3">
          <AlertTriangle className="w-5 h-5 text-[#1C1C1E]" />
          <h4 className="font-serif text-lg font-medium">Medical Disclaimer</h4>
          <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
            AIRO Health Chair assessments and Minute Clinic telehealth consults do not replace emergency medical care. In an emergency, dial 112 immediately.
          </p>
        </div>
      </section>

      {/* Detailed Legal Text */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto font-sans text-sm leading-relaxed text-[#1C1C1E]/85 space-y-12">
        
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">1. Use of Platform & Eligibility</h2>
          <p>
            By registering on the AIRO platform, you represent that you are at least 18 years of age and competent to enter into a legally binding contract under the Indian Contract Act, 1872. 
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">2. E-Commerce (AIRO Essentials & Pharmacy)</h2>
          <p>
            When purchasing products via AIRO Essentials or the AIRO Pharmacy:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#1C1C1E]/85">
            <li><strong>Pricing:</strong> All prices displayed are inclusive of GST. Delivery charges, if applicable, are clearly stated at checkout.</li>
            <li><strong>FSSAI Compliance:</strong> Food items and organic groceries sold are sourced from FSSAI registered/licensed vendors. Nutritional facts and expiry dates are strictly monitored.</li>
            <li><strong>Prescription Drugs:</strong> Schedule H and H1 drugs through the AIRO Pharmacy require a valid prescription from a registered medical practitioner, per the Drugs and Cosmetics Act, 1940.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">3. Minute Clinic & Telemedicine Guidelines</h2>
          <p>
            AIRO&#39;s telehealth services and &quot;Minute Clinic&quot; operate in accordance with the Telemedicine Practice Guidelines issued by the Ministry of Health and Family Welfare (MoHFW) and NITI Aayog.
          </p>
          <p>
            <strong>Crucial Disclaimer:</strong> The AIRO Health Chair provides preliminary metabolic assessments and wellness insights. It is <strong>NOT</strong> a substitute for clinical diagnostics or emergency medical care. Our Registered Medical Practitioners (RMPs) exercise their independent clinical judgment during consultations.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1C1C1E] tracking-wide border-b border-[#E6DFD5] pb-2">4. Cancellations & Returns</h2>
          <p>
            AIRO maintains a transparent returns policy governed by the Consumer Protection (E-Commerce) Rules 2020. 
            For full details on non-returnable items (e.g., compounded medicines, perishable foods), refund timelines, and cancellation procedures, please read our dedicated <Link href="/refund-policy" className="underline font-medium text-emerald-700 hover:text-emerald-900">Refund Policy</Link> and <Link href="/shipping-policy" className="underline font-medium text-emerald-700 hover:text-emerald-900">Shipping Policy</Link>.
          </p>
        </div>

        <div className="space-y-4 bg-[#1C1C1E] text-[#FFFFFF] p-6 rounded-2xl">
          <h2 className="font-serif text-xl tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0A84FF]" />
            5. Governing Law & Dispute Resolution
          </h2>
          <p className="text-[#FFFFFF]/80 text-sm">
            These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these terms, the website, or services provided shall be subject to the exclusive jurisdiction of the courts located in <strong>Hyderabad, Telangana, India</strong>.
          </p>
        </div>

      </section>

    </div>
  );
}
