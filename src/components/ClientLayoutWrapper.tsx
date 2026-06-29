"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Preloader } from "./Preloader";
import { GlobalHeader } from "./GlobalHeader";
import { AiraChatbot } from "./AiraChatbot";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { CmsProvider, CmsDataType } from "@/context/CmsContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CookieBanner } from "./CookieBanner";

interface LocationData {
  city: string;
  country: string;
  region: string;
  ip: string;
}

interface HistoryEntry {
  path: string;
  timestamp: string;
}

interface AnalyticsData {
  pageViews: Record<string, number>;
  history: HistoryEntry[];
  visitorLocation: LocationData | null;
}

export function ClientLayoutWrapper({ 
  children,
  cmsData
}: { 
  children: React.ReactNode;
  cmsData: CmsDataType;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Prevent scrolling while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [loading]);

  // Track page views globally in Firebase
  useEffect(() => {
    if (typeof window === "undefined") return;

    // We don't want to track admin dashboard views
    if (pathname.startsWith('/admin')) return;

    const logEvent = async () => {
      // 1. Get location if we have it
      const existingAnalyticsStr = localStorage.getItem("airo_analytics");
      let location = null;
      try {
        const analytics = existingAnalyticsStr ? JSON.parse(existingAnalyticsStr) : {};
        location = analytics.visitorLocation || null;
      } catch {
        // ignore
      }

      try {
        await addDoc(collection(db, "analytics_events"), {
          path: pathname,
          timestamp: new Date().toISOString(),
          location: location
        });
      } catch (e) {
        console.warn("Could not log analytics", e);
      }
    };
    
    logEvent();
  }, [pathname]);

  // Fetch real geolocation on first load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchLocation = async () => {
      try {
        const existingAnalyticsStr = localStorage.getItem("airo_analytics");
        let analytics: Partial<AnalyticsData> = {};
        try {
          analytics = existingAnalyticsStr ? JSON.parse(existingAnalyticsStr) : {};
        } catch {
          analytics = {};
        }
        
        // Only fetch if location is not already set
        if (!analytics.visitorLocation) {
          const res = await fetch("https://ipapi.co/json/");
          if (res.ok) {
            const data = await res.json();
            analytics.visitorLocation = {
              city: data.city || "Unknown City",
              country: data.country_name || "Unknown Country",
              region: data.region || "",
              ip: data.ip || ""
            };
            localStorage.setItem("airo_analytics", JSON.stringify(analytics));
          }
        }
      } catch (err) {
        console.warn("Could not geolocate IP address", err);
      }
    };

    fetchLocation();
  }, []);

  // Set dynamic favicon based on domain
  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    const port = window.location.port;
    const isHealth = host.includes("airohealth") || host.includes("health.airo") || port === "3001";
    
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = isHealth ? '/airo-health-favicon.png' : '/airo-essentials-favicon.png';
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <AuthProvider>
        <CartProvider>
          <CmsProvider initialData={cmsData}>
            {/* Hide content until loading is done to prevent flash */}
            <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <GlobalHeader />
              <main className={`flex-grow ${pathname === '/' || pathname === '/health' ? '' : 'pt-28'}`}>
                {children}
              </main>
              <AiraChatbot />
              <CookieBanner />
            </div>
          </CmsProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}
