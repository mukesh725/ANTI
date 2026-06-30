"use client";

import Link from "next/link";
import { Download } from "lucide-react";

export default function PressPage() {
  return (
    <div className="w-full bg-[#FAF8F5] text-[#597467] min-h-screen overflow-x-hidden selection:bg-[#597467] selection:text-[#FAF8F5]">
      
      {/* Header Banner */}
      <section className="relative px-6 md:px-12 pt-20 pb-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#597467]/60 mb-4 font-semibold block">
          Press & Media
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#597467] max-w-4xl tracking-tight leading-tight mb-6">
          AIRO Pressroom & Media Resources
        </h1>
        <p className="text-[#597467]/75 text-sm md:text-base max-w-2xl leading-relaxed">
          Access the latest announcements, brand guidelines, executive profiles, and downloadable media resources for journalists and investors.
        </p>
      </section>

      {/* Press Releases Grid */}
      <section className="px-6 md:px-12 pb-20 max-w-7xl mx-auto space-y-12">
        <div className="border-b border-[#E6DFD5] pb-6 flex justify-between items-end">
          <h2 className="font-serif text-2xl tracking-wide">Recent News</h2>
          <span className="text-xs text-[#597467]/50 tracking-widest font-semibold uppercase">Filter: All Releases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gray-500 block">JUNE 08, 2026</span>
            <h3 className="font-serif text-lg leading-snug hover:text-[#597467]/80 transition-colors">
              <a href="#release-1">AIRO Health Launches 5-Minute Diagnostics Health Chair in California Flagship Locations</a>
            </h3>
            <p className="text-xs text-[#597467]/75 leading-relaxed">
              AIRO Health details the rollout of its physical wellness screening chairs, enabling customers to capture key metabolic, vital sign, and ECG indicators in approximately five minutes.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gray-500 block">MAY 18, 2026</span>
            <h3 className="font-serif text-lg leading-snug hover:text-[#597467]/80 transition-colors">
              <a href="#release-2">Personalized Longevity Medicine: AIRO Pharmacy Announces Custom Compounding Integration</a>
            </h3>
            <p className="text-xs text-[#597467]/75 leading-relaxed">
              By launching in-house compounding options, AIRO allows clinical practitioners to tailor medication dosages and format delivery configurations for individualized patient wellness profiles.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gray-500 block">APRIL 02, 2026</span>
            <h3 className="font-serif text-lg leading-snug hover:text-[#597467]/80 transition-colors">
              <a href="#release-3">Conscious Nutrition: AIRO Essentials Opens Organic Grocery Sourcing Channel</a>
            </h3>
            <p className="text-xs text-[#597467]/75 leading-relaxed">
              Highlighting the crucial relationship between nutrition and metabolic diagnostics, AIRO Essentials launches organic grocery delivery lists focused on farm-fresh produce and premium proteins.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Assets and Downloadable Kits */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5EFEB] border-t border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-3xl tracking-tight leading-tight">
              Media Assets & Guidelines
            </h2>
            <p className="text-sm text-[#597467]/80 leading-relaxed">
              Our official media kit contains clean brand assets, executive profile photos of founder Kumar Swamy Maruri, and copy assets summarizing the AIRO Health mission.
            </p>
            <p className="text-xs text-[#597467]/65">
              Please use high-resolution files and observe our padding guides. Do not distort our color parameters.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm flex justify-between items-center">
              <div className="space-y-2">
                <h4 className="font-serif text-md font-medium">Brand Guidelines Kit</h4>
                <p className="text-[10px] text-gray-500">PDF &bull; 8.4 MB</p>
              </div>
              <button 
                onClick={() => alert("Downloading Brand Guidelines Kit...")}
                className="p-3 bg-[#597467] hover:bg-[#597467]/90 text-white rounded-full transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm flex justify-between items-center">
              <div className="space-y-2">
                <h4 className="font-serif text-md font-medium">High-Res Logo Pack</h4>
                <p className="text-[10px] text-gray-500">ZIP &bull; 14.2 MB</p>
              </div>
              <button 
                onClick={() => alert("Downloading High-Res Logo Pack...")}
                className="p-3 bg-[#597467] hover:bg-[#597467]/90 text-white rounded-full transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm flex justify-between items-center">
              <div className="space-y-2">
                <h4 className="font-serif text-md font-medium">Executive Profiles Kit</h4>
                <p className="text-[10px] text-gray-500">PDF &bull; 6.1 MB</p>
              </div>
              <button 
                onClick={() => alert("Downloading Executive Profiles Kit...")}
                className="p-3 bg-[#597467] hover:bg-[#597467]/90 text-white rounded-full transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white border border-[#E6DFD5] p-6 rounded-2xl shadow-sm flex justify-between items-center">
              <div className="space-y-2">
                <h4 className="font-serif text-md font-medium">Ecosystem Telemetry facts</h4>
                <p className="text-[10px] text-gray-500">XLSX &bull; 2.2 MB</p>
              </div>
              <button 
                onClick={() => alert("Downloading Ecosystem Telemetry sheets...")}
                className="p-3 bg-[#597467] hover:bg-[#597467]/90 text-white rounded-full transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Facts and Contacts */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl tracking-wide border-b border-[#E6DFD5] pb-4">Corporate Factsheet</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">Founded</span>
              <p className="font-serif text-xl mt-1">2026</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">Ecosystem Verticals</span>
              <p className="font-serif text-xl mt-1">7 Branches</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">Focus</span>
              <p className="font-serif text-xl mt-1">Longevity & Care</p>
            </div>
          </div>
          
          <p className="text-xs text-[#597467]/75 leading-relaxed">
            AIRO Health is privately held and focused on integrating medical precision (compounding, minute clinics, advanced diagnostic laboratories) with longevity lifestyle parameters (nutrition essentials, digital care, IV nutrient therapy).
          </p>
        </div>

        <div className="bg-[#597467] text-[#FAF8F5] rounded-3xl p-8 border border-[#7C9A8E] shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif text-xl tracking-wide text-[#E6AFA3]">Media & Investor Relations</h3>
            <p className="text-xs text-[#FAF8F5]/85 leading-relaxed">
              If you are a member of the press, an investor, or a medical partner and want to arrange a clinical interview or corporate query, please contact our relations desk:
            </p>
          </div>
          <div className="mt-6 border-t border-[#FAF8F5]/10 pt-6 space-y-2 text-xs">
            <p><strong>Email:</strong> <a href="mailto:concierge@airohealth.com" className="text-[#E6AFA3] hover:underline">concierge@airohealth.com</a></p>
            <p><strong>Investor Desk:</strong> <a href="mailto:clinical@airohealth.com" className="text-[#E6AFA3] hover:underline">clinical@airohealth.com</a></p>
            <p><strong>Phone:</strong> +1 (800) 555-2476</p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-[#597467] text-[#FAF8F5] py-16 px-6 md:px-12 border-t border-[#7C9A8E]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="font-serif text-2xl tracking-widest uppercase text-[#FAF8F5]">AIRO.</span>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed">
                An integrated longevity ecosystem combining nutrition, diagnostics, clinical care, and personalized pharmacy solutions.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#E6AFA3] font-semibold mb-4">Support & Care</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li>Concierge: <a href="mailto:concierge@airohealth.com" className="hover:text-white transition-colors">concierge@airohealth.com</a></li>
                <li>Clinical Team: <a href="mailto:clinical@airohealth.com" className="hover:text-white transition-colors">clinical@airohealth.com</a></li>
                <li>Phone: <a href="tel:+18005552476" className="hover:text-white transition-colors">+1 (800) 555-2476</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#E6AFA3] font-semibold mb-4">Ecosystem</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li><Link href="/grocery" className="hover:text-white transition-colors">AIRO Essentials</Link></li>
                <li><Link href="/pharmacy" className="hover:text-white transition-colors">AIRO Pharmacy</Link></li>
                <li><Link href="/minute-clinic" className="hover:text-white transition-colors">Minute Clinic</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#E6AFA3] font-semibold mb-4">Legal & Press</h4>
              <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
                <li><Link href="/about" className="hover:text-white transition-colors">About & Leadership</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors font-medium">Press & Investor Kit</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#7C9A8E] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-[#FAF8F5]/40">
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
