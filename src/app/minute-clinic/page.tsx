"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";
import { useCms } from "@/context/CmsContext";

// Custom Parallax Image component that drives slow-zoom and vertical parallax
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

export default function MinuteClinicPage() {
  const cmsData = useCms();

  const pageRef = useRef<HTMLDivElement>(null);

  const pageContent = cmsData.pages.minuteClinic;
  const { hero, friction, prevention } = pageContent.sections;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pc = pageContent as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = pageContent.sections as any;
  const everydayCare = sections.everydayCare;
  const connectedCare = sections.connectedCare;
  const visionSection = sections.visionSection;

  return (
    <div ref={pageRef} className="w-full bg-[#FFFFFF] text-[#1C1C1E] min-h-screen overflow-x-hidden selection:bg-[#1C1C1E] selection:text-[#FFFFFF]">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative px-6 md:px-16 pt-12 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-8 items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1C1C1E]/10 bg-[#1C1C1E]/5 text-[#1C1C1E] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto lg:mx-0 mb-8">
              <Sparkles className="w-3 h-3" /> {pc.heroBadge || "Redefining Clinical Care"}
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.05] text-[#1C1C1E] mb-8">
              {pageContent.title}<br/>
              <span className="italic font-light text-[#1C1C1E]/80">{pageContent.subtitle}</span>
            </h1>
            
            <p className="font-serif text-lg md:text-2xl text-[#1C1C1E]/80 italic max-w-xl leading-relaxed mb-6">
              {pc.heroTagline || "Professional care. Minimal waiting. Meaningful outcomes."}
            </p>
            
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
              {pc.heroDescription || "AIRO Minute Clinic delivers convenient healthcare designed around modern lifestyles, making it easier to access trusted medical support whenever you need it."}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#FFFFFF] bg-[#1C1C1E] px-6 py-3 rounded-full border border-[#1C1C1E]">
                {pc.heroButtonText || "Booking Waitlist Only"}
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C1C1E]/50">
                {pc.heroButtonLabel || "Opening Winter 2026"}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 w-full">
            <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <ParallaxImage 
                src={hero.image} 
                alt="AIRO Clinic Biomarkers & Diagnostics"
                className="w-full h-full"
                speed={0.1}
              />
              <div className="absolute inset-0 bg-[#1C1C1E]/10 mix-blend-multiply" />
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-[#FFFFFF]/90 border border-[#1C1C1E]/10 p-6 rounded-xl text-left">
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#1C1C1E]/50 block mb-1">
                  {hero.title}
                </span>
                <p className="font-serif text-lg text-[#1C1C1E] font-medium">
                  {hero.description}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: HEALTHCARE WITHOUT THE FRICTION (Storytelling Block 1) */}
      <section className="bg-[#1C1C1E] text-[#FFFFFF] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFFFFF]/50 block mb-6 font-bold">
                {friction.sectionLabel || "Access"}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8 text-[#FFFFFF]">
                {friction.title.split('the')[0]}<br/>the <span className="italic font-light text-[#FFFFFF]/80">{friction.title.split('the')[1]}</span>
              </h2>
              <p className="font-serif text-xl md:text-2xl text-[#FFFFFF]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                {friction.description.split('.')[0]}.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FFFFFF]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
                {friction.description.split('.').slice(1).join('.')}
              </p>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[16/10] md:aspect-[16/11] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src={friction.image} 
                  alt="Seamless Clinic Experience" 
                  className="w-full h-full"
                  speed={0.12}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/30 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: DESIGNED AROUND PREVENTION (Storytelling Block 2) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Visual element */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
              <ParallaxImage 
                src={prevention.image} 
                alt="Active healthy longevity" 
                className="w-full h-full"
                speed={0.08}
              />
              <div className="absolute inset-0 bg-[#1C1C1E]/15" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1C1E]/50 block mb-6 font-bold">
              {prevention.sectionLabel || "Vision"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              {prevention.title.split('Before')[0]}Before <br/><span className="italic font-light text-[#1C1C1E]/80">{prevention.title.split('Before')[1] || "It Starts"}</span>
            </h2>
            <p className="font-serif text-lg md:text-xl text-[#1C1C1E]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              {prevention.description.split('.')[0]}.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              {prevention.description.split('.').slice(1).join('.')}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: EVERYDAY CARE, ELEVATED (Storytelling Block 3) */}
      <section className="bg-[#1C1C1E] text-[#FFFFFF] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFFFFF]/50 block mb-6 font-bold">
                {everydayCare?.sectionLabel || "Clinical Care"}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8 text-[#FFFFFF]">
                {(everydayCare?.title || "Everyday Care, Elevated").split(',')[0]}, <br/><span className="italic font-light text-[#FFFFFF]/80">{(everydayCare?.title || "Everyday Care, Elevated").split(',').slice(1).join(',')}</span>
              </h2>
              <p className="font-serif text-lg md:text-xl text-[#FFFFFF]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                {everydayCare?.tagline || "From seasonal illnesses and vaccinations to annual wellness visits and health screenings, our clinic supports your everyday needs."}
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FFFFFF]/70 max-w-lg leading-relaxed mb-8 tracking-wide">
                {everydayCare?.description || "Our clinic covers the full spectrum of day-to-day medical needs with a patient-first focus. We ensure you feel understood, treated, and guided toward optimal long-term health."}
              </p>
              <p className="font-serif text-lg md:text-xl italic text-[#FFFFFF]/90 border-l border-[#FFFFFF]/20 pl-6 mb-4 font-light leading-relaxed">
                &ldquo;{everydayCare?.quote || "Our goal is not simply to treat illness. It's to help people stay healthy."}&rdquo;
              </p>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src={everydayCare?.image || "https://images.unsplash.com/photo-1551076826-72190fff02d3?q=80&w=1600"} 
                  alt="Everyday health and wellness" 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-[#1C1C1E]/15" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: CONNECTED HEALTHCARE & CONTINUING CARE (Storytelling Blocks 4 & 5) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Visual element */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/4] md:aspect-[4/3] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
              <ParallaxImage 
                src={connectedCare?.image || "/clinic-connected.jpg"} 
                alt="AIRO Connected Healthcare Team" 
                className="w-full h-full"
                speed={0.14}
              />
              <div className="absolute inset-0 bg-[#1C1C1E]/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1C1E]/50 block mb-6 font-bold">
              {connectedCare?.sectionLabel || "Connectivity"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              {(connectedCare?.title || "Connected Healthcare").split(' ')[0]} <br/><span className="italic font-light text-[#1C1C1E]/80">{(connectedCare?.title || "Connected Healthcare").split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              {connectedCare?.description || "Healthcare works best when information, services, and providers work together. As part of the AIRO ecosystem, the Minute Clinic integrates with pharmacy services, diagnostics, wellness programs, and digital health tools to create a more complete picture of patient health."}
            </p>
            <p className="font-serif text-lg md:text-xl text-[#1C1C1E]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              {connectedCare?.tagline || "A single appointment should be the beginning of a healthier future—not the end of a conversation."}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed tracking-wide">
              {connectedCare?.bodyText || "Through ongoing monitoring, preventive health programs, advanced diagnostics, and wellness support, AIRO helps patients take a more active role in their long-term health."}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6: THE NEW STANDARD & BOOKING WAITLIST (Storytelling Block 6) */}
      
    </div>
  );
}
