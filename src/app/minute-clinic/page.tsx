"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";

// Custom Parallax Image component that drives slow-zoom and vertical parallax
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
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1.02]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover"
        transition={{ type: "spring", stiffness: 30, damping: 15 }}
      />
    </div>
  );
}

export default function MinuteClinicPage() {
  const pageRef = useRef<HTMLDivElement>(null);
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
          type: "Minute Clinic Booking Waitlist",
          message: "Subscribed to Minute Clinic booking waitlist",
          source: "Minute Clinic Form",
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
    <div ref={pageRef} className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative px-6 md:px-16 pt-12 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0B2114]/10 bg-[#0B2114]/5 text-[#0B2114] text-[9px] font-bold tracking-[0.25em] uppercase w-fit mb-8">
              <Sparkles className="w-3 h-3" /> Redefining Clinical Care
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.05] text-[#0B2114] mb-8">
              Healthcare For The <br/>
              <span className="italic font-light text-[#0B2114]/80">Way Life Happens.</span>
            </h1>
            
            <p className="font-serif text-lg md:text-2xl text-[#0B2114]/80 italic max-w-xl leading-relaxed mb-6">
              Professional care. Minimal waiting. Meaningful outcomes.
            </p>
            
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed mb-10 tracking-wide">
              AIRO Minute Clinic delivers convenient healthcare designed around modern lifestyles, making it easier to access trusted medical support whenever you need it.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#FAF8F5] bg-[#0B2114] px-6 py-3 rounded-full border border-[#0B2114]">
                Booking Waitlist Only
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0B2114]/50">
                Opening Winter 2026
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 w-full">
            <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600" 
                alt="AIRO Clinic Wellness Environment"
                className="w-full h-full"
                speed={0.1}
              />
              <div className="absolute inset-0 bg-[#0B2114]/10 mix-blend-multiply" />
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-[#FAF8F5]/90 border border-[#0B2114]/10 p-6 rounded-xl text-left">
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#0B2114]/50 block mb-1">
                  Diagnostics & Prevention
                </span>
                <p className="font-serif text-lg text-[#0B2114] font-medium">
                  Advanced Biomarker Screenings
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: HEALTHCARE WITHOUT THE FRICTION (Storytelling Block 1) */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
                Access
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
                Healthcare Without <br/>the <span className="italic font-light text-[#FAF8F5]/80">Friction</span>
              </h2>
              <p className="font-serif text-xl md:text-2xl text-[#FAF8F5]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                Getting quality care shouldn&apos;t require weeks of waiting.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
                AIRO Minute Clinic was created to provide faster access to healthcare services for individuals and families seeking preventive care, everyday medical support, and ongoing wellness guidance.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed tracking-wide">
                Our approach combines convenience with clinical excellence, helping people receive care when it matters most.
              </p>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[16/10] md:aspect-[16/11] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src="https://images.unsplash.com/photo-1519823551278-64ac92834907?q=80&w=1600" 
                  alt="Seamless Clinic Experience" 
                  className="w-full h-full"
                  speed={0.12}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2114]/30 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: DESIGNED AROUND PREVENTION (Storytelling Block 2) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Visual element */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600" 
                alt="Active healthy longevity" 
                className="w-full h-full"
                speed={0.08}
              />
              <div className="absolute inset-0 bg-[#0B2114]/15" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
              Vision
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              Designed Around <br/><span className="italic font-light text-[#0B2114]/80">Prevention</span>
            </h2>
            <p className="font-serif text-lg md:text-xl text-[#0B2114]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              The future of healthcare is prevention.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              Many of today&apos;s most common health conditions can be better managed—or even avoided—through early detection, routine monitoring, and proactive care.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed tracking-wide">
              AIRO Minute Clinic focuses on helping patients understand their health before symptoms become serious problems.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: EVERYDAY CARE, ELEVATED (Storytelling Block 3) */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
                Clinical Care
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
                Everyday Care, <br/><span className="italic font-light text-[#FAF8F5]/80">Elevated</span>
              </h2>
              <p className="font-serif text-lg md:text-xl text-[#FAF8F5]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
                From seasonal illnesses and vaccinations to annual wellness visits and health screenings, our clinic supports your everyday needs.
              </p>
              <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg leading-relaxed mb-8 tracking-wide">
                Our clinic covers the full spectrum of day-to-day medical needs with a patient-first focus. We ensure you feel understood, treated, and guided toward optimal long-term health.
              </p>
              <p className="font-serif text-lg md:text-xl italic text-[#FAF8F5]/90 border-l border-[#FAF8F5]/20 pl-6 mb-4 font-light leading-relaxed">
                &ldquo;Our goal is not simply to treat illness. It&apos;s to help people stay healthy.&rdquo;
              </p>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <ParallaxImage 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600" 
                  alt="Everyday health and wellness" 
                  className="w-full h-full"
                  speed={0.1}
                />
                <div className="absolute inset-0 bg-[#0B2114]/15" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: CONNECTED HEALTHCARE & CONTINUING CARE (Storytelling Blocks 4 & 5) */}
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Visual element */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/4] md:aspect-[4/3] lg:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1600" 
                alt="Aesthetic medical diagnostics space" 
                className="w-full h-full"
                speed={0.14}
              />
              <div className="absolute inset-0 bg-[#0B2114]/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Text block */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B2114]/50 block mb-6 font-bold">
              Connectivity
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
              Connected <br/><span className="italic font-light text-[#0B2114]/80">Healthcare</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed mb-6 tracking-wide">
              Healthcare works best when information, services, and providers work together. As part of the AIRO ecosystem, the Minute Clinic integrates with pharmacy services, diagnostics, wellness programs, and digital health tools to create a more complete picture of patient health.
            </p>
            <p className="font-serif text-lg md:text-xl text-[#0B2114]/90 italic mb-8 max-w-xl font-normal leading-relaxed">
              A single appointment should be the beginning of a healthier future—not the end of a conversation.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0B2114]/70 max-w-lg leading-relaxed tracking-wide">
              Through ongoing monitoring, preventive health programs, advanced diagnostics, and wellness support, AIRO helps patients take a more active role in their long-term health.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6: THE NEW STANDARD & BOOKING WAITLIST (Storytelling Block 6) */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-24 md:py-36 px-6 md:px-16 rounded-t-[3rem]">
        <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F5]/50 block mb-6 font-bold">
            The Vision
          </span>
          
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-tight mb-8 max-w-3xl">
            The New Standard for <span className="italic font-light text-[#FAF8F5]/80">Community Healthcare.</span>
          </h2>
          
          <p className="font-serif text-lg md:text-xl italic text-[#FAF8F5]/90 max-w-xl leading-relaxed mb-8 font-light">
            Accessible. Preventive. Personalized.
          </p>
          <p className="font-sans text-xs md:text-sm text-[#FAF8F5]/80 max-w-lg leading-relaxed mb-16 tracking-wide">
            AIRO Minute Clinic is redefining what modern healthcare can look like—bringing together clinical expertise, advanced technology, and a patient-first philosophy to create a better healthcare experience for everyone.
          </p>

          {/* Premium waitlist form */}
          <div className="w-full max-w-md border border-[#FAF8F5]/10 bg-[#FAF8F5]/5 p-8 md:p-10 rounded-3xl backdrop-blur-xl">
            <h3 className="font-serif text-2xl mb-2 text-[#FAF8F5] tracking-tight">The Clinic Waitlist</h3>
            <p className="font-sans text-[11px] text-[#FAF8F5]/60 mb-8 uppercase tracking-widest font-medium">
              Secure priority booking invitation
            </p>
            
            {waitlistStatus === "success" ? (
              <div className="bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 rounded-2xl p-6 text-left space-y-2 mt-4">
                <h4 className="font-serif text-lg text-[#FAF8F5]">Subscription Confirmed</h4>
                <p className="text-xs text-[#FAF8F5]/60 leading-relaxed">
                  Thank you. You have successfully joined the AIRO Minute Clinic waitlist. A scheduling coordinator will contact you to arrange your first appointment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FAF8F5]/50 mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Samuel Henderson"
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FAF8F5]/40 text-[#FAF8F5] placeholder-[#FAF8F5]/30 silent-luxury-transition"
                  />
                </div>

                <div>
                  <label className="block text-[9px] tracking-widest uppercase font-bold text-[#FAF8F5]/50 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. samuel@longevity.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/15 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#FAF8F5]/40 text-[#FAF8F5] placeholder-[#FAF8F5]/30 silent-luxury-transition"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={waitlistStatus === "submitting"}
                    className="w-full bg-[#FAF8F5] text-[#0B2114] text-[10px] font-bold tracking-widest uppercase py-4 rounded-full hover:opacity-90 disabled:opacity-50 silent-luxury-transition flex items-center justify-center gap-2"
                  >
                    {waitlistStatus === "submitting" ? "Joining..." : <>Join Clinic Booking Waitlist <ArrowRight className="w-3.5 h-3.5" /></>}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 inline-flex items-center gap-1.5 justify-center text-[9px] tracking-wider uppercase text-[#FAF8F5]/40 font-semibold">
              <Shield className="w-3.5 h-3.5" /> HIPAA Compliant & Secure
            </div>
          </div>

        </div>
      </section>

      {/* MINI FOOTER */}
      <footer className="bg-[#FAF8F5] py-16 px-6 md:px-16 border-t border-[#0B2114]/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="font-serif text-xl tracking-widest uppercase text-[#0B2114]">
            AIRO<span className="opacity-50">.</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] tracking-widest uppercase font-bold text-[#0B2114]/60">
            <Link href="/grocery" className="hover:text-[#0B2114] silent-luxury-transition">Essentials</Link>
            <Link href="/pharmacy" className="hover:text-[#0B2114] silent-luxury-transition">Pharmacy</Link>
            <Link href="/minute-clinic" className="hover:text-[#0B2114] silent-luxury-transition">Minute Clinic</Link>
            <Link href="/privacy-policy" className="hover:text-[#0B2114] silent-luxury-transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#0B2114] silent-luxury-transition">Terms of Service</Link>
          </div>
          <span className="text-[9px] tracking-widest uppercase text-[#0B2114]/40 font-medium">
            © 2026 AIRO Minute Clinic. All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}
