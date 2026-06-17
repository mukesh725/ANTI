"use client";

import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";

export default function HealthChairPage() {
  return (
    <div className="min-h-screen bg-[#09120F] text-[#FAF8F5] pt-32 px-6 md:px-16 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
        <Cpu className="w-3 h-3 text-[#FAF8F5]/70" /> Clinical Innovation
      </div>
      <h1 className="font-serif text-5xl md:text-7xl mb-6">
        AIRO <span className="italic font-light">Health Chair</span>
      </h1>
      <p className="font-sans text-sm md:text-base text-[#FAF8F5]/70 max-w-2xl mb-12">
        A 5-minute diagnostic assessment capturing key physiological indicators like blood pressure, heart rate, ECG, and SpO2 in real-time.
      </p>
      
      <Link 
        href="/health" 
        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#FAF8F5] hover:text-[#FAF8F5]/60 silent-luxury-transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Airo Health
      </Link>
    </div>
  );
}
