"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* Header Banner */}
      <section className="relative px-6 md:px-12 pt-20 pb-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 mb-4 font-semibold block">
          Legal Agreement
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#0B2114] max-w-4xl tracking-tight leading-tight mb-6">
          Terms of Service & Clinical Disclaimers
        </h1>
        <p className="text-[#0B2114]/75 text-sm md:text-base max-w-2xl leading-relaxed">
          Please review the following terms carefully before using any AIRO Health platforms, diagnostics systems, clinical services, or premium retail resources.
        </p>
      </section>

      {/* Critical Medical Disclaimer Banner */}
      <section className="px-6 md:px-12 pb-16 max-w-4xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 text-amber-950 p-6 rounded-2xl flex items-start space-x-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-semibold text-amber-900">Important Medical Disclaimer</h4>
            <p className="text-xs leading-relaxed text-amber-900/90">
              The content, assessments, and diagnostic metrics generated on this website or by the AIRO Health Chair are for informational and educational purposes only. They are not a substitute for professional clinical advice, diagnosis, or treatment. Always consult with a qualified medical practitioner before starting any medication, compounding program, weight management protocol, or IV therapy.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Terms Content */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto font-sans text-sm leading-relaxed text-[#0B2114]/85 space-y-8">
        
        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">1. Practitioner Assessment Requirement</h2>
          <p>
            Certain services within the AIRO Health ecosystem—including custom compounded prescriptions, targeted hormone therapies, weight loss programs (such as GLP-1 therapy), and advanced IV infusions—strictly require a prior diagnostic evaluation and physical assessment by a licensed AIRO Minute Clinic practitioner or partner physician.
          </p>
          <p>
            Submission of inquiries, questionnaire responses, or chatbot logs does not guarantee enrollment in a clinical program or access to prescribed medications. All medical decisions remain at the discretion of the evaluating clinical team.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">2. Permitted Use of Site Materials</h2>
          <p>
            All text, diagrams, layout designs, branding, and images rendered on the AIRO website are the intellectual property of AIRO Health. You may view and print resources for personal, non-commercial purposes only. Any unauthorized reproduction, scraping, or distribution of our proprietary content is strictly prohibited.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">3. Accounts and Communication Consent</h2>
          <p>
            By submitting your name, email address, or phone number on our waitlist or contact forms, you consent to receive scheduling notifications, appointment reminders, and administrative updates from our wellness concierge desk. You can unsubscribe from these alerts at any time by following the instructions inside our communications.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#0B2114] tracking-wide">4. Limitation of Liability</h2>
          <p>
            AIRO Health and its associates (including founder Kumar Swamy Maruri, clinicians, pharmacists, and software engineers) shall not be held liable for any direct or indirect consequences arising from the use of, or inability to use, our online services, diagnostics chair telemetry, or retail products. You agree to use these tools at your own discretion.
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
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors font-medium">Terms of Service</Link></li>
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
