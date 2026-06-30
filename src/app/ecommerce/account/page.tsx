"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Package, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  items: unknown[];
}

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/ecommerce/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Order[];
        
        // Sort client side since we might need a composite index for orderBy with where
        fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (loading || !user) return <div className="min-h-screen bg-[#FAF8F5] pt-32 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#597467] pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#597467]/10 pb-8">
          <div>
            <h1 className="font-serif text-4xl mb-2">My Account</h1>
            <p className="font-sans text-sm text-[#597467]/60">{user.email}</p>
          </div>
          <button 
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-4 md:mt-0 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-serif text-2xl flex items-center gap-3">
              <Package className="w-6 h-6" /> Order History
            </h2>
            
            {ordersLoading ? (
              <div className="text-sm text-[#597467]/50">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#597467]/5 shadow-sm">
                <p className="text-[#597467]/50 mb-4">You haven&apos;t placed any orders yet.</p>
                <button 
                  onClick={() => router.push("/grocery")}
                  className="bg-[#597467] text-[#FAF8F5] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#597467]/90 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order.id} 
                    className="bg-white p-6 rounded-2xl border border-[#597467]/5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-[#597467]/60">#{order.id.slice(0,8)}</span>
                        <span className="text-[10px] tracking-widest uppercase px-2 py-1 bg-[#597467]/5 rounded-full font-bold text-[#597467]/70">
                          {order.status || 'Processing'}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{order.createdAt.toLocaleDateString()}</p>
                      <p className="text-xs text-[#597467]/60 mt-1">{order.items?.length || 0} items</p>
                    </div>
                    <div className="text-right w-full md:w-auto">
                      <p className="font-serif text-xl mb-2">${order.total?.toFixed(2)}</p>
                      <button className="text-xs uppercase tracking-widest font-bold text-[#E6AFA3] hover:text-[#597467] transition-colors">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h2 className="font-serif text-2xl flex items-center gap-3">
              <Clock className="w-6 h-6" /> Profile
            </h2>
            <div className="bg-white rounded-2xl p-6 border border-[#597467]/5 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#597467]/50 mb-1">Email</label>
                  <p className="font-medium text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#597467]/50 mb-1">Account Status</label>
                  <p className="font-medium text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" /> Active
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
