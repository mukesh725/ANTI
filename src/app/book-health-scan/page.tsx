import { GlobalHeader } from "@/components/GlobalHeader";
import { HealthCheckBooking } from "@/components/booking/HealthCheckBooking";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BookHealthScanPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-ink selection:bg-theme selection:text-white font-sans">
      <GlobalHeader />
      
      <main className="pt-32 pb-24 px-6 md:px-16 max-w-7xl mx-auto">
        
        <div className="mb-12">
          <Link href="/health-chair" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink/50 hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Health Chair
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6">
            Book Your <span className="italic font-light text-ink/70">Health Scan</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ink/70 leading-relaxed">
            Take the first step toward proactive health management. Schedule your free 10-minute 
            comprehensive assessment at our Minute Clinic.
          </p>
        </div>

        <HealthCheckBooking />
      </main>
    </div>
  );
}
