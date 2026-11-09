"use client";

import React, { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Filter,
  Search,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Download,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  Edit3,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Tag,
  Share2,
} from "lucide-react";

export interface FunnelLead {
  id: string;
  bookingReference: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  normalizedMobile?: string;
  store: string;
  funnelName?: string;
  source?: string;
  campaign?: string;
  gclid?: string;
  page?: string;
  status: "New" | "Contacted" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  tags?: string[];
  submittedAt?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function AdminFunnelManager() {
  const [leads, setLeads] = useState<FunnelLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");

  // Selected lead for inspection / notes modal
  const [selectedLead, setSelectedLead] = useState<FunnelLead | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Manual Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStore, setNewStore] = useState("Kondapur");
  const [newSource, setNewSource] = useState("Walk-in / Phone Referral");
  const [newCampaign, setNewCampaign] = useState("Direct");
  const [newNotes, setNewNotes] = useState("");
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [addError, setAddError] = useState("");

  // Real-time synchronization with Firestore
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "funnelLeads"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: FunnelLead[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            bookingReference: data.bookingReference || "FCK-" + docSnap.id.slice(-6).toUpperCase(),
            name: data.name || "Inbound Patient",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "—",
            normalizedMobile: data.normalizedMobile || "",
            store: data.store || "Kondapur",
            funnelName: data.funnelName || "Free Family Health Checkup",
            source: data.source || "Website",
            campaign: data.campaign || "Direct",
            gclid: data.gclid || "",
            page: data.page || "/free-health-checkup-kondapur",
            status: (data.status as any) || "New",
            notes: data.notes || "",
            tags: data.tags || [],
            submittedAt: data.submittedAt || (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setLeads(fetched);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to funnel leads:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.bookingReference.toLowerCase().includes(q) ||
        (lead.campaign && lead.campaign.toLowerCase().includes(q)) ||
        (lead.source && lead.source.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      const matchesLocation = locationFilter === "All" || lead.store.toLowerCase() === locationFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [leads, searchQuery, statusFilter, locationFilter]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "New").length;
    const contacted = leads.filter((l) => l.status === "Contacted").length;
    const confirmed = leads.filter((l) => l.status === "Confirmed" || l.status === "Completed").length;
    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    return { total, newCount, contacted, confirmed, conversionRate };
  }, [leads]);

  // Quick Status Update
  const handleStatusChange = async (leadId: string, newStatus: FunnelLead["status"]) => {
    try {
      const docRef = doc(db, "funnelLeads", leadId);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    try {
      const docRef = doc(db, "funnelLeads", selectedLead.id);
      await updateDoc(docRef, {
        notes: editingNotes,
        updatedAt: serverTimestamp(),
      });
      setSelectedLead((prev) => (prev ? { ...prev, notes: editingNotes } : null));
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to delete this funnel lead?")) return;
    try {
      await deleteDoc(doc(db, "funnelLeads", leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // Manual Add Lead
  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setAddError("Please enter a valid patient name.");
      return;
    }

    const digits = newPhone.replace(/\D/g, "");
    if (digits.length < 10) {
      setAddError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsAddingLead(true);
    try {
      const formattedPhone = `+91 ${digits.slice(-10, -5)} ${digits.slice(-5)}`;
      const refNum = Date.now().toString().slice(-6);
      const randAlpha = Math.random().toString(36).substring(2, 5).toUpperCase();
      const bookingReference = `FCK-${refNum}${randAlpha}`;
      const nowIso = new Date().toISOString();

      await addDoc(collection(db, "funnelLeads"), {
        bookingReference,
        name: trimmedName,
        firstName: trimmedName.split(" ")[0],
        lastName: trimmedName.split(" ").slice(1).join(" "),
        phone: formattedPhone,
        normalizedMobile: `+91${digits.slice(-10)}`,
        store: newStore,
        funnelName: "Free Family Health Checkup (Kondapur)",
        source: newSource,
        campaign: newCampaign,
        gclid: "",
        page: "/free-health-checkup-kondapur",
        status: "New",
        notes: newNotes,
        tags: ["Manual Entry", newStore],
        submittedAt: nowIso,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Reset & close
      setNewName("");
      setNewPhone("");
      setNewNotes("");
      setIsAddModalOpen(false);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add lead. Please try again.");
    } finally {
      setIsAddingLead(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "Reference ID",
      "Name",
      "Phone",
      "Store",
      "Status",
      "Source",
      "Campaign",
      "GCLID",
      "Submitted At",
      "Notes",
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.bookingReference}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.store}"`,
      `"${l.status}"`,
      `"${l.source || ""}"`,
      `"${l.campaign || ""}"`,
      `"${l.gclid || ""}"`,
      `"${l.submittedAt || ""}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `airo-funnel-leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp click handler
  const getWhatsAppUrl = (phoneStr: string, name: string, ref: string) => {
    const digits = phoneStr.replace(/\D/g, "");
    const cleanNumber = digits.length === 10 ? `91${digits}` : digits;
    const text = encodeURIComponent(
      `Hello ${name}, thank you for requesting your Free 9-Vital Family Health Checkup at AIRO Health Hub Kondapur (Ref: #${ref}). What time would suit your family for the visit?`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-950">Funnel Data</h1>
            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
              Live Firestore Sync
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time customer lead captures from the Free Family Health Checkup funnel page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/free-health-checkup-kondapur"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>View Funnel Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>

          <button
            onClick={exportToCSV}
            disabled={leads.length === 0}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gray-950 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Leads</span>
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-950">{stats.total}</span>
            <span className="text-[11px] text-gray-400">All submissions</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-gradient-to-br from-white to-red-50/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">New (Action Required)</span>
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">{stats.newCount}</span>
            <span className="text-[11px] text-red-500 font-medium">Pending callback</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacted</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{stats.contacted}</span>
            <span className="text-[11px] text-gray-400">In conversation</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{stats.conversionRate}%</span>
            <span className="text-[11px] text-gray-400">{stats.confirmed} booked</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, phone (+91), ref #, campaign, source..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <span className="font-medium">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-gray-400"
          >
            <option value="All">All Statuses ({leads.length})</option>
            <option value="New">New ({stats.newCount})</option>
            <option value="Contacted">Contacted ({stats.contacted})</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-gray-400"
          >
            <option value="All">All Stores</option>
            <option value="Kondapur">Kondapur</option>
            <option value="Kompally">Kompally</option>
          </select>
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-5">Ref #</th>
                <th className="py-3 px-5">Patient Details</th>
                <th className="py-3 px-5">Direct Contact</th>
                <th className="py-3 px-5">Store & Campaign</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Notes</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Ref # */}
                  <td className="py-3.5 px-5 align-top">
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-[11px]">
                      {lead.bookingReference}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lead.submittedAt ? new Date(lead.submittedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                    </div>
                  </td>

                  {/* Patient Name */}
                  <td className="py-3.5 px-5 align-top">
                    <div className="font-bold text-gray-950 text-sm">{lead.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{lead.funnelName || "Free Health Checkup"}</div>
                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {lead.tags.map((t, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Direct Contact (Call + WhatsApp) */}
                  <td className="py-3.5 px-5 align-top">
                    <div className="font-mono font-semibold text-gray-900 text-xs">{lead.phone}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                        title="Call patient"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                      <a
                        href={getWhatsAppUrl(lead.phone, lead.name, lead.bookingReference)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>
                    </div>
                  </td>

                  {/* Store & Source */}
                  <td className="py-3.5 px-5 align-top">
                    <div className="flex items-center gap-1 font-semibold text-gray-800">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {lead.store}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1 truncate max-w-[180px]">
                      Source: <span className="font-medium text-gray-700">{lead.source || "Website"}</span>
                    </div>
                    {lead.campaign && (
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[180px]">
                        Camp: {lead.campaign}
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-5 align-top">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                      className={`text-xs font-semibold rounded-md px-2.5 py-1 border transition-colors cursor-pointer ${
                        lead.status === "New"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : lead.status === "Contacted"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : lead.status === "Confirmed"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : lead.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      <option value="New">● New</option>
                      <option value="Contacted">● Contacted</option>
                      <option value="Confirmed">● Confirmed</option>
                      <option value="Completed">● Completed</option>
                      <option value="Cancelled">● Cancelled</option>
                    </select>
                  </td>

                  {/* Notes snippet */}
                  <td className="py-3.5 px-5 align-top max-w-[200px]">
                    <div
                      onClick={() => {
                        setSelectedLead(lead);
                        setEditingNotes(lead.notes || "");
                      }}
                      className="cursor-pointer group"
                      title="Click to view/edit notes"
                    >
                      {lead.notes ? (
                        <p className="text-gray-700 text-xs line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {lead.notes}
                        </p>
                      ) : (
                        <span className="text-gray-400 italic text-[11px] group-hover:text-gray-600">
                          + Add note...
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setEditingNotes(lead.notes || "");
                        }}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="View Full Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                        <span>Loading funnel leads from Firebase...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-700">No funnel leads found</p>
                        <p className="text-gray-400">
                          {searchQuery || statusFilter !== "All"
                            ? "Try adjusting your search query or filters."
                            : "New submissions on the funnel page will appear here instantly."}
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes / Lead Inspection Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                    {selectedLead.bookingReference}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      selectedLead.status === "New"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : selectedLead.status === "Contacted"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {selectedLead.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-950 mt-1">{selectedLead.name}</h3>
                <p className="text-xs text-gray-500">
                  Store: {selectedLead.store} · Submitted:{" "}
                  {selectedLead.submittedAt ? new Date(selectedLead.submittedAt).toLocaleString() : "Recent"}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Dial Actions */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call {selectedLead.phone}
              </a>
              <a
                href={getWhatsAppUrl(selectedLead.phone, selectedLead.name, selectedLead.bookingReference)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp
              </a>
            </div>

            {/* Tracking Meta */}
            <div className="bg-gray-50 p-3.5 rounded-xl space-y-1.5 text-xs border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Source:</span>
                <span className="font-medium text-gray-800">{selectedLead.source || "Website"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Campaign:</span>
                <span className="font-medium text-gray-800">{selectedLead.campaign || "Direct"}</span>
              </div>
              {selectedLead.gclid && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Google Ads Click ID:</span>
                  <span className="font-mono text-[10px] text-gray-700 truncate max-w-[200px]">
                    {selectedLead.gclid}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Funnel Page:</span>
                <span className="font-medium text-gray-800">{selectedLead.page || "/free-health-checkup-kondapur"}</span>
              </div>
            </div>

            {/* Staff Notes Editor */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Staff Notes & Appointment Time
              </label>
              <textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="e.g. Called customer on Monday 3 PM. Patient confirmed appointment for Saturday 11:30 AM with spouse..."
                rows={3}
                className="w-full p-3 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            {/* Status Selector & Save */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                  className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-800"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-gray-950 hover:bg-gray-800 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSavingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-950">Add Funnel Lead Manually</h3>
                <p className="text-xs text-gray-500">Record a phone inquiry or walk-in patient.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddManualLead} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-900 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-900 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 9000182121"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-gray-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-900 block mb-1">Location</label>
                  <select
                    value={newStore}
                    onChange={(e) => setNewStore(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Kondapur">Kondapur</option>
                    <option value="Kompally">Kompally</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-900 block mb-1">Source</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-900 block mb-1">Notes / Preferences</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Optional notes or preferred checkup time..."
                  rows={2}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingLead}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gray-950 hover:bg-gray-800 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isAddingLead ? "Saving..." : "Save Funnel Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFunnelManager;

