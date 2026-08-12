import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, ShieldCheck, Stethoscope, ArrowRight } from "lucide-react";
import { minuteClinicServices } from "@/data/minuteClinicServices";

export function generateStaticParams() {
  return minuteClinicServices.map((service) => ({
    slug: service.id,
  }));
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = minuteClinicServices.find((s) => s.id === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="w-full bg-[#FAFAFA] text-ink min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative px-6 md:px-16 pt-32 pb-24 md:pb-32 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        <div className="flex-1 w-full flex flex-col items-start text-left z-10">
          <Link href="/minute-clinic#services" className="inline-flex items-center gap-2 text-xs font-semibold text-ink/60 hover:text-ink transition-colors mb-6 uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
          </Link>
          <span className="text-[10px] tracking-[0.3em] uppercase text-ink/50 block mb-4 font-bold">
            {service.mainCategory}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[4rem] tracking-tight leading-[1.1] text-ink mb-6">
            {service.title}
          </h1>
          <p className="font-serif text-lg md:text-xl text-ink/80 italic max-w-xl leading-relaxed mb-8">
            {service.shortDescription}
          </p>
          
          <div className="flex flex-col gap-3 mb-10 w-full max-w-md">
            {service.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-ink/80">{benefit}</span>
              </div>
            ))}
          </div>

          <Link 
            href="/book-health-scan"
            className="text-xs tracking-[0.2em] uppercase font-bold text-paper bg-theme px-8 py-4 rounded-full border border-theme hover:bg-blue-600 hover:border-blue-600 transition-all shadow-lg hover:shadow-xl"
          >
            Schedule an appointment
          </Link>
        </div>

        <div className="flex-1 w-full relative">
          <div className="relative aspect-[4/3] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={service.imageUrl} 
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/40 to-transparent" />
          </div>
        </div>
      </section>

      
      {/* 1.5 Problem Information */}
      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto">
        <div className="bg-white border border-theme/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-8">About {service.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-ink/50 mb-4">What is it?</h3>
              <p className="text-ink/80 leading-relaxed mb-8">
                {service.problemInformation.whatIsIt}
              </p>
              
              <h3 className="text-sm uppercase tracking-widest font-bold text-ink/50 mb-4">Causes</h3>
              <ul className="space-y-3">
                {service.problemInformation.causes.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-ink/80">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-theme/5">
              <h3 className="text-sm uppercase tracking-widest font-bold text-ink/50 mb-4">Common Symptoms</h3>
              <ul className="space-y-4">
                {service.problemInformation.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-ink/80 bg-white p-4 rounded-xl shadow-sm border border-theme/5">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="font-medium">{symptom}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100">
                <strong>Note:</strong> If you are experiencing severe symptoms, please visit an emergency room immediately.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Find Care / Booking Box */}
      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto">
        <div className="bg-theme rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Find care for {service.title.toLowerCase()}</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Skip the waiting room. Schedule your visit online or walk in to one of our state-of-the-art AIRO clinics today.
            </p>
          </div>
          <Link 
            href="/book-health-scan"
            className="whitespace-nowrap text-xs tracking-[0.2em] uppercase font-bold text-ink bg-paper px-8 py-4 rounded-full hover:bg-gray-100 transition-all shadow-md"
          >
            Select a location
          </Link>
        </div>
      </section>


      {/* 4. Why Choose AIRO MinuteClinic */}
      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-ink text-center mb-16">Why choose AIRO MinuteClinic</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-serif text-xl mb-3">Quick access to care</h3>
            <p className="text-ink/60 text-sm leading-relaxed">
              Same-day appointments and walk-in availability mean you get seen when you need it most, without the long wait.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-serif text-xl mb-3">Expert providers</h3>
            <p className="text-ink/60 text-sm leading-relaxed">
              Our board-certified nurse practitioners and physician assistants deliver clinical-grade care you can trust.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-serif text-xl mb-3">Premium environment</h3>
            <p className="text-ink/60 text-sm leading-relaxed">
              Experience healthcare in a modern, clean, and relaxing environment designed around your comfort.
            </p>
          </div>
        </div>
      </section>

      {/* 5. 3 Steps to Feeling Better */}
      <section className="bg-theme text-white py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-16">3 steps to feeling better</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[1px] bg-white/20 z-0"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-theme border-2 border-white/20 flex items-center justify-center text-xl font-bold mb-6 text-white/80">1</div>
              <h3 className="font-serif text-xl mb-3 text-white">Schedule or walk in</h3>
              <p className="text-white/60 text-sm max-w-xs">
                Book online for the fastest service, or walk in to the clinic nearest you.
              </p>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-theme border-2 border-white/20 flex items-center justify-center text-xl font-bold mb-6 text-white/80">2</div>
              <h3 className="font-serif text-xl mb-3 text-white">Quick check-in</h3>
              <p className="text-white/60 text-sm max-w-xs">
                Use our digital kiosk to check in in seconds and relax in our premium lounge.
              </p>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-theme border-2 border-white/20 flex items-center justify-center text-xl font-bold mb-6 text-white/80">3</div>
              <h3 className="font-serif text-xl mb-3 text-white">Meet your provider</h3>
              <p className="text-white/60 text-sm max-w-xs">
                Receive a thorough evaluation and personalized treatment plan from our experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQs */}
      <section className="py-24 px-6 md:px-16 max-w-[800px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-ink text-center mb-12">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {service.faqs.map((faq, idx) => (
            <details key={idx} className="group bg-white border border-theme/10 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-ink text-sm md:text-base">
                {faq.question}
                <ChevronDown className="w-5 h-5 text-ink/40 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 text-ink/70 text-sm leading-relaxed border-t border-theme/5 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>


      {/* 7. Common Health Services Carousel */}
      <section className="px-6 md:px-16 py-24 max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">Common Health Services</h2>
            <p className="text-ink/70 max-w-2xl">
              From strep tests to hypertension management and everything in between, our board-certified health care providers are here to help.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full border border-theme/20 flex items-center justify-center hover:bg-white transition-colors">
              <ChevronLeft className="w-5 h-5 text-ink/60" />
            </button>
            <button className="w-12 h-12 rounded-full border border-theme/20 flex items-center justify-center hover:bg-white transition-colors">
              <ChevronRight className="w-5 h-5 text-ink/60" />
            </button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {minuteClinicServices.slice(0, 8).map((s) => (
            <Link 
              key={s.id} 
              href={`/minute-clinic/services/${s.id}`}
              className="min-w-[280px] md:min-w-[320px] max-w-[320px] bg-white rounded-2xl overflow-hidden border border-theme/10 hover:shadow-xl transition-all group snap-start flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-xl text-ink mb-3">{s.title}</h3>
                <p className="text-ink/60 text-sm line-clamp-3 mb-6">
                  {s.shortDescription}
                </p>
                <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                  Book your appointment now <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
