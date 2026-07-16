import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OtpVerificationScreen({ 
  mobile, 
  onVerified 
}: { 
  mobile: string, 
  onVerified: (token: string, isNewUser: boolean) => void 
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if all filled
    if (value && index === 5 && newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpString: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/membership/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: otpString })
      });
      const data = await res.json();
      if (res.ok) {
        onVerified(data.token, data.isNewUser);
      } else {
        setError(data.error || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center"
      >
        <h2 className="text-2xl font-semibold mb-2">Verify Mobile</h2>
        <p className="text-gray-500 mb-8">We've sent a code to <br/><span className="font-medium text-gray-900">+91 {mobile}</span></p>
        
        <div className="flex gap-3 justify-center mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={e => handleChange(i, e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-gray-200 focus:outline-none focus:border-[#006537] focus:ring-1 focus:ring-[#006537] transition-all bg-gray-50 focus:bg-white"
            />
          ))}
        </div>
        
        {error && <p className="text-[#D02029] text-sm mb-4">{error}</p>}
        
        <button 
          onClick={() => handleVerify(otp.join(''))}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-[#006537] text-white py-4 rounded-xl font-medium hover:bg-[#004e2a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          Didn't receive code? <button className="text-[#006537] font-medium ml-1">Resend</button>
        </div>
      </motion.div>
    </div>
  );
}
