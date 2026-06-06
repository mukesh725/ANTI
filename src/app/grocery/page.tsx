"use client";

import { ProductCard } from "@/modules/retail/grocery/components/ProductCard";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_GROCERY = [
  {
    id: "g_1",
    name: "Lakadong Turmeric",
    price: 38.0,
    imageUrl: "https://images.unsplash.com/photo-1615486171448-4fd13f1ddbc4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g_2",
    name: "Wild Forest Honey",
    price: 45.0,
    imageUrl: "https://images.unsplash.com/photo-1587049352847-4d4b12736173?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g_3",
    name: "Himalayan Pink Salt",
    price: 22.0,
    imageUrl: "https://images.unsplash.com/photo-1601625463684-2fa643a60f9e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g_4",
    name: "First-Press Olive Oil",
    price: 65.0,
    soldOut: true,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g_5",
    name: "Ceremonial Cacao Paste",
    price: 45.0,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e440c082180e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g_6",
    name: "Blue Lotus Tea",
    price: 32.0,
    imageUrl: "https://images.unsplash.com/photo-1576092762791-dd9e2220c4af?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function GroceryPage() {
  return (
    <div className="w-full bg-alabaster min-h-screen text-charcoal">
      <div className="px-4 md:px-8 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8 pt-16">
          <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight mb-4 uppercase">GROCERY</h1>
          <p className="font-sans text-[11px] md:text-xs text-charcoal/70 max-w-5xl leading-relaxed">
            AIRO Grocery offers organic pantry staples, rare ingredients, fresh foods, and highly curated wellness items. Shop top-selling items from AIRO and leading holistic brands, all crafted with the purest ingredients for everyday nourishment. Free shipping on non-perishable orders over $100.
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
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Pantry Staples</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Oils & Vinegars</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Spices & Seasonings</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Tea & Coffee</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Functional Foods</li>
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase mb-4 flex justify-between items-center">
                Brand <ChevronUp className="w-3 h-3" />
              </h3>
              <ul className="space-y-3 text-[11px] font-sans text-charcoal/80">
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> AIRO Select</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> AIRO Choice</li>
                <li className="flex items-center gap-3"><input type="checkbox" className="accent-charcoal" /> Wildcrafted</li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {MOCK_GROCERY.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
