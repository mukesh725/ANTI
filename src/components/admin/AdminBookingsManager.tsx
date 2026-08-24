"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { 
  Search, Loader2, CheckCircle2, User, Users, Clock, Calendar, Mail, Phone, 
  QrCode, ShieldCheck, AlertCircle, Download, Camera, X, MoreVertical, 
  Video, Play, FileText, FileUp, Filter, CalendarDays, Edit3, Trash2,
  ChevronDown, ChevronUp, Copy, Check, AlertTriangle, PhoneCall, Plus
} from "lucide-react";

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  date: string;
  timeSlot: string;
  bookingReference: string;
  status: 'Booked' | 'Confirmed' | 'Checked-In' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No-Show' | 'Rescheduled' | string;
  createdAt: any;
  isMember?: boolean;
  location?: string;
  
  // EHR / Clinical Extensions
  doctorName?: string;
  department?: string;
  visitType?: 'New' | 'Follow-up';
  visitFormat?: 'In-person' | 'Video';
  queueNumber?: string;
  paymentStatus?: 'Paid' | 'Unpaid' | string;
  checkInTime?: number; 
  consultationStartTime?: number;
  endTime?: number;
  age?: number;
  gender?: string;
  mrn?: string;
  reasonForVisit?: string;
  alertFlags?: string[];
  notes?: string;
  cancelReason?: string;
}

// Sub-components
const InitialsAvatar = ({ first, last }: { first: string, last: string }) => (
  <div className="w-10 h-10 rounded-full bg-theme/10 flex items-center justify-center flex-shrink-0 border border-theme/20">
    <span className="text-sm font-bold text-theme">
      {(first?.[0] || '') + (last?.[0] || '')}
    </span>
  </div>
);

const WaitTimeDisplay = ({ checkInTime }: { checkInTime?: number }) => {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    if (!checkInTime) return;
    const calc = () => setMins(Math.floor((Date.now() - checkInTime) / 60000));
    calc();
    const int = setInterval(calc, 60000);
    return () => clearInterval(int);
  }, [checkInTime]);

  if (!checkInTime) return null;
  return (
    <span className={`text-xs font-bold ${mins > 20 ? 'text-red-500' : 'text-orange-500'}`}>
      Wait: {mins}m
    </span>
  );
};

export function AdminBookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Available Locations
  const [availableLocations, setAvailableLocations] = useState<string[]>(["Kondapur", "Kompally"]);
  
  // Add Location Modal
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  
  // Delete Location Modal
  const [isDeleteLocationModalOpen, setIsDeleteLocationModalOpen] = useState(false);
  const [isDeletingLocation, setIsDeletingLocation] = useState(false);
  
  const MAX_FREE_MEMBERS = 100000;
  const totalMembers = bookings.length;
  
  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<"Today" | "Upcoming" | "Past" | "All">("Today");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>("All Locations");
  
  // Modals
  const [showScanner, setShowScanner] = useState(false);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  
  // Reschedule Modal State
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState("");
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const dateOptions: { value: string; label: string; isWeekend: boolean }[] = [];
  const today = new Date();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    if (!isWeekend) {
      dateOptions.push({
        value: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        isWeekend
      });
    }
    if (dateOptions.length >= 10) break;
  }

  useEffect(() => {
    if (rescheduleDate && rescheduleModalBooking) {
      setIsFetchingSlots(true);
      fetch(`/api/bookings/available-slots?date=${rescheduleDate}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRescheduleSlots(data.availableSlots);
          }
        })
        .finally(() => setIsFetchingSlots(false));
    }
  }, [rescheduleDate, rescheduleModalBooking]);

  const handleConfirmReschedule = () => {
    if (rescheduleModalBooking && rescheduleDate && selectedRescheduleSlot) {
      handleUpdateStatus(rescheduleModalBooking.id, 'Rescheduled', { date: rescheduleDate, timeSlot: selectedRescheduleSlot });
      setRescheduleModalBooking(null);
      setRescheduleDate("");
      setSelectedRescheduleSlot("");
    }
  };
  const [cancelReason, setCancelReason] = useState("");

  const handleAddNewLocation = async () => {
    if (!newLocationName.trim()) return;
    setIsSavingLocation(true);
    try {
      const updatedList = [...availableLocations, newLocationName.trim()];
      setAvailableLocations(updatedList);
      
      const locRef = doc(db, "settings", "locations");
      await setDoc(locRef, { list: updatedList }, { merge: true });
      
      setSelectedLocationFilter(newLocationName.trim());
      setIsAddLocationModalOpen(false);
      setNewLocationName("");
    } catch(err) {
      console.error("Failed to add location", err);
    } finally {
      setIsSavingLocation(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (selectedLocationFilter === "All Locations") return;
    setIsDeletingLocation(true);
    try {
      const updatedList = availableLocations.filter(loc => loc !== selectedLocationFilter);
      setAvailableLocations(updatedList);
      
      const locRef = doc(db, "settings", "locations");
      await setDoc(locRef, { list: updatedList }, { merge: true });
      
      setSelectedLocationFilter("All Locations");
      setIsDeleteLocationModalOpen(false);
    } catch(err) {
      console.error("Failed to delete location", err);
    } finally {
      setIsDeletingLocation(false);
    }
  };

  // Expandable row state
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Overflow menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Close dropdown on click outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Load available locations
      try {
        const locRef = doc(db, "settings", "locations");
        const locSnap = await getDoc(locRef);
        if (locSnap.exists() && locSnap.data().list?.length > 0) {
          setAvailableLocations(locSnap.data().list);
        }
      } catch(err) {
        console.error("Error loading locations:", err);
      }

      // Real-time listener for bookings
      const bookingsRef = collection(db, "healthBookings");
      const q = query(bookingsRef, orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const loadedBookings: Booking[] = [];
        const emailsToCheck = new Set<string>();

        snapshot.forEach(doc => {
          const data = doc.data() as Omit<Booking, 'id'>;
          loadedBookings.push({ id: doc.id, ...data });
          if (data.email) emailsToCheck.add(data.email.toLowerCase());
        });

        // Fetch memberships to badge them
        const memberEmails = new Set<string>();
        if (emailsToCheck.size > 0) {
          const memSnapshot = await getDocs(collection(db, "memberships"));
          memSnapshot.forEach(doc => {
            const m = doc.data();
            if (m.status === 'Active' && m.email) {
              memberEmails.add(m.email.toLowerCase());
            }
          });
        }

        const finalBookings = loadedBookings.map(b => ({
          ...b,
          isMember: memberEmails.has(b.email.toLowerCase())
        }));

        setBookings(finalBookings);
        setIsLoading(false);
      }, (error) => {
        console.error("Error loading live bookings:", error);
        setIsLoading(false);
      });

      return unsubscribe;
    };

    fetchData();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = bookings;

    // 1. Tab Filter
    const todayStr = new Date().toISOString().split('T')[0];
    if (activeTab === "Today") {
      result = result.filter(b => b.date === todayStr);
    } else if (activeTab === "Upcoming") {
      result = result.filter(b => b.date > todayStr);
    } else if (activeTab === "Past") {
      result = result.filter(b => b.date < todayStr);
    }

    // 1.5 Location Filter
    if (selectedLocationFilter !== "All Locations") {
      result = result.filter(b => b.location === selectedLocationFilter);
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.bookingReference?.toLowerCase().includes(q) ||
        b.firstName?.toLowerCase().includes(q) ||
        b.lastName?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.mobile?.includes(q) ||
        b.mrn?.toLowerCase().includes(q)
      );
    }

    setFilteredBookings(result);
  }, [searchQuery, bookings, activeTab, selectedLocationFilter]);

  // Handle Scanner Initialization
  useEffect(() => {
    if (!showScanner) return;
    let scanner: any = null;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode("qr-reader");
      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          if (decodedText) {
            setSearchQuery(decodedText.trim());
            setShowScanner(false);
          }
        },
        () => {}
      ).catch(console.error);
    });

    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().then(() => scanner.clear()).catch(console.error);
      }
    };
  }, [showScanner]);

  const handleUpdateStatus = async (id: string, newStatus: string, additionalFields: any = {}) => {
    setUpdatingId(id);
    try {
      if (newStatus === 'Checked-In') {
        additionalFields.checkInTime = Date.now();
      } else if (newStatus === 'In Consultation') {
        additionalFields.consultationStartTime = Date.now();
      } else if (newStatus === 'Completed') {
        additionalFields.endTime = Date.now();
      }

      await fetch('/api/bookings/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, status: newStatus, ...additionalFields })
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  const handleResendEmail = async (id: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch('/api/bookings/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id })
      });
      const data = await response.json();
      if (data.success) {
        alert("Email resent successfully!");
      } else {
        alert("Failed to resend email: " + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error resending email:", error);
      alert("Error resending email");
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) return;
    
    setUpdatingId(id);
    try {
      await fetch('/api/bookings/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id })
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking");
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Booking Reference", "Patient", "Email", "Mobile", "Date", "Time", "Status", "Doctor", "MRN"];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map(b => 
        [
          b.bookingReference || "N/A",
          `"${b.firstName} ${b.lastName}"`,
          b.email,
          `"${b.mobile}"`,
          b.date,
          b.timeSlot,
          b.status,
          b.doctorName || "N/A",
          b.mrn || "N/A"
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `health_intakes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const generateMockData = async () => {
    setIsLoading(true);
    for (const b of bookings) {
      if (!b.mrn) {
        const ref = doc(db, 'healthBookings', b.id);
        await updateDoc(ref, {
          mrn: `MRN-${Math.floor(Math.random() * 90000) + 10000}`,
          doctorName: ['Dr. Sarah Chen', 'Dr. James Wilson', 'Dr. Emily Brown'][Math.floor(Math.random() * 3)],
          department: 'General Health',
          age: Math.floor(Math.random() * 50) + 20,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          visitType: Math.random() > 0.7 ? 'Follow-up' : 'New',
          visitFormat: Math.random() > 0.8 ? 'Video' : 'In-person',
          paymentStatus: Math.random() > 0.2 ? 'Paid' : 'Unpaid'
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      
      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Scan QR Code</h3>
              <button onClick={() => setShowScanner(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-gray-50">
              <div id="qr-reader" className="w-full rounded-xl overflow-hidden"></div>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      {isAddLocationModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-6">
            <button 
              onClick={() => setIsAddLocationModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Location</h3>
            <p className="text-sm text-gray-500 mb-4">This location will be added to the booking options immediately.</p>
            <input 
              type="text"
              placeholder="e.g. Banjara Hills"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-theme transition-colors mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAddLocationModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddNewLocation}
                disabled={!newLocationName.trim() || isSavingLocation}
                className="flex-1 py-3 bg-theme text-paper font-bold text-sm rounded-xl hover:bg-theme/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Location"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Location Modal */}
      {isDeleteLocationModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-6">
            <button 
              onClick={() => setIsDeleteLocationModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Location</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete the location <strong className="text-gray-900">"{selectedLocationFilter}"</strong>? This will remove it from the booking page.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteLocationModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteLocation}
                disabled={isDeletingLocation}
                className="flex-1 py-3 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeletingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Location"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reason Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">Cancel Booking</h3>
              <p className="text-sm text-gray-500 mb-4">Please provide a reason for cancelling {cancelModalBooking.firstName}'s appointment.</p>
              <textarea 
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500"
                rows={3}
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="e.g. Patient requested cancellation..."
              />
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => { setCancelModalBooking(null); setCancelReason(""); }}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Nevermind
                </button>
                <button 
                  disabled={!cancelReason.trim()}
                  onClick={() => {
                    handleUpdateStatus(cancelModalBooking.id, 'Cancelled', { cancelReason });
                    setCancelModalBooking(null);
                    setCancelReason("");
                  }}
                  className="px-4 py-2 text-sm font-bold bg-red-500 text-white hover:bg-red-600 rounded-lg disabled:opacity-50"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalBooking && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">Reschedule Booking</h3>
              <p className="text-sm text-gray-500 mb-4">Select a new date and time for {rescheduleModalBooking.firstName}'s appointment.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Date</label>
                  <input 
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={rescheduleDate}
                    onChange={(e) => {
                      setRescheduleDate(e.target.value);
                      setSelectedRescheduleSlot(""); // Reset slot when date changes
                    }}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-theme"
                  />
                </div>

                {rescheduleDate && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Available Times</label>
                    {rescheduleSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {rescheduleSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedRescheduleSlot(slot)}
                            className={`p-2 text-xs font-medium rounded-lg border ${
                              selectedRescheduleSlot === slot 
                                ? 'bg-theme text-white border-theme' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-theme'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No available slots for this date.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => { 
                    setRescheduleModalBooking(null); 
                    setRescheduleDate(""); 
                    setSelectedRescheduleSlot(""); 
                  }}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  disabled={!rescheduleDate || !selectedRescheduleSlot}
                  onClick={handleConfirmReschedule}
                  className="px-4 py-2 text-sm font-bold bg-theme text-white hover:bg-theme/90 rounded-lg disabled:opacity-50"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-theme/20 text-theme text-[10px] font-bold uppercase tracking-widest shadow-sm">
              Clinical EHR
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Health Intakes</h1>
          <p className="text-sm text-gray-500 mb-6 max-w-xl">
            Manage patient flow, track wait times, and update consultation statuses in real-time.
          </p>

          {/* AIRO ONE Select Progress Bar */}
          <div className="max-w-md bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
              <span className="text-gray-500 flex items-center gap-1"><Users className="w-3.5 h-3.5"/> Free Health Intakes</span>
              <span className="text-[#006537]">{Math.max(0, MAX_FREE_MEMBERS - totalMembers).toLocaleString('en-IN')} Left</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className="bg-[#006537] h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (totalMembers / MAX_FREE_MEMBERS) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-semibold text-gray-400">Total Registered: {totalMembers.toLocaleString('en-IN')} / 1,00,000</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={generateMockData}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Mock Data
          </button>
          <button 
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 bg-white border border-theme text-theme px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-theme/5 transition-colors"
          >
            <Camera className="w-4 h-4" /> Scan
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-theme text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex flex-col md:flex-row gap-2">
        <div className="flex p-1 bg-gray-100/50 rounded-xl">
          {["Today", "Tomorrow", "Upcoming", "Past", "All"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, MRN, phone, or SCN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full min-h-[44px] pl-10 pr-4 bg-transparent border-none focus:outline-none text-sm placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedLocationFilter}
            onChange={e => setSelectedLocationFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-theme transition-colors"
          >
            <option value="All Locations">All Locations</option>
            {availableLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsAddLocationModalOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-xl transition-colors"
            title="Add Location"
          >
            <Plus className="w-4 h-4" />
          </button>
          {selectedLocationFilter !== "All Locations" && (
            <button 
              onClick={() => setIsDeleteLocationModalOpen(true)}
              className="bg-red-50 hover:bg-red-100 text-red-500 p-2.5 rounded-xl transition-colors"
              title="Delete Location"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border-l border-gray-100 text-gray-500 hover:bg-gray-50 rounded-r-xl transition-colors text-sm font-bold">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-visible">
        {isLoading && bookings.length === 0 ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-4 py-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-50 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <CalendarDays className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No appointments found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              There are no matching records for the selected date range or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[300px]">Patient</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule & Wait</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => {
                  
                  const isExpanded = expandedRow === booking.id;
                  
                  // Primary Action Logic
                  let primaryAction = null;
                  if (['Confirmed', 'Booked', 'Rescheduled'].includes(booking.status)) {
                    primaryAction = { label: 'Check-In', status: 'Checked-In', icon: CheckCircle2, color: 'bg-theme hover:bg-blue-600 text-white' };
                  } else if (booking.status === 'Checked-In') {
                    if (booking.visitFormat === 'Video') {
                      primaryAction = { label: 'Join Call', status: 'In Consultation', icon: Video, color: 'bg-theme hover:bg-black text-white' };
                    } else {
                      primaryAction = { label: 'Start Consult', status: 'In Consultation', icon: Play, color: 'bg-theme hover:bg-black text-white' };
                    }
                  } else if (booking.status === 'In Consultation') {
                    primaryAction = { label: 'Complete', status: 'Completed', icon: CheckCircle2, color: 'bg-green-600 hover:bg-green-700 text-white' };
                  }

                  return (
                    <React.Fragment key={booking.id}>
                      <tr className={`hover:bg-gray-50/50 transition-colors group ${isExpanded ? 'bg-gray-50/50' : ''}`}>
                        
                        {/* 1. Patient Column */}
                        <td className="py-4 px-6 align-top">
                          <div className="flex items-start gap-3">
                            <InitialsAvatar first={booking.firstName} last={booking.lastName} />
                            <div>
                              <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5 cursor-pointer hover:text-theme" onClick={() => setExpandedRow(isExpanded ? null : booking.id)}>
                                {booking.firstName} {booking.lastName}
                                {booking.isMember && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-theme" />
                                )}
                              </p>
                              <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                                <span>{booking.age || '--'} yrs • {booking.gender?.[0] || '-'}</span>
                                {booking.mrn && (
                                  <span className="font-mono bg-gray-100 px-1 rounded">MRN: {booking.mrn}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Reference Column */}
                        <td className="py-4 px-6 align-top">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 border border-gray-200">
                            <QrCode className="w-3 h-3 text-gray-500" />
                            <span className="text-xs font-mono font-bold text-gray-700">{booking.bookingReference}</span>
                          </div>
                        </td>

                        {/* 3. Schedule & Wait Column */}
                        <td className="py-4 px-6 align-top">
                          <p className="text-sm font-bold text-gray-900">{booking.timeSlot}</p>
                          <div className="mt-1">
                            {booking.status === 'Checked-In' ? (
                              <WaitTimeDisplay checkInTime={booking.checkInTime} />
                            ) : (
                              <span className="text-xs text-gray-500 flex flex-col gap-0.5">
                                <span>{isNaN(new Date(booking.date).getTime()) ? booking.date : new Date(booking.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })}</span>
                                {booking.location && (
                                  <div className="flex items-center gap-1 group relative w-max">
                                    <select
                                      value={booking.location}
                                      onChange={(e) => handleUpdateStatus(booking.id, booking.status, { location: e.target.value })}
                                      className="font-bold text-theme bg-transparent border-none focus:outline-none appearance-none cursor-pointer py-0 pl-0 pr-4 text-xs hover:underline"
                                    >
                                      {availableLocations.map(loc => (
                                        <option key={loc} value={loc} className="text-gray-900">{loc}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="w-3 h-3 text-theme absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                )}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. Status Column */}
                        <td className="py-4 px-6 align-top">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            booking.status === 'Checked-In' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            booking.status === 'In Consultation' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            booking.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                            booking.status === 'Cancelled' || booking.status === 'No-Show' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {booking.status}
                          </span>
                        </td>

                        {/* 5. Actions Column */}
                        <td className="py-4 px-6 align-top text-right relative" ref={openMenuId === booking.id ? menuRef : null}>
                          <div className="flex items-center justify-end gap-2">
                            {primaryAction && (
                              <button 
                                onClick={() => handleUpdateStatus(booking.id, primaryAction.status)}
                                disabled={updatingId === booking.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all disabled:opacity-50 ${primaryAction.color}`}
                              >
                                {updatingId === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <primaryAction.icon className="w-3.5 h-3.5" />}
                                {primaryAction.label}
                              </button>
                            )}
                            
                            <button 
                              onClick={() => setExpandedRow(isExpanded ? null : booking.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            <button 
                              onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Overflow Menu */}
                          {openMenuId === booking.id && (
                            <div className="absolute right-6 top-14 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-left animate-in fade-in slide-in-from-top-2">
                              <div className="px-3 py-1.5 mb-1 border-b border-gray-50">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Quick Actions</p>
                              </div>
                              
                              <button 
                                onClick={() => {
                                  setRescheduleModalBooking(booking);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CalendarDays className="w-4 h-4 text-gray-400" /> Reschedule
                              </button>
                              
                              <button 
                                onClick={() => setCancelModalBooking(booking)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <X className="w-4 h-4 text-red-500" /> Cancel Booking
                              </button>

                              <button 
                                onClick={() => handleResendEmail(booking.id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Mail className="w-4 h-4 text-gray-400" /> Resend Email
                              </button>

                              <button 
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" /> Delete Booking
                              </button>
                              
                              <button 
                                onClick={() => handleUpdateStatus(booking.id, 'No-Show')}
                                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                              >
                                <AlertTriangle className="w-4 h-4 text-orange-500" /> Mark No-Show
                              </button>

                              <div className="my-1 border-t border-gray-50"></div>
                              
                              <a href={`tel:${booking.mobile}`} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <PhoneCall className="w-4 h-4 text-gray-400" /> Call {booking.mobile}
                              </a>
                              <a href={`mailto:${booking.email}`} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" /> Email Patient
                              </a>

                              <div className="my-1 border-t border-gray-50"></div>

                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Edit3 className="w-4 h-4 text-gray-400" /> Add Internal Note
                              </button>
                              <button 
                                onClick={() => copyToClipboard(booking.bookingReference)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4 text-gray-400" /> Copy Ref ID
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Row Content */}
                      {isExpanded && (
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <td colSpan={5} className="px-6 pb-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
                              
                              {/* Contact & Demo */}
                              <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                  <User className="w-3.5 h-3.5" /> Demographics & Contact
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between border-b border-gray-50 pb-1">
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="font-medium">{booking.mobile}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-50 pb-1">
                                    <span className="text-gray-500">Email:</span>
                                    <span className="font-medium">{booking.email}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-50 pb-1">
                                    <span className="text-gray-500">MRN:</span>
                                    <span className="font-mono font-bold">{booking.mrn || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-50 pb-1">
                                    <span className="text-gray-500">DOB / Age:</span>
                                    <span className="font-medium">{booking.age ? `${booking.age} yrs` : 'N/A'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Administrative */}
                              <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                  <ShieldCheck className="w-3.5 h-3.5" /> Administrative
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between border-b border-gray-50 pb-1">
                                    <span className="text-gray-500">Ref ID:</span>
                                    <span className="font-mono font-bold flex items-center gap-1">
                                      {booking.bookingReference}
                                      <button onClick={() => copyToClipboard(booking.bookingReference)} className="text-theme hover:bg-blue-50 p-1 rounded">
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-50 pb-1">
                                    <span className="text-gray-500">Booked on:</span>
                                    <span className="font-medium">{new Date(booking.createdAt?.toDate?.() || Date.now()).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                                  </div>
                                  <div className="pt-2 flex gap-2">
                                    <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 border border-gray-200">
                                      <FileUp className="w-3.5 h-3.5" /> Upload Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
