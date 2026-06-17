"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] pt-32 px-6 md:px-16 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0B2114]/10 bg-[#0B2114]/5 text-[#0B2114] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
        <Sparkles className="w-3 h-3 text-[#0B2114]/70" /> Premium Access
      </div>
      <h1 className="font-serif text-5xl md:text-7xl mb-6">
        AIRO <span className="italic font-light">Membership</span>
      </h1>
      <p className="font-sans text-sm md:text-base text-[#0B2114]/70 max-w-2xl mb-12">
        Unlock exclusive access to advanced longevity protocols, personalized diagnostics, and unlimited Minute Clinic visits.
      </p>
      
      <Link 
        href="/health" 
        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Airo Health
      </Link>
    </div>
  );
}
