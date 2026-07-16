import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { Check } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PlanSelectionScreen({ 
  token, 
  onPaymentSuccess 
}: { 
  token: string, 
  onPaymentSuccess: (details: any) => void 
}) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/membership/plans')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPlans(data.plans);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load plans');
        setLoading(false);
      });
  }, []);

  const handleJoin = async (plan: any) => {
    setProcessing(true);
    setError('');
    try {
      // 1. Create Order
      const res = await fetch('/api/membership/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId: plan.id })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id',
        amount: data.amount,
        currency: data.currency,
        name: "AIRO Essentials",
        description: `${plan.name} Membership`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          setProcessing(true);
          const verifyRes = await fetch('/api/membership/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentRecordId: data.paymentRecordId,
              planId: plan.id
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            onPaymentSuccess({ plan, membership: verifyData.membership });
          } else {
            setError(verifyData.error || 'Payment verification failed');
            setProcessing(false);
          }
        },
        theme: {
          color: "#006537"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setError('Payment cancelled or failed');
        setProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#006537] mb-4">Choose Your Plan</h2>
          <p className="text-gray-500 text-lg">Select the membership that fits your wellness journey.</p>
        </div>

        {error && <div className="text-center text-[#D02029] mb-8 bg-red-50 p-4 rounded-xl max-w-md mx-auto">{error}</div>}

        {loading ? (
          <div className="flex justify-center"><div className="animate-pulse flex gap-6"><div className="w-80 h-[500px] bg-gray-200 rounded-3xl"></div><div className="w-80 h-[500px] bg-gray-200 rounded-3xl"></div></div></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-start">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden group hover:border-[#006537] hover:shadow-md transition-all"
              >
                {plan.name.toLowerCase().includes('premium') && (
                  <div className="absolute top-0 inset-x-0 bg-[#006537] text-white text-xs font-bold text-center py-1.5 uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="mb-8 mt-4">
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-gray-500">/ {plan.duration} days</span>
                  </div>
                  {plan.description && <p className="text-gray-500 mt-4 text-sm">{plan.description}</p>}
                </div>

                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-[#006537] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleJoin(plan)}
                  disabled={processing}
                  className={`w-full py-4 rounded-xl font-medium transition-colors ${
                    plan.name.toLowerCase().includes('premium') 
                      ? 'bg-[#006537] text-white hover:bg-[#004e2a]' 
                      : 'bg-[#F8F7F4] text-[#006537] hover:bg-[#e8e6e1]'
                  } disabled:opacity-50`}
                >
                  {processing ? 'Processing...' : 'Choose Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
