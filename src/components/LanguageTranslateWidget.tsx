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
    
    // 1. Set the Google Translate cookie manually
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
    
    // 2. Try to trigger the hidden native Google select
    const googleSelectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (googleSelectElement) {
      googleSelectElement.value = lang;
      // Must use bubbles: true for Google's event listeners to catch it
      googleSelectElement.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // We do not force a reload here, as Google Translate should handle the DOM mutation natively.
  };

  return (
    <div className="flex items-center">
      {/* 
        This is the container where Google will inject its ugly iframe and UI. 
        We hide it entirely using CSS below, and use our own custom UI instead.
      */}
      <div id="google_translate_element" style={{ position: "absolute", left: "-9999px", opacity: 0, zIndex: -1 }}></div>
      <Script 
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      {/* Our Custom, Beautiful UI */}
      <div className="relative flex items-center bg-[#597467]/80 border border-[#7C9A8E] rounded-full overflow-hidden hover:border-[#E6AFA3]/50 transition-colors">
        <div className="pl-3 pr-1 text-[#E6AFA3] pointer-events-none flex items-center">
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
            <path d="M1 1L4 4L7 1" stroke="#E6AFA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Global styles to absolutely crush any remaining Google Translate UI artifacts */}
      <style jsx global>{`
        /* Hide the top banner */
        .goog-te-banner-frame.skiptranslate, 
        .goog-te-banner-frame {
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
        } 
        /* Prevent body from shifting down when Google tries to show the banner */
        body {
            top: 0px !important; 
        }
        /* Hide the Google tooltips that appear when hovering over translated text */
        #goog-gt-tt, 
        .goog-te-balloon-frame {
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        /* Hide the main widget container */
        .skiptranslate > iframe.goog-te-banner-frame {
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        /* Force the native Google Translate element completely off-screen */
        #google_translate_element,
        .goog-te-gadget {
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          width: 1px !important;
          height: 1px !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
      `}</style>
    </div>
  );
}
