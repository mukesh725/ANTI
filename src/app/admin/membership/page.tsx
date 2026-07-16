"use client";

import { useState, useEffect } from 'react';
import { Search, Download, Plus, Filter, MoreVertical, CreditCard, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminMembershipPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Note: In a real implementation, you would fetch from a secure admin API
  // useEffect(() => { fetchAdminData() }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#006537] tracking-tight">Membership Management</h1>
          <p className="text-gray-500 mt-1">Manage AIRO members, view payments, and issue complimentary plans.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={18} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#006537] text-white rounded-xl hover:bg-[#004e2a] transition-colors shadow-sm font-medium">
            <Plus size={18} /> New Membership
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Phone or Email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#006537] focus:ring-1 focus:ring-[#006537] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Member</th>
                <th className="p-4 font-medium">Membership ID</th>
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Expiry</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Dummy row for demonstration */}
              <tr className="hover:bg-gray-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">+91 9876543210</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">AIRO000000001</span>
                </td>
                <td className="p-4 text-gray-600">Premium</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">ACTIVE</span>
                </td>
                <td className="p-4 text-gray-600">Oct 24, 2027</td>
                <td className="p-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <p>Showing 1 of 1 members</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
