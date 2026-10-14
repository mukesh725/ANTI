"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { 
  Video, ShieldCheck, Stethoscope, Pill, Lock, 
  ArrowRight, ExternalLink, Sparkles, Clock, CheckCircle2,
  HeartPulse, Truck, UserCheck, Activity
} from "lucide-react";
import HeroSlider, { SlideItem } from "@/components/HeroSlider";

export default function AiroEmedPage() {
  const emedHeroSlides: SlideItem[] = useMemo(() => [
    {
      id: "weight-loss-female",
      image: "/images/hero/emed-weight-loss-female.jpg",
      alt: "GLP-1 Medical Weight Optimization for Women - AIRO eMed",
      link: "/airomed",
      title: "GLP-1 Weight Optimization",
      theme: "light",
      objectPosition: "object-top"
    },
    {
      id: "hair-regrowth",
      image: "/images/hero/emed-hair-regrowth.png",
      alt: "Hair Regrowth & Follicular Science - AIRO eMed",
      link: "/airomed",
      title: "Hair Regrowth & Density",
      theme: "light",
      objectPosition: "object-center"
    },
    {
      id: "skin-dermatology",
      image: "/images/hero/emed-skin-dermatology.jpg",
      alt: "Medical Dermatology & Cellular Skin Health - AIRO eMed",
      link: "/airomed",
      title: "Medical Dermatology & Skin",
      theme: "light",
      objectPosition: "object-center"
    },
    {
      id: "sexual-health",
      image: "/images/hero/emed-sexual-health.jpg",
      alt: "Intimate Vitality & Sexual Confidence - AIRO eMed",
      link: "/airomed",
      title: "Sexual Health & Intimacy",
      theme: "dark",
      objectPosition: "object-center"
    },
    {
      id: "weight-loss-male",
      image: "/images/hero/emed-weight-loss-male.jpg",
      alt: "Metabolic Longevity & GLP-1 Care for Men - AIRO eMed",
      link: "/airomed",
      title: "Metabolic Longevity & GLP-1",
      theme: "light",
      objectPosition: "object-top"
    }
  ], []);

  const clinicalTreatments = [
    {
      id: "weight-loss",
      title: "Weight Optimization & GLP-1",
      subtitle: "Metabolic Precision",
      description: "Physician-guided medical weight loss protocols featuring compounded GLP-1 therapies (Semaglutide & Tirzepatide), metabolic biomarker monitoring, and personalized nutritional synergy.",
      badge: "Clinical Favorite",
      features: ["Board-certified doctor oversight", "Compounded active formulations", "Continuous metabolic tracking"],
      link: "https://airoemed.com"
    },
    {
      id: "sexual-health",
      title: "Sexual Health & Confidence",
      subtitle: "Vitality & Performance",
      description: "Comprehensive hormonal assessments, biomarker balance, and targeted vitality protocols to sustain peak cellular energy, drive, and intimate performance with total discretion.",
      badge: "Confidential Care",
      features: ["100% Discreet digital consultation", "Custom compounded dosing", "Private doctor teleconsultation"],
      link: "https://airoemed.com"
    },
    {
      id: "hair",
      title: "Hair Regrowth & Density",
      subtitle: "Follicular Science",
      description: "Advanced dual-action topical and oral compounds engineered to halt androgenic miniaturization and stimulate cellular follicular regeneration for denser, fuller hair.",
      badge: "Precision Care",
      features: ["Custom topical finasteride/minoxidil", "Dermatologist formulated", "No generic fillers"],
      link: "https://airoemed.com"
    },
    {
      id: "skin",
      title: "Medical Dermatology & Skin",
      subtitle: "Cellular Skin Health",
      description: "Targeted prescription compounds formulated for stubborn dermatological concerns, hyperpigmentation, collagen synthesis, and cellular anti-aging.",
      badge: "Custom Compounded",
      features: ["High-potency retinoid formulations", "Anti-inflammatory actives", "Formulated to order"],
      link: "https://airoemed.com"
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
    <div className="bg-paper text-ink min-h-screen font-sans selection:bg-[#16213E] selection:text-paper overflow-clip flex flex-col">
      {/* =========================================================================
          SECTION 1: HERO (FITS PAGE, TOP-WHITE TO BOTTOM-DARK-BLUE GRADIENT & GLASSMORPHISM)
          ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-7rem)] py-10 lg:py-16 flex items-center justify-center bg-gradient-to-b from-white from-5% via-[#1E3E6E] via-60% to-[#081326] to-100% text-ink overflow-hidden border-b border-blue-950/30">
        {/* Glassmorphic Ambient Glow Elements */}
        <div className="absolute -top-10 left-1/4 w-[450px] h-[300px] bg-white/80 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[350px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-[400px] h-[280px] bg-sky-400/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1450px] mx-auto px-6 md:px-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Title, Subtitle, Description, Single CTA Button, Trust Badges */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Frosted Glass Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/80 bg-white/85 backdrop-blur-md text-[#0E1726] text-xs md:text-sm font-bold tracking-[0.22em] uppercase mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <Video className="w-4 h-4 text-[#1B4B8A]" /> TELEHEALTH & COMPOUNDED PHARMACY
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px] tracking-tight leading-[1.04] text-[#0E1726] mb-4">
                Clinical Care, <br />
                <span className="italic font-light text-[#1B4B8A]">Delivered Discretely.</span>
              </h1>

              <p className="font-serif text-lg sm:text-xl md:text-2xl lg:text-[24px] text-slate-800 italic max-w-2xl leading-snug mb-3.5 font-normal">
                Consult online with licensed medical doctors. Receive custom-compounded medications tailored precisely to your biological needs.
              </p>

              <p className="font-sans text-sm sm:text-base md:text-lg text-blue-100/95 max-w-xl leading-relaxed mb-6 font-light">
                AIRO eMed connects specialized physician oversight with our compounding pharmacy. From metabolic longevity and weight management to hair regrowth and hormone health—care is discreet, frictionless, and delivered to your doorstep.
              </p>

              {/* Primary External Action: Only Visit AIRO eMed */}
              <div className="flex w-full sm:w-auto items-center">
                <a
                  href="https://airoemed.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-visit-airo-emed-btn"
                  className="w-full sm:w-auto justify-center bg-white text-[#081326] px-10 py-4.5 sm:py-5 text-xs sm:text-sm tracking-[0.22em] uppercase font-extrabold hover:bg-blue-50 silent-luxury-transition rounded-full shadow-2xl shadow-black/35 inline-flex items-center gap-3 transition-transform hover:scale-[1.03] active:scale-[0.98] border border-white/90"
                >
                  Visit AIRO eMed <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5 text-[#081326]" />
                </a>
              </div>

              {/* Glassmorphic Trust Badges Card over Dark Blue */}
              <div className="mt-6 grid grid-cols-3 gap-4 sm:gap-6 text-left w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/20">
                <div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-bold">
                    <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5 text-sky-400" /> HIPAA
                  </div>
                  <p className="text-[11px] sm:text-xs text-blue-200 tracking-wide mt-1">Encrypted Records</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-bold">
                    <UserCheck className="w-4 sm:w-5 h-4 sm:h-5 text-sky-400" /> Licensed MDs
                  </div>
                  <p className="text-[11px] sm:text-xs text-blue-200 tracking-wide mt-1">Board-Certified</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-bold">
                    <Truck className="w-4 sm:w-5 h-4 sm:h-5 text-sky-400" /> Discreet
                  </div>
                  <p className="text-[11px] sm:text-xs text-blue-200 tracking-wide mt-1">Direct Delivery</p>
                </div>
              </div>

            </div>

            {/* Right Column: ONLY THE PHOTO SLIDESHOW IN FROSTED GLASS FRAME */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-[30px] p-2 sm:p-2.5 bg-white/20 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center ring-1 ring-white/50">
                <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-900/20 border border-white/30 shadow-inner">
                  <HeroSlider 
                    slides={emedHeroSlides} 
                    interval={3000}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 4 CORE CLINICAL CATEGORIES (LUXURY BENTO GRID)
          ========================================================================= */}
      <section className="py-20 md:py-32 px-6 md:px-12 w-full max-w-[1360px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14 md:mb-18 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100/90 text-slate-600 text-[10px] tracking-[0.25em] uppercase font-semibold border border-slate-200/60 mb-3.5">
            SPECIALIZED CARE PATHWAYS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal tracking-tight text-[#0E1726] mb-3.5 leading-tight">
            Targeted Treatments. <br />
            <span className="italic font-light text-slate-500">Compounded for Your Biology.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          
          {/* Card 1: Left Tall Card (WEIGHT MANAGEMENT) */}
          <div className="lg:col-span-4 bg-[#F4F4F6] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between border border-slate-200/50 shadow-sm hover:shadow-md transition-all group">
            <div>
              <div className="w-full aspect-[4/4.2] rounded-[24px] overflow-hidden bg-white mb-6 flex items-center justify-center shadow-sm border border-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/hero/emed-weight-loss-female.jpg" 
                  alt="Weight Management & GLP-1 Metabolic Care" 
                  className="w-full h-full object-cover object-top rounded-[20px] group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] font-bold text-slate-800 shadow-sm border border-slate-200/40">
                  Weight Management
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#0E1726] leading-snug tracking-tight mb-3">
                Physician-guided GLP-1 weight optimization and sustainable metabolic longevity.
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-500 font-light leading-relaxed mb-6">
                Personalized Semaglutide and Tirzepatide compounded therapies paired with clinical biomarker monitoring.
              </p>
            </div>

            <div>
              <Link
                href="/consultations"
                className="inline-flex items-center justify-between bg-[#0E1726] text-white pl-6 pr-2.5 py-2.5 rounded-full text-xs font-semibold tracking-wider hover:bg-[#1E293B] transition-colors w-fit gap-4 group/btn shadow-md"
              >
                <span>Explore AIRO eMed</span>
                <div className="w-8 h-8 rounded-full bg-white text-[#0E1726] flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4 text-[#0E1726]" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: 8 Cols containing Top Row (Cards 2 & 3) and Bottom Row (Card 4) */}
          <div className="lg:col-span-8 flex flex-col gap-5 md:gap-6 justify-between">
            
            {/* Top Row: Cards 2 & 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-stretch">
              
              {/* Card 2: Mid-Top (HAIR HEALTH) */}
              <div className="md:col-span-7 bg-[#F4F4F6] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between border border-slate-200/50 shadow-sm hover:shadow-md transition-all group">
                <div className="w-full aspect-[16/9] rounded-[22px] overflow-hidden bg-white mb-5 shadow-sm border border-slate-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/images/hero/emed-hair-regrowth.png" 
                    alt="Hair Health & Density" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] font-bold text-slate-800 shadow-sm border border-slate-200/40">
                    Hair Health
                  </span>
                </div>
                <p className="font-sans text-base sm:text-lg text-slate-500 leading-snug">
                  <span className="font-bold text-[#0E1726]">Hair Health & Density:</span> Advanced dual-action compounds engineered to halt follicle miniaturization and stimulate cellular regeneration for denser, fuller hair.
                </p>
              </div>

              {/* Card 3: Top-Right Card (SEXUAL HEALTH - FULL BG CARD WITH TEXT ON TOP) */}
              <div className="md:col-span-5 rounded-[32px] p-6 sm:p-7 flex flex-col justify-end border border-white/20 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group min-h-[260px] md:min-h-[280px]">
                {/* Full Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/hero/emed-sexual-health.jpg" 
                  alt="Sexual Health & Intimacy" 
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient Overlay for high-contrast legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30 backdrop-blur-[1px]" />

                {/* Content Layer on Top */}
                <div className="relative z-10 flex flex-col justify-end">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[8px] uppercase tracking-[0.2em] font-bold text-white border border-white/30 w-fit mb-3">
                    Sexual Health
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight mb-2 leading-tight drop-shadow-sm">
                    Intimacy & Vitality
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 font-light leading-snug max-w-xs drop-shadow-sm">
                    100% confidential digital consultations and precision compounded solutions.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Row: Card 4 (SKIN CARE) */}
            <div className="bg-[#F4F4F6] rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="max-w-md">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-200/80 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-700 mb-3">
                  Skin Care
                </span>
                <p className="font-sans text-xl sm:text-2xl md:text-3xl text-slate-500 leading-snug">
                  <span className="font-bold text-[#0E1726]">Medical Dermatology & Skin Care</span> formulated to restore cellular turnover, boost collagen, and enhance dermal longevity.
                </p>
              </div>
              <div className="w-full md:w-64 lg:w-72 aspect-[4/3] rounded-[22px] overflow-hidden bg-white shrink-0 shadow-sm border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/hero/emed-skin-dermatology.jpg" 
                  alt="Medical Skin Care & Dermatology" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW AIRO EMED WORKS
          ========================================================================= */}
      <section className="bg-[#FAF8F5] border-y border-[#16213E]/10 py-24 md:py-36 px-6 md:px-16 w-full">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
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
                className="bg-white rounded-3xl p-8 border border-[#16213E]/10 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <span className="font-serif text-3xl font-light text-[#16213E]/30 block mb-6">
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
          SECTION 4: CALL TO ACTION BANNER (NAVY BLUE ACCENTS)
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-16 w-full max-w-[1400px] mx-auto">
        <div className="bg-[#09120F] rounded-[40px] text-paper p-12 md:p-20 relative overflow-hidden shadow-2xl border border-white/10 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-[#1B2A4A]/40 border border-[#1B2A4A]/60 flex items-center justify-center text-[#6A93D8] mb-8 shadow-inner">
            <Stethoscope className="w-8 h-8" />
          </div>

          <span className="text-[10px] tracking-[0.3em] uppercase text-[#6A93D8] font-bold block mb-4">
            START YOUR CLINICAL INTAKE
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-paper mb-6 max-w-2xl leading-tight">
            Ready to Begin with <br />
            <span className="italic font-light text-[#6A93D8]">AIRO eMed?</span>
          </h2>

          <p className="font-sans text-xs md:text-sm text-paper/70 max-w-lg mb-10 leading-relaxed font-light">
            Skip the waiting room. Access licensed physicians, custom compounded medications, and discreet express delivery on our dedicated telehealth portal.
          </p>

          <a
            href="https://airoemed.com"
            target="_blank"
            rel="noopener noreferrer"
            id="bottom-visit-airo-emed-btn"
            className="bg-[#1B2A4A] text-white px-12 py-5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#283E6D] silent-luxury-transition rounded-full shadow-2xl inline-flex items-center gap-3 transition-transform hover:scale-105"
          >
            Visit AIRO eMed (airoemed.com) <ExternalLink className="w-4 h-4 text-white" />
          </a>
        </div>
      </section>
    </div>
  );
}
