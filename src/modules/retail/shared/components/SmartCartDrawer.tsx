"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Stethoscope } from "lucide-react";

interface SmartCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
}

export function SmartCartDrawer({ isOpen, onClose, cartItems }: SmartCartDrawerProps) {
  // Simple suggestion logic based on cart items
  const hasTurmeric = cartItems.some((item) => item.name.toLowerCase().includes("turmeric"));
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out
            className="fixed top-0 right-0 h-full w-full max-w-md bg-alabaster shadow-2xl z-50 flex flex-col border-l border-charcoal/10"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-charcoal/10">
              <h2 className="font-serif text-2xl">Your Selection</h2>
              <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-full silent-luxury-transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-8">
              {cartItems.length === 0 ? (
                <p className="text-charcoal/50 text-center mt-12 font-sans tracking-wide">
                  Your cart is exquisitely empty.
                </p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-charcoal/5 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-serif text-lg">{item.name}</h4>
                      <p className="text-xs tracking-widest text-charcoal/50 uppercase mt-1">1 x ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-sans">${item.price.toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Smart Concierge Suggestions */}
            {hasTurmeric && (
              <div className="bg-charcoal/5 m-8 p-6 rounded-sm border border-charcoal/10">
                <div className="flex items-center gap-3 mb-3">
                  <Stethoscope className="w-4 h-4 text-charcoal/70" />
                  <span className="text-[10px] tracking-widest uppercase font-medium">Concierge Insight</span>
                </div>
                <p className="text-sm font-sans text-charcoal/80 mb-4 leading-relaxed">
                  We noticed you selected Artisanal Lakadong Turmeric. Would you like to schedule a quick MinuteClinic consultation to optimize an anti-inflammatory protocol?
                </p>
                <button className="text-xs uppercase tracking-widest font-medium border-b border-charcoal pb-1 hover:text-charcoal/70 silent-luxury-transition">
                  Book MinuteClinic
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="p-8 bg-charcoal text-alabaster mt-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="font-sans text-sm tracking-widest uppercase text-alabaster/70">Subtotal</span>
                <span className="font-serif text-2xl">${subtotal.toFixed(2)}</span>
              </div>
              <button className="w-full py-4 bg-alabaster text-charcoal tracking-widest uppercase text-sm font-medium flex justify-center items-center gap-2 hover:bg-alabaster/90 silent-luxury-transition">
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
