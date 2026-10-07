"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  QrCode, 
  Download, 
  ShieldCheck, 
  HeartPulse, 
  Zap, 
  Award, 
  ExternalLink,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.airocustomer.app";
// Apple App Store link - falls back to search/store portal if custom link not yet set in environment
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "https://apps.apple.com/search?term=airo+customer";

export default function DownloadAppPage() {
  const [selectedStore, setSelectedStore] = useState<"android" | "ios">("android");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
      const isAndroid = /android/i.test(ua);
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;

      if (isAndroid) {
        setIsMobileDevice(true);
        setSelectedStore("android");
        // If arrived via QR scan or direct link, prompt/redirect to Play Store
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("auto") === "1" || searchParams.get("ref") === "qr") {
          setRedirectingTo("Google Play Store");
          setTimeout(() => {
            window.location.href = PLAY_STORE_URL;
          }, 800);
        }
      } else if (isIOS) {
        setIsMobileDevice(true);
        setSelectedStore("ios");
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("auto") === "1" || searchParams.get("ref") === "qr") {
          setRedirectingTo("Apple App Store");
          setTimeout(() => {
            window.location.href = APP_STORE_URL;
          }, 800);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1D1D1F] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#006537] selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Mobile Automatic Redirect Banner */}
        {redirectingTo && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-[#006537]" />
              <p className="text-sm font-semibold text-[#006537]">
                Redirecting you to the {redirectingTo}...
              </p>
            </div>
            <a 
              href={redirectingTo.includes("Google") ? PLAY_STORE_URL : APP_STORE_URL}
              className="text-xs font-bold text-emerald-800 underline flex items-center gap-1"
            >
              Open Now <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 text-[#006537] text-xs font-bold uppercase tracking-widest mb-6">
            <Smartphone className="w-4 h-4" /> Official Mobile App
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight font-serif leading-[1.15]">
            AIRO In Your Pocket.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed font-sans max-w-2xl mx-auto">
            Scan the QR code with your smartphone camera to be taken directly to the Google Play Store or Apple App Store. Experience instantaneous health insights, minute clinic appointments, and 10-minute delivery.
          </p>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] mb-16">
          
          {/* Left: QR Code Interactive Hub */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-[#F9F8F5] to-[#F2EFEA] rounded-3xl border border-gray-200/80 text-center shadow-inner">
            
            {/* Store Toggle Buttons */}
            <div className="inline-flex p-1 bg-white rounded-xl border border-gray-200 shadow-sm mb-6 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setSelectedStore("android")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedStore === "android"
                    ? "bg-[#006537] text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.95 1.95 0 0 1-.61-.925V2.739c.097-.36.31-.692.61-.925zm11.235 11.238l2.257 2.258-12.06 6.942 9.803-9.2zm0-2.104l-9.803-9.2 12.06 6.942-2.257 2.258zm1.096 1.052l3.418-1.966c.86-.495.86-1.303 0-1.798l-3.418-1.966-2.48 2.865 2.48 2.865z" />
                </svg>
                Google Play
              </button>

              <button
                type="button"
                onClick={() => setSelectedStore("ios")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedStore === "ios"
                    ? "bg-[#111827] text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.03.62-2.69 1.39-.58.67-.99 1.74-.96 2.78 1.03.08 2.02-.57 2.64-1.32" />
                </svg>
                App Store
              </button>
            </div>

            {/* Scannable High-Res QR Code Card */}
            <div className="relative p-5 bg-white rounded-2xl shadow-xl border border-gray-200/90 mb-4 group transition-transform hover:scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow">
                Point Camera to Scan
              </div>

              <img 
                src={selectedStore === "android" ? "/images/qr-playstore.png" : "/images/qr-appstore.png"} 
                alt={`${selectedStore === "android" ? "Google Play" : "Apple App Store"} QR Code`}
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
              />

              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500">
                <QrCode className="w-3.5 h-3.5 text-[#006537]" />
                Direct {selectedStore === "android" ? "Android" : "iOS"} Deep Link
              </div>
            </div>

            {/* Direct Mobile Click-Through Button */}
            <div className="w-full max-w-xs mt-2">
              <a
                href={selectedStore === "android" ? PLAY_STORE_URL : APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  selectedStore === "android"
                    ? "bg-[#006537] hover:bg-[#004e2a]"
                    : "bg-[#111827] hover:bg-black"
                }`}
              >
                <Download className="w-4 h-4" />
                {selectedStore === "android" ? "Open Google Play Store" : "Open Apple App Store"}
                <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
              </a>
            </div>

          </div>

          {/* Right: Key App Capabilities */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pl-6">
            
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#006537]">
                Unified Longevity Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif mt-1">
                Everything you need for your daily health and essentials.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006537] flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Praana Health Vitals</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Instantly sync and review your 9 bio-vitals scanned at any AIRO Health Chair.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">10-Minute Delivery</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Order 100% clean-label groceries and prescription medications to your doorstep.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Minute Clinic Booking</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Book in-person doctor visits or virtual teleconsultations with zero waiting time.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Digital AIRO ONE™ Pass</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Access your digital card and barcode for in-store checkout discounts and lounge access.
                  </p>
                </div>
              </div>

            </div>

            {/* Official Store Badges Row */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
              <a 
                href={PLAY_STORE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-12 w-auto"
                />
              </a>

              <a 
                href={APP_STORE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  className="h-12 w-auto"
                />
              </a>

              <span className="text-xs font-semibold text-gray-400">
                Compatible with iOS 15+ &amp; Android 9+
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
