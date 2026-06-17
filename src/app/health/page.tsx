"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Cpu } from "lucide-react";
import Link from "next/link";

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

const healthCategories = [
  { 
    name: "Pharmacy", 
    desc: "Clinical-grade prescription care, longevity protocols, and supplements.", 
    href: "/pharmacy", 
    status: "Coming Soon" 
  },
  { 
    name: "Minute Clinic", 
    desc: "Walk-in care, vaccinations, and everyday healthcare consultations.", 
    href: "/minute-clinic", 
    status: "Coming Soon" 
  },
  { 
    name: "Diagnostics", 
    desc: "Comprehensive biomarker testing, genetic scans, and routine screenings.", 
    href: "/minute-clinic", 
    status: "Coming Soon" 
  },
  { 
    name: "Compounding Pharmacy", 
    desc: "Custom-made dosages, allergen-free formulations, and bespoke wellness tinctures.", 
    href: "/pharmacy", 
    status: "Coming Soon" 
  },
  { 
    name: "Health Chair", 
    desc: "Real-time vitals tracking, comprehensive body scans.", 
    href: "/health-chair", 
    status: "Coming Soon" 
  },
  { 
    name: "Membership", 
    desc: "Premium access to all health services and priority booking.", 
    href: "/membership", 
    status: "Coming Soon" 
  }
];

export default function HealthHomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">

      {/* =========================================================================
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section ref={heroRef} className="relative h-[85vh] md:h-[95vh] w-full flex items-center justify-start px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <ParallaxImage 
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2000" 
            alt="AIRO Connected Wellness"
            className="w-full h-full"
            speed={0.1}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2114] via-[#0B2114]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1000px] text-[#FAF8F5] pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
            <Activity className="w-3 h-3 text-[#FAF8F5]" /> Clinical Precision
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight leading-[1.02] text-[#FAF8F5] mb-8">
            AIRO <br/>
            <span className="italic font-light text-[#FAF8F5]/80">Health.</span>
          </h1>
          
          <p className="font-serif text-lg md:text-2xl text-[#FAF8F5]/95 italic max-w-2xl leading-relaxed mb-6">
            Clinical-grade prescription care, longevity protocols, minute clinics, and advanced diagnostics.
          </p>

          <div className="flex flex-wrap gap-4 items-center mt-12">
            <Link
              href="/pharmacy"
              className="bg-[#FAF8F5] text-[#0B2114] px-10 py-5 text-[10px] tracking-[0.2em] uppercase font-bold hover:opacity-90 silent-luxury-transition rounded-full shadow-lg inline-flex items-center gap-3"
            >
              Pharmacy Portal <ArrowRight className="w-4 h-4 text-[#0B2114]" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HEALTH SCAN
          ========================================================================= */}
      <section className="bg-[#09120F] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16 w-full relative">
        <div className="max-w-[1450px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-[2/1] sm:aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden bg-[#09120F] flex items-center justify-center">
                <img 
                  src="/health-scan-chair.png" 
                  alt="AIRO Health Scan Chair" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#09120F_95%)] pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
                <Cpu className="w-3 h-3 text-[#FAF8F5]/70" /> Clinical Innovation
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
                The AIRO <br/><span className="italic font-light text-[#FAF8F5]/80">Health Scan.</span>
              </h2>

              <p className="font-serif text-lg md:text-xl italic text-[#FAF8F5]/90 max-w-xl mb-8 font-light leading-relaxed">
                A 5-minute diagnostic assessment. A lifetime of longevity insights.
              </p>

              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
                Step into the future of diagnostics. The AIRO Smart Assessment Chair captures a comprehensive suite of key physiological indicators in just minutes, establishing a detailed baseline for your personalized care plan.
              </p>

              <Link 
                href="/health-chair" 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#FAF8F5] hover:text-[#FAF8F5]/60 silent-luxury-transition"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ECOSYSTEM CATEGORIES SHOWCASE
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#0B2114]/10 gap-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-4 font-bold">
              The Clinic
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
              Clinical <span className="italic font-light text-[#0B2114]/80">Services</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[#0B2114]/10">
          {healthCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.href}
              className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:px-4 silent-luxury-transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                <span className="font-serif text-lg md:text-xl text-[#0B2114]/30 group-hover:text-[#0B2114] silent-luxury-transition">
                  0{idx + 1}
                </span>
                
                <span className="font-serif text-2xl md:text-3xl text-[#0B2114] font-medium tracking-tight w-64">
                  {cat.name}
                </span>

                <span className="font-sans text-xs md:text-sm text-[#0B2114]/60 group-hover:text-[#0B2114]/80 silent-luxury-transition max-w-xl">
                  {cat.desc}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#0B2114]/40 border border-[#0B2114]/10 px-4 py-1.5 rounded-full">
                  {cat.status}
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
          SECTION 4: FOOTER
          ========================================================================= */}
      <footer className="border-t border-[#0B2114]/10 py-24 px-8 md:px-16 bg-[#0B2114] text-[#FAF8F5] rounded-t-[3rem] w-full">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

          <div className="col-span-1">
            <h2 className="font-serif text-4xl tracking-[0.2em] uppercase mb-12">AIRO<span className="opacity-50">.</span></h2>
            <li className="pt-8 text-[#FAF8F5]/30 text-[10px] tracking-widest uppercase list-none">© 2026 AIRO Health.</li>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FAF8F5]/40 tracking-widest uppercase">Clinical Portals</h3>
            <ul className="space-y-4 text-sm text-[#FAF8F5]/80 font-medium">
              <li><Link href="/pharmacy" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Pharmacy Portal</Link></li>
              <li><Link href="/minute-clinic" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Minute Clinic</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FAF8F5]/40 tracking-widest uppercase">Support</h3>
            <ul className="space-y-4 text-sm text-[#FAF8F5]/80 font-medium">
              <li><a href="mailto:clinical@airo.com" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">clinical@airo.com</a></li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
