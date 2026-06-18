"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  Cpu, Activity, Heart, Wind, Thermometer, 
  Scale, FileText, Smartphone, Stethoscope, Pill, ShieldCheck, 
  ChevronDown, CheckCircle2 
} from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

export default function HealthChairPage() {
  // =========================================================================
  // SECTION 1: HERO
  // =========================================================================
  // Simplified hero since we are using a full background image.

  // =========================================================================
  // SECTION 2: HOW IT WORKS
  // =========================================================================
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsProgress } = useScroll({
    target: stepsRef,
    offset: ["start start", "end start"]
  });

  const step1Opacity = useTransform(stepsProgress, [0, 0.2, 0.3], [1, 1, 0.3]);
  const step2Opacity = useTransform(stepsProgress, [0.3, 0.5, 0.6], [0.3, 1, 0.3]);
  const step3Opacity = useTransform(stepsProgress, [0.6, 0.8, 1], [0.3, 1, 1]);

  const step1VisualOpacity = useTransform(stepsProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const step2VisualOpacity = useTransform(stepsProgress, [0.3, 0.5, 0.6], [0, 1, 0]);
  const step3VisualOpacity = useTransform(stepsProgress, [0.6, 0.8, 1], [0, 1, 1]);

  // =========================================================================
  // SECTION 3: WHAT YOU GET
  // =========================================================================
  const cardsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cardsProgress } = useScroll({
    target: cardsRef,
    offset: ["start start", "end start"]
  });

  // =========================================================================
  // SECTION 4: CONNECTED CARE
  // =========================================================================
  const flowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: flowProgress } = useScroll({
    target: flowRef,
    offset: ["start 80%", "end 50%"]
  });
  const pathLength = useTransform(flowProgress, [0, 1], [0, 1]);

  // =========================================================================
  // SECTION 5: PREVENTIVE HEALTH
  // =========================================================================
  const preventRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-[#FAF8F5] text-[#0B2114] min-h-screen font-sans selection:bg-[#0B2114] selection:text-[#FAF8F5] overflow-clip">
      <GlobalHeader />

      {/* SECTION 1: HERO */}
      <section className="relative w-full h-[100dvh] flex items-center overflow-hidden bg-[#09120F]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: "url('/health-scan-chair.png')" }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#09120F]/90 via-[#09120F]/50 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent opacity-10" />

        <div className="relative z-10 w-full px-6 md:px-16 flex flex-col md:flex-row items-center justify-between h-full pt-24 pb-12">
          
          {/* Text Content (Left Aligned) */}
          <div className="w-full md:w-1/2 flex flex-col items-start text-left text-[#FAF8F5]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[9px] font-bold tracking-[0.25em] uppercase mb-8"
            >
              <Cpu className="w-3 h-3 text-white" /> Clinical Innovation
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6 text-white"
            >
              The AIRO<br/>
              <span className="italic font-light">Health Scan</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl font-serif italic text-white/80 mb-6"
            >
              A 5-minute health assessment.<br/>A lifetime of health insights.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-sm md:text-base text-white/60 max-w-md leading-relaxed"
            >
              Capture key health indicators in minutes and establish your personalized health baseline—all within the AIRO ecosystem.
            </motion.p>
          </div>

          {/* Floating Metrics (Right Aligned) */}
          <div className="hidden lg:flex w-full md:w-1/2 justify-end">
            <div className="flex flex-col gap-4">
              {[
                { icon: Activity, label: "Blood Pressure" },
                { icon: Heart, label: "Heart Rate & ECG" },
                { icon: Wind, label: "SpO₂" },
                { icon: Activity, label: "Respiratory Rate" },
                { icon: Thermometer, label: "Temperature" },
                { icon: Scale, label: "Weight & BMI" },
              ].map((metric, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-4 bg-black/20 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-2xl border border-white/10"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <metric.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">{metric.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50 text-white z-20"
        >
          <span className="text-[9px] uppercase tracking-widest font-bold mb-2">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section ref={stepsRef} className="relative h-[300vh] bg-white">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 md:px-16 overflow-hidden">
          
          <div className="text-center mb-16 z-20">
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-4">
              Three Steps. <span className="italic font-light text-[#0B2114]/60">Five Minutes.</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row w-full max-w-[1200px] h-[50vh] relative">
            
            {/* Visual Center */}
            <div className="w-full md:w-1/2 h-full relative flex items-center justify-center order-1 md:order-2">
              <motion.div style={{ opacity: step1VisualOpacity }} className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-[#0B2114]/20 flex items-center justify-center bg-[#FAF8F5]">
                  <Activity className="w-12 h-12 text-[#0B2114]/40" />
                </div>
              </motion.div>
              <motion.div style={{ opacity: step2VisualOpacity }} className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute inset-8 rounded-full border border-green-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <Heart className="w-16 h-16 text-[#0B2114]" />
                </div>
              </motion.div>
              <motion.div style={{ opacity: step3VisualOpacity }} className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 bg-white rounded-3xl shadow-2xl border border-[#0B2114]/10 p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#0B2114]/5">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Health Profile</div>
                      <div className="text-xs text-[#0B2114]/50">Generated Successfully</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-[#0B2114]/5 rounded w-full" />
                    <div className="h-4 bg-[#0B2114]/5 rounded w-5/6" />
                    <div className="h-4 bg-[#0B2114]/5 rounded w-4/6" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Text Steps */}
            <div className="w-full md:w-1/2 flex flex-col justify-center gap-12 order-2 md:order-1 mt-12 md:mt-0">
              <motion.div style={{ opacity: step1Opacity }} className="flex gap-6 items-start transition-opacity duration-300">
                <div className="font-serif text-3xl italic text-[#0B2114]/30">01</div>
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-widest mb-2">Take a Seat</h3>
                  <p className="text-[#0B2114]/60 leading-relaxed">Relax in the AIRO chair as the intuitive sensors automatically activate to begin your assessment.</p>
                </div>
              </motion.div>
              <motion.div style={{ opacity: step2Opacity }} className="flex gap-6 items-start transition-opacity duration-300">
                <div className="font-serif text-3xl italic text-[#0B2114]/30">02</div>
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-widest mb-2">Assessment Begins</h3>
                  <p className="text-[#0B2114]/60 leading-relaxed">Clinical-grade sensors capture your vitals in real-time, analyzing hundreds of data points instantly.</p>
                </div>
              </motion.div>
              <motion.div style={{ opacity: step3Opacity }} className="flex gap-6 items-start transition-opacity duration-300">
                <div className="font-serif text-3xl italic text-[#0B2114]/30">03</div>
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-widest mb-2">Receive Your Profile</h3>
                  <p className="text-[#0B2114]/60 leading-relaxed">Your secure, comprehensive health report is immediately sent to your AIRO App for review.</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT YOU GET */}
      <section ref={cardsRef} className="relative h-[400vh] bg-[#FAF8F5]">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 md:px-16 overflow-hidden">
          <div className="text-center mb-16 z-20">
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-4">
              More Than <span className="italic font-light text-[#0B2114]/60">Measurements</span>
            </h2>
            <p className="text-[#0B2114]/60 max-w-xl mx-auto">See how your raw data transforms into actionable insights.</p>
          </div>

          <div className="relative w-full max-w-[600px] h-[400px]">
            {[
              { title: "Vital Signs", desc: "Real-time, clinical-grade telemetry.", icon: Activity, z: 50 },
              { title: "Health Baseline", desc: "Your unique biological starting point.", icon: ShieldCheck, z: 40 },
              { title: "Trend Tracking", desc: "Monitor changes and improvements over time.", icon: Thermometer, z: 30 },
              { title: "Doctor Review", desc: "Data verified by AIRO clinical professionals.", icon: Stethoscope, z: 20 },
              { title: "AIRO Record", desc: "Your entire health history, securely stored.", icon: FileText, z: 10 },
            ].map((card, i) => (
              <AnimatedCard key={i} card={card} index={i} progress={cardsProgress} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CONNECTED CARE */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-32 md:py-48 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-24">
            Connected To The Entire <span className="italic font-light text-[#FAF8F5]/80">AIRO Ecosystem</span>
          </h2>

          <div ref={flowRef} className="relative max-w-[1000px] mx-auto hidden md:flex items-center justify-between">
            {/* SVG Line connecting nodes */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#FAF8F5]/10 -translate-y-1/2 z-0" />
            <svg className="absolute top-1/2 left-0 w-full h-[4px] -translate-y-1/2 z-0 overflow-visible" preserveAspectRatio="none">
              <motion.line 
                x1="0" y1="2" x2="100%" y2="2" 
                stroke="#FAF8F5" 
                strokeWidth="2"
                strokeDasharray="1000"
                style={{ 
                  strokeDashoffset: useTransform(pathLength, [0, 1], [1000, 0]) 
                }}
              />
            </svg>

            {[
              { icon: Activity, label: "Health Scan" },
              { icon: Smartphone, label: "AIRO App" },
              { icon: ShieldCheck, label: "Minute Clinic" },
              { icon: Stethoscope, label: "Doctor Consult" },
              { icon: Pill, label: "Pharmacy" },
            ].map((node, i) => (
              <AnimatedNode key={i} node={node} index={i} progress={flowProgress} />
            ))}
          </div>

          {/* Mobile view of flow */}
          <div className="md:hidden flex flex-col gap-8 relative items-center">
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-[#FAF8F5]/10 -translate-x-1/2 z-0" />
            {[
              { icon: Activity, label: "Health Scan" },
              { icon: Smartphone, label: "AIRO App" },
              { icon: ShieldCheck, label: "Minute Clinic" },
              { icon: Stethoscope, label: "Doctor Consult" },
              { icon: Pill, label: "Pharmacy" },
            ].map((node, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                className="relative z-10 flex flex-col items-center gap-4 bg-[#0B2114] py-4"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#FAF8F5]/20 bg-[#0B2114] flex items-center justify-center">
                  <node.icon className="w-6 h-6 text-[#FAF8F5]" />
                </div>
                <span className="font-bold text-[10px] uppercase tracking-widest text-[#FAF8F5]/70">
                  {node.label}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: PREVENTIVE HEALTH */}
      <section ref={preventRef} className="bg-[#09120F] text-[#FAF8F5] py-32 md:py-48 px-6 md:px-16 overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto text-center relative z-20">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-8">
            Know Earlier. <span className="italic font-light text-[#FAF8F5]/80">Act Sooner.</span>
          </h2>
          <p className="text-[#FAF8F5]/60 max-w-xl mx-auto mb-24">
            People shouldn&apos;t feel they&apos;re using a machine. They should feel they&apos;re gaining unprecedented visibility into their own health.
          </p>

          <div className="relative w-full max-w-[400px] mx-auto h-[600px] flex items-center justify-center">
            {/* Abstract Silhouette */}
            <svg viewBox="0 0 200 400" className="w-full h-full opacity-20">
              <path d="M100 20 C120 20, 130 40, 130 60 C130 80, 120 90, 100 90 C80 90, 70 80, 70 60 C70 40, 80 20, 100 20 Z" fill="none" stroke="#FAF8F5" strokeWidth="2" />
              <path d="M100 90 C140 90, 160 120, 160 160 L160 250 C160 270, 140 280, 120 280 L120 380 C120 390, 110 400, 100 400 C90 400, 80 390, 80 380 L80 280 C60 280, 40 270, 40 250 L40 160 C40 120, 60 90, 100 90 Z" fill="none" stroke="#FAF8F5" strokeWidth="2" />
            </svg>

            {/* Pulsing Indicators */}
            {[
              { top: "25%", left: "55%", label: "Heart Health", icon: "❤️", delay: 0 },
              { top: "35%", left: "45%", label: "Respiratory", icon: "🫁", delay: 0.5 },
              { top: "50%", left: "60%", label: "Circulation", icon: "🩸", delay: 1 },
              { top: "15%", left: "40%", label: "Wellness", icon: "⚡", delay: 1.5 },
            ].map((indicator, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ delay: indicator.delay, duration: 0.8 }}
                className="absolute flex items-center gap-3"
                style={{ top: indicator.top, left: indicator.left }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#FAF8F5]/20 rounded-full animate-ping" />
                  <div className="w-3 h-3 bg-[#FAF8F5] rounded-full shadow-[0_0_15px_#FAF8F5]" />
                </div>
                <div className="bg-[#1A2E22] border border-[#FAF8F5]/10 px-3 py-1.5 rounded-full backdrop-blur-md whitespace-nowrap flex items-center gap-2">
                  <span>{indicator.icon}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">{indicator.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="bg-[#FAF8F5] text-[#0B2114] py-32 md:py-48 px-6 md:px-16 relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[100px] opacity-50 z-0 pointer-events-none" />
        
        <div className="max-w-[1000px] mx-auto text-center relative z-20 flex flex-col items-center">
          <motion.img 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            src="/chair-4.jpg" 
            alt="AIRO Health Chair" 
            className="max-w-[400px] w-full h-auto object-contain mix-blend-multiply mb-12" 
          />
          
          <h2 className="font-serif text-5xl md:text-7xl tracking-tight mb-12">
            Your Health Journey <span className="italic font-light">Starts Here.</span>
          </h2>
          
          <Link 
            href="/minute-clinic" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0B2114] text-[#FAF8F5] text-[10px] tracking-widest uppercase font-bold hover:bg-[#1A3324] hover:shadow-[0_0_30px_rgba(11,33,20,0.3)] transition-all duration-500"
          >
            Book Your AIRO Health Scan
          </Link>
        </div>
      </section>
    </div>
  );
}

// Subcomponents for animations
// AnimatedMetric is no longer needed since it was removed from the Hero

function AnimatedCard({ card, index, progress }: { card: { title: string, desc: string, icon: React.ElementType, z: number }, index: number, progress: import("framer-motion").MotionValue<number> }) {
  const yOffset = useTransform(progress, [0, 0.2 + index * 0.15], [index * 8, index * 60]);
  const scaleOffset = useTransform(progress, [0, 0.2 + index * 0.15], [1 - index * 0.02, 1 - index * 0.05]);
  const opacityOffset = useTransform(progress, [0, 0.1 + index * 0.1], [1, 1]);
  const actualOpacity = opacityOffset;

  return (
    <motion.div
      style={{ 
        y: yOffset, 
        scale: scaleOffset, 
        opacity: actualOpacity,
        zIndex: card.z 
      }}
      className="absolute top-0 left-0 w-full bg-white border border-[#0B2114]/10 rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex items-center gap-6"
    >
      <div className="w-16 h-16 bg-[#0B2114]/5 rounded-2xl flex items-center justify-center shrink-0">
        <card.icon className="w-8 h-8 text-[#0B2114]" />
      </div>
      <div>
        <h4 className="font-bold text-lg uppercase tracking-widest mb-1">{card.title}</h4>
        <p className="text-[#0B2114]/60">{card.desc}</p>
      </div>
    </motion.div>
  );
}

function AnimatedNode({ node, index, progress }: { node: { icon: React.ElementType, label: string }, index: number, progress: import("framer-motion").MotionValue<number> }) {
  const nodeOpacity = useTransform(progress, [index * 0.2, (index + 1) * 0.2], [0.3, 1]);
  const nodeScale = useTransform(progress, [index * 0.2, (index + 1) * 0.2], [0.8, 1]);
  const bgOpacity = useTransform(progress, [index * 0.2, (index + 1) * 0.2], [0, 1]);

  return (
    <motion.div 
      style={{ opacity: nodeOpacity, scale: nodeScale }}
      className="relative z-10 flex flex-col items-center gap-4 bg-[#0B2114]"
    >
      <div className="w-20 h-20 rounded-full border-2 border-[#FAF8F5]/20 bg-[#0B2114] flex items-center justify-center relative overflow-hidden">
        <motion.div 
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-[#FAF8F5]/10" 
        />
        <node.icon className="w-8 h-8 text-[#FAF8F5]" />
      </div>
      <span className="font-bold text-[10px] uppercase tracking-widest text-[#FAF8F5]/70 w-24 text-center">
        {node.label}
      </span>
    </motion.div>
  );
}
