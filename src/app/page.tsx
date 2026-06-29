"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Activity, Cpu } from "lucide-react";
import Link from "next/link";
import { useCms } from "@/context/CmsContext";

// Custom Parallax Image component for smooth, luxury page scroll animations
function ParallaxImage({ 
  src, 
  alt, 
  className = "", 
  speed = 0.1 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yPercent = speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${yPercent}%`, `${yPercent}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.02]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover"
        transition={{ type: "spring", stiffness: 30, damping: 15 }}
      />
    </div>
  );
}

export default function HomePage() {
  const cmsData = useCms();

  const homeData = cmsData.pages.home;
  const heroRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pillars = (homeData.sections as any)?.pillars;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ecosystemCategories = (homeData.sections as any)?.ecosystemCategories || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lifestyleBanner = (homeData.sections as any)?.lifestyleBanner;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const manifesto = (homeData.sections as any)?.manifesto;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const footerData = (homeData.sections as any)?.footer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const praana = (homeData.sections as any)?.praana;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buttons = (homeData as any)?.buttons;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heroImage = (homeData as any)?.heroImage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const homeTagline = (homeData as any)?.tagline;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const homeDescription = (homeData as any)?.description;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">

      {/* =========================================================================
          SECTION 1: HERO SECTION (FULL-WIDTH BACKGROUND)
          ========================================================================= */}
      <section ref={heroRef} className="relative min-h-[100dvh] md:min-h-[95vh] w-full flex items-center justify-start px-6 md:px-16 overflow-hidden">
        {/* Full-width Background Image with Parallax & Slow Zoom */}
        <div className="absolute inset-0 w-full h-full">
          <ParallaxImage 
            src={heroImage || "https://images.unsplash.com/photo-1601600576337-c1d8a0d1373c?q=80&w=2000"} 
            alt="AIRO Connected Wellness"
            className="w-full h-full"
            speed={0.1}
          />
          {/* Elegant dark gradient mask for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2114] via-[#0B2114]/75 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-[1000px] text-[#FAF8F5] pt-32 md:pt-16 mt-8 md:mt-0 w-full flex flex-col items-center text-center md:items-start md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto md:mx-0 mb-6 md:mb-8">
            <Sparkles className="w-3 h-3 text-[#FAF8F5]" /> {homeData.subtitle || "A Connected Wellness Ecosystem"}
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight leading-[1.02] text-[#FAF8F5] mb-6 md:mb-8">
            {homeData.title.split(' ')[0] || "The Future of"} <br/>
            <span className="italic font-light text-[#FAF8F5]/80">{homeData.title.split(' ').slice(1).join(' ') || "Preventive Healthcare."}</span>
          </h1>
          
          <p className="font-serif text-lg md:text-2xl text-[#FAF8F5]/95 italic max-w-2xl leading-relaxed mb-6">
            {homeTagline || "An ecosystem uniting nutrition, diagnostics, pharmacy, clinical care, and digital health."}
          </p>
          
          <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-8 md:mb-12 tracking-wide">
            {homeDescription || "At AIRO, we believe healthcare shouldn't be reactive. By integrating clinical precision with daily wellness, we build a connected environment designed to optimize your biology, ensure longevity, and prevent illness before it starts."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
            <Link
              href={buttons?.primary?.link || "/grocery"}
              className="w-full sm:w-auto justify-center bg-[#FAF8F5] text-[#0B2114] px-8 md:px-10 py-4 md:py-5 text-[10px] tracking-[0.2em] uppercase font-bold hover:opacity-90 silent-luxury-transition rounded-full shadow-lg inline-flex items-center gap-3"
            >
              {buttons?.primary?.text || "Explore Essentials"} <ArrowRight className="w-4 h-4 text-[#0B2114]" />
            </Link>
            <Link
              href={buttons?.secondary?.link || "/pharmacy"}
              className="w-full sm:w-auto text-center border border-[#FAF8F5]/20 text-[#FAF8F5] hover:bg-[#FAF8F5]/5 px-8 py-4 md:py-5 text-[10px] tracking-[0.2em] uppercase font-bold silent-luxury-transition rounded-full"
            >
              {buttons?.secondary?.text || "Join Compounding Waitlist"}
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THREE EQUAL PILLARS
          ========================================================================= */}
      <section className="bg-white border-y border-[#0B2114]/10 py-24 md:py-36 px-6 md:px-16 w-full">
        <div className="max-w-[1500px] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
              {pillars?.sectionLabel || "The Foundations"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
              {(pillars?.sectionTitle || "Unified Care. Three Pillars.").split('.')[0]}. <span className="italic font-light text-[#0B2114]/80">{(pillars?.sectionTitle || "Unified Care. Three Pillars.").split('.').slice(1).join('.')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            {/* Pillar 1: Essentials */}
            <div className="flex flex-col group h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
                <ParallaxImage 
                  src={pillars?.essentials?.image || "https://plus.unsplash.com/premium_photo-1663039978847-63f7484bf701?q=80&w=800"}
                  alt={pillars?.essentials?.title || "AIRO Essentials Market"}
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute inset-0 bg-[#0B2114]/5 mix-blend-multiply" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0B2114] mb-3">{pillars?.essentials?.title || "AIRO Essentials"}</h3>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#0B2114]/50 font-bold mb-4">
                {pillars?.essentials?.subtitle || "Fresh • Organic • Local • Wellness Retail"}
              </p>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed mb-6 flex-grow">
                {pillars?.essentials?.description || "A carefully curated market featuring organic produce, functional groceries, and premium health goods selected to nourish your biology from the inside out."}
              </p>
              <Link 
                href={pillars?.essentials?.buttonLink || "/grocery"} 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
              >
                {pillars?.essentials?.buttonText || "Browse Essentials"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2: Pharmacy */}
            <div className="flex flex-col group h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
                <ParallaxImage 
                  src={pillars?.pharmacy?.image || "/pharmacy-hero.jpg"}
                  alt={pillars?.pharmacy?.title || "AIRO Pharmacy"}
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute inset-0 bg-[#0B2114]/5 mix-blend-multiply" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0B2114] mb-3">{pillars?.pharmacy?.title || "AIRO Pharmacy"}</h3>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#0B2114]/50 font-bold mb-4">
                {pillars?.pharmacy?.subtitle || "Prescriptions • Supplements • Custom Compounding"}
              </p>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed mb-6 flex-grow">
                {pillars?.pharmacy?.description || "Expert prescription management coupled with precision bio-available supplements and clinical wellness advice tailored to your personal biomarkers."}
              </p>
              <Link 
                href={pillars?.pharmacy?.buttonLink || "/pharmacy"} 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
              >
                {pillars?.pharmacy?.buttonText || "Visit Pharmacy Portal"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3: Minute Clinic */}
            <div className="flex flex-col group h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
                <ParallaxImage 
                  src={pillars?.clinic?.image || "/clinic-connected.jpg"}
                  alt={pillars?.clinic?.title || "AIRO Minute Clinic"}
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute inset-0 bg-[#0B2114]/5 mix-blend-multiply" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0B2114] mb-3">{pillars?.clinic?.title || "AIRO Minute Clinic"}</h3>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#0B2114]/50 font-bold mb-4">
                {pillars?.clinic?.subtitle || "Preventive Care • Walk-In Clinics • Screenings"}
              </p>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed mb-6 flex-grow">
                {pillars?.clinic?.description || "Frictionless in-store and virtual medical services. Get immunizations, treatment, and proactive diagnostics with minimal wait times."}
              </p>
              <Link 
                href={pillars?.clinic?.buttonLink || "/minute-clinic"} 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
              >
                {pillars?.clinic?.buttonText || "View Clinic Services"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: AIRO HEALTH SCAN (CHAIR FEATURE SECTION)
          ========================================================================= */}
      <section className="bg-[#09120F] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16 w-full relative">
        <div className="max-w-[1450px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Chair Image (Prominent Visual Asset) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-[2/1] sm:aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden bg-[#09120F] flex items-center justify-center shadow-2xl">
                <ParallaxImage 
                  src={praana?.image || "/airo-praana-hero.png"} 
                  alt={praana?.title || "AIRO Praana"} 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09120F]/60 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Assessment Details */}
            <div className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
                <Cpu className="w-3 h-3 text-[#FAF8F5]/70" /> {praana?.sectionLabel || "Clinical Innovation"}
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6 text-[#FAF8F5]">
                {(praana?.title || "AIRO Praana").split(' ')[0]} <br/>
                <span className="italic font-light text-[#FAF8F5]/80">{(praana?.title || "AIRO Praana").split(' ').slice(1).join(' ')}</span>
              </h2>

              <p className="font-serif text-lg md:text-xl italic text-[#FAF8F5]/90 max-w-xl mb-8 font-light leading-relaxed">
                {praana?.tagline || "A 5-minute diagnostic assessment. A lifetime of longevity insights."}
              </p>

              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
                {praana?.description || "Step into the future of diagnostics. The AIRO Smart Assessment Chair captures a comprehensive suite of key physiological indicators in just minutes, establishing a detailed baseline for your personalized care plan."}
              </p>

              {/* Grid of captured metrics */}
              <div className="border-t border-b border-[#FAF8F5]/10 py-6 mb-10 max-w-xl">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#FAF8F5]/40 font-bold mb-6">
                  Key Metrics Captured Real-Time
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans text-[#FAF8F5]/90">
                  {(praana?.metrics || "Blood Pressure, Heart Rate & ECG, Blood Oxygen (SpO2), Respiratory Rate, Body Temperature, Weight & BMI").split(',').map((metric: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/40" /> {metric.trim()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Care block */}
              <div className="border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 p-6 rounded-2xl max-w-xl">
                <span className="flex items-center gap-2 text-[#FAF8F5] text-[9px] font-bold tracking-[0.2em] uppercase mb-3">
                  <Activity className="w-3.5 h-3.5" /> {praana?.connectedCareTitle || "CONNECTED CARE"}
                </span>
                <p className="font-sans text-xs text-[#FAF8F5]/70 leading-relaxed">
                  {praana?.connectedCareText || "Your insights don't stop at the device. Results integrate instantly with your secure health profile, shared automatically with your providers. If needed, the ecosystem connects you directly to a healthcare professional for real-time clinical consultations."}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ECOSYSTEM CATEGORIES SHOWCASE
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#0B2114]/10 gap-6 items-center text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-4 font-bold">
              The Architecture
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
              Ecosystem <span className="italic font-light text-[#0B2114]/80">Gateways</span>
            </h2>
          </div>
          <p className="font-sans text-xs text-[#0B2114]/60 max-w-sm leading-relaxed">
            Discover the gateways that form the AIRO platform—where premium retail meets clinical precision.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#0B2114]/10">
          {ecosystemCategories.map((cat: { name: string; description: string; link: string; status: string }, idx: number) => (
            <Link 
              key={idx} 
              href={cat.link || "/"}
              className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:px-4 silent-luxury-transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                {/* Index tag */}
                <span className="font-serif text-lg md:text-xl text-[#0B2114]/30 group-hover:text-[#0B2114] silent-luxury-transition">
                  0{idx + 1}
                </span>
                
                {/* Category Name */}
                <span className="font-serif text-2xl md:text-3xl text-[#0B2114] font-medium tracking-tight w-64">
                  {cat.name}
                </span>

                {/* Category Description */}
                <span className="font-sans text-xs md:text-sm text-[#0B2114]/60 group-hover:text-[#0B2114]/80 silent-luxury-transition max-w-xl">
                  {cat.description}
                </span>
              </div>

              {/* Status / Link action */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#0B2114]/40 border border-[#0B2114]/10 px-4 py-1.5 rounded-full">
                  {cat.status || "Coming Soon"}
                </span>
                <div className="w-8 h-8 rounded-full border border-[#0B2114]/10 flex items-center justify-center text-[#0B2114] group-hover:border-[#0B2114] group-hover:bg-[#0B2114]/5 silent-luxury-transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LIFESTYLE IMAGE BANNER
          ========================================================================= */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
        <ParallaxImage 
          src={lifestyleBanner?.image || "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000"} 
          alt="Luxury holistic wellness lifestyle" 
          className="w-full h-full"
          speed={0.12}
        />
        <div className="absolute inset-0 bg-[#0B2114]/15" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
          <h2 className="font-serif text-4xl md:text-6xl text-[#FAF8F5] tracking-tight mb-4 drop-shadow-lg">
            {(lifestyleBanner?.title || "Sourced for Longevity, Engineered for Purity.").split(',')[0]}, <br/><span className="italic font-light">{(lifestyleBanner?.title || "Sourced for Longevity, Engineered for Purity.").split(',').slice(1).join(',')}</span>
          </h2>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/90 font-bold">
            {lifestyleBanner?.subtitle || "radical integration"}
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: MANIFESTO (TEXT BLOCK)
          ========================================================================= */}
      <section className="py-24 md:py-36 px-8 max-w-[1200px] mx-auto text-center">
        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#0B2114]/40 mb-8">
          {manifesto?.sectionLabel || "The Manifesto"}
        </h3>
        <p className="font-serif text-2xl md:text-4xl leading-[1.6] text-[#0B2114] mb-12 max-w-4xl mx-auto">
          <span className="float-left text-7xl md:text-9xl leading-none pr-4 font-normal text-[#0B2114]/20">A</span>
          {manifesto?.text || "paradigm shift in modern longevity. We integrate organic nutrition, precise diagnostic scanning, personalized therapeutics, and virtual clinical guidance into a seamless health architecture. Welcome to the new standard of living well."}
        </p>
      </section>

      {/* =========================================================================
          SECTION 7: FOOTER
          ========================================================================= */}
      <footer className="border-t border-[#0B2114]/10 py-24 px-8 md:px-16 bg-[#0B2114] text-[#FAF8F5] rounded-t-[3rem] w-full">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">

          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-4xl tracking-[0.2em] uppercase mb-12 text-[#FAF8F5]">AIRO<span className="opacity-50">.</span></h2>
            <h3 className="font-sans text-xl font-medium mb-4">{footerData?.waitlistTitle || "The Waitlist"}</h3>
            <p className="text-sm text-[#FAF8F5]/60 mb-8 max-w-sm leading-relaxed">
              {footerData?.waitlistDescription || "Subscribe to receive clinical updates, seasonal grocery drops, and exclusive invitation status."}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 max-w-sm">
              <input
                type="text"
                placeholder="Name"
                className="w-full border-b border-[#FAF8F5]/30 pb-3 text-sm focus:outline-none focus:border-[#FAF8F5] bg-transparent placeholder-[#FAF8F5]/30 text-[#FAF8F5] silent-luxury-transition"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border-b border-[#FAF8F5]/30 pb-3 text-sm focus:outline-none focus:border-[#FAF8F5] bg-transparent placeholder-[#FAF8F5]/30 text-[#FAF8F5] silent-luxury-transition"
              />
              <button
                type="submit"
                className="w-full bg-[#FAF8F5] text-[#0B2114] text-[10px] font-bold tracking-widest uppercase py-4 rounded-full hover:opacity-90 silent-luxury-transition"
              >
                Join Waitlist
              </button>
            </form>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FAF8F5]/40 tracking-widest uppercase">Ecosystem Portals</h3>
            <ul className="space-y-4 text-sm text-[#FAF8F5]/80 font-medium">
              <li><Link href="/grocery" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Essentials</Link></li>
              <li><Link href="/pharmacy" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Pharmacy Portal</Link></li>
              <li><Link href="/minute-clinic" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Minute Clinic</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FAF8F5]/40 tracking-widest uppercase">Support</h3>
            <ul className="space-y-4 text-sm text-[#FAF8F5]/80 font-medium">
              <li><a href="mailto:concierge@airo.com" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">concierge@airo.com</a></li>
              <li><a href="mailto:clinical@airo.com" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">clinical@airo.com</a></li>
              <li className="pt-8 text-[#FAF8F5]/30 text-[10px] tracking-widest uppercase">{footerData?.copyright || "© 2026 AIRO Health."}</li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
