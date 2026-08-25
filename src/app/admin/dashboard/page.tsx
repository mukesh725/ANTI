"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, CreditCard, Package, 
  Layers, Boxes, Users, UserPlus, Database, Ticket, 
  Settings, ShieldAlert, LogOut, ArrowRight,
  TrendingUp, TrendingDown, DollarSign, Activity,
  Trash2, CheckCircle2, BrainCircuit, ShieldCheck, Menu, X, MapPin, Stethoscope, FileText
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc, limit } from "firebase/firestore";
import { CmsEditor } from "@/components/CmsEditor";
import { EcomManager } from "@/components/EcomManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { PlaceholderView } from "@/components/admin/PlaceholderView";
import { AdminTeamManager } from "@/components/admin/AdminTeamManager";
import AdminCustomersManager from "@/components/admin/AdminCustomersManager";
import { AdminBookingsManager } from "@/components/admin/AdminBookingsManager";
import AdminMembershipDashboard from "@/app/admin/membership/page";
import { LocationsManager } from "@/components/admin/LocationsManager";
import { AdminMinuteClinicManager } from "@/components/admin/AdminMinuteClinicManager";
import { AdminBlogManager } from "@/components/admin/AdminBlogManager";
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
  { id: "minute-clinic", label: "Minute Clinic", icon: Stethoscope },
  { id: "bookings", label: "Health Intakes", icon: Ticket }, // Using Ticket/Calendar-like icon
  { id: "membership", label: "Memberships", icon: ShieldCheck },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Layers },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "customers", label: "Customers", icon: Users },
  { id: "leads", label: "Leads", icon: UserPlus },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "blog", label: "Blog", icon: FileText },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{id?: string, name: string, email: string, role: string, allowedModules: string[]} | null>(null);

  const [totalMemberships, setTotalMemberships] = useState(0);
  const [totalHealthCheckups, setTotalHealthCheckups] = useState(0);
  const [healthCheckupLocations, setHealthCheckupLocations] = useState<Record<string, number>>({});

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

    try {
      const qMembers = query(collection(db, "Members"));
      const snapMembers = await getDocs(qMembers);
      setTotalMemberships(snapMembers.size);
      
      const qBookings = query(collection(db, "healthBookings"));
      const snapBookings = await getDocs(qBookings);
      setTotalHealthCheckups(snapBookings.size);
      
      const locations: Record<string, number> = {};
      snapBookings.forEach((doc) => {
        const data = doc.data();
        if (data.location) {
          locations[data.location] = (locations[data.location] || 0) + 1;
        }
      });
      setHealthCheckupLocations(locations);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("airo_admin_auth");
    router.replace("/admin/login");
  };

  if (!isAuthenticated) return null;

  const totalPageViews = Object.values(pageViews).reduce((a, b) => a + b, 0) + 1450; 
  const uniqueVisitors = Math.round(totalPageViews * 0.42);
  const totalCustomers = totalMemberships + totalHealthCheckups;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-xl text-gray-800 font-medium">Good afternoon, here is your AIRO overview</h1>
              <p className="text-sm text-gray-500">Overview of AIRO platform operations</p>
            </div>

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Total Visitors</span>
                <div className="text-2xl font-semibold text-gray-800">{uniqueVisitors}</div>
                <div className="text-xs text-gray-400 mt-1">Unique site sessions (Simulated)</div>
                <div className="absolute top-4 right-4 text-indigo-500 bg-indigo-50 p-1.5 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Total Customers</span>
                <div className="text-2xl font-semibold text-gray-800">{totalCustomers}</div>
                <div className="text-xs text-gray-400 mt-1">Total active users</div>
                <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Memberships</span>
                <div className="text-2xl font-semibold text-gray-800">{totalMemberships}</div>
                <div className="text-xs text-gray-400 mt-1">Registered members</div>
                <div className="absolute top-4 right-4 text-amber-500 bg-amber-50 p-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">Health Checkups</span>
                <div className="text-2xl font-semibold text-gray-800">{totalHealthCheckups}</div>
                <div className="text-xs text-gray-400 mt-1">Free registrations</div>
                <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Health Checkups by Location</h3>
                    <p className="text-xs text-gray-400">Distribution of free scan registrations</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE
                  </span>
                </div>
                
                {Object.keys(healthCheckupLocations).length > 0 ? (
                  <div className="flex flex-col gap-4 mt-8">
                    {Object.entries(healthCheckupLocations)
                      .sort((a, b) => b[1] - a[1])
                      .map(([location, count], idx) => {
                        const colors = ['bg-theme', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500', 'bg-blue-500'];
                        const colorClass = colors[idx % colors.length];
                        const percentage = ((count / totalHealthCheckups) * 100).toFixed(1);
                        return (
                          <div key={location} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 font-medium">{location}</span>
                              <span className="text-xs font-semibold">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    No location data available yet
                  </div>
                )}
              </div>
            </div>
            
          </div>
        );
      case "minute-clinic":
        return <AdminMinuteClinicManager />;
      case "bookings":
        return <AdminBookingsManager />;
      case "membership":
        return <AdminMembershipDashboard />;
      case "orders":
        return <EcomManager />;
      case "products":
        return <ProductManager />;
      case "blog":
        return <AdminBlogManager />;
      case "cms":
        return <CmsEditor />;
      case "customers":
        return <AdminCustomersManager />;
      case "leads":
        return (
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-serif text-gray-900 mb-6">Lead Intelligence</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
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
                          className="text-xs text-theme hover:text-theme/80 font-medium"
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
          </div>
        );
      case "admin-team":
        return <AdminTeamManager />;
      case "locations":
        return <LocationsManager />;
      default:
        const title = SIDEBAR_NAV.find(item => item.id === activeTab)?.label || "Module";
        return <PlaceholderView title={title} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7F6] overflow-hidden font-sans text-gray-800">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[280px] bg-[#0A1128] flex flex-col flex-shrink-0 fixed md:relative h-full z-50 shadow-2xl transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-white">AIRO</span>
            <span className="text-[10px] font-bold text-theme uppercase tracking-widest bg-theme/10 px-2 py-1 rounded">Admin</span>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {SIDEBAR_NAV.filter(item => {
            const modules = currentUser?.allowedModules || [];
            const isSuperAdmin = 
              currentUser?.role?.toLowerCase() === 'super admin' || 
              currentUser?.email === 'admin@airo.dev' || 
              currentUser?.id === 'superadmin' || 
              currentUser?.id === 'super_admin' || 
              currentUser?.name?.toLowerCase() === 'super admin';
            return isSuperAdmin || modules.includes("all") || modules.includes(item.id);
          }).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === item.id
                  ? "bg-theme/10 text-theme border border-theme/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-theme" : "text-gray-500"}`} />
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
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center px-4 md:px-8 flex-shrink-0 z-10 sticky top-0 shadow-sm gap-4">
          <button 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
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
    </div>
  );
}
