"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, ShoppingBag, CreditCard, Package, 
  Layers, Boxes, Users, UserPlus, Database, Ticket, 
  Settings, ShieldAlert, LogOut, ArrowRight,
  TrendingUp, TrendingDown, DollarSign, Activity,
  Trash2, CheckCircle2, BrainCircuit, ShieldCheck, Menu, X, MapPin, Stethoscope, FileText, Star,
  Sparkles, ExternalLink, Search, Bell, Clock, Calendar, ChevronRight,
  Phone, Mail, Check, Building2, ArrowUpRight, Compass, HeartPulse
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
import Link from "next/link";

// Types
interface LocationData {
  city: string;
  country: string;
  region: string;
  ip: string;
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
      { id: "dashboard", label: "Overview", icon: LayoutDashboard },
      { id: "praana", label: "Praana 3D Vitals", icon: HeartPulse },
      { id: "minute-clinic", label: "Minute Clinic", icon: Stethoscope },
      { id: "doctors", label: "Doctors Hub", icon: UserPlus },
      { id: "bookings", label: "Health Intakes", icon: Calendar },
    ],
  },
  {
    title: "Commerce & Membership",
    items: [
      { id: "membership", label: "Memberships", icon: ShieldCheck },
      { id: "orders", label: "Orders & Prescriptions", icon: ShoppingBag },
      { id: "products", label: "Store Catalog", icon: Package },
      { id: "categories", label: "Categories", icon: Layers },
      { id: "inventory", label: "Inventory", icon: Boxes },
      { id: "payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    title: "Growth & Patients",
    items: [
      { id: "blog", label: "Auto SEO Blogs", icon: Sparkles, badge: "SEO Engine" },
      { id: "customers", label: "Patients & Users", icon: Users },
      { id: "leads", label: "Inbound Leads", icon: UserPlus },
      { id: "feedback", label: "Customer Reviews", icon: Star },
      { id: "locations", label: "Physical Clinics", icon: MapPin },
    ],
  },
  {
    title: "System & Governance",
    items: [
      { id: "cms", label: "CMS & Content", icon: Database },
      { id: "coupons", label: "Coupons", icon: Ticket },
      { id: "admin-team", label: "Staff Access", icon: ShieldAlert },
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
  const activeLabel = currentTabObj?.label || "Overview";

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
          <div className="p-6 md:p-10 max-w-[1500px] mx-auto space-y-8">
            {/* Apple macOS Overview Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                  Hyderabad Operations • Central Command
                </p>
                <h1 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight mt-1">
                  Overview
                </h1>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveTab("blog")}
                  className="px-4 py-2 rounded-full text-xs font-medium bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white/90" />
                  Auto SEO Generator
                </button>
                <Link
                  href="/doctor"
                  target="_blank"
                  className="px-4 py-2 rounded-full text-xs font-medium bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#86868B]" />
                  Doctor Portal
                  <ArrowUpRight className="w-3 h-3 text-[#86868B]" />
                </Link>
                <a
                  href="/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full text-xs font-medium bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] shadow-xs transition-all flex items-center gap-1.5"
                >
                  Live Blog
                  <ExternalLink className="w-3 h-3 text-[#86868B]" />
                </a>
              </div>
            </div>

            {/* Apple Health / macOS 4 Metric Squircle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Patients & Members */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#86868B]">Registered Patients</span>
                    <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight tabular-nums mt-2">
                      {totalCustomers.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#1D1D1F]" />
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868B]">
                  <span>{totalMemberships} Members • {totalHealthCheckups} Scans</span>
                  <span className="inline-flex items-center gap-1 text-[#34C759] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                    Synced
                  </span>
                </div>
              </div>

              {/* Metric 2: Praana 3D Health Screenings */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#86868B]">Praana 3D Screenings</span>
                    <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight tabular-nums mt-2">
                      {totalHealthCheckups.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center">
                    <HeartPulse className="w-5 h-5 text-[#34C759]" />
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868B]">
                  <span>Kondapur & Kompally Hubs</span>
                  <button 
                    onClick={() => setActiveTab("praana")} 
                    className="text-[#0071E3] hover:underline font-medium cursor-pointer"
                  >
                    Vitals →
                  </button>
                </div>
              </div>

              {/* Metric 3: Auto SEO Blog Knowledge Engine */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#86868B]">Published SEO Articles</span>
                    <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight tabular-nums mt-2">
                      {totalBlogs || 10}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#0071E3]" />
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868B]">
                  <span>Google Schema Validated</span>
                  <button 
                    onClick={() => setActiveTab("blog")} 
                    className="text-[#0071E3] hover:underline font-medium cursor-pointer"
                  >
                    Generate →
                  </button>
                </div>
              </div>

              {/* Metric 4: Virtual Telemedicine & Care */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#86868B]">Virtual Consultations</span>
                    <div className="text-2xl font-semibold text-[#1D1D1F] tracking-tight mt-2">
                      ₹499 Flat MD
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#5856D6]/10 text-[#5856D6] flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-[#5856D6]" />
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868B]">
                  <span>Dr. Mukesh & Dr. Sahan</span>
                  <span className="text-[#0071E3] font-medium">WebRTC Active</span>
                </div>
              </div>
            </div>

            {/* Apple Style Refined Auto SEO Engine Hub */}
            <div className="bg-[#1D1D1F] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-white/90" />
                    Autonomous Organic Growth
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    AIRO SEO & Conversion Engine
                  </h2>
                  <p className="text-sm text-[#A1A1A6] leading-relaxed">
                    Instantly synthesizes 1,000+ word clinical and organic grocery articles deeply anchored to AIRO Minute Clinics, Praana 3D Scans, Online Telemedicine Consultations, and Wood-Pressed Cooking Oils. Automatically embeds verified Google Schema markup and direct booking CTAs.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-white/90 font-medium">
                      {totalBlogs || 10} Articles Live
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-white/80">
                      Google JSON-LD Validated
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-white/80">
                      High-Conversion Patient CTAs
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                  <button
                    onClick={() => setActiveTab("blog")}
                    className="px-5 py-2.5 rounded-full bg-white text-[#1D1D1F] hover:bg-[#F5F5F7] font-medium text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    Open Generator
                  </button>
                  <a
                    href="/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all border border-white/15 flex items-center justify-center gap-1.5"
                  >
                    View Live Blog
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>
              </div>
            </div>

            {/* Apple Style Regional Clinic Footprint Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Kondapur Center */}
              <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                      Minute Clinic #1
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#34C759] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
                      Open Now
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">Kondapur Main Center</h3>
                  <p className="text-xs text-[#86868B] mt-1">Kondapur Main Road, Hitec City Corridor, Hyderabad</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs py-2 border-b border-black/[0.04]">
                      <span className="text-[#86868B]">Praana 3D Scans</span>
                      <span className="font-semibold text-[#1D1D1F]">{healthCheckupLocations['Kondapur'] || 0} Logged</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2 border-b border-black/[0.04]">
                      <span className="text-[#86868B]">On-Duty Physician</span>
                      <span className="font-semibold text-[#1D1D1F]">Dr. MUKESH Doctor (MD)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2">
                      <span className="text-[#86868B]">Services</span>
                      <span className="text-[#1D1D1F]">3D Vitals • Walk-in MD • Pharmacy</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-xs text-[#86868B]">Walk-ins & Appointments</span>
                  <button onClick={() => setActiveTab("minute-clinic")} className="text-xs font-medium text-[#0071E3] hover:underline cursor-pointer">
                    Manage Clinic →
                  </button>
                </div>
              </div>

              {/* Kompally Center */}
              <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                      Minute Clinic #2
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#34C759] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
                      Open Now
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">Kompally Highway Hub</h3>
                  <p className="text-xs text-[#86868B] mt-1">Kompally Main Road, Medchal Highway, Hyderabad</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs py-2 border-b border-black/[0.04]">
                      <span className="text-[#86868B]">Praana 3D Scans</span>
                      <span className="font-semibold text-[#1D1D1F]">{healthCheckupLocations['Kompally'] || 0} Logged</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2 border-b border-black/[0.04]">
                      <span className="text-[#86868B]">On-Duty Physician</span>
                      <span className="font-semibold text-[#1D1D1F]">Dr. Gutta Sahan (MBBS)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2">
                      <span className="text-[#86868B]">Services</span>
                      <span className="text-[#1D1D1F]">3D Vitals • Organic Store • Rx</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-xs text-[#86868B]">Walk-ins & Appointments</span>
                  <button onClick={() => setActiveTab("minute-clinic")} className="text-xs font-medium text-[#0071E3] hover:underline cursor-pointer">
                    Manage Clinic →
                  </button>
                </div>
              </div>

              {/* Telemedicine Cloud Pod */}
              <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                      Virtual Care
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#0071E3] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse"></span>
                      WebRTC Active
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">Telemedicine Consultations</h3>
                  <p className="text-xs text-[#86868B] mt-1">Encrypted peer-to-peer audio & HD video medical care.</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs py-2 border-b border-black/[0.04]">
                      <span className="text-[#86868B]">Session Fee</span>
                      <span className="font-semibold text-[#1D1D1F]">₹499 Flat Fee</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2 border-b border-black/[0.04]">
                      <span className="text-[#86868B]">Patient Notification</span>
                      <span className="font-semibold text-[#34C759]">Realtime Instant Email</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2">
                      <span className="text-[#86868B]">Prescriptions</span>
                      <span className="text-[#1D1D1F]">Digital PDF & Pharmacy Fulfillment</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-xs text-[#86868B]">Direct Doctor Call</span>
                  <Link href="/doctor" target="_blank" className="text-xs font-medium text-[#0071E3] hover:underline cursor-pointer">
                    Doctor Portal →
                  </Link>
                </div>
              </div>
            </div>

            {/* Inbound Inquiries & Patient Triage Table */}
            <div className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-6 border-b border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">Patient Inquiries & Triage</h3>
                  <p className="text-xs text-[#86868B]">Realtime clinic consultations, scan registrations, and customer requests.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" />
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Search patient or phone..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F5F7] border border-transparent focus:border-black/[0.1] focus:bg-white rounded-full focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-black/[0.04] text-[#86868B] text-xs font-medium">
                      <th className="py-3 px-6">Patient</th>
                      <th className="py-3 px-6">Contact</th>
                      <th className="py-3 px-6">Source</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04] text-xs">
                    {filteredLeads.slice(0, 8).map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#F5F5F7]/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-xs flex items-center justify-center">
                              {lead.name ? lead.name.slice(0, 2).toUpperCase() : "PT"}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1D1D1F]">{lead.name || "Patient"}</p>
                              <p className="text-[11px] text-[#86868B] mt-0.5">{new Date(lead.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[#1D1D1F]">{lead.email || "No email"}</p>
                          <p className="text-[11px] text-[#86868B] font-mono mt-0.5">{lead.phone || "No phone"}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-[#F5F5F7] text-[#1D1D1F] font-medium">
                            {lead.source || "Web"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            lead.status === 'Contacted' 
                              ? 'bg-[#34C759]/10 text-[#34C759]' 
                              : 'bg-[#FF9500]/10 text-[#FF9500]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'Contacted' ? 'bg-[#34C759]' : 'bg-[#FF9500]'}`}></span>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs font-medium text-[#0071E3] hover:underline px-2.5 py-1 rounded-full hover:bg-[#0071E3]/5 transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-xs text-[#86868B]">
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
          <div className="p-6 md:p-10 max-w-[1500px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">Patient Inbound Leads</h1>
                <p className="text-xs text-[#86868B] mt-1">Review all patient consultations, scan requests, and customer inquiries.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" />
                <input
                  type="text"
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-black/[0.08] rounded-full focus:outline-none focus:border-[#0071E3]"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-black/[0.04] text-[#86868B] text-xs font-medium">
                      <th className="py-4 px-6">Lead</th>
                      <th className="py-4 px-6">Contact</th>
                      <th className="py-4 px-6">Source</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04] text-xs">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#F5F5F7]/60 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-[#1D1D1F]">{lead.name}</p>
                          <p className="text-[11px] text-[#86868B] mt-0.5">{new Date(lead.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[#1D1D1F]">{lead.email}</p>
                          <p className="text-[11px] text-[#86868B] font-mono mt-0.5">{lead.phone}</p>
                        </td>
                        <td className="py-4 px-6 text-[#1D1D1F]">{lead.source}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            lead.status === 'Pending' ? 'bg-[#FF9500]/10 text-[#FF9500]' : 'bg-[#34C759]/10 text-[#34C759]'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs text-[#0071E3] hover:underline font-medium px-3 py-1 rounded-full cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-[#86868B]">No leads found.</td>
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
    <div className="flex h-screen bg-[#F5F5F7] overflow-hidden font-sans text-[#1D1D1F] antialiased">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Apple macOS Translucent Frosted Sidebar */}
      <aside className={`w-[260px] bg-[#F2F2F7]/95 backdrop-blur-2xl flex flex-col flex-shrink-0 fixed md:relative h-full z-50 border-r border-black/[0.06] shadow-sm transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* macOS Traffic Lights Window Header */}
        <div className="p-4 pb-3 border-b border-black/[0.04]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-xs"></span>
            </div>
            <button 
              className="md:hidden text-[#86868B] hover:text-[#1D1D1F] p-1"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              A
            </div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-[#1D1D1F] tracking-tight">AIRO Operations</div>
              <div className="text-[10px] text-[#86868B]">Central Command</div>
            </div>
          </div>
        </div>

        {/* macOS Categorized Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">
          {NAV_SECTIONS.map((section, idx) => {
            const visibleItems = section.items.filter(item => isModuleAllowed(item.id));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-0.5">
                <div className="px-3 text-[11px] font-semibold text-[#86868B] tracking-normal mb-1">
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
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all text-xs font-medium cursor-pointer active:scale-[0.98] ${
                        isActive
                          ? "bg-[#0071E3] text-white font-semibold shadow-xs"
                          : "text-[#1D1D1F] hover:bg-black/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#86868B]"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-[#0071E3]/10 text-[#0071E3]"
                        }`}>
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

        {/* macOS User Profile Capsule */}
        <div className="p-3 border-t border-black/[0.06] mt-auto">
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center font-semibold text-[10px]">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "HQ"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#1D1D1F] truncate">{currentUser?.name || "Admin"}</p>
                <p className="text-[10px] text-[#86868B] truncate">{currentUser?.role || "Super Admin"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-[#86868B] hover:text-[#FF3B30] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Apple macOS Translucent Topbar */}
        <header className="h-[56px] bg-white/80 backdrop-blur-xl border-b border-black/[0.06] flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 text-[#1D1D1F] hover:bg-black/[0.05] rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-[#86868B]">
              <span className="hidden sm:inline">AIRO Operations</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-semibold text-[#1D1D1F] text-xs">{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Dual-Domain Status Capsule */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] text-[11px] text-[#1D1D1F] border border-black/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
              <span>airohealthhub.com & airoessentials.com</span>
            </div>

            {/* Quick Auto SEO Trigger */}
            <button
              onClick={() => setActiveTab("blog")}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#0071E3]/10 hover:bg-[#0071E3]/15 text-[#0071E3] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto SEO</span>
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F5F5F7]">
          {renderContent()}
        </main>
      </div>

      {/* Apple-style Inspection Sheet/Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-black/[0.08] space-y-6">
            <div className="flex justify-between items-start border-b border-black/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    selectedLead.status === 'Contacted' ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-[#FF9500]/10 text-[#FF9500]'
                  }`}>
                    {selectedLead.status}
                  </span>
                  <span className="text-xs text-[#86868B]">{new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight mt-1">{selectedLead.name || "Patient"}</h3>
                <p className="text-xs text-[#86868B]">Source: {selectedLead.source || "Web"}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-[#86868B] hover:text-[#1D1D1F] p-1.5 rounded-full hover:bg-[#F5F5F7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#F5F5F7] p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#86868B]">Email:</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-[#0071E3] hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedLead.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#86868B]">Phone:</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-semibold text-[#0071E3] hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedLead.phone || "N/A"}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Message Details
                </label>
                <div className="p-4 bg-[#F5F5F7] rounded-2xl text-[#1D1D1F] leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message || "No specific message provided. Inquiry initiated via direct consultation or scan booking."}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                  Update Triage
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Contacted")}
                    className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      selectedLead.status === "Contacted"
                        ? "bg-[#34C759] text-white"
                        : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA]"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Pending")}
                    className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      selectedLead.status === "Pending"
                        ? "bg-[#FF9500] text-white"
                        : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Mark Pending
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-black/[0.06] pt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-xs font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-full cursor-pointer"
              >
                Close
              </button>
              {selectedLead.phone && (
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
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
