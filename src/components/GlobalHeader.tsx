"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";
import { SmartCartDrawer, CartItem } from "@/modules/retail/shared/components/SmartCartDrawer";

export function GlobalHeader() {
  const [cartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-30 px-8 py-6 flex justify-between items-center bg-alabaster/80 backdrop-blur-md border-b border-charcoal/5">
        <Link href="/" className="font-serif text-2xl tracking-widest uppercase text-charcoal hover:opacity-80 silent-luxury-transition">
          AIRO<span className="opacity-50">.</span>
        </Link>
        
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/grocery" className="text-[10px] tracking-widest uppercase font-medium hover:text-charcoal/60 silent-luxury-transition text-charcoal">Grocery</Link>
          <Link href="/bakery" className="text-[10px] tracking-widest uppercase font-medium hover:text-charcoal/60 silent-luxury-transition text-charcoal">Bakery</Link>
          <Link href="/ice-cream" className="text-[10px] tracking-widest uppercase font-medium hover:text-charcoal/60 silent-luxury-transition text-charcoal">Ice Cream</Link>
          <span className="text-charcoal/20">|</span>
          <Link href="/pharmacy" className="text-[10px] tracking-widest uppercase font-medium hover:text-charcoal/60 silent-luxury-transition text-charcoal">Pharmacy</Link>
          <Link href="/minute-clinic" className="text-[10px] tracking-widest uppercase font-medium hover:text-charcoal/60 silent-luxury-transition text-charcoal">MinuteClinic</Link>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-[10px] tracking-widest uppercase font-medium flex items-center gap-2 hover:bg-charcoal/10 silent-luxury-transition text-charcoal bg-charcoal/5 px-4 py-2 rounded-full">
            <Sparkles className="w-3 h-3" /> The Collective
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative hover:opacity-70 silent-luxury-transition text-charcoal">
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-charcoal text-alabaster text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <SmartCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
      />
    </>
  );
}
