import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Clock, Video, Heart, Sparkles, Scale, Users, Shield, PackageOpen, Stethoscope, Lock, Home } from "lucide-react";

export const metadata = {
  title: "AIRO E-Med | Personalized Healthcare. From Your Home.",
  description: "Telemedicine platform providing personalized treatment for hair loss, sexual health, and weight management for men and women.",
};

export default function AiroEMedPage() {
  return (
    <div className="w-full bg-[#FAFAFA] text-[#1C1C1E] min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-32 pb-24 md:pb-32 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        <div className="flex-1 w-full flex flex-col items-start text-left z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-blue-600 block mb-4 font-bold flex items-center gap-2">
            <Video className="w-4 h-4" /> AIRO E-Med
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[4rem] tracking-tight leading-[1.1] text-[#1C1C1E] mb-6">
            Personalized Healthcare. <br/><span className="text-[#1C1C1E]/60 italic font-light">From Your Home.</span>
          </h1>
          <p className="font-serif text-lg md:text-xl text-[#1C1C1E]/80 max-w-xl leading-relaxed mb-6">
            Better healthcare shouldn't have to mean waiting rooms, inconvenient appointments, or uncomfortable conversations.
          </p>
          <p className="text-base text-[#1C1C1E]/70 max-w-xl leading-relaxed mb-8">
            <strong className="text-[#1C1C1E]">AIRO E-Med connects you with doctors through secure virtual consultations for personalized treatment in hair loss, sexual health, and weight management.</strong> Speak with a doctor from the comfort and privacy of your home. If treatment is medically appropriate, your personalized prescription can be delivered directly to your door in discreet packaging.
          </p>
          
          <div className="flex flex-col gap-3 mb-10 w-full max-w-md">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Consult a Doctor</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Get a Personalized Plan</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-[#1C1C1E]/80">Have Your Treatment Delivered</span>
            </div>
          </div>

          <a 
            href="https://airoemed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold text-[#FFFFFF] bg-[#1C1C1E] px-8 py-4 rounded-full border border-[#1C1C1E] hover:bg-blue-600 hover:border-blue-600 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Consultation <ArrowUpRight className="w-4 h-4" />
          </a>
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

      {/* What is AIRO E-Med? */}
      <section className="bg-[#1C1C1E] text-white py-24 px-6 md:px-16 w-full relative">
        <div className="max-w-[1000px] mx-auto text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 block mb-6 font-bold">
            The Platform
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            What Is AIRO E-Med?
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-12">
            AIRO E-Med is a <strong className="text-white">telemedicine platform providing personalized treatment for hair loss, sexual health, and weight management for men and women.</strong> Instead of navigating traditional healthcare for every concern, you can start your care online.
          </p>
          <p className="text-base text-white/60 leading-relaxed max-w-3xl mx-auto mb-16">
            You provide information about your health and treatment goals, connect with a doctor through a virtual consultation, and receive a treatment plan tailored to your individual needs. When medication is prescribed and appropriate, it is delivered directly to your home in <strong className="text-white">discreet packaging</strong>.
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-sm">
            <h3 className="font-serif text-2xl mb-8">Your healthcare journey, simplified:</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm font-bold tracking-widest uppercase text-blue-400">
              <span className="flex items-center gap-2"><Home className="w-5 h-5"/> Online Consultation</span>
              <span className="hidden md:block text-white/20">→</span>
              <span className="flex items-center gap-2"><Stethoscope className="w-5 h-5"/> Doctor Evaluation</span>
              <span className="hidden md:block text-white/20">→</span>
              <span className="flex items-center gap-2"><Sparkles className="w-5 h-5"/> Personalized Treatment</span>
              <span className="hidden md:block text-white/20">→</span>
              <span className="flex items-center gap-2"><PackageOpen className="w-5 h-5"/> Home Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Can AIRO E-Med Help With? */}
      <section className="py-24 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1C1E]/40 block mb-6 font-bold">
            Treatment Areas
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1C1C1E]">
            What Can AIRO E-Med Help With?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Hair Loss */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#1C1C1E]/5 flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl mb-4">Hair Loss</h3>
            <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-4">
              Hair loss can affect your appearance, confidence, and quality of life. AIRO E-Med provides personalized treatment options for eligible hair-loss concerns through virtual medical care.
            </p>
            <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-8 flex-grow">
              Whether you're experiencing thinning hair, a receding hairline, or other common forms of hair loss, you can speak with a doctor without having to visit a traditional clinic.
            </p>
            <p className="font-bold text-xs uppercase tracking-widest text-[#1C1C1E] mb-6">Personalized hair-loss care, from home.</p>
            <a href="https://airoemed.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold text-blue-600 hover:text-[#1C1C1E] transition-colors mt-auto">
              Explore Treatment →
            </a>
          </div>

          {/* Sexual Health */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#1C1C1E]/5 flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl mb-4">Sexual Health</h3>
            <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-4">
              Sexual health is healthcare—and it should be easier to talk about. AIRO E-Med provides private, convenient access to medical care for eligible sexual-health concerns for both men and women.
            </p>
            <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-8 flex-grow">
              Speak with a doctor virtually, discuss your concerns in a confidential setting, and receive personalized treatment when medically appropriate.
            </p>
            <p className="font-bold text-xs uppercase tracking-widest text-[#1C1C1E] mb-6">Private care. No waiting room. No unnecessary awkwardness.</p>
            <a href="https://airoemed.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold text-blue-600 hover:text-[#1C1C1E] transition-colors mt-auto">
              Explore Treatment →
            </a>
          </div>

          {/* Weight Management */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#1C1C1E]/5 flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-600">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl mb-4">Weight Management</h3>
            <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-4">
              Losing weight isn't simply about willpower. Effective weight management can involve your health history, lifestyle, metabolism, medications, and individual goals.
            </p>
            <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-8 flex-grow">
              AIRO E-Med provides personalized medical guidance for eligible patients seeking support. Your doctor evaluates your individual situation and determines whether a medical treatment plan is appropriate for you.
            </p>
            <p className="font-bold text-xs uppercase tracking-widest text-[#1C1C1E] mb-6">A treatment plan built around you—not a generic program.</p>
            <a href="https://airoemed.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold text-blue-600 hover:text-[#1C1C1E] transition-colors mt-auto">
              Explore Treatment →
            </a>
          </div>
        </div>
      </section>

      {/* Care for Men & Women */}
      <section className="bg-gradient-to-b from-[#F2F4F7] to-[#FAFAFA] py-24 px-6 md:px-16 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-8">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-6">
            Care for Men & Women
          </h2>
          <p className="text-lg text-[#1C1C1E]/70 mb-12">
            Your healthcare needs are personal. AIRO E-Med provides access to personalized treatment across our core health categories for both men and women.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#1C1C1E]/10">
              <h3 className="font-serif text-2xl mb-6 pb-4 border-b border-[#1C1C1E]/10">For Men</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-600"/> Hair loss</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-600"/> Sexual health</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-600"/> Weight management</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#1C1C1E]/10">
              <h3 className="font-serif text-2xl mb-6 pb-4 border-b border-[#1C1C1E]/10">For Women</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-600"/> Hair loss</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-600"/> Sexual health</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-600"/> Weight management</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-12 text-sm text-[#1C1C1E]/60 italic">
            Your doctor evaluates your individual needs and determines what treatment is medically appropriate.
          </p>
        </div>
      </section>

      {/* How It Works (Steps) */}
      <section className="py-24 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#1C1C1E]">
            How AIRO E-Med Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: "01", title: "Start Online", desc: "Tell us about your health concerns, medical history, and treatment goals. No waiting room. No unnecessary trip to a clinic." },
            { step: "02", title: "Consult With a Doctor", desc: "Connect with a doctor through a secure virtual consultation. Discuss your concerns, ask questions, and receive medical guidance." },
            { step: "03", title: "Get Your Plan", desc: "If treatment is medically appropriate, your doctor will recommend a plan. It starts with a medical evaluation, not just a product click." },
            { step: "04", title: "Treatment Delivered", desc: "Once prescribed, your treatment can be delivered directly to your home in discreet packaging. No trips to the pharmacy." },
            { step: "05", title: "Continue Your Care", desc: "Healthcare doesn't stop. Use your available virtual-care resources for questions, follow-up, and ongoing treatment management." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-[#1C1C1E]/5 hover:shadow-lg transition-all">
              <span className="text-4xl font-serif font-light text-[#1C1C1E]/20 mb-4">{item.step}</span>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-4">{item.title}</h4>
              <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why AIRO E-Med? Features Grid */}
      <section className="bg-[#1C1C1E] text-white py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
              Why AIRO E-Med?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            <div className="flex flex-col gap-4">
              <Stethoscope className="w-8 h-8 text-blue-400" />
              <h3 className="font-serif text-2xl">Doctor-Connected Care</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                You're not simply purchasing a product. AIRO E-Med connects you with a doctor who evaluates your situation and determines whether treatment is appropriate.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h3 className="font-serif text-2xl">Personalized Treatment</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Your health isn't identical to someone else's. Your treatment plan is based on your individual health information, concerns, goals, and medical evaluation.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Video className="w-8 h-8 text-blue-400" />
              <h3 className="font-serif text-2xl">Convenient Virtual Care</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Get started from wherever you are. Your consultation happens virtually, eliminating unnecessary travel and waiting-room time.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Lock className="w-8 h-8 text-blue-400" />
              <h3 className="font-serif text-2xl">Private & Discreet</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Some health concerns are personal. AIRO E-Med is designed to give you a more private way to access care, with treatment delivered in discreet packaging.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-2">
              <PackageOpen className="w-8 h-8 text-blue-400" />
              <h3 className="font-serif text-2xl">Direct-to-Door Delivery</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                When treatment is prescribed and eligible for delivery, it can be shipped directly to your home. Your care comes to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 px-6 md:px-16 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-4xl mb-4 text-[#1C1C1E]">The AIRO E-Med Difference</h2>
        <p className="text-lg text-[#1C1C1E]/60 mb-16">Healthcare without the unnecessary hassle.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FAFAFA] border border-[#1C1C1E]/10 p-8 rounded-2xl flex flex-col gap-4 opacity-70">
            <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C1C1E]/60 mb-4">Traditional Healthcare</h3>
            <span className="text-sm">Find a provider</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="text-sm">Schedule an appointment</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="text-sm">Travel to the clinic</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="text-sm">Wait to be seen</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="text-sm">Discuss your concern</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="text-sm">Visit a pharmacy</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="text-sm">Begin treatment</span>
          </div>
          
          <div className="bg-white border-2 border-[#1C1C1E] shadow-2xl p-8 rounded-2xl flex flex-col justify-center gap-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-blue-600 mb-2">AIRO E-Med</h3>
            <span className="font-bold text-lg">Start online</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="font-bold text-lg">Consult with a doctor virtually</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="font-bold text-lg">Receive a personalized treatment plan</span>
            <span className="text-[#1C1C1E]/20">↓</span>
            <span className="font-bold text-lg">Treatment delivered discreetly to your home</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-24 px-6 md:px-16 text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-6">Take Control of Your Health</h2>
        <p className="text-xl md:text-2xl font-light italic mb-8 opacity-90">Your concerns are personal. Your treatment should be too.</p>
        <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed opacity-80 mb-12">
          Whether you're dealing with hair loss, looking for support with sexual health, or working toward your weight-management goals, AIRO E-Med gives you a convenient way to connect with medical care from home.
        </p>
        <a 
          href="https://airoemed.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase font-bold text-blue-600 bg-white px-10 py-5 rounded-full hover:scale-105 transition-transform shadow-2xl"
        >
          Start your virtual consultation today <ArrowUpRight className="w-5 h-5" />
        </a>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-16 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-[#1C1C1E]">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="w-full space-y-4">
          <details className="group bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1E]/5 open:shadow-md transition-all cursor-pointer">
            <summary className="font-serif text-lg font-medium text-[#1C1C1E] list-none flex justify-between items-center outline-none">
              What is AIRO E-Med?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 text-[#1C1C1E]/70 leading-relaxed text-sm border-t border-[#1C1C1E]/5 pt-4">
              AIRO E-Med is a telemedicine platform providing personalized treatment for eligible hair-loss, sexual-health, and weight-management concerns for men and women.
            </div>
          </details>

          <details className="group bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1E]/5 open:shadow-md transition-all cursor-pointer">
            <summary className="font-serif text-lg font-medium text-[#1C1C1E] list-none flex justify-between items-center outline-none">
              Do I speak with a doctor?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 text-[#1C1C1E]/70 leading-relaxed text-sm border-t border-[#1C1C1E]/5 pt-4">
              Yes. AIRO E-Med connects eligible patients with a doctor through a virtual consultation.
            </div>
          </details>

          <details className="group bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1E]/5 open:shadow-md transition-all cursor-pointer">
            <summary className="font-serif text-lg font-medium text-[#1C1C1E] list-none flex justify-between items-center outline-none">
              Is treatment personalized?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 text-[#1C1C1E]/70 leading-relaxed text-sm border-t border-[#1C1C1E]/5 pt-4">
              Yes. Treatment recommendations are based on your individual health information and medical evaluation.
            </div>
          </details>

          <details className="group bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1E]/5 open:shadow-md transition-all cursor-pointer">
            <summary className="font-serif text-lg font-medium text-[#1C1C1E] list-none flex justify-between items-center outline-none">
              Do I automatically receive medication?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 text-[#1C1C1E]/70 leading-relaxed text-sm border-t border-[#1C1C1E]/5 pt-4">
              No. A prescription is provided only when a doctor determines that treatment is medically appropriate.
            </div>
          </details>

          <details className="group bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1E]/5 open:shadow-md transition-all cursor-pointer">
            <summary className="font-serif text-lg font-medium text-[#1C1C1E] list-none flex justify-between items-center outline-none">
              Do I need to visit a clinic?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 text-[#1C1C1E]/70 leading-relaxed text-sm border-t border-[#1C1C1E]/5 pt-4">
              AIRO E-Med is designed to provide care virtually. However, some medical conditions require an in-person evaluation and may not be appropriate for telemedicine.
            </div>
          </details>

          <details className="group bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1E]/5 open:shadow-md transition-all cursor-pointer">
            <summary className="font-serif text-lg font-medium text-[#1C1C1E] list-none flex justify-between items-center outline-none">
              How is my treatment delivered?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 text-[#1C1C1E]/70 leading-relaxed text-sm border-t border-[#1C1C1E]/5 pt-4">
              When prescribed and eligible for home delivery, your treatment is shipped directly to your home in discreet packaging.
            </div>
          </details>

          <details className="group bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1E]/5 open:shadow-md transition-all cursor-pointer">
            <summary className="font-serif text-lg font-medium text-[#1C1C1E] list-none flex justify-between items-center outline-none">
              Is my consultation private?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 text-[#1C1C1E]/70 leading-relaxed text-sm border-t border-[#1C1C1E]/5 pt-4">
              AIRO E-Med is designed to provide a private and convenient way to discuss personal health concerns through virtual care.
            </div>
          </details>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="bg-[#1C1C1E]/5 py-12 px-6 md:px-16 text-center">
        <p className="max-w-5xl mx-auto text-xs text-[#1C1C1E]/50 leading-relaxed uppercase tracking-wider">
          <strong className="block mb-2 text-[#1C1C1E]/70">Medical Disclaimer</strong>
          AIRO E-Med provides telemedicine services for eligible patients and medical conditions. Treatment recommendations and prescriptions are provided only when determined medically appropriate by a licensed healthcare professional. Not every patient or condition is appropriate for virtual care. Individual results may vary. If a condition requires an in-person examination or urgent medical attention, patients may be directed to appropriate in-person care.
        </p>
      </section>

    </div>
  );
}
