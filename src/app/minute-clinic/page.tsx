"use client";

import { ProductCard } from "@/modules/retail/grocery/components/ProductCard";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_CLINIC = [
  {
    id: "m_1",
    name: "NAD+ IV Drip Therapy",
    price: 250.0,
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "m_2",
    name: "Hyperbaric Oxygen Session",
    price: 150.0,
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "m_3",
    name: "Advanced Biomarker Panel",
    price: 499.0,
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "m_4",
    name: "Cryotherapy Session",
    price: 85.0,
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function MinuteClinicPage() {
  return (
    <div className="w-full bg-alabaster min-h-screen text-charcoal">
      <div className="px-4 md:px-8 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8 pt-16">
          <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight mb-4 uppercase">MINUTE CLINIC</h1>
          <p className="font-sans text-[11px] md:text-xs text-charcoal/70 max-w-5xl leading-relaxed">
            In-store cutting-edge clinical therapies and diagnostics. From advanced NAD+ IV drips to comprehensive blood panels, optimize your biology while you shop. Sessions are administered by registered nurses and functional medicine practitioners.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center py-4 border-b border-charcoal/10 text-[10px] md:text-xs font-sans uppercase tracking-wider">
          <div className="flex items-center gap-2 cursor-pointer w-48 md:w-64 border-r border-charcoal/10">
            <SlidersHorizontal className="w-3 h-3" /> HIDE FILTERS
          </div>
          <div className="flex items-center gap-2 cursor-pointer pl-4">
            SORT BY <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row pt-8 gap-8 pb-32">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 md:pr-8">
            <div className="mb-8">
              <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase mb-4 flex justify-between items-center">
                Service Type <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> IV Therapies</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Diagnostic Testing</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Physical Recovery</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Consultations</li>
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase mb-4 flex justify-between items-center">
                Duration <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> 15 - 30 mins</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> 30 - 60 mins</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> 60+ mins</li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {MOCK_CLINIC.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
