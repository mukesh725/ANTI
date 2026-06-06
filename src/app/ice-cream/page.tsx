"use client";

import { ProductCard } from "@/modules/retail/grocery/components/ProductCard";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_GELATO = [
  {
    id: "i_1",
    name: "Ashwagandha Vanilla",
    price: 16.0,
    imageUrl: "https://images.unsplash.com/photo-1559703248-dcaaec9fac92?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "i_2",
    name: "Charcoal Coconut Reishi",
    price: 18.0,
    soldOut: true,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "i_3",
    name: "Matcha Pistachio",
    price: 18.0,
    imageUrl: "https://images.unsplash.com/photo-1570197781417-0a52375731b8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "i_4",
    name: "Lions Mane Raw Cacao",
    price: 16.0,
    imageUrl: "https://images.unsplash.com/photo-1572862804561-26c361405106?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function IceCreamPage() {
  return (
    <div className="w-full bg-alabaster min-h-screen text-charcoal">
      <div className="px-4 md:px-8 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8 pt-16">
          <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight mb-4 uppercase">ICE CREAM</h1>
          <p className="font-sans text-[11px] md:text-xs text-charcoal/70 max-w-5xl leading-relaxed">
            A decadent collision of Italian culinary tradition and Ayurvedic science. Our adaptogenic gelato is churned slowly in small batches without refined sugars, artificial emulsifiers, or seed oils. Designed to provide deep cellular nourishment without the glycemic crash.
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
                Product Type <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Dairy Gelato</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Plant-Based Ice Cream</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Sorbets</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Adaptogenic Pints</li>
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase mb-4 flex justify-between items-center">
                Dietary Need <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Vegan</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Keto Friendly</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Nut Free</li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {MOCK_GELATO.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
