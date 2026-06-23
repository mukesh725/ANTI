"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Leaf } from "lucide-react";
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

// Categories are now loaded dynamically from cmsData

export default function EssentialsPage() {
  const cmsData = useCms();

  const pageRef = useRef<HTMLDivElement>(null);
  
  const pageContent = cmsData.pages.grocery;
  const { hero, philosophy } = pageContent.sections;

  return (
    <div ref={pageRef} className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative px-6 md:px-16 pt-12 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-8 items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0B2114]/10 bg-[#0B2114]/5 text-[#0B2114] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mx-auto lg:mx-0 mb-8">
              <Leaf className="w-3 h-3 text-[#0B2114]" /> Pure Sourcing
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.05] text-[#0B2114] mb-8">
              {pageContent.title.split('.')[0]}. {pageContent.title.split('.')[1]}.<br/>
              <span className="italic font-light text-[#0B2114]/80">{pageContent.subtitle}</span>
            </h1>
            
            <p className="font-serif text-lg md:text-2xl text-[#0B2114]/85 italic max-w-xl leading-relaxed mb-6">
              More than a grocery store, AIRO Essentials is a curated destination for healthier everyday living.
            </p>
            
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
              {hero.description}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#0B2114] border border-[#0B2114]/20 bg-[#0B2114]/5 px-6 py-3 rounded-full">
                Delivery Waitlist Open
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0B2114]/50">
                Online Orders Coming Winter 2026
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 w-full">
            <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <ParallaxImage 
                src={hero.image} 
                alt="AIRO Fresh Produce"
                className="w-full h-full"
                speed={0.12}
              />
              <div className="absolute inset-0 bg-[#0B2114]/10 mix-blend-multiply" />
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-[#FAF8F5]/90 border border-[#0B2114]/10 p-6 rounded-xl text-left">
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#0B2114]/50 block mb-1">
                  {hero.title}
                </span>
                <p className="font-serif text-lg text-[#0B2114] font-medium">
                  {hero.description.split('.')[0]}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: PHILOSOPHY (Storytelling Block) */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
                Philosophy
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8 text-[#FAF8F5]">
                {philosophy.title.split('with')[0]}<br/>with <span className="italic font-light text-[#FAF8F5]/80">{philosophy.title.split('with')[1]}</span>
              </h2>
              <p className="font-serif text-xl md:text-2xl text-[#FAF8F5]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                {philosophy.description.split('.')[0]}.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
                {philosophy.description.split('.')[1]}.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed tracking-wide">
                {philosophy.description.split('.').slice(2).join('.')}
              </p>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[16/10] md:aspect-[16/11] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src={philosophy.image} 
                  alt="Conscious sourcing lifestyle" 
                  className="w-full h-full"
                  speed={0.08}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2114]/30 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: SOURCING PILLARS (Fresh • Organic • Local) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
            The Sourcing Sagas
          </span>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
            Fresh • Organic • Local
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Fresh */}
          <div className="border border-[#0B2114]/10 bg-white/40 p-8 rounded-2xl flex flex-col items-center text-center">
            <span className="font-serif text-3xl italic text-[#0B2114] mb-4">Fresh</span>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed tracking-wide">
              Seasonal fruits, vegetables, herbs, and freshly prepared foods selected for quality and taste.
            </p>
          </div>

          {/* Organic */}
          <div className="border border-[#0B2114]/10 bg-white/40 p-8 rounded-2xl flex flex-col items-center text-center">
            <span className="font-serif text-3xl italic text-[#0B2114] mb-4">Organic</span>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed tracking-wide">
              Carefully sourced organic products that support healthier lifestyles and responsible farming practices.
            </p>
          </div>

          {/* Local */}
          <div className="border border-[#0B2114]/10 bg-white/40 p-8 rounded-2xl flex flex-col items-center text-center">
            <span className="font-serif text-3xl italic text-[#0B2114] mb-4">Local</span>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed tracking-wide">
              Supporting local producers and bringing communities closer to the foods they consume.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: EXPLORE CATEGORIES */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16 w-full">
        <div className="max-w-[1500px] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
              The Catalog
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[#FAF8F5]">
              Explore <span className="italic font-light text-[#FAF8F5]/80">AIRO Essentials</span>
            </h2>
            <p className="font-sans text-xs text-[#FAF8F5]/60 mt-4 leading-relaxed tracking-wide">
              Every category is built as a storytelling gateway, housing premium wellness brands and clinical-grade staples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-20">
            {cmsData.pages.grocery.sections.categories.map((category, index) => (
              <Link 
                href={`/grocery/shop?category=${encodeURIComponent(category.title)}`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2114] via-[#0B2114]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
                  
                  <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col items-start">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-3">
                      Category {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl text-[#FAF8F5] mb-2">{category.title}</h3>
                    <p className="font-sans text-xs text-[#FAF8F5]/70 max-w-sm leading-relaxed tracking-wide opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex justify-center z-20 relative">
            <Link 
              href="/grocery/shop"
              className="bg-[#D4AF37] text-[#0B2114] text-[10px] font-bold tracking-[0.2em] uppercase px-10 py-4 rounded-full hover:bg-[#FAF8F5] transition-colors duration-300 shadow-lg flex items-center gap-3"
            >
              Shop All Essentials <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY AIRO ESSENTIALS (Value Pillars Grid) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Header left */}
          <div className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
              The Standard
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
              Why <br/><span className="italic font-light text-[#0B2114]/80">AIRO Essentials</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-sm leading-relaxed mt-8 tracking-wide">
              We vet every supplier, audit every ingredient list, and verify sustainability metrics so you don&apos;t have to.
            </p>
          </div>

          {/* Pillars right */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Curated Quality */}
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-[#0B2114] mb-3">Curated Quality</span>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed tracking-wide">
                Products selected with a focus on freshness, nutrition, and trusted sourcing.
              </p>
            </div>

            {/* Wellness First */}
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-[#0B2114] mb-3">Wellness First</span>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed tracking-wide">
                Every category is designed to support healthier everyday choices.
              </p>
            </div>

            {/* Global Selection */}
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-[#0B2114] mb-3">Global Selection</span>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed tracking-wide">
                Discover premium products and ingredients from around the world.
              </p>
            </div>

            {/* Community Focused */}
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-[#0B2114] mb-3">Community Focused</span>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed tracking-wide">
                Supporting local producers and sustainable sourcing whenever possible.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: CLOSING WAITLIST */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16 rounded-t-[3rem]">
        <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
            Conscious Commerce
          </span>
          
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-tight mb-8 max-w-3xl text-[#FAF8F5]">
            A Better Way to Shop <br/>for <span className="italic font-light text-[#FAF8F5]/80">Wellness.</span>
          </h2>
          
          <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/80 max-w-lg leading-relaxed mb-4 tracking-wide">
            AIRO Essentials combines the quality of a premium organic market with the convenience of modern retail.
          </p>
          <p className="font-serif text-lg md:text-xl italic text-[#FAF8F5]/90 max-w-xl leading-relaxed mb-16 font-light">
            Because healthier living starts with what you choose every day.
          </p>

          {/* Premium waitlist form */}
          <div className="w-full max-w-md border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 p-8 md:p-10 rounded-3xl backdrop-blur-xl">
            <h3 className="font-serif text-2xl mb-2 text-[#FAF8F5] tracking-tight">The Essentials Waitlist</h3>
            
            <span className="inline-block border border-[#FAF8F5]/20 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
              Products & Online Shopping Coming Soon
            </span>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
              <div>
                <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FAF8F5]/50 mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Marcus Aurelius"
                  className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FAF8F5]/40 text-[#FAF8F5] placeholder-[#FAF8F5]/30 silent-luxury-transition"
                />
              </div>

              <div>
                <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FAF8F5]/50 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="e.g. marcus@philosophy.com"
                  className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FAF8F5]/40 text-[#FAF8F5] placeholder-[#FAF8F5]/30 silent-luxury-transition"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  className="w-full bg-[#FAF8F5] text-[#0B2114] text-[10px] font-bold tracking-widest uppercase py-4 rounded-full hover:opacity-90 silent-luxury-transition flex items-center justify-center gap-2"
                >
                  Join Delivery Waitlist <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            
            <div className="mt-6 inline-flex items-center gap-1.5 justify-center text-[9px] tracking-wider uppercase text-[#FAF8F5]/40 font-semibold">
              <Shield className="w-3.5 h-3.5" /> Secure & Private Sourcing
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
            © 2026 AIRO Essentials. All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}
