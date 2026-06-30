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
  const cmsData = useCms();
  
  const pageRef = useRef<HTMLDivElement>(null);
  
  const pageContent = cmsData.pages.pharmacy;
  const { hero, compounding, everyday } = pageContent.sections;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pc = pageContent as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = pageContent.sections as any;
  const philosophySection = sections.philosophy;
  const ecosystemSection = sections.ecosystem;
  const catalogSection = sections.catalogSection;
  const closingSection = sections.closingSection;

  return (
    <div ref={pageRef} className="w-full bg-[#FFFFFF] text-[#1C1C1E] min-h-screen overflow-x-hidden selection:bg-[#1C1C1E] selection:text-[#FFFFFF]">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative px-6 md:px-16 pt-12 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-8 items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1C1C1E]/10 bg-[#1C1C1E]/5 text-[#1C1C1E] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto lg:mx-0 mb-8">
              <Sparkles className="w-3 h-3" /> {pc.heroBadge || "Coming Soon to the Collective"}
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.05] text-[#1C1C1E] mb-8">
              {pageContent.title.split('.')[0]}.<br/>
              <span className="italic font-light text-[#1C1C1E]/80">{pageContent.subtitle}</span>
            </h1>
            
            <p className="font-serif text-lg md:text-2xl text-[#1C1C1E]/80 italic max-w-xl leading-relaxed mb-6">
              {pc.heroTagline || "Healthcare is evolving. Your pharmacy should too."}
            </p>
            
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
              {pc.heroDescription || "AIRO Pharmacy combines trusted prescription care, advanced wellness solutions, personalized compounding, and expert guidance in one elevated experience designed around your health."}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#1C1C1E] border border-[#1C1C1E]/20 bg-[#1C1C1E]/5 px-6 py-3 rounded-full">
                {pc.heroButtonText || "Compounding Portal Closed"}
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C1C1E]/50">
                {pc.heroButtonLabel || "Opening Winter 2026"}
              </span>
            </div>
          </div>

          {/* Hero Heroine Image */}
          <div className="lg:col-span-5 w-full">
            <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <ParallaxImage 
                src={hero.image} 
                alt="AIRO Pharmacy Services"
                className="w-full h-full"
                speed={0.12}
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

      {/* SECTION 2: A DIFFERENT KIND OF PHARMACY (Storytelling Block 1) */}
      <section className="bg-[#1C1C1E] text-[#FFFFFF] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFFFFF]/50 block mb-6 font-bold">
                {philosophySection?.sectionLabel || "Philosophy"}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8 text-[#FFFFFF]">
                {(philosophySection?.title || "A Different Kind of Pharmacy").split('Kind')[0]}Kind <br/>of <span className="italic font-light text-[#FFFFFF]/80">{(philosophySection?.title || "A Different Kind of Pharmacy").split('of').slice(1).join('of')}</span>
              </h2>
              <p className="font-serif text-xl md:text-2xl text-[#FFFFFF]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                {philosophySection?.tagline || "Most pharmacies focus on transactions. We focus on people."}
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FFFFFF]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
                {philosophySection?.description || "At AIRO Pharmacy, every product, recommendation, and service is chosen with one goal: helping individuals live healthier, longer, and better."}
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FFFFFF]/70 max-w-lg leading-relaxed tracking-wide">
                {philosophySection?.bodyText || "Whether you're managing a chronic condition, optimizing daily wellness, or exploring preventive healthcare solutions, our team is here to support your journey."}
              </p>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[16/10] md:aspect-[16/11] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src={philosophySection?.image || "/pharmacy-checkout.jpg"} 
                  alt="AIRO Pharmacy Checkout" 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/30 to-transparent" />
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
                src={ecosystemSection?.image || "https://images.unsplash.com/photo-1576602975754-efdf313b9342?q=80&w=1600"} 
                alt="Longevity and serene lifestyle" 
                className="w-full h-full"
                speed={0.08}
              />
              <div className="absolute inset-0 bg-[#1C1C1E]/15" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1C1E]/50 block mb-6 font-bold">
              {ecosystemSection?.sectionLabel || "Ecosystem"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              {(ecosystemSection?.title || "Healthcare Beyond Prescriptions").split('Beyond')[0]}Beyond <br/><span className="italic font-light text-[#1C1C1E]/80">{(ecosystemSection?.title || "Healthcare Beyond Prescriptions").split('Beyond')[1]}</span>
            </h2>
            <p className="font-serif text-lg md:text-xl text-[#1C1C1E]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              {ecosystemSection?.tagline || "Today's health challenges require more than medication alone."}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              {ecosystemSection?.description || "That's why AIRO Pharmacy is designed as part of a connected healthcare ecosystem, bringing together pharmacy services, diagnostics, clinical care, wellness programs, and personalized treatments."}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed tracking-wide font-medium italic">
              {ecosystemSection?.closingLine || "Because better outcomes happen when healthcare works together."}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: PERSONALIZED CARE STARTS HERE (Storytelling Block 3) */}
      <section className="bg-[#1C1C1E] text-[#FFFFFF] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFFFFF]/50 block mb-6 font-bold">
                {compounding.sectionLabel || "Tailored Biology"}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8 text-[#FFFFFF]">
                {compounding.title.split(',')[0]}<br/><span className="italic font-light text-[#FFFFFF]/80">{compounding.title.split(',')[1]}</span>
              </h2>
              <p className="font-serif text-xl md:text-2xl text-[#FFFFFF]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                {compounding.description.split('.')[0]}.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FFFFFF]/70 max-w-lg leading-relaxed tracking-wide">
                {compounding.description.split('.').slice(1).join('.')}
              </p>

              {/* Compounding teaser box */}
              <div className="border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 p-6 rounded-2xl max-w-md backdrop-blur-sm">
                <span className="inline-block bg-[#FFFFFF] text-[#1C1C1E] text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-3">
                  {compounding.previewBadge || "COMPLETED APOTHECARY PREVIEW"}
                </span>
                <p className="font-sans text-[11px] text-[#FFFFFF]/80 leading-relaxed">
                  {compounding.previewText || "Compounding allows us to design allergen-free alternatives, tailor dosages to the microgram, and merge multiple supplements into a single daily biological protocol."}
                </p>
              </div>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src={compounding.image} 
                  alt="Premium wellness compounds apothecary" 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-[#1C1C1E]/15" />
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
                src={everyday.image} 
                alt="Everyday wellness concept" 
                className="w-full h-full"
                speed={0.14}
              />
              <div className="absolute inset-0 bg-[#1C1C1E]/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1C1E]/50 block mb-6 font-bold">
              {everyday.sectionLabel || "Proactive Care"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              {everyday.title.split(' ')[0]} <br/><span className="italic font-light text-[#1C1C1E]/80">{everyday.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="font-serif text-lg md:text-xl text-[#1C1C1E]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              {everyday.description.split('.')[0]}.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#1C1C1E]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              {everyday.description.split('.').slice(1).join('.')}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 5.5: EXPLORE CATEGORIES */}
      <section className="bg-[#FFFFFF] text-[#1C1C1E] py-24 md:py-36 px-6 md:px-16 w-full relative">
        <div className="max-w-[1500px] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1C1E]/50 block mb-6 font-bold">
              {catalogSection?.sectionLabel || "The Catalog"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[#1C1C1E]">
              {(catalogSection?.sectionTitle || "Explore AIRO Pharmacy").split(' ')[0]} <span className="italic font-light text-[#1C1C1E]/80">{(catalogSection?.sectionTitle || "Explore AIRO Pharmacy").split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="font-sans text-xs text-[#1C1C1E]/60 mt-4 leading-relaxed tracking-wide">
              {catalogSection?.sectionDescription || "Every category is built as a targeted pathway to clinical-grade care and longevity protocols."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-20">
            {(cmsData.pages.pharmacy.sections.categories || []).map((category, index) => (
              <Link 
                href={`/pharmacy/shop?category=${encodeURIComponent(category.title)}`}
                key={index}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="group relative overflow-hidden rounded-2xl md:rounded-[2rem] aspect-[4/3] md:aspect-[16/9] cursor-pointer"
                >
                  <img 
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
                  
                  <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col items-start">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#0A84FF] mb-3">
                      Category {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl text-[#FFFFFF] mb-2">{category.title}</h3>
                    <p className="font-sans text-xs text-[#FFFFFF]/70 max-w-sm leading-relaxed tracking-wide opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex justify-center z-20 relative">
            <Link 
              href={catalogSection?.shopAllButtonLink || "/pharmacy/shop"}
              className="bg-[#1C1C1E] text-[#FFFFFF] text-[10px] font-bold tracking-[0.2em] uppercase px-10 py-4 rounded-full hover:bg-[#0A84FF] hover:text-[#1C1C1E] transition-colors duration-300 shadow-lg flex items-center gap-3"
            >
              {catalogSection?.shopAllButtonText || "Shop All Pharmacy"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: TRUSTED. ACCESSIBLE. CONNECTED. & WAITLIST FORM */}
      <section className="bg-[#1C1C1E] text-[#FFFFFF] py-24 md:py-36 px-6 md:px-16 rounded-t-[3rem]">
        <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFFFFF]/50 block mb-6 font-bold">
            {closingSection?.sectionLabel || "Join The Future"}
          </span>
          
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-tight mb-8 max-w-3xl">
            {(closingSection?.sectionTitle || "Trusted. Accessible. Connected.").split('.')[0]}. {(closingSection?.sectionTitle || "Trusted. Accessible. Connected.").split('.')[1]}. <span className="italic font-light text-[#FFFFFF]/80">{(closingSection?.sectionTitle || "Trusted. Accessible. Connected.").split('.').slice(2).join('.')}</span>
          </h2>
          
          <p className="font-sans text-xs md:text-sm text-[#FFFFFF]/80 max-w-lg leading-relaxed mb-4 tracking-wide">
            {closingSection?.sectionDescription || "At AIRO Pharmacy, we believe healthcare should feel simpler, more human, and more accessible."}
          </p>
          <p className="font-serif text-lg md:text-xl italic text-[#FFFFFF]/90 max-w-xl leading-relaxed mb-16 font-light">
            {closingSection?.sectionTagline || "A place where expert care, innovative solutions, and everyday wellness come together."}
          </p>

          {/* Premium waitlist form */}
          <div className="w-full max-w-md border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 p-8 md:p-10 rounded-3xl backdrop-blur-xl">
            <h3 className="font-serif text-2xl mb-2 text-[#FFFFFF] tracking-tight">{closingSection?.waitlistTitle || "The Compounding Waitlist"}</h3>
            <p className="font-sans text-[11px] text-[#FFFFFF]/60 mb-8 uppercase tracking-widest font-medium">
              {closingSection?.waitlistSubtitle || "Secure priority consultation access"}
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
              <div>
                <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FFFFFF]/50 mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-[#FFFFFF]/5 border border-[#FFFFFF]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FFFFFF]/40 text-[#FFFFFF] placeholder-[#FFFFFF]/30 silent-luxury-transition"
                />
              </div>

              <div>
                <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FFFFFF]/50 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="e.g. eleanor@wellness.com"
                  className="w-full bg-[#FFFFFF]/5 border border-[#FFFFFF]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FFFFFF]/40 text-[#FFFFFF] placeholder-[#FFFFFF]/30 silent-luxury-transition"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  className="w-full bg-[#FFFFFF] text-[#1C1C1E] text-[10px] font-bold tracking-widest uppercase py-4 rounded-full hover:opacity-90 silent-luxury-transition flex items-center justify-center gap-2"
                >
                  {closingSection?.waitlistButtonText || "Request Compounding Invitation"} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            
            <div className="mt-6 inline-flex items-center gap-1.5 justify-center text-[9px] tracking-wider uppercase text-[#FFFFFF]/40 font-semibold">
              <Shield className="w-3.5 h-3.5" /> HIPAA Compliant & Secure
            </div>
          </div>

        </div>
      </section>

      {/* MINI FOOTER */}
      <footer className="bg-[#FFFFFF] py-16 px-6 md:px-16 border-t border-[#1C1C1E]/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="font-serif text-xl tracking-widest uppercase text-[#1C1C1E]">
            AIRO<span className="opacity-50">.</span>
          </Link>
          <div className="flex gap-8 text-[10px] tracking-widest uppercase font-bold text-[#1C1C1E]/60">
            <Link href="/grocery" className="hover:text-[#1C1C1E] silent-luxury-transition">Essentials</Link>
            <Link href="/pharmacy" className="hover:text-[#1C1C1E] silent-luxury-transition">Pharmacy</Link>
            <Link href="/minute-clinic" className="hover:text-[#1C1C1E] silent-luxury-transition">Minute Clinic</Link>
          </div>
          <span className="text-[9px] tracking-widest uppercase text-[#1C1C1E]/40 font-medium">
            © 2026 AIRO Pharmacy. All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}
