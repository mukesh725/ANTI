"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Shield, Package } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      const orderData = {
        userId: user ? user.uid : "guest",
        customerEmail: user ? user.email : "guest@example.com",
        shippingDetails: formData,
        items,
        subtotal,
        shipping,
        total,
        status: "Processing",
        paymentMethod: "Cash on Delivery",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "orders"), orderData);
      
      clearCart();
      setSuccess(true);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl max-w-lg border border-[#0B2114]/5"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-serif text-4xl mb-4">Order Confirmed</h1>
          <p className="font-sans text-[#0B2114]/70 mb-8 leading-relaxed">
            Thank you for choosing AIRO. Your order will be shipped soon. You have chosen Cash on Delivery.
          </p>
          <button 
            onClick={() => router.push(user ? "/ecommerce/account" : "/")}
            className="bg-[#0B2114] text-[#FAF8F5] px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#0B2114]/90 transition-colors"
          >
            {user ? "View My Orders" : "Return to Home"}
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center pt-32">
        <Package className="w-16 h-16 text-[#0B2114]/20 mb-6" />
        <h1 className="font-serif text-3xl mb-4">Your cart is empty</h1>
        <button 
          onClick={() => router.push("/grocery")}
          className="bg-[#0B2114] text-[#FAF8F5] px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#0B2114]/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-serif text-4xl mb-12 border-b border-[#0B2114]/10 pb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl mb-6">Shipping Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#0B2114]/10 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#0B2114]/10 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Address</label>
                <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#0B2114]/10 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">City</label>
                  <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#0B2114]/10 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">State</label>
                  <input required name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#0B2114]/10 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Zip Code</label>
                  <input required name="zip" value={formData.zip} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#0B2114]/10 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Phone</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#0B2114]/10 rounded-lg" />
                </div>
              </div>

              <div className="pt-8 border-t border-[#0B2114]/10 mt-8">
                <h2 className="font-serif text-2xl mb-6 flex items-center gap-2">Payment Method <Shield className="w-5 h-5 text-green-600" /></h2>
                <div className="bg-white p-6 border-2 border-[#0B2114] rounded-xl flex items-center gap-4">
                  <input type="radio" checked readOnly className="w-4 h-4 text-[#0B2114]" />
                  <div>
                    <h3 className="font-bold text-sm">Cash on Delivery</h3>
                    <p className="text-xs text-[#0B2114]/60">Pay with cash when your order is delivered.</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl border border-[#0B2114]/5 shadow-xl sticky top-32">
              <h2 className="font-serif text-2xl mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF8F5] rounded-md overflow-hidden relative flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#0B2114]/50">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-[#0B2114]/10 pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#0B2114]/60">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0B2114]/60">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between border-t border-[#0B2114]/10 pt-4 mt-4">
                  <span className="font-serif text-xl">Total</span>
                  <span className="font-serif text-xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-[#0B2114] text-[#FAF8F5] py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#0B2114]/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
