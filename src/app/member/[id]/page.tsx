"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Calendar, User, Phone, Mail, Award, Sparkles, AlertTriangle } from 'lucide-react';
import { MemberRecord } from '@/types/membership';

export default function PublicMemberVerificationPage() {
  const params = useParams();
  const id = params?.id as string;

  const [member, setMember] = useState<MemberRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchMemberData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/membership/list?q=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.success && data.members && data.members.length > 0) {
          const cleanId = id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const match = data.members.find((m: MemberRecord) => {
            const mIdClean = (m.memberId || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const regIdClean = (m.registrationId || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const docIdClean = (m.id || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            return (
              mIdClean === cleanId ||
              regIdClean === cleanId ||
              docIdClean === cleanId ||
              m.memberId === id ||
              m.registrationId === id ||
              m.id === id
            );
          });

          if (match) {
            setMember(match);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error verifying member:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMemberData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center items-center p-4">
        <div className="w-12 h-12 border-4 border-[#006537] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium text-sm">Verifying AIRO ONE Membership credentials...</p>
      </div>
    );
  }

  if (notFound || !member) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center items-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Membership Not Found</h1>
          <p className="text-sm text-gray-500 mt-2">
            No active AIRO ONE membership record was found matching ID: <span className="font-mono font-bold text-gray-800">{id}</span>.
          </p>
          <a
            href="/membership"
            className="inline-block mt-6 px-6 py-3 bg-[#006537] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#004e2a] transition-all"
          >
            Apply for AIRO ONE Membership
          </a>
        </div>
      </div>
    );
  }

  const isActive = member.membershipStatus === 'Active';
  const expiryFormatted = member.expiryDate 
    ? new Date(member.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-20 pb-16 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Verification Status Header */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
            isActive ? 'bg-emerald-100 text-[#006537] ring-8 ring-emerald-50' : 'bg-amber-100 text-amber-800'
          }`}>
            {isActive ? <ShieldCheck className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
          </div>

          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${
            isActive ? 'bg-emerald-600 text-white shadow' : 'bg-amber-500 text-white'
          }`}>
            <CheckCircle2 className="w-4 h-4" /> Official Verification: {member.membershipStatus.toUpperCase()}
          </span>

          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            {member.firstName} {member.lastName}
          </h1>

          <p className="text-sm font-bold text-[#006537] mt-1 font-mono tracking-wider">
            MEMBER ID: {member.memberId || 'PENDING ACTIVATION'}
          </p>
        </div>

        {/* Digital Membership Card Preview */}
        {member.digitalCardUrl && (
          <div className="mb-6 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-slate-950 p-2">
            <img 
              src={member.digitalCardUrl} 
              alt="Digital Membership Card" 
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        )}

        {/* Member Details Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#006537]" /> Membership Credentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-gray-400 font-semibold block">Membership Plan</span>
              <span className="font-extrabold text-sm text-[#006537] mt-0.5 block">{member.membershipPlan}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-gray-400 font-semibold block">Valid Until</span>
              <span className="font-bold text-sm text-gray-900 mt-0.5 block">{expiryFormatted}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-gray-400 font-semibold block">Payment Status</span>
              <span className="font-bold text-sm text-green-700 mt-0.5 block">{member.paymentStatus}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-gray-400 font-semibold block">Registration ID</span>
              <span className="font-mono font-bold text-sm text-gray-800 mt-0.5 block">{member.registrationId}</span>
            </div>
          </div>

          <div className="pt-4 text-center border-t border-gray-100 text-xs text-gray-400">
            AIRO ONE Membership System • Verified by AIRO Essentials &amp; AIRO Health
          </div>
        </div>

      </div>
    </div>
  );
}
