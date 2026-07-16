import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import DigitalCard from './DigitalCard';

export default function PaymentSuccessScreen({ 
  details, 
  onNext 
}: { 
  details: any, 
  onNext: () => void 
}) {
  if (!details || !details.membership) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
          <CheckCircle2 size={48} className="text-[#006537]" />
        </div>
        <h2 className="text-3xl md:text-5xl font-semibold text-[#006537] mb-4">Payment Successful</h2>
        <p className="text-xl text-gray-600">Your AIRO Membership is now active!</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto mb-12"
      >
        <DigitalCard membership={details.membership} plan={details.plan} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button 
          onClick={onNext}
          className="bg-[#006537] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#004e2a] transition-all flex items-center gap-2 mx-auto"
        >
          Go To Dashboard <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
