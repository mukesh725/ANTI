"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Stethoscope, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export function SmartCartDrawer() {
  const { items: cartItems, isCartOpen: isOpen, setIsCartOpen, removeItem, addItem, updateQuantity } = useCart();

  const onClose = () => setIsCartOpen(false);
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
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-charcoal/5 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-serif text-lg">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2 bg-charcoal/5 rounded-full px-2 py-0.5">
                          <button onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            } else {
                              removeItem(item.id);
                            }
                          }} className="p-1 hover:text-charcoal/50"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => addItem(item)} className="p-1 hover:text-charcoal/50"><Plus className="w-3 h-3" /></button>
                        </div>
                        <p className="text-xs tracking-widest text-charcoal/50 uppercase">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                <span className="font-serif text-2xl">₹{subtotal.toFixed(2)}</span>
              </div>
              <Link href="/ecommerce/checkout" onClick={onClose} className="w-full py-4 bg-alabaster text-charcoal tracking-widest uppercase text-sm font-medium flex justify-center items-center gap-2 hover:bg-alabaster/90 silent-luxury-transition">
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
