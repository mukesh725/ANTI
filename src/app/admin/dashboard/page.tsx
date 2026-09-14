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
    title: "Clinical Operations",
    items: [
      { id: "dashboard", label: "Operations Cockpit", icon: LayoutDashboard },
      { id: "praana", label: "Praana 3D Vitals", icon: Activity },
      { id: "minute-clinic", label: "Minute Clinic", icon: Stethoscope },
      { id: "doctors", label: "Doctors Hub", icon: UserPlus },
      { id: "bookings", label: "Health Intakes", icon: Ticket },
    ],
  },
  {
    title: "Commerce & Membership",
    items: [
      { id: "membership", label: "Memberships", icon: ShieldCheck },
      { id: "orders", label: "Orders & Rx", icon: ShoppingBag },
      { id: "products", label: "Catalog Products", icon: Package },
      { id: "categories", label: "Categories", icon: Layers },
      { id: "inventory", label: "Inventory Stock", icon: Boxes },
      { id: "payments", label: "Transactions", icon: CreditCard },
    ],
  },
  {
    title: "Growth & Patients",
    items: [
      { id: "blog", label: "Auto SEO Blogs", icon: Sparkles, badge: "AI SEO" },
      { id: "customers", label: "Patient Directory", icon: Users },
      { id: "leads", label: "Inbound Leads", icon: UserPlus },
      { id: "feedback", label: "Store Reviews", icon: Star },
      { id: "locations", label: "Physical Clinics", icon: MapPin },
    ],
  },
  {
    title: "Platform Governance",
    items: [
      { id: "cms", label: "Site CMS", icon: Database },
      { id: "coupons", label: "Coupons & Offers", icon: Ticket },
      { id: "admin-team", label: "Admin Staff", icon: ShieldAlert },
      { id: "settings", label: "System Settings", icon: Settings },
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

  const handleLogout = () => {
    localStorage.removeItem("airo_admin_auth");
    localStorage.removeItem("airo_admin_user");
    router.replace("/admin/login");
  };

  if (!isAuthenticated) return null;

  const totalCustomers = totalMemberships + totalHealthCheckups;
  const currentTabObj = ALL_NAV_ITEMS.find(item => item.id === activeTab);
  const activeLabel = currentTabObj?.label || "Operations Cockpit";

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
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Cockpit Executive Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Central HQ Live
                  </span>
                  <span className="text-xs text-slate-500">
                    Hyderabad • Kondapur & Kompally Hubs
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-serif tracking-tight text-slate-900 font-medium">
                  AIRO Operations & Clinical Cockpit
                </h1>
                <p className="text-xs md:text-sm text-slate-500">
                  Realtime telematics across Minute Clinics, Praana 3D Scans, Online Telemedicine, and Organic Commerce.
                </p>
              </div>

              {/* Quick Action Dock */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveTab("blog")}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  Auto SEO Blog
                </button>
                <button
                  onClick={() => setActiveTab("doctors")}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-slate-300" />
                  Doctors Hub
                </button>
                <a
                  href="/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all flex items-center gap-1.5"
                >
                  Public Blog
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Top 4 Operational KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Patients & Members */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient & Customer Base</span>
                    <div className="text-3xl font-semibold text-slate-900 tabular-nums mt-1">{totalCustomers}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{totalMemberships} Members • {totalHealthCheckups} Scans</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">SSO Synced</span>
                </div>
              </div>

              {/* Card 2: Praana 3D Health Screenings */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Praana 3D Health Scans</span>
                    <div className="text-3xl font-semibold text-slate-900 tabular-nums mt-1">{totalHealthCheckups}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Kondapur & Kompally Pods</span>
                  <button onClick={() => setActiveTab("praana")} className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer">
                    Vitals →
                  </button>
                </div>
              </div>

              {/* Card 3: Auto SEO Blog Engine */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto SEO Articles</span>
                    <div className="text-3xl font-semibold text-slate-900 tabular-nums mt-1">{totalBlogs || 10}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Google Schema Active</span>
                  <button onClick={() => setActiveTab("blog")} className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer">
                    Generate →
                  </button>
                </div>
              </div>

              {/* Card 4: Clinical Consultations */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telemedicine & Walk-ins</span>
                    <div className="text-xl font-semibold text-slate-900 mt-1">₹499 Virtual MD</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Dr. Mukesh & Dr. Sahan</span>
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium text-[11px]">WebRTC Live</span>
                </div>
              </div>
            </div>

            {/* Prominent Auto SEO Showcase Banner */}
            <div className="bg-gradient-to-r from-[#0C152B] via-[#162545] to-[#0C152B] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    AIRO ORGANIC SEO & CONVERSION ENGINE
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif text-white font-medium tracking-tight">
                    Automated Ecosystem Content & Lead Generator
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    Auto-publishes 1,000+ word clinical and organic grocery articles deeply anchored to the AIRO ecosystem (Minute Clinics, Praana 3D Health Scans, Online Telemedicine Consultations, and Wood-Pressed Oils). Every article embeds Google-validated Schema markup and direct high-converting CTAs driving bookings and orders.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                    <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 font-medium">
                      <strong className="text-white font-bold">{totalBlogs || 10}</strong> Articles Live in Firestore
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                      SEO Schema: <strong className="text-emerald-300">BlogPosting JSON-LD</strong>
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                      Conversion CTAs: <strong className="text-emerald-300">Virtual Doctor (₹499) + Organic Store</strong>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto flex-shrink-0">
                  <button
                    onClick={() => setActiveTab("blog")}
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    Auto-Generate SEO Blog
                  </button>
                  <a
                    href="/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    View Live Blog
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Regional Clinic Footprint & Praana 3D Scans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Kondapur Center */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      Kondapur Pod
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Minute Clinic #1</span>
                  </div>
                  <h3 className="font-serif text-lg text-slate-900 font-medium">Kondapur Main Center</h3>
                  <p className="text-xs text-slate-500 mt-1">Kondapur Main Road, Hitec City Corridor, Hyderabad</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Praana 3D Scans Logged</span>
                      <span className="font-semibold text-slate-900">{healthCheckupLocations['Kondapur'] || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">On-Duty Doctor</span>
                      <span className="font-semibold text-emerald-700">Dr. Mukesh Doctor (MD)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Services</span>
                      <span className="text-slate-700">3D Vitals • Walk-ins • Pharmacy</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Walk-ins & Booking Active</span>
                  <button onClick={() => setActiveTab("minute-clinic")} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
                    Manage Clinic →
                  </button>
                </div>
              </div>

              {/* Kompally Center */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      Kompally Pod
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Minute Clinic #2</span>
                  </div>
                  <h3 className="font-serif text-lg text-slate-900 font-medium">Kompally Highway Hub</h3>
                  <p className="text-xs text-slate-500 mt-1">Kompally Main Road, Medchal Highway, Hyderabad</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Praana 3D Scans Logged</span>
                      <span className="font-semibold text-slate-900">{healthCheckupLocations['Kompally'] || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">On-Duty Doctor</span>
                      <span className="font-semibold text-emerald-700">Dr. Gutta Sahan (MBBS)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Services</span>
                      <span className="text-slate-700">3D Vitals • Organic Pantry • Rx</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Walk-ins & Booking Active</span>
                  <button onClick={() => setActiveTab("minute-clinic")} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
                    Manage Clinic →
                  </button>
                </div>
              </div>

              {/* Virtual Telemedicine Pod */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      Telemed Cloud Pod
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Instant Consultation</span>
                  </div>
                  <h3 className="font-serif text-lg text-slate-900 font-medium">Virtual Doctor Consultations</h3>
                  <p className="text-xs text-slate-500 mt-1">End-to-end WebRTC encrypted peer-to-peer video & audio care.</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Patient Fee</span>
                      <span className="font-semibold text-slate-900">₹499 Flat / Session</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Active Queue</span>
                      <span className="font-semibold text-blue-700">Ready for Inbound Calls</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Digital Rx & Delivery</span>
                      <span className="text-slate-700">Automated Patient Dispatch</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Realtime Doctor Calling</span>
                  <button onClick={() => setActiveTab("doctors")} className="text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer">
                    Open Doctors Hub →
                  </button>
                </div>
              </div>
            </div>

            {/* Inbound Leads & Patient Inquiries Feed */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif text-slate-900 font-medium">Inbound Patient Inquiries & Triage</h3>
                  <p className="text-xs text-slate-500">Live booking requests, medical questions, and store inquiries.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      placeholder="Search patient, phone..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-6">Patient</th>
                      <th className="py-3 px-6">Contact Info</th>
                      <th className="py-3 px-6">Inquiry Category</th>
                      <th className="py-3 px-6">Triage Status</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredLeads.slice(0, 8).map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {lead.name ? lead.name.slice(0, 2).toUpperCase() : "PT"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-xs">{lead.name || "Anonymous Patient"}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{new Date(lead.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <p className="text-xs text-slate-700">{lead.email || "No email"}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{lead.phone || "No phone"}</p>
                        </td>
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {lead.source || "Web Intake"}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            lead.status === 'Contacted' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'Contacted' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-xs text-slate-400">
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
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h1 className="text-2xl font-serif text-slate-900">Lead Intelligence & Patient CRM</h1>
                <p className="text-xs text-slate-500 mt-1">Review all inbound patient requests, clinic walk-in inquiries, and store leads.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  placeholder="Filter leads..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-4 px-6">Lead</th>
                      <th className="py-4 px-6">Contact</th>
                      <th className="py-4 px-6">Source</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-900 text-xs">{lead.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{new Date(lead.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs text-slate-700">{lead.email}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{lead.phone}</p>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600">{lead.source}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider ${
                            lead.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/70' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-slate-400">No leads found.</td>
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
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-800 antialiased">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modern Executive Sidebar */}
      <aside className={`w-[270px] bg-[#0C152B] flex flex-col flex-shrink-0 fixed md:relative h-full z-50 border-r border-slate-800/80 shadow-2xl transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-serif">AIRO</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">HQ</span>
              </div>
              <p className="text-[10px] text-slate-400">Health Hub & Essentials</p>
            </div>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categorized Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
          {NAV_SECTIONS.map((section, idx) => {
            const visibleItems = section.items.filter(item => isModuleAllowed(item.id));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 text-xs font-medium cursor-pointer ${
                        isActive
                          ? "bg-white/10 text-white font-semibold border-l-2 border-emerald-400 pl-2.5 shadow-xs"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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
        <div className="p-4 border-t border-white/10 mt-auto bg-slate-950/40">
          <div className="mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name || "Operations Lead"}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">{currentUser?.role || "Super Admin"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-slate-300 transition-colors text-xs font-medium border border-white/5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar Header */}
        <header className="h-[64px] bg-white border-b border-slate-200/80 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 sticky top-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline">Central Operations</span>
              <ChevronRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
              <span className="font-semibold text-slate-900 text-sm">{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Dual Domain Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>airohealthhub.com & airoessentials.com</span>
            </div>

            {/* Direct Quick Link to Live Blog */}
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              <span>Live Blog</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Quick Auto SEO Trigger */}
            <button
              onClick={() => setActiveTab("blog")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Auto SEO</span>
            </button>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F8FAFC]">
          <div className="relative z-10">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Selected Lead Detailed Inspection Slide-over Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedLead.status === 'Contacted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedLead.status}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-slate-900 mt-1">{selectedLead.name || "Inbound Patient"}</h3>
                <p className="text-xs text-slate-500">Source: {selectedLead.source || "Website Intake"}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email Address:</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedLead.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone Number:</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedLead.phone || "N/A"}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Inquiry / Patient Message
                </label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message || "No specific message provided. Inquiry initiated via direct consultation or scan registration."}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Update Triage Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Contacted")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedLead.status === "Contacted"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Pending")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedLead.status === "Pending"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Keep Pending
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              {selectedLead.phone && (
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
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
