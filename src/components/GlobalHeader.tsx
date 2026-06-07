"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartCartDrawer, CartItem } from "@/modules/retail/shared/components/SmartCartDrawer";

const navLinks = [
  { href: "/grocery", label: "Essentials" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/minute-clinic", label: "MinuteClinic" },
];

export function GlobalHeader() {
  const [cartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  let logoNode;
  if (pathname === "/grocery") {
    logoNode = (
      <img 
        src="/airo-essentials-logo.png" 
        alt="AIRO Essentials" 
        className="h-8 md:h-10 object-contain"
      />
    );
  } else if (pathname === "/pharmacy" || pathname === "/minute-clinic") {
    logoNode = (
      <img 
        src="/airo-health-logo.png" 
        alt="AIRO Health" 
        className="h-8 md:h-9 object-contain"
      />
    );
  } else {
    logoNode = (
      <span className="font-serif text-2xl tracking-widest uppercase text-charcoal">
        AIRO<span className="opacity-50">.</span>
      </span>
    );
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-30 px-6 md:px-8 py-5 md:py-6 flex justify-between items-center bg-alabaster/80 backdrop-blur-md border-b border-charcoal/5">
        <Link href="/" className="hover:opacity-80 silent-luxury-transition">
          {logoNode}
        </Link>
        
        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <div key={link.href} className="flex items-center gap-6">
              <Link href={link.href} className="text-[10px] tracking-widest uppercase font-medium hover:text-charcoal/60 silent-luxury-transition text-charcoal">
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="hidden sm:flex text-[10px] tracking-widest uppercase font-medium items-center gap-2 hover:bg-charcoal/10 silent-luxury-transition text-charcoal bg-charcoal/5 px-4 py-2 rounded-full">
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
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1 hover:opacity-70 silent-luxury-transition text-charcoal"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-alabaster shadow-2xl z-50 flex flex-col border-l border-charcoal/10"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-charcoal/10">
                <span className="font-serif text-xl tracking-widest uppercase text-charcoal">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-charcoal/5 rounded-full silent-luxury-transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col py-4">
                {navLinks.map((link, idx) => (
                  <div key={link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-6 py-4 text-sm tracking-widest uppercase font-medium text-charcoal hover:bg-charcoal/5 silent-luxury-transition"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-auto p-6 border-t border-charcoal/10">
                <button className="w-full flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-medium text-charcoal bg-charcoal/5 px-4 py-3 rounded-full hover:bg-charcoal/10 silent-luxury-transition">
                  <Sparkles className="w-3 h-3" /> The Collective
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SmartCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
      />
    </>
  );
}
