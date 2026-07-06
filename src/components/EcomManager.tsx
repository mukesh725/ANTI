"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { Package, CheckCircle2, Clock } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  items: unknown[];
  shippingDetails: Record<string, string>;
  customerEmail: string;
}

export function EcomManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch all orders
      const q = query(collection(db, "orders"));
      const snapshot = await getDocs(q);
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Order[];
      
      fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-800/50">Loading e-commerce data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-sans font-medium text-3xl mb-2 text-gray-800">E-Commerce Operations</h2>
          <p className="text-sm text-gray-800/60">Manage incoming orders and fulfillments.</p>
        </div>
        <button onClick={fetchOrders} className="text-xs uppercase tracking-widest font-bold text-gray-800 bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package className="w-5 h-5" /></div>
            <h3 className="font-sans font-medium text-xl">Total Orders</h3>
          </div>
          <p className="text-4xl font-light">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock className="w-5 h-5" /></div>
            <h3 className="font-sans font-medium text-xl">Processing</h3>
          </div>
          <p className="text-4xl font-light">{orders.filter(o => o.status === "Processing").length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
            <h3 className="font-sans font-medium text-xl">Completed</h3>
          </div>
          <p className="text-4xl font-light">{orders.filter(o => o.status === "Shipped" || o.status === "Delivered").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] uppercase tracking-widest text-gray-800/60">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1E]/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm">{order.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-medium">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</p>
                    <p className="text-xs text-gray-800/50">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">₹{order.total?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status || "Processing"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status || "Processing"}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs bg-white border border-gray-200/10 rounded px-2 py-1 focus:outline-none focus:border-gray-200"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-800/50">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
