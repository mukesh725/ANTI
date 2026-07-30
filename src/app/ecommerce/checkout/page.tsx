"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Shield, Package, Sparkles, CheckCircle2, Search, ArrowRight, Tag } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { MemberRecord } from "@/types/membership";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Membership State
  const [memberRecord, setMemberRecord] = useState<MemberRecord | null>(null);
  const [memberIdInput, setMemberIdInput] = useState("");
  const [memberLookupLoading, setMemberLookupLoading] = useState(false);
  const [memberLookupError, setMemberLookupError] = useState("");
  const [autoApplied, setAutoApplied] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });

  // Pre-fill form from user profile
  useEffect(() => {
    if (profile || user) {
      setFormData(prev => ({
        ...prev,
        firstName: profile?.firstName || profile?.name?.split(' ')[0] || prev.firstName,
        lastName: profile?.lastName || profile?.name?.split(' ').slice(1).join(' ') || prev.lastName,
        phone: profile?.mobile || prev.phone,
      }));
    }
  }, [profile, user]);

  // Auto-detect active membership for logged-in user
  const activeEmail = profile?.email || user?.email;
  useEffect(() => {
    async function autoDetectMembership() {
      if (!activeEmail) return;
      try {
        const qMem = query(
          collection(db, "Members"),
          where("email", "==", activeEmail.toLowerCase()),
          where("membershipStatus", "==", "Active")
        );
        const memSnapshot = await getDocs(qMem);
        if (!memSnapshot.empty) {
          const docSnap = memSnapshot.docs[0];
          const record = { id: docSnap.id, ...(docSnap.data() as Omit<MemberRecord, 'id'>) };
          setMemberRecord(record);
          setAutoApplied(true);
        }
      } catch (err) {
        console.error("Auto membership detection failed:", err);
      }
    }
    autoDetectMembership();
  }, [activeEmail]);

  // Manual Member ID or Mobile/Email Lookup
  const handleApplyMemberId = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!memberIdInput.trim()) {
      setMemberLookupError("Please enter your Member ID, Mobile Number, or Email.");
      return;
    }

    setMemberLookupLoading(true);
    setMemberLookupError("");

    try {
      const q = memberIdInput.trim().toLowerCase();
      const membersRef = collection(db, "Members");
      
      const snap = await getDocs(membersRef);
      let matchedDoc: MemberRecord | null = null;

      for (const d of snap.docs) {
        const data = d.data() as Omit<MemberRecord, 'id'>;
        if (
          data.membershipStatus === 'Active' &&
          (data.memberId?.toLowerCase() === q ||
           data.email?.toLowerCase() === q ||
           data.mobile === q ||
           data.registrationId?.toLowerCase() === q)
        ) {
          matchedDoc = { id: d.id, ...data };
          break;
        }
      }

      if (matchedDoc) {
        setMemberRecord(matchedDoc);
        setAutoApplied(false);
        setMemberLookupError("");
      } else {
        setMemberLookupError("No active membership found for the provided details.");
      }
    } catch (err) {
      console.error("Member lookup error:", err);
      setMemberLookupError("Failed to apply member ID. Please try again.");
    } finally {
      setMemberLookupLoading(false);
    }
  };

  // Calculation of Membership Discounts
  const rawSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Discount percentages by plan
  let pharmacyDiscountPct = 0;
  let groceryDiscountPct = 0;
  let brandedDiscountPct = 0;
  let isSignaturePlan = false;

  if (memberRecord && memberRecord.membershipStatus === 'Active') {
    const plan = memberRecord.membershipPlan;
    if (plan === 'AIRO ONE Select') {
      pharmacyDiscountPct = 0.15; // 15% off pharmacy
      groceryDiscountPct = 0.02;  // 2% off grocery
      brandedDiscountPct = 0.04;  // 4% off branded
    } else if (plan === 'AIRO ONE Preferred') {
      pharmacyDiscountPct = 0.18; // 18% off pharmacy
      groceryDiscountPct = 0.04;  // 4% off grocery
      brandedDiscountPct = 0.06;  // 6% off branded
    } else if (plan === 'AIRO ONE Signature') {
      pharmacyDiscountPct = 0.22; // 22% off pharmacy
      groceryDiscountPct = 0.06;  // 6% off grocery
      brandedDiscountPct = 0.08;  // 8% off branded
      isSignaturePlan = true;     // Free shipping on all orders
    }
  }

  // Calculate itemized discount
  let totalDiscount = 0;
  items.forEach(item => {
    const category = (item as any).category?.toLowerCase() || '';
    const name = item.name.toLowerCase();
    const itemTotal = item.price * item.quantity;

    if (category.includes('pharmacy') || category.includes('medicine') || name.includes('tablet') || name.includes('syrup')) {
      totalDiscount += itemTotal * pharmacyDiscountPct;
    } else if (name.includes('airo')) {
      totalDiscount += itemTotal * brandedDiscountPct;
    } else {
      totalDiscount += itemTotal * (groceryDiscountPct || (memberRecord ? 0.05 : 0)); // fallback base discount if active member
    }
  });

  const discountedSubtotal = Math.max(0, rawSubtotal - totalDiscount);

  // Shipping Calculation: Free for Signature or orders above ₹1,500 (or ₹50 standard)
  let shipping = 0;
  if (!isSignaturePlan && discountedSubtotal < 1500) {
    shipping = rawSubtotal > 0 ? 50 : 0;
  }

  const finalTotal = discountedSubtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      const orderData = {
        userId: profile?.uid || user?.uid || "guest",
        customerEmail: activeEmail || "guest@example.com",
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        shippingDetails: formData,
        items,
        rawSubtotal,
        discountAmount: totalDiscount,
        discountedSubtotal,
        shipping,
        total: finalTotal,
        membershipPlanApplied: memberRecord ? memberRecord.membershipPlan : null,
        memberIdApplied: memberRecord ? memberRecord.memberId : null,
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
      <div className="min-h-screen bg-[#FFFFFF] text-[#1C1C1E] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 sm:p-12 rounded-3xl shadow-2xl max-w-lg border border-[#1C1C1E]/5"
        >
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="font-sans text-xs text-[#1C1C1E]/70 mb-6 leading-relaxed">
            Thank you for shopping with AIRO. Your order has been received and is being prepared. You have selected Cash on Delivery.
          </p>

          {memberRecord && totalDiscount > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              You saved ₹{totalDiscount.toFixed(2)} with your {memberRecord.membershipPlan}!
            </div>
          )}

          <button 
            onClick={() => router.push(user || profile ? "/ecommerce/account" : "/")}
            className="bg-[#1C1C1E] text-[#FFFFFF] px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#1C1C1E]/90 transition-colors w-full"
          >
            {user || profile ? "View My Orders" : "Return to Home"}
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center pt-32">
        <Package className="w-16 h-16 text-[#1C1C1E]/20 mb-6" />
        <h1 className="font-serif text-3xl mb-4">Your cart is empty</h1>
        <button 
          onClick={() => router.push("/grocery")}
          className="bg-[#1C1C1E] text-[#FFFFFF] px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#1C1C1E]/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1C1C1E] pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-serif text-4xl mb-8 border-b border-[#1C1C1E]/10 pb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Shipping Form & Payment */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="font-serif text-2xl mb-6">Shipping Details</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#1C1C1E]/10 rounded-lg text-sm focus:outline-none focus:border-[#1C1C1E]" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#1C1C1E]/10 rounded-lg text-sm focus:outline-none focus:border-[#1C1C1E]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Address</label>
                  <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#1C1C1E]/10 rounded-lg text-sm focus:outline-none focus:border-[#1C1C1E]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">City</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#1C1C1E]/10 rounded-lg text-sm focus:outline-none focus:border-[#1C1C1E]" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">State</label>
                    <input required name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#1C1C1E]/10 rounded-lg text-sm focus:outline-none focus:border-[#1C1C1E]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Zip Code</label>
                    <input required name="zip" value={formData.zip} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#1C1C1E]/10 rounded-lg text-sm focus:outline-none focus:border-[#1C1C1E]" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Phone</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-[#1C1C1E]/10 rounded-lg text-sm focus:outline-none focus:border-[#1C1C1E]" />
                  </div>
                </div>

                <div className="pt-8 border-t border-[#1C1C1E]/10 mt-8">
                  <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">Payment Method <Shield className="w-5 h-5 text-green-600" /></h2>
                  <div className="bg-white p-6 border-2 border-[#1C1C1E] rounded-xl flex items-center gap-4 shadow-sm">
                    <input type="radio" checked readOnly className="w-4 h-4 text-[#1C1C1E]" />
                    <div>
                      <h3 className="font-bold text-sm">Cash on Delivery</h3>
                      <p className="text-xs text-[#1C1C1E]/60">Pay with cash when your order is delivered to your doorstep.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary & AIRO ONE Discount Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#1C1C1E]/10 shadow-xl sticky top-28 space-y-6">
              <h2 className="font-serif text-2xl">Order Summary</h2>

              {/* AIRO ONE MEMBERSHIP DISCOUNT AUTO-SECTION */}
              {memberRecord ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white shadow-lg relative overflow-hidden border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#D4AF37]">
                      <Sparkles className="w-4 h-4" /> AIRO ONE™ Active Benefits
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {autoApplied ? 'Auto Applied' : 'Applied'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{memberRecord.membershipPlan}</p>
                  <p className="text-xs text-gray-300 font-mono mt-0.5">ID: {memberRecord.memberId || memberRecord.registrationId}</p>
                  
                  {totalDiscount > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-medium">Applied Membership Savings</span>
                      <span className="font-bold text-emerald-400 text-sm">-₹{totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                  <span className="font-bold text-gray-900 block mb-1 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#006537]" /> Have an AIRO ONE ID?
                  </span>
                  <form onSubmit={handleApplyMemberId} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Enter ONE ID, Mobile or Email"
                      value={memberIdInput}
                      onChange={(e) => setMemberIdInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#006537]"
                    />
                    <button
                      type="submit"
                      disabled={memberLookupLoading}
                      className="px-4 py-2 bg-[#006537] hover:bg-[#004e2a] text-white font-bold rounded-lg text-xs transition-all disabled:opacity-50"
                    >
                      {memberLookupLoading ? "Applying..." : "Apply"}
                    </button>
                  </form>
                  {memberLookupError && (
                    <p className="text-red-600 mt-2 font-medium text-[11px]">{memberLookupError}</p>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="space-y-4 max-h-56 overflow-y-auto pr-2 divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm pt-3 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFFFFF] rounded-md overflow-hidden relative flex-shrink-0 border border-gray-100">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#1C1C1E]/50">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-3 border-t border-[#1C1C1E]/10 pt-4 text-sm">
                <div className="flex justify-between text-[#1C1C1E]/70">
                  <span>Bag Subtotal</span>
                  <span>₹{rawSubtotal.toFixed(2)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AIRO ONE Discount
                    </span>
                    <span>-₹{totalDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#1C1C1E]/70">
                  <span>Shipping &amp; Delivery</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">Free Shipping</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-[#1C1C1E]/10 pt-4 mt-2">
                  <span className="font-serif text-xl font-bold">Total Payable</span>
                  <span className="font-serif text-xl font-extrabold text-[#006537]">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#1C1C1E] text-[#FFFFFF] py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#1C1C1E]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Place Order (Cash on Delivery) <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
