import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

export default function MobileInputScreen({ 
  mobile, 
  setMobile, 
  onNext 
}: { 
  mobile: string, 
  setMobile: (v: string) => void, 
  onNext: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/membership/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      if (res.ok) {
        onNext();
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-semibold mb-2">Let's get started</h2>
        <p className="text-gray-500 mb-8">Enter your mobile number to join or login</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
              <Phone size={18} />
              <span className="font-medium">+91</span>
              <div className="w-px h-5 bg-gray-200 ml-1"></div>
            </div>
            <input 
              type="tel" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Mobile Number"
              className="w-full pl-[90px] pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#006537] focus:ring-1 focus:ring-[#006537] transition-all text-lg"
              autoFocus
            />
          </div>
          
          {error && <p className="text-[#D02029] text-sm mb-4">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading || mobile.length !== 10}
            className="w-full bg-[#006537] text-white py-4 rounded-xl font-medium hover:bg-[#004e2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Sending...' : 'Continue'} <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
