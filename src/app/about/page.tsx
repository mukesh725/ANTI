"use client";

import { Sparkles, Shield, Heart, Compass } from "lucide-react";
import Link from "next/link";
import { useCms } from "@/context/CmsContext";

export default function AboutPage() {
  const cmsData = useCms();
  
  // Cast to any to avoid TS errors until types are updated if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageContent = (cmsData.pages as any).about;

  if (!pageContent) return null;

  const { hero, trustFramework, metrics, leadership } = pageContent;

  const iconMap: Record<string, typeof Shield> = {
    "Clinical Rigor": Shield,
    "Compounding Purity": Sparkles,
    "Sourcing Integrity": Heart,
    "HIPAA Data Sovereignty": Compass,
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#1C1C1E] min-h-screen overflow-x-hidden selection:bg-[#1C1C1E] selection:text-[#FFFFFF]">
      
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#1C1C1E]/60 mb-4 font-semibold block">
          {hero.label}
        </span>
        <h1 className="font-serif text-4xl md:text-7xl text-[#1C1C1E] max-w-5xl tracking-tight leading-none mb-8">
          {hero.title}
        </h1>
        <p className="text-[#1C1C1E]/75 text-sm md:text-lg max-w-3xl leading-relaxed">
          {hero.description}
        </p>
      </section>

      {/* The Trust Framework Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5EFEB] border-t border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#1C1C1E]/50 font-bold">{trustFramework.label}</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight">{trustFramework.title}</h2>
            <p className="text-xs md:text-sm text-[#1C1C1E]/70 leading-relaxed">
              {trustFramework.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {trustFramework.pillars.map((pillar: any, index: number) => {
              const IconComp = iconMap[pillar.title] || Shield;
              const iconColor = pillar.title === "Compounding Purity" ? "text-[#0A84FF]" : "text-[#1C1C1E]";
              return (
                <div key={index} className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <IconComp className={`w-8 h-8 ${iconColor} mb-4`} />
                    <h4 className="font-serif text-xl mb-2">{pillar.title}</h4>
                    <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="text-[9px] tracking-wider uppercase font-bold text-[#1C1C1E]/40 pt-4 border-t border-[#FFFFFF]">
                    {pillar.badge}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Ecosystem Metrics */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#1C1C1E]/60 font-semibold block">
              {metrics.label}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-tight">
              {metrics.title}
            </h2>
            <p className="text-sm text-[#1C1C1E]/80 leading-relaxed">
              {metrics.description1}
            </p>
            <p className="text-sm text-[#1C1C1E]/80 leading-relaxed">
              {metrics.description2}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {metrics.stats.map((stat: any, index: number) => {
              const valueColor = stat.value === "Zero" ? "text-[#0A84FF]" : "text-[#1C1C1E]";
              return (
                <div key={index} className="border border-[#1C1C1E]/10 bg-white/40 p-8 rounded-2xl text-center space-y-2">
                  <span className={`font-serif text-4xl md:text-5xl ${valueColor} font-medium block`}>{stat.value}</span>
                  <span className="text-[9px] tracking-widest uppercase font-bold text-[#1C1C1E]/60 block">{stat.label}</span>
                  <p className="text-[10px] text-[#1C1C1E]/50 leading-relaxed pt-2">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Spotlight */}
      <section className="px-6 md:px-12 py-20 md:py-32 bg-[#F5EFEB] border-t border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text block */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#1C1C1E]/60 font-semibold block">
              {leadership.label}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-tight">
              {leadership.name}
            </h2>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0A84FF]">
              {leadership.role}
            </h4>
            <div className="h-0.5 w-16 bg-[#0A84FF]"></div>
            <p className="text-sm text-[#1C1C1E]/85 leading-relaxed">
              {leadership.bio1}
            </p>
            <p className="text-sm text-[#1C1C1E]/85 leading-relaxed">
              {leadership.bio2}
            </p>
            <p className="text-xs font-semibold italic text-[#1C1C1E]/70">
              {leadership.quote}
            </p>
          </div>

          {/* Graphical Card */}
          <div className="lg:col-span-6 bg-[#1C1C1E] text-[#FFFFFF] rounded-3xl p-10 md:p-12 border border-[#2C2C2E] shadow-xl relative overflow-hidden flex flex-col justify-between h-[450px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFFFFF]/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div>
              <span className="font-serif text-lg tracking-widest text-[#0A84FF]">AIRO.</span>
              <h3 className="font-serif text-3xl mt-6 tracking-wide max-w-sm">
                {leadership.name}
              </h3>
              <p className="text-xs text-[#FFFFFF]/60 mt-1 uppercase tracking-widest">Founder, AIRO Ecosystem</p>
            </div>
            
            <div className="border-t border-[#FFFFFF]/10 pt-6 space-y-4">
              <p className="text-xs text-[#FFFFFF]/80 leading-relaxed">
                {leadership.cardDescription}
              </p>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-[#0A84FF]">
                {leadership.cardBadge}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Global Footer (Hardcoded as it is on other pages unless CMS footer is globally accessible) */}
      <footer className="bg-[#1C1C1E] text-[#FFFFFF] py-16 px-6 md:px-12 border-t border-[#2C2C2E]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="font-serif text-2xl tracking-widest uppercase text-[#FFFFFF]">AIRO.</span>
              <p className="text-xs text-[#FFFFFF]/60 leading-relaxed">
                An integrated longevity ecosystem combining nutrition, diagnostics, clinical care, and personalized pharmacy solutions.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#0A84FF] font-semibold mb-4">Support & Care</h4>
              <ul className="space-y-2 text-xs text-[#FFFFFF]/70">
                <li>Concierge: <a href="mailto:concierge@airohealth.com" className="hover:text-white transition-colors">concierge@airohealth.com</a></li>
                <li>Clinical Team: <a href="mailto:clinical@airohealth.com" className="hover:text-white transition-colors">clinical@airohealth.com</a></li>
                <li>Phone: <a href="tel:+18005552476" className="hover:text-white transition-colors">+1 (800) 555-2476</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#0A84FF] font-semibold mb-4">Ecosystem</h4>
              <ul className="space-y-2 text-xs text-[#FFFFFF]/70">
                <li><Link href="/grocery" className="hover:text-white transition-colors">AIRO Essentials</Link></li>
                <li><Link href="/pharmacy" className="hover:text-white transition-colors">AIRO Pharmacy</Link></li>
                <li><Link href="/minute-clinic" className="hover:text-white transition-colors">Minute Clinic</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#0A84FF] font-semibold mb-4">Legal & Press</h4>
              <ul className="space-y-2 text-xs text-[#FFFFFF]/70">
                <li><Link href="/about" className="hover:text-white transition-colors font-medium">About & Leadership</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press & Investor Kit</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#2C2C2E] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-[#FFFFFF]/40">
            <span>&copy; 2026 AIRO Health. All rights reserved.</span>
            <span className="text-center max-w-lg leading-relaxed md:text-right">
              Healthcare programs and compounding therapies are subject to practitioner evaluation. All contents are informational and not medical advice.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
