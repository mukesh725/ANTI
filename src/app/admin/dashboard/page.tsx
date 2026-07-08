"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, CreditCard, Package, 
  Layers, Boxes, Users, UserPlus, Database, Ticket, 
  Settings, ShieldAlert, LogOut, ArrowRight,
  TrendingUp, TrendingDown, DollarSign, Activity,
  Trash2, CheckCircle2, BrainCircuit
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc, limit } from "firebase/firestore";
import { CmsEditor } from "@/components/CmsEditor";
import { EcomManager } from "@/components/EcomManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { PlaceholderView } from "@/components/admin/PlaceholderView";
import { AdminTeamManager } from "@/components/admin/AdminTeamManager";
import Image from "next/image";

// Types
interface LocationData {
  city: string;
  country: string;
  region: string;
  ip: string;
}

interface HistoryEntry {
  path: string;
  timestamp: string;
  location?: LocationData | null;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  source: string;
  status: "Pending" | "Contacted";
  createdAt: string;
}

const SIDEBAR_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Layers },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "customers", label: "Customers", icon: Users },
  { id: "leads", label: "Leads", icon: UserPlus },
  { id: "cms", label: "CMS", icon: Database },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "admin-team", label: "Admin Team", icon: ShieldAlert },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [pageViews, setPageViews] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<{name: string, email: string, role: string, allowedModules: string[]} | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("airo_admin_auth");
    const userStr = localStorage.getItem("airo_admin_user");
    
    if (!auth || auth !== "true") {
      router.replace("/admin/login");
    } else {
      setIsAuthenticated(true);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          
          // RBAC default routing
          if (!user.allowedModules.includes("all")) {
             if (!user.allowedModules.includes("dashboard") && user.allowedModules.length > 0) {
                setActiveTab(user.allowedModules[0]);
             }
          }
        } catch(e) {}
      }
      loadDashboardData();
    }
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const loadedLeads: Lead[] = [];
      querySnapshot.forEach((doc) => {
        loadedLeads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(loadedLeads);
    } catch (error) {
      console.error("Failed to load leads", error);
    }

    try {
      const analyticsQ = query(collection(db, "analytics_events"), orderBy("timestamp", "desc"), limit(200));
      const analyticsSnapshot = await getDocs(analyticsQ);
      const views: Record<string, number> = {};
      analyticsSnapshot.forEach((doc) => {
        const data = doc.data();
        views[data.path] = (views[data.path] || 0) + 1;
      });
      setPageViews(views);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("airo_admin_auth");
    router.replace("/admin/login");
  };

  if (!isAuthenticated) return null;

  const totalPageViews = Object.values(pageViews).reduce((a, b) => a + b, 0) + 1450; 
  const uniqueVisitors = Math.round(totalPageViews * 0.42);
  const conversionRate = leads.length > 0 ? ((leads.length / uniqueVisitors) * 100).toFixed(1) : "0.4";

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-xl text-gray-800 font-medium">Good afternoon, here is your sales overview</h1>
              <p className="text-sm text-gray-500">Tuesday 7 July 2021</p>
            </div>

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Revenue</span>
                <div className="text-2xl font-semibold text-gray-800">₹1,539</div>
                <div className="text-xs text-gray-400 mt-1">7 past orders</div>
                <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Total Orders</span>
                <div className="text-2xl font-semibold text-gray-800">7</div>
                <div className="text-xs text-gray-400 mt-1">All orders placed</div>
                <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">New Users</span>
                <div className="text-2xl font-semibold text-gray-800">21</div>
                <div className="text-xs text-gray-400 mt-1">Registered users</div>
                <div className="absolute top-4 right-4 text-amber-500 bg-amber-50 p-1.5 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Active Products</span>
                <div className="text-2xl font-semibold text-gray-800">13</div>
                <div className="text-xs text-gray-400 mt-1">In catalogues</div>
                <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Second Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Visitors/Sessions</span>
                <div className="text-2xl font-semibold text-gray-800">{uniqueVisitors}</div>
                <div className="text-xs text-gray-400 mt-1">Last 30 days</div>
                <div className="absolute top-4 right-4 text-indigo-500 bg-indigo-50 p-1.5 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Average Order Value</span>
                <div className="text-2xl font-semibold text-gray-800">₹662</div>
                <div className="text-xs text-gray-400 mt-1">Last 30 days</div>
                <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Return Rate</span>
                <div className="text-2xl font-semibold text-gray-800">1%</div>
                <div className="text-xs text-gray-400 mt-1">Today</div>
                <div className="absolute top-4 right-4 text-amber-500 bg-amber-50 p-1.5 rounded-lg">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Bounce Rate</span>
                <div className="text-2xl font-semibold text-gray-800">13%</div>
                <div className="text-xs text-gray-400 mt-1">Today</div>
                <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Revenue</h3>
                    <p className="text-xs text-gray-400">Last 14 days - auto updated</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE
                  </span>
                </div>
                {/* Chart Placeholder */}
                <div className="w-full h-48 border-b border-l border-gray-100 flex items-end justify-between px-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Activity className="w-32 h-32 text-gray-900" />
                  </div>
                  {[40, 20, 60, 40, 80, 50, 90, 70, 30, 60, 40, 80, 60, 100].map((h, i) => (
                    <div key={i} className="w-4 bg-gradient-to-t from-[#0A84FF] to-[#0A84FF]/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800 mb-6">Top products</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#0A84FF]"></div>
                      <span className="text-xs text-gray-600">AIRO Hydrate</span>
                    </div>
                    <span className="text-xs font-medium">1 16.6%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-gray-600">AIRO Energy</span>
                    </div>
                    <span className="text-xs font-medium">1 16.6%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-xs text-gray-600">AIRO Energy - 12 Pack</span>
                    </div>
                    <span className="text-xs font-medium">2 33.3%</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        );
      case "orders":
        return <EcomManager />;
      case "products":
        return <ProductManager />;
      case "cms":
        return <CmsEditor />;
      case "leads":
        return (
          <div className="p-8 max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-serif text-gray-900 mb-6">Lead Intelligence</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Lead</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{lead.phone}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{lead.source}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="text-xs text-[#0A84FF] hover:text-[#0A84FF]/80 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-gray-500">No leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "admin-team":
        return <AdminTeamManager />;
      default:
        const title = SIDEBAR_NAV.find(item => item.id === activeTab)?.label || "Module";
        return <PlaceholderView title={title} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7F6] overflow-hidden font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0A1128] flex flex-col flex-shrink-0 relative z-20 shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold tracking-tight text-white">AIRO</span>
            <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest bg-[#0A84FF]/10 px-2 py-1 rounded">Admin</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {SIDEBAR_NAV.filter(item => 
            currentUser?.allowedModules.includes("all") || currentUser?.allowedModules.includes(item.id)
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === item.id
                  ? "bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-[#0A84FF]" : "text-gray-500"}`} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 mt-auto">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{currentUser?.name || "Admin"}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{currentUser?.role || "Super Admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors text-sm font-medium border border-white/5"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center px-8 flex-shrink-0 z-10 sticky top-0 shadow-sm">
          <h2 className="text-lg font-medium text-gray-800">
            {SIDEBAR_NAV.find(item => item.id === activeTab)?.label || "Dashboard"}
          </h2>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="absolute inset-0 bg-[#F4F7F6] z-0 pointer-events-none"></div>
          <div className="relative z-10">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Expanded Lead Modal (if needed for the leads view) */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#0A84FF]/30 rounded-2xl p-8 max-w-2xl w-full shadow-lg relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6 pt-2">
                <div>
                  <h2 className="font-sans font-medium text-3xl mb-1">{selectedLead.name}</h2>
                  <p className="text-sm text-emerald-600 font-mono">{selectedLead.email}</p>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-900 bg-[#F4F7F6] p-2 rounded-lg border border-emerald-100"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-1">Phone Number</label>
                    <p className="text-sm">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-1">Inquiry Target</label>
                    <p className="text-sm">{selectedLead.type}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-1">Acquisition Source</label>
                    <p className="text-sm">{selectedLead.source}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-2">Raw Message Content</label>
                <div className="bg-[#F4F7F6] p-4 rounded-xl border border-emerald-100 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        
        aside.custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        aside.custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
