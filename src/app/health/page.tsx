"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Cpu } from "lucide-react";
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

export default function HealthPage() {
  const cmsData = useCms();

  const healthData = cmsData.pages.health;
  const heroRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hd = healthData as any;
  const praana = hd.sections?.praana;
  const clinicalCategories = hd.sections?.clinicalCategories || [];
  const buttons = hd.buttons;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1C1C1E] overflow-x-hidden selection:bg-[#1C1C1E] selection:text-[#FFFFFF]">

      {/* =========================================================================
          SECTION 1: HERO SECTION (FULL-WIDTH BACKGROUND)
          ========================================================================= */}
      <section ref={heroRef} className="relative min-h-[100dvh] md:min-h-[95vh] w-full flex items-center justify-start px-6 md:px-16 overflow-hidden">
        {/* Full-width Background Image with Parallax & Slow Zoom */}
        <div className="absolute inset-0 w-full h-full">
          <ParallaxImage 
            src={hd.heroImage || "https://plus.unsplash.com/premium_photo-1675686363422-7d7ab88ee530?q=80&w=2000"} 
            alt="AIRO Connected Wellness"
            className="w-full h-full"
            speed={0.1}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E] via-[#1C1C1E]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1000px] text-[#FFFFFF] pt-12 w-full flex flex-col items-center text-center md:items-start md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 text-[#FFFFFF] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto md:mx-0 mb-6 md:mb-8">
            <Activity className="w-3 h-3 text-[#FFFFFF]" /> {healthData.subtitle || "PREVENTATIVE CARE. REDEFINED."}
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight leading-[1.02] text-[#FFFFFF] mb-6 md:mb-8">
            {healthData.title.split(' ')[0] || "AIRO"} <br/>
            <span className="italic font-light text-[#FFFFFF]/80">{healthData.title.split(' ').slice(1).join(' ') || "Health"}</span>
          </h1>
          
          <p className="font-serif text-lg md:text-2xl text-[#FFFFFF]/95 italic max-w-2xl leading-relaxed mb-6">
            {hd.tagline || "Clinical-grade prescription care, longevity protocols, minute clinics, and advanced diagnostics."}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center mt-12 w-full">
            <Link
              href={buttons?.primary?.link || "/pharmacy"}
              className="w-full sm:w-auto justify-center bg-[#FFFFFF] text-[#1C1C1E] px-10 py-5 text-[10px] tracking-[0.2em] uppercase font-bold hover:opacity-90 silent-luxury-transition rounded-full shadow-lg inline-flex items-center gap-3"
            >
              {buttons?.primary?.text || "Pharmacy Portal"} <ArrowRight className="w-4 h-4 text-[#1C1C1E]" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HEALTH SCAN
          ========================================================================= */}
      <section className="bg-[#09120F] text-[#FFFFFF] py-24 md:py-36 px-6 md:px-16 w-full relative">
        <div className="max-w-[1450px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-[2/1] sm:aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden bg-[#09120F] flex items-center justify-center shadow-2xl">
                <ParallaxImage 
                  src={praana?.image || "https://plus.unsplash.com/premium_photo-1675686363422-7d7ab88ee530?q=80&w=2000"} 
                  alt={praana?.title || "AIRO Praana"} 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09120F]/60 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 text-[#FFFFFF] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto lg:mx-0 mb-8">
                <Cpu className="w-3 h-3 text-[#FFFFFF]/70" /> {praana?.sectionLabel || "Clinical Innovation"}
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#0A84FF] mb-6 leading-tight">
                {(praana?.title?.split(' ')[0]) || "AIRO"} <br/>
                <span className="italic font-light text-[#FFFFFF]/80">{(praana?.title?.split(' ').slice(1).join(' ')) || "Praana"}</span>
              </h2>

              <p className="font-serif text-lg md:text-xl italic text-[#FFFFFF]/90 max-w-xl mb-8 font-light leading-relaxed">
                {praana?.description || "A 5-minute diagnostic assessment. A lifetime of longevity insights."}
              </p>

              <p className="font-sans text-xs md:text-sm text-[#FFFFFF]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
                {praana?.bodyText || "Step into the future of diagnostics. The AIRO Smart Assessment Chair captures a comprehensive suite of key physiological indicators in just minutes, establishing a detailed baseline for your personalized care plan."}
              </p>

              <Link 
                href={praana?.buttonLink || "/health-chair"} 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#FFFFFF] hover:text-[#FFFFFF]/60 silent-luxury-transition"
              >
                {praana?.buttonText || "Learn More"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ECOSYSTEM CATEGORIES SHOWCASE
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#1C1C1E]/10 gap-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1C1E]/50 block mb-4 font-bold">
              {hd.sections?.clinicalSectionLabel || "The Clinic"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
              {(hd.sections?.clinicalSectionTitle || "Clinical Services").split(' ')[0]} <span className="italic font-light text-[#1C1C1E]/80">{(hd.sections?.clinicalSectionTitle || "Clinical Services").split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[#1C1C1E]/10">
          {clinicalCategories.map((cat: { name: string; description: string; link: string; status: string }, idx: number) => (
            <Link 
              key={idx} 
              href={cat.link || "/"}
              className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:px-4 silent-luxury-transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                <span className="font-serif text-lg md:text-xl text-[#1C1C1E]/30 group-hover:text-[#1C1C1E] silent-luxury-transition">
                  0{idx + 1}
                </span>
                
                <span className="font-serif text-2xl md:text-3xl text-[#1C1C1E] font-medium tracking-tight w-64">
                  {cat.name}
                </span>

                <span className="font-sans text-xs md:text-sm text-[#1C1C1E]/60 group-hover:text-[#1C1C1E]/80 silent-luxury-transition max-w-xl">
                  {cat.description}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#1C1C1E]/40 border border-[#1C1C1E]/10 px-4 py-1.5 rounded-full">
                  {cat.status || "Coming Soon"}
                </span>
                <div className="w-8 h-8 rounded-full border border-[#1C1C1E]/10 flex items-center justify-center text-[#1C1C1E] group-hover:border-[#1C1C1E] group-hover:bg-[#1C1C1E]/5 silent-luxury-transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FOOTER
          ========================================================================= */}
      <footer className="border-t border-[#1C1C1E]/10 py-24 px-8 md:px-16 bg-[#1C1C1E] text-[#FFFFFF] rounded-t-[3rem] w-full">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

          <div className="col-span-1">
            <h2 className="font-serif text-4xl tracking-[0.2em] uppercase mb-12 text-[#FFFFFF]">AIRO<span className="opacity-50">.</span></h2>
            <li className="pt-8 text-[#FFFFFF]/30 text-[10px] tracking-widest uppercase list-none">© 2026 AIRO Health.</li>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FFFFFF]/40 tracking-widest uppercase">Clinical Portals</h3>
            <ul className="space-y-4 text-sm text-[#FFFFFF]/80 font-medium">
              <li><Link href="/pharmacy" className="hover:text-[#FFFFFF]/50 silent-luxury-transition">Pharmacy Portal</Link></li>
              <li><Link href="/minute-clinic" className="hover:text-[#FFFFFF]/50 silent-luxury-transition">Minute Clinic</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FFFFFF]/40 tracking-widest uppercase">Support</h3>
            <ul className="space-y-4 text-sm text-[#FFFFFF]/80 font-medium">
              <li><a href="mailto:clinical@airo.com" className="hover:text-[#FFFFFF]/50 silent-luxury-transition">clinical@airo.com</a></li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
