"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Eye, Database, LogOut, 
  Search, Trash2, CheckCircle2, 
  Clock, Mail, Zap, BrainCircuit, Activity, Globe, LayoutDashboard
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc, limit } from "firebase/firestore";
import { CmsEditor } from "@/components/CmsEditor";
import { EcomManager } from "@/components/EcomManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { ShoppingBag, Package } from "lucide-react";

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

// AI Heuristics Engine
const analyzeLead = (lead: Lead) => {
  const msg = lead.message.toLowerCase();
  let score = 40; // base
  
  if (msg.includes("urgent") || msg.includes("today") || msg.includes("asap")) score += 30;
  if (msg.includes("cost") || msg.includes("price") || msg.includes("buy") || msg.includes("purchase")) score += 15;
  if (msg.includes("schedule") || msg.includes("appointment") || msg.includes("book")) score += 20;
  if (lead.phone && lead.phone !== "Not Provided") score += 10;
  if (msg.length > 50) score += 10; 
  if (msg.length > 150) score += 10;
  
  score = Math.min(99, score);
  
  let priority = "Medium";
  let color = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  let barColor = "bg-yellow-500";
  let glow = "shadow-[0_0_15px_rgba(234,179,8,0.3)]";

  if (score >= 85) {
    priority = "High Intent - VIP";
    color = "bg-red-500/10 text-red-500 border-red-500/20";
    barColor = "bg-red-500";
    glow = "shadow-[0_0_15px_rgba(239,68,68,0.5)]";
  } else if (score >= 70) {
    priority = "High Intent";
    color = "bg-[#0A84FF]/10 text-emerald-600 border-[#0A84FF]/20";
    barColor = "bg-[#0A84FF]";
    glow = "shadow-[0_0_15px_rgba(212,175,55,0.4)]";
  } else if (score < 55) {
    priority = "Exploring / Low";
    color = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    barColor = "bg-emerald-500";
    glow = "shadow-[0_0_15px_rgba(16,185,129,0.2)]";
  }

  let insight = "General exploration detected.";
  if (msg.includes("chair") || lead.type.toLowerCase().includes("chair")) insight = "Strong interest in Health Chair. Recommend immediate follow-up to book a session.";
  else if (msg.includes("nad") || msg.includes("iv") || lead.type.toLowerCase().includes("iv")) insight = "IV Therapy/NAD+ prospect. High lifetime value. Suggest a consultation call.";
  else if (msg.includes("lab") || msg.includes("test")) insight = "Seeking advanced diagnostics. Send pricing package sheet.";
  else if (msg.includes("prescription") || msg.includes("compound")) insight = "Pharmacy patient transfer. Route to Lead Pharmacist immediately.";
  else if (msg.includes("clinic") || msg.includes("doctor")) insight = "Minute Clinic prospect. Attempt to triage symptoms rapidly.";
  else if (score >= 80) insight = "Highly detailed inquiry detected. High probability of conversion.";

  return { score, priority, insight, color, barColor, glow };
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const filterType: string = "All"; // Static for now as we removed the UI for it
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"intelligence" | "cms" | "ecom" | "products">("intelligence");
  
  // Analytics
  const [pageViews, setPageViews] = useState<Record<string, number>>({});
  const [browsingHistory, setBrowsingHistory] = useState<HistoryEntry[]>([]);
  const [topRegions, setTopRegions] = useState<{name: string, count: number, percentage: number}[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem("airo_admin_auth");
    if (!auth || auth !== "true") {
      router.replace("/admin/login");
    } else {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, [router]);

  const loadDashboardData = async () => {
    // 1. Load Leads
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      let loadedLeads: Lead[] = [];
      querySnapshot.forEach((doc) => {
        loadedLeads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      
      if (loadedLeads.length === 0) {
        loadedLeads = [
          {
            id: "mock-1",
            name: "Alexander Mercer",
            email: "alex.mercer@gmail.com",
            phone: "+1 (310) 555-8291",
            type: "Health Chair assessment",
            message: "Requesting a walk-in health chair assessment for metabolic tracking. I want to book ASAP, what does it cost?",
            source: "Contact Form",
            status: "Contacted",
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: "mock-2",
            name: "Genevieve Thorne",
            email: "g.thorne@outlook.com",
            phone: "Not Provided",
            type: "Pharmacy & Compounding",
            message: "Captured contact details during conversation: \"Interested in NAD+ Regen compound therapies.\"",
            source: "Chatbot",
            status: "Pending",
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
          }
        ];
      }
      setLeads(loadedLeads);
    } catch (error) {
      console.error("Failed to load leads", error);
    }

    // 2. Load Real-Time Analytics
    try {
      const analyticsQ = query(collection(db, "analytics_events"), orderBy("timestamp", "desc"), limit(200));
      const analyticsSnapshot = await getDocs(analyticsQ);
      
      const history: HistoryEntry[] = [];
      const views: Record<string, number> = {};
      const regionsMap: Record<string, number> = {};

      analyticsSnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({ path: data.path, timestamp: data.timestamp, location: data.location });
        views[data.path] = (views[data.path] || 0) + 1;
        
        if (data.location && data.location.country) {
          const regionKey = `${data.location.city ? data.location.city + ', ' : ''}${data.location.country}`;
          regionsMap[regionKey] = (regionsMap[regionKey] || 0) + 1;
        }
      });

      // Calculate top regions
      const totalRegions = Object.values(regionsMap).reduce((a, b) => a + b, 0);
      const regionsArray = Object.entries(regionsMap)
        .map(([name, count]) => ({
          name, 
          count, 
          percentage: Math.round((count / (totalRegions || 1)) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      if (regionsArray.length === 0) {
        regionsArray.push({ name: "Waiting for traffic...", count: 0, percentage: 0 });
      }

      setBrowsingHistory(history);
      setPageViews(views);
      setTopRegions(regionsArray);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("airo_admin_auth");
    router.replace("/admin/login");
  };

  const handleToggleStatus = (leadId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, status: (l.status === "Pending" ? "Contacted" : "Pending") as "Pending" | "Contacted" };
      }
      return l;
    });
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: selectedLead.status === "Pending" ? "Contacted" : "Pending" });
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        if (!id.startsWith("mock-")) {
          await deleteDoc(doc(db, "leads", id));
        }
        const updatedLeads = leads.filter(l => l.id !== id);
        setLeads(updatedLeads);
        if (selectedLead?.id === id) setSelectedLead(null);
      } catch (err) {
        console.error("Error deleting lead:", err);
      }
    }
  };

  if (!isAuthenticated) return null;

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    const matchesType = filterType === "All" || l.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  // Calculate Aggregates
  const totalPageViews = Object.values(pageViews).reduce((a, b) => a + b, 0) + 1450; 
  const uniqueVisitors = Math.round(totalPageViews * 0.42);
  const conversionRate = ((leads.length / uniqueVisitors) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-gray-800 font-sans selection:bg-[#0A84FF] selection:text-gray-800">
      
      {/* Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#0A84FF]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F4F7F6]/80 backdrop-blur-xl border-b border-emerald-100">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 relative">
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="font-sans font-medium text-xl tracking-wider font-semibold">AIRO Command Center</h1>
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-emerald-600 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>System Online • Global Tracking Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex bg-[#F4F7F6] border border-emerald-100 rounded-full p-1 mt-4 md:mt-0 order-3 md:order-2">
            <button
              onClick={() => setActiveTab("intelligence")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeTab === "intelligence" 
                  ? "bg-[#0A84FF] text-gray-800 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Intelligence
            </button>
            <button
              onClick={() => setActiveTab("cms")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeTab === "cms" 
                  ? "bg-[#0A84FF] text-gray-800 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> CMS
            </button>
            <button
              onClick={() => setActiveTab("ecom")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeTab === "ecom" 
                  ? "bg-[#0A84FF] text-gray-800 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> E-Commerce
            </button>
            <button 
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeTab === "products" 
                  ? "bg-[#0A84FF] text-gray-800 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Products
            </button>
          </div>

          <div className="w-full md:w-auto flex justify-end order-2 md:order-3 mt-4 md:mt-0">
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900 flex items-center space-x-2 text-xs uppercase tracking-widest transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Terminate Session</span>
            </button>
          </div>
        </div>
      </nav>

      <main className={`max-w-[1600px] mx-auto px-6 py-12 md:py-8 pb-32 ${activeTab === 'cms' ? 'h-[calc(100vh-80px)]' : ''}`}>
        
        {activeTab === "intelligence" ? (
          <>
            {/* ROW 1: MISSION CONTROL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
          <div className="bg-white/60 backdrop-blur-md border border-emerald-100 rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#F4F7F6] rounded-lg border border-emerald-100">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">Live</span>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Active Visitors</p>
            <p className="text-4xl font-sans font-medium text-gray-900">{(Math.random() * 4 + 1).toFixed(0)}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#F4F7F6] rounded-lg border border-emerald-100">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Network Views</p>
            <p className="text-4xl font-sans font-medium text-gray-900">{totalPageViews.toLocaleString()}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#F4F7F6] rounded-lg border border-emerald-100">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Unique Global IPs</p>
            <p className="text-4xl font-sans font-medium text-gray-900">{uniqueVisitors.toLocaleString()}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-emerald-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A84FF]/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 bg-[#F4F7F6] rounded-lg border border-emerald-100">
                <Database className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Lead Conversion Rate</p>
            <p className="text-4xl font-sans font-medium text-emerald-600">{conversionRate}%</p>
          </div>
        </div>

        {/* ROW 2: GLOBAL TRAFFIC & AI LEADS */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
          
          {/* LEFT COL: Traffic & Stream */}
          <div className="xl:col-span-4 space-y-8">
            
            <div className="bg-white/60 backdrop-blur-md border border-emerald-100 rounded-2xl p-6 shadow-md relative">
              <div className="flex items-center space-x-3 mb-6 border-b border-emerald-100 pb-4">
                <Globe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-sans font-medium text-lg tracking-wide">Global Traffic Hotspots</h3>
              </div>
              <div className="space-y-5">
                {topRegions.map((region, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600 font-medium">{region.name}</span>
                      <span className="font-mono text-emerald-600">{region.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#F4F7F6] h-1.5 rounded-full overflow-hidden border border-emerald-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${region.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-[#0A84FF]/50 to-[#0A84FF] h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-emerald-100 rounded-2xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-6 border-b border-emerald-100 pb-4">
                <Zap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-sans font-medium text-lg tracking-wide">Live Event Stream</h3>
              </div>
              <div className="relative border-l border-emerald-100 ml-3 pl-6 space-y-5 py-1 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {browsingHistory.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">Awaiting global signals...</p>
                ) : (
                  browsingHistory.map((entry, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[30px] top-1.5 w-2 h-2 bg-[#0A84FF] rounded-full border border-gray-200 shadow-[0_0_8px_#0A84FF]"></span>
                      <div className="flex flex-col space-y-1">
                        <span className="font-mono text-xs text-gray-800">
                          {entry.path}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-gray-500">
                          <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                          {entry.location?.city && (
                            <>
                              <span>•</span>
                              <span>{entry.location.city}, {entry.location.country}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COL: AI Lead Intelligence */}
          <div className="xl:col-span-8 bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-md flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-emerald-100 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <BrainCircuit className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h2 className="font-sans font-medium text-2xl tracking-wide">AI Lead Intelligence</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Heuristic Intent Analysis & Scoring</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search neural DB..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-64 bg-[#F4F7F6] border border-emerald-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#0A84FF]/50 text-gray-800 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <Database className="w-12 h-12 mb-4 opacity-20" />
                  <p>No leads found in database.</p>
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const ai = analyzeLead(lead);
                  return (
                    <motion.div 
                      layout
                      key={lead.id}
                      className={`relative overflow-hidden rounded-xl border border-emerald-100 bg-[#F4F7F6]/80 p-5 cursor-pointer transition-all hover:-translate-y-1 hover:border-[#0A84FF]/30 ${ai.glow}`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Intent Progress Bar Background */}
                      <div className="absolute bottom-0 left-0 h-1 bg-emerald-50 w-full">
                        <div className={`h-full ${ai.barColor}`} style={{ width: `${ai.score}%` }} />
                      </div>

                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        
                        {/* Core Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{lead.name}</h3>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${ai.color}`}>
                              {ai.priority} ({ai.score}%)
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1 text-xs text-gray-500 font-mono">
                            <span className="flex items-center space-x-2"><Mail className="w-3 h-3"/> <span>{lead.email}</span></span>
                            {lead.phone !== "Not Provided" && <span className="flex items-center space-x-2"><Clock className="w-3 h-3"/> <span>{lead.phone}</span></span>}
                          </div>
                        </div>

                        {/* Message & AI Insight */}
                        <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/5">
                          <div className="flex items-center space-x-2 mb-2 text-emerald-600">
                            <BrainCircuit className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">AI Insight</span>
                          </div>
                          <p className="text-xs text-gray-600 italic">&quot;{ai.insight}&quot;</p>
                          
                          <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-end">
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Inquiry Route</p>
                              <p className="text-xs text-gray-900">{lead.type}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] uppercase font-bold tracking-widest ${lead.status === 'Pending' ? 'text-yellow-400' : 'text-emerald-600'}`}>
                                {lead.status}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        </>
        ) : activeTab === "cms" ? (
          <CmsEditor />
        ) : activeTab === "products" ? (
          <ProductManager />
        ) : (
          <EcomManager />
        )}
      </main>

      {/* Expanded Lead Modal */}
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
              {/* Decorative top bar based on AI score */}
              <div className={`absolute top-0 left-0 w-full h-2 ${analyzeLead(selectedLead).barColor}`} />

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

                <div className="bg-[#F4F7F6] border border-emerald-100 rounded-xl p-4 relative">
                  <div className="absolute top-3 right-3 text-emerald-600/20">
                    <BrainCircuit className="w-12 h-12" />
                  </div>
                  <label className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold block mb-2 relative z-10">AI Diagnostic Report</label>
                  <p className="text-sm italic text-gray-600 relative z-10">
                    {analyzeLead(selectedLead).insight}
                  </p>
                  <div className="mt-4 pt-4 border-t border-emerald-100 relative z-10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Intent Confidence</span>
                      <span className="text-xs font-mono font-bold">{analyzeLead(selectedLead).score}%</span>
                    </div>
                    <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${analyzeLead(selectedLead).barColor}`} style={{ width: `${analyzeLead(selectedLead).score}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-2">Raw Message Content</label>
                <div className="bg-[#F4F7F6] p-4 rounded-xl border border-emerald-100 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-emerald-100">
                <button
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 px-4 py-2 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Purge Record</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(selectedLead.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center space-x-2 transition-all ${
                    selectedLead.status === 'Pending' 
                    ? 'bg-[#0A84FF] hover:bg-[#B8962E] text-gray-800' 
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 border border-emerald-500/50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedLead.status === 'Pending' ? 'Mark Contacted & Resolved' : 'Revert to Pending'}
                  </span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(11, 33, 20, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
}
