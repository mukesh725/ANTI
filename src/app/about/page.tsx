"use client";

import { Sparkles, Shield, Heart, Compass } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 mb-4 font-semibold block">
          Our Foundation & Philosophy
        </span>
        <h1 className="font-serif text-4xl md:text-7xl text-[#0B2114] max-w-5xl tracking-tight leading-none mb-8">
          The Paradigm Shift in Modern Longevity
        </h1>
        <p className="text-[#0B2114]/75 text-sm md:text-lg max-w-3xl leading-relaxed">
          AIRO was founded to change a broken paradigm: moving from reactive disease treatment to proactive, personalized health optimization. We combine advanced diagnostics, sterile compounding pharmacy services, physical clinic networks, and organic lifestyle retail under one connected, secure ecosystem.
        </p>
      </section>

      {/* The Trust Framework Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5EFEB] border-t border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#0B2114]/50 font-bold">Clinical Standards</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight">The Pillars of AIRO Trust</h2>
            <p className="text-xs md:text-sm text-[#0B2114]/70 leading-relaxed">
              We understand that choosing a health partner is a deeply personal decision. That is why the AIRO ecosystem operates with absolute transparency, strict compliance, and clinical supervision at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <Shield className="w-8 h-8 text-[#0B2114] mb-4" />
                <h4 className="font-serif text-xl mb-2">Clinical Rigor</h4>
                <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                  Every metabolic assessment, biomarker scan, and compounding dosage program is reviewed and approved by board-certified clinical practitioners. We do not prescribe based on trends—only verified lab findings.
                </p>
              </div>
              <div className="text-[9px] tracking-wider uppercase font-bold text-[#0B2114]/40 pt-4 border-t border-[#FAF8F5]">
                MD-Vetted Protocols
              </div>
            </div>

            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <Sparkles className="w-8 h-8 text-[#D4AF37] mb-4" />
                <h4 className="font-serif text-xl mb-2">Compounding Purity</h4>
                <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                  Our associated compounding apothecaries formulate customized medicine inside sterile cleanrooms that strictly comply with USP &lt;795&gt; (non-sterile) and USP &lt;797&gt; (sterile compounding) standards.
                </p>
              </div>
              <div className="text-[9px] tracking-wider uppercase font-bold text-[#0B2114]/40 pt-4 border-t border-[#FAF8F5]">
                USP Compliant Apothecary
              </div>
            </div>

            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <Heart className="w-8 h-8 text-[#0B2114] mb-4" />
                <h4 className="font-serif text-xl mb-2">Sourcing Integrity</h4>
                <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                  AIRO Essentials partners exclusively with farmers and suppliers certified under USDA organic guidelines. Every grocery batch, cold-pressed juice, and dietary staple is audited for heavy metals and pesticides.
                </p>
              </div>
              <div className="text-[9px] tracking-wider uppercase font-bold text-[#0B2114]/40 pt-4 border-t border-[#FAF8F5]">
                100% Pesticide Screened
              </div>
            </div>

            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <Compass className="w-8 h-8 text-[#0B2114] mb-4" />
                <h4 className="font-serif text-xl mb-2">HIPAA Data Sovereignty</h4>
                <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                  Your biometric telemetry, contact details, and clinical profiles are double-encrypted in transit and at rest. We enforce strict access control policies and never share or lease files with marketing entities.
                </p>
              </div>
              <div className="text-[9px] tracking-wider uppercase font-bold text-[#0B2114]/40 pt-4 border-t border-[#FAF8F5]">
                AES-256 Encryption
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Metrics */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 font-semibold block">
              Evidence-Based Methodology
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-tight">
              Decisions Powered by Real Telemetry
            </h2>
            <p className="text-sm text-[#0B2114]/80 leading-relaxed">
              We reject the guesswork. AIRO was engineered to marry modern biometric tracking with traditional medical oversight. Through the 5-Minute Health Chair and targeted diagnostic biomarkers, we build a continuous closed loop of your body&apos;s data.
            </p>
            <p className="text-sm text-[#0B2114]/80 leading-relaxed">
              This data allows our clinical network to formulate precise intervention plans—whether that means compounding personalized vitamins to address immediate cellular deficiencies, adjusting clinical care pathways, or recommending specific organic dietary essentials.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="border border-[#0B2114]/10 bg-white/40 p-8 rounded-2xl text-center space-y-2">
              <span className="font-serif text-4xl md:text-5xl text-[#0B2114] font-medium block">100%</span>
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#0B2114]/60 block">HIPAA Compliant Pipelines</span>
              <p className="text-[10px] text-[#0B2114]/50 leading-relaxed pt-2">All electronic health records are isolated and securely archived.</p>
            </div>
            
            <div className="border border-[#0B2114]/10 bg-white/40 p-8 rounded-2xl text-center space-y-2">
              <span className="font-serif text-4xl md:text-5xl text-[#D4AF37] font-medium block">Zero</span>
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#0B2114]/60 block">Synthetic Additives</span>
              <p className="text-[10px] text-[#0B2114]/50 leading-relaxed pt-2">Compounded pharmacy preparations are clean, avoiding generic fillers.</p>
            </div>

            <div className="border border-[#0B2114]/10 bg-white/40 p-8 rounded-2xl text-center space-y-2">
              <span className="font-serif text-4xl md:text-5xl text-[#0B2114] font-medium block">15+</span>
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#0B2114]/60 block">Board-Certified Advisors</span>
              <p className="text-[10px] text-[#0B2114]/50 leading-relaxed pt-2">Medical professionals overseeing software algorithms and clinical care.</p>
            </div>

            <div className="border border-[#0B2114]/10 bg-white/40 p-8 rounded-2xl text-center space-y-2">
              <span className="font-serif text-4xl md:text-5xl text-[#0B2114] font-medium block">USDA</span>
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#0B2114]/60 block">Organic Partners</span>
              <p className="text-[10px] text-[#0B2114]/50 leading-relaxed pt-2">100% of organic grocery retail is audited at local farms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Spotlight */}
      <section className="px-6 md:px-12 py-20 md:py-32 bg-[#F5EFEB] border-t border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text block */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 font-semibold block">
              Founder & Chief Visionary
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-tight">
              Kumar Swamy Maruri
            </h2>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Founder & Chief Executive Officer, AIRO Ecosystem
            </h4>
            <div className="h-0.5 w-16 bg-[#D4AF37]"></div>
            <p className="text-sm text-[#0B2114]/85 leading-relaxed">
              Founded by **Kumar Swamy Maruri**, AIRO was born from a personal mission: to dismantle the reactive cycle of emergency medicine and replace it with a technology-driven longevity architecture. Witnessing how standard healthcare systems wait until cellular decline manifests as chronic illness, he sought to engineer a solution.
            </p>
            <p className="text-sm text-[#0B2114]/85 leading-relaxed">
              Kumar Swamy Maruri designed AIRO as a completely integrated ecosystem. By closing the gap between biometric diagnostic scanners (the 5-Minute Health Chair), custom compound formulations, clinical Concierge networks, and pure nutritional sourcing (AIRO Essentials), he has created a unified ecosystem for longevity.
            </p>
            <p className="text-xs font-semibold italic text-[#0B2114]/70">
              &ldquo;Healthcare should not be an emergency intervention; it must be an ongoing, evidence-based optimization of cellular energy and metabolic vitality.&rdquo; &mdash; Kumar Swamy Maruri
            </p>
          </div>

          {/* Graphical Card */}
          <div className="lg:col-span-6 bg-[#0B2114] text-[#FAF8F5] rounded-3xl p-10 md:p-12 border border-[#1A3324] shadow-xl relative overflow-hidden flex flex-col justify-between h-[450px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF8F5]/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div>
              <span className="font-serif text-lg tracking-widest text-[#D4AF37]">AIRO.</span>
              <h3 className="font-serif text-3xl mt-6 tracking-wide max-w-sm">
                Kumar Swamy Maruri
              </h3>
              <p className="text-xs text-[#FAF8F5]/60 mt-1 uppercase tracking-widest">Founder, AIRO Ecosystem</p>
            </div>
            
            <div className="border-t border-[#FAF8F5]/10 pt-6 space-y-4">
              <p className="text-xs text-[#FAF8F5]/80 leading-relaxed">
                Under Kumar Swamy Maruri&apos;s leadership, AIRO maintains standard-setting cleanrooms, collaborates with leading metabolic researchers, and ensures absolute transparency, encryption, and quality compliance across all lines of care.
              </p>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                EST. 2026 &bull; LONGEVITY ARCHITECTURE
              </div>
            </div>
          </div>

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
                <li><Link href="/about" className="hover:text-white transition-colors font-medium">About & Leadership</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press & Investor Kit</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
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
