"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User as UserIcon, ShoppingBag, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartCartDrawer } from "@/modules/retail/shared/components/SmartCartDrawer";
import { LanguageTranslateWidget } from "./LanguageTranslateWidget";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type NavLink = { href?: string; label: string; subLinks?: { href: string; label: string }[] };
const allLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/grocery", label: "AIRO Essentials" },
  {
    label: "AIRO Health",
    subLinks: [
      { href: "/pharmacy", label: "Pharmacy" },
      { href: "/minute-clinic", label: "Minute Clinic" },
      { href: "/health-chair", label: "AIRO Praana" },
      { href: "https://airoemed.com", label: "AIRO E-Med" }
    ]
  },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

const healthLinks: NavLink[] = [
  { href: "/health", label: "Health Home" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/minute-clinic", label: "Minute Clinic" },
  { href: "/health-chair", label: "AIRO Praana" },
  { href: "/membership", label: "Membership" }
];

export function GlobalHeader() {
  const { items: cartItems, setIsCartOpen } = useCart();
  const { user, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
  } else if (pathname === "/grocery" || pathname === "/" || pathname === "/contact" || pathname === "/about" || pathname === "/membership" || pathname.startsWith("/member/")) {
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
        isScrolled ? "text-ink" : (pathname === "/" || pathname === "/health" ? "text-paper" : "text-ink")
      }`}>
        AIRO<span className="opacity-50">.</span>
      </span>
    );
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-30 px-6 md:px-8 flex justify-between items-center transition-all duration-300 ${
        isScrolled 
          ? "bg-paper/95 backdrop-blur-md border-b border-theme/5 py-3 md:py-4 shadow-sm" 
          : "bg-transparent border-transparent py-5 md:py-6"
      }`}>
        <div className="flex-1 flex justify-start">
          <Link href={isHealthDomain ? "/health" : "/"} className="hover:opacity-80 transition-opacity duration-300 flex items-center w-fit">
            {logoNode}
          </Link>
        </div>
        
        {/* Desktop nav capsule (floating glassmorphism bar) */}
        <div className="hidden md:flex items-center gap-1 bg-[#1C1C1E]/50 border border-paper/20 px-1.5 py-1.5 rounded-full backdrop-blur-xl shadow-2xl">
          {navLinks.map((link) => {
            if (link.subLinks) {
              const isSubActive = link.subLinks.some(sub => pathname === sub.href);
              return (
                <div 
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`relative flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase font-bold px-5 py-2.5 rounded-full transition-colors duration-300 ${
                      isSubActive || activeDropdown === link.label ? "text-ink" : "text-paper/90 hover:text-white"
                    }`}
                  >
                    {(isSubActive || activeDropdown === link.label) && (
                      <motion.span
                        layoutId="activeHeaderPill"
                        className="absolute inset-0 bg-paper rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    <ChevronDown className="w-3 h-3 relative z-10" />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
                      >
                        <div className="bg-paper border border-theme/10 rounded-2xl p-2 shadow-2xl min-w-[200px] flex flex-col gap-1">
                          {link.subLinks.map(sub => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              {...(sub.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className={`px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors duration-300 ${
                                pathname === sub.href ? "bg-white text-ink" : "text-ink hover:bg-white/5"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href!}
                className={`relative text-[10px] tracking-[0.15em] uppercase font-bold px-5 py-2.5 rounded-full transition-colors duration-300 ${
                  isActive ? "text-ink" : "text-paper/90 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHeaderPill"
                    className="absolute inset-0 bg-paper rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
          <div className="hidden lg:block">
            <LanguageTranslateWidget />
          </div>
          
          
          <Link 
            href={(user || profile) ? "/ecommerce/account" : "/ecommerce/login"}
            className={`relative hover:opacity-70 transition-opacity duration-300 ${
              isScrolled ? "text-ink" : (["/", "/health", "/health-chair"].includes(pathname) ? "text-paper" : "text-ink")
            }`}
          >
            <UserIcon className="w-5 h-5" />
          </Link>

          <button 
            onClick={() => setIsCartOpen(true)} 
            className={`relative hover:opacity-70 transition-opacity duration-300 ${
              isScrolled ? "text-ink" : (["/", "/health", "/health-chair"].includes(pathname) ? "text-paper" : "text-ink")
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-white text-ink text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
          
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`md:hidden p-1 hover:opacity-75 transition-opacity duration-300 ${
              isScrolled ? "text-ink" : (["/", "/health", "/health-chair"].includes(pathname) ? "text-paper" : "text-ink")
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
              className="fixed inset-0 bg-theme/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-paper shadow-2xl z-50 flex flex-col border-l border-theme/10"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-theme/10">
                <span className="font-serif text-xl tracking-widest uppercase text-ink">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors duration-300"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col py-4">
                {navLinks.map((link, idx) => (
                  <div key={link.label || link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                    >
                      {link.subLinks ? (
                        <div className="px-6 py-4">
                          <span className="block text-sm tracking-widest uppercase font-bold text-ink/40 mb-3">
                            {link.label}
                          </span>
                          <div className="flex flex-col gap-2 pl-4 border-l-2 border-theme/10">
                            {link.subLinks.map(sub => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                {...(sub.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                className={`block py-2 text-sm tracking-widest uppercase font-medium transition-colors duration-300 ${
                                  pathname === sub.href ? "text-blue-600 font-bold" : "text-ink hover:text-blue-600"
                                }`}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={link.href!}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-6 py-4 text-sm tracking-widest uppercase font-medium text-ink hover:bg-white/5 transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SmartCartDrawer />
    </>
  );
}
