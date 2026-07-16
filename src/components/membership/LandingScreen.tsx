import { motion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, Shield, HeartPulse, Stethoscope, ShoppingBag, Gift } from 'lucide-react';

export default function LandingScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-[#1a1a1a]">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24"
      >
        <span className="bg-[#006537] text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-widest uppercase mb-6 inline-block">AIRO ONE™</span>
        <h1 className="text-4xl md:text-6xl font-semibold text-[#006537] mb-6 tracking-tight">
          One Membership. Complete Health. Everyday Savings.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          AIRO ONE™ is an integrated healthcare membership that brings together healthy shopping, pharmacy savings, doctor consultations, telemedicine, diagnostics, preventive health screenings, and digital healthcare—all under one membership.
        </p>
        
        <button 
          onClick={onNext}
          className="mt-10 bg-[#006537] text-white px-10 py-5 rounded-full text-xl font-medium hover:bg-[#004e2a] transition-all flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
        >
          View Plans & Join <ArrowRight size={24} />
        </button>
      </motion.div>

      {/* Comparison Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <h2 className="text-3xl font-semibold text-center mb-10 text-[#006537]">Membership Comparison</h2>
        <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 font-semibold text-gray-700 w-1/3">Benefits</th>
                <th className="p-6 font-semibold text-center text-[#006537]">AIRO ONE™ Select</th>
                <th className="p-6 font-semibold text-center text-[#006537] bg-green-50">AIRO ONE™ Preferred</th>
                <th className="p-6 font-semibold text-center text-[#006537]">AIRO ONE™ Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="p-6 font-medium text-gray-700">Annual Membership Fee</td>
                <td className="p-6 text-center font-bold text-lg">₹999</td>
                <td className="p-6 text-center font-bold text-lg bg-green-50">₹2,999</td>
                <td className="p-6 text-center font-bold text-lg">₹4,999</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Members Covered</td>
                <td className="p-6 text-center">1 Member</td>
                <td className="p-6 text-center bg-green-50">Up to 3 Members</td>
                <td className="p-6 text-center">Up to 5 Members</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">AIRO Essentials Grocery Discount</td>
                <td className="p-6 text-center font-semibold">2%</td>
                <td className="p-6 text-center font-semibold bg-green-50">4%</td>
                <td className="p-6 text-center font-semibold">6%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Pharmacy Discount*</td>
                <td className="p-6 text-center font-semibold">15%</td>
                <td className="p-6 text-center font-semibold bg-green-50">18%</td>
                <td className="p-6 text-center font-semibold">22%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">AIRO Branded Products Discount</td>
                <td className="p-6 text-center font-semibold">4%</td>
                <td className="p-6 text-center font-semibold bg-green-50">6%</td>
                <td className="p-6 text-center font-semibold">8%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Free Doctor Consultations</td>
                <td className="p-6 text-center">2 / Year</td>
                <td className="p-6 text-center bg-green-50">6 / Year</td>
                <td className="p-6 text-center">10 / Year</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Free Telemedicine Consultations</td>
                <td className="p-6 text-center">2 / Year</td>
                <td className="p-6 text-center bg-green-50">6 / Year</td>
                <td className="p-6 text-center">10 / Year</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">AIRO Praana™ Health Screenings</td>
                <td className="p-6 text-center">4 Basic Screenings</td>
                <td className="p-6 text-center bg-green-50">10 Basic Screenings</td>
                <td className="p-6 text-center font-semibold">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Annual Preventive Health Check-up</td>
                <td className="p-6 text-center text-gray-400">—</td>
                <td className="p-6 text-center bg-green-50">1 Complimentary</td>
                <td className="p-6 text-center">2 Complimentary</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Dietitian Consultations</td>
                <td className="p-6 text-center text-gray-400">—</td>
                <td className="p-6 text-center bg-green-50">2 / Year</td>
                <td className="p-6 text-center">6 / Year</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Medicine Home Delivery</td>
                <td className="p-6 text-center">Free Above ₹1,500</td>
                <td className="p-6 text-center bg-green-50">Free Above ₹1,500</td>
                <td className="p-6 text-center font-semibold">Unlimited Free Delivery</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-6 text-gray-600">Priority Service</td>
                <td className="p-6 text-center text-gray-400">—</td>
                <td className="p-6 text-center text-gray-400 bg-green-50">—</td>
                <td className="p-6 text-center font-semibold text-[#D02029]">VIP Priority</td>
              </tr>
              {[
                "AIRO App (Digital Health Records)",
                "Health & Medication Reminders",
                "Birthday Rewards"
              ].map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-6 text-gray-600">{item}</td>
                  <td className="p-6 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                  <td className="p-6 text-center bg-green-50"><Check className="inline text-[#006537]" size={20}/></td>
                  <td className="p-6 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Signature Health Assessment */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="bg-[#006537] text-white p-8 md:p-12 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-6">AIRO ONE™ Signature Comprehensive Health Assessment</h2>
          <p className="text-lg opacity-90 mb-10 max-w-4xl">
            A Complete Preventive Health Evaluation combining advanced body composition analysis, vital health measurements, and essential laboratory testing to provide a detailed picture of your health.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-200">1. Vital Signs & Body Composition</h3>
              <ul className="space-y-3 opacity-90">
                <li>• Blood Pressure (BP)</li>
                <li>• Heart Rate & Oxygen (SpO₂)</li>
                <li>• BMI & Body Fat Percentage</li>
                <li>• Visceral Fat Score</li>
                <li>• Skeletal Muscle Mass</li>
                <li>• Metabolic Age & Hydration Level</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-200">2. Comprehensive Laboratory Panel</h3>
              <ul className="space-y-3 opacity-90">
                <li>• HbA1c & Blood Glucose</li>
                <li>• Complete Lipid Profile</li>
                <li>• Liver & Kidney Function (LFT/KFT)</li>
                <li>• Thyroid Function (T3, T4, TSH)</li>
                <li>• Vitamin D & Complete Blood Count</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 bg-white/10 p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Your Personalized Report Includes:</h3>
            <div className="flex flex-wrap gap-3">
              {['AIRO Health Score', 'Body Composition', 'Cardiometabolic Risk', 'Dietitian Recommendations', 'Health Trend Tracking'].map((item, i) => (
                <span key={i} className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Every Membership Includes */}
      <div className="mb-24">
        <h2 className="text-3xl font-semibold text-center mb-10 text-[#006537]">Every AIRO ONE™ Membership Includes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <ShoppingBag />, text: 'Savings at AIRO Essentials' },
            { icon: <Shield />, text: 'Exclusive Pharmacy Benefits' },
            { icon: <Stethoscope />, text: 'Doctor & Telemedicine Access' },
            { icon: <HeartPulse />, text: 'AIRO Praana™ Screenings' },
            { icon: <CheckCircle2 />, text: 'AIRO App & Digital Records' },
            { icon: <Gift />, text: 'Birthday & Exclusive Rewards' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="text-[#006537] bg-green-50 p-3 rounded-full">{item.icon}</div>
              <span className="font-medium text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Founding Member Offer */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mb-24 bg-gradient-to-r from-[#D02029] to-[#a81a21] text-white p-10 rounded-3xl shadow-xl text-center"
      >
        <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block">Exclusive for the First 10,000 Members</span>
        <h2 className="text-4xl font-bold mb-10">Founding Member Offer</h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          <div className="bg-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-2">Select - ₹999</h3>
            <ul className="space-y-2 opacity-90">
              <li>🎁 ₹500 Welcome Coupons</li>
              <li>🛍️ AIRO Reusable Shopping Bag</li>
            </ul>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl border border-white/30">
            <h3 className="text-xl font-bold mb-2">Preferred - ₹2,999</h3>
            <ul className="space-y-2 opacity-90">
              <li>🎁 ₹1,500 Welcome Coupons</li>
              <li>⚕️ Complimentary AIRO Wellness Kit</li>
              <li>💧 AIRO Premium Water Bottle</li>
            </ul>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-2">Signature - ₹4,999</h3>
            <ul className="space-y-2 opacity-90">
              <li>🎁 ₹2,500 Welcome Coupons</li>
              <li>⚕️ Premium AIRO Wellness Kit</li>
              <li>💧 Premium Stainless Steel Water Bottle</li>
            </ul>
          </div>
        </div>
        
        <button 
          onClick={onNext}
          className="mt-10 bg-white text-[#D02029] px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
        >
          Claim Offer Now
        </button>
      </motion.div>

      {/* Terms & Conditions */}
      <div className="text-sm text-gray-500 max-w-4xl mx-auto space-y-2 opacity-75">
        <p className="font-semibold mb-2">Terms & Conditions:</p>
        <p>1. Pharmacy discounts apply only to eligible products and are subject to applicable laws, regulations, and company policies.</p>
        <p>2. Membership benefits are available at participating AIRO locations and through the AIRO App.</p>
        <p>3. Complimentary consultations, screenings, and health assessments must be used within the membership year.</p>
        <p>4. The AIRO ONE™ Signature Comprehensive Health Assessment is a preventive health screening designed to help identify potential health risks. It is not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional for interpretation of results.</p>
        <p>5. AIRO reserves the right to modify membership benefits, pricing, and promotional offers.</p>
      </div>
    </div>
  );
}
