"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, HeartPulse, Dna, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GlobalHeader } from "@/components/GlobalHeader";

const plans = [
  {
    name: "AIRO Rise (Gold)",
    price: "₹456",
    period: "/ Year",
    popular: false,
    color: "from-[#D4AF37]/20 to-transparent",
    borderColor: "border-[#D4AF37]/30",
    buttonColor: "bg-[#0B2114] text-[#FAF8F5] hover:bg-[#D4AF37] hover:text-[#0B2114]",
    features: [
      { name: "Wellness Checkups", value: "3 / Year" },
      { name: "AIRO Praana Smart Health Scans", value: "6 / Year" },
      { name: "OP Doctor Consultations", value: "3 / Year" },
      { name: "AIRO Essentials Savings", value: "2% Off" },
      { name: "Prescription (Rx) Savings", value: "15% Off" },
      { name: "Telemedicine Access", value: "No" },
      { name: "Free Home Delivery", value: "Included (min order)" },
      { name: "Priority Clinic Appointments", value: "Yes" },
      { name: "Free OP Consultation After Labs", value: "3 Times" },
      { name: "Dietician Consultation", value: "No" },
      { name: "Health Coach / Lifestyle Guidance", value: "Included" },
      { name: "Birthday Benefit", value: "10% Off + Free Drink" },
      { name: "Anniversary Benefit", value: "10% Off + Free Drink" },
      { name: "Family Add-On Option", value: "Optional" },
      { name: "Emergency Health Support Line", value: "Included" },
      { name: "AIRO App Access", value: "No" },
      { name: "Complete Health Assessment", value: "Not Included" },
    ]
  },
  {
    name: "AIRO Elite (Platinum)",
    price: "₹4,999",
    period: "/ Year",
    popular: true,
    color: "from-[#0B2114] to-[#1a3826]",
    borderColor: "border-[#0B2114]",
    buttonColor: "bg-[#D4AF37] text-[#0B2114] hover:bg-white hover:text-[#0B2114]",
    features: [
      { name: "Wellness Checkups", value: "12 / Year" },
      { name: "AIRO Praana Smart Health Scans", value: "24 / Year" },
      { name: "OP Doctor Consultations", value: "12 / Year" },
      { name: "AIRO Essentials Savings", value: "6% Off" },
      { name: "Prescription (Rx) Savings", value: "20% Off" },
      { name: "Telemedicine Access", value: "Unlimited Priority" },
      { name: "Free Home Delivery", value: "Unlimited Free" },
      { name: "Priority Clinic Appointments", value: "Priority Access" },
      { name: "Free OP Consultation After Labs", value: "Unlimited" },
      { name: "Dietician Consultation", value: "4 / Year" },
      { name: "Health Coach / Lifestyle Guidance", value: "Included" },
      { name: "Birthday Benefit", value: "15% Off + Free Gift" },
      { name: "Anniversary Benefit", value: "15% Off + Free Gift" },
      { name: "Family Add-On Option", value: "Included (Up to 6)" },
      { name: "Emergency Health Support Line", value: "Priority Included" },
      { name: "AIRO App Access", value: "Included" },
      { name: "Complete Health Assessment", value: "Included (1 / Year)" },
    ]
  }
];

const vitals = [
  { name: "Blood Pressure (BP)", desc: "Hypertension & heart risk screening" },
  { name: "Heart Rate (Pulse)", desc: "Cardiac rhythm & stress monitoring" },
  { name: "Oxygen Saturation (SpO2)", desc: "Lung function & oxygen levels" },
  { name: "Body Temperature", desc: "Infection & fever screening" },
  { name: "Weight & Height", desc: "Body mass monitoring" },
  { name: "BMI & Body Fat %", desc: "Obesity & metabolic risk analysis" },
  { name: "Visceral Fat Score", desc: "Internal fat & cardiovascular risk" },
  { name: "Muscle Mass & Age", desc: "Metabolic efficiency & body health" },
  { name: "Hydration Level", desc: "Water balance assessment" }
];

const biomarkers = [
  { name: "HbA1c & Blood Sugar", desc: "Long-term diabetes screening" },
  { name: "Lipid Profile", desc: "9 Parameters – Cholesterol & heart health" },
  { name: "Liver Function Test (LFT)", desc: "12 Parameters – Liver performance" },
  { name: "Kidney Function Test (KFT)", desc: "11 Parameters – Kidney & fluid balance" },
  { name: "Thyroid Function (TFT)", desc: "3 Parameters – Hormonal balance" },
  { name: "Vitamin B12 & D", desc: "Energy, immunity & bone health" },
  { name: "Urine Complete Analysis", desc: "27 Parameters – Metabolic markers" },
  { name: "Complete Blood Count (CBC)", desc: "25 Parameters – Blood health & infection" }
];

const detections = [
  "Diabetes & Pre-diabetes", "High Cholesterol & Heart Disease Risk", 
  "High Blood Pressure Risk", "Liver Disorders", "Kidney Dysfunction", 
  "Thyroid Imbalance", "Vitamin Deficiencies", "Obesity & Metabolic Syndrome",
  "Infections & Inflammation", "Body Composition & Lifestyle Risks"
];

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] font-sans selection:bg-[#D4AF37]/30 selection:text-[#0B2114]">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-16 text-center max-w-[1500px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0B2114]/10 bg-[#0B2114]/5 text-[#0B2114] text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> The AIRO Ecosystem
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#0B2114] tracking-tight leading-[1.1] mb-6"
        >
          AIRO One.<br />
          <span className="italic font-light text-[#0B2114]/70">Rise to Health.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-[#0B2114]/70 max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Food as Medicine | Prevention is Healthcare
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-sm md:text-base text-[#0B2114]/60 max-w-4xl mx-auto leading-relaxed"
        >
          Your all-in-one preventive healthcare membership designed to help you save more, access care faster, 
          and stay healthier through one connected ecosystem across <b>Essentials, Pharmacy, Clinic, Praana, and Diagnostics.</b>
        </motion.p>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20 px-6 md:px-16 bg-white border-y border-[#0B2114]/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {plans.map((plan, idx) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className={`relative rounded-3xl p-8 md:p-12 overflow-hidden border ${plan.borderColor} ${plan.popular ? 'bg-[#0B2114] text-[#FAF8F5]' : 'bg-[#FAF8F5] text-[#0B2114]'}`}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${plan.color} opacity-50 z-0 pointer-events-none`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#0B2114] text-[9px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="font-serif text-3xl mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-light">{plan.price}</span>
                    <span className="text-sm opacity-60 tracking-wider uppercase">{plan.period}</span>
                  </div>

                  <button className={`w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all mb-12 ${plan.buttonColor}`}>
                    Select {plan.name.split(' ')[1]}
                  </button>

                  <div className="space-y-4 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-current/10 pb-4">
                        <span className="opacity-80">{feature.name}</span>
                        <span className="font-semibold text-right max-w-[50%]">{feature.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* Elite Exclusive Benefits Section */}
      <section className="py-24 px-6 md:px-16 bg-[#0B2114] text-[#FAF8F5] overflow-hidden relative">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37] blur-[150px] opacity-10 rounded-full" />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              AIRO Elite <span className="italic font-light text-[#D4AF37]">Exclusive Benefits</span>
            </h2>
            <p className="text-[#FAF8F5]/70 max-w-2xl mx-auto leading-relaxed">
              Advanced Precision Preventive Health. From vitals to advanced biomarkers — a complete health assessment in one place, because we test the markers that matter.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
            {/* Vitals */}
            <div>
              <div className="flex items-center gap-4 mb-8 border-b border-[#FAF8F5]/10 pb-6">
                <HeartPulse className="w-8 h-8 text-[#D4AF37]" />
                <h3 className="text-2xl font-serif">Vital Signs & Basic Screening</h3>
              </div>
              <ul className="space-y-6">
                {vitals.map((vital, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col"
                  >
                    <span className="font-bold tracking-wide">{vital.name}</span>
                    <span className="text-sm text-[#FAF8F5]/50 mt-1">{vital.desc}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Biomarkers */}
            <div>
              <div className="flex items-center gap-4 mb-8 border-b border-[#FAF8F5]/10 pb-6">
                <Dna className="w-8 h-8 text-[#D4AF37]" />
                <h3 className="text-2xl font-serif">Advanced Biomarker Panel</h3>
              </div>
              <ul className="space-y-6">
                {biomarkers.map((marker, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col"
                  >
                    <span className="font-bold tracking-wide">{marker.name}</span>
                    <span className="text-sm text-[#FAF8F5]/50 mt-1">{marker.desc}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detections */}
          <div className="bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 rounded-3xl p-8 md:p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-[#D4AF37] mx-auto mb-6" />
            <h3 className="text-2xl font-serif mb-8">What AIRO Elite Helps Detect</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {detections.map((detection, idx) => (
                <span key={idx} className="bg-[#FAF8F5]/10 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                  {detection}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA / Footer Promise */}
      <section className="py-24 px-6 md:px-16 text-center max-w-[800px] mx-auto">
        <h2 className="font-serif text-4xl mb-6 text-[#0B2114]">The AIRO One Promise</h2>
        <h3 className="text-xl text-[#0B2114]/80 mb-4 font-bold">
          Early Detection. Better Prevention. Smarter Health Decisions.
        </h3>
        <p className="text-[#0B2114]/60 italic mb-12">
          Because prevention starts before symptoms appear.
        </p>
        <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B2114] px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#0B2114] hover:text-[#FAF8F5] transition-colors">
          Return Home <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </main>
  );
}
