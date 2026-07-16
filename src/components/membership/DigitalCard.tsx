import { User } from 'lucide-react';

export default function DigitalCard({ membership, plan, user }: { membership: any, plan: any, user?: any }) {
  if (!membership) return null;
  
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#333333] text-white p-6 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden text-left">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#006537] opacity-20 rounded-bl-full"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-bold tracking-tighter">AIRO</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Membership</p>
        </div>
        <div className="bg-[#006537] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {plan?.name || 'Member'}
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Membership ID</p>
        <p className="text-2xl font-mono tracking-widest">{membership.membershipId.match(/.{1,4}/g)?.join(' ')}</p>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div>
          {user ? (
            <p className="font-medium text-lg uppercase tracking-wide">{user.firstName} {user.lastName}</p>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <User size={16} />
              <span className="text-sm">Exclusive Member</span>
            </div>
          )}
          <p className="text-gray-400 text-xs mt-1">
            Valid thru {new Date(membership.expiryDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
          </p>
        </div>
        
        {membership.qrCode && (
          <div className="bg-white p-2 rounded-xl">
            <img src={membership.qrCode} alt="QR Code" className="w-16 h-16" />
          </div>
        )}
      </div>
    </div>
  );
}
