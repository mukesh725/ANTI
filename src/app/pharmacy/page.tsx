"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";

// Custom Parallax Image component that drives slow-zoom and vertical parallax
function ParallaxImage({ 
  src, 
  alt, 
  className = "", 
  speed = 0.12 
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

  // Moves the image vertically based on speed
  const yPercent = speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${yPercent}%`, `${yPercent}%`]);
  // Slowly zooms out as the user scrolls down, creating a majestic motion
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1.02]);

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

export default function PharmacyPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative px-6 md:px-16 pt-12 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-8 items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0B2114]/10 bg-[#0B2114]/5 text-[#0B2114] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto lg:mx-0 mb-8">
              <Sparkles className="w-3 h-3" /> Coming Soon to the Collective
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.05] text-[#0B2114] mb-8">
              Modern Pharmacy.<br/>
              <span className="italic font-light text-[#0B2114]/80">Personalized Wellness.</span>
            </h1>
            
            <p className="font-serif text-lg md:text-2xl text-[#0B2114]/80 italic max-w-xl leading-relaxed mb-6">
              Healthcare is evolving. Your pharmacy should too.
            </p>
            
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
              AIRO Pharmacy combines trusted prescription care, advanced wellness solutions, personalized compounding, and expert guidance in one elevated experience designed around your health.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#0B2114] border border-[#0B2114]/20 bg-[#0B2114]/5 px-6 py-3 rounded-full">
                Compounding Portal Closed
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0B2114]/50">
                Opening Winter 2026
              </span>
            </div>
          </div>

          {/* Hero Heroine Image */}
          <div className="lg:col-span-5 w-full">
            <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <ParallaxImage 
                src="/generated/pharmacy_hero_1781818986407.png" 
                alt="AIRO Pharmacy Services"
                className="w-full h-full"
                speed={0.12}
              />
              <div className="absolute inset-0 bg-[#0B2114]/10 mix-blend-multiply" />
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-[#FAF8F5]/90 border border-[#0B2114]/10 p-6 rounded-xl text-left">
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#0B2114]/50 block mb-1">
                  Premium Pharmacy Care
                </span>
                <p className="font-serif text-lg text-[#0B2114] font-medium">
                  Everyday Prescriptions & Clinical Support
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: A DIFFERENT KIND OF PHARMACY (Storytelling Block 1) */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
                Philosophy
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8 text-[#FAF8F5]">
                A Different Kind <br/>of <span className="italic font-light text-[#FAF8F5]/80">Pharmacy</span>
              </h2>
              <p className="font-serif text-xl md:text-2xl text-[#FAF8F5]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                Most pharmacies focus on transactions. We focus on people.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
                At AIRO Pharmacy, every product, recommendation, and service is chosen with one goal: helping individuals live healthier, longer, and better.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed tracking-wide">
                Whether you&apos;re managing a chronic condition, optimizing daily wellness, or exploring preventive healthcare solutions, our team is here to support your journey.
              </p>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[16/10] md:aspect-[16/11] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src="/renders/pharmacy-minute clinic,exlectronics.png" 
                  alt="Healthy premium lifestyle wellness" 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2114]/30 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: HEALTHCARE BEYOND PRESCRIPTIONS (Storytelling Block 2) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Visual element (Full-width lifestyle crop) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
              <ParallaxImage 
                src="/renders/pharmacy minute clinic and electronics.png" 
                alt="Longevity and serene lifestyle" 
                className="w-full h-full"
                speed={0.08}
              />
              <div className="absolute inset-0 bg-[#0B2114]/15" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
              Ecosystem
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              Healthcare Beyond <br/><span className="italic font-light text-[#0B2114]/80">Prescriptions</span>
            </h2>
            <p className="font-serif text-lg md:text-xl text-[#0B2114]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              Today&apos;s health challenges require more than medication alone.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              That&apos;s why AIRO Pharmacy is designed as part of a connected healthcare ecosystem, bringing together pharmacy services, diagnostics, clinical care, wellness programs, and personalized treatments.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed tracking-wide font-medium italic">
              Because better outcomes happen when healthcare works together.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: PERSONALIZED CARE STARTS HERE (Storytelling Block 3) */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
                Tailored Biology
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8 text-[#FAF8F5]">
                Personalized Care <br/><span className="italic font-light text-[#FAF8F5]/80">Starts Here</span>
              </h2>
              <p className="font-serif text-lg md:text-xl text-[#FAF8F5]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                No two people are alike. Your medications, wellness needs, and health goals deserve a more personalized approach.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-8 tracking-wide">
                Through pharmacist consultations, wellness guidance, and customized compounding solutions, AIRO helps create healthcare experiences built around individual needs rather than one-size-fits-all solutions.
              </p>

              {/* Compounding teaser box */}
              <div className="border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 p-6 rounded-2xl max-w-md backdrop-blur-sm">
                <span className="inline-block bg-[#FAF8F5] text-[#0B2114] text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-3">
                  COMPLETED APOTHECARY PREVIEW
                </span>
                <p className="font-sans text-[11px] text-[#FAF8F5]/80 leading-relaxed">
                  Compounding allows us to design allergen-free alternatives, tailor dosages to the microgram, and merge multiple supplements into a single daily biological protocol.
                </p>
              </div>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src="/renders/right side.png" 
                  alt="Premium wellness compounds apothecary" 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-[#0B2114]/15" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: WELLNESS MEETS SCIENCE (Storytelling Block 4) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Visual element (Full-width natural sunburst) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/4] md:aspect-[4/3] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
              <ParallaxImage 
                src="/renders/checkout.png" 
                alt="Sun filtering through trees - Longevity concept" 
                className="w-full h-full"
                speed={0.14}
              />
              <div className="absolute inset-0 bg-[#0B2114]/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
              Proactive Care
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              Wellness Meets <br/><span className="italic font-light text-[#0B2114]/80">Science</span>
            </h2>
            <p className="font-serif text-lg md:text-xl text-[#0B2114]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              The future of healthcare isn&apos;t reactive. It&apos;s proactive.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              From vitamins and nutritional support to advanced health monitoring and preventive care solutions, AIRO Pharmacy helps individuals make informed decisions before health concerns become problems.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed tracking-wide font-medium">
              Because lasting wellness begins long before symptoms appear.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6: TRUSTED. ACCESSIBLE. CONNECTED. & WAITLIST FORM */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16 rounded-t-[3rem]">
        <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
            Join The Future
          </span>
          
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-tight mb-8 max-w-3xl">
            Trusted. Accessible. <span className="italic font-light text-[#FAF8F5]/80">Connected.</span>
          </h2>
          
          <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/80 max-w-lg leading-relaxed mb-4 tracking-wide">
            At AIRO Pharmacy, we believe healthcare should feel simpler, more human, and more accessible.
          </p>
          <p className="font-serif text-lg md:text-xl italic text-[#FAF8F5]/90 max-w-xl leading-relaxed mb-16 font-light">
            A place where expert care, innovative solutions, and everyday wellness come together.
          </p>

          {/* Premium waitlist form */}
          <div className="w-full max-w-md border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 p-8 md:p-10 rounded-3xl backdrop-blur-xl">
            <h3 className="font-serif text-2xl mb-2 text-[#FAF8F5] tracking-tight">The Compounding Waitlist</h3>
            <p className="font-sans text-[11px] text-[#FAF8F5]/60 mb-8 uppercase tracking-widest font-medium">
              Secure priority consultation access
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
              <div>
                <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FAF8F5]/50 mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FAF8F5]/40 text-[#FAF8F5] placeholder-[#FAF8F5]/30 silent-luxury-transition"
                />
              </div>

              <div>
                <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FAF8F5]/50 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="e.g. eleanor@wellness.com"
                  className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FAF8F5]/40 text-[#FAF8F5] placeholder-[#FAF8F5]/30 silent-luxury-transition"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  className="w-full bg-[#FAF8F5] text-[#0B2114] text-[10px] font-bold tracking-widest uppercase py-4 rounded-full hover:opacity-90 silent-luxury-transition flex items-center justify-center gap-2"
                >
                  Request Compounding Invitation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            
            <div className="mt-6 inline-flex items-center gap-1.5 justify-center text-[9px] tracking-wider uppercase text-[#FAF8F5]/40 font-semibold">
              <Shield className="w-3.5 h-3.5" /> HIPAA Compliant & Secure
            </div>
          </div>

        </div>
      </section>

      {/* MINI FOOTER */}
      <footer className="bg-[#FAF8F5] py-16 px-6 md:px-16 border-t border-[#0B2114]/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="font-serif text-xl tracking-widest uppercase text-[#0B2114]">
            AIRO<span className="opacity-50">.</span>
          </Link>
          <div className="flex gap-8 text-[10px] tracking-widest uppercase font-bold text-[#0B2114]/60">
            <Link href="/grocery" className="hover:text-[#0B2114] silent-luxury-transition">Essentials</Link>
            <Link href="/pharmacy" className="hover:text-[#0B2114] silent-luxury-transition">Pharmacy</Link>
            <Link href="/minute-clinic" className="hover:text-[#0B2114] silent-luxury-transition">Minute Clinic</Link>
          </div>
          <span className="text-[9px] tracking-widest uppercase text-[#0B2114]/40 font-medium">
            © 2026 AIRO Pharmacy. All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}
