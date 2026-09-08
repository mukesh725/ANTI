"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  Globe,
  SlidersHorizontal,
  X,
  Send,
  Loader2,
  Sparkles,
  HeartHandshake,
  Store,
  Clock,
  ThumbsUp,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  QrCode,
  Copy,
  Check,
  Printer,
} from "lucide-react";
import QRCode from "qrcode";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  getAllStoreFeedbacks,
  updateStoreFeedback,
  deleteStoreFeedback,
  submitStoreFeedback,
  StoreFeedback,
  RatingLevel,
  SentimentType,
  SENTIMENT_MAP,
  STORE_LOCATIONS,
} from "@/lib/feedback";

export function AdminFeedbackManager() {
  const [availableStores, setAvailableStores] = useState<string[]>(STORE_LOCATIONS);
  const [feedbacks, setFeedbacks] = useState<StoreFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>("all");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // Modals & Drawers
  const [activeReview, setActiveReview] = useState<StoreFeedback | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [managerNoteInput, setManagerNoteInput] = useState("");
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);

  // Manual Feedback Form State
  const [manualForm, setManualForm] = useState({
    name: "",
    phone: "",
    email: "",
    rating: 5 as RatingLevel,
    storeLocation: STORE_LOCATIONS[0],
    comment: "",
    staffHospitality: true,
    storeAmbiance: true,
    productAvailability: false,
    checkoutSpeed: false,
    healthScanExperience: false,
  });
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // QR Standee Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrLocation, setQrLocation] = useState(STORE_LOCATIONS[0]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const generateQrCode = async (locationName: string) => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://airoessentials.com";
      const url = `${origin}/store-feedback?location=${encodeURIComponent(locationName)}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 800,
        margin: 2,
        color: {
          dark: "#0A1128",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR Code Generation Error:", err);
    }
  };

  const handleOpenQrModal = () => {
    generateQrCode(qrLocation);
    setIsQrModalOpen(true);
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://airoessentials.com";
    const url = `${origin}/store-feedback?location=${encodeURIComponent(qrLocation)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `AIRO_Store_Feedback_QR_${qrLocation.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllStoreFeedbacks();
      setFeedbacks(data);

      // Fetch dynamic store locations
      try {
        const docRef = doc(db, "settings", "locations");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().list && Array.isArray(docSnap.data().list) && docSnap.data().list.length > 0) {
          setAvailableStores(docSnap.data().list);
          setQrLocation(docSnap.data().list[0]);
        }
      } catch (err) {
        console.warn("Could not load dynamic locations:", err);
      }
    } catch (error) {
      console.error("Failed to load feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Toggle Website Publish Status
  const handleTogglePublish = async (feedback: StoreFeedback) => {
    if (!feedback.id) return;
    const newStatus = !feedback.isPublished;

    // Optimistic UI update
    setFeedbacks((prev) =>
      prev.map((item) => (item.id === feedback.id ? { ...item, isPublished: newStatus } : item))
    );

    if (activeReview?.id === feedback.id) {
      setActiveReview((prev) => (prev ? { ...prev, isPublished: newStatus } : null));
    }

    try {
      await updateStoreFeedback(feedback.id, { isPublished: newStatus });
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      // Revert on failure
      loadData();
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (feedback: StoreFeedback) => {
    if (!feedback.id) return;
    const newFeatured = !feedback.isFeatured;

    setFeedbacks((prev) =>
      prev.map((item) => (item.id === feedback.id ? { ...item, isFeatured: newFeatured } : item))
    );

    if (activeReview?.id === feedback.id) {
      setActiveReview((prev) => (prev ? { ...prev, isFeatured: newFeatured } : null));
    }

    try {
      await updateStoreFeedback(feedback.id, { isFeatured: newFeatured });
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
      loadData();
    }
  };

  // Update Status
  const handleStatusChange = async (feedbackId: string, newStatus: StoreFeedback["status"]) => {
    setFeedbacks((prev) =>
      prev.map((item) => (item.id === feedbackId ? { ...item, status: newStatus } : item))
    );

    if (activeReview?.id === feedbackId) {
      setActiveReview((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await updateStoreFeedback(feedbackId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
      loadData();
    }
  };

  // Delete Feedback
  const handleDelete = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to permanently delete this customer feedback?")) return;

    setIsDeleting(feedbackId);
    try {
      await deleteStoreFeedback(feedbackId);
      setFeedbacks((prev) => prev.filter((item) => item.id !== feedbackId));
      if (activeReview?.id === feedbackId) {
        setActiveReview(null);
      }
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      alert("Error deleting feedback from Firebase.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Save Manager Notes
  const handleSaveNotes = async () => {
    if (!activeReview?.id) return;
    setIsUpdatingNote(true);

    try {
      await updateStoreFeedback(activeReview.id, { managerNotes: managerNoteInput });
      setActiveReview((prev) => (prev ? { ...prev, managerNotes: managerNoteInput } : null));
      setFeedbacks((prev) =>
        prev.map((item) => (item.id === activeReview.id ? { ...item, managerNotes: managerNoteInput } : item))
      );
    } catch (error) {
      console.error("Failed to save manager notes:", error);
    } finally {
      setIsUpdatingNote(false);
    }
  };

  // Submit Manual Feedback
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingManual(true);

    try {
      await submitStoreFeedback({
        name: manualForm.name,
        phone: manualForm.phone,
        email: manualForm.email,
        rating: manualForm.rating,
        sentiment: SENTIMENT_MAP[manualForm.rating].sentiment,
        storeLocation: manualForm.storeLocation,
        comment: manualForm.comment,
        aspects: {
          staffHospitality: manualForm.staffHospitality,
          storeAmbiance: manualForm.storeAmbiance,
          productAvailability: manualForm.productAvailability,
          checkoutSpeed: manualForm.checkoutSpeed,
          healthScanExperience: manualForm.healthScanExperience,
        },
        source: "manual_entry",
      });

      setIsManualModalOpen(false);
      setManualForm({
        name: "",
        phone: "",
        email: "",
        rating: 5,
        storeLocation: STORE_LOCATIONS[0],
        comment: "",
        staffHospitality: true,
        storeAmbiance: true,
        productAvailability: false,
        checkoutSpeed: false,
        healthScanExperience: false,
      });
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to add feedback");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredFeedbacks.length === 0) {
      alert("No feedbacks to export.");
      return;
    }

    const headers = ["ID", "Date", "Customer Name", "Contact Number", "Rating", "Sentiment", "Store Location", "Published", "Status", "Comment", "Manager Notes"];
    const rows = filteredFeedbacks.map((f) => [
      f.id || "",
      f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "",
      `"${(f.name || "").replace(/"/g, '""')}"`,
      `"${f.phone || ""}"`,
      f.rating,
      f.sentiment,
      `"${(f.storeLocation || "").replace(/"/g, '""')}"`,
      f.isPublished ? "YES" : "NO",
      f.status,
      `"${(f.comment || "").replace(/"/g, '""')}"`,
      `"${(f.managerNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AIRO_Store_Feedbacks_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Analytics Computations
  const stats = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) {
      return {
        total: 0,
        averageRating: "5.0",
        positiveRate: "100%",
        needsAttention: 0,
        publishedCount: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const sumRatings = feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    const avg = (sumRatings / total).toFixed(1);

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let positiveCount = 0;
    let attentionCount = 0;
    let published = 0;

    feedbacks.forEach((f) => {
      const r = (f.rating as RatingLevel) || 5;
      ratingCounts[r] = (ratingCounts[r] || 0) + 1;
      if (r >= 4) positiveCount++;
      if (r <= 2) attentionCount++;
      if (f.isPublished) published++;
    });

    const posRate = `${Math.round((positiveCount / total) * 100)}%`;

    return {
      total,
      averageRating: avg,
      positiveRate: posRate,
      needsAttention: attentionCount,
      publishedCount: published,
      ratingCounts,
    };
  }, [feedbacks]);

  // Filtering Logic
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.comment.toLowerCase().includes(query) ||
        item.storeLocation.toLowerCase().includes(query);

      // Rating
      const matchesRating = selectedRatingFilter === "all" || String(item.rating) === selectedRatingFilter;

      // Location
      const matchesLocation = selectedLocationFilter === "all" || item.storeLocation === selectedLocationFilter;

      // Status
      const matchesStatus =
        selectedStatusFilter === "all" ||
        (selectedStatusFilter === "published" && item.isPublished) ||
        (selectedStatusFilter === "featured" && item.isFeatured) ||
        item.status === selectedStatusFilter;

      return matchesSearch && matchesRating && matchesLocation && matchesStatus;
    });
  }, [feedbacks, searchQuery, selectedRatingFilter, selectedLocationFilter, selectedStatusFilter]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 font-sans text-gray-800">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif text-gray-900 tracking-tight">Store Experience Reviews</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Firebase Sync
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Physical store kiosk submissions, sentiment intelligence, customer outreach, and website social proof.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenQrModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 shadow-sm transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>In-Store QR Standee</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1128] text-white text-xs font-semibold hover:bg-gray-800 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Log In-Person Review</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total In-Store Reviews</span>
            <div className="text-3xl font-semibold text-gray-900 mt-2">{stats.total}</div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Logged across all stores</p>
          <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 p-2 rounded-xl">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Store Rating</span>
            <div className="text-3xl font-semibold text-gray-900 mt-2 flex items-center gap-1.5">
              <span>{stats.averageRating}</span>
              <span className="text-amber-400 text-xl">★</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Target benchmark &gt; 4.5</p>
          <div className="absolute top-4 right-4 bg-amber-50 text-amber-600 p-2 rounded-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Positive Experience</span>
            <div className="text-3xl font-semibold text-emerald-600 mt-2">{stats.positiveRate}</div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Rated 4★ and 5★</p>
          <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-600 p-2 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Needs Follow-Up</span>
            <div className={`text-3xl font-semibold mt-2 ${stats.needsAttention > 0 ? "text-rose-600" : "text-gray-900"}`}>
              {stats.needsAttention}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Poor or Average (1-2★)</p>
          <div className="absolute top-4 right-4 bg-rose-50 text-rose-600 p-2 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Published on Website</span>
            <div className="text-3xl font-semibold text-teal-600 mt-2">{stats.publishedCount}</div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Enabled for social proof</p>
          <div className="absolute top-4 right-4 bg-teal-50 text-teal-600 p-2 rounded-xl">
            <Globe className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Ratings Distribution Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Rating Sentiment Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map((lvl) => {
            const level = lvl as RatingLevel;
            const count = stats.ratingCounts[level] || 0;
            const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const conf = SENTIMENT_MAP[level];
            return (
              <div
                key={level}
                onClick={() => setSelectedRatingFilter(selectedRatingFilter === String(level) ? "all" : String(level))}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedRatingFilter === String(level)
                    ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                    : "border-gray-100 hover:border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <span>{conf.emoji}</span>
                    <span>{conf.label}</span>
                  </span>
                  <span className="text-xs font-bold text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      level === 5 ? "bg-emerald-500" : level === 4 ? "bg-teal-500" : level === 3 ? "bg-sky-500" : level === 2 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 mt-1 text-right">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, or comment text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Rating Filter */}
        <select
          value={selectedRatingFilter}
          onChange={(e) => setSelectedRatingFilter(e.target.value)}
          className="w-full md:w-auto px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Ratings (1 - 5 ★)</option>
          <option value="5">5 ★ Excellent</option>
          <option value="4">4 ★ Very Good</option>
          <option value="3">3 ★ Good</option>
          <option value="2">2 ★ Average</option>
          <option value="1">1 ★ Poor</option>
        </select>

        {/* Location Filter */}
        <select
          value={selectedLocationFilter}
          onChange={(e) => setSelectedLocationFilter(e.target.value)}
          className="w-full md:w-auto px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Store Locations</option>
          {availableStores.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="w-full md:w-auto px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published to Web</option>
          <option value="featured">Featured On Homepage</option>
          <option value="pending">Pending Review</option>
          <option value="follow_up">Needs Follow-Up</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Main Feedback List / Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="text-xs font-medium">Syncing store reviews from Firebase...</span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-700">No store feedback found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              No entries match the selected filters or search query. Customer submissions via the tablet kiosk will appear here live.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Customer & Contact</th>
                  <th className="py-4 px-6">Experience Rating</th>
                  <th className="py-4 px-6">Store Location</th>
                  <th className="py-4 px-6">Customer Comments & Tags</th>
                  <th className="py-4 px-6 text-center">Web Publish</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredFeedbacks.map((item) => {
                  const ratingInfo = SENTIMENT_MAP[item.rating || 5];
                  const cleanPhone = item.phone.replace(/[^0-9]/g, "");
                  const aspectCount = Object.values(item.aspects || {}).filter(Boolean).length;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/70 transition-colors group cursor-pointer"
                      onClick={() => {
                        setActiveReview(item);
                        setManagerNoteInput(item.managerNotes || "");
                      }}
                    >
                      {/* Customer & Phone */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                            {item.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                              {item.name}
                              {item.isFeatured && (
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5" onClick={(e) => e.stopPropagation()}>
                              <span className="text-gray-500">{item.phone}</span>
                              {cleanPhone && (
                                <div className="flex items-center gap-1">
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    title="Call Customer"
                                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </a>
                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${item.name}, thank you for your feedback at AIRO!`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="WhatsApp Customer"
                                    className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rating & Type */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-start gap-1">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${ratingInfo.bg} ${ratingInfo.color}`}>
                            <span>{ratingInfo.emoji}</span>
                            <span>{item.rating} ★ {ratingInfo.label}</span>
                          </div>
                          {item.feedbackType && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              item.feedbackType === "Complaint"
                                ? "bg-rose-100 text-rose-700"
                                : item.feedbackType === "Idea"
                                ? "bg-indigo-100 text-indigo-700"
                                : item.feedbackType === "Compliment"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-sky-100 text-sky-700"
                            }`}>
                              {item.feedbackType}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-[160px]">{item.storeLocation}</span>
                        </span>
                      </td>

                      {/* Comments & Badges */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-gray-800 line-clamp-2 italic font-serif text-[13px]">
                          {item.comment ? `"${item.comment}"` : <span className="text-gray-400 not-italic">No written comments</span>}
                        </p>
                        {aspectCount > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.aspects?.staffHospitality && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">Staff Care</span>
                            )}
                            {item.aspects?.storeAmbiance && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">Ambiance</span>
                            )}
                            {item.aspects?.productAvailability && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">Products</span>
                            )}
                            {item.aspects?.checkoutSpeed && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">Speed</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Publish to Web Toggle */}
                      <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            item.isPublished
                              ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm"
                              : "bg-gray-100 border-gray-200 text-gray-400 hover:text-gray-700"
                          }`}
                        >
                          <Globe className={`w-3 h-3 ${item.isPublished ? "text-teal-600" : "text-gray-400"}`} />
                          <span>{item.isPublished ? "Published" : "Hidden"}</span>
                        </button>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id!, e.target.value as StoreFeedback["status"])}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            item.status === "follow_up"
                              ? "bg-rose-50 border-rose-200 text-rose-700"
                              : item.status === "resolved"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : item.status === "published"
                              ? "bg-teal-50 border-teal-200 text-teal-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="follow_up">Needs Follow-Up</option>
                          <option value="resolved">Resolved</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item)}
                            title={item.isFeatured ? "Unfeature" : "Feature on Homepage"}
                            className={`p-1.5 rounded-lg border transition-all ${
                              item.isFeatured
                                ? "bg-amber-50 border-amber-300 text-amber-500"
                                : "bg-white border-gray-200 text-gray-400 hover:text-amber-500"
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${item.isFeatured ? "fill-amber-400" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveReview(item);
                              setManagerNoteInput(item.managerNotes || "");
                            }}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id!)}
                            disabled={isDeleting === item.id}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-200"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Notes Drawer Modal */}
      <AnimatePresence>
        {activeReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Feedback Inspection</h3>
                  <span className="text-xs text-gray-400">ID: {activeReview.id}</span>
                </div>
                <button
                  onClick={() => setActiveReview(null)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Customer Snapshot */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{activeReview.name}</h4>
                    <p className="text-xs text-gray-500">{activeReview.phone}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{activeReview.storeLocation}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600 flex items-center gap-1 justify-end">
                      <span>{activeReview.rating}</span>
                      <span className="text-amber-400 text-lg">★</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {SENTIMENT_MAP[activeReview.rating].label}
                    </span>
                    {activeReview.feedbackType && (
                      <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                        Type: {activeReview.feedbackType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Aspect Highlights */}
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Aspects Rated</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${activeReview.aspects?.staffHospitality ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                      <HeartHandshake className="w-3.5 h-3.5" /> Staff Hospitality
                    </div>
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${activeReview.aspects?.storeAmbiance ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                      <Sparkles className="w-3.5 h-3.5" /> Store Ambiance
                    </div>
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${activeReview.aspects?.productAvailability ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                      <Store className="w-3.5 h-3.5" /> Product Range
                    </div>
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${activeReview.aspects?.checkoutSpeed ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                      <Clock className="w-3.5 h-3.5" /> Quick Checkout
                    </div>
                  </div>
                </div>

                {/* Full Customer Comment */}
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Feedback</h5>
                  <div className="p-4 rounded-2xl bg-[#0A1128] text-white text-sm font-serif italic leading-relaxed">
                    {activeReview.comment ? `"${activeReview.comment}"` : "No comment written by customer."}
                  </div>
                </div>

                {/* Manager Internal Notes */}
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Internal Store Manager Follow-Up Notes
                  </h5>
                  <textarea
                    rows={4}
                    value={managerNoteInput}
                    onChange={(e) => setManagerNoteInput(e.target.value)}
                    placeholder="Document outreach (e.g. 'Called customer regarding scan booking query, offered complimentary voucher...')"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={isUpdatingNote}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all disabled:opacity-50"
                    >
                      {isUpdatingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Save Manager Note</span>
                    </button>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(activeReview)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border ${
                      activeReview.isPublished
                        ? "bg-teal-50 border-teal-200 text-teal-700"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>{activeReview.isPublished ? "Published On Website" : "Publish to Website"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(activeReview.id!)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Record</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Feedback Logging Modal */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Log In-Person Review</h3>
                  <p className="text-xs text-gray-400">Record customer feedback from reception desk or phone call.</p>
                </div>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Customer Name"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Store Location</label>
                  <select
                    value={manualForm.storeLocation}
                    onChange={(e) => setManualForm({ ...manualForm, storeLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none"
                  >
                    {availableStores.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Overall Rating</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setManualForm({ ...manualForm, rating: lvl as RatingLevel })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          manualForm.rating === lvl
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {lvl} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Customer's direct feedback..."
                    value={manualForm.comment}
                    onChange={(e) => setManualForm({ ...manualForm, comment: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingManual}
                    className="px-5 py-2 rounded-xl bg-[#0A1128] hover:bg-gray-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSubmittingManual && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save to Firebase</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* In-Store QR Standee Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">In-Store QR Counter Card</h3>
                    <p className="text-xs text-gray-400">Print or display on store tablet & counter standees.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Store Location Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Target Store Location
                </label>
                <select
                  value={qrLocation}
                  onChange={(e) => {
                    const newLoc = e.target.value;
                    setQrLocation(newLoc);
                    generateQrCode(newLoc);
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  {availableStores.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Luxury Apple-Style Physical Counter Card Preview */}
              <div
                id="printable-standee"
                className="bg-[#0A1128] text-white rounded-3xl p-6 text-center border border-white/10 shadow-xl relative overflow-hidden my-4"
              >
                {/* Ambient glow */}
                <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
                    <Store className="w-3 h-3" />
                    <span>AIRO Experience</span>
                  </div>

                  <h4 className="text-lg font-serif text-white tracking-tight mb-1">
                    How was your visit today?
                  </h4>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto mb-4">
                    Scan with your smartphone camera to share your instant feedback in under 30 seconds.
                  </p>

                  {/* QR Code Container */}
                  <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg mx-auto mb-4 border-2 border-emerald-500/30">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Store Feedback QR Code"
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] font-medium text-emerald-300 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{qrLocation}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0A1128] hover:bg-gray-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download High-Res PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
