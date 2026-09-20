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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 font-semibold text-gray-700 w-1/4">Benefits</th>
                <th className="p-5 font-semibold text-center text-[#006537]">AIRO ONE™ Select</th>
                <th className="p-5 font-semibold text-center text-[#006537] bg-green-50">AIRO ONE™ Preferred</th>
                <th className="p-5 font-semibold text-center text-[#006537]">AIRO ONE™ Signature</th>
                <th className="p-5 font-semibold text-center text-[#006537] bg-emerald-50">AIRO ONE™ Infinite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr className="hover:bg-gray-50">
                <td className="p-5 font-medium text-gray-700">Annual Membership Fee</td>
                <td className="p-5 text-center font-bold text-lg">₹999</td>
                <td className="p-5 text-center font-bold text-lg bg-green-50 text-[#006537]">₹2,999</td>
                <td className="p-5 text-center font-bold text-lg">₹6,999</td>
                <td className="p-5 text-center font-bold text-lg bg-emerald-50 text-[#006537]">₹8,999</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">Members Covered</td>
                <td className="p-5 text-center">1 Member<div className="text-xs text-gray-400 font-normal">For Individuals</div></td>
                <td className="p-5 text-center bg-green-50 font-medium">Up to 3 Members<div className="text-xs text-gray-400 font-normal">For Small Families</div></td>
                <td className="p-5 text-center font-medium">Up to 5 Members<div className="text-xs text-gray-400 font-normal">For Families</div></td>
                <td className="p-5 text-center bg-emerald-50 font-medium">Up to 6 Members<div className="text-xs text-gray-400 font-normal">For Large Families</div></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">AIRO Pharmacy Discount*</td>
                <td className="p-5 text-center font-semibold text-[#006537]">Up to 60%+</td>
                <td className="p-5 text-center font-semibold bg-green-50 text-[#006537]">Up to 60%+</td>
                <td className="p-5 text-center font-semibold text-[#006537]">Up to 60%+</td>
                <td className="p-5 text-center font-semibold bg-emerald-50 text-[#006537]">Up to 60%+</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">AIRO Branded Products Discount</td>
                <td className="p-5 text-center text-gray-400">—</td>
                <td className="p-5 text-center font-semibold bg-green-50 text-[#006537]">3%</td>
                <td className="p-5 text-center font-semibold text-[#006537]">6%</td>
                <td className="p-5 text-center font-semibold bg-emerald-50 text-[#006537]">8%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">Free In-Store Doctor Consultations</td>
                <td className="p-5 text-center">2 / Year</td>
                <td className="p-5 text-center bg-green-50">6 / Year</td>
                <td className="p-5 text-center">10 / Year</td>
                <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">15 / Year</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">Free Telemedicine Consultations</td>
                <td className="p-5 text-center">2 / Year</td>
                <td className="p-5 text-center bg-green-50">6 / Year</td>
                <td className="p-5 text-center">10 / Year</td>
                <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">AIRO Praana™ Health Screenings</td>
                <td className="p-5 text-center">4 / Year</td>
                <td className="p-5 text-center bg-green-50">10 / Year</td>
                <td className="p-5 text-center font-semibold text-[#006537]">Unlimited</td>
                <td className="p-5 text-center bg-emerald-50 font-semibold text-[#006537]">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">Annual Preventive Health Check-up</td>
                <td className="p-5 text-center text-gray-400">—</td>
                <td className="p-5 text-center bg-green-50">1 Member / Year</td>
                <td className="p-5 text-center">2 Members / Year</td>
                <td className="p-5 text-center bg-emerald-50 font-semibold">3 Members / Year</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">Dietitian Consultations</td>
                <td className="p-5 text-center text-gray-400">—</td>
                <td className="p-5 text-center bg-green-50">2 / Year</td>
                <td className="p-5 text-center">6 / Year</td>
                <td className="p-5 text-center bg-emerald-50 font-bold text-[#006537]">12 / Year</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">Medicine Home Delivery</td>
                <td className="p-5 text-center">Free above ₹1,500</td>
                <td className="p-5 text-center bg-green-50">Free above ₹1,500</td>
                <td className="p-5 text-center font-semibold text-[#006537]">Unlimited</td>
                <td className="p-5 text-center bg-emerald-50 font-semibold text-[#006537]">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">AIRO Care365™ (24/7 Emergency Support)</td>
                <td className="p-5 text-center text-gray-400">—</td>
                <td className="p-5 text-center text-gray-400 bg-green-50">—</td>
                <td className="p-5 text-center font-bold text-[#D02029]">Included</td>
                <td className="p-5 text-center bg-emerald-50 font-bold text-[#D02029]">Included</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-5 text-gray-600">AIRO Medication Gift Voucher</td>
                <td className="p-5 text-center text-gray-400">—</td>
                <td className="p-5 text-center font-bold text-[#006537] bg-green-50">₹500</td>
                <td className="p-5 text-center font-bold text-[#006537]">₹1,000</td>
                <td className="p-5 text-center font-bold text-[#006537] bg-emerald-50">₹1,500</td>
              </tr>
              {[
                "AIRO App / Digital Health Records",
                "Health & Medication Reminders"
              ].map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-5 text-gray-600">{item}</td>
                  <td className="p-5 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                  <td className="p-5 text-center bg-green-50"><Check className="inline text-[#006537]" size={20}/></td>
                  <td className="p-5 text-center"><Check className="inline text-[#006537]" size={20}/></td>
                  <td className="p-5 text-center bg-emerald-50"><Check className="inline text-[#006537]" size={20}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AIRO Praana™ Health Screening */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="bg-gradient-to-r from-emerald-900 to-[#006537] text-white p-8 md:p-12 rounded-3xl shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="bg-white/20 text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              AIRO PRAANA™ HEALTH SCREENING
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Quick. Easy. Essential.</h2>
            <p className="text-emerald-100 text-lg">Know Your Numbers. Take Charge.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              'Blood Pressure',
              'Heart Rate & ECG',
              'SpO₂ / Oxygen Saturation',
              'Respiratory Rate',
              'Temperature',
              'Weight & BMI',
              'Diabetes Risk Assessment',
              'Cardiovascular Risk Assessment',
              'AIRO Praana™ Health Score'
            ].map((check, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
                <Check className="text-emerald-300 w-4 h-4 shrink-0" />
                <span className="font-medium text-white">{check}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Comprehensive Preventive Health Assessment */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="bg-[#004e2a] text-white p-8 md:p-12 rounded-3xl shadow-xl">
          <span className="bg-white/20 text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            AIRO HEALTH™
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Comprehensive Preventive Health Assessment</h2>
          <p className="text-green-200 text-lg mb-6">Screen Early. Know Your Health. Prevent Better.</p>
          <p className="text-sm md:text-base opacity-90 mb-10 max-w-4xl leading-relaxed">
            A complete preventive health evaluation combining advanced body composition analysis, vital health measurements, and essential laboratory testing to provide a detailed picture of your health.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">1. Health &amp; Lifestyle</h3>
              <p className="opacity-90 leading-relaxed text-xs">Comprehensive review of health, lifestyle and preventive-care factors.</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">2. Vital Signs &amp; BMI</h3>
              <ul className="space-y-1.5 opacity-90 text-xs">
                <li>• Blood Pressure &amp; Heart Rate</li>
                <li>• Respiratory Rate &amp; SpO₂</li>
                <li>• Temperature, Height, Weight &amp; BMI</li>
              </ul>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">3. Blood &amp; Urine Tests</h3>
              <ul className="space-y-1.5 opacity-90 text-xs">
                <li>• CBC / Hemogram</li>
                <li>• Complete Urinalysis</li>
              </ul>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">4. Diabetes &amp; Cardio</h3>
              <ul className="space-y-1.5 opacity-90 text-xs">
                <li>• Fasting Blood Glucose</li>
                <li>• HbA1c</li>
                <li>• Complete Lipid Profile</li>
              </ul>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">5. Organ Health</h3>
              <ul className="space-y-1.5 opacity-90 text-xs">
                <li>• Liver Function Tests (LFT)</li>
                <li>• Kidney Function Tests (KFT)</li>
                <li>• Electrolytes &amp; TSH (Thyroid)</li>
              </ul>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">6. Vitamins &amp; Nutrition</h3>
              <ul className="space-y-1.5 opacity-90 text-xs">
                <li>• Vitamin D &amp; Vitamin B12</li>
                <li>• Folate, Iron &amp; Ferritin</li>
                <li>• Calcium &amp; Magnesium</li>
              </ul>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">7. Physical Examination</h3>
              <p className="opacity-90 leading-relaxed text-xs">Comprehensive physical assessment as part of the preventive evaluation.</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">8. Age &amp; Risk Screening</h3>
              <p className="opacity-90 leading-relaxed text-xs">Additional preventive screening based on age and individual risk factors.</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h3 className="text-base font-bold mb-3 text-green-200">9. Doctor Review</h3>
              <p className="opacity-90 leading-relaxed text-xs">Professional doctor review with a personalized health summary report.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AIRO Care365 - Exclusive to Signature & Infinite */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="bg-[#D02029] text-white p-8 md:p-12 rounded-3xl shadow-xl">
          <span className="bg-white/20 text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Exclusive to AIRO ONE™ Signature &amp; Infinite
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">AIRO Care365™</h2>
          <p className="text-xl font-medium mb-4 text-red-100">24/7 Emergency Support Membership</p>
          <p className="text-lg opacity-90 mb-10 max-w-4xl">
            Care Every Day. Support When You Need It Most.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white/10 p-6 rounded-2xl border border-white/15">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="text-lg font-bold mb-2">24/7 Response Coordination</h3>
              <ul className="space-y-2 opacity-90 text-xs">
                <li>• Dedicated AIRO Emergency Support Line</li>
                <li>• Immediate assistance during medical emergencies</li>
                <li>• Rapid coordination with emergency services and hospitals</li>
                <li>• Coordination with designated family members</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl border border-white/15">
              <div className="text-3xl mb-3">🚑</div>
              <h3 className="text-lg font-bold mb-2">Ambulance Assistance</h3>
              <ul className="space-y-2 opacity-90 text-xs">
                <li>• Priority ambulance coordination</li>
                <li>• Transportation to nearest appropriate hospital</li>
                <li>• Real-time support from the moment you call until you reach medical care</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl border border-white/15">
              <div className="text-3xl mb-3">👨‍⚕️</div>
              <h3 className="text-lg font-bold mb-2">AIRO Doctor Support</h3>
              <ul className="space-y-2 opacity-90 text-xs">
                <li>• Immediate access to an AIRO doctor via teleconsultation</li>
                <li>• Medical guidance for patients and caregivers</li>
                <li>• Coordination with hospital teams using your AIRO Health Profile</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-black/20 p-5 rounded-2xl text-center">
            <p className="text-sm font-medium text-red-100">
              <strong>AIRO Care365™ Promise:</strong> Because AIRO knows your health history, medications, allergies, and medical conditions, we can help coordinate your care faster when every minute matters.
            </p>
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
