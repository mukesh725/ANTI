"use client";

import { ProductCard } from "@/modules/retail/grocery/components/ProductCard";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_PHARMACY = [
  {
    id: "p_1",
    name: "Liposomal Vitamin C",
    price: 48.0,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "p_2",
    name: "Magnesium L-Threonate",
    price: 55.0,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "p_3",
    name: "Organic Shilajit Resin",
    price: 72.0,
    soldOut: true,
    imageUrl: "https://images.unsplash.com/photo-1589146185848-03fd1bce8276?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "p_4",
    name: "NAD+ Precursor Complex",
    price: 110.0,
    imageUrl: "https://images.unsplash.com/photo-1550572017-edcd10d86c75?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function PharmacyPage() {
  return (
    <div className="w-full bg-alabaster min-h-screen text-charcoal">
      <div className="px-4 md:px-8 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8 pt-16">
          <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight mb-4 uppercase">PHARMACY</h1>
          <p className="font-sans text-[11px] md:text-xs text-charcoal/70 max-w-5xl leading-relaxed">
            A meticulously curated selection of clinical-grade supplements, bio-available tinctures, and advanced longevity protocols. Formulated by leading functional medicine practitioners to optimize your cellular health and performance.
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
                Category <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Longevity & Cellular</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Cognitive Function</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Gut Microbiome</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Sleep & Recovery</li>
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase mb-4 flex justify-between items-center">
                Format <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Liposomal Liquids</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Vegan Capsules</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Powders</li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {MOCK_PHARMACY.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
