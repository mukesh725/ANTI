"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Search, RefreshCw, Loader2, User, Phone, Mail, MapPin, Calendar, Activity } from "lucide-react";

interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob?: string;
  age?: string | number;
  gender?: string;
  address?: any;
  sources: string[];
  lastActive: Date;
}

export default function AdminCustomersManager() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const customersMap = new Map<string, CustomerData>();

      // 1. Fetch from Health Bookings
      const bookingsRef = collection(db, "healthBookings");
      const bookingsQuery = query(bookingsRef, orderBy("createdAt", "desc"));
      const bookingsSnapshot = await getDocs(bookingsQuery);

      bookingsSnapshot.forEach((doc) => {
        const data = doc.data();
        const email = data.email?.toLowerCase().trim();
        const mobile = data.mobile?.trim();
        const key = email || mobile; // Use email or mobile as unique key
        
        if (!key) return;

        const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

        if (customersMap.has(key)) {
          const existing = customersMap.get(key)!;
          if (!existing.sources.includes("Health Intake")) {
            existing.sources.push("Health Intake");
          }
          if (existing.lastActive < dateObj) existing.lastActive = dateObj;
          if (!existing.age && data.age) existing.age = data.age;
          if (!existing.gender && data.sex) existing.gender = data.sex;
        } else {
          customersMap.set(key, {
            id: `c_${doc.id}`,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: email || "",
            mobile: mobile || "",
            dob: data.dob,
            age: data.age,
            gender: data.sex,
            sources: ["Health Intake"],
            lastActive: dateObj
          });
        }
      });

      // 2. Fetch from Memberships
      const membersRef = collection(db, "members");
      const membersSnapshot = await getDocs(membersRef);

      membersSnapshot.forEach((doc) => {
        const data = doc.data();
        const email = data.email?.toLowerCase().trim();
        const mobile = data.mobile?.trim();
        const key = email || mobile;

        if (!key) return;
        
        const dateObj = data.registrationDate ? new Date(data.registrationDate) : new Date();

        let addressStr = "";
        if (data.address) {
          if (typeof data.address === 'string') {
            addressStr = data.address;
          } else {
            addressStr = `${data.address.street || ''} ${data.address.city || ''} ${data.address.state || ''} ${data.address.zipCode || ''}`.trim();
          }
        }

        if (customersMap.has(key)) {
          const existing = customersMap.get(key)!;
          if (!existing.sources.includes("Membership")) {
            existing.sources.push("Membership");
          }
          if (existing.lastActive < dateObj) existing.lastActive = dateObj;
          if (!existing.address && addressStr) existing.address = addressStr;
          if (!existing.gender && data.gender) existing.gender = data.gender;
          if (!existing.dob && data.dob) existing.dob = data.dob;
        } else {
          customersMap.set(key, {
            id: `m_${doc.id}`,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: email || "",
            mobile: mobile || "",
            dob: data.dob,
            gender: data.gender,
            address: addressStr,
            sources: ["Membership"],
            lastActive: dateObj
          });
        }
      });

      // Convert map to array and sort by latest activity
      const allCustomers = Array.from(customersMap.values());
      allCustomers.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());

      setCustomers(allCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.mobile.includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Unified Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Data synced from Health Intakes & Memberships
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchCustomers}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors border border-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Details</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Demographics</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source(s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-theme" />
                    <p>Syncing customer data...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {c.firstName?.[0] || ""}{c.lastName?.[0] || ""}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-gray-400">Last active: {c.lastActive.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" /> {c.mobile}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400" /> {c.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        {c.dob && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> {c.dob}
                          </p>
                        )}
                        {(c.age || c.gender) && (
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {c.gender} {c.age ? `• ${c.age} yrs` : ''}
                          </p>
                        )}
                        {!c.dob && !c.age && !c.gender && (
                          <span className="text-xs text-gray-400">Not provided</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-[200px] truncate">
                      {c.address ? (
                        <span title={c.address} className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" /> 
                          <span className="truncate">{c.address}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {c.sources.map(src => (
                          <span key={src} className={`px-2 py-1 text-[10px] font-bold rounded ${
                            src === 'Membership' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-theme/10 text-theme'
                          }`}>
                            {src}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-theme" />
              <p>Syncing customer data...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No customers found.
            </div>
          ) : (
            filteredCustomers.map((c) => (
              <div key={c.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {c.firstName?.[0] || ""}{c.lastName?.[0] || ""}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{c.firstName} {c.lastName}</p>
                      <div className="flex gap-1 mt-1">
                        {c.sources.map(src => (
                          <span key={src} className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                            src === 'Membership' ? 'bg-emerald-100 text-emerald-800' : 'bg-theme/10 text-theme'
                          }`}>
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                  <div className="col-span-2 flex flex-col gap-1">
                    <p className="font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {c.mobile}
                    </p>
                    <p className="text-gray-500 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {c.email}
                    </p>
                  </div>
                  {(c.dob || c.age || c.gender) && (
                    <div className="col-span-2 pt-2 border-t border-gray-200/60 flex items-center gap-4 text-gray-600">
                      {c.dob && <span>DOB: <span className="font-medium">{c.dob}</span></span>}
                      {c.age && <span>Age: <span className="font-medium">{c.age}</span></span>}
                      {c.gender && <span>Gender: <span className="font-medium">{c.gender}</span></span>}
                    </div>
                  )}
                  {c.address && (
                    <div className="col-span-2 pt-2 border-t border-gray-200/60 flex items-start gap-1 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" /> 
                      <span className="text-xs">{c.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 text-center">
          Showing {filteredCustomers.length} unified customers
        </div>
      </div>
    </div>
  );
}
