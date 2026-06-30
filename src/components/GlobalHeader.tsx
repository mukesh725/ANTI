"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Sparkles, Menu, X, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartCartDrawer } from "@/modules/retail/shared/components/SmartCartDrawer";
import { LanguageTranslateWidget } from "./LanguageTranslateWidget";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const allLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/grocery", label: "Essentials" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/minute-clinic", label: "MinuteClinic" },
  { href: "/health-chair", label: "AIRO Praana" },
  { href: "/contact", label: "Contact" },
];

const healthLinks = [
  { href: "/health", label: "Health Home" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/minute-clinic", label: "Minute Clinic" },
  { href: "/health-chair", label: "AIRO Praana" },
  { href: "/membership", label: "Membership" },
];

export function GlobalHeader() {
  const { items: cartItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Use state to detect domain to prevent hydration mismatch
  const [isHealthDomain, setIsHealthDomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const port = window.location.port;
      
      if (host.includes("airohealth") || host.includes("health.airo") || port === "3001") {
        setIsHealthDomain(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isHealthDomain ? healthLinks : allLinks;

  let logoNode;
  if (isHealthDomain || pathname === "/pharmacy" || pathname === "/minute-clinic" || pathname === "/health-chair") {
    logoNode = (
      <div className={`p-1 rounded-xl transition-colors duration-300 ${!isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""}`}>
        <img 
          src="/airo-health-logo.png" 
          alt="AIRO Health" 
          className="h-8 md:h-10 object-contain"
        />
      </div>
    );
  } else if (pathname === "/grocery" || pathname === "/" || pathname === "/contact" || pathname === "/about") {
    logoNode = (
      <div className={`px-2 py-1 rounded-xl transition-colors duration-300 ${!isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""}`}>
        <img 
          src="/airo-essentials-logo.png" 
          alt="AIRO Essentials" 
          className="h-8 md:h-10 object-contain"
        />
      </div>
    );
  } else {
    logoNode = (
      <span className={`font-serif text-2xl tracking-widest uppercase transition-colors duration-300 ${
        isScrolled ? "text-[#597467]" : (pathname === "/" || pathname === "/health" ? "text-[#FAF8F5]" : "text-[#597467]")
      }`}>
        AIRO<span className="opacity-50">.</span>
      </span>
    );
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-30 px-6 md:px-8 flex justify-between items-center transition-all duration-300 ${
        isScrolled 
          ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#597467]/5 py-3 md:py-4 shadow-sm" 
          : "bg-transparent border-transparent py-5 md:py-6"
      }`}>
        <Link href={isHealthDomain ? "/health" : "/"} className="hover:opacity-80 transition-opacity duration-300 flex items-center">
          {logoNode}
        </Link>
        
        {/* Desktop nav capsule (floating glassmorphism bar) */}
        <div className="hidden md:flex items-center gap-1 bg-[#597467]/50 border border-[#FAF8F5]/20 px-1.5 py-1.5 rounded-full backdrop-blur-xl shadow-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[10px] tracking-[0.15em] uppercase font-bold px-5 py-2.5 rounded-full transition-colors duration-300 ${
                  isActive ? "text-[#597467]" : "text-[#FAF8F5]/90 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHeaderPill"
                    className="absolute inset-0 bg-[#FAF8F5] rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden lg:block">
            <LanguageTranslateWidget />
          </div>
          <button className={`hidden sm:flex text-[10px] tracking-widest uppercase font-bold items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 border ${
            isScrolled
              ? "text-[#FAF8F5] bg-[#597467] border-[#597467] hover:bg-[#597467]/90"
              : (["/", "/health", "/health-chair"].includes(pathname)
                  ? "text-[#FAF8F5] bg-white/10 border-white/20 hover:bg-white/20"
                  : "text-[#597467] bg-[#597467]/5 border-[#597467]/20 hover:bg-[#597467]/10")
          }`}>
            <Sparkles className="w-3 h-3" /> The Collective
          </button>
          
          
          <Link 
            href={user ? "/ecommerce/account" : "/ecommerce/login"}
            className={`relative hover:opacity-70 transition-opacity duration-300 ${
              isScrolled ? "text-[#597467]" : (["/", "/health", "/health-chair"].includes(pathname) ? "text-[#FAF8F5]" : "text-[#597467]")
            }`}
          >
            <UserIcon className="w-5 h-5" />
          </Link>

          <button 
            onClick={() => setIsCartOpen(true)} 
            className={`relative hover:opacity-70 transition-opacity duration-300 ${
              isScrolled ? "text-[#597467]" : (["/", "/health", "/health-chair"].includes(pathname) ? "text-[#FAF8F5]" : "text-[#597467]")
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#597467] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
          
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`md:hidden p-1 hover:opacity-75 transition-opacity duration-300 ${
              isScrolled ? "text-[#597467]" : (["/", "/health", "/health-chair"].includes(pathname) ? "text-[#FAF8F5]" : "text-[#597467]")
            }`}
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
              className="fixed inset-0 bg-[#597467]/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-[#FAF8F5] shadow-2xl z-50 flex flex-col border-l border-[#597467]/10"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#597467]/10">
                <span className="font-serif text-xl tracking-widest uppercase text-[#597467]">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-[#597467]/5 rounded-full transition-colors duration-300"
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
                        className="block px-6 py-4 text-sm tracking-widest uppercase font-medium text-[#597467] hover:bg-[#597467]/5 transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-auto p-6 border-t border-[#597467]/10">
                <button className="w-full flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-medium text-[#597467] bg-[#597467]/5 px-4 py-3 rounded-full hover:bg-[#597467]/10 transition-colors duration-300">
                  <Sparkles className="w-3 h-3" /> The Collective
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SmartCartDrawer />
    </>
  );
}
