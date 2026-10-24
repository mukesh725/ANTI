import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Store } from 'lucide-react';

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
  const [billingCycle, setBillingCycle] = useState<'Quarterly' | 'Annual'>('Quarterly');

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

      // 1.5. Bypass Razorpay if dummy key is used
      if (data.orderId.startsWith('dummy_')) {
        const verifyRes = await fetch('/api/membership/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            razorpay_order_id: data.orderId,
            razorpay_payment_id: 'dummy_payment_id',
            razorpay_signature: 'dummy_signature',
            paymentRecordId: data.paymentRecordId,
            planId: plan.id
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          onPaymentSuccess({ plan, membership: verifyData.membership });
        } else {
          setError(verifyData.error || 'Payment verification failed');
          setProcessing(false);
        }
        return;
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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="bg-emerald-100 text-[#006537] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            🏪 In-Store Membership Enrollment
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold text-[#006537] mb-4">Choose Your Plan</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Select the membership tier and billing frequency that fits your wellness journey.
          </p>
        </div>

        {/* In-Store Payment Banner */}
        <div className="max-w-3xl mx-auto mb-10 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
          <Store className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-amber-900">In-Store Payment &amp; Activation</p>
            <p className="text-amber-800 mt-0.5 leading-relaxed">
              AIRO ONE memberships are issued and paid in-store (Cash, UPI, or Card) at any AIRO Clinic or Pharmacy. No online gateway payment is charged now.
            </p>
          </div>
        </div>

        {/* Billing Frequency Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => setBillingCycle('Quarterly')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                billingCycle === 'Quarterly'
                  ? 'bg-[#006537] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Quarterly Payments</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${billingCycle === 'Quarterly' ? 'bg-white/20 text-white' : 'bg-green-100 text-[#006537]'}`}>
                Incl. 18% GST
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('Annual')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                billingCycle === 'Annual'
                  ? 'bg-[#006537] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Annual Payments</span>
              <span className="text-[10px] text-gray-400 font-normal">+ GST</span>
            </button>
          </div>
        </div>

        {error && <div className="text-center text-[#D02029] mb-8 bg-red-50 p-4 rounded-xl max-w-md mx-auto">{error}</div>}

        {loading ? (
          <div className="flex justify-center"><div className="animate-pulse flex gap-6"><div className="w-72 h-[500px] bg-gray-200 rounded-3xl"></div><div className="w-72 h-[500px] bg-gray-200 rounded-3xl"></div><div className="w-72 h-[500px] bg-gray-200 rounded-3xl"></div></div></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-stretch">
            {Array.isArray(plans) && plans.map((plan, i) => {
              if (!plan) return null;
              const features: string[] = Array.isArray(plan.features) 
                ? plan.features 
                : typeof plan.features === 'string' 
                ? (() => { try { return JSON.parse(plan.features); } catch { return []; } })() 
                : [];

              const isHighlight = plan.name?.toLowerCase().includes('preferred') || plan.name?.toLowerCase().includes('popular');

              // Compute quarterly pricing if plan has quarterlyPrice or calculate (price * 1.18 / 4)
              const quarterlyRate = plan.quarterlyPrice || Math.round((plan.price * 1.18) / 4);

              return (
              <motion.div 
                key={plan.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white p-6 rounded-3xl shadow-sm border flex flex-col h-full relative overflow-hidden group hover:shadow-lg transition-all ${
                  isHighlight ? 'border-[#006537] ring-2 ring-[#006537]/10' : 'border-gray-100 hover:border-[#006537]'
                }`}
              >
                {isHighlight && (
                  <div className="absolute top-0 inset-x-0 bg-[#006537] text-white text-[11px] font-bold text-center py-1 uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="mb-6 mt-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name || 'AIRO Plan'}</h3>
                  {billingCycle === 'Quarterly' ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#006537]">₹{quarterlyRate}</span>
                        <span className="text-gray-400 text-xs">/ quarter</span>
                      </div>
                      <div className="text-[10px] font-bold text-[#006537] bg-green-100/70 inline-block px-2 py-0.5 rounded-full mt-1">
                        ✓ INCL. 18% GST
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">or ₹{plan.price}/yr (+ GST)</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#006537]">₹{plan.price || 0}</span>
                        <span className="text-gray-400 text-xs">/ year</span>
                      </div>
                      <div className="text-[11px] font-medium text-gray-500 mt-1">+ GST applicable</div>
                      <p className="text-[10px] text-gray-400 mt-0.5">or ₹{quarterlyRate}/qtr (Incl. GST)</p>
                    </div>
                  )}
                  {plan.description && <p className="text-gray-500 mt-3 text-xs leading-relaxed">{plan.description}</p>}
                </div>

                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-snug">
                        <Check size={16} className="text-[#006537] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleJoin({ ...plan, selectedCycle: billingCycle })}
                  disabled={processing}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-colors ${
                    isHighlight
                      ? 'bg-[#006537] text-white hover:bg-[#004e2a] shadow-md' 
                      : 'bg-[#F8F7F4] text-[#006537] hover:bg-[#e8e6e1]'
                  } disabled:opacity-50`}
                >
                  {processing ? 'Processing...' : `Select Plan (${billingCycle === 'Quarterly' ? `₹${quarterlyRate}/qtr` : `₹${plan.price}/yr`})`}
                </button>
              </motion.div>
            )})}
          </div>
        )}
      </div>
    </>
  );
}
