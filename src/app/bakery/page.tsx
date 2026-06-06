"use client";

import { ProductCard } from "@/modules/retail/grocery/components/ProductCard";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_BAKERY = [
  {
    id: "b_1",
    name: "Wild Fermented Sourdough",
    price: 18.0,
    imageUrl: "https://images.unsplash.com/photo-1585478259715-876a6a81fa08?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "b_2",
    name: "Ceremonial Matcha Croissant",
    price: 12.0,
    imageUrl: "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "b_3",
    name: "Black Truffle Focaccia",
    price: 24.0,
    soldOut: true,
    imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "b_4",
    name: "Adaptogenic Rye Loaf",
    price: 20.0,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function BakeryPage() {
  return (
    <div className="w-full bg-alabaster min-h-screen text-charcoal">
      <div className="px-4 md:px-8 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8 pt-16">
          <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight mb-4 uppercase">BAKERY</h1>
          <p className="font-sans text-[11px] md:text-xs text-charcoal/70 max-w-5xl leading-relaxed">
            Fresh-baked fusion items, crafted daily using heirloom grains and ancient fermentation techniques. Our artisanal bakery utilizes exclusively organic, regenerative flours and slow-fermentation processes to ensure uncompromising quality and digestion. Arrive early, quantities are strictly limited.
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
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Sourdough Breads</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Laminated Pastries</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Gluten-Free</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Savory Baked Goods</li>
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase mb-4 flex justify-between items-center">
                Availability <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> In Stock Today</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Pre-Order Next Day</li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {MOCK_BAKERY.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
