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
import { useCms } from "@/context/CmsContext";

export default function HealthChairPage() {
  const cmsData = useCms();

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

  const pageContent = cmsData.pages.healthChair;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pc = pageContent as any;
  const { assessment, insights } = pc.sections;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = pc.sections;
  const connectedEcosystem = sections.connectedEcosystem;
  const preventiveSection = sections.preventiveSection;
  const finalCta = sections.finalCta;

  // Parse metrics from comma-separated string
  const metricLabels = (pc.metrics || "Blood Pressure, Heart Rate & ECG, SpO₂, Respiratory Rate, Temperature, Weight & BMI")
    .split(',')
    .map((s: string) => s.trim());

  // Map metric labels to icons
  const metricIconMap: Record<string, typeof Activity> = {
    "Blood Pressure": Activity,
    "Heart Rate & ECG": Heart,
    "SpO₂": Wind,
    "Respiratory Rate": Activity,
    "Temperature": Thermometer,
    "Weight & BMI": Scale,
  };

  // Parse assessment steps
  const assessmentSteps = assessment.steps || [
    { title: "Take a Seat", description: "Relax in the AIRO chair as the intuitive sensors automatically activate to begin your assessment." },
    { title: "Assessment Begins", description: "Clinical-grade sensors capture your vitals in real-time, analyzing hundreds of data points instantly." },
    { title: "Receive Profile", description: "Your secure, comprehensive health report is immediately sent to your AIRO App for review." }
  ];

  // Parse insight cards
  const insightCards = insights.cards || [
    { title: "Vital Signs", description: "Real-time, clinical-grade telemetry." },
    { title: "Health Baseline", description: "Your unique biological starting point." },
    { title: "Trend Tracking", description: "Monitor changes and improvements over time." },
    { title: "Doctor Review", description: "Data verified by AIRO clinical professionals." },
    { title: "AIRO Record", description: "Your entire health history, securely stored." }
  ];

  const cardIconMap: Record<string, typeof Activity> = {
    "Vital Signs": Activity,
    "Health Baseline": ShieldCheck,
    "Trend Tracking": Thermometer,
    "Doctor Review": Stethoscope,
    "AIRO Record": FileText,
  };

  // Parse connected ecosystem nodes
  const connectedNodeLabels = (connectedEcosystem?.nodes || "Health Scan, AIRO App, Minute Clinic, Doctor Consult, Pharmacy")
    .split(',')
    .map((s: string) => s.trim());

  const nodeIconMap: Record<string, typeof Activity> = {
    "Health Scan": Activity,
    "AIRO App": Smartphone,
    "Minute Clinic": ShieldCheck,
    "Doctor Consult": Stethoscope,
    "Pharmacy": Pill,
  };

  return (
    <div className="bg-[#FAF8F5] text-[#0B2114] min-h-screen font-sans selection:bg-[#0B2114] selection:text-[#FAF8F5] overflow-clip">
      <GlobalHeader />

      {/* SECTION 1: HERO */}
      <section className="relative w-full h-[100dvh] flex items-center overflow-hidden bg-[#09120F]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url('${pc.heroImage || "/chair-hero.jpg"}')` }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#09120F]/90 via-[#09120F]/50 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent opacity-10" />

        <div className="relative z-10 w-full px-6 md:px-16 flex flex-col md:flex-row items-center justify-between h-full pt-32 md:pt-24 pb-12">
          
          {/* Text Content (Centered on mobile, Left on desktop) */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left text-[#FAF8F5]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[9px] font-bold tracking-[0.25em] uppercase mb-8"
            >
              <Cpu className="w-3 h-3 text-white" /> {pc.heroBadge || "Clinical Innovation"}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6 text-white"
            >
              {pageContent.title.split(' ')[0]}<br/>
              <span className="italic font-light">{pageContent.title.split(' ')[1]}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl font-serif italic text-white/80 mb-6"
            >
              {pageContent.subtitle.split('.')[0]}.<br/>{pageContent.subtitle.split('.').slice(1).join('.')}
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-sm md:text-base text-white/60 max-w-md leading-relaxed"
            >
              {pc.description}
            </motion.p>
          </div>

          {/* Floating Metrics (Right Aligned) */}
          <div className="hidden lg:flex w-full md:w-1/2 justify-end">
            <div className="flex flex-col gap-4">
              {metricLabels.map((label: string, i: number) => {
                const IconComp = metricIconMap[label] || Activity;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="flex items-center gap-4 bg-black/20 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-2xl border border-white/10"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <IconComp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">{label}</span>
                  </motion.div>
                );
              })}
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
      <section className="bg-white py-24 md:py-32 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-24 z-20 relative">
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-4">
              {assessment.title.split('.')[0]}. <span className="italic font-light text-[#0B2114]/60">{assessment.title.split('.').slice(1).join('.')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-20">
            {assessmentSteps.map((step: { title: string; description: string }, i: number) => {
              const stepIcons = [Activity, Heart, CheckCircle2];
              const stepColors = [
                "border-[#0B2114]/20 bg-[#FAF8F5]",
                "border-blue-500/20 bg-blue-50/50",
                "border-green-500/20 bg-green-50/50"
              ];
              const StepIcon = stepIcons[i] || Activity;
              const iconColor = i === 2 ? "text-green-600/60" : "text-[#0B2114]/60";
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-full border ${stepColors[i]} flex items-center justify-center mb-6`}>
                    <StepIcon className={`w-8 h-8 ${iconColor}`} />
                  </div>
                  <div className="font-serif text-3xl italic text-[#0B2114]/30 mb-2">0{i + 1}</div>
                  <h3 className="font-bold text-xl uppercase tracking-widest mb-4">{step.title}</h3>
                  <p className="text-[#0B2114]/60 leading-relaxed max-w-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT YOU GET */}
      <section className="bg-[#FAF8F5] py-24 md:py-32 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-24 relative z-20">
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-4">
              {insights.title.split(' ')[0]} {insights.title.split(' ')[1]} <span className="italic font-light text-[#0B2114]/60">{insights.title.split(' ').slice(2).join(' ')}</span>
            </h2>
            <p className="text-[#0B2114]/60 max-w-xl mx-auto">{insights.description.split('.')[0]}.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 relative z-20">
            {insightCards.map((card: { title: string; description: string }, i: number) => {
              const CardIcon = cardIconMap[card.title] || Activity;
              return (
                <div key={i} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm bg-white border border-[#0B2114]/5 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-[#0B2114]/5 rounded-xl flex items-center justify-center mb-6">
                    <CardIcon className="w-6 h-6 text-[#0B2114]" />
                  </div>
                  <h4 className="font-bold text-lg uppercase tracking-widest mb-2">{card.title}</h4>
                  <p className="text-[#0B2114]/60 text-sm leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: CONNECTED CARE */}
      <section className="bg-[#0B2114] text-[#FAF8F5] py-32 md:py-48 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-24 text-[#FAF8F5]">
            {(connectedEcosystem?.title || "Connected To The Entire AIRO Ecosystem").split('Entire')[0]}Entire <span className="italic font-light text-[#FAF8F5]/80">{(connectedEcosystem?.title || "Connected To The Entire AIRO Ecosystem").split('Entire')[1]}</span>
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

            {connectedNodeLabels.map((label: string, i: number) => {
              const NodeIcon = nodeIconMap[label] || Activity;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center gap-4 bg-[#0B2114]">
                  <div className="w-20 h-20 rounded-full border-2 border-[#FAF8F5]/20 bg-[#0B2114] flex items-center justify-center">
                    <NodeIcon className="w-8 h-8 text-[#FAF8F5]" />
                  </div>
                  <span className="font-bold text-[10px] uppercase tracking-widest text-[#FAF8F5]/70 w-24 text-center">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile view of flow */}
          <div className="md:hidden flex flex-col gap-8 relative items-center">
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-[#FAF8F5]/10 -translate-x-1/2 z-0" />
            {connectedNodeLabels.map((label: string, i: number) => {
              const NodeIcon = nodeIconMap[label] || Activity;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px" }}
                  className="relative z-10 flex flex-col items-center gap-4 bg-[#0B2114] py-4"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-[#FAF8F5]/20 bg-[#0B2114] flex items-center justify-center">
                    <NodeIcon className="w-6 h-6 text-[#FAF8F5]" />
                  </div>
                  <span className="font-bold text-[10px] uppercase tracking-widest text-[#FAF8F5]/70">
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 5: PREVENTIVE HEALTH */}
      <section ref={preventRef} className="bg-[#09120F] text-[#FAF8F5] py-32 md:py-48 px-6 md:px-16 overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto text-center relative z-20">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-8 text-[#FAF8F5]">
            {(preventiveSection?.title || "Know Earlier. Act Sooner.").split('.')[0]}. <span className="italic font-light text-[#FAF8F5]/80">{(preventiveSection?.title || "Know Earlier. Act Sooner.").split('.').slice(1).join('.')}</span>
          </h2>
          <p className="text-[#FAF8F5]/60 max-w-xl mx-auto mb-24">
            {preventiveSection?.description || "People shouldn't feel they're using a machine. They should feel they're gaining unprecedented visibility into their own health."}
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
            src={finalCta?.image || "/chair-4.jpg"} 
            alt="AIRO Health Chair" 
            className="max-w-[400px] w-full h-auto object-contain mix-blend-multiply mb-12" 
          />
          
          <h2 className="font-serif text-5xl md:text-7xl tracking-tight mb-12">
            {(finalCta?.title || "Your Health Journey Starts Here.").split('Journey')[0]}Journey <span className="italic font-light">{(finalCta?.title || "Your Health Journey Starts Here.").split('Journey')[1]}</span>
          </h2>
          
          <Link 
            href={finalCta?.buttonLink || "/minute-clinic"} 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0B2114] text-[#FAF8F5] text-[10px] tracking-widest uppercase font-bold hover:bg-[#1A3324] hover:shadow-[0_0_30px_rgba(11,33,20,0.3)] transition-all duration-500"
          >
            {finalCta?.buttonText || "Book Your AIRO Health Scan"}
          </Link>
        </div>
      </section>
    </div>
  );
}
