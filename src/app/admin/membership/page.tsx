"use client";

import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  User, 
  QrCode, 
  Sparkles, 
  RefreshCw,
  Eye,
  X,
  Mail,
  ShieldCheck,
  Check,
  Phone,
  Send,
  Loader2,
  Pencil,
  Trash2,
  AlertTriangle,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemberRecord, PaymentMethodType } from '@/types/membership';
import { useRef, FormEvent } from 'react';
import { CardTemplateManager } from '@/components/admin/CardTemplateManager';

export default function AdminMembershipDashboard() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'templates'>('members');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  // Activation Modal State
  const [selectedMemberToActivate, setSelectedMemberToActivate] = useState<MemberRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Cash');

  // Member Detail / Card Modal State
  const [viewingMember, setViewingMember] = useState<MemberRecord | null>(null);

  // Scanner Modal State
  const [showScanner, setShowScanner] = useState(false);
  const [scannerInput, setScannerInput] = useState('');
  const scannerInputRef = useRef<HTMLInputElement>(null);

  // Edit/Delete Modal State
  const [memberToEdit, setMemberToEdit] = useState<MemberRecord | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<MemberRecord | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (showScanner && scannerInputRef.current) {
      setTimeout(() => scannerInputRef.current?.focus(), 100);
    }
  }, [showScanner]);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) return;
    
    // Quick fetch for the exact barcode
    try {
      const url = `/api/membership/list?q=${encodeURIComponent(scannerInput.trim())}&status=ALL`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success && data.members && data.members.length === 1) {
        setViewingMember(data.members[0]);
        setShowScanner(false);
        setScannerInput('');
      } else {
        alert(data.members?.length === 0 ? "No active member found for this barcode." : "Multiple members found. Please use the standard search bar.");
      }
    } catch(err) {
      alert("Error scanning barcode. Please try again.");
    }
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (members.length === 1) {
        setViewingMember(members[0]);
      }
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const url = `/api/membership/list?q=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter]);

  const handleActivateClick = (member: MemberRecord) => {
    setSelectedMemberToActivate(member);
    setPaymentMethod('Cash');
  };

  const confirmActivation = async () => {
    if (!selectedMemberToActivate) return;
    const targetId = selectedMemberToActivate.registrationId || selectedMemberToActivate.id!;
    setActionLoadingId(targetId);

    try {
      const res = await fetch('/api/membership/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationIdOrDocId: targetId,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Activation failed');
        return;
      }

      // Close activation modal & open digital card preview for activated member
      setSelectedMemberToActivate(null);
      setViewingMember(data.member);

      // Refresh table
      fetchMembers();
    } catch (err) {
      console.error('Error activating member:', err);
      alert('Failed to activate member. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResendWelcomeEmail = async (member: MemberRecord) => {
    if (!member || !member.email) {
      alert('Member email address is missing.');
      return;
    }
    const idToMark = member.memberId || member.id || member.registrationId;
    setSendingEmailId(idToMark);

    try {
      const res = await fetch('/api/membership/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ Welcome Email successfully sent to ${member.email}! (ONE ID: ${member.memberId || 'Active'})`);
      } else {
        alert(`❌ Failed to send email: ${data.error || 'Brevo API error'}`);
      }
    } catch (err) {
      console.error('Error resending email:', err);
      alert('Failed to resend welcome email. Please check internet connection.');
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberToEdit || !memberToEdit.id) return;
    setIsSubmittingEdit(true);

    try {
      const res = await fetch('/api/membership/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: memberToEdit.id,
          updates: {
            firstName: memberToEdit.firstName,
            lastName: memberToEdit.lastName,
            email: memberToEdit.email,
            mobile: memberToEdit.mobile,
            membershipPlan: memberToEdit.membershipPlan,
            paymentStatus: memberToEdit.paymentStatus,
            membershipStatus: memberToEdit.membershipStatus,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMemberToEdit(null);
        fetchMembers(); // refresh list
      } else {
        alert(data.error || 'Failed to update member');
      }
    } catch (err) {
      console.error('Error updating member:', err);
      alert('Network error while updating member.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete || !memberToDelete.id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/membership/delete?docId=${memberToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMemberToDelete(null);
        setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      } else {
        alert(data.error || 'Failed to delete member');
      }
    } catch (err) {
      console.error('Error deleting member:', err);
      alert('Network error while deleting member.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExcelExport = () => {
    window.open('/api/membership/export', '_blank');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-sans min-h-screen bg-gray-50/50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006537]/10 text-[#006537] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight">AIRO ONE Membership Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage member records, verify manual payments, issue digital cards, resend emails, and export operational reports.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={fetchMembers}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>

          <button 
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#006537] text-white rounded-xl hover:bg-[#004e2a] transition-colors shadow-md text-sm font-bold"
          >
            <QrCode className="w-4 h-4" /> Scan Barcode / QR
          </button>

          <button 
            onClick={handleExcelExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md text-sm font-bold"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'members' ? 'border-[#006537] text-[#006537]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Members List
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'templates' ? 'border-[#006537] text-[#006537]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Card Templates
        </button>
        <a 
          href="/admin/card-designer"
          className={`pb-3 px-1 text-sm font-bold border-b-2 border-transparent text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 ml-auto`}
        >
          <Pencil className="w-4 h-4" /> Layout Designer
        </a>
      </div>
      
      {activeTab === 'templates' ? (
        <CardTemplateManager />
      ) : (
      <>


      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-gray-50/50">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchEnter}
              placeholder="Search by ID, Name, Phone, Email... (Press Enter to open)"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#006537] focus:ring-2 focus:ring-[#006537]/20 transition-all shadow-sm"
            />
          </div>

          {/* Status Tabs / Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'Pending Activation', 'Active'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === st 
                    ? 'bg-[#006537] text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {st === 'ALL' ? 'All Members' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Registration ID</th>
                <th className="p-4">Applicant Name</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Membership Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#006537] border-t-transparent rounded-full animate-spin" />
                      Loading membership data from Firebase Firestore...
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    No membership records found matching your filters.
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const isPending = m.membershipStatus === 'Pending Activation';
                  const isActive = m.membershipStatus === 'Active';
                  const isEmailSending = sendingEmailId === (m.memberId || m.id || m.registrationId);

                  return (
                    <tr key={m.id || m.registrationId} className="hover:bg-gray-50/80 transition-colors group">
                      
                      {/* Registration ID & Member ID */}
                      <td className="p-4 font-mono">
                        <span className="font-bold text-gray-900 block">{m.registrationId}</span>
                        {m.memberId && (
                          <span className="inline-block mt-1 text-[11px] font-bold text-[#006537] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {m.memberId}
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#006537]/10 text-[#006537] flex items-center justify-center font-bold text-xs">
                            {m.firstName?.[0]}{m.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{m.firstName} {m.lastName}</p>
                            <p className="text-xs text-gray-400">Reg: {new Date(m.registrationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4">
                        <p className="font-medium text-gray-800 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" /> {m.mobile}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" /> {m.email}
                        </p>
                      </td>

                      {/* Membership Plan */}
                      <td className="p-4">
                        <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                          m.membershipPlan.includes('Signature')
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : m.membershipPlan.includes('Preferred')
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {m.membershipPlan}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          m.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <CreditCard className="w-3 h-3" /> {m.paymentStatus}
                          {m.paymentMethod && <span className="opacity-75">({m.paymentMethod})</span>}
                        </span>
                      </td>

                      {/* Membership Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {m.membershipStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending ? (
                            <button
                              onClick={() => handleActivateClick(m)}
                              disabled={actionLoadingId === m.registrationId}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#006537] hover:bg-[#004e2a] text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
                            >
                              <Sparkles className="w-3.5 h-3.5" /> Activate
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setViewingMember(m)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition-colors border border-gray-200"
                                title="View Digital Membership Card"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" /> View Card
                              </button>

                              <button
                                onClick={() => handleResendWelcomeEmail(m)}
                                disabled={isEmailSending}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors border border-blue-200"
                                title="Resend Welcome Email to Customer"
                              >
                                {isEmailSending ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                ) : (
                                  <Send className="w-3.5 h-3.5 text-blue-600" />
                                )}
                                Resend Email
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => setMemberToEdit(m)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Member"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setMemberToDelete(m)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
          <p>Showing {members.length} total members in database</p>
          <p className="font-semibold text-gray-700">Firebase Collection: <span className="font-mono text-[#006537]">Members</span></p>
        </div>
      </div>

      {/* MODAL 1: Activate Membership & Select Payment Method */}
      <AnimatePresence>
        {selectedMemberToActivate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#006537]" /> Confirm &amp; Activate
                </h3>
                <button 
                  onClick={() => setSelectedMemberToActivate(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 mb-6 text-xs text-emerald-900 space-y-1.5">
                <p><strong>Applicant:</strong> {selectedMemberToActivate.firstName} {selectedMemberToActivate.lastName}</p>
                <p><strong>Reg ID:</strong> <span className="font-mono">{selectedMemberToActivate.registrationId}</span></p>
                <p><strong>Plan:</strong> {selectedMemberToActivate.membershipPlan}</p>
                <p><strong>Mobile:</strong> {selectedMemberToActivate.mobile}</p>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Payment Collection Method *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Cash', 'UPI', 'Card', 'Bank Transfer'] as PaymentMethodType[]).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                        paymentMethod === pm
                          ? 'bg-[#006537] text-white border-[#006537] shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pm}
                      {paymentMethod === pm && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug mb-6">
                <p className="font-bold mb-0.5">Automated Actions on Click:</p>
                1. Auto-generates unique sequential ONE ID (AIRO-1000001).<br/>
                2. Renders high-res QR Code &amp; Digital Membership Card.<br/>
                3. Triggers Apple-style Brevo welcome email to {selectedMemberToActivate.email}.
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMemberToActivate(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmActivation}
                  disabled={actionLoadingId !== null}
                  className="flex-1 py-3 bg-[#006537] text-white font-extrabold rounded-xl hover:bg-[#004e2a] text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoadingId ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Activate Membership
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Digital Membership Card Preview & Resend Email */}
      <AnimatePresence>
        {viewingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active AIRO ONE Digital Card
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                    {viewingMember.firstName} {viewingMember.lastName}
                  </h3>
                </div>
                <button 
                  onClick={() => setViewingMember(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Digital Card Graphic Display */}
              {viewingMember.digitalCardUrl ? (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-slate-950 p-2">
                  <img 
                    src={viewingMember.digitalCardUrl} 
                    alt="Digital Membership Card" 
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl mb-6">
                  Digital Card image rendering...
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6">
                <div>
                  <span className="text-gray-400 block font-semibold">ONE ID</span>
                  <span className="font-extrabold font-mono text-sm text-[#006537]">{viewingMember.memberId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Membership Plan</span>
                  <span className="font-bold text-gray-900">{viewingMember.membershipPlan}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Payment Status</span>
                  <span className="font-bold text-green-700">{viewingMember.paymentStatus} ({viewingMember.paymentMethod || 'Manual'})</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Activation Date</span>
                  <span className="font-medium text-gray-800">{viewingMember.activationDate ? new Date(viewingMember.activationDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Expiry Date</span>
                  <span className="font-medium text-gray-800">{viewingMember.expiryDate ? new Date(viewingMember.expiryDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Verification URL</span>
                  <a 
                    href={`/member/${viewingMember.memberId}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-bold text-blue-600 hover:underline truncate block"
                  >
                    /member/{viewingMember.memberId}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setViewingMember(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 text-xs transition-colors"
                >
                  Close
                </button>
                
                <button
                  onClick={() => handleResendWelcomeEmail(viewingMember)}
                  disabled={sendingEmailId === (viewingMember.memberId || viewingMember.id)}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {sendingEmailId === (viewingMember.memberId || viewingMember.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Resend Welcome Email
                </button>

                {viewingMember.digitalCardUrl && (
                  <a
                    href={viewingMember.digitalCardUrl}
                    download={`AIRO_ONE_${viewingMember.memberId}.svg`}
                    className="flex-1 py-3 bg-[#006537] text-white font-bold rounded-xl hover:bg-[#004e2a] text-xs shadow-lg transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download Card Graphic
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setShowScanner(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
            >
              <button 
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-20 h-20 bg-[#006537]/10 text-[#006537] rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Scan</h2>
              <p className="text-sm text-gray-500 mb-6">Point your barcode or QR scanner at the membership card. The system will automatically pull up the customer's profile.</p>

              <form onSubmit={handleScanSubmit}>
                <input 
                  type="text"
                  ref={scannerInputRef}
                  value={scannerInput}
                  onChange={(e) => setScannerInput(e.target.value)}
                  placeholder="Awaiting scan..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg font-mono focus:outline-none focus:border-[#006537] focus:ring-2 focus:ring-[#006537]/20"
                />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Edit Modal */}
      <AnimatePresence>
        {memberToEdit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-blue-600" /> Edit Member
                </h3>
                <button 
                  onClick={() => setMemberToEdit(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={memberToEdit.firstName} 
                      onChange={(e) => setMemberToEdit({...memberToEdit, firstName: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={memberToEdit.lastName} 
                      onChange={(e) => setMemberToEdit({...memberToEdit, lastName: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={memberToEdit.email} 
                      onChange={(e) => setMemberToEdit({...memberToEdit, email: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile</label>
                    <input 
                      type="tel" 
                      value={memberToEdit.mobile} 
                      onChange={(e) => setMemberToEdit({...memberToEdit, mobile: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Membership Plan</label>
                  <select
                    value={memberToEdit.membershipPlan}
                    onChange={(e) => setMemberToEdit({...memberToEdit, membershipPlan: e.target.value as any})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="AIRO ONE Select">AIRO ONE Select</option>
                    <option value="AIRO ONE Preferred">AIRO ONE Preferred</option>
                    <option value="AIRO ONE Signature">AIRO ONE Signature</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Payment Status</label>
                    <select
                      value={memberToEdit.paymentStatus}
                      onChange={(e) => setMemberToEdit({...memberToEdit, paymentStatus: e.target.value as any})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Membership Status</label>
                    <select
                      value={memberToEdit.membershipStatus}
                      onChange={(e) => setMemberToEdit({...memberToEdit, membershipStatus: e.target.value as any})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Activation">Pending Activation</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setMemberToEdit(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmittingEdit} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2">
                    {isSubmittingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-red-100 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Delete Member?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <strong>{memberToDelete.firstName} {memberToDelete.lastName}</strong>? This action cannot be undone and will completely remove them from the database.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setMemberToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
    )}
    </div>
  );
}
