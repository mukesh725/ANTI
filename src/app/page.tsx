"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Activity, Cpu } from "lucide-react";
import Link from "next/link";

// Custom Parallax Image component for smooth, luxury page scroll animations
function ParallaxImage({ 
  src, 
  alt, 
  className = "", 
  speed = 0.1 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yPercent = speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${yPercent}%`, `${yPercent}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.02]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover"
        transition={{ type: "spring", stiffness: 35, damping: 18 }}
      />
    </div>
  );
}

const ecosystemCategories = [
  { 
    name: "Essentials", 
    desc: "Organic produce, daily nutrition, and wellness-focused retail.", 
    href: "/grocery", 
    status: "Coming Soon" 
  },
  { 
    name: "Pharmacy", 
    desc: "Clinical-grade prescription care, longevity protocols, and supplements.", 
    href: "/pharmacy", 
    status: "Coming Soon" 
  },
  { 
    name: "Minute Clinic", 
    desc: "Walk-in care, vaccinations, and everyday healthcare consultations.", 
    href: "/minute-clinic", 
    status: "Coming Soon" 
  },
  { 
    name: "Diagnostics", 
    desc: "Comprehensive biomarker testing, genetic scans, and routine screenings.", 
    href: "/minute-clinic", 
    status: "Coming Soon" 
  },
  { 
    name: "Compounding Pharmacy", 
    desc: "Custom-made dosages, allergen-free formulations, and bespoke wellness tinctures.", 
    href: "/pharmacy", 
    status: "Coming Soon" 
  },
  { 
    name: "IV Therapy", 
    desc: "Targeted cellular hydration, NAD+ drips, and immediate nutrient infusion.", 
    href: "/minute-clinic", 
    status: "Coming Soon" 
  },
  { 
    name: "Digital Health", 
    desc: "Real-time vitals tracking, virtual consultations, and connected records.", 
    href: "/", 
    status: "Coming Soon" 
  }
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName || !waitlistEmail) return;
    setWaitlistStatus("submitting");
    setTimeout(() => {
      try {
        const existingLeadsStr = localStorage.getItem("airo_leads");
        const leads = existingLeadsStr ? JSON.parse(existingLeadsStr) : [];
        const newLead = {
          id: Math.random().toString(),
          name: waitlistName,
          email: waitlistEmail,
          phone: "Not Provided",
          type: "Homepage Waitlist",
          message: "Subscribed to global website waitlist",
          source: "Homepage Waitlist Form",
          status: "Pending",
          createdAt: new Date().toISOString()
        };
        leads.unshift(newLead);
        localStorage.setItem("airo_leads", JSON.stringify(leads));
      } catch (err) {
        console.warn("Could not save waitlist lead", err);
      }
      setWaitlistStatus("success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">

      {/* =========================================================================
          SECTION 1: HERO SECTION (FULL-WIDTH BACKGROUND)
          ========================================================================= */}
      <section ref={heroRef} className="relative h-[85vh] md:h-[95vh] w-full flex items-center justify-start px-6 md:px-16 overflow-hidden">
        {/* Full-width Background Image with Parallax & Slow Zoom */}
        <div className="absolute inset-0 w-full h-full">
          <ParallaxImage 
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000" 
            alt="AIRO Connected Wellness"
            className="w-full h-full"
            speed={0.1}
          />
          {/* Elegant dark gradient mask for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2114] via-[#0B2114]/75 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-[1000px] text-[#FAF8F5] pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
            <Sparkles className="w-3 h-3 text-[#FAF8F5]" /> A Connected Wellness Ecosystem
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight leading-[1.02] text-[#FAF8F5] mb-8">
            The Future of <br/>
            <span className="italic font-light text-[#FAF8F5]/80">Preventive Healthcare.</span>
          </h1>
          
          <p className="font-serif text-lg md:text-2xl text-[#FAF8F5]/95 italic max-w-2xl leading-relaxed mb-6">
            An ecosystem uniting nutrition, diagnostics, pharmacy, clinical care, and digital health.
          </p>
          
          <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-12 tracking-wide">
            At AIRO, we believe healthcare shouldn&apos;t be reactive. By integrating clinical precision with daily wellness, we build a connected environment designed to optimize your biology, ensure longevity, and prevent illness before it starts.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/grocery"
              className="bg-[#FAF8F5] text-[#0B2114] px-10 py-5 text-[10px] tracking-[0.2em] uppercase font-bold hover:opacity-90 silent-luxury-transition rounded-full shadow-lg inline-flex items-center gap-3"
            >
              Explore Essentials <ArrowRight className="w-4 h-4 text-[#0B2114]" />
            </Link>
            <Link
              href="/pharmacy"
              className="border border-[#FAF8F5]/20 text-[#FAF8F5] hover:bg-[#FAF8F5]/5 px-8 py-5 text-[10px] tracking-[0.2em] uppercase font-bold silent-luxury-transition rounded-full"
            >
              Join Compounding Waitlist
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THREE EQUAL PILLARS
          ========================================================================= */}
      <section className="bg-white border-y border-[#0B2114]/10 py-24 md:py-36 px-6 md:px-16 w-full">
        <div className="max-w-[1500px] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
              The Foundations
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
              Unified Care. <span className="italic font-light text-[#0B2114]/80">Three Pillars.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            {/* Pillar 1: Essentials */}
            <div className="flex flex-col group h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
                <ParallaxImage 
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800"
                  alt="AIRO Essentials Market"
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute inset-0 bg-[#0B2114]/5 mix-blend-multiply" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0B2114] mb-3">AIRO Essentials</h3>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#0B2114]/50 font-bold mb-4">
                Fresh • Organic • Local • Wellness Retail
              </p>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed mb-6 flex-grow">
                A carefully curated market featuring organic produce, functional groceries, and premium health goods selected to nourish your biology from the inside out.
              </p>
              <Link 
                href="/grocery" 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
              >
                Browse Essentials <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2: Pharmacy */}
            <div className="flex flex-col group h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
                <ParallaxImage 
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800"
                  alt="AIRO Pharmacy Compounding"
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute inset-0 bg-[#0B2114]/5 mix-blend-multiply" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0B2114] mb-3">AIRO Pharmacy</h3>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#0B2114]/50 font-bold mb-4">
                Prescriptions • Supplements • Custom Compounding
              </p>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed mb-6 flex-grow">
                Expert prescription management coupled with precision bio-available supplements and clinical wellness advice tailored to your personal biomarkers.
              </p>
              <Link 
                href="/pharmacy" 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
              >
                Visit Pharmacy Portal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3: Minute Clinic */}
            <div className="flex flex-col group h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
                <ParallaxImage 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
                  alt="AIRO Minute Clinic"
                  className="w-full h-full"
                  speed={0.06}
                />
                <div className="absolute inset-0 bg-[#0B2114]/5 mix-blend-multiply" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0B2114] mb-3">AIRO Minute Clinic</h3>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#0B2114]/50 font-bold mb-4">
                Preventive Care • Walk-In Clinics • Screenings
              </p>
              <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 leading-relaxed mb-6 flex-grow">
                Frictionless in-store and virtual medical services. Get immunizations, treatment, and proactive diagnostics with minimal wait times.
              </p>
              <Link 
                href="/minute-clinic" 
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#0B2114] hover:text-[#0B2114]/60 silent-luxury-transition"
              >
                View Clinic Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: AIRO HEALTH SCAN (CHAIR FEATURE SECTION)
          ========================================================================= */}
      <section className="bg-[#09120F] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16 w-full relative">
        <div className="max-w-[1450px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Chair Image (Prominent Visual Asset) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-[2/1] sm:aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden bg-[#09120F] flex items-center justify-center">
                <img 
                  src="/health-scan-chair.png" 
                  alt="AIRO Health Scan Chair" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-1000"
                />
                {/* Subtle spotlight backdrop effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#09120F_95%)] pointer-events-none" />
              </div>
            </div>

            {/* Assessment Details */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 text-[#FAF8F5] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
                <Cpu className="w-3 h-3 text-[#FAF8F5]/70" /> Clinical Innovation
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
                The AIRO <br/><span className="italic font-light text-[#FAF8F5]/80">Health Scan.</span>
              </h2>

              <p className="font-serif text-lg md:text-xl italic text-[#FAF8F5]/90 max-w-xl mb-8 font-light leading-relaxed">
                A 5-minute diagnostic assessment. A lifetime of longevity insights.
              </p>

              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
                Step into the future of diagnostics. The AIRO Smart Assessment Chair captures a comprehensive suite of key physiological indicators in just minutes, establishing a detailed baseline for your personalized care plan.
              </p>

              {/* Grid of captured metrics */}
              <div className="border-t border-b border-[#FAF8F5]/10 py-6 mb-10 max-w-xl">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#FAF8F5]/40 font-bold mb-6">
                  Key Metrics Captured Real-Time
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans text-[#FAF8F5]/90">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/40" /> Blood Pressure
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/40" /> Heart Rate & ECG
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/40" /> Blood Oxygen (SpO2)
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/40" /> Respiratory Rate
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/40" /> Body Temperature
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/40" /> Weight & BMI
                  </div>
                </div>
              </div>

              {/* Connected Care block */}
              <div className="border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 p-6 rounded-2xl max-w-xl">
                <span className="flex items-center gap-2 text-[#FAF8F5] text-[9px] font-bold tracking-[0.2em] uppercase mb-3">
                  <Activity className="w-3.5 h-3.5" /> CONNECTED CARE
                </span>
                <p className="font-sans text-xs text-[#FAF8F5]/70 leading-relaxed">
                  Your insights don&apos;t stop at the device. Results integrate instantly with your secure health profile, shared automatically with your providers. If needed, the ecosystem connects you directly to a healthcare professional for real-time clinical consultations.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ECOSYSTEM CATEGORIES SHOWCASE
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#0B2114]/10 gap-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-4 font-bold">
              The Architecture
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
              Ecosystem <span className="italic font-light text-[#0B2114]/80">Gateways</span>
            </h2>
          </div>
          <p className="font-sans text-xs text-[#0B2114]/60 max-w-sm leading-relaxed">
            Discover the gateways that form the AIRO platform—where premium retail meets clinical precision.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#0B2114]/10">
          {ecosystemCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.href}
              className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:px-4 silent-luxury-transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                {/* Index tag */}
                <span className="font-serif text-lg md:text-xl text-[#0B2114]/30 group-hover:text-[#0B2114] silent-luxury-transition">
                  0{idx + 1}
                </span>
                
                {/* Category Name */}
                <span className="font-serif text-2xl md:text-3xl text-[#0B2114] font-medium tracking-tight w-64">
                  {cat.name}
                </span>

                {/* Category Description */}
                <span className="font-sans text-xs md:text-sm text-[#0B2114]/60 group-hover:text-[#0B2114]/80 silent-luxury-transition max-w-xl">
                  {cat.desc}
                </span>
              </div>

              {/* Status / Link action (All are marked Coming Soon as requested) */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#0B2114]/40 border border-[#0B2114]/10 px-4 py-1.5 rounded-full">
                  Coming Soon
                </span>
                <div className="w-8 h-8 rounded-full border border-[#0B2114]/10 flex items-center justify-center text-[#0B2114] group-hover:border-[#0B2114] group-hover:bg-[#0B2114]/5 silent-luxury-transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LIFESTYLE IMAGE BANNER
          ========================================================================= */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
        <ParallaxImage 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000" 
          alt="Luxury holistic wellness lifestyle" 
          className="w-full h-full"
          speed={0.12}
        />
        <div className="absolute inset-0 bg-[#0B2114]/15" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
          <h2 className="font-serif text-4xl md:text-6xl text-[#FAF8F5] tracking-tight mb-4 drop-shadow-lg">
            Sourced for Longevity, <br/><span className="italic font-light">Engineered for Purity.</span>
          </h2>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/90 font-bold">
            radical integration
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: MANIFESTO (TEXT BLOCK)
          ========================================================================= */}
      <section className="py-24 md:py-36 px-8 max-w-[1200px] mx-auto text-center">
        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#0B2114]/40 mb-8">
          The Manifesto
        </h3>
        <p className="font-serif text-2xl md:text-4xl leading-[1.6] text-[#0B2114] mb-12 max-w-4xl mx-auto">
          <span className="float-left text-7xl md:text-9xl leading-none pr-4 font-normal text-[#0B2114]/20">A</span>
          paradigm shift in modern longevity. We integrate organic nutrition, precise diagnostic scanning, personalized therapeutics, and virtual clinical guidance into a seamless health architecture. Welcome to the new standard of living well.
        </p>
      </section>

      {/* =========================================================================
          SECTION 7: FOOTER
          ========================================================================= */}
      <footer className="border-t border-[#0B2114]/10 py-24 px-8 md:px-16 bg-[#0B2114] text-[#FAF8F5] rounded-t-[3rem] w-full">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">

          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-4xl tracking-[0.2em] uppercase mb-12">AIRO<span className="opacity-50">.</span></h2>
            <h3 className="font-sans text-xl font-medium mb-4">The Waitlist</h3>
            <p className="text-sm text-[#FAF8F5]/60 mb-8 max-w-sm leading-relaxed">
              Subscribe to receive clinical updates, seasonal grocery drops, and exclusive invitation status.
            </p>
            {waitlistStatus === "success" ? (
              <div className="bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 rounded-2xl p-6 max-w-sm space-y-2">
                <h4 className="font-serif text-lg text-[#FAF8F5]">Subscription Confirmed</h4>
                <p className="text-xs text-[#FAF8F5]/60 leading-relaxed">
                  Thank you. You have successfully joined the AIRO Health waitlist. An invitation coordinator will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-6 max-w-sm">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  className="w-full border-b border-[#FAF8F5]/30 pb-3 text-sm focus:outline-none focus:border-[#FAF8F5] bg-transparent placeholder-[#FAF8F5]/30 text-[#FAF8F5] silent-luxury-transition"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="w-full border-b border-[#FAF8F5]/30 pb-3 text-sm focus:outline-none focus:border-[#FAF8F5] bg-transparent placeholder-[#FAF8F5]/30 text-[#FAF8F5] silent-luxury-transition"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === "submitting"}
                  className="w-full bg-[#FAF8F5] text-[#0B2114] text-[10px] font-bold tracking-widest uppercase py-4 rounded-full hover:opacity-90 disabled:opacity-50 silent-luxury-transition"
                >
                  {waitlistStatus === "submitting" ? "Submitting..." : "Join Waitlist"}
                </button>
              </form>
            )}
          </div>
 
          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FAF8F5]/40 tracking-widest uppercase">Ecosystem & Legal</h3>
            <ul className="space-y-4 text-sm text-[#FAF8F5]/80 font-medium">
              <li><Link href="/about" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">About & Leadership</Link></li>
              <li><Link href="/grocery" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Essentials</Link></li>
              <li><Link href="/pharmacy" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Pharmacy Portal</Link></li>
              <li><Link href="/minute-clinic" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Minute Clinic</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Terms of Service</Link></li>
              <li><Link href="/press" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">Press & Media Kit</Link></li>
            </ul>
          </div>
 
          <div>
            <h3 className="font-sans text-xs font-bold mb-8 text-[#FAF8F5]/40 tracking-widest uppercase">Support</h3>
            <ul className="space-y-4 text-sm text-[#FAF8F5]/80 font-medium">
              <li><a href="mailto:concierge@airohealth.com" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">concierge@airohealth.com</a></li>
              <li><a href="mailto:clinical@airohealth.com" className="hover:text-[#FAF8F5]/50 silent-luxury-transition">clinical@airohealth.com</a></li>
              <li className="pt-8 text-[#FAF8F5]/30 text-[10px] tracking-widest uppercase">© 2026 AIRO Health.</li>
            </ul>
          </div>
 
        </div>
      </footer>
    </div>
  );
}
