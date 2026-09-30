"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, CreditCard, Package, 
  Layers, Boxes, Users, UserPlus, Database, Ticket, 
  Settings, ShieldAlert, LogOut, ArrowRight,
  TrendingUp, TrendingDown, DollarSign, Activity,
  Trash2, CheckCircle2, BrainCircuit, ShieldCheck, Menu, X, MapPin, Stethoscope, FileText, Star,
  Sparkles, ExternalLink, Search, Bell, Clock, Calendar, ChevronRight,
  Phone, Mail, Check, Building2, ArrowUpRight
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc, limit, updateDoc } from "firebase/firestore";
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
import { AdminPraanaManager } from "@/components/admin/AdminPraanaManager";
import { AdminFeedbackManager } from "@/components/admin/AdminFeedbackManager";
import { AdminDoctorsManager } from "@/components/admin/AdminDoctorsManager";
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

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Operations",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "praana", label: "Praana Vitals", icon: Activity },
      { id: "minute-clinic", label: "Minute Clinic", icon: Stethoscope },
      { id: "doctors", label: "Doctors", icon: UserPlus },
      { id: "bookings", label: "Intakes", icon: Ticket },
    ],
  },
  {
    title: "Commerce",
    items: [
      { id: "membership", label: "Memberships", icon: ShieldCheck },
      { id: "orders", label: "Orders", icon: ShoppingBag },
      { id: "products", label: "Products", icon: Package },
      { id: "categories", label: "Categories", icon: Layers },
      { id: "inventory", label: "Inventory", icon: Boxes },
      { id: "payments", label: "Transactions", icon: CreditCard },
    ],
  },
  {
    title: "Marketing & Customers",
    items: [
      { id: "blog", label: "Blog Articles", icon: FileText },
      { id: "customers", label: "Customers", icon: Users },
      { id: "leads", label: "Inquiries", icon: UserPlus },
      { id: "feedback", label: "Reviews", icon: Star },
      { id: "locations", label: "Clinic Locations", icon: MapPin },
    ],
  },
  {
    title: "Settings",
    items: [
      { id: "cms", label: "CMS Pages", icon: Database },
      { id: "coupons", label: "Discounts", icon: Ticket },
      { id: "admin-team", label: "Team Members", icon: ShieldAlert },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items);

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
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [activeLocationFilter, setActiveLocationFilter] = useState<"all" | "Kondapur" | "Kompally">("all");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");

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

      const qBlogs = query(collection(db, "blogs"));
      const snapBlogs = await getDocs(qBlogs);
      setTotalBlogs(snapBlogs.size);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: "Pending" | "Contacted") => {
    try {
      await updateDoc(doc(db, "leads", leadId), { status: newStatus });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Failed to update lead status", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem("airo_admin_auth");
    localStorage.removeItem("airo_admin_token");
    localStorage.removeItem("airo_admin_user");
    document.cookie = 'airo_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.replace("/admin/login");
  };

  if (!isAuthenticated) return null;

  const totalCustomers = totalMemberships + totalHealthCheckups;
  const currentTabObj = ALL_NAV_ITEMS.find(item => item.id === activeTab);
  const activeLabel = currentTabObj?.label || "Dashboard";

  const isModuleAllowed = (moduleId: string) => {
    const modules = currentUser?.allowedModules || [];
    const isSuperAdmin = 
      currentUser?.role?.toLowerCase() === 'super admin' || 
      currentUser?.email === 'admin@airo.dev' || 
      currentUser?.id === 'superadmin' || 
      currentUser?.id === 'super_admin' || 
      currentUser?.name?.toLowerCase() === 'super admin';
    return isSuperAdmin || modules.includes("all") || modules.includes(moduleId);
  };

  const filteredLeads = leads.filter(l => {
    if (!leadSearchQuery) return true;
    const q = leadSearchQuery.toLowerCase();
    return l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.toLowerCase().includes(q) || l.source?.toLowerCase().includes(q);
  });

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-950">Dashboard</h1>
                <p className="text-xs text-gray-500 mt-1">Overview of clinic checkups, memberships, and patient inquiries.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("blog")}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-2xs transition-colors"
                >
                  Manage Blog
                </button>
                <button
                  onClick={() => setActiveTab("doctors")}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-2xs transition-colors"
                >
                  Doctors Hub
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  View Store
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs">
                <div className="text-xs font-medium text-gray-500">Total Patients & Members</div>
                <div className="text-2xl font-bold text-gray-950 mt-1 tabular-nums">{totalCustomers}</div>
                <div className="text-xs text-gray-500 mt-2">{totalMemberships} active members • {totalHealthCheckups} clinic scans</div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs">
                <div className="text-xs font-medium text-gray-500">Praana Health Scans</div>
                <div className="text-2xl font-bold text-gray-950 mt-1 tabular-nums">{totalHealthCheckups}</div>
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                  <span>Kondapur & Kompally</span>
                  <button onClick={() => setActiveTab("praana")} className="text-emerald-700 font-semibold hover:underline">
                    View scans →
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs">
                <div className="text-xs font-medium text-gray-500">Published Blog Articles</div>
                <div className="text-2xl font-bold text-gray-950 mt-1 tabular-nums">{totalBlogs || 10}</div>
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                  <span>SEO Schema Active</span>
                  <button onClick={() => setActiveTab("blog")} className="text-emerald-700 font-semibold hover:underline">
                    Manage →
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs">
                <div className="text-xs font-medium text-gray-500">Teleconsultations</div>
                <div className="text-2xl font-bold text-gray-950 mt-1">₹499 / Visit</div>
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                  <span>WebRTC Video Care</span>
                  <button onClick={() => setActiveTab("doctors")} className="text-emerald-700 font-semibold hover:underline">
                    Queue →
                  </button>
                </div>
              </div>
            </div>

            {/* Clinic Locations Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Kondapur Minute Clinic</h3>
                    <p className="text-xs text-gray-500">Kondapur Main Road, Hitec City Corridor, Hyderabad</p>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Open
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-gray-500">Praana 3D Scans</span>
                    <p className="text-base font-bold text-gray-900 mt-0.5">{healthCheckupLocations['Kondapur'] || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">On-Duty Doctor</span>
                    <p className="font-semibold text-gray-900 mt-0.5">Dr. Mukesh (MD)</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <button onClick={() => setActiveTab("minute-clinic")} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                    Manage Clinic →
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Kompally Minute Clinic</h3>
                    <p className="text-xs text-gray-500">Kompally Main Road, Medchal Highway, Hyderabad</p>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Open
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-gray-500">Praana 3D Scans</span>
                    <p className="text-base font-bold text-gray-900 mt-0.5">{healthCheckupLocations['Kompally'] || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">On-Duty Doctor</span>
                    <p className="font-semibold text-gray-900 mt-0.5">Dr. Gutta Sahan (MBBS)</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <button onClick={() => setActiveTab("minute-clinic")} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                    Manage Clinic →
                  </button>
                </div>
              </div>
            </div>

            {/* Inbound Inquiries Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Recent Inquiries</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Patient questions, bookings, and clinic inquiries.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Search inquiries..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
                      <th className="py-2.5 px-5">Contact</th>
                      <th className="py-2.5 px-5">Email & Phone</th>
                      <th className="py-2.5 px-5">Source</th>
                      <th className="py-2.5 px-5">Status</th>
                      <th className="py-2.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredLeads.slice(0, 8).map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-5">
                          <div className="font-medium text-gray-900">{lead.name || "Anonymous"}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{new Date(lead.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="text-gray-900">{lead.email || "—"}</div>
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">{lead.phone || "—"}</div>
                        </td>
                        <td className="py-3 px-5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                            {lead.source || "Website"}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            lead.status === 'Contacted' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs font-medium text-gray-700 hover:text-gray-950 px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-gray-400">
                          No inquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "praana":
        return <AdminPraanaManager />;
      case "minute-clinic":
        return <AdminMinuteClinicManager />;
      case "doctors":
        return <AdminDoctorsManager />;
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
          <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-950">Inquiries</h1>
                <p className="text-xs text-gray-500 mt-1">Review inbound patient requests and customer inquiries.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  placeholder="Search inquiries..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
                      <th className="py-2.5 px-5">Contact</th>
                      <th className="py-2.5 px-5">Email & Phone</th>
                      <th className="py-2.5 px-5">Source</th>
                      <th className="py-2.5 px-5">Status</th>
                      <th className="py-2.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-5">
                          <div className="font-medium text-gray-900">{lead.name || "Anonymous"}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{new Date(lead.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="text-gray-900">{lead.email || "—"}</div>
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">{lead.phone || "—"}</div>
                        </td>
                        <td className="py-3 px-5 text-gray-600">{lead.source || "Website"}</td>
                        <td className="py-3 px-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            lead.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-right">
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs font-medium text-gray-700 hover:text-gray-950 px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-gray-400">No inquiries found.</td>
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
      case "feedback":
        return <AdminFeedbackManager />;
      case "locations":
        return <LocationsManager />;
      default:
        const title = ALL_NAV_ITEMS.find(item => item.id === activeTab)?.label || "Module";
        return <PlaceholderView title={title} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FBFBFC] overflow-hidden font-sans text-gray-900 antialiased">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Clean Utilitarian Sidebar */}
      <aside className={`w-[240px] bg-white flex flex-col flex-shrink-0 fixed md:relative h-full z-50 border-r border-gray-200 transition-transform duration-200 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-gray-950 flex items-center justify-center text-white font-bold text-xs shrink-0">
              A
            </div>
            <span className="text-sm font-semibold tracking-tight text-gray-950">AIRO Admin</span>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categorized Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {NAV_SECTIONS.map((section, idx) => {
            const visibleItems = section.items.filter(item => isModuleAllowed(item.id));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-0.5">
                <div className="px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1 mt-2">
                  {section.title}
                </div>
                {visibleItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-gray-100 text-gray-950 font-semibold"
                          : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-gray-950" : "text-gray-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-3 border-t border-gray-200 mt-auto bg-white">
          <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">{currentUser?.name || "Admin"}</p>
                <p className="text-[10px] text-gray-500 capitalize truncate">{currentUser?.role || "Administrator"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Admin</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-950">{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>airohealthhub.com</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Open Store</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </header>

        {/* Workspace Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#FBFBFC]">
          {renderContent()}
        </main>
      </div>

      {/* Lead Inspection Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg border border-gray-200 space-y-5">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    selectedLead.status === 'Contacted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {selectedLead.status}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
                <h3 className="text-base font-bold text-gray-950 mt-1">{selectedLead.name || "Inbound Patient"}</h3>
                <p className="text-xs text-gray-500">Source: {selectedLead.source || "Website"}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-lg space-y-2 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email:</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-medium text-gray-900 hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    {selectedLead.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-medium text-gray-900 hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {selectedLead.phone || "N/A"}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Inquiry Message
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message || "No specific message provided. Inquiry initiated via direct registration or consultation."}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Contacted")}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      selectedLead.status === "Contacted"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Pending")}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      selectedLead.status === "Pending"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Keep Pending
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-end gap-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              {selectedLead.phone && (
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Patient
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
