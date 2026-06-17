"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";

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

const essentialsCategories = [
  { 
    name: "Grocery", 
    desc: "Organic produce, superfoods, and clean pantry essentials.", 
    href: "/grocery", 
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800"
  },
  { 
    name: "Bakery", 
    desc: "Artisanal breads, gluten-free options, and fresh pastries.", 
    href: "/bakery", 
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800"
  },
  { 
    name: "Ice Cream", 
    desc: "Dairy-free, sugar-conscious, and functional frozen treats.", 
    href: "/ice-cream", 
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=800"
  }
];

export default function EssentialsHomePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* HERO SECTION */}
      <section className="relative h-[70vh] w-full flex items-center justify-start px-6 md:px-16 overflow-hidden pt-20">
        <div className="absolute inset-0 w-full h-full">
          <ParallaxImage 
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2000" 
            alt="AIRO Essentials Market"
            className="w-full h-full"
            speed={0.1}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[800px] text-[#0B2114] pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0B2114]/10 bg-[#0B2114]/5 text-[#0B2114] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
            <Leaf className="w-3 h-3 text-[#0B2114]" /> Natural Nourishment
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight leading-[1.02] text-[#0B2114] mb-8">
            AIRO <br/>
            <span className="italic font-light text-[#0B2114]/80">Essentials.</span>
          </h1>
          
          <p className="font-sans text-sm md:text-base text-[#0B2114]/70 max-w-lg leading-relaxed mb-12 tracking-wide">
            A carefully curated market featuring organic produce, functional groceries, and premium health goods selected to nourish your biology from the inside out.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 md:py-36 px-6 md:px-16 w-full max-w-[1500px] mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
            Explore the Market
          </span>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
            Curated <span className="italic font-light text-[#0B2114]/80">Departments</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {essentialsCategories.map((cat, idx) => (
            <div key={idx} className="flex flex-col group h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
                <ParallaxImage 
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute inset-0 bg-[#0B2114]/5 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0B2114] mb-3">{cat.name}</h3>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed mb-6 flex-grow">
                {cat.desc}
              </p>
              <Link 
                href={cat.href} 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
              >
                Shop {cat.name} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
