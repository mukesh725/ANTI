"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Check, Send, Sparkles } from "lucide-react";
import cmsData from "@/data/cms.json";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "General Inquiry",
    message: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    try {
      // 1. Send Email Notification
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiryType: formData.type,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send email API request');
      }

      // 2. Save locally for the dashboard (optional fallback)
      const existingLeadsStr = localStorage.getItem("airo_leads");
      let leads = [];
      try {
        leads = existingLeadsStr ? JSON.parse(existingLeadsStr) : [];
      } catch {
        leads = [];
      }

      leads.unshift({
        id: Math.random().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Not Provided",
        type: formData.type,
        message: formData.message,
        source: "Contact Form",
        status: "Pending",
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("airo_leads", JSON.stringify(leads));

      // 3. Complete submission
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "General Inquiry",
        message: ""
      });

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit form', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageContent = cmsData.pages.contact;
  const { details } = pageContent.sections;

  return (
    <div className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      
      {/* Editorial Header */}
      <section className="relative px-6 md:px-12 pt-16 pb-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 mb-4 font-semibold block">
          Connect With AIRO
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#0B2114] max-w-4xl tracking-tight leading-tight mb-6">
          Start Your Journey to Proactive Health Optimization
        </h1>
        <p className="text-[#0B2114]/75 text-sm md:text-base max-w-2xl leading-relaxed">
          Whether you are looking to schedule a 5-minute Health Chair scan, request custom compounded medicine, or explore personalized nutrition, our concierge team is here to assist.
        </p>
      </section>

      {/* Main Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Contact Information & Cards */}
        <div className="lg:col-span-5 space-y-10">
          <div className="border-b border-[#E6DFD5] pb-8">
            <h2 className="font-serif text-2xl mb-6 tracking-wide">Concierge Offices</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-[#F5EFEB] rounded-full text-[#0B2114] mt-0.5 border border-[#E6DFD5]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Call AIRO Concierge</h4>
                  <p className="text-sm font-semibold hover:text-[#0B2114]/70 transition-colors">
                    {details.phone}
                  </p>
                  <p className="text-xs text-[#0B2114]/60 mt-0.5">Toll-free across North America</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-[#F5EFEB] rounded-full text-[#0B2114] mt-0.5 border border-[#E6DFD5]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Email Inquiry</h4>
                  <p className="text-sm font-semibold hover:text-[#0B2114]/70 transition-colors">
                    {details.email}
                  </p>
                  <p className="text-xs text-[#0B2114]/60 mt-0.5">Our response standard is within 3 business hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-[#F5EFEB] rounded-full text-[#0B2114] mt-0.5 border border-[#E6DFD5]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Flagship Location</h4>
                  <p className="text-sm font-semibold">
                    {details.address}
                  </p>
                  <p className="text-xs text-[#0B2114]/60 mt-0.5">Integrated clinic, laboratory, and pharmacy center</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-[#F5EFEB] rounded-full text-[#0B2114] mt-0.5 border border-[#E6DFD5]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Service Hours</h4>
                  <p className="text-sm font-medium">Monday &ndash; Friday: 8:00 AM &ndash; 8:00 PM</p>
                  <p className="text-sm font-medium">Saturday &ndash; Sunday: 9:00 AM &ndash; 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Care Info Card */}
          <div className="bg-[#0B2114] text-[#FAF8F5] p-8 rounded-2xl relative overflow-hidden shadow-lg border border-[#1A3324]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF8F5]/5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
            <Sparkles className="w-8 h-8 text-[#D4AF37] mb-5 animate-pulse" />
            <h3 className="font-serif text-xl mb-3 tracking-wide">Rapid Health Screening</h3>
            <p className="text-xs text-[#FAF8F5]/80 leading-relaxed mb-4">
              Our flagship wellness assessment starts with the 5-Minute Health Chair Scan. Capture real-time vitals, ECG, SpO2, and key physiological biomarkers to kickstart your personalized medical programs.
            </p>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Available walk-in at all sites
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form / Success state */}
        <div className="lg:col-span-7 bg-[#F5EFEB] border border-[#E6DFD5] rounded-3xl p-8 md:p-10 shadow-sm relative">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-2xl mb-2 tracking-wide">Submit Inquiry</h3>
                  <p className="text-xs text-[#0B2114]/65">Provide your information below and our coordinators will guide you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B2114] transition-all text-[#0B2114]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B2114] transition-all text-[#0B2114]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B2114] transition-all text-[#0B2114]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">
                      Inquiry Focus *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B2114] transition-all text-[#0B2114] appearance-none cursor-pointer"
                    >
                      <option value="General Inquiry">General Consultation & Wellness</option>
                      <option value="Health Chair assessment">5-Minute Health Chair Assessment</option>
                      <option value="Advanced Lab Testing">Advanced Diagnostics & Labs</option>
                      <option value="Clinic consultation">Minute Clinic Medical Care</option>
                      <option value="Pharmacy & Compounding">Prescription & Custom Compounding</option>
                      <option value="IV Therapy scheduling">AIRO IV Vitamin Infusions</option>
                      <option value="Grocery / Essentials products">AIRO Essentials Organic Retail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">
                      How Can We Help You? *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please detail your wellness goals or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B2114] transition-all text-[#0B2114] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0B2114] hover:bg-[#0B2114]/90 text-[#FAF8F5] rounded-xl py-3.5 px-6 font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Consultation Request</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-16 h-16 bg-[#0B2114] text-[#FAF8F5] rounded-full flex items-center justify-center border border-[#1A3324] shadow-md">
                  <Check className="w-8 h-8" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-serif text-3xl text-[#0B2114] tracking-wide">Inquiry Logged</h3>
                  <p className="text-[#0B2114]/80 text-sm max-w-md leading-relaxed">
                    Thank you. Your consultation request has been routed to our wellness concierge desk. An AIRO coordinator will contact you by email or phone shortly.
                  </p>
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#0B2114] hover:bg-[#0B2114]/90 text-[#FAF8F5] font-medium text-xs px-6 py-2.5 rounded-full transition-all border border-[#1A3324] active:scale-95"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-[#0B2114] text-[#FAF8F5] py-12 px-6 md:px-12 border-t border-[#1A3324]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <span className="font-serif text-xl tracking-widest uppercase text-[#FAF8F5]">AIRO.</span>
            <span className="text-[10px] text-[#FAF8F5]/50 tracking-wider">PREVENTIVE LONGEVITY ECOSYSTEM</span>
          </div>
          <p className="text-[10px] text-[#FAF8F5]/45 text-center md:text-right max-w-sm leading-relaxed">
            &copy; 2026 AIRO Health. All rights reserved. Clinical treatments, compounding services, and physical programs are subject to practitioner assessment.
          </p>
        </div>
      </footer>
    </div>
  );
}
