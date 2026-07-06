"use client";

import Link from "next/link";
import { Download } from "lucide-react";

export default function PressPage() {
  return (
    <div className="w-full bg-[#FFFFFF] text-[#1C1C1E] min-h-screen overflow-x-hidden selection:bg-[#1C1C1E] selection:text-[#FFFFFF]">
      
      {/* Header Banner */}
      <section className="relative px-6 md:px-12 pt-20 pb-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#1C1C1E]/60 mb-4 font-semibold block">
          Press & Media
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#1C1C1E] max-w-4xl tracking-tight leading-tight mb-6">
          AIRO Pressroom & Media Resources
        </h1>
        <p className="text-[#1C1C1E]/75 text-sm md:text-base max-w-2xl leading-relaxed">
          Access the latest announcements, brand guidelines, executive profiles, and downloadable media resources for journalists and investors.
        </p>
      </section>

      {/* Press Releases Grid */}
      <section className="px-6 md:px-12 pb-20 max-w-7xl mx-auto space-y-12">
        <div className="border-b border-[#E6DFD5] pb-6 flex justify-between items-end">
          <h2 className="font-serif text-2xl tracking-wide">Recent News</h2>
          <span className="text-xs text-[#1C1C1E]/50 tracking-widest font-semibold uppercase">Filter: All Releases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gray-500 block">JUNE 08, 2026</span>
            <h3 className="font-serif text-lg leading-snug hover:text-[#1C1C1E]/80 transition-colors">
              <a href="#release-1">AIRO Health Launches 5-Minute Diagnostics Health Chair in California Flagship Locations</a>
            </h3>
            <p className="text-xs text-[#1C1C1E]/75 leading-relaxed">
              AIRO Health details the rollout of its physical wellness screening chairs, enabling customers to capture key metabolic, vital sign, and ECG indicators in approximately five minutes.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gray-500 block">MAY 18, 2026</span>
            <h3 className="font-serif text-lg leading-snug hover:text-[#1C1C1E]/80 transition-colors">
              <a href="#release-2">Personalized Longevity Medicine: AIRO Pharmacy Announces Custom Compounding Integration</a>
            </h3>
            <p className="text-xs text-[#1C1C1E]/75 leading-relaxed">
              By launching in-house compounding options, AIRO allows clinical practitioners to tailor medication dosages and format delivery configurations for individualized patient wellness profiles.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gray-500 block">APRIL 02, 2026</span>
            <h3 className="font-serif text-lg leading-snug hover:text-[#1C1C1E]/80 transition-colors">
              <a href="#release-3">Conscious Nutrition: AIRO Essentials Opens Organic Grocery Sourcing Channel</a>
            </h3>
            <p className="text-xs text-[#1C1C1E]/75 leading-relaxed">
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
            <p className="text-sm text-[#1C1C1E]/80 leading-relaxed">
              Our official media kit contains clean brand assets, executive profile photos of founder Kumar Swamy Maruri, and copy assets summarizing the AIRO Health mission.
            </p>
            <p className="text-xs text-[#1C1C1E]/65">
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
                className="p-3 bg-[#1C1C1E] hover:bg-[#1C1C1E]/90 text-white rounded-full transition-all shadow-md active:scale-95"
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
                className="p-3 bg-[#1C1C1E] hover:bg-[#1C1C1E]/90 text-white rounded-full transition-all shadow-md active:scale-95"
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
                className="p-3 bg-[#1C1C1E] hover:bg-[#1C1C1E]/90 text-white rounded-full transition-all shadow-md active:scale-95"
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
                className="p-3 bg-[#1C1C1E] hover:bg-[#1C1C1E]/90 text-white rounded-full transition-all shadow-md active:scale-95"
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
          
          <p className="text-xs text-[#1C1C1E]/75 leading-relaxed">
            AIRO Health is privately held and focused on integrating medical precision (compounding, minute clinics, advanced diagnostic laboratories) with longevity lifestyle parameters (nutrition essentials, digital care, IV nutrient therapy).
          </p>
        </div>

        <div className="bg-[#1C1C1E] text-[#FFFFFF] rounded-3xl p-8 border border-[#2C2C2E] shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif text-xl tracking-wide text-[#0A84FF]">Media & Investor Relations</h3>
            <p className="text-xs text-[#FFFFFF]/85 leading-relaxed">
              If you are a member of the press, an investor, or a medical partner and want to arrange a clinical interview or corporate query, please contact our relations desk:
            </p>
          </div>
          <div className="mt-6 border-t border-[#FFFFFF]/10 pt-6 space-y-2 text-xs">
            <p><strong>Email:</strong> <a href="mailto:concierge@airohealth.com" className="text-[#0A84FF] hover:underline">concierge@airohealth.com</a></p>
            <p><strong>Investor Desk:</strong> <a href="mailto:clinical@airohealth.com" className="text-[#0A84FF] hover:underline">clinical@airohealth.com</a></p>
            <p><strong>Phone:</strong> +1 (800) 555-2476</p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      

    </div>
  );
}
