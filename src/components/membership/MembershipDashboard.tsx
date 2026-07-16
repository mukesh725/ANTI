import { useState, useEffect } from 'react';
import { LogOut, Download, Clock, CreditCard, ChevronRight } from 'lucide-react';
import DigitalCard from './DigitalCard';

export default function MembershipDashboard({ 
  token, 
  onLogout 
}: { 
  token: string, 
  onLogout: () => void 
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/membership/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse w-12 h-12 rounded-full border-4 border-[#006537] border-t-transparent animate-spin"></div></div>;
  }

  if (!data || !data.user) {
    return <div className="text-center py-20 text-[#D02029]">Failed to load dashboard</div>;
  }

  const { user, membership } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#006537]">Welcome, {user.firstName}</h1>
          <p className="text-gray-500 mt-1">Manage your AIRO membership</p>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-[#D02029] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col - Card & Status */}
        <div className="lg:col-span-1 space-y-6">
          <DigitalCard membership={membership} plan={membership?.plan} user={user} />
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Membership Status</h3>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">{membership?.status}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-500">Plan</span>
              <span className="font-medium">{membership?.plan?.name}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-500">Expiry</span>
              <span className="font-medium">{new Date(membership?.expiryDate).toLocaleDateString()}</span>
            </div>
            
            <div className="mt-6 space-y-3">
              <button className="w-full bg-[#006537] text-white py-3 rounded-xl font-medium hover:bg-[#004e2a] transition-colors">
                Renew Membership
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                <Download size={18} /> Download Card PDF
              </button>
            </div>
          </div>
        </div>

        {/* Right Col - Details & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Details */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-6">Profile Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                <p className="font-medium">+91 {user.mobile}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                <p className="font-medium">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                <p className="font-medium">{user.bloodGroup || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Transaction History</h3>
            </div>
            
            <div className="space-y-4">
              {membership?.transactions?.length > 0 ? (
                membership.transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <CreditCard size={20} className="text-[#006537]" />
                      </div>
                      <div>
                        <p className="font-medium">{tx.type} Membership</p>
                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{tx.amount}</p>
                      <p className="text-xs text-green-600 font-medium">Success</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={32} className="mx-auto mb-3 opacity-20" />
                  <p>No transactions found</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
