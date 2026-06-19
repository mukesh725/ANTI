/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import Script from "next/script";

export function LanguageTranslateWidget() {
  useEffect(() => {
    // We add this to the window object so the Google Translate script can call it when it loads
    (window as any).googleTranslateElementInit = () => {
      // Only initialize if it hasn't been initialized yet
      if (!(window as any).google?.translate?.TranslateElement) return;
      
      new (window as any).google.translate.TranslateElement(
        { 
          pageLanguage: "en", 
          // Limit to English, Hindi, and Telugu per the user's request
          includedLanguages: "en,hi,te",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE 
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div className="flex items-center ml-4">
      <div id="google_translate_element" className="min-h-[30px]"></div>
      <Script 
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />

      {/* Global styles to fix Google Translate's injected UI and match our dark theme */}
      <style jsx global>{`
        /* Hide the top banner */
        .goog-te-banner-frame.skiptranslate {
            display: none !important;
        } 
        body {
            top: 0px !important; 
        }
        
        /* Hide the "Powered by Google Translate" text */
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0px !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        
        /* Style the actual dropdown */
        .goog-te-gadget .goog-te-combo {
          background-color: #07120F !important;
          color: #D4AF37 !important;
          border: 1px solid #1A3324 !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          outline: none !important;
          cursor: pointer;
          margin: 0 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .goog-te-gadget .goog-te-combo:hover {
          border-color: #D4AF37 !important;
        }

        /* Tooltip hide */
        #goog-gt-tt {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
