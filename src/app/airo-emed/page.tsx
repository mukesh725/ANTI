import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Clock, Video } from "lucide-react";

export const metadata = {
  title: "AIRO E-Med | Virtual Healthcare Excellence",
  description: "Experience the future of remote healthcare with AIRO E-Med.",
};

export default function AiroEMedPage() {
  return (
    <div className="w-full bg-[#FAFAFA] text-[#1C1C1E] min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-32 pb-24 md:pb-32 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        <div className="flex-1 w-full flex flex-col items-start text-left z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-blue-600 block mb-4 font-bold flex items-center gap-2">
            <Video className="w-4 h-4" /> Virtual Consultation Platform
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[4rem] tracking-tight leading-[1.1] text-[#1C1C1E] mb-6">
            AIRO E-Med
          </h1>
          <p className="font-serif text-lg md:text-xl text-[#1C1C1E]/80 italic max-w-xl leading-relaxed mb-8">
            Access premium, clinical-grade care from the comfort of your home. AIRO E-Med is our dedicated virtual healthcare platform designed to connect you with world-class providers instantly.
          </p>
          
          <div className="flex flex-col gap-3 mb-10 w-full max-w-md">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">24/7 on-demand virtual consultations</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Secure, HIPAA-compliant messaging and video</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Instant prescriptions sent to your pharmacy</span>
            </div>
          </div>

          <a 
            href="https://airoemed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold text-[#FFFFFF] bg-[#1C1C1E] px-8 py-4 rounded-full border border-[#1C1C1E] hover:bg-blue-600 hover:border-blue-600 transition-all shadow-lg hover:shadow-xl"
          >
            Visit AIRO E-Med <ArrowUpRight className="w-4 h-4" />
          </a>
          <p className="text-[10px] uppercase tracking-widest text-[#1C1C1E]/40 mt-4 font-semibold">
            You will be securely redirected to airoemed.com
          </p>
        </div>

        <div className="flex-1 w-full relative">
          <div className="relative aspect-[4/3] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop" 
              alt="AIRO E-Med Virtual Consultation"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Why E-Med */}
      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto">
        <div className="bg-[#1C1C1E] rounded-3xl p-8 md:p-16 shadow-2xl text-white text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-16">Why we created a dedicated platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl">Ultimate Security</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Virtual healthcare requires stringent data protection. AIRO E-Med runs on an isolated, ultra-secure infrastructure specifically built for telehealth.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl">Zero Wait Times</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                By separating our physical clinic management from our telehealth operations, we ensure that digital patients are connected to providers instantly.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:col-span-1 md:col-span-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl">Specialized Experience</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                The entire E-Med platform is optimized purely for remote diagnosis, continuous monitoring, and seamless digital care delivery.
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-12 border-t border-white/10 flex flex-col items-center">
            <h3 className="font-serif text-2xl mb-6">Ready to see a doctor now?</h3>
            <a 
              href="https://airoemed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold text-[#1C1C1E] bg-white px-8 py-4 rounded-full hover:bg-gray-200 transition-all shadow-lg"
            >
              Continue to airoemed.com <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
