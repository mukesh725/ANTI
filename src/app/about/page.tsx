"use client";

import { Sparkles, Shield, Heart, Compass } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 mb-4 font-semibold block">
          Our Story
        </span>
        <h1 className="font-serif text-4xl md:text-7xl text-[#0B2114] max-w-5xl tracking-tight leading-none mb-8">
          The Future of Proactive Health Optimization
        </h1>
        <p className="text-[#0B2114]/75 text-sm md:text-lg max-w-3xl leading-relaxed">
          AIRO was founded to change a broken paradigm: moving from reactive disease treatment to proactive, personalized health optimization. We combine advanced diagnostics, pharmacy compounding, clinical care, and conscious nutrition under one connected roof.
        </p>
      </section>

      {/* Vision & Narrative */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5EFEB] border-t border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight">
              A Connected Health Ecosystem
            </h2>
            <p className="text-sm text-[#0B2114]/80 leading-relaxed">
              We believe that health begins with everyday choices. What we eat impacts our metabolic markers; our diagnostic panels guide our clinical care; and our pharmacies compounding services deliver target, clean formulations tailored precisely for our physiology.
            </p>
            <p className="text-sm text-[#0B2114]/80 leading-relaxed">
              By bringing together doctors, compounders, nutritionists, and advanced health scan technology, AIRO enables a continuous loop of diagnostics, correction, and longevity optimization.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm">
              <Sparkles className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h4 className="font-serif text-lg mb-2">Conscious Sourcing</h4>
              <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                From organic produce in our Essentials market to active ingredients in custom compounded formulations, purity is our primary metric.
              </p>
            </div>
            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm">
              <Shield className="w-6 h-6 text-[#0B2114] mb-4" />
              <h4 className="font-serif text-lg mb-2">Clinical Precision</h4>
              <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                Every biomarker analysis, clinical evaluation, and health chair report is reviewed by qualified medical practitioners.
              </p>
            </div>
            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm">
              <Heart className="w-6 h-6 text-[#0B2114] mb-4" />
              <h4 className="font-serif text-lg mb-2">Proactive Longevity</h4>
              <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                Instead of waiting for illness to manifest, we scan early metabolic and cellular markers to correct imbalances before they disrupt your life.
              </p>
            </div>
            <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl shadow-sm">
              <Compass className="w-6 h-6 text-[#0B2114] mb-4" />
              <h4 className="font-serif text-lg mb-2">Absolute Guidance</h4>
              <p className="text-xs text-[#0B2114]/70 leading-relaxed">
                Whether chatting with our AIRO assistant or consulting our clinical concierge team, you are never left guessing about your results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Spotlight */}
      <section className="px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text block */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 font-semibold block">
              Leadership & Vision
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-tight">
              Kumar Swamy Maruri
            </h2>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Founder & Chief Executive Officer
            </h4>
            <div className="h-0.5 w-16 bg-[#D4AF37]"></div>
            <p className="text-sm text-[#0B2114]/85 leading-relaxed">
              Founded by **Kumar Swamy Maruri**, AIRO was born from a singular vision: to make advanced health diagnostics, custom medicine, and nutrition accessible under one seamless ecosystem. Kumar Swamy Maruri envisioned a world where health is optimized daily, rather than treated during emergencies.
            </p>
            <p className="text-sm text-[#0B2114]/85 leading-relaxed">
              Under his leadership, AIRO has evolved from a clinic model into a holistic, technology-driven longevity ecosystem. By combining the 5-Minute Health Chair assessment, advanced blood and metabolic diagnostics, compounding services, and organic nutrition retail, he has created a unified path to conscious living.
            </p>
            <p className="text-xs font-semibold italic text-[#0B2114]/70">
              &ldquo;The next frontier of medicine is not treating disease; it is the absolute optimization of human vitality.&rdquo; &mdash; Kumar Swamy Maruri
            </p>
          </div>

          {/* Graphical Card placeholder */}
          <div className="lg:col-span-6 bg-[#0B2114] text-[#FAF8F5] rounded-3xl p-10 md:p-12 border border-[#1A3324] shadow-xl relative overflow-hidden flex flex-col justify-between h-[450px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF8F5]/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div>
              <span className="font-serif text-lg tracking-widest text-[#D4AF37]">AIRO.</span>
              <h3 className="font-serif text-3xl mt-6 tracking-wide max-w-sm">
                Kumar Swamy Maruri
              </h3>
              <p className="text-xs text-[#FAF8F5]/60 mt-1 uppercase tracking-widest">Founder, AIRO Ecosystem</p>
            </div>
            
            <div className="border-t border-[#FAF8F5]/10 pt-6 space-y-4">
              <p className="text-xs text-[#FAF8F5]/80 leading-relaxed">
                Kumar Swamy Maruri leads our network of practitioners, compounders, and nutritionists, driving the research and technological integration that powers all AIRO Minute Clinic, Diagnostics, and Compounding services.
              </p>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                EST. 2026 &bull; INTEGRATED LONGEVITY
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-[#0B2114] text-[#FAF8F5] py-16 px-6 md:px-12 border-t border-[#1A3324]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="font-serif text-2xl tracking-widest uppercase text-[#FAF8F5]">AIRO.</span>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed">
                An integrated longevity ecosystem combining nutrition, diagnostics, clinical care, and personalized pharmacy solutions.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Support & Care</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li>Concierge: <a href="mailto:concierge@airohealth.com" className="hover:text-white transition-colors">concierge@airohealth.com</a></li>
                <li>Clinical Team: <a href="mailto:clinical@airohealth.com" className="hover:text-white transition-colors">clinical@airohealth.com</a></li>
                <li>Phone: <a href="tel:+18005552476" className="hover:text-white transition-colors">+1 (800) 555-2476</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Ecosystem</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li><Link href="/grocery" className="hover:text-white transition-colors">AIRO Essentials</Link></li>
                <li><Link href="/pharmacy" className="hover:text-white transition-colors">AIRO Pharmacy</Link></li>
                <li><Link href="/minute-clinic" className="hover:text-white transition-colors">Minute Clinic</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Legal & Press</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li><Link href="/about" className="hover:text-white transition-colors font-medium">About & Leadership</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press & Investor Kit</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A3324] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-[#FAF8F5]/40">
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
