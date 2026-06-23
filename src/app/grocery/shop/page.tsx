"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCms } from "@/context/CmsContext";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "All";
  
  const cmsData = useCms();
  const { products, loading: productsLoading } = useProducts("grocery");
  const { addItem } = useCart();
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Update active category if URL changes
  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Extract categories for tabs
  const categories = ["All", ...(cmsData.pages.grocery.sections.categories || []).map((c: { title: string }) => c.title)];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen">
      
      {/* Header */}
      <div className="bg-[#0B2114] text-[#FAF8F5] pt-32 pb-16 px-6 md:px-16">
        <div className="max-w-[1500px] mx-auto">
          <Link href="/grocery" className="inline-flex items-center gap-2 text-[#FAF8F5]/60 hover:text-[#FAF8F5] transition-colors text-[10px] uppercase tracking-widest font-bold mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Essentials
          </Link>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight leading-tight mb-4">
            Shop <span className="italic font-light text-[#FAF8F5]/80">AIRO Essentials</span>
          </h1>
          <p className="font-sans text-sm text-[#FAF8F5]/70 max-w-xl leading-relaxed tracking-wide">
            Browse our complete catalog of farm-fresh greens, quality meats, and wellness-focused daily staples.
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="sticky top-[72px] z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#0B2114]/10 py-4 px-6 md:px-16">
        <div className="max-w-[1500px] mx-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#0B2114] text-[#FAF8F5] shadow-md"
                    : "bg-[#0B2114]/5 text-[#0B2114]/60 hover:bg-[#0B2114]/10 hover:text-[#0B2114]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-16 px-6 md:px-16 max-w-[1500px] mx-auto min-h-[50vh]">
        {productsLoading ? (
          <div className="text-center text-[#0B2114]/50 py-24 text-sm tracking-widest uppercase flex flex-col items-center gap-4">
            <div className="w-6 h-6 border-2 border-[#0B2114]/20 border-t-[#0B2114] rounded-full animate-spin" />
            Loading catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-[#0B2114]/50 py-24 text-sm tracking-widest uppercase">
            No products found in this category.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-[#0B2114]/10 shadow-sm flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF8F5]">
                    <motion.img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between z-10 bg-white">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest font-bold text-[#D4AF37] mb-2 block">
                        {product.category}
                      </span>
                      <h3 className="font-serif text-xl text-[#0B2114] mb-2">{product.name}</h3>
                      <p className="font-sans text-xs text-[#0B2114]/70 leading-relaxed tracking-wide mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto border-t border-[#0B2114]/10 pt-4">
                      <span className="font-sans font-medium text-[#D4AF37]">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.image })}
                        className="text-[9px] uppercase tracking-widest font-bold bg-[#0B2114]/5 hover:bg-[#0B2114]/10 text-[#0B2114] px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                      >
                        <ShoppingBag className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </div>
  );
}

export default function GroceryShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] pt-32 text-center text-sm uppercase tracking-widest">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
