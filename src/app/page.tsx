"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Activity, Cpu } from "lucide-react";
import Link from "next/link";
import { useCms } from "@/context/CmsContext";
import HeroSlider from "@/components/HeroSlider";

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
  const [isHealthSite, setIsHealthSite] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const port = window.location.port;
      setIsHealthSite(
        host.includes("airohealthhub") ||
        host.includes("airohealth-test") ||
        (host.includes("localhost") && port === "3001")
      );
    }
  }, []);

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
    <div className="min-h-screen bg-paper text-ink overflow-x-hidden selection:bg-theme selection:text-paper">

      {/* =========================================================================
          SECTION 1: HERO SECTION (FULL-WIDTH BACKGROUND)
          ========================================================================= */}
      <section ref={heroRef} className="relative min-h-[100dvh] md:min-h-[95vh] w-full flex items-center justify-center px-6 md:px-16 overflow-hidden">
        {/* Full-width Background Image with Parallax & Slow Zoom */}
        <div className="absolute inset-0 w-full h-full">
          {isHealthSite ? (
            <ParallaxImage 
              src={heroImage || "https://images.unsplash.com/photo-1601600576337-c1d8a0d1373c?q=80&w=2000"} 
              alt="AIRO Connected Wellness"
              className="w-full h-full"
              speed={0.1}
            />
          ) : (
            <HeroSlider 
              images={[
                heroImage || "https://images.unsplash.com/photo-1601600576337-c1d8a0d1373c?q=80&w=2000",
                "/uploads/home-hero-slide-2.png", // NOTE: Replace this path with the photo you uploaded!
                "/clinic-connected.jpg"
              ]} 
              interval={1000} // Changes every 1 second as requested
            />
          )}
          {/* Subtle light overlay to ensure dark text readability on any image, though the image itself is white in the center */}
          <div className="absolute inset-0 bg-white/30 md:bg-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-[1000px] text-ink pt-32 md:pt-16 mt-8 md:mt-0 w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme/20 bg-theme/5 text-ink text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto mb-6 md:mb-8">
            <Sparkles className="w-3 h-3 text-ink" /> {homeData.subtitle || "A Connected Wellness Ecosystem"}
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight leading-[1.02] text-ink mb-6 md:mb-8">
            {homeData.title.split(' ')[0] || "The Future of"} <br/>
            <span className="italic font-light text-ink/80">{homeData.title.split(' ').slice(1).join(' ') || "Preventive Healthcare."}</span>
          </h1>
          
          <p className="font-serif text-lg md:text-2xl text-ink/90 italic max-w-2xl leading-relaxed mb-6">
            {homeTagline || "An ecosystem uniting nutrition, diagnostics, pharmacy, clinical care, and digital health."}
          </p>
          
          <p className="font-sans text-xs md:text-sm text-ink/70 max-w-lg leading-relaxed mb-8 md:mb-12 tracking-wide mx-auto">
            {homeDescription || "At AIRO, we believe healthcare shouldn't be reactive. By integrating clinical precision with daily wellness, we build a connected environment designed to optimize your biology, ensure longevity, and prevent illness before it starts."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <Link
              href={buttons?.primary?.link || "/grocery"}
              className="w-full sm:w-auto justify-center bg-theme text-paper px-8 md:px-10 py-4 md:py-5 text-[10px] tracking-[0.2em] uppercase font-bold hover:opacity-90 silent-luxury-transition rounded-full shadow-lg inline-flex items-center gap-3"
            >
              {buttons?.primary?.text || "Explore Essentials"} <ArrowRight className="w-4 h-4 text-paper" />
            </Link>
            <Link
              href={buttons?.secondary?.link || "/pharmacy"}
              className="w-full sm:w-auto text-center border border-theme/20 text-ink hover:bg-theme/5 px-8 py-4 md:py-5 text-[10px] tracking-[0.2em] uppercase font-bold silent-luxury-transition rounded-full"
            >
              {buttons?.secondary?.text || "Join Compounding Waitlist"}
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THREE EQUAL PILLARS
          ========================================================================= */}
      <section className="bg-white border-y border-theme/10 py-24 md:py-36 px-6 md:px-16 w-full">
        <div className="max-w-[1500px] mx-auto">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-ink/40 block mb-6 font-bold">
              {pillars?.sectionLabel || "The Foundations"}
            </span>
            <h2 className="font-serif text-5xl md:text-6xl font-medium tracking-tight leading-tight">
              {(pillars?.sectionTitle || "Unified Care. Three Pillars.").split('.')[0]}. <span className="italic font-light text-ink/60">{(pillars?.sectionTitle || "Unified Care. Three Pillars.").split('.').slice(1).join('.')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Pillar 1: Essentials */}
            <Link 
              href={pillars?.essentials?.buttonLink || "/grocery"}
              className="group relative flex flex-col h-full bg-theme/[0.02] rounded-[32px] overflow-hidden border border-theme/5 hover:bg-white hover:shadow-2xl hover:shadow-[#1C1C1E]/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-theme/5">
                <ParallaxImage 
                  src={pillars?.essentials?.image || "https://plus.unsplash.com/premium_photo-1663039978847-63f7484bf701?q=80&w=800"}
                  alt={pillars?.essentials?.title || "AIRO Essentials Market"}
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm border border-theme/10">
                  <ArrowRight className="w-4 h-4 text-ink -rotate-45" />
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <h3 className="font-serif text-3xl font-medium text-ink tracking-tight mb-2 group-hover:text-theme transition-colors duration-300">{pillars?.essentials?.title || "AIRO Essentials"}</h3>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40 font-bold mb-6">
                  {pillars?.essentials?.subtitle || "Fresh • Organic • Local • Wellness Retail"}
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed font-light flex-grow">
                  {pillars?.essentials?.description || "A carefully curated market featuring organic produce, functional groceries, and premium health goods selected to nourish your biology from the inside out."}
                </p>
              </div>
            </Link>

            {/* Pillar 2: Pharmacy */}
            <Link 
              href={pillars?.pharmacy?.buttonLink || "/pharmacy"}
              className="group relative flex flex-col h-full bg-theme/[0.02] rounded-[32px] overflow-hidden border border-theme/5 hover:bg-white hover:shadow-2xl hover:shadow-[#1C1C1E]/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-theme/5">
                <ParallaxImage 
                  src={pillars?.pharmacy?.image || "/pharmacy-hero.jpg"}
                  alt={pillars?.pharmacy?.title || "AIRO Pharmacy"}
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm border border-theme/10">
                  <ArrowRight className="w-4 h-4 text-ink -rotate-45" />
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <h3 className="font-serif text-3xl font-medium text-ink tracking-tight mb-2 group-hover:text-theme transition-colors duration-300">{pillars?.pharmacy?.title || "AIRO Pharmacy"}</h3>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40 font-bold mb-6">
                  {pillars?.pharmacy?.subtitle || "Prescriptions • Supplements • Custom Compounding"}
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed font-light flex-grow">
                  {pillars?.pharmacy?.description || "Expert prescription management coupled with precision bio-available supplements and clinical wellness advice tailored to your personal biomarkers."}
                </p>
              </div>
            </Link>

            {/* Pillar 3: Minute Clinic */}
            <Link 
              href={pillars?.clinic?.buttonLink || "/minute-clinic"}
              className="group relative flex flex-col h-full bg-theme/[0.02] rounded-[32px] overflow-hidden border border-theme/5 hover:bg-white hover:shadow-2xl hover:shadow-[#1C1C1E]/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-theme/5">
                <ParallaxImage 
                  src={pillars?.clinic?.image || "/clinic-connected.jpg"}
                  alt={pillars?.clinic?.title || "AIRO Minute Clinic"}
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm border border-theme/10">
                  <ArrowRight className="w-4 h-4 text-ink -rotate-45" />
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <h3 className="font-serif text-3xl font-medium text-ink tracking-tight mb-2 group-hover:text-theme transition-colors duration-300">{pillars?.clinic?.title || "AIRO Minute Clinic"}</h3>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40 font-bold mb-6">
                  {pillars?.clinic?.subtitle || "Preventive Care • Walk-In Clinics • Screenings"}
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed font-light flex-grow">
                  {pillars?.clinic?.description || "Frictionless in-store and virtual medical services. Get immunizations, treatment, and proactive diagnostics with minimal wait times."}
                </p>
              </div>
            </Link>

            {/* Pillar 4: AIRO E-Med */}
            <Link 
              href="https://airoemed.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex flex-col h-full bg-theme/[0.02] rounded-[32px] overflow-hidden border border-theme/5 hover:bg-white hover:shadow-2xl hover:shadow-[#1C1C1E]/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-theme/5">
                <ParallaxImage 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800"
                  alt="AIRO E-Med Virtual Consultation"
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm border border-theme/10">
                  <ArrowRight className="w-4 h-4 text-ink -rotate-45" />
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <h3 className="font-serif text-3xl font-medium text-ink tracking-tight mb-2 group-hover:text-theme transition-colors duration-300">AIRO E-Med</h3>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40 font-bold mb-6">
                  Hair Loss • Sexual Health • Weight Management
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed font-light flex-grow">
                  Connect with doctors through secure virtual consultations for personalized treatment. Get your custom prescriptions delivered directly to your door in discreet packaging.
                </p>
              </div>
            </Link>


          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: AIRO HEALTH SCAN (CHAIR FEATURE SECTION)
          ========================================================================= */}
      <section className="bg-[#09120F] text-paper py-24 md:py-36 px-6 md:px-16 w-full relative">
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-paper/10 bg-paper/5 text-paper text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
                <Cpu className="w-3 h-3 text-paper/70" /> {praana?.sectionLabel || "Clinical Innovation"}
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6 text-paper">
                {(praana?.title || "AIRO Praana").split(' ')[0]} <br/>
                <span className="italic font-light text-paper/80">{(praana?.title || "AIRO Praana").split(' ').slice(1).join(' ')}</span>
              </h2>

              <p className="font-serif text-lg md:text-xl italic text-paper/90 max-w-xl mb-8 font-light leading-relaxed">
                {praana?.tagline || "A 5-minute diagnostic assessment. A lifetime of longevity insights."}
              </p>

              <p className="font-sans text-xs md:text-sm text-paper/70 max-w-lg leading-relaxed mb-10 tracking-wide">
                {praana?.description || "Step into the future of diagnostics. The AIRO Smart Assessment Chair captures a comprehensive suite of key physiological indicators in just minutes, establishing a detailed baseline for your personalized care plan."}
              </p>

              {/* Grid of captured metrics */}
              <div className="border-t border-b border-paper/10 py-6 mb-10 max-w-xl">
                <p className="text-[10px] tracking-[0.2em] uppercase text-paper/40 font-bold mb-6">
                  Key Metrics Captured Real-Time
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans text-paper/90">
                  {(praana?.metrics || "Blood Pressure, Heart Rate & ECG, Blood Oxygen (SpO2), Respiratory Rate, Body Temperature, Weight & BMI").split(',').map((metric: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-paper/40" /> {metric.trim()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Care block */}
              <div className="border border-paper/10 bg-paper/5 p-6 rounded-2xl max-w-xl">
                <span className="flex items-center gap-2 text-paper text-[9px] font-bold tracking-[0.2em] uppercase mb-3">
                  <Activity className="w-3.5 h-3.5" /> {praana?.connectedCareTitle || "CONNECTED CARE"}
                </span>
                <p className="font-sans text-xs text-paper/70 leading-relaxed">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-theme/10 gap-6 items-center text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] tracking-[0.3em] uppercase text-ink/50 block mb-4 font-bold">
              The Architecture
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
              Ecosystem <span className="italic font-light text-ink/80">Gateways</span>
            </h2>
          </div>
          <p className="font-sans text-xs text-ink/60 max-w-sm leading-relaxed">
            Discover the gateways that form the AIRO platform—where premium retail meets clinical precision.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#1C1C1E]/10">
          {ecosystemCategories.map((cat: { name: string; description: string; link: string; status: string }, idx: number) => (
            <Link 
              key={idx} 
              href={cat.link || "/"}
              {...(cat.link?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:px-4 silent-luxury-transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                {/* Index tag */}
                <span className="font-serif text-lg md:text-xl text-ink/30 group-hover:text-ink silent-luxury-transition">
                  0{idx + 1}
                </span>
                
                {/* Category Name */}
                <span className="font-serif text-2xl md:text-3xl text-ink font-medium tracking-tight w-64">
                  {cat.name}
                </span>

                {/* Category Description */}
                <span className="font-sans text-xs md:text-sm text-ink/60 group-hover:text-ink/80 silent-luxury-transition max-w-xl">
                  {cat.description}
                </span>
              </div>

              {/* Status / Link action */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-ink/40 border border-theme/10 px-4 py-1.5 rounded-full">
                  {cat.status || "Coming Soon"}
                </span>
                <div className="w-8 h-8 rounded-full border border-theme/10 flex items-center justify-center text-ink group-hover:border-theme group-hover:bg-theme/5 silent-luxury-transition">
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
        <div className="absolute inset-0 bg-theme/15" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
          <h2 className="font-serif text-4xl md:text-6xl text-paper tracking-tight mb-4 drop-shadow-lg">
            {(lifestyleBanner?.title || "Sourced for Longevity, Engineered for Purity.").split(',')[0]}, <br/><span className="italic font-light">{(lifestyleBanner?.title || "Sourced for Longevity, Engineered for Purity.").split(',').slice(1).join(',')}</span>
          </h2>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/90 font-bold">
            {lifestyleBanner?.subtitle || "radical integration"}
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: MANIFESTO (TEXT BLOCK)
          ========================================================================= */}
      <section className="py-24 md:py-36 px-8 max-w-[1200px] mx-auto text-center">
        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink/40 mb-8">
          {manifesto?.sectionLabel || "The Manifesto"}
        </h3>
        <p className="font-serif text-2xl md:text-4xl leading-[1.6] text-ink mb-12 max-w-4xl mx-auto">
          <span className="float-left text-7xl md:text-9xl leading-none pr-4 font-normal text-ink/20">A</span>
          {manifesto?.text || "paradigm shift in modern longevity. We integrate organic nutrition, precise diagnostic scanning, personalized therapeutics, and virtual clinical guidance into a seamless health architecture. Welcome to the new standard of living well."}
        </p>
      </section>

      
    </div>
  );
}
