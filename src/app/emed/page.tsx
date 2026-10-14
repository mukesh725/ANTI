"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Video, ShieldCheck, Stethoscope, Pill, Lock, 
  ArrowRight, ExternalLink, Sparkles, Clock, CheckCircle2,
  HeartPulse, Truck, UserCheck, Activity
} from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

export default function AiroEmedPage() {
  const clinicalTreatments = [
    {
      title: "Weight Optimization & GLP-1",
      subtitle: "Metabolic Precision",
      description: "Physician-guided medical weight loss protocols featuring compounded GLP-1 therapies, metabolic biomarker monitoring, and personalized nutritional synergy.",
      badge: "Clinical Favorite",
      features: ["Board-certified oversight", "Compounded formulations", "Continuous metabolic tracking"]
    },
    {
      title: "Hair Regrowth & Density",
      subtitle: "Follicular Science",
      description: "Advanced dual-action topical and oral compounds engineered to halt androgenic miniaturization and stimulate cellular follicular regeneration.",
      badge: "Precision Care",
      features: ["Custom topical finasteride/minoxidil", "Dermatologist formulated", "No generic fillers"]
    },
    {
      title: "Men's & Women's Longevity",
      subtitle: "Hormonal & Vitality Harmony",
      description: "Comprehensive hormonal assessments, biomarker balance, and targeted vitality protocols to sustain peak cellular energy, drive, and cognitive sharpness.",
      badge: "Longevity Focused",
      features: ["Discreet digital intake", "Custom compounded dosing", "Private doctor teleconsultation"]
    },
    {
      title: "Medical Dermatology",
      subtitle: "Cellular Skin Health",
      description: "Targeted prescription compounds formulated for stubborn dermatological concerns, hyperpigmentation, collagen synthesis, and cellular anti-aging.",
      badge: "Custom Compounded",
      features: ["High-potency retinoid formulations", "Anti-inflammatory actives", "Formulated to order"]
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Complete Digital Intake",
      description: "Share your health history, current symptoms, and clinical goals through a secure, confidential medical questionnaire in just 5 minutes."
    },
    {
      number: "02",
      title: "Physician Clinical Evaluation",
      description: "A licensed, board-certified doctor reviews your telemetry, health records, and formulates a customized clinical intervention."
    },
    {
      number: "03",
      title: "Compounded Precision Formulation",
      description: "Your personalized prescription is custom-formulated in sterile state-of-the-art cleanrooms without synthetic fillers or generic additives."
    },
    {
      number: "04",
      title: "Discreet Express Delivery",
      description: "Receive your tailored treatments straight to your door in climate-shielded, unmarked discreet packaging with automated ongoing refills."
    }
  ];

  return (
    <div className="bg-paper text-ink min-h-screen font-sans selection:bg-theme selection:text-paper overflow-clip flex flex-col">
      <GlobalHeader />

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative w-full pt-36 pb-24 md:pt-48 md:pb-36 bg-[#09120F] text-paper overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-theme/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-[400px] h-[300px] bg-[#C5A880]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-paper/15 bg-paper/5 backdrop-blur-md text-paper text-[10px] font-bold tracking-[0.25em] uppercase mb-8 shadow-inner">
                <Video className="w-3.5 h-3.5 text-[#C5A880]" /> TELEHEALTH & COMPOUNDED PHARMACY
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.05] text-paper mb-6">
                Clinical Care, <br />
                <span className="italic font-light text-[#C5A880]">Delivered Discretely.</span>
              </h1>

              <p className="font-serif text-lg md:text-2xl text-paper/90 italic max-w-xl leading-relaxed mb-6">
                Consult online with licensed medical doctors. Receive custom-compounded medications tailored precisely to your biological needs.
              </p>

              <p className="font-sans text-xs md:text-sm text-paper/70 max-w-lg leading-relaxed mb-10 tracking-wide font-light">
                AIRO eMed connects specialized physician oversight with our compounding pharmacy. From metabolic longevity and weight management to hair regrowth and hormone health—care is discreet, frictionless, and delivered to your doorstep.
              </p>

              {/* Primary External Action: Visit AIRO eMed */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
                <a
                  href="https://airoemed.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-visit-airo-emed-btn"
                  className="w-full sm:w-auto justify-center bg-[#C5A880] text-[#09120F] px-10 py-5 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-white silent-luxury-transition rounded-full shadow-2xl inline-flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Visit AIRO eMed <ExternalLink className="w-4 h-4 text-[#09120F]" />
                </a>

                <Link
                  href="/health"
                  className="w-full sm:w-auto justify-center border border-paper/20 text-paper hover:bg-paper/10 px-8 py-5 text-[11px] tracking-[0.2em] uppercase font-medium silent-luxury-transition rounded-full inline-flex items-center gap-2"
                >
                  Explore AIRO Health <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="mt-12 pt-8 border-t border-paper/10 grid grid-cols-3 gap-6 text-left w-full max-w-md">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> HIPAA
                  </div>
                  <p className="text-[10px] text-paper/60 tracking-wide mt-0.5">Encrypted Records</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-bold">
                    <UserCheck className="w-3.5 h-3.5" /> Licensed MDs
                  </div>
                  <p className="text-[10px] text-paper/60 tracking-wide mt-0.5">Board-Certified</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-bold">
                    <Truck className="w-3.5 h-3.5" /> Discreet
                  </div>
                  <p className="text-[10px] text-paper/60 tracking-wide mt-0.5">Direct Delivery</p>
                </div>
              </div>

            </div>

            {/* Visual Hero Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/10 rounded-[36px] p-8 md:p-10 backdrop-blur-2xl shadow-2xl text-paper">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-theme/50 border border-theme flex items-center justify-center text-paper shadow-md">
                      <Stethoscope className="w-6 h-6 text-[#C5A880]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg tracking-wide text-paper">AIRO eMed</h4>
                      <p className="text-[10px] text-[#C5A880] uppercase tracking-widest font-semibold">Virtual Clinic Network</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold uppercase tracking-wider">
                    Live Portal
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-semibold text-paper">Online Doctor Consultations</h5>
                      <p className="text-[11px] text-paper/60 mt-0.5 font-light">Direct 1-on-1 virtual reviews with medical practitioners.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-semibold text-paper">Customized Formulations</h5>
                      <p className="text-[11px] text-paper/60 mt-0.5 font-light">Tailored doses prepared in licensed compounding facilities.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-semibold text-paper">Direct-to-Door Shipping</h5>
                      <p className="text-[11px] text-paper/60 mt-0.5 font-light">Discreetly packaged medications delivered across regions.</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://airoemed.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full justify-center bg-white text-ink px-6 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#C5A880] hover:text-[#09120F] silent-luxury-transition rounded-2xl shadow-lg flex items-center gap-2"
                >
                  Launch airoemed.com <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SPECIALIZED CLINICAL FOCUS AREAS
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-16 w-full max-w-[1450px] mx-auto">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-[10px] tracking-[0.3em] uppercase text-ink/40 block mb-4 font-bold">
            SPECIALIZED CARE PATHWAYS
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
            Targeted Treatments. <br />
            <span className="italic font-light text-ink/60">Compounded for Your Biology.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {clinicalTreatments.map((treatment, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-[32px] p-8 md:p-12 border border-theme/10 shadow-sm hover:shadow-xl hover:border-theme/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-theme font-bold">
                    {treatment.subtitle}
                  </span>
                  <span className="bg-theme/5 text-theme border border-theme/15 text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {treatment.badge}
                  </span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-tight mb-4">
                  {treatment.title}
                </h3>

                <p className="font-sans text-xs md:text-sm text-ink/70 leading-relaxed font-light mb-8">
                  {treatment.description}
                </p>

                <div className="space-y-2.5 pt-6 border-t border-theme/5">
                  {treatment.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-ink/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-theme" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-6">
                <a
                  href="https://airoemed.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-theme hover:text-ink transition-colors group"
                >
                  Consult on AIRO eMed <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW AIRO EMED WORKS
          ========================================================================= */}
      <section className="bg-theme/[0.03] border-y border-theme/10 py-24 md:py-36 px-6 md:px-16 w-full">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-ink/40 block mb-4 font-bold">
              THE PATIENT EXPERIENCE
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
              Frictionless Care from <br />
              <span className="italic font-light text-ink/60">Anywhere You Are.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-8 border border-theme/10 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <span className="font-serif text-3xl font-light text-theme/30 block mb-6">
                    {step.number}
                  </span>
                  <h4 className="font-serif text-xl font-medium text-ink mb-3 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="font-sans text-xs text-ink/65 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-16 w-full max-w-[1400px] mx-auto">
        <div className="bg-[#09120F] rounded-[40px] text-paper p-12 md:p-20 relative overflow-hidden shadow-2xl border border-white/10 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] mb-8 shadow-inner">
            <Stethoscope className="w-8 h-8" />
          </div>

          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-bold block mb-4">
            START YOUR CLINICAL INTAKE
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-paper mb-6 max-w-2xl leading-tight">
            Ready to Begin with <br />
            <span className="italic font-light text-[#C5A880]">AIRO eMed?</span>
          </h2>

          <p className="font-sans text-xs md:text-sm text-paper/70 max-w-lg mb-10 leading-relaxed font-light">
            Skip the waiting room. Access licensed physicians, custom compounded medications, and discreet express delivery on our dedicated telehealth portal.
          </p>

          <a
            href="https://airoemed.com"
            target="_blank"
            rel="noopener noreferrer"
            id="bottom-visit-airo-emed-btn"
            className="bg-[#C5A880] text-[#09120F] px-12 py-5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-white silent-luxury-transition rounded-full shadow-2xl inline-flex items-center gap-3 transition-transform hover:scale-105"
          >
            Visit AIRO eMed (airoemed.com) <ExternalLink className="w-4 h-4 text-[#09120F]" />
          </a>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}
