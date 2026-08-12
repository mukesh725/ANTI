import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FlaskConical, PackageOpen, Stethoscope } from "lucide-react";

export const metadata = {
  title: "AIRO E-Med | Personalized Hair & Skin Treatments",
  description: "Personalized, doctor-backed treatment plans for hair loss and dermatology, delivered to your door.",
};

export default function AiroEMedPage() {
  return (
    <div className="w-full bg-[#FAFAFA] text-[#1C1C1E] min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-32 pb-24 md:pb-32 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        <div className="flex-1 w-full flex flex-col items-start text-left z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-blue-600 block mb-4 font-bold flex items-center gap-2">
            <FlaskConical className="w-4 h-4" /> Personalized Dermatology & Hair Care
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[4rem] tracking-tight leading-[1.1] text-[#1C1C1E] mb-6">
            AIRO E-Med
          </h1>
          <p className="font-serif text-lg md:text-xl text-[#1C1C1E]/80 italic max-w-xl leading-relaxed mb-8">
            Stop hair loss and improve your skin with personalized, doctor-backed treatment plans. Get custom Rx formulas—like AIRO Root Start™—delivered discreetly to your door.
          </p>
          
          <div className="flex flex-col gap-3 mb-10 w-full max-w-md">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Free online consultations with licensed doctors</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Custom formulations including Minoxidil and Finasteride</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Discreet delivery from CDSCO-compliant pharmacy partners</span>
            </div>
          </div>

          <a 
            href="https://airoemed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold text-[#FFFFFF] bg-[#1C1C1E] px-8 py-4 rounded-full border border-[#1C1C1E] hover:bg-blue-600 hover:border-blue-600 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Treatment <ArrowUpRight className="w-4 h-4" />
          </a>
          <p className="text-[10px] uppercase tracking-widest text-[#1C1C1E]/40 mt-4 font-semibold">
            You will be securely redirected to airoemed.com
          </p>
        </div>

        <div className="flex-1 w-full relative">
          <div className="relative aspect-[4/3] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl bg-white flex items-center justify-center p-12">
            <img 
              src="/airo-health-logo.png" 
              alt="AIRO E-Med Medical Treatments"
              className="w-full h-auto max-w-md opacity-90 object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Why E-Med */}
      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto">
        <div className="bg-[#1C1C1E] rounded-3xl p-8 md:p-16 shadow-2xl text-white text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-16">The future of specialized care</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl">Doctor-Backed Plans</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Skip the waiting room. Complete a free online consultation and get a personalized treatment plan reviewed and prescribed by licensed physicians.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl">Custom Formulas</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our treatments are formulated based on your unique skin and hair profile, utilizing proven active ingredients like Minoxidil and Finasteride.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:col-span-1 md:col-span-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <PackageOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl">Direct Delivery</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Your custom Rx formulas are verified and dispensed by CDSCO-compliant pharmacy partners and shipped directly to your door in discreet packaging.
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-12 border-t border-white/10 flex flex-col items-center">
            <h3 className="font-serif text-2xl mb-6">Ready to regain your confidence?</h3>
            <a 
              href="https://airoemed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold text-[#1C1C1E] bg-white px-8 py-4 rounded-full hover:bg-gray-200 transition-all shadow-lg"
            >
              Take the free consultation <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
