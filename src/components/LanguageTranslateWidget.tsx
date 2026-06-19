/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Globe } from "lucide-react";

export function LanguageTranslateWidget() {
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    // Add this to the window object so the Google Translate script can call it when it loads
    (window as any).googleTranslateElementInit = () => {
      // Only initialize if it hasn't been initialized yet
      if (!(window as any).google?.translate?.TranslateElement) return;
      
      new (window as any).google.translate.TranslateElement(
        { 
          pageLanguage: "en", 
          // Limit to English, Hindi, and Telugu per the user's request
          includedLanguages: "en,hi,te",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        "google_translate_element"
      );
    };

    // Try to sync our custom select state with the Google Translate cookie if it exists
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      setSelectedLang(match[1]);
    }
  }, []);

  // Function to handle language change from our custom dropdown
  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    
    // Find the hidden Google Translate select element
    const googleSelectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    
    if (googleSelectElement) {
      googleSelectElement.value = lang;
      // Dispatch a change event so the Google Translate script notices the change
      googleSelectElement.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className="flex items-center">
      {/* 
        This is the container where Google will inject its ugly iframe and UI. 
        We hide it entirely using CSS below, and use our own custom UI instead.
      */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <Script 
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />

      {/* Our Custom, Beautiful UI */}
      <div className="relative flex items-center bg-[#0B2114]/80 border border-[#1A3324] rounded-full overflow-hidden hover:border-[#D4AF37]/50 transition-colors">
        <div className="pl-3 pr-1 text-[#D4AF37] pointer-events-none flex items-center">
          <Globe className="w-3.5 h-3.5" />
        </div>
        <select
          value={selectedLang}
          onChange={handleLangChange}
          className="appearance-none bg-transparent text-[#FAF8F5] text-[10px] font-bold tracking-widest uppercase pl-1 pr-6 py-2 outline-none cursor-pointer"
        >
          <option value="en" className="bg-[#09120F] text-[#FAF8F5]">ENG</option>
          <option value="hi" className="bg-[#09120F] text-[#FAF8F5]">HINDI</option>
          <option value="te" className="bg-[#09120F] text-[#FAF8F5]">TELUGU</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L4 4L7 1" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Global styles to absolutely crush any remaining Google Translate UI artifacts */}
      <style jsx global>{`
        /* Hide the top banner */
        .goog-te-banner-frame.skiptranslate, 
        .goog-te-banner-frame {
            display: none !important;
        } 
        /* Prevent body from shifting down when Google tries to show the banner */
        body {
            top: 0px !important; 
        }
        /* Hide the Google tooltips that appear when hovering over translated text */
        #goog-gt-tt, 
        .goog-te-balloon-frame {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        /* Hide the main widget container */
        .skiptranslate > iframe.goog-te-banner-frame {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
