"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode } from 'lucide-react';

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.airocustomer.app";
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "https://apps.apple.com/search?term=airo+customer";

// Apple Design Spring (Critically damped)
const springDefault = {
  type: 'spring',
  damping: 20, 
  stiffness: 100, 
};

export function GlobalFooter() {
  const [brandName, setBrandName] = useState("AIRO Health");
  const [supportEmail, setSupportEmail] = useState("info@airohealthhub.com");
  const [activeStore, setActiveStore] = useState<"playstore" | "appstore">("playstore");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      // Default to AIRO Health unless the hostname contains 'essential'
      if (host.includes("airoessential") || host.includes("essentials.airo")) {
        setBrandName("AIRO Essentials");
        setSupportEmail("info@airoessentials.com");
      }
    }
  }, []);

  return (
    <footer className="border-t border-theme/10 py-16 px-8 md:px-16 bg-theme text-paper rounded-t-[3rem] w-full mt-auto">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12">

        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="font-serif text-3xl tracking-[0.2em] uppercase mb-6 text-paper">
            AIRO<span className="opacity-50">.</span>
          </h2>
          <p className="text-xs text-paper/60 leading-relaxed mb-8 max-w-xs pr-4 tracking-wide">
            A paradigm shift in modern longevity. Elevating daily essentials and wellness with uncompromising quality and clean ingredients.
          </p>
          <div className="flex gap-4 text-paper/50">
            <motion.a 
              whileTap={{ scale: 0.95 }}
              transition={springDefault}
              className="cursor-pointer hover:text-paper transition-colors text-xs tracking-[0.15em] uppercase font-bold"
            >
              Instagram
            </motion.a>
            <motion.a 
              whileTap={{ scale: 0.95 }}
              transition={springDefault}
              className="cursor-pointer hover:text-paper transition-colors text-xs tracking-[0.15em] uppercase font-bold"
            >
              Twitter
            </motion.a>
          </div>
        </div>

        {/* Ecosystem Portals */}
        <div>
          <h3 className="font-sans text-[10px] font-bold mb-6 text-paper/40 tracking-[0.2em] uppercase">
            Ecosystem Portals
          </h3>
          <ul className="space-y-4 text-xs text-paper/80 font-medium">
            <li>
              <Link href="/grocery" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Essentials
                </motion.span>
              </Link>
            </li>
            <li>
              <Link href="/pharmacy" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Pharmacy Portal
                </motion.span>
              </Link>
            </li>
            <li>
              <Link href="/minute-clinic" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Minute Clinic
                </motion.span>
              </Link>
            </li>
            <li>
              <Link href="/blog" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Journal & Insights
                </motion.span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-sans text-[10px] font-bold mb-6 text-paper/40 tracking-[0.2em] uppercase">
            Support
          </h3>
          <ul className="space-y-4 text-xs text-paper/80 font-medium">
            <li>
              <motion.a 
                whileTap={{ scale: 0.96 }}
                transition={springDefault}
                href={`mailto:${supportEmail}`} 
                className="inline-block hover:text-paper transition-colors"
              >
                {supportEmail}
              </motion.a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-sans text-[10px] font-bold mb-6 text-paper/40 tracking-[0.2em] uppercase">
            Legal
          </h3>
          <ul className="space-y-4 text-xs text-paper/80 font-medium">
            <li>
              <Link href="/privacy-policy" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Privacy Policy
                </motion.span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Terms of Service
                </motion.span>
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Refund Policy
                </motion.span>
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="inline-block">
                <motion.span 
                  whileTap={{ scale: 0.96 }}
                  transition={springDefault}
                  className="block hover:text-paper transition-colors"
                >
                  Shipping Policy
                </motion.span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile App & QR Code Column */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <h3 className="font-sans text-[10px] font-bold mb-6 text-paper/40 tracking-[0.2em] uppercase">
            Get The App
          </h3>
          <p className="text-xs text-paper/70 leading-relaxed mb-4">
            Scan with your camera or tap below to download directly for Android &amp; iOS.
          </p>

          <div className="bg-paper/5 border border-paper/10 rounded-2xl p-3.5 backdrop-blur-md">
            {/* Store Toggle */}
            <div className="flex rounded-lg bg-black/30 p-1 mb-3">
              <button
                type="button"
                onClick={() => setActiveStore('playstore')}
                className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
                  activeStore === 'playstore' 
                    ? 'bg-paper text-theme shadow-sm' 
                    : 'text-paper/60 hover:text-paper'
                }`}
              >
                Google Play
              </button>
              <button
                type="button"
                onClick={() => setActiveStore('appstore')}
                className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
                  activeStore === 'appstore' 
                    ? 'bg-paper text-theme shadow-sm' 
                    : 'text-paper/60 hover:text-paper'
                }`}
              >
                App Store
              </button>
            </div>

            {/* Scannable QR Code */}
            <div 
              onClick={() => setIsQrModalOpen(true)}
              className="p-2 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer group hover:ring-2 hover:ring-white/40 transition-all shadow-md"
              title="Click to enlarge QR code"
            >
              <img
                src={activeStore === 'playstore' ? '/images/google-play-qr.jpg' : '/images/qr-appstore.png'}
                alt={activeStore === 'playstore' ? 'Google Play Store QR Code' : 'Apple App Store QR Code'}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded"
              />
              <span className="text-[9px] font-bold text-gray-700 mt-1 uppercase tracking-wider group-hover:text-black">
                Tap to Enlarge QR
              </span>
            </div>

            {/* Store Download Buttons */}
            <div className="flex flex-col gap-2 mt-3">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-85 transition-opacity"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-8 w-auto mx-auto"
                />
              </a>

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-85 transition-opacity"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  className="h-8 w-auto mx-auto"
                />
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-paper/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-paper/30 text-[10px] tracking-[0.15em] uppercase font-bold">
          © {new Date().getFullYear()} {brandName}. All Rights Reserved.
        </p>
        <div className="flex-shrink-0 mt-4 md:mt-0 opacity-80 hover:opacity-100 transition-opacity">
          <iframe
            title="DUNS Registered Seal"
            src="https://dunsregistered.dnb.com/SealAuthentication.aspx?Cid=1"
            width="114"
            height="97"
            frameBorder="0"
            scrolling="no"
            style={{ border: "none" }}
          />
        </div>
      </div>

      {/* QR Code Enlarged Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-gray-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100"
            >
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close QR Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-extrabold font-serif mb-1 text-gray-900">
                Scan with Phone Camera
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Point your smartphone camera to be taken directly to the {activeStore === 'playstore' ? 'Google Play Store' : 'Apple App Store'}.
              </p>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block shadow-inner mb-6">
                <img
                  src={activeStore === 'playstore' ? '/images/google-play-qr.jpg' : '/images/qr-appstore.png'}
                  alt="AIRO App QR Code"
                  className="w-56 h-56 object-contain rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-center mb-4">
                <button
                  type="button"
                  onClick={() => setActiveStore('playstore')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    activeStore === 'playstore' ? 'bg-[#006537] text-white shadow' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Google Play
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStore('appstore')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    activeStore === 'appstore' ? 'bg-[#111827] text-white shadow' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  App Store
                </button>
              </div>

              <a
                href={activeStore === 'playstore' ? PLAY_STORE_URL : APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-[#006537] hover:underline"
              >
                Direct Link &rarr;
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
